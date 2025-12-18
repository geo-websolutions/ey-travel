"use client";

import { useState, useEffect, useRef } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import {
  FiEye,
  FiEdit,
  FiSave,
  FiTrash2,
  FiPlus,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiTag,
  FiSmartphone,
  FiMonitor,
  FiRefreshCw,
  FiCode,
  FiEdit2,
  FiCheck,
} from "react-icons/fi";

export default function EmailTemplates() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateName, setTemplateName] = useState("");
  const [templateHtml, setTemplateHtml] = useState("");
  const [templateUsage, setTemplateUsage] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showUsageDropdown, setShowUsageDropdown] = useState(false);
  const [previewView, setPreviewView] = useState("desktop"); // 'desktop', 'mobile'
  const [detectedVariables, setDetectedVariables] = useState([]);
  const [variableValues, setVariableValues] = useState({});
  const [editingVariable, setEditingVariable] = useState(null);
  const [variableInputValue, setVariableInputValue] = useState("");
  const iframeRef = useRef(null);

  // Available usage options
  const usageOptions = [
    "Client Booking Confirmation",
    "Client Check Availability",
    "Client Booked Notification",
    "Client Availability Confirmed",
    "Client Partial Availability Notification",
    "Client Not Available Notification",
    "Client Partial Availability Feedback Received",
    "Client Payment Confirmed",
    "Tours Schedule Confirmed",
    "Tour Completed Notification",
    "Booking Confirmed After Modification",
    "Booking Cancelled After Modification",
    "Client Payment Failed",
  ];

  // Fetch templates from Firestore
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Update detected variables when template changes
  useEffect(() => {
    if (templateHtml) {
      const vars = extractVariables(templateHtml);
      setDetectedVariables(vars);

      // Initialize variable values with empty strings
      const initialValues = {};
      vars.forEach((variable) => {
        if (!(variable in variableValues)) {
          initialValues[variable] = `[${variable}]`;
        }
      });
      setVariableValues((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [templateHtml]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "emailTemplates"));
      const templatesData = [];
      querySnapshot.forEach((doc) => {
        templatesData.push({ id: doc.id, ...doc.data() });
      });
      setTemplates(templatesData);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setTemplateName(template.name);
    setTemplateHtml(template.html);
    setTemplateUsage(template.usage || []);
    setIsEditing(false);
    setPreviewMode(true);
    setPreviewView("desktop");
  };

  // Extract all variables from template
  const extractVariables = (html) => {
    const variables = new Set();

    // Find {{variable}} including underscores and uppercase
    const curlyMatches = html.match(/\{\{([^}]+)\}\}/g) || [];
    curlyMatches.forEach((match) => {
      const varName = match.replace(/\{\{|\}\}/g, "").trim();
      if (varName) variables.add(varName);
    });

    // Find [variable] including underscores and uppercase
    const bracketMatches = html.match(/\[([^\]]+)\]/g) || [];
    bracketMatches.forEach((match) => {
      const varName = match.replace(/\[|\]/g, "").trim();
      if (varName) variables.add(varName);
    });

    return Array.from(variables);
  };

  // Process HTML with variable replacement
  const processVariables = (html) => {
    let processedHtml = html;

    // Replace all variables with their values
    detectedVariables.forEach((variable) => {
      const value = variableValues[variable] || `{{${variable}}}`;

      // Replace {{variable}}
      const curlyRegex = new RegExp(`\\{\\{${escapeRegExp(variable)}\\}\\}`, "g");
      processedHtml = processedHtml.replace(curlyRegex, value);

      // Replace [variable]
      const bracketRegex = new RegExp(`\\[${escapeRegExp(variable)}\\]`, "g");
      processedHtml = processedHtml.replace(bracketRegex, value);
    });

    return processedHtml;
  };

  // Helper function to escape regex special characters
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const saveVariableValue = () => {
    if (editingVariable && variableInputValue !== undefined) {
      setVariableValues((prev) => ({
        ...prev,
        [editingVariable]: variableInputValue,
      }));
      setEditingVariable(null);
      setVariableInputValue("");
    }
  };

  const cancelVariableEdit = () => {
    setEditingVariable(null);
    setVariableInputValue("");
  };

  const resetVariableValue = (variable) => {
    setVariableValues((prev) => ({
      ...prev,
      [variable]: `{{${variable}}}`,
    }));
  };

  const toggleUsageOption = (option) => {
    if (templateUsage.includes(option)) {
      setTemplateUsage(templateUsage.filter((item) => item !== option));
    } else {
      setTemplateUsage([...templateUsage, option]);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    if (!templateHtml.trim()) {
      toast.error("Please enter template HTML");
      return;
    }

    try {
      setLoading(true);
      const templateData = {
        name: templateName,
        html: templateHtml,
        usage: templateUsage,
        updatedAt: new Date(),
        updatedBy: {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
        },
      };

      // Include createdAt and createdBy for new templates
      if (!selectedTemplate || !selectedTemplate.id) {
        templateData.createdAt = new Date();
        templateData.createdBy = {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
        };
      }

      if (selectedTemplate && selectedTemplate.id) {
        // Update existing template
        await updateDoc(doc(db, "emailTemplates", selectedTemplate.id), templateData);
        toast.success("Template updated successfully");
      } else {
        // Create new template
        await addDoc(collection(db, "emailTemplates"), templateData);
        toast.success("Template saved successfully");
      }

      // Refresh templates list
      fetchTemplates();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate || !selectedTemplate.id) {
      return;
    }

    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(db, "emailTemplates", selectedTemplate.id));
      toast.success("Template deleted successfully");

      // Reset form
      setSelectedTemplate(null);
      setTemplateName("");
      setTemplateHtml("");
      setTemplateUsage([]);

      // Refresh templates list
      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template");
    } finally {
      setLoading(false);
    }
  };

  const handleNewTemplate = () => {
    setSelectedTemplate(null);
    setTemplateName("");
    setTemplateHtml("");
    setTemplateUsage([]);
    setIsEditing(true);
    setPreviewMode(false);
  };

  const renderPreview = () => {
    const processedHtml = processVariables(templateHtml);

    const emailWrapper = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <style>
          /* Reset for email clients */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            mso-line-height-rule: exactly;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          
          body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            min-height: 100%;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 16px;
            line-height: 1.4;
            color: #333333;
            background-color: #f5f5f5;
            text-align: left;
          }
          
          /* Email container */
          .email-container {
            width: 100%;
            max-width: ${previewView === "mobile" ? "480px" : "660px"};
            margin: 0 auto;
            background-color: #ffffff;
            border: none;
            padding: 20px;
          }
          
          /* Email safe styles */
          img {
            max-width: 100%;
            height: auto;
            display: block;
            border: 0;
            outline: none;
            text-decoration: none;
          }
          
          table {
            border-collapse: collapse;
            width: 100%;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
          
          td {
            word-break: break-word;
            -webkit-hyphens: auto;
            -moz-hyphens: auto;
            hyphens: auto;
            padding: 0;
          }
          
          /* Mobile responsiveness */
          @media only screen and (max-width: 480px) {
            .email-container {
              width: 100% !important;
              min-width: 320px !important;
              padding: 15px !important;
            }
          }
          
          /* Outlook specific */
          .ExternalClass {
            width: 100%;
          }
          
          /* Prevent automatic number detection on iOS */
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          ${processedHtml}
        </div>
      </body>
    </html>
  `;

    return (
      <div className="bg-white p-4 rounded-lg h-full flex flex-col">
        {/* Preview controls */}
        <div className="bg-gray-100 border-b border-gray-300 px-4 py-3 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">Email Preview</span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <FiCode className="w-3 h-3" />
              <span>{detectedVariables.length} variables detected</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View toggle buttons */}
            <button
              onClick={() => setPreviewView("mobile")}
              className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center space-x-2 ${
                previewView === "mobile"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
              title="Mobile view (480px)"
            >
              <FiSmartphone className="w-4 h-4" />
              <span>Mobile</span>
            </button>

            <button
              onClick={() => setPreviewView("desktop")}
              className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center space-x-2 ${
                previewView === "desktop"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
              title="Desktop view (600px)"
            >
              <FiMonitor className="w-4 h-4" />
              <span>Desktop</span>
            </button>

            <button
              onClick={() => iframeRef.current?.contentWindow?.location.reload()}
              className="px-3 py-1.5 text-sm rounded-md bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition-all flex items-center space-x-2"
              title="Refresh preview"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Main preview area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 mt-4 min-h-0">
          {/* Variable panel - Fixed height with scrolling */}
          <div className="lg:w-1/3 flex flex-col min-h-0">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex-1 overflow-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center justify-between">
                <div className="flex items-center">
                  <FiCode className="mr-2" />
                  Template Variables
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {detectedVariables.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    // Reset all variables to their original format
                    const resetValues = {};
                    detectedVariables.forEach((variable) => {
                      resetValues[variable] = `{{${variable}}}`;
                    });
                    setVariableValues(resetValues);
                  }}
                  className="text-xs text-gray-600 hover:text-gray-800"
                  title="Reset all variables"
                >
                  Reset All
                </button>
              </h3>

              {detectedVariables.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiCode className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No variables detected in this template.</p>
                  <p className="text-sm mt-1">Use {"{{variable}}"} or [variable] syntax</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {detectedVariables.map((variable) => (
                    <div key={variable} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-mono text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {variable}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {templateHtml.includes(`{{${variable}}}`) ? "{{}}" : "[]"}
                          </span>
                        </div>
                        <button
                          onClick={() => resetVariableValue(variable)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                          title="Reset to original"
                        >
                          Reset
                        </button>
                      </div>

                      {editingVariable === variable ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={variableInputValue}
                            onChange={(e) => setVariableInputValue(e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded text-black"
                            placeholder="Enter value..."
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveVariableValue();
                              if (e.key === "Escape") cancelVariableEdit();
                            }}
                          />
                          <button
                            onClick={saveVariableValue}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Save"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelVariableEdit}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Cancel"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setEditingVariable(variable);
                            setVariableInputValue(variableValues[variable] || `{{${variable}}}`);
                          }}
                        >
                          <span className="text-sm text-gray-700 truncate">
                            {variableValues[variable] || `{{${variable}}}`}
                          </span>
                          <FiEdit2 className="w-4 h-4 text-gray-500" />
                        </div>
                      )}

                      <div className="mt-2 text-xs text-gray-500 flex justify-between">
                        <span>Click to edit value</span>
                        <span className="font-mono">
                          {templateHtml.split(
                            new RegExp(
                              `\\{\\{${escapeRegExp(variable)}\\}\\}|\\[${escapeRegExp(
                                variable
                              )}\\]`,
                              "g"
                            )
                          ).length - 1}{" "}
                          occurrences
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  <p className="mb-1">
                    <strong>How it works:</strong>
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Variables are automatically detected from your template</li>
                    <li>Click on any variable value to edit it</li>
                    <li>Changes update the preview in real-time</li>
                    <li>Reset individual variables or all at once</li>
                    <li>Supports both {"{{variable}}"} and [variable] syntax</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Email preview - Fixed height with proper scrolling */}
          <div className="lg:w-2/3 flex-1 flex flex-col min-h-0">
            <div className="flex-1 relative rounded-lg overflow-hidden border border-gray-300 bg-white min-h-0">
              {previewView === "mobile" ? (
                <div className="h-full flex items-start justify-center p-4 md:p-8 bg-linear-to-br from-gray-100 to-gray-300 overflow-auto">
                  <div className="relative w-[360px] min-h-[640px] bg-gray-900 border-8 border-gray-800 rounded-[40px] shadow-2xl overflow-hidden shrink-0">
                    {/* Mobile notch */}
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 z-10 flex items-center justify-center">
                      <div className="w-20 h-1 bg-gray-700 rounded-full"></div>
                    </div>
                    {/* Status bar */}
                    <div className="absolute top-6 left-0 right-0 h-6 bg-gray-800 z-10 px-4 flex items-center justify-between text-white text-xs">
                      <span>9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-2 bg-gray-600 rounded-full"></div>
                        <div className="w-4 h-2 bg-gray-600 rounded-full"></div>
                        <div className="w-4 h-2 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    {/* Screen content - Fixed container with scrolling */}
                    <div className="absolute top-12 left-0 right-0 bottom-0 overflow-hidden">
                      <iframe
                        ref={iframeRef}
                        srcDoc={emailWrapper}
                        title="Email Template Preview"
                        className="w-full h-full border-none"
                        sandbox="allow-same-origin"
                        style={{
                          display: "block",
                          border: "none",
                          overflow: "auto",
                        }}
                      />
                    </div>
                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-start justify-center p-4 md:p-8 bg-linear-to-br from-blue-50 to-gray-100 overflow-auto">
                  <div className="relative w-full max-w-4xl min-h-[800px] bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden shrink-0">
                    {/* Browser window simulation */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gray-100 border-b border-gray-300 z-10 flex items-center px-3">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded h-4"></div>
                      </div>
                    </div>
                    {/* Email content - Fixed container with scrolling */}
                    <div className="absolute top-8 left-0 right-0 bottom-0 overflow-hidden">
                      <iframe
                        ref={iframeRef}
                        srcDoc={emailWrapper}
                        title="Email Template Preview"
                        className="w-full h-full border-none"
                        sandbox="allow-same-origin"
                        style={{
                          display: "block",
                          border: "none",
                          overflow: "auto",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preview status bar */}
            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      previewView === "mobile" ? "bg-green-500" : "bg-blue-500"
                    }`}
                  ></div>
                  <span>
                    {previewView === "mobile" ? "Mobile View (360px)" : "Desktop View (600px)"}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2 bg-purple-500"></div>
                  <span>{detectedVariables.length} variables available for editing</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">Variables updated in real-time</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEditor = () => {
    return (
      <textarea
        value={templateHtml}
        onChange={(e) => setTemplateHtml(e.target.value)}
        className="w-full h-full bg-gray-700 text-gray-200 p-4 rounded-lg font-mono text-sm resize-none"
        placeholder="Enter your HTML template here..."
        spellCheck="false"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-9xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Email Template Manager
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewTemplate}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors cursor-pointer flex items-center"
            >
              <FiPlus className="mr-2" /> New Template
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-blue-300">Your Templates</h2>

              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-2 max-h-200 overflow-y-auto">
                  {templates.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <p>No templates yet</p>
                      <p className="text-sm mt-2">Create your first template to get started</p>
                    </div>
                  ) : (
                    templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={`p-3 rounded-md cursor-pointer transition-all border ${
                          selectedTemplate?.id === template.id
                            ? "bg-blue-900 border-blue-500 shadow-lg"
                            : "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500"
                        }`}
                      >
                        <h3 className="font-medium text-white">{template.name}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-400">
                            {new Date(template.createdAt?.toDate()).toLocaleDateString()}
                          </p>
                          {template.usage && template.usage.length > 0 && (
                            <span className="text-xs bg-purple-900 text-purple-200 px-2 py-1 rounded-full">
                              {template.usage.length} use case
                              {template.usage.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        {template.usage && template.usage.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {template.usage.slice(0, 2).map((usage, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full"
                              >
                                {usage}
                              </span>
                            ))}
                            {template.usage.length > 2 && (
                              <span className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded-full">
                                +{template.usage.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Template Name"
                    className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <h2 className="text-xl font-semibold text-white">
                    {selectedTemplate ? selectedTemplate.name : "New Template"}
                  </h2>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors cursor-pointer flex items-center border border-gray-600"
                >
                  {previewMode ? <FiEdit className="mr-2" /> : <FiEye className="mr-2" />}
                  {previewMode ? "Edit" : "Preview"}
                </button>

                {isEditing && (
                  <button
                    onClick={handleSaveTemplate}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 cursor-pointer flex items-center"
                  >
                    <FiSave className="mr-2" /> {loading ? "Saving..." : "Save"}
                  </button>
                )}

                {selectedTemplate && selectedTemplate.id && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md transition-colors cursor-pointer flex items-center"
                  >
                    <FiEdit className="mr-2" /> Edit
                  </button>
                )}

                {selectedTemplate && selectedTemplate.id && (
                  <button
                    onClick={handleDeleteTemplate}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors cursor-pointer flex items-center"
                  >
                    <FiTrash2 className="mr-2" /> Delete
                  </button>
                )}
              </div>
            </div>

            {/* Template Usage Field */}
            {isEditing && (
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Template Usage
                </label>

                <div
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-blue-500 focus:outline-none cursor-pointer flex items-center justify-between"
                  onClick={() => setShowUsageDropdown(!showUsageDropdown)}
                >
                  <div className="flex flex-wrap gap-1">
                    {templateUsage.length > 0 ? (
                      templateUsage.map((usage, index) => (
                        <span
                          key={index}
                          className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs flex items-center"
                        >
                          {usage}
                          <FiX
                            className="ml-1 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleUsageOption(usage);
                            }}
                          />
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">Select usage scenarios...</span>
                    )}
                  </div>
                  {showUsageDropdown ? <FiChevronUp /> : <FiChevronDown />}
                </div>

                {showUsageDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {usageOptions.map((option) => (
                      <div
                        key={option}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-600 flex items-center ${
                          templateUsage.includes(option) ? "bg-blue-800 hover:bg-blue-700" : ""
                        }`}
                        onClick={() => toggleUsageOption(option)}
                      >
                        <input
                          type="checkbox"
                          checked={templateUsage.includes(option)}
                          onChange={() => {}}
                          className="mr-2 cursor-pointer"
                        />
                        {option}
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-1">
                  Select where this template will be used
                </p>
              </div>
            )}

            {!isEditing && templateUsage && templateUsage.length > 0 && (
              <div className="mb-4 bg-blue-900/30 border border-blue-700 rounded-md p-3">
                <p className="text-blue-200 text-sm font-medium mb-2 flex items-center">
                  <FiTag className="mr-1" /> Usage Scenarios:
                </p>
                <div className="flex flex-wrap gap-2">
                  {templateUsage.map((usage, index) => (
                    <span
                      key={index}
                      className="bg-blue-700 text-blue-200 px-3 py-1 rounded-full text-xs"
                    >
                      {usage}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="h-250 mb-4 min-h-[600px]">
              {previewMode ? renderPreview() : renderEditor()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
