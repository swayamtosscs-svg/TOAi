"""
Google Drive OAuth Setup Script

Run this script once to authenticate with Google Drive and create token.json.
You need to have a credentials.json file from Google Cloud Console.

Steps to get credentials.json:
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable Google Drive API
4. Create OAuth 2.0 credentials (Desktop application)
5. Download the credentials and save as 'credentials.json' in this folder
"""

import os
import json
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_FILE = os.path.join(BASE_DIR, 'credentials.json')
TOKEN_FILE = os.path.join(BASE_DIR, 'token.json')
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']


def setup_authentication():
    """Setup OAuth authentication for Google Drive."""
    creds = None
    
    # Check if token already exists
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    
    # If no valid credentials, run OAuth flow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing expired token...")
            creds.refresh(Request())
        else:
            if not os.path.exists(CREDENTIALS_FILE):
                print(f"Error: {CREDENTIALS_FILE} not found!")
                print("\nTo create credentials.json:")
                print("1. Go to https://console.cloud.google.com/")
                print("2. Create/select a project")
                print("3. Enable Google Drive API")
                print("4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID")
                print("5. Choose 'Desktop application'")
                print("6. Download JSON and save as 'credentials.json' in this folder")
                return False
            
            print("Starting OAuth flow...")
            print("A browser window will open. Please authorize the application.")
            
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save the credentials
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
        print(f"✅ Token saved to {TOKEN_FILE}")
    
    print("✅ Authentication successful!")
    print(f"Token file: {TOKEN_FILE}")
    return True


if __name__ == '__main__':
    setup_authentication()
