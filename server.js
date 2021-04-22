const inquirer = require("inquirer")
const mysql = require("mysql2")
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Azrael73094!",
    database: "employee_db"
  });

connection.connect(function(err) {
    if (err) throw err
    console.log("Connected as Id" + connection.threadId)
    userPrompt();
});

function userPrompt() {
    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: [
              'View all Employees?', 
              'View all Employees by Roles?',
              'View all Employees by Department?',
              'Add new Employee?',
              'Update Employee',
              'Add Role?',
              'Add Department?'
            ]
    }
]).then(function(val) {
        switch (val.choice) {
            case 'View all Employees?':
              viewAllEmployees();
              break;
    
          case 'View all Employees by Roles?':
              viewAllRoles();
              break;

          case 'View all Employees by Department?':
              viewAllDepartments();
              break;
          
          case 'Add new Employee?':
                //add new employee function call
                break;

          case 'Update Employee':
                //add update employee function call
                break;
      
            case 'Add Role?':
                //add new role function call
                break;
      
            case 'Add Department?':
                //add new department function call
                break;
    
            }
    })
}

function viewAllEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.dep_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      userPrompt()
  })
}

function viewAllRoles() {
  connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
  function(err, res) {
  if (err) throw err
  console.table(res)
  userPrompt()
  })
}

function viewAllDepartments() {
    connection.query("SELECT employee.first_name, employee.last_name, department.dep_name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      userPrompt()
    })
  }