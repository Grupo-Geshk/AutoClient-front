// src/pages/WorkersPage.jsx
import { useEffect, useState } from "react";
import WorkerCard from "@/components/Workers/WorkerCard";
import { getAllWorkers } from "@/api/worker";
import AddWorkerModal from "@/components/Workers/AddWorkerModal";

export default function WorkersPage() {
  const [workers, setWorkers] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const load = () => getAllWorkers().then(setWorkers).catch(console.error);
  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          onClick={() => setAddModalOpen(true)}
          className="whitespace-nowrap bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
        >
          + Nuevo Trabajador
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workers.length > 0 ? (
          workers.map((worker) => <WorkerCard key={worker.id} worker={worker} />)
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No hay trabajadores registrados.
          </p>
        )}
      </div>

      <AddWorkerModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onWorkerAdded={load}
      />
    </>
  );
}
