/**
 * ITERACIÓN 1 - PDF CON MEDIDAS EXACTAS DEL ORIGINAL
 * 
 * Medidas extraídas del PDF original:
 * - Márgenes: Superior 23mm, Inferior 16mm, Izquierdo 12mm, Derecho 12mm
 * - Columna izq: 85mm, Columna der: 86mm
 * - Headers verdes: 7pt, Altura: 10mm
 * - Checkboxes: 3.5mm x 3.5mm
 * - Espaciado vertical: 6mm entre secciones
 */

import pkg from 'jspdf';
const { jsPDF } = pkg;
import 'jspdf-autotable';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Datos de prueba
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
  accidente_tipo: 'automotor',
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

async function generateIteration1() {
  console.log('🔧 ITERACIÓN 1: Generando PDF con medidas exactas...');
  
  try {
    const doc = new jsPDF('p', 'mm', 'letter');
    const frap = testData;
    
    // Dimensiones de página
    const pw = doc.internal.pageSize.getWidth(); // 215.9mm
    const ph = doc.internal.pageSize.getHeight(); // 279.4mm
    
    // Márgenes EXACTOS del original
    const mx = 12; // izquierdo/derecho
    const my_top = 23; // superior
    const my_bottom = 16; // inferior
    const cw = pw - (mx * 2); // ancho contenido
    
    // Columnas EXACTAS
    const col1X = mx;
    const col1W = 85; // mm (medida exacta)
    const col2X = mx + col1W + 6; // gap de 6mm
    const col2W = 86; // mm (medida exacta)
    
    // Colores EXACTOS
    const GREEN = [0, 128, 0];
    const BLACK = [0, 0, 0];
    const WHITE = [255, 255, 255];
    
    // Funciones helper
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
      doc.rect(x, y, width, 10, 'F'); // Altura exacta: 10mm
      doc.setFontSize(7); // Tamaño exacto: 7pt
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...WHITE);
      doc.text(title, x + 2, y + 6.5);
      doc.setTextColor(...BLACK);
      return y + 10 + 6; // altura header + espaciado vertical (6mm)
    };
    
    let leftY = my_top;
    let rightY = my_top;
    
    // ════════════════════════════════════════════════════════════════
    // HEADER ORGANIZACIÓN
    // ════════════════════════════════════════════════════════════════
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
    
    leftY += 18 + 6; // header + espaciado
    rightY = leftY;
    
    // ════════════════════════════════════════════════════════════════
    // TIEMPOS
    // ════════════════════════════════════════════════════════════════
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
    
    leftY += 11;
    doc.setTextColor(...BLACK);
    doc.setFont('helvetica', 'normal');
    
    timeValues.forEach((val, i) => {
      doc.rect(mx + (timeW * i), leftY, timeW, 8, 'S');
      doc.text(val || '', mx + (timeW * i) + timeW / 2, leftY + 5.5, { align: 'center' });
    });
    
    leftY += 8 + 6;
    rightY = leftY;
    
    // ════════════════════════════════════════════════════════════════
    // COLUMNA IZQUIERDA - Solo las primeras secciones para probar
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
      checkbox(label, frap.motivo_atencion === value, col1X + 2 + (i * 21), leftY, 3.5);
    });
    leftY += 6 + 6; // altura contenido + espaciado
    
    // UBICACIÓN DEL SERVICIO
    leftY = sectionTitle('UBICACIÓN DEL SERVICIO', col1X, leftY, col1W);
    
    label('CALLE:', col1X + 2, leftY);
    line(col1X + 14, leftY + 0.5, 68);
    value(frap.calle, col1X + 15, leftY);
    leftY += 5;
    
    label('ENTRE:', col1X + 2, leftY);
    line(col1X + 14, leftY + 0.5, 68);
    leftY += 5;
    
    label('COLONIA/COMUNIDAD:', col1X + 2, leftY);
    line(col1X + 40, leftY + 0.5, 42);
    value(frap.colonia, col1X + 41, leftY);
    leftY += 5;
    
    label('DELEGACIÓN POLÍTICA/MUNICIPIO:', col1X + 2, leftY);
    line(col1X + 55, leftY + 0.5, 27);
    value(frap.delegacion_municipio, col1X + 56, leftY);
    leftY += 6;
    
    label('LUGAR DE OCURRENCIA:', col1X + 2, leftY);
    leftY += 5;
    
    const lugares = [
      { value: 'hogar', label: 'HOGAR' },
      { value: 'via_publica', label: 'VÍA PÚBLICA' },
      { value: 'trabajo', label: 'TRABAJO' },
      { value: 'escuela', label: 'ESCUELA' }
    ];
    
    lugares.forEach(({ value, label }, i) => {
      if (i < 2) {
        checkbox(label, frap.lugar_ocurrencia === value, col1X + 2 + (i * 42), leftY, 3.5);
      } else {
        checkbox(label, frap.lugar_ocurrencia === value, col1X + 2 + ((i - 2) * 42), leftY + 5, 3.5);
      }
    });
    leftY += 12;
    
    // ════════════════════════════════════════════════════════════════
    // COLUMNA DERECHA - Solo las primeras secciones
    // ════════════════════════════════════════════════════════════════
    
    // NIVEL DE CONCIENCIA
    rightY = sectionTitle('NIVEL DE CONCIENCIA', col2X, rightY, col2W);
    
    checkbox('CONSCIENTE', frap.nivel_conciencia === 'consciente', col2X + 2, rightY, 3.5);
    rightY += 5;
    checkbox('RESPUESTA A ESTÍMULO VERBAL', frap.nivel_conciencia === 'verbal', col2X + 2, rightY, 3.5);
    rightY += 5;
    checkbox('RESPUESTA A ESTÍMULO DOLOROSO', frap.nivel_conciencia === 'doloroso', col2X + 2, rightY, 3.5);
    rightY += 5;
    checkbox('INCONSCIENTE', frap.nivel_conciencia === 'inconsciente', col2X + 2, rightY, 3.5);
    rightY += 6 + 6;
    
    // VÍA AÉREA / REFLEJO
    doc.setFillColor(...GREEN);
    doc.rect(col2X, rightY, col2W / 2 - 1, 10, 'F');
    doc.rect(col2X + col2W / 2 + 1, rightY, col2W / 2 - 1, 10, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text('VÍA AÉREA', col2X + 2, rightY + 6.5);
    doc.text('REFLEJO DE DEGLUCIÓN', col2X + col2W / 2 + 3, rightY + 6.5);
    rightY += 10 + 6;
    
    doc.setTextColor(...BLACK);
    checkbox('PERMEABLE', frap.via_aerea === 'permeable', col2X + 2, rightY, 3.5);
    checkbox('AUSENTE', frap.reflejo_deglucion === 'ausente', col2X + col2W / 2 + 2, rightY, 3.5);
    rightY += 5;
    checkbox('COMPROMETIDA', frap.via_aerea === 'comprometida', col2X + 2, rightY, 3.5);
    checkbox('PRESENTE', frap.reflejo_deglucion === 'presente', col2X + col2W / 2 + 2, rightY, 3.5);
    
    // Guardar PDF
    const pdfBlob = doc.output('blob');
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const pdfPath = '/app/test_pdf_output.pdf';
    fs.writeFileSync(pdfPath, buffer);
    console.log(`✅ PDF de prueba generado: ${pdfPath}`);
    
    // Convertir a imágenes
    console.log('🖼️  Convirtiendo a imágenes...');
    await execPromise('pdftoppm /app/test_pdf_output.pdf /app/test_pdf_page -png -r 200');
    
    console.log('✅ Imágenes generadas - Listo para comparar');
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    return false;
  }
}

generateIteration1();
