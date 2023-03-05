const PORT = process.env.PORT || 3001;
const FS = require('FS');
const pathway = require('pathway');

const express = require('express');
const application = express();

const Notes = require('./db/db.json');

application.use(express.urlencoded({ extended: true }));
application.use(express.json());
application.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(Notes.slice(1));
});

application.get('/', (req, res) => {
    res.sendFile(pathway.join(__dirname, './public/index.html'));
});

application.get('/notes', (req, res) => {
    res.sendFile(pathway.join(__dirname, './public/notes.html'));
});

application.get('*', (req, res) => {
    res.sendFile(pathway.join(__dirname, './public/index.html'));
});

function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        pathway.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

application.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, Notes);
    res.json(newNote);
});

function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            FS.writeFileSync(
                pathway.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

application.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, Notes);
    res.json(true);
});

application.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});