/* main.js - comportamiento: clonado de acciones, cálculo cumplimiento, previews fotos, firma y export PDF/Word */
document.addEventListener('DOMContentLoaded', () => {
  const accionesContainer = document.getElementById('accionesContainer');
  const addAccionBtn = document.getElementById('addAccion');
  const removeLastActionBtn = document.getElementById('removeLastAction');
  const form = document.getElementById('trimestralForm');

  const exportPdfBtn = document.getElementById('exportPdfBtn');
  const exportWordBtn = document.getElementById('exportWordBtn');
  const sheetRoot = document.getElementById('sheetRoot');

  // Helper: index de acción actual según su posición en DOM (0..N-1)
  function refreshActionIndices() {
    const actions = accionesContainer.querySelectorAll('.action-section');
    actions.forEach((action, idx) => {
      action.dataset.index = idx;
      // actualizar names de radios (pat_ / gov_)
      action.querySelectorAll('input[type="radio"]').forEach(r => {
        const base = (r.name || '').split('_')[0];
        if (base) r.name = `${base}_${idx}`;
      });
    });

    removeLastActionBtn.disabled = actions.length <= 1;
  }

  // Función para calcular cumplimiento y manejar previews dentro de una action node
  function attachActionListeners(action) {
    if (!action) return;

    // PAT specific text toggle
    const patRadios = action.querySelectorAll(`input[name^="pat_"]`);
    const patText = action.querySelector('.pat-text');
    patRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        const val = action.querySelector(`input[name^="pat_"]:checked`)?.value;
        if (val === 'SI') {
          if (patText) patText.style.display = 'block';
          const ta = action.querySelector('textarea[name="patAccionEspecifica[]"]');
          if (ta) ta.required = true;
        } else {
          if (patText) patText.style.display = 'none';
          const ta = action.querySelector('textarea[name="patAccionEspecifica[]"]');
          if (ta) { ta.required = false; ta.value = ''; }
        }
      });
    });

    // cumplimiento
    const programadoInput = action.querySelector('input[name="programado[]"]');
    const realizadoInput = action.querySelector('input[name="realizado[]"]');
    const cumplimientoInput = action.querySelector('input[name="cumplimiento[]"]');

    function calcular() {
      const p = parseFloat(programadoInput?.value || 0);
      const r = parseFloat(realizadoInput?.value || 0);
      if (!p || p <= 0) {
        cumplimientoInput.value = 'N/A';
        return;
      }
      const pct = (r / p) * 100;
      cumplimientoInput.value = (isFinite(pct) ? pct.toFixed(1) + '%' : '0%');
    }
    if (programadoInput) programadoInput.addEventListener('input', calcular);
    if (realizadoInput) realizadoInput.addEventListener('input', calcular);

    // previews fotos
    const photoInput = action.querySelector('input[type="file"][name="evidenciaFotos[]"]');
    const previews = action.querySelector('.photo-previews');
    if (photoInput) {
      photoInput.addEventListener('change', () => {
        previews.innerHTML = '';
        const files = Array.from(photoInput.files).slice(0, 12);
        files.forEach(f => {
          if (!f.type.startsWith('image/')) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            const img = document.createElement('img');
            img.src = ev.target.result;
            previews.appendChild(img);
          };
          reader.readAsDataURL(f);
        });
      });
    }

    // eliminar botón local
    const btnRemoveLocal = action.querySelector('.btn-remove-action');
    if (btnRemoveLocal) {
      btnRemoveLocal.addEventListener('click', () => {
        const all = accionesContainer.querySelectorAll('.action-section');
        if (all.length <= 1) {
          alert('Debe haber al menos una acción.');
          return;
        }
        action.remove();
        refreshActionIndices();
      });
    }
  }

  // Inicial: attach a la plantilla existente
  refreshActionIndices();
  document.querySelectorAll('.action-section').forEach(a => attachActionListeners(a));

  // Agregar acción (clonar plantilla)
  addAccionBtn.addEventListener('click', () => {
    const template = accionesContainer.querySelector('.action-section');
    if (!template) return;
    const clone = template.cloneNode(true);

    // Limpiar valores en clone
    clone.querySelectorAll('input, textarea, select').forEach(el => {
      if (el.type === 'radio' || el.type === 'checkbox') {
        el.checked = false;
      } else if (el.type === 'file') {
        el.value = '';
      } else {
        el.value = '';
      }
    });
    // limpiar previews
    clone.querySelectorAll('.photo-previews').forEach(p => p.innerHTML = '');

    accionesContainer.appendChild(clone);
    refreshActionIndices();
    setTimeout(() => {
      document.querySelectorAll('.action-section').forEach(a => attachActionListeners(a));
    }, 20);
  });

  // Deshacer última acción
  removeLastActionBtn.addEventListener('click', () => {
    const all = accionesContainer.querySelectorAll('.action-section');
    if (all.length <= 1) return;
    all[all.length - 1].remove();
    refreshActionIndices();
  });

  // Firma digital: preview imagen o nombre de archivo si xml/xlm
  const firmaInput = document.getElementById('firmaDigital');
  const firmaPreview = document.getElementById('firmaPreview');
  if (firmaInput) {
    firmaInput.addEventListener('change', () => {
      firmaPreview.innerHTML = '';
      const f = firmaInput.files[0];
      if (!f) return;
      const ext = (f.name.split('.').pop() || '').toLowerCase();
      if (['png','jpg','jpeg','gif','bmp','webp'].includes(ext)) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = document.createElement('img');
          img.src = ev.target.result;
          firmaPreview.appendChild(img);
        };
        reader.readAsDataURL(f);
      } else {
        const span = document.createElement('div');
        span.className = 'file-name';
        span.textContent = `${f.name} (${f.type || 'archivo'})`;
        firmaPreview.appendChild(span);
      }
    });
  }

  // Exportar a Word (.doc)
  exportWordBtn.addEventListener('click', () => {
    // ocultar controles que no queremos en el documento
    const controls = document.querySelectorAll('#exportPdfBtn, #exportWordBtn, #submitBtn, #addAccion, #removeLastAction, .btn-remove-action');
    controls.forEach(c => c.style.display = 'none');

    // Clonar y preparar HTML
    const clone = sheetRoot.cloneNode(true);

    // Inline estilos mínimas: tomamos el CSS actual del documento para impresión simple
    const styles = Array.from(document.styleSheets)
      .map(ss => {
        try {
          return Array.from(ss.cssRules || []).map(r => r.cssText).join('\n');
        } catch (e) {
          return '';
        }
      }).join('\n');

    const header = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Informe Trimestral</title><style>${styles}</style></head><body>`;
    const footer = '</body></html>';
    const html = header + clone.outerHTML + footer;

    // Restaurar controles
    controls.forEach(c => c.style.display = '');

    // Crear blob y descargar como doc (Word abrirá HTML)
    const blob = new Blob([html], { type: 'application/msword' });
    const fileName = `Informe_Trimestral_${new Date().toISOString().slice(0,10)}.doc`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  // Exportar a PDF (html2canvas + jsPDF), con multi-page
  exportPdfBtn.addEventListener('click', async () => {
    try {
      // ocultar controles para la captura
      const controls = document.querySelectorAll('#exportPdfBtn, #exportWordBtn, #submitBtn, #addAccion, #removeLastAction, .btn-remove-action');
      controls.forEach(c => c.style.display = 'none');

      // Esperar repintado
      await new Promise(r => setTimeout(r, 200));

      // capturar
      const element = sheetRoot;
      const options = { scale: 2, useCORS: true, allowTaint: false, logging: false };
      const canvas = await html2canvas(element, options);

      // restaurar controles
      controls.forEach(c => c.style.display = '');

      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p','mm','a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // calcular dimensiones
      const imgProps = { width: canvas.width, height: canvas.height };
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > -10) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = `Informe_Trimestral_${new Date().toISOString().slice(0,10)}.pdf`;
      pdf.save(fileName);

    } catch (err) {
      console.error('Error generando PDF:', err);
      alert('Error al generar PDF: ' + (err.message || err));
      // restaurar en caso de error
      document.querySelectorAll('#exportPdfBtn, #exportWordBtn, #submitBtn, #addAccion, #removeLastAction, .btn-remove-action').forEach(c => c.style.display = '');
    }
  });

  // Submit: valida los campos importantes; construye FormData listo para enviar a backend
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // validaciones sencillas
    const trimestre = form.querySelector('input[name="trimestre"]:checked');
    if (!trimestre) {
      alert('Seleccione el trimestre.');
      return;
    }
    const elaboro = form.querySelector('#elaboro').value.trim();
    if (!elaboro) {
      alert('Ingrese quién elaboró el documento.');
      form.querySelector('#elaboro').focus();
      return;
    }

    // validar cada acción: número de acción y descripción
    const actions = accionesContainer.querySelectorAll('.action-section');
    for (let i=0;i<actions.length;i++) {
      const a = actions[i];
      const numAcc = a.querySelector('input[name="numAccion[]"]');
      const desc = a.querySelector('textarea[name="descActividades[]"]');
      if (!numAcc || !numAcc.value.trim()) {
        alert(`Ingrese Número de acción en la acción #${i+1}`);
        numAcc.focus();
        return;
      }
      if (!desc || !desc.value.trim()) {
        alert(`Ingrese Descripción de actividades en la acción #${i+1}`);
        desc.focus();
        return;
      }
      const patSel = a.querySelector(`input[name^="pat_"]:checked`);
      if (!patSel) {
        alert(`Seleccione SI/NO para "Acción especificada en el PAT" en la acción #${i+1}`);
        return;
      }
      if (patSel.value === 'SI') {
        const patText = a.querySelector('textarea[name="patAccionEspecifica[]"]');
        if (!patText || !patText.value.trim()) {
          alert(`Describa la acción especificada en el PAT (acción #${i+1})`);
          patText.focus();
          return;
        }
      }
    }

    // Si pasó validaciones, construimos FormData (ejemplo, listo para enviar)
    const fd = new FormData(form);

    // Aquí puedes enviar fd con fetch a tu endpoint si quieres:
    // fetch('/api/enviar', { method: 'POST', body: fd }).then(...)

    console.log('Formulario validado. Datos (ejemplo):', {
      trimestre: fd.get('trimestre'),
      area: fd.get('areaTrabajo'),
      acciones: accionesContainer.querySelectorAll('.action-section').length
    });
    alert('Formulario validado localmente. (Aquí agregar envío al servidor si lo deseas).');
  });

});
