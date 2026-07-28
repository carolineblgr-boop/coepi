import os
import base64
import re
import json
from datetime import datetime
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

import config

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def get_email_body(payload):
    """Recursively extract raw body text from the Gmail MIME structure."""
    if 'body' in payload and 'data' in payload['body']:
        raw_data = payload['body']['data']
        return base64.urlsafe_b64decode(raw_data).decode('utf-8', errors='ignore')
    if 'parts' in payload:
        for part in payload['parts']:
            if part.get('mimeType') == 'text/plain':
                if 'data' in part.get('body', {}):
                    raw_data = part['body']['data']
                    return base64.urlsafe_b64decode(raw_data).decode('utf-8', errors='ignore')
            elif 'parts' in part:
                body = get_email_body(part)
                if body: 
                    return body
    return ""

def clean_extracted_title(title):
    """Utility to strip leading articles ('the', 'a') and trailing noise from job titles."""
    if not title:
        return title
    # Remove leading articles: "the Senior Frontend Engineer" -> "Senior Frontend Engineer"
    title = re.sub(r"^(the|a|an)\s+", "", title, flags=re.IGNORECASE)
    # Remove trailing words: "Senior Frontend Engineer position" -> "Senior Frontend Engineer"
    title = re.sub(r"\s+(position|role|job)$", "", title, flags=re.IGNORECASE)
    return title.strip().rstrip('.,;:(-')

