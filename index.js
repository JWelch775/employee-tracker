const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connection = mysql2.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Azrael73094!',
    database: 'employee_db',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id: ${connection.threadId}`);
    init();
});

function init() {
    userPrompt();
}

const userPrompt = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Please select what you would like to do:",
            name: "choice",
            choices: [
                "View All Employees",
                "View All Roles",
                "View All Departments",
                "View All Managers",
                "View All Employees By Role",
                "View All Employees By Department",
                "View All Employees By Manager",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Add Manager",
                "Update Employee Role",
                "Update Employee Manager",
                "Delete Employee",
                "Delete Role",
                "Delete Department"
            ]
        }
    ]).then((value) => {
        switch (value.choice) {
            // Call a function for each individual choice in the prompt
            case "View All Employees":
                viewAllEmployees();
                break;

            case "View All Roles":
                viewAllRoles();
                break;

            case "View All Departments":
                viewAllDepartments();
                break;

            case "View All Managers":
                viewAllManagers();
                break;

            case "View All Employees By Role":
                viewByRole();
                break;

            case "View All Employees By Department":
                viewByDepartment();
                break;

            case "View All Employees By Manager":
                viewByManager();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Add Role":
                addRole();
                break;

            case "Add Department":
                addDepartment();
                break;

            case "Add Manager":
                addManager();
                break;

            case "Update Employee Role":
                updateRole();
                break;

            case "Update Employee Manager":
                updateManager();
                break;

            case "Delete Employee":
                deleteEmployee();
                break;

            case "Delete Role":
                deleteRole();
                break;

            case "Delete Department":
                deleteDepartment();
                break;
        }
    })
}

const viewAllEmployees = () => {
    connection.query(
        "SELECT employee.first_name, employee.last_name FROM employee",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            userPrompt();
        });
}

const viewAllRoles = () => {
    connection.query(
        "SELECT * FROM role",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            userPrompt();
        });
}

const viewAllDepartments = () => {
    connection.query(
        "SELECT * FROM department",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            userPrompt();
        });
}

const viewAllManagers = () => {
    connection.query(
        "SELECT e.manager_id, manager.first_name, manager.last_name FROM employee AS e LEFT JOIN employee AS manager ON e.manager_id = manager.id;",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            userPrompt();
        }
    )
}

const viewByRole = () => {
    connection.query(
        "SELECT employee.first_name, employee.last_name, employee.role_id, role.title, role.salary, role.department_id FROM employee INNER JOIN role ON employee.role_id = role.id;",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            userPrompt();
        });
}

const viewByDepartment = () => {
    connection.query(
        "SELECT employee.first_name, employee.last_name, department.dep_name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            userPrompt();
        });
}

const viewByManager = () => {
    connection.query(
        "SELECT e.first_name AS empfn, e.last_name AS empln, e.manager_id, manager.first_name AS manfn, manager.last_name AS manln FROM employee AS e LEFT JOIN employee AS manager ON e.manager_id = manager.id;",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            userPrompt();
        }
    )
}

rolesArray = [];
const chooseRole = () => {
    connection.query(
        "SELECT * FROM role",
        (err, res) => {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                rolesArray.push(res[i].title);
            }
        });
    return rolesArray;
}

managerArray = [];
const chooseManager = () => {
    connection.query(
        "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
        (err, res) => {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                managerArray.push(res[i].manager_id);
            }
        });
    return managerArray;
}

const addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employees first name?",
            name: "firstName"
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName"
        },
        {
            type: "list",
            message: "What is the employee's role?",
            name: "role",
            choices: chooseRole()
        },
        {
            type: "input",
            message: "What is the ID of this employee's manager?",
            name: "manager"
        }
    ]).then((value) => {
        var roleId = chooseRole().indexOf(value.role) + 1;
        var managerId = chooseManager().indexOf(value.manager) + 1;
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: value.firstName,
                last_name: value.lastName,
                manager_id: managerId,
                role_id: roleId
            },
            (err) => {
                if (err) throw err;
                console.log("New employee added");
                userPrompt();
            })

    })
}

const addRole = () => {
    connection.query(
        "SELECT * FROM role",
        (err, res) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is this employee's role?",
                    name: "title"
                },
                {
                    type: "input",
                    message: "What is the salary of this role?",
                    name: "salary"
                },
                {
                    type: "input",
                    message: "What is the department ID of this role?",
                    name: "departmentId"
                }
            ]).then((res) => {
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: res.title,
                        salary: res.salary,
                        department_id: res.departmentId
                    },
                    (err) => {
                        if (err) throw err;
                        console.table(res);
                        userPrompt();
                    }
                )
            })
        })
}

const addDepartment = () => {
    connection.query(
        "SELECT * FROM department",
        (err, res) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the name of the department your want to add?",
                    name: "depName"
                }
            ]).then((res) => {
                connection.query(
                    "INSERT INTO department SET ?",
                    {
                        dep_name: res.depName
                    },
                    (err) => {
                        if (err) throw err;
                        console.table(res);
                        userPrompt();
                    }
                )
            })
        })
}

const addManager = () => {
    connection.query(
        "SELECT * FROM manager;",
        (err, res) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the manager's first name?",
                    name: "firstName"
                },
                {
                    type: "input",
                    message: "What is the managers last name?",
                    name: "lastName"
                }
            ]).then((value) => {
                connection.query(
                    "INSERT INTO manager SET ?",
                    {
                        first_name: value.firstName,
                        last_name: value.lastName
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log("New manager has been added");
                        console.table(res);
                        userPrompt();
                    }
                )
            })
        }
    )
}

const updateRole = () => {
    connection.query(
        "SELECT * FROM employee;",
        (err, res) => {
            if (err) throw err;
            inquirer.prompt([ 
                {
                    type: "rawlist",
                    message: "What is the employees last name?",
                    name: "lastName",
                    choices: () => {
                        var lastName = [];
                        for (var i = 0; i < res.length; i++) {
                            lastName.push(res[i].last_name);
                        }
                        return lastName;
                    }
                },
                {
                    type: "rawlist",
                    message: "What is the employee's new role?",
                    name: "role",
                    choices: chooseRole()
                }
            ]).then((value) => {
                var roleId = chooseRole().indexOf(value.role) + 1;
                connection.query(`UPDATE employee SET role_id = ${roleId} WHERE last_name = ?`,
                    [value.lastName],
                    (err, res) => {
                        if (err) throw err;
                        console.log("Employee's role updated");
                        console.table(res);
                        userPrompt();
                    }
                )
            })
        })
}

var managerArr = [];
const selectManager = () => {
    connection.query(
        "SELECT * FROM manager;",
        (err, res) => {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                managerArr.push(res[i].id);
            }
        });
    return managerArr;
}

const updateManager = () => {
    connection.query(
        "SELECT * FROM employee;",
        (err, res) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    type: "rawlist",
                    message: "What is the employees last name?",
                    name: "lastName",
                    choices: () => {
                        var lastName = [];
                        for (var i = 0; i < res.length; i++) {
                            lastName.push(res[i].last_name);
                        }
                        return lastName;
                    }
                },
                {
                    type: "rawlist",
                    message: "What is the id of the employee's new manager?",
                    name: "manager",
                    choices: selectManager()
                }
            ]).then((value) => {
                var managerId = selectManager().indexOf(value.manager) + 1;
                connection.query(`UPDATE employee SET manager_id = ${managerId} WHERE last_name = ?`,
                    [value.lastName],
                    (err, res) => {
                        if (err) throw err;
                        console.log("Employee's manager updated");
                        console.table(res);
                        userPrompt();
                    }
                )
            })
        })
}

const deleteEmployee = () => {
    connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name FROM employee;",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            inquirer.prompt([
                {
                    type: "input",
                    message: "Choose the ID of the employee that you want to delete:",
                    name: "employee"
                },
            ]).then((value) => {
                connection.query(
                    `DELETE FROM employee WHERE id = ?;`,
                    [value.employee],
                    (err, res) => {
                        if (err) throw err;
                        console.log("Employee deleted");
                        console.table(res);
                        userPrompt();
                    })
            })
        })
}

const deleteRole = () => {
    connection.query(
        "SELECT role.id, role.title, role.salary, role.department_id FROM role;",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            inquirer.prompt([
                {
                    type: "input",
                    message: "Choose the ID of the role that you want to delete:",
                    name: "role"
                },
            ]).then((value) => {
                connection.query(
                    `DELETE FROM role WHERE id = ?;`,
                    [value.role],
                    (err, res) => {
                        if (err) throw err;
                        console.log("Role deleted");
                        console.table(res);
                        userPrompt();
                    })
            })
        })
}

const deleteDepartment = () => {
    connection.query(
        "SELECT department.id, department.dep_name FROM department;",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            inquirer.prompt([
                {
                    type: "input",
                    message: "Choose the ID of the department that you want to delete:",
                    name: "department"
                },
            ]).then((value) => {
                connection.query(
                    `DELETE FROM department WHERE id = ?;`,
                    [value.department],
                    (err, res) => {
                        if (err) throw err;
                        console.log("Department deleted");
                        console.table(res);
                        userPrompt();
                    })
            })
        })
}