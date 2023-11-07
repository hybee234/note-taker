//----------------------------//
//- Global Variables/Requires-//
//----------------------------//
const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
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
app.get('/api/notes', (req,res) =>
    res.json (notesDB)
)


// // GET request for reviews
// app.get('/api/reviews', (req, res) => {
//   // Send a message to the client
//     res.json(`${req.method} request received to get reviews`);

//   // Log our request to the terminal
//     console.info(`${req.method} request received to get reviews`);
// });

//-----------------//
//- POST requests- //
//-----------------//


// // POST request to add a review
// app.post('/api/reviews', (req, res) => {
//   // Log that a POST request was received
//     console.info(`${req.method} request received to add a review`);

//   // Destructuring assignment for the items in req.body
//   const { product, review, username } = req.body;  // [HL] Receive the data and put it into this structure

// POST data must be in the form of:
// {
// 	"product": "booboo",
// 	"review": "asdf",
// 	"username": "Hy"
// }

  // If all the required properties are present
//   if (product && review && username) {     // [HL] check that data is there (and in the right structure) and create new object
//     // Variable for the object we will save
//     const newReview = {
//         product,
//         review,
//         username,
//         upvotes: Math.floor(Math.random() * 100),
//         review_id: uuid(),
//     };

//     // Convert the data to a string so we can save it
//     const reviewString = JSON.stringify(newReview);

//     // Write the string to a file
//     fs.writeFile(`./db/${newReview.product}.json`, reviewString, (err) =>
//         err
//             ? console.error(err)
//             : console.log(
//                 `Review for ${newReview.product} has been written to JSON file`
//             )
//     );

//     const response = {
//         status: 'success',
//         body: newReview,
//     };

//     console.log(response);
//         res.status(201).json(response);
//     } else {
//         res.status(500).json('Error in posting review');
//     }
// });

app.listen(PORT, () =>
    console.log(`Listening for requests on port ${PORT}! 🏎️`)
);
