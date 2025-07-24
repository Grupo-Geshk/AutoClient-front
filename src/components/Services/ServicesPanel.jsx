import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getAllServices } from "@/api/services";

export default function ServicesPanel() {
  const [services, setServices] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllServices().then((res) => {
      console.log("Servicios que llegan del backend:", res);
      setServices(res);
    });
  }, []);

  const isPending = (s) => !s.exitDate;

  const filteredServices = services.filter((s) => {
    const matchesStatus =
      statusFilter === ""
        ? true
        : statusFilter === "completed"
        ? !isPending(s)
        : isPending(s);

    const matchesSearch = s.plateNumber?.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  function handleExport() {
    const data = filteredServices.map((s) => ({
      Placa: s.plateNumber,
      Cliente: s.clientName,
      Entrada: s.entryDate,
      Salida: s.exitDate || "Pendiente",
      Estado: s.exitDate ? "Completado" : "Pendiente",
      Kilometraje: s.mileage + " km",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Servicios");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "servicios.xlsx");
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("es-PA");
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Servicios Registrados</h2>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <select className="border p-2 rounded" onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completados</option>
          </select>

          <input
            type="text"
            placeholder="Buscar por placa..."
            className="border p-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
        >
          Exportar a Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Placa</th>
              <th className="p-2">Cliente</th>
              <th className="p-2">Entrada</th>
              <th className="p-2">Salida</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Kilometraje</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-2">{s.plateNumber}</td>
                <td className="p-2">{s.clientName}</td>
                <td className="p-2">{formatDate(s.entryDate)}</td>
                <td className="p-2">{s.exitDate ? formatDate(s.exitDate) : "Pendiente"}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-white text-xs ${isPending(s) ? "bg-yellow-500" : "bg-green-500"}`}>
                    {isPending(s) ? "Pendiente" : "Completado"}
                  </span>
                </td>
                <td className="p-2">{s.mileage} km</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
