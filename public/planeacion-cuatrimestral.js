<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    // ----------------- Helpers -----------------
    const getByIds = (...ids) => {
        for (const id of ids) {
            if (!id) continue;
            const elById = document.getElementById(id);
            if (elById) return elById;
            try {
                const elSel = document.querySelector(id);
                if (elSel) return elSel;
            } catch (e) { /* noop */ }
        }
        return null;
    };

    const debug = (...args) => console.debug('[planeacion]', ...args);

    // ----------------- Elementos DOM -----------------
    const table = getByIds('actividades-table');
    let tableBody = table ? table.querySelector('tbody#table-body') : null;
    if (!tableBody && table) {
        tableBody = table.querySelector('tbody') || document.createElement('tbody');
        tableBody.id = 'table-body';
        if (!table.contains(tableBody)) table.appendChild(tableBody);
    }

    const addRowBtn = getByIds('add-row');
    const saveDataBtn = getByIds('save-data');
    const generateWordBtn = getByIds('generate-word');
    const clearAllBtn = getByIds('clear-all');
    const loadingElement = getByIds('loading');

    const modal = getByIds('confirm-modal');
    const previewModal = getByIds('preview-modal');
    const previewContainer = getByIds('preview-container');
    const modalTitle = getByIds('modal-title');
    const modalMessage = getByIds('modal-message');
    const modalConfirm = getByIds('modal-confirm');
    const modalCancel = getByIds('modal-cancel');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    const INITIAL_ROWS = 2;
    const periodoSelect = getByIds('periodo');

    const thMes1 = getByIds('mes1-header');
    const thMes2 = getByIds('mes2-header');
    const thMes3 = getByIds('mes3-header');
    const thMes4 = getByIds('mes4-header');

    // Elementos para firmas
    const firmaElaboroInput = getByIds('firma-elaboro');
    const firmaVoBoInput = getByIds('firma-vo-bo');
    const previewFirmaElaboro = getByIds('preview-firma-elaboro');
    const previewFirmaVoBo = getByIds('preview-firma-vo-bo');
    const removeFirmaBtns = document.querySelectorAll('.remove-firma');

    // ----------------- Estado -----------------
    let rowCount = 0;
    let fileCache = {};
    let currentAction = null;
    let firmasCache = {
        'firma-elaboro': null,
        'firma-vo-bo': null
    };

    // ----------------- Periodos y encabezados -----------------
    const periodToMonths = {
        'sep-dic': ['Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        'ene-abr': ['Enero', 'Febrero', 'Marzo', 'Abril'],
        'may-ago': ['Mayo', 'Junio', 'Julio', 'Agosto']
    };

    function setDefaultMonthHeaders() {
        if (thMes1) thMes1.textContent = 'MES 1';
        if (thMes2) thMes2.textContent = 'MES 2';
        if (thMes3) thMes3.textContent = 'MES 3';
        if (thMes4) thMes4.textContent = 'MES 4';
    }

    function updateMonthHeaders(periodValue) {
        if (!periodValue || !periodToMonths[periodValue]) {
            setDefaultMonthHeaders();
            return;
        }
        const meses = periodToMonths[periodValue];
        if (thMes1) thMes1.textContent = meses[0] || 'MES 1';
        if (thMes2) thMes2.textContent = meses[1] || 'MES 2';
        if (thMes3) thMes3.textContent = meses[2] || 'MES 3';
        if (thMes4) thMes4.textContent = meses[3] || 'MES 4';
    }

    if (periodoSelect) {
        updateMonthHeaders(periodoSelect.value);
        periodoSelect.addEventListener('change', (e) => updateMonthHeaders(e.target.value));
    } else {
        setDefaultMonthHeaders();
    }

    // ----------------- Toast y modal -----------------
    function showToast(message, type = 'info') {
        let toast = document.querySelector('.toast');
        if (toast) toast.remove();
        toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function showModal(title, message, action) {
        if (!modal || !modalTitle || !modalMessage) {
            if (typeof action === 'function') action();
            return;
        }
=======
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const tableBody = document.getElementById('table-body');
    const addRowBtn = document.getElementById('add-row');
    const saveDataBtn = document.getElementById('save-data');
    const loadDataBtn = document.getElementById('load-data');
    const generatePdfBtn = document.getElementById('generate-pdf');
    const clearAllBtn = document.getElementById('clear-all');
    const modal = document.getElementById('confirm-modal');
    const previewModal = document.getElementById('preview-modal');
    const previewContainer = document.getElementById('preview-container');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalConfirm = document.getElementById('modal-confirm');
    const modalCancel = document.getElementById('modal-cancel');
    const closeModal = document.querySelectorAll('.close-modal');

    // --- Inicio del bloque para actualizar cabeceras por periodo ---
    const periodoSelect = document.getElementById('periodo');

    // Mapeo pedido por el usuario
    const periodToMonths = {
    'sep-dic': ['Septiembre', 'Octubre', 'Noviembre'],
    'ene-abr': ['Enero', 'Febrero', 'Marzo'],
    'may-ago': ['Mayo', 'Junio', 'Julio']
    };

    // Referencias a los th (si no existen, el código falla silenciosamente)
    const thMes1 = document.getElementById('th-mes1');
    const thMes2 = document.getElementById('th-mes2');
    const thMes3 = document.getElementById('th-mes3');

    function setDefaultMonthHeaders() {
    if (thMes1) thMes1.textContent = 'MES 1';
    if (thMes2) thMes2.textContent = 'MES 2';
    if (thMes3) thMes3.textContent = 'MES 3';
    }

    function updateMonthHeaders(periodValue) {
    if (!periodValue || !periodToMonths[periodValue]) {
        // Sin selección -> volver a los nombres genéricos
        setDefaultMonthHeaders();
        return;
    }
    const meses = periodToMonths[periodValue];
    if (thMes1) thMes1.textContent = meses[0] || 'MES 1';
    if (thMes2) thMes2.textContent = meses[1] || 'MES 2';
    if (thMes3) thMes3.textContent = meses[2] || 'MES 3';
    }

    // Inicializar en carga (por si el select viene con valor guardado)
    updateMonthHeaders(periodoSelect.value);

    // Actualizar cuando el usuario abra/cambie la selección
    periodoSelect.addEventListener('change', (e) => {
    updateMonthHeaders(e.target.value);
    });
    // --- Fin del bloque para actualizar cabeceras por periodo ---

    
    // Variables de estado
    let currentAction = null;
    let fileCache = {};
    
    // Inicializar la tabla con 7 filas como en el ejemplo
    for (let i = 1; i <= 7; i++) {
        addRow(i);
    }
    
    // Event Listeners
    addRowBtn.addEventListener('click', addNewRow);
    saveDataBtn.addEventListener('click', () => showModal('Guardar datos', '¿Estás seguro de que deseas guardar los datos actuales?', saveData));
    loadDataBtn.addEventListener('click', () => showModal('Cargar datos', '¿Estás seguro de que deseas cargar los datos guardados? Esto sobrescribirá los datos actuales.', loadData));
    generatePdfBtn.addEventListener('click', generatePdf);
    clearAllBtn.addEventListener('click', () => showModal('Limpiar todo', '¿Estás seguro de que deseas limpiar todos los datos? Esta acción no se puede deshacer.', clearAll));
    
    // Event listeners para el modal
    modalConfirm.addEventListener('click', confirmAction);
    modalCancel.addEventListener('click', closeModalWindow);
    closeModal.forEach(btn => btn.addEventListener('click', closeModalWindow));
    window.addEventListener('click', (e) => {
        if (e.target === modal || e.target === previewModal) {
            closeModalWindow();
        }
    });
    
    // Funciones principales
    
    function addNewRow() {
        const rowCount = tableBody.querySelectorAll('tr').length + 1;
        addRow(rowCount);
        showToast('Fila agregada correctamente', 'success');
    }
    
    function addRow(num) {
        const row = document.createElement('tr');
        row.className = 'fade-in';
        
        // Número de actividad
        const numCell = document.createElement('td');
        numCell.textContent = num;
        row.appendChild(numCell);
        
        // Descripción de la actividad (ahora es un textarea)
        const descCell = document.createElement('td');
        const descInput = document.createElement('textarea');
        descInput.rows = 10;
        descInput.style.width = '100%';      // <- aquí ajustas el ancho
        descInput.placeholder = 'Ingrese descripción detallada de la actividad';
        descCell.appendChild(descInput);
        row.appendChild(descCell);

        
        // Celdas para los meses (12 semanas en total)
        for (let i = 0; i < 12; i++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.style.width = '30px';
            cell.appendChild(input);
            row.appendChild(cell);
        }
        
        // % Cumplimiento
        const cumplimientoCell = document.createElement('td');
        const cumplimientoInput = document.createElement('input');
        cumplimientoInput.type = 'text';
        cumplimientoInput.style.width = '50px';
        cumplimientoInput.addEventListener('change', calculateTotalCompliance);
        cumplimientoCell.appendChild(cumplimientoInput);
        row.appendChild(cumplimientoCell);
        
        // Documento probatorio
        const docCell = document.createElement('td');
        const docContainer = document.createElement('div');
        docContainer.className = 'document-container';
        
        // Contenedor para el input de archivo
        const fileContainer = document.createElement('div');
        fileContainer.className = 'file-input-container';
        
        // Icono de archivo
        const fileIcon = document.createElement('i');
        fileIcon.className = 'fas fa-cloud-upload-alt file-icon';
        
        // Texto descriptivo
        const fileLabel = document.createElement('span');
        fileLabel.textContent = 'Haga clic para subir documento';
        fileLabel.style.fontSize = '12px';
        
        // Nombre del archivo
        const fileName = document.createElement('div');
        fileName.className = 'file-name';
        fileName.textContent = '';
        
        // Input de archivo oculto
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png';
        
        // Evento para abrir el selector de archivos al hacer clic en el contenedor
        fileContainer.addEventListener('click', () => fileInput.click());
        
        // Evento para manejar la selección de archivos
        fileInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                fileName.textContent = file.name;
                
                // Guardar archivo en caché con ID único
                const fileId = 'file-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
                fileCache[fileId] = file;
                
                // Mostrar acciones
                fileActions.style.display = 'flex';
                
                // Actualizar eventos de vista previa y eliminación
                previewBtn.onclick = () => previewFile(fileId, file);
                removeBtn.onclick = () => removeFile(fileId, fileContainer, fileName, fileActions);
                
                showToast('Documento subido correctamente', 'success');
            }
        });
        
        // Botones de acción
        const fileActions = document.createElement('div');
        fileActions.className = 'file-actions';
        fileActions.style.display = 'none';
        
        const previewBtn = document.createElement('button');
        previewBtn.className = 'file-btn preview-btn';
        previewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'file-btn remove-btn';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
        
        fileActions.appendChild(previewBtn);
        fileActions.appendChild(removeBtn);
        
        fileContainer.appendChild(fileIcon);
        fileContainer.appendChild(fileLabel);
        fileContainer.appendChild(fileName);
        docContainer.appendChild(fileInput);
        docContainer.appendChild(fileContainer);
        docContainer.appendChild(fileActions);
        docCell.appendChild(docContainer);
        row.appendChild(docCell);
        
        // Acciones
        const actionsCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.addEventListener('click', () => deleteRow(row));
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);
        
        tableBody.appendChild(row);
    }
    
    function deleteRow(row) {
        showModal('Eliminar fila', '¿Estás seguro de que deseas eliminar esta fila?', () => {
            row.classList.add('fade-out');
            setTimeout(() => {
                row.remove();
                renumberRows();
                showToast('Fila eliminada correctamente', 'success');
            }, 300);
        });
    }
    
    function renumberRows() {
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });
    }
    
    function calculateTotalCompliance() {
        // Implementar lógica para calcular el cumplimiento total si es necesario
    }
    
    function saveData() {
        const data = {
            area: document.getElementById('area').value,
            periodo: document.getElementById('periodo').value,
            fecha: document.getElementById('fecha').value,
            elaboro: document.getElementById('elaboro').value,
            voBo: document.getElementById('vo-bo').value,
            actividades: []
        };
        
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.cells;
            const actividad = {
                num: cells[0].textContent,
                descripcion: cells[1].querySelector('textarea').value,
                semanas: [],
                cumplimiento: cells[13].querySelector('input').value,
                documento: ''
            };
            
            // Obtener valores de las semanas (celdas 2 a 13)
            for (let i = 2; i <= 13; i++) {
                actividad.semanas.push(cells[i].querySelector('input').value);
            }
            
            // Obtener nombre de archivo si existe
            const fileName = cells[14].querySelector('.file-name');
            if (fileName && fileName.textContent) {
                actividad.documento = fileName.textContent;
            }
            
            data.actividades.push(actividad);
        });
        
        // Guardar datos y archivos en localStorage
        localStorage.setItem('seguimientoActividades', JSON.stringify(data));
        
        showToast('Datos guardados correctamente', 'success');
        closeModalWindow();
    }
    
    function loadData() {
        const savedData = localStorage.getItem('seguimientoActividades');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            document.getElementById('area').value = data.area || '';
            document.getElementById('periodo').value = data.periodo || '';
            document.getElementById('fecha').value = data.fecha || '';
            document.getElementById('elaboro').value = data.elaboro || '';
            document.getElementById('vo-bo').value = data.voBo || '';
            
            // Limpiar tabla
            tableBody.innerHTML = '';
            
            // Agregar filas con los datos guardados
            data.actividades.forEach((actividad, index) => {
                const rowCount = index + 1;
                addRow(rowCount);
                
                const rows = tableBody.querySelectorAll('tr');
                const currentRow = rows[index];
                const cells = currentRow.cells;
                
                cells[1].querySelector('textarea').value = actividad.descripcion || '';
                cells[13].querySelector('input').value = actividad.cumplimiento || '';
                
                // Llenar semanas
                actividad.semanas.forEach((semana, i) => {
                    if (cells[2 + i] && cells[2 + i].querySelector('input')) {
                        cells[2 + i].querySelector('input').value = semana || '';
                    }
                });
                
                // Establecer nombre de archivo si existe
                if (actividad.documento) {
                    const fileName = cells[14].querySelector('.file-name');
                    fileName.textContent = actividad.documento;
                    const fileActions = cells[14].querySelector('.file-actions');
                    if (fileActions) {
                        fileActions.style.display = 'flex';
                    }
                }
            });
            
            showToast('Datos cargados correctamente', 'success');
        } else {
            showToast('No hay datos guardados', 'warning');
        }
        closeModalWindow();
    }
    
    function generatePdf() {
        // Verificar si jsPDF está disponible
        if (window.jsPDF && window.html2canvas) {
            showModal('Generar PDF', '¿Desea generar un PDF con los datos actuales?', () => {
                // Crear un nuevo documento PDF en orientación horizontal
                const doc = new jsPDF('l', 'mm', 'a4');
                
                // Título del documento
                const title = "SEGUIMIENTO DE ACTIVIDADES";
                const area = `Área: ${document.getElementById('area').value || 'No especificado'}`;
                const periodo = `Periodo: ${document.getElementById('periodo').value || 'No especificado'}`;
                
                // Configuración de estilos
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
                
                doc.setFontSize(12);
                doc.setFont('helvetica', 'normal');
                doc.text(area, 20, 35);
                doc.text(periodo, 20, 45);
                
                // Capturar la tabla con html2canvas
                html2canvas(document.querySelector('.table-container'), {
                    scale: 2, // Mejor calidad
                    logging: false,
                    useCORS: true
                }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = doc.internal.pageSize.getWidth() - 40;
                    const pageHeight = doc.internal.pageSize.getHeight();
                    const imgHeight = canvas.height * imgWidth / canvas.width;
                    
                    // Añadir la imagen de la tabla al PDF
                    doc.addImage(imgData, 'PNG', 20, 55, imgWidth, imgHeight);
                    
                    // Información de firma
                    const fecha = `Fecha: ${document.getElementById('fecha').value || ''}`;
                    const elaboro = `Elaboró: ${document.getElementById('elaboro').value || ''}`;
                    const voBo = `Vo.Bo.: ${document.getElementById('vo-bo').value || ''}`;
                    
                    doc.setFontSize(10);
                    doc.text(fecha, 20, pageHeight - 30);
                    doc.text(elaboro, doc.internal.pageSize.getWidth() / 3, pageHeight - 30);
                    doc.text(voBo, (doc.internal.pageSize.getWidth() / 3) * 2, pageHeight - 30);
                    
                    // Pie de página
                    doc.setFontSize(8);
                    doc.text('Documento controlado por medios electrónicos.', 20, pageHeight - 15);
                    doc.text('Universidad Politécnica de Tapachula', doc.internal.pageSize.getWidth() / 2, pageHeight - 15, { align: 'center' });
                    
                    // Guardar el PDF
                    doc.save(`Seguimiento_Actividades_${new Date().toISOString().slice(0,10)}.pdf`);
                    showToast('PDF generado correctamente', 'success');
                }).catch(err => {
                    console.error('Error al generar PDF:', err);
                    showToast('Error al generar PDF', 'danger');
                });
                
                closeModalWindow();
            });
        } else {
            showToast('Error: Bibliotecas para PDF no cargadas correctamente', 'danger');
            console.error('jsPDF disponible:', !!window.jsPDF);
            console.error('html2canvas disponible:', !!window.html2canvas);
        }
    }
    
    function clearAll() {
        document.getElementById('area').value = '';
        document.getElementById('periodo').value = '';
        document.getElementById('fecha').value = '';
        document.getElementById('elaboro').value = '';
        document.getElementById('vo-bo').value = '';
        
        tableBody.innerHTML = '';
        fileCache = {};
        
        // Agregar 7 filas vacías como en el original
        for (let i = 1; i <= 7; i++) {
            addRow(i);
        }
        
        showToast('Todos los datos han sido limpiados', 'success');
        closeModalWindow();
    }
    
    // Funciones para manejo de archivos
    
    function previewFile(fileId, file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const content = e.target.result;
            previewContainer.innerHTML = '';
            
            if (file.type.includes('image')) {
                const img = document.createElement('img');
                img.src = content;
                previewContainer.appendChild(img);
            } else if (file.type === 'application/pdf') {
                const iframe = document.createElement('iframe');
                iframe.src = content;
                previewContainer.appendChild(iframe);
            } else {
                previewContainer.innerHTML = `<p>Vista previa no disponible para este tipo de archivo. Descargue el archivo para verlo.</p><p>Nombre: ${file.name}</p>`;
            }
            
            previewModal.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
    }
    
    function removeFile(fileId, fileContainer, fileName, fileActions) {
        delete fileCache[fileId];
        fileName.textContent = '';
        fileActions.style.display = 'none';
        showToast('Documento eliminado', 'info');
    }
    
    // Funciones auxiliares
    
    function showModal(title, message, action) {
>>>>>>> fd05dfcffb682b127e57bf03123a5abd8d5b1f0f
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        currentAction = action;
        modal.style.display = 'block';
    }
