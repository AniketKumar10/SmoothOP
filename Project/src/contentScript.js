const analyzePage = () => {
  const formFields = [];
  const inputs = document.querySelectorAll("input, textarea, select");

  if (inputs.length === 0) {
    return {
      status: "no-forms",
      message: "No form fields found on page",
      fields: [],
    };
  }

  inputs.forEach((input) => {
    formFields.push({
      type: input.type || input.tagName.toLowerCase(),
      name: input.name || input.id,
      value: input.value,
      placeholder: input.placeholder,
    });
  });

  return {
    status: "success",
    message: `Found ${formFields.length} form fields`,
    fields: formFields,
  };
};

window.analyzePage = analyzePage;

const handleAnalyze = async () => {
  setLoading(true);
  setError(null);
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tab.url.startsWith("chrome://")) {
      setError("Cannot analyze Chrome system pages");
      return;
    }

    // First inject the content script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["contentScript.bundle.js"],
    });

    // Then execute the analyze function
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        return typeof window.analyzePage === "function"
          ? window.analyzePage()
          : { status: "error", message: "Analyzer not loaded", fields: [] };
      },
    });

    const analysis = results[0].result;
    console.log("Raw analysis:", analysis);

    if (!analysis || analysis.status === "error") {
      setError(analysis?.message || "Analysis failed");
      return;
    }

    if (analysis.status === "no-forms") {
      setError(analysis.message);
    } else {
      setAnalysis(analysis.fields);
    }
  } catch (error) {
    console.error("Analysis error:", error);
    setError("Analysis failed: " + error.message);
  } finally {
    setLoading(false);
  }
};

// Update FIELD_MAPPINGS for Workday
const FIELD_MAPPINGS = {
  prefix: [
    "title",
    "prefix",
    "legalNameSection_title",
    "Prefix select one required",
  ],
  country: ["country", "nation"],
  region: ["region", "state", "province", "territory", "administrative area"],
  phoneType: [
    "phone type",
    "phone device",
    "device type",
    "phone device type",
    "contact device",
  ],
  firstName: ["first name", "given name"],
  middleName: ["middle name"],
  lastName: ["last name", "family name", "surname"],
  address1: ["address line 1", "address1", "street address"],
  address2: ["address line 2", "address2", "apt", "suite"],
  city: ["city"],
  postalCode: ["postal code", "zip code", "zipcode"],
  countryPhoneCode: ["country / territory phone code", "phone code"],
  phoneNumber: ["phone number", "contact number", "mobile number"],
  preferredName: ["preferred name", "nickname"],
};

// Add Workday field mappings
const WORKDAY_FIELD_MAPPINGS = {
  prefix: ["legalNameSection_title", "Prefix select one required"],
  region: [
    "addressSection_region",
    "addressSection_state",
    "State select one required",
  ],
  phoneType: [
    "phoneSection_deviceType",
    "phoneDeviceType",
    "Phone Device Type select one required",
  ],
};

// Set to track filled fields and prevent duplicates
const filledFields = new Set();

// Function to simulate typing into an input field
const simulateTyping = (input, value) => {
  if (!input) return;

  input.focus();
  input.value = "";

  for (let char of value) {
    const eventOptions = {
      key: char,
      bubbles: true,
      cancelable: true,
    };

    input.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
    input.dispatchEvent(new KeyboardEvent("keypress", eventOptions));
    input.value += char;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(
      new KeyboardEvent("keyup", { key: char, bubbles: true })
    );
  }

  input.dispatchEvent(new Event("change", { bubbles: true }));
  input.blur();

  console.log(
    `Simulated typing in field: '${
      input.name || input.id
    }' with value: '${value}'`
  );
};

// Function to handle standard input fields
const fillInput = (input, value, fieldType) => {
  if (!input || filledFields.has(fieldType)) return;
  simulateTyping(input, value);
  filledFields.add(fieldType);
  console.log(`Filled input field: '${fieldType}' with value: '${value}'`);
};

