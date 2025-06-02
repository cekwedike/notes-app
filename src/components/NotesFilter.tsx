import { useState } from 'react';

type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

interface NotesFilterProps {
  onSearch: (query: string) => void;
  onSort: (option: SortOption) => void;
}

export const NotesFilter = ({ onSearch, onSort }: NotesFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value as SortOption;
    setSortOption(option);
    onSort(option);
  };

  return (
    <div className="notes-filter">
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search notes..."
          className="search-input"
        />
      </div>
      <div className="sort-container">
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="sort-select"
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
 