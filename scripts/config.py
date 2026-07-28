"""
config.py
Centralized configuration, query anchors, and processing whitelists.
"""

# --- GMAIL ENGINE QUERY ANCHORS ---
JOB_SEARCH_LABEL = 'label:job-search'

# Broad pool keywords - we let Gmail bring these in, and our code will act as the strict filter
INBOX_WHITELIST_PHRASES = [
    'subject:application',
    'subject:applying',
    'subject:applied',
    'subject:thanks',
    'subject:thank'
]

EXCLUSION_KEYWORDS = [
    '-Premium',
    '-"membership"',
    '-order',
    '-receipt',
    '-invoice'
]

# Dynamically construct the advanced query string
_inbox_query = f"label:INBOX ({' OR '.join(INBOX_WHITELIST_PHRASES)}) {' '.join(EXCLUSION_KEYWORDS)}"
ADVANCED_GMAIL_QUERY = f"{JOB_SEARCH_LABEL} OR ({_inbox_query})"


# --- DOWNSTREAM INTENT WHITELISTS ---
INTENT_SENDER_KEYWORDS = [
    "hiring", "talent", "careers", "resourcing", "acquisition", "workable", "recruitment"
]

INTENT_SUBJECT_KEYWORDS = [
    "thank you for applying",
    "thanks for applying",
    "thank you for your application",
    "thanks for your application",
    "received your application",
    "your application",
    "application for",
    "careers application",
    "application received"
]

# --- TRANSACTIONAL NOISE CHECK ---
TRANSACTION_KEYWORDS = [
    "order", "receipt", "easy repeat", "delivery", 
    "purchase", "invoice", "payment received", "return drop-off"
]

# --- DOWNSTREAM PARSING PATTERNS (REGEX) ---
BODY_REGEX_PATTERNS = [
    r"your application for the\s+(.*?)\s+job was submitted successfully",
    r"thank you for your application for the\s+(.*?)\s+(?:position|role|job)",
    r"Thank you for applying for the\s+(.*?)\s+(?:position|role|job)",
    r"Thank you for applying to the\s+(.*?)\s+(?:position|role|job)",
    r"Thanks for applying to\s+(.*?)\s+-\s+Your",
    r"application for\s+(.*?)\s+has been received",
    r"regarding your\s+(.*?)\s+application",
    r"for applying to the\s+(.*?)\s+role",
    r"for applying to\s+(.*?)\s+at",
    r"applied for the\s+(.*?)\s+position",
    r"position of\s+(.*?)(?:\.|,|\s+at|\s+with)",
    r"under review for\s+(.*?)(?:\.|\b[A-Z][a-z]+\b|$)",
    r"application for\s+(.*?)\s+is under review",
    r"applied for\s+(.*?)\s+at",
]

SUBJECT_REGEX_PATTERNS = [
    r"application for\s+(.*?)(?:$|!|\s+with|\s+at|\s+-)",
    r"application:\s+(.*?)(?:$|!|\s+with|\s+at|\s+-)",
    r"position:\s+(.*?)(?:$|!|\s+with|\s+at|\s+-)",
    r"thanks for applying to\s+(.*?)(?:$|!|\s+-)",
    r"thank you for applying to\s+(.*?)(?:$|!|\s+-)",
    r"Application received:\s*(.*)",
    r"Your application for\s+(.*?)(?:\s+at|\s+with|$)",
    r"Applying for\s+(.*?)(?:\s+at|\s+with|$)",
]

# --- SPECIALIZED PLATFORM OVERRIDES ---
WORKABLE_COMPANY_PATTERN = r"Thanks for applying to\s+(.*)"
CLEAN_FALLBACK_ROLE = "Applied Role"

# --- TIMING & LIFECYCLE WINDOWS ---
# The number of days an application stays active before being marked as stale/archived
ACTIVE_TRACKING_WINDOW_DAYS = 60