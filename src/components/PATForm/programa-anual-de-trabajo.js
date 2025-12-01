document.addEventListener('DOMContentLoaded', function() {
    initForm();
});

function initForm() {
    // Cargar datos guardados o agregar primera fila
    if (!loadDraft()) {
        addActionRow();
    }
    
    // Configurar event listeners
    document.getElementById('add-action-btn').addEventListener('click', addActionRow);
    document.getElementById('clear-actions-btn').addEventListener('click', clearAllActions);
    document.getElementById('save-draft-btn').addEventListener('click', saveDraft);
    document.getElementById('generate-pdf-btn').addEventListener('click', generatePDF);
    
    // Agregar firmas editables
    setupSignatures();
}

function setupSignatures() {
    // Cargar firmas guardadas si existen
    const savedSignatures = JSON.parse(localStorage.getItem('patSignatures')) || {};
    document.getElementById('responsable-name').value = savedSignatures.responsable || '';
    document.getElementById('jefe-name').value = savedSignatures.jefe || '';
    document.getElementById('titular-name').value = savedSignatures.titular || '';
}

function saveSignatures() {
    const signatures = {
        responsable: document.getElementById('responsable-name').value,
        jefe: document.getElementById('jefe-name').value,
        titular: document.getElementById('titular-name').value
    };
    localStorage.setItem('patSignatures', JSON.stringify(signatures));
}

function addActionRow() {
    const tbody = document.querySelector('#acciones-table tbody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td><input type="text" class="table-input" data-field="eje" placeholder="Eje"></td>
        <td><input type="text" class="table-input" data-field="cat" placeholder="Categoría"></td>
        <td><input type="text" class="table-input" data-field="ambito" placeholder="Ámbito"></td>
        <td><input type="text" class="table-input" data-field="accion" placeholder="Acción" required></td>
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
        <td><input type="text" class="table-input" data-field="meta" placeholder="Meta" required></td>
        <td><input type="text" class="table-input" data-field="programado" placeholder="Programado"></td>
        <td><input type="text" class="table-input" data-field="cumplimiento" placeholder="% Cumplimiento"></td>
        <td class="action-buttons no-print">
            <button class="btn-remove"><i class="fas fa-trash"></i></button>
        </td>
    `;

    tbody.appendChild(row);
    
    // Evento para eliminar fila
    row.querySelector('.btn-remove').addEventListener('click', function() {
        if (confirm('¿Estás seguro de eliminar esta acción?')) {
            row.remove();
            showAlert('Acción eliminada correctamente', 'success');
        }
    });
}

function clearAllActions() {
    const tbody = document.querySelector('#acciones-table tbody');
    if (tbody.querySelectorAll('tr').length === 0) {
        showAlert('No hay acciones para eliminar', 'error');
        return;
    }
    
    if (confirm('¿Estás seguro de eliminar TODAS las acciones? Esto no se puede deshacer.')) {
        tbody.innerHTML = '';
        showAlert('Todas las acciones han sido eliminadas', 'success');
    }
}

function saveDraft() {
    const formData = {
        general: getGeneralData(),
        acciones: getActionsData()
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
    return {
        responsable: document.getElementById('responsable').value,
        departamento: document.getElementById('departamento').value,
        adscripcion: document.getElementById('adscripcion').value,
        programa: document.getElementById('programa').value,
        logros: document.getElementById('logros').value,
        causas: document.getElementById('causas').value,
        decisiones: document.getElementById('decisiones').value
    };
}

function setGeneralData(data) {
    if (!data) return;
    
    document.getElementById('responsable').value = data.responsable || '';
    document.getElementById('departamento').value = data.departamento || '';
    document.getElementById('adscripcion').value = data.adscripcion || '';
    document.getElementById('programa').value = data.programa || '2025';
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
            programado: row.querySelector('[data-field="programado"]').value,
            cumplimiento: row.querySelector('[data-field="cumplimiento"]').value
        };
        
        row.querySelectorAll('.month-checkbox').forEach(checkbox => {
            action.meses[checkbox.dataset.month] = checkbox.checked;
        });
        
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
    row.querySelector('[data-field="programado"]').value = action.programado || '';
    row.querySelector('[data-field="cumplimiento"]').value = action.cumplimiento || '';
    
    if (action.meses) {
        row.querySelectorAll('.month-checkbox').forEach(checkbox => {
            checkbox.checked = action.meses[checkbox.dataset.month] || false;
        });
    }
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
        
        if (!accion || !meta) {
            actionsValid = false;
            if (!accion) row.querySelector('[data-field="accion"]').focus();
            else if (!meta) row.querySelector('[data-field="meta"]').focus();
        }
    });
    
    if (!actionsValid) {
        showAlert('Todas las acciones deben tener descripción y meta completas', 'error');
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
            <!-- Página 1 -->
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