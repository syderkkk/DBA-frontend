"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaCopy,
  FaChalkboardTeacher,
  FaStore,
  FaSignInAlt,
  FaCheck,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import {
  joinClassroomByCode,
  getMyClassrooms,
} from "@/services/classroomService";
import { getUser, logout } from "@/services/authService";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loadingClassrooms, setLoadingClassrooms] = useState(true);

  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const sidebarRef = useRef<HTMLElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

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

  const closeSidebar = () => {
    setSidebarOpen(false);
    setTimeout(() => {
      hamburgerButtonRef.current?.focus();
    }, 100);
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("✅ Sesión cerrada correctamente");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    } finally {
      localStorage.removeItem("token");
      
      setUser(null);
      setClassrooms([]);

      router.push("/auth/login");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      setTimeout(() => {
        const firstFocusable = sidebarRef.current?.querySelector(
          'button:not([disabled]), a, input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          (firstFocusable as HTMLElement).focus();
        }
      }, 150);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen) {
        closeSidebar();
      }
    };

    if (sidebarOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await getUser();
        setUser(response.data);
        console.log("✅ Usuario cargado:", response.data);
      } catch (error) {
        console.error("❌ Error al cargar usuario:", error);
        router.push("/auth/login");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUserData();
  }, [router]);

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
    closeSidebar();
  };

  const handleNavClick = (href: string) => {
    closeSidebar();
    if (href.startsWith("#")) {
      setTimeout(() => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
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

  const getFirstName = (fullName: string): string => {
    return fullName.split(' ')[0];
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/professor-bg.jpg')",
        }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-10 bg-gradient-to-b from-white/70 via-white/50 to-white/80 backdrop-blur-[1px] pointer-events-none" />

      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            ref={hamburgerButtonRef}
            className="fixed top-4 left-4 z-50 lg:hidden bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-xl shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Abrir menú"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <FaBars size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative z-20 flex min-h-screen">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
            />
          )}
        </AnimatePresence>

        <motion.aside
          ref={sidebarRef}
          className={`
            fixed top-0 left-0 h-screen w-64 bg-white/95 backdrop-blur-md text-black flex flex-col z-40 
            shadow-2xl border-r border-gray-200/50 pointer-events-auto transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          role="navigation"
          aria-label="Menú principal"
        >
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200/50">
            <motion.span
              className="text-xl font-bold tracking-tight font-sans select-none text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text drop-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg"
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                router.push("/dashboard/student");
                closeSidebar();
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push("/dashboard/student");
                  closeSidebar();
                }
              }}
              role="button"
              aria-label="Ir al inicio"
            >
              CLASSCRAFT
            </motion.span>

            <motion.button
              className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              onClick={closeSidebar}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Cerrar menú"
              tabIndex={0}
            >
              <FaTimes size={18} />
            </motion.button>
          </div>

          {!loadingUser && user && (
            <motion.div
              className="px-6 py-4 border-b border-gray-200/50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaUser className="text-white text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Estudiante
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navegación */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto" role="navigation">
            <ul className="space-y-3" role="list">
              {[
                {
                  icon: FaChalkboardTeacher,
                  label: "Clases",
                  href: "#clases",
                  action: "scroll",
                },
                {
                  icon: FaStore,
                  label: "Tienda",
                  href: "/store",
                  action: "link",
                },
                {
                  icon: FaSignOutAlt,
                  label: "Cerrar sesión",
                  href: "#",
                  action: "logout",
                },
              ].map((item, idx) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  role="listitem"
                >
                  {item.action === "link" ? (
                    <Link
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-50 hover:to-blue-50 hover:text-green-700 transition-all duration-300 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-green-400"
                      href={item.href}
                      onClick={closeSidebar}
                      tabIndex={0}
                    >
                      <item.icon
                        className="group-hover:scale-110 transition-transform duration-200"
                        size={18}
                      />
                      <span className="text-sm">
                        {item.label}
                      </span>
                    </Link>
                  ) : item.action === "logout" ? (
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 hover:text-red-700 transition-all duration-300 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-red-400"
                      onClick={handleLogout}
                      tabIndex={0}
                    >
                      <item.icon
                        className="group-hover:scale-110 transition-transform duration-200 text-red-500"
                        size={18}
                      />
                      <span className="text-sm">
                        {item.label}
                      </span>
                    </button>
                  ) : (
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-50 hover:to-blue-50 hover:text-green-700 transition-all duration-300 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-green-400"
                      onClick={() => handleNavClick(item.href)}
                      tabIndex={0}
                    >
                      <item.icon
                        className="group-hover:scale-110 transition-transform duration-200"
                        size={18}
                      />
                      <span className="text-sm">
                        {item.label}
                      </span>
                    </button>
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Formulario para unirse a clase */}
          <div className="mt-auto px-4 py-6 border-t border-gray-200/50">
            <motion.form
              layout
              onSubmit={handleJoinClass}
              className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex flex-col gap-3 shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="text-xs font-bold text-green-800 mb-1 flex items-center gap-2">
                <FaSignInAlt className="text-green-600" size={14} />
                <span>Unirse a clase</span>
              </label>
              <input
                type="text"
                placeholder="Código de clase"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-green-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm transition-all duration-200"
                disabled={joining}
                maxLength={12}
                autoComplete="off"
                tabIndex={0}
              />
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all duration-200 disabled:opacity-60 shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled={joining}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                tabIndex={0}
              >
                {joining ? "Uniendo..." : "Unirse"}
              </motion.button>
              <AnimatePresence>
                {joinError && (
                  <motion.span
                    className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {joinError}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.form>
          </div>
        </motion.aside>

        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="h-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pt-20 lg:pt-6">
            {/* Header */}
            <motion.header
              id="inicio"
              className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-800 drop-shadow-lg flex items-center gap-3">
                <motion.span
                  className="px-4 sm:px-6 py-3 rounded-2xl bg-black/80 text-white shadow-2xl backdrop-blur-sm flex flex-row items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaUsers className="text-green-400 text-xl sm:text-2xl" />
                  <span className="hidden sm:inline">
                    {loadingUser ? (
                      "Cargando..."
                    ) : user ? (
                      `¡Hola, ${getFirstName(user.name)}!`
                    ) : (
                      "Panel de Estudiante"
                    )}
                  </span>
                  <span className="sm:hidden">
                    {loadingUser ? (
                      "..."
                    ) : user ? (
                      `¡Hola, ${getFirstName(user.name)}!`
                    ) : (
                      "Dashboard"
                    )}
                  </span>
                </motion.span>
              </h1>
            </motion.header>

            {/* Lista de clases */}
            <motion.section
              id="clases"
              className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text flex items-center gap-3">
                  <FaChalkboardTeacher className="text-gray-400 text-xl sm:text-2xl" />
                  <span>Tus clases</span>
                </h2>
                <motion.span
                  className="bg-gradient-to-r from-blue-100 to-green-100 text-green-700 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  {classrooms.length}{" "}
                  {classrooms.length === 1 ? "clase" : "clases"}
                </motion.span>
              </div>

              {loadingClassrooms ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 text-center">
                    Cargando clases...
                  </p>
                </motion.div>
              ) : classrooms.length === 0 ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <FaChalkboardTeacher className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    No estás inscrito en ninguna clase aún
                  </p>
                  <p className="text-gray-400 text-sm">
                    ¡Únete a una clase usando el código en el panel lateral!
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {classrooms.map((c, idx) => (
                    <motion.div
                      key={c.id}
                      className="relative group bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-4 sm:p-6 flex flex-col gap-3 hover:border-green-400 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-400"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 20px 40px rgba(59,130,246,0.15)",
                      }}
                      onClick={() => handleClassClick(c.id)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleClassClick(c.id);
                      }}
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                        <h3 className="font-bold text-lg sm:text-xl text-gray-800 truncate flex-1 pr-2">
                          {c.title}
                        </h3>
                        <motion.span
                          className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1.5 rounded-full font-semibold whitespace-nowrap shadow-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          {c.students_count || 0}/{c.max_capacity} alumnos
                        </motion.span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-xs text-gray-500 mb-3">
                        <span className="bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                          Inicio:{" "}
                          <strong className="text-gray-700">
                            {formatearFechaHora(c.start_date)}
                          </strong>
                        </span>
                        <span className="bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                          Fin:{" "}
                          <strong className="text-gray-700">
                            {formatearFechaHora(c.expiration_date)}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-auto">
                        <motion.button
                          className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-lg hover:from-green-200 hover:to-emerald-200 text-xs font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                          title="Ver código de clase"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCode(c.join_code);
                            setShowCodeModal(true);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          tabIndex={0}
                        >
                          <FaCopy /> {c.join_code}
                        </motion.button>
                      </div>

                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          </div>

          {/* Modal para código QR */}
          <AnimatePresence>
            {showCodeModal && selectedCode && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCodeModal(false)}
              >
                <motion.div
                  className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-sm border border-white/20 relative flex flex-col items-center"
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.h2
                    className="text-xl sm:text-2xl font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text mb-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Código de la clase
                  </motion.h2>

                  <motion.div
                    className="text-2xl sm:text-3xl font-mono text-gray-800 mb-6 flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-2xl"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span>{selectedCode}</span>
                    <motion.button
                      className="cursor-pointer text-green-600 hover:text-green-800 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
                      title="Copiar código"
                      onClick={async () => {
                        await navigator.clipboard.writeText(selectedCode);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1200);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      tabIndex={0}
                    >
                      {copied ? (
                        <FaCheck className="text-green-600" />
                      ) : (
                        <FaCopy />
                      )}
                    </motion.button>
                  </motion.div>

                  <motion.div
                    className="mb-6 p-4 bg-white rounded-2xl shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Image
                      src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                        `http://localhost:3000/join?code=${selectedCode}`
                      )}&size=200x200`}
                      alt="Código QR"
                      width={200}
                      height={200}
                      className="w-40 h-40 sm:w-48 sm:h-48 rounded-lg"
                    />
                  </motion.div>

                  <span className="text-gray-600 text-sm mb-6 text-center">
                    Escanea el código QR para unirte fácilmente
                  </span>

                  <motion.button
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 sm:px-3 sm:py-1 rounded-lg font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                    onClick={() => setShowCodeModal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    tabIndex={0}
                  >
                    <FaTimes className="sm:hidden" />
                    <span className="hidden sm:inline">Cerrar</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}