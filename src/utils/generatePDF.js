import jsPDF from 'jspdf';
import 'jspdf-autotable';

// ─── Colores corporativos (Verde/Azul) ───────────────────────────────────────
const DARK_BLUE = [0, 51, 102];
const BLUE = [0, 102, 153];
const GREEN = [0, 128, 0];
const DARK_GREEN = [0, 100, 0];
const WHITE = [255, 255, 255];
const BLACK = [0, 0, 0];
const TEXT_DARK = [33, 37, 41];
const LIGHT_GRAY = [220, 220, 220];
const BORDER_COLOR = [0, 0, 0];

// Silueta del cuerpo humano en SVG path (simplificada para jsPDF)
const drawBodyDiagram = (doc, x, y, width, height, zonasLesion = {}) => {
  const scale = Math.min(width / 60, height / 120);
  const centerX = x + width / 2;
  const startY = y + 5;
  
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.3);
  doc.setFillColor(255, 255, 255);
  
  // Cabeza
  const headRadius = 6 * scale;
  doc.circle(centerX, startY + headRadius, headRadius, 'S');
  
  // Cuello
  const neckY = startY + headRadius * 2 + 2;
  doc.line(centerX - 2 * scale, startY + headRadius * 2, centerX - 2 * scale, neckY);
  doc.line(centerX + 2 * scale, startY + headRadius * 2, centerX + 2 * scale, neckY);
  
  // Torso
  const torsoTop = neckY;
  const torsoBottom = torsoTop + 35 * scale;
  const torsoWidth = 18 * scale;
  
  // Hombros y torso
  doc.line(centerX - 2 * scale, torsoTop, centerX - torsoWidth, torsoTop + 5 * scale);
  doc.line(centerX + 2 * scale, torsoTop, centerX + torsoWidth, torsoTop + 5 * scale);
  
  // Lados del torso
  doc.line(centerX - torsoWidth, torsoTop + 5 * scale, centerX - 12 * scale, torsoBottom);
  doc.line(centerX + torsoWidth, torsoTop + 5 * scale, centerX + 12 * scale, torsoBottom);
  
  // Línea de cintura
  doc.line(centerX - 12 * scale, torsoBottom, centerX + 12 * scale, torsoBottom);
  
  // Brazos
  const armY = torsoTop + 5 * scale;
  // Brazo izquierdo
  doc.line(centerX - torsoWidth, armY, centerX - torsoWidth - 5 * scale, armY + 15 * scale);
  doc.line(centerX - torsoWidth - 5 * scale, armY + 15 * scale, centerX - torsoWidth - 8 * scale, armY + 30 * scale);
  // Brazo derecho
  doc.line(centerX + torsoWidth, armY, centerX + torsoWidth + 5 * scale, armY + 15 * scale);
  doc.line(centerX + torsoWidth + 5 * scale, armY + 15 * scale, centerX + torsoWidth + 8 * scale, armY + 30 * scale);
  
  // Manos (círculos pequeños)
  doc.circle(centerX - torsoWidth - 8 * scale, armY + 32 * scale, 2 * scale, 'S');
  doc.circle(centerX + torsoWidth + 8 * scale, armY + 32 * scale, 2 * scale, 'S');
  
  // Piernas
  const legTop = torsoBottom;
  const legBottom = legTop + 40 * scale;
  // Pierna izquierda
  doc.line(centerX - 8 * scale, legTop, centerX - 10 * scale, legBottom);
  doc.line(centerX - 3 * scale, legTop, centerX - 5 * scale, legBottom);
  // Pierna derecha
  doc.line(centerX + 8 * scale, legTop, centerX + 10 * scale, legBottom);
  doc.line(centerX + 3 * scale, legTop, centerX + 5 * scale, legBottom);
  
  // Pies
  doc.ellipse(centerX - 7.5 * scale, legBottom + 2 * scale, 3 * scale, 2 * scale, 'S');
  doc.ellipse(centerX + 7.5 * scale, legBottom + 2 * scale, 3 * scale, 2 * scale, 'S');
  
  // Marcar zonas de lesión si existen
  if (zonasLesion && Object.keys(zonasLesion).length > 0) {
    doc.setFillColor(255, 0, 0);
    Object.entries(zonasLesion).forEach(([zona, tipo]) => {
      if (tipo) {
        // Coordenadas aproximadas para cada zona
        const zonaCoords = {
          cabeza: [centerX, startY + headRadius],
          cuello: [centerX, neckY - 2],
          torax_anterior: [centerX, torsoTop + 15 * scale],
          torax_posterior: [centerX, torsoTop + 15 * scale],
          abdomen: [centerX, torsoTop + 28 * scale],
          pelvis: [centerX, torsoBottom - 3 * scale],
          brazo_izq: [centerX - torsoWidth - 3 * scale, armY + 10 * scale],
          brazo_der: [centerX + torsoWidth + 3 * scale, armY + 10 * scale],
          antebrazo_izq: [centerX - torsoWidth - 6 * scale, armY + 22 * scale],
          antebrazo_der: [centerX + torsoWidth + 6 * scale, armY + 22 * scale],
          mano_izq: [centerX - torsoWidth - 8 * scale, armY + 32 * scale],
          mano_der: [centerX + torsoWidth + 8 * scale, armY + 32 * scale],
          muslo_izq: [centerX - 6 * scale, legTop + 12 * scale],
          muslo_der: [centerX + 6 * scale, legTop + 12 * scale],
          pierna_izq: [centerX - 7 * scale, legTop + 28 * scale],
          pierna_der: [centerX + 7 * scale, legTop + 28 * scale],
          pie_izq: [centerX - 7.5 * scale, legBottom + 2 * scale],
          pie_der: [centerX + 7.5 * scale, legBottom + 2 * scale],
        };
        
        const coord = zonaCoords[zona];
        if (coord) {
          doc.circle(coord[0], coord[1], 2, 'F');
        }
      }
    });
  }
};

