    document.addEventListener('DOMContentLoaded', () => {
      // Elementos del DOM
      const container = document.getElementById('accionesContainer');
      const addBtn = document.getElementById('addAccion');
      const removeBtn = document.getElementById('removeLastAction');
      const generatePDFBtn = document.getElementById('generatePDF');
      const form = document.getElementById('informeForm');
      
      // Configuración de Google API (reemplaza con tus credenciales)
      const GOOGLE_API_KEY = 'TU_API_KEY';
      const GOOGLE_CLIENT_ID = 'TU_CLIENT_ID.apps.googleusercontent.com';
      
      // Contador de acciones
      let actionCounter = 1;
      
      // Función para inicializar Google API
      function initGoogleAPI() {
        return new Promise((resolve, reject) => {
          gapi.load('client:auth2', () => {
            gapi.client.init({
              apiKey: GOOGLE_API_KEY,
              clientId: GOOGLE_CLIENT_ID,
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
              scope: 'https://www.googleapis.com/auth/drive.file'
            }).then(() => {
              console.log('Google API inicializada correctamente');
              resolve();
            }).catch(err => {
              console.error('Error al inicializar Google API:', err);
              reject(err);
            });
          });
        });
      }
      
      // Función para autenticar con Google
      async function authenticateGoogle() {
        const auth2 = gapi.auth2.getAuthInstance();
        
        if (!auth2) {
          throw new Error('Google Auth no está inicializado');
        }
        
        if (auth2.isSignedIn.get()) {
          return auth2.currentUser.get();
        }
        
        return await auth2.signIn();
      }
      
      // Función para extraer ID de carpeta de URL de Drive
      function extractDriveFolderId(url) {
        if (!url) return null;
        
        // Diferentes patrones de URL de Drive
        const patterns = [
          /\/folders\/([-\w]{25,})/,
          /id=([-\w]{25,})/,
          /([-\w]{25,})/
        ];
        
        for (const pattern of patterns) {
          const match = url.match(pattern);
          if (match && match[1]) {
            return match[1];
          }
        }
        
        return null;
      }
      
      // Función para subir archivo a Google Drive
      async function uploadToGoogleDrive(fileBlob, fileName, folderId = null) {
        await authenticateGoogle();
        
        const metadata = {
          name: fileName,
          mimeType: 'application/pdf',
          ...(folderId && {parents: [folderId]})
        };
        
        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        formData.append('file', fileBlob);
        
        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: new Headers({
            'Authorization': 'Bearer ' + gapi.auth.getToken().access_token
          }),
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Error al subir a Google Drive');
        }
        
        return response.json();
      }
      
      // Función para generar PDF en alta calidad
      async function generateHighQualityPDF() {
        // Ocultar elementos que no queremos en el PDF
        const elementsToHide = document.querySelectorAll('.action-buttons, .form-actions, .remove-action-btn');
        const originalDisplay = Array.from(elementsToHide).map(el => el.style.display);
        elementsToHide.forEach(el => el.style.display = 'none');
        
        // Opciones para html2canvas
        const options = {
          scale: 3, // Mayor escala para mejor calidad
          logging: true,
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: -window.scrollY,
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight
        };
        
        try {
          const canvas = await html2canvas(form, options);
          
          // Restaurar elementos ocultos
          elementsToHide.forEach((el, index) => {
            el.style.display = originalDisplay[index];
          });
          
          // Crear PDF
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF('p', 'pt', 'a4');
          const imgData = canvas.toDataURL('image/jpeg', 1.0); // JPEG con máxima calidad
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          return pdf;
        } catch (err) {
          // Restaurar elementos en caso de error
          elementsToHide.forEach((el, index) => {
            el.style.display = originalDisplay[index];
          });
          throw err;
        }
      }
      
      // Función para actualizar números de acción
      const updateActionNumbers = () => {
        const actions = container.querySelectorAll('.action-section');
        actions.forEach((action, index) => {
          action.querySelector('.action-number').textContent = index + 1;
          // Actualizar nombres de los radios para evitar conflictos
          action.querySelectorAll('input[type="radio"]').forEach(radio => {
            const name = radio.name.split('_')[0];
            radio.name = `${name}_${index}`;
          });
        });
        
        // Habilitar/deshabilitar botón de eliminar
        removeBtn.disabled = actions.length <= 1;
      };
      
      // Clonar sección de acción
      const cloneActionSection = () => {
        const original = container.querySelector('.action-section');
        const clone = original.cloneNode(true);
        const newIndex = container.querySelectorAll('.action-section').length;
        
        // Limpiar valores
        clone.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), textarea').forEach(el => {
          el.value = '';
        });
        
        // Resetear radios
        clone.querySelectorAll('input[type="radio"]').forEach(radio => {
          radio.checked = false;
        });
        
        // Añadir evento al botón de eliminar
        const removeBtn = clone.querySelector('.remove-action-btn');
        removeBtn.addEventListener('click', () => {
          clone.remove();
          updateActionNumbers();
        });
        
        return clone;
      };
      
      // Añadir nueva acción
      addBtn.addEventListener('click', () => {
        const newAction = cloneActionSection();
        container.appendChild(newAction);
        actionCounter++;
        updateActionNumbers();
        
        // Scroll a la nueva sección
        newAction.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
      
      // Eliminar última acción
      removeBtn.addEventListener('click', () => {
        const actions = container.querySelectorAll('.action-section');
        if (actions.length > 1) {
          actions[actions.length - 1].remove();
          updateActionNumbers();
        }
      });
      
      // Calcular porcentaje de cumplimiento
      container.addEventListener('input', e => {
        if (e.target.name === 'prog[]' || e.target.name === 'real[]') {
          const row = e.target.closest('tr');
          const prog = parseFloat(row.querySelector('input[name="prog[]"]').value) || 0;
          const real = parseFloat(row.querySelector('input[name="real[]"]').value) || 0;
          
          let pct = '';
          if (prog > 0) {
            pct = ((real / prog) * 100).toFixed(1);
            if (pct > 100) pct = '100.0';
          }
          
          row.querySelector('input[name="cumplim[]"]').value = pct;
        }
      });
      
      // Generar y descargar PDF
      generatePDFBtn.addEventListener('click', async () => {
        try {
          const pdf = await generateHighQualityPDF();
          
          // Fecha para el nombre del archivo
          const today = new Date();
          const dateStr = today.toISOString().split('T')[0];
          const fileName = `Informe_Trimestral_UPTap_${dateStr}.pdf`;
          
          // Guardar PDF
          pdf.save(fileName);
        } catch (err) {
          console.error('Error al generar PDF:', err);
          alert('Error al generar el PDF: ' + err.message);
        }
      });
      
      // Enviar formulario (generar PDF y subir a Drive)
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validar trimestre seleccionado
        const trimestreSelected = document.querySelector('input[name="trimestre"]:checked');
        if (!trimestreSelected) {
          alert('Por favor seleccione un trimestre');
          return;
        }
        
        // Validar todas las acciones
        const actions = container.querySelectorAll('.action-section');
        let isValid = true;
        
        for (let i = 0; i < actions.length; i++) {
          const action = actions[i];
          
          // Validar número de acción
          const numAccion = action.querySelector('input[name="numAccion[]"]');
          if (!numAccion.value.trim()) {
            alert(`Por favor ingrese el número de acción para la acción #${i + 1}`);
            numAccion.focus();
            isValid = false;
            break;
          }
          
          // Validar selección PAT
          const patSelected = action.querySelector(`input[name="pat_${i}"]:checked`);
          if (!patSelected) {
            alert(`Por favor indique si la acción #${i + 1} está especificada en el PAT`);
            isValid = false;
            break;
          }
          
          // Validar descripción de actividades
          const descActividades = action.querySelector('textarea[name="descActividades[]"]');
          if (!descActividades.value.trim()) {
            alert(`Por favor ingrese la descripción de actividades para la acción #${i + 1}`);
            descActividades.focus();
            isValid = false;
            break;
          }
        }
        
        if (!isValid) return;
        
        // Mostrar carga
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
          // Inicializar Google API si no está inicializada
          if (!gapi.auth) {
            await initGoogleAPI();
          }
          
          // 1. Generar PDF
          const pdf = await generateHighQualityPDF();
          const pdfBlob = pdf.output('blob');
          
          // Fecha para el nombre del archivo
          const today = new Date();
          const dateStr = today.toISOString().split('T')[0];
          const fileName = `Informe_Trimestral_UPTap_${dateStr}.pdf`;
          
          // 2. Obtener URL de Drive del formulario (primera acción)
          const driveUrl = actions[0].querySelector('input[name="evidencia[]"]')?.value;
          const folderId = extractDriveFolderId(driveUrl);
          
          // 3. Subir a Google Drive si hay folderId
          if (folderId) {
            await uploadToGoogleDrive(pdfBlob, fileName, folderId);
            alert('Informe enviado correctamente y PDF subido a Google Drive');
          } else {
            pdf.save(fileName);
            alert('Informe generado como PDF. No se encontró carpeta de Drive válida para subir.');
          }
          
        } catch (error) {
          console.error('Error al enviar:', error);
          alert('Error al enviar el informe: ' + error.message);
        } finally {
          // Restaurar botón
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      });
      
      // Inicializar números de acción
      updateActionNumbers();
      
      // Añadir evento al botón de eliminar de la primera acción
      const firstRemoveBtn = container.querySelector('.action-section .remove-action-btn');
      firstRemoveBtn.addEventListener('click', () => {
        const actions = container.querySelectorAll('.action-section');
        if (actions.length > 1) {
          actions[0].remove();
          updateActionNumbers();
        } else {
          alert('Debe haber al menos una acción');
        }
      });
      
      // Inicializar Google API cuando cargue la página
      initGoogleAPI().catch(err => {
        console.warn('No se pudo inicializar Google API:', err);
      });
    });