'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../../services/authService";
import { AxiosError } from "axios";

export default function LoginForm() {
  const [email, setEmail] = useState("italo@gmail.com");
  const [password, setPassword] = useState("italo322");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login({ email, password });
      console.log("Login successful:", data);
      localStorage.setItem("token", data.token);
      router.push("/home");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Error al iniciar sesión");
      } else {
        setError("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-6 sm:px-12 lg:px-20">
      <div className="bg-white bg-opacity-90 p-6 sm:p-8 rounded-lg shadow-lg max-w-sm sm:max-w-md w-full">
        <h1 className="text-lg sm:text-xl font-bold text-center mb-6">
          Iniciar Sesión
        </h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}