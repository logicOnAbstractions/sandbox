// var program = require('commander');
import program from 'commander'
import csv from 'csv'
import fs from 'fs'
import inquirer from 'inquirer'


/* creating a commandline program input using commander. defines the flags & arguments available & pipes them to process.argv */
program
    .version('0.0.1')
    .option('-l, --list [list]', 'list of customers in CSV file')
    .parse(process.argv)


/* parsing a csv file using csv. */
let parse = csv.parse;
let stream = fs.createReadStream(program.list).pipe(parse({delimiter:' '}))
stream.on('data', function (data) {
    let firstname = data[0];
    let lastname = data[1];
    let email = data[2];
    console.log(firstname, lastname, email)
});

/* defining an interactive program accepting user inputs according to some defined format */
let questions = [ {
    type: "input",
    name: "sender.email",
    message: "Sender's email addr - "
},
{
    type: "input",
    name: "sender.name",
    message: "Sender's name- "
},
{
    type: "input",
    name: "subject",
    message: "Subject line - "
}]

let contactList = [];
let streamInteractive = fs.createReadStream(program.list).pipe(parse({delimeter:' '}));

streamInteractive
    .on("error", function (err) {
    return console.error("Something is wrong: " + err.message);
})
    .on("data", function (data) {
        let name = data[0] + " " + data[1];
        let email = data[2];
        contactList.push({name:name, email:email});
    })
    .on("end", function () {
        inquirer.prompt(questions).then(function (answer) {
            console.log("Here's the Subject line, first & last nam: " + answer.subject + " " + answer.sender.name + " " + answer.sender.email )
        });
    });
