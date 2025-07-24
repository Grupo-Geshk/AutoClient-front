import { NavLink, useParams } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logout } from "@/api/auth";
import {CarIcon, ClientIcon, HomeIcon, ServicesIcon} from "@/components/icons/SidebarIcon";
import Services from "@/Pages/Services";

export default function Sidebar() {
  const { subdomain } = useParams();

  const navItems = [
    {
      label: "Inicio",
      to: `/${subdomain}/dashboard`,
      icon: <HomeIcon />,
    },
    {
      label: "Servicios",
      to: `/${subdomain}/servicios`,
      icon: <ServicesIcon />,
    },
    {
      label: "Clientes",
      to: `/${subdomain}/clientes`,
      icon: <ClientIcon />,
    },
    {
      label: "Autos",
      to: `/${subdomain}/autos`,
      icon: <CarIcon />,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#f9fafb] border-r flex flex-col pl-4">
      <div>
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 px-6 py-4 border-b">
          <img
            src="../public/autoClientLogo.png"
            alt="AutoClient"
            className="w-30 h-30"
          />
          <span className="font-bold text-3xl text-[#6341bb]">
            Auto<span className="text-[#edb442]">client</span>
          </span>
        </div>

        {/* Navegación */}
        <nav className="mt-4 flex flex-col">
          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 transition-all font-medium text-md ${
                  isActive
                    ? "bg-[#ede9fe] text-[#6341bb] rounded-l-full font-semibold"
                    : "text-gray-700 hover:bg-gray-200 rounded-l-full"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="px-6 py-4 border-t">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
