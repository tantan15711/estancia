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
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        currentAction = action;
        modal.style.display = 'block';
    }

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
    }
});