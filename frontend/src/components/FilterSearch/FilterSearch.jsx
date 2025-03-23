// src/components/FilterSearch/FilterSearch.jsx
import { useState } from 'react';
import './FilterSearch.css';

const FilterSearch = ({ onSearch, languages, tags }) => {
  const [query, setQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const handleSubmit = () => {
    const params = {};
    if (query) params.query = query;
    if (selectedLanguage) params.language = selectedLanguage;
    if (selectedTag) params.tag = selectedTag;
    onSearch(params);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedLanguage('');
    setSelectedTag('');
    onSearch({});
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search snippets by title"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="filter-select"
      >
        <option value="">All Language</option>
        {languages.map((language, index) => (
          <option key={index} value={language}>
            {language}
          </option>
        ))}
      </select>

      <select
        value={selectedTag}
        onChange={(e) => setSelectedTag(e.target.value)}
        className="filter-select"
      >
        <option value="">All Tags</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.name}>
            {tag.name}
          </option>
        ))}
      </select>

      <button 
        onClick={handleSubmit} 
        className="search-button"
      >
        Search
      </button>
      
      <button 
        onClick={handleClear} 
        className="clear-button"
      >
        Clear All
      </button>
    </div>
  );
};

export default FilterSearch;