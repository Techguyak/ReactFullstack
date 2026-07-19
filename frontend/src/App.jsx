// import { useState } from 'react'
import React from 'react'
import Notes from './components/Notes'
import {useState, useEffect} from 'react'
import axios from 'axios'
import noteservce from './services/Notes'
import './App.css'


const App = () => {
debugger
  const [note, setNote] = useState([]);
debugger
  const subbtn = (e) => {
    e.preventDefault();
    const newNote = {
      content: e.target[0].value,
      important: Math.random() < 0.5,
    }
    const result = noteservce.create(newNote);
    console.log(result);
   setNote(note.concat(result));
  }
  const ontoggleUpdate = (e) => {
    e.preventDefault();
    const id = e.target[0].value;
    const updateNote = note.find((n) => n.id === id);
    const changeNote = {...updateNote, content: "Updated Note Content"};
    noteservce.update(id, changeNote).then((updatedNote) => {
      setNote(note.map(n => n.id == id ? updatedNote : n));
    }).catch((error) => {
      alert("Error updating note:", error);
    })
    
  }
  useEffect(() => {
    const notes = noteservce.getAll();
    notes.then(res => setNote(res));

  }, []);
  
  return (
    <>
      {note.map((n) => (
          <ul key={n.id}>
            <li> <h1>{n.content}</h1>
              <p>{n.important}</p>
            </li>
          </ul>

        ))}
        <form onSubmit={subbtn}>
        <input placeholder="Add a new note..."></input>
        <button type="submit">Add Note</button>
        </form>

        <form onSubmit={ontoggleUpdate}>
          <input type="text" placeholder="Enter ID to update"/>
          <button type="submit">Update Note</button>
        </form>
        
    </>
  )
}
export default App
