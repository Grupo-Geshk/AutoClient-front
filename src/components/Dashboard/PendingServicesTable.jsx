export default function PendingServicesTable({
  range,
  rows = [],
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="rounded-2xl border flex flex-col justify-between border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 min-h-full">
      <div>
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="font-medium">Servicios Pendientes</h3>
          <span className="text-xs text-zinc-400">{range?.label}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-zinc-500">
              <tr>
                <th className="px-4 py-2">Placa</th>
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Servicio</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={i}
                  className="border-t border-zinc-100 dark:border-zinc-800"
                >
                  <td className="px-4 py-2 font-medium">{r.plate}</td>
                  <td className="px-4 py-2">{r.client}</td>
                  <td className="px-4 py-2">{r.service}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-zinc-500"
                  >
                    No hay pendientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-500">
          Página {page} de {pages} · {total} resultados
        </div>
        <div className="flex items-center gap-2">
          <select
            className="px-2 py-1 border text-zinc-500 font-semibold rounded-md bg-transparent"
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          >
            {[6, 8].map((z) => (
              <option  key={z} value={z}>
                {z} - pág
              </option>
            ))}
          </select>
          <button
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
            className="px-3 py-1.5 border rounded-md disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            disabled={page >= pages}
            onClick={() => onPageChange?.(page + 1)}
            className="px-3 py-1.5 border rounded-md disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
