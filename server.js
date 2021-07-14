const path = require("path");
const express = require("express");
const fs = require("fs");
let jsonData = require("./db/db.json");
let uuid = require("uuid");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get("/api/notes", (req, res) => {
    return res.json(jsonData);
});

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
    })
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));