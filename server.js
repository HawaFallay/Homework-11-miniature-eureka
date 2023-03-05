// Dependcies
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const { randomUUID } = require("crypto");


// Handling Asynchronous Process
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


// Setting Up Server
const app = express();
const PORT = process.env.PORT || 8000;

//Sets up the Express App to handle data parsing
app.use(express.urlencoded({extended: true}));

// parse application/json
app.use(express.json());


// Stattic Middleware (Tells Html page to look in public folders for images,files)
app.use(express.static("./public"));


//Api routes before HTML routes ALWAYS
require("./routing/api-routes.js")(app)
require("./routing/html-routes.js")(app)

// API Route | "Get" request
app.get("/api/notes", function(req, res) {
  readFileAsync(".db/db.json", "utf8").then(function(data) {
      notes = [].concat(JSON.parse(data))
      res.json(notes);
  })
});


// API Route | "POST" request
app.post("/api/notes", function(req, res) {
    const note = req.body;
    readFileAsync("./db/db.json", "utf8").then(function(data) {
        const notes = [].concat(JSON.parse(data));
        note.id = randomUUID
        notes.push(note);
        return notes
    }).then(function(notes) {
        writeFileAsync("./db/db.json", JSON.stringify(notes))
        res.json(note);
    })
});


// API Route | "DELETE" request
app.delete("/api/notes/:id", function(req, res) {
    const idToDelete = parseInt(req.params.id);
    readFileAsync("./db/db.json", "utf8").then(function(data) {
        const notes = [].concat(JSON.parse(data));
        const newNotesData = []
        for (let i = 0; i<notes.length; i++) {
          if(idToDelete !== notes[i].id) {
            newNotesData.push(notes[i])
          }  
        }
        return newNotesData
      }).then(function(notes) {
        fs.writeFileAsync("./db/db.json", JSON.stringify(notes))
        res.send('saved success!');
      });
    })

// HTML Routes
/*app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});*/

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//Listening
app.listen(PORT, function() {
    console.log("App listening on PORT" + PORT);
})
