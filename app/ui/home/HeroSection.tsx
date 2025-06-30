"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center w-full min-h-[60vh] sm:min-h-[80vh] lg:min-h-[100vh] overflow-hidden mb-2"
    >
      {/* Fondo solo en la sección */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Image
          src={"/background.png"}
          alt="Fondo"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradiente blanco mejorado */}
        <div className="absolute bottom-0 left-0 w-full h-[15%] pointer-events-none bg-gradient-to-t from-white/95 via-white/70 to-transparent" />
        {/* Overlay sutil para mejor contraste */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </motion.div>

      <motion.div 
        className="relative z-10 flex flex-col items-center text-center w-full px-2 pb-10 pt-8 sm:pt-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <motion.h1 
          className="mb-4 font-extrabold tracking-tight drop-shadow-2xl text-sm sm:text-xl lg:text-2xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.span 
            className="inline-block px-5 py-2 rounded-full bg-black/80 text-white shadow-2xl backdrop-blur-md border border-white/20 relative overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              transition: { duration: 0.2 }
            }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                duration: 2,
                delay: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 3
              }}
            />
            Transforma tu aula en aventura
          </motion.span>
        </motion.h1>
        
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            href="/auth/select-role"
            className="group relative mt-4 inline-block rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-2 text-sm sm:px-10 sm:py-3 sm:text-base text-white font-semibold transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-2xl hover:shadow-green-500/30 hover:-translate-y-1 transform active:scale-95 border border-green-400/30 backdrop-blur-sm"
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"
              initial={false}
            />
            <motion.span 
              className="relative z-10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              ¡Comienza Gratis Ahora!
            </motion.span>
            {/* Efecto de brillo */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}