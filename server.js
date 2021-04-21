const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
require('dotenv').config();

const connection = mysql2.createConnection({
    host: 'localhost',
    port: '3306',
    user: "root",
    password: "password",
    database: "employee_db",
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id: ${connection.threadId}`);
    init();
});

function init() {
    userPrompt();
}


function userPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'choice',
            choices: [
                "View all Employees?", 
                "View all Employee's By Roles?",
                "View all Emplyees By Deparments", 
                "Update Employee",
                "Add Employee?",
                "Add Role?",
                "Add Department?"
            ]
        }
    ]).then(function(val){
        switch (val.choice) {
            case 'View all Employees?':
                //view employee function call
                break;

            case 'View all Employees by role?':
                //view by role function call
                break;
            
            case 'View all Employees by department?':
                //view by department function call
                break;

            case 'Add new Employee?':
                //add employee function call
                break;

            case 'Add Role?':
                //add role function call
                break;

            case 'Add department?':
                //add new department function call
                break;
                
        }
    })
}