"""
Google Drive MCP Server

This MCP server provides tools for interacting with Google Drive:
- list_files: Search for files in Google Drive
- download_file: Download a file from Google Drive
"""

import os
import io
import sys
from mcp.server.fastmcp import FastMCP
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from google.auth.transport.requests import Request

# Setup Server
mcp = FastMCP("GDrive Manager")

# paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOKEN_FILE = os.path.join(BASE_DIR, 'token.json')
# Force download path to user Downloads folder
DOWNLOAD_DIR = os.path.join(os.path.expanduser("~"), "Downloads", "Google_mcp")
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

# Ensure download directory exists
os.makedirs(DOWNLOAD_DIR, exist_ok=True)


def get_service():
    """Get authenticated Google Drive service."""
    if not os.path.exists(TOKEN_FILE):
        raise FileNotFoundError("token.json missing. Run setup_auth.py first.")
    
    creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    
    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())
            with open(TOKEN_FILE, 'w') as token:
                token.write(creds.to_json())
        else:
            raise Exception("Token invalid. Please re-run setup_auth.py.")
            
    return build('drive', 'v3', credentials=creds)


@mcp.tool()
def list_files(query: str) -> str:
    """Search Google Drive. Query is the file name."""
    try:
        service = get_service()
        results = service.files().list(
            q=f"name contains '{query}' and trashed = false",
            pageSize=10, 
            fields="files(id, name, mimeType)"
        ).execute()
        files = results.get('files', [])
        return "\n".join([f"- {f['name']} (ID: {f['id']}, Type: {f['mimeType']})" for f in files]) if files else "No files found."
    except Exception as e:
        return f"Error: {str(e)}"


@mcp.tool()
def list_all_files() -> str:
    """List all files in Google Drive (up to 100 files)."""
    try:
        service = get_service()
        results = service.files().list(
            q="trashed = false",
            pageSize=100,
            fields="files(id, name, mimeType, size, modifiedTime)"
        ).execute()
        files = results.get('files', [])
        if not files:
            return "No files found in Google Drive."
        
        output = []
        for f in files:
            size = f.get('size', 'N/A')
            if size != 'N/A':
                size_mb = f"{int(size) / (1024*1024):.2f} MB"
            else:
                size_mb = 'N/A'
            output.append(f"- {f['name']} (ID: {f['id']}, Type: {f['mimeType']}, Size: {size_mb})")
        return "\n".join(output)
    except Exception as e:
        return f"Error: {str(e)}"


@mcp.tool()
def download_file(file_id: str, file_name: str) -> str:
    """Download a file. It will be saved to your Downloads folder."""
    try:
        service = get_service()
        request = service.files().get_media(fileId=file_id)
        
        # Save to the Downloads folder
        save_path = os.path.join(DOWNLOAD_DIR, file_name)
        
        with io.FileIO(save_path, 'wb') as fh:
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            while not done:
                _, done = downloader.next_chunk()
            
        return f"SUCCESS: Saved to {save_path}"
    except Exception as e:
        return f"Error: {str(e)}"


@mcp.tool()
def get_file_content(file_id: str) -> str:
    """Download a file and return its content as bytes (base64 encoded for binary files)."""
    try:
        import base64
        service = get_service()
        
        # Get file metadata first
        file_meta = service.files().get(fileId=file_id, fields="name, mimeType").execute()
        file_name = file_meta.get('name', 'unknown')
        mime_type = file_meta.get('mimeType', 'application/octet-stream')
        
        request = service.files().get_media(fileId=file_id)
        file_stream = io.BytesIO()
        downloader = MediaIoBaseDownload(file_stream, request)
        
        done = False
        while not done:
            _, done = downloader.next_chunk()
        
        file_stream.seek(0)
        content = file_stream.read()
        
        # Return as base64 encoded string with metadata
        encoded_content = base64.b64encode(content).decode('utf-8')
        return f"FILE_NAME:{file_name}\nMIME_TYPE:{mime_type}\nCONTENT_BASE64:{encoded_content}"
    except Exception as e:
        return f"Error: {str(e)}"


if __name__ == "__main__":
    mcp.run()
