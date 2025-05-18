import mysql.connector
from flask import g, current_app


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = mysql.connector.connect(
            host=current_app.config['MYSQL_HOST'],
            user=current_app.config['MYSQL_USER'],
            password=current_app.config['MYSQL_PASSWORD'],
            database=current_app.config['MYSQL_DB']
        )
    return db

def close_db(e=None):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# --- User and Role Management Functions ---

def add_user(username, email=None, hashed_password=None, firebase_uid=None):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "INSERT INTO users (username, email, hashed_password, firebase_uid) VALUES (%s, %s, %s, %s)"
        values = (username, email, hashed_password, firebase_uid)
        cursor.execute(sql, values)
        db.commit()
        return cursor.lastrowid
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error adding user: {err}")
        db.rollback()
        return None
    finally:
        cursor.close()

# --- Dish Management Functions ---

def get_all_dishes():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM Pratos"
        cursor.execute(sql)
        return cursor.fetchall()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting all dishes: {err}")
        return []
    finally:
        cursor.close()

def get_dish_by_id(dish_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM Pratos WHERE id = %s"
        cursor.execute(sql, (dish_id,))
        return cursor.fetchone()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting dish by ID {dish_id}: {err}")
        return None
    finally:
        cursor.close()

def add_dish(name, description, allergens_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "INSERT INTO Pratos (name, description, allergens_id) VALUES (%s, %s, %s)"
        values = (name, description, allergens_id)
        cursor.execute(sql, values)
        db.commit()
        return cursor.lastrowid
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error adding dish: {err}")
        db.rollback()
        return None
    finally:
        cursor.close()

def update_dish(dish_id, name, description, allergens_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "UPDATE Pratos SET name = %s, description = %s, allergens_id = %s WHERE id = %s"
        values = (name, description, allergens_id, dish_id)
        cursor.execute(sql, values)
        db.commit()
        return cursor.rowcount > 0 # Return True if a row was updated
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error updating dish {dish_id}: {err}")
        db.rollback()
        return False
    finally:
        cursor.close()

def delete_dish(dish_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "DELETE FROM Pratos WHERE id = %s"
        cursor.execute(sql, (dish_id,))
        db.commit()
        return cursor.rowcount > 0 # Return True if a row was deleted
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error deleting dish {dish_id}: {err}")
        db.rollback()
        return False
    finally:
        cursor.close()

# --- Allergen Management Functions ---

def get_all_allergens():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM Alergenos"
        cursor.execute(sql)
        return cursor.fetchall()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting all allergens: {err}")
        return []
    finally:
        cursor.close()

def get_allergen_by_id(allergen_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM Alergenos WHERE id = %s"
        cursor.execute(sql, (allergen_id,))
        return cursor.fetchone()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting allergen by ID {allergen_id}: {err}")
        return None
    finally:
        cursor.close()

def get_allergen_by_name(name):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM Alergenos WHERE name = %s"
        cursor.execute(sql, (name,))
        return cursor.fetchone()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting allergen by name {name}: {err}")
        return None
    finally:
        cursor.close()

def add_allergen(name):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "INSERT INTO Alergenos (name) VALUES (%s)"
        cursor.execute(sql, (name,))
        db.commit()
        return cursor.lastrowid
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error adding allergen: {err}")
        db.rollback()
        return None
    finally:
        cursor.close()

def update_allergen(allergen_id, name):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "UPDATE Alergenos SET name = %s WHERE id = %s"
        values = (name, allergen_id)
        cursor.execute(sql, values)
        db.commit()
        return cursor.rowcount > 0 # Return True if a row was updated
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error updating allergen {allergen_id}: {err}")
        db.rollback()
        return False
    finally:
        cursor.close()

def delete_allergen(allergen_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "DELETE FROM Alergenos WHERE id = %s"
        cursor.execute(sql, (allergen_id,))
        db.commit()
        return cursor.rowcount > 0 # Return True if a row was deleted
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error deleting allergen {allergen_id}: {err}")
        db.rollback()
        return False
    finally:
        cursor.close()

# --- Menu Item Management Functions ---

def get_all_menu_items():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = """
            SELECT Ementas.id, Ementas.week_start_date, Ementas.week_end_date, Ementas.day_of_week, Pratos.name AS dish_name, Ementas.dish_id
            FROM Ementas
            JOIN Pratos ON Ementas.dish_id = Pratos.id
        """
        cursor.execute(sql)
        return cursor.fetchall()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting all menu items: {err}")
        return []
    finally:
        cursor.close()

def get_menu_item_by_id(menu_item_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = """
            SELECT Ementas.id, Ementas.week_start_date, Ementas.week_end_date, Ementas.day_of_week, Pratos.name AS dish_name, Ementas.dish_id
            FROM Ementas
            JOIN Pratos ON Ementas.dish_id = Pratos.id
            WHERE Ementas.id = %s
        """
        cursor.execute(sql, (menu_item_id,))
        return cursor.fetchone()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting menu item by ID {menu_item_id}: {err}")
        return None
    finally:
        cursor.close()

def add_menu_item(week_start_date, week_end_date, day_of_week, dish_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "INSERT INTO Ementas (week_start_date, week_end_date, day_of_week, dish_id) VALUES (%s, %s, %s, %s)"
        values = (week_start_date, week_end_date, day_of_week, dish_id)
        cursor.execute(sql, values)
        db.commit()
        return cursor.lastrowid
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error adding menu item: {err}")
        db.rollback()
        return None
    finally:
        cursor.close()

def update_menu_item(menu_item_id, week_start_date, week_end_date, day_of_week, dish_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "UPDATE Ementas SET week_start_date = %s, week_end_date = %s, day_of_week = %s, dish_id = %s WHERE id = %s"
        values = (week_start_date, week_end_date, day_of_week, dish_id, menu_item_id)
        cursor.execute(sql, values)
        db.commit()
        return cursor.rowcount > 0 # Return True if a row was updated
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error updating menu item {menu_item_id}: {err}")
        db.rollback()
        return False
    finally:
        cursor.close()

def delete_menu_item(menu_item_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "DELETE FROM Ementas WHERE id = %s"
        cursor.execute(sql, (menu_item_id,))
        db.commit()
        return cursor.rowcount > 0 # Return True if a row was deleted
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error deleting menu item {menu_item_id}: {err}")
        db.rollback()
        return False
    finally:
        cursor.close()

def get_menu_data():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = """
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
        """
        cursor.execute(sql)
        return cursor.fetchall()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting menu data: {err}")
        return []
    finally:
        cursor.close()
def get_user_by_id(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM users WHERE id = %s"
        cursor.execute(sql, (user_id,))
        return cursor.fetchone()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting user by ID: {err}")
        return None
    finally:
        cursor.close()

def get_user_by_username(username):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM users WHERE username = %s"
        cursor.execute(sql, (username,))
        return cursor.fetchone()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting user by username: {err}")
        return None
    finally:
        cursor.close()

def get_user_by_firebase_uid(firebase_uid):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM users WHERE firebase_uid = %s"
        cursor.execute(sql, (firebase_uid,))
        return cursor.fetchone()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting user by firebase_uid: {err}")
        return None
    finally:
        cursor.close()

def get_role_by_name(role_name):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM roles WHERE name = %s"
        cursor.execute(sql, (role_name,))
        return cursor.fetchone()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting role by name: {err}")
        return None
    finally:
        cursor.close()

def assign_role_to_user(user_id, role_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "INSERT INTO user_roles (user_id, role_id) VALUES (%s, %s)"
        values = (user_id, role_id)
        cursor.execute(sql, values)
        db.commit()
        return True
    except mysql.connector.IntegrityError as err:
        current_app.logger.warning(f"Role {role_id} already assigned to user {user_id}: {err}")
        return False # Role already assigned
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error assigning role to user: {err}")
        db.rollback()
        return False

def get_user_roles(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = """
            SELECT r.name
            FROM roles r
            JOIN user_roles ur ON r.id = ur.role_id
            WHERE ur.user_id = %s
        """
        cursor.execute(sql, (user_id,))
        # Return a list of role names
        return [row['name'] for row in cursor.fetchall()]
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting user roles for user {user_id}: {err}")
        return []
    finally:
        cursor.close()

# --- Dish Management Functions ---

def get_all_dishes():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM Pratos"
        cursor.execute(sql)
        return cursor.fetchall()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting all dishes: {err}")
        return []
    finally:
        cursor.close()

def get_dish_by_id(dish_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM Pratos WHERE id = %s"
        cursor.execute(sql, (dish_id,))
        return cursor.fetchone()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting dish by ID {dish_id}: {err}")
        return None
    finally:
        cursor.close()

def add_dish(name, description, allergens_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "INSERT INTO Pratos (name, description, allergens_id) VALUES (%s, %s, %s)"
        values = (name, description, allergens_id)
        cursor.execute(sql, values)
        db.commit()
        return cursor.lastrowid
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error adding dish: {err}")
        db.rollback()
        return None
    finally:
        cursor.close()

def update_dish(dish_id, name, description, allergens_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "UPDATE Pratos SET name = %s, description = %s, allergens_id = %s WHERE id = %s"
        values = (name, description, allergens_id, dish_id)
        cursor.execute(sql, values)
        db.commit()
        return cursor.rowcount > 0 # Return True if a row was updated
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error updating dish {dish_id}: {err}")
        db.rollback()
        return False
    finally:
        cursor.close()

def delete_dish(dish_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "DELETE FROM Pratos WHERE id = %s"
        cursor.execute(sql, (dish_id,))
        db.commit()
        return cursor.rowcount > 0 # Return True if a row was deleted
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error deleting dish {dish_id}: {err}")
        db.rollback()
        return False
    finally:
        cursor.close()

# --- Allergen Management Functions ---

def get_all_allergens():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM Alergenos"
        cursor.execute(sql)
        return cursor.fetchall()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting all allergens: {err}")
        return []
    finally:
        cursor.close()

def get_allergen_by_id(allergen_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM Alergenos WHERE id = %s"
        cursor.execute(sql, (allergen_id,))
        return cursor.fetchone()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting allergen by ID {allergen_id}: {err}")
        return None
    finally:
        cursor.close()

def get_allergen_by_name(name):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM Alergenos WHERE name = %s"
        cursor.execute(sql, (name,))
        return cursor.fetchone()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting allergen by name {name}: {err}")
        return None
    finally:
        cursor.close()

def add_allergen(name):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "INSERT INTO Alergenos (name) VALUES (%s)"
        cursor.execute(sql, (name,))
        db.commit()
        return cursor.lastrowid
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error adding allergen: {err}")
        db.rollback()
        return None
    finally:
        cursor.close()

def update_allergen(allergen_id, name):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "UPDATE Alergenos SET name = %s WHERE id = %s"
        values = (name, allergen_id)
        cursor.execute(sql, values)
        db.commit()
        return cursor.rowcount > 0 # Return True if a row was updated
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error updating allergen {allergen_id}: {err}")
        db.rollback()
        return False
    finally:
        cursor.close()

def delete_allergen(allergen_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "DELETE FROM Alergenos WHERE id = %s"
        cursor.execute(sql, (allergen_id,))
        db.commit()
        return cursor.rowcount > 0 # Return True if a row was deleted
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error deleting allergen {allergen_id}: {err}")
        db.rollback()
        return False
    finally:
        cursor.close()

# --- Menu Item Management Functions ---

def get_all_menu_items():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = """
            SELECT Ementas.id, Ementas.week_start_date, Ementas.week_end_date, Ementas.day_of_week, Pratos.name AS dish_name, Ementas.dish_id
            FROM Ementas
            JOIN Pratos ON Ementas.dish_id = Pratos.id
        """
        cursor.execute(sql)
        return cursor.fetchall()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting all menu items: {err}")
        return []
    finally:
        cursor.close()

def get_menu_item_by_id(menu_item_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = """
            SELECT Ementas.id, Ementas.week_start_date, Ementas.week_end_date, Ementas.day_of_week, Pratos.name AS dish_name, Ementas.dish_id
            FROM Ementas
            JOIN Pratos ON Ementas.dish_id = Pratos.id
            WHERE Ementas.id = %s
        """
        cursor.execute(sql, (menu_item_id,))
        return cursor.fetchone()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting menu item by ID {menu_item_id}: {err}")
        return None
    finally:
        cursor.close()

def add_menu_item(week_start_date, week_end_date, day_of_week, dish_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "INSERT INTO Ementas (week_start_date, week_end_date, day_of_week, dish_id) VALUES (%s, %s, %s, %s)"
        values = (week_start_date, week_end_date, day_of_week, dish_id)
        cursor.execute(sql, values)
        db.commit()
        return cursor.lastrowid
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error adding menu item: {err}")
        db.rollback()
        return None
    finally:
        cursor.close()

def update_menu_item(menu_item_id, week_start_date, week_end_date, day_of_week, dish_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "UPDATE Ementas SET week_start_date = %s, week_end_date = %s, day_of_week = %s, dish_id = %s WHERE id = %s"
        values = (week_start_date, week_end_date, day_of_week, dish_id, menu_item_id)
        cursor.execute(sql, values)
        db.commit()
        return cursor.rowcount > 0 # Return True if a row was updated
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error updating menu item {menu_item_id}: {err}")
        db.rollback()
        return False
    finally:
        cursor.close()

def delete_menu_item(menu_item_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = "DELETE FROM Ementas WHERE id = %s"
        cursor.execute(sql, (menu_item_id,))
        db.commit()
        return cursor.rowcount > 0 # Return True if a row was deleted
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error deleting menu item {menu_item_id}: {err}")
        db.rollback()
        return False
    finally:
        cursor.close()

def get_menu_data():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        sql = """
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
        """
        cursor.execute(sql)
        return cursor.fetchall()
    except mysql.connector.Error as err:
        current_app.logger.error(f"Error getting menu data: {err}")
        return []
    finally:
        cursor.close()