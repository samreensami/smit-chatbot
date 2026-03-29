# Test script for SMIT AI Communication Assistant

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health check: {response.status_code} - {response.json()}")
        return True
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_chat():
    """Test chat functionality"""
    try:
        payload = {
            "message": "Hello, how are you?",
            "language": "en"
        }
        response = requests.post(f"{BASE_URL}/chat", json=payload)
        print(f"Chat test: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Chat test failed: {e}")
        return False

def test_announcement():
    """Test announcement generation"""
    try:
        payload = {
            "topic": "New batch starting next week",
            "audience": "students",
            "language": "en"
        }
        response = requests.post(f"{BASE_URL}/generate-announcement", json=payload)
        print(f"Announcement test: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Announcement test failed: {e}")
        return False

def test_social_media():
    """Test social media post generation"""
    try:
        payload = {
            "topic": "Promoting our new web development course",
            "platform": "facebook",
            "language": "en"
        }
        response = requests.post(f"{BASE_URL}/generate-social-media-post", json=payload)
        print(f"Social media test: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Social media test failed: {e}")
        return False

def test_email():
    """Test email generation"""
    try:
        payload = {
            "subject": "Welcome to SMIT",
            "recipient": "students",
            "content": "Welcome to Saylani Mass IT Training",
            "language": "en"
        }
        response = requests.post(f"{BASE_URL}/generate-email", json=payload)
        print(f"Email test: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Email test failed: {e}")
        return False

def test_faq():
    """Test FAQ functionality"""
    try:
        payload = {
            "message": "What are the admission requirements?",
            "language": "en"
        }
        response = requests.post(f"{BASE_URL}/faq", json=payload)
        print(f"FAQ test: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"FAQ test failed: {e}")
        return False

def run_tests():
    """Run all tests"""
    print("Running tests for SMIT AI Communication Assistant...\n")
    
    tests = [
        ("Health Check", test_health),
        ("Chat", test_chat),
        ("Announcement Generation", test_announcement),
        ("Social Media Post", test_social_media),
        ("Email Generation", test_email),
        ("FAQ", test_faq),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"Testing {test_name}...")
        success = test_func()
        results.append((test_name, success))
        print()
        time.sleep(1)  # Brief pause between tests
    
    print("Test Results:")
    print("-" * 30)
    for test_name, success in results:
        status = "PASS" if success else "FAIL"
        print(f"{test_name}: {status}")
    
    all_passed = all(result[1] for result in results)
    print(f"\nOverall Result: {'ALL TESTS PASSED' if all_passed else 'SOME TESTS FAILED'}")
    
    return all_passed

if __name__ == "__main__":
    run_tests()