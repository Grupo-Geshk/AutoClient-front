import { useState, useEffect, useCallback } from "react";
import { getClients } from "../../api/clients";
import { sendClientNotification, getNotificationLogs } from "../../api/notifications";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const TEMPLATE_OPTIONS = [
  {
    value: "CarReady",
    label: "Car Ready",
    description: "Notify client that their vehicle is ready for pickup"
  },
  {
    value: "UpcomingVisit",
    label: "Upcoming Service",
    description: "Remind client about an upcoming maintenance visit"
  },
  {
    value: "PartsNeeded",
    label: "Parts Needed",
    description: "Inform client that parts are needed to continue the service"
  }
];

export default function ClientCommunicationPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [email, setEmail] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [partsDescription, setPartsDescription] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Debounced search
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await getClients(searchTerm);
        setSearchResults(results || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load logs when selectedClient changes
  useEffect(() => {
    loadLogs();
  }, [selectedClient]);

  const loadLogs = useCallback(async () => {
    setIsLoadingLogs(true);
    try {
      const params = selectedClient ? { clientId: selectedClient.id } : { limit: 50 };
      const data = await getNotificationLogs(params);
      setLogs(data || []);
    } catch (error) {
      console.error("Error loading logs:", error);
      setLogs([]);
    } finally {
      setIsLoadingLogs(false);
    }
  }, [selectedClient]);

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setEmail(client.email || "");
    setSearchResults([]);
    setSearchTerm("");
    setMessage(null);
  };

  const handleSend = async () => {
    // Validation
    if (!selectedClient) {
      setMessage({ type: "error", text: "Please select a client first." });
      return;
    }

    if (!selectedTemplate) {
      setMessage({ type: "error", text: "Please select a template." });
      return;
    }

    if (!email.trim()) {
      setMessage({ type: "error", text: "Please provide an email address." });
      const emailInput = document.getElementById("email-input");
      if (emailInput) emailInput.focus();
      return;
    }

    setIsSending(true);
    setMessage(null);

    try {
      const payload = {
        clientId: selectedClient.id,
        templateType: selectedTemplate,
        emailOverride: email !== selectedClient.email ? email : null,
        partsDescription: selectedTemplate === "PartsNeeded" ? partsDescription : null
      };

      await sendClientNotification(payload);
      setMessage({ type: "success", text: "Email sent successfully!" });

      // Reset form
      setSelectedTemplate("");
      setPartsDescription("");

      // Reload logs
      loadLogs();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send email. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Communication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Client Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search Client</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type client name to search..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSending}
              />
              {isSearching && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="border border-gray-300 rounded-md max-h-48 overflow-y-auto">
                {searchResults.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleSelectClient(client)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-gray-600">{client.email || "No email"}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Client */}
          {selectedClient && (
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-blue-900">Selected: {selectedClient.name}</div>
                  <div className="text-sm text-blue-700">{selectedClient.phone}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedClient(null);
                    setEmail("");
                    setSelectedTemplate("");
                    setPartsDescription("");
                    setMessage(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email-input" className="text-sm font-medium">
              Email Address {!selectedClient?.email && <span className="text-red-500">*</span>}
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedClient || isSending}
            />
            {selectedClient && !selectedClient.email && (
              <p className="text-sm text-amber-600">This client has no email on record. Please enter one manually.</p>
            )}
          </div>

          {/* Template Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Message Template <span className="text-red-500">*</span></label>
            <div className="space-y-2">
              {TEMPLATE_OPTIONS.map((template) => (
                <label
                  key={template.value}
                  className={`flex items-start p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedTemplate === template.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="template"
                    value={template.value}
                    checked={selectedTemplate === template.value}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    disabled={!selectedClient || isSending}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{template.label}</div>
                    <div className="text-sm text-gray-600">{template.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Parts Description (conditional) */}
          {selectedTemplate === "PartsNeeded" && (
            <div className="space-y-2">
              <label htmlFor="parts-description" className="text-sm font-medium">
                Parts Description (optional)
              </label>
              <textarea
                id="parts-description"
                value={partsDescription}
                onChange={(e) => setPartsDescription(e.target.value)}
                placeholder="e.g., Front brake pads, Air filter"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSending}
              />
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div
              className={`p-3 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!selectedClient || !selectedTemplate || !email.trim() || isSending}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              !selectedClient || !selectedTemplate || !email.trim() || isSending
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSending ? "Sending..." : "Send Email"}
          </button>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Send History {selectedClient && `- ${selectedClient.name}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingLogs ? (
            <div className="text-center py-8 text-gray-500">Loading history...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No send history available</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Template</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{formatDate(log.sentAt)}</td>
                      <td className="px-4 py-2">{log.email}</td>
                      <td className="px-4 py-2">
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                          {log.templateType}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {log.success ? (
                          <span className="inline-flex items-center text-green-700">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Sent
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center text-red-700 cursor-help"
                            title={log.errorMessage || "Failed to send"}
                          >
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
