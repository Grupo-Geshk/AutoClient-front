import { useState, useEffect } from "react";
import { getNotificationLogs } from "../../api/notifications";
import { getClients } from "../../api/clients";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { toast } from "react-toastify";

const TEMPLATE_OPTIONS = [
  { value: "CarReady", label: "Auto Listo" },
  { value: "UpcomingVisit", label: "Próxima Visita" },
  { value: "PartsNeeded", label: "Repuestos Necesarios" }
];

const STATUS_OPTIONS = [
  { value: "All", label: "Todos" },
  { value: "Successful", label: "Exitoso" },
  { value: "Failed", label: "Fallido" },
  { value: "Skipped", label: "Omitido" }
];

export default function HistoryTab() {
  // Filters - Use ISO date format that backend can parse
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    date.setHours(0, 0, 0, 0);
    return date.toISOString().slice(0, 10);
  });
  const [dateTo, setDateTo] = useState(() => {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date.toISOString().slice(0, 10);
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [templateFilter, setTemplateFilter] = useState("All");
  const [clientFilter, setClientFilter] = useState(null);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [clientSearchResults, setClientSearchResults] = useState([]);
  const [isClientSearching, setIsClientSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Data
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Load logs when filters change
  useEffect(() => {
    loadLogs();
  }, [dateFrom, dateTo, statusFilter, templateFilter, clientFilter]);

  // Client search debounce
  useEffect(() => {
    if (clientSearchTerm.trim().length < 2) {
      setClientSearchResults([]);
      return;
    }

    setIsClientSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await getClients(clientSearchTerm);
        setClientSearchResults(results || []);
      } catch (error) {
        console.error("Client search error:", error);
        setClientSearchResults([]);
      } finally {
        setIsClientSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [clientSearchTerm]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const params = {
        dateFrom,
        dateTo
      };
      if (statusFilter !== "All") params.status = statusFilter;
      if (templateFilter !== "All") params.templateType = templateFilter;
      if (clientFilter) params.clientId = clientFilter.id;

      console.log("Loading notification logs with params:", params);
      const data = await getNotificationLogs(params);
      console.log("Received notification logs:", data);

      // Ensure data is an array
      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        console.warn("Received non-array response:", data);
        setLogs([]);
      }
    } catch (error) {
      console.error("Error loading logs:", error);
      console.error("Error details:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || error.message || "Error al cargar el historial";
      toast.error(errorMsg);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectClient = (client) => {
    setClientFilter(client);
    setClientSearchResults([]);
    setClientSearchTerm("");
  };

  const handleClearClientFilter = () => {
    setClientFilter(null);
    setClientSearchTerm("");
  };

  const handleShowDetails = (log) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedLog(null);
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

  const getStatusBadge = (log) => {
    if (log.status === "Successful" || log.success === true) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Exitoso
        </span>
      );
    } else if (log.status === "Skipped") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          Omitido
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Fallido
        </span>
      );
    }
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (statusFilter !== "All") count++;
    if (templateFilter !== "All") count++;
    if (clientFilter) count++;
    return count;
  };

  const handleClearAllFilters = () => {
    setStatusFilter("All");
    setTemplateFilter("All");
    setClientFilter(null);
    setClientSearchTerm("");
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    setDateFrom(weekAgo.toISOString().slice(0, 10));
    setDateTo(today.toISOString().slice(0, 10));
  };

  return (
    <div className="space-y-6">
      {/* Filters Dropdown */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filtros</span>
            {getActiveFiltersCount() > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
            <svg
              className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Panel */}
          {showFilters && (
            <div className="absolute top-full mt-2 left-0 z-50 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                    <p className="text-sm text-gray-500 mt-1">Personaliza la búsqueda de notificaciones</p>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Desde
                    </label>
                    <input
                      id="date-from"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Hasta
                    </label>
                    <input
                      id="date-to"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Status and Template Filters */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Estado
                    </label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="template-filter" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tipo de Plantilla
                    </label>
                    <select
                      id="template-filter"
                      value={templateFilter}
                      onChange={(e) => setTemplateFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="All">Todas</option>
                      {TEMPLATE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Client Filter */}
                <div>
                  <label htmlFor="client-filter" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Cliente <span className="text-gray-500 font-normal">(opcional)</span>
                  </label>
                  {clientFilter ? (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-blue-900 truncate">{clientFilter.name}</div>
                        {clientFilter.email && (
                          <div className="text-sm text-blue-700 truncate">{clientFilter.email}</div>
                        )}
                      </div>
                      <button
                        onClick={handleClearClientFilter}
                        className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium shrink-0"
                      >
                        Limpiar
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        id="client-filter"
                        type="text"
                        value={clientSearchTerm}
                        onChange={(e) => setClientSearchTerm(e.target.value)}
                        placeholder="Buscar un cliente..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {isClientSearching && (
                        <div className="absolute right-3 top-2.5">
                          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                      )}
                      {clientSearchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 border border-gray-200 rounded-lg max-h-48 overflow-y-auto shadow-lg bg-white">
                          {clientSearchResults.map((client) => (
                            <button
                              key={client.id}
                              onClick={() => handleSelectClient(client)}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              <div className="font-medium text-sm">{client.name}</div>
                              <div className="text-xs text-gray-500">{client.email || "Sin correo"}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <button
                    onClick={handleClearAllFilters}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Limpiar todos
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {(getActiveFiltersCount() > 0 || clientFilter) && (
          <div className="flex items-center gap-2 flex-wrap">
            {statusFilter !== "All" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                Estado: {STATUS_OPTIONS.find(o => o.value === statusFilter)?.label}
                <button onClick={() => setStatusFilter("All")} className="hover:text-gray-900">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {templateFilter !== "All" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                Plantilla: {TEMPLATE_OPTIONS.find(o => o.value === templateFilter)?.label}
                <button onClick={() => setTemplateFilter("All")} className="hover:text-gray-900">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {clientFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                Cliente: {clientFilter.name}
                <button onClick={handleClearClientFilter} className="hover:text-gray-900">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* History Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Notificaciones</CardTitle>
          <CardDescription>
            Ver todos los intentos de notificación por correo y su estado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              Cargando notificaciones...
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No se encontraron notificaciones para este período.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Enviado</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Cliente</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Correo Destino</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Plantilla</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Estado</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{formatDate(log.sentAt)}</td>
                      <td className="px-4 py-3 font-medium">{log.clientName || "—"}</td>
                      <td className="px-4 py-3">{log.email || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                          {log.templateType}
                        </span>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(log)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleShowDetails(log)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Detalles de Notificación</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Tipo de Plantilla</div>
                <div className="mt-1 text-sm text-gray-900">{selectedLog.templateType}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Correo Destino</div>
                <div className="mt-1 text-sm text-gray-900">{selectedLog.email || "—"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Fecha de Envío</div>
                <div className="mt-1 text-sm text-gray-900">{formatDate(selectedLog.sentAt)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Estado</div>
                <div className="mt-1">{getStatusBadge(selectedLog)}</div>
              </div>
              {selectedLog.errorMessage && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Mensaje de Error</div>
                  <div className="mt-1 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {selectedLog.errorMessage}
                  </div>
                </div>
              )}
              {selectedLog.clientName && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Cliente</div>
                  <div className="mt-1 text-sm text-gray-900">{selectedLog.clientName}</div>
                </div>
              )}
            </div>
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
