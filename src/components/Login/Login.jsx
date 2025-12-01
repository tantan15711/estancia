import { useEffect, useState } from 'react';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para mostrar contraseña

  // Generar CAPTCHA
  const generateCaptcha = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
  };

  // Inicializar CAPTCHA
  useEffect(() => {
    setCaptchaCode(generateCaptcha());
  }, []);

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Validar usuario
    if (username.trim() === '') {
      setUsernameError(true);
      isValid = false;
    } else {
      setUsernameError(false);
    }
    
    // Validar contraseña
    if (password.length < 8) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }
    
    // Validar CAPTCHA
    if (captchaInput !== captchaCode) {
      setCaptchaError(true);
      isValid = false;
      // Generar un nuevo CAPTCHA si falla
      setCaptchaCode(generateCaptcha());
    } else {
      setCaptchaError(false);
    }
    
    // Si es válido, proceder con login
    if (isValid) {
      setLoginSuccess(true);
      // Simular proceso de login
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }, 1500);
    }
  };

  // Actualizar CAPTCHA
  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput('');
    setCaptchaError(false);
  };

  // Alternar visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div className="login-logo">
          <img src="/LogoUPTap.png" alt="Logo UPTap" className="login-logo-image" />
        </div>
        <h2>Sistema de Gestión para Organizaciones Educativas</h2>
        <p>Accede al panel de administración para gestionar toda la información de su organización de manera segura y eficiente.</p>
        <ul className="login-features">
          <li><i className="fas fa-check-circle"></i> Gestionar procesos de manera eficiente</li>
          <li><i className="fas fa-check-circle"></i> Generar reportes automatizados</li>
          <li><i className="fas fa-check-circle"></i> Administrar planeaciones de todo un año</li>
          <li><i className="fas fa-check-circle"></i> Visualizar métricas en tiempo real</li>
        </ul>
      </div>
      
      <div className="login-right-panel">
        <h2>Iniciar Sesión</h2>
        
        <div className={`login-success-message ${loginSuccess ? 'login-show-success' : ''}`}>
          <i className="fas fa-check-circle"></i> ¡Credenciales válidas! Redirigiendo al sistema...
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label htmlFor="username">Usuario</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Ingrese su nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className={`login-error-message ${usernameError ? 'login-show-error' : ''}`}>
              Por favor ingrese un usuario válido
            </div>
          </div>
          
          <div className="login-input-group password-input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-container">
              <input 
                type={showPassword ? "text" : "password"}
                id="password" 
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <div className={`login-error-message ${passwordError ? 'login-show-error' : ''}`}>
              La contraseña debe tener al menos 8 caracteres
            </div>
          </div>
          
          <div className="login-captcha-container">
            <label>Verificación de Seguridad</label>
            <div className="login-captcha-code">
              {captchaCode}
            </div>
            <div className="login-input-group">
              <input 
                type="text" 
                id="captcha-input" 
                placeholder="Ingrese el código mostrado"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
              />
              <div className={`login-error-message ${captchaError ? 'login-show-error' : ''}`}>
                El código CAPTCHA es incorrecto
              </div>
            </div>
            <div className="login-captcha-controls">
              <button type="button" onClick={refreshCaptcha}>
                <i className="fas fa-sync-alt"></i> Actualizar Código
              </button>
            </div>
          </div>
          
          <button type="submit" className="login-btn">
            Acceder al Sistema
          </button>
        </form>
        
        <div className="login-footer">
          ¿Problemas para acceder? Contacte al <a href="/contact" aria-label="Contactar al administrador del sistema">administrador del sistema</a>
        </div>
      </div>
    </div>
  );
};

export default Login;