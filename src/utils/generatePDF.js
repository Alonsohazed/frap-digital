import jsPDF from 'jspdf';
import 'jspdf-autotable';

// ─── Colores corporativos ───────────────────────────────────────────
const NAVY      = [0, 40, 85];
const DARK_NAVY = [0, 28, 60];
const GOLD      = [194, 160, 86];
const WHITE     = [255, 255, 255];
const TEXT_DARK  = [33, 37, 41];
const TEXT_MED   = [80, 80, 80];
const LIGHT_BG   = [245, 247, 250];
const BORDER     = [200, 210, 220];
const RED_ACCENT = [200, 40, 40];
const GREEN_ACCENT = [30, 120, 60];

export const generateFRAPPDF = async (frap) => {
  const doc = new jsPDF('p', 'mm', 'letter');
  const pw  = doc.internal.pageSize.getWidth();
  const ph  = doc.internal.pageSize.getHeight();
  const mx  = 12;
  const cw  = pw - mx * 2;
  const FOOTER_ZONE = 18; // reservar espacio para pie de pagina
  const USABLE_BOTTOM = ph - FOOTER_ZONE;

  // ── Intentar cargar logo ──────────────────────────────────────────
  let logoBase64 = null;
  try {
    const response = await fetch('/logo.png');
    if (response.ok) {
      const blob = await response.blob();
      logoBase64 = await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }
  } catch { /* sin logo */ }

  let currentPage = 1;

  // ================================================================
  // HELPERS
  // ================================================================

  const drawHeader = () => {
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, pw, 38, 'F');
    doc.setFillColor(...GOLD);
    doc.rect(0, 38, pw, 1.2, 'F');

    if (logoBase64) {
      doc.setFillColor(...WHITE);
      doc.circle(mx + 12, 19, 13, 'F');
      doc.addImage(logoBase64, 'PNG', mx + 1, 7, 22, 22);
    }

    const textX = logoBase64 ? mx + 28 : mx + 4;

    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text('CUERPO DE RESCATE DE ENSENADA, A.C.', textX, 14);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 210, 230);
    doc.text('Por la Seguridad de Ensenada  \u2022  Fundado en 1978', textX, 19.5);
    doc.text('Calle Magnolias No. 2356, Col. M\u00e1rquez de Le\u00f3n, Ensenada, B.C.', textX, 24.5);

    const boxW = 45;
    const boxX = pw - mx - boxW;
    doc.setFillColor(...DARK_NAVY);
    doc.roundedRect(boxX, 6, boxW, 26, 3, 3, 'F');

    doc.setFontSize(8);
    doc.setTextColor(...GOLD);
    doc.setFont('helvetica', 'bold');
    doc.text('FOLIO', boxX + boxW / 2, 12, { align: 'center' });

    doc.setFontSize(18);
    doc.setTextColor(...WHITE);
    doc.text(`#${frap.folio || 'S/N'}`, boxX + boxW / 2, 21, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(200, 210, 230);
    doc.setFont('helvetica', 'normal');
    doc.text(frap.fecha || '', boxX + boxW / 2, 28, { align: 'center' });

    return 43;
  };

  const drawFooter = (pageNum) => {
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(mx, ph - 14, pw - mx, ph - 14);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_MED);
    doc.text('FRAP \u2013 Formulario de Rescate y Atenci\u00f3n Prehospitalaria', mx, ph - 9);
    doc.text(`P\u00e1gina ${pageNum}`, pw - mx, ph - 9, { align: 'right' });

    doc.setFontSize(6);
    doc.setTextColor(160, 160, 160);
    doc.text('Documento generado electr\u00f3nicamente  \u2022  Cuerpo de Rescate de Ensenada, A.C.', pw / 2, ph - 5, { align: 'center' });
  };

  /** Check if we need a new page. If so, draw footer, add page, draw header. */
  const ensureSpace = (y, needed) => {
    if (y + needed > USABLE_BOTTOM) {
      drawFooter(currentPage);
      doc.addPage();
      currentPage++;
      return drawHeader();
    }
    return y;
  };

  const sectionTitle = (title, y) => {
    y = ensureSpace(y, 10);
    doc.setFillColor(...NAVY);
    doc.roundedRect(mx, y, cw, 7, 1, 1, 'F');
    doc.setFillColor(...GOLD);
    doc.rect(mx, y, 2, 7, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(title.toUpperCase(), mx + 5, y + 5);
    return y + 9;
  };

  const subSection = (title, y) => {
    y = ensureSpace(y, 14);
    doc.setFillColor(...LIGHT_BG);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(mx, y, cw, 6, 0.5, 0.5, 'FD');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NAVY);
    doc.text(title, mx + 3, y + 4.2);
    return y + 8;
  };

  const field = (label, value, x, y, maxWidth) => {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...TEXT_MED);
    doc.text(label + ':', x, y);
    const lw = doc.getTextWidth(label + ': ');
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    const val = String(value || '\u2014');
    if (maxWidth) {
      const lines = doc.splitTextToSize(val, maxWidth - lw);
      doc.text(lines, x + lw, y);
      return y + (lines.length * 3.8);
    }
    doc.text(val, x + lw, y);
    return y + 4.5;
  };

  const checkbox = (label, checked, x, y) => {
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.rect(x, y - 2.8, 3, 3);
    if (checked) {
      doc.setFillColor(...NAVY);
      doc.rect(x + 0.4, y - 2.4, 2.2, 2.2, 'F');
      doc.setDrawColor(...WHITE);
      doc.setLineWidth(0.4);
      doc.line(x + 0.8, y - 1.2, x + 1.4, y - 0.5);
      doc.line(x + 1.4, y - 0.5, x + 2.3, y - 2);
    }
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    doc.text(label, x + 4.5, y);
    return doc.getTextWidth(label) + 9;
  };

  // ================================================================
  // CONTENIDO
  // ================================================================
  let y = drawHeader();
  let xPos;
  const col1 = mx;
  const col2 = mx + cw / 2 + 2;
  const halfW = cw / 2 - 2;

  // ── TIEMPOS DEL SERVICIO ──
  y = sectionTitle('Tiempos del Servicio', y);

  doc.autoTable({
    startY: y,
    margin: { left: mx, right: mx },
    head: [['Hora Llamada', 'Hora Salida', 'Hora Llegada', 'Hora Hospital', 'Hora Base']],
    body: [[
      frap.hora_llamada || '\u2014',
      frap.hora_salida || '\u2014',
      frap.hora_llegada_traslado || '\u2014',
      frap.hora_llegada_hospital || '\u2014',
      frap.hora_llegada_base || '\u2014'
    ]],
    styles: {
      fontSize: 8, cellPadding: { top: 2.5, bottom: 2.5, left: 2, right: 2 },
      halign: 'center', textColor: TEXT_DARK, lineColor: BORDER, lineWidth: 0.3
    },
    headStyles: { fillColor: DARK_NAVY, textColor: WHITE, fontStyle: 'bold', fontSize: 7.5 },
    alternateRowStyles: { fillColor: LIGHT_BG },
    theme: 'grid'
  });
  y = doc.lastAutoTable.finalY + 4;

  // ── MOTIVO DE LA ATENCIÓN ──
  y = sectionTitle('Motivo de la Atenci\u00f3n', y);
  y += 1;
  xPos = mx + 2;
  [
    { value: 'traslado_programado', label: 'Traslado Programado' },
    { value: 'enfermedad', label: 'Enfermedad' },
    { value: 'traumatismo', label: 'Traumatismo' },
    { value: 'gineco', label: 'Ginecobst\u00e9trico' }
  ].forEach(m => { xPos += checkbox(m.label, frap.motivo_atencion === m.value, xPos, y); });
  y += 5;

  // ── EVALUACI\u00d3N INICIAL ──
  y = sectionTitle('Evaluaci\u00f3n Inicial', y);

  y = subSection('Nivel de Conciencia', y);
  xPos = mx + 2;
  [
    { value: 'consciente', label: 'Consciente' },
    { value: 'resp_verbal', label: 'Resp. Verbal' },
    { value: 'resp_dolor', label: 'Resp. Dolor' },
    { value: 'inconsciente', label: 'Inconsciente' }
  ].forEach(c => { xPos += checkbox(c.label, frap.nivel_conciencia === c.value, xPos, y); });
  y += 5;

  y = subSection('V\u00eda A\u00e9rea', y);
  xPos = mx + 2;
  [
    { value: 'permeable', label: 'Permeable' },
    { value: 'ausente', label: 'Ausente' },
    { value: 'comprometida', label: 'Comprometida' }
  ].forEach(v => { xPos += checkbox(v.label, frap.via_aerea === v.value, xPos, y); });
  xPos += 8;
  doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(...TEXT_MED);
  doc.text('Reflejo Degluci\u00f3n:', xPos, y);
  xPos += 26;
  xPos += checkbox('Presente', frap.reflejo_deglucion === 'presente', xPos, y);
  xPos += checkbox('Ausente', frap.reflejo_deglucion === 'ausente', xPos, y);
  y += 5;

  y = subSection('Ventilaci\u00f3n', y);
  xPos = mx + 2;
  [
    { value: 'automatismo_regular', label: 'Aut. Regular' },
    { value: 'automatismo_irregular', label: 'Aut. Irregular' },
    { value: 'rapida', label: 'R\u00e1pida' },
    { value: 'superficial', label: 'Superficial' },
    { value: 'apnea', label: 'Apnea' }
  ].forEach(v => { xPos += checkbox(v.label, frap.ventilacion === v.value, xPos, y); });
  y += 5;

  y = subSection('Auscultaci\u00f3n', y);
  xPos = mx + 2;
  [
    { value: 'normales', label: 'Ruidos Normales' },
    { value: 'disminuidos', label: 'Disminuidos' },
    { value: 'ausentes', label: 'Ausentes' }
  ].forEach(a => { xPos += checkbox(a.label, frap.auscultacion === a.value, xPos, y); });
  y += 5;

  y = subSection('Pulsos y Circulaci\u00f3n', y);
  xPos = mx + 2;
  [
    { value: 'carotideo', label: 'Carot\u00eddeo' },
    { value: 'radial', label: 'Radial' },
    { value: 'paro', label: 'Paro Cardiorespiratorio' }
  ].forEach(p => { xPos += checkbox(p.label, frap.presencia_pulsos === p.value, xPos, y); });
  xPos += 6;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...TEXT_MED);
  doc.text('Calidad:', xPos, y);
  xPos += 14;
  [
    { value: 'rapido', label: 'R\u00e1pido' },
    { value: 'lento', label: 'Lento' },
    { value: 'ritmico', label: 'R\u00edtmico' },
    { value: 'arritmico', label: 'Arr\u00edtmico' }
  ].forEach(c => { xPos += checkbox(c.label, frap.calidad_pulso === c.value, xPos, y); });
  y += 5;

  y = subSection('Piel', y);
  xPos = mx + 2;
  [
    { value: 'normal', label: 'Normal' },
    { value: 'palida', label: 'P\u00e1lida' },
    { value: 'caliente', label: 'Caliente' },
    { value: 'fria', label: 'Fr\u00eda' },
    { value: 'cianotica', label: 'Cian\u00f3tica' },
    { value: 'diaforesis', label: 'Diaforesis' }
  ].forEach(p => { xPos += checkbox(p.label, frap.piel === p.value, xPos, y); });
  y += 6;

  // ── DATOS DEL PACIENTE ──
  y = sectionTitle('Datos del Paciente', y);
  y += 1;

  y = field('Nombre', frap.nombre_paciente, col1, y);
  const yBefore = y;
  field('Sexo', frap.sexo === 'masculino' ? 'Masculino' : frap.sexo === 'femenino' ? 'Femenino' : '', col2, yBefore - 4.5);

  y = field('Edad', frap.edad_anos ? `${frap.edad_anos} a\u00f1os ${frap.edad_meses ? frap.edad_meses + ' meses' : ''}` : '', col1, y);
  field('Ocupaci\u00f3n', frap.ocupacion, col2, y - 4.5);

  y = field('Domicilio', frap.domicilio, col1, y, cw);

  y = field('Colonia', frap.colonia_paciente, col1, y);
  field('Delegaci\u00f3n', frap.delegacion_paciente, col2, y - 4.5);

  y = field('Tel\u00e9fono', frap.telefono, col1, y);
  field('Acompa\u00f1ante', frap.nombre_acompanante, col2, y - 4.5);

  y = field('Derechohabiente', frap.derechohabiente, col1, y);
  field('Compa\u00f1\u00eda de Seguros', frap.compania_seguros, col2, y - 4.5);
  y += 2;

  // ── UBICACI\u00d3N DEL SERVICIO ──
  y = sectionTitle('Ubicaci\u00f3n del Servicio', y);
  y += 1;

  y = field('Calle', frap.ubicacion_calle, col1, y);
  field('Entre', frap.ubicacion_entre, col2, y - 4.5);

  y = field('Colonia', frap.ubicacion_colonia, col1, y);
  field('Delegaci\u00f3n', frap.ubicacion_delegacion, col2, y - 4.5);

  y = field('Lugar', (frap.lugar_ocurrencia || '').replace(/_/g, ' '), col1, y);
  field('Operador', frap.operador, col2, y - 4.5);

  y = field('Prestadores', frap.prestadores_servicio, col1, y, cw);
  y += 2;

  // ── SIGNOS VITALES ──
  y = sectionTitle('Signos Vitales', y);

  const vitalesData = (frap.vitales || []).filter(v => v && v.hora).map(v => [
    v.hora || '', v.fr || '', v.fc || '', v.tas || '', v.tad || '',
    v.sao2 || '', v.temp || '', v.gluc || ''
  ]);
  if (vitalesData.length === 0) vitalesData.push(['\u2014','\u2014','\u2014','\u2014','\u2014','\u2014','\u2014','\u2014']);

  doc.autoTable({
    startY: y,
    margin: { left: mx, right: mx },
    head: [['HORA', 'FR', 'FC', 'TAS', 'TAD', 'SaO2', 'TEMP', 'GLUC']],
    body: vitalesData,
    styles: {
      fontSize: 7.5, cellPadding: { top: 2, bottom: 2, left: 1.5, right: 1.5 },
      halign: 'center', textColor: TEXT_DARK, lineColor: BORDER, lineWidth: 0.3
    },
    headStyles: { fillColor: DARK_NAVY, textColor: WHITE, fontStyle: 'bold', fontSize: 7 },
    alternateRowStyles: { fillColor: LIGHT_BG },
    theme: 'grid'
  });
  y = doc.lastAutoTable.finalY + 4;

  // ── CONDICI\u00d3N Y PRIORIDAD ──
  y = sectionTitle('Condici\u00f3n y Prioridad', y);
  y += 1;

  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...TEXT_MED);
  doc.text('Condici\u00f3n:', mx + 2, y);
  xPos = mx + 22;
  [
    { value: 'critico_inestable', label: 'Cr\u00edtico Inestable' },
    { value: 'critico_estable', label: 'Cr\u00edtico Estable' },
    { value: 'no_critico', label: 'No Cr\u00edtico' }
  ].forEach(c => { xPos += checkbox(c.label, frap.condicion_paciente === c.value, xPos, y); });
  y += 5.5;

  doc.setFont('helvetica', 'bold'); doc.setTextColor(...TEXT_MED);
  doc.text('Prioridad:', mx + 2, y);
  xPos = mx + 22;
  [
    { value: 'rojo', label: 'ROJO', bg: [220, 53, 69], text: WHITE },
    { value: 'amarillo', label: 'AMARILLO', bg: [255, 193, 7], text: [33, 37, 41] },
    { value: 'verde', label: 'VERDE', bg: [40, 167, 69], text: WHITE },
    { value: 'negro', label: 'NEGRO', bg: [33, 33, 33], text: WHITE }
  ].forEach(p => {
    const isSelected = frap.prioridad === p.value;
    const tagW = doc.getTextWidth(p.label) + 8;
    if (isSelected) {
      doc.setFillColor(...p.bg);
      doc.roundedRect(xPos, y - 3.5, tagW, 5.5, 1.5, 1.5, 'F');
      doc.setTextColor(...p.text);
    } else {
      doc.setDrawColor(...p.bg);
      doc.setLineWidth(0.4);
      doc.roundedRect(xPos, y - 3.5, tagW, 5.5, 1.5, 1.5, 'S');
      doc.setTextColor(...p.bg);
    }
    doc.setFontSize(7); doc.setFont('helvetica', 'bold');
    doc.text(p.label, xPos + tagW / 2, y + 0.5, { align: 'center' });
    xPos += tagW + 4;
  });
  y += 6;

  // ── INTERROGATORIO (SAMPLE) ──
  y = sectionTitle('Interrogatorio (SAMPLE)', y);
  y += 1;

  y = field('Alergias', frap.alergias || 'Ninguna conocida', col1, y, cw);
  y = field('Medicamentos', frap.medicamentos || 'Ninguno', col1, y, cw);
  y = field('Enfermedades/Cirug\u00edas Previas', frap.enfermedades_previas || 'Ninguna', col1, y, cw);
  y = field('\u00daltima Comida', frap.ultima_comida || '\u2014', col1, y, halfW);
  y = field('Eventos Previos', frap.eventos_previos || '\u2014', col1, y, cw);
  y += 2;

  // ── OBSERVACIONES ──
  y = sectionTitle('Observaciones', y);
  y += 1;

  const obsText = frap.observaciones || 'Sin observaciones';
  doc.setFontSize(8); doc.setFont('helvetica', 'normal');
  const splitObs = doc.splitTextToSize(obsText, cw - 8);
  const obsH = Math.max(splitObs.length * 4 + 6, 14);
  y = ensureSpace(y, obsH + 4);
  doc.setFillColor(...LIGHT_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(mx, y, cw, obsH, 1, 1, 'FD');
  doc.setTextColor(...TEXT_DARK);
  doc.text(splitObs, mx + 4, y + 5);
  y += obsH + 3;

  // ── ESCALAS DE EVALUACI\u00d3N ──
  y = sectionTitle('Escalas de Evaluaci\u00f3n', y);
  y = ensureSpace(y, 40);

  const tableStartY = y;

  doc.autoTable({
    startY: y,
    margin: { left: mx },
    head: [['ESCALA GLASGOW', '']],
    body: [
      ['Apertura Ocular', frap.glasgow_ocular || '\u2014'],
      ['Resp. Verbal', frap.glasgow_verbal || '\u2014'],
      ['Resp. Motora', frap.glasgow_motor || '\u2014'],
      ['TOTAL', frap.glasgow_total || '\u2014']
    ],
    styles: { fontSize: 7, cellPadding: 1.8, textColor: TEXT_DARK, lineColor: BORDER, lineWidth: 0.3 },
    headStyles: { fillColor: DARK_NAVY, textColor: WHITE, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: LIGHT_BG },
    columnStyles: { 0: { cellWidth: 28, fontStyle: 'bold' }, 1: { cellWidth: 14, halign: 'center' } },
    theme: 'grid',
    tableWidth: 42
  });

  doc.autoTable({
    startY: tableStartY,
    margin: { left: mx + 47 },
    head: [['ESCALA CINCINNATI', '']],
    body: [
      ['Asimetr\u00eda Facial', frap.asimetria_facial === 'si' ? 'S\u00cd' : frap.asimetria_facial === 'no' ? 'NO' : '\u2014'],
      ['Paresia Brazos', frap.paresia_brazos === 'si' ? 'S\u00cd' : frap.paresia_brazos === 'no' ? 'NO' : '\u2014'],
      ['Alt. Lenguaje', frap.alteracion_lenguaje === 'si' ? 'S\u00cd' : frap.alteracion_lenguaje === 'no' ? 'NO' : '\u2014']
    ],
    styles: { fontSize: 7, cellPadding: 1.8, textColor: TEXT_DARK, lineColor: BORDER, lineWidth: 0.3 },
    headStyles: { fillColor: DARK_NAVY, textColor: WHITE, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: LIGHT_BG },
    columnStyles: { 0: { cellWidth: 28, fontStyle: 'bold' }, 1: { cellWidth: 14, halign: 'center' } },
    theme: 'grid',
    tableWidth: 42
  });

  doc.autoTable({
    startY: tableStartY,
    margin: { left: mx + 94 },
    head: [['ESCALA TRAUMA', '']],
    body: [
      ['GCS', frap.trauma_gcs || '\u2014'],
      ['PAS', frap.trauma_pas || '\u2014'],
      ['FR', frap.trauma_fr || '\u2014'],
      ['Esfuerzo', frap.trauma_esfuerzo || '\u2014'],
      ['Llen. Capilar', frap.trauma_llenado || '\u2014'],
      ['TOTAL', frap.trauma_total || '\u2014']
    ],
    styles: { fontSize: 7, cellPadding: 1.8, textColor: TEXT_DARK, lineColor: BORDER, lineWidth: 0.3 },
    headStyles: { fillColor: DARK_NAVY, textColor: WHITE, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: LIGHT_BG },
    columnStyles: { 0: { cellWidth: 25, fontStyle: 'bold' }, 1: { cellWidth: 14, halign: 'center' } },
    theme: 'grid',
    tableWidth: 39
  });

  y = Math.max(doc.lastAutoTable.finalY, tableStartY + 30) + 4;

  // ── MANEJO REALIZADO ──
  y = sectionTitle('Manejo Realizado', y);

  y = subSection('V\u00eda A\u00e9rea', y);
  xPos = mx + 2;
  [
    { value: 'aspiracion', label: 'Aspiraci\u00f3n' },
    { value: 'balon_valvula', label: 'Bal\u00f3n-V\u00e1lvula' },
    { value: 'mascarilla', label: 'Mascarilla' },
    { value: 'canula_oro', label: 'C\u00e1nula Oro' },
    { value: 'canula_naso', label: 'C\u00e1nula Naso' }
  ].forEach(m => { xPos += checkbox(m.label, (frap.via_aerea_manejo || []).includes(m.value), xPos, y); });
  y += 5;

  y = subSection('O\u2082 Terapia', y);
  xPos = mx + 2;
  [
    { value: 'puntas_nasales', label: 'Puntas Nasales' },
    { value: 'mascarilla_simple', label: 'Mascarilla Simple' },
    { value: 'mascarilla_reservorio', label: 'Mascarilla c/ Reservorio' }
  ].forEach(o => { xPos += checkbox(o.label, frap.oxigenoterapia === o.value, xPos, y); });
  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...NAVY);
  doc.text(`LTS/MIN: ${frap.lts_x_min || '\u2014'}`, xPos + 4, y);
  y += 5;

  y = subSection('Control de Hemorragias', y);
  xPos = mx + 2;
  [
    { value: 'presion_directa', label: 'Presi\u00f3n Directa' },
    { value: 'torniquete', label: 'Torniquete' },
    { value: 'vendaje', label: 'Vendaje Compresivo' }
  ].forEach(h => { xPos += checkbox(h.label, (frap.control_hemorragias || []).includes(h.value), xPos, y); });
  y += 7;

  // ══════════════════════════════════════════════════════════════════
  // CONSENTIMIENTO Y FIRMAS
  // ══════════════════════════════════════════════════════════════════
  y = sectionTitle('Consentimiento y Firmas', y);
  y = ensureSpace(y, 35);

  // Negativa
  doc.setFillColor(255, 245, 245);
  doc.setDrawColor(...RED_ACCENT);
  doc.setLineWidth(0.5);
  doc.roundedRect(mx, y, cw / 2 - 2, 28, 1.5, 1.5, 'FD');

  doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(...RED_ACCENT);
  doc.text('NEGATIVA A RECIBIR ATENCI\u00d3N / SER TRASLADADO', mx + 3, y + 4.5);
  doc.text('EXIMENTE DE RESPONSABILIDAD', mx + 3, y + 8.5);

  doc.setFontSize(5.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...TEXT_MED);
  const negText = 'DECLARO QUE NO ACEPTO LAS RECOMENDACIONES DEL PERSONAL DE LA AMBULANCIA DEL CUERPO DE RESCATE EN CUANTO AL (TRATAMIENTO) Y/O (TRASLADO) A UN HOSPITAL; POR LO QUE EXIMO A EL CUERPO DE RESCATE Y A DICHAS PERSONAS DE TODA RESPONSABILIDAD QUE PUDIERA DERIVAR AL HABER RESPETADO Y CUMPLIDO MI DECISI\u00d3N.';
  const splitNeg = doc.splitTextToSize(negText, cw / 2 - 10);
  doc.text(splitNeg, mx + 3, y + 12);

  if (frap.negativa_atencion) {
    doc.setFillColor(...RED_ACCENT);
    doc.roundedRect(mx + 3, y + 21, 18, 4.5, 1, 1, 'F');
    doc.setFontSize(6); doc.setTextColor(...WHITE); doc.setFont('helvetica', 'bold');
    doc.text('FIRMADA', mx + 12, y + 24, { align: 'center' });
  }

  // Consentimiento
  const conX = mx + cw / 2 + 2;
  doc.setFillColor(245, 255, 248);
  doc.setDrawColor(...GREEN_ACCENT);
  doc.setLineWidth(0.5);
  doc.roundedRect(conX, y, cw / 2 - 2, 28, 1.5, 1.5, 'FD');

  doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(...GREEN_ACCENT);
  doc.text('CONSENTIMIENTO INFORMADO', conX + 3, y + 4.5);

  doc.setFontSize(5.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...TEXT_MED);
  const conText = 'PREVIO A UNA DETALLADA EXPLICACI\u00d3N DOY MI CONSENTIMIENTO A SER TRASLADADO Y/O ATENDIDO POR EL PERSONAL DEL CUERPO DE RESCATE A.C.';
  const splitCon = doc.splitTextToSize(conText, cw / 2 - 10);
  doc.text(splitCon, conX + 3, y + 9);

  if (frap.consentimiento_informado) {
    doc.setFillColor(...GREEN_ACCENT);
    doc.roundedRect(conX + 3, y + 21, 18, 4.5, 1, 1, 'F');
    doc.setFontSize(6); doc.setTextColor(...WHITE); doc.setFont('helvetica', 'bold');
    doc.text('FIRMADO', conX + 12, y + 24, { align: 'center' });
  }

  y += 32;

  // Autoridades
  if (frap.autoridades_intervinieron) {
    y = ensureSpace(y, 12);
    doc.setFillColor(...LIGHT_BG);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(mx, y, cw, 8, 1, 1, 'FD');
    doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(...NAVY);
    doc.text('AUTORIDADES QUE INTERVINIERON:', mx + 3, y + 3.5);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...TEXT_DARK);
    doc.text(frap.autoridades_intervinieron, mx + 55, y + 3.5);
    y += 11;
  } else {
    y += 2;
  }

  // ══════════════════════════════════════════════════════════════════
  //  FIRMAS DIGITALES  —  Secci\u00f3n principal destacada
  // ══════════════════════════════════════════════════════════════════

  // Necesitamos al menos ~100mm para las 5 firmas (2 filas + titulo + info)
  const firmaBoxH = 35;
  const firmaGap = 4;
  const firmasNeeded = 10 + firmaBoxH + 4 + firmaBoxH + 16; // titulo + fila1 + gap + fila2 + info
  y = ensureSpace(y, firmasNeeded);

  // T\u00edtulo de firmas con estilo dorado/navy
  doc.setFillColor(...NAVY);
  doc.roundedRect(mx, y, cw, 8, 1.5, 1.5, 'F');
  // Barra dorada superior decorativa
  doc.setFillColor(...GOLD);
  doc.rect(mx, y, cw, 1.8, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('FIRMAS DIGITALES', pw / 2, y + 6.2, { align: 'center' });
  y += 11;

  // ── Helper para dibujar caja de firma ──
  const drawSignatureBox = (label, signatureData, x, boxY, w, h) => {
    // Fondo de la caja
    doc.setFillColor(252, 252, 255);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, boxY, w, h, 2, 2, 'FD');

    // Borde izquierdo dorado decorativo
    doc.setFillColor(...GOLD);
    doc.rect(x, boxY + 2, 1.5, h - 4, 'F');

    // Etiqueta superior dentro de la caja
    doc.setFillColor(...NAVY);
    const labelH = 6;
    doc.roundedRect(x, boxY, w, labelH, 2, 2, 'F');
    // Parchar parte inferior del label para que no sea redondeada
    doc.rect(x, boxY + 3, w, 3, 'F');

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(label.toUpperCase(), x + w / 2, boxY + 4.3, { align: 'center' });

    // Zona de firma
    const sigAreaY = boxY + labelH + 1;
    const sigAreaH = h - labelH - 2;

    if (signatureData) {
      try {
        // Centrar imagen manteniendo aspecto
        const imgMaxW = w - 10;
        const imgMaxH = sigAreaH - 4;
        doc.addImage(signatureData, 'PNG', x + 5, sigAreaY + 2, imgMaxW, imgMaxH);
      } catch (e) {
        doc.setFontSize(7); doc.setFont('helvetica', 'italic'); doc.setTextColor(...TEXT_MED);
        doc.text('[Firma registrada]', x + w / 2, sigAreaY + sigAreaH / 2, { align: 'center' });
      }
    } else {
      // Linea de firma placeholder
      const lineY = boxY + h - 7;
      doc.setDrawColor(180, 190, 200);
      doc.setLineWidth(0.3);
      doc.line(x + 8, lineY, x + w - 8, lineY);
      doc.setFontSize(6); doc.setFont('helvetica', 'italic'); doc.setTextColor(180, 180, 180);
      doc.text('Sin firma', x + w / 2, lineY + 4, { align: 'center' });
    }
  };

  // Fila 1: Paciente / Testigo / Entrega Paciente (3 columnas)
  const firmaColW = (cw - firmaGap * 2) / 3;
  drawSignatureBox(
    'Nombre/Firma del Paciente',
    frap.firmas?.paciente,
    mx, y, firmaColW, firmaBoxH
  );
  drawSignatureBox(
    'Nombre/Firma del Testigo',
    frap.firmas?.testigo,
    mx + firmaColW + firmaGap, y, firmaColW, firmaBoxH
  );
  drawSignatureBox(
    'Entrega Paciente',
    frap.firmas?.entrega_paciente,
    mx + (firmaColW + firmaGap) * 2, y, firmaColW, firmaBoxH
  );
  y += firmaBoxH + 4;

  // Fila 2: Familiar/Tutor / M\u00e9dico que Recibe (2 columnas, m\u00e1s anchas)
  y = ensureSpace(y, firmaBoxH + 16);
  const firmaCol2W = (cw - firmaGap) / 2;
  drawSignatureBox(
    'Nombre/Firma de Familiar o Tutor',
    frap.firmas?.familiar_tutor,
    mx, y, firmaCol2W, firmaBoxH
  );
  drawSignatureBox(
    'M\u00e9dico que Recibe \u2013 Nombre y Firma',
    frap.firmas?.medico_recibe,
    mx + firmaCol2W + firmaGap, y, firmaCol2W, firmaBoxH
  );
  y += firmaBoxH + 6;

  // ── Informaci\u00f3n de creaci\u00f3n ──
  y = ensureSpace(y, 12);
  doc.setFillColor(...LIGHT_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(mx, y, cw, 8, 1, 1, 'FD');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_MED);
  doc.text(
    `Creado por: ${frap.created_by_name || '\u2014'}  \u2022  Fecha de creaci\u00f3n: ${frap.created_at ? new Date(frap.created_at).toLocaleString('es-MX') : '\u2014'}`,
    pw / 2,
    y + 5,
    { align: 'center' }
  );

  // Draw footer en TODAS las p\u00e1ginas
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i);
  }

  // ── Descargar ──
  doc.save(`FRAP_${frap.folio || 'SinFolio'}.pdf`);
};
