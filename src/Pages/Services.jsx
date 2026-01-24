// src/pages/Services.jsx
import ServicesPanel from "@/components/Services/panel/ServicesPanel";

export default function Services() {
  return (
    <div className="w-full mx-auto max-w-6xl">
      {/* Centered Search Header */}
      <div className="text-center mb-8 space-y-3">
        <h1 className="text-3xl font-semibold text-gray-900">Búsqueda</h1>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
          Encuentra servicios por nombre, placa o teléfono. Usa los filtros para refinar resultados por estado, rango de fechas o preferencias de ordenamiento.
        </p>
      </div>

      {/* Results Container */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-4 md:p-6">
        <ServicesPanel />
      </div>
    </div>
  );
}
