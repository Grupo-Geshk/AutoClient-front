import { useEffect, useState } from "react"
import { getPendingServices } from "@/api/dashboard"

const ITEMS_PER_PAGE = 5

export default function PendingServicesTable() {
  const [services, setServices] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    getPendingServices()
      .then(res => setServices(res.data))
      .catch(err => console.error("Error al cargar servicios pendientes", err))
  }, [])

  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE)
  const paginatedServices = services.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const changePage = (delta) => {
    setCurrentPage((prev) => Math.min(Math.max(prev + delta, 1), totalPages))
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Servicios Pendientes</h3>
        {services.length > ITEMS_PER_PAGE && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => changePage(-1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm border rounded disabled:opacity-30"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">{currentPage} / {totalPages}</span>
            <button
              onClick={() => changePage(1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-sm border rounded disabled:opacity-30"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="text-gray-500 border-b text-xs uppercase tracking-wide">
              <th className="py-2">Placa</th>
              <th className="py-2">Cliente</th>
              <th className="py-2">Servicio</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServices.length > 0 ? (
              paginatedServices.map((item, i) => (
                <tr key={i} className="border-b last:border-none hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-800">{item.plate}</td>
                  <td className="py-3 text-gray-700">{item.clientName}</td>
                  <td className="py-3 text-gray-600">{item.serviceType}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-400">
                  No hay servicios pendientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
