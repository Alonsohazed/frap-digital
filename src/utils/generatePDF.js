import jsPDF from 'jspdf';
import 'jspdf-autotable';

// ─── Colores corporativos VERDE ───────────────────────────────
const DARK_GREEN = [0, 100, 60];
const GREEN = [0, 128, 80];
const LIGHT_GREEN = [0, 150, 100];
const BLACK = [0, 0, 0];
const WHITE = [255, 255, 255];
const GRAY = [100, 100, 100];
const LIGHT_GRAY = [200, 200, 200];

export const generateFRAPPDF = async (frap) => {
  const doc = new jsPDF('p', 'mm', 'letter');
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const mx = 5;
  const my = 5;
  const cw = pw - mx * 2;
  const colW = cw / 2 - 2;
  const col1X = mx;
  const col2X = mx + colW + 4;
  
  // ── Cargar logo ──
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
  // HELPERS - Estética mejorada
  // ================================================================
  
  // Título de sección con fondo verde
  const sectionTitle = (title, x, y, width) => {
    doc.setFillColor(...GREEN);
    doc.rect(x, y, width, 5, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(title, x + 2, y + 3.5);
    return y + 8;  // Aumentado de 6 a 8 para dar más espacio al contenido
  };

  // Etiqueta de campo (alineación mejorada)
  const label = (text, x, y) => {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLACK);
    doc.text(text, x, y);
    return doc.getTextWidth(text);
  };

  // Valor de campo
  const value = (text, x, y, maxW = null) => {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    const val = String(text || '');
    if (maxW && val) {
      const lines = doc.splitTextToSize(val, maxW);
      doc.text(lines, x, y);
      return lines.length * 3;
    }
    doc.text(val, x, y);
    return 3;
  };

  // Línea para escribir
  const line = (x, y, width) => {
    doc.setDrawColor(...LIGHT_GRAY);
    doc.setLineWidth(0.3);
    doc.line(x, y, x + width, y);
  };

  // Checkbox ALINEADA (el checkbox y texto quedan a la misma altura)
  const checkbox = (text, checked, x, y, size = 3) => {
    // Dibujar el cuadro
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.2);
    doc.rect(x, y - size + 0.8, size, size);
    
    // Si está marcado, rellenar con verde
    if (checked) {
      doc.setFillColor(...GREEN);
      doc.rect(x + 0.4, y - size + 1.2, size - 0.8, size - 0.8, 'F');
    }
    
    // Texto alineado al centro vertical del checkbox
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BLACK);
    doc.text(text, x + size + 1, y);
    
    return size + 1 + doc.getTextWidth(text) + 2;
  };

  // Dibujar cuerpo humano PROFESIONAL
  const drawBodyDiagram = (x, y, w, h) => {
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.4);
    
    // Marco exterior
    doc.setFillColor(255, 255, 255);
    doc.rect(x, y, w, h, 'FD');
    
    const cx = x + w / 2;
    const scale = Math.min(w / 70, h / 100);
    const startY = y + 8;
    
    doc.setLineWidth(0.5);
    
    // CABEZA - círculo más definido
    doc.circle(cx, startY + 7 * scale, 6 * scale, 'S');
    
    // CUELLO
    doc.setLineWidth(0.4);
    doc.line(cx - 3 * scale, startY + 13 * scale, cx - 3 * scale, startY + 17 * scale);
    doc.line(cx + 3 * scale, startY + 13 * scale, cx + 3 * scale, startY + 17 * scale);
    
    // HOMBROS
    doc.line(cx - 3 * scale, startY + 17 * scale, cx - 14 * scale, startY + 20 * scale);
    doc.line(cx + 3 * scale, startY + 17 * scale, cx + 14 * scale, startY + 20 * scale);
    
    // TORSO - rectángulo con lados curvados
    doc.line(cx - 14 * scale, startY + 20 * scale, cx - 12 * scale, startY + 45 * scale);
    doc.line(cx + 14 * scale, startY + 20 * scale, cx + 12 * scale, startY + 45 * scale);
    
    // CINTURA
    doc.line(cx - 12 * scale, startY + 45 * scale, cx - 10 * scale, startY + 50 * scale);
    doc.line(cx + 12 * scale, startY + 45 * scale, cx + 10 * scale, startY + 50 * scale);
    
    // CADERA
    doc.line(cx - 10 * scale, startY + 50 * scale, cx - 4 * scale, startY + 52 * scale);
    doc.line(cx + 10 * scale, startY + 50 * scale, cx + 4 * scale, startY + 52 * scale);
    
    // BRAZOS IZQUIERDO
    doc.line(cx - 14 * scale, startY + 20 * scale, cx - 20 * scale, startY + 35 * scale); // brazo
    doc.line(cx - 20 * scale, startY + 35 * scale, cx - 22 * scale, startY + 50 * scale); // antebrazo
    // Mano izquierda
    doc.ellipse(cx - 23 * scale, startY + 53 * scale, 2.5 * scale, 3 * scale, 'S');
    
    // BRAZOS DERECHO
    doc.line(cx + 14 * scale, startY + 20 * scale, cx + 20 * scale, startY + 35 * scale); // brazo
    doc.line(cx + 20 * scale, startY + 35 * scale, cx + 22 * scale, startY + 50 * scale); // antebrazo
    // Mano derecha
    doc.ellipse(cx + 23 * scale, startY + 53 * scale, 2.5 * scale, 3 * scale, 'S');
    
    // PIERNA IZQUIERDA
    doc.line(cx - 4 * scale, startY + 52 * scale, cx - 8 * scale, startY + 75 * scale); // muslo
    doc.line(cx - 8 * scale, startY + 75 * scale, cx - 7 * scale, startY + 90 * scale); // pierna
    // Pie izquierdo
    doc.ellipse(cx - 7 * scale, startY + 93 * scale, 4 * scale, 2 * scale, 'S');
    
    // PIERNA DERECHA
    doc.line(cx + 4 * scale, startY + 52 * scale, cx + 8 * scale, startY + 75 * scale); // muslo
    doc.line(cx + 8 * scale, startY + 75 * scale, cx + 7 * scale, startY + 90 * scale); // pierna
    // Pie derecho
    doc.ellipse(cx + 7 * scale, startY + 93 * scale, 4 * scale, 2 * scale, 'S');
    
    // Línea central del torso (división anatómica)
    doc.setLineWidth(0.2);
    doc.setDrawColor(...LIGHT_GRAY);
    doc.line(cx, startY + 17 * scale, cx, startY + 52 * scale);
    
    // Etiqueta
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLACK);
    doc.text('ANTERIOR', cx, y + h - 2, { align: 'center' });
  };

  // Dibujar pupilas profesionales
  const drawPupilas = (x, y) => {
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLACK);
    doc.text('PUPILAS', x, y);
    
    // Ojo derecho
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.4);
    doc.circle(x + 8, y + 10, 6, 'S');
    doc.circle(x + 8, y + 10, 2, 'S'); // pupila
    doc.setFontSize(5);
    doc.text('D', x + 6, y + 20);
    
    // Ojo izquierdo
    doc.circle(x + 25, y + 10, 6, 'S');
    doc.circle(x + 25, y + 10, 2, 'S'); // pupila
    doc.text('I', x + 24, y + 20);
  };

  // Campo con etiqueta y valor en línea
  const fieldRow = (labelText, valueText, x, y, labelW, valueW) => {
    label(labelText, x, y);
    line(x + labelW, y + 0.5, valueW);
    if (valueText) value(valueText, x + labelW + 1, y);
    return 4;
  };

  // ================================================================
  // PÁGINA 1
  // ================================================================
  let y = my;
  
  // ── ENCABEZADO ──
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', mx, y, 18, 18);
  } else {
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(1);
    doc.circle(mx + 9, y + 9, 8, 'S');
  }
  
  // Título en VERDE
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GREEN);
  doc.text('CUERPO DE RESCATE DE ENSENADA, A.C.', mx + 22, y + 6);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BLACK);
  doc.text('Calle Magnolias No. 2356', mx + 22, y + 10);
  doc.text('Col. Márquez de León, Ensenada, B.C.', mx + 22, y + 13);
  doc.text('Tels. 176-8033 y 177-9992', mx + 22, y + 16);
  
  // Fecha y Folio
  const folioX = pw - mx - 45;
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.5);
  doc.rect(folioX, y, 43, 18, 'S');
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BLACK);
  doc.text('FECHA:', folioX + 2, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(frap.fecha || '', folioX + 15, y + 5);
  
  doc.setFont('helvetica', 'bold');
  doc.text('# FOLIO:', folioX + 2, y + 12);
  doc.setFontSize(14);
  doc.setTextColor(...GREEN);
  doc.text(frap.folio || '', folioX + 18, y + 13);
  
  y += 20;
  
  // ── TABLA DE HORAS ──
  const horaHeaders = ['HORA LLAMADA', 'HORA SALIDA', 'HORA LLEGADA', 'HORA TRASLADO', 'HORA HOSPITAL', 'HORA BASE'];
  const horaW = cw / 6;
  
  doc.setFillColor(...GREEN);
  doc.rect(mx, y, cw, 5, 'F');
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  horaHeaders.forEach((h, i) => {
    doc.text(h, mx + horaW * i + horaW / 2, y + 3.5, { align: 'center' });
  });
  
  y += 5;
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.3);
  doc.rect(mx, y, cw, 6, 'S');
  
  const horaValues = [
    frap.hora_llamada || '', frap.hora_salida || '', frap.hora_llegada_traslado || '',
    frap.hora_traslado || '', frap.hora_llegada_hospital || '', frap.hora_llegada_base || ''
  ];
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BLACK);
  horaValues.forEach((v, i) => {
    if (i > 0) doc.line(mx + horaW * i, y, mx + horaW * i, y + 6);
    doc.text(v, mx + horaW * i + horaW / 2, y + 4, { align: 'center' });
  });
  
  y += 8;
  
  // ════════════════════════════════════════════════════════════════
  // DOS COLUMNAS
  // ════════════════════════════════════════════════════════════════
  let leftY = y;
  let rightY = y;
  
  // ─────────────────────────────────────────────────────────────────
  // COLUMNA IZQUIERDA
  // ─────────────────────────────────────────────────────────────────
  
  // MOTIVO DE LA ATENCIÓN
  leftY = sectionTitle('MOTIVO DE LA ATENCIÓN', col1X, leftY + 2, colW);
  let xPos = col1X + 2;
  xPos += checkbox('TRASLADO PROGRAMADO', frap.motivo_atencion === 'traslado_programado', xPos, leftY + 1);
  xPos += checkbox('ENFERMEDAD', frap.motivo_atencion === 'enfermedad', xPos, leftY + 1);
  xPos += checkbox('TRAUMATISMO', frap.motivo_atencion === 'traumatismo', xPos, leftY + 1);
  checkbox('GINECOOBSTÉTRICO', frap.motivo_atencion === 'gineco', xPos, leftY + 1);
  leftY += 5;
  
  // UBICACIÓN DEL SERVICIO
  // UBICACIÓN DEL SERVICIO
  leftY = sectionTitle('UBICACIÓN DEL SERVICIO', col1X, leftY + 2, colW);
  leftY += fieldRow('CALLE:', frap.ubicacion_calle, col1X + 2, leftY, 12, colW - 16);
  leftY += fieldRow('ENTRE:', frap.ubicacion_entre, col1X + 2, leftY, 12, colW - 16);
  leftY += fieldRow('COLONIA/COMUNIDAD:', frap.ubicacion_colonia, col1X + 2, leftY, 32, colW - 36);
  leftY += fieldRow('DELEGACIÓN POLÍTICA/MUNICIPIO:', frap.ubicacion_delegacion, col1X + 2, leftY, 48, colW - 52);
  
  leftY += 1;
  label('LUGAR DE OCURRENCIA:', col1X + 2, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('HOGAR', frap.lugar_ocurrencia === 'hogar', xPos, leftY);
  xPos += checkbox('VÍA PÚBLICA', frap.lugar_ocurrencia === 'via_publica', xPos, leftY);
  xPos += checkbox('TRABAJO', frap.lugar_ocurrencia === 'trabajo', xPos, leftY);
  checkbox('ESCUELA', frap.lugar_ocurrencia === 'escuela', xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('RECREACIÓN Y DEPORTE', frap.lugar_ocurrencia === 'recreacion', xPos, leftY);
  xPos += checkbox('TRANSPORTE PÚBLICO', frap.lugar_ocurrencia === 'transporte', xPos, leftY);
  checkbox('OTRA', frap.lugar_ocurrencia === 'otro', xPos, leftY);
  leftY += 5;
  
  label('NÚMERO DE AMBULANCIA:', col1X + 2, leftY);
  doc.setDrawColor(...GREEN);
  doc.rect(col1X + 40, leftY - 3, 12, 5, 'S');
  value(frap.numero_ambulancia || '', col1X + 42, leftY);
  leftY += 5;
  
  leftY += fieldRow('OPERADOR:', frap.operador, col1X + 2, leftY, 18, colW - 22);
  leftY += fieldRow('PRESTADORES DEL SERVICIO:', frap.prestadores_servicio, col1X + 2, leftY, 42, colW - 46);
  
  // NOMBRE DEL PACIENTE
  leftY = sectionTitle('NOMBRE DEL PACIENTE', col1X, leftY + 1, colW);
  line(col1X + 2, leftY + 0.5, colW - 4);
  value(frap.nombre_paciente, col1X + 3, leftY);
  leftY += 4;
  
  leftY += fieldRow('NOMBRE DEL ACOMPAÑANTE:', frap.nombre_acompanante, col1X + 2, leftY, 42, colW - 46);
  leftY += 2;
  
  // SEXO y EDAD
  label('SEXO:', col1X + 2, leftY);
  doc.rect(col1X + 14, leftY - 3, 8, 5, 'S');
  doc.rect(col1X + 24, leftY - 3, 8, 5, 'S');
  if (frap.sexo === 'masculino') {
    doc.setFontSize(8);
    doc.text('M', col1X + 16.5, leftY);
  }
  if (frap.sexo === 'femenino') {
    doc.setFontSize(8);
    doc.text('F', col1X + 27, leftY);
  }
  doc.setFontSize(5);
  doc.text('MASC.', col1X + 14.5, leftY + 3);
  doc.text('FEM.', col1X + 25, leftY + 3);
  
  label('EDAD:', col1X + 38, leftY);
  doc.rect(col1X + 48, leftY - 3, 12, 5, 'S');
  doc.rect(col1X + 62, leftY - 3, 12, 5, 'S');
  value(frap.edad_anos || '', col1X + 51, leftY);
  value(frap.edad_meses || '', col1X + 65, leftY);
  doc.setFontSize(5);
  doc.text('AÑOS', col1X + 76, leftY - 1);
  doc.text('MESES', col1X + 76, leftY + 2);
  leftY += 7;
  
  leftY += fieldRow('DOMICILIO:', frap.domicilio, col1X + 2, leftY, 18, colW - 22);
  leftY += fieldRow('COLONIA/COMUNIDAD:', frap.colonia_paciente, col1X + 2, leftY, 32, colW - 36);
  leftY += fieldRow('DELEGACIÓN POLÍTICA/MUNICIPIO:', frap.delegacion_paciente, col1X + 2, leftY, 48, colW - 52);
  
  label('TELÉFONO:', col1X + 2, leftY);
  line(col1X + 18, leftY + 0.5, 25);
  value(frap.telefono, col1X + 19, leftY);
  label('OCUPACIÓN:', col1X + 48, leftY);
  line(col1X + 65, leftY + 0.5, colW - 68);
  value(frap.ocupacion, col1X + 66, leftY);
  leftY += 4;
  
  leftY += fieldRow('DERECHOHABIENTE A:', frap.derechohabiente, col1X + 2, leftY, 32, colW - 36);
  leftY += fieldRow('COMPAÑÍA DE SEGUROS GASTOS MÉDICOS:', frap.compania_seguros, col1X + 2, leftY, 58, colW - 62);
  
  // ORIGEN PROBABLE
  leftY = sectionTitle('ORIGEN PROBABLE', col1X, leftY + 1, colW);
  const origenes = frap.origen_probable || [];
  xPos = col1X + 2;
  xPos += checkbox('NEUROLOGÍA', origenes.includes('neurologia'), xPos, leftY);
  xPos += checkbox('DIGESTIVA', origenes.includes('digestiva'), xPos, leftY);
  checkbox('INTOXICACIÓN', origenes.includes('intoxicacion'), xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('CARDIOVASCULAR', origenes.includes('cardiovascular'), xPos, leftY);
  xPos += checkbox('UROGENITAL', origenes.includes('urogenital'), xPos, leftY);
  checkbox('INFECCIOSA', origenes.includes('infecciosa'), xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('RESPIRATORIO', origenes.includes('respiratorio'), xPos, leftY);
  xPos += checkbox('GINECO-OBSTÉTRICA', origenes.includes('gineco'), xPos, leftY);
  checkbox('ONCOLÓGICO', origenes.includes('oncologico'), xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('METABÓLICO', origenes.includes('metabolico'), xPos, leftY);
  xPos += checkbox('COGNITIVO EMOCIONAL', origenes.includes('cognitivo'), xPos, leftY);
  checkbox('OTRO', origenes.includes('otro'), xPos, leftY);
  leftY += 4;
  
  leftY += fieldRow('ESPECIFIQUE:', frap.origen_probable_otro, col1X + 2, leftY, 20, colW - 24);
  
  label('1A VEZ:', col1X + 2, leftY);
  doc.rect(col1X + 16, leftY - 3, 6, 4, 'S');
  label('SUBSECUENTE:', col1X + 30, leftY);
  doc.rect(col1X + 52, leftY - 3, 6, 4, 'S');
  leftY += 5;
  
  // ACCIDENTE AUTOMOVILÍSTICO
  // ACCIDENTE AUTOMOVILÍSTICO
  leftY = sectionTitle('ACCIDENTE AUTOMOVILÍSTICO', col1X, leftY + 3, colW);
  xPos = col1X + 2;
  xPos += checkbox('COLISIÓN', frap.accidente_colision === 'colision', xPos, leftY);
  doc.rect(xPos - 1, leftY - 2.2, 3, 3, 'S');
  xPos += 8;
  xPos += checkbox('VOLCADURA', frap.accidente_colision === 'volcadura', xPos, leftY);
  doc.rect(xPos - 1, leftY - 2.2, 3, 3, 'S');
  leftY += 4;
  
  xPos = col1X + 2;
  xPos += checkbox('AUTOMOTOR', frap.accidente_colision === 'automotor', xPos, leftY);
  xPos += checkbox('MOTOCICLETA', frap.accidente_colision === 'motocicleta', xPos, leftY);
  xPos += checkbox('BICICLETA', frap.accidente_colision === 'bicicleta', xPos, leftY);
  checkbox('MAQUINARIA', frap.accidente_colision === 'maquinaria', xPos, leftY);
  leftY += 5;
  
  label('CONTRA OBJETO:', col1X + 2, leftY);
  xPos = col1X + 28;
  xPos += checkbox('FIJO', frap.accidente_contra_objeto === 'fijo', xPos, leftY);
  checkbox('EN MOVIMIENTO', frap.accidente_contra_objeto === 'movimiento', xPos, leftY);
  
  label('IMPACTO:', col1X + colW / 2 + 10, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('FRONTAL', frap.accidente_impacto === 'frontal', xPos, leftY);
  xPos += checkbox('LATERAL', frap.accidente_impacto === 'lateral', xPos, leftY);
  checkbox('POSTERIOR', frap.accidente_impacto === 'posterior', xPos, leftY);
  leftY += 5;
  
  label('HUNDIMIENTO:', col1X + 2, leftY);
  line(col1X + 24, leftY + 0.5, 12);
  label('CMS', col1X + 38, leftY);
  label('PARABRISAS:', col1X + 48, leftY);
  xPos = col1X + 68;
  xPos += checkbox('ROTO', frap.parabrisas_roto, xPos, leftY);
  checkbox('DOBLADO', frap.parabrisas_doblado, xPos, leftY);
  leftY += 4;
  
  label('VOLANTE:', col1X + 2, leftY);
  xPos = col1X + 18;
  xPos += checkbox('INTRUSIÓN', frap.volante === 'intrusion', xPos, leftY);
  checkbox('DOBLADO', frap.volante === 'doblado', xPos, leftY);
  label('BOLSA DE AIRE:', col1X + colW / 2 + 5, leftY);
  xPos = col1X + colW / 2 + 30;
  xPos += checkbox('SÍ', frap.bolsa_aire === 'si', xPos, leftY);
  checkbox('NO', frap.bolsa_aire === 'no', xPos, leftY);
  leftY += 4;
  
  label('CINTURÓN DE SEGURIDAD:', col1X + 2, leftY);
  xPos = col1X + 40;
  xPos += checkbox('COLOCADO', frap.cinturon_seguridad === 'colocado', xPos, leftY);
  checkbox('NO COLOCADO', frap.cinturon_seguridad === 'no_colocado', xPos, leftY);
  leftY += 4;
  
  label('DENTRO DEL VEHÍCULO:', col1X + 2, leftY);
  xPos = col1X + 38;
  xPos += checkbox('SÍ', frap.dentro_vehiculo === 'si', xPos, leftY);
  xPos += checkbox('NO', frap.dentro_vehiculo === 'no', xPos, leftY);
  checkbox('EYECTADO', frap.eyectado === 'si', xPos, leftY);
  leftY += 4;
  
  label('ATROPELLADO:', col1X + 2, leftY);
  xPos = col1X + 25;
  xPos += checkbox('AUTOMOTOR', frap.atropellado === 'automotor', xPos, leftY);
  xPos += checkbox('MOTOCICLETA', frap.atropellado === 'motocicleta', xPos, leftY);
  xPos += checkbox('BICICLETA', frap.atropellado === 'bicicleta', xPos, leftY);
  checkbox('MAQUINARIA', frap.atropellado === 'maquinaria', xPos, leftY);
  leftY += 4;
  
  label('CASCO DE SEGURIDAD:', col1X + 2, leftY);
  xPos = col1X + 38;
  xPos += checkbox('SÍ', frap.casco_seguridad === 'si', xPos, leftY);
  checkbox('NO', frap.casco_seguridad === 'no', xPos, leftY);
  leftY += 5;
  
  // AGENTE CAUSAL
  leftY = sectionTitle('AGENTE CAUSAL', col1X, leftY + 3, colW);
  const agentes = frap.agente_causal || [];
  xPos = col1X + 2;
  xPos += checkbox('ARMA', agentes.includes('arma'), xPos, leftY);
  xPos += checkbox('MAQUINARIA', agentes.includes('maquinaria'), xPos, leftY);
  checkbox('ELECTRICIDAD', agentes.includes('electricidad'), xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('JUGUETE', agentes.includes('juguete'), xPos, leftY);
  xPos += checkbox('HERRAMIENTA', agentes.includes('herramienta'), xPos, leftY);
  checkbox('EXPLOSIÓN', agentes.includes('explosion'), xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('AUTOMOTOR', agentes.includes('automotor'), xPos, leftY);
  xPos += checkbox('FUEGO', agentes.includes('fuego'), xPos, leftY);
  checkbox('SER HUMANO', agentes.includes('ser_humano'), xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('BICICLETA', agentes.includes('bicicleta'), xPos, leftY);
  xPos += checkbox('SUSTANCIA CALIENTE', agentes.includes('producto_caliente'), xPos, leftY);
  checkbox('ANIMAL', agentes.includes('animal'), xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('PRODUCTO BIOLÓGICO', agentes.includes('sustancia_biologica'), xPos, leftY);
  xPos += checkbox('SUSTANCIA TÓXICA', agentes.includes('sustancia_toxica'), xPos, leftY);
  checkbox('OTRO', agentes.includes('otro'), xPos, leftY);
  leftY += 4;
  
  leftY += fieldRow('ESPECIFIQUE:', frap.agente_causal_otro, col1X + 2, leftY, 20, colW - 24);
  leftY += fieldRow('LESIONES CAUSADAS POR:', frap.lesiones_causadas_por, col1X + 2, leftY, 38, colW - 42);

  // ─────────────────────────────────────────────────────────────────
  // COLUMNA DERECHA
  // ─────────────────────────────────────────────────────────────────
  
  // NIVEL DE CONCIENCIA
  rightY = sectionTitle('NIVEL DE CONCIENCIA', col2X, rightY, colW);
  xPos = col2X + 2;
  checkbox('CONSCIENTE', frap.nivel_conciencia === 'consciente', xPos, rightY);
  
  label('VÍA AÉREA:', col2X + colW / 2, rightY);
  checkbox('PERMEABLE', frap.via_aerea === 'permeable', col2X + colW / 2 + 18, rightY);
  checkbox('COMPROMETIDA', frap.via_aerea === 'comprometida', col2X + colW - 25, rightY);
  rightY += 4;
  
  checkbox('RESPUESTA A ESTÍMULO VERBAL', frap.nivel_conciencia === 'resp_verbal', col2X + 2, rightY);
  label('REFLEJO DE DEGLUCIÓN:', col2X + colW / 2, rightY);
  checkbox('AUSENTE', frap.reflejo_deglucion === 'ausente', col2X + colW - 18, rightY);
  rightY += 4;
  
  checkbox('RESPUESTA A ESTÍMULO DOLOROSO', frap.nivel_conciencia === 'resp_dolor', col2X + 2, rightY);
  checkbox('PRESENTE', frap.reflejo_deglucion === 'presente', col2X + colW - 18, rightY);
  rightY += 4;
  
  checkbox('INCONSCIENTE', frap.nivel_conciencia === 'inconsciente', col2X + 2, rightY);
  rightY += 5;
  
  // VENTILACIÓN / AUSCULTACIÓN
  doc.setFillColor(...GREEN);
  doc.rect(col2X, rightY, colW / 2 - 1, 5, 'F');
  doc.rect(col2X + colW / 2 + 1, rightY, colW / 2 - 1, 5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('VENTILACIÓN', col2X + 2, rightY + 3.5);
  doc.text('AUSCULTACIÓN', col2X + colW / 2 + 3, rightY + 3.5);
  rightY += 6;
  
  checkbox('AUTOMATISMO REGULAR', frap.ventilacion === 'automatismo_regular', col2X + 2, rightY);
  checkbox('RUIDOS RESP. NORMALES', frap.auscultacion === 'normales', col2X + colW / 2 + 2, rightY);
  rightY += 4;
  checkbox('AUTOMATISMO IRREGULAR', frap.ventilacion === 'automatismo_irregular', col2X + 2, rightY);
  checkbox('RUIDOS RESP. DISMINUIDOS', frap.auscultacion === 'disminuidos', col2X + colW / 2 + 2, rightY);
  rightY += 4;
  checkbox('VENTILACIÓN RÁPIDA', frap.ventilacion === 'rapida', col2X + 2, rightY);
  checkbox('RUIDOS RESP. AUSENTES', frap.auscultacion === 'ausentes', col2X + colW / 2 + 2, rightY);
  rightY += 4;
  checkbox('VENTILACIÓN SUPERFICIAL', frap.ventilacion === 'superficial', col2X + 2, rightY);
  rightY += 4;
  checkbox('APNEA', frap.ventilacion === 'apnea', col2X + 2, rightY);
  
  label('NEUMOTÓRAX:', col2X + colW / 2 + 2, rightY);
  checkbox('DERECHO', frap.neumotorax === 'derecho', col2X + colW - 22, rightY);
  rightY += 4;
  label('SITIO:', col2X + colW / 2 + 2, rightY);
  checkbox('APICAL', frap.sitio_neumotorax === 'apical', col2X + colW / 2 + 14, rightY);
  checkbox('BASE', frap.sitio_neumotorax === 'base', col2X + colW - 12, rightY);
  rightY += 5;
  
  // CIRCULACIÓN
  rightY = sectionTitle('CIRCULACIÓN: PRESENCIA DE PULSOS', col2X, rightY + 2, colW / 2 + 10);
  doc.setFillColor(...GREEN);
  doc.rect(col2X + colW / 2 + 12, rightY - 8, 18, 5, 'F');
  doc.rect(col2X + colW / 2 + 32, rightY - 8, 12, 5, 'F');
  doc.rect(col2X + colW - 14, rightY - 8, 14, 5, 'F');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('CALIDAD', col2X + colW / 2 + 14, rightY - 4.5);
  doc.text('PIEL', col2X + colW / 2 + 34, rightY - 4.5);
  doc.text('CARACT.', col2X + colW - 12, rightY - 4.5);
  
  checkbox('CAROTÍDEO', frap.presencia_pulsos === 'carotideo', col2X + 2, rightY);
  checkbox('RÁPIDO', frap.calidad_pulso === 'rapido', col2X + colW / 2 + 12, rightY);
  checkbox('NORMAL', frap.piel === 'normal', col2X + colW / 2 + 32, rightY);
  checkbox('CALIENTE', frap.caracteristicas_piel === 'caliente', col2X + colW - 14, rightY);
  rightY += 4;
  checkbox('RADIAL', frap.presencia_pulsos === 'radial', col2X + 2, rightY);
  checkbox('LENTO', frap.calidad_pulso === 'lento', col2X + colW / 2 + 12, rightY);
  checkbox('PÁLIDA', frap.piel === 'palida', col2X + colW / 2 + 32, rightY);
  checkbox('FRÍA', frap.caracteristicas_piel === 'fria', col2X + colW - 14, rightY);
  rightY += 4;
  checkbox('PARO CARDIORESPIRATORIO', frap.presencia_pulsos === 'paro', col2X + 2, rightY);
  checkbox('RÍTMICO', frap.calidad_pulso === 'ritmico', col2X + colW / 2 + 12, rightY);
  checkbox('CIANÓTICA', frap.piel === 'cianotica', col2X + colW / 2 + 32, rightY);
  checkbox('DIAFORESIS', frap.caracteristicas_piel === 'diaforesis', col2X + colW - 14, rightY);
  rightY += 4;
  checkbox('ARRÍTMICO', frap.calidad_pulso === 'arritmico', col2X + colW / 2 + 12, rightY);
  rightY += 5;
  
  // EXPLORACIÓN FÍSICA y ZONAS DE LESIÓN
  doc.setFillColor(...GREEN);
  doc.rect(col2X, rightY, colW / 2 - 5, 5, 'F');
  doc.rect(col2X + colW / 2 - 3, rightY, colW / 2 + 3, 5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('EXPLORACIÓN FÍSICA', col2X + 2, rightY + 3.5);
  doc.text('ZONAS DE LESIÓN', col2X + colW / 2 + 5, rightY + 3.5);
  rightY += 6;
  
  const exploraciones = frap.exploracion_fisica || [];
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
  expItems.forEach((item) => {
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GREEN);
    doc.text(item.num, col2X + 2, rightY + 1);
    checkbox(item.label, exploraciones.includes(item.value), col2X + 6, rightY + 1, 2.5);
    rightY += 3;
  });
  
  // Diagrama corporal
  drawBodyDiagram(col2X + colW / 2 - 2, expStartY - 1, 40, 42);
  
  // Pupilas
  drawPupilas(col2X + colW / 2 + 5, expStartY + 42);
  
  rightY = expStartY + 48;
  
  // SIGNOS VITALES
  // SIGNOS VITALES
  rightY = sectionTitle('SIGNOS VITALES', col2X, rightY + 2, colW);
  
  const vitalesHeaders = ['HORA', 'FR', 'FC', 'TAS', 'TAD', 'SaO2', 'TEMP', 'GLUC'];
  const vColW = colW / 8;
  
  doc.setFillColor(...DARK_GREEN);
  doc.rect(col2X, rightY, colW, 4.5, 'F');
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  vitalesHeaders.forEach((h, i) => {
    doc.text(h, col2X + vColW * i + vColW / 2, rightY + 3, { align: 'center' });
  });
  rightY += 4.5;
  
  const vitales = frap.vitales || [];
  for (let i = 0; i < 3; i++) {
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(0.2);
    doc.rect(col2X, rightY, colW, 4.5, 'S');
    
    const v = vitales[i] || {};
    const vValues = [v.hora, v.fr, v.fc, v.tas, v.tad, v.sao2, v.temp, v.gluc];
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BLACK);
    vValues.forEach((val, j) => {
      doc.text(String(val || ''), col2X + vColW * j + vColW / 2, rightY + 3, { align: 'center' });
      if (j < 7) {
        doc.line(col2X + vColW * (j + 1), rightY, col2X + vColW * (j + 1), rightY + 4.5);
      }
    });
    rightY += 4.5;
  }
  rightY += 3;
  
  // CONDICIÓN DEL PACIENTE / PRIORIDAD
  doc.setFillColor(...GREEN);
  doc.rect(col2X, rightY, colW / 2 - 2, 5, 'F');
  doc.rect(col2X + colW / 2, rightY, colW / 2, 5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('CONDICIÓN DEL PACIENTE', col2X + 2, rightY + 3.5);
  doc.text('PRIORIDAD', col2X + colW / 2 + 2, rightY + 3.5);
  rightY += 6;
  
  checkbox('CRÍTICO INESTABLE', frap.condicion_paciente === 'critico_inestable', col2X + 2, rightY);
  checkbox('NO CRÍTICO', frap.condicion_paciente === 'no_critico', col2X + 38, rightY);
  
  // Botones de prioridad con colores
  const prioColors = {
    rojo: [220, 53, 69],
    verde: [40, 167, 69],
    amarillo: [255, 193, 7],
    negro: [33, 33, 33]
  };
  
  let prioX = col2X + colW / 2 + 2;
  Object.entries(prioColors).forEach(([key, color], i) => {
    const px = prioX + (i % 2) * 22;
    const py = rightY + Math.floor(i / 2) * 5 - 2.5;
    
    doc.setFillColor(...color);
    if (frap.prioridad === key) {
      doc.rect(px, py, 18, 4.5, 'F');
      doc.setTextColor(...(key === 'amarillo' ? BLACK : WHITE));
    } else {
      doc.setDrawColor(...color);
      doc.setLineWidth(0.5);
      doc.rect(px, py, 18, 4.5, 'S');
      doc.setTextColor(...color);
    }
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text(key.toUpperCase(), px + 9, py + 3, { align: 'center' });
  });
  doc.setTextColor(...BLACK);
  
  rightY += 4;
  checkbox('CRÍTICO ESTABLE', frap.condicion_paciente === 'critico_estable', col2X + 2, rightY);
  rightY += 8;
  
  // VÍA AÉREA, CONTROL CERVICAL, ASIST. VENTILATORIA, OXIGENOTERAPIA
  const manejoHeaders = ['VÍA AÉREA:', 'CONTROL CERVICAL', 'ASIST. VENTILATORIA', 'OXIGENOTERAPIA:'];
  const manejoW = colW / 4;
  manejoHeaders.forEach((h, i) => {
    doc.setFillColor(...GREEN);
    doc.rect(col2X + manejoW * i, rightY, manejoW - 0.5, 4.5, 'F');
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(h, col2X + manejoW * i + 1, rightY + 3);
  });
  rightY += 5;
  
  const viaAereaManejo = frap.via_aerea_manejo || [];
  checkbox('ASPIRACIÓN', viaAereaManejo.includes('aspiracion'), col2X + 1, rightY, 2.5);
  checkbox('MANUAL', frap.control_cervical === 'manual', col2X + manejoW + 1, rightY, 2.5);
  checkbox('BALÓN-VÁLVULA', frap.asistencia_ventilatoria === 'balon_valvula', col2X + manejoW * 2 + 1, rightY, 2.5);
  checkbox('PUNTAS NASALES', frap.oxigenoterapia === 'puntas_nasales', col2X + manejoW * 3 + 1, rightY, 2.5);
  rightY += 4;
  checkbox('CÁNULA OROFARÍNGEA', viaAereaManejo.includes('canula_oro'), col2X + 1, rightY, 2.5);
  checkbox('COLLARÍN RÍGIDO', frap.control_cervical === 'rigido', col2X + manejoW + 1, rightY, 2.5);
  checkbox('VENTILADOR AUTOMÁTICO', frap.asistencia_ventilatoria === 'ventilador', col2X + manejoW * 2 + 1, rightY, 2.5);
  checkbox('MASCARILLA SIMPLE', frap.oxigenoterapia === 'mascarilla_simple', col2X + manejoW * 3 + 1, rightY, 2.5);
  rightY += 4;
  checkbox('CÁNULA NASOFARÍNGEA', viaAereaManejo.includes('canula_naso'), col2X + 1, rightY, 2.5);
  checkbox('COLLARÍN BLANDO', frap.control_cervical === 'blando', col2X + manejoW + 1, rightY, 2.5);
  doc.setFontSize(5);
  label('FREC.', col2X + manejoW * 2 + 1, rightY);
  label('VOL.', col2X + manejoW * 2 + 15, rightY);
  checkbox('MASCARILLA CON RESERVORIO', frap.oxigenoterapia === 'mascarilla_reservorio', col2X + manejoW * 3 + 1, rightY, 2.5);
  rightY += 4;
  label('LTS X MIN:', col2X + manejoW * 3 + 1, rightY);
  line(col2X + manejoW * 3 + 18, rightY + 0.5, 8);
  value(frap.lts_x_min, col2X + manejoW * 3 + 19, rightY);
  rightY += 4;
  
  // CONTROL DE HEMORRAGIAS, VÍAS VENOSAS, SITIO, TIPO SOLUCIONES
  const hemHeaders = ['CONTROL DE HEMORRAGIAS', 'VÍAS VENOSAS:', 'SITIO DE APLICACIÓN:', 'TIPO DE SOLUCIONES:'];
  const hemW = colW / 4;
  hemHeaders.forEach((h, i) => {
    doc.setFillColor(...GREEN);
    doc.rect(col2X + hemW * i, rightY, hemW - 0.5, 4.5, 'F');
    doc.setFontSize(4.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(h, col2X + hemW * i + 1, rightY + 3);
  });
  rightY += 5;
  
  const controlHemorragias = frap.control_hemorragias || [];
  const soluciones = frap.tipo_soluciones || [];
  checkbox('PRESIÓN DIRECTA', controlHemorragias.includes('presion_directa'), col2X + 1, rightY, 2.5);
  label('VÍA IV #', col2X + hemW + 1, rightY);
  line(col2X + hemW + 14, rightY + 0.5, 8);
  label('MANO', col2X + hemW * 2 + 1, rightY);
  checkbox('HARTMANN', soluciones.includes('hartmann'), col2X + hemW * 3 + 1, rightY, 2.5);
  rightY += 4;
  checkbox('TORNIQUETE', controlHemorragias.includes('torniquete'), col2X + 1, rightY, 2.5);
  label('CATETER #', col2X + hemW + 1, rightY);
  line(col2X + hemW + 16, rightY + 0.5, 6);
  label('PLIEGUE ANTECUBITAL', col2X + hemW * 2 + 1, rightY);
  checkbox('NaCl 0.9%', soluciones.includes('nacl'), col2X + hemW * 3 + 1, rightY, 2.5);
  rightY += 4;
  checkbox('VENDAJE COMPRESIVO', controlHemorragias.includes('vendaje'), col2X + 1, rightY, 2.5);
  checkbox('MIXTA', soluciones.includes('mixta'), col2X + hemW * 3 + 1, rightY, 2.5);
  rightY += 4;
  checkbox('GLUCOSA 5%', soluciones.includes('glucosa'), col2X + hemW * 3 + 1, rightY, 2.5);
  rightY += 4;
  checkbox('OTRA', soluciones.includes('otra'), col2X + hemW * 3 + 1, rightY, 2.5);

  // ================================================================
  // PÁGINA 2
  // ================================================================
  doc.addPage();
  y = my;
  leftY = y;
  rightY = y;
  
  // ─────────────────────────────────────────────────────────────────
  // PÁGINA 2 - COLUMNA IZQUIERDA
  // ─────────────────────────────────────────────────────────────────
  
  // NOMBRE DEL PACIENTE (repetido)
  leftY = sectionTitle('NOMBRE DEL PACIENTE', col1X, leftY, colW);
  line(col1X + 2, leftY + 0.5, colW - 4);
  value(frap.nombre_paciente, col1X + 3, leftY);
  leftY += 4;
  
  leftY += fieldRow('NOMBRE DEL ACOMPAÑANTE:', frap.nombre_acompanante, col1X + 2, leftY, 42, colW - 46);
  leftY += 2;
  
  // SEXO y EDAD
  label('SEXO:', col1X + 2, leftY);
  doc.rect(col1X + 14, leftY - 3, 8, 5, 'S');
  doc.rect(col1X + 24, leftY - 3, 8, 5, 'S');
  if (frap.sexo === 'masculino') {
    doc.setFontSize(8);
    doc.text('M', col1X + 16.5, leftY);
  }
  if (frap.sexo === 'femenino') {
    doc.setFontSize(8);
    doc.text('F', col1X + 27, leftY);
  }
  doc.setFontSize(5);
  doc.text('MASC.', col1X + 14.5, leftY + 3);
  doc.text('FEM.', col1X + 25, leftY + 3);
  
  label('EDAD:', col1X + 38, leftY);
  doc.rect(col1X + 48, leftY - 3, 12, 5, 'S');
  doc.rect(col1X + 62, leftY - 3, 12, 5, 'S');
  value(frap.edad_anos || '', col1X + 51, leftY);
  value(frap.edad_meses || '', col1X + 65, leftY);
  doc.setFontSize(5);
  doc.text('AÑOS', col1X + 76, leftY - 1);
  doc.text('MESES', col1X + 76, leftY + 2);
  leftY += 7;
  
  leftY += fieldRow('DOMICILIO:', frap.domicilio, col1X + 2, leftY, 18, colW - 22);
  leftY += fieldRow('COLONIA/COMUNIDAD:', frap.colonia_paciente, col1X + 2, leftY, 32, colW - 36);
  leftY += fieldRow('DELEGACIÓN POLÍTICA/MUNICIPIO:', frap.delegacion_paciente, col1X + 2, leftY, 48, colW - 52);
  
  label('TELÉFONO:', col1X + 2, leftY);
  line(col1X + 18, leftY + 0.5, 25);
  value(frap.telefono, col1X + 19, leftY);
  label('OCUPACIÓN:', col1X + 48, leftY);
  line(col1X + 65, leftY + 0.5, colW - 68);
  value(frap.ocupacion, col1X + 66, leftY);
  leftY += 4;
  
  leftY += fieldRow('DERECHOHABIENTE A:', frap.derechohabiente, col1X + 2, leftY, 32, colW - 36);
  leftY += fieldRow('COMPAÑÍA DE SEGUROS GASTOS MÉDICOS:', frap.compania_seguros, col1X + 2, leftY, 58, colW - 62);
  
  // ORIGEN PROBABLE
  leftY = sectionTitle('ORIGEN PROBABLE', col1X, leftY + 1, colW);
  xPos = col1X + 2;
  xPos += checkbox('NEUROLOGÍA', origenes.includes('neurologia'), xPos, leftY);
  xPos += checkbox('DIGESTIVA', origenes.includes('digestiva'), xPos, leftY);
  checkbox('INTOXICACIÓN', origenes.includes('intoxicacion'), xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('CARDIOVASCULAR', origenes.includes('cardiovascular'), xPos, leftY);
  xPos += checkbox('UROGENITAL', origenes.includes('urogenital'), xPos, leftY);
  checkbox('INFECCIOSA', origenes.includes('infecciosa'), xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('RESPIRATORIO', origenes.includes('respiratorio'), xPos, leftY);
  xPos += checkbox('GINECO-OBSTÉTRICA', origenes.includes('gineco'), xPos, leftY);
  checkbox('ONCOLÓGICO', origenes.includes('oncologico'), xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('METABÓLICO', origenes.includes('metabolico'), xPos, leftY);
  xPos += checkbox('COGNITIVO EMOCIONAL', origenes.includes('cognitivo'), xPos, leftY);
  checkbox('OTRO', origenes.includes('otro'), xPos, leftY);
  leftY += 4;
  
  leftY += fieldRow('ESPECIFIQUE:', '', col1X + 2, leftY, 20, colW - 24);
  
  label('1A VEZ:', col1X + 2, leftY);
  doc.rect(col1X + 16, leftY - 3, 6, 4, 'S');
  label('SUBSECUENTE:', col1X + 30, leftY);
  doc.rect(col1X + 52, leftY - 3, 6, 4, 'S');
  leftY += 5;
  
  // ACCIDENTE AUTOMOVILÍSTICO
  // ACCIDENTE AUTOMOVILÍSTICO
  leftY = sectionTitle('ACCIDENTE AUTOMOVILÍSTICO', col1X, leftY + 3, colW);
  xPos = col1X + 2;
  xPos += checkbox('COLISIÓN', frap.accidente_colision === 'colision', xPos, leftY);
  doc.rect(xPos - 1, leftY - 2.2, 3, 3, 'S');
  xPos += 8;
  checkbox('VOLCADURA', frap.accidente_colision === 'volcadura', xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('AUTOMOTOR', frap.accidente_colision === 'automotor', xPos, leftY);
  xPos += checkbox('MOTOCICLETA', frap.accidente_colision === 'motocicleta', xPos, leftY);
  xPos += checkbox('BICICLETA', frap.accidente_colision === 'bicicleta', xPos, leftY);
  checkbox('MAQUINARIA', frap.accidente_colision === 'maquinaria', xPos, leftY);
  leftY += 5;
  
  label('CONTRA OBJETO:', col1X + 2, leftY);
  xPos = col1X + 28;
  xPos += checkbox('FIJO', frap.accidente_contra_objeto === 'fijo', xPos, leftY);
  checkbox('EN MOVIMIENTO', frap.accidente_contra_objeto === 'movimiento', xPos, leftY);
  label('IMPACTO:', col1X + colW / 2 + 10, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('FRONTAL', frap.accidente_impacto === 'frontal', xPos, leftY);
  xPos += checkbox('LATERAL', frap.accidente_impacto === 'lateral', xPos, leftY);
  checkbox('POSTERIOR', frap.accidente_impacto === 'posterior', xPos, leftY);
  leftY += 5;
  
  label('HUNDIMIENTO:', col1X + 2, leftY);
  line(col1X + 24, leftY + 0.5, 12);
  label('CMS', col1X + 38, leftY);
  label('PARABRISAS:', col1X + 48, leftY);
  xPos = col1X + 68;
  xPos += checkbox('SÍ', frap.parabrisas_roto, xPos, leftY);
  checkbox('NO', !frap.parabrisas_roto, xPos, leftY);
  leftY += 4;
  
  label('VOLANTE:', col1X + 2, leftY);
  xPos = col1X + 18;
  xPos += checkbox('INTRUSIÓN', frap.volante === 'intrusion', xPos, leftY);
  checkbox('DOBLADO', frap.volante === 'doblado', xPos, leftY);
  label('BOLSA DE AIRE:', col1X + colW / 2 + 5, leftY);
  leftY += 4;
  
  label('CINTURÓN DE SEGURIDAD:', col1X + 2, leftY);
  xPos = col1X + 40;
  xPos += checkbox('COLOCADO', frap.cinturon_seguridad === 'colocado', xPos, leftY);
  checkbox('NO COLOCADO', frap.cinturon_seguridad === 'no_colocado', xPos, leftY);
  leftY += 4;
  
  label('DENTRO DEL VEHÍCULO:', col1X + 2, leftY);
  xPos = col1X + 38;
  xPos += checkbox('SÍ', frap.dentro_vehiculo === 'si', xPos, leftY);
  xPos += checkbox('NO', frap.dentro_vehiculo === 'no', xPos, leftY);
  checkbox('EYECTADO', frap.eyectado === 'si', xPos, leftY);
  leftY += 4;
  
  label('ATROPELLADO:', col1X + 2, leftY);
  xPos = col1X + 25;
  xPos += checkbox('AUTOMOTOR', frap.atropellado === 'automotor', xPos, leftY);
  xPos += checkbox('MOTOCICLETA', frap.atropellado === 'motocicleta', xPos, leftY);
  xPos += checkbox('BICICLETA', frap.atropellado === 'bicicleta', xPos, leftY);
  checkbox('MAQUINARIA', frap.atropellado === 'maquinaria', xPos, leftY);
  leftY += 4;
  label('CASCO DE SEGURIDAD:', col1X + 2, leftY);
  xPos = col1X + 38;
  xPos += checkbox('SÍ', frap.casco_seguridad === 'si', xPos, leftY);
  checkbox('NO', frap.casco_seguridad === 'no', xPos, leftY);
  leftY += 5;
  
  // AGENTE CAUSAL
  leftY = sectionTitle('AGENTE CAUSAL', col1X, leftY + 3, colW);
  xPos = col1X + 2;
  xPos += checkbox('ARMA', agentes.includes('arma'), xPos, leftY);
  xPos += checkbox('MAQUINARIA', agentes.includes('maquinaria'), xPos, leftY);
  checkbox('ELECTRICIDAD', agentes.includes('electricidad'), xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('JUGUETE', agentes.includes('juguete'), xPos, leftY);
  xPos += checkbox('HERRAMIENTA', agentes.includes('herramienta'), xPos, leftY);
  checkbox('EXPLOSIÓN', agentes.includes('explosion'), xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('AUTOMOTOR', agentes.includes('automotor'), xPos, leftY);
  xPos += checkbox('FUEGO', agentes.includes('fuego'), xPos, leftY);
  checkbox('SER HUMANO', agentes.includes('ser_humano'), xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('BICICLETA', agentes.includes('bicicleta'), xPos, leftY);
  xPos += checkbox('SUSTANCIA CALIENTE', agentes.includes('producto_caliente'), xPos, leftY);
  checkbox('ANIMAL', agentes.includes('animal'), xPos, leftY);
  leftY += 4;
  xPos = col1X + 2;
  xPos += checkbox('PRODUCTO BIOLÓGICO', agentes.includes('sustancia_biologica'), xPos, leftY);
  xPos += checkbox('SUSTANCIA TÓXICA', agentes.includes('sustancia_toxica'), xPos, leftY);
  checkbox('OTRO', agentes.includes('otro'), xPos, leftY);
  leftY += 4;
  
  leftY += fieldRow('ESPECIFIQUE:', '', col1X + 2, leftY, 20, colW - 24);
  leftY += fieldRow('LESIONES CAUSADAS POR:', frap.lesiones_causadas_por, col1X + 2, leftY, 38, colW - 42);
  
  // DATOS DE LA MADRE
  leftY = sectionTitle('DATOS DE LA MADRE', col1X, leftY + 2, colW);
  label('GESTA:', col1X + 2, leftY);
  line(col1X + 14, leftY + 0.5, 10);
  value(frap.madre_gesta, col1X + 15, leftY);
  label('CESÁREAS:', col1X + 28, leftY);
  line(col1X + 44, leftY + 0.5, 8);
  value(frap.madre_cesareas, col1X + 45, leftY);
  label('PARA:', col1X + 56, leftY);
  line(col1X + 66, leftY + 0.5, 8);
  value(frap.madre_para, col1X + 67, leftY);
  label('ABORTOS:', col1X + 78, leftY);
  line(col1X + 94, leftY + 0.5, colW - 98);
  value(frap.madre_abortos, col1X + 95, leftY);
  leftY += 4;
  
  label('FUM:', col1X + 2, leftY);
  line(col1X + 12, leftY + 0.5, 20);
  value(frap.madre_fum, col1X + 13, leftY);
  leftY += 4;
  
  leftY += fieldRow('SEMANAS DE GESTACIÓN:', frap.madre_semanas, col1X + 2, leftY, 36, 15);
  
  label('FECHA PROBABLE DE PARTO:', col1X + 2, leftY);
  line(col1X + 45, leftY + 0.5, colW - 48);
  value(frap.madre_fecha_probable, col1X + 46, leftY);
  leftY += 4;
  
  label('HORA INICIO CONTRACCIONES:', col1X + 2, leftY);
  line(col1X + 45, leftY + 0.5, 15);
  value(frap.madre_hora_contracciones, col1X + 46, leftY);
  label('FRECUENCIA:', col1X + 65, leftY);
  line(col1X + 82, leftY + 0.5, colW - 86);
  value(frap.madre_frecuencia, col1X + 83, leftY);
  leftY += 4;
  
  label('DURACIÓN:', col1X + 2, leftY);
  line(col1X + 18, leftY + 0.5, colW - 22);
  value(frap.madre_duracion, col1X + 19, leftY);
  leftY += 5;
  
  // DATOS POST-PARTO
  leftY = sectionTitle('DATOS POST-PARTO', col1X, leftY + 2, colW);
  label('HORA DE NACIMIENTO:', col1X + 2, leftY);
  line(col1X + 35, leftY + 0.5, 20);
  value(frap.postparto_hora_nacimiento, col1X + 36, leftY);
  label('LUGAR:', col1X + 60, leftY);
  line(col1X + 72, leftY + 0.5, colW - 76);
  value(frap.postparto_lugar, col1X + 73, leftY);
  leftY += 4;
  
  label('PLACENTA EXPULSADA:', col1X + 2, leftY);
  xPos = col1X + 38;
  xPos += checkbox('SÍ', frap.postparto_placenta === true, xPos, leftY);
  checkbox('NO', frap.postparto_placenta === false, xPos, leftY);
  leftY += 5;  // Marcar fin de columna izquierda

  // ─────────────────────────────────────────────────────────────────
  // PÁGINA 2 - COLUMNA DERECHA
  // ─────────────────────────────────────────────────────────────────
  
  // Reiniciar rightY para la página 2
  rightY = y;
  
  // INTERROGATORIO
  rightY = sectionTitle('INTERROGATORIO', col2X, rightY + 2, colW);
  rightY += fieldRow('ALERGIAS:', frap.alergias, col2X + 2, rightY, 16, colW - 20);
  rightY += fieldRow('MEDICAMENTOS QUE ESTÁ INGIRIENDO:', frap.medicamentos, col2X + 2, rightY, 55, colW - 59);
  rightY += fieldRow('ENFERMEDADES Y CIRUGÍAS PREVIAS:', frap.enfermedades_previas, col2X + 2, rightY, 52, colW - 56);
  rightY += fieldRow('HORA DE LA ÚLTIMA COMIDA:', frap.ultima_comida, col2X + 2, rightY, 42, colW - 46);
  rightY += fieldRow('EVENTOS PREVIOS RELACIONADOS:', frap.eventos_previos, col2X + 2, rightY, 48, colW - 52);
  rightY += 2;
  
  // OBSERVACIONES
  rightY = sectionTitle('OBSERVACIONES', col2X, rightY + 2, colW);
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.3);
  doc.rect(col2X, rightY, colW, 15, 'S');
  
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BLACK);
  const obsLines = doc.splitTextToSize(frap.observaciones || '', colW - 4);
  doc.text(obsLines, col2X + 2, rightY + 4);
  rightY += 17;
  
  // ESCALA DE GLASGOW
  label('ESCALA DE GLASGOW:', col2X + 2, rightY);
  doc.setDrawColor(...GREEN);
  doc.rect(col2X + colW - 15, rightY - 4, 13, 6, 'S');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  value(frap.glasgow_total || '', col2X + colW - 11, rightY);
  rightY += 6;
  
  // ESCALA PREHOSPITALARIA DE CINCINNATI
  // ESCALA PREHOSPITALARIA DE CINCINNATI
  rightY = sectionTitle('ESCALA PREHOSPITALARIA DE CINCINNATI', col2X, rightY + 2, colW);
  
  label('ASIMETRÍA FACIAL', col2X + 2, rightY);
  checkbox('SÍ', frap.asimetria_facial === 'si', col2X + colW - 22, rightY);
  checkbox('NO', frap.asimetria_facial === 'no', col2X + colW - 10, rightY);
  rightY += 4;
  label('PARESIA DE LOS BRAZOS', col2X + 2, rightY);
  checkbox('SÍ', frap.paresia_brazos === 'si', col2X + colW - 22, rightY);
  checkbox('NO', frap.paresia_brazos === 'no', col2X + colW - 10, rightY);
  rightY += 4;
  label('ALTERACIÓN DEL LENGUAJE', col2X + 2, rightY);
  checkbox('SÍ', frap.alteracion_lenguaje === 'si', col2X + colW - 22, rightY);
  checkbox('NO', frap.alteracion_lenguaje === 'no', col2X + colW - 10, rightY);
  rightY += 5;
  
  // ESCALA DE TRAUMA
  // ESCALA DE TRAUMA
  rightY = sectionTitle('ESCALA DE TRAUMA', col2X, rightY + 2, colW);
  
  const traumaHeaders = ['(A)GCS', '(B) PAS', '(C)FR', '(D) Esfuerzo Respiratorio', '(E)Llenado Capilar', 'Puntuación'];
  const tColW = colW / 6;
  
  doc.setFillColor(...DARK_GREEN);
  doc.rect(col2X, rightY, colW, 5, 'F');
  doc.setFontSize(4.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  traumaHeaders.forEach((h, i) => {
    doc.text(h, col2X + tColW * i + tColW / 2, rightY + 3.2, { align: 'center' });
  });
  rightY += 5;
  
  const traumaRows = [
    ['14-15', '', '', '', '', '5'],
    ['11-13', '90 o +', '10-24', '', '', '4'],
    ['8-10', '70-89', '25-35', '', '', '3'],
    ['5-7', '50-69', '>35', 'normal', '', '2'],
    ['3-4', '0-49', '1-9', 'retracción', 'normal retardado', '1'],
    ['', '', '0-49', 'Puntuación', 'ausente', '0'],
  ];
  
  traumaRows.forEach((row) => {
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(0.2);
    doc.rect(col2X, rightY, colW, 4, 'S');
    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BLACK);
    row.forEach((cell, j) => {
      doc.text(cell, col2X + tColW * j + tColW / 2, rightY + 2.8, { align: 'center' });
      if (j < 5) {
        doc.line(col2X + tColW * (j + 1), rightY, col2X + tColW * (j + 1), rightY + 4);
      }
    });
    rightY += 4;
  });
  
  label('Puntuación Total:', col2X + colW - 38, rightY + 2);
  label('A+B+C+D+E', col2X + colW - 18, rightY + 2);
  rightY += 6;
  
  // DATOS RECIÉN NACIDO y DESTINO
  doc.setFillColor(...GREEN);
  doc.rect(col2X, rightY, colW / 2, 5, 'F');
  doc.rect(col2X + colW / 2 + 2, rightY, colW / 2 - 2, 5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('DATOS RECIÉN NACIDO', col2X + 2, rightY + 3.5);
  doc.text('DESTINO', col2X + colW / 2 + 4, rightY + 3.5);
  rightY += 6;
  
  label('PRODUCTO:', col2X + 2, rightY);
  checkbox('VIVO', frap.recien_nacido_producto === 'vivo', col2X + 22, rightY);
  checkbox('MUERTO', frap.recien_nacido_producto === 'muerto', col2X + 40, rightY);
  checkbox('TRASLADADO', frap.recien_nacido_destino === 'trasladado', col2X + colW / 2 + 4, rightY);
  rightY += 4;
  
  label('SEXO:', col2X + 2, rightY);
  checkbox('MASC', frap.recien_nacido_sexo === 'masculino', col2X + 15, rightY);
  checkbox('FEM', frap.recien_nacido_sexo === 'femenino', col2X + 32, rightY);
  checkbox('NO TRASLADADO', frap.recien_nacido_destino === 'no_trasladado', col2X + colW / 2 + 4, rightY);
  rightY += 4;
  
  label('APGAR:', col2X + 2, rightY);
  checkbox('FUGA', frap.recien_nacido_destino === 'fuga', col2X + colW / 2 + 4, rightY);
  rightY += 4;
  
  doc.setDrawColor(...GREEN);
  doc.rect(col2X + 15, rightY - 3, 12, 5, 'S');
  doc.rect(col2X + 29, rightY - 3, 12, 5, 'S');
  doc.rect(col2X + 43, rightY - 3, 12, 5, 'S');
  value(frap.recien_nacido_apgar_1 || '', col2X + 18, rightY);
  value(frap.recien_nacido_apgar_5 || '', col2X + 32, rightY);
  value(frap.recien_nacido_apgar_10 || '', col2X + 46, rightY);
  doc.setFontSize(4.5);
  doc.text('1 MIN', col2X + 17, rightY + 4);
  doc.text('5 MIN', col2X + 31, rightY + 4);
  doc.text('10 MIN', col2X + 44, rightY + 4);
  rightY += 6;
  
  label('PRODUCTO:', col2X + 2, rightY);
  doc.rect(col2X + 20, rightY - 3, 12, 5, 'S');
  doc.rect(col2X + 34, rightY - 3, 12, 5, 'S');
  doc.rect(col2X + 48, rightY - 3, 12, 5, 'S');
  rightY += 8;

  // ════════════════════════════════════════════════════════════════
  // SECCIÓN INFERIOR - FIRMAS Y CONSENTIMIENTOS
  // ════════════════════════════════════════════════════════════════
  // Usar la posición más baja entre las dos columnas + margen
  const footerY = Math.max(leftY, rightY) + 8;
  
  // NEGATIVA A RECIBIR ATENCIÓN
  doc.setFillColor(...GREEN);
  doc.rect(mx, footerY, cw / 2 - 2, 5, 'F');
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('NEGATIVA A RECIBIR ATENCIÓN/ SER TRASLADADO EXIMENTE DE RESPONSABILIDAD', mx + 2, footerY + 3.5);
  
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BLACK);
  const negText = 'DECLARO QUE NO ACEPTO LAS RECOMENDACIONES DEL PERSONAL DE LA AMBULANCIA DEL CUERPO DE RESCATE EN CUANTO AL (TRATAMIENTO) Y/O (TRASLADO) A UN HOSPITAL; POR LO QUE EXIMO A EL CUERPO DE RESCATE Y A DICHAS PERSONAS DE TODA RESPONSABILIDAD QUE PUDIERA DERIVAR AL HABER RESPETADO Y CUMPLIDO MI DECISIÓN.';
  const negLines = doc.splitTextToSize(negText, cw / 2 - 6);
  doc.text(negLines, mx + 2, footerY + 10);
  
  // CONSENTIMIENTO INFORMADO
  doc.setFillColor(...GREEN);
  doc.rect(mx + cw / 2, footerY, cw / 2, 5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('CONSENTIMIENTO INFORMADO', mx + cw / 2 + 2, footerY + 3.5);
  
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BLACK);
  const consText = 'PREVIO A UNA DETALLADA EXPLICACIÓN DOY MI CONSENTIMIENTO A SER TRASLADADO Y/O ATENDIDO POR EL PERSONAL DEL CUERPO DE RESCATE A.C.';
  const consLines = doc.splitTextToSize(consText, cw / 2 - 6);
  doc.text(consLines, mx + cw / 2 + 2, footerY + 10);
  
  // Líneas de firmas principales
  const sigY = footerY + 30;
  
  // Firmas izquierda (negativa)
  line(mx + 10, sigY, 40);
  doc.setFontSize(5);
  doc.text('NOMBRE/FIRMA DEL PACIENTE', mx + 15, sigY + 3);
  
  line(mx + 55, sigY, 40);
  doc.text('NOMBRE/FIRMA DEL TESTIGO', mx + 60, sigY + 3);
  
  // Firmas derecha (consentimiento)
  line(mx + cw / 2 + 10, sigY, 40);
  doc.text('NOMBRE/FIRMA DEL PACIENTE', mx + cw / 2 + 15, sigY + 3);
  
  line(mx + cw / 2 + 55, sigY, 40);
  doc.text('NOMBRE/FIRMA DE FAMILIAR O TUTOR', mx + cw / 2 + 52, sigY + 3);
  
  // AUTORIDADES QUE INTERVINIERON
  const authY = sigY + 10;
  doc.setFillColor(...GREEN);
  doc.rect(mx + cw / 2, authY, cw / 2, 5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('AUTORIDADES QUE INTERVINIERON', mx + cw / 2 + 2, authY + 3.5);
  
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BLACK);
  doc.text('ENTREGA PACIENTE', mx + cw / 2 + 5, authY + 10);
  line(mx + cw / 2 + 35, authY + 10.5, 40);
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.text('NOMBRE Y FIRMA', mx + cw / 2 + 50, authY + 13);
  
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.text('MÉDICO QUE RECIBE', mx + cw / 2 + 5, authY + 20);
  line(mx + cw / 2 + 35, authY + 20.5, 40);
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.text('NOMBRE Y FIRMA', mx + cw / 2 + 50, authY + 23);
  
  // AGREGAR FIRMAS DIGITALES si existen
  if (frap.firmas) {
    // Firma paciente (negativa)
    if (frap.firmas.paciente) {
      try { doc.addImage(frap.firmas.paciente, 'PNG', mx + 15, sigY - 12, 30, 10); } catch(e){}
    }
    // Firma testigo
    if (frap.firmas.testigo) {
      try { doc.addImage(frap.firmas.testigo, 'PNG', mx + 60, sigY - 12, 30, 10); } catch(e){}
    }
    // Firma paciente (consentimiento)
    if (frap.firmas.paciente_consentimiento) {
      try { doc.addImage(frap.firmas.paciente_consentimiento, 'PNG', mx + cw / 2 + 15, sigY - 12, 30, 10); } catch(e){}
    }
    // Firma familiar o tutor
    if (frap.firmas.familiar_tutor) {
      try { doc.addImage(frap.firmas.familiar_tutor, 'PNG', mx + cw / 2 + 55, sigY - 12, 30, 10); } catch(e){}
    }
    // Firma entrega paciente
    if (frap.firmas.entrega_paciente) {
      try { doc.addImage(frap.firmas.entrega_paciente, 'PNG', mx + cw / 2 + 40, authY + 3, 30, 8); } catch(e){}
    }
    // Firma médico que recibe
    if (frap.firmas.medico_recibe) {
      try { doc.addImage(frap.firmas.medico_recibe, 'PNG', mx + cw / 2 + 40, authY + 13, 30, 8); } catch(e){}
    }
  }
  
  // Pie de página
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  doc.text(`Creado por: ${frap.created_by_name || '—'}  •  Fecha: ${frap.created_at ? new Date(frap.created_at).toLocaleString('es-MX') : '—'}`, pw / 2, ph - 8, { align: 'center' });
  doc.text('FRAP – Formulario de Rescate y Atención Prehospitalaria • Cuerpo de Rescate de Ensenada, A.C.', pw / 2, ph - 5, { align: 'center' });
  
  // Números de página
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(6);
    doc.setTextColor(...GRAY);
    doc.text(`Página ${i} de ${totalPages}`, pw - mx - 5, ph - 3, { align: 'right' });
  }

  // ── Descargar ──
  doc.save(`FRAP_${frap.folio || 'SinFolio'}.pdf`);
};
