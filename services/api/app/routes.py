from flask import Blueprint, jsonify, request, render_template, session, redirect, url_for
from .auth import login_required, role_required
from .models import (get_db, add_user, get_user_by_username, get_user_by_firebase_uid,
                     get_all_dishes, get_dish_by_id, add_dish, update_dish, delete_dish,
                     get_all_allergens, get_allergen_by_id, add_allergen, update_allergen, delete_allergen, get_allergen_by_name,
                     get_all_menu_items, get_menu_item_by_id, add_menu_item, update_menu_item, delete_menu_item, get_menu_data)
from .models import get_db

bp = Blueprint('routes', __name__)

@bp.route('/')
def index():
    return render_template('index.html')

def admin_login_page():
    return render_template('admin_login.html')

@bp.route('/admin.html')
@login_required
def admin_page():
    return render_template('admin.html', logged_in=session.get('logged_in'))

@bp.route('/menu')
def get_menu():
    # Use the get_menu_data function from models
    menu_data = get_menu_data()

    return jsonify([dict(row) for row in menu_data])

@bp.route('/admin/test')
@role_required('admin') # Apply role_required here as well for consistency
@login_required
def admin_test():
    return jsonify({'message': 'Authenticated successfully as ' + session['username']})

# Dish Management Routes
@bp.route('/admin/dishes', methods=['GET', 'POST'])
@login_required
@role_required('admin')
def manage_dishes():
    if request.method == 'GET':
        # Use the get_all_dishes function
        dishes = get_all_dishes()
        return jsonify([dict(row) for row in dishes])
    elif request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        allergens_id = request.form.get('allergens_id')

        if not name:
            return jsonify({'message': 'Dish name is required'}), 400

        if allergens_id:
            # Validate allergen_id using get_allergen_by_id
            allergen = get_allergen_by_id(allergens_id)
            if allergen is None:
                return jsonify({'message': f'Allergen with ID {allergens_id} not found'}), 400

        return jsonify({'message': 'Dish added successfully'}), 201

