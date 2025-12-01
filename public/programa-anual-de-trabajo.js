// Datos predefinidos para los dropdowns
const ejesPIDE = [
    "N/A: No aplica",
    "N/E: No especificado en el PIDE",
    "Eje I. Atracción y desarrollo de talento humano",
    "Eje II. Formación integral, innovadora y vinculada internacionalmente", 
    "Eje III. Crecimiento sostenible a largo plazo"
];

const categoriasCACEI = [
    "N/A: No aplica",
    "N/E: No especificado en el CACEI",
    "1. ESTUDIANTES",
    "2. PLAN DE ESTUDIOS", 
    "3. OBJETIVOS EDUCACIONALES",
    "4. ATRIBUTOS DE EGRESO",
    "5. PERSONAL ACADÉMICO",
    "6. SOPORTE INSTITUCIONAL", 
    "7. MEJORA CONTINUA",
    "8. ÁREA DISCIPLINAR DEL PROGRAMA EDUCATIVO"
];

const criteriosSEAES = [
    "N/A: No aplica", 
    "N/E: No especificado en el SEAES",
    "1. La formación profesional de los estudiantes",
    "2. La profesionalización de la docencia",
    "3. Los programas educativos de TSU, PA y licenciatura",
    "4. Los programas de investigación de posgrado",
    "5. Las instituciones de educación superior"
];

const unidadesMedida = [
    "Documento",
    "Reporte", 
    "Evidencia fotográfica",
    "Porcentaje",
    "Cantidad",
    "Otro"
];

document.addEventListener('DOMContentLoaded', function() {
    initForm();
});