def main():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    service = build('gmail', 'v1', credentials=creds)
    
    print(f"\nSearching emails using decoupled configuration query...")
    results = service.users().messages().list(userId='me', q=config.ADVANCED_GMAIL_QUERY, maxResults=100).execute()
    messages = results.get('messages', [])

    output_filename = 'data/jobs_database.json'
    all_applications = []
    existing_ids = set()

    if os.path.exists(output_filename):
        try:
            with open(output_filename, 'r') as json_file:
                all_applications = json.load(json_file)
                existing_ids = {app['id'] for app in all_applications if 'id' in app}
                print(f"Loaded {len(all_applications)} historical records from disk.")
        except Exception:
            all_applications = []

    if not messages:
        print("No matching emails found.")
    else:
        for msg in messages:
            if msg['id'] in existing_ids:
                continue

            email_data = service.users().messages().get(userId='me', id=msg['id']).execute()
            headers = email_data.get('payload', {}).get('headers', [])
            
            subject = "No Subject"
            sender = "Unknown Sender"
            for header in headers:
                if header['name'] == 'Subject': 
                    subject = header['value']
                if header['name'] == 'From': 
                    sender = header['value']
            
            subject_lower = subject.lower()
            sender_lower = sender.lower()

            # --- FILTER: Intent & Noise Verification ---
            has_valid_sender = any(keyword in sender_lower for keyword in config.INTENT_SENDER_KEYWORDS)
            has_valid_subject = any(phrase in subject_lower for phrase in config.INTENT_SUBJECT_KEYWORDS)

            if not (has_valid_sender or has_valid_subject):
                continue

            if any(keyword in subject_lower for keyword in config.TRANSACTION_KEYWORDS):
                continue  

            # --- STEP 1: CLEAN & STRIP HTML FROM EMAIL BODY ---
            body_text = get_email_body(email_data.get('payload', {}))
            
            # Remove <style> and <script> tags and content
            clean_body = re.sub(r'<style.*?>.*?</style>', '', body_text, flags=re.DOTALL | re.IGNORECASE)
            clean_body = re.sub(r'<script.*?>.*?</script>', '', clean_body, flags=re.DOTALL | re.IGNORECASE)
            # Remove all HTML tags (<p>, <div>, <a>, etc.)
            clean_body = re.sub(r'<[^>]+>', ' ', clean_body)
            # Collapse extra spaces, tabs, and newlines into single spaces
            clean_body = " ".join(clean_body.split())

            # --- STEP 2: EXTRACT JOB TITLE FROM EMAIL BODY (PRIMARY PATTERNS) ---
            extracted_job_title = config.CLEAN_FALLBACK_ROLE
            for pattern in config.BODY_REGEX_PATTERNS:
                match = re.search(pattern, clean_body, re.IGNORECASE)
                if match:
                    extracted_job_title = clean_extracted_title(match.group(1))
                    break 
            
            # --- STEP 3: FALLBACK TO SUBJECT REGEX IF BODY FAILED ---
            if extracted_job_title == config.CLEAN_FALLBACK_ROLE:
                for sub_pattern in config.SUBJECT_REGEX_PATTERNS:
                    sub_match = re.search(sub_pattern, subject, re.IGNORECASE)
                    if sub_match:
                        extracted_job_title = clean_extracted_title(sub_match.group(1))
                        break

            # --- STEP 4: GREEDY-CAPTURE & LENGTH SANITY CHECK ---
            # If regex captured a whole sentence (e.g., >60 chars or >8 words), discard it
            if len(extracted_job_title) > 60 or len(extracted_job_title.split()) > 8:
                extracted_job_title = config.CLEAN_FALLBACK_ROLE

            # --- STEP 5: PARSE & CLEANUP COMPANY NAME ---
            company_name = sender.split('<')[0].strip()
            company_name = company_name.replace("Hiring Team", "").replace("Team", "").replace("Hiring", "").replace("Talent Acquisition", "").strip()

            # SENDER DELIMITER INTERCEPTOR (e.g. "Hostaway / Senior Frontend Engineer")
            if "/" in company_name:
                parts = company_name.split("/", 1)
                company_name = parts[0].strip()
                if extracted_job_title == config.CLEAN_FALLBACK_ROLE:
                    extracted_job_title = clean_extracted_title(parts[1])

            # GENERIC COMPANY RECOVERY (e.g., "Target Company", "Proxify Careers", or raw emails)
            if company_name in ["Target Company", "Proxify Careers", "Careers", "No Reply"] or "@" in company_name or not company_name:
                comp_match = re.search(r"(?:at|to|with)\s+([A-Z][A-Za-z0-9\s]+)", subject, re.IGNORECASE)
                if comp_match:
                    company_name = comp_match.group(1).strip().rstrip('.,;:(-')

            # --- STEP 6: SPECIALIZED PLATFORM INTERCEPTORS ---
            if "workable" in sender_lower:
                company_match = re.search(config.WORKABLE_COMPANY_PATTERN, subject, re.IGNORECASE)
                if company_match:
                    company_name = company_match.group(1).strip().rstrip('.,;:(-')
            
            elif "greenhouse" in sender_lower:
                if company_name in ["Target Company", "Greenhouse"] or "@" in company_name:
                    comp_match = re.search(r"(?:at|to|with)\s+([A-Z][A-Za-z0-9\s]+)", subject, re.IGNORECASE)
                    if comp_match:
                        company_name = comp_match.group(1).strip()

            # TALENT NETWORK OVERRIDE (e.g., Proxify network applications without specific titles)
            if "proxify" in company_name.lower() and extracted_job_title == config.CLEAN_FALLBACK_ROLE:
                extracted_job_title = "Network Member / Developer"

            # --- STEP 7: VERIFICATION CHECK ---
            is_verified_recruiter = any(k in sender_lower for k in ["hiring", "talent", "careers", "recruitment", "workable", "greenhouse"])
            if extracted_job_title == config.CLEAN_FALLBACK_ROLE and not is_verified_recruiter:
                continue

            # --- STEP 8: DATE & LIFECYCLE STATUS CALCULATION ---
            raw_date_ms = email_data.get('internalDate', '0')
            date_object = datetime.fromtimestamp(int(raw_date_ms) / 1000.0)
            formatted_date = date_object.strftime('%Y-%m-%d')

            current_date = datetime.now()
            days_old = (current_date - date_object).days

            record_status = "Archived" if days_old > config.ACTIVE_TRACKING_WINDOW_DAYS else "Active"

            application_data = {
                "id": msg['id'],
                "date": formatted_date,
                "company": company_name,
                "role": extracted_job_title,
                "status": record_status
            }
            
            all_applications.append(application_data)
            print(f"Processed New Entry: {formatted_date} | [{record_status}] {company_name} - {extracted_job_title}")

        with open(output_filename, 'w') as json_file:
            json.dump(all_applications, json_file, indent=4)
            
        print(f"\n🎉 Database state synchronized seamlessly. Total Records: {len(all_applications)}")

if __name__ == '__main__':
    main()