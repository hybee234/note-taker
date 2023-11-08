//--------------------//
//- Global Variables -//
//--------------------//
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
    noteTitle = document.querySelector('.note-title');      // THe note title of the note in the main page area
    noteText = document.querySelector('.note-textarea');    // The note text  in the main page area
    saveNoteBtn = document.querySelector('.save-note');
    newNoteBtn = document.querySelector('.new-note');
    noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
    elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
    elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

//------------------//
//- Fetch requests -//
//------------------//

// [HL] GET notes from db.json//
const getNotes = () =>
    fetch('/api/notes', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
    })
    //  .then (()=> {console.log("\n\n\n > getNotes API Called") })

// [HL] POST notes to db.json//

const saveNote = (newNote) =>
    fetch('/api/notes', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
    });

// [HL] DELETE notes from db.json//

const deleteNote = (id) =>
    fetch(`/api/deletenote/${id}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        
    });

//---------------------------------//
//- Function - render Active Note -//
//---------------------------------//

const renderActiveNote = () => {
    hide(saveNoteBtn);                              // Hides the save button

    if (activeNote.id) {                            // if activeNote.id is valid (in db.json file)
        noteTitle.setAttribute('readonly', true);   // set elements to ready-only
        noteText.setAttribute('readonly', true);    // set elements to ready-only
        noteTitle.value = activeNote.title;         // set Note title to active Note
        noteText.value = activeNote.text;           // set Note body  to active Note body
    } else {
        noteTitle.removeAttribute('readonly');      // if activeNote.id isn't valid        
        noteText.removeAttribute('readonly');
        noteTitle.value = '';                       // Clear title
        noteText.value = '';                        // clear body
    }
};

//--------------------------------//
//- Function - Saving Note -//
//--------------------------------//

//Called by the save note button
const handleNoteSave = () => {
    console.log("\n\n\n > handleNoteSave() Called");       
    const note = {
        title: noteTitle.value,
        text: noteText.value,
    };
    saveNote(note).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

//-------------------------------------//
//- Function - Delete (Splice) record -//
//-------------------------------------//
// Truiggered by the deleteNote button

// Delete the clicked note
const handleNoteDelete = (e) => {
    console.log("\n\n\n > handleNoteDelete() Called");   
  // Prevents the click listener for the list from being called when the button inside of it is clicked
    e.stopPropagation();

    const note = e.target;    
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;   //grabs the note ID of the parent element
        
    console.log (`NoteId = ${noteId}`)   

    deleteNote(noteId).then(() => {  
        getAndRenderNotes(); // get notes from db.json
        renderActiveNote(); // render onto right side
    });
};

//----------------------------------------------------------------------------//
//- Function - Set activeNote to an existing note in response to clicking it -//
//----------------------------------------------------------------------------//

// Triggered by click event listener on dynamically created notes on left of screen
// Sets the activeNote and displays it
const handleNoteView = (e) => {
    console.log("\n\n\n > handleNoteView() Called");   
    e.preventDefault();
    activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note')); // Set clicked note as activeNote {"title","text"} - maybe active note also needs ID.   
    console.log(activeNote)   // [Delete at the end]
    renderActiveNote();
};

//--------------------------------------------------------------//
//- Function - Write Icon - clear Title and text for a new note-//
//--------------------------------------------------------------//

// Triggered by clicking ont the "plus" sign in top right to add new note
// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
    console.log("\n\n\n > handleNewNoteView() Called");   
    activeNote = {};                    // Clear activeNote
    renderActiveNote();
};

//------------------------------------//
//- Function - hide/show save button -//
//------------------------------------//

const handleRenderSaveBtn = () => {
    console.log("\n\n\n > handleRenderSaveBtn() Called");   
    if (!noteTitle.value.trim() || !noteText.value.trim()) {   // If note title or text is null/undefined then hide the save button, else show
        hide(saveNoteBtn);
    } else {
        show(saveNoteBtn);
    }
};

//-----------------------------//
//- Function - renderNoteList -//
//-----------------------------//

// Render the list of note titles
const renderNoteList = async (notes) => {
    console.log("\n\n\n > renderNoteList() Called");   
    let jsonNotes = await notes.json();
    if (window.location.pathname === '/notes') {
        noteList.forEach((el) => (el.innerHTML = ''));          // clear the existing list of notes (so that it can be repopulated)
    }

    let noteListItems = [];

    //------------------------------//
    //- Nested Function - createLi -//
    //------------------------------//

    // Returns HTML element with or without a delete button
    const createLi = (text, delBtn = true) => {                 // 'text' is passed through from createLi(note.title)
        const liEl = document.createElement('li');              // Create li element
        liEl.classList.add('list-group-item');                  // Add class to li element

        const spanEl = document.createElement('span');          // Create span element
        spanEl.classList.add('list-item-title');                // Add class to span element
        spanEl.innerText = text;                                // Update text in span to 'text'
        spanEl.addEventListener('click', handleNoteView);       // Add click event listener - run handleNoteView *******

        liEl.append(spanEl);                                    // Append span to li element

        if (delBtn) {
        const delBtnEl = document.createElement('i');           // Create i element
        delBtnEl.classList.add(
            'fas',
            'fa-trash-alt',
            'float-right',
            'text-danger',
            'delete-note'
        );                                                      // Add class to i element
        delBtnEl.addEventListener('click', handleNoteDelete);   // Add click event listener - run handleNoteDelete ********

        liEl.append(delBtnEl);                                  // Append delete button element to li element
        }

        return liEl;
    };

    if (jsonNotes.length === 0) {
        noteListItems.push(createLi('No saved Notes', false));  // if db.json is empty then display "no Saved Notes"
    }

    //ForEach loop that calls createLi to create the row
    jsonNotes.forEach((note) => {               // for each "note" within the jasonNotes array:
            const li = createLi(note.title);
            li.dataset.note = JSON.stringify(note);
            noteListItems.push(li);
    });

    if (window.location.pathname === '/notes') {
        noteListItems.forEach((note) => noteList[0].append(note));
    }
};

//--------------------------------//
//- Function - getAndRenderNotes -//
//--------------------------------//

// Gets notes from the db.json and renders them to the sidebar
const getAndRenderNotes = () => {
    console.log("\n\n\n > getAndRenderNotes() Called");   
getNotes().then(renderNoteList);
}

if (window.location.pathname === '/notes') {
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    noteTitle.addEventListener('keyup', handleRenderSaveBtn);
    noteText.addEventListener('keyup', handleRenderSaveBtn);
}


getAndRenderNotes();
