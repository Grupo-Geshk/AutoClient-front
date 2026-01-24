import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

const COLORS = ["#7C3AED", "#06B6D4", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#22D3EE"];

export default function MostRequestedServicesCard({ topServices = [] }) {
  // Transform backend data to chart format
  const chartData = (topServices || []).map((service) => ({
    name: service.serviceType,
    value: service.count,
  }));

  const hasData = chartData.length > 0;

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Distribución de servicios
      </h3>

      <div className="h-80">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.value}`}
                labelLine={false}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} servicios`, name]} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "14px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sin datos para visualizar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

