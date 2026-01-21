import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonSummary() {
  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[0,1,2].map((k) => (
          <div key={k} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-40 mt-4" />
          </div>
        ))}
      </section>

      {/* Cuerpo inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda */}
        <div className="space-y-6">
          {/* Trabajador top */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 p-4 text-center space-y-3">
            <Skeleton className="h-10 w-10 rounded-full mx-auto" />
            <Skeleton className="h-4 w-40 mx-auto" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </div>
          {/* Pie chart */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 p-4 flex flex-col items-center space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-44 w-44 rounded-full" />
            <div className="w-full space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </div>

        {/* Tabla derecha */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 p-4">
          <Skeleton className="h-6 w-48 mb-4" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 mb-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
          {/* paginación fantasma */}
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