// Function to handle select elements (if any)
const fillSelect = (select, value, fieldType) => {
  if (filledFields.has(fieldType)) return;
  const options = Array.from(select.options);
  let matchedOption = options.find(
    (opt) => opt.text.toLowerCase() === value.toLowerCase()
  );

  if (!matchedOption) {
    matchedOption = options.find((opt) =>
      opt.text.toLowerCase().includes(value.toLowerCase())
    );
  }

  if (matchedOption) {
    select.value = matchedOption.value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    filledFields.add(fieldType);
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

  const checkbox = document.getElementById("input-8");
  if (checkbox && !checkbox.checked) {
    checkbox.click();
    console.log(`Checked 'I have a preferred name' checkbox.`);
  }

  // Wait for the preferred name input to appear
  await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust delay as needed

  // Locate the preferred name input field
  const preferredNameInput =
    document.querySelector('input[name="preferredName"]') ||
    document.querySelector("#preferredName");

  if (preferredNameInput) {
    fillInput(preferredNameInput, preferredName, "preferredName");
    console.log(`Filled preferred name field with value: '${preferredName}'.`);
  } else {
    console.warn(`Preferred name input field not found.`);
  }
};

// Enhanced handleButtonDropdown function
const handleButtonDropdown = async (fieldType, value) => {
  if (fieldType === "countryPhoneCode") {
    return handleWorkdayPhoneCode(value);
  }
  // ...existing code for other field types...
  console.log(`Attempting to select ${value} for ${fieldType}`);

  // Find dropdown button
  let button = null;
  const selectors = WORKDAY_SELECTORS[fieldType] || [];

  for (const selector of selectors) {
    button = document.querySelector(selector);
    if (button) {
      console.log(`Found button using selector: ${selector}`);
      break;
    }
  }

  if (!button) {
    console.warn(`Dropdown button not found for ${fieldType}`);
    return false;
  }

  // Click to open dropdown
  button.click();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Value mappings for different types
  const valueMappings = {
    region: {
      mumbai: ["maharashtra"],
      delhi: ["delhi ncr", "new delhi"],
      // Add more state mappings as needed
    },
    phoneType: {
      mobile: ["cell phone", "mobile phone", "cellular"],
      home: ["landline", "residence"],
      work: ["business", "office"],
    },
  };

  // Find and click matching option
  const options = document.querySelectorAll('[role="option"]');
  console.log(`Found ${options.length} options for ${fieldType}`);

  const targetOption = Array.from(options).find((option) => {
    const optionText = option.textContent.trim().toLowerCase();
    const targetValue = value.toLowerCase();

    // Direct match
    if (optionText === targetValue) return true;

    // Check mappings
    const mappings = valueMappings[fieldType]?.[targetValue] || [];
    return mappings.some((mapping) => optionText.includes(mapping));
  });

  if (targetOption) {
    targetOption.click();
    console.log(`Selected ${targetOption.textContent} for ${fieldType}`);
    return true;
  }

  console.warn(`No matching option found for ${fieldType}: ${value}`);
  return false;
};

// Add simulateClick function
const simulateClick = (element) => {
  if (!element) return;

  element.focus();
  element.click();
  const clickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  element.dispatchEvent(clickEvent);
};

// Add FIELD_AUTOMATION_IDS
const FIELD_AUTOMATION_IDS = {
  prefix: "prefix-dropdown",
  country: "country-dropdown",
  region: "region-dropdown",
  phoneType: "device-type-dropdown",
  // Add more as needed
};

// Add specific selectors for fields
const FIELD_SELECTORS = {
  prefix: [
    '[aria-label*="prefix"]',
    '[aria-label*="title"]',
    '[id*="prefix"]',
    '[name*="prefix"]',
    // Workday specific selectors
    '[data-automation-id*="prefix"]',
    '[class*="gwt-ListBox"]', // Common class in Workday dropdowns
  ],
  phoneType: [
    '[aria-label*="phone type"]',
    '[aria-label*="device type"]',
    '[id*="phone-type"]',
    '[id*="device-type"]',
    '[name*="phoneType"]',
  ],
  region: [
    '[aria-label*="region"]',
    '[aria-label*="state"]',
    '[id*="region"]',
    '[name*="region"]',
  ],
};

// Add Workday specific selectors
const WORKDAY_SELECTORS = {
  prefix: [
    '[data-automation-id="legalNameSection_title"]',
    'button[aria-label*="Prefix"]',
    'button[aria-haspopup="listbox"]',
  ],
  region: [
    '[data-automation-id="addressSection_region"]',
    'button[aria-label*="State"]',
    'button[aria-label*="Region"]',
  ],
  phoneType: [
    '[data-automation-id="phoneSection_deviceType"]',
    'button[aria-label*="Phone Device Type"]',
  ],
};

const handleWorkdayPhoneCode = async (value) => {
  // Find container and input
  const container = document.querySelector(
    '[data-automation-id="multiSelectContainer"]'
  );
  if (!container) {
    console.log("MultiSelect container not found");
    return false;
  }
  const searchInput = container.querySelector(
    '[data-automation-id="searchBox"]'
  );
  if (!searchInput) {
    console.log("Search input not found");
    return false;
  }

  // Clear any previous selection via clear button if exists
  const clearButton = container.querySelector(
    '[data-automation-id="DELETE_charm"]'
  );
  if (clearButton) {
    clearButton.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // --- Phase 1: First Entry ---
  // Focus the input, type value, dispatch input event and press Enter
  searchInput.focus();
  searchInput.value = value;
  searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  searchInput.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      bubbles: true,
    })
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if a selected pill (item) exists in the container
  let selectedPill = container.querySelector(
    '[data-automation-id="selectedItem"]'
  );
  if (selectedPill) {
    console.log("Country already selected:", selectedPill.textContent);
    return true;
  }

  // --- Phase 2: Second Entry ---
  // Clear the input field explicitly
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Re-enter value and press Enter again
  searchInput.focus();
  searchInput.value = value;
  searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  searchInput.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      bubbles: true,
    })
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Final check for the pill in the container
  selectedPill = container.querySelector('[data-automation-id="selectedItem"]');
  if (selectedPill) {
    console.log(
      "Successfully selected country with pill:",
      selectedPill.textContent
    );
    return true;
  }

  console.warn("Country selection failed, pill not present");
  return false;
};

