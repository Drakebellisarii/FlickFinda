#config
import os
from datetime import timedelta

class Config:
    # Generate a random secret key
    SECRET_KEY = os.urandom(24)
    # Or use a fixed secret key (for development only)
    # SECRET_KEY = 'your-super-secret-key-here'  
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = 'sqlite:///movies.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session configuration
    PERMANENT_SESSION_LIFETIME = timedelta(days=31)
    SESSION_TYPE = 'filesystem'
