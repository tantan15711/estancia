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
        descInput.rows = 3;
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
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        currentAction = action;
        modal.style.display = 'block';
    }
    
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
    }
});