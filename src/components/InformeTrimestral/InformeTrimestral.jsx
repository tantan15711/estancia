import React, { useState, useRef } from 'react';

const InformeTrimestral = () => {
  const [actionCounter, setActionCounter] = useState(1);
  const [acciones, setAcciones] = useState([{
    id: 1,
    numAccion: '',
    pat: '',
    descActividades: '',
    prog: '',
    real: '',
    cumplim: '',
    justif: '',
    impacto: '',
    gov: '',
    fechaReal: '',
    evidencia: ''
  }]);

  const [formData, setFormData] = useState({
    trimestre: '',
    areaTrabajo: '',
    mesAno: '',
    pide: '',
    cacei: '',
    elaboro: '',
    fechaElab: '',
    vobo: '',
    fechaRec: ''
  });

  const formRef = useRef();

  // Función para actualizar datos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Función para actualizar datos de acciones
  const handleActionChange = (index, field, value) => {
    setAcciones(prev => prev.map((accion, i) => 
      i === index ? { ...accion, [field]: value } : accion
    ));
  };

  // Calcular porcentaje de cumplimiento
  const calculateCompliance = (prog, real) => {
    const progNum = parseFloat(prog) || 0;
    const realNum = parseFloat(real) || 0;
    
    if (progNum > 0) {
      const pct = (realNum / progNum) * 100;
      return Math.min(pct, 100).toFixed(1);
    }
    return '';
  };

  // Agregar nueva acción
  const addAction = () => {
    const newAction = {
      id: actionCounter + 1,
      numAccion: '',
      pat: '',
      descActividades: '',
      prog: '',
      real: '',
      cumplim: '',
      justif: '',
      impacto: '',
      gov: '',
      fechaReal: '',
      evidencia: ''
    };
    
    setAcciones(prev => [...prev, newAction]);
    setActionCounter(prev => prev + 1);
  };

  // Eliminar acción
  const removeAction = (index) => {
    if (acciones.length > 1) {
      setAcciones(prev => prev.filter((_, i) => i !== index));
    } else {
      alert('Debe haber al menos una acción');
    }
  };

  // Eliminar última acción
  const removeLastAction = () => {
    if (acciones.length > 1) {
      setAcciones(prev => prev.slice(0, -1));
    }
  };

  // Generar PDF simple (simulado)
  const generatePDF = async () => {
    try {
      alert('Generando PDF... (Esta funcionalidad requiere librerías adicionales)');
      
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const fileName = `Informe_Trimestral_UPTap_${dateStr}.pdf`;
      
      console.log(`PDF generado: ${fileName}`);
      
    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('Error al generar el PDF: ' + err.message);
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar trimestre
    if (!formData.trimestre) {
      alert('Por favor seleccione un trimestre');
      return;
    }

    // Validar acciones
    for (let i = 0; i < acciones.length; i++) {
      const accion = acciones[i];
      
      if (!accion.numAccion.trim()) {
        alert(`Por favor ingrese el número de acción para la acción #${i + 1}`);
        return;
      }
      
      if (!accion.pat) {
        alert(`Por favor indique si la acción #${i + 1} está especificada en el PAT`);
        return;
      }
      
      if (!accion.descActividades.trim()) {
        alert(`Por favor ingrese la descripción de actividades para la acción #${i + 1}`);
        return;
      }
    }

    try {
      alert('Informe enviado correctamente');
      console.log('Datos del formulario:', { formData, acciones });
      
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Error al enviar el informe: ' + error.message);
    }
  };

  return (
    <div style={{ 
      fontFamily: "'Segoe UI', 'Roboto', sans-serif",
      lineHeight: 1.6,
      color: '#333',
      backgroundColor: '#f5f7fa',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <style jsx>{`
        :root {
          --primary-color: #2c3e50;
          --secondary-color: #3498db;
          --accent-color: #e74c3c;
          --light-color: #ecf0f1;
          --dark-color: #2c3e50;
          --gray-color: #95a5a6;
          --success-color: #27ae60;
          --warning-color: #f39c12;
          --border-radius: 8px;
          --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        .modern-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 15px 20px;
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logo-img {
          height: 70px;
          width: auto;
        }

        .title-container h1 {
          font-size: 1.3rem;
          color: var(--primary-color);
          font-weight: 600;
          margin-bottom: 5px;
        }

        .title-container h2 {
          font-size: 1rem;
          color: var(--gray-color);
          font-weight: 500;
        }

        .form-title h1 {
          font-size: 1.2rem;
          color: var(--primary-color);
          text-align: right;
          margin-bottom: 5px;
        }

        .form-title h2 {
          font-size: 1.5rem;
          color: var(--secondary-color);
          text-align: right;
          font-weight: 600;
        }

        .form-container {
          background: white;
          padding: 30px;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          margin-bottom: 30px;
        }

        .quarter-section, .action-section, .signatures-section {
          margin-bottom: 25px;
          padding: 20px;
          border-radius: var(--border-radius);
          background: #f8f9fa;
          border: 1px solid #e9ecef;
        }

        .quarter-section legend {
          font-weight: 600;
          color: var(--primary-color);
          padding: 0 10px;
          font-size: 1.1rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .section-header h3 {
          color: var(--primary-color);
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .remove-action-btn {
          background: var(--accent-color);
          color: white;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .remove-action-btn:hover {
          background: #c0392b;
          transform: scale(1.05);
        }

        .grid-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .input-group {
          margin-bottom: 15px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--primary-color);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-group input,
        .input-group textarea,
        .input-group select {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: var(--border-radius);
          font-size: 1rem;
          transition: var(--transition);
          background-color: #fff;
        }

        .input-group input:focus,
        .input-group textarea:focus {
          border-color: var(--secondary-color);
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
          outline: none;
        }

        .radio-group {
          display: flex;
          gap: 15px;
          margin-top: 8px;
        }

        .radio-group.horizontal {
          flex-direction: row;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .radio-custom {
          width: 18px;
          height: 18px;
          border: 2px solid var(--gray-color);
          border-radius: 50%;
          display: inline-block;
          position: relative;
          transition: var(--transition);
        }

        .radio-option input[type="radio"] {
          display: none;
        }

        .radio-option input[type="radio"]:checked + .radio-custom {
          border-color: var(--secondary-color);
          background-color: var(--secondary-color);
        }

        .radio-option input[type="radio"]:checked + .radio-custom::after {
          content: '';
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .table-responsive {
          overflow-x: auto;
          margin: 20px 0;
        }

        .goals-table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          font-size: 0.95rem;
        }

        .goals-table th {
          background-color: var(--primary-color);
          color: white;
          padding: 12px;
          text-align: center;
          font-weight: 500;
        }

        .goals-table td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: center;
        }

        .goals-table input,
        .goals-table textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
        }

        button {
          padding: 12px 20px;
          border: none;
          border-radius: var(--border-radius);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-add {
          background-color: var(--success-color);
          color: white;
        }

        .btn-add:hover {
          background-color: #219653;
          transform: translateY(-2px);
        }

        .btn-remove {
          background-color: var(--accent-color);
          color: white;
        }

        .btn-remove:hover:not(:disabled) {
          background-color: #c0392b;
          transform: translateY(-2px);
        }

        .btn-pdf {
          background-color: var(--warning-color);
          color: white;
        }

        .btn-pdf:hover {
          background-color: #e67e22;
          transform: translateY(-2px);
        }

        .btn-submit {
          background-color: var(--secondary-color);
          color: white;
        }

        .btn-submit:hover {
          background-color: #2980b9;
          transform: translateY(-2px);
        }

        button:disabled {
          background-color: #bdc3c7 !important;
          cursor: not-allowed;
          transform: none !important;
        }

        .result-input {
          background-color: #f8f9fa !important;
          font-weight: 600;
          color: var(--primary-color);
        }

        @media (max-width: 768px) {
          .modern-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .form-title h1,
          .form-title h2 {
            text-align: left;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          button {
            width: 100%;
          }
        }
      `}</style>

      {/* Header */}
      <header className="modern-header">
        <div className="logo-container">
          <img 
            src="lince.png" 
            alt="Logo UPTap" 
            className="logo-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="title-container">
            <h1>Universidad Politécnica de Tapachula</h1>
            <h2>Dirección de Planeación Educativa</h2>
          </div>
        </div>
        <div className="form-title">
          <h1>Registro</h1>
          <h2>Informe Trimestral</h2>
        </div>
      </header>

      {/* Main Container */}
      <main className="form-container">
        <div ref={formRef}>
          {/* Selección de Trimestre */}
          <fieldset className="quarter-section">
            <legend>
              <i className="fas fa-calendar-alt"></i> Trimestre: (Marcar con una X)
            </legend>
            <div className="radio-group">
              {[
                { value: '1', label: '1 (Ene-Mar)' },
                { value: '2', label: '2 (Abr-Jun)' },
                { value: '3', label: '3 (Jul-Sep)' },
                { value: '4', label: '4 (Oct-Dic)' }
              ].map(trimestre => (
                <label key={trimestre.value} className="radio-option">
                  <input 
                    type="radio" 
                    name="trimestre" 
                    value={trimestre.value}
                    checked={formData.trimestre === trimestre.value}
                    onChange={handleInputChange}
                    required 
                  />
                  <span className="radio-custom"></span>
                  <span>{trimestre.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Información básica */}
          <div className="grid-section">
            <div className="input-group">
              <label htmlFor="areaTrabajo">
                <i className="fas fa-building"></i> Área de Trabajo
              </label>
              <input 
                type="text" 
                id="areaTrabajo" 
                name="areaTrabajo" 
                value={formData.areaTrabajo}
                onChange={handleInputChange}
                required 
                placeholder="Ej. Dirección Académica"
              />
            </div>
            <div className="input-group">
              <label htmlFor="mesAno">
                <i className="fas fa-calendar"></i> Mes y Año
              </label>
              <input 
                type="month" 
                id="mesAno" 
                name="mesAno" 
                value={formData.mesAno}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="input-group">
              <label htmlFor="pide">
                <i className="fas fa-certificate"></i> PIDE
              </label>
              <input 
                type="text" 
                id="pide" 
                name="pide" 
                value={formData.pide}
                onChange={handleInputChange}
                placeholder="Código PIDE"
              />
            </div>
            <div className="input-group">
              <label htmlFor="cacei">
                <i className="fas fa-certificate"></i> CACEI
              </label>
              <input 
                type="text" 
                id="cacei" 
                name="cacei" 
                value={formData.cacei}
                onChange={handleInputChange}
                placeholder="Código CACEI"
              />
            </div>
          </div>

          {/* Contenedor de acciones */}
          <div id="accionesContainer">
            {acciones.map((accion, index) => (
              <section key={accion.id} className="action-section">
                <div className="section-header">
                  <h3>
                    <i className="fas fa-tasks"></i> Acción #{index + 1}
                  </h3>
                  <button 
                    type="button" 
                    className="remove-action-btn" 
                    title="Eliminar acción"
                    onClick={() => removeAction(index)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
                
                <div className="grid-section">
                  <div className="input-group">
                    <label>Número de Acción</label>
                    <input 
                      type="text" 
                      value={accion.numAccion}
                      onChange={(e) => handleActionChange(index, 'numAccion', e.target.value)}
                      required 
                      placeholder="Ej. ACC-001"
                    />
                  </div>
                  <div className="input-group">
                    <label>Especificada en el PAT</label>
                    <div className="radio-group horizontal">
                      <label className="radio-option">
                        <input 
                          type="radio" 
                          name={`pat_${index}`} 
                          value="SI"
                          checked={accion.pat === 'SI'}
                          onChange={(e) => handleActionChange(index, 'pat', e.target.value)}
                          required 
                        />
                        <span className="radio-custom"></span>
                        <span>SI</span>
                      </label>
                      <label className="radio-option">
                        <input 
                          type="radio" 
                          name={`pat_${index}`} 
                          value="NO"
                          checked={accion.pat === 'NO'}
                          onChange={(e) => handleActionChange(index, 'pat', e.target.value)}
                        />
                        <span className="radio-custom"></span>
                        <span>NO</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label>Descripción de Actividades Desarrolladas</label>
                  <textarea 
                    value={accion.descActividades}
                    onChange={(e) => handleActionChange(index, 'descActividades', e.target.value)}
                    rows="4" 
                    required 
                    placeholder="Describa las actividades realizadas..."
                  ></textarea>
                </div>

                <div className="table-responsive">
                  <table className="goals-table">
                    <thead>
                      <tr>
                        <th>Programado (P)</th>
                        <th>Realizado (R)</th>
                        <th>% Cumplimiento (R/P *100)</th>
                        <th>Justificación de incumplimiento</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input 
                            type="number" 
                            value={accion.prog}
                            onChange={(e) => {
                              handleActionChange(index, 'prog', e.target.value);
                              const newCumplim = calculateCompliance(e.target.value, accion.real);
                              handleActionChange(index, 'cumplim', newCumplim);
                            }}
                            min="0" 
                            step="0.01" 
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            value={accion.real}
                            onChange={(e) => {
                              handleActionChange(index, 'real', e.target.value);
                              const newCumplim = calculateCompliance(accion.prog, e.target.value);
                              handleActionChange(index, 'cumplim', newCumplim);
                            }}
                            min="0" 
                            step="0.01" 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={accion.cumplim}
                            readOnly 
                            className="result-input" 
                          />
                        </td>
                        <td>
                          <textarea 
                            value={accion.justif}
                            onChange={(e) => handleActionChange(index, 'justif', e.target.value)}
                            rows="2" 
                            placeholder="Explique si aplica"
                          ></textarea>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid-section">
                  <div className="input-group">
                    <label>Impacto de la actividad</label>
                    <textarea 
                      value={accion.impacto}
                      onChange={(e) => handleActionChange(index, 'impacto', e.target.value)}
                      rows="3" 
                      placeholder="Describa el impacto generado"
                    ></textarea>
                  </div>
                  <div className="input-group">
                    <label>Destacar para informe de Gobierno</label>
                    <div className="radio-group horizontal">
                      <label className="radio-option">
                        <input 
                          type="radio" 
                          name={`gov_${index}`} 
                          value="SI"
                          checked={accion.gov === 'SI'}
                          onChange={(e) => handleActionChange(index, 'gov', e.target.value)}
                          required 
                        />
                        <span className="radio-custom"></span>
                        <span>SI</span>
                      </label>
                      <label className="radio-option">
                        <input 
                          type="radio" 
                          name={`gov_${index}`} 
                          value="NO"
                          checked={accion.gov === 'NO'}
                          onChange={(e) => handleActionChange(index, 'gov', e.target.value)}
                        />
                        <span className="radio-custom"></span>
                        <span>NO</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid-section">
                  <div className="input-group">
                    <label>Fecha de Realización</label>
                    <input 
                      type="date" 
                      value={accion.fechaReal}
                      onChange={(e) => handleActionChange(index, 'fechaReal', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Evidencia fotográfica (enlace Drive)</label>
                    <div style={{ position: 'relative' }}>
                      <i className="fas fa-link" style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: 'var(--gray-color)' 
                      }}></i>
                      <input 
                        type="url" 
                        value={accion.evidencia}
                        onChange={(e) => handleActionChange(index, 'evidencia', e.target.value)}
                        placeholder="https://drive.google.com/..."
                        style={{ paddingLeft: '35px' }}
                      />
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div className="action-buttons">
            <button type="button" onClick={addAction} className="btn-add">
              <i className="fas fa-plus-circle"></i> Agregar Acción
            </button>
            <button 
              type="button" 
              onClick={removeLastAction} 
              className="btn-remove" 
              disabled={acciones.length <= 1}
            >
              <i className="fas fa-minus-circle"></i> Deshacer Acción
            </button>
          </div>

          {/* Firma y recepciones */}
          <div className="signatures-section">
            <div className="grid-section">
              <div className="input-group">
                <label htmlFor="elaboro">
                  <i className="fas fa-user-edit"></i> Elaboró
                </label>
                <input 
                  type="text" 
                  id="elaboro" 
                  name="elaboro" 
                  value={formData.elaboro}
                  onChange={handleInputChange}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="input-group">
                <label htmlFor="fechaElab">
                  <i className="fas fa-calendar-day"></i> Fecha de elaboración
                </label>
                <input 
                  type="date" 
                  id="fechaElab" 
                  name="fechaElab" 
                  value={formData.fechaElab}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="vobo">
                  <i className="fas fa-stamp"></i> Vo.Bo.
                </label>
                <input 
                  type="text" 
                  id="vobo" 
                  name="vobo" 
                  value={formData.vobo}
                  onChange={handleInputChange}
                  placeholder="Nombre y cargo"
                />
              </div>
              <div className="input-group">
                <label htmlFor="fechaRec">
                  <i className="fas fa-calendar-check"></i> Fecha de recepción
                </label>
                <input 
                  type="date" 
                  id="fechaRec" 
                  name="fechaRec" 
                  value={formData.fechaRec}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={generatePDF} className="btn-pdf">
              <i className="fas fa-file-pdf"></i> Exportar a PDF
            </button>
            <button type="button" onClick={handleSubmit} className="btn-submit">
              <i className="fas fa-paper-plane"></i> Enviar Informe
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InformeTrimestral;