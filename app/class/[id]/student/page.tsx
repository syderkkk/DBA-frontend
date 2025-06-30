"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaQrcode,
  FaSignOutAlt,
  FaCopy,
  FaCheck,
  FaUsers,
  FaQuestionCircle,
  FaBars,
  FaTimes,
  FaHome,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import {
  getClassroomById,
  getUsersInClassroom,
} from "@/services/classroomService";
import {
  getQuestionsByClassroom,
  answerQuestion,
  checkIfAnswered,
} from "@/services/questionService";

// ACTUALIZADA: Interface para participantes reales del backend
interface Participante {
  id: number;
  name: string;
  email: string;
  role: string;
  current_skin?: string;
  // Stats del classroom
  hp: number;
  max_hp: number;
  mp: number;
  max_mp: number;
  // Stats globales
  experience: number;
  level: number;
  gold: number;
}

// Interface para la pregunta activa del estudiante
interface PreguntaActivaEstudiante {
  id: number;
  pregunta: string;
  opciones: string[];
  yaRespondida: boolean;
}

interface ApiError {
  response?: {
    status: number;
    data?: {
      message: string;
    };
  };
  message: string;
}

// Interface para respuesta de preguntas
interface QuestionResponse {
  data: {
    id: number;
    question: string;
    option_1: string;
    option_2: string;
    option_3?: string | null;
    option_4?: string | null;
    correct_option: string;
    created_at: string;
  }[];
}

// Interface para respuesta de verificación
interface CheckAnswerResponse {
  has_answered: boolean;
}

// NUEVA: Función para obtener la imagen del personaje basada en skin_code
const getCharacterImageUrl = (skinCode?: string): string => {
  // Si no hay skin_code, usar imagen por defecto
  if (!skinCode) {
    console.warn("⚠️ No se proporcionó skin_code, usando imagen por defecto");
    return "/zhongli_avatar.png";
  }

  const skinMap: Record<string, string> = {
    default_mage: "default_mage",
    default_warrior: "default_warrior",
    elite_warrior: "elite_warrior",
    arcane_mage: "arcane_mage",
  };

  // Buscar el skin en el mapeo
  const skinFileName = skinMap[skinCode];

  if (skinFileName) {
    const imagePath = `/skins/${skinFileName}.png`;
    console.log(`✅ Cargando skin: ${skinCode} -> ${imagePath}`);
    return imagePath;
  } else {
    // Si el código no existe en el mapeo, intentar cargar directamente
    console.warn(`⚠️ Skin no mapeada: ${skinCode}, intentando carga directa`);
    return `/skins/${skinCode}.png`;
  }
};

