import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_signup():
    print(f"Testing signup against {BASE_URL}...")
    try:
        # Data matching what flaskApiService.ts likely sends (FormData)
        # However, requests.post with 'data' sends form-encoded, which request.form in Flask expects.
        payload = {
            "username": "testuser_debug",
            "email": "test_debug@example.com",
            "password": "password123",
            "name": "Test User",
            "phone": "1234567890"
        }
        
        response = requests.post(f"{BASE_URL}/signup", data=payload)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("Signup successful!")
        else:
            print("Signup failed!")
            
    except Exception as e:
        print(f"Error testing signup: {e}")

if __name__ == "__main__":
    test_signup()
