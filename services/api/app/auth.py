from flask import request, session, jsonify, g
from werkzeug.security import check_password_hash, generate_password_hash # Import generate_password_hash
import functools
from .models import get_db, get_user_by_username, get_user_by_id, get_user_roles
from flask import current_app # Import current_app
# Decorator to protect admin routes
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if session.get('logged_in') is None:
            return jsonify({'message': 'Authentication required'}), 401
        return view(**kwargs)
    return wrapped_view

# Function to load the logged-in user
# Decorator to require a specific role
def role_required(role_name):
    def decorator(view):
        @functools.wraps(view)
        @login_required # Ensure user is logged in first
        def wrapped_view(**kwargs):
            user = g.user
            if user and 'roles' in user and role_name in user['roles']:
                return view(**kwargs)
            else:
                return jsonify({'message': 'Insufficient permissions'}), 403
        return wrapped_view
    return decorator

# Function to load the logged-in user (used by before_request)
def load_logged_in_user():
    user_id = session.get('user_id')
    if user_id is None:
        g.user = None
    else:
        # Use get_user_by_id to fetch user from the new 'users' table
        g.user = get_user_by_id(user_id)
        # Optional: Load user roles into g.user or a separate g variable
        if g.user and g.user.get('id'): # Ensure user and user id exist
             g.user['roles'] = get_user_roles(g.user['id'])

# Login route
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    # Use get_user_by_username from the new models
    user = get_user_by_username(username)

    # Verify password against the hashed_password column in the 'users' table
    if user and user['hashed_password'] and check_password_hash(user['hashed_password'], password):
        session.clear() # Clear existing session
        session['user_id'] = user['id'] # Store user ID in session
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# You would typically register this blueprint or route in your main app.py
# For example:
# from flask import Blueprint
# auth_bp = Blueprint('auth', __name__, url_prefix='/admin')
# auth_bp.route('/login', methods=['POST'])(login)
# app.register_blueprint(auth_bp)

# Register the load_logged_in_user function with the app factory in __init__.py
# For example, in api/app/__init__.py:
# app.before_request(load_logged_in_user)