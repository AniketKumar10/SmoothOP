import React, { useState } from 'react';
import './App.css';

const USER_PROFILE = {
  prefix: 'Mr.', // Must match exactly as in DROPDOWN_VALUES.prefix
  country: 'India', // Must match exactly as in DROPDOWN_VALUES.country
  region: 'Maharashtra', // Must match exactly as in DROPDOWN_VALUES.region
  phoneType: 'Mobile', // Must match exactly as in DROPDOWN_VALUES.phoneType
  firstName: 'John',
  middleName: '',
  lastName: 'Doe',
  address1: '123 Main St',
  address2: 'Apt 4B',
  city: 'Mumbai',
  postalCode: '400001',
  phone: '9876543210',
  phoneCode: '+91',
  preferredName: 'Johnny', // New field for preferred name
  // ... any other additional fields
};

const App = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab.url.startsWith('chrome://')) {
        throw new Error('Cannot analyze Chrome system pages');
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['contentScript.bundle.js']
      });

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.analyzePage()
      });

      const analysisResults = results[0]?.result;
      
      if (analysisResults && analysisResults.status === 'success') {
        setAnalysis(analysisResults.fields);
      } else {
        setError(analysisResults?.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Failed to analyze page: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFillOut = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (profile) => window.fillFormFields(profile),
        args: [USER_PROFILE]
      });

      console.log('Form filled out successfully');
    } catch (error) {
      console.error('Failed to fill out form:', error);
      setError('Failed to fill out form: ' + error.message);
    }
  };

  return (
    <div className="App">
      <h1>SmoothOp</h1>
      <div className="buttons">
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Page'}
        </button>
        <button onClick={handleFillOut} disabled={!analysis || loading}>
          Fill Out
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {analysis && (
        <div className="analysis-results">
          <h3>Found {analysis.length} form fields</h3>
          <ul>
            {analysis.map((field, index) => (
              <li key={index}>
                {field.fieldType !== 'unknown' ? (
                  <strong>{field.fieldType}</strong>
                ) : field.name}: {field.type}
                {field.required && ' (required)'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;