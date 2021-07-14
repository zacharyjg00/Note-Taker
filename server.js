// All of the required packages for the app
const path = require("path");
const express = require("express");
const fs = require("fs");
let uuid = require("uuid");

// This is where the read happens for the db.json file and it is updated throughout the app
let jsonData = require("./db/db.json");

// Instantiates the express server and the port which it runs on
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// This is the basic route which will send users to the starting page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// This is a GET to display the actual notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// This GET grabs all of the data from the db.json file and returns it to be parsed and displayed by the front end
app.get("/api/notes", (req, res) => {
    return res.json(jsonData);
});

// This POST is called whenever the user wishes to save a new note. This generates a unique id for the note and then writes the new set of data to the db.json file
app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    newNote.id = uuid.v4();
    jsonData.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(jsonData), err => {
        if (err) {
            console.log('Error writing file', err);
        } else {
            return res.json(jsonData);
        }
    })
});

// This DELETE creates a new array and goes through all of the notes in the jsonData and adds them to the array so long as they do not have the id that matches the note to be deleted
app.delete("/api/notes", (req, res) => {
    let newJson = [];

    jsonData.forEach(note => {
        if(note.id != req.body.id) {
            newJson.push(note);
        }
    });

    fs.writeFile('./db/db.json', JSON.stringify(newJson), err => {
        if (err) {
            console.log('Error writing file', err);
        } else {
            jsonData = newJson;
            return res.json(newJson);
        }
    });
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));