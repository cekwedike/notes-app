import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { Note } from '../types/Note';

interface NoteFormProps {
  onSubmit: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onFocusChange?: (isFocused: boolean) => void;
}

export interface NoteFormRef {
  focus: () => void;
}

const MARKDOWN_TOOLS = [
  { icon: 'bold', label: 'Bold', prefix: '**', suffix: '**' },
  { icon: 'italic', label: 'Italic', prefix: '_', suffix: '_' },
  { icon: 'strikethrough', label: 'Strikethrough', prefix: '~~', suffix: '~~' },
  { icon: 'link', label: 'Link', prefix: '[', suffix: '](url)' },
  { icon: 'code', label: 'Code', prefix: '`', suffix: '`' },
  { icon: 'code-block', label: 'Code Block', prefix: '```\n', suffix: '\n```' },
  { icon: 'list', label: 'Bullet List', prefix: '- ' },
  { icon: 'list-ordered', label: 'Numbered List', prefix: '1. ' },
  { icon: 'quote', label: 'Quote', prefix: '> ' },
  { icon: 'heading', label: 'Heading', prefix: '## ' },
];

export const NoteForm = forwardRef<NoteFormRef, NoteFormProps>(
  ({ onSubmit, onFocusChange }, ref) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        titleInputRef.current?.focus();
        setIsFocused(true);
      },
    }));

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

    const insertMarkdown = (prefix: string, suffix: string = '') => {
      const textarea = contentTextareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
      
      setContent(newText);
      
      // Set cursor position after the inserted markdown
      setTimeout(() => {
        const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    };

    const handleFocusChange = (focused: boolean) => {
      setIsFocused(focused);
      onFocusChange?.(focused);
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
        className={`note-form glass ${isFocused ? 'focused' : ''}`}
        onFocus={() => handleFocusChange(true)}
        onBlur={(e) => {
          if (!formRef.current?.contains(e.relatedTarget as Node)) {
            handleFocusChange(false);
          }
        }}
        onKeyDown={handleKeyDown}
      >
        <div className="form-header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <h2>Create New Note</h2>
        </div>
        
        <div className="form-group">
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="input"
            required
          />
        </div>

        <div className="markdown-toolbar">
          {MARKDOWN_TOOLS.map((tool) => (
            <button
              key={tool.icon}
              type="button"
              className="toolbar-btn"
              onClick={() => insertMarkdown(tool.prefix, tool.suffix)}
              title={tool.label}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {tool.icon === 'bold' && (
                  <>
                    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
                    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
                  </>
                )}
                {tool.icon === 'italic' && (
                  <>
                    <line x1="19" y1="4" x2="10" y2="4"/>
                    <line x1="14" y1="20" x2="5" y2="20"/>
                    <line x1="15" y1="4" x2="9" y2="20"/>
                  </>
                )}
                {tool.icon === 'strikethrough' && (
                  <>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <path d="M16 6H8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"/>
                  </>
                )}
                {tool.icon === 'link' && (
                  <>
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </>
                )}
                {tool.icon === 'code' && (
                  <>
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </>
                )}
                {tool.icon === 'code-block' && (
                  <>
                    <path d="M16 18 22 12 16 6"/>
                    <path d="M8 6 2 12 8 18"/>
                    <path d="M12 2v20"/>
                  </>
                )}
                {tool.icon === 'list' && (
                  <>
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                  </>
                )}
                {tool.icon === 'list-ordered' && (
                  <>
                    <line x1="10" y1="6" x2="21" y2="6"/>
                    <line x1="10" y1="12" x2="21" y2="12"/>
                    <line x1="10" y1="18" x2="21" y2="18"/>
                    <path d="M4 6h1v4"/>
                    <path d="M4 10h2"/>
                    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
                  </>
                )}
                {tool.icon === 'quote' && (
                  <>
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                  </>
                )}
                {tool.icon === 'heading' && (
                  <>
                    <path d="M4 12h16"/>
                    <path d="M4 18V6"/>
                    <path d="M12 18V6"/>
                    <path d="M20 18V6"/>
                  </>
                )}
              </svg>
            </button>
          ))}
        </div>
        
        <div className="form-group">
          <textarea
            ref={contentTextareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here... (Markdown supported)"
            className="input"
            rows={6}
            required
          />
        </div>
        
        <div className="form-footer">
          <div className="form-hint">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>Press ⌘/Ctrl + Enter to save</span>
          </div>
          <button 
            type="submit" 
            className="btn"
            disabled={!title.trim() || !content.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Add Note
          </button>
        </div>
      </form>
    );
  }
); 