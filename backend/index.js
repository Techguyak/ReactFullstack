const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
const Note = require('./model/notes')


// const url = `mongodb+srv://fullstack:${password}@cluster0.k2irtty.mongodb.net/noteApp?appName=Cluster0`

// mongoose.set('strictQuery',false)

// mongoose.connect(url, { family: 4 }) 

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// const Note = mongoose.model('Note', noteSchema);
// let notes = [
//   {
//     id: "1",
//     content: "HTML is easy",
//     important: true
//   },
//   {
//     id: "2",
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: "3",
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   }
// ]

const app = express();
app.use(express.json());
// app.use(cors({
//   origin: "http://localhost:5173"
// }));
app.use(express.static("dist"));
app.get("/", (request, response) => {
    response.send("<h1>Notes</h1><ul><li>HTML is easy</li><li>Browser can execute only JavaScript</li><li>GET and POST are the most important methods of HTTP protocol</li></ul>")});

app.get("/api/notes", (request, response) => {
    Note.find({}).then(result => {
      if(!result){
        return response.status(400).end();
      }
        response.json(result)
    })
});
app.get("/api/notes/:id", (req,res) => {
  Note.findById(req.params.id).then((result)=>{
    res.json(result);
  })
})
app.delete("/api/notes/:id", (req,res)=> {
  Note.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => {
      console.error(error)
      res.status(400).json({ error: 'malformatted id' })
    })
})
app.put('/api/notes/:id', (req, res)=> {
    const {content, important} = req.body
    Note.findById(req.params.id)
      .then(result => {
        if (!result) {
          return res.status(404).json({ error: 'note not found' })
        }
        result.content = content;
        result.important = important;

        return result.save()
      })
      .then(out => {
        if (out) {
          res.json(out)
        }
      })
      .catch(error => {
        console.error(error)
        res.status(400).json({ error: 'malformatted id or validation failed' })
      })
});
app.post("/api/notes", (req,res,next) => {
  const body = req.body
  
  const note = new Note({
    content:body.content,
    important:body.important || false
  })
  note.save().then((n)=>{
    console.log(n)
    res.json(n)
  }).catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(400).send({error: "unknown endpoint"})
} 
app.use(unknownEndpoint);

const erroHandler = (error, req, res, next) => {
  console.error(error.message);

  if(error.name === 'CastError') {
    return res.status(400).send({error: "unformatted id"})
  }
  if(error.name === 'ValidationError'){
    return res.status(400).json({error: error.message})
  }
  next(error)
}
app.use(erroHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
