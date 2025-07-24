import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "@/api/auth"
import { getSubdomainFromToken } from "@/utils/jwt"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    await login({ username, password })
    const subdomain = getSubdomainFromToken()
    if (!subdomain) throw new Error("No se pudo obtener subdominio")
    navigate(`/${subdomain}/dashboard`)
  } catch (err) {
    console.error(err)
    alert("Login fallido")
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Iniciar sesión</h1>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="bg-slate-700 text-white w-full py-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  )
}
