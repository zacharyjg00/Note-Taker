const path = require("path");
const express = require("express");
const fs = require("fs");

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
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        } else {
            return res.json(JSON.parse(data));
        }
    })
});

app.post("/api/notes", (req, res) => {
    const newNote = req.body;


});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));