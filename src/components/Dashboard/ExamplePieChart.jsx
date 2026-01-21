import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

const COLORS = ["#7C3AED","#06B6D4","#F59E0B","#10B981","#EF4444","#8B5CF6","#22D3EE"];

export default function ExamplePieChart({ range, data = [] }) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Servicios más solicitados
        </h3>
      </div>

      <div className="h-64">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full grid place-items-center">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sin datos en este rango
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
