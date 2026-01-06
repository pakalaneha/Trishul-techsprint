import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.app import app
from backend.models import User

def list_users():
    with app.app_context():
        users = User.query.all()
        print(f"Total Users: {len(users)}")
        for u in users:
            print(f" - ID: {u.id}, Username: {u.username}, Email: {u.email}")

if __name__ == "__main__":
    list_users()
