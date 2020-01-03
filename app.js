const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
const writeFileAsync = util.promisify(fs.writeFile);
const answers = []

// prompt for the initial role -- this function needs to be deprecated 
// after the promptmanager function refactoring is complete
// for now this is needed as part of the legacy code
function promptRole() {
    return inquirer.prompt([{
        type: "list",
        name: "employeeRole",
        message: "What is the role of the employee?",
        choices: ["Manager", "Engineer", "Intern"]
    }])
}

// questions to ask the user to build the full team profile 
// user is asked is the team member is a manager, and engineer, or an intern
function promptManager(role) {
    const prompts = {
        'Manager': [{
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
        ],
        'Engineer': [{
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
                name: "github",
                message: "What is their GitHub?"
            },
            {
                type: "input",
                name: "email",
                message: "What is the email of the employee?"
            },
        ],
        'Intern': [{
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
                name: "school",
                message: "What is the name of the school?"
            },
        ]
    }
    return inquirer.prompt(prompts[role.employeeRole])
}

// the prompt chain pulls together the different functions needed
// for every team member entered handleAnswer pushes the object to the answers array
function promptChain() {
    promptRole().then(promptManager).then(handleAnswer).then(promptContinue)
}

// this functions takes the response from the user and pushes an object to an array
function handleAnswer(answer) {
    answers.push(answer)
}

// this function constructs a loop for continuing to add team member
// if yes, then the promptChain function is called
// if no, then create the html from the template file
function promptContinue() {
    inquirer.prompt([{
        type: "list",
        name: "continue",
        message: "Keep adding people?",
        choices: ["Yes", "No"]
    }]).then(addMore => {
        if (addMore.continue === "Yes") {
            promptChain()
        } else {
            createTeamFromTemplate()
        }
    })
}

// call promtChain
promptChain()

// create team from the template files using the answers gathered during the prompt chain
function createTeamFromTemplate() {
    const main = fs.readFileSync('./templates/main.html', {
        encoding: 'utf8'
    })

    // in the answers array, for each item in the array the appropriate template is called based on role
    let newArray = answers.map(answer => {
        switch (answer.role) {
            case "Engineer": {
                const engineer = fs.readFileSync('./templates/engineer.html', {
                    encoding: 'utf8'
                })

                let tempEng = engineer.replace('{{ name }}', answer.name)
                tempEng = tempEng.replace('{{ id }}', answer.id)
                tempEng = tempEng.replace('{{ role }}', answer.role)
                tempEng = tempEng.replace('{{ email }}', answer.email) //first instnace of email
                tempEng = tempEng.replace('{{ email }}', answer.email) //second instance of email
                tempEng = tempEng.replace('{{ github }}', answer.github) //first instance of github
                tempEng = tempEng.replace('{{ github }}', answer.github) //second instance of github
                return tempEng
                break;
            }
            case "Manager":
                const manager = fs.readFileSync('./templates/manager.html', {
                    encoding: 'utf8'
                });
                let tempMgr = manager.replace('{{ name }}', answer.name);
                tempMgr = tempMgr.replace('{{ role }}', answer.role);
                tempMgr = tempMgr.replace('{{ id }}', answer.id);
                tempMgr = tempMgr.replace('{{ email }}', answer.email); //first instance of email
                tempMgr = tempMgr.replace('{{ email }}', answer.email); //second instance of email
                tempMgr = tempMgr.replace('{{ officeNumber }}', answer.office); //second instance of email
                return tempMgr;
                break;
            case "Intern": {
                const intern = fs.readFileSync('./templates/intern.html', {
                    encoding: 'utf8'
                })

                let tempIntern = intern.replace('{{ name }}', answer.name)
                tempIntern = tempIntern.replace('{{ id }}', answer.id)
                tempIntern = tempIntern.replace('{{ role }}', answer.role)
                tempIntern = tempIntern.replace('{{ email }}', answer.email) //first instnace of email
                tempIntern = tempIntern.replace('{{ email }}', answer.email) //second instance of email
                tempIntern = tempIntern.replace('{{ school }}', answer.school)
                return tempIntern
                break;
            }
            default:
                throw new Error('bad role');
        }
    })

    let tempFile = main.replace('<div> {{ cards }} </div>', Object.values(newArray))
    const teamIndex = answers.findIndex(element => element = 'manager') // find index where the team name is stored
    const teamName = answers[teamIndex].team // set the variable equal to the team name
    console.log("the team name is: " + teamName)
    tempFile = tempFile.replace('{{ team }}', teamName)

    writeFileAsync("./output/index.html", tempFile)
    // console.log(Object.values(answers))
    // console.log(Object.values(newArray))

}