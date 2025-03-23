// src/pages/FavoriteSnippets/FavoriteSnippets.jsx
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { favoriteService, snippetService } from '../../services/api';
import SnippetCard from '../../components/SnippetCard/SnippetCard';
import './FavoriteSnippets.css';

const FavoriteSnippets = () => {
  const { currentUser } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user's favorite snippets
        const response = await favoriteService.getAll();
        setFavorites(response.data.favorites || response.data);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorite snippets. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (snippetId) => {
    try {
      await favoriteService.remove(snippetId);
      setFavorites(favorites.filter(favorite => favorite.id !== snippetId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Failed to remove snippet from favorites');
    }
  };

  const handleDeleteSnippet = async (snippetId) => {
    if (window.confirm('Are you sure you want to delete this snippet? This cannot be undone.')) {
      try {
        await snippetService.delete(snippetId);
        setFavorites(favorites.filter(favorite => favorite.id !== snippetId));
      } catch (err) {
        console.error('Error deleting snippet:', err);
        setError('Failed to delete snippet');
      }
    }
  };

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1 className="favorites-title">
          <span className="star-icon">★</span> My Favorite Snippets
        </h1>
        <div className="favorites-actions">
          <Link to="/home" className="btn btn-secondary">
            ← Back to Home
          </Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading-spinner">Loading favorite snippets...</div>
      ) : (
        <>
          {favorites.length === 0 ? (
            <div className="no-favorites">
              <p>You haven't added any snippets to your favorites yet.</p>
              <p>Find snippets you like and click the star icon to favorite them!</p>
              <Link to="/home" className="btn btn-primary">
                Browse Snippets
              </Link>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  currentUserId={currentUser?.id}
                  isFavorite={true}
                  onToggleFavorite={handleRemoveFavorite}
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

export default FavoriteSnippets;