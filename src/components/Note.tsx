import type { Note as NoteType } from '../types/Note';
import { useState, useEffect } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

interface NoteProps {
  note: NoteType;
  onUpdate: (note: NoteType) => void;
  onDelete: (id: string) => void;
}

export const Note = ({ note, onUpdate, onDelete }: NoteProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Reset form when note changes
  useEffect(() => {
    setEditedTitle(note.title);
    setEditedContent(note.content);
  }, [note]);

  const handleSave = () => {
    if (!editedTitle.trim() || !editedContent.trim()) return;
    
    onUpdate({
      ...note,
      title: editedTitle,
      content: editedContent,
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div 
        className="note editing animate-scale-in"
        onKeyDown={handleKeyDown}
      >
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Title"
          className="note-title-input"
          autoFocus
        />
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          placeholder="Content"
          className="note-content-input"
        />
        <div className="note-actions">
          <button 
            onClick={handleSave} 
            className="save-btn"
            disabled={!editedTitle.trim() || !editedContent.trim()}
          >
            Save (⌘/Ctrl + Enter)
          </button>
          <button onClick={() => setIsEditing(false)} className="cancel-btn">
            Cancel (Esc)
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`note ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h3 className="note-title">{note.title}</h3>
        <p className="note-content">{note.content}</p>
        <div className="note-meta">
          <small>Created: {new Date(note.createdAt).toLocaleString()}</small>
          <small>Updated: {new Date(note.updatedAt).toLocaleString()}</small>
        </div>
        <div className="note-actions">
          <button 
            onClick={() => setIsEditing(true)} 
            className="edit-btn"
            title="Edit note"
          >
            Edit
          </button>
          <button 
            onClick={handleDeleteClick} 
            className="delete-btn"
            title="Delete note"
          >
            Delete
          </button>
        </div>
      </div>
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => onDelete(note.id)}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
      />
    </>
  );
}; 