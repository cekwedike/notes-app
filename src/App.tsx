import { useState, useEffect, useMemo } from 'react'
import { NoteForm } from './components/NoteForm'
import { NotesList } from './components/NotesList'
import { NotesFilter } from './components/NotesFilter'
import { ThemeToggle } from './components/ThemeToggle'
import { Sidebar } from './components/Sidebar'
import type { Note } from './types/Note'
import { getNotes, addNote, updateNote, deleteNote } from './utils/storage'
import './App.css'

type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc'

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('newest')

  useEffect(() => {
    setNotes(getNotes())
  }, [])

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = notes.filter(
        note =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      )
    }
    
    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'oldest':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })
  }, [notes, searchQuery, sortOption])

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

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSort = (option: SortOption) => {
    setSortOption(option)
  }

  return (
    <div className="app">
      <ThemeToggle />
      <Sidebar />
      <header className="app-header">
        <h1>Notes App</h1>
      </header>
      <main className="app-main">
        <NoteForm onSubmit={handleAddNote} />
        <NotesFilter onSearch={handleSearch} onSort={handleSort} />
        <NotesList
          notes={filteredAndSortedNotes}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
        />
      </main>
    </div>
  )
}

export default App
