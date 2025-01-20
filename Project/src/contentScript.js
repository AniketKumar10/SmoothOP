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

const FIELD_MAPPINGS = {
  prefix: ['prefix', 'title', 'legalNameSection_title'],
  country: ['country', 'territory'],
  region: ['region', 'state', 'province'],
  phoneType: ['phone type', 'device type', 'phoneDeviceType'],
  firstName: ['first name', 'firstname', 'given name'],
  middleName: ['middle name', 'middlename'],
  lastName: ['last name', 'lastname', 'family name', 'surname'],
  address1: ['address line 1', 'address1', 'street'],
  address2: ['address line 2', 'address2'],
  city: ['city', 'town'],
  postalCode: ['postal code', 'zip', 'pincode'],
  phone: ['phone', 'telephone', 'mobile'],
  phoneCode: ['country code', 'dialing code']
};

// Map field types to their respective data-automation-id
const FIELD_AUTOMATION_IDS = {
  prefix: 'legalNameSection_title',
  country: 'countryDropdown',
  region: 'addressSection_countryRegion',
  phoneType: 'phone-device-type'
};

// Define dropdown specific values
const DROPDOWN_VALUES = {
  prefix: ['Dr.', 'Miss', 'Mr.', 'Mrs.', 'Ms.', 'Professor'],
  country: ['India', 'United States', 'Canada', 'United Kingdom'], // Add more countries as needed
  region: ['Andhra Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu'],
  phoneType: ['Home', 'Work', 'Mobile']
};

// Utility function to simulate clicks
const simulateClick = (element) => {
  element.focus();
  element.click();
  element.dispatchEvent(new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  }));
};

// Function to handle button-based dropdowns
const handleButtonDropdown = async (fieldType, value) => {
  console.log(`Handling dropdown for field: ${fieldType}, desired value: '${value}'`);

  const automationId = FIELD_AUTOMATION_IDS[fieldType];
  
  let buttonSelector = `[data-automation-id="${automationId}"]`;
  
  if (!automationId) {
    buttonSelector = `[aria-label*="${fieldType}"]`;
  }

  const button = document.querySelector(buttonSelector);
  
  if (!button) {
    console.warn(`Dropdown button for '${fieldType}' not found using selector: ${buttonSelector}`);
    return false;
  }

  // Open the dropdown
  simulateClick(button);
  console.log(`Clicked dropdown button for '${fieldType}'.`);

  // Wait for dropdown options to render
  await new Promise(resolve => setTimeout(resolve, 500)); // Adjust delay as needed
  
  // Locate the dropdown options
  const options = document.querySelectorAll('[role="option"]');
  console.log(`Found ${options.length} options for '${fieldType}'.`);

  if (!options.length) {
    console.warn(`No dropdown options found for '${fieldType}'.`);
    return false;
  }

  // Find the matching option
  const targetOption = Array.from(options).find(opt => 
    opt.textContent.trim().toLowerCase() === value.toLowerCase()
  );

  if (targetOption) {
    simulateClick(targetOption);
    console.log(`Selected '${value}' for '${fieldType}'.`);
    return true;
  } else {
    console.warn(`Option '${value}' not found for '${fieldType}'.`);
    return false;
  }
};

// Function to handle select elements (if any)
const fillSelect = (select, value, fieldType) => {
  const options = Array.from(select.options);
  let matchedOption = options.find(opt => 
    opt.text.toLowerCase() === value.toLowerCase()
  );

  if (!matchedOption) {
    matchedOption = options.find(opt => 
      opt.text.toLowerCase().includes(value.toLowerCase())
    );
  }

  if (matchedOption) {
    select.value = matchedOption.value;
    simulateClick(select);
    console.log(`Filled select field: '${fieldType}' with value: '${value}'`);
    return true;
  }
  console.warn(`Option '${value}' not found in select field: '${fieldType}'.`);
  return false;
};

// Function to handle the "I have a preferred name" checkbox and fill the preferred name field
const handlePreferredName = async (preferredName) => {
  if (!preferredName) {
    return;
  }

  const checkbox = document.getElementById('input-8');
  if (checkbox && !checkbox.checked) {
    checkbox.click();
    console.log(`Checked 'I have a preferred name' checkbox.`);
  }

  // Wait for the preferred name input to appear
  await new Promise(resolve => setTimeout(resolve, 500)); // Adjust delay as needed

  // Locate the preferred name input field
  const preferredNameInput = document.querySelector('input[name="preferredName"]') || document.querySelector('#preferredName');
  
  if (preferredNameInput) {
    fillInput(preferredNameInput, preferredName);
    console.log(`Filled preferred name field with value: '${preferredName}'.`);
  } else {
    console.warn(`Preferred name input field not found.`);
  }
};

// Function to handle standard input fields
const fillInput = (input, value) => {
  input.value = value || '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  console.log(`Filled input field: '${input.name || input.id}' with value: '${value}'`);
};

// Main function to fill form fields
const fillFormFields = async (userProfile) => {
  console.log('Starting to fill form fields with user profile:', userProfile);
  
  // Handle the "I have a preferred name" checkbox and fill preferred name if applicable
  if (userProfile.preferredName) {
    await handlePreferredName(userProfile.preferredName);
  }

  const inputs = document.querySelectorAll('input, select, textarea, button[aria-haspopup="listbox"]');

  for (const input of inputs) {
    const identifier = (input.name || input.id || input.placeholder || '').toLowerCase();
    const labelElement = document.querySelector(`label[for="${input.id}"]`);
    const labelText = labelElement ? labelElement.textContent.toLowerCase() : '';
    const ariaLabel = input.getAttribute('aria-label')?.toLowerCase() || '';

    for (const [fieldType, patterns] of Object.entries(FIELD_MAPPINGS)) {
      if (patterns.some(p => 
        identifier.includes(p) || 
        labelText.includes(p) || 
        ariaLabel.includes(p)
      )) {
        if (input.tagName.toLowerCase() === 'select') {
          fillSelect(input, userProfile[fieldType], fieldType);
          console.log(`Filled select field: '${fieldType}' with value: '${userProfile[fieldType]}'`);
        } else if (input.tagName.toLowerCase() === 'button' && input.getAttribute('aria-haspopup') === 'listbox') {
          // Handle button-based dropdown
          const success = await handleButtonDropdown(fieldType, userProfile[fieldType]);
          if (success) {
            console.log(`Successfully filled dropdown field: '${fieldType}'`);
          }
        } else {
          fillInput(input, userProfile[fieldType]);
          console.log(`Filled input field: '${fieldType}' with value: '${userProfile[fieldType]}'`);
        }
        break; // Move to the next input after handling
      }
    }
  }

  console.log('Form filling completed.');
};

// Make functions available to the extension
window.fillFormFields = fillFormFields;
window.analyzePage = analyzePage; // Ensure analyzePage is defined elsewhere