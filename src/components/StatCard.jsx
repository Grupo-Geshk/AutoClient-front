import { useEffect, useState } from "react"
import { getTodaySummary } from "@/api/dashboard"
import { TrendingUp, TrendingDown } from "lucide-react"
import { ImportantIcon, CompletedIcon } from "@/components/icons/StatsIcons"

export default function StatCards() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    getTodaySummary()
      .then(res => setSummary(res.data))
      .catch(err => console.error("Error al cargar el resumen", err))
  }, [])

  const cards = [
    {
      icon: <CompletedIcon />,
      label: "Completados",
      value: summary?.totalClosedToday ?? "...",
    },
    {
      icon: <CompletedIcon />,
      label: "Ingresos",
      value: `${summary?.totalRevenueToday?.toFixed(2) ?? "..."} $`,
    },
    {
      icon: <CompletedIcon />,
      label: "Pendientes",
      value: summary?.pendingServices?.length ?? "...",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {card.icon}
              <p className="text-md text-gray-500 font-medium">{card.label}</p>
            </span>
            <ImportantIcon className="h-5 w-5 text-gray-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">{card.value}</h2>
          <div className="flex items-center gap-1 text-xs mt-1">
          </div>
        </div>
      ))}
    </div>
  )
}