export const generateFRAPPDF = async (frap) => {
  const doc = new jsPDF('p', 'mm', 'letter');
  const pw = doc.internal.pageSize.getWidth();  // 215.9
  const ph = doc.internal.pageSize.getHeight(); // 279.4
  const mx = 5;  // Margen lateral reducido
  const my = 5;  // Margen superior reducido
  const cw = pw - mx * 2;  // Ancho de contenido
  const colW = cw / 2 - 2; // Ancho de cada columna
  const col1X = mx;
  const col2X = mx + colW + 4;
  
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

  // ================================================================
  // HELPERS
  // ================================================================
  
  const sectionTitle = (title, x, y, width) => {
    doc.setFillColor(...BLUE);
    doc.rect(x, y, width, 4.5, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(title.toUpperCase(), x + 1.5, y + 3.2);
    return y + 5;
  };

  const fieldLabel = (label, x, y) => {
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK_BLUE);
    doc.text(label, x, y);
  };

  const fieldValue = (value, x, y, maxWidth = 50) => {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    const val = String(value || '');
    if (maxWidth) {
      const lines = doc.splitTextToSize(val, maxWidth);
      doc.text(lines, x, y);
      return lines.length * 2.5;
    }
    doc.text(val, x, y);
    return 3;
  };

  const fieldLine = (x, y, width) => {
    doc.setDrawColor(...LIGHT_GRAY);
    doc.setLineWidth(0.2);
    doc.line(x, y, x + width, y);
  };

  const checkbox = (label, checked, x, y, boxSize = 2.5) => {
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.2);
    doc.rect(x, y - boxSize + 0.5, boxSize, boxSize);
    if (checked) {
      doc.setFillColor(...DARK_GREEN);
      doc.rect(x + 0.3, y - boxSize + 0.8, boxSize - 0.6, boxSize - 0.6, 'F');
    }
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    doc.text(label, x + boxSize + 1, y);
    return doc.getTextWidth(label) + boxSize + 3;
  };

  const smallCheckbox = (label, checked, x, y) => {
    return checkbox(label, checked, x, y, 2);
  };

  // ================================================================
  // ENCABEZADO
  // ================================================================
  let y = my;
  
  // Logo y título
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', mx, y, 18, 18);
  } else {
    // Placeholder circular para logo
    doc.setDrawColor(...DARK_BLUE);
    doc.setLineWidth(0.5);
    doc.circle(mx + 9, y + 9, 8, 'S');
  }
  
  // Título principal
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_GREEN);
  doc.text('CUERPO DE RESCATE DE ENSENADA, A.C.', mx + 22, y + 5);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  doc.text('Calle Magnolias No. 2356', mx + 22, y + 9);
  doc.text('Col. Márquez de León, Ensenada, B.C.', mx + 22, y + 12);
  doc.text('Tels. 176-8033 y 177-9992', mx + 22, y + 15);
  
  // Fecha y Folio
  const folioBoxX = pw - mx - 45;
  doc.setDrawColor(...DARK_BLUE);
  doc.setLineWidth(0.3);
  doc.rect(folioBoxX, y, 45, 18, 'S');
  
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_BLUE);
  doc.text('FECHA:', folioBoxX + 2, y + 4);
  fieldLine(folioBoxX + 12, y + 4.5, 30);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  doc.text(frap.fecha || '', folioBoxX + 13, y + 4);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_BLUE);
  doc.text('# FOLIO:', folioBoxX + 2, y + 10);
  doc.setFontSize(11);
  doc.setTextColor(...DARK_GREEN);
  doc.text(frap.folio || '', folioBoxX + 18, y + 11);
  
  // Cuadro de horas
  y += 20;
  const horasY = y;
  doc.setFillColor(...BLUE);
  doc.rect(mx, y, cw, 4, 'F');
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  
  const horaHeaders = ['HORA LLAMADA', 'HORA SALIDA', 'HORA LLEGADA', 'HORA TRASLADO', 'HORA HOSPITAL', 'HORA BASE'];
  const horaWidth = cw / 6;
  horaHeaders.forEach((h, i) => {
    doc.text(h, mx + (horaWidth * i) + horaWidth / 2, y + 2.8, { align: 'center' });
  });
  
  y += 4;
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.2);
  doc.rect(mx, y, cw, 5, 'S');
  
  const horaValues = [
    frap.hora_llamada || '',
    frap.hora_salida || '',
    frap.hora_llegada_traslado || '',
    frap.hora_traslado || '',
    frap.hora_llegada_hospital || '',
    frap.hora_llegada_base || ''
  ];
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  horaValues.forEach((v, i) => {
    doc.text(v, mx + (horaWidth * i) + horaWidth / 2, y + 3.5, { align: 'center' });
    if (i < 5) {
      doc.line(mx + horaWidth * (i + 1), y, mx + horaWidth * (i + 1), y + 5);
    }
  });
  
  y += 7;
  
  // ================================================================
  // CONTENIDO EN DOS COLUMNAS
  // ================================================================
  
  let leftY = y;
  let rightY = y;
  
  // ────────────────────────────────────────────────────────────────
  // COLUMNA IZQUIERDA
  // ────────────────────────────────────────────────────────────────
  
  // MOTIVO DE LA ATENCIÓN
  leftY = sectionTitle('MOTIVO DE LA ATENCIÓN', col1X, leftY, colW);
  leftY += 1;
  let xPos = col1X + 2;
  xPos += checkbox('TRASLADO PROGRAMADO', frap.motivo_atencion === 'traslado_programado', xPos, leftY);
  xPos += checkbox('ENFERMEDAD', frap.motivo_atencion === 'enfermedad', xPos, leftY);
  xPos += checkbox('TRAUMATISMO', frap.motivo_atencion === 'traumatismo', xPos, leftY);
  checkbox('GINECOOBSTÉTRICO', frap.motivo_atencion === 'gineco', xPos, leftY);
  leftY += 5;
  
  // UBICACIÓN DEL SERVICIO
  leftY = sectionTitle('UBICACIÓN DEL SERVICIO', col1X, leftY, colW);
  leftY += 1;
  
  fieldLabel('CALLE:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 12, leftY + 3, colW - 14);
  fieldValue(frap.ubicacion_calle, col1X + 13, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('ENTRE:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 12, leftY + 3, colW - 14);
  fieldValue(frap.ubicacion_entre, col1X + 13, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('COLONIA/COMUNIDAD:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 30, leftY + 3, colW - 32);
  fieldValue(frap.ubicacion_colonia, col1X + 31, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('DELEGACIÓN POLÍTICA/MUNICIPIO:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 45, leftY + 3, colW - 47);
  fieldValue(frap.ubicacion_delegacion, col1X + 46, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('LUGAR DE OCURRENCIA:', col1X + 1, leftY + 2.5);
  leftY += 4;
  xPos = col1X + 2;
  xPos += smallCheckbox('HOGAR', frap.lugar_ocurrencia === 'hogar', xPos, leftY);
  xPos += smallCheckbox('VÍA PÚBLICA', frap.lugar_ocurrencia === 'via_publica', xPos, leftY);
  xPos += smallCheckbox('TRABAJO', frap.lugar_ocurrencia === 'trabajo', xPos, leftY);
  xPos += smallCheckbox('ESCUELA', frap.lugar_ocurrencia === 'escuela', xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('RECREACIÓN Y DEPORTE', frap.lugar_ocurrencia === 'recreacion', xPos, leftY);
  xPos += smallCheckbox('TRANSPORTE PÚBLICO', frap.lugar_ocurrencia === 'transporte', xPos, leftY);
  smallCheckbox('OTRA', frap.lugar_ocurrencia === 'otro', xPos, leftY);
  leftY += 4;
  
  fieldLabel('NÚMERO DE AMBULANCIA:', col1X + 1, leftY + 2.5);
  doc.rect(col1X + 35, leftY, 12, 4, 'S');
  fieldValue(frap.numero_ambulancia || '', col1X + 36, leftY + 2.8);
  leftY += 5;
  
  fieldLabel('OPERADOR:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 18, leftY + 3, colW - 20);
  fieldValue(frap.operador, col1X + 19, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('PRESTADORES DEL SERVICIO:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 38, leftY + 3, colW - 40);
  fieldValue(frap.prestadores_servicio, col1X + 39, leftY + 2.5);
  leftY += 5;
  
  // DATOS DEL PACIENTE
  leftY = sectionTitle('NOMBRE DEL PACIENTE', col1X, leftY, colW);
  fieldLine(col1X + 1, leftY + 3, colW - 2);
  fieldValue(frap.nombre_paciente, col1X + 2, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('NOMBRE DEL ACOMPAÑANTE:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 38, leftY + 3, colW - 40);
  fieldValue(frap.nombre_acompanante, col1X + 39, leftY + 2.5);
  leftY += 5;
  
  // Sexo y Edad en línea
  fieldLabel('SEXO:', col1X + 1, leftY + 2.5);
  doc.rect(col1X + 11, leftY, 6, 4, 'S');
  if (frap.sexo === 'masculino') {
    doc.setFontSize(6);
    doc.text('M', col1X + 13, leftY + 2.8);
  }
  doc.rect(col1X + 19, leftY, 6, 4, 'S');
  if (frap.sexo === 'femenino') {
    doc.setFontSize(6);
    doc.text('F', col1X + 21, leftY + 2.8);
  }
  doc.setFontSize(5);
  doc.text('MASC.', col1X + 11, leftY + 6);
  doc.text('FEM.', col1X + 19, leftY + 6);
  
  fieldLabel('EDAD:', col1X + 35, leftY + 2.5);
  doc.rect(col1X + 44, leftY, 10, 4, 'S');
  doc.rect(col1X + 56, leftY, 10, 4, 'S');
  fieldValue(frap.edad_anos || '', col1X + 45, leftY + 2.8);
  fieldValue(frap.edad_meses || '', col1X + 57, leftY + 2.8);
  doc.setFontSize(5);
  doc.text('AÑOS', col1X + 46, leftY + 6);
  doc.text('MESES', col1X + 57, leftY + 6);
  leftY += 8;
  
  fieldLabel('DOMICILIO:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 18, leftY + 3, colW - 20);
  fieldValue(frap.domicilio, col1X + 19, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('COLONIA/COMUNIDAD:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 30, leftY + 3, colW - 32);
  fieldValue(frap.colonia_paciente, col1X + 31, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('DELEGACIÓN POLÍTICA/MUNICIPIO:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 45, leftY + 3, colW - 47);
  fieldValue(frap.delegacion_paciente, col1X + 46, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('TELÉFONO:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 18, leftY + 3, 25);
  fieldValue(frap.telefono, col1X + 19, leftY + 2.5);
  fieldLabel('OCUPACIÓN:', col1X + 48, leftY + 2.5);
  fieldLine(col1X + 65, leftY + 3, colW - 67);
  fieldValue(frap.ocupacion, col1X + 66, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('DERECHOHABIENTE A:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 30, leftY + 3, colW - 32);
  fieldValue(frap.derechohabiente, col1X + 31, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('COMPAÑÍA DE SEGUROS GASTOS MÉDICOS:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 55, leftY + 3, colW - 57);
  fieldValue(frap.compania_seguros, col1X + 56, leftY + 2.5);
  leftY += 5;
  
  // ORIGEN PROBABLE
  leftY = sectionTitle('ORIGEN PROBABLE', col1X, leftY, colW);
  leftY += 1;
  const origenes = frap.origen_probable || [];
  xPos = col1X + 2;
  xPos += smallCheckbox('NEUROLOGÍA', origenes.includes('neurologia'), xPos, leftY);
  xPos += smallCheckbox('DIGESTIVA', origenes.includes('digestiva'), xPos, leftY);
  smallCheckbox('INTOXICACIÓN', origenes.includes('intoxicacion'), xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('CARDIOVASCULAR', origenes.includes('cardiovascular'), xPos, leftY);
  xPos += smallCheckbox('UROGENITAL', origenes.includes('urogenital'), xPos, leftY);
  smallCheckbox('INFECCIOSA', origenes.includes('infecciosa'), xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('RESPIRATORIO', origenes.includes('respiratorio'), xPos, leftY);
  xPos += smallCheckbox('GINECO-OBSTÉTRICA', origenes.includes('gineco'), xPos, leftY);
  smallCheckbox('ONCOLÓGICO', origenes.includes('oncologico'), xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('METABÓLICO', origenes.includes('metabolico'), xPos, leftY);
  xPos += smallCheckbox('COGNITIVO EMOCIONAL', origenes.includes('cognitivo'), xPos, leftY);
  smallCheckbox('OTRO', origenes.includes('otro'), xPos, leftY);
  leftY += 4;
  
  fieldLabel('ESPECIFIQUE:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 20, leftY + 3, colW - 22);
  fieldValue(frap.origen_probable_otro, col1X + 21, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('1A VEZ:', col1X + 1, leftY + 2.5);
  doc.rect(col1X + 14, leftY, 4, 3, 'S');
  fieldLabel('SUBSECUENTE:', col1X + 25, leftY + 2.5);
  doc.rect(col1X + 45, leftY, 4, 3, 'S');
  leftY += 5;
  
  // ACCIDENTE AUTOMOVILÍSTICO
  leftY = sectionTitle('ACCIDENTE AUTOMOVILÍSTICO', col1X, leftY, colW);
  leftY += 1;
  xPos = col1X + 2;
  xPos += smallCheckbox('COLISIÓN', frap.accidente_colision === 'colision', xPos, leftY);
  doc.rect(xPos, leftY - 2.5, 4, 3, 'S');
  xPos += 6;
  xPos += smallCheckbox('VOLCADURA', frap.accidente_colision === 'volcadura', xPos, leftY);
  doc.rect(xPos, leftY - 2.5, 4, 3, 'S');
  leftY += 3;
  
  xPos = col1X + 2;
  xPos += smallCheckbox('AUTOMOTOR', frap.accidente_colision === 'automotor', xPos, leftY);
  xPos += smallCheckbox('MOTOCICLETA', frap.accidente_colision === 'motocicleta', xPos, leftY);
  xPos += smallCheckbox('BICICLETA', frap.accidente_colision === 'bicicleta', xPos, leftY);
  smallCheckbox('MAQUINARIA', frap.accidente_colision === 'maquinaria', xPos, leftY);
  leftY += 4;
  
  fieldLabel('CONTRA OBJETO:', col1X + 1, leftY + 2.5);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('FIJO', frap.accidente_contra_objeto === 'fijo', xPos, leftY);
  xPos += smallCheckbox('EN MOVIMIENTO', frap.accidente_contra_objeto === 'movimiento', xPos, leftY);
  
  fieldLabel('IMPACTO:', col1X + 50, leftY + 2.5);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('FRONTAL', frap.accidente_impacto === 'frontal', xPos, leftY);
  xPos += smallCheckbox('LATERAL', frap.accidente_impacto === 'lateral', xPos, leftY);
  smallCheckbox('POSTERIOR', frap.accidente_impacto === 'posterior', xPos, leftY);
  leftY += 3;
  
  xPos = col1X + 2;
  fieldLabel('HUNDIMIENTO:', xPos, leftY + 2.5);
  fieldLine(col1X + 22, leftY + 3, 15);
  fieldValue(frap.accidente_hundimiento, col1X + 23, leftY + 2.5);
  fieldLabel('CMS', col1X + 38, leftY + 2.5);
  
  fieldLabel('PARABRISAS:', col1X + 50, leftY + 2.5);
  smallCheckbox('ROTO', frap.parabrisas_roto, col1X + 68, leftY);
  smallCheckbox('DOBLADO', frap.parabrisas_doblado, col1X + 82, leftY);
  leftY += 4;
  
  xPos = col1X + 2;
  fieldLabel('VOLANTE:', xPos, leftY + 2.5);
  xPos += smallCheckbox('INTRUSIÓN', frap.volante === 'intrusion', col1X + 16, leftY);
  smallCheckbox('DOBLADO', frap.volante === 'doblado', col1X + 35, leftY);
  
  fieldLabel('BOLSA DE AIRE:', col1X + 55, leftY + 2.5);
  smallCheckbox('SÍ', frap.bolsa_aire === 'si', col1X + 75, leftY);
  smallCheckbox('NO', frap.bolsa_aire === 'no', col1X + 85, leftY);
  leftY += 4;
  
  fieldLabel('CINTURÓN DE SEGURIDAD:', col1X + 1, leftY + 2.5);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('COLOCADO', frap.cinturon_seguridad === 'colocado', xPos, leftY);
  xPos += smallCheckbox('NO COLOCADO', frap.cinturon_seguridad === 'no_colocado', xPos, leftY);
  
  fieldLabel('DENTRO DEL VEHÍCULO:', col1X + 55, leftY + 2.5);
  smallCheckbox('SÍ', frap.dentro_vehiculo === 'si', col1X + 80, leftY);
  smallCheckbox('NO', frap.dentro_vehiculo === 'no', col1X + 88, leftY);
  smallCheckbox('EYECTADO', frap.eyectado === 'si', col1X + 55, leftY + 3);
  leftY += 5;
  
  fieldLabel('ATROPELLADO:', col1X + 1, leftY + 2.5);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('AUTOMOTOR', frap.atropellado === 'automotor', xPos, leftY);
  xPos += smallCheckbox('MOTOCICLETA', frap.atropellado === 'motocicleta', xPos, leftY);
  xPos += smallCheckbox('BICICLETA', frap.atropellado === 'bicicleta', xPos, leftY);
  smallCheckbox('MAQUINARIA', frap.atropellado === 'maquinaria', xPos, leftY);
  
  fieldLabel('CASCO DE SEGURIDAD:', col1X + 55, leftY + 2.5);
  smallCheckbox('SÍ', frap.casco_seguridad === 'si', col1X + 80, leftY);
  smallCheckbox('NO', frap.casco_seguridad === 'no', col1X + 88, leftY);
  leftY += 5;
  
  // AGENTE CAUSAL
  leftY = sectionTitle('AGENTE CAUSAL', col1X, leftY, colW);
  leftY += 1;
  const agentes = frap.agente_causal || [];
  xPos = col1X + 2;
  xPos += smallCheckbox('ARMA', agentes.includes('arma'), xPos, leftY);
  xPos += smallCheckbox('MAQUINARIA', agentes.includes('maquinaria'), xPos, leftY);
  smallCheckbox('ELECTRICIDAD', agentes.includes('electricidad'), xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('JUGUETE', agentes.includes('juguete'), xPos, leftY);
  xPos += smallCheckbox('HERRAMIENTA', agentes.includes('herramienta'), xPos, leftY);
  smallCheckbox('EXPLOSIÓN', agentes.includes('explosion'), xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('AUTOMOTOR', agentes.includes('automotor'), xPos, leftY);
  xPos += smallCheckbox('FUEGO', agentes.includes('fuego'), xPos, leftY);
  smallCheckbox('SER HUMANO', agentes.includes('ser_humano'), xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('BICICLETA', agentes.includes('bicicleta'), xPos, leftY);
  xPos += smallCheckbox('SUSTANCIA CALIENTE', agentes.includes('producto_caliente'), xPos, leftY);
  smallCheckbox('ANIMAL', agentes.includes('animal'), xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('PRODUCTO BIOLÓGICO', agentes.includes('sustancia_biologica'), xPos, leftY);
  smallCheckbox('SUSTANCIA TÓXICA', agentes.includes('sustancia_toxica'), xPos, leftY);
  smallCheckbox('OTRO', agentes.includes('otro'), col1X + colW - 15, leftY);
  leftY += 4;
  
  fieldLabel('ESPECIFIQUE:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 20, leftY + 3, colW - 22);
  fieldValue(frap.agente_causal_otro, col1X + 21, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('LESIONES CAUSADAS POR:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 35, leftY + 3, colW - 37);
  fieldValue(frap.lesiones_causadas_por, col1X + 36, leftY + 2.5);
  
  // ────────────────────────────────────────────────────────────────
  // COLUMNA DERECHA
  // ────────────────────────────────────────────────────────────────
  
  // NIVEL DE CONCIENCIA
  rightY = sectionTitle('NIVEL DE CONCIENCIA', col2X, rightY, colW);
  rightY += 1;
  xPos = col2X + 2;
  xPos += smallCheckbox('CONSCIENTE', frap.nivel_conciencia === 'consciente', xPos, rightY);
  smallCheckbox('PERMEABLE', frap.via_aerea === 'permeable', col2X + colW - 30, rightY);
  rightY += 3;
  xPos = col2X + 2;
  xPos += smallCheckbox('RESPUESTA A ESTÍMULO VERBAL', frap.nivel_conciencia === 'resp_verbal', xPos, rightY);
  smallCheckbox('COMPROMETIDA', frap.via_aerea === 'comprometida', col2X + colW - 30, rightY);
  rightY += 3;
  xPos = col2X + 2;
  xPos += smallCheckbox('RESPUESTA A ESTÍMULO DOLOROSO', frap.nivel_conciencia === 'resp_dolor', xPos, rightY);
  rightY += 3;
  smallCheckbox('INCONSCIENTE', frap.nivel_conciencia === 'inconsciente', col2X + 2, rightY);
  
  // VÍA AÉREA y REFLEJO
  fieldLabel('VÍA AÉREA:', col2X + colW - 40, rightY - 9);
  fieldLabel('REFLEJO DE DEGLUCIÓN:', col2X + colW - 40, rightY + 2.5);
  smallCheckbox('AUSENTE', frap.reflejo_deglucion === 'ausente', col2X + colW - 20, rightY);
  smallCheckbox('PRESENTE', frap.reflejo_deglucion === 'presente', col2X + colW - 40, rightY + 5);
  rightY += 8;
  
  // VENTILACIÓN
  rightY = sectionTitle('VENTILACIÓN', col2X, rightY, colW / 2 - 1);
  doc.setFillColor(...BLUE);
  doc.rect(col2X + colW / 2 + 1, rightY - 5, colW / 2 - 1, 4.5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('AUSCULTACIÓN', col2X + colW / 2 + 2.5, rightY - 1.8);
  
  rightY += 1;
  smallCheckbox('AUTOMATISMO REGULAR', frap.ventilacion === 'automatismo_regular', col2X + 2, rightY);
  smallCheckbox('RUIDOS RESP. NORMALES', frap.auscultacion === 'normales', col2X + colW / 2 + 2, rightY);
  rightY += 3;
  smallCheckbox('AUTOMATISMO IRREGULAR', frap.ventilacion === 'automatismo_irregular', col2X + 2, rightY);
  smallCheckbox('RUIDOS RESP. DISMINUIDOS', frap.auscultacion === 'disminuidos', col2X + colW / 2 + 2, rightY);
  rightY += 3;
  smallCheckbox('VENTILACIÓN RÁPIDA', frap.ventilacion === 'rapida', col2X + 2, rightY);
  smallCheckbox('RUIDOS RESP. AUSENTES', frap.auscultacion === 'ausentes', col2X + colW / 2 + 2, rightY);
  rightY += 3;
  smallCheckbox('VENTILACIÓN SUPERFICIAL', frap.ventilacion === 'superficial', col2X + 2, rightY);
  rightY += 3;
  smallCheckbox('APNEA', frap.ventilacion === 'apnea', col2X + 2, rightY);
  
  // NEUMOTÓRAX
  fieldLabel('NEUMOTÓRAX:', col2X + colW / 2 + 2, rightY + 2.5);
  smallCheckbox('DERECHO', frap.neumotorax === 'derecho', col2X + colW / 2 + 25, rightY);
  rightY += 3;
  fieldLabel('SITIO:', col2X + colW / 2 + 2, rightY + 2.5);
  smallCheckbox('APICAL', frap.sitio_neumotorax === 'apical', col2X + colW / 2 + 15, rightY);
  smallCheckbox('BASE', frap.sitio_neumotorax === 'base', col2X + colW / 2 + 30, rightY);
  rightY += 5;
  
  // CIRCULACIÓN
  rightY = sectionTitle('CIRCULACIÓN: PRESENCIA DE PULSOS', col2X, rightY, colW / 2 + 15);
  doc.setFillColor(...BLUE);
  doc.rect(col2X + colW / 2 + 17, rightY - 5, colW / 2 - 17, 4.5, 'F');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('CALIDAD', col2X + colW / 2 + 19, rightY - 1.8);
  doc.text('PIEL', col2X + colW - 18, rightY - 1.8);
  doc.text('CARACTERÍSTICAS', col2X + colW - 8, rightY - 1.8);
  
  rightY += 1;
  smallCheckbox('CAROTÍDEO', frap.presencia_pulsos === 'carotideo', col2X + 2, rightY);
  smallCheckbox('RÁPIDO', frap.calidad_pulso === 'rapido', col2X + colW / 2 + 2, rightY);
  smallCheckbox('NORMAL', frap.piel === 'normal', col2X + colW - 30, rightY);
  smallCheckbox('CALIENTE', frap.caracteristicas_piel === 'caliente', col2X + colW - 15, rightY);
  rightY += 3;
  smallCheckbox('RADIAL', frap.presencia_pulsos === 'radial', col2X + 2, rightY);
  smallCheckbox('LENTO', frap.calidad_pulso === 'lento', col2X + colW / 2 + 2, rightY);
  smallCheckbox('PÁLIDA', frap.piel === 'palida', col2X + colW - 30, rightY);
  smallCheckbox('FRÍA', frap.caracteristicas_piel === 'fria', col2X + colW - 15, rightY);
  rightY += 3;
  smallCheckbox('PARO CARDIORESPIRATORIO', frap.presencia_pulsos === 'paro', col2X + 2, rightY);
  smallCheckbox('RÍTMICO', frap.calidad_pulso === 'ritmico', col2X + colW / 2 + 2, rightY);
  smallCheckbox('CIANÓTICA', frap.piel === 'cianotica', col2X + colW - 30, rightY);
  smallCheckbox('DIAFORESIS', frap.caracteristicas_piel === 'diaforesis', col2X + colW - 15, rightY);
  rightY += 3;
  smallCheckbox('ARRÍTMICO', frap.calidad_pulso === 'arritmico', col2X + colW / 2 + 2, rightY);
  rightY += 5;
  
  // EXPLORACIÓN FÍSICA
  rightY = sectionTitle('EXPLORACIÓN FÍSICA', col2X, rightY, colW / 2 - 5);
  doc.setFillColor(...BLUE);
  doc.rect(col2X + colW / 2 - 3, rightY - 5, colW / 2 + 3, 4.5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('ZONAS DE LESIÓN', col2X + colW / 2 + 8, rightY - 1.8);
  
  const exploraciones = frap.exploracion_fisica || [];
  rightY += 1;
  const expItems = [
    { num: '1', label: 'DEFORMIDADES', value: 'deformidades' },
    { num: '2', label: 'CONTUSIONES', value: 'contusiones' },
    { num: '3', label: 'ABRASIONES', value: 'abrasiones' },
    { num: '4', label: 'PENETRACIONES', value: 'penetraciones' },
    { num: '5', label: 'MOV. PARADÓJICO', value: 'mov_paradojico' },
    { num: '6', label: 'CREPITACIÓN', value: 'crepitacion' },
    { num: '7', label: 'HERIDAS', value: 'heridas' },
    { num: '8', label: 'FRACTURAS', value: 'fracturas' },
    { num: '9', label: 'ENFISEMA SUBCUTÁNEO', value: 'enfisema' },
    { num: '10', label: 'QUEMADURAS', value: 'quemaduras' },
    { num: '11', label: 'LACERACIONES', value: 'laceraciones' },
    { num: '12', label: 'EDEMA', value: 'edema' },
    { num: '13', label: 'ALTERACIÓN DE SENSIBILIDAD', value: 'alt_sensibilidad' },
    { num: '14', label: 'ALTERACIÓN DE MOVILIDAD', value: 'alt_movilidad' },
    { num: '15', label: 'DOLOR', value: 'dolor' },
  ];
  
  const expStartY = rightY;
  expItems.forEach((item, i) => {
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK_BLUE);
    doc.text(item.num, col2X + 2, rightY + 2);
    smallCheckbox(item.label, exploraciones.includes(item.value), col2X + 6, rightY);
    rightY += 2.8;
  });
  
  // Diagrama corporal
  const bodyX = col2X + colW / 2;
  const bodyY = expStartY - 2;
  const bodyW = colW / 2 - 2;
  const bodyH = 45;
  
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.2);
  doc.rect(bodyX, bodyY, bodyW, bodyH, 'S');
  
  drawBodyDiagram(doc, bodyX + 2, bodyY + 2, bodyW - 4, bodyH - 4, frap.zonas_lesion);
  
  // Pupilas
  const pupilasY = bodyY + bodyH + 2;
  doc.setFontSize(5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_BLUE);
  doc.text('PUPILAS', bodyX + 5, pupilasY + 3);
  
  doc.circle(bodyX + 18, pupilasY + 8, 5, 'S');
  doc.circle(bodyX + 32, pupilasY + 8, 5, 'S');
  doc.setFontSize(4);
  doc.text('D', bodyX + 17, pupilasY + 15);
  doc.text('I', bodyX + 31.5, pupilasY + 15);
  
  rightY = pupilasY + 18;
  
  // SIGNOS VITALES
  rightY = sectionTitle('SIGNOS VITALES', col2X, rightY, colW);
  
  const vitalesHeaders = ['HORA', 'FR', 'FC', 'TAS', 'TAD', 'SaO2', 'TEMP', 'GLUC'];
  const vitalesColW = colW / 8;
  
  doc.setFillColor(...DARK_BLUE);
  doc.rect(col2X, rightY, colW, 4, 'F');
  doc.setFontSize(5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  vitalesHeaders.forEach((h, i) => {
    doc.text(h, col2X + (vitalesColW * i) + vitalesColW / 2, rightY + 2.8, { align: 'center' });
  });
  
  rightY += 4;
  const vitales = frap.vitales || [];
  for (let i = 0; i < 3; i++) {
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.2);
    doc.rect(col2X, rightY, colW, 4, 'S');
    
    const v = vitales[i] || {};
    const vValues = [v.hora, v.fr, v.fc, v.tas, v.tad, v.sao2, v.temp, v.gluc];
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    vValues.forEach((val, j) => {
      doc.text(String(val || ''), col2X + (vitalesColW * j) + vitalesColW / 2, rightY + 2.8, { align: 'center' });
      if (j < 7) {
        doc.line(col2X + vitalesColW * (j + 1), rightY, col2X + vitalesColW * (j + 1), rightY + 4);
      }
    });
    rightY += 4;
  }
  rightY += 2;
  
  // CONDICIÓN DEL PACIENTE
  rightY = sectionTitle('CONDICIÓN DEL PACIENTE', col2X, rightY, colW / 2 - 2);
  doc.setFillColor(...BLUE);
  doc.rect(col2X + colW / 2, rightY - 5, colW / 2, 4.5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('PRIORIDAD', col2X + colW / 2 + 2, rightY - 1.8);
  
  rightY += 1;
  smallCheckbox('CRÍTICO INESTABLE', frap.condicion_paciente === 'critico_inestable', col2X + 2, rightY);
  smallCheckbox('NO CRÍTICO', frap.condicion_paciente === 'no_critico', col2X + 40, rightY);
  
  // Prioridad con colores
  const prioX = col2X + colW / 2 + 2;
  const prioItems = [
    { value: 'rojo', label: 'ROJO', color: [220, 53, 69] },
    { value: 'verde', label: 'VERDE', color: [40, 167, 69] },
    { value: 'amarillo', label: 'AMARILLO', color: [255, 193, 7] },
    { value: 'negro', label: 'NEGRO', color: [33, 33, 33] },
  ];
  
  prioItems.forEach((p, i) => {
    const px = prioX + (i % 2) * 22;
    const py = rightY + Math.floor(i / 2) * 5;
    if (frap.prioridad === p.value) {
      doc.setFillColor(...p.color);
      doc.rect(px, py - 2.5, 18, 4, 'F');
      doc.setFontSize(5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...(p.value === 'amarillo' ? BLACK : WHITE));
      doc.text(p.label, px + 9, py + 0.5, { align: 'center' });
    } else {
      doc.setDrawColor(...p.color);
      doc.setLineWidth(0.3);
      doc.rect(px, py - 2.5, 18, 4, 'S');
      doc.setFontSize(5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...p.color);
      doc.text(p.label, px + 9, py + 0.5, { align: 'center' });
    }
  });
  
  rightY += 3;
  smallCheckbox('CRÍTICO ESTABLE', frap.condicion_paciente === 'critico_estable', col2X + 2, rightY);
  rightY += 8;
  
  // VÍA AÉREA MANEJO
  rightY = sectionTitle('VÍA AÉREA:', col2X, rightY, colW / 4);
  doc.setFillColor(...BLUE);
  doc.rect(col2X + colW / 4 + 2, rightY - 5, colW / 4 - 2, 4.5, 'F');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('CONTROL CERVICAL:', col2X + colW / 4 + 3, rightY - 1.8);
  
  doc.setFillColor(...BLUE);
  doc.rect(col2X + colW / 2 + 2, rightY - 5, colW / 4 - 2, 4.5, 'F');
  doc.text('ASIST. VENTILATORIA:', col2X + colW / 2 + 3, rightY - 1.8);
  
  doc.setFillColor(...BLUE);
  doc.rect(col2X + colW * 3 / 4 + 2, rightY - 5, colW / 4 - 2, 4.5, 'F');
  doc.text('OXIGENOTERAPIA:', col2X + colW * 3 / 4 + 3, rightY - 1.8);
  
  rightY += 1;
  const viaAereaManejo = frap.via_aerea_manejo || [];
  smallCheckbox('ASPIRACIÓN', viaAereaManejo.includes('aspiracion'), col2X + 2, rightY);
  smallCheckbox('MANUAL', frap.control_cervical === 'manual', col2X + colW / 4 + 3, rightY);
  smallCheckbox('BALÓN-VÁLVULA MASCARILLA', frap.asistencia_ventilatoria === 'balon_valvula', col2X + colW / 2 + 3, rightY);
  smallCheckbox('PUNTAS NASALES', frap.oxigenoterapia === 'puntas_nasales', col2X + colW * 3 / 4 + 3, rightY);
  rightY += 3;
  smallCheckbox('CÁNULA OROFARÍNGEA', viaAereaManejo.includes('canula_oro'), col2X + 2, rightY);
  smallCheckbox('COLLARÍN RÍGIDO', frap.control_cervical === 'rigido', col2X + colW / 4 + 3, rightY);
  smallCheckbox('VENTILADOR AUTOMÁTICO', frap.asistencia_ventilatoria === 'ventilador', col2X + colW / 2 + 3, rightY);
  smallCheckbox('MASCARILLA SIMPLE', frap.oxigenoterapia === 'mascarilla_simple', col2X + colW * 3 / 4 + 3, rightY);
  rightY += 3;
  smallCheckbox('CÁNULA NASOFARÍNGEA', viaAereaManejo.includes('canula_naso'), col2X + 2, rightY);
  smallCheckbox('COLLARÍN BLANDO', frap.control_cervical === 'blando', col2X + colW / 4 + 3, rightY);
  fieldLabel('FREC.', col2X + colW / 2 + 3, rightY + 2.5);
  fieldLabel('VOL.', col2X + colW / 2 + 20, rightY + 2.5);
  smallCheckbox('MASCARILLA CON RESERVORIO', frap.oxigenoterapia === 'mascarilla_reservorio', col2X + colW * 3 / 4 + 3, rightY);
  rightY += 4;
  fieldLabel('LTS X MIN:', col2X + colW * 3 / 4 + 3, rightY + 2.5);
  fieldLine(col2X + colW * 3 / 4 + 20, rightY + 3, 15);
  fieldValue(frap.lts_x_min, col2X + colW * 3 / 4 + 21, rightY + 2.5);
  rightY += 5;
  
  // CONTROL DE HEMORRAGIAS / VÍAS VENOSAS
  rightY = sectionTitle('CONTROL DE HEMORRAGIAS:', col2X, rightY, colW / 3);
  doc.setFillColor(...BLUE);
  doc.rect(col2X + colW / 3 + 2, rightY - 5, colW / 3 - 2, 4.5, 'F');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('VÍAS VENOSAS:', col2X + colW / 3 + 3, rightY - 1.8);
  
  doc.setFillColor(...BLUE);
  doc.rect(col2X + colW * 2 / 3 + 2, rightY - 5, colW / 3 - 2, 4.5, 'F');
  doc.text('SITIO DE APLICACIÓN:', col2X + colW * 2 / 3 + 3, rightY - 1.8);
  
  const controlHemorragias = frap.control_hemorragias || [];
  rightY += 1;
  smallCheckbox('PRESIÓN DIRECTA', controlHemorragias.includes('presion_directa'), col2X + 2, rightY);
  fieldLabel('VIA IV #', col2X + colW / 3 + 3, rightY + 2.5);
  fieldLine(col2X + colW / 3 + 18, rightY + 3, 10);
  fieldValue(frap.via_iv_num, col2X + colW / 3 + 19, rightY + 2.5);
  fieldLabel('MANO', col2X + colW * 2 / 3 + 3, rightY + 2.5);
  rightY += 3;
  smallCheckbox('TORNIQUETE', controlHemorragias.includes('torniquete'), col2X + 2, rightY);
  fieldLabel('CATETER #', col2X + colW / 3 + 3, rightY + 2.5);
  fieldLine(col2X + colW / 3 + 18, rightY + 3, 10);
  fieldValue(frap.cateter_num, col2X + colW / 3 + 19, rightY + 2.5);
  fieldLabel('PLIEGUE ANTECUBITAL', col2X + colW * 2 / 3 + 3, rightY + 2.5);
  rightY += 3;
  smallCheckbox('VENDAJE COMPRESIVO', controlHemorragias.includes('vendaje'), col2X + 2, rightY);
  rightY += 5;
  
  // TIPO DE SOLUCIONES
  fieldLabel('TIPO DE SOLUCIONES:', col2X + colW * 2 / 3 + 3, rightY - 3);
  const soluciones = frap.tipo_soluciones || [];
  smallCheckbox('HARTMANN', soluciones.includes('hartmann'), col2X + colW * 2 / 3 + 3, rightY);
  rightY += 3;
  smallCheckbox('NaCl 0.9%', soluciones.includes('nacl'), col2X + colW * 2 / 3 + 3, rightY);
  rightY += 3;
  smallCheckbox('MIXTA', soluciones.includes('mixta'), col2X + colW * 2 / 3 + 3, rightY);
  rightY += 3;
  smallCheckbox('GLUCOSA 5%', soluciones.includes('glucosa'), col2X + colW * 2 / 3 + 3, rightY);
  rightY += 3;
  smallCheckbox('OTRA', soluciones.includes('otra'), col2X + colW * 2 / 3 + 3, rightY);
  rightY += 4;
  
  // ================================================================
  // NUEVA PÁGINA
  // ================================================================
  doc.addPage();
  y = my;
  leftY = y;
  rightY = y;
  
  // ────────────────────────────────────────────────────────────────
  // PÁGINA 2 - COLUMNA IZQUIERDA
  // ────────────────────────────────────────────────────────────────
  
  // Continuar datos del paciente (repetición para referencia)
  leftY = sectionTitle('NOMBRE DEL PACIENTE', col1X, leftY, colW);
  fieldLine(col1X + 1, leftY + 3, colW - 2);
  fieldValue(frap.nombre_paciente, col1X + 2, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('NOMBRE DEL ACOMPAÑANTE:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 38, leftY + 3, colW - 40);
  fieldValue(frap.nombre_acompanante, col1X + 39, leftY + 2.5);
  leftY += 5;
  
  // Sexo y Edad
  fieldLabel('SEXO:', col1X + 1, leftY + 2.5);
  doc.rect(col1X + 11, leftY, 6, 4, 'S');
  if (frap.sexo === 'masculino') {
    doc.setFontSize(6);
    doc.text('M', col1X + 13, leftY + 2.8);
  }
  doc.rect(col1X + 19, leftY, 6, 4, 'S');
  if (frap.sexo === 'femenino') {
    doc.setFontSize(6);
    doc.text('F', col1X + 21, leftY + 2.8);
  }
  doc.setFontSize(5);
  doc.text('MASC.', col1X + 11, leftY + 6);
  doc.text('FEM.', col1X + 19, leftY + 6);
  
  fieldLabel('EDAD:', col1X + 35, leftY + 2.5);
  doc.rect(col1X + 44, leftY, 10, 4, 'S');
  doc.rect(col1X + 56, leftY, 10, 4, 'S');
  fieldValue(frap.edad_anos || '', col1X + 45, leftY + 2.8);
  fieldValue(frap.edad_meses || '', col1X + 57, leftY + 2.8);
  doc.setFontSize(5);
  doc.text('AÑOS', col1X + 46, leftY + 6);
  doc.text('MESES', col1X + 57, leftY + 6);
  leftY += 8;
  
  // Domicilio
  fieldLabel('DOMICILIO:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 18, leftY + 3, colW - 20);
  fieldValue(frap.domicilio, col1X + 19, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('COLONIA/COMUNIDAD:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 30, leftY + 3, colW - 32);
  fieldValue(frap.colonia_paciente, col1X + 31, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('DELEGACIÓN POLÍTICA/MUNICIPIO:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 45, leftY + 3, colW - 47);
  fieldValue(frap.delegacion_paciente, col1X + 46, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('TELÉFONO:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 18, leftY + 3, 25);
  fieldValue(frap.telefono, col1X + 19, leftY + 2.5);
  fieldLabel('OCUPACIÓN:', col1X + 48, leftY + 2.5);
  fieldLine(col1X + 65, leftY + 3, colW - 67);
  fieldValue(frap.ocupacion, col1X + 66, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('DERECHOHABIENTE A:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 30, leftY + 3, colW - 32);
  fieldValue(frap.derechohabiente, col1X + 31, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('COMPAÑÍA DE SEGUROS GASTOS MÉDICOS:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 55, leftY + 3, colW - 57);
  fieldValue(frap.compania_seguros, col1X + 56, leftY + 2.5);
  leftY += 6;
  
  // ORIGEN PROBABLE (repetido)
  leftY = sectionTitle('ORIGEN PROBABLE', col1X, leftY, colW);
  leftY += 1;
  xPos = col1X + 2;
  xPos += smallCheckbox('NEUROLOGÍA', origenes.includes('neurologia'), xPos, leftY);
  xPos += smallCheckbox('DIGESTIVA', origenes.includes('digestiva'), xPos, leftY);
  smallCheckbox('INTOXICACIÓN', origenes.includes('intoxicacion'), xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('CARDIOVASCULAR', origenes.includes('cardiovascular'), xPos, leftY);
  xPos += smallCheckbox('UROGENITAL', origenes.includes('urogenital'), xPos, leftY);
  smallCheckbox('INFECCIOSA', origenes.includes('infecciosa'), xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('RESPIRATORIO', origenes.includes('respiratorio'), xPos, leftY);
  xPos += smallCheckbox('GINECO-OBSTÉTRICA', origenes.includes('gineco'), xPos, leftY);
  smallCheckbox('ONCOLÓGICO', origenes.includes('oncologico'), xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('METABÓLICO', origenes.includes('metabolico'), xPos, leftY);
  xPos += smallCheckbox('COGNITIVO EMOCIONAL', origenes.includes('cognitivo'), xPos, leftY);
  smallCheckbox('OTRO', origenes.includes('otro'), xPos, leftY);
  leftY += 5;
  
  fieldLabel('ESPECIFIQUE:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 20, leftY + 3, colW - 22);
  leftY += 4;
  
  fieldLabel('1A VEZ:', col1X + 1, leftY + 2.5);
  doc.rect(col1X + 14, leftY, 4, 3, 'S');
  fieldLabel('SUBSECUENTE:', col1X + 25, leftY + 2.5);
  doc.rect(col1X + 45, leftY, 4, 3, 'S');
  leftY += 6;
  
  // ACCIDENTE AUTOMOVILÍSTICO (continúa en pág 2)
  leftY = sectionTitle('ACCIDENTE AUTOMOVILÍSTICO', col1X, leftY, colW);
  leftY += 1;
  xPos = col1X + 2;
  xPos += smallCheckbox('COLISIÓN', frap.accidente_colision === 'colision', xPos, leftY);
  doc.rect(xPos, leftY - 2.5, 4, 3, 'S');
  xPos += 6;
  smallCheckbox('VOLCADURA', frap.accidente_colision === 'volcadura', xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('AUTOMOTOR', frap.accidente_colision === 'automotor', xPos, leftY);
  xPos += smallCheckbox('MOTOCICLETA', frap.accidente_colision === 'motocicleta', xPos, leftY);
  xPos += smallCheckbox('BICICLETA', frap.accidente_colision === 'bicicleta', xPos, leftY);
  smallCheckbox('MAQUINARIA', frap.accidente_colision === 'maquinaria', xPos, leftY);
  leftY += 4;
  
  // Contra objeto e impacto
  fieldLabel('CONTRA OBJETO:', col1X + 1, leftY + 2.5);
  smallCheckbox('FIJO', frap.accidente_contra_objeto === 'fijo', col1X + 25, leftY);
  smallCheckbox('EN MOVIMIENTO', frap.accidente_contra_objeto === 'movimiento', col1X + 40, leftY);
  fieldLabel('IMPACTO:', col1X + 60, leftY + 2.5);
  leftY += 3;
  xPos = col1X + 2;
  smallCheckbox('FRONTAL', frap.accidente_impacto === 'frontal', col1X + 60, leftY);
  smallCheckbox('LATERAL', frap.accidente_impacto === 'lateral', col1X + 75, leftY);
  smallCheckbox('POSTERIOR', frap.accidente_impacto === 'posterior', col1X + 90, leftY);
  leftY += 4;
  
  fieldLabel('HUNDIMIENTO:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 22, leftY + 3, 10);
  fieldLabel('CMS', col1X + 34, leftY + 2.5);
  fieldLabel('PARABRISAS:', col1X + 45, leftY + 2.5);
  smallCheckbox('ROTO', frap.parabrisas_roto, col1X + 62, leftY);
  smallCheckbox('DOBLADO', frap.parabrisas_doblado, col1X + 75, leftY);
  leftY += 4;
  
  fieldLabel('VOLANTE:', col1X + 1, leftY + 2.5);
  smallCheckbox('INTRUSIÓN', frap.volante === 'intrusion', col1X + 18, leftY);
  smallCheckbox('DOBLADO', frap.volante === 'doblado', col1X + 35, leftY);
  fieldLabel('BOLSA DE AIRE:', col1X + 55, leftY + 2.5);
  smallCheckbox('SÍ', frap.bolsa_aire === 'si', col1X + 75, leftY);
  smallCheckbox('NO', frap.bolsa_aire === 'no', col1X + 85, leftY);
  leftY += 4;
  
  fieldLabel('CINTURÓN DE SEGURIDAD:', col1X + 1, leftY + 2.5);
  smallCheckbox('COLOCADO', frap.cinturon_seguridad === 'colocado', col1X + 35, leftY);
  smallCheckbox('NO COLOCADO', frap.cinturon_seguridad === 'no_colocado', col1X + 55, leftY);
  leftY += 3;
  fieldLabel('DENTRO DEL VEHÍCULO:', col1X + 1, leftY + 2.5);
  smallCheckbox('SÍ', frap.dentro_vehiculo === 'si', col1X + 32, leftY);
  smallCheckbox('NO', frap.dentro_vehiculo === 'no', col1X + 42, leftY);
  smallCheckbox('EYECTADO', frap.eyectado === 'si', col1X + 55, leftY);
  leftY += 4;
  
  fieldLabel('ATROPELLADO:', col1X + 1, leftY + 2.5);
  smallCheckbox('AUTOMOTOR', frap.atropellado === 'automotor', col1X + 22, leftY);
  smallCheckbox('MOTOCICLETA', frap.atropellado === 'motocicleta', col1X + 42, leftY);
  smallCheckbox('BICICLETA', frap.atropellado === 'bicicleta', col1X + 62, leftY);
  smallCheckbox('MAQUINARIA', frap.atropellado === 'maquinaria', col1X + 80, leftY);
  leftY += 3;
  fieldLabel('CASCO DE SEGURIDAD:', col1X + 1, leftY + 2.5);
  smallCheckbox('SÍ', frap.casco_seguridad === 'si', col1X + 32, leftY);
  smallCheckbox('NO', frap.casco_seguridad === 'no', col1X + 42, leftY);
  leftY += 6;
  
  // AGENTE CAUSAL
  leftY = sectionTitle('AGENTE CAUSAL', col1X, leftY, colW);
  leftY += 1;
  xPos = col1X + 2;
  xPos += smallCheckbox('ARMA', agentes.includes('arma'), xPos, leftY);
  xPos += smallCheckbox('MAQUINARIA', agentes.includes('maquinaria'), xPos, leftY);
  smallCheckbox('ELECTRICIDAD', agentes.includes('electricidad'), xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('JUGUETE', agentes.includes('juguete'), xPos, leftY);
  xPos += smallCheckbox('HERRAMIENTA', agentes.includes('herramienta'), xPos, leftY);
  smallCheckbox('EXPLOSIÓN', agentes.includes('explosion'), xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('AUTOMOTOR', agentes.includes('automotor'), xPos, leftY);
  xPos += smallCheckbox('FUEGO', agentes.includes('fuego'), xPos, leftY);
  smallCheckbox('SER HUMANO', agentes.includes('ser_humano'), xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('BICICLETA', agentes.includes('bicicleta'), xPos, leftY);
  xPos += smallCheckbox('SUSTANCIA CALIENTE', agentes.includes('producto_caliente'), xPos, leftY);
  smallCheckbox('ANIMAL', agentes.includes('animal'), xPos, leftY);
  leftY += 3;
  xPos = col1X + 2;
  xPos += smallCheckbox('PRODUCTO BIOLÓGICO', agentes.includes('sustancia_biologica'), xPos, leftY);
  smallCheckbox('SUSTANCIA TÓXICA', agentes.includes('sustancia_toxica'), xPos, leftY);
  smallCheckbox('OTRO', agentes.includes('otro'), col1X + colW - 15, leftY);
  leftY += 4;
  
  fieldLabel('ESPECIFIQUE:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 20, leftY + 3, colW - 22);
  leftY += 4;
  fieldLabel('LESIONES CAUSADAS POR:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 35, leftY + 3, colW - 37);
  leftY += 6;
  
  // DATOS DE LA MADRE
  leftY = sectionTitle('DATOS DE LA MADRE', col1X, leftY, colW);
  leftY += 1;
  fieldLabel('GESTA:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 12, leftY + 3, 8);
  fieldValue(frap.madre_gesta, col1X + 13, leftY + 2.5);
  fieldLabel('CESÁREAS:', col1X + 22, leftY + 2.5);
  fieldLine(col1X + 38, leftY + 3, 8);
  fieldValue(frap.madre_cesareas, col1X + 39, leftY + 2.5);
  fieldLabel('PARA:', col1X + 48, leftY + 2.5);
  fieldLine(col1X + 58, leftY + 3, 8);
  fieldValue(frap.madre_para, col1X + 59, leftY + 2.5);
  fieldLabel('ABORTOS:', col1X + 68, leftY + 2.5);
  fieldLine(col1X + 82, leftY + 3, 8);
  fieldValue(frap.madre_abortos, col1X + 83, leftY + 2.5);
  fieldLabel('FUM:', col1X + 92, leftY + 2.5);
  fieldLine(col1X + 98, leftY + 3, colW - 100);
  fieldValue(frap.madre_fum, col1X + 99, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('SEMANAS DE GESTACIÓN:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 35, leftY + 3, 10);
  fieldValue(frap.madre_semanas, col1X + 36, leftY + 2.5);
  fieldLabel('FECHA PROBABLE DE PARTO:', col1X + 50, leftY + 2.5);
  fieldLine(col1X + 82, leftY + 3, colW - 84);
  fieldValue(frap.madre_fecha_probable, col1X + 83, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('HORA INICIO CONTRACCIONES:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 42, leftY + 3, 15);
  fieldValue(frap.madre_hora_contracciones, col1X + 43, leftY + 2.5);
  fieldLabel('FRECUENCIA:', col1X + 60, leftY + 2.5);
  fieldLine(col1X + 78, leftY + 3, 8);
  fieldValue(frap.madre_frecuencia, col1X + 79, leftY + 2.5);
  fieldLabel('DURACIÓN:', col1X + 88, leftY + 2.5);
  fieldLine(col1X + 100, leftY + 3, colW - 102);
  fieldValue(frap.madre_duracion, col1X + 101, leftY + 2.5);
  leftY += 5;
  
  // DATOS POST-PARTO
  leftY = sectionTitle('DATOS POST-PARTO', col1X, leftY, colW);
  leftY += 1;
  fieldLabel('HORA DE NACIMIENTO:', col1X + 1, leftY + 2.5);
  fieldLine(col1X + 32, leftY + 3, 15);
  fieldValue(frap.postparto_hora_nacimiento, col1X + 33, leftY + 2.5);
  fieldLabel('LUGAR:', col1X + 50, leftY + 2.5);
  fieldLine(col1X + 62, leftY + 3, colW - 64);
  fieldValue(frap.postparto_lugar, col1X + 63, leftY + 2.5);
  leftY += 4;
  
  fieldLabel('PLACENTA EXPULSADA:', col1X + 1, leftY + 2.5);
  smallCheckbox('SÍ', frap.postparto_placenta, col1X + 32, leftY);
  smallCheckbox('NO', !frap.postparto_placenta, col1X + 42, leftY);
  
  // ────────────────────────────────────────────────────────────────
  // PÁGINA 2 - COLUMNA DERECHA
  // ────────────────────────────────────────────────────────────────
  
  // INTERROGATORIO
  rightY = sectionTitle('INTERROGATORIO', col2X, rightY, colW);
  rightY += 1;
  fieldLabel('ALERGIAS:', col2X + 1, rightY + 2.5);
  fieldLine(col2X + 18, rightY + 3, colW - 20);
  fieldValue(frap.alergias, col2X + 19, rightY + 2.5);
  rightY += 4;
  
  fieldLabel('MEDICAMENTOS QUE ESTÁ INGIRIENDO:', col2X + 1, rightY + 2.5);
  fieldLine(col2X + 52, rightY + 3, colW - 54);
  fieldValue(frap.medicamentos, col2X + 53, rightY + 2.5);
  rightY += 4;
  
  fieldLabel('ENFERMEDADES Y CIRUGÍAS PREVIAS:', col2X + 1, rightY + 2.5);
  fieldLine(col2X + 50, rightY + 3, colW - 52);
  fieldValue(frap.enfermedades_previas, col2X + 51, rightY + 2.5);
  rightY += 4;
  
  fieldLabel('HORA DE LA ÚLTIMA COMIDA:', col2X + 1, rightY + 2.5);
  fieldLine(col2X + 40, rightY + 3, colW - 42);
  fieldValue(frap.ultima_comida, col2X + 41, rightY + 2.5);
  rightY += 4;
  
  fieldLabel('EVENTOS PREVIOS RELACIONADOS:', col2X + 1, rightY + 2.5);
  fieldLine(col2X + 48, rightY + 3, colW - 50);
  fieldValue(frap.eventos_previos, col2X + 49, rightY + 2.5);
  rightY += 6;
  
  // OBSERVACIONES
  rightY = sectionTitle('OBSERVACIONES', col2X, rightY, colW);
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.2);
  doc.rect(col2X, rightY, colW, 20, 'S');
  
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  const obsLines = doc.splitTextToSize(frap.observaciones || '', colW - 4);
  doc.text(obsLines, col2X + 2, rightY + 3);
  rightY += 22;
  
  // ESCALA DE GLASGOW
  fieldLabel('ESCALA DE GLASGOW:', col2X + 1, rightY + 2.5);
  doc.rect(col2X + colW - 15, rightY - 1, 13, 5, 'S');
  fieldValue(frap.glasgow_total || '', col2X + colW - 12, rightY + 2);
  rightY += 6;
  
  // ESCALA PREHOSPITALARIA DE CINCINNATI
  rightY = sectionTitle('ESCALA PREHOSPITALARIA DE CINCINNATI', col2X, rightY, colW);
  rightY += 1;
  
  fieldLabel('ASIMETRÍA FACIAL', col2X + 2, rightY + 2.5);
  smallCheckbox('SÍ', frap.asimetria_facial === 'si', col2X + colW - 25, rightY);
  smallCheckbox('NO', frap.asimetria_facial === 'no', col2X + colW - 12, rightY);
  rightY += 3;
  fieldLabel('PARESIA DE LOS BRAZOS', col2X + 2, rightY + 2.5);
  smallCheckbox('SÍ', frap.paresia_brazos === 'si', col2X + colW - 25, rightY);
  smallCheckbox('NO', frap.paresia_brazos === 'no', col2X + colW - 12, rightY);
  rightY += 3;
  fieldLabel('ALTERACIÓN DEL LENGUAJE', col2X + 2, rightY + 2.5);
  smallCheckbox('SÍ', frap.alteracion_lenguaje === 'si', col2X + colW - 25, rightY);
  smallCheckbox('NO', frap.alteracion_lenguaje === 'no', col2X + colW - 12, rightY);
  rightY += 5;
  
  // ESCALA DE TRAUMA
  rightY = sectionTitle('ESCALA DE TRAUMA', col2X, rightY, colW);
  
  // Tabla de escala de trauma
  const traumaHeaders = ['(A)GCS', '(B) PAS', '(C)FR', '(D) Esfuerzo Respiratorio', '(E)Llenado Capilar', 'Puntuación'];
  const traumaColW = colW / 6;
  
  doc.setFillColor(...DARK_BLUE);
  doc.rect(col2X, rightY, colW, 4, 'F');
  doc.setFontSize(4.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  traumaHeaders.forEach((h, i) => {
    doc.text(h, col2X + (traumaColW * i) + traumaColW / 2, rightY + 2.8, { align: 'center' });
  });
  
  rightY += 4;
  
  // Filas de la escala de trauma (simplificada)
  const traumaRows = [
    ['14-15', '', '', '', '', '5'],
    ['11-13', '90 o +', '10-24', '', '', '4'],
    ['8-10', '70-89', '25-35', '', '', '3'],
    ['5-7', '50-69', '>35', 'normal', '', '2'],
    ['3-4', '0-49', '1-9', 'retracción', 'normal retardado', '1'],
    ['', '', '0-49', 'Puntuación', 'ausente', '0'],
  ];
  
  traumaRows.forEach((row, rowIndex) => {
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.2);
    doc.rect(col2X, rightY, colW, 4, 'S');
    
    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    row.forEach((cell, colIndex) => {
      doc.text(cell, col2X + (traumaColW * colIndex) + traumaColW / 2, rightY + 2.8, { align: 'center' });
      if (colIndex < 5) {
        doc.line(col2X + traumaColW * (colIndex + 1), rightY, col2X + traumaColW * (colIndex + 1), rightY + 4);
      }
    });
    rightY += 4;
  });
  
  fieldLabel('Puntuación Total:', col2X + colW - 40, rightY + 3);
  fieldLabel('A+B+C+D+E', col2X + colW - 20, rightY + 3);
  doc.rect(col2X + colW - 10, rightY, 8, 5, 'S');
  fieldValue(frap.trauma_total || '', col2X + colW - 8, rightY + 3.5);
  rightY += 8;
  
  // DATOS RECIÉN NACIDO
  rightY = sectionTitle('DATOS RECIÉN NACIDO', col2X, rightY, colW / 2 - 2);
  doc.setFillColor(...BLUE);
  doc.rect(col2X + colW / 2, rightY - 5, colW / 2, 4.5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('DESTINO', col2X + colW / 2 + 2, rightY - 1.8);
  
  rightY += 1;
  fieldLabel('PRODUCTO:', col2X + 2, rightY + 2.5);
  smallCheckbox('VIVO', frap.recien_nacido_producto === 'vivo', col2X + 20, rightY);
  smallCheckbox('MUERTO', frap.recien_nacido_producto === 'muerto', col2X + 35, rightY);
  
  smallCheckbox('TRASLADADO', frap.recien_nacido_destino === 'trasladado', col2X + colW / 2 + 2, rightY);
  rightY += 3;
  
  fieldLabel('SEXO:', col2X + 2, rightY + 2.5);
  smallCheckbox('MASC', frap.recien_nacido_sexo === 'masculino', col2X + 15, rightY);
  smallCheckbox('FEM', frap.recien_nacido_sexo === 'femenino', col2X + 30, rightY);
  
  smallCheckbox('NO TRASLADADO', frap.recien_nacido_destino === 'no_trasladado', col2X + colW / 2 + 2, rightY);
  rightY += 3;
  
  fieldLabel('APGAR:', col2X + 2, rightY + 2.5);
  smallCheckbox('FUGA', frap.recien_nacido_destino === 'fuga', col2X + colW / 2 + 2, rightY);
  rightY += 3;
  
  doc.rect(col2X + 15, rightY - 3, 8, 4, 'S');
  doc.rect(col2X + 25, rightY - 3, 8, 4, 'S');
  doc.rect(col2X + 35, rightY - 3, 8, 4, 'S');
  doc.setFontSize(5);
  doc.text('1 MIN', col2X + 16, rightY + 3);
  doc.text('5 MIN', col2X + 26, rightY + 3);
  doc.text('10 MIN', col2X + 35.5, rightY + 3);
  fieldValue(frap.recien_nacido_apgar_1 || '', col2X + 17, rightY - 0.5);
  fieldValue(frap.recien_nacido_apgar_5 || '', col2X + 27, rightY - 0.5);
  fieldValue(frap.recien_nacido_apgar_10 || '', col2X + 37, rightY - 0.5);
  
  fieldLabel('PRODUCTO:', col2X + 2, rightY + 6);
  doc.rect(col2X + 18, rightY + 3, 8, 4, 'S');
  doc.rect(col2X + 28, rightY + 3, 8, 4, 'S');
  doc.rect(col2X + 38, rightY + 3, 8, 4, 'S');
  rightY += 12;
  
  // ================================================================
  // SECCIÓN DE FIRMAS Y CONSENTIMIENTOS
  // ================================================================
  
  // NEGATIVA A RECIBIR ATENCIÓN
  const negY = Math.max(leftY, rightY) + 5;
  
  leftY = sectionTitle('NEGATIVA A RECIBIR ATENCIÓN/ SER TRASLADADO EXIMENTE DE RESPONSABILIDAD', mx, negY, cw / 2 - 2);
  
  doc.setFontSize(4.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  const negText = 'DECLARO QUE NO ACEPTO LAS RECOMENDACIONES DEL PERSONAL DE LA AMBULANCIA DEL CUERPO DE RESCATE EN CUANTO AL (TRATAMIENTO) Y/O (TRASLADO) A UN HOSPITAL; POR LO QUE EXIMO A EL CUERPO DE RESCATE Y A DICHAS PERSONAS DE TODA RESPONSABILIDAD QUE PUDIERA DERIVAR AL HABER RESPETADO Y CUMPLIDO MI DECISIÓN.';
  const negLines = doc.splitTextToSize(negText, cw / 2 - 6);
  doc.text(negLines, mx + 2, leftY + 2);
  leftY += 12;
  
  // Línea para firma
  doc.setDrawColor(...BLACK);
  fieldLine(mx + 10, leftY + 8, 35);
  fieldLine(mx + 55, leftY + 8, 35);
  doc.setFontSize(5);
  doc.text('NOMBRE/FIRMA DEL PACIENTE', mx + 12, leftY + 11);
  doc.text('NOMBRE/FIRMA DEL TESTIGO', mx + 57, leftY + 11);
  
  // CONSENTIMIENTO INFORMADO
  rightY = negY;
  rightY = sectionTitle('CONSENTIMIENTO INFORMADO', mx + cw / 2 + 2, rightY, cw / 2 - 2);
  
  doc.setFontSize(4.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  const consText = 'PREVIO A UNA DETALLADA EXPLICACIÓN DOY MI CONSENTIMIENTO A SER TRASLADADO Y/O ATENDIDO POR EL PERSONAL DEL CUERPO DE RESCATE A.C.';
  const consLines = doc.splitTextToSize(consText, cw / 2 - 6);
  doc.text(consLines, mx + cw / 2 + 4, rightY + 2);
  rightY += 8;
  
  fieldLine(mx + cw / 2 + 10, rightY + 8, 35);
  fieldLine(mx + cw / 2 + 55, rightY + 8, 35);
  doc.setFontSize(5);
  doc.text('NOMBRE/FIRMA DEL PACIENTE', mx + cw / 2 + 12, rightY + 11);
  doc.text('NOMBRE/FIRMA DE FAMILIAR O TUTOR', mx + cw / 2 + 52, rightY + 11);
  
  // AUTORIDADES QUE INTERVINIERON
  const authY = leftY + 15;
  sectionTitle('AUTORIDADES QUE INTERVINIERON', mx + cw / 2 + 2, authY, cw / 2 - 2);
  
  fieldLabel('ENTREGA PACIENTE', mx + cw / 2 + 4, authY + 8);
  fieldLine(mx + cw / 2 + 30, authY + 8.5, 30);
  doc.setFontSize(5);
  doc.text('NOMBRE Y FIRMA', mx + cw / 2 + 40, authY + 11);
  
  fieldLabel('MÉDICO QUE RECIBE', mx + cw / 2 + 4, authY + 16);
  fieldLine(mx + cw / 2 + 30, authY + 16.5, 30);
  doc.text('NOMBRE Y FIRMA', mx + cw / 2 + 40, authY + 19);
  
  // Firmas digitales si existen
  if (frap.firmas) {
    const firmaY = authY + 25;
    if (frap.firmas.paciente) {
      try {
        doc.addImage(frap.firmas.paciente, 'PNG', mx + 15, leftY + 1, 25, 7);
      } catch (e) {}
    }
    if (frap.firmas.testigo) {
      try {
        doc.addImage(frap.firmas.testigo, 'PNG', mx + 60, leftY + 1, 25, 7);
      } catch (e) {}
    }
    if (frap.firmas.familiar_tutor) {
      try {
        doc.addImage(frap.firmas.familiar_tutor, 'PNG', mx + cw / 2 + 60, rightY + 1, 25, 7);
      } catch (e) {}
    }
    if (frap.firmas.entrega_paciente) {
      try {
        doc.addImage(frap.firmas.entrega_paciente, 'PNG', mx + cw / 2 + 35, authY + 1, 20, 6);
      } catch (e) {}
    }
    if (frap.firmas.medico_recibe) {
      try {
        doc.addImage(frap.firmas.medico_recibe, 'PNG', mx + cw / 2 + 35, authY + 9, 20, 6);
      } catch (e) {}
    }
  }
  
  // Información de creación al pie
  const footerY = ph - 8;
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 128, 128);
  doc.text(`Creado por: ${frap.created_by_name || '—'}  •  Fecha: ${frap.created_at ? new Date(frap.created_at).toLocaleString('es-MX') : '—'}`, pw / 2, footerY, { align: 'center' });
  doc.text('FRAP – Formulario de Rescate y Atención Prehospitalaria • Cuerpo de Rescate de Ensenada, A.C.', pw / 2, footerY + 3, { align: 'center' });
  
  // Añadir número de página a ambas páginas
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(6);
    doc.setTextColor(100, 100, 100);
    doc.text(`Página ${i} de ${totalPages}`, pw - mx - 5, ph - 3, { align: 'right' });
  }

  // ── Descargar ──
  doc.save(`FRAP_${frap.folio || 'SinFolio'}.pdf`);
};
