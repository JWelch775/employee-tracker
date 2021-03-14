DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

-- TABLES HERE --

-- Table 1 --
CREATE TABLE department (
id INTEGER (100) auto_increment NOT NULL,
dep_name VARCHAR (100) NOT NULL,
PRIMARY KEY (id)
);

-- Table 2 --
CREATE TABLE role (
id INTEGER (100) auto_increment NOT NULL,
title VARCHAR (100) NOT NULL,
salary DECIMAL (10, 2) NOT NULL,
department_id INTEGER (100) NOT NULL,
CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE,
PRIMARY KEY (id)
);

-- Table 3 --
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


-- JOIN STATEMENTS HERE --

-- JOIN 1 -- 
SELECT employee.first_name, employee.last_name, employee.role_id, role.title, role.salary, role.department_id
FROM employee
INNER JOIN role ON employee.role_id = role.id;

-- JOIN 2 --
SELECT employee.first_name, employee.last_name, department.dep_name AS Department
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
ORDER BY employee.id;

-- JOIN 3 (for manager) --
SELECT e.first_name AS empfn, e.last_name AS empln, e.manager_id, manager.first_name AS manfn, manager.last_name AS manln
FROM employee AS e
LEFT JOIN employee AS manager ON e.manager_id = manager.id;
-- joins with self-referencing --> joins table on table