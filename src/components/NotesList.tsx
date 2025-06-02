import type { Note } from '../types/Note';
import { Note as NoteComponent } from './Note';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableNoteProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete: (id: string) => void;
}

const SortableNote = ({ note, onUpdate, onDelete }: SortableNoteProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <NoteComponent
        note={note}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
};

interface NotesListProps {
  notes: Note[];
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onReorderNotes: (notes: Note[]) => void;
}

export const NotesList = ({ notes, onUpdateNote, onDeleteNote, onReorderNotes }: NotesListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = notes.findIndex((note) => note.id === active.id);
      const newIndex = notes.findIndex((note) => note.id === over.id);
      
      const reorderedNotes = arrayMove(notes, oldIndex, newIndex);
      onReorderNotes(reorderedNotes);
    }
  };

  if (notes.length === 0) {
    return <p className="no-notes">No notes yet. Create one above!</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={notes.map(note => note.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="notes-list">
          {notes.map((note) => (
            <SortableNote
              key={note.id}
              note={note}
              onUpdate={onUpdateNote}
              onDelete={onDeleteNote}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}; 