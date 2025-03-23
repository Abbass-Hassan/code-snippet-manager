// src/pages/CreateSnippet/CreateSnippet.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { snippetService, tagService } from '../../services/api';
import './CreateSnippet.css';

const CreateSnippet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    language: '',
    description: '',
    is_public: false,
    tags: []
  });
  
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        // Fetch available languages
        const languagesResponse = await tagService.getLanguages();
        setAvailableLanguages(
          languagesResponse.data.languages || 
          languagesResponse.data || 
          ['JavaScript', 'PHP', 'Python', 'HTML', 'CSS', 'SQL', 'Java']
        );
        
        // Fetch available tags
        const tagsResponse = await tagService.getAll();
        setAvailableTags(tagsResponse.data.tags || tagsResponse.data || []);
        
        // If edit mode, fetch snippet
        if (isEditMode) {
          const snippetResponse = await snippetService.getById(id);
          const snippet = snippetResponse.data.snippet || snippetResponse.data;
          
          setFormData({
            title: snippet.title || '',
            code: snippet.code || '',
            language: snippet.language || '',
            description: snippet.description || '',
            is_public: snippet.is_public || false,
            tags: snippet.tags?.map(tag => typeof tag === 'object' ? tag.name : tag) || []
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors({ general: 'Failed to load data. Please try again.' });
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagAdd = () => {
    if (!newTag || formData.tags.includes(newTag)) return;
    
    setFormData({
      ...formData,
      tags: [...formData.tags, newTag]
    });
    setNewTag('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.code) {
      newErrors.code = 'Code is required';
    }
    
    if (!formData.language) {
      newErrors.language = 'Language is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isEditMode) {
        await snippetService.update(id, formData);
      } else {
        await snippetService.create(formData);
      }
      
      navigate('/home');
    } catch (error) {
      console.error('Error saving snippet:', error);
      setErrors({ 
        general: `Failed to ${isEditMode ? 'update' : 'create'} snippet. Please try again.` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="create-snippet-page">
      <div className="page-header">
        <h1 className="page-title">
          {isEditMode ? 'Edit Snippet' : 'Create New Snippet'}
        </h1>
        <Link to="/home" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
      
      {errors.general && (
        <div className="error-message">{errors.general}</div>
      )}
      
      <form onSubmit={handleSubmit} className="snippet-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            value={formData.title}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="language">Language *</label>
            <select
              id="language"
              name="language"
              className={`form-control ${errors.language ? 'is-invalid' : ''}`}
              value={formData.language}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Select a language</option>
              {availableLanguages.map((language, index) => (
                <option key={index} value={language}>
                  {language}
                </option>
              ))}
            </select>
            {errors.language && <div className="invalid-feedback">{errors.language}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="is_public">Visibility</label>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="is_public"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                disabled={isLoading}
              />
              <label htmlFor="is_public" className="checkbox-label">
                Make this snippet public
              </label>
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            disabled={isLoading}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="code">Code *</label>
          <textarea
            id="code"
            name="code"
            className={`form-control code-textarea ${errors.code ? 'is-invalid' : ''}`}
            value={formData.code}
            onChange={handleChange}
            rows="10"
            disabled={isLoading}
          ></textarea>
          {errors.code && <div className="invalid-feedback">{errors.code}</div>}
        </div>
        
        {formData.code && formData.language && (
          <div className="code-preview">
            <h3>Preview</h3>
            <SyntaxHighlighter
              language={formData.language.toLowerCase()}
              style={vs}
              className="preview-code-block"
            >
              {formData.code}
            </SyntaxHighlighter>
          </div>
        )}
        
        <div className="form-group">
          <label>Tags</label>
          <div className="tag-input-container">
            <input
              type="text"
              className="form-control tag-input"
              placeholder="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              className="btn btn-secondary add-tag-btn"
              onClick={handleTagAdd}
              disabled={!newTag || isLoading}
            >
              Add
            </button>
          </div>
          
          {availableTags.length > 0 && (
            <div className="suggested-tags">
              <span className="suggested-tags-label">Suggested:</span>
              {availableTags.slice(0, 10).map((tag, index) => (
                <button
                  key={index}
                  type="button"
                  className="suggested-tag"
                  onClick={() => {
                    const tagName = typeof tag === 'object' ? tag.name : tag;
                    if (!formData.tags.includes(tagName)) {
                      setFormData({
                        ...formData,
                        tags: [...formData.tags, tagName]
                      });
                    }
                  }}
                  disabled={isLoading}
                >
                  {typeof tag === 'object' ? tag.name : tag}
                </button>
              ))}
            </div>
          )}
          
          {formData.tags.length > 0 && (
            <div className="selected-tags">
              {formData.tags.map((tag, index) => (
                <div key={index} className="selected-tag">
                  <span>{tag}</span>
                  <button
                    type="button"
                    className="tag-remove-btn"
                    onClick={() => handleTagRemove(tag)}
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <Link to="/home" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading 
              ? (isEditMode ? 'Updating...' : 'Creating...') 
              : (isEditMode ? 'Update Snippet' : 'Create Snippet')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSnippet;
