"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaUsers,
  FaEdit,
  FaTrash,
  FaCopy,
  FaCog,
  FaHome,
  FaCheck,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  getClassroomsByProfessor,
  createClassroom,
  deleteClassroomById,
  updateClassroomById,
} from "@/services/classroomService";
import Image from "next/image"; // Importa Image para el QR

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

import { logout } from "@/services/authService";

function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
    localStorage.removeItem("token");
    router.push("/");
  };
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white text-black flex flex-col z-40 shadow-[0_0_32px_0_rgba(0,0,0,0.18)] border-r border-gray-200">
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
              href="#"
            >
              <FaHome /> Inicio
            </a>
          </li>
        </ul>
        <div className="mt-10 mb-2 px-3 text-xs text-black uppercase tracking-wider font-bold">
          Menú
        </div>
        <ul className="space-y-2">
          <li>
            <span className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-black transition cursor-pointer font-medium">
              <span className="bg-gray-200 text-black rounded-full w-6 h-6 flex items-center justify-center font-bold shadow">
                X
              </span>
              Opción
            </span>
          </li>
        </ul>
      </nav>
      <div className="mt-auto px-4 py-6 border-t border-gray-200">
        <a
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-black transition text-black font-semibold"
          href="#"
          onClick={handleLogout}
        >
          <FaCog /> Cerrar sesión
        </a>
      </div>
    </aside>
  );
}

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    max_capacity: 1,
    start_date: "",
    expiration_date: "",
  });
  const router = useRouter();

  const [copied, setCopied] = useState(false);

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

  // Modal de editar
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

  // MODIFICADO: Solo enviar los campos requeridos por el backend al editar
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

  // Estado para el modal de código y QR
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

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
        <Sidebar />
        <main className="flex-1 ml-64 py-10 px-2 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <header className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 drop-shadow-lg flex items-center gap-3">
                <span className="px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm flex flex-row items-center gap-2">
                  <FaUsers className="text-green-500 text-2xl" />
                  <span>Panel de Profesor</span>
                </span>
              </h1>
              <button
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
                className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-full shadow-lg transition-all duration-200 text-lg"
              >
                <FaPlus /> Crear Clase
              </button>
            </header>
            {/* Lista de clases */}
            <section className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
                  <FaUsers className="text-gray-400" /> Tus clases activas
                </h2>
                <span className="bg-blue-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {classes.length} clases
                </span>
              </div>
              {loading ? (
                <p className="text-gray-500 text-center py-8">
                  Cargando clases...
                </p>
              ) : classes.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Aún no has creado ninguna clase.
                </p>
              ) : (
                <div className="flex flex-col gap-6">
                  {classes.map((c, idx) => (
                    <motion.div
                      key={c.id}
                      className="relative group bg-gray-50 rounded-xl border border-gray-200 shadow p-5 flex flex-col gap-3 hover:border-green-400 hover:shadow-lg transition-all cursor-pointer"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 8px 24px rgba(59,130,246,0.10)",
                      }}
                      onClick={() => router.push(`/class/${c.id}`)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") router.push(`/class/${c.id}`);
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-lg text-gray-800 truncate">
                          {c.title}
                        </h3>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                          {c.students || c.students_count || 0}/{c.max_capacity}{" "}
                          alumnos
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
                          title="Copiar código de clase"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCode(c.join_code);
                            setShowCodeModal(true);
                          }}
                        >
                          <FaCopy /> {c.join_code}
                        </button>
                        <button
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs"
                          title="Ver alumnos"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/class/${c.id}#students`);
                          }}
                        >
                          <FaUsers /> Alumnos
                        </button>
                        <button
                          className="cursor-pointer flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs"
                          title="Editar clase"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClass(c);
                          }}
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          className="cursor-pointer flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                          title="Eliminar clase"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClass(c.id);
                          }}
                        >
                          <FaTrash /> Eliminar
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
          {/* Modal para crear/editar clase */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15, ease: "linear" },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.12, ease: "linear" },
                }}
                onClick={handleCloseModal}
              >
                <motion.form
                  className="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-md border border-gray-200 relative max-h-[90vh] overflow-y-auto"
                  initial={{ scale: 0.97, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: { duration: 0.18, ease: "linear" },
                  }}
                  exit={{
                    scale: 0.97,
                    opacity: 0,
                    transition: { duration: 0.13, ease: "linear" },
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onSubmit={
                    editMode ? handleEditClassSubmit : handleCreateClass
                  }
                >
                  <h2 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">
                    {editMode ? "Editar clase" : "Crear nueva clase"}
                  </h2>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      required
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                      rows={2}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div className="mb-2 flex flex-col sm:flex-row gap-2">
                    {!editMode && (
                      <>
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
                      onClick={handleCloseModal}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition cursor-pointer"
                    >
                      {editMode ? "Guardar cambios" : "Crear clase"}
                    </button>
                  </div>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
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
