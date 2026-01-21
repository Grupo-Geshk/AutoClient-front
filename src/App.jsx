// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "@/api/auth";
import { getSubdomainFromToken } from "@/utils/jwt";

import AppLayout from "@/Layouts/AppLayout";
import AdminInvoiceForm from "@/pages/AdminInvoiceForm";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Services from "@/pages/Services";
import ClientPage from "@/pages/ClientPage";
import Car from "@/pages/Car";
import WorkersPage from "@/pages/WorkersPage";
import Notifications from "@/Pages/Notifications";
import WorkshopProfile from "@/Pages/WorkshopProfile";

export default function App() {
  const [auth, setAuth] = useState(isAuthenticated());
  const subdomain = useMemo(() => getSubdomainFromToken(), []);

  useEffect(() => {
    const interval = setInterval(() => setAuth(isAuthenticated()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección raíz */}
        <Route
          path="/"
          element={
            auth && subdomain ? (
              <Navigate to={`/${subdomain}/dashboard`} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Agrupación por subdominio con AppLayout */}
        <Route
          path="/:subdomain"
          element={auth ? <AppLayout /> : <Navigate to="/login" />}
        >
          <Route
            path="dashboard"
            element={<Dashboard />}
            handle={{ title: "Inicio" }}
          />
          <Route
            path="servicios"
            element={<Services />}
            handle={{ title: "Servicios" }}
          />
          <Route
            path="clientes"
            element={<ClientPage />}
            handle={{ title: "Clientes" }}
          />
          <Route
            path="autos"
            element={<Car />}
            handle={{ title: "Autos" }}
          />
          <Route
            path="trabajadores"
            element={<WorkersPage />}
            handle={{ title: "Trabajadores" }}
          />
          <Route
            path="facturas"
            element={<AdminInvoiceForm />}
            handle={{ title: "Facturación" }}
          />
          <Route
            path="notificaciones"
            element={<Notifications  />}
            handle={{ title: "Notificaciones" }}
          />
          <Route
            path="configuracion"
            element={<WorkshopProfile />}
            handle={{ title: "Configuración" }}
          />
          {/* Cualquier otra de ese subdominio manda a dashboard */}
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Route>

        {/* Catch-all global */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
