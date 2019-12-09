const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const writeFileAsync = util.promisify(fs.writeFile);

function promptRole() {
    return inquirer.prompt([
        {
            type: "list",
            name: "employeeRole",
            message: "What is the role of the employee?",
            choices: ["Manager", "Engineer", "Intern"]
        }
    ]
    )}

function promptManager() {
    return inquirer.prompt([
        {
            type: "input",
            name: "team",
            message: "What is the team name?"
        },
        {
            type: "input",
            name: "role",
            message: "What is the role of the employee?"
        },
        {
            type: "input",
            name: "name",
            message: "What is the name of the employee?"
        },
        {
            type: "number",
            name: "id",
            message: "What is the employee ID?"
        },
        {
            type: "input",
            name: "email",
            message: "What is the email of the employee?"
        },
        {
            type: "input",
            name: "office",
            message: "What is the office number of the manager?"
        }
    ]
    )}
promptRole()
.then(function(){
    promptManager()
    .then(function (answer) {
        const teamName = answer.team
        const employeeName = answer.name
        const employeeRole = answer.role
        const employeeID = answer.id
        const employeeEmail = answer.email
        const employeeOffice = answer.office

        // console.log(teamName, employeeName, employeeRole, employeeID, employeeEmail, employeeOffice)

        // createTeamProfile(teamName)
        createManager(employeeName, employeeRole, employeeID, employeeEmail, employeeOffice, teamName)


    })
    .then(function () {
        console.log('goodbye')
    })
    .catch(function (err) {
        console.log(err)
    });

})



// function createTeamProfile(name) {
//     const templateFile = fs.readFileSync('./templates/main.html', {
//         encoding: 'utf8'
//     })
//     let n = name

//     let tempFile = templateFile.replace('{{ team }}', n)
//     tempFile = tempFile.replace('{{ name }}', "EVELYN")

//     writeFileAsync("./output/index.html", tempFile)
// }

function createManager(empN, empR, empId, empE, empO, teamN) {
    const templateFile = fs.readFileSync('./templates/main.html', {
        encoding: 'utf8'
    })
    let tmpN = empN
    let tmpR = empR
    let tmpId = empId
    let tmpE = empE
    let tmpO = empO
    let tmpT = teamN

    let tempFile = templateFile.replace('{{ name }}', tmpN)
    tempFile = tempFile.replace('{{ role }}', tmpR)
    tempFile = tempFile.replace('{{ id }}', tmpId)
    tempFile = tempFile.replace('{{ email }}', tmpE)
    tempFile = tempFile.replace('{{ email }}', tmpE)
    tempFile = tempFile.replace('{{ officeNumber }}', tmpO)
    tempFile = tempFile.replace('{{ team }}', tmpT)

    writeFileAsync("./output/index.html", tempFile)
}