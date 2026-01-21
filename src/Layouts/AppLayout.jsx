import { useState } from "react";
import { Outlet, useLocation, useParams, Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Menu as MenuIcon } from "lucide-react";

// Mapa de títulos para cada ruta final
const TITLES = {
  dashboard: "Inicio",
  servicios: "Servicios",
  clientes: "Clientes",
  autos: "Autos",
  trabajadores: "Trabajadores",
  facturas: "Facturación",
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { subdomain } = useParams();

  // Extraer el último segmento de la URL y mapear a título
  const pathSegment = location.pathname.split("/").pop();
  const pageTitle = TITLES[pathSegment] || "Panel";

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar desktop */}
      <aside className="hidden lg:block w-72 shrink-0 border-r bg-white">
        <Sidebar onLinkClick={() => setSidebarOpen(false)} />
      </aside>

      {/* Drawer móvil */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`lg:hidden fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <Sidebar onLinkClick={() => setSidebarOpen(false)} />
      </aside>

      {/* Contenido */}
      <main className="flex-1 min-h-screen bg-gray-200/10">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3">
          <div className="flex justify-center items-center gap-3">
            {/* Botón menú móvil */}
            <button
              className="lg:hidden inline-flex items-center justify-center rounded-xl border bg-white/90 px-3 py-2 shadow"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <MenuIcon size={18} />
            </button>

            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Chip con subdominio */}
          {subdomain && (
            <Link
              to={`/${subdomain}/dashboard`}
              className="text-xs rounded-full border px-3 py-1 bg-gray-50 hover:bg-gray-100"
              title="Volver al inicio"
            >
              {subdomain}
            </Link>
          )}
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
