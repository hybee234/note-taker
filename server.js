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

//- Notes - public/notes/html -//
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//- Homepage - public/index.html -//
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//- Note - database -//
// [HL] Get notes from db.json, format it to 'utf8' and pass it back as response.

app.get('/api/notes', (req,res) => {
    fs.readFile('./db/db.json', 'utf8', (err, notedata) => {
        console.info (`   ***${req.method} records from db.json ('/api/notes')`);
        if (err) {
            console.error(err);
        } else {   
            const parsedNotes = JSON.parse(notedata);                                                           // Convert string into JSON object
            res.json(parsedNotes)
            console.info(parsedNotes)
        }
    });
    
});


//----------------------------------//
//- POST request to add a new NOTE -//
//----------------------------------//

app.post('/api/notes', (req, res) => {
    console.info(`   ***${req.method} record to db.json ('/api/notes')`);         // Log that a POST request was received
    
    const { text, title } = req.body;                                           // Destructuring assignment for the items in req.body (store values in req.body in a destructured manner)
    
    if (text && title) {                                                        // [HL] Validate required values are there
    const newNote = {                                                           // [HL] If values there then create new object
        id: uuidv4(),
        title, 
        text
    };

    // Obtain existing reviews
    fs.readFile('./db/db.json', 'utf8', (err, notedata) => {
        if (err) {
            console.error(err);
        } else {   
            const parsedNotes = JSON.parse(notedata);                                                           // Convert string into JSON object
            parsedNotes.push(newNote);                                                                          // Push new Review into pasedReviews Array
            console.info("Showing parsed Notes")
            console.info(parsedNotes)
            
            fs.writeFile( './db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) =>                   // Write updated reviews back to db.json
                writeErr ? console.error(writeErr) : console.info('Successfully updated notes!')
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
        res.status(500).json('Error in saving Note');
    }
});


//-----------------//
//- Listener PORT -//
//-----------------//

app.listen(PORT, () =>
    console.log(`Listening for requests on port ${PORT}! 🏎️`)
);
