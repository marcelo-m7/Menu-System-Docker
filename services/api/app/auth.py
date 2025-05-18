from flask import request, session, jsonify, g
from werkzeug.security import check_password_hash
import functools
from .models import get_db  # Relative import

# Decorator to protect admin routes
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if session.get('logged_in') is None:
            return jsonify({'message': 'Authentication required'}), 401
        return view(**kwargs)
    return wrapped_view

# Login route
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM Controlo_de_Acesso WHERE username = ?', (username,))
    user = cursor.fetchone()

    if user and check_password_hash(user['password'], password):
        session['logged_in'] = True
        session['username'] = user['username']
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# You would typically register this blueprint or route in your main app.py
# For example:
# from flask import Blueprint
# auth_bp = Blueprint('auth', __name__, url_prefix='/admin')
# auth_bp.route('/login', methods=['POST'])(login)
# app.register_blueprint(auth_bp)