// Main function to fill form fields
const fillFormFields = async (userProfile) => {
  console.log("Starting to fill form fields with user profile:", userProfile);
  filledFields.clear(); // Clear previously filled fields

  // Handle the "I have a preferred name" checkbox and fill preferred name if applicable
  if (userProfile.hasPreferredName && userProfile.preferredName) {
    await handlePreferredName(userProfile.preferredName);
  }

  const inputs = document.querySelectorAll(
    'input, select, textarea, button[aria-haspopup="listbox"]'
  );
  console.log(`Found ${inputs.length} input fields`);

  for (const input of inputs) {
    const identifier = (
      input.name ||
      input.id ||
      input.placeholder ||
      ""
    ).toLowerCase();
    const labelElement = document.querySelector(`label[for="${input.id}"]`);
    const labelText = labelElement
      ? labelElement.textContent.toLowerCase()
      : "";
    const ariaLabel = input.getAttribute("aria-label")?.toLowerCase() || "";

    for (const [fieldType, patterns] of Object.entries(FIELD_MAPPINGS)) {
      if (filledFields.has(fieldType)) continue;
      if (
        patterns.some(
          (p) =>
            identifier.includes(p) ||
            labelText.includes(p) ||
            ariaLabel.includes(p)
        )
      ) {
        console.log(
          `Found field ${fieldType} with value ${userProfile[fieldType]}`
        );

        if (input.tagName.toLowerCase() === "select") {
          await fillSelect(input, userProfile[fieldType], fieldType);
          await new Promise((resolve) => setTimeout(resolve, 300));
        } else if (
          input.tagName.toLowerCase() === "button" &&
          input.getAttribute("aria-haspopup") === "listbox"
        ) {
          const success = await handleButtonDropdown(
            fieldType,
            userProfile[fieldType]
          );
          if (success) {
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        } else {
          fillInput(input, userProfile[fieldType], fieldType);
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
        break;
      }
    }
  }

  console.log("Form filling completed.");
  return true;
};

// Make functions available to the extension
window.fillFormFields = fillFormFields;
window.analyzePage = analyzePage; // Ensure analyzePage is defined elsewhere
