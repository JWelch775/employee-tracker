const inquirer = require("inquirer")
const mysql = require("mysql2")
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
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
              addEmployee();
              break;
      
            case 'Add Role?':
              addRole();
              break;
      
            case 'Add Department?':
              addDepartment();
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


var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}


var managersArr = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}


function addEmployee() { 
    inquirer.prompt([
        {
          name: "firstname",
          type: "input",
          message: "Enter their first name "
        },
        {
          name: "lastname",
          type: "input",
          message: "Enter their last name "
        },
        {
          name: "role",
          type: "list",
          message: "What is their role? ",
          choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "What is their managers name?",
            choices: selectManager()
        }
    ]).then(function (val) {
      var roleId = selectRole().indexOf(val.role) + 1
      var managerId = selectManager().indexOf(val.choice) + 1
      connection.query("INSERT INTO employee SET ?", 
      {
          first_name: val.firstname,
          last_name: val.lastname,
          manager_id: managerId,
          role_id: roleId
          
      }, function(err){
          if (err) throw err
          console.table(val)
          userPrompt()
      })

  })
}


function addRole() {
  connection.query('SELECT * FROM department',
   function(err, res) {
      if (err) throw err;
  
      inquirer 
      .prompt([
          {
              name: 'new_role',
              type: 'input', 
              message: "What new role would you like to add?"
          },
          {
              name: 'salary',
              type: 'input',
              message: 'What is the salary of this role? (Enter a number)'
          },
          {
              name: 'Department',
              type: 'list',
              choices: function() {
                  var deptArry = [];
                  for (let i = 0; i < res.length; i++) {
                  deptArry.push(res[i].dep_name);
                  }
                  return deptArry;
              },
          }
      ]).then(function (answer) {
          var departmentId;
          for (let a = 0; a < res.length; a++) {
              if (res[a].name == answer.department) {
                  departmentId = res[a].id;
              }
          }
  
          connection.query(
              'INSERT INTO role SET ?',
              {
                  title: answer.new_role,
                  salary: answer.salary,
                  department_id: departmentId
              },
              function (err, res) {
                  if(err)throw err;
                  console.log('Your new role has been added!');
                  userPrompt();
              })
      })
  })
};

  function addDepartment() {
    inquirer.prompt([
        {
            name: "dep_name",
            type: "input",
            message: "Enter new department:"
        }
    ]).then(answers => {
        connection.query("INSERT INTO department.dep_name  VALUES (?)", [answers.dep_name]);
        console.log(`${answers.dep_name} was added to departments.`);
        userPrompt();
    })
};
