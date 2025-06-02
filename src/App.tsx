import { useState, useEffect } from 'react'
import { NoteForm } from './components/NoteForm'
import { NotesList } from './components/NotesList'
import type { Note } from './types/Note'
import { getNotes, addNote, updateNote, deleteNote } from './utils/storage'
import './App.css'

function App() {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    setNotes(getNotes())
  }, [])

  const handleAddNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addNote(newNote)
    setNotes(getNotes())
  }

  const handleUpdateNote = (updatedNote: Note) => {
    updateNote(updatedNote)
    setNotes(getNotes())
  }

  const handleDeleteNote = (id: string) => {
    deleteNote(id)
    setNotes(getNotes())
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Notes App</h1>
      </header>
      <main className="app-main">
        <NoteForm onSubmit={handleAddNote} />
        <NotesList
          notes={notes}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
        />
      </main>
    </div>
  )
}

export default App