export default function Page() {
  const [codigoClase, setCodigoClase] = useState<string>("");
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [cargandoParticipantes, setCargandoParticipantes] = useState(true);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Estados para la pregunta activa del backend
  const [preguntaActiva, setPreguntaActiva] =
    useState<PreguntaActivaEstudiante | null>(null);
  const [respuesta, setRespuesta] = useState<number | null>(null);
  const [cargandoPregunta, setCargandoPregunta] = useState(false);
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const [mensajeRespuesta, setMensajeRespuesta] = useState<string | null>(null);

  // Referencias para gestión de foco
  const sidebarRef = useRef<HTMLElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  // ACTUALIZADO: Filtrado de participantes por nombre
  const participantesFiltrados = useMemo(
    () =>
      participantes.filter((p) =>
        p.name.toLowerCase().includes(busqueda.toLowerCase())
      ),
    [participantes, busqueda]
  );

  const params = useParams();
  const classId = params?.id as string;

  // Función para cerrar sidebar y gestionar foco
  const closeSidebar = () => {
    setSidebarOpen(false);
    // Devolver foco al botón hamburguesa
    setTimeout(() => {
      hamburgerButtonRef.current?.focus();
    }, 100);
  };

  // Gestión de foco cuando se abre/cierra el sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    // Gestión del foco cuando se abre el sidebar
    if (sidebarOpen) {
      // Cuando se abre, enfoca el primer elemento navegable después de un breve delay
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

  // Gestión de teclas de escape y prevención de scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen) {
        closeSidebar();
      }
    };

    if (sidebarOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevenir scroll del body en móvil
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  // CORREGIDA: Función para cargar participantes del backend
  const cargarParticipantes = useCallback(async (): Promise<void> => {
    if (!classId) return;

    setCargandoParticipantes(true);
    try {
      console.log("👥 Cargando participantes del classroom:", classId);
      const response = await getUsersInClassroom(classId);

      console.log("✅ Participantes obtenidos:", response.data);
      setParticipantes(response.data);
    } catch (error) {
      console.error("💥 Error al cargar participantes:", error);

      const apiError = error as ApiError;

      // NUEVO: Manejo específico de errores
      if (apiError.response?.status === 403) {
        console.warn(
          "⚠️ Sin permisos para ver participantes - posible problema de autenticación"
        );
      } else if (apiError.response?.status === 404) {
        console.warn("⚠️ Classroom no encontrado");
      }

      setParticipantes([]); // Array vacío en caso de error
    } finally {
      setCargandoParticipantes(false);
    }
  }, [classId]);

  // CORREGIDA: Función para cargar preguntas del backend con manejo de errores
  const cargarPreguntaActiva = useCallback(async (): Promise<void> => {
    if (!classId) return;

    setCargandoPregunta(true);
    try {
      console.log("📤 Cargando preguntas del classroom:", classId);
      const response = (await getQuestionsByClassroom(
        classId
      )) as QuestionResponse;
      const preguntas = response.data;

      console.log("✅ Preguntas obtenidas:", preguntas);

      if (preguntas.length > 0) {
        // Obtener la pregunta más reciente (activa)
        const ultimaPregunta = preguntas[preguntas.length - 1];

        console.log("🎯 Pregunta activa encontrada:", ultimaPregunta);

        // Verificar si el usuario ya respondió esta pregunta
        try {
          console.log(
            "🔍 Verificando si ya respondió la pregunta:",
            ultimaPregunta.id
          );
          const responseCheck = (await checkIfAnswered(
            ultimaPregunta.id.toString()
          )) as CheckAnswerResponse;
          const yaRespondio = responseCheck.has_answered;

          console.log(
            "✅ Estado de respuesta:",
            yaRespondio ? "Ya respondió" : "No ha respondido"
          );

          setPreguntaActiva({
            id: ultimaPregunta.id,
            pregunta: ultimaPregunta.question,
            opciones: [
              ultimaPregunta.option_1,
              ultimaPregunta.option_2,
              ultimaPregunta.option_3,
              ultimaPregunta.option_4,
            ].filter((op): op is string => op !== null && op !== ""),
            yaRespondida: yaRespondio,
          });

          if (yaRespondio) {
            setRespuesta(null);
            console.log("🔒 Pregunta ya respondida - bloqueando interfaz");
          }
        } catch (checkError) {
          console.warn(
            "⚠️ Error al verificar estado de respuesta:",
            checkError
          );
          setPreguntaActiva({
            id: ultimaPregunta.id,
            pregunta: ultimaPregunta.question,
            opciones: [
              ultimaPregunta.option_1,
              ultimaPregunta.option_2,
              ultimaPregunta.option_3,
              ultimaPregunta.option_4,
            ].filter((op): op is string => op !== null && op !== ""),
            yaRespondida: false,
          });
        }

        console.log("✅ Pregunta establecida como activa");
      } else {
        console.log("📭 No hay preguntas activas en este classroom");
        setPreguntaActiva(null);
      }
    } catch (error) {
      const apiError = error as ApiError;

      // MEJORADO: Manejo silencioso específico para errores esperados
      if (apiError.response?.status === 404) {
        console.log(
          "📭 No se encontraron preguntas activas (404) - esto es normal"
        );
        setPreguntaActiva(null);
      } else {
        // Solo mostrar otros errores como advertencias
        console.error("💥 Error inesperado al cargar preguntas:", error);
        setPreguntaActiva(null);
      }
    } finally {
      setCargandoPregunta(false);
    }
  }, [classId]);

  // ACTUALIZADO: useEffect para cargar datos iniciales
  useEffect(() => {
    if (!classId) return;

    // Cargar información de la clase
    getClassroomById(classId)
      .then((res) => {
        setCodigoClase(res.data.join_code);
        console.log("✅ Classroom cargado:", res.data);
      })
      .catch(() => {
        setCodigoClase("SIN-CODIGO");
      });

    // ACTIVADO: Cargar pregunta activa
    cargarPreguntaActiva();

    // Cargar participantes de la clase
    cargarParticipantes();
  }, [classId, cargarPreguntaActiva, cargarParticipantes]);

  // Enviar respuesta al backend
  const enviarRespuesta = async (): Promise<void> => {
    if (
      respuesta === null ||
      !preguntaActiva ||
      enviandoRespuesta ||
      preguntaActiva.yaRespondida
    ) {
      return;
    }

    setEnviandoRespuesta(true);
    setMensajeRespuesta(null);

    try {
      console.log("📤 Enviando respuesta:", {
        questionId: preguntaActiva.id,
        selectedOption: `option_${respuesta + 1}`,
      });

      const response = await answerQuestion(preguntaActiva.id.toString(), {
        selected_option: `option_${respuesta + 1}`,
      });

      console.log("✅ Respuesta enviada exitosamente:", response.data);

      setMensajeRespuesta(response.data.message);

      setPreguntaActiva((prev) =>
        prev ? { ...prev, yaRespondida: true } : null
      );

      console.log("🔒 Pregunta marcada como respondida");
    } catch (error) {
      console.error("💥 Error al enviar respuesta:", error);

      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Error al enviar la respuesta";
      setMensajeRespuesta(errorMessage);

      if (
        errorMessage.includes("Ya respondiste") ||
        errorMessage.includes("ya respondiste") ||
        apiError.response?.status === 409
      ) {
        setPreguntaActiva((prev) =>
          prev ? { ...prev, yaRespondida: true } : null
        );
        console.log(
          "🔒 Pregunta marcada como ya respondida (detectado por error)"
        );
      }
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Fondo con imagen y overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/professor-bg.jpg')",
        }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-10 bg-gradient-to-b from-white/70 via-white/50 to-white/80 backdrop-blur-[1px] pointer-events-none" />

      {/* Botón hamburguesa para móvil - Solo mostrar cuando el sidebar esté cerrado */}
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
        {/* Overlay para sidebar móvil */}
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

        {/* CORREGIDO: Sidebar con altura completa fija */}
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
          {/* Header del sidebar */}
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

            {/* Botón cerrar en móvil */}
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

          {/* Navegación */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto" role="navigation">
            <ul className="space-y-3" role="list">
              {[
                {
                  icon: FaHome,
                  label: "Dashboard",
                  href: "/dashboard/student",
                  action: "link",
                },
                {
                  icon: FaChalkboardTeacher,
                  label: "Clases",
                  href: "/dashboard/student#clases",
                  action: "link",
                },
                {
                  icon: FaQrcode,
                  label: "Código/QR",
                  href: "#qr",
                  action: "qr",
                },
                {
                  icon: FaSignOutAlt,
                  label: "Regresar",
                  href: "/dashboard/student",
                  action: "link",
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
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-50 hover:to-blue-50 hover:text-green-700 transition-all duration-300 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-green-400"
                    onClick={() => {
                      if (item.action === "qr") {
                        setMostrarQR(true);
                      } else {
                        router.push(item.href);
                        closeSidebar();
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
          </nav>
        </motion.aside>

        {/* CORREGIDO: Contenido principal con margin adecuado */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="h-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pt-20 lg:pt-6">
            {/* Modal QR - Mejorado para móvil */}
            <AnimatePresence>
              {mostrarQR && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMostrarQR(false)}
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
                      <span>{codigoClase}</span>
                      <motion.button
                        className="cursor-pointer text-green-600 hover:text-green-800 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
                        title="Copiar código"
                        onClick={async () => {
                          await navigator.clipboard.writeText(codigoClase);
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
                          `http://localhost:3000/join?code=${codigoClase}`
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
                      onClick={() => setMostrarQR(false)}
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

            {/* Panel principal mejorado para desktop */}
            <div className="max-w-7xl mx-auto h-full">
              {/* Estado de carga de preguntas */}
              {cargandoPregunta && (
                <motion.div
                  className="w-full flex flex-col items-center justify-center bg-blue-50/80 backdrop-blur-sm rounded-lg shadow-md border-2 border-blue-300/50 px-3 sm:px-4 py-3 sm:py-4 mb-3 sm:mb-4 max-w-xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-800 font-semibold text-xs sm:text-sm">
                      Cargando preguntas activas...
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Pregunta activa del backend - MÁS COMPACTA */}
              {!cargandoPregunta && preguntaActiva && (
                <motion.div
                  className="w-full flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg shadow-md border-2 border-green-400/50 px-3 sm:px-4 py-3 sm:py-4 mb-3 sm:mb-4 max-w-xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-2 sm:mb-3 gap-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-green-800 flex items-center gap-1.5">
                      <FaQuestionCircle className="text-green-600 text-sm sm:text-base" />
                      Pregunta Activa
                    </h3>
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full font-semibold">
                        ID: {preguntaActiva.id}
                      </span>
                      {preguntaActiva.yaRespondida && (
                        <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full font-semibold">
                          ✓ Respondida
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="block text-sm sm:text-base font-semibold text-gray-800 mb-2 sm:mb-3 text-center leading-snug max-w-lg">
                    {preguntaActiva.pregunta}
                  </span>

                  {/* Opciones de respuesta - MÁS COMPACTAS */}
                  <div className="flex flex-col gap-2 w-full max-w-lg">
                    {preguntaActiva.opciones.map((opcion, idx) => (
                      <motion.label
                        key={idx}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                          respuesta === idx
                            ? "border-green-500 bg-green-50"
                            : "border-green-200 bg-white hover:border-green-300"
                        } ${
                          preguntaActiva.yaRespondida
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        whileHover={
                          !preguntaActiva.yaRespondida
                            ? { scale: 1.01 }
                            : {}
                        }
                      >
                        <input
                          type="radio"
                          name="respuesta"
                          checked={respuesta === idx}
                          onChange={() =>
                            !preguntaActiva.yaRespondida && setRespuesta(idx)
                          }
                          className="accent-green-600 w-3.5 h-3.5"
                          disabled={preguntaActiva.yaRespondida}
                        />
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-medium text-gray-800 text-xs sm:text-sm leading-tight">
                          {opcion}
                        </span>
                      </motion.label>
                    ))}
                  </div>

                  {/* Botón enviar respuesta - MÁS COMPACTO */}
                  {!preguntaActiva.yaRespondida && (
                    <motion.button
                      className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 text-xs sm:text-sm"
                      onClick={enviarRespuesta}
                      disabled={respuesta === null || enviandoRespuesta}
                      whileHover={
                        respuesta !== null && !enviandoRespuesta
                          ? { scale: 1.02 }
                          : {}
                      }
                      whileTap={{ scale: 0.98 }}
                    >
                      {enviandoRespuesta && (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {enviandoRespuesta ? "Enviando..." : "Enviar respuesta"}
                    </motion.button>
                  )}

                  {/* Mensaje de resultado - MÁS COMPACTO */}
                  <AnimatePresence>
                    {mensajeRespuesta && (
                      <motion.div
                        className={`mt-2 p-2 rounded-lg border text-xs sm:text-sm ${
                          mensajeRespuesta.includes("correcta") ||
                          mensajeRespuesta.includes("¡")
                            ? "bg-green-100 border-green-300 text-green-800"
                            : "bg-red-100 border-red-300 text-red-800"
                        }`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <p className="font-medium text-center">
                          {mensajeRespuesta}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Estado de pregunta respondida - MÁS COMPACTO */}
                  {preguntaActiva.yaRespondida && (
                    <motion.div
                      className="mt-2 p-2 bg-blue-100/80 border border-blue-300 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-xs sm:text-sm text-blue-800 font-medium text-center flex items-center justify-center gap-1.5">
                        <FaCheck className="text-blue-600 text-xs" />
                        Ya has respondido esta pregunta
                      </p>
                      <p className="text-xs text-blue-600 text-center mt-1">
                        Refresca para ver nuevas preguntas
                      </p>
                    </motion.div>
                  )}

                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Pregunta del backend • Refresca para actualizaciones
                  </p>
                </motion.div>
              )}

              {/* Mensaje cuando no hay preguntas activas - MÁS COMPACTO */}
              {!cargandoPregunta && !preguntaActiva && (
                <motion.div
                  className="w-full flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm rounded-lg shadow-md border-2 border-gray-300/50 px-3 sm:px-4 py-4 sm:py-6 mb-3 sm:mb-4 max-w-lg mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FaQuestionCircle className="text-gray-400 text-2xl sm:text-3xl mb-2" />
                  <h3 className="text-sm sm:text-base font-bold text-gray-600 mb-1 text-center">
                    No hay preguntas activas
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 text-center mb-1">
                    El profesor no ha publicado ninguna pregunta activa en este
                    momento.
                  </p>
                  <p className="text-xs text-gray-400 text-center">
                    Refresca la página para verificar nuevas preguntas
                  </p>
                </motion.div>
              )}

              {/* ACTUALIZADO: Buscador y título con contador real */}
              <motion.div
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4 lg:gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.span
                  className="px-5 lg:px-6 py-3 lg:py-4 rounded-full bg-black/80 text-white shadow-lg backdrop-blur-sm flex items-center gap-3 text-base lg:text-lg font-semibold"
                  whileHover={{ scale: 1.02 }}
                >
                  <FaUsers className="text-green-400 text-xl lg:text-2xl" />
                  <span>Participantes ({participantes.length})</span>
                </motion.span>
                <motion.input
                  type="text"
                  className="px-5 lg:px-6 py-3 lg:py-4 rounded-full bg-black/80 text-white placeholder:text-white/70 shadow-lg backdrop-blur-sm w-full lg:max-w-sm border-none focus:ring-2 focus:ring-green-400 text-base lg:text-lg"
                  placeholder="Buscar participante..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              {/* ACTUALIZADO: Lista de participantes reales */}
              <div className="h-full">
                {/* Loading state */}
                {cargandoParticipantes && (
                  <motion.div
                    className="flex justify-center items-center py-20 lg:py-32"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-lg lg:text-xl font-semibold text-gray-700">
                        Cargando participantes...
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Grid de participantes - Optimizado para desktop */}
                {!cargandoParticipantes && (
                  <motion.div
                    className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {participantesFiltrados.length === 0 &&
                      !cargandoParticipantes && (
                        <div className="col-span-full flex justify-center py-16">
                          <motion.span
                            className="px-6 py-4 rounded-2xl bg-black/80 text-white shadow-lg backdrop-blur-sm text-lg font-semibold text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            {busqueda
                              ? "No se encontraron participantes con ese nombre."
                              : "No hay participantes en esta clase."}
                          </motion.span>
                        </div>
                      )}

                    {participantesFiltrados.map((participante, index) => (
                      <motion.div
                        key={participante.id}
                        className="group relative flex flex-col items-center gap-3 p-4 lg:p-6 rounded-2xl shadow-xl border-2 transition-all duration-300 bg-white/90 backdrop-blur-sm border-green-100 hover:border-green-300 hover:shadow-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 25px 50px rgba(34, 197, 94, 0.15)",
                        }}
                      >
                        {/* ACTUALIZADA: Imagen del personaje basada en current_skin */}
                        <motion.div
                          className="relative"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Image
                            src={getCharacterImageUrl(participante.current_skin)}
                            alt={`Avatar de ${participante.name}`}
                            width={80}
                            height={80}
                            className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full border-4 border-green-300 shadow-md bg-white object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              console.warn(
                                `❌ Error cargando skin para ${participante.name}:`,
                                participante.current_skin
                              );
                              target.src = "/zhongli_avatar.png";
                            }}
                            onLoad={() => {
                              console.log(
                                `🖼️ Skin cargada exitosamente para ${participante.name}:`,
                                participante.current_skin
                              );
                            }}
                          />
                          <div className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-green-500 rounded-full border-2 border-white"></div>
                        </motion.div>

                        {/* ACTUALIZADO: Nombre real del participante */}
                        <span className="block text-sm lg:text-base xl:text-lg font-semibold text-green-900 text-center px-2 line-clamp-2">
                          {participante.name}
                        </span>

                        {/* ACTUALIZADO: Stats del personaje del backend - Desktop optimizado */}
                        <div className="flex flex-wrap gap-1.5 lg:gap-2 text-xs lg:text-xs justify-center">
                          <motion.span
                            className="bg-red-100 text-red-700 px-2 lg:px-2.5 py-1 rounded font-bold"
                            whileHover={{ scale: 1.05 }}
                          >
                            ❤️ {participante.hp}/{participante.max_hp}
                          </motion.span>
                          <motion.span
                            className="bg-blue-100 text-blue-700 px-2 lg:px-2.5 py-1 rounded font-bold"
                            whileHover={{ scale: 1.05 }}
                          >
                            ⭐ Lv.{participante.level}
                          </motion.span>
                          <motion.span
                            className="bg-green-100 text-green-700 px-2 lg:px-2.5 py-1 rounded font-bold"
                            whileHover={{ scale: 1.05 }}
                          >
                            🎯 {participante.experience}
                          </motion.span>
                          <motion.span
                            className="bg-yellow-100 text-yellow-700 px-2 lg:px-2.5 py-1 rounded font-bold"
                            whileHover={{ scale: 1.05 }}
                          >
                            🪙 {participante.gold}
                          </motion.span>
                          <motion.span
                            className="bg-purple-100 text-purple-700 px-2 lg:px-2.5 py-1 rounded font-bold"
                            whileHover={{ scale: 1.05 }}
                          >
                            💙 {participante.mp}/{participante.max_mp}
                          </motion.span>
                        </div>

                        {/* NUEVO: Email del participante - Responsive */}
                        <div className="text-xs lg:text-sm text-gray-400 mt-1 truncate max-w-full px-2 text-center">
                          {participante.email}
                        </div>

                        {/* NUEVO: Role badge - Responsive */}
                        <motion.div
                          className={`text-xs lg:text-sm px-2.5 py-1 rounded-full font-bold ${
                            participante.role === "professor"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {participante.role === "professor"
                            ? "👨‍🏫 Profesor"
                            : "👨‍🎓 Estudiante"}
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}