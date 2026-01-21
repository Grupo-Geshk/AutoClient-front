import DateRangeControls from "./DateRangeControls";

export default function DashboardHeader({ onRangeChange, range }) {
  const formatRangeText = () => {
    if (!range) return "";
    const start = range.start.toLocaleDateString("es-PA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const end = range.end.toLocaleDateString("es-PA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `Mostrando datos del ${start} al ${end}`;
  };

  return (
    <section className="bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Resumen</h1>
            {range ? (
              <p className="text-sm text-zinc-500 font-thin">{formatRangeText()}</p>
            ) : (
              <p className="text-sm text-zinc-500 font-thin">
                Selecciona un rango de fechas para ver el resumen
              </p>
            )}
          </div>
          <div className="md:min-w-[560px]">
            <DateRangeControls onChange={onRangeChange} />
          </div>
        </div>
      </div>
    </section>
  );
}
