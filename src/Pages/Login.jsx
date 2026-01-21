// src/pages/Login.jsx
import { useState } from "react";
// ⬇️ cambia la importación
import { adminLogin } from "@/api/auth";
import { getSubdomainFromToken } from "@/utils/jwt";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      // ⬇️ llamar adminLogin (SIN OTP)
      const res = await adminLogin({ username, password });
      // el token ya se guarda en localStorage dentro de adminLogin
      const subdomain = getSubdomainFromToken();
      if (!subdomain) throw new Error("No se pudo obtener subdominio");
      window.location.href = `/${subdomain}/dashboard`;
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white relative overflow-hidden px-4">
      <div className="absolute inset-0 opacity-20 pointer-events-none" />
      <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md border border-white/50 p-6 sm:p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-200 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <img src="/autoclientFavico.png" alt="AutoClient" className="w-10 h-10 object-contain" />
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">Inicia sesión</h1>
          <p className="text-sm text-gray-500 text-center">Ingresa tus credenciales para acceder al panel.</p>

          {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
          />

          <div className="flex justify-end">
            <a
              href="https://www.grupogeshk.com/contactus"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-sky-600 hover:underline"
            >
              ¿Problemas para iniciar sesión? Contáctanos
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-2 text-sm text-gray-400">
              Powered by <strong>Geshk</strong>
            </span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
        </form>
      </div>
    </div>
  );
}
