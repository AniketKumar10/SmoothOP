import React, { useState } from "react";
import "./App.css";
import logo from "../public/Icon.png"; // Adjust the path if necessary

const App = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle the Analyze Page action
  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      // Query the active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Prevent analyzing Chrome's internal pages
      if (tab.url.startsWith("chrome://")) {
        throw new Error("Cannot analyze Chrome system pages");
      }

      // Inject the content script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["contentScript.bundle.js"],
      });

      // Execute the analyzePage function from the content script
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.analyzePage(),
      });

      const analysisResults = results[0]?.result;

      if (analysisResults && analysisResults.status === "success") {
        setAnalysis(analysisResults.fields);
      } else {
        setError(analysisResults?.message || "Analysis failed");
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      setError("Failed to analyze page: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the Fill Out action
  const handleFillOut = async () => {
    try {
      const userProfile = {
        prefix: "Mr.",
        country: "India",
        region: "Maharashtra", // Update from Mumbai to Maharashtra
        phoneType: "Mobile", // Update from Mobile to Cell Phone
        firstName: "John", // Example value
        middleName: "", // Example value
        lastName: "Doe", // Example value
        address1: "123 Main St", // Example value
        address2: "Apt 4B", // Example value
        city: "Mumbai", // Example value
        postalCode: "400001", // Example value
        countryPhoneCode: "+91", // Example value
        phoneNumber: "9876543210", // Example value
        hasPreferredName: false, // Set to true to include preferred name
      };

      // Conditionally add preferredName if hasPreferredName is true
      if (userProfile.hasPreferredName) {
        userProfile.preferredName = "Johnny"; // Example value
      }

      // Query the active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Execute the fillFormFields function from the content script with userProfile data
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (profile) => window.fillFormFields(profile),
        args: [userProfile],
      });

      console.log("Form filled out successfully");
    } catch (error) {
      console.error("Failed to fill out form:", error);
      setError("Failed to fill out form: " + error.message);
    }
  };

  return (
    <div className="App">
      <img src={logo} alt="SmoothOp Logo" className="logo" />
      <h1>SmoothOp</h1>
      <div className="buttons">
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Page"}
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
                {field.fieldType !== "unknown" ? (
                  <strong>{field.fieldType}</strong>
                ) : (
                  field.name
                )}
                : {field.type}
                {field.required && " (required)"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;