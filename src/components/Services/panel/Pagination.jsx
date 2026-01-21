export default function Pagination({ page, totalPages, onPage }) {
  const getPageItems = (current, total) => {
    const items = [];
    const add = (v) => items.push(v);
    if (total <= 7) { for (let i = 1; i <= total; i++) add(i); return items; }
    add(1);
    if (current > 3) add("…");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) add(i);
    if (current < total - 2) add("…");
    add(total);
    return items;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <button
        className="px-3 py-2 rounded-md border border-gray-300 bg-white disabled:opacity-40"
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Anterior
      </button>

      {getPageItems(page, totalPages).map((it, idx) =>
        it === "…" ? (
          <span key={`sep-${idx}`} className="px-2 text-gray-500">…</span>
        ) : (
          <button
            key={it}
            onClick={() => onPage(it)}
            className={`px-3 py-2 rounded-md border border-gray-300 ${
              page === it ? "bg-gray-200 font-semibold" : "bg-white hover:bg-gray-100"
            }`}
          >
            {it}
          </button>
        )
      )}

      <button
        className="px-3 py-2 rounded-md border border-gray-300 bg-white disabled:opacity-40"
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        Siguiente
      </button>
    </div>
  );
}
