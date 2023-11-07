//----------------------------//
//- Global Variables/Requires-//
//----------------------------//
const express = require('express');
const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

const notesDB = require('./db/db.json');

//-------------//
//- Middleware-//
//-------------//

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//--------------------//
//- Express.js Routes-//
//--------------------//

//----------------//
//- GET requests- //
//----------------//

//- Homepage - public/index.html -//
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//- Notes - public/notes/html -//
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//- Note - database -//
// [HL] Existing notes to display within note take left hand side
app.get('/api/notes', (req,res) => {
    res.json (notesDB);
    console.info (`   ***${req.method} existing notes activated ('/api/notes')`);
    console.info (notesDB);
    
});


// // GET request for reviews
// app.get('/api/reviews', (req, res) => {
//   // Send a message to the client
//     res.json(`${req.method} request received to get reviews`);

//   // Log our request to the terminal
//     console.info(`${req.method} request received to get reviews`);
// });

//----------------------------------//
//- POST request to add a new NOTE -//
//----------------------------------//

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`   ***${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body (store values in req.body in a destructured manner)
    const { text, title } = req.body;

    // If all the required properties are present
    // [HL] Validate required values are there
    if (text && title) {
    // Variable for the object we will save
    // [HL] If values there then create new object
    const newNote = {
        id: uuidv4(),
        title, 
        text
    };

    // Obtain existing reviews
    fs.readFile('./db/db.json', 'utf8', (err, notedata) => {
        if (err) {
        console.error(err);
        } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(notedata);

        // Push new Review into pasedReviews Array
        parsedNotes.push(newNote);

        // Write updated reviews back to the file
        fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
            writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
        );
        }
    });

    const response = {
        status: 'success',
        body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting review');
    }
});

app.listen(PORT, () =>
    console.log(`Listening for requests on port ${PORT}! 🏎️`)
);
