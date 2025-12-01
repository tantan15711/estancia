// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import './PlaneacionCuatri.scss';

function PlaneacionCuatri() {
  // Estados principales
  const [formData, setFormData] = useState({
    area: 'Dirección Académica',
    periodo: '',
    fecha: '',
    elaboro: '',
    voBo: ''
  });
  
  const [activities, setActivities] = useState([]);
  const [fileCache, setFileCache] = useState({});
  
  // Estados para modales y notificaciones
  const [modal, setModal] = useState({ open: false, title: '', message: '', action: null });
  const [previewModal, setPreviewModal] = useState({ open: false, file: null });
  const [toast, setToast] = useState({ open: false, message: '', type: '' });
  
  // Referencias para la generación de PDF
  const tableRef = useRef(null);
  
  // Inicializar con 7 filas
  useEffect(() => {
    const initialActivities = [];
    for (let i = 1; i <= 7; i++) {
      initialActivities.push({
        id: Date.now() + i,
        num: i,
        descripcion: '',
        semanas: Array(12).fill(''),
        cumplimiento: '',
        fileName: '',
        fileId: null
      });
    }
    setActivities(initialActivities);
  }, []);

  // Manejar cambios en el formulario principal
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Agregar nueva fila
  const addNewRow = () => {
    const newRow = {
      id: Date.now(),
      num: activities.length + 1,
      descripcion: '',
      semanas: Array(12).fill(''),
      cumplimiento: '',
      fileName: '',
      fileId: null
    };
    setActivities(prev => [...prev, newRow]);
    showToast('Fila agregada correctamente', 'success');
  };

  // Eliminar fila
  const deleteRow = (id) => {
    showModal('Eliminar fila', '¿Estás seguro de que deseas eliminar esta fila?', () => {
      setActivities(prev => {
        const newActivities = prev.filter(act => act.id !== id);
        // Renumerar las filas
        return newActivities.map((act, index) => ({
          ...act,
          num: index + 1
        }));
      });
      showToast('Fila eliminada correctamente', 'success');
    });
  };

  // Manejar cambios en actividades
  const handleActivityChange = (id, field, value, index = null) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === id) {
        if (field === 'semanas' && index !== null) {
          const newSemanas = [...activity.semanas];
          newSemanas[index] = value;
          return { ...activity, semanas: newSemanas };
        }
        return { ...activity, [field]: value };
      }
      return activity;
    }));
  };

  // Manejar carga de archivos
  const handleFileChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const fileId = `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Actualizar estado de actividades
      setActivities(prev => prev.map(activity => {
        if (activity.id === id) {
          return { ...activity, fileName: file.name, fileId };
        }
        return activity;
      }));
      
      // Actualizar caché de archivos
      setFileCache(prev => ({ ...prev, [fileId]: file }));
      showToast('Documento subido correctamente', 'success');
    }
  };

  // Eliminar archivo adjunto
  const removeFile = (id) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === id) {
        // Eliminar archivo de la caché
        if (activity.fileId) {
          setFileCache(prev => {
            const newCache = { ...prev };
            delete newCache[activity.fileId];
            return newCache;
          });
        }
        return { ...activity, fileName: '', fileId: null };
      }
      return activity;
    }));
    showToast('Documento eliminado', 'info');
  };

  // Mostrar modal
  const showModal = (title, message, action) => {
    setModal({ open: true, title, message, action });
  };

  // Cerrar modal
  const closeModal = () => {
    setModal({ open: false, title: '', message: '', action: null });
  };

  // Mostrar vista previa
  const previewFile = (fileId) => {
    const file = fileCache[fileId];
    if (file) {
      setPreviewModal({ open: true, file });
    }
  };

  // Cerrar vista previa
  const closePreview = () => {
    setPreviewModal({ open: false, file: null });
  };

  // Mostrar notificación
  const showToast = (message, type) => {
    setToast({ open: true, message, type });
    setTimeout(() => {
      setToast({ open: false, message: '', type: '' });
    }, 3000);
  };

  // Guardar datos
  const saveData = () => {
    const data = {
      ...formData,
      actividades: activities.map(act => ({
        ...act,
        // No guardamos el archivo en sí, solo la referencia
        file: undefined
      }))
    };
    
    localStorage.setItem('seguimientoActividades', JSON.stringify(data));
    showToast('Datos guardados correctamente', 'success');
    closeModal();
  };

  // Cargar datos
  const loadData = () => {
    const savedData = localStorage.getItem('seguimientoActividades');
    if (savedData) {
      const data = JSON.parse(savedData);
      setFormData({
        area: data.area || '',
        periodo: data.periodo || '',
        fecha: data.fecha || '',
        elaboro: data.elaboro || '',
        voBo: data.voBo || ''
      });
      
      setActivities(data.actividades || []);
      showToast('Datos cargados correctamente', 'success');
    } else {
      showToast('No hay datos guardados', 'warning');
    }
    closeModal();
  };

  // Limpiar todo
  const clearAll = () => {
    setFormData({
      area: '',
      periodo: '',
      fecha: '',
      elaboro: '',
      voBo: ''
    });
    
    // Restablecer a 7 filas vacías
    const initialActivities = [];
    for (let i = 1; i <= 7; i++) {
      initialActivities.push({
        id: Date.now() + i,
        num: i,
        descripcion: '',
        semanas: Array(12).fill(''),
        cumplimiento: '',
        fileName: '',
        fileId: null
      });
    }
    setActivities(initialActivities);
    
    // Limpiar caché de archivos
    setFileCache({});
    
    showToast('Todos los datos han sido limpiados', 'success');
    closeModal();
  };

  // Generar PDF (simulación)
  const generatePdf = () => {
    showModal('Generar PDF', '¿Desea generar un PDF con los datos actuales?', () => {
      // En una implementación real, aquí se usarían las librerías jsPDF y html2canvas
      showToast('PDF generado correctamente (simulación)', 'success');
      closeModal();
    });
  };

  // Renderizar filas de actividades
  const renderActivities = () => {
    return activities.map(activity => (
      <tr key={activity.id} className="fade-in">
        <td>{activity.num}</td>
        <td>
          <textarea
            value={activity.descripcion}
            onChange={(e) => handleActivityChange(activity.id, 'descripcion', e.target.value)}
            rows={3}
            placeholder="Ingrese descripción detallada de la actividad"
          />
        </td>
        
        {/* Semanas */}
        {activity.semanas.map((semana, index) => (
          <td key={index}>
            <input
              type="text"
              value={semana}
              onChange={(e) => handleActivityChange(activity.id, 'semanas', e.target.value, index)}
              style={{ width: '30px' }}
            />
          </td>
        ))}
        
        <td>
          <input
            type="text"
            value={activity.cumplimiento}
            onChange={(e) => handleActivityChange(activity.id, 'cumplimiento', e.target.value)}
            style={{ width: '50px' }}
          />
        </td>
        
        {/* Documento probatorio */}
        <td>
          <div className="document-container">
            <input
              type="file"
              id={`file-input-${activity.id}`}
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(activity.id, e)}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />
            
            <div 
              className="file-input-container"
              onClick={() => document.getElementById(`file-input-${activity.id}`).click()}
            >
              <i className="fas fa-cloud-upload-alt file-icon"></i>
              <span style={{ fontSize: '12px' }}>
                {activity.fileName ? activity.fileName : 'Haga clic para subir documento'}
              </span>
            </div>
            
            {activity.fileName && (
              <div className="file-actions">
                <button 
                  className="file-btn preview-btn"
                  onClick={() => previewFile(activity.fileId)}
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button 
                  className="file-btn remove-btn"
                  onClick={() => removeFile(activity.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            )}
          </div>
        </td>
        
        {/* Acciones */}
        <td>
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => deleteRow(activity.id)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>SEGUIMIENTO DE ACTIVIDADES</h1>
        </header>
        
        {/* Párrafo informativo superior */}
        <div className="info-paragraph">
          <p>Este formulario está diseñado para el seguimiento periódico de actividades académicas. Por favor complete todas las secciones correspondientes y adjunte los documentos probatorios cuando sea necesario.</p>
        </div>
        
        <div className="form-group area-periodo">
          <div className="input-group">
            <label htmlFor="area">Área:</label>
            <input 
              type="text" 
              id="area" 
              placeholder="Ingrese el área" 
              value={formData.area}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="periodo">Periodo:</label>
            <input 
              type="text" 
              id="periodo" 
              placeholder="Ingrese el periodo" 
              value={formData.periodo}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="table-container">
          <table id="actividades-table" ref={tableRef}>
            <thead>
              <tr>
                <th rowSpan="2">NUM</th>
                <th rowSpan="2">DESCRIPCIÓN DE LA ACTIVIDAD</th>
                <th colSpan="4">MES 1</th>
                <th colSpan="4">MES 2</th>
                <th colSpan="4">MES 3</th>
                <th rowSpan="2">% CUMPLIMIENTO</th>
                <th rowSpan="2">DOCUMENTO PROBATORIO</th>
                <th rowSpan="2">ACCIONES</th>
              </tr>
              <tr className="mes-header">
                <th>S1</th><th>S2</th><th>S3</th><th>S4</th>
                <th>S1</th><th>S2</th><th>S3</th><th>S4</th>
                <th>S1</th><th>S2</th><th>S3</th><th>S4</th>
              </tr>
            </thead>
            <tbody id="table-body">
              {renderActivities()}
            </tbody>
          </table>
        </div>
        
        <div className="form-group fecha">
          <div className="input-group">
            <label htmlFor="fecha">Fecha:</label>
            <input 
              type="date" 
              id="fecha" 
              value={formData.fecha}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="form-group firma-section">
          <div className="firma-box">
            <label htmlFor="elaboro">Nombre y Puesto Elaboró:</label>
            <input 
              type="text" 
              id="elaboro" 
              placeholder="Nombre y puesto" 
              value={formData.elaboro}
              onChange={handleInputChange}
            />
          </div>
          <div className="firma-box">
            <label htmlFor="vo-bo">Nombre y Puesto Vo. Bo.:</label>
            <input 
              type="text" 
              id="vo-bo" 
              placeholder="Nombre y puesto" 
              value={formData.voBo}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        {/* Párrafo informativo inferior */}
        <div className="info-paragraph">
          <p>Una vez completado el formulario, genere el PDF para obtener una versión imprimible o guárdelo para continuar más tarde. Todos los campos son obligatorios.</p>
        </div>
        
        <div className="btn-container">
          <button id="add-row" className="btn btn-primary" onClick={addNewRow}>
            <i className="fas fa-plus"></i> Agregar Fila
          </button>
          <button id="generate-pdf" className="btn btn-success" onClick={generatePdf}>
            <i className="fas fa-file-pdf"></i> Generar PDF
          </button>
          <button id="save-data" className="btn btn-warning" onClick={() => showModal('Guardar datos', '¿Estás seguro de que deseas guardar los datos actuales?', saveData)}>
            <i className="fas fa-save"></i> Guardar Datos
          </button>
          <button id="load-data" className="btn btn-info" onClick={() => showModal('Cargar datos', '¿Estás seguro de que deseas cargar los datos guardados? Esto sobrescribirá los datos actuales.', loadData)}>
            <i className="fas fa-folder-open"></i> Cargar Datos
          </button>
          <button id="clear-all" className="btn btn-danger" onClick={() => showModal('Limpiar todo', '¿Estás seguro de que deseas limpiar todos los datos? Esta acción no se puede deshacer.', clearAll)}>
            <i className="fas fa-trash"></i> Limpiar Todo
          </button>
        </div>
        
        <footer className="footer">
          <p><strong>Documento controlado por medios electrónicos.</strong></p>
          <p>Puede ser establecido en Universidad Politécnica de Tapachula</p>
          <p><a href="http://www.upbjoportulato.edu.mx" target="_blank" rel="noopener noreferrer">www.upbjoportulato.edu.mx</a></p>
        </footer>
      </div>

      {/* Modal de confirmación */}
      {modal.open && (
        <div id="confirm-modal" className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="close-modal" onClick={closeModal}>&times;</span>
            <h3 id="modal-title">{modal.title}</h3>
            <p id="modal-message">{modal.message}</p>
            <div className="modal-buttons">
              <button id="modal-confirm" className="btn btn-primary" onClick={modal.action}>
                Confirmar
              </button>
              <button id="modal-cancel" className="btn btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de vista previa */}
      {previewModal.open && previewModal.file && (
        <div id="preview-modal" className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="close-modal" onClick={closePreview}>&times;</span>
            <h3>Vista Previa del Documento</h3>
            <div className="preview-container" id="preview-container">
              {previewModal.file.type.includes('image') ? (
                <img 
                  src={URL.createObjectURL(previewModal.file)} 
                  alt="Vista previa" 
                  style={{ maxWidth: '100%' }}
                />
              ) : (
                <p>Vista previa no disponible para este tipo de archivo. Descargue el archivo para verlo.</p>
              )}
              <p>Nombre: {previewModal.file.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast.open && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Scripts para FontAwesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
}
export default PlaneacionCuatri;