// src/pages/Car.jsx
import { useEffect, useMemo, useState } from "react";
import CarCard from "@/components/Car/CarCard";
import { getVehicles, getVehicleByPlate } from "@/api/vehicles";
import { motion } from "framer-motion";
import VehicleModal from "@/components/Car/VehicleModal";
import AddVehicleModal from "@/components/Car/AddVehicleModal";

export default function Car() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [brandFilter, setBrandFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [searchPlate, setSearchPlate] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const openVehicleModal = async (vehicle) => {
    try {
      const detailed = await getVehicleByPlate(vehicle.plateNumber);
      setSelectedVehicle(detailed);
      setModalOpen(true);
    } catch (err) {
      console.error("Error obteniendo detalles:", err);
    }
  };

  const brands = useMemo(
    () => [...new Set(vehicles.map((v) => v.brand))].filter(Boolean),
    [vehicles]
  );
  const models = useMemo(
    () => [...new Set(vehicles.map((v) => v.model))].filter(Boolean),
    [vehicles]
  );

  useEffect(() => {
    const fetchVehicles = async () => {
      const data = await getVehicles();
      setVehicles(data);
      setFilteredVehicles(data);
    };
    fetchVehicles();
  }, []);

  // Filtrado dinámico
  useEffect(() => {
    let filtered = vehicles;

    if (brandFilter) filtered = filtered.filter((v) => v.brand === brandFilter);
    if (modelFilter) filtered = filtered.filter((v) => v.model === modelFilter);
    if (searchPlate.trim()) {
      const q = searchPlate.trim().toLowerCase();
      filtered = filtered.filter((v) =>
        (v.plateNumber || "").toLowerCase().includes(q)
      );
    }

    setFilteredVehicles(filtered);
    setCurrentPage(1);
  }, [brandFilter, modelFilter, searchPlate, vehicles]);

  const totalPages = Math.ceil(filteredVehicles.length / pageSize) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVehicles.slice(start, start + pageSize);
  }, [filteredVehicles, currentPage]);

  // === NUEVO: contadores
  const totalVehicles = vehicles.length;
  const filteredCount = filteredVehicles.length;
  const showingStart = (currentPage - 1) * pageSize + 1;
  const showingEnd = Math.min(currentPage * pageSize, filteredCount);

  return (
    <>
      {/* Encabezado con conteo */}
      <div className="mb-4 flex">
        <p className="text-sm text-gray-500 bg-gray-200 p-2 rounded-full border-2 border-gray-400">
          Total de Vehículos: <span className="font-semibold">{totalVehicles}</span>
          {searchPlate || brandFilter || modelFilter ? (
            <>
              {" • "}Coincidencias:{" "}
              <span className="font-semibold ">{filteredCount}</span>
              {filteredCount > 0 && (
                <> ({showingStart}–{showingEnd})</>
              )}
            </>
          ) : null}
        </p>
      </div>

      {/* Filtros */}
      <section className="bg-white shadow-sm border rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Buscar placa..."
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              className="px-4 py-1.5 border rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-4 py-1.5 border rounded-md text-sm shadow-sm"
            >
              <option value="">Marca</option>
              {brands.map((brand, i) => (
                <option key={i} value={brand}>
                  {brand} ({vehicles.filter((v) => v.brand === brand).length})
                </option>
              ))}
            </select>

            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="px-4 py-1.5 border rounded-md text-sm shadow-sm"
            >
              <option value="">Modelo</option>
              {models.map((model, i) => (
                <option key={i} value={model}>
                  {model} ({vehicles.filter((v) => v.model === model).length})
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setBrandFilter("");
                setModelFilter("");
                setSearchPlate("");
              }}
              className="px-4 py-1.5 text-sm border rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Limpiar filtros
            </button>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-1.5 text-sm border rounded-md bg-violet-500 text-white hover:bg-violet-600"
          >
            + Añadir Vehículo
          </button>
        </div>
      </section>

      {/* Listado */}
      <section>
        {paginatedVehicles.length > 0 ? (
          <>
            <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
              {paginatedVehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => openVehicleModal(vehicle)}
                >
                  <CarCard {...vehicle} />
                </motion.div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500 text-center text-sm mt-8">
            No hay resultados con los filtros aplicados.
          </div>
        )}
      </section>

      {/* Modales */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <VehicleModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          vehicle={selectedVehicle}
        />
      </motion.div>

      {addModalOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <AddVehicleModal
            isOpen={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onVehicleAdded={() => {
              getVehicles().then((data) => {
                setVehicles(data);
                setFilteredVehicles(data);
                setCurrentPage(1);
              });
            }}
          />
        </motion.div>
      )}
    </>
  );
}
