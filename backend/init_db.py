import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from backend.config import Config
import os
from urllib.parse import urlparse

def create_database():
    try:
        # Parse the DATABASE_URL to get credentials and dbname
        url = os.environ.get('DATABASE_URL')
        if not url:
            print("DATABASE_URL not found.")
            return

        result = urlparse(url)
        username = result.username
        password = result.password
        database = result.path[1:]
        hostname = result.hostname
        port = result.port
        
        # Connect to 'postgres' db to create the new db
        con = psycopg2.connect(
            dbname='postgres', 
            user=username, 
            host=hostname, 
            password=password,
            port=port
        )
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        
        # Check if db exists
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{database}'")
        exists = cur.fetchone()
        
        if not exists:
            print(f"Database {database} does not exist. Creating...")
            cur.execute(f"CREATE DATABASE {database}")
            print(f"Database {database} created successfully.")
        else:
            print(f"Database {database} already exists.")
            
        cur.close()
        con.close()
    except Exception as e:
        print(f"Error creating database: {e}")

if __name__ == "__main__":
    create_database()
