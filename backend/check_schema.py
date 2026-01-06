import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def check_schema():
    url = os.environ.get('DATABASE_URL')
    try:
        conn = psycopg2.connect(url)
        cur = conn.cursor()
        
        # Check tables
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = cur.fetchall()
        print(f"Tables in database: {[t[0] for t in tables]}")
        
        # Check User table columns
        if ('user',) in tables or 'user' in [t[0] for t in tables]:
            cur.execute("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'user'")
            columns = cur.fetchall()
            print("User table columns:")
            for col in columns:
                print(f" - {col[0]}: {col[1]} (Nullable: {col[2]})")
        else:
            print("User table NOT found!")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error checking schema: {e}")

if __name__ == "__main__":
    check_schema()
