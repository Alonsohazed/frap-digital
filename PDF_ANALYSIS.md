# ANÁLISIS COMPLETO DEL PDF FRAP - ESTRUCTURA JERÁRQUICA

## 1. ESTRUCTURA GENERAL

### Documento
- 2 páginas
- Tamaño: Letter (215.9mm x 279.4mm)
- Orientación: Portrait (Vertical)
- Márgenes: ~15-20mm todos los lados

---

## 2. SISTEMA TIPOGRÁFICO

### Familia de fuente
- Sans-serif (probablemente Helvetica o Arial)

### Tamaños extraídos
- **Headers principales** (secciones verdes): 11-12pt, bold
- **Sub-headers**: 8-9pt, bold
- **Labels de campos**: 7-8pt, bold
- **Texto normal/valores**: 7-8pt, normal
- **Headers mini** (columnas pequeñas): 5-6pt, bold
- **Texto muy pequeño** (notas, pie): 4-5pt, normal

### Pesos
- Bold: Headers, labels, títulos
- Normal: Valores, contenido, opciones

---

## 3. SISTEMA DE COLORES (HEX EXACTOS)

- **Verde (headers)**: #008000 / RGB(0, 128, 0)
- **Negro (texto)**: #000000
- **Blanco (fondo, texto en verde)**: #FFFFFF
- **Rojo (zonas marcadas)**: #FF0000 / RGB(255, 0, 0)
- **Rojo oscuro (puntos)**: #8B0000 / RGB(139, 0, 0)
- **Gris claro (líneas)**: #C8C8C8 / RGB(200, 200, 200)
- **Amarillo (prioridad)**: #FFC107 / RGB(255, 193, 7)
- **Verde oscuro (prioridad)**: #28A745 / RGB(40, 167, 69)
- **Negro (prioridad)**: #212121 / RGB(33, 33, 33)

---

## 4. SISTEMA DE ESPACIADO

### Márgenes y padding
- Margen exterior: 15-20mm
- Padding interno de secciones: 2-3mm
- Espacio entre secciones: 8-12mm (0.8-1.2cm)
- Espacio entre campos: 3-5mm
- Espacio entre filas de checkboxes: 4mm
- Altura de headers: 6mm
- Espacio después de headers: 2mm

### Elementos
- Checkboxes: 4mm x 4mm
- Espacio checkbox-label: 1-2mm
- Alto de fila de input: 5mm
- Alto de fila de tabla: 5mm

---

## 5. GRID/LAYOUT

