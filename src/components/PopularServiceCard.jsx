import { useEffect, useState } from "react"
import { getTopServices } from "@/api/dashboard"
import { Star } from "lucide-react" // o cualquier ícono representativo

export default function PopularServiceCard() {
  const [service, setService] = useState("")

  useEffect(() => {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    getTopServices(month, year)
      .then(res => {
        if (res.data.length > 0) {
          setService(res.data[0].service)
        }
      })
      .catch(err => console.error("Error al obtener el servicio más popular", err))
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-md border p-5 flex flex-col items-center justify-between">
      {/* Ícono destacado */}
      <div className="bg-violet-100 text-violet-600 p-3 rounded-lg">
        <Star className="h-5 w-5" />
      </div>

      {/* Texto */}
      <div className="flex flex-col text-center">
        <span className="text-sm text-gray-500">Servicio más solicitado</span>
        <h2 className="text-2xl font-semibold text-gray-800">
          {service || "Cargando..."}
        </h2>
      </div>
    </div>
  )
}