function initForm() {
    // Configurar pestañas
    setupTabs();
    
    // Configurar departamento (select + input)
    setupDepartamento();
    
    // Cargar datos guardados o agregar primera fila
    if (!loadDraft()) {
        addActionRow();
    }
    
    // Configurar event listeners
    document.getElementById('add-action-btn').addEventListener('click', addActionRow);
    document.getElementById('clear-actions-btn').addEventListener('click', clearAllActions);
    document.getElementById('save-draft-btn').addEventListener('click', saveDraft);
    document.getElementById('generate-pdf-btn').addEventListener('click', generatePDF);
    
    // Sincronizar firmas entre pestañas
    setupSignatureSync();
    
    // Cargar firmas guardadas
    setupSignatures();
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover clase active de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            // Agregar clase active a la pestaña clickeada
            this.classList.add('active');
            
            // Ocultar todos los contenidos
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostrar el contenido correspondiente
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function setupDepartamento() {
    const select = document.getElementById('departamento');
    const inputOtro = document.getElementById('departamento-otro');
    
    select.addEventListener('change', function() {
        if (this.value === '') {
            inputOtro.style.display = 'block';
            inputOtro.required = true;
        } else {
            inputOtro.style.display = 'none';
            inputOtro.required = false;
            inputOtro.value = '';
        }
    });
}

function setupSignatureSync() {
    // Sincronizar firmas de la pestaña 1 a la pestaña 2
    const syncFields = [
        {from: 'responsable-name', to: 'evaluacion-responsable'},
        {from: 'jefe-name', to: 'evaluacion-jefe'}, 
        {from: 'titular-name', to: 'evaluacion-titular'}
    ];
    
    syncFields.forEach(field => {
        const fromElement = document.getElementById(field.from);
        const toElement = document.getElementById(field.to);
        
        fromElement.addEventListener('input', function() {
            toElement.value = this.value;
        });
    });
}

function addActionRow() {
    const tbody = document.querySelector('#acciones-table tbody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>
            <select class="table-select" data-field="eje">
                <option value="">Seleccione...</option>
                ${ejesPIDE.map(eje => `<option value="${eje}">${eje.split(':')[0]}</option>`).join('')}
            </select>
        </td>
        <td>
            <select class="table-select" data-field="cat">
                <option value="">Seleccione...</option>
                ${categoriasCACEI.map(cat => `<option value="${cat}">${cat.split('.')[0]}</option>`).join('')}
            </select>
        </td>
        <td>
            <select class="table-select" data-field="ambito">
                <option value="">Seleccione...</option>
                ${criteriosSEAES.map(crit => `<option value="${crit}">${crit.split('.')[0]}</option>`).join('')}
            </select>
        </td>
        <td><textarea class="table-textarea" data-field="accion" placeholder="Descripción de la acción" required></textarea></td>
        <td><input type="checkbox" class="month-checkbox" data-month="E"></td>
        <td><input type="checkbox" class="month-checkbox" data-month="F"></td>
        <td><input type="checkbox" class="month-checkbox" data-month="M"></td>
        <td><input type="checkbox" class="month-checkbox" data-month="A"></td>
        <td><input type="checkbox" class="month-checkbox" data-month="M"></td>
        <td><input type="checkbox" class="month-checkbox" data-month="J"></td>
        <td><input type="checkbox" class="month-checkbox" data-month="J"></td>
        <td><input type="checkbox" class="month-checkbox" data-month="A"></td>
        <td><input type="checkbox" class="month-checkbox" data-month="S"></td>
        <td><input type="checkbox" class="month-checkbox" data-month="O"></td>
        <td><input type="checkbox" class="month-checkbox" data-month="N"></td>
        <td><input type="checkbox" class="month-checkbox" data-month="D"></td>
        <td>
            <input type="number" class="table-input" data-field="meta" placeholder="Meta" min="0" max="100" step="1" required>
        </td>
        <td>
            <select class="table-select" data-field="unidad" required>
                <option value="">Seleccione...</option>
                ${unidadesMedida.map(um => `<option value="${um}">${um}</option>`).join('')}
            </select>
            <div class="file-upload no-print">
                <input type="file" class="file-input" data-field="evidencia" style="display: none;" accept="image/*,.pdf,.doc,.docx">
                <button type="button" class="btn btn-secondary" style="padding: 2px 5px; font-size: 0.7rem;">
                    <i class="fas fa-paperclip"></i>
                </button>
                <span class="file-name"></span>
            </div>
        </td>
        <td>
            <input type="number" class="table-input" data-field="programado" placeholder="Programado" min="0" step="1">
        </td>
        <td>
            <input type="text" class="table-input" data-field="cumplimiento" placeholder="% Cumplimiento" readonly>
        </td>
        <td class="action-buttons no-print">
            <button class="btn-remove"><i class="fas fa-trash"></i></button>
        </td>
    `;

    tbody.appendChild(row);
    
    // Configurar eventos para la nueva fila
    setupActionRowEvents(row);
}

function setupActionRowEvents(row) {
    // Evento para eliminar fila
    row.querySelector('.btn-remove').addEventListener('click', function() {
        if (window.confirm('¿Estás seguro de eliminar esta acción?')) {
            row.remove();
            showAlert('Acción eliminada correctamente', 'success');
        }
    });
    
    // Evento para subir archivo
    const fileInput = row.querySelector('.file-input');
    const fileButton = row.querySelector('.file-upload .btn');
    const fileName = row.querySelector('.file-name');
    
    fileButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileName.textContent = this.files[0].name;
        } else {
            fileName.textContent = '';
        }
    });
    
    // Calcular cumplimiento automáticamente
    const metaInput = row.querySelector('[data-field="meta"]');
    const programadoInput = row.querySelector('[data-field="programado"]');
    const cumplimientoInput = row.querySelector('[data-field="cumplimiento"]');
    
    function calcularCumplimiento() {
        const meta = parseFloat(metaInput.value) || 0;
        const programado = parseFloat(programadoInput.value) || 0;
        
        if (meta > 0) {
            const cumplimiento = (programado / meta) * 100;
            cumplimientoInput.value = cumplimiento.toFixed(2) + '%';
        } else {
            cumplimientoInput.value = '';
        }
    }
    
    metaInput.addEventListener('input', calcularCumplimiento);
    programadoInput.addEventListener('input', calcularCumplimiento);
}

function clearAllActions() {
    const tbody = document.querySelector('#acciones-table tbody');
    if (tbody.querySelectorAll('tr').length === 0) {
        showAlert('No hay acciones para eliminar', 'error');
        return;
    }
    
   if (window.confirm('¿Estás seguro de eliminar TODAS las acciones? Esto no se puede deshacer.')) {

        tbody.innerHTML = '';
        showAlert('Todas las acciones han sido eliminadas', 'success');
    }
}

function saveDraft() {
    const formData = {
        general: getGeneralData(),
        acciones: getActionsData(),
        evaluacion: getEvaluacionData()
    };
    
    localStorage.setItem('patDraft', JSON.stringify(formData));
    saveSignatures();
    showAlert('Borrador guardado exitosamente', 'success');
}

function loadDraft() {
    const draft = localStorage.getItem('patDraft');
    if (!draft) return false;
    
    try {
        const formData = JSON.parse(draft);
        
        // Llenar datos generales
        setGeneralData(formData.general);
        
        // Llenar evaluación
        setEvaluacionData(formData.evaluacion);
        
        // Llenar acciones
        if (formData.acciones && formData.acciones.length > 0) {
            document.querySelector('#acciones-table tbody').innerHTML = '';
            formData.acciones.forEach(action => {
                addActionRow();
                const lastRow = document.querySelector('#acciones-table tbody tr:last-child');
                setActionData(lastRow, action);
            });
        }
        
        return true;
    } catch (e) {
        console.error('Error al cargar borrador:', e);
        return false;
    }
}

function getGeneralData() {
    const departamentoSelect = document.getElementById('departamento');
    const departamentoOtro = document.getElementById('departamento-otro');
    
    return {
        responsable: document.getElementById('responsable').value,
        departamento: departamentoSelect.value || departamentoOtro.value,
        adscripcion: document.getElementById('adscripcion').value,
        programa: document.getElementById('programa').value
    };
}

function setGeneralData(data) {
    if (!data) return;
    
    document.getElementById('responsable').value = data.responsable || '';
    
    // Manejar departamento (select o input)
    const departamentoSelect = document.getElementById('departamento');
    const departamentoOtro = document.getElementById('departamento-otro');
    
    if (data.departamento === 'Secretaría Académica' || data.departamento === 'Secretaría Administrativa') {
        departamentoSelect.value = data.departamento;
        departamentoOtro.style.display = 'none';
    } else if (data.departamento) {
        departamentoSelect.value = '';
        departamentoOtro.style.display = 'block';
        departamentoOtro.value = data.departamento;
    }
    
    document.getElementById('adscripcion').value = data.adscripcion || '';
    document.getElementById('programa').value = data.programa || '2025';
}

function getEvaluacionData() {
    return {
        logros: document.getElementById('logros').value,
        causas: document.getElementById('causas').value,
        decisiones: document.getElementById('decisiones').value
    };
}

function setEvaluacionData(data) {
    if (!data) return;
    
    document.getElementById('logros').value = data.logros || '';
    document.getElementById('causas').value = data.causas || '';
    document.getElementById('decisiones').value = data.decisiones || '';
}

function getActionsData() {
    const actions = [];
    
    document.querySelectorAll('#acciones-table tbody tr').forEach(row => {
        const action = {
            eje: row.querySelector('[data-field="eje"]').value,
            cat: row.querySelector('[data-field="cat"]').value,
            ambito: row.querySelector('[data-field="ambito"]').value,
            accion: row.querySelector('[data-field="accion"]').value,
            meses: {},
            meta: row.querySelector('[data-field="meta"]').value,
            unidad: row.querySelector('[data-field="unidad"]').value,
            programado: row.querySelector('[data-field="programado"]').value,
            cumplimiento: row.querySelector('[data-field="cumplimiento"]').value
        };
        
        row.querySelectorAll('.month-checkbox').forEach(checkbox => {
            action.meses[checkbox.dataset.month] = checkbox.checked;
        });
        
        // Información del archivo adjunto
        const fileInput = row.querySelector('.file-input');
        if (fileInput.files.length > 0) {
            action.archivo = fileInput.files[0].name;
        }
        
        actions.push(action);
    });
    
    return actions;
}

function setActionData(row, action) {
    if (!row || !action) return;
    
    row.querySelector('[data-field="eje"]').value = action.eje || '';
    row.querySelector('[data-field="cat"]').value = action.cat || '';
    row.querySelector('[data-field="ambito"]').value = action.ambito || '';
    row.querySelector('[data-field="accion"]').value = action.accion || '';
    row.querySelector('[data-field="meta"]').value = action.meta || '';
    row.querySelector('[data-field="unidad"]').value = action.unidad || '';
    row.querySelector('[data-field="programado"]').value = action.programado || '';
    row.querySelector('[data-field="cumplimiento"]').value = action.cumplimiento || '';
    
    if (action.meses) {
        row.querySelectorAll('.month-checkbox').forEach(checkbox => {
            checkbox.checked = action.meses[checkbox.dataset.month] || false;
        });
    }
    
    // Mostrar nombre de archivo si existe
    if (action.archivo) {
        row.querySelector('.file-name').textContent = action.archivo;
    }
}

function saveSignatures() {
    const signatures = {
        responsable: document.getElementById('responsable-name').value,
        jefe: document.getElementById('jefe-name').value,
        titular: document.getElementById('titular-name').value
    };
    localStorage.setItem('patSignatures', JSON.stringify(signatures));
}

function setupSignatures() {
    const savedSignatures = JSON.parse(localStorage.getItem('patSignatures')) || {};
    document.getElementById('responsable-name').value = savedSignatures.responsable || '';
    document.getElementById('jefe-name').value = savedSignatures.jefe || '';
    document.getElementById('titular-name').value = savedSignatures.titular || '';
    
    // Sincronizar con pestaña de evaluación
    document.getElementById('evaluacion-responsable').value = savedSignatures.responsable || '';
    document.getElementById('evaluacion-jefe').value = savedSignatures.jefe || '';
    document.getElementById('evaluacion-titular').value = savedSignatures.titular || '';
}

function validateForm() {
    // Validar campos obligatorios
    const requiredFields = [
        {id: 'responsable', message: 'El responsable es obligatorio'},
        {id: 'departamento', message: 'El departamento es obligatorio'},
        {id: 'adscripcion', message: 'El área de adscripción es obligatoria'},
        {id: 'programa', message: 'El programa de trabajo es obligatorio'},
        {id: 'responsable-name', message: 'El nombre del responsable es obligatorio'},
        {id: 'jefe-name', message: 'El nombre del jefe inmediato es obligatorio'},
        {id: 'titular-name', message: 'El nombre del titular es obligatorio'}
    ];
    
    for (const field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            element.focus();
            showAlert(field.message, 'error');
            return false;
        }
    }
    
    // Validar acciones
    const actionRows = document.querySelectorAll('#acciones-table tbody tr');
    if (actionRows.length === 0) {
        showAlert('Debe agregar al menos una acción', 'error');
        return false;
    }
    
    let actionsValid = true;
    actionRows.forEach(row => {
        const accion = row.querySelector('[data-field="accion"]').value.trim();
        const meta = row.querySelector('[data-field="meta"]').value.trim();
        const unidad = row.querySelector('[data-field="unidad"]').value;
        
        if (!accion || !meta || !unidad) {
            actionsValid = false;
            if (!accion) row.querySelector('[data-field="accion"]').focus();
            else if (!meta) row.querySelector('[data-field="meta"]').focus();
            else if (!unidad) row.querySelector('[data-field="unidad"]').focus();
        }
    });
    
    if (!actionsValid) {
        showAlert('Todas las acciones deben tener descripción, meta y unidad de medida completas', 'error');
        return false;
    }
    
    return true;
}

function generatePDF() {
    if (!validateForm()) return;
    
    // Crear ventana para el PDF
    const pdfWindow = window.open('', '_blank');
    
    // Obtener datos del formulario
    const generalData = getGeneralData();
    const evaluacionData = getEvaluacionData();
    const actions = getActionsData();
    const signatures = {
        responsable: document.getElementById('responsable-name').value,
        jefe: document.getElementById('jefe-name').value,
        titular: document.getElementById('titular-name').value
    };
    
    // Generar HTML del PDF
    pdfWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PAT ${generalData.programa}</title>
            <style>
                body { font-family: Arial; margin: 0; padding: 20px; font-size: 10pt; }
                .header { text-align: center; margin-bottom: 20px; }
                .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .info-table td { padding: 8px; border: 1px solid #ddd; }
                .main-table { width: 100%; border-collapse: collapse; font-size: 8pt; }
                .main-table th, .main-table td { border: 1px solid #000; padding: 6px; text-align: center; }
                .main-table th { background-color: #f2f2f2; font-weight: bold; }
                .signature-table { width: 100%; margin-top: 40px; }
                .signature-table td { width: 33%; text-align: center; padding-top: 60px; border-top: 1px solid #000; }
                .page-break { page-break-before: always; margin-top: 30px; }
                .text-justify { text-align: justify; }
                .checked { background-color: #e6f7ff; }
                .instruction-text { font-size: 9pt; margin-bottom: 15px; }
            </style>
        </head>
        <body>
            <!-- Página 1 -->
            <div class="header">
                <h2>Universidad Politécnica de Tapachula</h2>
                <h3>PROGRAMA ANUAL DE TRABAJO POR ÁREA: PIDE Y CATEGORÍAS CACEI / SEAES</h3>
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
                        <th rowspan="2">UNIDAD DE MEDIDA</th>
                        <th colspan="2">AVANCE</th>
                    </tr>
                    <tr>
                        ${['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'].map(m => `<th>${m}</th>`).join('')}
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
                            ${['E','F','M','A','M','J','J','A','S','O','N','D'].map(m => `
                                <td class="${action.meses[m] ? 'checked' : ''}">${action.meses[m] ? 'X' : ''}</td>
                            `).join('')}
                            <td>${action.meta || ''}</td>
                            <td>${action.unidad || ''}</td>
                            <td>${action.programado || ''}</td>
                            <td>${action.cumplimiento || ''}</td>
                        </tr>
                    `).join('')}
                    <tr>
                        <td colspan="19" style="text-align: left; font-size: 7pt;">
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
                    <td>Responsable (Elabora PAT)</td>
                    <td>Vo.Bo. Jefe o Jefa Inmediato Superior</td>
                    <td>Titular de la Dirección de Planeación</td>
                </tr>
            </table>

            <!-- Página 2 -->
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
                
                <div class="instruction-text">
                    <strong>LOGROS DEL PAT:</strong> El texto deberá hacer referencia a los logros o resultados alcanzados durante ${generalData.programa}. Se pueden incluir el número de logros que se consideren relevantes, pero cada logro o resultado debe integrarse en párrafos de máximo 100 palabras. Cuando se estime necesario, podrán incorporarse las tablas, gráficas, notas a pie de página, anexos y demás elementos que proporcione mayor claridad a la interpretación del texto. El texto de las figuras y anexos no se contabilizará para el límite de extensión de las secciones.
                </div>
                
                <h4>LOGROS DEL PAT:</h4>
                <div class="text-justify" style="margin-bottom: 15px;">
                    ${evaluacionData.logros.split('\n').map(p => `<p style="margin: 5px 0;">${p || ' '}</p>`).join('')}
                </div>
                
                <h4>EVALUACIÓN DE LAS CAUSAS EN CASO DE NO HABER LOGRADO LAS METAS:</h4>
                <div class="text-justify" style="margin-bottom: 15px;">
                    ${evaluacionData.causas.split('\n').map(p => `<p style="margin: 5px 0;">${p || ' '}</p>`).join('')}
                </div>
                
                <h4>DECISIONES O ACCIONES A CONSIDERAR PARA EL PAT DEL SIGUIENTE AÑO:</h4>
                <div class="text-justify">
                    ${evaluacionData.decisiones.split('\n').map(p => `<p style="margin: 5px 0;">${p || ' '}</p>`).join('')}
                </div>

                <table class="signature-table">
                    <tr>
                        <td>${signatures.responsable}</td>
                        <td>${signatures.jefe}</td>
                        <td>${signatures.titular}</td>
                    </tr>
                    <tr>
                        <td>Responsable (Elabora PAT)</td>
                        <td>Vo.Bo. Jefe o Jefa Inmediato Superior</td>
                        <td>Titular de la Dirección de Planeación</td>
                    </tr>
                </table>
            </div>
        </body>
        </html>
    `);

    pdfWindow.document.close();
    setTimeout(() => {
        pdfWindow.print();
    }, 500);
}

function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => {
            alert.remove();
        }, 500);
    }, 3000);
}   