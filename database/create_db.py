import sqlite3

from werkzeug.security import generate_password_hash
DATABASE_FILE = 'cantina.db'

def create_database():
    conn = sqlite3.connect(DATABASE_FILE)
    cursor = conn.cursor()

    # Create Ementas table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Ementas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            week_start_date TEXT NOT NULL,
            week_end_date TEXT NOT NULL,
            day_of_week TEXT NOT NULL,
            dish_id INTEGER,
            FOREIGN KEY (dish_id) REFERENCES Pratos(id)
        )
    ''')

    # Create Pratos table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Pratos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            allergens_id INTEGER,
            FOREIGN KEY (allergens_id) REFERENCES Alergenos(id)
        )
    ''')

    # Create Alergenos table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Alergenos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )
    ''')

    # Create Controlo_de_Acesso table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Controlo_de_Acesso (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL, -- In a real application, store hashed passwords
            role TEXT NOT NULL
        )
    ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    create_database()
    print(f"Database '{DATABASE_FILE}' and tables created successfully.")