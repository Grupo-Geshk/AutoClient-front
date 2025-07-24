import Sidebar from "@/components/Sidebar";
import ServicesPanel from "@/components/Services/ServicesPanel";

export default function Services() {
  return (
    <div className="flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Servicios</h1>
        <ServicesPanel />
      </main>
    </div>
  );

}