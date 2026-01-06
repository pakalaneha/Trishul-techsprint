from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    skin_tone = db.Column(db.String(50))
    skin_type = db.Column(db.String(50)) # Oily, Dry, etc.
    body_shape = db.Column(db.String(50))
    color_palette = db.Column(db.String(100)) # Stored as comma-separated or JSON string
    style_vibe = db.Column(db.String(50))
    dark_mode = db.Column(db.Boolean, default=True)
    notifications_enabled = db.Column(db.Boolean, default=True)
    password_hash = db.Column(db.String(128)) # In production, store hash
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': self.name,
            'phone': self.phone,
            'skin_tone': self.skin_tone,
            'skin_type': self.skin_type,
            'body_shape': self.body_shape,
            'color_palette': self.color_palette,
            'style_vibe': self.style_vibe,
            'dark_mode': self.dark_mode,
            'notifications_enabled': self.notifications_enabled,
            'created_at': self.created_at.isoformat()
        }
