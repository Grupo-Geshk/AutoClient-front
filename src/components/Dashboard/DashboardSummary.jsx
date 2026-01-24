import StatCard from "./StatCard";
import SkeletonSummary from "./SkeletonSummary";

import {
  MoneyIcon,
  PendingIcon,
  CompleteIcon,
} from "@/components/icons/DashboardIcons";

export default function DashboardSummary({ range, data }) {
  if (!data) return <SkeletonSummary />;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <StatCard
        icon={<CompleteIcon className="w-6 h-6" />}
        title="Completados"
        value={data.completed ?? 0}
        subtitle={range?.label}
        color={{ text: "text-green-600" }}
      />
      <StatCard
        icon={<MoneyIcon className="w-6 h-6 " />}
        title="Ingresos"
        value={data.revenueFormatted ?? "$0.00"}
        subtitle={range?.label}
        color={{ text: "text-emerald-600" }}
      />
      <StatCard
        icon={<PendingIcon className="w-6 h-6 " />}
        title="Pendientes"
        value={data.pending ?? 0}
        subtitle="En general"
        color={{ text: "text-amber-600" }}
      />
    </section>
  );
}
