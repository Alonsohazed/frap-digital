import React from 'react';

const Page1 = ({ data }) => {
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

  const Value = ({ children, style = {} }) => (
    <span style={{ fontSize: '8px', ...style }}>{children || ''}</span>
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

  const sectionHeader = {
    background: 'linear-gradient(135deg, #006400 0%, #008000 100%)',
    color: 'white',
    fontSize: '8px',
    fontWeight: 'bold',
    padding: '5px 8px',
    height: '18px',
    borderRadius: '4px 4px 0 0'
  };

  const sectionBody = {
    padding: '8px',
    border: '1px solid #e0e0e0',
    borderTop: 'none',
    borderRadius: '0 0 4px 4px',
    backgroundColor: '#fafafa'
  };

  return (
    <div style={{
      width: '808px',
      height: '1048px',
      position: 'relative',
      backgroundColor: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      borderRadius: '4px'
    }}>
      
      {/* ==================== HEADER ==================== */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '808px',
        height: '68px',
        background: 'linear-gradient(135deg, #006400 0%, #008000 100%)',
        padding: '10px 15px',
        boxShadow: '0 2px 8px rgba(0,128,0,0.2)'
      }}>
        {/* Logo */}
        <div style={{
          position: 'absolute',
          left: '15px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '45px',
          height: '45px',
          backgroundColor: 'white',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ 
              width: '38px', 
              height: '38px',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div style="color: #008000; font-weight: bold; font-size: 20px;">CR</div>';
            }}
          />
        </div>
        
        <div style={{ marginLeft: '65px' }}>
          <div style={{ 
            color: 'white', 
            fontSize: '20px', 
            fontWeight: '700', 
            marginBottom: '3px',
            letterSpacing: '0.3px'
          }}>
            CUERPO DE RESCATE DE ENSENADA, A.C.
          </div>
          <div style={{ color: 'rgba(255,255,255,0.95)', fontSize: '9px', lineHeight: '1.4' }}>
            <div>Calle Magnolias No. 2356</div>
            <div>Col. Márquez de León, Ensenada, B.C.</div>
            <div>Tels. 176-8033 y 177-9992</div>
          </div>
        </div>
        
        {/* Fecha y Folio */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '15px',
          width: '200px',
          height: '48px',
          backgroundColor: 'white',
          border: '2px solid rgba(0,128,0,0.3)',
          borderRadius: '6px',
          padding: '6px 10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 10
        }}>
          <div style={{ marginBottom: '4px', fontSize: '7px' }}>
            <Label>FECHA:</Label> <Value style={{ marginLeft: '4px' }}>{data.fecha}</Value>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Label># FOLIO:</Label> 
            <span style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#008000', 
              marginLeft: '6px'
            }}>
              {data.folio}
            </span>
          </div>
        </div>
      </div>

      {/* ==================== TIEMPOS ==================== */}
      <div style={{
        position: 'absolute',
        top: '68px',
        left: '0',
        width: '808px',
        height: '38px',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridTemplateRows: '20px 18px'
      }}>
        {[
          { label: 'HORA LLAMADA', value: data.hora_llamada },
          { label: 'HORA SALIDA', value: data.hora_salida },
          { label: 'HORA LLEGADA', value: data.hora_llegada },
          { label: 'HORA TRASLADO', value: data.hora_traslado },
          { label: 'HORA HOSPITAL', value: data.hora_hospital },
          { label: 'HORA BASE', value: data.hora_base }
        ].map((item, i) => (
          <React.Fragment key={i}>
            <div style={{
              backgroundColor: '#008000',
              color: 'white',
              fontSize: '7px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: i < 5 ? '1px solid white' : 'none',
              padding: '2px'
            }}>
              {item.label}
            </div>
            <div style={{
              border: '1px solid #000',
              fontSize: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gridRow: 2,
              gridColumn: i + 1
            }}>
              {item.value || ''}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ==================== COLUMNA IZQUIERDA ==================== */}
      <div style={{ position: 'absolute', top: '120px', left: '15px', width: '380px' }}>
        
        {/* MOTIVO DE LA ATENCIÓN */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #006400 0%, #008000 100%)',
            color: 'white',
            fontSize: '8px',
            fontWeight: 'bold',
            padding: '5px 8px',
            height: '18px',
            borderRadius: '4px 4px 0 0'
          }}>
            MOTIVO DE LA ATENCIÓN
          </div>
          <div style={{ 
            padding: '8px', 
            border: '1px solid #e0e0e0', 
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            backgroundColor: '#fafafa'
          }}>
            <div>
              <Checkbox checked={data.motivo_atencion === 'traslado_programado'} label="TRASLADO PROGRAMADO" />
              <Checkbox checked={data.motivo_atencion === 'enfermedad'} label="ENFERMEDAD" />
            </div>
            <div style={{ marginTop: '4px' }}>
              <Checkbox checked={data.motivo_atencion === 'traumatismo'} label="TRAUMATISMO" />
              <Checkbox checked={data.motivo_atencion === 'gineco_obstetrico'} label="GINECOBSTÉTRICO" />
            </div>
          </div>
        </div>

        {/* UBICACIÓN DEL SERVICIO */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{
            backgroundColor: '#008000',
            color: 'white',
            fontSize: '8px',
            fontWeight: 'bold',
            padding: '5px 8px',
            height: '18px'
          }}>
            UBICACIÓN DEL SERVICIO
          </div>
          <div style={{ padding: '6px 8px', border: '1px solid #ccc', borderTop: 'none', fontSize: '7px' }}>
            <div style={{ marginBottom: '4px' }}>
              <Label>CALLE:</Label> <Underline width="290px">{data.calle}</Underline>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Label>ENTRE:</Label> <Underline width="285px"></Underline>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Label>COLONIA/COMUNIDAD:</Label> <Underline width="195px">{data.colonia}</Underline>
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Label>DELEGACIÓN POLÍTICA/MUNICIPIO:</Label> <Underline width="140px">{data.delegacion_municipio}</Underline>
            </div>
            <div style={{ marginBottom: '3px', fontWeight: 'bold' }}>LUGAR DE OCURRENCIA:</div>
            <div style={{ lineHeight: '1.6' }}>
              <div>
                <Checkbox checked={data.lugar_ocurrencia === 'hogar'} label="HOGAR" />
                <Checkbox checked={data.lugar_ocurrencia === 'via_publica'} label="VÍA PÚBLICA" />
              </div>
              <div>
                <Checkbox checked={data.lugar_ocurrencia === 'trabajo'} label="TRABAJO" />
                <Checkbox checked={data.lugar_ocurrencia === 'escuela'} label="ESCUELA" />
              </div>
              <div>
                <Checkbox checked={data.lugar_ocurrencia === 'recreacion'} label="RECREACIÓN Y DEPORTE" />
              </div>
              <div>
                <Checkbox checked={data.lugar_ocurrencia === 'transporte'} label="TRANSPORTE PÚBLICO" />
              </div>
              <div>
                <Checkbox checked={data.lugar_ocurrencia === 'otro'} label="OTRA" />
              </div>
            </div>
            <div style={{ marginTop: '6px', marginBottom: '3px' }}>
              <Label>NÚMERO DE AMBULANCIA:</Label> <Underline width="180px">{data.numero_ambulancia}</Underline>
            </div>
            <div style={{ marginBottom: '3px' }}>
              <Label>OPERADOR:</Label> <Underline width="275px">{data.operador}</Underline>
            </div>
            <div>
              <Label>PRESTADORES DEL SERVICIO:</Label> <Underline width="170px">{data.prestadores_servicio}</Underline>
            </div>
          </div>
        </div>

        {/* NOMBRE DEL PACIENTE */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{
            backgroundColor: '#008000',
            color: 'white',
            fontSize: '8px',
            fontWeight: 'bold',
            padding: '5px 8px',
            height: '18px'
          }}>
            NOMBRE DEL PACIENTE
          </div>
          <div style={{ padding: '6px 8px', border: '1px solid #ccc', borderTop: 'none', fontSize: '7px' }}>
            <div style={{ marginBottom: '4px', fontSize: '9px', fontWeight: 'bold' }}>
              {data.nombre_paciente}
            </div>
            <div style={{ marginBottom: '4px' }}>
              <Label>NOMBRE DEL ACOMPAÑANTE:</Label> <Underline width="170px">{data.nombre_acompanante}</Underline>
            </div>
            <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div>
                <Label>SEXO:</Label>
                <Checkbox checked={data.sexo === 'masculino'} label="M MASC." style={{ marginLeft: '5px' }} />
                <Checkbox checked={data.sexo === 'femenino'} label="FEM." />
              </div>
              <div style={{ marginLeft: '20px' }}>
                <Label>EDAD:</Label>
                <input type="text" value={data.edad_anos || ''} readOnly style={{ width: '30px', border: '1px solid #000', textAlign: 'center', fontSize: '8px', marginLeft: '5px', marginRight: '3px' }} />
                <Label>AÑOS</Label>
                <input type="text" value={data.edad_meses || ''} readOnly style={{ width: '25px', border: '1px solid #000', textAlign: 'center', fontSize: '8px', marginLeft: '8px', marginRight: '3px' }} />
                <Label>MESES</Label>
              </div>
            </div>
            <div style={{ marginBottom: '3px' }}>
              <Label>DOMICILIO:</Label> <Underline width="280px">{data.domicilio}</Underline>
            </div>
            <div style={{ marginBottom: '3px' }}>
              <Label>COLONIA/COMUNIDAD:</Label> <Underline width="200px">{data.colonia_paciente}</Underline>
            </div>
            <div style={{ marginBottom: '3px' }}>
              <Label>DELEGACIÓN POLÍTICA/MUNICIPIO:</Label> <Underline width="145px">{data.delegacion_paciente}</Underline>
            </div>
            <div style={{ marginBottom: '3px' }}>
              <Label>TELÉFONO:</Label> <Underline width="120px">{data.telefono}</Underline>
              <span style={{ marginLeft: '10px' }}><Label>OCUPACIÓN:</Label> <Underline width="70px"></Underline></span>
            </div>
            <div style={{ marginBottom: '3px' }}>
              <Label>DERECHOHABIENTE A:</Label> <Underline width="150px">{data.derechohabiente}</Underline>
              <span style={{ marginLeft: '5px', fontSize: '7px' }}>IMSS</span>
            </div>
            <div>
              <Label>COMPAÑÍA DE SEGUROS GASTOS MÉDICOS:</Label> <Underline width="110px"></Underline>
            </div>
          </div>
        </div>

        {/* ORIGEN PROBABLE */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{
            backgroundColor: '#008000',
            color: 'white',
            fontSize: '8px',
            fontWeight: 'bold',
            padding: '5px 8px',
            height: '18px'
          }}>
            ORIGEN PROBABLE
          </div>
          <div style={{ padding: '6px 8px', border: '1px solid #ccc', borderTop: 'none', fontSize: '7px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', lineHeight: '1.5' }}>
              <Checkbox checked={(data.origen_probable || []).includes('neurologia')} label="NEUROLOGÍA" />
              <Checkbox checked={(data.origen_probable || []).includes('cardiovascular')} label="CARDIOVASCULAR" />
              <Checkbox checked={(data.origen_probable || []).includes('respiratorio')} label="RESPIRATORIO" />
              <Checkbox checked={(data.origen_probable || []).includes('metabolico')} label="METABÓLICO" />
              <Checkbox checked={(data.origen_probable || []).includes('digestivo')} label="DIGESTIVA" />
              <Checkbox checked={(data.origen_probable || []).includes('intoxicacion')} label="INTOXICACIÓN" />
              <Checkbox checked={(data.origen_probable || []).includes('urogenital')} label="UROGENITAL" />
              <Checkbox checked={(data.origen_probable || []).includes('infecciosa')} label="INFECCIOSA" />
              <Checkbox checked={(data.origen_probable || []).includes('gineco')} label="GINECO-OBSTÉTRICA" />
              <Checkbox checked={(data.origen_probable || []).includes('oncologico')} label="ONCOLÓGICO" />
              <Checkbox checked={(data.origen_probable || []).includes('cognitivo')} label="COGNITIVO EMOCIONAL" />
              <Checkbox checked={(data.origen_probable || []).includes('otro')} label="OTRO" />
            </div>
            <div style={{ marginTop: '5px', marginBottom: '3px' }}>
              <Label>ESPECIFIQUE:</Label> <Underline width="265px"></Underline>
            </div>
            <div>
              <Label>1A VEZ:</Label>
              <span style={{ display: 'inline-block', width: '11px', height: '11px', border: '1px solid #000', marginLeft: '5px', marginRight: '15px' }}></span>
              <Label>SUBSECUENTE:</Label>
              <span style={{ display: 'inline-block', width: '11px', height: '11px', border: '1px solid #000', marginLeft: '5px' }}></span>
            </div>
          </div>
        </div>

        {/* ACCIDENTE AUTOMOVILÍSTICO */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{
            backgroundColor: '#008000',
            color: 'white',
            fontSize: '8px',
            fontWeight: 'bold',
            padding: '5px 8px',
            height: '18px'
          }}>
            ACCIDENTE AUTOMOVILÍSTICO
          </div>
          <div style={{ padding: '6px 8px', border: '1px solid #ccc', borderTop: 'none', fontSize: '7px', lineHeight: '1.6' }}>
            <div>
              <Checkbox checked={data.accidente_tipo === 'colision'} label="COLISIÓN" />
              <Checkbox checked={data.accidente_tipo === 'volcadura'} label="VOLCADURA" />
            </div>
            <div>
              <Checkbox checked={data.automotor} label="AUTOMOTOR" />
              <Checkbox checked={data.motocicleta} label="MOTOCICLETA" />
              <Checkbox checked={data.bicicleta} label="BICICLETA" />
            </div>
            <div>
              <Label>CONTRA OBJETO:</Label>
              <Checkbox checked={data.contra_objeto === 'fijo'} label="FIJO" style={{ marginLeft: '5px' }} />
              <Checkbox checked={data.contra_objeto === 'movimiento'} label="EN MOVIMIENTO" />
            </div>
            <div>
              <Label>IMPACTO:</Label> <Underline width="40px" style={{ marginLeft: '5px' }}></Underline>
            </div>
            <div>
              <Checkbox checked={data.impacto === 'frontal'} label="FRONTAL" />
              <Checkbox checked={data.impacto === 'lateral'} label="LATERAL" />
              <Checkbox checked={data.impacto === 'posterior'} label="POSTERIOR" />
            </div>
            <div>
              <Label>HUNDIMIENTO:</Label> <Underline width="45px" style={{ marginLeft: '5px' }}></Underline>
              <Label style={{ marginLeft: '3px' }}>CMS</Label>
              <span style={{ marginLeft: '10px' }}><Label>PARABRISAS:</Label></span>
              <Checkbox checked={data.parabrisas === 'roto'} label="ROTO" style={{ marginLeft: '5px' }} />
            </div>
            <div>
              <Label>VOLANTE:</Label>
              <Checkbox checked={data.volante === 'doblado'} label="DOBLADO" style={{ marginLeft: '5px' }} />
              <Checkbox checked={data.volante === 'intrusion'} label="INTRUSIÓN" />
              <span style={{ marginLeft: '10px' }}><Label>BOLSA DE AIRE:</Label></span>
              <Checkbox checked={data.bolsa_aire === 'si'} label="SÍ" style={{ marginLeft: '5px' }} />
            </div>
            <div>
              <Label>CINTURÓN DE SEGURIDAD:</Label>
              <Checkbox checked={data.cinturon === 'colocado'} label="COLOCADO" style={{ marginLeft: '5px' }} />
              <Checkbox checked={data.cinturon === 'no_colocado'} label="NO COLOCADO" />
            </div>
            <div>
              <Label>DENTRO DEL VEHÍCULO:</Label>
              <Checkbox checked={data.dentro_vehiculo === 'si'} label="SÍ" style={{ marginLeft: '5px' }} />
              <Checkbox checked={data.dentro_vehiculo === 'no'} label="NO" />
              <Checkbox checked={data.dentro_vehiculo === 'eyectado'} label="EYECTADO" />
            </div>
            <div>
              <Label>ATROPELLADO:</Label>
              <Checkbox checked={data.atropellado_tipo === 'automotor'} label="AUTOMOTOR" style={{ marginLeft: '5px' }} />
              <Checkbox checked={data.atropellado_tipo === 'motocicleta'} label="MOTOCICLETA" />
            </div>
            <div>
              <Label>CASCO DE SEGURIDAD:</Label>
              <Checkbox checked={data.casco_seguridad === 'si'} label="SÍ" style={{ marginLeft: '5px' }} />
              <Checkbox checked={data.casco_seguridad === 'no'} label="NO" />
            </div>
          </div>
        </div>

        {/* AGENTE CAUSAL */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{
            backgroundColor: '#008000',
            color: 'white',
            fontSize: '8px',
            fontWeight: 'bold',
            padding: '5px 8px',
            height: '18px'
          }}>
            AGENTE CAUSAL
          </div>
          <div style={{ padding: '6px 8px', border: '1px solid #ccc', borderTop: 'none', fontSize: '7px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', lineHeight: '1.5' }}>
              <Checkbox checked={(data.agente_causal || []).includes('arma')} label="ARMA" />
              <Checkbox checked={(data.agente_causal || []).includes('juguete')} label="JUGUETE" />
              <Checkbox checked={(data.agente_causal || []).includes('automotor')} label="AUTOMOTOR" />
              <Checkbox checked={(data.agente_causal || []).includes('maquinaria')} label="MAQUINARIA" />
              <Checkbox checked={(data.agente_causal || []).includes('electricidad')} label="ELECTRICIDAD" />
              <Checkbox checked={(data.agente_causal || []).includes('herramienta')} label="HERRAMIENTA" />
              <Checkbox checked={(data.agente_causal || []).includes('explosion')} label="EXPLOSIÓN" />
              <Checkbox checked={(data.agente_causal || []).includes('fuego')} label="FUEGO" />
              <Checkbox checked={(data.agente_causal || []).includes('ser_humano')} label="SER HUMANO" />
              <Checkbox checked={(data.agente_causal || []).includes('producto_biologico')} label="PRODUCTO BIOLÓGICO" />
              <Checkbox checked={(data.agente_causal || []).includes('sustancia_toxica')} label="SUSTANCIA TÓXICA" />
              <Checkbox checked={(data.agente_causal || []).includes('animal')} label="ANIMAL" />
              <Checkbox checked={(data.agente_causal || []).includes('otro')} label="OTRO" />
            </div>
            <div style={{ marginTop: '5px', marginBottom: '3px' }}>
              <Label>ESPECIFIQUE:</Label> <Underline width="265px"></Underline>
            </div>
            <div>
              <Label>LESIONES CAUSADAS POR:</Label> <Underline width="180px">{data.lesiones_causadas_por}</Underline>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== COLUMNA DERECHA ==================== */}
      <div style={{ position: 'absolute', top: '120px', right: '15px', width: '380px' }}>
        
        {/* NIVEL DE CONCIENCIA */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{
            backgroundColor: '#008000',
            color: 'white',
            fontSize: '8px',
            fontWeight: 'bold',
            padding: '5px 8px',
            height: '18px'
          }}>
            NIVEL DE CONCIENCIA
          </div>
          <div style={{ padding: '6px 8px', border: '1px solid #ccc', borderTop: 'none', lineHeight: '1.6' }}>
            <Checkbox checked={data.nivel_conciencia === 'consciente'} label="CONSCIENTE" />
            <div><Checkbox checked={data.nivel_conciencia === 'verbal'} label="RESPUESTA A ESTÍMULO VERBAL" /></div>
            <div><Checkbox checked={data.nivel_conciencia === 'doloroso'} label="RESPUESTA A ESTÍMULO DOLOROSO" /></div>
            <div><Checkbox checked={data.nivel_conciencia === 'inconsciente'} label="INCONSCIENTE" /></div>
          </div>
        </div>

        {/* VÍA AÉREA / REFLEJO DE DEGLUCIÓN */}
        <div style={{ marginBottom: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <div>
            <div style={{
              backgroundColor: '#008000',
              color: 'white',
              fontSize: '8px',
              fontWeight: 'bold',
              padding: '5px 8px',
              height: '18px'
            }}>
              VÍA AÉREA
            </div>
            <div style={{ padding: '6px 8px', border: '1px solid #ccc', borderTop: 'none', lineHeight: '1.6' }}>
              <Checkbox checked={data.via_aerea === 'permeable'} label="PERMEABLE" />
              <div><Checkbox checked={data.via_aerea === 'comprometida'} label="COMPROMETIDA" /></div>
            </div>
          </div>
          <div>
            <div style={{
              backgroundColor: '#008000',
              color: 'white',
              fontSize: '8px',
              fontWeight: 'bold',
              padding: '5px 8px',
              height: '18px'
            }}>
              REFLEJO DE DEGLUCIÓN
            </div>
            <div style={{ padding: '6px 8px', border: '1px solid #ccc', borderTop: 'none', lineHeight: '1.6' }}>
              <Checkbox checked={data.reflejo_deglucion === 'ausente'} label="AUSENTE" />
              <div><Checkbox checked={data.reflejo_deglucion === 'presente'} label="PRESENTE" /></div>
            </div>
          </div>
        </div>

        {/* VENTILACIÓN */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{
            backgroundColor: '#008000',
            color: 'white',
            fontSize: '8px',
            fontWeight: 'bold',
            padding: '5px 8px',
            height: '18px'
          }}>
            VENTILACIÓN
          </div>
          <div style={{ padding: '6px 8px', border: '1px solid #ccc', borderTop: 'none', lineHeight: '1.6' }}>
            <Checkbox checked={data.ventilacion === 'automatismo_regular'} label="AUTOMATISMO REGULAR" />
            <div><Checkbox checked={data.ventilacion === 'automatismo_irregular'} label="AUTOMATISMO IRREGULAR" /></div>
            <div><Checkbox checked={data.ventilacion === 'rapida'} label="VENTILACIÓN RÁPIDA" /></div>
            <div><Checkbox checked={data.ventilacion === 'superficial'} label="VENTILACIÓN SUPERFICIAL" /></div>
            <div><Checkbox checked={data.ventilacion === 'apnea'} label="APNEA" /></div>
          </div>
        </div>

        {/* AUSCULTACIÓN */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{
            backgroundColor: '#008000',
            color: 'white',
            fontSize: '8px',
            fontWeight: 'bold',
            padding: '5px 8px',
            height: '18px'
          }}>
            AUSCULTACIÓN
          </div>
          <div style={{ padding: '6px 8px', border: '1px solid #ccc', borderTop: 'none', fontSize: '7px', lineHeight: '1.6' }}>
            <Checkbox checked={data.auscultacion === 'normales'} label="RUIDOS RESP. NORMALES" />
            <div><Checkbox checked={data.auscultacion === 'disminuidos'} label="RUIDOS RESP. DISMINUIDOS" /></div>
            <div><Checkbox checked={data.auscultacion === 'ausentes'} label="RUIDOS RESP. AUSENTES" /></div>
            <div style={{ marginTop: '4px' }}>
              <Label>NEUMOTÓRAX:</Label>
              <Checkbox checked={data.neumotorax === 'derecho'} label="DERECHO" style={{ marginLeft: '5px' }} />
              <Checkbox checked={data.neumotorax === 'izquierdo'} label="IZQUIERDO" />
            </div>
            <div>
              <Label>SITIO:</Label>
              <Checkbox checked={data.sitio_neumotorax === 'apical'} label="APICAL" style={{ marginLeft: '5px' }} />
              <Checkbox checked={data.sitio_neumotorax === 'base'} label="BASE" />
            </div>
          </div>
        </div>

        {/* CIRCULACIÓN */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{
            backgroundColor: '#008000',
            color: 'white',
            fontSize: '8px',
            fontWeight: 'bold',
            padding: '5px 8px',
            height: '18px'
          }}>
            CIRCULACIÓN: PRESENCIA DE PULSOS
          </div>
          <div style={{ padding: '6px 8px', border: '1px solid #ccc', borderTop: 'none', lineHeight: '1.6' }}>
            <Checkbox checked={data.pulso_presente === 'carotideo'} label="CAROTÍDEO" />
            <div><Checkbox checked={data.pulso_presente === 'radial'} label="RADIAL" /></div>
            <div><Checkbox checked={data.pulso_presente === 'paro'} label="PARO CARDIORRESPIRATORIO" /></div>
          </div>
        </div>

        {/* CALIDAD / PIEL */}
        <div style={{ marginBottom: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <div>
            <div style={{
              backgroundColor: '#008000',
              color: 'white',
              fontSize: '8px',
              fontWeight: 'bold',
              padding: '5px 8px',
              height: '18px'
            }}>
              CALIDAD
            </div>
            <div style={{ padding: '6px 8px', border: '1px solid #ccc', borderTop: 'none', lineHeight: '1.6' }}>
              <Checkbox checked={data.calidad_pulso === 'rapido'} label="RÁPIDO" />
              <div><Checkbox checked={data.calidad_pulso === 'lento'} label="LENTO" /></div>
              <div><Checkbox checked={data.calidad_pulso === 'ritmico'} label="RÍTMICO" /></div>
              <div><Checkbox checked={data.calidad_pulso === 'arritmico'} label="ARRÍTMICO" /></div>
            </div>
          </div>
          <div>
            <div style={{
              backgroundColor: '#008000',
              color: 'white',
              fontSize: '8px',
              fontWeight: 'bold',
              padding: '5px 8px',
              height: '18px'
            }}>
              PIEL
            </div>
            <div style={{ padding: '6px 8px', border: '1px solid #ccc', borderTop: 'none', lineHeight: '1.6' }}>
              <Checkbox checked={data.piel === 'normal'} label="NORMAL" />
              <div><Checkbox checked={data.piel === 'palida'} label="PÁLIDA" /></div>
              <div><Checkbox checked={data.piel === 'cianotica'} label="CIANÓTICA" /></div>
              <div><Checkbox checked={data.piel === 'diaforesis'} label="DIAFORESIS" /></div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '4px', fontSize: '7px' }}>
          <Label>CARACTERÍSTICAS:</Label> <Underline width="280px"></Underline>
        </div>

        {/* EXPLORACIÓN FÍSICA */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{
            backgroundColor: '#008000',
            color: 'white',
            fontSize: '8px',
            fontWeight: 'bold',
            padding: '5px 8px',
            height: '18px'
          }}>
            EXPLORACIÓN FÍSICA
          </div>
          <div style={{ padding: '6px 8px', border: '1px solid #ccc', borderTop: 'none', fontSize: '6px', lineHeight: '1.4' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
              {[
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
              ].map(item => (
                <Checkbox 
                  key={item.n}
                  checked={(data.exploracion_fisica || []).includes(item.value)} 
                  label={`${item.n}. ${item.label}`}
                  style={{ fontSize: '6px' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* EXPLORACIÓN FÍSICA */}
        <div style={{ marginBottom: '6px' }}>
          <div style={sectionHeaderStyle}>EXPLORACIÓN FÍSICA</div>
          <div style={{ ...sectionBodyStyle, fontSize: '6px', lineHeight: '1.4' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
              {[
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
              ].map(item => (
                <Checkbox 
                  key={item.n}
                  checked={(data.exploracion_fisica || []).includes(item.value)} 
                  label={`${item.n}. ${item.label}`}
                  style={{ fontSize: '6px' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ZONAS DE LESIÓN Y PUPILAS */}
        <div style={{ marginBottom: '6px', display: 'flex', gap: '8px' }}>
          {/* Zonas de Lesión */}
          <div style={{ flex: 1 }}>
            <div style={{ ...sectionHeaderStyle, fontSize: '7px' }}>ZONAS DE LESIÓN</div>
            <div style={{ 
              ...sectionBodyStyle, 
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {/* Diagrama simplificado del cuerpo humano */}
              <svg width="80" height="110" viewBox="0 0 80 110" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}>
                {/* Cabeza */}
                <circle cx="40" cy="12" r="10" fill="none" stroke="#333" strokeWidth="1.5" />
                {data.zonas_lesion?.cabeza && <circle cx="40" cy="12" r="8" fill="#ff4444" opacity="0.6" />}
                
                {/* Cuello */}
                <line x1="35" y1="20" x2="35" y2="28" stroke="#333" strokeWidth="1.5" />
                <line x1="45" y1="20" x2="45" y2="28" stroke="#333" strokeWidth="1.5" />
                
                {/* Torso */}
                <rect x="28" y="28" width="24" height="25" fill="none" stroke="#333" strokeWidth="1.5" rx="2" />
                {data.zonas_lesion?.torax && <rect x="30" y="30" width="20" height="21" fill="#ff4444" opacity="0.6" rx="2" />}
                
                {/* Brazos */}
                <line x1="28" y1="32" x2="18" y2="50" stroke="#333" strokeWidth="1.5" />
                <line x1="18" y1="50" x2="15" y2="65" stroke="#333" strokeWidth="1.5" />
                {data.zonas_lesion?.brazo_izq && <circle cx="16" cy="58" r="6" fill="#ff4444" opacity="0.6" />}
                
                <line x1="52" y1="32" x2="62" y2="50" stroke="#333" strokeWidth="1.5" />
                <line x1="62" y1="50" x2="65" y2="65" stroke="#333" strokeWidth="1.5" />
                {data.zonas_lesion?.brazo_der && <circle cx="64" cy="58" r="6" fill="#ff4444" opacity="0.6" />}
                
                {/* Abdomen */}
                <rect x="30" y="53" width="20" height="18" fill="none" stroke="#333" strokeWidth="1.5" rx="2" />
                {data.zonas_lesion?.abdomen && <rect x="32" y="55" width="16" height="14" fill="#ff4444" opacity="0.6" rx="2" />}
                
                {/* Piernas */}
                <line x1="34" y1="71" x2="32" y2="95" stroke="#333" strokeWidth="1.5" />
                <line x1="32" y1="95" x2="30" y2="108" stroke="#333" strokeWidth="1.5" />
                {data.zonas_lesion?.pierna_izq && <circle cx="31" cy="102" r="5" fill="#ff4444" opacity="0.6" />}
                
                <line x1="46" y1="71" x2="48" y2="95" stroke="#333" strokeWidth="1.5" />
                <line x1="48" y1="95" x2="50" y2="108" stroke="#333" strokeWidth="1.5" />
                {data.zonas_lesion?.pierna_der && <circle cx="49" cy="102" r="5" fill="#ff4444" opacity="0.6" />}
              </svg>
              <div style={{ 
                position: 'absolute', 
                bottom: '4px', 
                fontSize: '6px', 
                color: '#666' 
              }}>
                ANTERIOR
              </div>
            </div>
          </div>

          {/* Pupilas */}
          <div style={{ width: '100px' }}>
            <div style={{ ...sectionHeaderStyle, fontSize: '7px' }}>PUPILAS</div>
            <div style={{ ...sectionBodyStyle, paddingTop: '12px' }}>
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                {/* Pupila Derecha */}
                <div style={{ marginBottom: '6px' }}>
                  <svg width="30" height="30">
                    <circle cx="15" cy="15" r="12" fill="white" stroke="#333" strokeWidth="1.5" />
                    <circle cx="15" cy="15" r="7" fill="#333" />
                  </svg>
                  <div style={{ fontSize: '6px', marginTop: '2px' }}>DERECHA</div>
                </div>
                
                {/* Pupila Izquierda */}
                <div>
                  <svg width="30" height="30">
                    <circle cx="15" cy="15" r="12" fill="white" stroke="#333" strokeWidth="1.5" />
                    <circle cx="15" cy="15" r="7" fill="#333" />
                  </svg>
                  <div style={{ fontSize: '6px', marginTop: '2px' }}>IZQUIERDA</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIGNOS VITALES */}
        <div style={{ marginBottom: '6px' }}>
          <div style={sectionHeaderStyle}>SIGNOS VITALES</div>
          <div style={{ ...sectionBodyStyle, padding: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '6px' }}>
              <thead>
                <tr style={{ backgroundColor: '#e8f5e9' }}>
                  <th style={{ border: '1px solid #ccc', padding: '3px', fontWeight: 'bold' }}>HORA</th>
                  <th style={{ border: '1px solid #ccc', padding: '3px', fontWeight: 'bold' }}>FR</th>
                  <th style={{ border: '1px solid #ccc', padding: '3px', fontWeight: 'bold' }}>FC</th>
                  <th style={{ border: '1px solid #ccc', padding: '3px', fontWeight: 'bold' }}>TAS</th>
                  <th style={{ border: '1px solid #ccc', padding: '3px', fontWeight: 'bold' }}>TAD</th>
                  <th style={{ border: '1px solid #ccc', padding: '3px', fontWeight: 'bold' }}>SaO2</th>
                  <th style={{ border: '1px solid #ccc', padding: '3px', fontWeight: 'bold' }}>TEMP</th>
                  <th style={{ border: '1px solid #ccc', padding: '3px', fontWeight: 'bold' }}>GLUC</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2].map(i => {
                  const vital = (data.vitales || [])[i] || {};
                  return (
                    <tr key={i}>
                      <td style={{ border: '1px solid #ccc', padding: '3px', textAlign: 'center' }}>{vital.hora || ''}</td>
                      <td style={{ border: '1px solid #ccc', padding: '3px', textAlign: 'center' }}>{vital.fr || ''}</td>
                      <td style={{ border: '1px solid #ccc', padding: '3px', textAlign: 'center' }}>{vital.fc || ''}</td>
                      <td style={{ border: '1px solid #ccc', padding: '3px', textAlign: 'center' }}>{vital.tas || ''}</td>
                      <td style={{ border: '1px solid #ccc', padding: '3px', textAlign: 'center' }}>{vital.tad || ''}</td>
                      <td style={{ border: '1px solid #ccc', padding: '3px', textAlign: 'center' }}>{vital.sao2 || ''}</td>
                      <td style={{ border: '1px solid #ccc', padding: '3px', textAlign: 'center' }}>{vital.temp || ''}</td>
                      <td style={{ border: '1px solid #ccc', padding: '3px', textAlign: 'center' }}>{vital.glucosa || ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CONDICIÓN DEL PACIENTE / PRIORIDAD */}
        <div style={{ marginBottom: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <div>
            <div style={sectionHeaderStyle}>CONDICIÓN DEL PACIENTE</div>
            <div style={{ ...sectionBodyStyle, lineHeight: '1.6' }}>
              <Checkbox checked={data.condicion_paciente === 'critico_inestable'} label="CRÍTICO INESTABLE" />
              <div><Checkbox checked={data.condicion_paciente === 'no_critico'} label="NO CRÍTICO" /></div>
              <div><Checkbox checked={data.condicion_paciente === 'critico_estable'} label="CRÍTICO ESTABLE" /></div>
            </div>
          </div>
          <div>
            <div style={sectionHeaderStyle}>PRIORIDAD</div>
            <div style={{ ...sectionBodyStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              {[
                { key: 'rojo', label: 'ROJO', color: '#dc3545' },
                { key: 'amarillo', label: 'AMARILLO', color: '#ffc107' },
                { key: 'verde', label: 'VERDE', color: '#28a745' },
                { key: 'negro', label: 'NEGRO', color: '#212529' }
              ].map(({ key, label, color }) => (
                <div
                  key={key}
                  style={{
                    backgroundColor: data.prioridad === key ? color : 'white',
                    color: data.prioridad === key ? 'white' : color,
                    border: `2px solid ${color}`,
                    borderRadius: '4px',
                    padding: '4px',
                    textAlign: 'center',
                    fontSize: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resto de secciones... */}
      </div>
    </div>
  );
};

export default Page1;
