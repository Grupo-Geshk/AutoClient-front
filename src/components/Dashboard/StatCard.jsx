// src/components/Dashboard/StatCard.jsx
export default function StatCard({ icon, title, value, subtitle, color }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border p-5 flex flex-col gap-2 transition hover:shadow-xl hover:-translate-y-0.5 duration-200">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <div
            className={`rounded-xl flex items-center justify-center ${color?.text || "text-gray-100"}`}
          >
            {icon}
          </div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
        </span>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        {value}
      </h2>
      {subtitle && (
        <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}
