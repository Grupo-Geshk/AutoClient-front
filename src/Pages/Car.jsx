import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import CarCard from "@/components/Car/CarCard";
import { getVehicles } from "@/api/vehicles";
import { motion, AnimatePresence } from "framer-motion";
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

  const openVehicleModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalOpen(true);
  };

  const brands = [...new Set(vehicles.map((v) => v.brand))].filter(Boolean);
  const models = [...new Set(vehicles.map((v) => v.model))].filter(Boolean);

  useEffect(() => {
    const fetchVehicles = async () => {
      const data = await getVehicles();
      setVehicles(data);
      setFilteredVehicles(data);
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    let filtered = vehicles;

    if (brandFilter) {
      filtered = filtered.filter((v) => v.brand === brandFilter);
    }

    if (modelFilter) {
      filtered = filtered.filter((v) => v.model === modelFilter);
    }

    if (searchPlate.trim()) {
      filtered = filtered.filter((v) =>
        v.plateNumber.toLowerCase().includes(searchPlate.toLowerCase())
      );
    }

    setFilteredVehicles(filtered);
  }, [brandFilter, modelFilter, searchPlate, vehicles]);

  return (
    <div className="flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 bg-gray-100 min-h-screen">
        {/* Encabezado */}

        <section className="p-6 bg-white shadow-sm border-b flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Explorador de Autos
          </h1>
        </section>
        {/* Filtros */}
        <section className="p-6 bg-white shadow-sm border-b flex flex-wrap items-center justify-between ">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Buscador por placa */}
            <input
              type="text"
              placeholder="Buscar placa..."
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              className="px-4 py-1.5 border rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            />

            {/* Selector de marca */}
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

            {/* Selector de modelo */}
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

            {/* Botón de reset */}
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
        </section>

        {/* Listado */}
        <section className="p-6">
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredVehicles.map((vehicle) => (
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
          ) : (
            <div className="text-gray-500 text-center text-sm mt-8">
              No hay resultados con los filtros aplicados.
            </div>
          )}
        </section>
      </main>
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
            onSuccess={() => {
              getVehicles().then((data) => {
                setVehicles(data);
                setFilteredVehicles(data);
              });
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
