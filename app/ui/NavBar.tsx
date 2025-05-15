"use client";

import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white shadow-md py-1.5 max-w-full overflow-x-hidden">
      <div className="flex justify-between items-center px-2 sm:px-4 w-full max-w-full">
        {/* Logo */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 whitespace-nowrap">
          <Link
            href="#home"
            className=" hover:text-gray-900 transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              const section = document.querySelector("#home");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
              setMenuOpen(false); // Si quieres cerrar el menú móvil
            }}
          >
            CLASSCRAFT
          </Link>
        </h1>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <span
            className={`block h-0.5 w-6 bg-gray-800 mb-1 transition-all ${
              menuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-gray-800 mb-1 transition-all ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-gray-800 transition-all ${
              menuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>

        {/* Links (desktop) */}
        <div className="hidden md:flex space-x-4">
          <Link
            href="#beneficios"
            className="text-gray-600 hover:text-gray-900 transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              const section = document.querySelector("#beneficios");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
              setMenuOpen(false); // Si quieres cerrar el menú móvil
            }}
          >
            Beneficios
          </Link>
          <Link
            href="#features"
            className="text-gray-600 hover:text-gray-900 transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              const section = document.querySelector("#features");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
              setMenuOpen(false); // Si quieres cerrar el menú móvil
            }}
          >
            Características
          </Link>
          <Link
            href="#characters"
            className="text-gray-600 hover:text-gray-900 transition duration-300"
            onClick={(e) => {
              e.preventDefault();
              const section = document.querySelector("#characters");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
              setMenuOpen(false); // Si quieres cerrar el menú móvil
            }}
          >
            Personajes
          </Link>
        </div>

        {/* Buttons (desktop) */}
        <div className="hidden md:flex space-x-2">
          <Link
            href="/auth/select-role"
            className="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 transition duration-300 text-sm"
          >
            Inscríbete
          </Link>
          <Link
            href="/auth/login"
            className="border border-gray-400 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-100 transition duration-300 text-sm"
          >
            Regístrate
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-2 pb-4 w-full max-w-full">
          <div className="flex flex-col space-y-2 mt-2">
            <Link
              href="#beneficios"
              className="text-gray-600 hover:text-gray-900 transition duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Beneficios
            </Link>
            <Link
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Caracteristicas
            </Link>
            <Link
              href="#characters"
              className="text-gray-600 hover:text-gray-900 transition duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Personajes
            </Link>
            <Link
              href="/auth/select-role"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Inscríbete
            </Link>
            <Link
              href="/auth/login"
              className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-100 transition duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Regístrate
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
