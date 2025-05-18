from flask import Blueprint, jsonify, request, render_template, session, redirect, url_for
from .auth import login_required
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
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT
            Ementas.week_start_date,
            Ementas.week_end_date,
            Ementas.day_of_week,
            Pratos.name AS dish_name,
            Pratos.description AS dish_description,
            Alergenos.name AS allergen_name
        FROM Ementas
        JOIN Pratos ON Ementas.dish_id = Pratos.id
        LEFT JOIN Alergenos ON Pratos.allergens_id = Alergenos.id
    ''')
    menu_data = cursor.fetchall()

    return jsonify([dict(row) for row in menu_data])

@bp.route('/admin/test')
@login_required
def admin_test():
    return jsonify({'message': 'Authenticated successfully as ' + session['username']})

# Dish Management Routes
@bp.route('/admin/dishes', methods=['GET', 'POST'])
@login_required
def manage_dishes():
    db = get_db()
    cursor = db.cursor()

    if request.method == 'GET':
        cursor.execute('SELECT * FROM Pratos')
        dishes = cursor.fetchall()
        return jsonify([dict(row) for row in dishes])

    elif request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        allergens_id = request.form.get('allergens_id')

        if not name:
            return jsonify({'message': 'Dish name is required'}), 400

        if allergens_id:
            cursor.execute('SELECT id FROM Alergenos WHERE id = ?', (allergens_id,))
            allergen = cursor.fetchone()
            if allergen is None:
                return jsonify({'message': f'Allergen with ID {allergens_id} not found'}), 400

        cursor.execute('INSERT INTO Pratos (name, description, allergens_id) VALUES (?, ?, ?)', (name, description, allergens_id))
        db.commit()
        return jsonify({'message': 'Dish added successfully'}), 201

@bp.route('/admin/dishes/<int:dish_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def manage_single_dish(dish_id):
    db = get_db()
    cursor = db.cursor()

    if request.method == 'GET':
        cursor.execute('SELECT * FROM Pratos WHERE id = ?', (dish_id,))
        dish = cursor.fetchone()
        if dish:
            return jsonify(dict(dish))
        return jsonify({'message': 'Dish not found'}), 404

    elif request.method == 'PUT':
        name = request.form.get('name')
        description = request.form.get('description')
        allergens_id = request.form.get('allergens_id')

        if allergens_id:
            cursor.execute('SELECT id FROM Alergenos WHERE id = ?', (allergens_id,))
            allergen = cursor.fetchone()
            if allergen is None:
                return jsonify({'message': f'Allergen with ID {allergens_id} not found'}), 400

        cursor.execute('UPDATE Pratos SET name = ?, description = ?, allergens_id = ? WHERE id = ?', (name, description, allergens_id, dish_id))
        db.commit()
        return jsonify({'message': 'Dish updated successfully'})

    elif request.method == 'DELETE':
        cursor.execute('DELETE FROM Pratos WHERE id = ?', (dish_id,))
        db.commit()
        return jsonify({'message': 'Dish deleted successfully'})

# Allergen Management Routes
@bp.route('/admin/allergens', methods=['GET', 'POST'])
@login_required
def manage_allergens():
    db = get_db()
    cursor = db.cursor()

    if request.method == 'GET':
        cursor.execute('SELECT * FROM Alergenos')
        allergens = cursor.fetchall()
        return jsonify([dict(row) for row in allergens])

    elif request.method == 'POST':
        name = request.form.get('name')

        if not name:
            return jsonify({'message': 'Allergen name is required'}), 400

        cursor.execute('SELECT id FROM Alergenos WHERE name = ?', (name,))
        existing_allergen = cursor.fetchone()
        if existing_allergen:
            return jsonify({'message': f'Allergen with name "{name}" already exists'}), 400

        cursor.execute('INSERT INTO Alergenos (name) VALUES (?)', (name,))
        db.commit()
        return jsonify({'message': 'Allergen added successfully'}), 201

@bp.route('/admin/allergens/<int:allergen_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def manage_single_allergen(allergen_id):
    db = get_db()
    cursor = db.cursor()

    if request.method == 'GET':
        cursor.execute('SELECT * FROM Alergenos WHERE id = ?', (allergen_id,))
        allergen = cursor.fetchone()
        if allergen:
            return jsonify(dict(allergen))
        return jsonify({'message': 'Allergen not found'}), 404

    elif request.method == 'PUT':
        name = request.form.get('name')

        if not name:
            return jsonify({'message': 'Allergen name is required'}), 400

        cursor.execute('UPDATE Alergenos SET name = ? WHERE id = ?', (name, allergen_id))
        db.commit()
        return jsonify({'message': 'Allergen updated successfully'})

    elif request.method == 'DELETE':
        cursor.execute('DELETE FROM Alergenos WHERE id = ?', (allergen_id,))
        db.commit()
        return jsonify({'message': 'Allergen deleted successfully'})

# Menu Item Management Routes
@bp.route('/admin/menu_items', methods=['GET', 'POST'])
@login_required
def manage_menu_items():
    db = get_db()
    cursor = db.cursor()

    if request.method == 'GET':
        cursor.execute('''
            SELECT Ementas.id, Ementas.week_start_date, Ementas.week_end_date, Ementas.day_of_week, Pratos.name AS dish_name
            FROM Ementas
            JOIN Pratos ON Ementas.dish_id = Pratos.id
        ''')
        menu_items = cursor.fetchall()
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
        dish = cursor.fetchone()
        if dish is None:
            return jsonify({'message': f'Dish with ID {dish_id} not found'}), 400
            
        cursor.execute('INSERT INTO Ementas (week_start_date, week_end_date, day_of_week, dish_id) VALUES (?, ?, ?, ?)', (week_start_date, week_end_date, day_of_week, dish_id))
        db.commit()
        return jsonify({'message': 'Menu item added successfully'}), 201
@bp.route('/admin/menu_items/<int:menu_item_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def manage_single_menu_item(menu_item_id):
    db = get_db()
    cursor = db.cursor()

    if request.method == 'GET':
        cursor.execute('''
            SELECT Ementas.id, Ementas.week_start_date, Ementas.week_end_date, Ementas.day_of_week, Pratos.name AS dish_name, Ementas.dish_id
            FROM Ementas
            JOIN Pratos ON Ementas.dish_id = Pratos.id
            WHERE Ementas.id = ?
        ''', (menu_item_id,))
        menu_item = cursor.fetchone()
        if menu_item:
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
            dish = cursor.fetchone()
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
