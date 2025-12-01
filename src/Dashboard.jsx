
const Dashboard = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      
      {/* Logo más grande */}
      <img 
        src="/lince.png" 
        alt="Logo Universidad Politécnica de Tapachula" 
        style={{ 
          width: '220px', // Aumentado de 150px a 220px
          height: 'auto', 
          marginBottom: '2.5rem',
          filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />

      {/* Título Principal */}
      <h1 style={{ 
        color: '#2c5282', 
        fontSize: '3rem', // Un poco más grande
        marginBottom: '1.5rem',
        fontWeight: '700',
        lineHeight: '1.2'
      }}>
        Panel de Control Principal
      </h1>

      {/* Mensaje de Bienvenida */}
      <p style={{ 
        color: '#4a5568', 
        fontSize: '1.5rem', // Un poco más grande
        marginBottom: '2.5rem',
        lineHeight: '1.6',
        maxWidth: '900px'
      }}>
        Bienvenido al sistema de gestión integral de la Universidad Politécnica de Tapachula
      </p>

      {/* Instrucción */}
      <div style={{
        backgroundColor: '#f7fafc',
        padding: '2.5rem',
        borderRadius: '16px',
        border: '2px solid #e2e8f0',
        maxWidth: '700px',
        marginTop: '2.5rem',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ 
          color: '#4a5568', 
          fontSize: '1.3rem',
          lineHeight: '1.6',
          margin: 0,
          fontWeight: '500'
        }}>
          <strong>Selecciona una opción del menú lateral</strong> para acceder a los diferentes formularios y documentos.
        </p>
      </div>

      {/* Footer Fijo en la parte inferior */}
      <footer style={{ 
        position: 'absolute',
        bottom: '2rem',
        color: '#718096', 
        fontSize: '1rem',
        textAlign: 'center',
        width: '100%'
      }}>
        © 2025 Universidad Politécnica de Tapachula - Todos los derechos reservados
      </footer>
    </div>
  );
};

export default Dashboard;