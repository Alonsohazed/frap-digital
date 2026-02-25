import React from 'react';

const Page1 = ({ data }) => {
  const styles = {
    page: {
      width: '808px',
      height: '1048px',
      position: 'relative',
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '10px',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
    // Header verde
    header: {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '808px',
      height: '65px',
      backgroundColor: '#008000',
      padding: '8px 15px',
    },
    headerTitle: {
      color: 'white',
      fontSize: '18px',
      fontWeight: 'bold',
      margin: '0 0 3px 0',
    },
    headerSubtext: {
      color: 'white',
      fontSize: '9px',
      margin: '2px 0',
    },
    folioBox: {
      position: 'absolute',
      top: '10px',
      right: '15px',
      width: '180px',
      height: '45px',
      backgroundColor: 'white',
      border: '2px solid #008000',
      padding: '5px 10px',
    },
    folioLabel: {
      fontSize: '10px',
      fontWeight: 'bold',
      color: 'black',
    },
    folioValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#008000',
    },
    // Fila de tiempos
    timeRow: {
      position: 'absolute',
      top: '65px',
      left: '0px',
      width: '808px',
      height: '35px',
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
    },
    timeHeader: {
      backgroundColor: '#008000',
      color: 'white',
      fontSize: '8px',
      fontWeight: 'bold',
      padding: '5px',
      textAlign: 'center',
      borderRight: '1px solid white',
    },
    timeValue: {
      border: '1px solid #000',
      padding: '5px',
      textAlign: 'center',
      fontSize: '9px',
      backgroundColor: 'white',
    },
    // Secciones con título verde
    sectionHeader: {
      backgroundColor: '#008000',
      color: 'white',
      fontSize: '9px',
      fontWeight: 'bold',
      padding: '6px 8px',
      height: '22px',
      boxSizing: 'border-box',
    },
    // Checkbox
    checkbox: {
      width: '12px',
      height: '12px',
      border: '1px solid #000',
      display: 'inline-block',
      marginRight: '6px',
      position: 'relative',
      top: '2px',
    },
    checkboxChecked: {
      width: '12px',
      height: '12px',
      border: '1px solid #000',
      display: 'inline-block',
      marginRight: '6px',
      position: 'relative',
      top: '2px',
      backgroundColor: '#000',
    },
    label: {
      fontSize: '8px',
      fontWeight: 'bold',
    },
    value: {
      fontSize: '9px',
    },
    underline: {
      borderBottom: '1px solid #000',
      display: 'inline-block',
      minWidth: '80px',
    },
  };

  const Checkbox = ({ checked, label }) => (
    <span style={{ marginRight: '15px', whiteSpace: 'nowrap' }}>
      <span style={checked ? styles.checkboxChecked : styles.checkbox}>
        {checked && <span style={{ color: 'white', fontSize: '10px', position: 'relative', top: '-2px', left: '1px' }}>✓</span>}
      </span>
      <span style={{ fontSize: '8px' }}>{label}</span>
    </span>
  );

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>CUERPO DE RESCATE DE ENSENADA, A.C.</h1>
        <p style={styles.headerSubtext}>Calle Magnolias No. 2356</p>
        <p style={styles.headerSubtext}>Col. Márquez de León, Ensenada, B.C.</p>
        <p style={styles.headerSubtext}>Tels. 176-8033 y 177-9992</p>
        
        <div style={styles.folioBox}>
          <div><span style={styles.folioLabel}>FECHA:</span> <span style={{ fontSize: '9px' }}>{data.fecha || ''}</span></div>
          <div style={{ marginTop: '3px' }}>
            <span style={styles.folioLabel}># FOLIO:</span> 
            <span style={styles.folioValue}> {data.folio || ''}</span>
          </div>
        </div>
      </div>

      {/* TIEMPOS */}
      <div style={styles.timeRow}>
        <div>
          <div style={styles.timeHeader}>HORA LLAMADA</div>
          <div style={styles.timeValue}>{data.hora_llamada || ''}</div>
        </div>
        <div>
          <div style={styles.timeHeader}>HORA SALIDA</div>
          <div style={styles.timeValue}>{data.hora_salida || ''}</div>
        </div>
        <div>
          <div style={styles.timeHeader}>HORA LLEGADA</div>
          <div style={styles.timeValue}>{data.hora_llegada || ''}</div>
        </div>
        <div>
          <div style={styles.timeHeader}>HORA TRASLADO</div>
          <div style={styles.timeValue}>{data.hora_traslado || ''}</div>
        </div>
        <div>
          <div style={styles.timeHeader}>HORA HOSPITAL</div>
          <div style={styles.timeValue}>{data.hora_hospital || ''}</div>
        </div>
        <div>
          <div style={{ ...styles.timeHeader, borderRight: 'none' }}>HORA BASE</div>
          <div style={styles.timeValue}>{data.hora_base || ''}</div>
        </div>
      </div>

      {/* COLUMNA IZQUIERDA */}
      <div style={{ position: 'absolute', top: '115px', left: '15px', width: '370px' }}>
        {/* MOTIVO DE LA ATENCIÓN */}
        <div style={styles.sectionHeader}>MOTIVO DE LA ATENCIÓN</div>
        <div style={{ padding: '8px', backgroundColor: 'white', border: '1px solid #ddd', borderTop: 'none' }}>
          <Checkbox checked={data.motivo_atencion === 'traslado_programado'} label="TRASLADO PROGRAMADO" />
          <Checkbox checked={data.motivo_atencion === 'enfermedad'} label="ENFERMEDAD" />
          <br />
          <Checkbox checked={data.motivo_atencion === 'traumatismo'} label="TRAUMATISMO" />
          <Checkbox checked={data.motivo_atencion === 'gineco_obstetrico'} label="GINECOBSTÉTRICO" />
        </div>

        {/* UBICACIÓN DEL SERVICIO */}
        <div style={{ marginTop: '8px' }}>
          <div style={styles.sectionHeader}>UBICACIÓN DEL SERVICIO</div>
          <div style={{ padding: '8px', backgroundColor: 'white', border: '1px solid #ddd', borderTop: 'none', fontSize: '8px' }}>
            <div style={{ marginBottom: '6px' }}>
              <span style={styles.label}>CALLE:</span>
              <span style={{ ...styles.underline, width: '280px', marginLeft: '5px' }}>{data.calle || ''}</span>
            </div>
            <div style={{ marginBottom: '6px' }}>
              <span style={styles.label}>ENTRE:</span>
              <span style={{ ...styles.underline, width: '270px', marginLeft: '5px' }}></span>
            </div>
            <div style={{ marginBottom: '6px' }}>
              <span style={styles.label}>COLONIA/COMUNIDAD:</span>
              <span style={{ ...styles.underline, width: '180px', marginLeft: '5px' }}>{data.colonia || ''}</span>
            </div>
            <div style={{ marginBottom: '6px' }}>
              <span style={styles.label}>DELEGACIÓN POLÍTICA/MUNICIPIO:</span>
              <span style={{ ...styles.underline, width: '120px', marginLeft: '5px' }}>{data.delegacion_municipio || ''}</span>
            </div>
            <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>LUGAR DE OCURRENCIA:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <Checkbox checked={data.lugar_ocurrencia === 'hogar'} label="HOGAR" />
              <Checkbox checked={data.lugar_ocurrencia === 'via_publica'} label="VÍA PÚBLICA" />
              <Checkbox checked={data.lugar_ocurrencia === 'trabajo'} label="TRABAJO" />
              <Checkbox checked={data.lugar_ocurrencia === 'escuela'} label="ESCUELA" />
              <Checkbox checked={data.lugar_ocurrencia === 'recreacion'} label="RECREACIÓN Y DEPORTE" />
              <Checkbox checked={data.lugar_ocurrencia === 'transporte'} label="TRANSPORTE PÚBLICO" />
              <Checkbox checked={data.lugar_ocurrencia === 'otro'} label="OTRA" />
            </div>
            <div style={{ marginTop: '8px', marginBottom: '4px' }}>
              <span style={styles.label}>NÚMERO DE AMBULANCIA:</span>
              <span style={{ ...styles.underline, width: '160px', marginLeft: '5px' }}>{data.numero_ambulancia || ''}</span>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <span style={styles.label}>OPERADOR:</span>
              <span style={{ ...styles.underline, width: '260px', marginLeft: '5px' }}>{data.operador || ''}</span>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <span style={styles.label}>PRESTADORES DEL SERVICIO:</span>
              <span style={{ ...styles.underline, width: '160px', marginLeft: '5px' }}>{data.prestadores_servicio || ''}</span>
            </div>
          </div>
        </div>

        {/* Continúa resto de secciones... Por brevedad, solo muestro la estructura */}
        {/* NOMBRE DEL PACIENTE, ORIGEN PROBABLE, etc. */}
      </div>

      {/* COLUMNA DERECHA */}
      <div style={{ position: 'absolute', top: '115px', right: '15px', width: '370px' }}>
        {/* NIVEL DE CONCIENCIA */}
        <div style={styles.sectionHeader}>NIVEL DE CONCIENCIA</div>
        <div style={{ padding: '8px', backgroundColor: 'white', border: '1px solid #ddd', borderTop: 'none' }}>
          <Checkbox checked={data.nivel_conciencia === 'consciente'} label="CONSCIENTE" />
          <br />
          <Checkbox checked={data.nivel_conciencia === 'verbal'} label="RESPUESTA A ESTÍMULO VERBAL" />
          <br />
          <Checkbox checked={data.nivel_conciencia === 'doloroso'} label="RESPUESTA A ESTÍMULO DOLOROSO" />
          <br />
          <Checkbox checked={data.nivel_conciencia === 'inconsciente'} label="INCONSCIENTE" />
        </div>

        {/* Continúa resto de columna derecha... */}
      </div>
    </div>
  );
};

export default Page1;
