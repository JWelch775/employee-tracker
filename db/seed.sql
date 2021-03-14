USE employee_db;

INSERT INTO department (dep_name)
VALUES ('Finance'),
('Operation'),
('Maintenance'),
('Sales'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Accountant', 3000, 1),
('Engineer', 3000, 2),
('Technician', 2000, 3),
('Marketer', 3000, 4),
('Lawyer', 3000, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Derfo', 'Blood', 1, null),
(2, 'Justin', 'Welch', 1, null),
(3, 'Chelsea', 'Silvey', 4, 4),
(4, 'Elias', 'McDonald', 3, null),
(5, 'Austin', 'Dunlap', 2, 1);
