"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaGoogle, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      type: "spring",
      stiffness: 60,
    },
  }),
};

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

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
          Registro de {role === "professor" ? "Profesor" : "estudiante"}
        </motion.h1>
        <motion.button
          custom={2}
          variants={fadeInUp}
          className="w-full bg-cyan-100/10 text-cyan-200 py-2 rounded-lg shadow-md flex items-center justify-center mb-2 hover:bg-cyan-300/20 z-10 relative transition-all"
        >
          <FaGoogle className="mr-2 w-5 h-5" />
          Inscribirse con Google
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
        <motion.form
          custom={4}
          variants={fadeInUp}
          className="z-10 relative"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              placeholder="Nombre"
              className="w-full px-3 py-2 bg-black/30 text-white border border-cyan-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-cyan-100/60"
            />
            <input
              type="text"
              placeholder="Apellido"
              className="w-full px-3 py-2 bg-black/30 text-white border border-cyan-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-cyan-100/60"
            />
          </div>
          <div className="mb-2">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-3 py-2 bg-black/30 text-white border border-cyan-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-cyan-100/60"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-3 py-2 bg-black/30 text-white border border-cyan-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-cyan-100/60"
            />
            <input
              type="password"
              placeholder="Confirmar su contraseña"
              className="w-full px-3 py-2 bg-black/30 text-white border border-cyan-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-cyan-100/60"
            />
          </div>
          <div className="mb-2">
            <select className="w-full px-3 py-2 bg-black/30 text-white border border-cyan-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400">
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>
          <p className="text-xs text-cyan-100/70 mb-2">
            Al presionar el botón, acepta nuestras condiciones{" "}
            <a href="/terms" className="text-cyan-300 hover:underline">
              Acuerdo de Licencia
            </a>{" "}
            y{" "}
            <a href="/privacy" className="text-cyan-300 hover:underline">
              Política de Privacidad
            </a>
            .
          </p>
          <button
            type="submit"
            className="w-full bg-cyan-400 text-black font-bold py-2 rounded-lg hover:bg-cyan-300 transition"
          >
            ¡COMENZAR!
          </button>
        </motion.form>
        <motion.p
          custom={5}
          variants={fadeInUp}
          className="mt-3 text-sm text-cyan-100/80 text-center z-10 relative"
        >
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/auth/login"
            className="text-cyan-300 hover:underline hover:text-cyan-200"
          >
            Conéctese aquí
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}