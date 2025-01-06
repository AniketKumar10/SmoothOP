const analyzePage = () => {
  const formFields = [];
  const inputs = document.querySelectorAll('input, textarea, select');
  
  if (inputs.length === 0) {
    return {
      status: 'no-forms',
      message: 'No form fields found on page',
      fields: []
    };
  }

  inputs.forEach(input => {
    formFields.push({
      type: input.type || input.tagName.toLowerCase(),
      name: input.name || input.id,
      value: input.value,
      placeholder: input.placeholder
    });
  });
  
  return {
    status: 'success',
    message: `Found ${formFields.length} form fields`,
    fields: formFields
  };
};

window.analyzePage = analyzePage;

const handleAnalyze = async () => {
  setLoading(true);
  setError(null);
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab.url.startsWith('chrome://')) {
      setError('Cannot analyze Chrome system pages');
      return;
    }

    // First inject the content script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['contentScript.bundle.js']
    });

    // Then execute the analyze function
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        return typeof window.analyzePage === 'function' 
          ? window.analyzePage() 
          : { status: 'error', message: 'Analyzer not loaded', fields: [] };
      }
    });

    const analysis = results[0].result;
    console.log('Raw analysis:', analysis);

    if (!analysis || analysis.status === 'error') {
      setError(analysis?.message || 'Analysis failed');
      return;
    }

    if (analysis.status === 'no-forms') {
      setError(analysis.message);
    } else {
      setAnalysis(analysis.fields);
    }
  } catch (error) {
    console.error('Analysis error:', error);
    setError('Analysis failed: ' + error.message);
  } finally {
    setLoading(false);
  }
};