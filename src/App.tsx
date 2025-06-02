import { useState, useEffect, useMemo, useRef } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { NoteForm } from './components/NoteForm'
import { NotesList } from './components/NotesList'
import { NotesFilter } from './components/NotesFilter'
import { ThemeToggle } from './components/ThemeToggle'
import { Sidebar } from './components/Sidebar'
import { PomodoroTimer } from './components/PomodoroTimer'
import type { Note } from './types/Note'
import { getNotes, addNote, updateNote, deleteNote, saveNotes } from './utils/storage'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import './App.css'

type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc'

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [isNoteFormFocused, setIsNoteFormFocused] = useState(false)
  const noteFormRef = useRef<HTMLFormElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setNotes(getNotes())
  }, [])

  useKeyboardShortcuts([
    {
      key: 'n',
      ctrlKey: true,
      handler: () => {
        if (!isNoteFormFocused) {
          noteFormRef.current?.focus()
          setIsNoteFormFocused(true)
        }
      },
    },
    {
      key: 'f',
      ctrlKey: true,
      handler: () => {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement
        searchInput?.focus()
      },
    },
    {
      key: 'Escape',
      handler: () => {
        setIsNoteFormFocused(false)
        const activeElement = document.activeElement as HTMLElement
        activeElement?.blur()
      },
    },
    {
      key: '1',
      ctrlKey: true,
      handler: () => navigate('/'),
    },
    {
      key: '2',
      ctrlKey: true,
      handler: () => navigate('/pomodoro'),
    },
    {
      key: '3',
      ctrlKey: true,
      handler: () => navigate('/matrix'),
    },
  ])

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

  const handleReorderNotes = (reorderedNotes: Note[]) => {
    setNotes(reorderedNotes)
    saveNotes(reorderedNotes)
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
      <div className="app-content">
        <header className="app-header">
          <h1>Notes App</h1>
          <div className="keyboard-shortcuts">
            <button
              className="shortcuts-btn"
              onClick={() => {
                alert(
                  'Keyboard Shortcuts:\n\n' +
                  'Ctrl + N: New Note\n' +
                  'Ctrl + F: Focus Search\n' +
                  'Ctrl + 1: Go to Notes\n' +
                  'Ctrl + 2: Go to Pomodoro\n' +
                  'Ctrl + 3: Go to Matrix\n' +
                  'Esc: Clear Focus'
                );
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
                <line x1="6" y1="8" x2="6" y2="8"/>
                <line x1="10" y1="8" x2="10" y2="8"/>
                <line x1="14" y1="8" x2="14" y2="8"/>
                <line x1="18" y1="8" x2="18" y2="8"/>
                <line x1="6" y1="12" x2="6" y2="12"/>
                <line x1="10" y1="12" x2="10" y2="12"/>
                <line x1="14" y1="12" x2="14" y2="12"/>
                <line x1="18" y1="12" x2="18" y2="12"/>
                <line x1="6" y1="16" x2="6" y2="16"/>
                <line x1="10" y1="16" x2="10" y2="16"/>
                <line x1="14" y1="16" x2="14" y2="16"/>
                <line x1="18" y1="16" x2="18" y2="16"/>
              </svg>
              Keyboard Shortcuts
            </button>
          </div>
        </header>
        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <NoteForm
                    ref={noteFormRef}
                    onFocusChange={setIsNoteFormFocused}
                    onSubmit={handleAddNote}
                  />
                  <NotesFilter
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                  />
                  <NotesList
                    notes={filteredAndSortedNotes}
                    onUpdateNote={handleUpdateNote}
                    onDeleteNote={handleDeleteNote}
                    onReorderNotes={handleReorderNotes}
                  />
                </>
              }
            />
            <Route path="/pomodoro" element={<PomodoroTimer />} />
            <Route
              path="/matrix"
              element={
                <div className="glass">
                  <h2>Eisenhower Matrix</h2>
                  <p>Coming soon...</p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
