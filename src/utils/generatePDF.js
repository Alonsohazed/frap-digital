import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * GENERACIÓN DE PDF FRAP - REPLICACIÓN PIXEL-PERFECT DEL DISEÑO ORIGINAL
 * Basado en medidas exactas del PDF de referencia
 */

export const generateFRAPPDF = async (frap) => {
  const doc = new jsPDF('p', 'mm', 'letter');
  
  // Dimensiones de página
  const pw = doc.internal.pageSize.getWidth(); // 215.9mm
  const ph = doc.internal.pageSize.getHeight(); // 279.4mm
  
  // Márgenes (15mm según análisis)
  const mx = 15;
  const my = 15;
  const cw = pw - (mx * 2); // Ancho del contenido: 185.9mm
  
  // Colores (EXACTOS del PDF original)
  const GREEN = [0, 128, 0]; // #008000
  const BLACK = [0, 0, 0];
  const WHITE = [255, 255, 255];
  const LIGHT_GRAY = [200, 200, 200];
  
  // Funciones helper
  const checkbox = (label, checked, x, y, size = 4) => {
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.3);
    doc.rect(x, y - 3, size, size, 'S');
    if (checked) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('✓', x + 1, y - 0.5);
    }
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BLACK);
    doc.text(label, x + size + 1, y);
  };
  
  const label = (text, x, y) => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLACK);
    doc.text(text, x, y);
  };
  
  const value = (text, x, y) => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BLACK);
    doc.text(String(text || ''), x, y);
  };
  
  const line = (x, y, width) => {
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.2);
    doc.line(x, y, x + width, y);
  };
  
  const sectionTitle = (title, x, y, width) => {
    doc.setFillColor(...GREEN);
    doc.rect(x, y, width, 6, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(title, x + 2, y + 4);
    doc.setTextColor(...BLACK);
    return y + 8;
  };
  
  const fieldRow = (label, value, x, y, labelWidth, valueWidth) => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(label, x, y);
    doc.setFont('helvetica', 'normal');
    const valueText = String(value || '');
    doc.text(valueText, x + labelWidth, y);
    return 4;
  };
  
  // ════════════════════════════════════════════════════════════════
  // PÁGINA 1
  // ════════════════════════════════════════════════════════════════
  
  let leftY = my;
  let rightY = my;
  
  // Definir anchos de columnas (según análisis: izq 85-90mm, der 75-80mm)
  const col1X = mx;
  const col1W = 95;
  const col2X = mx + col1W + 5;
  const col2W = cw - col1W - 5;
  
  // ────────────────────────────────────────────────────────────────
  // HEADER - Organización
  // ────────────────────────────────────────────────────────────────
  doc.setFillColor(...GREEN);
  doc.rect(mx, my, cw, 12, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('CUERPO DE RESCATE DE ENSENADA, A.C.', mx + 2, my + 5);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Calle Magnolias No. 2356', mx + 2, my + 8);
  doc.text('Col. Márquez de León, Ensenada, B.C.', mx + 2, my + 10.5);
  doc.text('Tels. 176-8033 y 177-9992', mx + 2, my + 13);
  
  // Fecha y Folio (lado derecho del header)
  doc.setFillColor(...WHITE);
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(1);
  doc.rect(mx + cw - 45, my + 2, 43, 10, 'FD');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BLACK);
  doc.text('FECHA:', mx + cw - 43, my + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(frap.fecha || '', mx + cw - 28, my + 5);
  
  doc.setFont('helvetica', 'bold');
  doc.text('# FOLIO:', mx + cw - 43, my + 10);
  doc.setFontSize(14);
  doc.setTextColor(...GREEN);
  doc.text(frap.folio || '', mx + cw - 26, my + 10);
  
  leftY = my + 15;
  rightY = my + 15;
  
  // ────────────────────────────────────────────────────────────────
  // TIEMPOS
  // ────────────────────────────────────────────────────────────────
  doc.setFillColor(...GREEN);
  doc.rect(mx, leftY, cw, 6, 'F');
  
  const timeLabels = ['HORA LLAMADA', 'HORA SALIDA', 'HORA LLEGADA', 'HORA TRASLADO', 'HORA HOSPITAL', 'HORA BASE'];
  const timeValues = [frap.hora_llamada, frap.hora_salida, frap.hora_llegada, frap.hora_traslado, frap.hora_hospital, frap.hora_base];
  const timeW = cw / 6;
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  
  timeLabels.forEach((lbl, i) => {
    doc.text(lbl, mx + (timeW * i) + 2, leftY + 4);
  });
  
  leftY += 7;
  doc.setTextColor(...BLACK);
  doc.setFont('helvetica', 'normal');
  
  timeValues.forEach((val, i) => {
    doc.rect(mx + (timeW * i), leftY, timeW, 6, 'S');
    doc.text(val || '', mx + (timeW * i) + timeW / 2, leftY + 4, { align: 'center' });
  });
  
  leftY += 8;
  rightY = leftY;
  
  // ════════════════════════════════════════════════════════════════
  // COLUMNA IZQUIERDA - PÁGINA 1
  // ════════════════════════════════════════════════════════════════
  
  // MOTIVO DE LA ATENCIÓN
  leftY = sectionTitle('MOTIVO DE LA ATENCIÓN', col1X, leftY, col1W);
  
  const motivos = [
    { value: 'traslado_programado', label: 'TRASLADO PROGRAMADO' },
    { value: 'enfermedad', label: 'ENFERMEDAD' },
    { value: 'traumatismo', label: 'TRAUMATISMO' },
    { value: 'gineco_obstetrico', label: 'GINECOBSTÉTRICO' }
  ];
  
  motivos.forEach(({ value, label }, i) => {
    checkbox(label, frap.motivo_atencion === value, col1X + 2 + (i * 24), leftY, 4);
  });
  leftY += 6;
  
  // UBICACIÓN DEL SERVICIO
  leftY = sectionTitle('UBICACIÓN DEL SERVICIO', col1X, leftY, col1W);
  leftY += fieldRow('CALLE:', frap.calle, col1X + 2, leftY, 15, 60);
  leftY += fieldRow('ENTRE:', frap.entre, col1X + 2, leftY, 15, 60);
  leftY += fieldRow('COLONIA/COMUNIDAD:', frap.colonia, col1X + 2, leftY, 35, 45);
  leftY += fieldRow('DELEGACIÓN POLÍTICA/MUNICIPIO:', frap.delegacion_municipio, col1X + 2, leftY, 55, 25);
  leftY += 2;
  
  label('LUGAR DE OCURRENCIA:', col1X + 2, leftY);
  leftY += 4;
  
  const lugares = [
    { value: 'hogar', label: 'HOGAR' },
    { value: 'via_publica', label: 'VÍA PÚBLICA' },
    { value: 'trabajo', label: 'TRABAJO' },
    { value: 'escuela', label: 'ESCUELA' },
    { value: 'recreacion', label: 'RECREACIÓN Y DEPORTE' },
    { value: 'transporte', label: 'TRANSPORTE PÚBLICO' },
    { value: 'otro', label: 'OTRA' }
  ];
  
  lugares.forEach(({ value, label }, i) => {
    if (i < 3) {
      checkbox(label, frap.lugar_ocurrencia === value, col1X + 2 + (i * 32), leftY, 4);
    } else {
      checkbox(label, frap.lugar_ocurrencia === value, col1X + 2 + ((i - 3) * 32), leftY + 4, 4);
    }
  });
  leftY += 10;
  
  leftY += fieldRow('NÚMERO DE AMBULANCIA:', frap.numero_ambulancia, col1X + 2, leftY, 45, 30);
  leftY += fieldRow('OPERADOR:', frap.operador, col1X + 2, leftY, 22, 53);
  leftY += fieldRow('PRESTADORES DEL SERVICIO:', frap.prestadores_servicio, col1X + 2, leftY, 50, 25);
  leftY += 2;
  
  // NOMBRE DEL PACIENTE
  leftY = sectionTitle('NOMBRE DEL PACIENTE', col1X, leftY, col1W);
  value(frap.nombre_paciente, col1X + 2, leftY);
  leftY += 6;
  
  leftY += fieldRow('NOMBRE DEL ACOMPAÑANTE:', frap.nombre_acompanante, col1X + 2, leftY, 50, 25);
  
  label('SEXO:', col1X + 2, leftY + 4);
  checkbox('M MASC.', frap.sexo === 'masculino', col1X + 15, leftY + 4, 4);
  checkbox('FEM.', frap.sexo === 'femenino', col1X + 35, leftY + 4, 4);
  
  label('EDAD:', col1X + 50, leftY + 4);
  doc.rect(col1X + 62, leftY + 1, 10, 5, 'S');
  value(frap.edad_anos, col1X + 64, leftY + 4);
  label('AÑOS', col1X + 73, leftY + 4);
  
  doc.rect(col1X + 80, leftY + 1, 8, 5, 'S');
  value(frap.edad_meses, col1X + 82, leftY + 4);
  label('MESES', col1X + 89, leftY + 4);
  
  leftY += 8;
  leftY += fieldRow('DOMICILIO:', frap.domicilio, col1X + 2, leftY, 22, 53);
  leftY += fieldRow('COLONIA/COMUNIDAD:', frap.colonia_paciente, col1X + 2, leftY, 40, 35);
  leftY += fieldRow('DELEGACIÓN POLÍTICA/MUNICIPIO:', frap.delegacion_paciente, col1X + 2, leftY, 58, 17);
  leftY += fieldRow('TELÉFONO:', frap.telefono, col1X + 2, leftY, 22, 33);
  leftY += fieldRow('OCUPACIÓN:', frap.ocupacion, col1X + 2, leftY, 25, 50);
  leftY += fieldRow('DERECHOHABIENTE A:', frap.derechohabiente, col1X + 2, leftY, 40, 35);
  label('IMSS', col1X + 80, leftY - 4);
  leftY += fieldRow('COMPAÑÍA DE SEGUROS GASTOS MÉDICOS:', frap.compania_seguros, col1X + 2, leftY, 68, 7);
  leftY += 2;
  
  // ORIGEN PROBABLE
  leftY = sectionTitle('ORIGEN PROBABLE', col1X, leftY, col1W);
  
  const origenes = [
    { value: 'neurologia', label: 'NEUROLOGÍA' },
    { value: 'cardiovascular', label: 'CARDIOVASCULAR' },
    { value: 'respiratorio', label: 'RESPIRATORIO' },
    { value: 'metabolico', label: 'METABÓLICO' },
    { value: 'digestivo', label: 'DIGESTIVA' },
    { value: 'intoxicacion', label: 'INTOXICACIÓN' },
    { value: 'urogenital', label: 'UROGENITAL' },
    { value: 'infecciosa', label: 'INFECCIOSA' },
    { value: 'gineco', label: 'GINECO-OBSTÉTRICA' },
    { value: 'oncologico', label: 'ONCOLÓGICO' },
    { value: 'cognitivo', label: 'COGNITIVO EMOCIONAL' },
    { value: 'otro', label: 'OTRO' }
  ];
  
  origenes.forEach(({ value, label }, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    checkbox(label, (frap.origen_probable || []).includes(value), col1X + 2 + (col * 31), leftY + (row * 4), 4);
  });
  leftY += 18;
  
  label('ESPECIFIQUE:', col1X + 2, leftY);
  line(col1X + 25, leftY + 0.5, 68);
  value(frap.origen_probable_especifique, col1X + 26, leftY);
  leftY += 5;
  
  label('1A VEZ:', col1X + 2, leftY);
  doc.rect(col1X + 15, leftY - 3, 4, 4, 'S');
  label('SUBSECUENTE:', col1X + 35, leftY);
  doc.rect(col1X + 60, leftY - 3, 4, 4, 'S');
  leftY += 6;
  
  // ACCIDENTE AUTOMOVILÍSTICO
  leftY = sectionTitle('ACCIDENTE AUTOMOVILÍSTICO', col1X, leftY, col1W);
  
  checkbox('COLISIÓN', frap.accidente_tipo === 'colision', col1X + 2, leftY, 4);
  checkbox('VOLCADURA', frap.accidente_tipo === 'volcadura', col1X + 30, leftY, 4);
  leftY += 5;
  
  checkbox('AUTOMOTOR', frap.automotor, col1X + 2, leftY, 4);
  checkbox('MOTOCICLETA', frap.motocicleta, col1X + 30, leftY, 4);
  checkbox('BICICLETA', frap.bicicleta, col1X + 60, leftY, 4);
  checkbox('MAQUINARIA', frap.maquinaria, col1X + 85, leftY, 4);
  leftY += 5;
  
  label('CONTRA OBJETO:', col1X + 2, leftY);
  checkbox('FIJO', frap.contra_objeto === 'fijo', col1X + 28, leftY, 4);
  checkbox('EN MOVIMIENTO', frap.contra_objeto === 'movimiento', col1X + 48, leftY, 4);
  label('IMPACTO:', col1X + 75, leftY);
  line(col1X + 88, leftY + 0.5, 10);
  leftY += 5;
  
  checkbox('FRONTAL', frap.impacto === 'frontal', col1X + 2, leftY, 4);
  checkbox('LATERAL', frap.impacto === 'lateral', col1X + 24, leftY, 4);
  checkbox('POSTERIOR', frap.impacto === 'posterior', col1X + 46, leftY, 4);
  leftY += 5;
  
  label('HUNDIMIENTO:', col1X + 2, leftY);
  line(col1X + 28, leftY + 0.5, 15);
  label('CMS', col1X + 44, leftY);
  
  label('PARABRISAS:', col1X + 52, leftY);
  checkbox('ROTO', frap.parabrisas === 'roto', col1X + 72, leftY, 4);
  checkbox('DOBLADO', frap.parabrisas === 'doblado', col1X + 88, leftY, 4);
  leftY += 5;
  
  label('VOLANTE:', col1X + 2, leftY);
  checkbox('INTRUSIÓN', frap.volante === 'intrusion', col1X + 20, leftY, 4);
  checkbox('DOBLADO', frap.volante_doblado, col1X + 42, leftY, 4);
  
  label('BOLSA DE AIRE:', col1X + 64, leftY);
  checkbox('SÍ', frap.bolsa_aire === 'si', col1X + 88, leftY, 4);
  leftY += 5;
  
  label('CINTURÓN DE SEGURIDAD:', col1X + 2, leftY);
  checkbox('COLOCADO', frap.cinturon === 'colocado', col1X + 45, leftY, 4);
  checkbox('NO COLOCADO', frap.cinturon === 'no_colocado', col1X + 70, leftY, 4);
  leftY += 5;
  
  label('DENTRO DEL VEHÍCULO:', col1X + 2, leftY);
  checkbox('SÍ', frap.dentro_vehiculo === 'si', col1X + 40, leftY, 4);
  checkbox('NO', frap.dentro_vehiculo === 'no', col1X + 52, leftY, 4);
  checkbox('EYECTADO', frap.dentro_vehiculo === 'eyectado', col1X + 65, leftY, 4);
  leftY += 5;
  
  label('ATROPELLADO:', col1X + 2, leftY);
  checkbox('AUTOMOTOR', frap.atropellado_tipo === 'automotor', col1X + 28, leftY, 4);
  checkbox('MOTOCICLETA', frap.atropellado_tipo === 'motocicleta', col1X + 52, leftY, 4);
  leftY += 5;
  
  label('CASCO DE SEGURIDAD:', col1X + 2, leftY);
  checkbox('SÍ', frap.casco_seguridad === 'si', col1X + 40, leftY, 4);
  checkbox('NO', frap.casco_seguridad === 'no', col1X + 52, leftY, 4);
  leftY += 6;
  
  // AGENTE CAUSAL
  leftY = sectionTitle('AGENTE CAUSAL', col1X, leftY, col1W);
  
  const agentes = [
    { value: 'arma', label: 'ARMA' },
    { value: 'juguete', label: 'JUGUETE' },
    { value: 'automotor', label: 'AUTOMOTOR' },
    { value: 'maquinaria', label: 'MAQUINARIA' },
    { value: 'electricidad', label: 'ELECTRICIDAD' },
    { value: 'herramienta', label: 'HERRAMIENTA' },
    { value: 'explosion', label: 'EXPLOSIÓN' },
    { value: 'fuego', label: 'FUEGO' },
    { value: 'ser_humano', label: 'SER HUMANO' },
    { value: 'producto_biologico', label: 'PRODUCTO BIOLÓGICO' },
    { value: 'sustancia_toxica', label: 'SUSTANCIA TÓXICA' },
    { value: 'animal', label: 'ANIMAL' },
    { value: 'otro', label: 'OTRO' }
  ];
  
  agentes.forEach(({ value, label }, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    checkbox(label, (frap.agente_causal || []).includes(value), col1X + 2 + (col * 31), leftY + (row * 4), 4);
  });
  leftY += 20;
  
  label('ESPECIFIQUE:', col1X + 2, leftY);
  line(col1X + 25, leftY + 0.5, 68);
  value(frap.agente_causal_otro, col1X + 26, leftY);
  leftY += 5;
  
  label('LESIONES CAUSADAS POR:', col1X + 2, leftY);
  line(col1X + 45, leftY + 0.5, 48);
  value(frap.lesiones_causadas_por, col1X + 46, leftY);
  leftY += 6;
  
  // ════════════════════════════════════════════════════════════════
  // COLUMNA DERECHA - PÁGINA 1
  // ════════════════════════════════════════════════════════════════
  
  rightY = my + 15 + 6 + 8; // Después de tiempos
  
  // NIVEL DE CONCIENCIA
  rightY = sectionTitle('NIVEL DE CONCIENCIA', col2X, rightY, col2W);
  
  checkbox('CONSCIENTE', frap.nivel_conciencia === 'consciente', col2X + 2, rightY, 4);
  rightY += 4;
  checkbox('RESPUESTA A ESTÍMULO VERBAL', frap.nivel_conciencia === 'verbal', col2X + 2, rightY, 4);
  rightY += 4;
  checkbox('RESPUESTA A ESTÍMULO DOLOROSO', frap.nivel_conciencia === 'doloroso', col2X + 2, rightY, 4);
  rightY += 4;
  checkbox('INCONSCIENTE', frap.nivel_conciencia === 'inconsciente', col2X + 2, rightY, 4);
  rightY += 6;
  
  // VÍA AÉREA / REFLEJO DE DEGLUCIÓN
  doc.setFillColor(...GREEN);
  doc.rect(col2X, rightY, col2W / 2, 6, 'F');
  doc.rect(col2X + col2W / 2 + 1, rightY, col2W / 2 - 1, 6, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('VÍA AÉREA', col2X + 2, rightY + 4);
  doc.text('REFLEJO DE DEGLUCIÓN', col2X + col2W / 2 + 3, rightY + 4);
  rightY += 7;
  
  doc.setTextColor(...BLACK);
  checkbox('PERMEABLE', frap.via_aerea === 'permeable', col2X + 2, rightY, 4);
  checkbox('AUSENTE', frap.reflejo_deglucion === 'ausente', col2X + col2W / 2 + 2, rightY, 4);
  rightY += 4;
  checkbox('COMPROMETIDA', frap.via_aerea === 'comprometida', col2X + 2, rightY, 4);
  checkbox('PRESENTE', frap.reflejo_deglucion === 'presente', col2X + col2W / 2 + 2, rightY, 4);
  rightY += 6;
  
  // VENTILACIÓN
  rightY = sectionTitle('VENTILACIÓN', col2X, rightY, col2W);
  checkbox('AUTOMATISMO REGULAR', frap.ventilacion === 'automatismo_regular', col2X + 2, rightY, 4);
  rightY += 4;
  checkbox('AUTOMATISMO IRREGULAR', frap.ventilacion === 'automatismo_irregular', col2X + 2, rightY, 4);
  rightY += 4;
  checkbox('VENTILACIÓN RÁPIDA', frap.ventilacion === 'rapida', col2X + 2, rightY, 4);
  rightY += 4;
  checkbox('VENTILACIÓN SUPERFICIAL', frap.ventilacion === 'superficial', col2X + 2, rightY, 4);
  rightY += 4;
  checkbox('APNEA', frap.ventilacion === 'apnea', col2X + 2, rightY, 4);
  rightY += 6;
  
  // AUSCULTACIÓN
  rightY = sectionTitle('AUSCULTACIÓN', col2X, rightY, col2W);
  checkbox('RUIDOS RESP. NORMALES', frap.auscultacion === 'normales', col2X + 2, rightY, 4);
  rightY += 4;
  checkbox('RUIDOS RESP. DISMINUIDOS', frap.auscultacion === 'disminuidos', col2X + 2, rightY, 4);
  rightY += 4;
  checkbox('RUIDOS RESP. AUSENTES', frap.auscultacion === 'ausentes', col2X + 2, rightY, 4);
  rightY += 6;
  
  label('NEUMOTÓRAX:', col2X + 2, rightY);
  checkbox('DERECHO', frap.neumotorax === 'derecho', col2X + 30, rightY, 4);
  rightY += 4;
  label('SITIO:', col2X + 2, rightY);
  checkbox('APICAL', frap.sitio_neumotorax === 'apical', col2X + 14, rightY, 4);
  checkbox('BASE', frap.sitio_neumotorax === 'base', col2X + 32, rightY, 4);
  rightY += 6;
  
  // CIRCULACIÓN: PRESENCIA DE PULSOS
  rightY = sectionTitle('CIRCULACIÓN: PRESENCIA DE PULSOS', col2X, rightY, col2W);
  checkbox('CAROTÍDEO', frap.pulso_presente === 'carotideo', col2X + 2, rightY, 4);
  rightY += 4;
  checkbox('RADIAL', frap.pulso_presente === 'radial', col2X + 2, rightY, 4);
  rightY += 4;
  checkbox('PARO CARDIORRESPIRATORIO', frap.pulso_presente === 'paro', col2X + 2, rightY, 4);
  rightY += 6;
  
  // CALIDAD / PIEL
  doc.setFillColor(...GREEN);
  doc.rect(col2X, rightY, col2W / 2, 6, 'F');
  doc.rect(col2X + col2W / 2 + 1, rightY, col2W / 2 - 1, 6, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('CALIDAD', col2X + 2, rightY + 4);
  doc.text('PIEL', col2X + col2W / 2 + 3, rightY + 4);
  rightY += 7;
  
  doc.setTextColor(...BLACK);
  checkbox('RÁPIDO', frap.calidad_pulso === 'rapido', col2X + 2, rightY, 4);
  checkbox('NORMAL', frap.piel === 'normal', col2X + col2W / 2 + 2, rightY, 4);
  rightY += 4;
  checkbox('LENTO', frap.calidad_pulso === 'lento', col2X + 2, rightY, 4);
  checkbox('PÁLIDA', frap.piel === 'palida', col2X + col2W / 2 + 2, rightY, 4);
  rightY += 4;
  checkbox('RÍTMICO', frap.calidad_pulso === 'ritmico', col2X + 2, rightY, 4);
  checkbox('CIANÓTICA', frap.piel === 'cianotica', col2X + col2W / 2 + 2, rightY, 4);
  rightY += 4;
  checkbox('ARRÍTMICO', frap.calidad_pulso === 'arritmico', col2X + 2, rightY, 4);
  checkbox('DIAFORESIS', frap.piel === 'diaforesis', col2X + col2W / 2 + 2, rightY, 4);
  rightY += 5;
  
  label('CARACTERÍSTICAS:', col2X + 2, rightY);
  line(col2X + 32, rightY + 0.5, col2W - 34);
  rightY += 6;
  
  // EXPLORACIÓN FÍSICA
  rightY = sectionTitle('EXPLORACIÓN FÍSICA', col2X, rightY, col2W);
  
  const exploracion = [
    { n: '1', value: 'deformidades', label: 'Deformidades' },
    { n: '2', value: 'contusiones', label: 'Contusiones' },
    { n: '3', value: 'abrasiones', label: 'Abrasiones' },
    { n: '4', value: 'penetraciones', label: 'Penetraciones' },
    { n: '5', value: 'mov_paradojico', label: 'Mov. Paradójico' },
    { n: '6', value: 'crepitacion', label: 'Crepitación' },
    { n: '7', value: 'heridas', label: 'Heridas' },
    { n: '8', value: 'fracturas', label: 'Fracturas' },
    { n: '9', value: 'enfisema', label: 'Enfisema Subcutáneo' },
    { n: '10', value: 'quemaduras', label: 'Quemaduras' },
    { n: '11', value: 'laceraciones', label: 'Laceraciones' },
    { n: '12', value: 'edema', label: 'Edema' },
    { n: '13', value: 'alt_sensibilidad', label: 'Alteración de Sensibilidad' },
    { n: '14', value: 'alt_movilidad', label: 'Alteración de Movilidad' },
    { n: '15', value: 'dolor', label: 'Dolor' }
  ];
  
  const expFisicaArray = frap.exploracion_fisica || [];
  exploracion.forEach(({ n, value, label }, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = col2X + 2 + (col * 40);
    const y = rightY + (row * 4);
    
    checkbox(`${n}. ${label}`, expFisicaArray.includes(value), x, y, 3);
  });
  rightY += 32;
  
  // ZONAS DE LESIÓN (diagrama del cuerpo) + PUPILAS (al lado)
  const diagramX = col2X + 2;
  const diagramY = rightY;
  const diagramW = 30;
  const diagramH = 50;
  
  // Dibujar diagrama del cuerpo con zonas de lesión
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.5);
  doc.rect(diagramX, diagramY, diagramW, diagramH, 'S');
  
  label('ZONAS DE LESIÓN', diagramX + diagramW / 2, diagramY - 2, { align: 'center' });
  
  // Dibujar cuerpo humano simplificado
  const cx = diagramX + diagramW / 2;
  const scale = diagramW / 70;
  const startY = diagramY + 5;
  
  // Función para marcar zonas con punto rojo
  const markZone = (zoneX, zoneY, radius) => {
    doc.setFillColor(255, 0, 0);
    doc.circle(zoneX, zoneY, radius, 'F');
    doc.setFillColor(139, 0, 0);
    doc.circle(zoneX, zoneY, radius * 0.4, 'F');
  };
  
  const zonasLesion = frap.zonas_lesion || {};
  
  doc.setLineWidth(0.3);
  
  // Cabeza
  doc.circle(cx, startY + 4 * scale, 3 * scale, 'S');
  if (zonasLesion.cabeza) markZone(cx, startY + 4 * scale, 1.5 * scale);
  
  // Cuello
  doc.line(cx - 1.5 * scale, startY + 7 * scale, cx - 1.5 * scale, startY + 9 * scale);
  doc.line(cx + 1.5 * scale, startY + 7 * scale, cx + 1.5 * scale, startY + 9 * scale);
  if (zonasLesion.cuello) markZone(cx, startY + 8 * scale, 1 * scale);
  
  // Torso
  doc.line(cx - 5 * scale, startY + 9 * scale, cx - 4 * scale, startY + 22 * scale);
  doc.line(cx + 5 * scale, startY + 9 * scale, cx + 4 * scale, startY + 22 * scale);
  doc.line(cx - 4 * scale, startY + 22 * scale, cx - 3 * scale, startY + 25 * scale);
  doc.line(cx + 4 * scale, startY + 22 * scale, cx + 3 * scale, startY + 25 * scale);
  if (zonasLesion.torax) markZone(cx, startY + 15 * scale, 2 * scale);
  if (zonasLesion.abdomen) markZone(cx, startY + 23 * scale, 1.5 * scale);
  
  // Brazos
  doc.line(cx - 5 * scale, startY + 9 * scale, cx - 8 * scale, startY + 18 * scale);
  doc.line(cx + 5 * scale, startY + 9 * scale, cx + 8 * scale, startY + 18 * scale);
  if (zonasLesion.brazo_der) markZone(cx - 6.5 * scale, startY + 13 * scale, 1 * scale);
  if (zonasLesion.brazo_izq) markZone(cx + 6.5 * scale, startY + 13 * scale, 1 * scale);
  
  // Antebrazos y manos
  doc.line(cx - 8 * scale, startY + 18 * scale, cx - 9 * scale, startY + 26 * scale);
  doc.line(cx + 8 * scale, startY + 18 * scale, cx + 9 * scale, startY + 26 * scale);
  doc.ellipse(cx - 9.5 * scale, startY + 28 * scale, 1.5 * scale, 2 * scale, 'S');
  doc.ellipse(cx + 9.5 * scale, startY + 28 * scale, 1.5 * scale, 2 * scale, 'S');
  if (zonasLesion.antebrazo_der) markZone(cx - 8.5 * scale, startY + 22 * scale, 1 * scale);
  if (zonasLesion.antebrazo_izq) markZone(cx + 8.5 * scale, startY + 22 * scale, 1 * scale);
  if (zonasLesion.mano_der) markZone(cx - 9.5 * scale, startY + 28 * scale, 1 * scale);
  if (zonasLesion.mano_izq) markZone(cx + 9.5 * scale, startY + 28 * scale, 1 * scale);
  
  // Piernas
  doc.line(cx - 3 * scale, startY + 25 * scale, cx - 3.5 * scale, startY + 40 * scale);
  doc.line(cx + 3 * scale, startY + 25 * scale, cx + 3.5 * scale, startY + 40 * scale);
  doc.line(cx - 3.5 * scale, startY + 40 * scale, cx - 3 * scale, startY + 48 * scale);
  doc.line(cx + 3.5 * scale, startY + 40 * scale, cx + 3 * scale, startY + 48 * scale);
  doc.ellipse(cx - 3 * scale, startY + 50 * scale, 2 * scale, 1.5 * scale, 'S');
  doc.ellipse(cx + 3 * scale, startY + 50 * scale, 2 * scale, 1.5 * scale, 'S');
  
  if (zonasLesion.muslo_der) markZone(cx - 3.2 * scale, startY + 32 * scale, 1 * scale);
  if (zonasLesion.muslo_izq) markZone(cx + 3.2 * scale, startY + 32 * scale, 1 * scale);
  if (zonasLesion.rodilla_der) markZone(cx - 3.5 * scale, startY + 40 * scale, 1 * scale);
  if (zonasLesion.rodilla_izq) markZone(cx + 3.5 * scale, startY + 40 * scale, 1 * scale);
  if (zonasLesion.pierna_der) markZone(cx - 3.2 * scale, startY + 44 * scale, 1 * scale);
  if (zonasLesion.pierna_izq) markZone(cx + 3.2 * scale, startY + 44 * scale, 1 * scale);
  if (zonasLesion.pie_der) markZone(cx - 3 * scale, startY + 50 * scale, 1 * scale);
  if (zonasLesion.pie_izq) markZone(cx + 3 * scale, startY + 50 * scale, 1 * scale);
  
  doc.setFontSize(5);
  doc.setTextColor(...BLACK);
  doc.text('ANTERIOR', cx, diagramY + diagramH - 2, { align: 'center' });
  
  // PUPILAS (al lado del diagrama)
  const pupX = diagramX + diagramW + 8;
  const pupY = diagramY + 10;
  
  label('PUPILAS', pupX, pupY);
  
  // Dibujar pupilas derecha
  doc.circle(pupX + 8, pupY + 6, 4, 'S');
  const pupilaDer = frap.pupilas_derecha || 'normal';
  if (pupilaDer === 'normal') {
    doc.setFillColor(...BLACK);
    doc.circle(pupX + 8, pupY + 6, 2, 'F');
  } else if (pupilaDer === 'dilatada') {
    doc.setFillColor(...BLACK);
    doc.circle(pupX + 8, pupY + 6, 3.5, 'F');
  } else if (pupilaDer === 'contraida') {
    doc.setFillColor(...BLACK);
    doc.circle(pupX + 8, pupY + 6, 1, 'F');
  }
  
  // Dibujar pupilas izquierda
  doc.circle(pupX + 20, pupY + 6, 4, 'S');
  const pupilaIzq = frap.pupilas_izquierda || 'normal';
  if (pupilaIzq === 'normal') {
    doc.setFillColor(...BLACK);
    doc.circle(pupX + 20, pupY + 6, 2, 'F');
  } else if (pupilaIzq === 'dilatada') {
    doc.setFillColor(...BLACK);
    doc.circle(pupX + 20, pupY + 6, 3.5, 'F');
  } else if (pupilaIzq === 'contraida') {
    doc.setFillColor(...BLACK);
    doc.circle(pupX + 20, pupY + 6, 1, 'F');
  }
  
  doc.setFontSize(5);
  doc.setTextColor(...BLACK);
  doc.text('DERECHA', pupX + 8, pupY + 12, { align: 'center' });
  doc.text('IZQUIERDA', pupX + 20, pupY + 12, { align: 'center' });
  
  rightY += diagramH + 4;
  
  // SIGNOS VITALES
  rightY = sectionTitle('SIGNOS VITALES', col2X, rightY, col2W);
  
  const vHeaders = ['HORA', 'FR', 'FC', 'TAS', 'TAD', 'SaO2', 'TEMP', 'GLUC'];
  const vW = col2W / 8;
  
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  vHeaders.forEach((h, i) => {
    doc.rect(col2X + (vW * i), rightY, vW, 5, 'S');
    doc.text(h, col2X + (vW * i) + vW / 2, rightY + 3.5, { align: 'center' });
  });
  
  rightY += 5;
  
  // Dibujar filas de vitales
  const vitales = frap.vitales || [];
  for (let r = 0; r < 3; r++) {
    const vital = vitales[r] || {};
    const vals = [vital.hora, vital.fr, vital.fc, vital.tas, vital.tad, vital.sao2, vital.temp, vital.glucosa];
    
    doc.setFont('helvetica', 'normal');
    vals.forEach((v, i) => {
      doc.rect(col2X + (vW * i), rightY, vW, 5, 'S');
      doc.text(String(v || ''), col2X + (vW * i) + vW / 2, rightY + 3.5, { align: 'center' });
    });
    rightY += 5;
  }
  rightY += 2;
  
  // CONDICIÓN DEL PACIENTE / PRIORIDAD
  doc.setFillColor(...GREEN);
  doc.rect(col2X, rightY, col2W / 2, 6, 'F');
  doc.rect(col2X + col2W / 2 + 1, rightY, col2W / 2 - 1, 6, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('CONDICIÓN DEL PACIENTE', col2X + 2, rightY + 4);
  doc.text('PRIORIDAD', col2X + col2W / 2 + 3, rightY + 4);
  rightY += 7;
  
  doc.setTextColor(...BLACK);
  checkbox('CRÍTICO INESTABLE', frap.condicion_paciente === 'critico_inestable', col2X + 2, rightY, 4);
  
  // Botones de prioridad con colores
  const prioColors = {
    rojo: [220, 53, 69],
    amarillo: [255, 193, 7],
    verde: [40, 167, 69],
    negro: [33, 33, 33]
  };
  
  let prioX = col2X + col2W / 2 + 2;
  Object.entries(prioColors).forEach(([key, color], i) => {
    const px = prioX + (i % 2) * 18;
    const py = rightY + Math.floor(i / 2) * 5 - 3;
    
    doc.setFillColor(...color);
    if (frap.prioridad === key) {
      doc.rect(px, py, 16, 4, 'F');
      doc.setTextColor(...(key === 'amarillo' ? BLACK : WHITE));
    } else {
      doc.setDrawColor(...color);
      doc.setLineWidth(0.5);
      doc.rect(px, py, 16, 4, 'S');
      doc.setTextColor(...color);
    }
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text(key.toUpperCase(), px + 8, py + 2.8, { align: 'center' });
  });
  doc.setTextColor(...BLACK);
  
  rightY += 4;
  checkbox('NO CRÍTICO', frap.condicion_paciente === 'no_critico', col2X + 2, rightY, 4);
  rightY += 4;
  checkbox('CRÍTICO ESTABLE', frap.condicion_paciente === 'critico_estable', col2X + 2, rightY, 4);
  rightY += 8;
  
  // VÍA AÉREA, CONTROL CERVICAL, ASIST. VENTILATORIA, OXIGENOTERAPIA
  const manejoHeaders = ['VÍA AÉREA', 'CONTROL CERVICAL', 'ASIST. VENTILATORIA', 'OXIGENOTERAPIA'];
  const mW = col2W / 4;
  
  manejoHeaders.forEach((h, i) => {
    doc.setFillColor(...GREEN);
    doc.rect(col2X + (mW * i), rightY, mW - 0.5, 5, 'F');
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(h, col2X + (mW * i) + 1, rightY + 3.5);
  });
  rightY += 6;
  
  doc.setFontSize(5);
  doc.setTextColor(...BLACK);
  
  const viaAereaManejo = frap.via_aerea_manejo || [];
  
  checkbox('ASPIRACIÓN', viaAereaManejo.includes('aspiracion'), col2X + 1, rightY, 2);
  checkbox('MANUAL', frap.control_cervical === 'manual', col2X + mW + 1, rightY, 2);
  checkbox('BALÓN-VÁLVULA', frap.asistencia_ventilatoria === 'balon_valvula', col2X + mW * 2 + 1, rightY, 2);
  checkbox('PUNTAS NASALES', frap.oxigenoterapia === 'puntas_nasales', col2X + mW * 3 + 1, rightY, 2);
  rightY += 4;
  
  checkbox('CÁNULA ORO', viaAereaManejo.includes('canula_oro'), col2X + 1, rightY, 2);
  checkbox('COLLARÍN RÍGIDO', frap.control_cervical === 'rigido', col2X + mW + 1, rightY, 2);
  checkbox('VENT. AUTOMÁTICO', frap.asistencia_ventilatoria === 'ventilador', col2X + mW * 2 + 1, rightY, 2);
  checkbox('MASCARILLA SIMPLE', frap.oxigenoterapia === 'mascarilla_simple', col2X + mW * 3 + 1, rightY, 2);
  rightY += 4;
  
  checkbox('CÁNULA NASO', viaAereaManejo.includes('canula_naso'), col2X + 1, rightY, 2);
  checkbox('COLLARÍN BLANCO', frap.control_cervical === 'blanco', col2X + mW + 1, rightY, 2);
  
  label('FREC.', col2X + mW * 2 + 1, rightY);
  label('VOL.', col2X + mW * 2 + 11, rightY);
  checkbox('MASCARILLA C/RESERV', frap.oxigenoterapia === 'mascarilla_reservorio', col2X + mW * 3 + 1, rightY, 2);
  rightY += 4;
  
  label('LTS X MIN:', col2X + mW * 3 + 1, rightY);
  line(col2X + mW * 3 + 14, rightY + 0.5, 8);
  value(frap.lts_x_min, col2X + mW * 3 + 15, rightY);
  rightY += 6;
  
  // CONTROL DE HEMORRAGIAS, VÍAS VENOSAS, SITIO, TIPO SOLUCIONES
  const hemHeaders = ['CONTROL DE HEMORRAGIAS', 'VÍAS VENOSAS', 'SITIO DE APLICACIÓN', 'TIPO DE SOLUCIONES'];
  const hW = col2W / 4;
  
  hemHeaders.forEach((h, i) => {
    doc.setFillColor(...GREEN);
    doc.rect(col2X + (hW * i), rightY, hW - 0.5, 5, 'F');
    doc.setFontSize(4.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text(h, col2X + (hW * i) + 1, rightY + 3.5);
  });
  rightY += 6;
  
  doc.setFontSize(5);
  doc.setTextColor(...BLACK);
  
  const controlHemorragias = frap.control_hemorragias || [];
  const soluciones = frap.tipo_soluciones || [];
  
  checkbox('PRESIÓN DIRECTA', controlHemorragias.includes('presion_directa'), col2X + 1, rightY, 2);
  label('VÍA IV #', col2X + hW + 1, rightY);
  line(col2X + hW + 12, rightY + 0.5, 6);
  label('MANO', col2X + hW * 2 + 1, rightY);
  checkbox('HARTMANN', soluciones.includes('hartmann'), col2X + hW * 3 + 1, rightY, 2);
  rightY += 4;
  
  checkbox('TORNIQUETE', controlHemorragias.includes('torniquete'), col2X + 1, rightY, 2);
  label('CATETER #', col2X + hW + 1, rightY);
  line(col2X + hW + 13, rightY + 0.5, 5);
  label('PLIEGUE ANTEC', col2X + hW * 2 + 1, rightY);
  checkbox('NaCl 0.9%', soluciones.includes('nacl'), col2X + hW * 3 + 1, rightY, 2);
  rightY += 4;
  
  checkbox('VENDAJE COMPRES', controlHemorragias.includes('vendaje'), col2X + 1, rightY, 2);
  checkbox('MIXTA', soluciones.includes('mixta'), col2X + hW * 3 + 1, rightY, 2);
  rightY += 4;
  
  checkbox('GLUCOSA 5%', soluciones.includes('glucosa'), col2X + hW * 3 + 1, rightY, 2);
  rightY += 4;
  
  checkbox('OTRA', soluciones.includes('otra'), col2X + hW * 3 + 1, rightY, 2);
  
  // ════════════════════════════════════════════════════════════════
  // PÁGINA 2
  // ════════════════════════════════════════════════════════════════
  
  doc.addPage();
  
  leftY = my;
  rightY = my;
  
  // Repetir header pequeño
  doc.setFillColor(...GREEN);
  doc.rect(mx, my, cw, 8, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('CUERPO DE RESCATE DE ENSENADA, A.C.', mx + 2, my + 5.5);
  
  leftY = my + 10;
  rightY = my + 10;
  
  // ════════════════════════════════════════════════════════════════
  // COLUMNA IZQUIERDA - PÁGINA 2
  // ════════════════════════════════════════════════════════════════
  
  // DATOS DE LA MADRE (si aplica)
  leftY = sectionTitle('DATOS DE LA MADRE', col1X, leftY, col1W);
  
  label('GESTA:', col1X + 2, leftY);
  doc.rect(col1X + 18, leftY - 3, 10, 5, 'S');
  value(frap.madre_gesta, col1X + 20, leftY);
  
  label('CESÁREAS:', col1X + 32, leftY);
  doc.rect(col1X + 50, leftY - 3, 10, 5, 'S');
  value(frap.madre_cesareas, col1X + 52, leftY);
  
  label('PARA:', col1X + 64, leftY);
  doc.rect(col1X + 76, leftY - 3, 10, 5, 'S');
  value(frap.madre_para, col1X + 78, leftY);
  
  label('ABORTOS:', col1X + 2, leftY + 5);
  doc.rect(col1X + 20, leftY + 2, 10, 5, 'S');
  value(frap.madre_abortos, col1X + 22, leftY + 5);
  leftY += 8;
  
  label('FUM:', col1X + 2, leftY);
  line(col1X + 12, leftY + 0.5, 20);
  value(frap.madre_fum, col1X + 13, leftY);
  
  label('SEMANAS DE GESTACIÓN:', col1X + 35, leftY);
  doc.rect(col1X + 70, leftY - 3, 10, 5, 'S');
  value(frap.madre_semanas, col1X + 72, leftY);
  leftY += 6;
  
  label('FECHA PROBABLE DE PARTO:', col1X + 2, leftY);
  line(col1X + 48, leftY + 0.5, 25);
  value(frap.madre_fecha_parto, col1X + 49, leftY);
  leftY += 5;
  
  label('HORA INICIO CONTRACCIONES:', col1X + 2, leftY);
  line(col1X + 52, leftY + 0.5, 20);
  value(frap.madre_contracciones_hora, col1X + 53, leftY);
  
  label('FRECUENCIA:', col1X + 2, leftY + 5);
  line(col1X + 25, leftY + 5.5, 20);
  value(frap.madre_contracciones_frecuencia, col1X + 26, leftY + 5);
  leftY += 8;
  
  label('DURACIÓN:', col1X + 2, leftY);
  line(col1X + 20, leftY + 0.5, 25);
  value(frap.madre_contracciones_duracion, col1X + 21, leftY);
  leftY += 6;
  
  // DATOS POST-PARTO
  leftY = sectionTitle('DATOS POST-PARTO', col1X, leftY, col1W);
  
  label('HORA DE NACIMIENTO:', col1X + 2, leftY);
  line(col1X + 38, leftY + 0.5, 20);
  value(frap.postparto_nacimiento_hora, col1X + 39, leftY);
  
  label('LUGAR:', col1X + 62, leftY);
  line(col1X + 75, leftY + 0.5, 18);
  value(frap.postparto_nacimiento_lugar, col1X + 76, leftY);
  leftY += 5;
  
  label('PLACENTA EXPULSADA:', col1X + 2, leftY);
  checkbox('SÍ', frap.postparto_placenta === 'si', col1X + 40, leftY, 4);
  checkbox('NO', frap.postparto_placenta === 'no', col1X + 52, leftY, 4);
  leftY += 8;
  
  // ════════════════════════════════════════════════════════════════
  // COLUMNA DERECHA - PÁGINA 2
  // ════════════════════════════════════════════════════════════════
  
  // INTERROGATORIO
  rightY = sectionTitle('INTERROGATORIO', col2X, rightY, col2W);
  rightY += fieldRow('ALERGIAS:', frap.alergias, col2X + 2, rightY, 18, col2W - 22);
  rightY += fieldRow('MEDICAMENTOS QUE ESTÁ INGIRIENDO:', frap.medicamentos, col2X + 2, rightY, 58, col2W - 62);
  rightY += fieldRow('ENFERMEDADES Y CIRUGÍAS PREVIAS:', frap.enfermedades_previas, col2X + 2, rightY, 55, col2W - 59);
  rightY += fieldRow('HORA DE LA ÚLTIMA COMIDA:', frap.ultima_comida, col2X + 2, rightY, 48, col2W - 52);
  rightY += fieldRow('EVENTOS PREVIOS RELACIONADOS:', frap.eventos_previos, col2X + 2, rightY, 52, col2W - 56);
  rightY += 2;
  
  // OBSERVACIONES
  rightY = sectionTitle('OBSERVACIONES', col2X, rightY, col2W);
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.3);
  doc.rect(col2X, rightY, col2W, 15, 'S');
  
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BLACK);
  const obsLines = doc.splitTextToSize(frap.observaciones || '', col2W - 4);
  doc.text(obsLines, col2X + 2, rightY + 4);
  rightY += 17;
  
  // AUTORIDADES QUE INTERVINIERON
  rightY = sectionTitle('AUTORIDADES QUE INTERVINIERON', col2X, rightY, col2W);
  label('ENTREGA PACIENTE:', col2X + 2, rightY);
  line(col2X + 30, rightY + 0.5, col2W - 35);
  doc.setFontSize(5);
  doc.text('NOMBRE Y FIRMA', col2X + col2W - 22, rightY + 3);
  if (frap.firmas && frap.firmas.entrega_paciente) {
    try { doc.addImage(frap.firmas.entrega_paciente, 'PNG', col2X + 35, rightY - 8, 30, 8); } catch(e){}
  }
  rightY += 6;
  
  label('MÉDICO QUE RECIBE:', col2X + 2, rightY);
  line(col2X + 32, rightY + 0.5, col2W - 37);
  doc.setFontSize(5);
  doc.text('NOMBRE Y FIRMA', col2X + col2W - 22, rightY + 3);
  if (frap.firmas && frap.firmas.medico_recibe) {
    try { doc.addImage(frap.firmas.medico_recibe, 'PNG', col2X + 37, rightY - 8, 30, 8); } catch(e){}
  }
  rightY += 8;
  
  // ESCALA DE GLASGOW
  rightY = sectionTitle('ESCALA DE GLASGOW', col2X, rightY, col2W);
  doc.setFontSize(5);
  label('APERTURA OCULAR', col2X + 2, rightY);
  rightY += 3;
  checkbox('4. ESPONTÁNEA', frap.glasgow_apertura === '4', col2X + 2, rightY, 3);
  rightY += 3;
  checkbox('3. A LA VOZ', frap.glasgow_apertura === '3', col2X + 2, rightY, 3);
  rightY += 3;
  checkbox('2. AL DOLOR', frap.glasgow_apertura === '2', col2X + 2, rightY, 3);
  rightY += 3;
  checkbox('1. NINGUNA', frap.glasgow_apertura === '1', col2X + 2, rightY, 3);
  rightY += 5;
  
  label('MEJOR RESPUESTA VERBAL', col2X + 2, rightY);
  rightY += 3;
  checkbox('5. ORIENTADO', frap.glasgow_verbal === '5', col2X + 2, rightY, 3);
  rightY += 3;
  checkbox('4. CONFUSO', frap.glasgow_verbal === '4', col2X + 2, rightY, 3);
  rightY += 3;
  checkbox('3. PALABRAS INAPROPIADAS', frap.glasgow_verbal === '3', col2X + 2, rightY, 3);
  rightY += 3;
  checkbox('2. SONIDOS INCOMPRENSIBLES', frap.glasgow_verbal === '2', col2X + 2, rightY, 3);
  rightY += 3;
  checkbox('1. NINGUNA', frap.glasgow_verbal === '1', col2X + 2, rightY, 3);
  rightY += 5;
  
  label('MEJOR RESPUESTA MOTORA', col2X + 2, rightY);
  rightY += 3;
  checkbox('6. OBEDECE ÓRDENES', frap.glasgow_motora === '6', col2X + 2, rightY, 3);
  rightY += 3;
  checkbox('5. LOCALIZA DOLOR', frap.glasgow_motora === '5', col2X + 2, rightY, 3);
  rightY += 3;
  checkbox('4. RETIRA AL DOLOR', frap.glasgow_motora === '4', col2X + 2, rightY, 3);
  rightY += 3;
  checkbox('3. FLEXIÓN ANORMAL', frap.glasgow_motora === '3', col2X + 2, rightY, 3);
  rightY += 3;
  checkbox('2. EXTENSIÓN ANORMAL', frap.glasgow_motora === '2', col2X + 2, rightY, 3);
  rightY += 3;
  checkbox('1. NINGUNA', frap.glasgow_motora === '1', col2X + 2, rightY, 3);
  rightY += 5;
  
  label('ESCALA DE GLASGOW:', col2X + 2, rightY);
  doc.rect(col2X + 32, rightY - 3, 10, 5, 'S');
  value(frap.glasgow_total, col2X + 34, rightY);
  rightY += 8;
  
  // ESCALA PREHOSPITALARIA DE CINCINNATI
  rightY = sectionTitle('ESCALA PREHOSPITALARIA DE CINCINNATI', col2X, rightY, col2W);
  doc.setFontSize(6);
  label('ASIMETRÍA FACIAL', col2X + 2, rightY);
  checkbox('SÍ', frap.asimetria_facial === 'si', col2X + 40, rightY, 3);
  checkbox('NO', frap.asimetria_facial === 'no', col2X + 52, rightY, 3);
  rightY += 4;
  
  label('PARESIA DE LOS BRAZOS', col2X + 2, rightY);
  checkbox('SÍ', frap.paresia_brazos === 'si', col2X + 40, rightY, 3);
  checkbox('NO', frap.paresia_brazos === 'no', col2X + 52, rightY, 3);
  rightY += 4;
  
  label('ALTERACIÓN DEL LENGUAJE', col2X + 2, rightY);
  checkbox('SÍ', frap.alteracion_lenguaje === 'si', col2X + 40, rightY, 3);
  checkbox('NO', frap.alteracion_lenguaje === 'no', col2X + 52, rightY, 3);
  rightY += 6;
  
  // ESCALA DE TRAUMA
  rightY = sectionTitle('ESCALA DE TRAUMA', col2X, rightY, col2W);
  doc.setFontSize(6);
  
  doc.autoTable({
    startY: rightY,
    margin: { left: col2X },
    tableWidth: col2W,
    head: [['(A)GCS', '(B)PAS', '(C)FR', '(D) Esfuerzo Respiratorio/Llenado Capilar', 'Puntuación']],
    body: [
      ['14-15', '90 +', '10-24', 'normal', '5'],
      ['11-13', '90 +', '10-24', 'normal', '4'],
      ['8-10', '70-89', '25-35', 'retrasado', '3'],
      ['5-7', '50-69', '>35', 'detenido', '2'],
      ['3-4', '0-49', '0-49', 'ausente', '0']
    ],
    theme: 'grid',
    headStyles: { fillColor: GREEN, fontSize: 5 },
    styles: { fontSize: 5, cellPadding: 1 },
    columnStyles: {
      0: { cellWidth: col2W * 0.15 },
      1: { cellWidth: col2W * 0.15 },
      2: { cellWidth: col2W * 0.15 },
      3: { cellWidth: col2W * 0.4 },
      4: { cellWidth: col2W * 0.15 }
    }
  });
  
  rightY = doc.lastAutoTable.finalY + 3;
  
  label('Puntuación Total:', col2X + col2W - 28, rightY);
  label('A+B+C+D+E', col2X + col2W - 12, rightY);
  rightY += 6;
  
  // DATOS RECIÉN NACIDO
  doc.setFillColor(...GREEN);
  doc.rect(col2X, rightY, col2W / 2, 6, 'F');
  doc.rect(col2X + col2W / 2 + 2, rightY, col2W / 2 - 2, 6, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('DATOS RECIÉN NACIDO', col2X + 2, rightY + 4);
  doc.text('DESTINO', col2X + col2W / 2 + 4, rightY + 4);
  rightY += 8;
  
  doc.setTextColor(...BLACK);
  doc.setFontSize(7);
  label('PRODUCTO:', col2X + 2, rightY);
  checkbox('VIVO', frap.recien_nacido_producto === 'vivo', col2X + 22, rightY, 4);
  checkbox('MUERTO', frap.recien_nacido_producto === 'muerto', col2X + 36, rightY, 4);
  checkbox('TRASLADADO', frap.recien_nacido_destino === 'trasladado', col2X + col2W / 2 + 4, rightY, 4);
  rightY += 4;
  
  label('SEXO:', col2X + 2, rightY);
  checkbox('MASC', frap.recien_nacido_sexo === 'masculino', col2X + 14, rightY, 4);
  checkbox('FEM', frap.recien_nacido_sexo === 'femenino', col2X + 30, rightY, 4);
  checkbox('NO TRASLADADO', frap.recien_nacido_destino === 'no_trasladado', col2X + col2W / 2 + 4, rightY, 4);
  rightY += 4;
  
  label('APGAR:', col2X + 2, rightY);
  checkbox('FUGA', frap.recien_nacido_destino === 'fuga', col2X + col2W / 2 + 4, rightY, 4);
  rightY += 4;
  
  doc.setDrawColor(...GREEN);
  doc.rect(col2X + 14, rightY - 3, 10, 5, 'S');
  doc.rect(col2X + 26, rightY - 3, 10, 5, 'S');
  doc.rect(col2X + 38, rightY - 3, 10, 5, 'S');
  value(frap.recien_nacido_apgar_1 || '', col2X + 16, rightY);
  value(frap.recien_nacido_apgar_5 || '', col2X + 28, rightY);
  value(frap.recien_nacido_apgar_10 || '', col2X + 40, rightY);
  doc.setFontSize(5);
  doc.text('1 MIN', col2X + 16, rightY + 4);
  doc.text('5 MIN', col2X + 28, rightY + 4);
  doc.text('10 MIN', col2X + 39, rightY + 4);
  rightY += 8;
  
  label('PRODUCTO:', col2X + 2, rightY);
  doc.rect(col2X + 18, rightY - 3, 10, 5, 'S');
  doc.rect(col2X + 30, rightY - 3, 10, 5, 'S');
  doc.rect(col2X + 42, rightY - 3, 10, 5, 'S');
  rightY += 8;
  
  // ════════════════════════════════════════════════════════════════
  // FOOTER - NEGATIVA/CONSENTIMIENTO/FIRMAS
  // ════════════════════════════════════════════════════════════════
  
  let footerY = Math.max(leftY, rightY) + 5;
  
  // Asegurar que no se salga de la página
  if (footerY > ph - 55) {
    footerY = ph - 55;
  }
  
  // NEGATIVA A RECIBIR ATENCIÓN (izquierda)
  doc.setFillColor(...GREEN);
  doc.rect(mx, footerY, (cw / 2) - 2, 6, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('NEGATIVA A RECIBIR ATENCIÓN/', mx + 2, footerY + 3);
  doc.text('SER TRASLADADO EXIMENTE DE RESPONSABILIDAD', mx + 2, footerY + 6);
  
  // CONSENTIMIENTO INFORMADO (derecha)
  doc.setFillColor(...GREEN);
  doc.rect(mx + (cw / 2) + 2, footerY, (cw / 2) - 2, 6, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...WHITE);
  doc.text('CONSENTIMIENTO INFORMADO', mx + (cw / 2) + 4, footerY + 4);
  
  footerY += 8;
  
  // Cajas de firmas
  const firmaH = 15;
  
  // IZQUIERDA - NEGATIVA
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.3);
  doc.rect(mx, footerY, (cw / 2) - 2, firmaH, 'S');
  
  doc.setFontSize(6);
  doc.setTextColor(...BLACK);
  doc.setFont('helvetica', 'bold');
  doc.text('NOMBRE/FIRMA DEL PACIENTE', mx + 2, footerY + 4);
  line(mx + 2, footerY + 11, (cw / 2) - 6);
  if (frap.firmas && frap.firmas.paciente_negativa) {
    try { doc.addImage(frap.firmas.paciente_negativa, 'PNG', mx + 5, footerY + 5, 30, 8); } catch(e){}
  }
  
  // DERECHA - CONSENTIMIENTO
  doc.rect(mx + (cw / 2) + 2, footerY, (cw / 2) - 2, firmaH, 'S');
  doc.text('NOMBRE/FIRMA DEL PACIENTE', mx + (cw / 2) + 4, footerY + 4);
  line(mx + (cw / 2) + 4, footerY + 11, (cw / 2) - 6);
  if (frap.firmas && frap.firmas.paciente_consentimiento) {
    try { doc.addImage(frap.firmas.paciente_consentimiento, 'PNG', mx + (cw / 2) + 7, footerY + 5, 30, 8); } catch(e){}
  }
  
  footerY += firmaH + 1;
  
  // Segunda fila
  doc.rect(mx, footerY, (cw / 2) - 2, firmaH, 'S');
  doc.text('NOMBRE/FIRMA DEL TESTIGO', mx + 2, footerY + 4);
  line(mx + 2, footerY + 11, (cw / 2) - 6);
  if (frap.firmas && frap.firmas.testigo_negativa) {
    try { doc.addImage(frap.firmas.testigo_negativa, 'PNG', mx + 5, footerY + 5, 30, 8); } catch(e){}
  }
  
  doc.rect(mx + (cw / 2) + 2, footerY, (cw / 2) - 2, firmaH, 'S');
  doc.text('NOMBRE/FIRMA DE FAMILIAR O TUTOR', mx + (cw / 2) + 4, footerY + 4);
  line(mx + (cw / 2) + 4, footerY + 11, (cw / 2) - 6);
  if (frap.firmas && frap.firmas.familiar_consentimiento) {
    try { doc.addImage(frap.firmas.familiar_consentimiento, 'PNG', mx + (cw / 2) + 7, footerY + 5, 30, 8); } catch(e){}
  }
  
  footerY += firmaH + 2;
  
  // Pie de página
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...BLACK);
  const footerText = `Creado por: Administrador • Fecha: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}`;
  doc.text(footerText, mx, ph - 8);
  doc.text('Página 1 de 2', pw - mx - 15, ph - 8);
  
  doc.setPage(2);
  doc.text('Página 2 de 2', pw - mx - 15, ph - 8);
  
  // Retornar el PDF como blob
  return doc.output('blob');
};
