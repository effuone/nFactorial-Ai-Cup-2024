import React, { useState } from 'react';
import axios from 'axios';

export const Entries = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:4000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <p className="text-xl font-semibold text-center">Entries</p>
      <div className="flex justify-center">
        <input type="file" onChange={handleFileChange} />
        <button 
          onClick={handleUpload}
          className="ml-2 px-4 py-1 text-sm text-white font-semibold bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Upload
        </button>
      </div>
      {analysisResult && (
        <div>
          <p className="text-gray-500 font-medium">Analysis Result:</p>
          <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
