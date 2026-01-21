import { useEffect, useState } from "react"
import { getSummary } from "@/api/dashboard"

export function useDashboardSummary(from, to) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!from || !to) return

    setLoading(true)
    getSummary(from.toISOString(), to.toISOString())
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [from, to])

  return { data, loading, error }
}
