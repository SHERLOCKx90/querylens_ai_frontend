import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ArrowDownToLine, BadgeInfoIcon, BookOpenText, ChartScatterIcon, FileDown } from 'lucide-react';

function ResponseViewer({ response }) {
  const reportRef = useRef();

  const exportToPDF = async () => {
    const input = reportRef.current;

    // Ensure all images are fully loaded before capturing
    const images = input.querySelectorAll("img");
    const imageLoadPromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = img.onerror = resolve;
      });
    });

    await Promise.all(imageLoadPromises);

    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('query-report.pdf');
  };


  return (
    <div
      ref={reportRef}
      style={{
        background: '#181818',
        padding: '24px',
        color: '#fff',
        borderRadius: '10px',
        marginTop: '20px',
        marginBottom: '40px',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      }}
    >
      <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '2px', marginBottom: '15px', display: 'flex', flexDirection: 'row', justifyItems: 'center', alignItems: 'center', gap: '10px' }}>
        <span><BookOpenText style={{ color: '#00FB58' }} /></span> Detailed Report
      </h3>

      <p style={{ fontSize: '1.15rem', marginBottom: '20px' }}>Ans: {response?.answer}</p>

      {response?.chart && (
        <>
          <h4 style={{ display: 'flex', flexDirection: 'row', justifyItems: 'center', alignItems: 'center', gap: '10px' }}><span><ChartScatterIcon style={{ color: '#00FB58' }} /></span> Chart</h4>
          <img
            src={`http://localhost:8000${response.chart}`}
            alt="Query Chart"
            style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }}
          />

          <a
            href={`http://localhost:8000${response.chart}`}
            download="chart.png"
            style={{
              color: '#4caf50',
              display: 'inline-block',
              marginTop: '10px',

            }}
          ><button style={{ display: 'flex', flexDirection: 'row', justifyItems: 'center', alignItems: 'center', gap: '10px' }}>
              <span><ArrowDownToLine style={{ color: '#00FB58' }} /></span> Download Chart
            </button>
          </a>

        </>
      )}

      {response?.explanation && (
        <div style={{ marginTop: '30px' }}>
          <h4 style={{ display: 'flex', flexDirection: 'row', justifyItems: 'center', alignItems: 'center', gap: '10px' }}><span><BadgeInfoIcon style={{ color: '#00FB58' }} /></span> Explanation</h4>
          <p style={{ lineHeight: '1.6', fontSize: '1rem' }}>{response.explanation}</p>
        </div>
      )}

      {response?.validation_score !== undefined &&
        response?.validation_score !== null && (
          <div style={{ marginTop: '30px' }}>
            <h4>✅ Validation Score</h4>
            <p style={{ fontSize: '1rem' }}>
              <strong>{response.validation_score}%</strong> — {response.validation_reason}
            </p>

            {response.validation_chart && (
              <>
                <img
                  src={`http://localhost:8000${response.validation_chart}`}
                  alt="Validation Chart"
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    marginTop: '12px',
                  }}
                />
                <a
                  href={`http://localhost:8000${response.validation_chart}`}
                  download="validation_chart.png"
                  style={{
                    color: '#4caf50',
                    display: 'inline-block',
                    marginTop: '8px',

                  }}
                ><button style={{ display: 'flex', flexDirection: 'row', justifyItems: 'center', alignItems: 'center', gap: '10px' }}>
                    <span><ArrowDownToLine style={{ color: '#00FB58' }} /></span> Download Validation Chart
                  </button>
                </a>
              </>
            )}
          </div>
        )}

      <div style={{ marginTop: '30px', textAlign: 'right' }}>
        <button
          onClick={exportToPDF}
          style={{
            padding: '10px 18px',
            backgroundColor: '#009835',
            color: '#fff',
            border: 'none',
            borderRadius: '30px',
            fontSize: '0.95rem',
            cursor: 'pointer',
            textAlign: 'center',
            justifyItems:'center',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span><FileDown style={{color: '#F7B100'}}/></span> Export Full Report to PDF
        </button>
      </div>
    </div>
  );
}

export default ResponseViewer;
