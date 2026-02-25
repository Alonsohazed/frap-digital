import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import Page1 from './Page1';
import Page2 from './Page2';

const PrintableFRAP = ({ data, onClose }) => {
  const printRef = useRef();

  const handleDownloadPDF = () => {
    const element = printRef.current;
    
    const opt = {
      margin: 0,
      filename: `FRAP-${data.folio || 'documento'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'px', 
        format: [808, 1048], 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Botones de acción */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }} className="no-print">
        <button
          onClick={handleDownloadPDF}
          style={{
            padding: '10px 20px',
            backgroundColor: '#008000',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          📄 Descargar PDF
        </button>
        <button
          onClick={handlePrint}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          🖨️ Imprimir
        </button>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            ✕ Cerrar
          </button>
        )}
      </div>

      {/* Contenedor de páginas */}
      <div 
        ref={printRef}
        style={{
          width: '808px',
          margin: '0 auto',
          backgroundColor: '#f5f5f5',
          padding: '20px 0'
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <Page1 data={data} />
        </div>
        <div>
          <Page2 data={data} />
        </div>
      </div>

      {/* Estilos para impresión */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          .no-print {
            display: none !important;
          }
          
          @page {
            size: 8.5in 11in;
            margin: 0;
          }
          
          .page {
            page-break-after: always;
            page-break-inside: avoid;
          }
          
          .page:last-child {
            page-break-after: auto;
          }
        }
        
        @media screen {
          body {
            background-color: #e0e0e0;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintableFRAP;
