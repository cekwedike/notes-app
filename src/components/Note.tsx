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
          className="input note-title-input"
          autoFocus
        />
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          placeholder="Content"
          className="input note-content-input"
          rows={6}
        />
        <div className="note-actions">
          <button 
            onClick={handleSave} 
            className="btn"
            disabled={!editedTitle.trim() || !editedContent.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Save (⌘/Ctrl + Enter)
          </button>
          <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Cancel (Esc)
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`note glass-hover ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h3 className="note-title">{note.title}</h3>
        <p className="note-content">{note.content}</p>
        <div className="note-meta">
          <div className="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
          </div>
          <div className="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span>Updated: {new Date(note.updatedAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="note-actions">
          <button 
            onClick={() => setIsEditing(true)} 
            className="edit-btn"
            title="Edit note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
          <button 
            onClick={handleDeleteClick} 
            className="delete-btn"
            title="Delete note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
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