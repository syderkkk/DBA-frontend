"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function RoleSelection() {
  return (
    <section
      className="min-h-screen w-full h-full bg-cover bg-center flex items-center justify-center px-2 sm:px-4 overflow-x-hidden"
      style={{
        backgroundImage: "url('/bg-role.webp')"
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-black/60 backdrop-blur-md p-4 sm:p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-white/10 group transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,255,255,0.25)] hover:border-cyan-400/50 hover:ring-2 hover:ring-cyan-300/40"
      >
        {/* Resplandor de hover */}
        <motion.div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-300/20 to-white/10 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500"
          aria-hidden="true"
        />

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 sm:mb-8 z-10 relative">
          Registrate como:
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 z-10 relative">
          {/* Profesor */}
          <Link
            href="/auth/register?role=professor"
            className="group flex flex-col items-center hover:scale-105 transition-transform"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-cyan-200/10 group-hover:bg-cyan-300/20 rounded-full ring-2 ring-transparent group-hover:ring-cyan-400 transition-all duration-300 overflow-hidden">
              <Image
                src="https://ideogram.ai/assets/progressive-image/balanced/response/ocBY89etT8iJrHMi7wCfyA"
                alt="Profesor"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="mt-2 text-white text-base sm:text-lg font-semibold group-hover:text-cyan-300 transition-colors">
              Profesor
            </span>
          </Link>

          {/* Alumno */}
          <Link
            href="/auth/register?role=student"
            className="group flex flex-col items-center hover:scale-105 transition-transform"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-cyan-200/10 group-hover:bg-cyan-300/20 rounded-full ring-2 ring-transparent group-hover:ring-cyan-400 transition-all duration-300 overflow-hidden">
              <Image
                src="https://ideogram.ai/assets/progressive-image/balanced/response/yD9YFPk2QZeigi15YaMT2w"
                alt="Alumno"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="mt-2 text-white text-base sm:text-lg font-semibold group-hover:text-cyan-300 transition-colors">
              Estudiante
            </span>
          </Link>
        </div>

        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-300 z-10 relative">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/auth/login"
            className="text-cyan-300 hover:underline hover:text-cyan-200"
          >
            Conéctate aquí
          </Link>
        </p>
      </motion.div>
    </section>
  )
}
