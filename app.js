const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const writeFileAsync = util.promisify(fs.writeFile);


function promptUser() {
    return inquirer.prompt([{
            type: "input",
            name: "team",
            message: "What is the team name?"
        },
        {
            type: "input",
            name: "name",
            message: "What is the name of the employee?"
        },
        {
            type: "input",
            name: "role",
            message: "What is the role of the employee?"
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
    ]);
}

promptUser()
    .then(function (answer) {
        const teamName = answer.team
        const employeeName = answer.name
        const employeeRole = answer.role
        const employeeID = answer.id
        const employeeEmail = answer.email

        console.log(teamName, employeeName, employeeRole, employeeID, employeeEmail)

        createTeamProfile(teamName)
        createManager(employeeName, employeeRole, employeeID, employeeEmail)


    })
    .then(function () {
        console.log('goodbye')
    })
    .catch(function (err) {
        console.log(err)
    });

function createTeamProfile(name) {
    const templateFile = fs.readFileSync('./templates/main.html', {
        encoding: 'utf8'
    })
    let n = name

    let tempFile = templateFile.replace('{{ team }}', n)
    tempFile = tempFile.replace('{{ name }}', "EVELYN")

    writeFileAsync("./output/index.html", tempFile)
}

function createManager(empN, empR, empId, empE) {
    const templateFile2 = fs.readFileSync('./templates/main.html', {
        encoding: 'utf8'
    })
    let tmpN = empN
    let tmpR = empR
    let tmpId = empId
    let tmpE = empE

    console.log("value of tempN is", tmpN)

    let tempFile2 = templateFile2.replace('{{ name }}', "EVELYN")
    tempFile2 = tempFile2.replace('{{ role }}', tmpR)
    tempFile2 = tempFile2.replace('{{ id }}', tmpId)
    tempFile2 = tempFile2.replace('{{ email }}', tmpE)
    tempFile2 = tempFile2.replace('{{ email }}', tmpE)

    writeFileAsync("./output/indexNEW.html", tempFile2)
}