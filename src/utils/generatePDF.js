import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Función para generar el PDF del FRAP con formato oficial
export const generateFRAPPDF = async (frap) => {
  const doc = new jsPDF('p', 'mm', 'letter');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  
  // Colores
  const headerBlue = [0, 51, 102];
  const textGray = [51, 51, 51];
  const lightGray = [240, 240, 240];
  
  // Cargar logo
  let logoBase64 = null;
  try {
    const response = await fetch('/logo.png');
    const blob = await response.blob();
    logoBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.log('No se pudo cargar el logo');
  }
  
  // Helper functions
  const drawHeader = (pageNum, totalPages) => {
    // Logo
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', margin, 8, 25, 25);
    }
    
    // Título
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...headerBlue);
    doc.text('CUERPO DE RESCATE DE ENSENADA, A.C.', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textGray);
    doc.text('Por la Seguridad de Ensenada - Fundado en 1978', pageWidth / 2, 20, { align: 'center' });
    doc.text('Calle Magnolias No. 2356, Col. Márquez de León, Ensenada, B.C.', pageWidth / 2, 24, { align: 'center' });
    
    // Folio y Fecha
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`FOLIO #${frap.folio || 'S/N'}`, pageWidth - margin, 15, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${frap.fecha || ''}`, pageWidth - margin, 21, { align: 'right' });
    
    // Línea separadora
    doc.setDrawColor(...headerBlue);
    doc.setLineWidth(0.5);
    doc.line(margin, 35, pageWidth - margin, 35);
    
    return 40;
  };
  
  const drawFooter = (pageNum, totalPages) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textGray);
    doc.text('FRAP - Formulario de Rescate y Atención Prehospitalaria', margin, pageHeight - 10);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  };
  
  const drawSectionTitle = (title, y) => {
    doc.setFillColor(...headerBlue);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(title, margin + 2, y + 4.5);
    return y + 8;
  };
  
  const drawField = (label, value, x, y, width) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textGray);
    doc.text(label + ':', x, y);
    doc.setFont('helvetica', 'normal');
    const labelWidth = doc.getTextWidth(label + ': ');
    doc.text(String(value || ''), x + labelWidth, y);
    return y + 5;
  };
  
  const drawCheckbox = (label, checked, x, y) => {
    doc.setDrawColor(...textGray);
    doc.rect(x, y - 3, 3, 3);
    if (checked) {
      doc.setFillColor(...headerBlue);
      doc.rect(x + 0.5, y - 2.5, 2, 2, 'F');
    }
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textGray);
    doc.text(label, x + 5, y);
    return doc.getTextWidth(label) + 10;
  };
  
  // ============ PÁGINA 1 ============
  let y = drawHeader(1, 2);
  
  // TIEMPOS DEL SERVICIO
  y = drawSectionTitle('TIEMPOS DEL SERVICIO', y);
  
  doc.autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Hora Llamada', 'Hora Salida', 'Hora Llegada', 'Hora Hospital', 'Hora Base']],
    body: [[
      frap.hora_llamada || '',
      frap.hora_salida || '',
      frap.hora_llegada_traslado || '',
      frap.hora_llegada_hospital || '',
      frap.hora_llegada_base || ''
    ]],
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: headerBlue, textColor: [255, 255, 255], fontStyle: 'bold' },
    theme: 'grid'
  });
  
  y = doc.lastAutoTable.finalY + 5;
  
  // MOTIVO DE LA ATENCIÓN
  y = drawSectionTitle('MOTIVO DE LA ATENCIÓN', y);
  y += 2;
  
  let xPos = margin;
  const motivos = [
    { value: 'traslado_programado', label: 'Traslado Programado' },
    { value: 'enfermedad', label: 'Enfermedad' },
    { value: 'traumatismo', label: 'Traumatismo' },
    { value: 'gineco', label: 'Ginecoobstétrico' }
  ];
  motivos.forEach(m => {
    xPos += drawCheckbox(m.label, frap.motivo_atencion === m.value, xPos, y);
  });
  y += 6;
  
  // EVALUACIÓN INICIAL
  y = drawSectionTitle('EVALUACIÓN INICIAL', y);
  y += 3;
  
  // Nivel de conciencia
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Nivel Conciencia:', margin, y);
  xPos = margin + 28;
  const conciencias = [
    { value: 'consciente', label: 'Consciente' },
    { value: 'resp_verbal', label: 'Resp. Verbal' },
    { value: 'resp_dolor', label: 'Resp. Dolor' },
    { value: 'inconsciente', label: 'Inconsciente' }
  ];
  conciencias.forEach(c => {
    xPos += drawCheckbox(c.label, frap.nivel_conciencia === c.value, xPos, y);
  });
  y += 5;
  
  // Vía Aérea
  doc.setFont('helvetica', 'bold');
  doc.text('Vía Aérea:', margin, y);
  xPos = margin + 20;
  const vias = [
    { value: 'permeable', label: 'Permeable' },
    { value: 'ausente', label: 'Ausente' },
    { value: 'comprometida', label: 'Comprometida' }
  ];
  vias.forEach(v => {
    xPos += drawCheckbox(v.label, frap.via_aerea === v.value, xPos, y);
  });
  y += 5;
  
  // Ventilación
  doc.setFont('helvetica', 'bold');
  doc.text('Ventilación:', margin, y);
  xPos = margin + 22;
  const ventilaciones = [
    { value: 'automatismo_regular', label: 'Aut. Regular' },
    { value: 'automatismo_irregular', label: 'Aut. Irregular' },
    { value: 'rapida', label: 'Rápida' },
    { value: 'superficial', label: 'Superficial' },
    { value: 'apnea', label: 'Apnea' }
  ];
  ventilaciones.forEach(v => {
    xPos += drawCheckbox(v.label, frap.ventilacion === v.value, xPos, y);
  });
  y += 5;
  
  // Auscultación
  doc.setFont('helvetica', 'bold');
  doc.text('Auscultación:', margin, y);
  xPos = margin + 25;
  const auscultaciones = [
    { value: 'normales', label: 'Normales' },
    { value: 'disminuidos', label: 'Disminuidos' },
    { value: 'ausentes', label: 'Ausentes' }
  ];
  auscultaciones.forEach(a => {
    xPos += drawCheckbox(a.label, frap.auscultacion === a.value, xPos, y);
  });
  y += 5;
  
  // Pulsos
  doc.setFont('helvetica', 'bold');
  doc.text('Pulsos:', margin, y);
  xPos = margin + 15;
  const pulsos = [
    { value: 'carotideo', label: 'Carotídeo' },
    { value: 'radial', label: 'Radial' },
    { value: 'paro', label: 'Paro Cardiorespiratorio' }
  ];
  pulsos.forEach(p => {
    xPos += drawCheckbox(p.label, frap.presencia_pulsos === p.value, xPos, y);
  });
  
  // Calidad pulso (misma línea)
  doc.setFont('helvetica', 'bold');
  doc.text('Calidad:', xPos + 5, y);
  xPos += 20;
  const calidades = [
    { value: 'ritmico', label: 'Rítmico' },
    { value: 'arritmico', label: 'Arrítm' }
  ];
  calidades.forEach(c => {
    xPos += drawCheckbox(c.label, frap.calidad_pulso === c.value, xPos, y);
  });
  y += 5;
  
  // Piel
  doc.setFont('helvetica', 'bold');
  doc.text('Piel:', margin, y);
  xPos = margin + 12;
  const pieles = [
    { value: 'normal', label: 'Normal' },
    { value: 'palida', label: 'Pálida' },
    { value: 'caliente', label: 'Caliente' },
    { value: 'fria', label: 'Fría' },
    { value: 'cianotica', label: 'Cianótica' },
    { value: 'diaforesis', label: 'Diaforesis' }
  ];
  pieles.forEach(p => {
    xPos += drawCheckbox(p.label, frap.piel === p.value, xPos, y);
  });
  y += 8;
  
  // DATOS DEL PACIENTE
  y = drawSectionTitle('DATOS DEL PACIENTE', y);
  y += 2;
  
  const col1 = margin;
  const col2 = margin + (contentWidth / 2);
  
  y = drawField('Nombre', frap.nombre_paciente, col1, y, contentWidth / 2);
  drawField('Sexo', frap.sexo === 'masculino' ? 'M' : frap.sexo === 'femenino' ? 'F' : '', col2, y - 5, contentWidth / 2);
  
  y = drawField('Edad', frap.edad_anos ? `${frap.edad_anos} años ${frap.edad_meses ? frap.edad_meses + ' meses' : ''}` : '', col1, y, contentWidth / 2);
  drawField('Ocupación', frap.ocupacion, col2, y - 5, contentWidth / 2);
  
  y = drawField('Domicilio', frap.domicilio, col1, y, contentWidth);
  
  y = drawField('Colonia', frap.colonia_paciente, col1, y, contentWidth / 2);
  drawField('Delegación', frap.delegacion_paciente, col2, y - 5, contentWidth / 2);
  
  y = drawField('Teléfono', frap.telefono, col1, y, contentWidth / 2);
  drawField('Acompañante', frap.nombre_acompanante, col2, y - 5, contentWidth / 2);
  
  y = drawField('Derechohabiente', frap.derechohabiente, col1, y, contentWidth / 2);
  drawField('Compañía de Seguros', frap.compania_seguros, col2, y - 5, contentWidth / 2);
  y += 3;
  
  // UBICACIÓN DEL SERVICIO
  y = drawSectionTitle('UBICACIÓN DEL SERVICIO', y);
  y += 2;
  
  y = drawField('Calle', frap.ubicacion_calle, col1, y, contentWidth / 2);
  drawField('Entre', frap.ubicacion_entre, col2, y - 5, contentWidth / 2);
  
  y = drawField('Colonia', frap.ubicacion_colonia, col1, y, contentWidth / 2);
  drawField('Delegación', frap.ubicacion_delegacion, col2, y - 5, contentWidth / 2);
  
  y = drawField('Lugar', frap.lugar_ocurrencia?.replace(/_/g, ' ') || '', col1, y, contentWidth / 2);
  drawField('Operador', frap.operador, col2, y - 5, contentWidth / 2);
  
  y = drawField('Prestadores', frap.prestadores_servicio, col1, y, contentWidth);
  y += 3;
  
  // SIGNOS VITALES
  y = drawSectionTitle('SIGNOS VITALES', y);
  
  const vitalesData = (frap.vitales || []).filter(v => v && v.hora).map(v => [
    v.hora || '',
    v.fr || '',
    v.fc || '',
    v.tas || '',
    v.tad || '',
    v.sao2 || '',
    v.temp || '',
    v.gluc || ''
  ]);
  
  if (vitalesData.length === 0) {
    vitalesData.push(['', '', '', '', '', '', '', '']);
  }
  
  doc.autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [['HORA', 'FR', 'FC', 'TAS', 'TAD', 'SaO2', 'TEMP', 'GLUC']],
    body: vitalesData,
    styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
    headStyles: { fillColor: headerBlue, textColor: [255, 255, 255], fontStyle: 'bold' },
    theme: 'grid'
  });
  
  y = doc.lastAutoTable.finalY + 5;
  
  // CONDICIÓN Y PRIORIDAD
  y = drawSectionTitle('CONDICIÓN Y PRIORIDAD', y);
  y += 3;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Condición:', margin, y);
  xPos = margin + 20;
  const condiciones = [
    { value: 'critico_inestable', label: 'Crítico Inestable' },
    { value: 'critico_estable', label: 'Crítico Estable' },
    { value: 'no_critico', label: 'No Crítico' }
  ];
  condiciones.forEach(c => {
    xPos += drawCheckbox(c.label, frap.condicion_paciente === c.value, xPos, y);
  });
  y += 5;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Prioridad:', margin, y);
  xPos = margin + 20;
  
  // Prioridades con colores
  const prioridades = [
    { value: 'rojo', label: 'ROJO', color: [220, 53, 69] },
    { value: 'amarillo', label: 'AMARILLO', color: [255, 193, 7] },
    { value: 'verde', label: 'VERDE', color: [40, 167, 69] },
    { value: 'negro', label: 'NEGRO', color: [0, 0, 0] }
  ];
  
  prioridades.forEach(p => {
    doc.setDrawColor(...textGray);
    doc.rect(xPos, y - 3, 3, 3);
    if (frap.prioridad === p.value) {
      doc.setFillColor(...p.color);
      doc.rect(xPos + 0.5, y - 2.5, 2, 2, 'F');
    }
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...p.color);
    doc.text(p.label, xPos + 5, y);
    xPos += doc.getTextWidth(p.label) + 12;
  });
  doc.setTextColor(...textGray);
  
  drawFooter(1, 2);
  
  // ============ PÁGINA 2 ============
  doc.addPage();
  y = drawHeader(2, 2);
  
  // INTERROGATORIO (SAMPLE)
  y = drawSectionTitle('INTERROGATORIO (SAMPLE)', y);
  y += 2;
  
  y = drawField('Alergias', frap.alergias || 'NO', col1, y, contentWidth);
  y = drawField('Medicamentos', frap.medicamentos || 'NO', col1, y, contentWidth);
  y = drawField('Enfermedades/Cirugías Previas', frap.enfermedades_previas || 'NO', col1, y, contentWidth);
  y = drawField('Última Comida', frap.ultima_comida, col1, y, contentWidth / 2);
  y = drawField('Eventos Previos', frap.eventos_previos || 'NO', col1, y, contentWidth);
  y += 3;
  
  // OBSERVACIONES
  y = drawSectionTitle('OBSERVACIONES', y);
  y += 2;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textGray);
  const observaciones = frap.observaciones || '';
  const splitObs = doc.splitTextToSize(observaciones, contentWidth);
  doc.text(splitObs, margin, y);
  y += Math.max(splitObs.length * 4, 15);
  
  // ESCALAS DE EVALUACIÓN
  y = drawSectionTitle('ESCALAS DE EVALUACIÓN', y);
  
  // Glasgow
  const glasgowData = [
    ['Apertura Ocular', frap.glasgow_ocular || ''],
    ['Resp. Verbal', frap.glasgow_verbal || ''],
    ['Resp. Motora', frap.glasgow_motor || ''],
    ['TOTAL', frap.glasgow_total || '']
  ];
  
  // Cincinnati
  const cincinnatiData = [
    ['Asimetría Facial', frap.asimetria_facial === 'si' ? 'SÍ' : frap.asimetria_facial === 'no' ? 'NO' : ''],
    ['Paresia Brazos', frap.paresia_brazos === 'si' ? 'SÍ' : frap.paresia_brazos === 'no' ? 'NO' : ''],
    ['Alt. Lenguaje', frap.alteracion_lenguaje === 'si' ? 'SÍ' : frap.alteracion_lenguaje === 'no' ? 'NO' : '']
  ];
  
  // Trauma
  const traumaData = [
    ['GCS', frap.trauma_gcs || ''],
    ['PAS', frap.trauma_pas || ''],
    ['FR', frap.trauma_fr || ''],
    ['Esf.', frap.trauma_esfuerzo || ''],
    ['Llen. Cap', frap.trauma_llenado || ''],
    ['TOTAL', frap.trauma_total || '']
  ];
  
  const tableStartY = y;
  
  doc.autoTable({
    startY: y,
    margin: { left: margin },
    head: [['ESCALA GLASGOW', '']],
    body: glasgowData,
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: headerBlue, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 15 } },
    theme: 'grid',
    tableWidth: 45
  });
  
  doc.autoTable({
    startY: tableStartY,
    margin: { left: margin + 50 },
    head: [['ESCALA CINCINNATI', '']],
    body: cincinnatiData,
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: headerBlue, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 15 } },
    theme: 'grid',
    tableWidth: 45
  });
  
  doc.autoTable({
    startY: tableStartY,
    margin: { left: margin + 100 },
    head: [['ESCALA TRAUMA', '']],
    body: traumaData,
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: headerBlue, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 15 } },
    theme: 'grid',
    tableWidth: 40
  });
  
  y = Math.max(doc.lastAutoTable.finalY, tableStartY + 30) + 5;
  
  // MANEJO REALIZADO
  y = drawSectionTitle('MANEJO REALIZADO', y);
  y += 3;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Vía Aérea:', margin, y);
  xPos = margin + 20;
  const manejos = [
    { value: 'aspiracion', label: 'Aspiración' },
    { value: 'balon_valvula', label: 'Balón-Válvula' },
    { value: 'mascarilla', label: 'Mascarilla' },
    { value: 'canula_oro', label: 'Cánula Oro' },
    { value: 'canula_naso', label: 'Cánula Naso' }
  ];
  manejos.forEach(m => {
    xPos += drawCheckbox(m.label, (frap.via_aerea_manejo || []).includes(m.value), xPos, y);
  });
  y += 5;
  
  doc.setFont('helvetica', 'bold');
  doc.text('O2 Terapia:', margin, y);
  xPos = margin + 22;
  const oxigenos = [
    { value: 'puntas_nasales', label: 'Puntas Nasales' },
    { value: 'mascarilla_simple', label: 'Mascarilla Simple' },
    { value: 'mascarilla_reservorio', label: 'Mascarilla c/ Reservorio' }
  ];
  oxigenos.forEach(o => {
    xPos += drawCheckbox(o.label, frap.oxigenoterapia === o.value, xPos, y);
  });
  doc.text(`LTS/MIN: ${frap.lts_x_min || ''}`, xPos + 5, y);
  y += 5;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Control Hemorragias:', margin, y);
  xPos = margin + 38;
  const hemorragias = [
    { value: 'presion_directa', label: 'Presión Directa' },
    { value: 'torniquete', label: 'Torniquete' },
    { value: 'vendaje', label: 'Vendaje' }
  ];
  hemorragias.forEach(h => {
    xPos += drawCheckbox(h.label, (frap.control_hemorragias || []).includes(h.value), xPos, y);
  });
  y += 8;
  
  // CONSENTIMIENTO Y FIRMAS
  y = drawSectionTitle('CONSENTIMIENTO INFORMADO', y);
  y += 3;
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const consentimientoText = 'Por este medio autorizo al personal de Cuerpo de Rescate de Ensenada, A.C. para que se me brinde la atención prehospitalaria necesaria, así como mi traslado al nosocomio más cercano o adecuado según mi patología.';
  const splitConsent = doc.splitTextToSize(consentimientoText, contentWidth);
  doc.text(splitConsent, margin, y);
  y += splitConsent.length * 3 + 5;
  
  // Estado de firmas
  const firmaWidth = contentWidth / 3;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Paciente/Familiar:', margin, y);
  doc.text('Testigo:', margin + firmaWidth, y);
  doc.text('Médico que Recibe:', margin + firmaWidth * 2, y);
  y += 3;
  
  // Dibujar líneas para firmas
  doc.setDrawColor(...textGray);
  doc.line(margin, y + 15, margin + firmaWidth - 10, y + 15);
  doc.line(margin + firmaWidth, y + 15, margin + firmaWidth * 2 - 10, y + 15);
  doc.line(margin + firmaWidth * 2, y + 15, pageWidth - margin, y + 15);
  
  // Si hay firmas, mostrar estado
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  if (frap.firmas?.paciente) {
    doc.text('[Firmado]', margin, y + 10);
  }
  if (frap.firmas?.testigo) {
    doc.text('[Firmado]', margin + firmaWidth, y + 10);
  }
  if (frap.firmas?.medico_recibe) {
    doc.text('[Firmado]', margin + firmaWidth * 2, y + 10);
  }
  
  y += 25;
  
  // NEGATIVA (si aplica)
  if (frap.negativa_atencion) {
    y = drawSectionTitle('NEGATIVA A RECIBIR ATENCIÓN / SER TRASLADADO', y);
    y += 3;
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    const negativaText = 'Declaro que he sido informado sobre mi estado de salud y los riesgos de no recibir atención médica. Por decisión propia, libre y voluntaria, niego mi consentimiento para recibir atención y/o ser trasladado.';
    const splitNegativa = doc.splitTextToSize(negativaText, contentWidth);
    doc.text(splitNegativa, margin, y);
  }
  
  // Autoridades
  y += 15;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Autoridades que intervinieron:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(frap.autoridades_intervinieron || '', margin + 55, y);
  
  // Información de creación
  y += 10;
  doc.setFontSize(7);
  doc.setTextColor(128, 128, 128);
  doc.text(`Creado por: ${frap.created_by_name || ''} | Fecha de creación: ${frap.created_at ? new Date(frap.created_at).toLocaleString('es-MX') : ''}`, margin, y);
  
  drawFooter(2, 2);
  
  // Guardar
  doc.save(`FRAP_${frap.folio || 'SinFolio'}.pdf`);
};