<<<<<<< HEAD

    function closeModalWindow() {
        if (modal) modal.style.display = 'none';
        if (previewModal) previewModal.style.display = 'none';
        currentAction = null;
    }

    function confirmAction() {
        if (currentAction && typeof currentAction === 'function') {
            currentAction();
            closeModalWindow();
        }
    }

    if (modalConfirm) modalConfirm.addEventListener('click', confirmAction);
    if (modalCancel) modalCancel.addEventListener('click', closeModalWindow);
    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModalWindow));
    window.addEventListener('click', (e) => {
        if (e.target === modal || e.target === previewModal) closeModalWindow();
    });

    // ----------------- Manejo de firmas -----------------
    function handleFirmaUpload(inputElement, previewElement, firmaKey) {
        return function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    firmasCache[firmaKey] = {
                        data: event.target.result,
                        name: file.name,
                        type: file.type
                    };
                    previewElement.innerHTML = `<img src="${event.target.result}" alt="Firma ${firmaKey}" style="max-width: 150px; max-height: 80px;">`;
                    showToast('Firma cargada correctamente', 'success');
                };
                reader.readAsDataURL(file);
            } else {
                showToast('Por favor, selecciona un archivo de imagen válido', 'warning');
                inputElement.value = '';
            }
        };
    }

    function removeFirma(firmaKey) {
        firmasCache[firmaKey] = null;
        const previewElement = getByIds(`preview-${firmaKey}`);
        if (previewElement) previewElement.innerHTML = '';
        const inputElement = getByIds(firmaKey);
        if (inputElement) inputElement.value = '';
        showToast('Firma eliminada', 'info');
    }

    // Inicializar eventos para firmas
    if (firmaElaboroInput && previewFirmaElaboro) {
        firmaElaboroInput.addEventListener('change', handleFirmaUpload(firmaElaboroInput, previewFirmaElaboro, 'firma-elaboro'));
    }
    if (firmaVoBoInput && previewFirmaVoBo) {
        firmaVoBoInput.addEventListener('change', handleFirmaUpload(firmaVoBoInput, previewFirmaVoBo, 'firma-vo-bo'));
    }
    removeFirmaBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            removeFirma(target);
        });
    });

    // ----------------- Cargar datos automáticamente al iniciar -----------------
    function autoLoadData() {
        const raw = localStorage.getItem('seguimientoActividades');
        if (!raw) {
            for (let i = 0; i < INITIAL_ROWS; i++) {
                addRow();
            }
            return;
        }
        
        try {
            const data = JSON.parse(raw);
            if (document.getElementById('area')) document.getElementById('area').value = data.area || '';
            if (periodoSelect) {
                periodoSelect.value = data.periodo || '';
                updateMonthHeaders(periodoSelect.value);
            }
            if (document.getElementById('fecha')) document.getElementById('fecha').value = data.fecha || '';
            if (document.getElementById('elaboro')) document.getElementById('elaboro').value = data.elaboro || '';
            if (document.getElementById('vo-bo')) document.getElementById('vo-bo').value = data.voBo || '';

            // Cargar firmas si existen
            if (data.firmas) {
                if (data.firmas['firma-elaboro'] && previewFirmaElaboro) {
                    firmasCache['firma-elaboro'] = data.firmas['firma-elaboro'];
                    previewFirmaElaboro.innerHTML = `<img src="${data.firmas['firma-elaboro'].data}" alt="Firma elaboró" style="max-width: 150px; max-height: 80px;">`;
                }
                if (data.firmas['firma-vo-bo'] && previewFirmaVoBo) {
                    firmasCache['firma-vo-bo'] = data.firmas['firma-vo-bo'];
                    previewFirmaVoBo.innerHTML = `<img src="${data.firmas['firma-vo-bo'].data}" alt="Firma vo bo" style="max-width: 150px; max-height: 80px;">`;
                }
            }

            tableBody.innerHTML = '';
            (data.actividades || []).forEach(act => addRow({
                descripcion: act.descripcion || '',
                semanas: act.semanas || new Array(16).fill(''),
                cumplimiento: act.cumplimiento || '',
                documento: act.documento || ''
            }));
            renumberRows();
            showToast('Datos cargados automáticamente', 'success');
        } catch (e) {
            console.error(e);
            showToast('Error cargando datos', 'danger');
        }
    }

    // ----------------- Filas dinámicas -----------------
    function renumberRows() {
        rowCount = 0;
        if (!tableBody) return;
        Array.from(tableBody.rows).forEach(tr => {
            rowCount++;
            if (tr.cells[0]) tr.cells[0].textContent = rowCount;
        });
    }

    function deleteRowHandler(row) {
        showModal('Eliminar fila', '¿Estás seguro que desea eliminar esta fila?', () => {
            const fileNameDiv = row.querySelector('.file-name');
            if (fileNameDiv && fileNameDiv.dataset && fileNameDiv.dataset.fileid) {
                delete fileCache[fileNameDiv.dataset.fileid];
            }
            row.remove();
            renumberRows();
            showToast('Fila eliminada correctamente', 'success');
        });
    }

    function addRow(data = {}) {
        if (!tableBody) {
            console.error('[planeacion] No hay <tbody> para agregar filas.');
            return;
        }

        rowCount = tableBody.rows.length + 1;

        const row = document.createElement('tr');
        row.className = 'fade-in';

        // NUM
        const numCell = document.createElement('td');
        numCell.textContent = rowCount;
        row.appendChild(numCell);

        // DESCRIPCIÓN
        const descCell = document.createElement('td');
        const descInput = document.createElement('textarea');
        descInput.rows = 6;
        descInput.style.width = '100%';
        descInput.className = 'actividad-desc';
        descInput.placeholder = 'Ingrese descripción detallada de la actividad';
        if (data.descripcion) descInput.value = data.descripcion;
        descCell.appendChild(descInput);
        row.appendChild(descCell);

        // 16 semanas (checkboxes)
        for (let i = 0; i < 16; i++) {
            const semanaCell = document.createElement('td');
            semanaCell.style.textAlign = 'center';

            const semanaCheckbox = document.createElement('input');
            semanaCheckbox.type = 'checkbox';
            semanaCheckbox.className = 'semana-checkbox';

            if (data.semanas && typeof data.semanas[i] !== 'undefined') {
                semanaCheckbox.checked = data.semanas[i] === 'x';
            }

            semanaCell.appendChild(semanaCheckbox);
            row.appendChild(semanaCell);
        }

        // % cumplimiento
        const cumplimientoCell = document.createElement('td');
        const cumplimientoInput = document.createElement('input');
        cumplimientoInput.type = 'number';
        cumplimientoInput.min = 0;
        cumplimientoInput.max = 100;
        cumplimientoInput.className = 'cumplimiento-input';
        cumplimientoInput.style.width = '60px';
        cumplimientoInput.value = (data.cumplimiento !== undefined) ? data.cumplimiento : '';
        cumplimientoCell.appendChild(cumplimientoInput);
        row.appendChild(cumplimientoCell);

        // Documento probatorio
        const docCell = document.createElement('td');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png';
        fileInput.className = 'file-input';
        fileInput.style.width = '100%';
        docCell.appendChild(fileInput);

        const fileNameDiv = document.createElement('div');
        fileNameDiv.className = 'file-name';
        fileNameDiv.style.fontSize = '12px';
        fileNameDiv.style.marginTop = '4px';
        if (data.documento) {
            fileNameDiv.textContent = data.documento;
        }
        docCell.appendChild(fileNameDiv);

        const previewBtn = document.createElement('button');
        previewBtn.type = 'button';
        previewBtn.className = 'file-btn preview-btn';
        previewBtn.title = 'Vista previa';
        previewBtn.style.marginRight = '6px';
        previewBtn.innerHTML = '👁';
        previewBtn.addEventListener('click', () => {
            const fid = fileNameDiv.dataset.fileid;
            const f = fid ? fileCache[fid] : null;
            if (f) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (f.type.includes('image')) {
                        previewContainer.innerHTML = `<img src="${ev.target.result}" style="max-width:100%;">`;
                    } else if (f.type === 'application/pdf') {
                        previewContainer.innerHTML = `<iframe src="${ev.target.result}" style="width:100%;height:80vh;border:none"></iframe>`;
                    } else {
                        previewContainer.innerHTML = `<p>No hay vista previa para este tipo de archivo.</p><p>${f.name}</p>`;
                    }
                    if (previewModal) previewModal.style.display = 'block';
                };
                reader.readAsDataURL(f);
            } else {
                showToast('No hay archivo cargado para vista previa', 'warning');
            }
        });

        const removeFileBtn = document.createElement('button');
        removeFileBtn.type = 'button';
        removeFileBtn.className = 'file-btn remove-btn';
        removeFileBtn.title = 'Eliminar archivo';
        removeFileBtn.innerHTML = '🗑';
        removeFileBtn.addEventListener('click', () => {
            const fid = fileNameDiv.dataset.fileid;
            if (fid) delete fileCache[fid];
            fileNameDiv.textContent = '';
            delete fileNameDiv.dataset.fileid;
            fileInput.value = '';
            showToast('Documento eliminado', 'info');
        });

        docCell.appendChild(previewBtn);
        docCell.appendChild(removeFileBtn);

        fileInput.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                const fileId = 'file-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
                fileCache[fileId] = file;
                fileNameDiv.textContent = file.name;
                fileNameDiv.dataset.fileid = fileId;
                showToast('Documento subido correctamente', 'success');
            }
        });

        row.appendChild(docCell);

        // Acciones
        const accionesCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
        deleteBtn.addEventListener('click', () => deleteRowHandler(row));
        accionesCell.appendChild(deleteBtn);
        row.appendChild(accionesCell);

        tableBody.appendChild(row);
    }

    // ----------------- Guardar Datos -----------------
    function saveData() {
        if (!tableBody) return showToast('No hay tabla para guardar', 'danger');

        const data = {
            area: (document.getElementById('area') || {}).value || '',
            periodo: (periodoSelect && periodoSelect.value) || '',
            fecha: (document.getElementById('fecha') || {}).value || '',
            elaboro: (document.getElementById('elaboro') || {}).value || '',
            voBo: (document.getElementById('vo-bo') || {}).value || '',
            firmas: firmasCache,
            actividades: []
        };

        Array.from(tableBody.rows).forEach(tr => {
            const desc = tr.querySelector('textarea.actividad-desc')?.value || '';
            const semanas = Array.from(tr.querySelectorAll('input.semana-checkbox')).map(cb => cb.checked ? 'x' : '');
            const cumplimiento = tr.querySelector('input.cumplimiento-input')?.value || '';
            const fileName = tr.querySelector('.file-name')?.textContent || '';
            data.actividades.push({
                descripcion: desc,
                semanas,
                cumplimiento,
                documento: fileName
            });
        });

        try {
            localStorage.setItem('seguimientoActividades', JSON.stringify(data));
            showToast('Datos guardados correctamente', 'success');
            closeModalWindow();
        } catch (e) {
            console.error(e);
            showToast('Error guardando los datos', 'danger');
        }
    }

    // ----------------- Generar Documento Word -----------------
    function generateWord() {
    showModal('Generar Word', '¿Deseas generar un documento Word con los datos actuales?', () => {
        // Mostrar loading
        if (loadingElement) loadingElement.style.display = 'block';
        
        // Usar setTimeout para permitir que se muestre el loading
        setTimeout(() => {
            try {
                // Verificar si la librería docx está disponible
                if (typeof docx === 'undefined') {
                    throw new Error('La librería docx no está cargada. Por favor, verifica tu conexión a internet.');
                }

                const { Document, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, ShadingType, ImageRun, Media } = docx;

                // Crear array para almacenar todos los elementos del documento
                const docChildren = [
                    // Título
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "PLANEACION CUATRIMESTRAL DE ACTIVIDADES",
                                bold: true,
                                size: 32,
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                    }),

                    // Información general
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Área: ${document.getElementById('area').value || ''}`,
                                size: 24,
                            }),
                        ],
                        spacing: { after: 200 },
                    }),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Periodo: ${periodoSelect.value || ''}`,
                                size: 24,
                            }),
                        ],
                        spacing: { after: 200 },
                    }),

                    // Tabla de actividades
                    new Table({
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        borders: {
                            top: { style: BorderStyle.SINGLE, size: 1 },
                            bottom: { style: BorderStyle.SINGLE, size: 1 },
                            left: { style: BorderStyle.SINGLE, size: 1 },
                            right: { style: BorderStyle.SINGLE, size: 1 },
                            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                            insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                        },
                        rows: [
                            // Encabezado de la tabla
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ text: "#", alignment: AlignmentType.CENTER })],
                                        shading: { fill: "2c3e50" },
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: "Descripción de Actividad", alignment: AlignmentType.CENTER })],
                                        shading: { fill: "2c3e50" },
                                    }),
                                    // Meses
                                    ...Array.from({ length: 4 }, (_, mesIndex) => 
                                        new TableCell({
                                            children: [new Paragraph({ 
                                                text: document.getElementById(`mes${mesIndex+1}-header`)?.textContent || `MES ${mesIndex+1}`, 
                                                alignment: AlignmentType.CENTER 
                                            })],
                                            columnSpan: 4,
                                            shading: { fill: "3498db" },
                                        })
                                    ),
                                    new TableCell({
                                        children: [new Paragraph({ text: "% Cumplimiento", alignment: AlignmentType.CENTER })],
                                        shading: { fill: "2c3e50" },
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: "Documento Probatorio", alignment: AlignmentType.CENTER })],
                                        shading: { fill: "2c3e50" },
                                    }),
                                ],
                            }),
                            // Subencabezado (semanas)
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ text: "" })],
                                        shading: { fill: "2c3e50" },
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: "" })],
                                        shading: { fill: "2c3e50" },
                                    }),
                                    // Semanas S1-S16
                                    ...Array.from({ length: 16 }, (_, semanaIndex) => 
                                        new TableCell({
                                            children: [new Paragraph({ text: `S${(semanaIndex % 4) + 1}`, alignment: AlignmentType.CENTER })],
                                            shading: { fill: "2c3e50" },
                                        })
                                    ),
                                    new TableCell({
                                        children: [new Paragraph({ text: "" })],
                                        shading: { fill: "2c3e50" },
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: "" })],
                                        shading: { fill: "2c3e50" },
                                    }),
                                ],
                            }),
                            // Filas de actividades
                            ...Array.from(tableBody.rows).map((row, index) => {
                                const desc = row.querySelector('textarea.actividad-desc')?.value || '';
                                const semanas = Array.from(row.querySelectorAll('input.semana-checkbox')).map(cb => cb.checked ? 'X' : '');
                                const cumplimiento = row.querySelector('input.cumplimiento-input')?.value || '';
                                const documento = row.querySelector('.file-name')?.textContent || '';

                                return new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph({ text: desc })],
                                        }),
                                        // Semanas
                                        ...semanas.map(semana => 
                                            new TableCell({
                                                children: [new Paragraph({ text: semana, alignment: AlignmentType.CENTER })],
                                            })
                                        ),
                                        new TableCell({
                                            children: [new Paragraph({ text: cumplimiento, alignment: AlignmentType.CENTER })],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph({ text: documento })],
                                        }),
                                    ],
                                });
                            }),
                        ],
                    }),

                    // Espacio
                    new Paragraph({
                        children: [],
                        spacing: { before: 400, after: 400 },
                    }),
                ];

                // Función para procesar imágenes base64
                function base64ToUint8Array(base64) {
                    const base64Data = base64.split(',')[1];
                    const binaryString = atob(base64Data);
                    const len = binaryString.length;
                    const bytes = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    return bytes;
                }

                // Procesar firmas si existen
                const firmaPromises = [];

                if (firmasCache['firma-elaboro'] && firmasCache['firma-elaboro'].data) {
                    firmaPromises.push({
                        key: 'elaboro',
                        data: firmasCache['firma-elaboro'].data,
                        name: document.getElementById('elaboro').value || ''
                    });
                }

                if (firmasCache['firma-vo-bo'] && firmasCache['firma-vo-bo'].data) {
                    firmaPromises.push({
                        key: 'vobo',
                        data: firmasCache['firma-vo-bo'].data,
                        name: document.getElementById('vo-bo').value || ''
                    });
                }

                // Crear tabla de firmas
                const firmaTable = new Table({
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                // Fecha
                                new TableCell({
                                    children: [new Paragraph({ 
                                        children: [
                                            new TextRun({
                                                text: `Fecha: ${document.getElementById('fecha').value || ''}`,
                                                size: 24,
                                            })
                                        ],
                                        alignment: AlignmentType.LEFT,
                                    })],
                                    width: { size: 25, type: WidthType.PERCENTAGE },
                                }),
                                // Elaboró
                                new TableCell({
                                    children: [
                                        new Paragraph({ 
                                            children: [
                                                new TextRun({
                                                    text: `Elaboró: ${document.getElementById('elaboro').value || ''}`,
                                                    size: 24,
                                                })
                                            ],
                                            alignment: AlignmentType.LEFT,
                                        }),
                                        // Espacio para la firma
                                        new Paragraph({
                                            children: [],
                                            spacing: { after: 100 },
                                        })
                                    ],
                                    width: { size: 37.5, type: WidthType.PERCENTAGE },
                                }),
                                // Vo.Bo.
                                new TableCell({
                                    children: [
                                        new Paragraph({ 
                                            children: [
                                                new TextRun({
                                                    text: `Vo.Bo.: ${document.getElementById('vo-bo').value || ''}`,
                                                    size: 24,
                                                })
                                            ],
                                            alignment: AlignmentType.LEFT,
                                        }),
                                        // Espacio para la firma
                                        new Paragraph({
                                            children: [],
                                            spacing: { after: 100 },
                                        })
                                    ],
                                    width: { size: 37.5, type: WidthType.PERCENTAGE },
                                }),
                            ],
                        }),
                    ],
                });

                // Agregar tabla de firmas al documento
                docChildren.push(firmaTable);

                // Crear documento
                const doc = new Document({
                    sections: [{
                        properties: {
                            page: {
                                margin: {
                                    top: 1000,
                                    right: 1000,
                                    bottom: 1000,
                                    left: 1000,
                                },
                            },
                        },
                        children: docChildren,
                    }],
                });

                // Generar y descargar el documento
                docx.Packer.toBlob(doc).then(blob => {
                    const fileName = `Planeacion_Cuatrimestral_${new Date().toISOString().slice(0,10)}.docx`;
                    saveAs(blob, fileName);
                    showToast('Documento Word generado correctamente', 'success');
                }).catch(error => {
                    console.error('Error generando Word:', error);
                    showToast('Error generando documento Word: ' + error.message, 'danger');
                });

            } catch (error) {
                console.error('Error:', error);
                showToast('Error: ' + error.message, 'danger');
            } finally {
                // Ocultar loading
                if (loadingElement) loadingElement.style.display = 'none';
                closeModalWindow();
            }
        }, 100);
    });
}

    // ----------------- Clear -----------------
    function clearAll() {
        showModal('Limpiar todo', '¿Deseas limpiar todos los datos?', () => {
            if (document.getElementById('area')) document.getElementById('area').value = '';
            if (document.getElementById('fecha')) document.getElementById('fecha').value = '';
            if (document.getElementById('elaboro')) document.getElementById('elaboro').value = '';
            if (document.getElementById('vo-bo')) document.getElementById('vo-bo').value = '';

            if (periodoSelect) {
                periodoSelect.value = "";
            }

            // Limpiar firmas
            firmasCache = {
                'firma-elaboro': null,
                'firma-vo-bo': null
            };
            if (previewFirmaElaboro) previewFirmaElaboro.innerHTML = '';
            if (previewFirmaVoBo) previewFirmaVoBo.innerHTML = '';
            if (firmaElaboroInput) firmaElaboroInput.value = '';
            if (firmaVoBoInput) firmaVoBoInput.value = '';

            updateMonthHeaders(null);

            if (tableBody) {
                tableBody.innerHTML = "";
                for (let i = 0; i < INITIAL_ROWS; i++) {
                    addRow();
                }
            }
            showToast('Formulario restaurado. Se reiniciaron los meses y se agregaron 2 filas vacías.', 'success');
            closeModalWindow();
        });
    }

    // ----------------- Listeners -----------------
    if (addRowBtn) addRowBtn.addEventListener('click', () => { addRow(); showToast('Fila agregada correctamente', 'success'); });
    if (saveDataBtn) saveDataBtn.addEventListener('click', () => showModal('Guardar datos', '¿Guardar los datos actuales?', saveData));
    if (generateWordBtn) generateWordBtn.addEventListener('click', generateWord);
    if (clearAllBtn) clearAllBtn.addEventListener('click', clearAll);

    // ----------------- Inicialización -----------------
    if (!tableBody || !table) {
        showToast('Faltan elementos HTML necesarios (revisa consola).', 'danger');
        debug('table:', table, 'tableBody:', tableBody, 'addRowBtn:', addRowBtn, 'periodoSelect:', periodoSelect);
    } else {
        // Cargar datos automáticamente al iniciar
        autoLoadData();
        debug('Inicialización completada. Filas actuales:', tableBody.rows.length);
=======
    
    function closeModalWindow() {
        modal.style.display = 'none';
        previewModal.style.display = 'none';
        currentAction = null;
    }
    
    function confirmAction() {
        if (currentAction && typeof currentAction === 'function') {
            currentAction();
        }
    }
    
    function showToast(message, type) {
        // Crear elemento toast si no existe
        let toast = document.querySelector('.toast');
        if (toast) {
            toast.remove();
        }
        
        toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Eliminar el toast después de 3 segundos
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
>>>>>>> fd05dfcffb682b127e57bf03123a5abd8d5b1f0f
    }
});