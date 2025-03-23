// src/components/SnippetCard/SnippetCard.jsx
import { Link } from 'react-router-dom';
import './SnippetCard.css';

const SnippetCard = ({ snippet, currentUserId }) => {
  const { id, title, language, description, tags, created_at, user_id, user, is_public } = snippet;
  
  // Check if the snippet belongs to the current user
  const isOwner = user_id === currentUserId;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // Truncate description text if it's too long
  const truncateText = (text, maxLength = 120) => {
    if (!text) return 'No description provided';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <div className={`snippet-card ${isOwner ? 'owner-snippet' : ''}`}>
      <div className="snippet-header">
        <div className="snippet-header-top">
          <div className="language-tag">{language}</div>
          {isOwner && <div className="owner-badge">Your Snippet</div>}
          {!isOwner && !is_public && <div className="private-badge">Private</div>}
        </div>
        <h3 className="snippet-title">
          <Link to={`/snippets/${id}`}>{title}</Link>
        </h3>
      </div>

      <div className="snippet-description">
        {truncateText(description)}
      </div>

      {tags && tags.length > 0 && (
        <div className="snippet-tags">
          {tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">
              {typeof tag === 'object' ? tag.name : tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="tag">+{tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="snippet-footer">
        <div className="snippet-date">{formatDate(created_at)}</div>
        {!isOwner && user && (
          <div className="snippet-author">
            By: {user.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default SnippetCard;