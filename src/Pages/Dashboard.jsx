import { useEffect, useState } from "react";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import PrimarySummaryCards from "../components/Dashboard/PrimarySummaryCards";
import SecondaryMetrics from "../components/Dashboard/SecondaryMetrics";
import MostRequestedServicesCard from "../components/Dashboard/MostRequestedServicesCard";
import NextActionsCard from "../components/Dashboard/NextActionsCard";
import DashboardSkeleton from "../components/Dashboard/DashboardSkeleton";
import { getSummary } from "../api/dashboard";

export default function Dashboard() {
  const [range, setRange] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!range) return;

    const s = range.start;
    const e = range.end;
    const fromUTC = new Date(Date.UTC(s.getFullYear(), s.getMonth(), s.getDate(), 0, 0, 0, 0));
    const toUTC = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59, 999));

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        setSummary(null);
        const { data } = await getSummary(fromUTC.toISOString(), toUTC.toISOString());
        if (!alive) return;
        setSummary(data);
      } catch (err) {
        console.error("Dashboard error:", err);
        if (alive) {
          setError(err.response?.data?.message || "Error al cargar el resumen");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [range?.start?.getTime(), range?.end?.getTime()]);

  // Check if all key metrics are zero
  const hasActivity = summary && (
    summary.completedCount > 0 ||
    summary.pendingCount > 0 ||
    summary.totalRevenue > 0
  );

  // Calculate workload percentage: completed / (completed + pending) * 100
  const workloadPercentage = summary
    ? (summary.completedCount + summary.pendingCount) > 0
      ? (summary.completedCount / (summary.completedCount + summary.pendingCount)) * 100
      : 0
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Header Section - Context */}
      <DashboardHeader onRangeChange={setRange} range={range} />

      {/* Main Content */}
      <main className="mx-auto px-4 py-8 max-w-7xl">
        {loading || !range ? (
          <DashboardSkeleton />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 text-center">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        ) : !hasActivity ? (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Sin actividad en el rango seleccionado
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No se encontraron servicios ni ingresos en este período
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* PRIMARY SUMMARY - Most Important Business Information */}
            <section>
              <PrimarySummaryCards summary={summary} workloadPercentage={workloadPercentage} />
            </section>

            {/* SECONDARY METRICS - Supporting Context */}
            <section>
              <SecondaryMetrics summary={summary} />
            </section>

            {/* VISUALIZATION & OPERATIONAL DATA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Distribution Analysis Visualization */}
              <section>
                <MostRequestedServicesCard topServices={summary.topServices} />
              </section>

              {/* Immediate Actions - Operational Focus */}
              <section>
                <NextActionsCard nextActions={summary.nextActions} />
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
