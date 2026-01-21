// src/components/Sidebar.jsx
import { NavLink, useParams } from "react-router-dom";
import { LogOut, SidebarIcon } from "lucide-react";
import { logout } from "@/api/auth";
import {
  CarIcon,
  ClientIcon,
  HomeIcon,
  ServicesIcon,
  CollaboratorIcon,
  InvoiceIcon,
  NotificationIcon,
  SettingsIcon,
} from "@/components/icons/SidebarIcon";

export default function Sidebar({ onLinkClick }) {
  const { subdomain } = useParams();

  const navItems = [
    {
      label: "Inicio",
      to: `/${subdomain}/dashboard`,
      icon: <HomeIcon className="w-4 h-4" />,
    },
    {
      label: "Servicios",
      to: `/${subdomain}/servicios`,
      icon: <ServicesIcon className="w-4 h-4" />,
    },
    {
      label: "Clientes",
      to: `/${subdomain}/clientes`,
      icon: <ClientIcon className="w-4 h-4" />,
    },
    {
      label: "Autos",
      to: `/${subdomain}/autos`,
      icon: <CarIcon className="w-4 h-4" />,
    },
    {
      label: "Trabajadores",
      to: `/${subdomain}/trabajadores`,
      icon: <CollaboratorIcon className="w-4 h-4" />,
    },
    {
      label: "Notificaciones",
      to: `/${subdomain}/notificaciones`,
      icon: <NotificationIcon className="w-4 h-4" />,
    },
    {
      label: "Facturas",
      to: `/${subdomain}/facturas`,
      icon: <InvoiceIcon className="w-4 h-4" />,
    },
    {
      label: "Configuración",
      to: `/${subdomain}/configuracion`,
      icon: <SettingsIcon className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-full min-h-full bg-gray-50 border-r flex flex-col ">
      {/* Brand */}
      <div className="px-4 py-5 border-b">
        <div className="flex flex-col items-center gap-2">
          <img
            src="https://github.com/Grupo-Geshk/AutoClient-front/blob/main/public/autoClientLogo.png?raw=true"
            alt="AutoClient"
            className="w-16 h-16"
          />
          <span className="font-extrabold text-2xl leading-none text-[#6341bb] tracking-tight">
            Auto<span className="text-[#edb442]">client</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-2 py-3 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wide uppercase text-gray-400">
          Menú
        </div>

        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onLinkClick}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-violet-200",
                    isActive
                      ? "bg-violet-50 text-[#5b42c2] border-l-4 border-[#5b42c2] ring-1 ring-gray-200"
                      : "text-gray-700 hover:bg-gray-100 border-l-4 border-transparent ",
                  ].join(" ")
                }
              >
                {/* icono */}
                <span
                  className="grid place-items-center rounded-md w-7 h-7 group-hover:ring-gray-300"
                >
                  {/* Pasamos la clase al svg via props en navItems */}
                  {item.icon}
                </span>

                {/* label */}
                <span className="font-medium truncate">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="mt-auto border-t px-4 py-3">
        <button
          onClick={logout}
          className="w-full inline-flex items-center justify-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
