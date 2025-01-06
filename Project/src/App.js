import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Execute content script
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const inputs = document.querySelectorAll('input, textarea, select');
          const formFields = Array.from(inputs).map(input => ({
            type: input.type || input.tagName.toLowerCase(),
            name: input.name || input.id,
            value: input.value,
            placeholder: input.placeholder
          }));
          
          return {
            status: formFields.length ? 'success' : 'no-forms',
            message: formFields.length ? `Found ${formFields.length} fields` : 'No form fields found',
            fields: formFields
          };
        }
      });

      if (!results?.[0]?.result) {
        throw new Error('Analysis returned no results');
      }

      const analysis = results[0].result;
      console.log('Analysis result:', analysis);
      
      if (analysis.status === 'success') {
        setAnalysis(analysis.fields);
      } else {
        setError(analysis.message);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Failed to analyze page');
    } finally {
      setLoading(false);
    }
  };

  const handleFillOut = () => {
    if (!analysis) {
      console.log('Please analyze the page first');
      return;
    }
    console.log('Filling out form with analysis:', analysis);
  };

  return (
    <div className="App">
      <h1>SmoothOp</h1>
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Page'}
      </button>
      <button onClick={handleFillOut} disabled={!analysis || loading}>
        Fill Out
      </button>
      {error && <div className="error">{error}</div>}
      {analysis && <div>Found {analysis.length} form fields</div>}
    </div>
  );
};

export default App;