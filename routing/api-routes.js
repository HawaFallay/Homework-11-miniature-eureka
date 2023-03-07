// This js helps our data to determine what the user sees and 
// what data the user is able to post onto the server for storage
const path = require('path');

//Dependencies to read json
const fs = require("fs");

//installed unique ID package from npm
var uniqid = require("uniqid");



//Routing
module.exports = function (app) {
    // API Get Requests
    app.get("/api/notes", (req, res) => {
      console.log("Execute GET notes request");
      res.sendFile(path.join(__dirname, '../data/db/db.json'));

      // Read the db.json file usisng readFileSync, dont run without sync
      //let data = fs.readFileSync("db/db.json", "utf8");

      // Send response of json data of GET request, must be pased and stringify later
     // res.json(JSON.parse(data));
    });

// API POST Requests
app.post("/api/notes", (req, res) => {
    const newNote = {
      ...req.body,
      id: uniqid(),
    };
console.log(newNote)
    console.log("Post Request for new notes");

    // Read data from JSON file
    let data = fs.readFileSync("data/db/db.json", "utf8");
    
    const dataJSON = JSON.parse(data);

    // Pushed new note in notes file 'db.JSON'
    dataJSON.push(newNote);

    // Write notes data to 'db.json' file
    fs.writeFile("data/db/db.json",
        JSON.stringify(dataJSON),
        (err, text) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("HELLO", text);
        }
    
     );
     
     console.log("Success, added a new note");

     // send json data response
     res.json(data);
    });

    // API DELETE Request
    app.delete("/api/notes/:id", (req, res) => {
        //read file
        let data = fs.readFileSync("data/db/db.json", "utf8");

        //variable for setting up the filter method 
        const dataJSON = JSON.parse(data);

        //if newNotes has a false value, use filter method and req.parms
        // https://express.js.com/en/guide/routing.html#route-parameters
        const newNotes = dataJSON.filter((note) => {
            return note.id !== req.params.id;
        });
        //console.log(req.params)
console.log(newNotes)
        fs.writeFile("data/db/db.json", JSON.stringify(newNotes), (err, text) =>{
            if (err) {
                console.error(err);
                return;
            }
        });

        res.json(newNotes);
    });
};
