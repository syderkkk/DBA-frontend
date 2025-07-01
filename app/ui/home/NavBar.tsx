"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const handleSmoothScroll = (targetId: string) => {
    const section = document.querySelector(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <>
      {/* NavBar  */}
      <motion.nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
            : "bg-white/90 backdrop-blur-sm shadow-md"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 max-w-7xl mx-auto">
          {/* Logo  */}
          <motion.h1 
            className="text-xl sm:text-2xl font-bold whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link
              href="#home"
              className="text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text hover:from-green-700 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg px-2 py-1"
              onClick={(e) => {
                e.preventDefault();
                handleSmoothScroll("#home");
              }}
            >
              CLASSCRAFT
            </Link>
          </motion.h1>

          {/* Botón hamburguesa */}
          <motion.button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="block h-0.5 w-6 bg-gray-800 mb-1 transition-all duration-300"
              animate={{
                rotate: menuOpen ? 45 : 0,
                y: menuOpen ? 6 : 0,
              }}
            />
            <motion.span
              className="block h-0.5 w-6 bg-gray-800 mb-1 transition-all duration-300"
              animate={{
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <motion.span
              className="block h-0.5 w-6 bg-gray-800 transition-all duration-300"
              animate={{
                rotate: menuOpen ? -45 : 0,
                y: menuOpen ? -6 : 0,
              }}
            />
          </motion.button>

          {/* Links de navegación desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {[
              { href: "#benefits", label: "Beneficios" },
              { href: "#features", label: "Características" },
              { href: "#characters", label: "Personajes" },
            ].map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-green-600 font-medium transition-all duration-300 relative group focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg px-3 py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSmoothScroll(item.href);
                  }}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Botones de acción desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/auth/login"
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-green-400 hover:text-green-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Iniciar Sesión
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/auth/select-role"
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Registrate
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Overlay para menú móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed top-0 right-0 h-screen w-80 bg-white/95 backdrop-blur-md z-50 shadow-2xl border-l border-gray-200/50 md:hidden"
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header del menú móvil */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <motion.span
                className="text-xl font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                CLASSCRAFT
              </motion.span>
              <motion.button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                onClick={() => setMenuOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Cerrar menú"
              >
                <FaTimes className="text-gray-500" size={18} />
              </motion.button>
            </div>

            {/* Navegación móvil */}
            <nav className="flex flex-col p-6 space-y-4">
              {[
                { href: "#benefits", label: "Beneficios" },
                { href: "#features", label: "Características" },
                { href: "#characters", label: "Personajes" },
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-gray-700 font-semibold rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSmoothScroll(item.href);
                    }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Botones de acción móvil */}
              <div className="pt-6 space-y-3 border-t border-gray-200/50">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/auth/select-role"
                    className="block w-full px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white text-center rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
                    onClick={() => setMenuOpen(false)}
                  >
                    Registrate
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    href="/auth/login"
                    className="block w-full px-4 py-3 border-2 border-gray-300 text-gray-700 text-center rounded-xl font-semibold hover:border-green-400 hover:text-green-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                    onClick={() => setMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                </motion.div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}