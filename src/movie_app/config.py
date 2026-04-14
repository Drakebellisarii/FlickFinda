#config
import os
from datetime import timedelta

class Config:
    # Generate a random secret key
    SECRET_KEY = os.urandom(24)
    # Or use a fixed secret key (for development only)
    # SECRET_KEY = 'your-super-secret-key-here'  
    
    # Database configuration
    db_url = os.environ.get('DATABASE_URL', 'sqlite:///movies.db')
    SQLALCHEMY_DATABASE_URI = db_url.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session configuration
    PERMANENT_SESSION_LIFETIME = timedelta(days=31)
    SESSION_TYPE = 'filesystem'
