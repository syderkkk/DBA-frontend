"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaCopy,
  FaHome,
  FaChalkboardTeacher,
  FaStore,
  FaUser,
  FaSignInAlt,
  FaCheck,
} from "react-icons/fa";
import {
  joinClassroomByCode,
  getMyClassrooms,
} from "@/services/classroomService";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  // Estado para las clases del estudiante
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loadingClassrooms, setLoadingClassrooms] = useState(true);

  // Modal para mostrar código y QR
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

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
    students_count?: number;
  }

  interface JoinError {
    response?: {
      data?: {
        message?: string;
      };
    };
  }

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

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoining(true);
    setJoinError(null);
    try {
      await joinClassroomByCode(joinCode.trim());
      setJoinCode("");
      alert("¡Te has unido a la clase!");
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

  const handleClassClick = (id: number) => {
    router.push(`/class/${id}`);
  };

  function formatearFechaHora(fecha: string) {
    if (!fecha) return "";
    const d = new Date(fecha);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }

  return (
    <div className="relative min-h-screen">
      {/* Fondo con imagen y overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/professor-bg.jpg')",
        }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-10 bg-gradient-to-b from-white/60 via-white/40 to-white/80 pointer-events-none" />
      <div className="relative z-20 flex min-h-screen">
        {/* Sidebar */}
        <aside className="fixed top-0 left-0 h-full w-64 bg-white/90 text-black flex flex-col z-40 shadow-[0_0_32px_0_rgba(0,0,0,0.18)] border-r border-gray-200">
          <div className="flex items-center gap-2 px-6 py-7 border-b border-gray-200">
            <span className="text-2xl font-bold tracking-tight font-sans select-none text-black drop-shadow">
              CLASSCRAFT
            </span>
          </div>
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              <li>
                <a
                  className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-black bg-gray-50 hover:bg-gray-100 hover:text-black transition-all duration-150 shadow-sm"
                  href="#inicio"
                >
                  <FaHome /> Inicio
                </a>
              </li>
              <li>
                <a
                  className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-black bg-gray-50 hover:bg-gray-100 hover:text-black transition-all duration-150 shadow-sm"
                  href="#clases"
                >
                  <FaChalkboardTeacher /> Clases
                </a>
              </li>
              <li>
                <Link
                  className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-black bg-gray-50 hover:bg-gray-100 hover:text-black transition-all duration-150 shadow-sm"
                  href="/store"
                >
                  <FaStore /> Tienda
                </Link>
              </li>
              <li>
                <a
                  className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-black bg-gray-50 hover:bg-gray-100 hover:text-black transition-all duration-150 shadow-sm"
                  href="#"
                >
                  <FaUser /> Cerrar sesión
                </a>
              </li>
            </ul>
          </nav>
          {/* Unirse a clase */}
          <div className="mt-auto px-4 py-6 border-t border-gray-200">
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
        <main className="flex-1 ml-64 py-10 px-2 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <header className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 drop-shadow-lg flex items-center gap-3">
                <span className="px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm flex flex-row items-center gap-2">
                  <FaUsers className="text-green-500 text-2xl" />
                  <span>Panel de Estudiante</span>
                </span>
              </h1>
            </header>
            {/* Lista de clases */}
            <section className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
                  <FaChalkboardTeacher className="text-gray-400" /> Tus clases
                </h2>
                <span className="bg-blue-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {classrooms.length} clases
                </span>
              </div>
              {loadingClassrooms ? (
                <p className="text-gray-500 text-center py-8">
                  Cargando clases...
                </p>
              ) : classrooms.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No estás inscrito en ninguna clase aún.
                </p>
              ) : (
                <div className="flex flex-col gap-6">
                  {classrooms.map((c, idx) => (
                    <motion.div
                      key={c.id}
                      className="relative group bg-gray-50 rounded-xl border border-gray-200 shadow p-5 flex flex-col gap-3 hover:border-green-400 hover:shadow-lg transition-all cursor-pointer"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 8px 24px rgba(59,130,246,0.10)",
                      }}
                      onClick={() => handleClassClick(c.id)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleClassClick(c.id);
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-lg text-gray-800 truncate">
                          {c.title}
                        </h3>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                          {c.students_count || 0}/{c.max_capacity} alumnos
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1 line-clamp-2">
                        {c.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-1">
                        <span className="bg-gray-200 px-2 py-0.5 rounded">
                          Inicio:{" "}
                          <strong>{formatearFechaHora(c.start_date)}</strong>
                        </span>
                        <span className="bg-gray-200 px-2 py-0.5 rounded">
                          Fin:{" "}
                          <strong>
                            {formatearFechaHora(c.expiration_date)}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-auto">
                        <button
                          className="cursor-pointer flex items-center gap-1 px-2 py-1 bg-green-100 text-green-900 rounded hover:bg-green-200 text-xs font-semibold"
                          title="Ver código de clase"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCode(c.join_code);
                            setShowCodeModal(true);
                          }}
                        >
                          <FaCopy /> {c.join_code}
                        </button>
                      </div>
                      {idx === 0 && (
                        <span className="absolute top-2 right-2 bg-green-700 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow">
                          Más reciente
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>
          {/* Modal para mostrar código y QR */}
          <AnimatePresence>
            {showCodeModal && selectedCode && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCodeModal(false)}
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-200 relative flex flex-col items-center"
                  initial={{ scale: 0.97, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.97, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-xl font-bold text-green-700 mb-4">
                    Código de la clase
                  </h2>
                  <span className="text-3xl font-mono text-green-900 mb-4 flex items-center gap-2">
                    {selectedCode}
                    <button
                      className="cursor-pointer ml-2 text-green-700 hover:text-green-900 transition"
                      title="Copiar código"
                      onClick={async () => {
                        await navigator.clipboard.writeText(selectedCode);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1200);
                      }}
                    >
                      {copied ? (
                        <FaCheck className="text-green-600" />
                      ) : (
                        <FaCopy />
                      )}
                    </button>
                  </span>
                  <div className="mb-4">
                    <Image
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                        `http://localhost:3000/join?code=${selectedCode}`
                      )}&size=200x200`}
                      alt="Código QR"
                      width={200}
                      height={200}
                      className="w-48 h-48"
                    />
                  </div>
                  <span className="text-gray-600 text-sm mb-2">
                    Escanea para unirte
                  </span>
                  <button
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold shadow transition"
                    onClick={() => setShowCodeModal(false)}
                  >
                    Cerrar
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
