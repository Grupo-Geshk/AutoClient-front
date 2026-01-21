import { useState, useEffect } from "react";
import { getClients } from "../../api/clients";
import { sendClientNotification } from "../../api/notifications";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";

const TEMPLATE_OPTIONS = [
  {
    value: "CarReady",
    label: "Auto Listo",
    description: "Notificar al cliente que su vehículo está listo para recoger"
  },
  {
    value: "UpcomingVisit",
    label: "Recordatorio de Próxima Visita",
    description: "Recordar al cliente sobre una visita de mantenimiento próxima"
  },
  {
    value: "PartsNeeded",
    label: "Repuestos Necesarios / Trabajo Pausado",
    description: "Informar al cliente que se necesitan repuestos para continuar el servicio"
  }
];

export default function ManualTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [partsDescription, setPartsDescription] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState(null);

  // Debounced client search
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

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "El correo electrónico es requerido";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Ingresa un correo electrónico válido";
    }
    return "";
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setEmail(client.email || "");
    setSearchResults([]);
    setSearchTerm("");
    setMessage(null);
    setEmailError("");
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (emailError) {
      setEmailError(validateEmail(newEmail));
    }
  };

  const handleSend = async () => {
    // Validation
    if (!selectedClient) {
      setMessage({ type: "error", text: "Por favor selecciona un cliente primero." });
      return;
    }

    if (!selectedTemplate) {
      setMessage({ type: "error", text: "Por favor selecciona una plantilla." });
      return;
    }

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      setMessage({ type: "error", text: emailValidationError });
      const emailInput = document.getElementById("email-input");
      if (emailInput) emailInput.focus();
      return;
    }

    setIsSending(true);
    setMessage(null);
    setEmailError("");

    try {
      const payload = {
        clientId: selectedClient.id,
        templateType: selectedTemplate,
        emailOverride: email !== selectedClient.email ? email : null,
        partsDescription: selectedTemplate === "PartsNeeded" ? partsDescription : null
      };

      await sendClientNotification(payload);
      setMessage({ type: "success", text: "Correo enviado exitosamente!" });

      // Reset form fields but keep client selected
      setSelectedTemplate("");
      setPartsDescription("");

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al enviar el correo. Intenta de nuevo.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsSending(false);
    }
  };

  const isFormValid = selectedClient && selectedTemplate && email.trim() && !validateEmail(email);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enviar Correo Manual</CardTitle>
          <CardDescription>
            Envía notificaciones por correo personalizadas a clientes individuales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Client Search */}
          <div className="space-y-2">
            <label htmlFor="client-search" className="text-sm font-medium">
              Buscar Cliente <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="client-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Escribe el nombre del cliente para buscar..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSending}
              />
              {isSearching && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="border border-gray-300 rounded-md max-h-48 overflow-y-auto shadow-lg bg-white z-10">
                {searchResults.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleSelectClient(client)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-gray-600">
                      {client.email || <span className="text-amber-600">Sin correo registrado</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Client Display */}
          {selectedClient && (
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-blue-900">Seleccionado: {selectedClient.name}</div>
                  {selectedClient.phone && (
                    <div className="text-sm text-blue-700">{selectedClient.phone}</div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedClient(null);
                    setEmail("");
                    setSelectedTemplate("");
                    setPartsDescription("");
                    setMessage(null);
                    setEmailError("");
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  disabled={isSending}
                >
                  Limpiar
                </button>
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email-input" className="text-sm font-medium">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="cliente@ejemplo.com"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                emailError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              disabled={!selectedClient || isSending}
            />
            {emailError && (
              <p className="text-sm text-red-600">{emailError}</p>
            )}
            {selectedClient && !selectedClient.email && !emailError && (
              <p className="text-sm text-amber-600">
                Este cliente no tiene correo registrado. Ingresa uno manualmente.
              </p>
            )}
          </div>

          {/* Template Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Plantilla de Mensaje <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {TEMPLATE_OPTIONS.map((template) => (
                <label
                  key={template.value}
                  className={`flex items-start p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedTemplate === template.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  } ${!selectedClient || isSending ? "opacity-50 cursor-not-allowed" : ""}`}
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
                Descripción de Repuestos <span className="text-gray-500">(opcional)</span>
              </label>
              <textarea
                id="parts-description"
                value={partsDescription}
                onChange={(e) => setPartsDescription(e.target.value)}
                placeholder="ej., Pastillas de freno delanteras, Filtro de aire"
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
            disabled={!isFormValid || isSending}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              !isFormValid || isSending
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSending ? "Enviando..." : "Enviar Correo"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
