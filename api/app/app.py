from flask import Flask, g, Blueprint, send_file
import sqlite3
import os
from .models import get_db, DATABASE # Import get_db and DATABASE from models
from .routes import routes_bp # Import the Blueprint from routes

app = Flask(__name__, static_folder='../frontend/static', static_url_path='/static')
app.config['SECRET_KEY'] = os.urandom(24) # Use os.urandom for a real secret key


app.register_blueprint(routes_bp) # Register the Blueprint from routes


@app.teardown_appcontext
def close_db(error):
    db = get_db()
    if hasattr(g, '_database'):
        g._database.close()

if __name__ == '__main__':
    with app.app_context():
        get_db() # Ensure the database connection is established on startup

    app.run(debug=True)