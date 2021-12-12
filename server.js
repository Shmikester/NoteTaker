const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// return to main
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// return to notes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// return notes json
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

// return home
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// call to make new note in json
app.post("/api/notes", (req, res) => {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
    let newNote = req.body;
    savedNotes.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(newNote);
});

// delete note
app.delete("/api/notes/:id", (req, res) => {
    const removeNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
    let x = req.params.id;
    const removeNote = removeNotes.findIndex( item => item.id === x );
    removeNotes.splice( removeNote, 1 );
    fs.writeFileSync("./db/db.json", JSON.stringify(removeNotes));
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.listen(PORT, () => {
    console.log(`App running on ${PORT}`);
});