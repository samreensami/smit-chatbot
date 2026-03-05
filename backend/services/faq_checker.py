"""
SMIT AI Assistant - FAQ Checker Service
========================================

This module handles LOCAL FAQ matching to save Gemini API tokens.
It searches the faq_data.json database for matching answers.

TOKEN SAVING STRATEGY:
1. Check greetings (hi, hello, etc.)
2. Check thanks/goodbye
3. Search local FAQ by keywords
4. Return None if no match (caller can then use Gemini API)

MATCHING ALGORITHM:
- Exact word match: +2 points
- Partial match: +1 point
- Returns FAQ with highest score (minimum 1 point)

@author SMIT Development Team
@version 1.0.0
"""

import json
import os
import re
from typing import Optional

# Path to FAQ JSON file
FAQ_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "faq_data.json")

# Cache for FAQ data (loaded once)
_faq_cache = None


def load_faqs() -> dict:
    """
    Load FAQ data from JSON file with caching

    Returns:
        dict: Complete FAQ data structure
    """
    global _faq_cache

    if _faq_cache is not None:
        return _faq_cache

    try:
        with open(FAQ_FILE, "r", encoding="utf-8") as f:
            _faq_cache = json.load(f)
            return _faq_cache
    except Exception as e:
        print(f"Error loading FAQs: {e}")
        return {"faqs": [], "greetings": {}, "thanks": {}, "goodbye": {}, "fallback": {}}


def normalize_text(text: str) -> str:
    """
    Normalize text for matching

    - Converts to lowercase
    - Removes punctuation
    - Removes extra whitespace

    Args:
        text: Input text to normalize

    Returns:
        Normalized string
    """
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    text = ' '.join(text.split())
    return text


def find_local_answer(query: str) -> Optional[str]:
    """
    Search local FAQ database for matching answer

    Uses keyword matching with scoring:
    - Exact word match: +2 points
    - Partial match (keyword in query): +1 point
    - Returns FAQ with highest score (min 1 point required)

    Args:
        query: User's question

    Returns:
        Matching FAQ answer or None
    """
    data = load_faqs()
    faqs = data.get("faqs", [])

    normalized_query = normalize_text(query)
    query_words = set(normalized_query.split())

    best_match = None
    best_score = 0

    for faq in faqs:
        keywords = faq.get("keywords", [])
        score = 0

        for keyword in keywords:
            keyword_lower = keyword.lower()

            # Exact word match - higher score
            if keyword_lower in query_words:
                score += 2
            # Partial match - keyword appears in query
            elif keyword_lower in normalized_query:
                score += 1

        # Update best match if higher score
        if score > best_score:
            best_score = score
            best_match = faq.get("answer")

    # Return only if score above threshold
    if best_score >= 1:
        return best_match

    return None


def get_greeting_response(query: str) -> Optional[str]:
    """
    Check for greetings and return appropriate response

    Uses keywords from JSON: hi, hello, hey, assalam, salam, aoa, etc.

    Args:
        query: User's message

    Returns:
        Greeting response or None
    """
    data = load_faqs()
    greetings = data.get("greetings", {})
    keywords = greetings.get("keywords", [])
    response = greetings.get("response", "")

    normalized = normalize_text(query)
    words = normalized.split()

    for greeting in keywords:
        if greeting in words or greeting in normalized:
            return response

    return None


def get_thanks_response(query: str) -> Optional[str]:
    """
    Check for thanks and return appropriate response

    Uses keywords from JSON: thank, thanks, shukriya, jazak, etc.

    Args:
        query: User's message

    Returns:
        Thanks response or None
    """
    data = load_faqs()
    thanks = data.get("thanks", {})
    keywords = thanks.get("keywords", [])
    response = thanks.get("response", "")

    normalized = normalize_text(query)

    for word in keywords:
        if word in normalized:
            return response

    return None


def get_goodbye_response(query: str) -> Optional[str]:
    """
    Check for goodbye and return appropriate response

    Uses keywords from JSON: bye, goodbye, khuda hafiz, etc.

    Args:
        query: User's message

    Returns:
        Goodbye response or None
    """
    data = load_faqs()
    goodbye = data.get("goodbye", {})
    keywords = goodbye.get("keywords", [])
    response = goodbye.get("response", "")

    normalized = normalize_text(query)

    for word in keywords:
        if word in normalized:
            return response

    return None


def check_local_first(query: str) -> Optional[str]:
    """
    Main function to check local responses first

    This is the entry point for FAQ checking.

    ORDER OF CHECKS:
    1. Greetings (hi, hello)
    2. Thanks (thank you, shukriya)
    3. Goodbye (bye, khuda hafiz)
    4. FAQ database search

    If no match found, returns None and caller should use Gemini API.

    Args:
        query: User's input message

    Returns:
        Local response or None (for API fallback)
    """
    # Step 1: Check greetings
    response = get_greeting_response(query)
    if response:
        return response

    # Step 2: Check thanks
    response = get_thanks_response(query)
    if response:
        return response

    # Step 3: Check goodbye
    response = get_goodbye_response(query)
    if response:
        return response

    # Step 4: Search FAQ database
    response = find_local_answer(query)
    if response:
        return response

    # No local match found
    return None
