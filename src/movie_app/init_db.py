# init_db.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

def init_db():
    app = Flask(__name__)
    app.config.from_object(Config)
    db = SQLAlchemy(app)
    
    with app.app_context():
        db.create_all()
        print("Database created successfully!")

if __name__ == '__main__':
    init_db()