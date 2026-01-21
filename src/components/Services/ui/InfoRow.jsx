export default function InfoRow({ icon = null, label, value }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      {icon && <span className="shrink-0 text-gray-500">{icon}</span>}
      <span className="text-gray-500">{label}:</span>
      <span className="font-medium text-gray-900 truncate" title={String(value)}>
        {value}
      </span>
    </div>
  );
}
