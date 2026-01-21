// src/Pages/Notifications.jsx
import { useState } from "react";
import AutomationsTab from "../components/Notifications/AutomationsTab";
import ManualTab from "../components/Notifications/ManualTab";
import HistoryTab from "../components/Notifications/HistoryTab";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("manual");

  return (
    <section className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">Notificaciones</h1>
        <p className="text-sm text-gray-600">
          Gestiona las comunicaciones por correo electrónico con clientes
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("automations")}
          className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "automations"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          Automatizaciones
        </button>
        <button
          onClick={() => setActiveTab("manual")}
          className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "manual"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          Manual
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "history"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          Historial
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "automations" && <AutomationsTab />}
      {activeTab === "manual" && <ManualTab />}
      {activeTab === "history" && <HistoryTab />}
    </section>
  );
}
