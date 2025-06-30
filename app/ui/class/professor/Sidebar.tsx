import { useRouter } from "next/navigation";
import {
  FaQrcode,
  FaRandom,
  FaSignOutAlt,
  FaQuestionCircle,
  FaChalkboardTeacher,
  FaStop,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import { EstudianteReal, PreguntaActiva } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { deleteClassroomById } from "@/services/classroomService";
interface SidebarProps {
  girarRuleta: () => void;
  girando: boolean;
  estudiantesFiltrados: EstudianteReal[];
  setShowModal: (b: boolean) => void;
  setMostrarQR: (b: boolean) => void;
  preguntasEnviadas: string[];
  preguntaActiva: PreguntaActiva | null;
  classId: string;
}

// ✅ COMPONENTE MEMO para evitar re-renders innecesarios
const Sidebar = memo(function Sidebar({
  girarRuleta,
  girando,
  estudiantesFiltrados,
  setShowModal,
  setMostrarQR,
  preguntasEnviadas,
  preguntaActiva,
  classId,
}: SidebarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ DETECTAR móvil de forma estable
  const checkIsMobile = useCallback(() => {
    return window.innerWidth < 768;
  }, []);

  // ✅ FUNCIONES ESTABLES con dependencias mínimas
  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleRuleta = useCallback(() => {
    girarRuleta();
    if (checkIsMobile()) {
      closeSidebar();
    }
  }, [girarRuleta, checkIsMobile, closeSidebar]);

  const handleShowModal = useCallback(() => {
    setShowModal(true);
    if (checkIsMobile()) {
      closeSidebar();
    }
  }, [setShowModal, checkIsMobile, closeSidebar]);

  const handleShowQR = useCallback(() => {
    setMostrarQR(true);
    if (checkIsMobile()) {
      closeSidebar();
    }
  }, [setMostrarQR, checkIsMobile, closeSidebar]);

  const handleFinalizarClase = useCallback(async () => {
    if (!(classId && typeof window !== "undefined")) return;
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas finalizar (eliminar) esta clase? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;
    try {
      await deleteClassroomById(classId);
      alert("Clase finalizada correctamente.");
      router.push("/dashboard/professor");
    } catch (error) {
      alert("Error al finalizar la clase.");
      console.error(error);
    }
    if (checkIsMobile()) {
      closeSidebar();
    }
  }, [classId, router, checkIsMobile, closeSidebar]);

  const handleGoToDashboard = useCallback(() => {
    router.push("/dashboard/professor");
    closeSidebar();
  }, [router, closeSidebar]);

  // ✅ VALORES MEMOIZADOS para evitar recálculos
  const ruletaDisabled = useMemo(
    () => girando || estudiantesFiltrados.length === 0,
    [girando, estudiantesFiltrados.length]
  );

  const preguntasRecientes = useMemo(
    () => preguntasEnviadas.slice(0, isMobile ? 2 : 3),
    [preguntasEnviadas, isMobile]
  );

  const showMobileToggle = useMemo(
    () => isMobile && !isOpen,
    [isMobile, isOpen]
  );

  const showSidebar = useMemo(() => !isMobile || isOpen, [isMobile, isOpen]);

  // ✅ useEffect OPTIMIZADO para resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = checkIsMobile();
      setIsMobile(mobile);

      // Si cambia a desktop, cerrar sidebar
      if (!mobile && isOpen) {
        setIsOpen(false);
      }
    };

    // Establecer estado inicial
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, checkIsMobile]); // Dependencias mínimas y estables

  // ✅ COMPONENTE MEMOIZADO para botón móvil
  const MobileToggle = useMemo(() => {
    if (!showMobileToggle) return null;

    return (
      <motion.button
        className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-200/50 md:hidden"
        onClick={openSidebar}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        aria-label="Abrir menú"
      >
        <FaBars className="text-gray-700" size={20} />
      </motion.button>
    );
  }, [showMobileToggle, openSidebar]);

  // ✅ COMPONENTE MEMOIZADO para contenido del sidebar
  const SidebarContent = useMemo(
    () => (
      <>
        {/* Header del sidebar */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-6 border-b border-gray-200/50">
          <motion.span
            className="text-lg md:text-xl font-bold tracking-tight font-sans select-none text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text drop-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg"
            whileHover={{ scale: 1.05 }}
            onClick={handleGoToDashboard}
            tabIndex={0}
            role="button"
            aria-label="Ir al Dashboard"
          >
            CLASSCRAFT
          </motion.span>

          {/* Botón cerrar solo en móvil */}
          {isMobile && (
            <motion.button
              className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={closeSidebar}
              whileTap={{ scale: 0.95 }}
              aria-label="Cerrar menú"
            >
              <FaTimes className="text-gray-500" size={16} />
            </motion.button>
          )}
        </div>

        <nav
          className="flex-1 px-3 md:px-4 py-4 md:py-6 overflow-y-auto"
          role="navigation"
        >
          {/* Acciones principales */}
          <div className="mb-4 md:mb-6">
            <div className="mb-2 md:mb-3 px-2 md:px-3 text-xs text-gray-600 uppercase tracking-wider font-bold">
              Acciones
            </div>
            <ul className="space-y-2 md:space-y-3" role="list">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.button
                  className={`w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-green-400 ${
                    ruletaDisabled
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100"
                  }`}
                  onClick={handleRuleta}
                  disabled={ruletaDisabled}
                  whileHover={!ruletaDisabled ? { scale: 1.02 } : {}}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    animate={girando ? { rotate: 360 } : {}}
                    transition={
                      girando
                        ? { duration: 1, repeat: Infinity, ease: "linear" }
                        : {}
                    }
                  >
                    <FaRandom
                      className="text-purple-600 group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
                      size={isMobile ? 14 : 18}
                    />
                  </motion.div>
                  <span className="text-xs md:text-sm truncate">
                    {girando ? "Girando..." : "Ruleta Aleatoria"}
                  </span>
                </motion.button>
              </motion.li>

              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  className={`w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    preguntaActiva
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                      : "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100"
                  }`}
                  onClick={handleShowModal}
                  disabled={!!preguntaActiva}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaQuestionCircle
                    className={`${
                      preguntaActiva ? "text-blue-100" : "text-green-600"
                    } group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}
                    size={isMobile ? 14 : 18}
                  />
                  <span className="text-xs md:text-sm truncate">
                    {preguntaActiva ? "Pregunta Activa" : "Crear Pregunta Quiz"}
                  </span>
                </motion.button>
              </motion.li>

              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl font-semibold text-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 hover:text-orange-700 transition-all duration-300 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-orange-400"
                  onClick={handleShowQR}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaQrcode
                    className="text-orange-600 group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
                    size={isMobile ? 14 : 18}
                  />
                  <span className="text-xs md:text-sm truncate">
                    Mostrar Código QR
                  </span>
                </motion.button>
              </motion.li>

              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl font-semibold text-gray-700 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 hover:text-red-700 transition-all duration-300 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-red-400"
                  onClick={handleFinalizarClase}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaStop
                    className="text-red-600 group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
                    size={isMobile ? 14 : 18}
                  />
                  <span className="text-xs md:text-sm truncate">
                    Finalizar Clase
                  </span>
                </motion.button>
              </motion.li>
            </ul>
          </div>

          {/* Estado de actividad reciente */}
          <div className="mb-4 md:mb-6">
            <div className="mb-2 md:mb-3 px-2 md:px-3 text-xs text-gray-600 uppercase tracking-wider font-bold">
              Actividad Reciente
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {preguntasEnviadas.length > 0 ? (
                <ul className="space-y-1 md:space-y-2 max-h-24 md:max-h-32 overflow-y-auto pr-1 md:pr-2">
                  {preguntasRecientes.map((pregunta: string, index: number) => (
                    <motion.li
                      key={`pregunta-${index}-${pregunta.slice(0, 10)}`} // Key más estable
                      className="px-2 md:px-3 py-1 md:py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <p className="text-xs text-green-800 font-medium truncate">
                        {pregunta}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <motion.div
                  className="px-3 md:px-4 py-4 md:py-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <FaChalkboardTeacher className="mx-auto text-gray-300 text-xl md:text-2xl mb-2" />
                  <p className="text-xs text-gray-400">
                    Aún no hay preguntas enviadas
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Navegación */}
          <div className="mt-4 md:mt-6">
            <div className="mb-2 md:mb-3 px-2 md:px-3 text-xs text-gray-600 uppercase tracking-wider font-bold">
              Navegación
            </div>
            <motion.button
              className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 hover:text-gray-800 transition-all duration-300 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={handleGoToDashboard}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FaSignOutAlt
                className="text-gray-600 group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
                size={isMobile ? 14 : 18}
              />
              <span className="text-xs md:text-sm truncate">
                Regresar al Dashboard
              </span>
            </motion.button>
          </div>
        </nav>
      </>
    ),
    [
      isMobile,
      handleGoToDashboard,
      closeSidebar,
      ruletaDisabled,
      handleRuleta,
      girando,
      preguntaActiva,
      handleShowModal,
      handleShowQR,
      handleFinalizarClase,
      preguntasEnviadas.length,
      preguntasRecientes,
    ]
  );

  return (
    <>
      {MobileToggle}

      {/* Overlay para móvil */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            className={`fixed top-0 left-0 h-screen bg-white/95 backdrop-blur-md text-black flex flex-col shadow-2xl border-r border-gray-200/50 ${
              isMobile ? "w-72 z-50" : "w-64 z-40"
            }`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {SidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
});

export default Sidebar;
