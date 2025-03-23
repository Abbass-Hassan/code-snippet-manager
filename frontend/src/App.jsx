import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import SnippetDetail from './pages/SnippetDetail/SnippetDetail';
import CreateSnippet from './pages/CreateSnippet/CreateSnippet';
import FavoriteSnippets from './pages/FavoriteSnippets/FavoriteSnippets';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/snippets/:id"
          element={
            <ProtectedRoute>
              <SnippetDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-snippet"
          element={
            <ProtectedRoute>
              <CreateSnippet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-snippet/:id"
          element={
            <ProtectedRoute>
              <CreateSnippet />
            </ProtectedRoute>
          }
        />

        {/* Favorites Route */}
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoriteSnippets />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;