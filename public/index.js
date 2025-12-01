// Variables globales para almacenar imágenes
let imagenesEvidencia = {};
let firmasElaboro = [];
let firmasVobo = [];
let contadorAcciones = 1;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la primera acción
    inicializarAccion(1);
    
    // Agregar otra acción
    document.getElementById('agregarAccion').addEventListener('click', function() {
        agregarNuevaAccion();
    });
    
    // Guardar borrador
    document.getElementById('guardarBorrador').addEventListener('click', function() {
        guardarBorrador();
    });
    
    // Generar Word
    document.getElementById('generarWord').addEventListener('click', function() {
        generarWord();
    });
    
    // Manejo de firmas para Elaboró
    const elaboroFirmaInput = document.getElementById('elaboro_firma');
    const elaboroPreviewContainer = document.getElementById('elaboro_firma_preview');
    
    elaboroFirmaInput.addEventListener('change', function() {
        firmasElaboro = [];
        const files = elaboroFirmaInput.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const signatureItem = document.createElement('div');
                signatureItem.classList.add('signature-item');
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('signature-preview');
                
                // Guardar firma para Word
                firmasElaboro.push(e.target.result);
                
                const removeBtn = document.createElement('button');
                removeBtn.classList.add('remove-signature');
                removeBtn.innerHTML = '×';
                removeBtn.addEventListener('click', function() {
                    signatureItem.remove();
                    // Eliminar firma del array
                    const index = firmasElaboro.indexOf(e.target.result);
                    if (index > -1) {
                        firmasElaboro.splice(index, 1);
                    }
                });
                
                signatureItem.appendChild(img);
                signatureItem.appendChild(removeBtn);
                elaboroPreviewContainer.appendChild(signatureItem);
            }
            
            reader.readAsDataURL(file);
        }
    });
    
    // Manejo de firmas para Vo.Bo
    const voboFirmaInput = document.getElementById('vobo_firma');
    const voboPreviewContainer = document.getElementById('vobo_firma_preview');
    
    voboFirmaInput.addEventListener('change', function() {
        firmasVobo = [];
        const files = voboFirmaInput.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const signatureItem = document.createElement('div');
                signatureItem.classList.add('signature-item');
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('signature-preview');
                
                // Guardar firma para Word
                firmasVobo.push(e.target.result);
                
                const removeBtn = document.createElement('button');
                removeBtn.classList.add('remove-signature');
                removeBtn.innerHTML = '×';
                removeBtn.addEventListener('click', function() {
                    signatureItem.remove();
                    // Eliminar firma del array
                    const index = firmasVobo.indexOf(e.target.result);
                    if (index > -1) {
                        firmasVobo.splice(index, 1);
                    }
                });
                
                signatureItem.appendChild(img);
                signatureItem.appendChild(removeBtn);
                voboPreviewContainer.appendChild(signatureItem);
            }
            
            reader.readAsDataURL(file);
        }
    });
    
    // Cargar borrador si existe
    cargarBorrador();
});

