import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import QueryBox from './components/QueryBox';
import ResponseViewer from './components/ResponseViewer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrainCircuit } from 'lucide-react';

function App() {
  const [fileId, setFileId] = useState(null);
  const [response, setResponse] = useState(null);

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1><span><BrainCircuit src='public/icon.svg' style={{color: '#F7B100'}}/></span> QueryLens AI Dashboard</h1>
      <FileUploader setFileId={setFileId} />
      {fileId && <QueryBox fileId={fileId} setResponse={setResponse} />}
      {response && <ResponseViewer response={response} />}
    </div>
  );
}

export default App;
