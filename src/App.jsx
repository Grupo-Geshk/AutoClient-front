import { BrowserRouter, Routes, Route, Navigate, } from "react-router-dom"
import { isAuthenticated } from "@/api/auth"
import Login from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"
import Services from "@/pages/Services"
import ClientPage from "@/pages/ClientPage"
import Car from "@/Pages/Car"
import { getSubdomainFromToken } from "@/utils/jwt"

export default function App() {
  const authenticated = isAuthenticated()
  const subdomain = getSubdomainFromToken()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            authenticated && subdomain
              ? <Navigate to={`/${subdomain}/dashboard`} />
              : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/:subdomain/dashboard"
          element={
            authenticated ? <Dashboard /> : <Navigate to="/login" />
          }
        />
        <Route path="/:subdomain/servicios" element={<Services />} />
        <Route path="/:subdomain/autos" element={<Car />} />
        <Route path="/:subdomain/clientes" element={<ClientPage />} />
      </Routes>
    </BrowserRouter>
  )
}
