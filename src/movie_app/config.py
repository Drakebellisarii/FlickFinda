#config
import os
from datetime import timedelta

class Config:
    # Use a stable secret key from environment (required for session persistence in production)
    SECRET_KEY = os.environ.get('SECRET_KEY', os.urandom(24))
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = 'sqlite:///movies.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session configuration
    PERMANENT_SESSION_LIFETIME = timedelta(days=31)
    SESSION_TYPE = 'filesystem'
