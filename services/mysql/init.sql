-- Create the database if it doesn't exist
-- CREATE DATABASE IF NOT EXISTS ualg_cantina;
-- USE ualg_cantina;

-- Create Alergenos table
CREATE TABLE IF NOT EXISTS Alergenos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Create Pratos table
CREATE TABLE IF NOT EXISTS Pratos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    allergens_id INT,
    FOREIGN KEY (allergens_id) REFERENCES Alergenos(id)
);

-- Create Ementas table
CREATE TABLE IF NOT EXISTS Ementas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    dish_id INT,
    FOREIGN KEY (dish_id) REFERENCES Pratos(id)
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    firebase_uid VARCHAR(255) UNIQUE NULL,
    email VARCHAR(255) UNIQUE NULL,
    hashed_password VARCHAR(225) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Insert initial data
INSERT INTO roles (name) VALUES ('admin');

-- Insert a default admin user (replace 'hashed_password_for_admin' with an actual hashed password)
-- You'll need to generate a hashed password using Werkzeug's generate_password_hash
INSERT INTO users (username, hashed_password) VALUES ('admin', 'hashed_password_for_admin');

-- Link the default admin user to the 'admin' role
-- Assumes the 'admin' user and 'admin' role are the first entries in their respective tables
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);