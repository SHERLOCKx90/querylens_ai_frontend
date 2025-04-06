import React, { useState } from 'react';
import { uploadCSV } from '../api';
import { toast } from 'react-toastify';
import { FileUp } from 'lucide-react';

function FileUploader({ setFileId }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const slowProgress = (percent) => {
        setTimeout(() => setProgress(percent), percent * 5);
      };

      const data = await uploadCSV(file, slowProgress);
      setProgress(100);

      setTimeout(() => {
        setFileId(data.file_id);
        setUploading(false);
        toast.success('✅ CSV uploaded and model trained!');
      }, 500);
    } catch (err) {
      toast.error('❌ Upload failed');
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px', maxwidth: '100%' }}>
      <h3 style={{ display: 'flex', flexDirection: 'row', justifyItems: 'center', alignItems: 'center', gap: '10px'}}><span><FileUp style={{color: '#00D34A'}}/></span>{' '}Upload CSV File</h3>
      <p style={{ fontSize: '15px', color: '#8A8A8A' }}>QueryLensAI v1.0.1 only accepts{' '}<span style={{ color: 'green' }}>.csv</span> file formats as of now.</p>
      <input type="file" accept=".csv" onChange={handleChange} />
      

      {uploading && (
        <>
          <div
            style={{
              maxwidth: '100%',
              height: '12px',
              background: '#444',
              borderRadius: '6px',
              overflow: 'hidden',
              marginTop: '10px',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#4caf50',
                display: 'block',
                transition: 'width 0.3s ease-in-out',
              }}
            />
          </div>
          <p style={{ marginTop: '5px', color: '#8A8A8A' }}>{progress}% uploading...</p>
        </>
      )}
    </div>
  );
}

export default FileUploader;

