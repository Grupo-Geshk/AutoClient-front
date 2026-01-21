// src/pages/ClientPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { getClients } from "@/api/clients";
import ClientCard from "@/components/Clients/ClientCard";
import AddClientModal from "@/components/Clients/AddClientModal";

export default function ClientPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const debounceRef = useRef(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;
  const fetchClients = async (q = "") => {
    setLoading(true);
    try {
      const data = await getClients(q);
      setClients(data);
    } finally {
      setLoading(false);
    }
  };

  // carga inicial
  useEffect(() => {
    fetchClients();
  }, []);

  // búsqueda reactiva con debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchClients(search.trim());
      setPage(1); // al cambiar búsqueda, vuelve a página 1
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // ====== Helpers de normalización y ranking ======
  const normText = (s = "") =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // quita acentos
  const digits = (s = "") => s.replace(/\D/g, "");

  // Devuelve una puntuación más alta para mejores coincidencias
  const scoreClient = (c, q) => {
    const qTxt = normText(q);
    const qDig = digits(q);
    const name = normText(c.name || "");
    const phone = digits(c.phone || "");

    // si no hay query, sin preferencia
    if (!qTxt && !qDig) return 0;

    // Teléfono (estricto por dígitos consecutivos)
    if (qDig) {
      if (phone === qDig) return 100; // match exacto
      if (phone.startsWith(qDig)) return 90; // empieza con
      const idxP = phone.indexOf(qDig);
      if (idxP !== -1) return 80 - idxP * 0.01; // contiene (ajuste por posición)
    }

    // Nombre (subcadena consecutiva, sin acentos)
    if (qTxt) {
      if (name.startsWith(qTxt)) return 60;
      const idxN = name.indexOf(qTxt);
      if (idxN !== -1) return 50 - idxN * 0.01;
    }
    return -1; // no coincide
  };

  // Filtrado estricto + ordenado por puntuación
  const sortedFiltered = useMemo(() => {
    const q = search.trim();
    if (!q) return [...clients];
    const items = [];
    for (const c of clients) {
      const s = scoreClient(c, q);
      if (s >= 0) items.push({ c, s });
    }
    // Orden descendente por score
    items.sort((a, b) => b.s - a.s);
    return items.map((x) => x.c);
  }, [clients, search]);

  const total = useMemo(() => sortedFiltered.length, [sortedFiltered]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedFiltered.slice(start, start + PAGE_SIZE);
  }, [sortedFiltered, page]);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        {/* caja de totales */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-300/60 dark:border-gray-700/60 shadow-sm">
            Total de Clientes: <span className="font-semibold">{total}</span>
            {search && <> • Coincidencias para “{search}”</>}
          </p>
        </div>

        {/* buscador estilizado */}
        <div className="w-full sm:w-[420px] relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            {/* icono lupa (heroicon) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-gray-400"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 4.252 11.938l3.78 3.78a.75.75 0 1 0 1.06-1.06l-3.78-3.78A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Busca por nombre o teléfono"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-300/70 dark:border-slate-700/70
                       text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded-lg
                         bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
              title="Limpiar"
            >
              Limpiar
            </button>
          )}
          {loading && (
            <span className="absolute right-20 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              buscando…
            </span>
          )}
        </div>

        <button
          className="whitespace-nowrap bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm"
          onClick={() => setAddModalOpen(true)}
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* grid de resultados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginated.map((c) => (
          <ClientCard key={c.id} client={c} />
        ))}
        {!loading && clients.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No se encontraron clientes.
          </p>
        )}
      </div>
       {/* Paginación */}
      {clients.length > 0 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          <button
            className="px-3 py-2 rounded-md border border-gray-300 bg-white disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-2 rounded-md border border-gray-300 ${
                page === i + 1 ? "bg-gray-200 font-semibold" : "bg-white hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-2 rounded-md border border-gray-300 bg-white disabled:opacity-40"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}

      <AddClientModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onClientAdded={() => fetchClients(search)}
      />
    </>
  );
}
