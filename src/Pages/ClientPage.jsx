import { useEffect, useState } from "react";
import { getClients } from "@/api/clients";
import Sidebar from "@/components/Sidebar";

export default function ClientPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getClients().then((res) => setClients(res));
  }, []);

  const filteredClients = clients.filter((c) =>
    `${c.name} ${c.dni}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-1 bg-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Servicios</h1>
            <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Clientes Registrados</h2>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o cédula..."
          className="border p-2 rounded w-full md:w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Aquí podrías colocar un botón para añadir nuevo cliente */}
        {/* <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Nuevo Cliente</button> */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Cédula</th>
              <th className="p-2">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.dni}</td>
                <td className="p-2">{c.phone || "N/D"}</td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No se encontraron clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
          </main>
        </div>
    
  );
}
