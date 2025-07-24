import { useState, useEffect } from "react"
import { createService } from "@/api/services"

export default function AddServiceModal({ isOpen, onClose,lastMileage = 0, vehicleId, onSuccess }) {
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 16))
  const [mileage, setMileage] = useState(lastMileage);
  const [serviceType, setServiceType] = useState("")
  const [description, setDescription] = useState("")
  const [mechanicNotes, setMechanicNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createService({
        vehicleId,
        entryDate,
        mileage: parseInt(mileage),
        serviceType,
        description,
        mechanicNotes
      })
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error("Error al crear servicio:", err)
    } finally {
      setLoading(false)
    }
  }

    useEffect(() => {
    if (isOpen) {
        setEntryDate(new Date().toISOString().slice(0, 16));
        setMileage(lastMileage); // ← este es el fix importante
        setServiceType("");
        setDescription("");
        setMechanicNotes("");
    }
    }, [isOpen, lastMileage]);
  
    if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Registrar Nuevo Servicio</h2>
          <button onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Fecha y Hora de Entrada</label>
            <input
              type="datetime-local"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Kilometraje</label>
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tipo de Servicio</label>
            <input
              type="text"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm shadow-sm"
              placeholder="Cambio de aceite, alineación, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Descripción (piezas, trabajos, etc.)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm shadow-sm"
              rows={3}
              placeholder="Cambio de pastillas de freno, revisión de suspensión..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Notas del mecánico (opcional)</label>
            <textarea
              value={mechanicNotes}
              onChange={(e) => setMechanicNotes(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm shadow-sm"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              {loading ? "Guardando..." : "Registrar Servicio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
