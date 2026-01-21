import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { getNotificationSettings, updateNotificationSettings } from "../../api/notifications";

export default function AutomationsTab() {
  const [settings, setSettings] = useState({
    vehicleDeliveredEnabled: false,
    vehicleDeliveredTemplate: "CarReady",
    onlyIfEmailExists: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await getNotificationSettings();
      setSettings(data || {
        vehicleDeliveredEnabled: false,
        vehicleDeliveredTemplate: "CarReady",
        onlyIfEmailExists: true
      });
    } catch (error) {
      console.error("Error loading settings:", error);
      setMessage({ type: "error", text: "Error al cargar la configuración de automatizaciones." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (updatedSettings) => {
    setIsSaving(true);
    setMessage(null);
    try {
      await updateNotificationSettings(updatedSettings);
      setSettings(updatedSettings);
      setMessage({ type: "success", text: "Configuración guardada exitosamente!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ type: "error", text: "Error al guardar la configuración. Intenta de nuevo." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleEnabled = (e) => {
    const newSettings = { ...settings, vehicleDeliveredEnabled: e.target.checked };
    setSettings(newSettings);
    handleSave(newSettings);
  };

  const handleTemplateChange = (e) => {
    const newSettings = { ...settings, vehicleDeliveredTemplate: e.target.value };
    setSettings(newSettings);
    handleSave(newSettings);
  };

  const handleSafetyToggle = (e) => {
    const newSettings = { ...settings, onlyIfEmailExists: e.target.checked };
    setSettings(newSettings);
    handleSave(newSettings);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        Cargando configuración de automatizaciones...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Automatización de Entrega de Vehículos</CardTitle>
          <CardDescription>
            Envía notificaciones automáticas por correo cuando un servicio es marcado como entregado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center h-5">
              <input
                id="delivery-toggle"
                type="checkbox"
                checked={settings.vehicleDeliveredEnabled}
                onChange={handleToggleEnabled}
                disabled={isSaving}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="delivery-toggle"
                className="font-medium text-gray-900 cursor-pointer"
              >
                Enviar correo cuando un vehículo es entregado
              </label>
              <p className="text-sm text-gray-600 mt-1">
                El sistema enviará automáticamente la plantilla de correo seleccionada al cliente cuando un servicio sea marcado como "Entregado"
              </p>
            </div>
          </div>

          {/* Template Selector */}
          <div className="space-y-2">
            <label htmlFor="template-select" className="block text-sm font-medium text-gray-900">
              Plantilla de Correo de Entrega
            </label>
            <select
              id="template-select"
              value={settings.vehicleDeliveredTemplate}
              onChange={handleTemplateChange}
              disabled={!settings.vehicleDeliveredEnabled || isSaving}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="CarReady">Auto listo / Entregado</option>
              {/* Additional templates can be added here */}
            </select>
            <p className="text-xs text-gray-500">
              Esta plantilla se usará para todas las notificaciones automáticas de entrega. Más plantillas pueden agregarse después.
            </p>
          </div>

          {/* Safety Option */}
          <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center h-5">
              <input
                id="safety-toggle"
                type="checkbox"
                checked={settings.onlyIfEmailExists}
                onChange={handleSafetyToggle}
                disabled={!settings.vehicleDeliveredEnabled || isSaving}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="safety-toggle"
                className="font-medium text-amber-900 cursor-pointer"
              >
                Solo enviar si el cliente tiene un correo registrado
              </label>
              <p className="text-sm text-amber-700 mt-1">
                Cuando está habilitado, el sistema omitirá el envío a clientes sin correo electrónico. El intento será registrado como "Omitido: falta correo".
              </p>
            </div>
          </div>

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
        </CardContent>
      </Card>
    </div>
  );
}
