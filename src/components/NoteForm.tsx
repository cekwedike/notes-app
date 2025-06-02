import { useState, useRef, useEffect } from 'react';
import type { Note } from '../types/Note';

interface NoteFormProps {
  onSubmit: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const NoteForm = ({ onSubmit }: NoteFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmit({ title, content });
    setTitle('');
    setContent('');
    titleInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  // Focus title input when form is focused
  useEffect(() => {
    if (isFocused) {
      titleInputRef.current?.focus();
    }
  }, [isFocused]);

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className={`note-form ${isFocused ? 'focused' : ''}`}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        // Only set isFocused to false if focus is not within the form
        if (!formRef.current?.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
        }
      }}
      onKeyDown={handleKeyDown}
    >
      <input
        ref={titleInputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="note-form-title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Note content"
        className="note-form-content"
        required
      />
      <div className="note-form-footer">
        <small className="note-form-hint">
          Press ⌘/Ctrl + Enter to save
        </small>
        <button 
          type="submit" 
          className="note-form-submit"
          disabled={!title.trim() || !content.trim()}
        >
          Add Note
        </button>
      </div>
    </form>
  );
}; 