### Página 1
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER COMPLETO (verde) - Logo, Org, Fecha/Folio           │
├─────────────────────────────────────────────────────────────┤
│ TIEMPOS (6 columnas iguales, full width)                   │
├───────────────────────────────┬─────────────────────────────┤
│ COLUMNA IZQUIERDA (95mm)      │ COLUMNA DERECHA (80mm)      │
│                               │                             │
│ • Motivo atención             │ • Nivel conciencia          │
│ • Ubicación servicio          │ • Vía aérea / Reflejo       │
│ • Nombre paciente             │ • Ventilación               │
│ • Datos demográficos          │ • Auscultación              │
│ • Origen probable             │ • Neumotórax                │
│ • Accidente automovilístico   │ • Circulación               │
│ • Agente causal               │ • Calidad / Piel            │
│ • Lesiones causadas por       │ • Exploración física        │
│                               │ • Zonas lesión + Pupilas    │
│                               │ • Signos vitales            │
│                               │ • Condición / Prioridad     │
│                               │ • Manejo (4 columnas)       │
│                               │ • Control hemorragias (4 col)│
└───────────────────────────────┴─────────────────────────────┘
```

### Proporción de columnas Página 1
- Columna izquierda: ~52% del ancho (95mm de 180mm)
- Columna derecha: ~43% del ancho (80mm de 180mm)
- Gap entre columnas: ~5% (5mm)

### Página 2
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER PEQUEÑO (verde) - Solo nombre org                   │
├───────────────────────────────┬─────────────────────────────┤
│ COLUMNA IZQUIERDA (95mm)      │ COLUMNA DERECHA (80mm)      │
│                               │                             │
│ • Datos de la madre           │ • Interrogatorio            │
│ • Datos post-parto            │ • Observaciones             │
│                               │ • Autoridades               │
│                               │ • Escala Glasgow            │
│                               │ • Escala Cincinnati         │
│                               │ • Escala trauma             │
│                               │ • Datos recién nacido       │
├───────────────────────────────┴─────────────────────────────┤
│ FOOTER (full width, 2 columnas)                            │
│ ┌─────────────────────┬─────────────────────┐              │
│ │ NEGATIVA            │ CONSENTIMIENTO      │              │
│ │ • Firma paciente    │ • Firma paciente    │              │
│ │ • Firma testigo     │ • Firma familiar    │              │
│ └─────────────────────┴─────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. JERARQUÍA DE SECCIONES - PÁGINA 1

### NIVEL 1: Header Organización (verde, full width)
- Logo/Nombre: "CUERPO DE RESCATE DE ENSENADA, A.C."
- Dirección, teléfonos
- Fecha y Folio (caja blanca lado derecho)

### NIVEL 2: Tiempos (verde, 6 columnas, full width)
- 6 columnas iguales: Hora Llamada, Salida, Llegada, Traslado, Hospital, Base

### NIVEL 3A: Columna Izquierda

#### Motivo de la Atención (verde)
- 4 checkboxes horizontales

#### Ubicación del Servicio (verde)
- Calle, Entre, Colonia, Delegación
- Lugar de ocurrencia (7 checkboxes en 2 filas)
- Número ambulancia, Operador, Prestadores

#### Nombre del Paciente (verde)
- Nombre completo
- Nombre acompañante, Sexo, Edad
- Domicilio, Colonia, Delegación, Teléfono
- Ocupación, Derechohabiente, Compañía seguros

#### Origen Probable (verde)
- 12 checkboxes en 4 filas de 3
- Especifique (input), 1A VEZ/SUBSECUENTE

#### Accidente Automovilístico (verde)
- Tipo: Colisión, Volcadura
- Vehículo: 4 checkboxes
- Contra objeto, Impacto
- Detalles: Hundimiento, Parabrisas, Volante, Bolsa aire
- Cinturón, Dentro vehículo, Atropellado, Casco

#### Agente Causal (verde)
- 13 checkboxes en 5 filas
- Especifique, Lesiones causadas por

### NIVEL 3B: Columna Derecha

#### Nivel de Conciencia (verde)
- 4 checkboxes verticales

#### Vía Aérea / Reflejo de Deglución (verde, 2 columnas)
- Vía aérea: 2 opciones
- Reflejo: 2 opciones

#### Ventilación (verde)
- 5 checkboxes verticales

#### Auscultación (verde)
- 3 checkboxes verticales
- Neumotórax: lado + sitio

#### Circulación (verde)
- 3 checkboxes verticales

#### Calidad / Piel (verde, 2 columnas)
- Calidad: 4 opciones
- Piel: 4 opciones
- Características: input

#### Exploración Física (verde)
- 15 checkboxes numerados en 2 columnas

#### Zonas de Lesión + Pupilas
- Diagrama cuerpo humano (30mm x 50mm aprox)
- Pupilas al lado derecho (2 círculos)

#### Signos Vitales (verde)
- Tabla: 8 columnas x 4 filas (header + 3 registros)

#### Condición / Prioridad (verde, 2 columnas)
- Condición: 3 checkboxes
- Prioridad: 4 botones color (Rojo, Amarillo, Verde, Negro)

#### Manejo (verde, 4 columnas estrechas)
- Vía Aérea, Control Cervical, Asist. Ventilatoria, Oxigenoterapia
- 3-4 filas de checkboxes c/u

#### Control Hemorragias (verde, 4 columnas estrechas)
- Control, Vías Venosas, Sitio, Tipo Soluciones
- 4-5 filas de checkboxes

---

## 7. JERARQUÍA DE SECCIONES - PÁGINA 2

### NIVEL 1: Header pequeño (verde, full width)
- Solo nombre organización

### NIVEL 2A: Columna Izquierda

#### Datos de la Madre (verde)
- Gesta, Cesáreas, Para, Abortos
- FUM, Semanas gestación, Fecha probable parto
- Hora contracciones, Frecuencia, Duración

#### Datos Post-Parto (verde)
- Hora nacimiento, Lugar
- Placenta expulsada

### NIVEL 2B: Columna Derecha

#### Interrogatorio (verde)
- 5 campos: Alergias, Medicamentos, Enfermedades, Última comida, Eventos previos

#### Observaciones (verde)
- Caja grande de texto (15mm alto)

#### Autoridades que Intervinieron (verde)
- Entrega Paciente: línea + firma
- Médico que Recibe: línea + firma

#### Escala de Glasgow (verde)
- 3 sub-secciones:
  - Apertura ocular (4 opciones)
  - Respuesta verbal (5 opciones)
  - Respuesta motora (6 opciones)
- Total: caja de puntaje

#### Escala Prehospitalaria de Cincinnati (verde)
- 3 items con SÍ/NO

#### Escala de Trauma (verde)
- Tabla: 5 columnas x 6 filas
- Puntaje total

#### Datos Recién Nacido (verde, 2 columnas)
- Producto, Sexo, APGAR (1, 5, 10 min)
- Destino: 3 opciones

### NIVEL 3: Footer (full width, 2 columnas)

#### Negativa (izquierda)
- Header verde
- 2 cajas de firma (Paciente, Testigo)

#### Consentimiento (derecha)
- Header verde
- 2 cajas de firma (Paciente, Familiar/Tutor)

---

## 8. ELEMENTOS REPETIDOS - PATRONES

### Patrón: Header de Sección
- Rectángulo verde (#008000), 6mm alto
- Texto blanco, 9pt bold, padding izq 2mm
- Ancho: variable (columna o full width)

### Patrón: Checkbox + Label
- Cuadrado 4mm x 4mm, borde negro 0.3pt
- Label: 7pt normal, 1-2mm a la derecha
- Si checked: marca "✓" centrada

### Patrón: Campo Input
- Label: 7pt bold
- Línea: 0.2pt negro
- Valor: 7pt normal encima de línea

### Patrón: Tabla
- Headers: fondo verde, texto blanco 6pt bold
- Celdas: borde negro 0.3pt, padding 1mm
- Texto: 6-7pt normal, centrado

### Patrón: Sub-header de 2 columnas
- 2 rectángulos verdes lado a lado
- Separación: 1-2mm
- Altura: 6mm
- Texto: blanco, 8pt bold

### Patrón: Caja de Firma
- Rectángulo con borde negro 0.3pt
- Label arriba: 6pt bold
- Línea para firma
- Altura: 15mm

---

## 9. PROPORCIONES EXACTAS

### Ancho de página útil (sin márgenes)
- Total: 180mm (aprox)
- Columna 1: 95mm (52.8%)
- Gap: 5mm (2.8%)
- Columna 2: 80mm (44.4%)

### Alto de secciones clave
- Header org página 1: 12mm
- Header org página 2: 8mm
- Fila de tiempos: 13mm (header 6mm + valores 6mm + espacio)
- Diagrama cuerpo: 50mm
- Pupilas: 15mm
- Tabla vitales: 25mm (header + 3 filas)
- Footer firmas: 40-45mm

---

## 10. ORDEN DE RENDERIZADO (Z-INDEX IMPLÍCITO)

1. Fondo blanco (base)
2. Rectángulos verdes (headers)
3. Bordes/líneas (tablas, cajas)
4. Texto blanco (sobre verde)
5. Texto negro (sobre blanco)
6. Checkboxes vacías
7. Marcas de check
8. Imágenes de firmas (si existen)
9. Marcas rojas de zonas de lesión

---

Este análisis documenta TODA la estructura del PDF original para replicación exacta.
