"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell } from "recharts"
import { TrendingUp } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getTopClients } from "@/api/dashboard"

const COLORS = ["#94a3b8", "#64748b", "#475569", "#334155", "#1e293b"]

export default function TopClientsPieChart() {
  const [data, setData] = useState([])
  const now = new Date()

  useEffect(() => {
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    getTopClients(month, year)
      .then((res) => {
        const transformed = res.data.map((client, index) => ({
          name: client.name,
          total: client.count,
          fill: COLORS[index % COLORS.length],
        }))
        setData(transformed)
      })
      .catch((err) => console.error("Error fetching top clients:", err))
  }, [])

  return (
    <Card className="p-4 shadow-sm border rounded-xl w-full h-full">
      <CardHeader className="text-center">
        <CardTitle className="text-base font-semibold">Clientes Frecuentes</CardTitle>
        <CardDescription>
          {now.toLocaleString("default", { month: "long" })} {now.getFullYear()}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Gráfico */}
        <ChartContainer className="w-full h-[250px] flex justify-center items-center">
          {data.length > 0 ? (
            <PieChart width={200} height={200}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={data}
                dataKey="total"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} className="hover:opacity-80 transition-opacity" />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <p className="text-sm text-muted-foreground">No hay datos disponibles.</p>
          )}
        </ChartContainer>

        {/* Lista de clientes */}
        <div className="flex flex-col gap-2 text-sm">
          {data.length > 0 ? (
            data.map((client, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: client.fill }}
                />
                <span className="font-medium truncate">{client.name}</span>
                <span className="ml-auto text-gray-500">
                  {client.total} {client.total === 1 ? "servicio" : "servicios"}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center w-full">
              Sin clientes frecuentes este mes.
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground justify-center pt-2">
        Datos calculados por número de servicios asignados.
      </CardFooter>
    </Card>
  )
}
