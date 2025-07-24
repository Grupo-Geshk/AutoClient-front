export default function CarCard({ plateNumber, brand, model }) {
  return (
    <div className="bg-white border shadow-sm rounded-xl p-5 flex flex-col gap-1">
      <div className="text-4xl font-bold text-gray-800">{plateNumber}</div>

      <div className="flex gap-3">
        <span>
            <div className="mt-2 text-sm text-gray-500">Marca</div>
            <div className="text-base text-gray-700">{brand}</div>
        </span>
        <span>
            <div className="mt-2 text-sm text-gray-500">Modelo</div>
            <div className="text-base text-gray-700">{model}</div>
        </span>
        
      </div>
    </div>
  )
}
