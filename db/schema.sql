DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
id INTEGER (100) auto_increment NOT NULL,
dep_name VARCHAR (100) NOT NULL,
PRIMARY KEY (id)
);


CREATE TABLE role (
id INTEGER (100) auto_increment NOT NULL,
title VARCHAR (100) NOT NULL,
salary DECIMAL (10, 2) NOT NULL,
department_id INTEGER (100) NOT NULL,
CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE,
PRIMARY KEY (id)
);


CREATE TABLE employee (
id INTEGER (100) auto_increment NOT NULL,
first_name VARCHAR (100) NOT NULL,
last_name VARCHAR (100) NOT NULL,
role_id INTEGER (100) NOT NULL,
manager_id INTEGER (100),
CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id),
PRIMARY KEY (id)
);

SELECT * FROM department;

SELECT * FROM role;

SELECT * FROM employee;




