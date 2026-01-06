import psycopg2
import os
from dotenv import load_dotenv
from urllib.parse import urlparse

# Load .env explicitly
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

def test_connection():
    url = os.environ.get('DATABASE_URL')
    print(f"Testing connection to: {url}")
    
    if not url:
        print("DATABASE_URL is missing!")
        return

    try:
        conn = psycopg2.connect(url)
        print("SUCCESS: Connected to PostgreSQL!")
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()
        print(f"Database Version: {version[0]}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"FAILURE: Could not connect. Error: {e}")

if __name__ == "__main__":
    test_connection()
