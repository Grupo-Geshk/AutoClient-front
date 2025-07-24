import Sidebar from "@/components/Sidebar";
import StatCards from "@/components/StatCard";
import PopularServiceCard from "@/components/PopularServiceCard";
import PendingServicesTable from "@/components/PendingServicesTable";
import ExamplePieChart from "@/components/ExamplePieChart";
import { CalendarIcon, FilterIcon, ExportIcon } from "@/components/icons/DashboardIcons"

export default function Dashboard() {
  return (
    <div className="flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 bg-gray-100">
        <div className="flex items-center justify-center md:justify-between p-6 bg-white shadow-md flex-wrap gap-4">
          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 ">
            Resumen del Taller!
          </h1>

          {/* Controles */}
          <div className="flex items-center gap-2 text-sm">
            {/* Selector de fechas */}
            <button className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-gray-50">
              <CalendarIcon />
              Oct 18 - Nov 18
            </button>

            {/* Selector de rango */}
            <select className="border rounded-md px-3 py-1.5 bg-white hover:bg-gray-50">
              <option>Daily</option>
              <option>Weekly</option>
              <option selected>Monthly</option>
            </select>

            {/* Botón de filtro */}
            <button className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-gray-50">
              <FilterIcon />
              Filter
            </button>

            {/* Botón de exportar */}
            <button className="flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-gray-50">
              <ExportIcon />
              Export
            </button>
          </div>
        </div>

        <div className="rounded-xl p-6 mb-6">
          <StatCards />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex flex-col gap-2">
              <PopularServiceCard />
              <ExamplePieChart />
            </div>
            <PendingServicesTable />
          </div>
        </div>
      </main>
    </div>
  );
}
