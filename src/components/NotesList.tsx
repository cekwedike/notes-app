import type { Note } from '../types/Note';
import { Note as NoteComponent } from './Note';

interface NotesListProps {
  notes: Note[];
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesList = ({ notes, onUpdateNote, onDeleteNote }: NotesListProps) => {
  if (notes.length === 0) {
    return <p className="no-notes">No notes yet. Create one above!</p>;
  }

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <NoteComponent
          key={note.id}
          note={note}
          onUpdate={onUpdateNote}
          onDelete={onDeleteNote}
        />
      ))}
    </div>
  );
}; 