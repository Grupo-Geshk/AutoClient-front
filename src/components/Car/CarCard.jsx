import React, { useState, useEffect } from "react";
import { getClientById } from "@/api/clients";

export default function CarCard({ plateNumber, brand, model, imageUrl, clientId }) {
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    const fetchClient = async () => {
      const res = await getClientById(clientId);
      setClientName(res.data.name || "Cliente Desconocido");
    };
    fetchClient();
  }, [clientId]);

  return (
    <>
      <div className="cursor-pointer bg-white rounded-xl shadow-lg border hover:shadow-lg transition-transform transform hover:scale-105 overflow-hidden flex flex-col">
        <div className="h-60 bg-gray-100">
          <img
            src={imageUrl || "/default-car-image.jpg"}  
            alt="Just a car."
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="text-2xl font-bold text-gray-800">{plateNumber}</div>
          <div className="text-md font-medium text-gray-500">{clientName}</div>

          <div className="flex flex-col">
            <span>
              <div className="mt-2 text-sm text-gray-500">Marca y Modelo</div>
            </span>
            <span className="flex gap-1 items-center">
              <div className="bg-slate-200 px-2 rounded-md">{model}</div>
              <div className="bg-slate-200 px-2 rounded-md">{brand}</div>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
