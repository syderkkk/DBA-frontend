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
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  getClassroomsByProfessor,
  createClassroom,
} from "@/services/classroomService";

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

function Sidebar() {
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
        >
          <FaCog /> Cerrar sesión
        </a>
      </div>
    </aside>
  );
}

export default function Page() {
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClassroomsByProfessor();
        // Ordenar por fecha de inicio descendente (más reciente primero)
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
      await createClassroom({ name: form.title, ...form });
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
      // Ordenar por fecha de inicio descendente (más reciente primero)
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 ml-64 py-10 px-2 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <header className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 drop-shadow-lg flex items-center gap-3">
              <FaUsers className="text-blue-500" /> Panel de Profesor
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-full shadow-lg transition-all duration-200 text-lg"
            >
              <FaPlus /> Crear Clase
            </button>
          </header>
          {/* Lista de clases */}
          <section className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-blue-700 flex items-center gap-2">
                <FaUsers className="text-blue-400" /> Tus clases activas
              </h2>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
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
                    className="relative group bg-gray-50 rounded-xl border border-gray-200 shadow p-5 flex flex-col gap-3 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
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
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                        {c.students || c.students_count || 0}/{c.max_capacity} alumnos
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1 line-clamp-2">
                      {c.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-1">
                      <span className="bg-gray-200 px-2 py-0.5 rounded">
                        Inicio: <strong>{c.start_date}</strong>
                      </span>
                      <span className="bg-gray-200 px-2 py-0.5 rounded">
                        Fin: <strong>{c.expiration_date}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                      <button
                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-900 rounded hover:bg-blue-200 text-xs font-semibold"
                        title="Copiar código de clase"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(c.join_code);
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
                        className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs"
                        title="Editar clase"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                        title="Eliminar clase"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow">
                        Más reciente
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
        {/* Modal para crear clase */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            >
              <motion.form
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200 relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleCreateClass}
              >
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Crear nueva clase
                </h2>
                <div className="mb-3">
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={2}
                  />
                </div>
                <div className="mb-3 flex gap-2">
                  <div className="flex-1">
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
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
                <div className="mb-3 flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Fecha de inicio
                    </label>
                    <input
                      type="date"
                      required
                      value={form.start_date}
                      onChange={(e) =>
                        setForm({ ...form, start_date: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Fecha de fin
                    </label>
                    <input
                      type="date"
                      required
                      value={form.expiration_date}
                      onChange={(e) =>
                        setForm({ ...form, expiration_date: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                  >
                    Crear clase
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}