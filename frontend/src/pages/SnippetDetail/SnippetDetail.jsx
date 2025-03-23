// src/pages/SnippetDetail/SnippetDetail.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { snippetService, favoriteService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import './SnippetDetail.css';

const SnippetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [snippet, setSnippet] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        setIsLoading(true);
        const response = await snippetService.getById(id);
        const snippetData = response.data.snippet || response.data;
        setSnippet(snippetData);
        
        // Check if current user is the owner
        setIsOwner(snippetData.user_id === currentUser?.id);
        
        // Check if this snippet is in user's favorites
        try {
          const favoritesResponse = await favoriteService.getAll();
          const favorites = favoritesResponse.data.favorites || favoritesResponse.data;
          setIsFavorite(favorites.some(fav => fav.id === parseInt(id)));
        } catch (error) {
          console.error('Error checking favorites status:', error);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching snippet:', err);
        setError('Failed to load snippet. It may have been deleted or you may not have permission to view it.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSnippet();
  }, [id, currentUser]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      try {
        await snippetService.delete(id);
        navigate('/home');
      } catch (err) {
        console.error('Error deleting snippet:', err);
        setError('Failed to delete the snippet.');
      }
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await favoriteService.remove(id);
      } else {
        await favoriteService.add(id);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite status:', err);
      setError('Failed to update favorite status.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading snippet...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <Link to="/home" className="btn btn-primary">Back</Link>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="error-container">
        <div className="error-message">Snippet not found</div>
        <Link to="/home" className="btn btn-primary">Back</Link>
      </div>
    );
  }

  return (
    <div className="snippet-detail-page">
      <div className="snippet-actions">
        <Link to="/home" className="btn btn-secondary">
          ← Back
        </Link>
        <div className="action-buttons">
          <button 
            onClick={handleToggleFavorite} 
            className={`btn ${isFavorite ? 'btn-secondary' : 'btn-primary'}`}
          >
            {isFavorite ? '★ Unfavorite' : '☆ Favorite'}
          </button>
          
          {isOwner && (
            <>
              <Link to={`/edit-snippet/${id}`} className="btn btn-secondary">
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="snippet-detail-header">
        <h1 className="snippet-detail-title">{snippet.title}</h1>
        <div className="snippet-metadata">
          <div className="snippet-language">
            <strong>Language:</strong> {snippet.language}
          </div>
          {snippet.user && !isOwner && (
            <div className="snippet-author">
              <strong>Author:</strong> {snippet.user.name}
            </div>
          )}
          {isOwner && (
            <div className="snippet-owner-badge">Your Snippet</div>
          )}
          <div className="snippet-date">
            <strong>Created:</strong> {formatDate(snippet.created_at)}
          </div>
          {snippet.updated_at && snippet.updated_at !== snippet.created_at && (
            <div className="snippet-date">
              <strong>Updated:</strong> {formatDate(snippet.updated_at)}
            </div>
          )}
          <div className="snippet-visibility">
            <strong>Visibility:</strong> {snippet.is_public ? 'Public' : 'Private'}
          </div>
        </div>

        {snippet.description && (
          <div className="snippet-detail-description">
            {snippet.description}
          </div>
        )}

        {snippet.tags && snippet.tags.length > 0 && (
          <div className="snippet-detail-tags">
            {snippet.tags.map((tag, index) => (
              <span key={index} className="tag">
                {typeof tag === 'object' ? tag.name : tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="snippet-code-container">
        <div className="code-header">
          <span className="code-label">Code</span>
          <button 
            className="copy-button"
            onClick={() => {
              navigator.clipboard.writeText(snippet.code);
              alert('Code copied to clipboard!');
            }}
          >
            Copy to Clipboard
          </button>
        </div>
        <SyntaxHighlighter 
          language={snippet.language.toLowerCase()} 
          style={vs}
          className="code-block"
          showLineNumbers
        >
          {snippet.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default SnippetDetail;