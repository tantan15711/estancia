import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const UniversityLayout = ({ onLogout }) => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Función para redirigir completamente a páginas HTML
  const redirectToHTML = (fileName) => {
    window.location.href = `/${fileName}.html`;
  };

  return (
    <div className="university-layout-fullscreen">
      
<style jsx>{`
  .university-layout-fullscreen {
    width: 100vw;
    height: 100vh;
    display: flex;
    overflow: hidden;
    margin: 0;
    padding: 0;
    border: none !important;
    outline: none !important;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border: none;
    outline: none;
  }

  body, html {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'Segoe UI', system-ui, sans-serif;
    background-color: #ffffff;
    color: #333333;
    margin: 0;
    padding: 0;
    border: none;
  }

  .container-fullscreen {
    display: flex;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
  }

  .sidebar-fullscreen {
    width: 280px;
    background-color: #f8f9fa;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border-right: 1px solid #e0e0e0 !important; /* Mantener solo esta línea */
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    z-index: 10;
    overflow-y: auto;
    border: none;
    outline: none;
  }

  .header-section-fullscreen {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    margin-bottom: 1.5rem;
    border: none;
  }

  .university-title-fullscreen {
    font-size: 1.2rem;
    color: #2c5282;
    font-weight: 700;
    margin-bottom: 0;
    text-align: center;
    border: none;
  }

  .documents-button-fullscreen {
    background: #3182ce;
    color: white;
    border: none !important;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(49, 130, 206, 0.3);
    display: inline-flex;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
    width: 100%;
    justify-content: center;
    outline: none !important;
  }

  .documents-button-fullscreen:hover {
    background: #2b6cb0;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(49, 130, 206, 0.4);
  }

  .nav-section-fullscreen h2 {
    font-size: 1.1rem;
    color: #4a5568;
    margin-bottom: 1rem;
    font-weight: 600;
    border-bottom: 2px solid #e2e8f0 !important; /* Mantener solo esta línea */
    padding-bottom: 0.5rem;
    border: none;
  }

  .nav-list-fullscreen {
    list-style: none;
    border: none;
  }

  .section-header-fullscreen {
    margin-top: 1.5rem;
    font-weight: 700;
    color: #718096;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.8rem;
    border: none;
  }

  .nav-link-fullscreen {
    display: block;
    width: 100%;
    padding: 0.8rem 1rem;
    color: #2d3748;
    text-decoration: none;
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none !important;
    background: transparent;
    text-align: left;
    font-family: inherit;
    font-weight: 500;
    margin-bottom: 0.5rem;
    outline: none !important;
  }

  .nav-link-fullscreen:hover {
    background-color: #edf2f7;
    color: #2b6cb0;
    transform: translateX(5px);
  }

  .main-content-fullscreen {
    flex-grow: 1;
    padding: 0;
    position: relative;
    overflow: hidden;
    background: #ffffff;
    height: 100%;
    width: 100%;
    border: none;
  }

  .dashboard-container-fullscreen {
    width: 100%;
    height: 100%;
    padding: 2rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: none;
  }
`}</style>

      <div className="container-fullscreen">
        {/* Sidebar */}
        <aside className="sidebar-fullscreen">
          <div className="header-section-fullscreen">
            <h1 className="university-title-fullscreen">Universidad Politécnica de Tapachula</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <button 
                className="documents-button-fullscreen"
                onClick={() => {}}
              >
                <i className="fas fa-file-alt"></i> Documentos
              </button>
              <button 
                className="documents-button-fullscreen"
                onClick={onLogout}
                style={{ background: '#e53e3e' }}
              >
                <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="nav-section-fullscreen">
            <h2>Dirección de Planeación Educativa</h2>
            <ul className="nav-list-fullscreen">
              <li className="section-header-fullscreen">Procedimiento</li>
              <li>
                <button 
                  className="nav-link-fullscreen"
                  onClick={() => redirectToHTML('gestion-fondos')}
                >
                  <i className="fas fa-money-bill-wave" style={{ marginRight: '10px' }}></i>
                  DP-PI.01 Gestión de Fondos
                </button>
              </li>
              <li>
                <button 
                  className="nav-link-fullscreen"
                  onClick={() => redirectToHTML('gestion-informacion')}
                >
                  <i className="fas fa-database" style={{ marginRight: '10px' }}></i>
                  DP-PI.02 Gestión de Información
                </button>
              </li>
              
              <li className="section-header-fullscreen">Registros</li>
              <li>
                <button 
                  className="nav-link-fullscreen"
                  onClick={() => redirectToHTML('programa-anual-de-trabajo')}
                >
                  <i className="fas fa-calendar-alt" style={{ marginRight: '10px' }}></i>
                  DP-RG.01 Programa Anual de Trabajo
                </button>
              </li>
              <li>
                <button 
                  className="nav-link-fullscreen"
                  onClick={() => redirectToHTML('informe-trimestral')}
                >
                  <i className="fas fa-chart-bar" style={{ marginRight: '10px' }}></i>
                  DP-RG.02 Informe Trimestral
                </button>
              </li>
              <li>
                <button 
                  className="nav-link-fullscreen"
                  onClick={() => redirectToHTML('planeacion-cuatrimestral')}
                >
                  <i className="fas fa-tasks" style={{ marginRight: '10px' }}></i>
                  DP-RG.03 Planeación Cuatrimestral
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Contenido principal - Outlet renderiza las rutas hijas */}
        <main className="main-content-fullscreen">
          <div className="dashboard-container-fullscreen">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UniversityLayout;