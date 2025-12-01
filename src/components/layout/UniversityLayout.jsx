import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './UniversityLayout.css'; // Asegúrate de crear este archivo

const UniversityLayout = ({ onLogout }) => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Función para redirigir directamente a los archivos HTML
  const redirectToHTML = (htmlFile) => {
    window.location.href = `/${htmlFile}`;
  };

  return (
    <div className="university-layout-fullscreen">
      <div className="container-fullscreen">
        {/* Sidebar */}
        <aside className="sidebar-fullscreen">
          <div className="header-section-fullscreen">
            <h1 className="university-title-fullscreen">Universidad Politécnica de Tapachula</h1>
            <div className="button-container">
              <button
                className="documents-button-fullscreen"
                onClick={() => { }}
              >
                <i className="fas fa-file-alt"></i> Documentos
              </button>
              <button
                className="documents-button-fullscreen logout-button"
                onClick={onLogout}
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
                  onClick={() => { }}
                >
                  <i className="fas fa-money-bill-wave nav-icon"></i>
                  DP-PI.01 Gestión de Fondos
                </button>
              </li>
              <li>
                <button
                  className="nav-link-fullscreen"
                  onClick={() => { }}
                >
                  <i className="fas fa-database nav-icon"></i>
                  DP-PI.02 Gestión de Información
                </button>
              </li>

              <li className="section-header-fullscreen">Registros</li>
              <li>
                <button
                  className="nav-link-fullscreen"
                  onClick={() => redirectToHTML('programa-anual-de-trabajo.html')}
                >
                  <i className="fas fa-calendar-alt nav-icon"></i>
                  DP-RG.01 Programa Anual de Trabajo
                </button>

                <button
                  className="nav-link-fullscreen"
                  onClick={() => redirectToHTML('informe-trimestral.html')}
                >
                  <i className="fas fa-chart-bar nav-icon"></i>
                  DP-RG.02 Informe Trimestral
                </button>

                <button
                  className="nav-link-fullscreen"
                  onClick={() => redirectToHTML('planeacion-cuatrimestral.html')}
                >
                  <i className="fas fa-tasks nav-icon"></i>
                  DP-RG.03 Planeación Cuatrimestral
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="main-content-fullscreen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UniversityLayout;