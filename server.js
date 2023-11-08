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

//- Notes html page -//
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//- Homepage html page -//
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//- GET request notes API -//
    // [HL] Get notes from db.json, format it to 'utf8' and pass it back as response.

app.get('/api/notes', (req,res) => {
//     res.json(notesDB)
//     console.info(notesDB.length)    
// });

    fs.readFile('./db/db.json', 'utf8', (err, notedata) => {
        console.info (`\n\n  *** ${req.method} request received ('/api/notes')`);
        if (err) {            
            console.error(err);
        } else {  
            const parsedNotes = JSON.parse(notedata)  ;                                                         // Convert string into JSON object
            res.json(parsedNotes);
            // console.info(parsedNotes);
        };
    });    
});

//----------------------------------//
//- POST request to add a new NOTE -//
//----------------------------------//

app.post('/api/notes', (req, res) => {
    console.info(`\n\n  *** ${req.method} request received ('/api/notes')`);       // Log that a POST request was received    
    const { text, title } = req.body;                                           // Destructuring assignment for the items in req.body (store values in req.body in a destructured manner)
    
    if (text && title) {                                                        // [HL] Validate required values are there
        const newNote = {                                                           // [HL] If values there then create new object
            id: uuidv4(),
            title, 
            text
        };
        console.log(`   New note added:`)
        console.log(newNote)

        // Obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, notedata) => {
            if (err) {
                console.error("Uh oh! I've run into an error")
                console.error(err);
            } else {   
                const parsedNotes = JSON.parse(notedata);                                                           // Convert string into JSON object
                parsedNotes.push(newNote)
                fs.writeFile( './db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) =>                   // Write updated reviews back to db.json
                        writeErr ? console.error(writeErr) : console.info('   Success!')
                );
                return;
                
            };
        });

        const response = {
            status: 'success',
            body: newNote,
        };
                
        res.status(201).json(response);                                                                     // Provide a response back to the API to allow it go continue on

    } else {
        res.status(500).json('Error in saving Note');
        }
});



//---------------------------------//
//- Splice a record out (delete) - //
//---------------------------------//

app.post('/api/deletenote/:id', (req, res) => {
    console.info(`\n\n *** ${req.method} request to splice record from db.json ('/api/notes')`);         // Log that a POST request was received
    console.info(`   Note ID: ${req.params.id}`) //Note ID to splice
    
    // Obtain existing notes
    const saveNewNote = new Promise (function(resolve, reject){
        fs.readFile('./db/db.json', 'utf8', function (err, noteData) {
            if (err) {
                reject(err); 
            } else {
                resolve(noteData);
            };
        });
    })
    .then ((noteData) => {
        const parsedNotes = JSON.parse(noteData);                                                           // Convert string into JSON object
        let spliceIndex = parsedNotes.findIndex((obj) => obj.id === req.params.id)                          // let deleteIndex = index value where req.params.id matches note ID in parsedNotes Array
        console.info(`   spliceIndex = ${spliceIndex}: `)
        console.info(parsedNotes[spliceIndex])
        
        parsedNotes.splice(spliceIndex,1)

        fs.writeFile( './db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) =>                   // Write updated reviews back to db.json
            writeErr ? console.error(writeErr) : console.info('   Successfully spliced note')
        )

        const response = {
            status: 'splice succeeded'
        };

        res.status(201).json(response);                                                                     // Provide a response back to the API to allow it go continue on

        return;
    })
    .catch ((err) => {
        res.status(500).json('Delete/Splice ID failed');
        return;        
    })

});


//-----------------//
//- Listener PORT -//
//-----------------//

app.listen(PORT, () =>
    console.log(`Listening for requests on port ${PORT}! 🏎️`)
);
