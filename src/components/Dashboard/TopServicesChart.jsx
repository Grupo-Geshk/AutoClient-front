import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

const COLORS = ["#64748b", "#475569", "#334155", "#1e293b", "#0f172a"]

export default function TopServicesChart({ services }) {
  const hasData = services && services.length > 0

  return (
    <Card className="w-full shadow-sm border rounded-xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Servicios más realizados
        </CardTitle>
        <CardDescription>
          Basado en los servicios completados en el rango actual
        </CardDescription>
      </CardHeader>

      <CardContent className="h-[250px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={services} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="service" width={120} />
              <Tooltip />
              <Bar dataKey="count">
                {services.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            No hay datos disponibles para este rango.
          </p>
        )}
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground justify-center">
        Muestra los 5 servicios más realizados
      </CardFooter>
    </Card>
  )
}
