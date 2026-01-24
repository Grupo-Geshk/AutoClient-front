// components/Workers/WorkerCard.jsx
import { useState } from "react";
import WorkerDetailModal from "./WorkerDetailModal";

export default function WorkerCard({ worker }) {
  const [open, setOpen] = useState(false);

  // Generate initials from worker name
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const initials = getInitials(worker.name);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-white shadow-md rounded-2xl p-6 w-full cursor-pointer hover:shadow-lg transition-shadow duration-200"
      >
        {/* Main content area */}
        <div className="flex items-start gap-4 mb-4">
          {/* Large circular avatar */}
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 font-semibold text-2xl flex-shrink-0">
            {initials}
          </div>

          {/* Identity block */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                  {worker.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {worker.role || "Sin rol"}
                </p>
              </div>

              {/* Phone badge - compact and to the right */}
              {worker.phone && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex-shrink-0">
                  {worker.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cédula as secondary metadata */}
        {worker.cedula && (
          <div className="text-xs text-gray-500 pl-20">
            Cédula: <span className="text-gray-700">{worker.cedula}</span>
          </div>
        )}
      </div>

      {open && <WorkerDetailModal workerId={worker.id} onClose={() => setOpen(false)} />}
    </>
  );
}
