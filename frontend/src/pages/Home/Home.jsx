import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { snippetService, tagService, authService } from '../../services/api';
import SnippetCard from '../../components/SnippetCard/SnippetCard';
import FilterSearch from '../../components/FilterSearch/FilterSearch';
import './Home.css';

const Home = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [snippets, setSnippets] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const snippetsResponse = await snippetService.getAll();
        setSnippets(snippetsResponse.data.snippets || snippetsResponse.data);

        const languagesResponse = await tagService.getLanguages();
        setLanguages(languagesResponse.data.languages || languagesResponse.data);

        const tagsResponse = await tagService.getAll();
        setTags(tagsResponse.data.tags || tagsResponse.data);

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load snippets. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
      // Update auth context if you're tracking login state there
      if (setCurrentUser) {
        setCurrentUser(null);
      }
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
      // Even if there's an error, clear local storage and redirect
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleSearch = async (filters) => {
    try {
      // If no filters are applied, fetch all snippets
      if (Object.keys(filters).length === 0) {
        const response = await snippetService.getAll();
        setSnippets(response.data.snippets || response.data);
        return;
      }

      // Search with the provided filters
      const response = await snippetService.search(filters);
      setSnippets(response.data.snippets || response.data);
    } catch (err) {
      console.error('Error searching snippets:', err);
      setError('Failed to search snippets');
    }
  };

  const handleDeleteSnippet = async (id) => {
    try {
      await snippetService.delete(id);
      setSnippets(snippets.filter(snippet => snippet.id !== id));
    } catch (err) {
      console.error('Error deleting snippet:', err);
      setError('Failed to delete snippet');
    }
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="home-title">
          Welcome, {currentUser?.name || 'User'}
        </h1>
        <div className="home-actions">
          <Link to="/favorites" className="btn btn-secondary">
            <span className="star-icon">★</span> My Favorites
          </Link>
          <Link to="/create-snippet" className="btn btn-primary">
            Create New Snippet
          </Link>
          <button onClick={handleLogout} className="logout-button" title="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="home-filters">
        <FilterSearch 
          onSearch={handleSearch} 
          languages={languages} 
          tags={tags} 
        />
      </div>

      {isLoading ? (
        <div className="loading-spinner">Loading snippets...</div>
      ) : (
        <>
          {snippets.length === 0 ? (
            <div className="no-snippets">
              <p>No snippets found. Create your first snippet!</p>
              <Link to="/create-snippet" className="btn btn-primary">
                Create Snippet
              </Link>
            </div>
          ) : (
            <div className="snippets-grid">
              {snippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  currentUserId={currentUser?.id}
                  onDelete={handleDeleteSnippet}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;