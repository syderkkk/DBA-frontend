"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaUsers,
  FaEdit,
  FaTrash,
  FaCopy,
  FaHome,
  FaCheck,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserTie,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  getClassroomsByProfessor,
  createClassroom,
  deleteClassroomById,
  updateClassroomById,
} from "@/services/classroomService";
import { logout, getUser } from "@/services/authService";
import Image from "next/image";

interface User {
  id: number;
  name: string;
  email: string;
  role: "professor" | "student";
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

type Classroom = {
  id: string;
  title: string;
  description: string;
  students?: number;
  students_count?: number;
  max_capacity: number;
  start_date: string;
  expiration_date: string;
  join_code: string;
};

// Sidebar responsive
function Sidebar({
  sidebarOpen,
  closeSidebar,
}: {
  sidebarOpen: boolean;
  closeSidebar: () => void;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Obtener información del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      console.log("✅ Sesión cerrada correctamente");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    } finally {
      localStorage.removeItem("token");
      router.push("/auth/login");
    }
  };

  return (
    <motion.aside
      className={`
        fixed top-0 left-0 h-screen w-64 bg-white/95 backdrop-blur-md text-black flex flex-col z-40 
        shadow-2xl border-r border-gray-200/50 pointer-events-auto transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      role="navigation"
      aria-label="Menú principal"
    >
      {/* Header del sidebar */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200/50">
        <motion.span
          className="text-xl font-bold tracking-tight font-sans select-none text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text drop-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg"
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            router.push("/dashboard/professor");
            closeSidebar();
          }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push("/dashboard/professor");
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

      {user && (
        <motion.div
          className="px-6 py-4 border-b border-gray-200/50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <FaUserTie className="text-white text-lg" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full inline-block">
                Profesor
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <nav className="flex-1 px-4 py-6 overflow-y-auto" role="navigation">
        {/* Navegación principal */}
        <div className="mb-4">
          <div className="mb-2 px-3 text-xs text-gray-600 uppercase tracking-wider font-bold">
            Navegación
          </div>
          <ul className="space-y-2" role="list">
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              role="listitem"
            >
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-green-700 bg-green-50">
                <FaHome className="text-green-600" />
                <span className="text-sm">Dashboard</span>
              </div>
            </motion.li>
          </ul>
        </div>

        {/* Acciones */}
        <div>
          <div className="mb-2 px-3 text-xs text-gray-600 uppercase tracking-wider font-bold">
            Acciones
          </div>
          <ul className="space-y-2" role="list">
            {[
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
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-50 hover:to-blue-50 hover:text-green-700 transition-all duration-300 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-green-400"
                  onClick={() => {
                    if (item.action === "logout") {
                      handleLogout();
                    } else if (item.action === "scroll") {
                      closeSidebar();
                      setTimeout(() => {
                        const element = document.querySelector(item.href);
                        element?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }
                  }}
                  tabIndex={0}
                >
                  <item.icon
                    className="group-hover:scale-110 transition-transform duration-200"
                    size={18}
                  />
                  <span className="text-sm">{item.label}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      </nav>
    </motion.aside>
  );
}

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    max_capacity: 1,
    start_date: "",
    expiration_date: "",
  });

  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sidebarRef = useRef<HTMLElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  const closeSidebar = () => {
    setSidebarOpen(false);
    setTimeout(() => {
      hamburgerButtonRef.current?.focus();
    }, 100);
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

  // Gestión de teclas escape
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

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const nowStr = `${yyyy}-${mm}-${dd}T${hh}:${min}`;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClassroomsByProfessor();
        const sorted = [...res.data].sort(
          (a, b) =>
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        );
        setClasses(sorted);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClassroom({
        title: form.title,
        description: form.description,
        max_capacity: form.max_capacity,
        start_date: formatDateForBackend(form.start_date),
        expiration_date: formatDateForBackend(form.expiration_date),
      });
      setShowModal(false);
      setForm({
        title: "",
        description: "",
        max_capacity: 1,
        start_date: "",
        expiration_date: "",
      });
      setLoading(true);
      const res = await getClassroomsByProfessor();
      const sorted = [...res.data].sort(
        (a, b) =>
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      );
      setClasses(sorted);
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Error al crear la clase");
    } finally {
      setLoading(false);
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

  const handleDeleteClass = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta clase?"))
      return;
    try {
      await deleteClassroomById(id);
      setClasses((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting class:", error);
      alert("Error al eliminar la clase");
    }
  };

  function formatDateForBackend(dateStr: string) {
    if (!dateStr) return "";
    const [date, time] = dateStr.split("T");
    return `${date} ${time}`;
  }

  const handleEditClass = (c: Classroom) => {
    setEditMode(true);
    setEditingId(c.id);
    setForm({
      title: c.title,
      description: c.description,
      max_capacity: c.max_capacity,
      start_date: c.start_date
        ? c.start_date.replace(" ", "T").slice(0, 16)
        : "",
      expiration_date: c.expiration_date
        ? c.expiration_date.replace(" ", "T").slice(0, 16)
        : "",
    });
    setShowModal(true);
  };

  const handleEditClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    try {
      await updateClassroomById(editingId, {
        title: form.title,
        description: form.description,
        max_capacity: form.max_capacity,
      });
      setShowModal(false);
      setEditMode(false);
      setEditingId(null);
      setForm({
        title: "",
        description: "",
        max_capacity: 1,
        start_date: "",
        expiration_date: "",
      });
      const res = await getClassroomsByProfessor();
      const sorted = [...res.data].sort(
        (a, b) =>
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      );
      setClasses(sorted);
    } catch (error) {
      console.error("Error editing class:", error);
      alert("Error al editar la clase");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      max_capacity: 1,
      start_date: "",
      expiration_date: "",
    });
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

        <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />

        {/* Contenido principal */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="h-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pt-20 lg:pt-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <motion.header
                className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 sm:mb-8 gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-full lg:w-auto">
                  <motion.div
                    className="relative bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white drop-shadow-lg flex items-center gap-3">
                      <FaUsers className="text-green-400 text-2xl lg:text-3xl" />
                      <span>Panel de Profesor</span>
                    </h1>
                    <p className="text-white/80 text-sm sm:text-base mt-2">
                      Gestiona tus clases y estudiantes
                    </p>
                  </motion.div>
                </div>

                <motion.button
                  className="w-full lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  onClick={() => {
                    setShowModal(true);
                    setEditMode(false);
                    setEditingId(null);
                    setForm({
                      title: "",
                      description: "",
                      max_capacity: 1,
                      start_date: "",
                      expiration_date: "",
                    });
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPlus /> Crear Clase
                </motion.button>
              </motion.header>

              {/* Lista de clases */}
              <motion.section
                id="clases"
                className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text flex items-center gap-3">
                    <FaUsers className="text-gray-400 text-xl sm:text-2xl" />
                    <span>Tus clases activas</span>
                  </h2>
                  <motion.span
                    className="bg-gradient-to-r from-blue-100 to-green-100 text-green-700 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md"
                    whileHover={{ scale: 1.05 }}
                  >
                    {classes.length} clases
                  </motion.span>
                </div>

                {loading ? (
                  <motion.div
                    className="flex justify-center items-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 border-3 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-lg font-semibold text-gray-700">
                        Cargando clases...
                      </span>
                    </div>
                  </motion.div>
                ) : classes.length === 0 ? (
                  <motion.div
                    className="text-center py-20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">
                      Aún no has creado ninguna clase
                    </p>
                    <p className="text-gray-400 text-sm">
                      ¡Crea tu primera clase usando el botón de arriba!
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {classes.map((c, idx) => (
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
                        onClick={() => router.push(`/class/${c.id}/professor`)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            router.push(`/class/${c.id}/professor`);
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
                            {c.students || c.students_count || 0}/
                            {c.max_capacity} alumnos
                          </motion.span>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                          {c.description}
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                          <span className="bg-gray-100 px-2 py-1 rounded-lg font-medium">
                            📅{" "}
                            <strong>{formatearFechaHora(c.start_date)}</strong>
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded-lg font-medium">
                            ⏰{" "}
                            <strong>
                              {formatearFechaHora(c.expiration_date)}
                            </strong>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-auto">
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

                          <motion.button
                            className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            title="Ver alumnos"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/class/${c.id}/professor#students`);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaUsers /> Alumnos
                          </motion.button>

                          <motion.button
                            className="cursor-pointer flex items-center gap-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            title="Editar clase"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClass(c);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaEdit /> Editar
                          </motion.button>

                          <motion.button
                            className="cursor-pointer flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                            title="Eliminar clase"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClass(c.id);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaTrash /> Eliminar
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.section>
            </div>
          </div>

          {/* Modal para crear/editar clase */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
              >
                <motion.form
                  className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md border border-white/20 relative max-h-[90vh] overflow-y-auto"
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  onSubmit={
                    editMode ? handleEditClassSubmit : handleCreateClass
                  }
                >
                  <motion.h2
                    className="text-lg sm:text-xl font-bold mb-4 text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {editMode ? "Editar clase" : "Crear nueva clase"}
                  </motion.h2>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Título
                      </label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-sm"
                        placeholder="Nombre de la clase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        required
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-sm resize-none"
                        rows={2}
                        placeholder="Describe la clase..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Capacidad máxima
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={form.max_capacity}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            max_capacity: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-sm"
                      />
                    </div>

                    {!editMode && (
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Fecha de inicio
                          </label>
                          <input
                            type="datetime-local"
                            required
                            min={nowStr}
                            value={form.start_date}
                            onChange={(e) =>
                              setForm({ ...form, start_date: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Fecha de fin
                          </label>
                          <input
                            type="datetime-local"
                            required
                            min={form.start_date || nowStr}
                            value={form.expiration_date}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                expiration_date: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2 mt-5">
                    <motion.button
                      type="button"
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                      onClick={handleCloseModal}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {editMode ? "Guardar cambios" : "Crear clase"}
                    </motion.button>
                  </div>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>

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
