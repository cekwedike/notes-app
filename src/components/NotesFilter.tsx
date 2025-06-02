import { useState } from 'react';

export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

interface NotesFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export const NotesFilter = ({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
}: NotesFilterProps) => {
  return (
    <div className="notes-filter glass">
      <div className="search-box">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="sort-box">
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
        </select>
      </div>
    </div>
  );
}; 
 