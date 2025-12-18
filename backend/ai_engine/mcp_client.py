"""
MCP Client for Google Services (Drive + Gmail)

This module provides a unified client for Google Drive and Gmail APIs.
It can be used by the FastAPI backend to fetch files from Drive and emails from Gmail.
"""

import subprocess
import sys
import os
import io
import base64
import json
import re
from typing import Optional, List, Dict, Any

# Import text extraction functions from text_extraction module
from text_extraction import extract_text_by_mimetype


class MCPDriveClient:
    """
    Unified client for Google Drive and Gmail APIs.
    
    This client handles authentication via token.json and provides methods for:
    - Listing and downloading Google Drive files
    - Fetching and extracting email content from Gmail
    """
    
    # Scopes for both Drive and Gmail
    SCOPES = [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send'
    ]
    
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.token_file = os.path.join(self.base_dir, 'token.json')
        self._drive_service = None
        self._gmail_service = None
    
    def reset_service(self):
        """Reset the cached services to force re-authentication with new credentials."""
        self._drive_service = None
        self._gmail_service = None
        print("[MCP Client] Service cache cleared - will use new credentials on next call")
    
    def is_authenticated(self) -> bool:
        """Check if the client has valid authentication."""
        return os.path.exists(self.token_file)
    
    def _get_credentials(self):
        """Get authenticated credentials for Google APIs."""
        from google.oauth2.credentials import Credentials
        from google.auth.transport.requests import Request
        
        if not os.path.exists(self.token_file):
            raise FileNotFoundError("token.json missing. Run OAuth authentication first.")
        
        creds = Credentials.from_authorized_user_file(self.token_file, self.SCOPES)
        
        if not creds.valid:
            if creds.expired and creds.refresh_token:
                creds.refresh(Request())
                # Save refreshed token with ALL scopes preserved
                token_data = {
                    'token': creds.token,
                    'refresh_token': creds.refresh_token,
                    'token_uri': creds.token_uri,
                    'client_id': creds.client_id,
                    'client_secret': creds.client_secret,
                    'scopes': self.SCOPES
                }
                with open(self.token_file, 'w') as token:
                    json.dump(token_data, token)
                print(f"[MCP Client] Token refreshed and saved with scopes: {self.SCOPES}")
            else:
                raise Exception("Token invalid. Please re-authenticate via /auth/google.")
        
        return creds
    
    def _get_drive_service(self):
        """Get authenticated Google Drive service."""
        if self._drive_service:
            return self._drive_service
        
        from googleapiclient.discovery import build
        creds = self._get_credentials()
        self._drive_service = build('drive', 'v3', credentials=creds)
        return self._drive_service
    
    def _get_gmail_service(self):
        """Get authenticated Gmail service."""
        if self._gmail_service:
            return self._gmail_service
        
        from googleapiclient.discovery import build
        creds = self._get_credentials()
        self._gmail_service = build('gmail', 'v1', credentials=creds)
        return self._gmail_service
    
    # ==================== GOOGLE DRIVE METHODS ====================
    
    def list_files(self, query: str = "") -> List[Dict[str, Any]]:
        """
        List files from Google Drive.
        
        Args:
            query: Optional search query to filter files by name
            
        Returns:
            List of file dictionaries with id, name, mimeType, size, modifiedTime
        """
        try:
            service = self._get_drive_service()
            
            if query:
                q = f"name contains '{query}' and trashed = false"
            else:
                q = "trashed = false"
            
            results = service.files().list(
                q=q,
                pageSize=100,
                fields="files(id, name, mimeType, size, modifiedTime)"
            ).execute()
            
            return results.get('files', [])
        except Exception as e:
            print(f"[MCP Client] Error listing files: {e}")
            return []
    
    def download_file_to_stream(self, file_id: str) -> tuple[io.BytesIO, Dict[str, str]]:
        """
        Download a file from Google Drive to a BytesIO stream.
        
        Handles both regular binary files and Google Docs/Sheets/Slides by
        using `files().export_media` for the latter to avoid the
        "Only files with binary content can be downloaded" 403 error.
        
        Args:
            file_id: The Google Drive file ID
            
        Returns:
            Tuple of (file_stream, metadata_dict)
        """
        from googleapiclient.http import MediaIoBaseDownload
        
        service = self._get_drive_service()
        
        # Get file metadata
        file_meta = service.files().get(
            fileId=file_id,
            fields="name, mimeType, size"
        ).execute()
        
        mime_type = file_meta.get('mimeType', 'application/octet-stream')
        
        # Decide whether to use export or direct download
        export_mime = None
        if mime_type == 'application/vnd.google-apps.document':
            # Google Docs -> export as PDF (handled well by our text extractor)
            export_mime = 'application/pdf'
        elif mime_type == 'application/vnd.google-apps.spreadsheet':
            # Google Sheets -> export as Excel
            export_mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        elif mime_type == 'application/vnd.google-apps.presentation':
            # Google Slides -> export as PowerPoint
            export_mime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        
        if export_mime:
            request = service.files().export_media(fileId=file_id, mimeType=export_mime)
            # Override mimeType so downstream text extraction knows the real type
            file_meta['mimeType'] = export_mime
        else:
            request = service.files().get_media(fileId=file_id)
        
        file_stream = io.BytesIO()
        downloader = MediaIoBaseDownload(file_stream, request)
        
        done = False
        while not done:
            _, done = downloader.next_chunk()
        
        file_stream.seek(0)
        return file_stream, file_meta
    
    def download_file_to_path(self, file_id: str, save_dir: str) -> str:
        """
        Download a file from Google Drive and save to disk.
        
        Args:
            file_id: The Google Drive file ID
            save_dir: Directory to save the file
            
        Returns:
            Path to the saved file
        """
        from pathlib import Path
        
        file_stream, file_meta = self.download_file_to_stream(file_id)
        file_name = file_meta.get('name', f'file_{file_id}')
        mime_type = file_meta.get('mimeType', 'application/octet-stream')
        
        # Determine file extension
        file_ext = Path(file_name).suffix.lower()
        if not file_ext:
            mime_to_ext = {
                'application/pdf': '.pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
                'text/plain': '.txt',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
                'application/vnd.ms-excel': '.xls',
                'image/jpeg': '.jpg',
                'image/png': '.png',
            }
            file_ext = mime_to_ext.get(mime_type, '.bin')
        
        # Create safe filename
        safe_filename = re.sub(r'[^\w\s-]', '', file_name).strip()
        safe_filename = re.sub(r'[-\s]+', '-', safe_filename)
        if not safe_filename:
            safe_filename = f"file_{file_id}"
        
        # Ensure directory exists
        os.makedirs(save_dir, exist_ok=True)
        
        # Save file
        save_path = os.path.join(save_dir, f"{safe_filename}{file_ext}")
        with open(save_path, 'wb') as f:
            f.write(file_stream.read())
        
        return save_path
    
    def extract_text_from_file(self, file_id: str) -> tuple[str, Dict[str, str]]:
        """
        Download a file and extract its text content.
        
        Args:
            file_id: The Google Drive file ID
            
        Returns:
            Tuple of (extracted_text, file_metadata)
        """
        file_stream, file_meta = self.download_file_to_stream(file_id)
        mime_type = file_meta.get('mimeType', 'application/octet-stream')
        file_name = file_meta.get('name', 'unknown')
        
        # Extract text using the google_drive module
        extracted_text = extract_text_by_mimetype(file_stream, mime_type, file_name)
        
        return extracted_text, file_meta
    
    def get_all_files_with_content(self, save_dir: str) -> List[Dict[str, Any]]:
        """
        Get all files from Google Drive, download them, and extract text.
        
        This is the main method used by the RAG system to ingest Drive content.
        
        Args:
            save_dir: Directory to save downloaded files
            
        Returns:
            List of dicts with file info, path, and extracted text
        """
        files = self.list_files()
        results = []
        
        for file in files:
            file_id = file['id']
            file_name = file['name']
            mime_type = file['mimeType']
            
            # Skip folders
            if mime_type == 'application/vnd.google-apps.folder':
                continue
            
            try:
                # Download file to disk
                save_path = self.download_file_to_path(file_id, save_dir)
                
                # Get file stream for text extraction
                file_stream, _ = self.download_file_to_stream(file_id)
                extracted_text = extract_text_by_mimetype(file_stream, mime_type, file_name)
                
                # Format size
                size = file.get('size', '0')
                if size and str(size).isdigit():
                    size_mb = f"{int(size) / (1024*1024):.2f} MB"
                else:
                    size_mb = "Unknown"
                
                results.append({
                    'id': file_id,
                    'name': file_name,
                    'type': mime_type,
                    'size': size_mb,
                    'modified': file.get('modifiedTime'),
                    'path': save_path,
                    'extractedText': extracted_text[:500] + "..." if len(extracted_text) > 500 else extracted_text,
                    'fullText': extracted_text,
                })
                
            except Exception as e:
                print(f"[MCP Client] Error processing {file_name}: {e}")
                results.append({
                    'id': file_id,
                    'name': file_name,
                    'type': mime_type,
                    'size': 'Unknown',
                    'extractedText': f"Error processing file: {str(e)}",
                    'error': True
                })
        
        return results
    
    # ==================== GMAIL METHODS ====================
    
    def _decode_base64(self, data: str) -> str:
        """Decode base64url encoded data."""
        try:
            # Add padding if needed
            padding = 4 - len(data) % 4
            if padding != 4:
                data += '=' * padding
            decoded = base64.urlsafe_b64decode(data)
            return decoded.decode('utf-8', errors='ignore')
        except Exception as e:
            print(f"[MCP Client] Error decoding base64: {e}")
            return ""
    
    def _strip_html_tags(self, html: str) -> str:
        """Remove HTML tags and clean up the text to get pure content."""
        import html as html_lib
        
        # Remove DOCTYPE
        html = re.sub(r'<!DOCTYPE[^>]*>', '', html, flags=re.IGNORECASE)
        # Remove style tags with their content
        html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL | re.IGNORECASE)
        # Remove script tags with their content
        html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
        # Remove head section
        html = re.sub(r'<head[^>]*>.*?</head>', '', html, flags=re.DOTALL | re.IGNORECASE)
        # Remove comments
        html = re.sub(r'<!--.*?-->', '', html, flags=re.DOTALL)
        # Remove meta/link/img/input/button tags
        html = re.sub(r'<(meta|link|img|input|button|source|track)[^>]*/?>',  '', html, flags=re.IGNORECASE)
        
        # Replace common block elements with newlines for better formatting
        html = re.sub(r'<(br|p|div|tr|li|h[1-6]|td|th|section|article|header|footer)[^>]*/?>',  '\n', html, flags=re.IGNORECASE)
        html = re.sub(r'</(p|div|tr|li|h[1-6]|td|th|table|section|article|header|footer)>', '\n', html, flags=re.IGNORECASE)
        
        # Remove all remaining HTML tags
        clean = re.sub(r'<[^>]+>', ' ', html)
        
        # Decode HTML entities (like &nbsp; &amp; etc.)
        clean = html_lib.unescape(clean)
        
        # Remove URLs - various formats
        clean = re.sub(r'https?://\S+', '', clean)  # Standard URLs
        clean = re.sub(r'\(https?://[^\)]+\)', '', clean)  # URLs in parentheses
        clean = re.sub(r'<https?://[^>]+>', '', clean)  # URLs in angle brackets
        
        # Remove markdown-style links like [text](url)
        clean = re.sub(r'\[[^\]]*\]\([^\)]+\)', '', clean)
        
        # Remove image placeholders like [image: text]
        clean = re.sub(r'\[image:[^\]]*\]', '', clean, flags=re.IGNORECASE)
        
        # Remove tracking pixel placeholders and empty brackets
        clean = re.sub(r'\[\s*\]', '', clean)
        clean = re.sub(r'\(\s*\)', '', clean)
        
        # Clean up excessive whitespace
        clean = re.sub(r'[ \t]+', ' ', clean)  # Multiple spaces/tabs to single space
        clean = re.sub(r'\n[ \t]+', '\n', clean)  # Spaces after newlines
        clean = re.sub(r'[ \t]+\n', '\n', clean)  # Spaces before newlines
        clean = re.sub(r'\n{3,}', '\n\n', clean)  # Multiple newlines to double newline
        clean = re.sub(r'^\s+', '', clean, flags=re.MULTILINE)  # Leading whitespace on lines
        
        return clean.strip()
    
    def _extract_email_body(self, payload: dict) -> str:
        """
        Extract the email body from the payload.
        Handles both plain text and multipart messages.
        Always returns clean text without HTML.
        """
        plain_text_body = ""
        html_body = ""
        
        # Check the main payload's mimeType
        main_mime_type = payload.get('mimeType', '')
        
        # Check if the payload has a body with data
        if 'body' in payload and 'data' in payload['body']:
            content = self._decode_base64(payload['body']['data'])
            if 'text/plain' in main_mime_type:
                plain_text_body = content
            elif 'text/html' in main_mime_type:
                html_body = content
            else:
                # Unknown type - check if it looks like HTML
                if content.strip().startswith('<!DOCTYPE') or content.strip().startswith('<html'):
                    html_body = content
                else:
                    plain_text_body = content
        
        # Handle multipart messages - look for text parts
        if 'parts' in payload:
            for part in payload['parts']:
                mime_type = part.get('mimeType', '')
                
                # Get plain text content
                if mime_type == 'text/plain':
                    if 'body' in part and 'data' in part['body']:
                        plain_text_body = self._decode_base64(part['body']['data'])
                
                # Get HTML content as fallback
                elif mime_type == 'text/html':
                    if 'body' in part and 'data' in part['body']:
                        html_body = self._decode_base64(part['body']['data'])
                
                # Handle multipart/alternative or multipart/mixed
                elif 'multipart' in mime_type and 'parts' in part:
                    nested_body = self._extract_email_body(part)
                    if nested_body:
                        # Check if it's HTML or plain text
                        if nested_body.strip().startswith('<!DOCTYPE') or nested_body.strip().startswith('<html'):
                            if not html_body:
                                html_body = nested_body
                        else:
                            if not plain_text_body:
                                plain_text_body = nested_body
                
                # Recursively check nested parts
                elif 'parts' in part:
                    nested_body = self._extract_email_body(part)
                    if nested_body and not plain_text_body:
                        plain_text_body = nested_body
        
        # Prefer plain text, fall back to cleaned HTML
        if plain_text_body:
            body = plain_text_body
        elif html_body:
            body = self._strip_html_tags(html_body)
        else:
            body = ""
        
        # Final safety check - if body still contains HTML, strip it
        if body and ('<' in body and '>' in body):
            if body.strip().startswith('<!DOCTYPE') or body.strip().startswith('<html') or '</' in body:
                body = self._strip_html_tags(body)
        
        return body.strip()
    
    def _get_header_value(self, headers: list, name: str) -> str:
        """Get a specific header value from the headers list."""
        for header in headers:
            if header.get('name', '').lower() == name.lower():
                return header.get('value', '')
        return ''
    
    def fetch_latest_emails(self, max_results: int = 5) -> List[Dict[str, Any]]:
        """
        Fetch the latest emails from the user's inbox.
        
        Args:
            max_results: Maximum number of emails to fetch (default: 5)
            
        Returns:
            List of email dictionaries with id, subject, from, to, date, body, snippet
        """
        try:
            service = self._get_gmail_service()
            
            # List messages from inbox
            results = service.users().messages().list(
                userId='me',
                labelIds=['INBOX'],
                maxResults=max_results
            ).execute()
            
            messages = results.get('messages', [])
            
            if not messages:
                print("[MCP Client] No emails found in inbox")
                return []
            
            emails = []
            for msg_ref in messages:
                try:
                    # Get the full message
                    msg = service.users().messages().get(
                        userId='me',
                        id=msg_ref['id'],
                        format='full'
                    ).execute()
                    
                    payload = msg.get('payload', {})
                    headers = payload.get('headers', [])
                    
                    # Extract email details - From, To, Date, Subject
                    subject = self._get_header_value(headers, 'Subject')
                    sender = self._get_header_value(headers, 'From')
                    receiver = self._get_header_value(headers, 'To')
                    date = self._get_header_value(headers, 'Date')
                    
                    # Extract body (clean text, no HTML)
                    body = self._extract_email_body(payload)
                    
                    # Use snippet as fallback if body extraction fails
                    snippet = msg.get('snippet', '')
                    if not body:
                        body = snippet
                    
                    # Get Message-ID header for threading
                    message_id_header = self._get_header_value(headers, 'Message-ID') or self._get_header_value(headers, 'Message-Id')
                    
                    email_data = {
                        'id': msg_ref['id'],
                        'subject': subject or '(No Subject)',
                        'from': sender or 'Unknown Sender',
                        'to': receiver or 'Unknown Receiver',
                        'date': date or 'Unknown Date',
                        'body': body,
                        'snippet': snippet,
                        'labelIds': msg.get('labelIds', []),
                        'threadId': msg.get('threadId'),  # Gmail thread ID
                        'messageId': message_id_header  # Email Message-ID header for In-Reply-To
                    }
                    
                    emails.append(email_data)
                    
                    # Print extracted email content for debugging
                    print(f"\n{'='*70}")
                    print(f"[MCP Client] EMAIL EXTRACTED:")
                    print(f"  From:    {sender}")
                    print(f"  To:      {receiver}")
                    print(f"  Date:    {date}")
                    print(f"  Subject: {subject}")
                    print(f"  Body length: {len(body)} chars")
                    print(f"  {'-'*60}")
                    print(f"  BODY CONTENT:")
                    print(f"  {'-'*60}")
                    # Show full body or first 1000 chars for preview
                    body_preview = body[:1000].replace('\n', '\n  ')
                    print(f"  {body_preview}")
                    if len(body) > 1000:
                        print(f"\n  ... [truncated, {len(body) - 1000} more chars]")
                    print(f"{'='*70}\n")
                    
                except Exception as e:
                    print(f"[MCP Client] Error fetching email {msg_ref['id']}: {e}")
                    continue
            
            print(f"[MCP Client] Successfully fetched {len(emails)} emails")
            return emails
            
        except Exception as e:
            print(f"[MCP Client] Error fetching emails: {e}")
            return []
    
    def get_emails_for_rag(self, max_results: int = 5, max_body_chars: int = 5000) -> List[Dict[str, Any]]:
        """
        Fetch emails and format them for the RAG system.
        
        Args:
            max_results: Maximum number of emails to fetch
            max_body_chars: Maximum characters to extract from email body (default: 5000)
                           This prevents large newsletters from creating too many chunks.
            
        Returns:
            List of dictionaries with email content formatted for RAG ingestion
        """
        emails = self.fetch_latest_emails(max_results)
        
        rag_emails = []
        for email in emails:
            # Truncate body if too long (prevents huge newsletters from creating too many chunks)
            body = email['body']
            if len(body) > max_body_chars:
                body = body[:max_body_chars] + "\n\n[Email content truncated...]"
                print(f"[MCP Client] Truncated large email body for '{email['subject'][:30]}...' ({len(email['body'])} -> {max_body_chars} chars)")
            
            # Create a formatted text representation of the email
            formatted_content = f"""
Email Subject: {email['subject']}
From: {email['from']}
To: {email['to']}
Date: {email['date']}

Content:
{body}
"""
            rag_emails.append({
                'id': email['id'],
                'subject': email['subject'],
                'from': email['from'],
                'to': email['to'],
                'date': email['date'],
                'content': formatted_content.strip(),
                'extractedText': email['body'][:500] + "..." if len(email['body']) > 500 else email['body'],
                'fullText': formatted_content.strip()
            })
        
        return rag_emails

    def send_email(self, to: str, subject: str, body: str, cc: Optional[str] = None, 
                   thread_id: Optional[str] = None, message_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Send an email via Gmail API, optionally as a reply in a thread.
        
        Args:
            to: Recipient email address
            subject: Email subject
            body: Email body content
            cc: Optional CC recipients
            thread_id: Gmail thread ID to reply in the same thread
            message_id: Original message ID for In-Reply-To header
            
        Returns:
            Dict with success status and message details
        """
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        try:
            service = self._get_gmail_service()
            
            message = MIMEMultipart()
            message['to'] = to
            message['subject'] = subject
            if cc:
                message['cc'] = cc
            
            # Add reply headers if this is a reply
            if message_id:
                message['In-Reply-To'] = message_id
                message['References'] = message_id
            
            message.attach(MIMEText(body, 'plain'))
            
            # Encode the message
            raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
            
            # Build send body
            send_body = {'raw': raw_message}
            
            # Add thread ID if replying in a thread
            if thread_id:
                send_body['threadId'] = thread_id
            
            # Send
            sent_message = service.users().messages().send(
                userId='me',
                body=send_body
            ).execute()
            
            print(f"[MCP Client] Email sent successfully: {sent_message.get('id')}, Thread: {sent_message.get('threadId')}")
            return {"success": True, "message_id": sent_message.get('id'), "thread_id": sent_message.get('threadId')}
            
        except Exception as e:
            print(f"[MCP Client] Error sending email: {e}")
            return {"success": False, "error": str(e)}


# Singleton instance
_mcp_client = None

def get_mcp_client() -> MCPDriveClient:
    """Get the singleton MCP client instance."""
    global _mcp_client
    if _mcp_client is None:
        _mcp_client = MCPDriveClient()
    return _mcp_client
