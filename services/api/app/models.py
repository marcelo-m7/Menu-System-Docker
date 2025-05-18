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