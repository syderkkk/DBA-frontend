"use client";

import { useState, useEffect } from "react";
import {
  FaHome,
  FaChalkboardTeacher,
  FaStore,
  FaUser,
  FaSignInAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { joinClassroomByCode, getMyClassrooms } from "@/services/classroomService";
import { useRouter } from "next/navigation";

export default function Page() {
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  // Estado para las clases del estudiante
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loadingClassrooms, setLoadingClassrooms] = useState(true);

  const router = useRouter();

  interface Classroom {
    id: number;
    title: string;
    description: string;
    join_code: string;
    professor_id: number;
    max_capacity: number;
    start_date: string;
    expiration_date: string;
    created_at: string;
    updated_at: string;
  }

  interface JoinError {
    response?: {
      data?: {
        message?: string;
      };
    };
  }

  // Obtener las clases del estudiante al cargar la página
  useEffect(() => {
    setLoadingClassrooms(true);
    getMyClassrooms()
      .then((res) => {
        setClassrooms(res.data);
      })
      .catch(() => {
        setClassrooms([]);
      })
      .finally(() => setLoadingClassrooms(false));
  }, []);

  // Función para unirse a clase
  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoining(true);
    setJoinError(null);
    try {
      await joinClassroomByCode(joinCode.trim());
      setJoinCode("");
      alert("¡Te has unido a la clase!");
      // Refrescar la lista de clases después de unirse
      setLoadingClassrooms(true);
      getMyClassrooms()
        .then((res) => setClassrooms(res.data))
        .catch(() => setClassrooms([]))
        .finally(() => setLoadingClassrooms(false));
    } catch (err: unknown) {
      const error = err as JoinError;
      setJoinError(
        error?.response?.data?.message ||
          "No se pudo unir a la clase. Verifica el código."
      );
    }
    setJoining(false);
  };

  // Navegar a la clase al hacer click
  const handleClassClick = (id: number) => {
    router.push(`/class/${id}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex">
      {/* Sidebar */}
      <aside className="w-20 sm:w-56 bg-white/90 border-r border-gray-200 shadow-xl flex flex-col items-center py-8 px-2 sm:px-4">
        <div className="mb-10 flex flex-col items-center">
          <span className="text-2xl font-extrabold text-green-600 tracking-tight">
            STUDENT
          </span>
        </div>
        <nav className="flex flex-col gap-6 w-full">
          <a
            href="#inicio"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 font-semibold hover:bg-green-100 transition"
          >
            <FaHome className="text-green-500" />{" "}
            <span className="hidden sm:inline">Inicio</span>
          </a>
          <a
            href="#clases"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 font-semibold hover:bg-green-100 transition"
          >
            <FaChalkboardTeacher className="text-green-500" />{" "}
            <span className="hidden sm:inline">Clases</span>
          </a>
          <a
            href="#tienda"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 font-semibold hover:bg-green-100 transition"
          >
            <FaStore className="text-green-500" />{" "}
            <span className="hidden sm:inline">Tienda</span>
          </a>
          <a
            href="#perfil"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 font-semibold hover:bg-green-100 transition"
          >
            <FaUser className="text-green-500" />{" "}
            <span className="hidden sm:inline">Perfil</span>
          </a>
        </nav>
        {/* Unirse a clase */}
        <div className="mt-10 w-full">
          <motion.form
            layout
            onSubmit={handleJoinClass}
            className="bg-green-50 border border-green-200 rounded-xl p-3 flex flex-col gap-2 shadow-inner"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <label className="text-xs font-bold text-green-700 mb-1 flex items-center gap-2">
              <FaSignInAlt /> Unirse a clase
            </label>
            <input
              type="text"
              placeholder="Código de clase"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="px-3 py-2 rounded-lg border border-green-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
              disabled={joining}
              maxLength={12}
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 rounded-lg transition disabled:opacity-60"
              disabled={joining}
            >
              {joining ? "Uniendo..." : "Unirse"}
            </button>
            {joinError && (
              <span className="text-xs text-red-500">{joinError}</span>
            )}
          </motion.form>
        </div>
      </aside>

      {/* Contenido principal */}
      <section className="flex-1 flex flex-col items-center justify-start py-10 px-4 sm:px-10">
        {/* Inicio */}
        <div id="inicio" className="w-full max-w-3xl mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2"
          >
            ¡Bienvenido/a a tu panel de estudiante!
          </motion.h1>
          <p className="text-gray-600 mb-4">
            Aquí puedes ver tus clases, unirte a nuevas, acceder a la tienda y
            personalizar tu perfil.
          </p>
        </div>

        {/* Clases */}
        <div id="clases" className="w-full max-w-3xl mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-green-700 mb-3"
          >
            Tus clases
          </motion.h2>
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            {loadingClassrooms ? (
              <div className="text-gray-500 text-center">Cargando clases...</div>
            ) : classrooms.length === 0 ? (
              <span className="text-gray-500 text-center block">
                No estás inscrito en ninguna clase aún.
              </span>
            ) : (
              <ul className="divide-y divide-gray-100">
                {classrooms.map((c) => (
                  <li
                    key={c.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:bg-green-50 rounded transition"
                    onClick={() => handleClassClick(c.id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleClassClick(c.id);
                    }}
                  >
                    <div>
                      <span className="font-bold text-green-700">{c.title}</span>
                      <span className="block text-gray-600 text-sm">{c.description}</span>
                    </div>
                    <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
                      <span className="text-xs text-gray-400">
                        Código: <span className="font-mono">{c.join_code}</span>
                      </span>
                      <span className="text-xs text-gray-400">
                        Inicia: {c.start_date} | Termina: {c.expiration_date}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Tienda */}
        <div id="tienda" className="w-full max-w-3xl mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-green-700 mb-3"
          >
            Tienda
          </motion.h2>
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100 text-gray-500 text-center">
            <span>
              ¡Próximamente podrás comprar objetos y personalizar tu personaje!
            </span>
          </div>
        </div>

        {/* Perfil */}
        <div id="perfil" className="w-full max-w-3xl mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-green-700 mb-3"
          >
            Perfil
          </motion.h2>
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100 text-gray-500 text-center">
            <span>Información de tu perfil y personalización aquí.</span>
          </div>
        </div>
      </section>
    </main>
  );
}