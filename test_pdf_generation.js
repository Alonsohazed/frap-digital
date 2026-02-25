/**
 * Script de prueba para generar y visualizar el PDF
 * Genera el PDF con datos de prueba y lo convierte a imágenes PNG
 */

import { generateFRAPPDF } from './src/utils/generatePDF.js';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Datos de prueba completos
const testData = {
  // Header info
  fecha: '2026-02-20',
  folio: '1003',
  hora_llamada: '16:20',
  hora_salida: '16:22',
  hora_llegada: '16:27',
  hora_traslado: '16:50',
  hora_hospital: '16:50',
  hora_base: '17:09',
  
  // Motivo
  motivo_atencion: 'enfermedad',
  
  // Ubicación
  calle: 'Magnolia',
  entre: '',
  colonia: 'Marquez de leon',
  delegacion_municipio: 'Ensenada',
  lugar_ocurrencia: 'hogar',
  numero_ambulancia: '34',
  operador: 'Armando Del Valle',
  prestadores_servicio: 'Haydee Diaz',
  
  // Paciente
  nombre_paciente: 'Mario Ventura',
  nombre_acompanante: 'panfila',
  sexo: 'masculino',
  edad_anos: '33',
  edad_meses: '4',
  domicilio: 'Calle 9',
  colonia_paciente: 'zona centro',
  delegacion_paciente: 'ensenada',
  telefono: '646-277-38-34',
  ocupacion: '',
  derechohabiente: 'IMSS',
  
  // Origen probable
  origen_probable: ['cardiovascular'],
  origen_probable_especifique: '',
  primera_vez: false,
  subsecuente: true,
  
  // Accidente
  accidente_tipo: 'automotor',
  colision: false,
  volcadura: false,
  automotor: true,
  motocicleta: false,
  contra_objeto: 'fijo',
  impacto: '',
  hundimiento: '',
  parabrisas: 'roto',
  volante_doblado: true,
  cinturon: 'no_colocado',
  dentro_vehiculo: 'eyectado',
  atropellado: false,
  casco_seguridad: false,
  
  // Nivel de conciencia
  nivel_conciencia: 'consciente',
  via_aerea: 'permeable',
  reflejo_deglucion: 'presente',
  
  // Ventilación
  ventilacion: 'automatismo_regular',
  auscultacion: 'normales',
  neumotorax: '',
  sitio_neumotorax: '',
  
  // Circulación
  pulso_presente: 'radial',
  calidad_pulso: 'ritmico',
  piel: 'normal',
  caracteristicas_piel: '',
  
  // Exploración física
  exploracion_fisica: ['contusiones', 'abrasiones'],
  zonas_lesion: {
    cabeza: true,
    hombro_der: true,
    pierna_izq: true
  },
  
  // Pupilas
  pupilas_derecha: 'normal',
  pupilas_izquierda: 'normal',
  
  // Signos vitales
  vitales: [
    {
      hora: '16:24',
      fr: '20',
      fc: '100',
      tas: '120',
      tad: '80',
      sao2: '95',
      temp: '36.5',
      glucosa: '100'
    }
  ],
  
  // Condición
  condicion_paciente: 'no_critico',
  prioridad: 'amarillo',
  
  // Manejo vía aérea
  via_aerea_manejo: ['aspiracion'],
  control_cervical: 'rigido',
  asistencia_ventilatoria: 'balon_valvula',
  oxigenoterapia: 'mascarilla_reservorio',
  lts_x_min: '15',
  
  // Control hemorragias
  control_hemorragias: ['presion_directa'],
  tipo_soluciones: ['hartmann', 'nacl'],
  
  // Agente causal
  agente_causal: ['ser_humano'],
  agente_causal_otro: '',
  lesiones_causadas_por: 'Accidente automovilístico, impacto frontal',
  
  // Datos madre
  madre_gesta: '',
  madre_cesareas: '',
  madre_para: '',
  madre_abortos: '',
  madre_fum: '',
  madre_semanas: '',
  madre_fecha_parto: '',
  madre_contracciones_hora: '',
  madre_contracciones_frecuencia: '',
  madre_contracciones_duracion: '',
  
  // Post parto
  postparto_nacimiento_hora: '',
  postparto_nacimiento_lugar: '',
  postparto_placenta: null,
  
  // Interrogatorio
  alergias: 'XXXX',
  medicamentos: 'XXXXXX',
  enfermedades_previas: 'NINGUNA',
  ultima_comida: '17:26',
  eventos_previos: '',
  
  // Observaciones
  observaciones: 'Paciente estable, consciente y orientado. Se trasladó sin complicaciones.',
  
  // Firmas
  firmas: {
    entrega_paciente: null,
    medico_recibe: null,
    paciente_negativa: null,
    testigo_negativa: null,
    paciente_consentimiento: null,
    familiar_consentimiento: null
  },
  
  // Escalas
  glasgow_total: '15',
  asimetria_facial: 'no',
  paresia_brazos: 'no',
  alteracion_lenguaje: 'no',
  
  // Trauma
  trauma_gcs: '14-15',
  trauma_pas: '90+',
  trauma_fr: '10-24',
  
  // Recién nacido
  recien_nacido_producto: '',
  recien_nacido_sexo: '',
  recien_nacido_apgar_1: '',
  recien_nacido_apgar_5: '',
  recien_nacido_apgar_10: '',
  recien_nacido_destino: ''
};

async function generateAndVisualize() {
  console.log('🔧 Generando PDF con datos de prueba...');
  
  try {
    // Generar el PDF
    const pdfBlob = await generateFRAPPDF(testData);
    
    // Convertir blob a buffer
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Guardar el PDF
    const pdfPath = '/app/test_output.pdf';
    fs.writeFileSync(pdfPath, buffer);
    console.log(`✅ PDF generado: ${pdfPath}`);
    
    // Convertir PDF a imágenes usando pdftoppm (viene con poppler-utils)
    console.log('🖼️  Convirtiendo PDF a imágenes...');
    await execPromise('pdftoppm /app/test_output.pdf /app/test_page -png -r 150');
    
    console.log('✅ Imágenes generadas:');
    console.log('   - /app/test_page-1.png (Página 1)');
    console.log('   - /app/test_page-2.png (Página 2)');
    console.log('');
    console.log('📊 Ahora puedo analizar las imágenes para verificar el layout');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

generateAndVisualize();
