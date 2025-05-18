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

-- Create Controlo_de_Acesso table
CREATE TABLE IF NOT EXISTS Controlo_de_Acesso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Insert a default admin user (replace 'hashed_password_here' with an actual hashed password)
INSERT INTO Controlo_de_Acesso (username, password) VALUES ('admin', 'hashed_password_here');