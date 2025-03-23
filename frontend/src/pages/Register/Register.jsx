import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await register(formData);
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
    <div className="register-page">
      <div className="register-wrapper">
        <div className="register-form-container">
          <header className="register-header">
            <h2 className="register-title">Create Account</h2>
            <p className="register-subtext">Sign up to get started</p>
          </header>

          {errors.general && (
            <div className="error-msg" role="alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form" noValidate>
            <div className="register-input-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={`register-input ${errors.name ? 'is-invalid' : ''}`}
                disabled={isSubmitting}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="register-input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`register-input ${errors.email ? 'is-invalid' : ''}`}
                disabled={isSubmitting}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="register-input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`register-input ${errors.password ? 'is-invalid' : ''}`}
                disabled={isSubmitting}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="register-input-group">
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirm Password"
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`register-input ${errors.password_confirmation ? 'is-invalid' : ''}`}
                disabled={isSubmitting}
              />
              {errors.password_confirmation && (
                <div className="invalid-feedback">{errors.password_confirmation}</div>
              )}
            </div>

            <button 
              type="submit" 
              className="register-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <footer className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Register;
