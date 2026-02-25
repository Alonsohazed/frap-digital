import React from 'react';

const Page2 = ({ data }) => {
  const Checkbox = ({ checked, label, style = {} }) => (
    <span style={{ display: 'inline-block', marginRight: '10px', whiteSpace: 'nowrap', ...style }}>
      <span style={{
        display: 'inline-block',
        width: '11px',
        height: '11px',
        border: '1.5px solid #333',
        borderRadius: '2px',
        marginRight: '5px',
        verticalAlign: 'middle',
        position: 'relative',
        backgroundColor: checked ? '#008000' : 'white',
        transition: 'all 0.2s ease'
      }}>
        {checked && <span style={{ 
          color: 'white', 
          fontSize: '8px', 
          position: 'absolute',
          top: '-2px',
          left: '1px',
          fontWeight: 'bold'
        }}>✓</span>}
      </span>
      <span style={{ fontSize: '7px' }}>{label}</span>
    </span>
  );

  const Label = ({ children, style = {} }) => (
    <span style={{ fontSize: '7px', fontWeight: 'bold', ...style }}>{children}</span>
  );

  const Underline = ({ children, width = '100px', style = {} }) => (
    <span style={{ 
      borderBottom: '0.5px solid #666', 
      display: 'inline-block', 
      minWidth: width,
      fontSize: '8px',
      ...style 
    }}>{children || ''}</span>
  );

  const sectionHeaderStyle = {
    background: 'linear-gradient(135deg, #006400 0%, #008000 100%)',
    color: 'white',
    fontSize: '8px',
    fontWeight: 'bold',
    padding: '5px 8px',
    height: '18px',
    borderRadius: '4px 4px 0 0'
  };

  const sectionBodyStyle = {
    padding: '8px',
    border: '1px solid #e0e0e0',
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    backgroundColor: '#fafafa'
  };

  return (
    <div style={{
      width: '808px',
      height: '1180px',
      position: 'relative',
      backgroundColor: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      borderRadius: '4px',
      marginTop: '20px',
      pageBreakBefore: 'always'
    }}>
      
      {/* ==================== HEADER PEQUEÑO ==================== */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '808px',
        height: '40px',
        background: 'linear-gradient(135deg, #006400 0%, #008000 100%)',
        padding: '10px 15px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,128,0,0.2)'
      }}>
        <div style={{ color: 'white', fontSize: '14px', fontWeight: '700', letterSpacing: '0.3px' }}>
          CUERPO DE RESCATE DE ENSENADA, A.C.
        </div>
      </div>

      {/* ==================== COLUMNA IZQUIERDA ==================== */}
      <div style={{ position: 'absolute', top: '50px', left: '15px', width: '380px' }}>
        
        {/* DATOS DE LA MADRE */}
        <div style={{ marginBottom: '6px' }}>
          <div style={sectionHeaderStyle}>
            DATOS DE LA MADRE
          </div>
          <div style={sectionBodyStyle}>
            <div style={{ marginBottom: '4px' }}>
              <Label>GESTA:</Label>
              <input type="text" readOnly style={{ width: '35px', border: '1px solid #000', textAlign: 'center', fontSize: '8px', marginLeft: '5px', marginRight: '15px' }} />
              <Label>CESÁREAS:</Label>
              <input type="text" readOnly style={{ width: '35px', border: '1px solid #000', textAlign: 'center', fontSize: '8px', marginLeft: '5px', marginRight: '15px' }} />
              <Label>PARA:</Label>
              <input type="text" readOnly style={{ width: '35px', border: '1px solid #000', textAlign: 'center', fontSize: '8px', marginLeft: '5px' }} />
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Label>ABORTOS:</Label>
              <input type="text" readOnly style={{ width: '35px', border: '1px solid #000', textAlign: 'center', fontSize: '8px', marginLeft: '5px' }} />
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Label>FUM:</Label> <Underline width="80px" style={{ marginLeft: '5px' }}></Underline>
              <span style={{ marginLeft: '15px' }}><Label>SEMANAS DE GESTACIÓN:</Label></span>
              <input type="text" readOnly style={{ width: '35px', border: '1px solid #000', textAlign: 'center', fontSize: '8px', marginLeft: '5px' }} />
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Label>FECHA PROBABLE DE PARTO:</Label> <Underline width="100px" style={{ marginLeft: '5px' }}></Underline>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Label>HORA INICIO CONTRACCIONES:</Label> <Underline width="85px" style={{ marginLeft: '5px' }}></Underline>
            </div>
            <div>
              <Label>FRECUENCIA:</Label> <Underline width="80px" style={{ marginLeft: '5px' }}></Underline>
              <span style={{ marginLeft: '10px' }}><Label>DURACIÓN:</Label></span>
              <Underline width="85px" style={{ marginLeft: '5px' }}></Underline>
            </div>
          </div>
        </div>

        {/* DATOS POST-PARTO */}
        <div style={{ marginBottom: '6px' }}>
          <div style={sectionHeaderStyle}>
            DATOS POST-PARTO
          </div>
          <div style={sectionBodyStyle}>
            <div style={{ marginBottom: '4px' }}>
              <Label>HORA DE NACIMIENTO:</Label> <Underline width="80px" style={{ marginLeft: '5px' }}></Underline>
              <span style={{ marginLeft: '10px' }}><Label>LUGAR:</Label></span>
              <Underline width="65px" style={{ marginLeft: '5px' }}></Underline>
            </div>
            <div>
              <Label>PLACENTA EXPULSADA:</Label>
              <Checkbox checked={data.postparto_placenta === 'si'} label="SÍ" style={{ marginLeft: '5px' }} />
              <Checkbox checked={data.postparto_placenta === 'no'} label="NO" />
            </div>
          </div>
        </div>
      </div>

      {/* ==================== COLUMNA DERECHA ==================== */}
      <div style={{ position: 'absolute', top: '50px', right: '15px', width: '380px' }}>
        
        {/* INTERROGATORIO */}
        <div style={{ marginBottom: '6px' }}>
          <div style={sectionHeaderStyle}>
            INTERROGATORIO
          </div>
          <div style={sectionBodyStyle}>
            <div style={{ marginBottom: '4px' }}>
              <Label>ALERGIAS:</Label> <Underline width="300px" style={{ marginLeft: '5px' }}>{data.alergias}</Underline>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Label>MEDICAMENTOS QUE ESTÁ INGIRIENDO:</Label> <Underline width="185px" style={{ marginLeft: '5px' }}>{data.medicamentos}</Underline>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Label>ENFERMEDADES Y CIRUGÍAS PREVIAS:</Label> <Underline width="185px" style={{ marginLeft: '5px' }}>{data.enfermedades_previas}</Underline>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Label>HORA DE LA ÚLTIMA COMIDA:</Label> <Underline width="200px" style={{ marginLeft: '5px' }}>{data.ultima_comida}</Underline>
            </div>
            <div>
              <Label>EVENTOS PREVIOS RELACIONADOS:</Label> <Underline width="175px" style={{ marginLeft: '5px' }}></Underline>
            </div>
          </div>
        </div>

        {/* OBSERVACIONES */}
        <div style={{ marginBottom: '6px' }}>
          <div style={sectionHeaderStyle}>
            OBSERVACIONES
          </div>
          <div style={{ 
            ...sectionBodyStyle,
            height: '55px', 
            fontSize: '8px',
            overflow: 'auto'
          }}>
            {data.observaciones || ''}
          </div>
        </div>

        {/* AUTORIDADES QUE INTERVINIERON */}
        <div style={{ marginBottom: '6px' }}>
          <div style={sectionHeaderStyle}>
            AUTORIDADES QUE INTERVINIERON
          </div>
          <div style={sectionBodyStyle}>
            <div style={{ marginBottom: '4px' }}>
              <Label>ENTREGA PACIENTE:</Label> <Underline width="220px" style={{ marginLeft: '5px' }}></Underline>
              <div style={{ fontSize: '5px', textAlign: 'right' }}>NOMBRE Y FIRMA</div>
            </div>
            <div>
              <Label>MÉDICO QUE RECIBE:</Label> <Underline width="210px" style={{ marginLeft: '5px' }}></Underline>
              <div style={{ fontSize: '5px', textAlign: 'right' }}>NOMBRE Y FIRMA</div>
            </div>
          </div>
        </div>

        {/* ESCALA DE GLASGOW */}
        <div style={{ marginBottom: '6px' }}>
          <div style={sectionHeaderStyle}>
            ESCALA DE GLASGOW
          </div>
          <div style={{ ...sectionBodyStyle, fontSize: '6px', lineHeight: '1.3' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>APERTURA OCULAR</div>
            <Checkbox checked={data.glasgow_apertura === '4'} label="4. ESPONTÁNEA" />
            <div><Checkbox checked={data.glasgow_apertura === '3'} label="3. A LA VOZ" /></div>
            <div><Checkbox checked={data.glasgow_apertura === '2'} label="2. AL DOLOR" /></div>
            <div style={{ marginBottom: '3px' }}><Checkbox checked={data.glasgow_apertura === '1'} label="1. NINGUNA" /></div>
            
            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>MEJOR RESPUESTA VERBAL</div>
            <Checkbox checked={data.glasgow_verbal === '5'} label="5. ORIENTADO" />
            <div><Checkbox checked={data.glasgow_verbal === '4'} label="4. CONFUSO" /></div>
            <div><Checkbox checked={data.glasgow_verbal === '3'} label="3. PALABRAS INAPROPIADAS" /></div>
            <div><Checkbox checked={data.glasgow_verbal === '2'} label="2. SONIDOS INCOMPRENSIBLES" /></div>
            <div style={{ marginBottom: '3px' }}><Checkbox checked={data.glasgow_verbal === '1'} label="1. NINGUNA" /></div>
            
            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>MEJOR RESPUESTA MOTORA</div>
            <Checkbox checked={data.glasgow_motora === '6'} label="6. OBEDECE ÓRDENES" />
            <div><Checkbox checked={data.glasgow_motora === '5'} label="5. LOCALIZA DOLOR" /></div>
            <div><Checkbox checked={data.glasgow_motora === '4'} label="4. RETIRA AL DOLOR" /></div>
            <div><Checkbox checked={data.glasgow_motora === '3'} label="3. FLEXIÓN ANORMAL" /></div>
            <div><Checkbox checked={data.glasgow_motora === '2'} label="2. EXTENSIÓN ANORMAL" /></div>
            <div style={{ marginBottom: '3px' }}><Checkbox checked={data.glasgow_motora === '1'} label="1. NINGUNA" /></div>
            
            <div style={{ fontSize: '7px', fontWeight: 'bold' }}>
              <Label>ESCALA DE GLASGOW:</Label>
              <input 
                type="text" 
                value={data.glasgow_total || ''} 
                readOnly 
                style={{ 
                  width: '30px', 
                  border: '1px solid #000', 
                  textAlign: 'center', 
                  fontSize: '8px', 
                  marginLeft: '5px' 
                }} 
              />
            </div>
          </div>
        </div>

        {/* ESCALA PREHOSPITALARIA DE CINCINNATI */}
        <div style={{ marginBottom: '6px' }}>
          <div style={sectionHeaderStyle}>
            ESCALA PREHOSPITALARIA DE CINCINNATI
          </div>
          <div style={{ ...sectionBodyStyle, fontSize: '7px', lineHeight: '1.5' }}>
            <div>
              <Label>ASIMETRÍA FACIAL</Label>
              <Checkbox checked={data.asimetria_facial === 'si'} label="SÍ" style={{ marginLeft: '30px' }} />
              <Checkbox checked={data.asimetria_facial === 'no'} label="NO" />
            </div>
            <div>
              <Label>PARESIA DE LOS BRAZOS</Label>
              <Checkbox checked={data.paresia_brazos === 'si'} label="SÍ" style={{ marginLeft: '8px' }} />
              <Checkbox checked={data.paresia_brazos === 'no'} label="NO" />
            </div>
            <div>
              <Label>ALTERACIÓN DEL LENGUAJE</Label>
              <Checkbox checked={data.alteracion_lenguaje === 'si'} label="SÍ" style={{ marginLeft: '5px' }} />
              <Checkbox checked={data.alteracion_lenguaje === 'no'} label="NO" />
            </div>
          </div>
        </div>

        {/* ESCALA DE TRAUMA */}
        <div style={{ marginBottom: '6px' }}>
          <div style={sectionHeaderStyle}>
            ESCALA DE TRAUMA
          </div>
          <div style={{ ...sectionBodyStyle, padding: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6px' }}>
              <thead>
                <tr style={{ backgroundColor: '#008000', color: 'white' }}>
                  <th style={{ border: '1px solid #fff', padding: '3px' }}>(A)GCS</th>
                  <th style={{ border: '1px solid #fff', padding: '3px' }}>(B)PAS</th>
                  <th style={{ border: '1px solid #fff', padding: '3px' }}>(C)FR</th>
                  <th style={{ border: '1px solid #fff', padding: '3px' }}>(D) Esfuerzo Respiratorio</th>
                  <th style={{ border: '1px solid #fff', padding: '3px' }}>Puntuación</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>14-15</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>90 +</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>10-24</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>normal</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>5</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>11-13</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>90 +</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>10-24</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>normal</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>4</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>8-10</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>70-89</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>25-35</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>retrasado</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>3</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>5-7</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>50-69</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>&gt;35</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>detenido</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>2</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>3-4</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>0-49</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>0-49</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>ausente</td>
                  <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>0</td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: '4px', fontSize: '7px', textAlign: 'right' }}>
              <Label>Puntuación Total:</Label> <span style={{ marginLeft: '5px' }}>A+B+C+D+E</span>
            </div>
          </div>
        </div>

        {/* DATOS RECIÉN NACIDO / DESTINO */}
        <div style={{ marginBottom: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <div>
            <div style={{
              ...sectionHeaderStyle,
              fontSize: '7px'
            }}>
              DATOS RECIÉN NACIDO
            </div>
            <div style={{ ...sectionBodyStyle, fontSize: '7px', lineHeight: '1.5' }}>
              <div>
                <Label>PRODUCTO:</Label>
                <Checkbox checked={data.recien_nacido_producto === 'vivo'} label="VIVO" style={{ marginLeft: '5px' }} />
              </div>
              <div style={{ marginTop: '2px' }}>
                <Checkbox checked={data.recien_nacido_producto === 'muerto'} label="MUERTO" />
              </div>
              <div style={{ marginTop: '2px' }}>
                <Label>SEXO:</Label>
                <Checkbox checked={data.recien_nacido_sexo === 'masculino'} label="MASC" style={{ marginLeft: '5px' }} />
                <Checkbox checked={data.recien_nacido_sexo === 'femenino'} label="FEM" />
              </div>
            </div>
          </div>
          <div>
            <div style={{
              ...sectionHeaderStyle,
              fontSize: '7px'
            }}>
              DESTINO
            </div>
            <div style={{ ...sectionBodyStyle, fontSize: '7px', lineHeight: '1.5' }}>
              <Checkbox checked={data.recien_nacido_destino === 'trasladado'} label="TRASLADADO" />
              <div><Checkbox checked={data.recien_nacido_destino === 'no_trasladado'} label="NO TRASLADADO" /></div>
              <div><Checkbox checked={data.recien_nacido_destino === 'fuga'} label="FUGA" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== FIRMAS (FOOTER) ==================== */}
      <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '778px' }}>
        {/* Títulos de secciones */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '5px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #006400 0%, #008000 100%)',
            color: 'white',
            fontSize: '7px',
            fontWeight: 'bold',
            padding: '6px 8px',
            textAlign: 'center',
            lineHeight: '1.3',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,128,0,0.2)'
          }}>
            <div>NEGATIVA A RECIBIR ATENCIÓN/</div>
            <div>SER TRASLADADO EXIMENTE DE RESPONSABILIDAD</div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #006400 0%, #008000 100%)',
            color: 'white',
            fontSize: '7px',
            fontWeight: 'bold',
            padding: '6px 8px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,128,0,0.2)'
          }}>
            CONSENTIMIENTO INFORMADO
          </div>
        </div>

        {/* Cajas de firma - Fila 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '5px' }}>
          <div style={{ 
            border: '2px solid rgba(0,128,0,0.3)', 
            padding: '10px',
            height: '50px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#fafafa',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <Label>NOMBRE/FIRMA DEL PACIENTE</Label>
            <div style={{ borderBottom: '1px solid #666', marginTop: '8px' }}></div>
          </div>
          <div style={{ 
            border: '2px solid rgba(0,128,0,0.3)', 
            padding: '10px',
            height: '50px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#fafafa',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <Label>NOMBRE/FIRMA DEL PACIENTE</Label>
            <div style={{ borderBottom: '1px solid #666', marginTop: '8px' }}></div>
          </div>
        </div>

        {/* Cajas de firma - Fila 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ 
            border: '2px solid rgba(0,128,0,0.3)', 
            padding: '10px',
            height: '50px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#fafafa',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <Label>NOMBRE/FIRMA DEL TESTIGO</Label>
            <div style={{ borderBottom: '1px solid #666', marginTop: '8px' }}></div>
          </div>
          <div style={{ 
            border: '2px solid rgba(0,128,0,0.3)', 
            padding: '10px',
            height: '50px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#fafafa',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <Label>NOMBRE/FIRMA DE FAMILIAR O TUTOR</Label>
            <div style={{ borderBottom: '1px solid #666', marginTop: '8px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page2;