function inicializarAccion(id) {
    // Calcular cumplimiento automáticamente
    const programadoInput = document.querySelector(`.accion[data-id="${id}"] .programado`);
    const realizadoInput = document.querySelector(`.accion[data-id="${id}"] .realizado`);
    const cumplimientoInput = document.querySelector(`.accion[data-id="${id}"] .cumplimiento`);
    
    function calcularCumplimiento() {
        const programado = parseFloat(programadoInput.value) || 0;
        const realizado = parseFloat(realizadoInput.value) || 0;
        
        if (programado > 0 && realizado >= 0) {
            const cumplimiento = (realizado / programado) * 100;
            cumplimientoInput.value = cumplimiento.toFixed(2) + '%';
        } else {
            cumplimientoInput.value = '';
        }
    }
    
    if (programadoInput && realizadoInput && cumplimientoInput) {
        programadoInput.addEventListener('input', calcularCumplimiento);
        realizadoInput.addEventListener('input', calcularCumplimiento);
    }
    
    // Previsualización de fotos de evidencia
    const fotoInput = document.querySelector(`.accion[data-id="${id}"] .foto_evidencia`);
    const previewContainer = document.querySelector(`.accion[data-id="${id}"] .photo-preview-container`);
    
    if (fotoInput && previewContainer) {
        fotoInput.addEventListener('change', function() {
            previewContainer.innerHTML = '';
            imagenesEvidencia[id] = [];
            
            const files = fotoInput.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const signatureItem = document.createElement('div');
                    signatureItem.classList.add('signature-item');
                    
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.classList.add('photo-preview');
                    
                    // Guardar imagen para Word
                    imagenesEvidencia[id].push(e.target.result);
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.classList.add('remove-signature');
                    removeBtn.innerHTML = '×';
                    removeBtn.addEventListener('click', function() {
                        signatureItem.remove();
                        // Eliminar imagen del array
                        const index = imagenesEvidencia[id].indexOf(e.target.result);
                        if (index > -1) {
                            imagenesEvidencia[id].splice(index, 1);
                        }
                    });
                    
                    signatureItem.appendChild(img);
                    signatureItem.appendChild(removeBtn);
                    previewContainer.appendChild(signatureItem);
                }
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Enlace a Google Drive
    const driveLinkInput = document.querySelector(`.accion[data-id="${id}"] .drive_link`);
    const driveLinkContainer = document.querySelector(`.accion[data-id="${id}"] .drive-link-container`);
    
    if (driveLinkInput && driveLinkContainer) {
        driveLinkInput.addEventListener('input', function() {
            const link = driveLinkInput.value.trim();
            if (link && isValidURL(link)) {
                driveLinkContainer.innerHTML = `<a href="${link}" target="_blank" class="drive-link">Abrir enlace de Google Drive</a>`;
            } else {
                driveLinkContainer.innerHTML = '';
            }
        });
    }
    
    // Botón eliminar acción (solo para acciones adicionales)
    const eliminarBtn = document.querySelector(`.accion[data-id="${id}"] .eliminar-accion`);
    if (eliminarBtn && id > 1) {
        eliminarBtn.style.display = 'block';
        eliminarBtn.addEventListener('click', function() {
            eliminarAccion(id);
        });
    }
}

function agregarNuevaAccion() {
    contadorAcciones++;
    const contenedor = document.getElementById('acciones-container');
    const primeraAccion = document.querySelector('.accion');
    const nuevaAccion = primeraAccion.cloneNode(true);
    
    // Actualizar el ID de la acción
    nuevaAccion.setAttribute('data-id', contadorAcciones);
    
    // Actualizar el título
    const titulo = nuevaAccion.querySelector('h3');
    titulo.textContent = `Acción #${contadorAcciones}`;
    
    // Actualizar los nombres de los campos
    nuevaAccion.querySelectorAll('[name]').forEach(element => {
        const name = element.getAttribute('name');
        if (name.includes('_1')) {
            element.setAttribute('name', name.replace('_1', `_${contadorAcciones}`));
        }
    });
    
    // Limpiar los valores
    nuevaAccion.querySelectorAll('input').forEach(input => {
        if (input.type === 'text' || input.type === 'number' || input.type === 'date' || input.type === 'url') {
            input.value = '';
        } else if (input.type === 'radio' || input.type === 'checkbox') {
            input.checked = false;
        }
    });
    
    nuevaAccion.querySelectorAll('textarea').forEach(textarea => {
        textarea.value = '';
    });
    
    // Limpiar previsualizaciones
    nuevaAccion.querySelector('.photo-preview-container').innerHTML = '';
    nuevaAccion.querySelector('.drive-link-container').innerHTML = '';
    
    // Inicializar la nueva acción
    contenedor.appendChild(nuevaAccion);
    inicializarAccion(contadorAcciones);
    
    // Mostrar mensaje de éxito
    alert(`Acción #${contadorAcciones} agregada correctamente. Puedes agregar tantas acciones como necesites.`);
}

function eliminarAccion(id) {
    const accion = document.querySelector(`.accion[data-id="${id}"]`);
    if (accion && confirm('¿Estás seguro de que deseas eliminar esta acción?')) {
        accion.remove();
        delete imagenesEvidencia[id];
        alert('Acción eliminada correctamente.');
    }
}

function guardarBorrador() {
    const formData = new FormData(document.getElementById('trimestralForm'));
    
    // Convertir FormData a objeto simple
    const datos = {};
    for (let [key, value] of formData.entries()) {
        datos[key] = value;
    }
    
    // Guardar también las imágenes en base64 y firmas
    datos.imagenesEvidencia = imagenesEvidencia;
    datos.firmasElaboro = firmasElaboro;
    datos.firmasVobo = firmasVobo;
    datos.contadorAcciones = contadorAcciones;
    
    localStorage.setItem('informeBorrador', JSON.stringify(datos));
    alert('Borrador guardado correctamente. Los datos se mantendrán incluso si cierras el navegador.');
}

function cargarBorrador() {
    const borrador = localStorage.getItem('informeBorrador');
    if (borrador) {
        const datos = JSON.parse(borrador);
        
        // Cargar datos básicos del formulario
        for (const key in datos) {
            if (key !== 'imagenesEvidencia' && key !== 'firmasElaboro' && key !== 'firmasVobo' && key !== 'contadorAcciones') {
                const elemento = document.querySelector(`[name="${key}"]`);
                if (elemento) {
                    if (elemento.type === 'radio' || elemento.type === 'checkbox') {
                        if (elemento.value === datos[key]) {
                            elemento.checked = true;
                        }
                    } else {
                        elemento.value = datos[key];
                    }
                }
            }
        }
        
        // Cargar contador de acciones
        if (datos.contadorAcciones && datos.contadorAcciones > 1) {
            for (let i = 2; i <= datos.contadorAcciones; i++) {
                agregarNuevaAccion();
                
                // Cargar datos específicos de cada acción adicional
                for (const key in datos) {
                    if (key.includes(`_${i}`)) {
                        const elemento = document.querySelector(`[name="${key}"]`);
                        if (elemento) {
                            if (elemento.type === 'radio' || elemento.type === 'checkbox') {
                                if (elemento.value === datos[key]) {
                                    elemento.checked = true;
                                }
                            } else {
                                elemento.value = datos[key];
                            }
                        }
                    }
                }
            }
        }
        
        // Recalcular cumplimientos
        document.querySelectorAll('.programado').forEach(input => {
            input.dispatchEvent(new Event('input'));
        });
        
        alert('Datos cargados correctamente desde el borrador guardado.');
    }
}

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function generarWord() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
    
    // Obtener todos los datos del formulario
    const formData = new FormData(document.getElementById('trimestralForm'));
    const data = Object.fromEntries(formData);
    
    // Crear contenido HTML para el documento Word
    let htmlContent = `
        <!DOCTYPE html>
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <title>Informe Trimestral</title>
            <style>
                body {
                    font-family: "Times New Roman", serif;
                    font-size: 12pt;
                    margin: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 15px;
                }
                table, th, td {
                    border: 1px solid black;
                }
                th, td {
                    padding: 8px;
                    text-align: center;
                    vertical-align: middle;
                }
                .bg-gray {
                    background-color: #D9D9D9;
                }
                .bg-light-gray {
                    background-color: #CCCCCC;
                }
                .bg-medium-gray {
                    background-color: #BFBFBF;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .university-title {
                    font-size: 16pt;
                    font-weight: bold;
                    color: #003366;
                }
                .document-title {
                    font-size: 14pt;
                    font-weight: bold;
                    color: #003366;
                }
                .section-title {
                    font-weight: bold;
                    text-align: center;
                    margin: 15px 0;
                }
                .note {
                    font-style: italic;
                    font-size: 9pt;
                    margin: 5px 0;
                }
                .drive-link {
                    color: #1a73e8;
                    text-decoration: underline;
                }
                .word-image {
                    max-width: 200px;
                    max-height: 150px;
                    margin: 5px;
                }
                .word-signature {
                    max-width: 150px;
                    max-height: 100px;
                    margin: 5px;
                }
                .images-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 10px;
                }
                .signature-container {
                    margin-top: 10px;
                    text-align: center;
                }
                .accion-word {
                    margin-bottom: 30px;
                    padding: 15px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                .accion-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #003366;
                }
            </style>
            <!--[if gte mso 9]>
            <xml>
                <w:WordDocument>
                    <w:View>Print</w:View>
                    <w:Zoom>100</w:Zoom>
                    <w:DoNotOptimizeForBrowser/>
                </w:WordDocument>
            </xml>
            <![endif]-->
        </head>
        <body>
            <div class="header">
                <h1 class="university-title">Universidad Politécnica de Tapachula</h1>
                <h2 class="document-title">Registro / Informe Trimestral</h2>
                <p>Dirección de Planeación Educativa</p>
            </div>
    `;
    
    // Agregar datos generales del formulario
    htmlContent += `
        <div class="section-title">Trimestre (Marcar con una X)</div>
        <table class="bg-gray">
            <tr>
                <td width="151" rowspan="2">
                    <p align="right"><b>Trimestre:</b></p>
                    <p align="right"><b>(Marcar con una X)</b></p>
                </td>
                <td width="76">
                    <p><b>1</b></p>
                    <p>(Ene-Mzo)</p>
                </td>
                <td width="66">
                    <p><b>2</b></p>
                    <p>(Abr-Jun)</p>
                </td>
                <td width="76">
                    <p><b>3</b></p>
                    <p>(Jul-Sept)</p>
                </td>
                <td width="64">
                    <p><b>4</b></p>
                    <p>(Oct-Dic)</p>
                </td>
            </tr>
            <tr>
                <td>${data.trimestre === '1' ? 'X' : ''}</td>
                <td>${data.trimestre === '2' ? 'X' : ''}</td>
                <td>${data.trimestre === '3' ? 'X' : ''}</td>
                <td>${data.trimestre === '4' ? 'X' : ''}</td>
            </tr>
        </table>
        
        <table class="bg-gray">
            <tr>
                <td width="18%">
                    <p align="center"><b>Área Trabajo:</b></p>
                </td>
                <td width="47%" colspan="3">
                    ${data.area_trabajo || ''}
                </td>
                <td width="13%">
                    <p align="right"><b>Mes y año:</b></p>
                </td>
                <td width="20%">
                    ${data.mes_anio || ''}
                </td>
            </tr>
            <tr>
                <td width="18%">
                    <p align="center"><b>PIDE</b></p>
                </td>
                <td width="12%">
                    ${data.pide || ''}
                </td>
                <td width="16%">
                    <p align="center"><b>CACEI</b></p>
                </td>
                <td width="18%">
                    ${data.cacei || ''}
                </td>
                <td width="13%">
                    <p align="right"><b>SEAES</b></p>
                </td>
                <td width="20%">
                    ${data.seaes || ''}
                </td>
            </tr>
        </table>
    `;
    
    // Agregar cada acción al documento Word
    for (let i = 1; i <= contadorAcciones; i++) {
        htmlContent += `
            <div class="accion-word">
                <div class="accion-header">
                    <h3>Acción #${i}</h3>
                </div>
                
                <table>
                    <tr>
                        <td width="22%" rowspan="2" class="bg-light-gray">
                            <p align="center"><b>Número de Acción:</b></p>
                        </td>
                        <td width="11%" colspan="2" rowspan="2">
                            ${data[`numero_accion_${i}`] || ''}
                        </td>
                        <td width="52%" colspan="4" rowspan="2" class="bg-light-gray">
                            <p align="center"><b>Acción especificada en el PAT</b></p>
                            <p align="center"><b>(Marcar con una X)</b></p>
                        </td>
                        <td width="6%" class="bg-light-gray">
                            <p align="center"><b>SI</b></p>
                        </td>
                        <td width="6%" class="bg-light-gray">
                            <p align="center"><b>NO</b></p>
                        </td>
                    </tr>
                    <tr>
                        <td>${data[`accion_pat_${i}`] === 'si' ? 'X' : ''}</td>
                        <td>${data[`accion_pat_${i}`] === 'no' ? 'X' : ''}</td>
                    </tr>
                    <tr>
                        <td colspan="9">
                            <p><i>[Indicar la acción especificada en el Programa Anual de Trabajo vigente y marcar con una X el recuadro SI]</i></p>
                            <p><b>Nota:</b> Si reporta actividades de acciones no especificadas en el PAT vigente, describir la acción y marcar con una X en el recuadro NO.</p>
                        </td>
                    </tr>
                </table>
                
                <table>
                    <tr>
                        <td colspan="9" class="bg-light-gray">
                            <p align="center"><b>Descripción de Actividades Desarrolladas</b></p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="9">
                            ${data[`descripcion_actividades_${i}`] || ''}
                            <p class="note">En los casos en las que no se haya cumplido al 100% alguna de las metas programadas, redactar las actividades realizadas, así como el porcentaje de avance o una descripción fundamentada del motivo por el cual no se realizaron las actividades correspondientes.</p>
                        </td>
                    </tr>
                </table>
                
                <table>
                    <tr>
                        <td width="25%" colspan="2" class="bg-medium-gray">
                            <p align="center"><b>Programado (P):</b></p>
                        </td>
                        <td width="28%" colspan="2" class="bg-medium-gray">
                            <p align="center"><b>Realizado (R):</b></p>
                        </td>
                        <td width="20%" class="bg-medium-gray">
                            <p align="center"><b>Cumplimiento ((R/P)*100):</b></p>
                        </td>
                        <td width="25%" colspan="4" class="bg-medium-gray">
                            <p align="center"><b>Justificación de incumplimiento</b></p>
                        </td>
                    </tr>
                    <tr>
                        <td width="25%" colspan="2">
                            ${data[`programado_${i}`] || ''}
                            <p class="note">(Meta trimestral)</p>
                        </td>
                        <td width="28%" colspan="2">
                            ${data[`realizado_${i}`] || ''}
                            <p class="note">(Número de acciones realizadas en el trimestre)</p>
                        </td>
                        <td width="20%">
                            ${data[`cumplimiento_${i}`] || ''}
                        </td>
                        <td width="25%" colspan="4">
                            ${data[`justificacion_${i}`] || ''}
                        </td>
                    </tr>
                </table>
                
                <table>
                    <tr>
                        <td width="25%" colspan="2" rowspan="3" class="bg-medium-gray">
                            <p><b>Impacto de la actividad:</b></p>
                        </td>
                        <td width="60%" colspan="4" rowspan="3">
                            ${data[`impacto_${i}`] || ''}
                        </td>
                        <td width="13%" colspan="3">
                            <p align="center"><b>Destacar para informe de Gobierno</b></p>
                        </td>
                    </tr>
                    <tr>
                        <td width="7%" colspan="2">
                            <p align="center"><b>SI</b></p>
                        </td>
                        <td width="6%">
                            <p align="center"><b>NO</b></p>
                        </td>
                    </tr>
                    <tr>
                        <td width="7%" colspan="2">
                            ${data[`destacar_informe_${i}`] === 'si' ? 'X' : ''}
                        </td>
                        <td width="6%">
                            ${data[`destacar_informe_${i}`] === 'no' ? 'X' : ''}
                        </td>
                    </tr>
                </table>
                
                <table>
                    <tr>
                        <td width="25%" colspan="2" class="bg-medium-gray">
                            <p><b>Fecha de Realización:</b></p>
                        </td>
                        <td width="74%" colspan="7">
                            ${data[`fecha_realizacion_${i}`] || ''}
                        </td>
                    </tr>
                </table>
                
                <table>
                    <tr>
                        <td colspan="9" class="bg-medium-gray">
                            <p><b>Evidencia fotográfica:</b></p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="9">
                            <div>
                                <p><b>Agregar las fotografías más representativas e Incluir enlace a Drive con carpetas para cada acción con fotografías en formato JPG, utilizando el número de acción con la nomenclatura siguiente:</b></p>
                                <p><b>[NúmTrimeste_NúmAcción]</b></p>
                                <p><b>Ejemplo: 1_2 (Para trimestre 1, acción 2)</b></p>
        `;
        
        // Agregar imágenes de evidencia al Word
        if (imagenesEvidencia[i] && imagenesEvidencia[i].length > 0) {
            htmlContent += `<div class="images-container">`;
            imagenesEvidencia[i].forEach(imgSrc => {
                htmlContent += `<img src="${imgSrc}" class="word-image" />`;
            });
            htmlContent += `</div>`;
        }
        
        htmlContent += `
                                <div style="margin-top: 10px;">
                                    <p><b>Enlace a Google Drive:</b></p>
                                    ${data[`drive_link_${i}`] ? `<a href="${data[`drive_link_${i}`]}" class="drive-link">${data[`drive_link_${i}`]}</a>` : ''}
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        `;
        
        // Agregar separador entre acciones (excepto la última)
        if (i < contadorAcciones) {
            htmlContent += `<hr style="margin: 30px 0; border: 0; border-top: 2px dashed #ccc;">`;
        }
    }
    
    // Agregar firmas y pie de página
    htmlContent += `
            <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                <div style="width: 45%; text-align: center;">
                    <p><b>Elaboró</b></p>
                    <p>${data.elaboro_nombre || ''}</p>
    `;
    
    // Agregar firmas de Elaboró al Word
    if (firmasElaboro.length > 0) {
        htmlContent += `<div class="signature-container">`;
        firmasElaboro.forEach(imgSrc => {
            htmlContent += `<img src="${imgSrc}" class="word-signature" style="max-width: 150px; max-height: 100px;" />`;
        });
        htmlContent += `</div>`;
    } else {
        htmlContent += `<div class="signature-container" style="height: 100px; border-bottom: 1px solid #000; margin: 0 auto; width: 200px;"></div>`;
    }
    
    htmlContent += `
                </div>
                <div style="width: 45%; text-align: center;">
                    <p><b>Tapachula, Chiapas, a ${data.dia || ''} de ${data.mes || ''} de ${data.anio || ''}</b></p>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                <div style="width: 45%; text-align: center;">
                    <p><b>Vo.Bo.</b></p>
                    <p>${data.vobo_nombre || ''}</p>
    `;
    
    // Agregar firmas de Vo.Bo al Word
    if (firmasVobo.length > 0) {
        htmlContent += `<div class="signature-container">`;
        firmasVobo.forEach(imgSrc => {
            htmlContent += `<img src="${imgSrc}" class="word-signature" style="max-width: 150px; max-height: 100px;" />`;
        });
        htmlContent += `</div>`;
    } else {
        htmlContent += `<div class="signature-container" style="height: 100px; border-bottom: 1px solid #000; margin: 0 auto; width: 200px;"></div>`;
    }
    
    htmlContent += `
                </div>
                <div style="width: 45%; text-align: center;">
                    <p><b>Fecha de recepción</b></p>
                    <p>${data.fecha_recepcion || ''}</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    // Crear y descargar el documento Word
    const blob = new Blob([htmlContent], { 
        type: 'application/msword' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'informe_trimestral.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    loading.style.display = 'none';
}