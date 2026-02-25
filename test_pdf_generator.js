/**
 * ENTORNO DE PRUEBA - NO AFECTA CÓDIGO DE PRODUCCIÓN
 * 
 * Este archivo genera un PDF de prueba para comparación visual
 * con el PDF original sin tocar generatePDF.js
 */

import jsPDF from 'jspdf';
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

async function generateTestPDF() {
  console.log('🔧 Generando PDF de prueba...');
  
  try {
    // Aquí iré copiando el código de generatePDF.js
    // pero con ajustes iterativos basándome en lo que veo
    
    const doc = new jsPDF('p', 'mm', 'letter');
    
    // Por ahora, generar algo simple para probar el flujo
    doc.setFontSize(20);
    doc.text('PDF DE PRUEBA - ITERACIÓN 1', 105, 140, { align: 'center' });
    doc.text('Verificando que el flujo funcione', 105, 150, { align: 'center' });
    
    const pdfBlob = doc.output('blob');
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Guardar PDF de prueba
    const pdfPath = '/app/test_pdf_output.pdf';
    fs.writeFileSync(pdfPath, buffer);
    console.log(`✅ PDF de prueba generado: ${pdfPath}`);
    
    // Convertir a imágenes
    console.log('🖼️  Convirtiendo a imágenes...');
    await execPromise('pdftoppm /app/test_pdf_output.pdf /app/test_pdf_page -png -r 200');
    
    console.log('✅ Imágenes generadas:');
    console.log('   /app/test_pdf_page-1.png');
    console.log('   /app/test_pdf_page-2.png (si hay 2 páginas)');
    console.log('');
    console.log('📊 Ahora puedo ver las imágenes y compararlas con el original');
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

generateTestPDF();
