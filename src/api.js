import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const uploadCSV = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post("http://localhost:8000/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(percent);
    }
  });

  return response.data;
};


export const sendQuery = async (file_id, user_query) => {
  const formData = new FormData();
  formData.append('file_id', file_id);
  formData.append('user_query', user_query);
  const response = await axios.post(`${API_BASE}/query`, formData);
  return response.data;
};
