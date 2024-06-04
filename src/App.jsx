import { useState, useEffect } from 'react'
import Editor from "./components/Editor"
import Sidebar from './components/Sidebar'
import Split from "react-split"
import {nanoid} from "nanoid"
import { onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore'
import {notesCollection, db} from './firebase'

import "react-mde/lib/styles/css/react-mde-all.css";
import './App.css'

export default function App() {
    
  const [notes, setNotes] = useState([])

  const [currentNoteId, setCurrentNoteId] = useState(
      (notes[0]?.id) || ""
  )

  const currentNote = notes.find(note => note.id === currentNoteId) 
  || notes[0]
  
  useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function(snapshot){
        //sync local state and db here
        const notesArr = snapshot.docs.map(doc=> ({
            ...doc.data(),
            id: doc.id
        }))

        setNotes(notesArr)
    })
     return unsubscribe
  }, [])
  
    async function createNewNote() {
      const newNote = {
          body: "# Type your markdown note's title here"
      }
      const newNoteReff = await addDoc(notesCollection, newNote)
      setCurrentNoteId(newNoteReff.id)
  }
  
  function updateNote(text) {
      setNotes(oldNotes => {
        const newNotes = []
        for(let i = 0; i < oldNotes.length; i++){
          const oldNote = oldNotes[i]
          if(oldNote.id === currentNoteId) {
            newNotes.unshift({...oldNote, body: text})
          }
          else {
            newNotes.push(oldNote)
          }
        }
        
        return newNotes

      })
  }

  async function deleteNote(noteId) {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef)
}
  
  
  return (
      <main>
      {
          notes.length > 0 
          ?
          <Split 
              sizes={[30, 70]} 
              direction="horizontal" 
              className="split"
          >
              <Sidebar
                  notes={notes}
                  currentNote={currentNote}
                  setCurrentNoteId={setCurrentNoteId}
                  newNote={createNewNote}
                  deleteNote={deleteNote}
              />
              {
                  currentNoteId && 
                  notes.length > 0 &&
                  <Editor 
                      currentNote={currentNote} 
                      updateNote={updateNote} 
                  />
              }
          </Split>
          :
          <div className="no-notes">
              <h1>You have no notes</h1>
              <button 
                  className="first-note" 
                  onClick={createNewNote}
              >
                  Create one now
              </button>
          </div>
          
      }
      </main>
  )
}

