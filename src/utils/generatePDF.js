import jsPDF from 'jspdf';
import 'jspdf-autotable';

// ─── Colores exactos del formulario original ───────────────────────────────
const RED = [180, 0, 0];  // Rojo para títulos principales
const BLACK = [0, 0, 0];
const WHITE = [255, 255, 255];

export const generateFRAPPDF = async (frap) => {
  const doc = new jsPDF('p', 'mm', 'letter');
  const pw = doc.internal.pageSize.getWidth();  // 215.9mm
  const ph = doc.internal.pageSize.getHeight(); // 279.4mm
  const mx = 4;  // Margen mínimo
  const my = 4;
  const cw = pw - mx * 2;  // Ancho total de contenido
  const colW = cw / 2 - 1; // Ancho de cada columna
  const col1X = mx;
  const col2X = mx + colW + 2;
  
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
  // HELPERS - Estilo exacto del formulario físico
  // ================================================================
  
  const setRed = () => {
    doc.setTextColor(...RED);
    doc.setDrawColor(...RED);
  };
  
  const setBlack = () => {
    doc.setTextColor(...BLACK);
    doc.setDrawColor(...BLACK);
  };
  
  // Título de sección en ROJO
  const sectionTitle = (title, x, y, width) => {
    setRed();
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text(title, x, y);
    return y + 3;
  };

  // Etiqueta de campo
  const fieldLabel = (label, x, y) => {
    setBlack();
    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x, y);
  };

  // Valor de campo
  const fieldValue = (value, x, y, maxW = null) => {
    setBlack();
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    const val = String(value || '');
    if (maxW && val) {
      const lines = doc.splitTextToSize(val, maxW);
      doc.text(lines, x, y);
      return lines.length * 2.2;
    }
    doc.text(val, x, y);
    return 2.5;
  };

  // Línea para escribir
  const fieldLine = (x, y, width) => {
    setBlack();
    doc.setLineWidth(0.15);
    doc.line(x, y, x + width, y);
  };

  // Checkbox pequeño
  const checkbox = (checked, x, y, size = 2.2) => {
    setBlack();
    doc.setLineWidth(0.15);
    doc.rect(x, y, size, size);
    if (checked) {
      doc.setLineWidth(0.3);
      doc.line(x + 0.4, y + size/2, x + size/2 - 0.2, y + size - 0.4);
      doc.line(x + size/2 - 0.2, y + size - 0.4, x + size - 0.3, y + 0.3);
    }
    return size + 0.5;
  };

  // Checkbox con label
  const checkboxLabel = (label, checked, x, y) => {
    const boxW = checkbox(checked, x, y - 1.8);
    doc.setFontSize(4.5);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x + boxW + 0.5, y);
    return boxW + doc.getTextWidth(label) + 2;
  };

  // Dibujar cuerpo humano con zonas numeradas
  const drawBodyDiagram = (x, y, w, h) => {
    setBlack();
    doc.setLineWidth(0.2);
    
    const cx = x + w/2;
    const scale = Math.min(w/50, h/90);
    
    // Cabeza
    doc.circle(cx, y + 6*scale, 5*scale, 'S');
    
    // Cuello
    doc.line(cx - 2*scale, y + 11*scale, cx - 2*scale, y + 14*scale);
    doc.line(cx + 2*scale, y + 11*scale, cx + 2*scale, y + 14*scale);
    
    // Torso
    doc.line(cx - 2*scale, y + 14*scale, cx - 12*scale, y + 18*scale); // hombro izq
    doc.line(cx + 2*scale, y + 14*scale, cx + 12*scale, y + 18*scale); // hombro der
    doc.line(cx - 12*scale, y + 18*scale, cx - 10*scale, y + 45*scale); // lado izq
    doc.line(cx + 12*scale, y + 18*scale, cx + 10*scale, y + 45*scale); // lado der
    doc.line(cx - 10*scale, y + 45*scale, cx - 3*scale, y + 45*scale); // cadera izq
    doc.line(cx + 10*scale, y + 45*scale, cx + 3*scale, y + 45*scale); // cadera der
    
    // Brazos
    doc.line(cx - 12*scale, y + 18*scale, cx - 18*scale, y + 35*scale);
    doc.line(cx - 18*scale, y + 35*scale, cx - 20*scale, y + 48*scale);
    doc.line(cx + 12*scale, y + 18*scale, cx + 18*scale, y + 35*scale);
    doc.line(cx + 18*scale, y + 35*scale, cx + 20*scale, y + 48*scale);
    
    // Manos (círculos)
    doc.circle(cx - 21*scale, y + 50*scale, 2*scale, 'S');
    doc.circle(cx + 21*scale, y + 50*scale, 2*scale, 'S');
    
    // Piernas
    doc.line(cx - 3*scale, y + 45*scale, cx - 8*scale, y + 75*scale);
    doc.line(cx - 8*scale, y + 75*scale, cx - 7*scale, y + 85*scale);
    doc.line(cx + 3*scale, y + 45*scale, cx + 8*scale, y + 75*scale);
    doc.line(cx + 8*scale, y + 75*scale, cx + 7*scale, y + 85*scale);
    
    // Pies
    doc.ellipse(cx - 7*scale, y + 87*scale, 3*scale, 2*scale, 'S');
    doc.ellipse(cx + 7*scale, y + 87*scale, 3*scale, 2*scale, 'S');
    
    // Pupilas al lado
    doc.setFontSize(4);
    doc.text('PUPILAS', x + w + 2, y + 5);
    doc.circle(x + w + 5, y + 12, 4, 'S');
    doc.circle(x + w + 5, y + 22, 4, 'S');
    doc.setFontSize(3.5);
    doc.text('D', x + w + 4, y + 18);
    doc.text('I', x + w + 4.5, y + 28);
  };

  // ================================================================
  // PÁGINA 1
  // ================================================================
  let y = my;
  
  // ── ENCABEZADO ──
  // Logo
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', mx, y, 16, 16);
  } else {
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.5);
    doc.circle(mx + 8, y + 8, 7, 'S');
  }
  
  // Título en ROJO
  setRed();
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('CUERPO DE RESCATE DE ENSENADA, A.C.', mx + 19, y + 4);
  
  setBlack();
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Calle Magnolias No. 2356', mx + 19, y + 8);
  doc.text('Col. Márquez de León, Ensenada, B.C.', mx + 19, y + 11);
  doc.text('Tels. 176-8033 y 177-9992', mx + 19, y + 14);
  
  // Fecha y Folio
  const folioX = pw - mx - 40;
  fieldLabel('FECHA:', folioX, y + 4);
  fieldLine(folioX + 10, y + 4.5, 28);
  fieldValue(frap.fecha || '', folioX + 11, y + 4);
  
  doc.setFontSize(5);
  doc.text('DÍA    MES    AÑO', folioX + 12, y + 7);
  
  fieldLabel('# FOLIO:', folioX, y + 12);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(frap.folio || '', folioX + 14, y + 13);
  
  y += 18;
  
  // ── TABLA DE HORAS ──
  const horaW = cw / 6;
  const horaHeaders = ['HORA', 'HORA', 'HORA', 'HORA', 'HORA', 'HORA'];
  const horaLabels = ['LLAMADA', 'SALIDA', 'LLEGADA', 'TRASLADO', 'HOSPITAL', 'BASE'];
  
  setBlack();
  doc.setLineWidth(0.2);
  doc.rect(mx, y, cw, 8);
  
  for (let i = 0; i < 6; i++) {
    if (i > 0) doc.line(mx + horaW * i, y, mx + horaW * i, y + 8);
    doc.setFontSize(4.5);
    doc.setFont('helvetica', 'bold');
    doc.text(horaHeaders[i], mx + horaW * i + horaW/2, y + 2.5, { align: 'center' });
    doc.setFontSize(4);
    doc.text(horaLabels[i], mx + horaW * i + horaW/2, y + 5, { align: 'center' });
  }
  
  doc.line(mx, y + 5.5, mx + cw, y + 5.5);
  
  const horaValues = [
    frap.hora_llamada || '', frap.hora_salida || '', frap.hora_llegada_traslado || '',
    frap.hora_traslado || '', frap.hora_llegada_hospital || '', frap.hora_llegada_base || ''
  ];
  
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  horaValues.forEach((v, i) => {
    doc.text(v, mx + horaW * i + horaW/2, y + 7.5, { align: 'center' });
  });
  
  y += 10;
  
  // ════════════════════════════════════════════════════════════════
  // COLUMNA IZQUIERDA - PÁGINA 1
  // ════════════════════════════════════════════════════════════════
  let leftY = y;
  let rightY = y;
  
  // MOTIVO DE LA ATENCIÓN
  leftY = sectionTitle('MOTIVO DE LA ATENCIÓN', col1X, leftY);
  let xPos = col1X;
  xPos += checkboxLabel('TRASLADO', frap.motivo_atencion === 'traslado_programado', xPos, leftY);
  doc.setFontSize(4);
  doc.text('PROGRAMADO', xPos - 8, leftY + 2);
  xPos += checkboxLabel('ENFERMEDAD', frap.motivo_atencion === 'enfermedad', xPos + 5, leftY);
  xPos += checkboxLabel('TRAUMATISMO', frap.motivo_atencion === 'traumatismo', xPos + 5, leftY);
  checkboxLabel('GINECOOBSTÉTRICO', frap.motivo_atencion === 'gineco', xPos + 5, leftY);
  leftY += 4;
  
  // UBICACIÓN DEL SERVICIO
  leftY = sectionTitle('UBICACIÓN DEL SERVICIO:', col1X, leftY);
  fieldLabel('CALLE:', col1X, leftY + 2);
  fieldLine(col1X + 10, leftY + 2.5, colW - 12);
  fieldValue(frap.ubicacion_calle, col1X + 11, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('ENTRE:', col1X, leftY + 2);
  fieldLine(col1X + 10, leftY + 2.5, colW - 12);
  fieldValue(frap.ubicacion_entre, col1X + 11, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('COLONIA/COMUNIDAD:', col1X, leftY + 2);
  fieldLine(col1X + 28, leftY + 2.5, colW - 30);
  fieldValue(frap.ubicacion_colonia, col1X + 29, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('DELEGACIÓN POLÍTICA/MUNICIPIO:', col1X, leftY + 2);
  fieldLine(col1X + 42, leftY + 2.5, colW - 44);
  fieldValue(frap.ubicacion_delegacion, col1X + 43, leftY + 2);
  leftY += 4;
  
  fieldLabel('LUGAR DE OCURRENCIA:', col1X, leftY + 2);
  xPos = col1X + 30;
  xPos += checkboxLabel('HOGAR', frap.lugar_ocurrencia === 'hogar', xPos, leftY + 2);
  xPos += checkboxLabel('VÍA PÚBLICA', frap.lugar_ocurrencia === 'via_publica', xPos, leftY + 2);
  xPos += checkboxLabel('TRABAJO', frap.lugar_ocurrencia === 'trabajo', xPos, leftY + 2);
  checkboxLabel('ESCUELA', frap.lugar_ocurrencia === 'escuela', xPos, leftY + 2);
  leftY += 3.5;
  xPos = col1X + 30;
  xPos += checkboxLabel('RECREACIÓN Y DEPORTE', frap.lugar_ocurrencia === 'recreacion', xPos, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('TRANSPORTE PÚBLICO', col1X, leftY + 2);
  fieldLabel('OTRA:', col1X + 28, leftY + 2);
  fieldLine(col1X + 36, leftY + 2.5, colW - 38);
  leftY += 3.5;
  
  fieldLabel('NÚMERO DE', col1X, leftY + 2);
  fieldLabel('AMBULANCIA', col1X, leftY + 4.5);
  doc.rect(col1X + 18, leftY, 12, 5);
  fieldValue(frap.numero_ambulancia || '', col1X + 19, leftY + 3.5);
  leftY += 6;
  
  fieldLabel('OPERADOR:', col1X, leftY + 2);
  fieldLine(col1X + 16, leftY + 2.5, colW - 18);
  fieldValue(frap.operador, col1X + 17, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('PRESTADORES DEL SERVICIO:', col1X, leftY + 2);
  fieldLine(col1X + 38, leftY + 2.5, colW - 40);
  fieldValue(frap.prestadores_servicio, col1X + 39, leftY + 2);
  leftY += 4;
  
  // NOMBRE DEL PACIENTE
  fieldLabel('NOMBRE DEL PACIENTE:', col1X, leftY + 2);
  fieldLine(col1X + 32, leftY + 2.5, colW - 34);
  fieldValue(frap.nombre_paciente, col1X + 33, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('NOMBRE DEL ACOMPAÑANTE:', col1X, leftY + 2);
  fieldLine(col1X + 38, leftY + 2.5, colW - 40);
  fieldValue(frap.nombre_acompanante, col1X + 39, leftY + 2);
  leftY += 5;
  
  // SEXO y EDAD
  fieldLabel('SEXO', col1X, leftY + 2);
  doc.rect(col1X + 8, leftY - 0.5, 5, 4);
  doc.rect(col1X + 15, leftY - 0.5, 5, 4);
  if (frap.sexo === 'masculino') fieldValue('X', col1X + 9.5, leftY + 2);
  if (frap.sexo === 'femenino') fieldValue('X', col1X + 16.5, leftY + 2);
  doc.setFontSize(3.5);
  doc.text('MASC.', col1X + 8, leftY + 5);
  doc.text('FEM.', col1X + 15, leftY + 5);
  
  fieldLabel('EDAD:', col1X + 28, leftY + 2);
  doc.rect(col1X + 36, leftY - 0.5, 8, 4);
  doc.rect(col1X + 46, leftY - 0.5, 8, 4);
  fieldValue(frap.edad_anos || '', col1X + 38, leftY + 2);
  fieldValue(frap.edad_meses || '', col1X + 48, leftY + 2);
  doc.setFontSize(3.5);
  doc.text('AÑOS', col1X + 56, leftY + 2);
  doc.text('MESES', col1X + 56, leftY + 4.5);
  leftY += 7;
  
  fieldLabel('DOMICILIO:', col1X, leftY + 2);
  fieldLine(col1X + 16, leftY + 2.5, colW - 18);
  fieldValue(frap.domicilio, col1X + 17, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('COLONIA/COMUNIDAD:', col1X, leftY + 2);
  fieldLine(col1X + 28, leftY + 2.5, colW - 30);
  fieldValue(frap.colonia_paciente, col1X + 29, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('DELEGACIÓN POLÍTICA/MUNICIPIO:', col1X, leftY + 2);
  fieldLine(col1X + 42, leftY + 2.5, colW - 44);
  fieldValue(frap.delegacion_paciente, col1X + 43, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('TELÉFONO:', col1X, leftY + 2);
  fieldLine(col1X + 15, leftY + 2.5, 22);
  fieldValue(frap.telefono, col1X + 16, leftY + 2);
  fieldLabel('OCUPACIÓN:', col1X + 40, leftY + 2);
  fieldLine(col1X + 55, leftY + 2.5, colW - 57);
  fieldValue(frap.ocupacion, col1X + 56, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('DERECHOHABIENTE A:', col1X, leftY + 2);
  fieldLine(col1X + 28, leftY + 2.5, colW - 30);
  fieldValue(frap.derechohabiente, col1X + 29, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('COMPAÑÍA DE SEGUROS GASTOS MÉDICOS:', col1X, leftY + 2);
  fieldLine(col1X + 52, leftY + 2.5, colW - 54);
  fieldValue(frap.compania_seguros, col1X + 53, leftY + 2);
  leftY += 4;
  
  // ORIGEN PROBABLE
  leftY = sectionTitle('ORIGEN PROBABLE:', col1X, leftY);
  const origenes = frap.origen_probable || [];
  xPos = col1X;
  xPos += checkboxLabel('NEUROLOGÍA', origenes.includes('neurologia'), xPos, leftY);
  xPos += checkboxLabel('DIGESTIVA', origenes.includes('digestiva'), xPos, leftY);
  checkboxLabel('INTOXICACIÓN', origenes.includes('intoxicacion'), xPos, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('CARDIOVASCULAR', origenes.includes('cardiovascular'), xPos, leftY);
  xPos += checkboxLabel('UROGENITAL', origenes.includes('urogenital'), xPos, leftY);
  checkboxLabel('INFECCIOSA', origenes.includes('infecciosa'), xPos, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('RESPIRATORIO', origenes.includes('respiratorio'), xPos, leftY);
  xPos += checkboxLabel('GINECO-OBSTÉTRICA', origenes.includes('gineco'), xPos, leftY);
  checkboxLabel('ONCOLÓGICO', origenes.includes('oncologico'), xPos, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('METABÓLICO', origenes.includes('metabolico'), xPos, leftY);
  xPos += checkboxLabel('COGNITIVO EMOCIONAL', origenes.includes('cognitivo'), xPos, leftY);
  checkboxLabel('OTRO', origenes.includes('otro'), xPos, leftY);
  leftY += 3.5;
  
  fieldLabel('ESPECIFIQUE:', col1X, leftY + 2);
  fieldLine(col1X + 18, leftY + 2.5, colW - 20);
  fieldValue(frap.origen_probable_otro, col1X + 19, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('1A VEZ:', col1X, leftY + 2);
  fieldLine(col1X + 12, leftY + 2.5, 15);
  fieldLabel('SUBSECUENTE:', col1X + 32, leftY + 2);
  fieldLine(col1X + 50, leftY + 2.5, colW - 52);
  leftY += 4;
  
  // ACCIDENTE AUTOMOVILÍSTICO
  leftY = sectionTitle('ACCIDENTE AUTOMOVILÍSTICO', col1X, leftY);
  xPos = col1X;
  xPos += checkboxLabel('COLISIÓN', frap.accidente_colision === 'colision', xPos, leftY);
  doc.rect(xPos, leftY - 1.8, 2.2, 2.2);
  xPos += 5;
  xPos += checkboxLabel('VOLCADURA', frap.accidente_colision === 'volcadura', xPos + 15, leftY);
  doc.rect(xPos + 13, leftY - 1.8, 2.2, 2.2);
  leftY += 3;
  
  xPos = col1X;
  xPos += checkboxLabel('AUTOMOTOR', frap.accidente_colision === 'automotor', xPos, leftY);
  xPos += checkboxLabel('MOTOCICLETA', frap.accidente_colision === 'motocicleta', xPos, leftY);
  xPos += checkboxLabel('BICICLETA', frap.accidente_colision === 'bicicleta', xPos, leftY);
  checkboxLabel('MAQUINARIA', frap.accidente_colision === 'maquinaria', xPos, leftY);
  leftY += 4;
  
  fieldLabel('CONTRA OBJETO:', col1X, leftY + 2);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('FIJO', frap.accidente_contra_objeto === 'fijo', xPos, leftY);
  xPos += checkboxLabel('EN MOVIMIENTO', frap.accidente_contra_objeto === 'movimiento', xPos, leftY);
  fieldLabel('IMPACTO:', col1X + 50, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('FRONTAL', frap.accidente_impacto === 'frontal', xPos, leftY);
  xPos += checkboxLabel('LATERAL', frap.accidente_impacto === 'lateral', xPos, leftY);
  checkboxLabel('POSTERIOR', frap.accidente_impacto === 'posterior', xPos, leftY);
  leftY += 3.5;
  
  fieldLabel('HUNDIMIENTO:', col1X, leftY + 2);
  fieldLine(col1X + 18, leftY + 2.5, 10);
  fieldLabel('CMS', col1X + 30, leftY + 2);
  fieldLabel('PARABRISAS', col1X + 40, leftY + 2);
  xPos = col1X + 58;
  xPos += checkboxLabel('ROTO', frap.parabrisas_roto, xPos, leftY + 2);
  checkboxLabel('DOBLADO', frap.parabrisas_doblado, xPos, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('VOLANTE:', col1X, leftY + 2);
  xPos = col1X + 14;
  xPos += checkboxLabel('INTRUSIÓN', frap.volante === 'intrusion', xPos, leftY + 2);
  checkboxLabel('DOBLADO', frap.volante === 'doblado', xPos, leftY + 2);
  fieldLabel('BOLSA DE AIRE:', col1X + 52, leftY + 2);
  checkboxLabel('SÍ', frap.bolsa_aire === 'si', col1X + 70, leftY + 2);
  checkboxLabel('NO', frap.bolsa_aire === 'no', col1X + 78, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('CINTURÓN DE SEGURIDAD:', col1X, leftY + 2);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('COLOCADO', frap.cinturon_seguridad === 'colocado', xPos, leftY);
  xPos += checkboxLabel('NO COLOCADO', frap.cinturon_seguridad === 'no_colocado', xPos, leftY);
  checkboxLabel('SÍ', frap.dentro_vehiculo === 'si', col1X + 52, leftY);
  checkboxLabel('NO', frap.dentro_vehiculo === 'no', col1X + 60, leftY);
  checkboxLabel('EYECTADO', frap.eyectado === 'si', col1X + 70, leftY);
  leftY += 3;
  fieldLabel('DENTRO DEL VEHÍCULO:', col1X + 32, leftY - 0.5);
  leftY += 3;
  
  fieldLabel('ATROPELLADO', col1X, leftY + 2);
  fieldLabel('CASCO DE SEGURIDAD:', col1X + 50, leftY + 2);
  checkboxLabel('SÍ', frap.casco_seguridad === 'si', col1X + 76, leftY + 2);
  checkboxLabel('NO', frap.casco_seguridad === 'no', col1X + 84, leftY + 2);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('AUTOMOTOR', frap.atropellado === 'automotor', xPos, leftY);
  xPos += checkboxLabel('MOTOCICLETA', frap.atropellado === 'motocicleta', xPos, leftY);
  xPos += checkboxLabel('BICICLETA', frap.atropellado === 'bicicleta', xPos, leftY);
  checkboxLabel('MAQUINARIA', frap.atropellado === 'maquinaria', xPos, leftY);
  leftY += 4;
  
  // AGENTE CAUSAL
  leftY = sectionTitle('AGENTE CAUSAL', col1X, leftY);
  const agentes = frap.agente_causal || [];
  xPos = col1X;
  xPos += checkboxLabel('ARMA', agentes.includes('arma'), xPos, leftY);
  xPos += checkboxLabel('MAQUINARIA', agentes.includes('maquinaria'), xPos, leftY);
  checkboxLabel('ELECTRICIDAD', agentes.includes('electricidad'), xPos, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('JUGUETE', agentes.includes('juguete'), xPos, leftY);
  xPos += checkboxLabel('HERRAMIENTA', agentes.includes('herramienta'), xPos, leftY);
  checkboxLabel('EXPLOSIÓN', agentes.includes('explosion'), xPos, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('AUTOMOTOR', agentes.includes('automotor'), xPos, leftY);
  xPos += checkboxLabel('FUEGO', agentes.includes('fuego'), xPos, leftY);
  checkboxLabel('SER HUMANO', agentes.includes('ser_humano'), xPos, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('BICICLETA', agentes.includes('bicicleta'), xPos, leftY);
  xPos += checkboxLabel('SUSTANCIA', agentes.includes('producto_caliente'), xPos, leftY);
  checkboxLabel('ANIMAL', agentes.includes('animal'), xPos, leftY);
  leftY += 2;
  doc.setFontSize(3.5);
  doc.text('CALIENTE', col1X + 20, leftY);
  leftY += 2;
  xPos = col1X;
  xPos += checkboxLabel('PRODUCTO', agentes.includes('sustancia_biologica'), xPos, leftY);
  doc.setFontSize(3.5);
  doc.text('BIOLÓGICO', col1X + 1, leftY + 2);
  xPos += checkboxLabel('SUSTANCIA', agentes.includes('sustancia_toxica'), xPos + 8, leftY);
  doc.setFontSize(3.5);
  doc.text('TÓXICA', col1X + 32, leftY + 2);
  checkboxLabel('OTRO', agentes.includes('otro'), col1X + 55, leftY);
  leftY += 4;
  
  fieldLabel('ESPECIFIQUE:', col1X, leftY + 2);
  fieldLine(col1X + 18, leftY + 2.5, colW - 20);

  // ════════════════════════════════════════════════════════════════
  // COLUMNA DERECHA - PÁGINA 1
  // ════════════════════════════════════════════════════════════════
  
  // NIVEL DE CONCIENCIA
  rightY = sectionTitle('NIVEL DE CONSIENCIA:', col2X, rightY);
  xPos = col2X;
  xPos += checkboxLabel('CONSCIENTE', frap.nivel_conciencia === 'consciente', xPos, rightY);
  
  // VÍA AÉREA al lado
  fieldLabel('VÍA AÉREA:', col2X + colW - 30, rightY - 3);
  fieldLabel('REFLEJO DE DEGLUCIÓN:', col2X + colW - 30, rightY);
  rightY += 3;
  xPos = col2X;
  xPos += checkboxLabel('RESPUESTA A ESTÍMULO VERBAL', frap.nivel_conciencia === 'resp_verbal', xPos, rightY);
  checkboxLabel('PERMEABLE', frap.via_aerea === 'permeable', col2X + colW - 30, rightY);
  checkboxLabel('AUSENTE', frap.reflejo_deglucion === 'ausente', col2X + colW - 12, rightY);
  rightY += 3;
  xPos = col2X;
  xPos += checkboxLabel('RESPUESTA A ESTÍMULO DOLOROSO', frap.nivel_conciencia === 'resp_dolor', xPos, rightY);
  checkboxLabel('COMPROMETIDA', frap.via_aerea === 'comprometida', col2X + colW - 30, rightY);
  checkboxLabel('PRESENTE', frap.reflejo_deglucion === 'presente', col2X + colW - 12, rightY);
  rightY += 3;
  checkboxLabel('INCONSCIENTE', frap.nivel_conciencia === 'inconsciente', col2X, rightY);
  rightY += 4;
  
  // VENTILACIÓN
  rightY = sectionTitle('VENTILACIÓN:', col2X, rightY);
  xPos = col2X;
  xPos += checkboxLabel('AUTOMATISMO REGULAR', frap.ventilacion === 'automatismo_regular', xPos, rightY);
  // AUSCULTACIÓN al lado
  sectionTitle('AUSCULTACIÓN:', col2X + colW/2 + 5, rightY - 3);
  checkboxLabel('RUIDOS RESP. NORMALES', frap.auscultacion === 'normales', col2X + colW/2 + 5, rightY);
  rightY += 3;
  checkboxLabel('AUTOMATISMO IRREGULAR', frap.ventilacion === 'automatismo_irregular', col2X, rightY);
  checkboxLabel('RUIDOS RESP. DISMINUIDOS', frap.auscultacion === 'disminuidos', col2X + colW/2 + 5, rightY);
  rightY += 3;
  checkboxLabel('VENTILACIÓN RÁPIDA', frap.ventilacion === 'rapida', col2X, rightY);
  checkboxLabel('RUIDOS RESP. AUSENTES', frap.auscultacion === 'ausentes', col2X + colW/2 + 5, rightY);
  rightY += 3;
  checkboxLabel('VENTILACIÓN SUPERFICIAL', frap.ventilacion === 'superficial', col2X, rightY);
  rightY += 3;
  checkboxLabel('APNEA', frap.ventilacion === 'apnea', col2X, rightY);
  
  // NEUMOTÓRAX
  fieldLabel('NEUMOTORAX:', col2X + colW/2 + 5, rightY);
  checkboxLabel('DERECHO', frap.neumotorax === 'derecho', col2X + colW - 15, rightY);
  rightY += 3;
  fieldLabel('SITIO:', col2X + colW/2 + 5, rightY);
  checkboxLabel('APICAL', frap.sitio_neumotorax === 'apical', col2X + colW/2 + 18, rightY);
  checkboxLabel('BASE', frap.sitio_neumotorax === 'base', col2X + colW - 8, rightY);
  rightY += 4;
  
  // CIRCULACIÓN
  rightY = sectionTitle('CIRCULACIÓN:', col2X, rightY);
  sectionTitle('PRESENCIA DE PULSOS', col2X + 22, rightY - 3);
  fieldLabel('CALIDAD', col2X + colW/2 + 5, rightY - 3);
  fieldLabel('PIEL', col2X + colW - 25, rightY - 3);
  fieldLabel('CARACTERÍSTICAS', col2X + colW - 12, rightY - 3);
  
  checkboxLabel('CAROTÍDEO', frap.presencia_pulsos === 'carotideo', col2X, rightY);
  checkboxLabel('RÁPIDO', frap.calidad_pulso === 'rapido', col2X + colW/2 + 5, rightY);
  checkboxLabel('NORMAL', frap.piel === 'normal', col2X + colW - 25, rightY);
  checkboxLabel('CALIENTE', frap.caracteristicas_piel === 'caliente', col2X + colW - 12, rightY);
  rightY += 3;
  checkboxLabel('RADIAL', frap.presencia_pulsos === 'radial', col2X, rightY);
  checkboxLabel('LENTO', frap.calidad_pulso === 'lento', col2X + colW/2 + 5, rightY);
  checkboxLabel('PÁLIDA', frap.piel === 'palida', col2X + colW - 25, rightY);
  checkboxLabel('FRÍA', frap.caracteristicas_piel === 'fria', col2X + colW - 12, rightY);
  rightY += 3;
  checkboxLabel('PARO CARDIORESPIRATORIO', frap.presencia_pulsos === 'paro', col2X, rightY);
  checkboxLabel('RÍTMICO', frap.calidad_pulso === 'ritmico', col2X + colW/2 + 5, rightY);
  checkboxLabel('CIANÓTICA', frap.piel === 'cianotica', col2X + colW - 25, rightY);
  checkboxLabel('DIAFORESIS', frap.caracteristicas_piel === 'diaforesis', col2X + colW - 12, rightY);
  rightY += 3;
  checkboxLabel('ARRÍTMICO', frap.calidad_pulso === 'arritmico', col2X + colW/2 + 5, rightY);
  rightY += 4;
  
  // EXPLORACIÓN FÍSICA y ZONAS DE LESIÓN
  rightY = sectionTitle('EXPLORACIÓN FÍSICA', col2X, rightY);
  sectionTitle('ZONAS DE LESIÓN', col2X + colW/2 + 10, rightY - 3);
  
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
  expItems.forEach((item, i) => {
    doc.setFontSize(4);
    doc.setFont('helvetica', 'bold');
    doc.text(item.num, col2X + 1, rightY + 2);
    checkboxLabel(item.label, exploraciones.includes(item.value), col2X + 5, rightY + 2);
    rightY += 2.8;
  });
  
  // Dibujar cuerpo humano
  drawBodyDiagram(col2X + colW/2 + 5, expStartY - 2, 35, 42);
  
  rightY = expStartY + 45;
  
  // TABLA DE SIGNOS VITALES
  const vitalesY = rightY;
  const vitalesHeaders = ['HORA', 'FR', 'FC', 'TAS', 'TAD', 'SaO2', 'TEMP', 'GLUC'];
  const vColW = colW / 8;
  
  setBlack();
  doc.setLineWidth(0.2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(4.5);
  
  // Header
  doc.rect(col2X, rightY, colW, 4);
  vitalesHeaders.forEach((h, i) => {
    if (i > 0) doc.line(col2X + vColW * i, rightY, col2X + vColW * i, rightY + 4 + 12);
    doc.text(h, col2X + vColW * i + vColW/2, rightY + 2.8, { align: 'center' });
  });
  rightY += 4;
  
  // Filas de vitales
  const vitales = frap.vitales || [];
  for (let i = 0; i < 3; i++) {
    doc.rect(col2X, rightY, colW, 4);
    const v = vitales[i] || {};
    const vValues = [v.hora, v.fr, v.fc, v.tas, v.tad, v.sao2, v.temp, v.gluc];
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    vValues.forEach((val, j) => {
      doc.text(String(val || ''), col2X + vColW * j + vColW/2, rightY + 2.8, { align: 'center' });
    });
    rightY += 4;
  }
  rightY += 3;
  
  // CONDICIÓN DEL PACIENTE y PRIORIDAD
  rightY = sectionTitle('CONDICIÓN DEL PACIENTE', col2X, rightY);
  sectionTitle('PRIORIDAD', col2X + colW/2 + 10, rightY - 3);
  
  xPos = col2X;
  xPos += checkboxLabel('CRÍTICO INESTABLE', frap.condicion_paciente === 'critico_inestable', xPos, rightY);
  checkboxLabel('NO CRÍTICO', frap.condicion_paciente === 'no_critico', xPos, rightY);
  
  // Prioridad con colores
  const prioColors = {
    rojo: [220, 53, 69],
    amarillo: [255, 193, 7],
    verde: [40, 167, 69],
    negro: [33, 33, 33]
  };
  
  let prioX = col2X + colW/2 + 10;
  ['rojo', 'verde'].forEach((p, i) => {
    const px = prioX + i * 18;
    doc.setDrawColor(...prioColors[p]);
    doc.setLineWidth(0.3);
    doc.rect(px, rightY - 2.5, 15, 4);
    if (frap.prioridad === p) {
      doc.setFillColor(...prioColors[p]);
      doc.rect(px, rightY - 2.5, 15, 4, 'F');
      doc.setTextColor(...WHITE);
    } else {
      doc.setTextColor(...prioColors[p]);
    }
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.text(p.toUpperCase(), px + 7.5, rightY + 0.3, { align: 'center' });
  });
  setBlack();
  rightY += 4;
  
  checkboxLabel('CRÍTICO ESTABLE', frap.condicion_paciente === 'critico_estable', col2X, rightY);
  
  prioX = col2X + colW/2 + 10;
  ['amarillo', 'negro'].forEach((p, i) => {
    const px = prioX + i * 18;
    doc.setDrawColor(...prioColors[p]);
    doc.setLineWidth(0.3);
    doc.rect(px, rightY - 2.5, 15, 4);
    if (frap.prioridad === p) {
      doc.setFillColor(...prioColors[p]);
      doc.rect(px, rightY - 2.5, 15, 4, 'F');
      doc.setTextColor(p === 'amarillo' ? BLACK : WHITE);
    } else {
      doc.setTextColor(...prioColors[p]);
    }
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.text(p.toUpperCase(), px + 7.5, rightY + 0.3, { align: 'center' });
  });
  setBlack();
  rightY += 5;
  
  // VÍA AÉREA, CONTROL CERVICAL, ASIST. VENTILATORIA, OXIGENOTERAPIA
  rightY = sectionTitle('VÍA AÉREA:', col2X, rightY);
  sectionTitle('CONTROL CERVICAL:', col2X + 20, rightY - 3);
  sectionTitle('ASIST. VENTILATORIA:', col2X + colW/2, rightY - 3);
  sectionTitle('OXIGENOTERAPIA:', col2X + colW - 25, rightY - 3);
  
  const viaAereaManejo = frap.via_aerea_manejo || [];
  checkboxLabel('ASPIRACIÓN', viaAereaManejo.includes('aspiracion'), col2X, rightY);
  checkboxLabel('MANUAL', frap.control_cervical === 'manual', col2X + 20, rightY);
  checkboxLabel('BALÓN-VÁLVULA', frap.asistencia_ventilatoria === 'balon_valvula', col2X + colW/2, rightY);
  doc.setFontSize(3.5);
  doc.text('MASCARILLA', col2X + colW/2 + 1, rightY + 2);
  checkboxLabel('PUNTAS NASALES', frap.oxigenoterapia === 'puntas_nasales', col2X + colW - 25, rightY);
  rightY += 3;
  
  checkboxLabel('CÁNULA OROFARÍNGEA', viaAereaManejo.includes('canula_oro'), col2X, rightY);
  checkboxLabel('COLLARÍN RÍGIDO', frap.control_cervical === 'rigido', col2X + 20, rightY);
  checkboxLabel('VENTILADOR', frap.asistencia_ventilatoria === 'ventilador', col2X + colW/2, rightY);
  doc.setFontSize(3.5);
  doc.text('AUTOMÁTICO', col2X + colW/2 + 1, rightY + 2);
  checkboxLabel('MASCARILLA SIMPLE', frap.oxigenoterapia === 'mascarilla_simple', col2X + colW - 25, rightY);
  rightY += 3;
  
  checkboxLabel('CÁNULA NASOFARÍNGEA', viaAereaManejo.includes('canula_naso'), col2X, rightY);
  checkboxLabel('COLLARÍN BLANDO', frap.control_cervical === 'blando', col2X + 20, rightY);
  fieldLabel('FREC.', col2X + colW/2, rightY);
  fieldLine(col2X + colW/2 + 8, rightY + 0.5, 8);
  fieldLabel('VOL.', col2X + colW/2 + 18, rightY);
  fieldLine(col2X + colW/2 + 24, rightY + 0.5, 8);
  checkboxLabel('MASCARILLA CON', frap.oxigenoterapia === 'mascarilla_reservorio', col2X + colW - 25, rightY);
  doc.setFontSize(3.5);
  doc.text('RESERVORIO', col2X + colW - 24, rightY + 2);
  rightY += 4;
  
  fieldLabel('LTS X MIN:', col2X + colW - 25, rightY);
  fieldLine(col2X + colW - 12, rightY + 0.5, 10);
  fieldValue(frap.lts_x_min, col2X + colW - 11, rightY);
  rightY += 4;
  
  // CONTROL DE HEMORRAGIAS, VÍAS VENOSAS, SITIO, TIPO SOLUCIONES
  rightY = sectionTitle('CONTROL DE HEMORRAGIAS:', col2X, rightY);
  sectionTitle('VÍAS VENOSAS:', col2X + 32, rightY - 3);
  sectionTitle('SITIO DE APLICACIÓN:', col2X + colW/2 + 8, rightY - 3);
  sectionTitle('TIPO DE SOLUCIONES:', col2X + colW - 22, rightY - 3);
  
  const controlHemorragias = frap.control_hemorragias || [];
  checkboxLabel('PRESIÓN DIRECTA', controlHemorragias.includes('presion_directa'), col2X, rightY);
  fieldLabel('VÍA IV #', col2X + 32, rightY);
  fieldLine(col2X + 44, rightY + 0.5, 8);
  fieldValue(frap.via_iv_num, col2X + 45, rightY);
  fieldLabel('MANO', col2X + colW/2 + 8, rightY);
  const soluciones = frap.tipo_soluciones || [];
  checkboxLabel('HARTMANN', soluciones.includes('hartmann'), col2X + colW - 22, rightY);
  rightY += 3;
  
  checkboxLabel('TORNIQUETE', controlHemorragias.includes('torniquete'), col2X, rightY);
  fieldLabel('CATETER #', col2X + 32, rightY);
  fieldLine(col2X + 46, rightY + 0.5, 6);
  fieldValue(frap.cateter_num, col2X + 47, rightY);
  fieldLabel('PLIEGUE ANTECUBITAL', col2X + colW/2 + 8, rightY);
  checkboxLabel('NaCl 0.9%', soluciones.includes('nacl'), col2X + colW - 22, rightY);
  rightY += 3;
  
  checkboxLabel('VENDAJE COMPRESIVO', controlHemorragias.includes('vendaje'), col2X, rightY);
  checkboxLabel('MIXTA', soluciones.includes('mixta'), col2X + colW - 22, rightY);
  rightY += 3;
  checkboxLabel('GLUCOSA 5%', soluciones.includes('glucosa'), col2X + colW - 22, rightY);
  rightY += 3;
  checkboxLabel('OTRA', soluciones.includes('otra'), col2X + colW - 22, rightY);
  rightY += 4;
  
  // INTERROGATORIO
  rightY = sectionTitle('INTERROGATORIO', col2X, rightY);
  fieldLabel('ALERGIAS:', col2X, rightY + 2);
  fieldLine(col2X + 14, rightY + 2.5, colW - 16);
  fieldValue(frap.alergias, col2X + 15, rightY + 2);
  rightY += 3.5;
  
  fieldLabel('MEDICAMENTOS QUE ESTÁ INGIRIENDO:', col2X, rightY + 2);
  fieldLine(col2X + 48, rightY + 2.5, colW - 50);
  fieldValue(frap.medicamentos, col2X + 49, rightY + 2);
  rightY += 3.5;
  
  fieldLabel('ENFERMEDADES Y CIRUGÍAS PREVIAS:', col2X, rightY + 2);
  fieldLine(col2X + 45, rightY + 2.5, colW - 47);
  fieldValue(frap.enfermedades_previas, col2X + 46, rightY + 2);
  rightY += 3.5;
  
  fieldLabel('HORA DE LA ÚLTIMA COMIDA:', col2X, rightY + 2);
  fieldLine(col2X + 36, rightY + 2.5, colW - 38);
  fieldValue(frap.ultima_comida, col2X + 37, rightY + 2);
  rightY += 3.5;
  
  fieldLabel('EVENTOS PREVIOS RELACIONADOS:', col2X, rightY + 2);
  fieldLine(col2X + 42, rightY + 2.5, colW - 44);
  fieldValue(frap.eventos_previos, col2X + 43, rightY + 2);

  // ================================================================
  // PÁGINA 2
  // ================================================================
  doc.addPage();
  y = my;
  leftY = y;
  rightY = y;
  
  // ════════════════════════════════════════════════════════════════
  // PÁGINA 2 - COLUMNA IZQUIERDA (Repetir datos paciente)
  // ════════════════════════════════════════════════════════════════
  
  // NOMBRE DEL PACIENTE
  fieldLabel('NOMBRE DEL PACIENTE:', col1X, leftY + 2);
  fieldLine(col1X + 32, leftY + 2.5, colW - 34);
  fieldValue(frap.nombre_paciente, col1X + 33, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('NOMBRE DEL ACOMPAÑANTE:', col1X, leftY + 2);
  fieldLine(col1X + 38, leftY + 2.5, colW - 40);
  fieldValue(frap.nombre_acompanante, col1X + 39, leftY + 2);
  leftY += 5;
  
  // SEXO y EDAD
  fieldLabel('SEXO', col1X, leftY + 2);
  doc.rect(col1X + 8, leftY - 0.5, 5, 4);
  doc.rect(col1X + 15, leftY - 0.5, 5, 4);
  if (frap.sexo === 'masculino') fieldValue('X', col1X + 9.5, leftY + 2);
  if (frap.sexo === 'femenino') fieldValue('X', col1X + 16.5, leftY + 2);
  doc.setFontSize(3.5);
  doc.text('MASC.', col1X + 8, leftY + 5);
  doc.text('FEM.', col1X + 15, leftY + 5);
  
  fieldLabel('EDAD:', col1X + 28, leftY + 2);
  doc.rect(col1X + 36, leftY - 0.5, 8, 4);
  doc.rect(col1X + 46, leftY - 0.5, 8, 4);
  fieldValue(frap.edad_anos || '', col1X + 38, leftY + 2);
  fieldValue(frap.edad_meses || '', col1X + 48, leftY + 2);
  doc.setFontSize(3.5);
  doc.text('AÑOS', col1X + 56, leftY + 2);
  doc.text('MESES', col1X + 56, leftY + 4.5);
  leftY += 7;
  
  fieldLabel('DOMICILIO:', col1X, leftY + 2);
  fieldLine(col1X + 16, leftY + 2.5, colW - 18);
  fieldValue(frap.domicilio, col1X + 17, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('COLONIA/COMUNIDAD:', col1X, leftY + 2);
  fieldLine(col1X + 28, leftY + 2.5, colW - 30);
  fieldValue(frap.colonia_paciente, col1X + 29, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('DELEGACIÓN POLÍTICA/MUNICIPIO:', col1X, leftY + 2);
  fieldLine(col1X + 42, leftY + 2.5, colW - 44);
  fieldValue(frap.delegacion_paciente, col1X + 43, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('TELÉFONO:', col1X, leftY + 2);
  fieldLine(col1X + 15, leftY + 2.5, 22);
  fieldValue(frap.telefono, col1X + 16, leftY + 2);
  fieldLabel('OCUPACIÓN:', col1X + 40, leftY + 2);
  fieldLine(col1X + 55, leftY + 2.5, colW - 57);
  fieldValue(frap.ocupacion, col1X + 56, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('DERECHOHABIENTE A:', col1X, leftY + 2);
  fieldLine(col1X + 28, leftY + 2.5, colW - 30);
  fieldValue(frap.derechohabiente, col1X + 29, leftY + 2);
  leftY += 3.5;
  
  fieldLabel('COMPAÑÍA DE SEGUROS GASTOS MÉDICOS:', col1X, leftY + 2);
  fieldLine(col1X + 52, leftY + 2.5, colW - 54);
  fieldValue(frap.compania_seguros, col1X + 53, leftY + 2);
  leftY += 5;
  
  // ORIGEN PROBABLE
  leftY = sectionTitle('ORIGEN PROBABLE:', col1X, leftY);
  xPos = col1X;
  xPos += checkboxLabel('NEUROLOGÍA', origenes.includes('neurologia'), xPos, leftY);
  xPos += checkboxLabel('DIGESTIVA', origenes.includes('digestiva'), xPos, leftY);
  checkboxLabel('INTOXICACIÓN', origenes.includes('intoxicacion'), xPos, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('CARDIOVASCULAR', origenes.includes('cardiovascular'), xPos, leftY);
  xPos += checkboxLabel('UROGENITAL', origenes.includes('urogenital'), xPos, leftY);
  checkboxLabel('INFECCIOSA', origenes.includes('infecciosa'), xPos, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('RESPIRATORIO', origenes.includes('respiratorio'), xPos, leftY);
  xPos += checkboxLabel('GINECO-OBSTÉTRICA', origenes.includes('gineco'), xPos, leftY);
  checkboxLabel('ONCOLÓGICO', origenes.includes('oncologico'), xPos, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('METABÓLICO', origenes.includes('metabolico'), xPos, leftY);
  xPos += checkboxLabel('COGNITIVO EMOCIONAL', origenes.includes('cognitivo'), xPos, leftY);
  checkboxLabel('OTRO', origenes.includes('otro'), xPos, leftY);
  leftY += 3.5;
  
  fieldLabel('ESPECIFIQUE:', col1X, leftY + 2);
  fieldLine(col1X + 18, leftY + 2.5, colW - 20);
  leftY += 3.5;
  
  fieldLabel('1A VEZ:', col1X, leftY + 2);
  fieldLine(col1X + 12, leftY + 2.5, 15);
  fieldLabel('SUBSECUENTE:', col1X + 32, leftY + 2);
  fieldLine(col1X + 50, leftY + 2.5, colW - 52);
  leftY += 5;
  
  // ACCIDENTE AUTOMOVILÍSTICO (repetido en pág 2)
  leftY = sectionTitle('ACCIDENTE AUTOMOVILÍSTICO', col1X, leftY);
  // ... contenido similar a página 1 pero más compacto
  xPos = col1X;
  xPos += checkboxLabel('COLISIÓN', frap.accidente_colision === 'colision', xPos, leftY);
  checkboxLabel('VOLCADURA', frap.accidente_colision === 'volcadura', col1X + 30, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('AUTOMOTOR', frap.accidente_colision === 'automotor', xPos, leftY);
  xPos += checkboxLabel('MOTOCICLETA', frap.accidente_colision === 'motocicleta', xPos, leftY);
  xPos += checkboxLabel('BICICLETA', frap.accidente_colision === 'bicicleta', xPos, leftY);
  checkboxLabel('MAQUINARIA', frap.accidente_colision === 'maquinaria', xPos, leftY);
  leftY += 8;
  
  // AGENTE CAUSAL (compacto)
  leftY = sectionTitle('AGENTE CAUSAL', col1X, leftY);
  xPos = col1X;
  xPos += checkboxLabel('ARMA', agentes.includes('arma'), xPos, leftY);
  xPos += checkboxLabel('MAQUINARIA', agentes.includes('maquinaria'), xPos, leftY);
  checkboxLabel('ELECTRICIDAD', agentes.includes('electricidad'), xPos, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('JUGUETE', agentes.includes('juguete'), xPos, leftY);
  xPos += checkboxLabel('HERRAMIENTA', agentes.includes('herramienta'), xPos, leftY);
  checkboxLabel('EXPLOSIÓN', agentes.includes('explosion'), xPos, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('AUTOMOTOR', agentes.includes('automotor'), xPos, leftY);
  xPos += checkboxLabel('FUEGO', agentes.includes('fuego'), xPos, leftY);
  checkboxLabel('SER HUMANO', agentes.includes('ser_humano'), xPos, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('BICICLETA', agentes.includes('bicicleta'), xPos, leftY);
  xPos += checkboxLabel('SUSTANCIA CALIENTE', agentes.includes('producto_caliente'), xPos, leftY);
  checkboxLabel('ANIMAL', agentes.includes('animal'), xPos, leftY);
  leftY += 3;
  xPos = col1X;
  xPos += checkboxLabel('PRODUCTO BIOLÓGICO', agentes.includes('sustancia_biologica'), xPos, leftY);
  xPos += checkboxLabel('SUSTANCIA TÓXICA', agentes.includes('sustancia_toxica'), xPos, leftY);
  checkboxLabel('OTRO', agentes.includes('otro'), xPos, leftY);
  leftY += 4;
  
  fieldLabel('ESPECIFIQUE:', col1X, leftY + 2);
  fieldLine(col1X + 18, leftY + 2.5, colW - 20);
  leftY += 3.5;
  fieldLabel('LESIONES CAUSADAS POR:', col1X, leftY + 2);
  fieldLine(col1X + 32, leftY + 2.5, colW - 34);
  fieldValue(frap.lesiones_causadas_por, col1X + 33, leftY + 2);
  leftY += 5;
  
  // DATOS DE LA MADRE
  leftY = sectionTitle('DATOS DE LA MADRE.', col1X, leftY);
  fieldLabel('GESTA:', col1X, leftY + 2);
  fieldLine(col1X + 10, leftY + 2.5, 8);
  fieldValue(frap.madre_gesta, col1X + 11, leftY + 2);
  fieldLabel('CESÁREAS:', col1X + 20, leftY + 2);
  fieldLine(col1X + 34, leftY + 2.5, 8);
  fieldValue(frap.madre_cesareas, col1X + 35, leftY + 2);
  fieldLabel('PARA:', col1X + 44, leftY + 2);
  fieldLine(col1X + 52, leftY + 2.5, 8);
  fieldValue(frap.madre_para, col1X + 53, leftY + 2);
  fieldLabel('ABORTOS:', col1X + 62, leftY + 2);
  fieldLine(col1X + 76, leftY + 2.5, 8);
  fieldValue(frap.madre_abortos, col1X + 77, leftY + 2);
  fieldLabel('FUM:', col1X + 86, leftY + 2);
  fieldLine(col1X + 92, leftY + 2.5, colW - 94);
  fieldValue(frap.madre_fum, col1X + 93, leftY + 2);
  leftY += 4;
  
  fieldLabel('SEMANAS DE GESTACIÓN:', col1X, leftY + 2);
  fieldLine(col1X + 32, leftY + 2.5, 12);
  fieldValue(frap.madre_semanas, col1X + 33, leftY + 2);
  fieldLabel('FECHA PROBABLE DE PARTO:', col1X + 48, leftY + 2);
  fieldLine(col1X + 80, leftY + 2.5, colW - 82);
  fieldValue(frap.madre_fecha_probable, col1X + 81, leftY + 2);
  leftY += 4;
  
  fieldLabel('HORA INICIO CONTRACCIONES:', col1X, leftY + 2);
  fieldLine(col1X + 40, leftY + 2.5, 15);
  fieldValue(frap.madre_hora_contracciones, col1X + 41, leftY + 2);
  fieldLabel('FRECUENCIA:', col1X + 58, leftY + 2);
  fieldLine(col1X + 75, leftY + 2.5, 10);
  fieldValue(frap.madre_frecuencia, col1X + 76, leftY + 2);
  fieldLabel('DURACIÓN:', col1X + 88, leftY + 2);
  fieldLine(col1X + 100, leftY + 2.5, colW - 102);
  fieldValue(frap.madre_duracion, col1X + 101, leftY + 2);
  leftY += 5;
  
  // DATOS POST-PARTO
  leftY = sectionTitle('DATOS POST-PARTO:', col1X, leftY);
  fieldLabel('HORA DE NACIMIENTO:', col1X, leftY + 2);
  fieldLine(col1X + 30, leftY + 2.5, 15);
  fieldValue(frap.postparto_hora_nacimiento, col1X + 31, leftY + 2);
  fieldLabel('LUGAR:', col1X + 48, leftY + 2);
  fieldLine(col1X + 58, leftY + 2.5, colW - 60);
  fieldValue(frap.postparto_lugar, col1X + 59, leftY + 2);
  leftY += 4;
  
  fieldLabel('PLACENTA EXPULSADA:', col1X, leftY + 2);
  fieldLine(col1X + 30, leftY + 2.5, colW - 32);

  // ════════════════════════════════════════════════════════════════
  // PÁGINA 2 - COLUMNA DERECHA
  // ════════════════════════════════════════════════════════════════
  
  // Caja de signos vitales vacía
  doc.setLineWidth(0.2);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      doc.rect(col2X + col * 12, rightY + row * 5, 12, 5);
    }
  }
  rightY += 18;
  
  // CONDICIÓN DEL PACIENTE
  rightY = sectionTitle('CONDICIÓN DEL PACIENTE', col2X, rightY);
  sectionTitle('PRIORIDAD', col2X + colW/2, rightY - 3);
  xPos = col2X;
  xPos += checkboxLabel('CRÍTICO INESTABLE', frap.condicion_paciente === 'critico_inestable', xPos, rightY);
  checkboxLabel('NO CRÍTICO', frap.condicion_paciente === 'no_critico', xPos, rightY);
  checkboxLabel('ROJO', frap.prioridad === 'rojo', col2X + colW/2, rightY);
  checkboxLabel('VERDE', frap.prioridad === 'verde', col2X + colW - 15, rightY);
  rightY += 3;
  checkboxLabel('CRÍTICO ESTABLE', frap.condicion_paciente === 'critico_estable', col2X, rightY);
  checkboxLabel('AMARILLO', frap.prioridad === 'amarillo', col2X + colW/2, rightY);
  checkboxLabel('NEGRO', frap.prioridad === 'negro', col2X + colW - 15, rightY);
  rightY += 5;
  
  // VÍA AÉREA etc (compacto en pág 2)
  rightY = sectionTitle('VÍA AÉREA:', col2X, rightY);
  sectionTitle('CONTROL CERVICAL:', col2X + 22, rightY - 3);
  sectionTitle('ASISTENCIA VENTILATORIA/OXIGENOTERAPIA:', col2X + colW/2, rightY - 3);
  
  checkboxLabel('ASPIRACIÓN', viaAereaManejo.includes('aspiracion'), col2X, rightY);
  checkboxLabel('MANUAL', frap.control_cervical === 'manual', col2X + 22, rightY);
  checkboxLabel('BALÓN-VÁLVULA MASCARILLA', frap.asistencia_ventilatoria === 'balon_valvula', col2X + colW/2, rightY);
  checkboxLabel('PUNTAS NASALES', frap.oxigenoterapia === 'puntas_nasales', col2X + colW - 22, rightY);
  rightY += 3;
  checkboxLabel('CÁNULA OROFARÍNGEA', viaAereaManejo.includes('canula_oro'), col2X, rightY);
  checkboxLabel('COLLARÍN RÍGIDO', frap.control_cervical === 'rigido', col2X + 22, rightY);
  checkboxLabel('VENTILADOR AUTOMÁTICO', frap.asistencia_ventilatoria === 'ventilador', col2X + colW/2, rightY);
  checkboxLabel('MASCARILLA SIMPLE', frap.oxigenoterapia === 'mascarilla_simple', col2X + colW - 22, rightY);
  rightY += 3;
  checkboxLabel('CÁNULA NASOFARÍNGEA', viaAereaManejo.includes('canula_naso'), col2X, rightY);
  checkboxLabel('COLLARÍN BLANDO', frap.control_cervical === 'blando', col2X + 22, rightY);
  fieldLabel('FREC.', col2X + colW/2, rightY);
  fieldLabel('VOL.', col2X + colW/2 + 18, rightY);
  checkboxLabel('MASCARILLA CON RESERVORIO', frap.oxigenoterapia === 'mascarilla_reservorio', col2X + colW - 22, rightY);
  rightY += 5;
  
  // INTERROGATORIO
  rightY = sectionTitle('INTERROGATORIO', col2X, rightY);
  fieldLabel('ALERGIAS:', col2X, rightY + 2);
  fieldLine(col2X + 14, rightY + 2.5, colW - 16);
  fieldValue(frap.alergias, col2X + 15, rightY + 2);
  rightY += 3.5;
  
  fieldLabel('MEDICAMENTOS QUE ESTÁ INGIRIENDO:', col2X, rightY + 2);
  fieldLine(col2X + 48, rightY + 2.5, colW - 50);
  fieldValue(frap.medicamentos, col2X + 49, rightY + 2);
  rightY += 3.5;
  
  fieldLabel('ENFERMEDADES Y CIRUGÍAS PREVIAS:', col2X, rightY + 2);
  fieldLine(col2X + 45, rightY + 2.5, colW - 47);
  fieldValue(frap.enfermedades_previas, col2X + 46, rightY + 2);
  rightY += 3.5;
  
  fieldLabel('HORA DE LA ÚLTIMA COMIDA:', col2X, rightY + 2);
  fieldLine(col2X + 36, rightY + 2.5, colW - 38);
  fieldValue(frap.ultima_comida, col2X + 37, rightY + 2);
  rightY += 3.5;
  
  fieldLabel('EVENTOS PREVIOS RELACIONADOS:', col2X, rightY + 2);
  fieldLine(col2X + 42, rightY + 2.5, colW - 44);
  fieldValue(frap.eventos_previos, col2X + 43, rightY + 2);
  rightY += 5;
  
  // OBSERVACIONES
  rightY = sectionTitle('OBSERVACIONES:', col2X, rightY);
  doc.rect(col2X, rightY, colW, 18);
  const obsLines = doc.splitTextToSize(frap.observaciones || '', colW - 4);
  doc.setFontSize(5);
  doc.text(obsLines, col2X + 2, rightY + 3);
  rightY += 20;
  
  // ESCALA DE GLASGOW
  fieldLabel('ESCALA DE GLASGOW', col2X, rightY + 2);
  doc.rect(col2X + colW - 12, rightY - 1, 10, 5);
  fieldValue(frap.glasgow_total || '', col2X + colW - 9, rightY + 2);
  rightY += 6;
  
  // ESCALA PREHOSPITALARIA DE CINCINNATI
  rightY = sectionTitle('ESCALA PREHOSPITALARIA DE CINCINNATI', col2X, rightY);
  fieldLabel('ASIMETRÍA FACIAL', col2X + 2, rightY + 2);
  checkboxLabel('SÍ', frap.asimetria_facial === 'si', col2X + colW - 20, rightY + 2);
  checkboxLabel('NO', frap.asimetria_facial === 'no', col2X + colW - 8, rightY + 2);
  rightY += 3;
  fieldLabel('PARESIA DE LOS BRAZOS', col2X + 2, rightY + 2);
  checkboxLabel('SÍ', frap.paresia_brazos === 'si', col2X + colW - 20, rightY + 2);
  checkboxLabel('NO', frap.paresia_brazos === 'no', col2X + colW - 8, rightY + 2);
  rightY += 3;
  fieldLabel('ALTERACIÓN DEL LENGUAJE', col2X + 2, rightY + 2);
  checkboxLabel('SÍ', frap.alteracion_lenguaje === 'si', col2X + colW - 20, rightY + 2);
  checkboxLabel('NO', frap.alteracion_lenguaje === 'no', col2X + colW - 8, rightY + 2);
  rightY += 5;
  
  // ESCALA DE TRAUMA
  rightY = sectionTitle('ESCALA DE TRAUMA', col2X, rightY);
  const traumaHeaders = ['(A)GCS', '(B)PAS', '(C)FR', '(D) Esfuerzo', '(E)Llenado', 'Puntuación'];
  const tColW = colW / 6;
  
  doc.setLineWidth(0.2);
  doc.rect(col2X, rightY, colW, 4);
  doc.setFontSize(4);
  doc.setFont('helvetica', 'bold');
  traumaHeaders.forEach((h, i) => {
    if (i > 0) doc.line(col2X + tColW * i, rightY, col2X + tColW * i, rightY + 28);
    doc.text(h, col2X + tColW * i + tColW/2, rightY + 2.8, { align: 'center' });
  });
  doc.setFontSize(3);
  doc.text('Respiratorio', col2X + tColW * 3 + tColW/2, rightY + 5.5, { align: 'center' });
  doc.text('Capilar', col2X + tColW * 4 + tColW/2, rightY + 5.5, { align: 'center' });
  rightY += 4;
  
  const traumaRows = [
    ['14-15', '', '', '', '', '5'],
    ['11-13', '90 o +', '10-24', '', '', '4'],
    ['8-10', '70-89', '25-35', '', '', '3'],
    ['5-7', '50-69', '>35', 'normal', '', '2'],
    ['3-4', '0-49', '1-9', 'retracción', 'normal retardado', '1'],
    ['', '', '0-49', 'Puntuación', 'ausente', '0'],
  ];
  
  traumaRows.forEach((row) => {
    doc.rect(col2X, rightY, colW, 4);
    doc.setFontSize(4);
    doc.setFont('helvetica', 'normal');
    row.forEach((cell, j) => {
      doc.text(cell, col2X + tColW * j + tColW/2, rightY + 2.8, { align: 'center' });
    });
    rightY += 4;
  });
  
  fieldLabel('Puntuación Total:', col2X + colW - 35, rightY + 2);
  fieldLabel('A+B+C+D+E', col2X + colW - 18, rightY + 2);
  rightY += 5;
  
  // DATOS RECIÉN NACIDO y DESTINO
  const rnY = Math.max(leftY, rightY) - 40;
  rightY = sectionTitle('DATOS RECIÉN NACIDO:', col2X, rnY);
  sectionTitle('DESTINO', col2X + colW/2 + 10, rnY);
  
  fieldLabel('PRODUCTO:', col2X, rightY + 2);
  checkboxLabel('VIVO', frap.recien_nacido_producto === 'vivo', col2X + 18, rightY + 2);
  checkboxLabel('MUERTO', frap.recien_nacido_producto === 'muerto', col2X + 32, rightY + 2);
  fieldLabel('SEXO:', col2X + 48, rightY + 2);
  checkboxLabel('MASC', frap.recien_nacido_sexo === 'masculino', col2X + 58, rightY + 2);
  checkboxLabel('FEM', frap.recien_nacido_sexo === 'femenino', col2X + 72, rightY + 2);
  checkboxLabel('TRASLADADO', frap.recien_nacido_destino === 'trasladado', col2X + colW/2 + 10, rightY + 2);
  rightY += 3;
  
  fieldLabel('APGAR:', col2X, rightY + 2);
  checkboxLabel('NO TRASLADADO', frap.recien_nacido_destino === 'no_trasladado', col2X + colW/2 + 10, rightY + 2);
  rightY += 3;
  
  doc.rect(col2X + 12, rightY - 1, 10, 4);
  doc.rect(col2X + 24, rightY - 1, 10, 4);
  doc.rect(col2X + 36, rightY - 1, 10, 4);
  fieldValue(frap.recien_nacido_apgar_1 || '', col2X + 15, rightY + 1.5);
  fieldValue(frap.recien_nacido_apgar_5 || '', col2X + 27, rightY + 1.5);
  fieldValue(frap.recien_nacido_apgar_10 || '', col2X + 39, rightY + 1.5);
  doc.setFontSize(3.5);
  doc.text('1 MIN', col2X + 14, rightY + 5);
  doc.text('5 MIN', col2X + 26, rightY + 5);
  doc.text('10 MIN', col2X + 37.5, rightY + 5);
  checkboxLabel('FUGA', frap.recien_nacido_destino === 'fuga', col2X + colW/2 + 10, rightY + 2);
  rightY += 6;
  
  fieldLabel('PRODUCTO:', col2X, rightY + 2);
  doc.rect(col2X + 18, rightY - 1, 10, 4);
  doc.rect(col2X + 30, rightY - 1, 10, 4);
  doc.rect(col2X + 42, rightY - 1, 10, 4);

  // ════════════════════════════════════════════════════════════════
  // SECCIÓN INFERIOR - FIRMAS Y CONSENTIMIENTOS
  // ════════════════════════════════════════════════════════════════
  const footerY = ph - 55;
  
  // NEGATIVA A RECIBIR ATENCIÓN
  setRed();
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.text('NEGATIVA A RECIBIR ATENCIÓN/ SER TRASLADADO EXIMENTE DE RESPONSABILIDAD', mx, footerY);
  
  setBlack();
  doc.setFontSize(4);
  doc.setFont('helvetica', 'normal');
  const negText = 'DECLARO QUE NO ACEPTO LAS RECOMENDACIONES DEL PERSONAL DE LA AMBULANCIA DEL CUERPO DE RESCATE EN CUANTO AL (TRATAMIENTO) Y/O (TRASLADO) A UN HOSPITAL; POR LO QUE EXIMO A EL CUERPO DE RESCATE Y A DICHAS PERSONAS DE TODA RESPONSABILIDAD QUE PUDIERA DERIVAR AL HABER RESPETADO Y CUMPLIDO MI DECISIÓN.';
  const negLines = doc.splitTextToSize(negText, cw/2 - 4);
  doc.text(negLines, mx + 2, footerY + 4);
  
  // CONSENTIMIENTO INFORMADO
  setRed();
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.text('CONSENTIMIENTO INFORMADO', pw/2 + 2, footerY);
  
  setBlack();
  doc.setFontSize(4);
  doc.setFont('helvetica', 'normal');
  const consText = 'PREVIO A UNA DETALLADA EXPLICACIÓN DOY MI CONSENTIMIENTO A SER TRASLADADO Y/O ATENDIDO POR EL PERSONAL DEL CUERPO DE RESCATE A.C.';
  const consLines = doc.splitTextToSize(consText, cw/2 - 4);
  doc.text(consLines, pw/2 + 4, footerY + 4);
  
  // AUTORIDADES QUE INTERVINIERON
  setRed();
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.text('AUTORIDADES QUE INTERVINIERON', pw/2 + cw/4, footerY);
  
  setBlack();
  fieldLabel('ENTREGA PACIENTE', pw/2 + cw/4 + 2, footerY + 8);
  fieldLine(pw/2 + cw/4 + 28, footerY + 8.5, 30);
  doc.setFontSize(3.5);
  doc.text('NOMBRE Y FIRMA', pw/2 + cw/4 + 38, footerY + 11);
  
  fieldLabel('MÉDICO QUE RECIBE', pw/2 + cw/4 + 2, footerY + 16);
  fieldLine(pw/2 + cw/4 + 28, footerY + 16.5, 30);
  doc.setFontSize(3.5);
  doc.text('NOMBRE Y FIRMA', pw/2 + cw/4 + 38, footerY + 19);
  
  // Líneas de firmas
  const sigY = footerY + 25;
  fieldLine(mx + 5, sigY, 40);
  doc.setFontSize(4);
  doc.text('NOMBRE/FIRMA DEL PACIENTE', mx + 10, sigY + 3);
  
  fieldLine(mx + 55, sigY, 40);
  doc.text('NOMBRE/FIRMA DEL TESTIGO', mx + 60, sigY + 3);
  
  fieldLine(pw/2 + 5, sigY, 40);
  doc.text('NOMBRE/FIRMA DEL PACIENTE', pw/2 + 10, sigY + 3);
  
  fieldLine(pw/2 + 55, sigY, 40);
  doc.text('NOMBRE/FIRMA DE FAMILIAR O TUTOR', pw/2 + 55, sigY + 3);
  
  // Agregar firmas si existen
  if (frap.firmas) {
    if (frap.firmas.paciente) {
      try { doc.addImage(frap.firmas.paciente, 'PNG', mx + 10, sigY - 10, 30, 8); } catch(e){}
    }
    if (frap.firmas.testigo) {
      try { doc.addImage(frap.firmas.testigo, 'PNG', mx + 60, sigY - 10, 30, 8); } catch(e){}
    }
    if (frap.firmas.familiar_tutor) {
      try { doc.addImage(frap.firmas.familiar_tutor, 'PNG', pw/2 + 60, sigY - 10, 30, 8); } catch(e){}
    }
    if (frap.firmas.entrega_paciente) {
      try { doc.addImage(frap.firmas.entrega_paciente, 'PNG', pw/2 + cw/4 + 30, footerY + 2, 25, 6); } catch(e){}
    }
    if (frap.firmas.medico_recibe) {
      try { doc.addImage(frap.firmas.medico_recibe, 'PNG', pw/2 + cw/4 + 30, footerY + 10, 25, 6); } catch(e){}
    }
  }

  // ── Descargar ──
  doc.save(`FRAP_${frap.folio || 'SinFolio'}.pdf`);
};
