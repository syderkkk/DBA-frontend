"use client";

import { useState } from "react";
import Link from "next/link";
import { FaGoogle, FaRegStar, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeInUp } from "@/types/types";
import { getUser, login } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("italo@gmail.com");
  const [password, setPassword] = useState("a322");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);

      const userResponse = await getUser();
      const role = userResponse.data.role;

      if (role === "student") {
        router.push("/dashboard/student");
      } else if (role === "professor") {
        router.push("/dashboard/professor");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      console.error(err);
      setError("Credenciales incorrectas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-2 sm:px-4"
      style={{ backgroundImage: "url('/bg-register.webp')" }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {},
        }}
        className="relative bg-black/60 backdrop-blur-md p-3 sm:p-6 rounded-2xl shadow-2xl max-w-md w-full border border-white/10 group transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,255,255,0.25)] hover:border-cyan-400/50 hover:ring-2 hover:ring-cyan-300/40"
      >
        {/* Resplandor de hover */}
        <div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-300/20 to-white/10 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500"
          aria-hidden="true"
        />
        <motion.div
          custom={0}
          variants={fadeInUp}
          className="flex justify-center mb-2 z-10 relative"
        >
          <FaRegStar className="text-cyan-300 w-12 h-12" />
        </motion.div>
        <motion.h1
          custom={1}
          variants={fadeInUp}
          className="text-xl sm:text-2xl font-extrabold text-white text-center mb-3 z-10 relative"
        >
          Iniciar Sesión
        </motion.h1>
        <motion.button
          custom={2}
          variants={fadeInUp}
          type="button"
          className="w-full bg-cyan-100/10 text-cyan-200 py-2 rounded-lg shadow-md flex items-center justify-center mb-2 hover:bg-cyan-300/20 z-10 relative transition-all"
        >
          <FaGoogle className="mr-2 w-5 h-5" />
          Ingresar con Google
        </motion.button>
        <motion.div
          custom={3}
          variants={fadeInUp}
          className="flex items-center justify-center mb-2 z-10 relative"
        >
          <hr className="w-full border-cyan-300/30" />
          <span className="px-2 text-cyan-200/80">o</span>
          <hr className="w-full border-cyan-300/30" />
        </motion.div>
        {error && (
          <motion.p
            custom={4}
            variants={fadeInUp}
            className="text-red-400 text-sm mb-2 text-center"
          >
            {error}
          </motion.p>
        )}
        <motion.form
          custom={5}
          variants={fadeInUp}
          onSubmit={handleSubmit}
          className="z-10 relative"
        >
          <div className="mb-2">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-black/30 text-white border border-cyan-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-cyan-100/60"
            />
          </div>
          <div className="mb-2">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black/30 text-white border border-cyan-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-cyan-100/60"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`cursor-pointer w-full font-bold py-2 rounded-lg transition flex items-center justify-center ${
              isLoading
                ? "bg-cyan-400/50 text-black/50 cursor-not-allowed"
                : "bg-cyan-400 text-black hover:bg-cyan-300"
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2 w-4 h-4" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
          <motion.button
            custom={5.5}
            variants={fadeInUp}
            type="button"
            disabled={isLoading}
            onClick={() => (window.location.href = "/")}
            className={`cursor-pointer w-full mt-2 bg-transparent border border-cyan-300/40 font-bold py-2 rounded-lg transition ${
              isLoading
                ? "text-cyan-200/50 border-cyan-300/20 cursor-not-allowed"
                : "text-cyan-200 hover:bg-cyan-300/10"
            }`}
          >
            Cancelar y volver al inicio
          </motion.button>
        </motion.form>
        <motion.p
          custom={6}
          variants={fadeInUp}
          className="mt-3 text-sm text-cyan-100/80 text-center z-10 relative"
        >
          ¿No tienes una cuenta?{" "}
          <Link
            href="/auth/register"
            className="text-cyan-300 hover:underline hover:text-cyan-200"
          >
            Regístrate aquí
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