@bp.route('/admin/dishes/<int:dish_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
@role_required('admin')
def manage_single_dish(dish_id):
    db = get_db()

    if request.method == 'GET':
        # Use the get_dish_by_id function
        dish = get_dish_by_id(dish_id)
            return jsonify(dict(dish))
        return jsonify({'message': 'Dish not found'}), 404

    elif request.method == 'PUT':
        name = request.form.get('name')
        description = request.form.get('description')
        allergens_id = request.form.get('allergens_id')

        if allergens_id:
            # Validate allergen_id using get_allergen_by_id
            allergen = get_allergen_by_id(allergens_id)
            if allergen is None:
                return jsonify({'message': f'Allergen with ID {allergens_id} not found'}), 400

        db.commit()
        return jsonify({'message': 'Dish updated successfully'})

    elif request.method == 'DELETE':
        cursor.execute('DELETE FROM Pratos WHERE id = ?', (dish_id,))
        db.commit()
        return jsonify({'message': 'Dish deleted successfully'})

# Allergen Management Routes
@bp.route('/admin/allergens', methods=['GET', 'POST'])
@login_required
@role_required('admin')
def manage_allergens():
    if request.method == 'GET':
        # Use the get_all_allergens function
        return jsonify([dict(row) for row in allergens])


    elif request.method == 'POST':
        name = request.form.get('name')

        if not name:
            return jsonify({'message': 'Allergen name is required'}), 400

        cursor.execute('SELECT id FROM Alergenos WHERE name = ?', (name,))
        # Use get_allergen_by_name to check if allergen already exists
        existing_allergen = get_allergen_by_name(name)
        if existing_allergen:
            return jsonify({'message': f'Allergen with name "{name}" already exists'}), 400
        return jsonify({'message': 'Allergen added successfully'}), 201

@bp.route('/admin/allergens/<int:allergen_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
@role_required('admin')
def manage_single_allergen(allergen_id):
    db = get_db()

    if request.method == 'GET':
        # Use the get_allergen_by_id function
        allergen = get_allergen_by_id(allergen_id)
            return jsonify(dict(allergen))
        return jsonify({'message': 'Allergen not found'}), 404

    elif request.method == 'PUT':
        name = request.form.get('name')

        if not name:
            return jsonify({'message': 'Allergen name is required'}), 400

        db.commit()
        return jsonify({'message': 'Allergen updated successfully'})

    elif request.method == 'DELETE':
        cursor.execute('DELETE FROM Alergenos WHERE id = ?', (allergen_id,))
        db.commit()
        return jsonify({'message': 'Allergen deleted successfully'})

# Menu Item Management Routes
@bp.route('/admin/menu_items', methods=['GET', 'POST'])
@login_required
@role_required('admin')
def manage_menu_items():
    if request.method == 'GET':
        # Use the get_all_menu_items function
        return jsonify([dict(row) for row in menu_items])

    elif request.method == 'POST':
        week_start_date = request.form.get('week_start_date')
        week_end_date = request.form.get('week_end_date')
        day_of_week = request.form.get('day_of_week')
        dish_id = request.form.get('dish_id')
        
        # Input Validation for POST
        if not all([week_start_date, week_end_date, day_of_week, dish_id]):
             return jsonify({'message': 'Missing required fields'}), 400
        
        # Check if dish_id exists
        try:
            dish_id = int(dish_id)
        except ValueError:
             return jsonify({'message': 'Invalid dish_id'}), 400

        cursor.execute('SELECT id FROM Pratos WHERE id = ?', (dish_id,))
        # Use get_dish_by_id to validate dish_id
        dish = get_dish_by_id(dish_id)
        if dish is None:
            return jsonify({'message': f'Dish with ID {dish_id} not found'}), 400
        db.commit()
        return jsonify({'message': 'Menu item added successfully'}), 201
@bp.route('/admin/menu_items/<int:menu_item_id>', methods=['GET', 'PUT', 'DELETE'])
@role_required('admin')
@login_required
def manage_single_menu_item(menu_item_id):
    db = get_db()
    if request.method == 'GET':
        # Use the get_menu_item_by_id function
        menu_item = get_menu_item_by_id(menu_item_id)
        if menu_item: # Check if menu_item is not None
            return jsonify(dict(menu_item))
        return jsonify({'message': 'Menu item not found'}), 404

    elif request.method == 'PUT':
        week_start_date = request.form.get('week_start_date')
        week_end_date = request.form.get('week_end_date')
        day_of_week = request.form.get('day_of_week')
        dish_id = request.form.get('dish_id')
        
        # Input Validation for PUT (Check dish_id if provided)
        if dish_id:
            try:
                dish_id = int(dish_id)
            except ValueError:
                 return jsonify({'message': 'Invalid dish_id'}), 400
            cursor.execute('SELECT id FROM Pratos WHERE id = ?', (dish_id,))
            # Use get_dish_by_id to validate dish_id if provided
            dish = get_dish_by_id(dish_id)
            if dish is None:
                return jsonify({'message': f'Dish with ID {dish_id} not found'}), 400
        cursor.execute('UPDATE Ementas SET week_start_date = ?, week_end_date = ?, day_of_week = ?, dish_id = ? WHERE id = ?', (week_start_date, week_end_date, day_of_week, dish_id, menu_item_id))
        db.commit()
        return jsonify({'message': 'Menu item updated successfully'})

    elif request.method == 'DELETE':
        cursor.execute('DELETE FROM Ementas WHERE id = ?', (menu_item_id,))
        db.commit()
        return jsonify({'message': 'Menu item deleted successfully'})

@bp.route('/admin/logout')
@login_required
def logout():
    session.clear()
    return redirect(url_for('routes.admin_login_page'))

# Authentication Routes
@bp.route('/auth/register', methods=['POST'])
def register_user():
    if request.method == 'POST':
        # Assuming data is sent as JSON
        data = request.get_json()
        if not data:
            return jsonify({'message': 'Invalid input, please provide JSON data'}), 400

        username = data.get('username')
        password = data.get('password')
        email = data.get('email') # Optional

        if not username or not password:
            return jsonify({'message': 'Username and password are required'}), 400

        # Check if username already exists
        if get_user_by_username(username):
            return jsonify({'message': 'Username already exists'}), 409 # Conflict

        # Hash the password
        from werkzeug.security import generate_password_hash
        hashed_password = generate_password_hash(password)

        # Add user to the database
        add_user(username=username, email=email, hashed_password=hashed_password)

        return jsonify({'message': 'User registered successfully'}), 201

@bp.route('/auth/register_firebase', methods=['POST'])
def register_firebase_user():
    if request.method == 'POST':
        data = request.get_json()
        firebase_uid = data.get('firebase_uid')

        if not firebase_uid:
            return jsonify({'message': 'Firebase UID is required'}), 400

        # Placeholder: In a real implementation, you would verify the Firebase token here
