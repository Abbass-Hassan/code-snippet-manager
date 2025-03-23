import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        navigate('/home');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-form-container">
          <header className="login-header">
            <h2 className="login-title">Sign In</h2>
            <p className="login-subtext">Enter your credentials to access your account</p>
          </header>

          {errors.general && (
            <div className="error-msg" role="alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-input-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`login-input ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Email"
                disabled={isSubmitting}
                autoComplete="email"
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
            
            <div className="login-input-group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`login-input ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Password"
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <footer className="register-link">
            Don't have an account? <Link to="/register">Create one</Link>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;