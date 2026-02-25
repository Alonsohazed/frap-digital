/**
 * SCRIPT DE PRUEBA PDF - REPLICACIÓN EXACTA DEL FRAP.pdf
 * 
 * Este script genera el PDF completo y lo convierte a imágenes para verificación visual
 */

import pkg from 'jspdf';
const { jsPDF } = pkg;
import 'jspdf-autotable';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Datos de prueba completos
const testData = {
  fecha: '2026-02-20',
  folio: '1003',
  hora_llamada: '16:20',
  hora_salida: '16:22',
  hora_llegada: '16:27',
  hora_traslado: '',
  hora_hospital: '16:50',
  hora_base: '17:09',
  motivo_atencion: 'enfermedad',
  calle: 'Magnolia',
  colonia: 'Marquez de leon',
  delegacion_municipio: 'Ensenada',
  lugar_ocurrencia: 'hogar',
  numero_ambulancia: '34',
  operador: 'Armando Del Valle',
  prestadores_servicio: 'Haydee Diaz',
  nombre_paciente: 'Mario Ventura',
  nombre_acompanante: 'panfila',
  sexo: 'masculino',
  edad_anos: '33',
  edad_meses: '4',
  domicilio: 'Calle 9',
  colonia_paciente: 'zona centro',
  delegacion_paciente: 'ensenada',
  telefono: '646-277-38-34',
  derechohabiente: 'IMSS',
  origen_probable: ['cardiovascular'],
  accidente_tipo: 'colision',
  automotor: true,
  nivel_conciencia: 'consciente',
  via_aerea: 'permeable',
  reflejo_deglucion: 'presente',
  ventilacion: 'automatismo_regular',
  auscultacion: 'normales',
  pulso_presente: 'radial',
  calidad_pulso: 'ritmico',
  piel: 'normal',
  exploracion_fisica: ['contusiones', 'abrasiones'],
  zonas_lesion: { cabeza: true, hombro_der: true, pierna_izq: true },
  vitales: [{ hora: '16:24', fr: '20', fc: '100', tas: '120', tad: '80', sao2: '95', temp: '36.5', glucosa: '100' }],
  condicion_paciente: 'no_critico',
  prioridad: 'amarillo',
  via_aerea_manejo: ['aspiracion'],
  control_cervical: 'rigido',
  asistencia_ventilatoria: 'balon_valvula',
  oxigenoterapia: 'mascarilla_reservorio',
  lts_x_min: '15',
  control_hemorragias: ['presion_directa'],
  tipo_soluciones: ['hartmann', 'nacl'],
  agente_causal: ['ser_humano'],
  lesiones_causadas_por: 'Accidente automovilístico',
  alergias: 'XXXX',
  medicamentos: 'XXXXXX',
  enfermedades_previas: 'NINGUNA',
  ultima_comida: '17:26',
  observaciones: 'Paciente estable, consciente y orientado.',
  glasgow_total: '15',
  asimetria_facial: 'no',
  paresia_brazos: 'no',
  alteracion_lenguaje: 'no'
};

