import React from 'react';
import { PrintableFRAP } from '../components/PrintableFRAP';

// Datos de prueba
const testData = {
  fecha: '2026-02-25',
  folio: '1001',
  hora_llamada: '14:30',
  hora_salida: '14:35',
  hora_llegada: '14:45',
  hora_traslado: '15:00',
  hora_hospital: '15:20',
  hora_base: '15:45',
  motivo_atencion: 'enfermedad',
  calle: 'Av. Reforma',
  colonia: 'Centro',
  delegacion_municipio: 'Ensenada',
  lugar_ocurrencia: 'hogar',
  numero_ambulancia: '12',
  operador: 'Juan Pérez',
  prestadores_servicio: 'María López, Carlos García',
  nombre_paciente: 'Pedro González Martínez',
  nombre_acompanante: 'Ana González',
  sexo: 'masculino',
  edad_anos: '45',
  edad_meses: '',
  domicilio: 'Calle 5 No. 123',
  colonia_paciente: 'Zona Centro',
  delegacion_paciente: 'Ensenada',
  telefono: '646-123-4567',
  derechohabiente: 'IMSS',
  origen_probable: ['cardiovascular', 'respiratorio'],
  nivel_conciencia: 'consciente',
  via_aerea: 'permeable',
  reflejo_deglucion: 'presente',
  ventilacion: 'automatismo_regular',
  auscultacion: 'normales',
  pulso_presente: 'radial',
  calidad_pulso: 'ritmico',
  piel: 'normal',
  exploracion_fisica: ['contusiones', 'dolor'],
  vitales: [
    { hora: '14:50', fr: '18', fc: '80', tas: '120', tad: '80', sao2: '98', temp: '36.5', glucosa: '100' }
  ],
  observaciones: 'Paciente estable, consciente y orientado. Se traslada para evaluación médica.',
  alergias: 'Ninguna conocida',
  medicamentos: 'Losartán 50mg',
  enfermedades_previas: 'Hipertensión',
  ultima_comida: '13:00',
  glasgow_total: '15',
  asimetria_facial: 'no',
  paresia_brazos: 'no',
  alteracion_lenguaje: 'no'
};

export default function TestPDFPage() {
  return <PrintableFRAP data={testData} />;
}
