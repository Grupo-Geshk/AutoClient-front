import { PendingIcon } from "@/components/icons/ServicesIcons";
import { CompletedIcon } from "@/components/icons/StatsIcons";

export default function StatusBadge({ status }) {
  const statusConfig = {
    pending: {
      label: "Pendiente",
      icon: <PendingIcon />,
      className: "bg-yellow-50 text-yellow-800 ring-1 ring-yellow-600/20",
    },
    completed: {
      label: "Completado",
      icon: <CompletedIcon />,
      className: "bg-green-50 text-green-800 ring-1 ring-green-600/20",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      <span className="w-4 h-4 shrink-0">{config.icon}</span>
      {config.label}
    </span>
  );
}