async function generateCompletePDF() {
  console.log('🔧 Generando PDF completo con medidas exactas...');
  
  try {
    const doc = new jsPDF('p', 'mm', 'letter');
    const frap = testData;
    
    // Dimensiones de página
    const pw = doc.internal.pageSize.getWidth(); // 215.9mm
    const ph = doc.internal.pageSize.getHeight(); // 279.4mm
    
    // Márgenes EXACTOS
    const mx = 12;
    const my_top = 23;
    const my_bottom = 16;
    const cw = pw - (mx * 2);
    
    // Columnas EXACTAS según análisis
    const col1X = mx;
    const col1W = 95;
    const col2X = mx + col1W + 5;
    const col2W = 86;
    
    // Colores EXACTOS
    const GREEN = [0, 128, 0];
    const BLACK = [0, 0, 0];
    const WHITE = [255, 255, 255];
    
    // ═══════════════════════════════════════════════════════════
    // FUNCIONES HELPER
    // ═══════════════════════════════════════════════════════════
    
    const checkbox = (label, checked, x, y, size = 3.5) => {
      doc.setDrawColor(...BLACK);
      doc.setLineWidth(0.3);
      doc.rect(x, y - 2.5, size, size, 'S');
      if (checked) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('✓', x + 0.5, y);
      }
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...BLACK);
      doc.text(label, x + size + 3.5, y);
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
      doc.rect(x, y, width, 10, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...WHITE);
      doc.text(title, x + 2, y + 6.5);
      doc.setTextColor(...BLACK);
      return y + 10 + 1.5; // altura header + espaciado reducido
    };
    
    let leftY = my_top;
    let rightY = my_top;
    
    // ════════════════════════════════════════════════════════════════
    // PÁGINA 1
    // ════════════════════════════════════════════════════════════════
    
    // ──────────────────────────────────────────────────────────────
    // HEADER ORGANIZACIÓN
    // ──────────────────────────────────────────────────────────────
    doc.setFillColor(...GREEN);
    doc.rect(mx, leftY, cw, 18, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text('CUERPO DE RESCATE DE ENSENADA, A.C.', mx + 3, leftY + 6);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Calle Magnolias No. 2356', mx + 3, leftY + 11);
    doc.text('Col. Márquez de León, Ensenada, B.C.', mx + 3, leftY + 14);
    doc.text('Tels. 176-8033 y 177-9992', mx + 3, leftY + 17);
    
    // Fecha y Folio
    doc.setFillColor(...WHITE);
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(1);
    doc.rect(mx + cw - 50, leftY + 3, 48, 12, 'FD');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLACK);
    doc.text('FECHA:', mx + cw - 48, leftY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(frap.fecha || '', mx + cw - 32, leftY + 7);
    
    doc.setFont('helvetica', 'bold');
    doc.text('# FOLIO:', mx + cw - 48, leftY + 13);
    doc.setFontSize(16);
    doc.setTextColor(...GREEN);
    doc.text(frap.folio || '', mx + cw - 30, leftY + 13);
    
    leftY += 18 + 3;
    rightY = leftY;
    
    // ──────────────────────────────────────────────────────────────
    // TIEMPOS
    // ──────────────────────────────────────────────────────────────
    doc.setFillColor(...GREEN);
    doc.rect(mx, leftY, cw, 10, 'F');
    
    const timeLabels = ['HORA LLAMADA', 'HORA SALIDA', 'HORA LLEGADA', 'HORA TRASLADO', 'HORA HOSPITAL', 'HORA BASE'];
    const timeValues = [frap.hora_llamada, frap.hora_salida, frap.hora_llegada, frap.hora_traslado, frap.hora_hospital, frap.hora_base];
    const timeW = cw / 6;
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    
    timeLabels.forEach((lbl, i) => {
      doc.text(lbl, mx + (timeW * i) + timeW / 2, leftY + 6.5, { align: 'center' });
    });
    
    leftY += 9;
    doc.setTextColor(...BLACK);
    doc.setFont('helvetica', 'normal');
    
    timeValues.forEach((val, i) => {
      doc.rect(mx + (timeW * i), leftY, timeW, 8, 'S');
      doc.text(val || '', mx + (timeW * i) + timeW / 2, leftY + 5.5, { align: 'center' });
    });
    
    leftY += 8 + 3;
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
    
    motivos.forEach(({ value, label: lbl }, i) => {
      checkbox(lbl, frap.motivo_atencion === value, col1X + 2 + (i % 2 * 48), leftY + Math.floor(i / 2) * 4.5, 3);
    });
    leftY += 9;
    
    // UBICACIÓN DEL SERVICIO
    leftY = sectionTitle('UBICACIÓN DEL SERVICIO', col1X, leftY, col1W);
    
    label('CALLE:', col1X + 2, leftY);
    line(col1X + 14, leftY + 0.5, 78);
    value(frap.calle, col1X + 15, leftY);
    leftY += 4;
    
    label('ENTRE:', col1X + 2, leftY);
    line(col1X + 14, leftY + 0.5, 78);
    leftY += 4;
    
    label('COLONIA/COMUNIDAD:', col1X + 2, leftY);
    line(col1X + 40, leftY + 0.5, 52);
    value(frap.colonia, col1X + 41, leftY);
    leftY += 4;
    
    label('DELEGACIÓN POLÍTICA/MUNICIPIO:', col1X + 2, leftY);
    line(col1X + 55, leftY + 0.5, 37);
    value(frap.delegacion_municipio, col1X + 56, leftY);
    leftY += 4;
    
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
    
    lugares.forEach(({ value: val, label: lbl }, i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      checkbox(lbl, frap.lugar_ocurrencia === val, col1X + 2 + (col * 47), leftY + (row * 3.5), 3);
    });
    leftY += 15;
    
    label('NÚMERO DE AMBULANCIA:', col1X + 2, leftY);
    line(col1X + 45, leftY + 0.5, 47);
    value(frap.numero_ambulancia, col1X + 46, leftY);
    leftY += 4;
    
    label('OPERADOR:', col1X + 2, leftY);
    line(col1X + 22, leftY + 0.5, 70);
    value(frap.operador, col1X + 23, leftY);
    leftY += 4;
    
    label('PRESTADORES DEL SERVICIO:', col1X + 2, leftY);
    line(col1X + 50, leftY + 0.5, 42);
    value(frap.prestadores_servicio, col1X + 51, leftY);
    leftY += 5;
    
    // NOMBRE DEL PACIENTE
    leftY = sectionTitle('NOMBRE DEL PACIENTE', col1X, leftY, col1W);
    value(frap.nombre_paciente, col1X + 2, leftY);
    leftY += 4;
    
    label('NOMBRE DEL ACOMPAÑANTE:', col1X + 2, leftY);
    line(col1X + 50, leftY + 0.5, 42);
    value(frap.nombre_acompanante, col1X + 51, leftY);
    leftY += 4;
    
    label('SEXO:', col1X + 2, leftY);
    checkbox('M MASC.', frap.sexo === 'masculino', col1X + 15, leftY, 3);
    checkbox('FEM.', frap.sexo === 'femenino', col1X + 35, leftY, 3);
    
    label('EDAD:', col1X + 50, leftY);
    doc.rect(col1X + 62, leftY - 3, 10, 5, 'S');
    value(frap.edad_anos, col1X + 64, leftY);
    label('AÑOS', col1X + 73, leftY);
    
    doc.rect(col1X + 80, leftY - 3, 8, 5, 'S');
    value(frap.edad_meses, col1X + 82, leftY);
    label('MESES', col1X + 89, leftY);
    leftY += 7;
    
    label('DOMICILIO:', col1X + 2, leftY);
    line(col1X + 22, leftY + 0.5, 70);
    value(frap.domicilio, col1X + 23, leftY);
    leftY += 4;
    
    label('COLONIA/COMUNIDAD:', col1X + 2, leftY);
    line(col1X + 40, leftY + 0.5, 52);
    value(frap.colonia_paciente, col1X + 41, leftY);
    leftY += 4;
    
    label('DELEGACIÓN POLÍTICA/MUNICIPIO:', col1X + 2, leftY);
    line(col1X + 58, leftY + 0.5, 34);
    value(frap.delegacion_paciente, col1X + 59, leftY);
    leftY += 4;
    
    label('TELÉFONO:', col1X + 2, leftY);
    line(col1X + 22, leftY + 0.5, 30);
    value(frap.telefono, col1X + 23, leftY);
    label('OCUPACIÓN:', col1X + 55, leftY);
    line(col1X + 75, leftY + 0.5, 17);
    leftY += 4;
    
    label('DERECHOHABIENTE A:', col1X + 2, leftY);
    line(col1X + 40, leftY + 0.5, 40);
    value(frap.derechohabiente, col1X + 41, leftY);
    label('IMSS', col1X + 83, leftY);
    leftY += 4;
    
    label('COMPAÑÍA DE SEGUROS GASTOS MÉDICOS:', col1X + 2, leftY);
    line(col1X + 68, leftY + 0.5, 24);
    leftY += 5;
    
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
    
    origenes.forEach(({ value: val, label: lbl }, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      checkbox(lbl, (frap.origen_probable || []).includes(val), col1X + 2 + (col * 31.5), leftY + (row * 3.5), 3);
    });
    leftY += 15;
    
    label('ESPECIFIQUE:', col1X + 2, leftY);
    line(col1X + 25, leftY + 0.5, 67);
    leftY += 4;
    
    label('1A VEZ:', col1X + 2, leftY);
    doc.rect(col1X + 15, leftY - 3, 3.5, 3.5, 'S');
    label('SUBSECUENTE:', col1X + 40, leftY);
    doc.rect(col1X + 65, leftY - 3, 3.5, 3.5, 'S');
    leftY += 5;
    
    // ACCIDENTE AUTOMOVILÍSTICO
    leftY = sectionTitle('ACCIDENTE AUTOMOVILÍSTICO', col1X, leftY, col1W);
    
    checkbox('COLISIÓN', frap.accidente_tipo === 'colision', col1X + 2, leftY, 3);
    checkbox('VOLCADURA', frap.accidente_tipo === 'volcadura', col1X + 32, leftY, 3);
    leftY += 4;
    
    checkbox('AUTOMOTOR', frap.automotor, col1X + 2, leftY, 3);
    checkbox('MOTOCICLETA', frap.motocicleta, col1X + 32, leftY, 3);
    checkbox('BICICLETA', frap.bicicleta, col1X + 60, leftY, 3);
    leftY += 4;
    
    label('CONTRA OBJETO:', col1X + 2, leftY);
    checkbox('FIJO', frap.contra_objeto === 'fijo', col1X + 28, leftY, 3);
    checkbox('EN MOVIMIENTO', frap.contra_objeto === 'movimiento', col1X + 48, leftY, 3);
    leftY += 4;
    
    label('IMPACTO:', col1X + 2, leftY);
    line(col1X + 18, leftY + 0.5, 10);
    leftY += 4;
    
    checkbox('FRONTAL', frap.impacto === 'frontal', col1X + 2, leftY, 3);
    checkbox('LATERAL', frap.impacto === 'lateral', col1X + 24, leftY, 3);
    checkbox('POSTERIOR', frap.impacto === 'posterior', col1X + 46, leftY, 3);
    leftY += 4;
    
    label('HUNDIMIENTO:', col1X + 2, leftY);
    line(col1X + 28, leftY + 0.5, 15);
    label('CMS', col1X + 44, leftY);
    
    label('PARABRISAS:', col1X + 52, leftY);
    checkbox('ROTO', frap.parabrisas === 'roto', col1X + 72, leftY, 3);
    leftY += 4;
    
    label('VOLANTE:', col1X + 2, leftY);
    checkbox('DOBLADO', frap.parabrisas === 'doblado', col1X + 20, leftY, 3);
    checkbox('INTRUSIÓN', frap.volante === 'intrusion', col1X + 42, leftY, 3);
    
    label('BOLSA DE AIRE:', col1X + 64, leftY);
    checkbox('SÍ', frap.bolsa_aire === 'si', col1X + 88, leftY, 3);
    leftY += 4;
    
    label('CINTURÓN DE SEGURIDAD:', col1X + 2, leftY);
    checkbox('COLOCADO', frap.cinturon === 'colocado', col1X + 45, leftY, 3);
    checkbox('NO COLOCADO', frap.cinturon === 'no_colocado', col1X + 70, leftY, 3);
    leftY += 4;
    
    label('DENTRO DEL VEHÍCULO:', col1X + 2, leftY);
    checkbox('SÍ', frap.dentro_vehiculo === 'si', col1X + 40, leftY, 3);
    checkbox('NO', frap.dentro_vehiculo === 'no', col1X + 52, leftY, 3);
    checkbox('EYECTADO', frap.dentro_vehiculo === 'eyectado', col1X + 65, leftY, 3);
    leftY += 4;
    
    label('ATROPELLADO:', col1X + 2, leftY);
    checkbox('AUTOMOTOR', frap.atropellado_tipo === 'automotor', col1X + 28, leftY, 3);
    checkbox('MOTOCICLETA', frap.atropellado_tipo === 'motocicleta', col1X + 52, leftY, 3);
    leftY += 4;
    
    label('CASCO DE SEGURIDAD:', col1X + 2, leftY);
    checkbox('SÍ', frap.casco_seguridad === 'si', col1X + 40, leftY, 3);
    checkbox('NO', frap.casco_seguridad === 'no', col1X + 52, leftY, 3);
    leftY += 5;
    
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
    
    agentes.forEach(({ value: val, label: lbl }, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      checkbox(lbl, (frap.agente_causal || []).includes(val), col1X + 2 + (col * 31.5), leftY + (row * 3.5), 3);
    });
    leftY += 17;
    
    label('ESPECIFIQUE:', col1X + 2, leftY);
    line(col1X + 25, leftY + 0.5, 67);
    leftY += 4;
    
    label('LESIONES CAUSADAS POR:', col1X + 2, leftY);
    line(col1X + 45, leftY + 0.5, 47);
    value(frap.lesiones_causadas_por, col1X + 46, leftY);
    
    // ════════════════════════════════════════════════════════════════
    // COLUMNA DERECHA - PÁGINA 1
    // ════════════════════════════════════════════════════════════════
    
    rightY = my_top + 18 + 3 + 10 + 8 + 3; // Después de tiempos
    
    // NIVEL DE CONCIENCIA
    rightY = sectionTitle('NIVEL DE CONCIENCIA', col2X, rightY, col2W);
    
    checkbox('CONSCIENTE', frap.nivel_conciencia === 'consciente', col2X + 2, rightY, 3);
    rightY += 4;
    checkbox('RESPUESTA A ESTÍMULO VERBAL', frap.nivel_conciencia === 'verbal', col2X + 2, rightY, 3);
    rightY += 4;
    checkbox('RESPUESTA A ESTÍMULO DOLOROSO', frap.nivel_conciencia === 'doloroso', col2X + 2, rightY, 3);
    rightY += 4;
    checkbox('INCONSCIENTE', frap.nivel_conciencia === 'inconsciente', col2X + 2, rightY, 3);
    rightY += 5;
    
    // VÍA AÉREA / REFLEJO DE DEGLUCIÓN (dos columnas)
    doc.setFillColor(...GREEN);
    doc.rect(col2X, rightY, col2W / 2 - 1, 10, 'F');
    doc.rect(col2X + col2W / 2 + 1, rightY, col2W / 2 - 1, 10, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text('VÍA AÉREA', col2X + 2, rightY + 6.5);
    doc.text('REFLEJO DE DEGLUCIÓN', col2X + col2W / 2 + 3, rightY + 6.5);
    rightY += 10 + 3;
    
    doc.setTextColor(...BLACK);
    checkbox('PERMEABLE', frap.via_aerea === 'permeable', col2X + 2, rightY, 3);
    checkbox('AUSENTE', frap.reflejo_deglucion === 'ausente', col2X + col2W / 2 + 2, rightY, 3);
    rightY += 4;
    checkbox('COMPROMETIDA', frap.via_aerea === 'comprometida', col2X + 2, rightY, 3);
    checkbox('PRESENTE', frap.reflejo_deglucion === 'presente', col2X + col2W / 2 + 2, rightY, 3);
    rightY += 5;
    
    // VENTILACIÓN
    rightY = sectionTitle('VENTILACIÓN', col2X, rightY, col2W);
    checkbox('AUTOMATISMO REGULAR', frap.ventilacion === 'automatismo_regular', col2X + 2, rightY, 3);
    rightY += 4;
    checkbox('AUTOMATISMO IRREGULAR', frap.ventilacion === 'automatismo_irregular', col2X + 2, rightY, 3);
    rightY += 4;
    checkbox('VENTILACIÓN RÁPIDA', frap.ventilacion === 'rapida', col2X + 2, rightY, 3);
    rightY += 4;
    checkbox('VENTILACIÓN SUPERFICIAL', frap.ventilacion === 'superficial', col2X + 2, rightY, 3);
    rightY += 4;
    checkbox('APNEA', frap.ventilacion === 'apnea', col2X + 2, rightY, 3);
    rightY += 5;
    
    // AUSCULTACIÓN
    rightY = sectionTitle('AUSCULTACIÓN', col2X, rightY, col2W);
    checkbox('RUIDOS RESP. NORMALES', frap.auscultacion === 'normales', col2X + 2, rightY, 3);
    rightY += 4;
    checkbox('RUIDOS RESP. DISMINUIDOS', frap.auscultacion === 'disminuidos', col2X + 2, rightY, 3);
    rightY += 4;
    checkbox('RUIDOS RESP. AUSENTES', frap.auscultacion === 'ausentes', col2X + 2, rightY, 3);
    rightY += 4;
    
    label('NEUMOTÓRAX:', col2X + 2, rightY);
    checkbox('DERECHO', frap.neumotorax === 'derecho', col2X + 30, rightY, 3);
    checkbox('IZQUIERDO', frap.neumotorax === 'izquierdo', col2X + 56, rightY, 3);
    rightY += 4;
    label('SITIO:', col2X + 2, rightY);
    checkbox('APICAL', frap.sitio_neumotorax === 'apical', col2X + 14, rightY, 3);
    checkbox('BASE', frap.sitio_neumotorax === 'base', col2X + 32, rightY, 3);
    rightY += 5;
    
    // CIRCULACIÓN
    rightY = sectionTitle('CIRCULACIÓN: PRESENCIA DE PULSOS', col2X, rightY, col2W);
    checkbox('CAROTÍDEO', frap.pulso_presente === 'carotideo', col2X + 2, rightY, 3);
    rightY += 4;
    checkbox('RADIAL', frap.pulso_presente === 'radial', col2X + 2, rightY, 3);
    rightY += 4;
    checkbox('PARO CARDIORRESPIRATORIO', frap.pulso_presente === 'paro', col2X + 2, rightY, 3);
    rightY += 5;
    
    // CALIDAD / PIEL (dos columnas)
    doc.setFillColor(...GREEN);
    doc.rect(col2X, rightY, col2W / 2 - 1, 10, 'F');
    doc.rect(col2X + col2W / 2 + 1, rightY, col2W / 2 - 1, 10, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text('CALIDAD', col2X + 2, rightY + 6.5);
    doc.text('PIEL', col2X + col2W / 2 + 3, rightY + 6.5);
    rightY += 10 + 3;
    
    doc.setTextColor(...BLACK);
    checkbox('RÁPIDO', frap.calidad_pulso === 'rapido', col2X + 2, rightY, 3);
    checkbox('NORMAL', frap.piel === 'normal', col2X + col2W / 2 + 2, rightY, 3);
    rightY += 4;
    checkbox('LENTO', frap.calidad_pulso === 'lento', col2X + 2, rightY, 3);
    checkbox('PÁLIDA', frap.piel === 'palida', col2X + col2W / 2 + 2, rightY, 3);
    rightY += 4;
    checkbox('RÍTMICO', frap.calidad_pulso === 'ritmico', col2X + 2, rightY, 3);
    checkbox('CIANÓTICA', frap.piel === 'cianotica', col2X + col2W / 2 + 2, rightY, 3);
    rightY += 4;
    checkbox('ARRÍTMICO', frap.calidad_pulso === 'arritmico', col2X + 2, rightY, 3);
    checkbox('DIAFORESIS', frap.piel === 'diaforesis', col2X + col2W / 2 + 2, rightY, 3);
    rightY += 4;
    
    label('CARACTERÍSTICAS:', col2X + 2, rightY);
    line(col2X + 32, rightY + 0.5, col2W - 34);
    rightY += 5;
    
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
      { n: '13', value: 'alt_sensibilidad', label: 'Alt. Sensibilidad' },
      { n: '14', value: 'alt_movilidad', label: 'Alt. Movilidad' },
      { n: '15', value: 'dolor', label: 'Dolor' }
    ];
    
    const expFisicaArray = frap.exploracion_fisica || [];
    exploracion.forEach(({ n, value: val, label: lbl }, i) => {
    if (i >= 15) return; // Limitar a 15 items para evitar solapamiento
      const row = Math.floor(i / 2);
      const col = i % 2;
      const x = col2X + 2 + (col * 42);
      const y = rightY + (row * 3.5);
      
      checkbox(`${n}. ${lbl}`, expFisicaArray.includes(val), x, y, 2.2);
    });
    rightY += 28;
    
    // ZONAS DE LESIÓN + PUPILAS (lado a lado)
    const diagramX = col2X + 2;
    const diagramY = rightY;
    const diagramW = 30;
    const diagramH = 45;
    
    label('ZONAS DE LESIÓN', diagramX + diagramW / 2, diagramY - 2);
    
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.5);
    doc.rect(diagramX, diagramY, diagramW, diagramH, 'S');
    
    // Diagrama simplificado del cuerpo
    const cx = diagramX + diagramW / 2;
    const scale = 0.42;
    const startY = diagramY + 3;
    
    doc.setLineWidth(0.3);
    // Cabeza
    doc.circle(cx, startY + 4 * scale, 3 * scale, 'S');
    // Cuello
    doc.line(cx - 1.5 * scale, startY + 7 * scale, cx - 1.5 * scale, startY + 9 * scale);
    doc.line(cx + 1.5 * scale, startY + 7 * scale, cx + 1.5 * scale, startY + 9 * scale);
    // Torso
    doc.line(cx - 5 * scale, startY + 9 * scale, cx - 4 * scale, startY + 22 * scale);
    doc.line(cx + 5 * scale, startY + 9 * scale, cx + 4 * scale, startY + 22 * scale);
    doc.line(cx - 4 * scale, startY + 22 * scale, cx - 3 * scale, startY + 25 * scale);
    doc.line(cx + 4 * scale, startY + 22 * scale, cx + 3 * scale, startY + 25 * scale);
    // Brazos
    doc.line(cx - 5 * scale, startY + 9 * scale, cx - 8 * scale, startY + 18 * scale);
    doc.line(cx + 5 * scale, startY + 9 * scale, cx + 8 * scale, startY + 18 * scale);
    doc.line(cx - 8 * scale, startY + 18 * scale, cx - 9 * scale, startY + 26 * scale);
    doc.line(cx + 8 * scale, startY + 18 * scale, cx + 9 * scale, startY + 26 * scale);
    // Piernas
    doc.line(cx - 3 * scale, startY + 25 * scale, cx - 3.5 * scale, startY + 40 * scale);
    doc.line(cx + 3 * scale, startY + 25 * scale, cx + 3.5 * scale, startY + 40 * scale);
    doc.line(cx - 3.5 * scale, startY + 40 * scale, cx - 3 * scale, startY + 48 * scale);
    doc.line(cx + 3.5 * scale, startY + 40 * scale, cx + 3 * scale, startY + 48 * scale);
    
    // Marcar zonas lesionadas
    const zonasLesion = frap.zonas_lesion || {};
    const markZone = (zoneX, zoneY, radius) => {
      doc.setFillColor(255, 0, 0);
      doc.circle(zoneX, zoneY, radius, 'F');
    };
    
    if (zonasLesion.cabeza) markZone(cx, startY + 4 * scale, 1.5 * scale);
    if (zonasLesion.pierna_izq) markZone(cx + 3.2 * scale, startY + 44 * scale, 1 * scale);
    
    doc.setFontSize(5);
    doc.setTextColor(...BLACK);
    doc.text('ANTERIOR', cx, diagramY + diagramH - 2, { align: 'center' });
    
    // PUPILAS
    const pupX = diagramX + diagramW + 6;
    const pupY = diagramY + 8;
    
    label('PUPILAS', pupX, pupY);
    
    // Derecha
    doc.circle(pupX + 8, pupY + 6, 4, 'S');
    doc.setFillColor(...BLACK);
    doc.circle(pupX + 8, pupY + 6, 2, 'F');
    
    // Izquierda
    doc.circle(pupX + 20, pupY + 6, 4, 'S');
    doc.setFillColor(...BLACK);
    doc.circle(pupX + 20, pupY + 6, 2, 'F');
    
    doc.setFontSize(5);
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
    
    rightY += 4;
    
    const vitales = frap.vitales || [];
    for (let r = 0; r < 3; r++) {
      const vital = vitales[r] || {};
      const vals = [vital.hora, vital.fr, vital.fc, vital.tas, vital.tad, vital.sao2, vital.temp, vital.glucosa];
      
      doc.setFont('helvetica', 'normal');
      vals.forEach((v, i) => {
        doc.rect(col2X + (vW * i), rightY, vW, 5, 'S');
        doc.text(String(v || ''), col2X + (vW * i) + vW / 2, rightY + 3.5, { align: 'center' });
      });
      rightY += 4;
    }
    rightY += 2.5;
    
    // CONDICIÓN DEL PACIENTE / PRIORIDAD
    doc.setFillColor(...GREEN);
    doc.rect(col2X, rightY, col2W / 2 - 1, 10, 'F');
    doc.rect(col2X + col2W / 2 + 1, rightY, col2W / 2 - 1, 10, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text('CONDICIÓN DEL PACIENTE', col2X + 2, rightY + 6.5);
    doc.text('PRIORIDAD', col2X + col2W / 2 + 3, rightY + 6.5);
    rightY += 10 + 3;
    
    doc.setTextColor(...BLACK);
    checkbox('CRÍTICO INESTABLE', frap.condicion_paciente === 'critico_inestable', col2X + 2, rightY, 3);
    
    // Botones de prioridad
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
    checkbox('NO CRÍTICO', frap.condicion_paciente === 'no_critico', col2X + 2, rightY, 3);
    rightY += 4;
    checkbox('CRÍTICO ESTABLE', frap.condicion_paciente === 'critico_estable', col2X + 2, rightY, 3);
    rightY += 7;
    
    // MANEJO (4 columnas estrechas)
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
    rightY += 5;
    
    doc.setFontSize(5);
    doc.setTextColor(...BLACK);
    
    const viaAereaManejo = frap.via_aerea_manejo || [];
    
    checkbox('ASPIRACIÓN', viaAereaManejo.includes('aspiracion'), col2X + 1, rightY, 2);
    checkbox('MANUAL', frap.control_cervical === 'manual', col2X + mW + 1, rightY, 2);
    checkbox('BALÓN-VÁLVULA', frap.asistencia_ventilatoria === 'balon_valvula', col2X + mW * 2 + 1, rightY, 2);
    checkbox('PUNTAS NASALES', frap.oxigenoterapia === 'puntas_nasales', col2X + mW * 3 + 1, rightY, 2);
    rightY += 2.5;
    
    checkbox('CÁNULA ORO', viaAereaManejo.includes('canula_oro'), col2X + 1, rightY, 2);
    checkbox('COLLARÍN RÍGIDO', frap.control_cervical === 'rigido', col2X + mW + 1, rightY, 2);
    checkbox('VENT. AUTOMÁTICO', frap.asistencia_ventilatoria === 'ventilador', col2X + mW * 2 + 1, rightY, 2);
    checkbox('MASCARILLA SIMPLE', frap.oxigenoterapia === 'mascarilla_simple', col2X + mW * 3 + 1, rightY, 2);
    rightY += 2.5;
    
    checkbox('CÁNULA NASO', viaAereaManejo.includes('canula_naso'), col2X + 1, rightY, 2);
    checkbox('COLLARÍN BLANDO', frap.control_cervical === 'blando', col2X + mW + 1, rightY, 2);
    checkbox('MASCARILLA C/RESERV', frap.oxigenoterapia === 'mascarilla_reservorio', col2X + mW * 3 + 1, rightY, 2);
    rightY += 2.5;
    
    label('LTS X MIN:', col2X + mW * 3 + 1, rightY);
    line(col2X + mW * 3 + 14, rightY + 0.5, 8);
    value(frap.lts_x_min, col2X + mW * 3 + 15, rightY);
    rightY += 4;
    
    // CONTROL HEMORRAGIAS (4 columnas)
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
    rightY += 5;
    
    doc.setFontSize(5);
    doc.setTextColor(...BLACK);
    
    const controlHemorragias = frap.control_hemorragias || [];
    const soluciones = frap.tipo_soluciones || [];
    
    checkbox('PRESIÓN DIRECTA', controlHemorragias.includes('presion_directa'), col2X + 1, rightY, 2);
    label('VÍA IV #', col2X + hW + 1, rightY);
    line(col2X + hW + 12, rightY + 0.5, 6);
    label('MANO', col2X + hW * 2 + 1, rightY);
    checkbox('HARTMANN', soluciones.includes('hartmann'), col2X + hW * 3 + 1, rightY, 2);
    rightY += 2.5;
    
    checkbox('TORNIQUETE', controlHemorragias.includes('torniquete'), col2X + 1, rightY, 2);
    label('CATETER #', col2X + hW + 1, rightY);
    line(col2X + hW + 13, rightY + 0.5, 5);
    label('PLIEGUE ANTEC', col2X + hW * 2 + 1, rightY);
    checkbox('NaCl 0.9%', soluciones.includes('nacl'), col2X + hW * 3 + 1, rightY, 2);
    rightY += 2.5;
    
    checkbox('VENDAJE COMPRES', controlHemorragias.includes('vendaje'), col2X + 1, rightY, 2);
    checkbox('MIXTA', soluciones.includes('mixta'), col2X + hW * 3 + 1, rightY, 2);
    rightY += 2.5;
    
    checkbox('GLUCOSA 5%', soluciones.includes('glucosa'), col2X + hW * 3 + 1, rightY, 2);
    rightY += 2.5;
    
    checkbox('OTRA', soluciones.includes('otra'), col2X + hW * 3 + 1, rightY, 2);
    
    // ════════════════════════════════════════════════════════════════
    // PÁGINA 2
    // ════════════════════════════════════════════════════════════════
    
    doc.addPage();
    
    leftY = my_top;
    rightY = my_top;
    
    // Header pequeño
    doc.setFillColor(...GREEN);
    doc.rect(mx, my_top, cw, 8, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text('CUERPO DE RESCATE DE ENSENADA, A.C.', mx + 2, my_top + 5.5);
    
    leftY = my_top + 10;
    rightY = my_top + 10;
    
    // ════════════════════════════════════════════════════════════════
    // COLUMNA IZQUIERDA - PÁGINA 2
    // ════════════════════════════════════════════════════════════════
    
    // DATOS DE LA MADRE
    leftY = sectionTitle('DATOS DE LA MADRE', col1X, leftY, col1W);
    
    label('GESTA:', col1X + 2, leftY);
    doc.rect(col1X + 18, leftY - 3, 10, 5, 'S');
    
    label('CESÁREAS:', col1X + 32, leftY);
    doc.rect(col1X + 50, leftY - 3, 10, 5, 'S');
    
    label('PARA:', col1X + 64, leftY);
    doc.rect(col1X + 76, leftY - 3, 10, 5, 'S');
    leftY += 4;
    
    label('ABORTOS:', col1X + 2, leftY);
    doc.rect(col1X + 20, leftY - 3, 10, 5, 'S');
    leftY += 5;
    
    label('FUM:', col1X + 2, leftY);
    line(col1X + 12, leftY + 0.5, 20);
    
    label('SEMANAS DE GESTACIÓN:', col1X + 35, leftY);
    doc.rect(col1X + 70, leftY - 3, 10, 5, 'S');
    leftY += 4;
    
    label('FECHA PROBABLE DE PARTO:', col1X + 2, leftY);
    line(col1X + 48, leftY + 0.5, 25);
    leftY += 4;
    
    label('HORA INICIO CONTRACCIONES:', col1X + 2, leftY);
    line(col1X + 52, leftY + 0.5, 20);
    leftY += 4;
    
    label('FRECUENCIA:', col1X + 2, leftY);
    line(col1X + 25, leftY + 0.5, 20);
    
    label('DURACIÓN:', col1X + 50, leftY);
    line(col1X + 70, leftY + 0.5, 22);
    leftY += 5;
    
    // DATOS POST-PARTO
    leftY = sectionTitle('DATOS POST-PARTO', col1X, leftY, col1W);
    
    label('HORA DE NACIMIENTO:', col1X + 2, leftY);
    line(col1X + 38, leftY + 0.5, 20);
    
    label('LUGAR:', col1X + 62, leftY);
    line(col1X + 75, leftY + 0.5, 17);
    leftY += 4;
    
    label('PLACENTA EXPULSADA:', col1X + 2, leftY);
    checkbox('SÍ', frap.postparto_placenta === 'si', col1X + 40, leftY, 3);
    checkbox('NO', frap.postparto_placenta === 'no', col1X + 52, leftY, 3);
    
    // ════════════════════════════════════════════════════════════════
    // COLUMNA DERECHA - PÁGINA 2
    // ════════════════════════════════════════════════════════════════
    
    // INTERROGATORIO
    rightY = sectionTitle('INTERROGATORIO', col2X, rightY, col2W);
    
    label('ALERGIAS:', col2X + 2, rightY);
    line(col2X + 18, rightY + 0.5, col2W - 20);
    value(frap.alergias, col2X + 19, rightY);
    rightY += 4.5;
    
    label('MEDICAMENTOS QUE ESTÁ INGIRIENDO:', col2X + 2, rightY);
    line(col2X + 58, rightY + 0.5, col2W - 60);
    value(frap.medicamentos, col2X + 59, rightY);
    rightY += 4.5;
    
    label('ENFERMEDADES Y CIRUGÍAS PREVIAS:', col2X + 2, rightY);
    line(col2X + 55, rightY + 0.5, col2W - 57);
    value(frap.enfermedades_previas, col2X + 56, rightY);
    rightY += 4.5;
    
    label('HORA DE LA ÚLTIMA COMIDA:', col2X + 2, rightY);
    line(col2X + 48, rightY + 0.5, col2W - 50);
    value(frap.ultima_comida, col2X + 49, rightY);
    rightY += 4.5;
    
    label('EVENTOS PREVIOS RELACIONADOS:', col2X + 2, rightY);
    line(col2X + 52, rightY + 0.5, col2W - 54);
    rightY += 5;
    
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
    rightY += 5;
    
    label('MÉDICO QUE RECIBE:', col2X + 2, rightY);
    line(col2X + 32, rightY + 0.5, col2W - 37);
    doc.setFontSize(5);
    doc.text('NOMBRE Y FIRMA', col2X + col2W - 22, rightY + 3);
    rightY += 6;
    
    // ESCALA DE GLASGOW
    rightY = sectionTitle('ESCALA DE GLASGOW', col2X, rightY, col2W);
    doc.setFontSize(6);
    
    label('APERTURA OCULAR', col2X + 2, rightY);
    rightY += 2.5;
    checkbox('4. ESPONTÁNEA', frap.glasgow_apertura === '4', col2X + 2, rightY, 3);
    rightY += 2.5;
    checkbox('3. A LA VOZ', frap.glasgow_apertura === '3', col2X + 2, rightY, 3);
    rightY += 2.5;
    checkbox('2. AL DOLOR', frap.glasgow_apertura === '2', col2X + 2, rightY, 3);
    rightY += 2.5;
    checkbox('1. NINGUNA', frap.glasgow_apertura === '1', col2X + 2, rightY, 3);
    rightY += 4;
    
    label('MEJOR RESPUESTA VERBAL', col2X + 2, rightY);
    rightY += 2.5;
    checkbox('5. ORIENTADO', frap.glasgow_verbal === '5', col2X + 2, rightY, 3);
    rightY += 2.5;
    checkbox('4. CONFUSO', frap.glasgow_verbal === '4', col2X + 2, rightY, 3);
    rightY += 2.5;
    checkbox('3. PALABRAS INAPROPIADAS', frap.glasgow_verbal === '3', col2X + 2, rightY, 3);
    rightY += 2.5;
    checkbox('2. SONIDOS INCOMPRENSIBLES', frap.glasgow_verbal === '2', col2X + 2, rightY, 3);
    rightY += 2.5;
    checkbox('1. NINGUNA', frap.glasgow_verbal === '1', col2X + 2, rightY, 3);
    rightY += 4;
    
    label('MEJOR RESPUESTA MOTORA', col2X + 2, rightY);
    rightY += 2.5;
    checkbox('6. OBEDECE ÓRDENES', frap.glasgow_motora === '6', col2X + 2, rightY, 3);
    rightY += 2.5;
    checkbox('5. LOCALIZA DOLOR', frap.glasgow_motora === '5', col2X + 2, rightY, 3);
    rightY += 2.5;
    checkbox('4. RETIRA AL DOLOR', frap.glasgow_motora === '4', col2X + 2, rightY, 3);
    rightY += 2.5;
    checkbox('3. FLEXIÓN ANORMAL', frap.glasgow_motora === '3', col2X + 2, rightY, 3);
    rightY += 2.5;
    checkbox('2. EXTENSIÓN ANORMAL', frap.glasgow_motora === '2', col2X + 2, rightY, 3);
    rightY += 2.5;
    checkbox('1. NINGUNA', frap.glasgow_motora === '1', col2X + 2, rightY, 3);
    rightY += 4;
    
    label('ESCALA DE GLASGOW:', col2X + 2, rightY);
    doc.rect(col2X + 32, rightY - 3, 10, 5, 'S');
    value(frap.glasgow_total, col2X + 34, rightY);
    rightY += 6;
    
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
    rightY += 5;
    
    // ESCALA DE TRAUMA
    rightY = sectionTitle('ESCALA DE TRAUMA', col2X, rightY, col2W);
    
    doc.autoTable({
      startY: rightY,
      margin: { left: col2X },
      tableWidth: col2W,
      head: [['(A)GCS', '(B)PAS', '(C)FR', '(D) Esfuerzo Respiratorio', 'Puntuación']],
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
    rightY += 5;
    
    // DATOS RECIÉN NACIDO / DESTINO
    doc.setFillColor(...GREEN);
    doc.rect(col2X, rightY, col2W / 2 - 1, 6, 'F');
    doc.rect(col2X + col2W / 2 + 1, rightY, col2W / 2 - 1, 6, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text('DATOS RECIÉN NACIDO', col2X + 2, rightY + 4);
    doc.text('DESTINO', col2X + col2W / 2 + 4, rightY + 4);
    rightY += 6;
    
    doc.setTextColor(...BLACK);
    doc.setFontSize(7);
    label('PRODUCTO:', col2X + 2, rightY);
    checkbox('VIVO', frap.recien_nacido_producto === 'vivo', col2X + 22, rightY, 3);
    checkbox('MUERTO', frap.recien_nacido_producto === 'muerto', col2X + 36, rightY, 3);
    checkbox('TRASLADADO', frap.recien_nacido_destino === 'trasladado', col2X + col2W / 2 + 4, rightY, 3);
    rightY += 4;
    
    label('SEXO:', col2X + 2, rightY);
    checkbox('MASC', frap.recien_nacido_sexo === 'masculino', col2X + 14, rightY, 3);
    checkbox('FEM', frap.recien_nacido_sexo === 'femenino', col2X + 30, rightY, 3);
    checkbox('NO TRASLADADO', frap.recien_nacido_destino === 'no_trasladado', col2X + col2W / 2 + 4, rightY, 3);
    rightY += 4;
    
    label('APGAR:', col2X + 2, rightY);
    checkbox('FUGA', frap.recien_nacido_destino === 'fuga', col2X + col2W / 2 + 4, rightY, 3);
    rightY += 4;
    
    doc.setDrawColor(...GREEN);
    doc.rect(col2X + 14, rightY - 3, 10, 5, 'S');
    doc.rect(col2X + 26, rightY - 3, 10, 5, 'S');
    doc.rect(col2X + 38, rightY - 3, 10, 5, 'S');
    doc.setFontSize(5);
    doc.text('1 MIN', col2X + 16, rightY + 4);
    doc.text('5 MIN', col2X + 28, rightY + 4);
    doc.text('10 MIN', col2X + 39, rightY + 4);
    rightY += 6;
    
    label('PRODUCTO:', col2X + 2, rightY);
    doc.rect(col2X + 18, rightY - 3, 10, 5, 'S');
    doc.rect(col2X + 30, rightY - 3, 10, 5, 'S');
    doc.rect(col2X + 42, rightY - 3, 10, 5, 'S');
    
    // ════════════════════════════════════════════════════════════════
    // FOOTER - FIRMAS
    // ════════════════════════════════════════════════════════════════
    
    // Calcular footer para que SIEMPRE quepa (2 secciones de 6mm + 2 cajas de 12mm = 42mm)
  const footerHeight = 42;
  let footerY = Math.max(leftY, rightY) + 2;
  // Si no cabe, mover hacia arriba FORZOSAMENTE
  if (footerY > ph - footerHeight - 5) {
    footerY = ph - footerHeight - 5;
  };
    
    // NEGATIVA / CONSENTIMIENTO
    doc.setFillColor(...GREEN);
    doc.rect(mx, footerY, (cw / 2) - 2, 6, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text('NEGATIVA A RECIBIR ATENCIÓN/', mx + 2, footerY + 3);
    doc.text('SER TRASLADADO EXIMENTE DE RESPONSABILIDAD', mx + 2, footerY + 6);
    
    doc.setFillColor(...GREEN);
    doc.rect(mx + (cw / 2) + 2, footerY, (cw / 2) - 2, 6, 'F');
    doc.text('CONSENTIMIENTO INFORMADO', mx + (cw / 2) + 4, footerY + 4);
    
    footerY += 8;
    
    const firmaH = 12;
    
    // Cajas de firmas
    doc.setDrawColor(...BLACK);
    doc.setLineWidth(0.3);
    doc.rect(mx, footerY, (cw / 2) - 2, firmaH, 'S');
    
    doc.setFontSize(6);
    doc.setTextColor(...BLACK);
    doc.setFont('helvetica', 'bold');
    doc.text('NOMBRE/FIRMA DEL PACIENTE', mx + 2, footerY + 4);
    line(mx + 2, footerY + 11, (cw / 2) - 6);
    
    doc.rect(mx + (cw / 2) + 2, footerY, (cw / 2) - 2, firmaH, 'S');
    doc.text('NOMBRE/FIRMA DEL PACIENTE', mx + (cw / 2) + 4, footerY + 4);
    line(mx + (cw / 2) + 4, footerY + 11, (cw / 2) - 6);
    
    footerY += firmaH + 1;
    
    doc.rect(mx, footerY, (cw / 2) - 2, firmaH, 'S');
    doc.text('NOMBRE/FIRMA DEL TESTIGO', mx + 2, footerY + 4);
    line(mx + 2, footerY + 11, (cw / 2) - 6);
    
    doc.rect(mx + (cw / 2) + 2, footerY, (cw / 2) - 2, firmaH, 'S');
    doc.text('NOMBRE/FIRMA DE FAMILIAR O TUTOR', mx + (cw / 2) + 4, footerY + 4);
    line(mx + (cw / 2) + 4, footerY + 11, (cw / 2) - 6);
    
    // Guardar PDF
    const pdfBlob = doc.output('blob');
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const pdfPath = '/app/test_pdf_output.pdf';
    fs.writeFileSync(pdfPath, buffer);
    console.log(`✅ PDF completo generado: ${pdfPath}`);
    
    // Convertir a imágenes
    console.log('🖼️  Convirtiendo a imágenes...');
    await execPromise('pdftoppm /app/test_pdf_output.pdf /app/test_pdf_page -png -r 200');
    
    console.log('✅ Imágenes generadas - Ahora puedes compararlas con el original');
    console.log('📄 Página 1: /app/test_pdf_page-1.png');
    console.log('📄 Página 2: /app/test_pdf_page-2.png');
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    return false;
  }
}

generateCompletePDF();
