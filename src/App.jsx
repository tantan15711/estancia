<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './components/auth/Login/Login';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
=======
import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from './AppRoutes';
import Login from './components/Login/Login';
>>>>>>> fd05dfcffb682b127e57bf03123a5abd8d5b1f0f

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

<<<<<<< HEAD
=======
  // Verificar si ya hay una sesión activa al cargar la aplicación
>>>>>>> fd05dfcffb682b127e57bf03123a5abd8d5b1f0f
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem('authToken', 'user-authenticated');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

<<<<<<< HEAD
=======
  // Mostrar carga mientras se verifica el estado de autenticación
>>>>>>> fd05dfcffb682b127e57bf03123a5abd8d5b1f0f
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
=======
    <Router>
>>>>>>> fd05dfcffb682b127e57bf03123a5abd8d5b1f0f
      <div className="App">
        {!isLoggedIn ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <AppRoutes onLogout={handleLogout} />
        )}
      </div>
    </Router>
  );
}

export default App;