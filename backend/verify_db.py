from backend.app import app, db, User
import sys

def verify():
    try:
        with app.app_context():
            count = User.query.count()
            print(f"VERIFICATION SUCCESS: Users count: {count}")
    except Exception as e:
        print(f"VERIFICATION FAILED: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify()
