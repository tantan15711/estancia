import React, { useState, useEffect, useCallback } from 'react';
import './PATForm.scss';

const PatForm = () => {
  // Estados para datos generales
  const [generalData, setGeneralData] = useState({
    responsable: '',
    departamento: '',
    adscripcion: '',
    programa: '2025',
    logros: '',
    causas: '',
    decisiones: ''
  });

  // Estados para firmas
  const [signatures, setSignatures] = useState({
    responsable: '',
    jefe: '',
    titular: ''
  });

  // Estado para acciones
  const [actions, setActions] = useState([]);

  // Estado para alertas
  const [alert, setAlert] = useState(null);

  // Función para agregar filas de acción (estable con useCallback)
  const addActionRow = useCallback(() => {
    const newAction = {
      id: Date.now(),
      eje: '',
      cat: '',
      ambito: '',
      accion: '',
      meses: {
        E: false, F: false, M: false, A: false, M2: false, J: false,
        J2: false, A2: false, S: false, O: false, N: false, D: false
      },
      meta: '',
      programado: '',
      cumplimiento: ''
    };
    setActions(prev => [...prev, newAction]);
  }, []);

  // Función para cargar borrador (estable con useCallback)
  const loadDraft = useCallback(() => {
    // En un entorno real, esto cargaría desde una API
    // Por ahora, agregar una acción por defecto si no hay ninguna
    if (actions.length === 0) {
      addActionRow();
    }
  }, [actions.length, addActionRow]);

  // Cargar datos al inicializar
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  // Funciones de manejo de datos generales
  const handleGeneralDataChange = (field, value) => {
    setGeneralData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Funciones de manejo de firmas
  const handleSignatureChange = (field, value) => {
    setSignatures(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Funciones de manejo de acciones
  const removeAction = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta acción?')) {
      setActions(prev => prev.filter(action => action.id !== id));
      showAlert('Acción eliminada correctamente', 'success');
    }
  };

  const clearAllActions = useCallback(() => {
    if (actions.length === 0) {
      showAlert('No hay acciones para eliminar', 'error');
      return;
    }

    if (window.confirm('¿Estás seguro de eliminar TODAS las acciones? Esto no se puede deshacer.')) {
      setActions([]);
      showAlert('Todas las acciones han sido eliminadas', 'success');
    }
  }, [actions.length]);

  const updateAction = (id, field, value) => {
    setActions(prev => prev.map(action =>
      action.id === id
        ? { ...action, [field]: value }
        : action
    ));
  };

  const updateActionMonth = (id, month, checked) => {
    setActions(prev => prev.map(action =>
      action.id === id
        ? { ...action, meses: { ...action.meses, [month]: checked } }
        : action
    ));
  };

  // Función para mostrar alertas
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  // Funciones de guardado y carga
  const saveDraft = useCallback(() => {
    const formData = {
      general: generalData,
      actions: actions,
      signatures: signatures
    };

    // En un entorno real, esto sería una llamada a API
    console.log('Guardando borrador:', formData);
    showAlert('Borrador guardado exitosamente', 'success');
  }, [generalData, actions, signatures]);

  // Validación del formulario
  const validateForm = useCallback(() => {
    const requiredFields = [
      { value: generalData.responsable, message: 'El responsable es obligatorio' },
      { value: generalData.departamento, message: 'El departamento es obligatorio' },
      { value: generalData.adscripcion, message: 'El área de adscripción es obligatoria' },
      { value: generalData.programa, message: 'El programa de trabajo es obligatorio' },
      { value: signatures.responsable, message: 'El nombre del responsable es obligatorio' },
      { value: signatures.jefe, message: 'El nombre del jefe inmediato es obligatorio' },
      { value: signatures.titular, message: 'El nombre del titular es obligatorio' }
    ];

    for (const field of requiredFields) {
      if (!field.value.trim()) {
        showAlert(field.message, 'error');
        return false;
      }
    }

    if (actions.length === 0) {
      showAlert('Debe agregar al menos una acción', 'error');
      return false;
    }

    const actionsValid = actions.every(action =>
      action.accion.trim() && action.meta.trim()
    );

    if (!actionsValid) {
      showAlert('Todas las acciones deben tener descripción y meta completas', 'error');
      return false;
    }

    return true;
  }, [generalData, signatures, actions]);

  // Función para generar PDF
  const generatePDFContent = useCallback(() => {
    const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthKeys = ['E', 'F', 'M', 'A', 'M2', 'J', 'J2', 'A2', 'S', 'O', 'N', 'D'];

    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>PAT ${generalData.programa}</title>
          <style>
              body { font-family: Arial; margin: 0; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .info-table td { padding: 8px; border: 1px solid #ddd; }
              .main-table { width: 100%; border-collapse: collapse; font-size: 12px; }
              .main-table th, .main-table td { border: 1px solid #000; padding: 8px; text-align: center; }
              .main-table th { background-color: #f2f2f2; font-weight: bold; }
              .signature-table { width: 100%; margin-top: 40px; }
              .signature-table td { width: 33%; text-align: center; padding-top: 60px; border-top: 1px solid #000; }
              .page-break { page-break-before: always; margin-top: 30px; }
              .text-justify { text-align: justify; }
              .checked { background-color: #e6f7ff; }
          </style>
      </head>
      <body>
          <div class="header">
              <h2>Universidad Politécnica de Tapachula</h2>
              <h3>Programa Anual de Trabajo (PAT)</h3>
          </div>

          <table class="info-table">
              <tr>
                  <td width="25%"><strong>Responsable:</strong> ${generalData.responsable}</td>
                  <td width="25%"></td>
                  <td width="25%"><strong>Área/Departamento:</strong> ${generalData.departamento}</td>
                  <td width="25%"></td>
              </tr>
              <tr>
                  <td><strong>Área de adscripción:</strong> ${generalData.adscripcion}</td>
                  <td></td>
                  <td><strong>Programa de Trabajo:</strong> ${generalData.programa}</td>
                  <td></td>
              </tr>
          </table>

          <table class="main-table">
              <thead>
                  <tr>
                      <th rowspan="2">EJE / ESTRATEGIA PIDE</th>
                      <th rowspan="2">CAT / IND DE CAT CACEI</th>
                      <th rowspan="2">ÁMBITO / INDICADOR / CRITERIO SEAES</th>
                      <th rowspan="2">ACCIONES</th>
                      <th colspan="12">CALENDARIO / MESES</th>
                      <th rowspan="2">META</th>
                      <th colspan="2">AVANCE</th>
                  </tr>
                  <tr>
                      ${monthLabels.map(m => `<th>${m}</th>`).join('')}
                      <th>Programado/ Realizado</th>
                      <th>% Cumplimiento</th>
                  </tr>
              </thead>
              <tbody>
                  ${actions.map(action => `
                      <tr>
                          <td>${action.eje || 'N/A'}</td>
                          <td>${action.cat || ''}</td>
                          <td>${action.ambito || ''}</td>
                          <td>${action.accion || ''}</td>
                          ${monthKeys.map(m => `
                              <td class="${action.meses[m] ? 'checked' : ''}">${action.meses[m] ? 'X' : ''}</td>
                          `).join('')}
                          <td>${action.meta || ''}</td>
                          <td>${action.programado || ''}</td>
                          <td>${action.cumplimiento || ''}</td>
                      </tr>
                  `).join('')}
                  <tr>
                      <td colspan="19" style="text-align: left; font-size: 11px;">
                          N/E: No especificado en el PIDE / CACEI / SEAES N/A: No aplica.
                      </td>
                  </tr>
              </tbody>
          </table>

          <table class="signature-table">
              <tr>
                  <td>${signatures.responsable}</td>
                  <td>${signatures.jefe}</td>
                  <td>${signatures.titular}</td>
              </tr>
              <tr>
                  <td>Responsable</td>
                  <td>Vo.Bo. Jefe o Jefa Inmediato Superior</td>
                  <td>Titular de la Dirección de Planeación</td>
              </tr>
          </table>

          <div class="page-break">
              <div class="header">
                  <h2>Universidad Politécnica de Tapachula</h2>
                  <h3>Programa Anual de Trabajo (PAT)</h3>
              </div>
              
              <table class="info-table">
                  <tr>
                      <td width="25%"><strong>Responsable:</strong> ${generalData.responsable}</td>
                      <td width="25%"></td>
                      <td width="25%"><strong>Área/Departamento:</strong> ${generalData.departamento}</td>
                      <td width="25%"></td>
                  </tr>
                  <tr>
                      <td><strong>Área de adscripción:</strong> ${generalData.adscripcion}</td>
                      <td></td>
                      <td><strong>Programa de Trabajo:</strong> ${generalData.programa}</td>
                      <td></td>
                  </tr>
              </table>
              
              <h3 style="margin-top: 20px;">EVALUACIÓN DEL PAT</h3>
              
              <h4>LOGROS DEL PAT:</h4>
              <div class="text-justify" style="margin-bottom: 15px;">
                  ${generalData.logros.split('\n').map(p => `<p style="margin: 5px 0;">${p || ' '}</p>`).join('')}
              </div>
              
              <h4>EVALUACIÓN DE LAS CAUSAS EN CASO DE NO HABER LOGRADO LAS METAS:</h4>
              <div class="text-justify" style="margin-bottom: 15px;">
                  ${generalData.causas.split('\n').map(p => `<p style="margin: 5px 0;">${p || ' '}</p>`).join('')}
              </div>
              
              <h4>DECISIONES O ACCIONES A CONSIDERAR PARA EL PAT DEL SIGUIENTE AÑO:</h4>
              <div class="text-justify">
                  ${generalData.decisiones.split('\n').map(p => `<p style="margin: 5px 0;">${p || ' '}</p>`).join('')}
              </div>
          </div>
      </body>
      </html>
    `;
  }, [generalData, signatures, actions]);

  const generatePDF = useCallback(() => {
    if (!validateForm()) return;

    const pdfContent = generatePDFContent();
    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write(pdfContent);
    pdfWindow.document.close();

    setTimeout(() => {
      pdfWindow.print();
    }, 500);
  }, [validateForm, generatePDFContent]);


  // Agregar primera acción si no hay ninguna
  useEffect(() => {
    if (actions.length === 0) {
      addActionRow();
    }
  }, [actions.length, addActionRow]);

  return (
    <div className="pat-form">
      {/* Alerta */}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      {/* Header */}
      <div className="header no-print">
        <div>
          <h1>Universidad Politécnica de Tapachula</h1>
          <h2>Dirección de Planeación Educativa</h2>
        </div>
        <div>
          <img src="/assets/images/lince.png" alt="Logo UPTap" className="logo-img" />
        </div>
      </div>

      {/* Container */}
      <div className="container no-print">
        <div className="form-title">Registro</div>
        <h2>Programa Anual de Trabajo (PAT)</h2>

        {/* Datos Generales */}
        <div className="form-section">
          <h3>Datos Generales</h3>
          <table className="general-data-table">
            <tbody>
              <tr>
                <td><strong>Responsable:</strong></td>
                <td>
                  <input
                    type="text"
                    className="form-input"
                    value={generalData.responsable}
                    onChange={(e) => handleGeneralDataChange('responsable', e.target.value)}
                    required
                  />
                </td>
                <td><strong>Área/Departamento:</strong></td>
                <td>
                  <input
                    type="text"
                    className="form-input"
                    value={generalData.departamento}
                    onChange={(e) => handleGeneralDataChange('departamento', e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td><strong>Área de adscripción:</strong></td>
                <td>
                  <input
                    type="text"
                    className="form-input"
                    value={generalData.adscripcion}
                    onChange={(e) => handleGeneralDataChange('adscripcion', e.target.value)}
                    required
                  />
                </td>
                <td><strong>Programa de Trabajo:</strong></td>
                <td>
                  <input
                    type="text"
                    className="form-input"
                    value={generalData.programa}
                    onChange={(e) => handleGeneralDataChange('programa', e.target.value)}
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Acciones del PAT */}
        <div className="form-section">
          <div className="section-header">
            <h3 className="section-title">Acciones del PAT</h3>
            <div className="top-actions">
              <button
                className="btn btn-add"
                onClick={addActionRow}
              >
                <i className="fas fa-plus"></i> Agregar Acción
              </button>
              <button
                className="btn btn-remove"
                onClick={clearAllActions}
              >
                <i className="fas fa-trash"></i> Limpiar Todo
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table id="acciones-table">
              <thead>
                <tr>
                  <th rowSpan="2">EJE / ESTRATEGIA PIDE</th>
                  <th rowSpan="2">CAT / IND DE CAT CACEI</th>
                  <th rowSpan="2">ÁMBITO / INDICADOR / CRITERIO SEAES</th>
                  <th rowSpan="2">ACCIONES</th>
                  <th colSpan="12">CALENDARIO / MESES</th>
                  <th rowSpan="2">META</th>
                  <th colSpan="2">AVANCE</th>
                  <th rowSpan="2" className="no-print">Acciones</th>
                </tr>
                <tr>
                  <th>Ene</th>
                  <th>Feb</th>
                  <th>Mar</th>
                  <th>Abr</th>
                  <th>May</th>
                  <th>Jun</th>
                  <th>Jul</th>
                  <th>Ago</th>
                  <th>Sep</th>
                  <th>Oct</th>
                  <th>Nov</th>
                  <th>Dic</th>
                  <th>Programado/ Realizado</th>
                  <th>% Cumplimiento</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((action) => (
                  <tr key={action.id}>
                    <td>
                      <input
                        type="text"
                        className="table-input"
                        placeholder="Eje"
                        value={action.eje}
                        onChange={(e) => updateAction(action.id, 'eje', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="table-input"
                        placeholder="Categoría"
                        value={action.cat}
                        onChange={(e) => updateAction(action.id, 'cat', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="table-input"
                        placeholder="Ámbito"
                        value={action.ambito}
                        onChange={(e) => updateAction(action.id, 'ambito', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="table-input"
                        placeholder="Acción"
                        value={action.accion}
                        onChange={(e) => updateAction(action.id, 'accion', e.target.value)}
                        required
                      />
                    </td>
                    {/* Checkboxes de meses */}
                    {['E', 'F', 'M', 'A', 'M2', 'J', 'J2', 'A2', 'S', 'O', 'N', 'D'].map((month) => (
                      <td key={month}>
                        <input
                          type="checkbox"
                          className="month-checkbox"
                          checked={action.meses[month]}
                          onChange={(e) => updateActionMonth(action.id, month, e.target.checked)}
                        />
                      </td>
                    ))}
                    <td>
                      <input
                        type="text"
                        className="table-input"
                        placeholder="Meta"
                        value={action.meta}
                        onChange={(e) => updateAction(action.id, 'meta', e.target.value)}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="table-input"
                        placeholder="Programado"
                        value={action.programado}
                        onChange={(e) => updateAction(action.id, 'programado', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="table-input"
                        placeholder="% Cumplimiento"
                        value={action.cumplimiento}
                        onChange={(e) => updateAction(action.id, 'cumplimiento', e.target.value)}
                      />
                    </td>
                    <td className="action-buttons no-print">
                      <button
                        className="btn btn-remove"
                        onClick={() => removeAction(action.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evaluación del PAT */}
        <div className="form-section">
          <h3>Evaluación del PAT</h3>
          <div style={{ marginBottom: '10px' }}>
            <label><strong>LOGROS DEL PAT:</strong></label>
            <textarea
              className="form-input"
              rows="3"
              placeholder="Describa los logros"
              value={generalData.logros}
              onChange={(e) => handleGeneralDataChange('logros', e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label><strong>EVALUACIÓN DE LAS CAUSAS:</strong></label>
            <textarea
              className="form-input"
              rows="3"
              placeholder="Describa las causas"
              value={generalData.causas}
              onChange={(e) => handleGeneralDataChange('causas', e.target.value)}
            />
          </div>

          <div>
            <label><strong>DECISIONES PARA EL PRÓXIMO AÑO:</strong></label>
            <textarea
              className="form-input"
              rows="3"
              placeholder="Describa las acciones"
              value={generalData.decisiones}
              onChange={(e) => handleGeneralDataChange('decisiones', e.target.value)}
            />
          </div>
        </div>

        {/* Sección de firmas */}
        <div className="signature-section no-print">
          <div className="signature-box">
            <input
              type="text"
              className="form-input"
              placeholder="Nombre completo"
              value={signatures.responsable}
              onChange={(e) => handleSignatureChange('responsable', e.target.value)}
              required
            />
            <p>Responsable</p>
          </div>
          <div className="signature-box">
            <input
              type="text"
              className="form-input"
              placeholder="Nombre completo"
              value={signatures.jefe}
              onChange={(e) => handleSignatureChange('jefe', e.target.value)}
              required
            />
            <p>Vo.Bo. Jefe Inmediato</p>
          </div>
          <div className="signature-box">
            <input
              type="text"
              className="form-input"
              placeholder="Nombre completo"
              value={signatures.titular}
              onChange={(e) => handleSignatureChange('titular', e.target.value)}
              required
            />
            <p>Titular de Planeación</p>
          </div>
        </div>

        {/* Botones */}
        <div className="btn-container">
          <button
            className="btn btn-secondary"
            onClick={saveDraft}
          >
            <i className="fas fa-save"></i> Guardar Borrador
          </button>
          <button
            className="btn btn-primary"
            onClick={generatePDF}
          >
            <i className="fas fa-file-pdf"></i> Generar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatForm;