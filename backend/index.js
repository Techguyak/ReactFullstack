const express = require("express");
const cors = require("cors");
let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.static("dist"));
app.get("/", (request, response) => {
    response.send("<h1>Notes</h1><ul><li>HTML is easy</li><li>Browser can execute only JavaScript</li><li>GET and POST are the most important methods of HTTP protocol</li></ul>")});

app.get("/api/notes", (request, response) => {
    response.json(notes)
});
app.delete("/api/notes/:id", (req,res)=> {
  const id = req.params.id;
  notes = notes.filter(note => note.id !== id);
  res.status(204).end();
})
app.post("/api/notes", (req,res) => {
  const getId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(id => id.id)) : 0;
    return maxId + 1;
  }
  const note = req.body;
  note.id = getId().toString();
  notes = notes.concat(note);
  console.log(note);
  res.json(note);
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
