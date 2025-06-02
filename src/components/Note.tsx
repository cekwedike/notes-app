import type { Note as NoteType } from '../types/Note';
import { useState } from 'react';
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

  const handleSave = () => {
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

  if (isEditing) {
    return (
      <div className="note editing">
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Title"
          className="note-title-input"
        />
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          placeholder="Content"
          className="note-content-input"
        />
        <div className="note-actions">
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="note">
        <h3 className="note-title">{note.title}</h3>
        <p className="note-content">{note.content}</p>
        <div className="note-meta">
          <small>Created: {new Date(note.createdAt).toLocaleString()}</small>
          <small>Updated: {new Date(note.updatedAt).toLocaleString()}</small>
        </div>
        <div className="note-actions">
          <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
          <button onClick={handleDeleteClick} className="delete-btn">Delete</button>
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