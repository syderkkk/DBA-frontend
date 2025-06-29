"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  FaQrcode,
  FaRandom,
  FaSignOutAlt,
  FaCopy,
  FaQuestionCircle,
  FaCheck,
  FaTimes,
  FaPlus,
  FaUsers,
  FaMagic,
  FaSpinner,
} from "react-icons/fa";

import { generateQuestionWithAI } from "@/services/aiService";

import {
  createQuestion,
  getQuestionsByClassroom,
  closeQuestion,
  rewardStudent,
  penalizeStudent,
} from "@/services/questionService";
import {
  getClassroomById,
  getUsersInClassroom,
  removeUserFromClassroom,
} from "@/services/classroomService";
import { useRouter, useParams } from "next/navigation";

interface EstudianteReal {
  id: number;
  name: string;
  email: string;
  role: string;
  current_skin: string | null;
  hp: number;
  max_hp: number;
  mp: number;
  max_mp: number;
  experience: number;
  level: number;
  gold: number;
  created_at: string;
  updated_at: string;
}

interface PreguntaActiva {
  id: number;
  pregunta: string;
  opciones: string[];
  correcta: number;
  timestamp: number;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

interface CreateQuestionPayload {
  question: string;
  option_1: string;
  option_2: string;
  option_3?: string;
  option_4?: string;
  correct_option: string;
}

interface QuestionFromBackend {
  id: number;
  question: string;
  option_1: string;
  option_2: string;
  option_3: string | null;
  option_4: string | null;
  correct_option: string;
  is_active: boolean;
  created_at: string;
}

// NUEVA: Función para obtener la imagen del personaje basada en skin_code
const getCharacterImageUrl = (skinCode?: string | null): string => {
  // Si no hay skin_code, usar imagen por defecto
  if (!skinCode) {
    console.warn("⚠️ No se proporcionó skin_code, usando imagen por defecto");
    return "/zhongli_avatar.png";
  }

  // Mapeo de códigos de skin a nombres de archivo
  const skinMap: Record<string, string> = {
    // Magos
    default_mage: "default_mage",
    default_warrior: "default_warrior",
    arcane_mage: "arcane_mage",
    elite_warrior: "elite_warrior",
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

// Sidebar
function Sidebar({
  girarRuleta,
  girando,
  estudiantesFiltrados,
  setShowModal,
  setMostrarQR,
  preguntasEnviadas,
  preguntaActiva,
}: {
  girarRuleta: () => void;
  girando: boolean;
  estudiantesFiltrados: EstudianteReal[];
  setShowModal: (b: boolean) => void;
  setMostrarQR: (b: boolean) => void;
  preguntasEnviadas: string[];
  preguntaActiva: PreguntaActiva | null;
}) {
  const router = useRouter();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white text-black flex flex-col z-40 shadow-[0_0_32px_0_rgba(0,0,0,0.18)] border-r border-gray-200">
      <div className="flex items-center gap-2 px-6 py-7 border-b border-gray-200">
        <span
          className="text-2xl font-bold tracking-tight font-sans select-none text-black drop-shadow cursor-pointer hover:text-green-600 transition-colors duration-200"
          onClick={() => router.push("/dashboard/professor")}
          title="Ir al Dashboard"
        >
          CLASSCRAFT
        </span>
      </div>
      <nav className="flex-1 px-4 py-6">
        <div className="mt-10 mb-2 px-3 text-xs text-black uppercase tracking-wider font-bold">
          Acciones
        </div>
        <ul className="space-y-2">
          <li>
            <button
              className="cursor-pointer flex items-center gap-3 px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm font-semibold transition hover:bg-black/90 w-full disabled:opacity-60"
              onClick={girarRuleta}
              disabled={girando || estudiantesFiltrados.length === 0}
            >
              <FaRandom className="text-green-500 text-xl" />{" "}
              {girando ? "Girando..." : "Ruleta Aleatoria"}
            </button>
          </li>
          <li>
            <button
              className={`cursor-pointer flex items-center gap-3 px-5 py-2 rounded-full shadow-lg backdrop-blur-sm font-semibold transition w-full ${
                preguntaActiva
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-black/70 text-white hover:bg-black/90"
              }`}
              onClick={() => setShowModal(true)}
              disabled={!!preguntaActiva}
            >
              <FaQuestionCircle className="text-green-500 text-xl" />
              {preguntaActiva ? "Pregunta Activa" : "Crear pregunta tipo quiz"}
            </button>
          </li>
          <li>
            <button
              className="cursor-pointer flex items-center gap-3 px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm font-semibold transition hover:bg-black/90 w-full"
              onClick={() => setMostrarQR(true)}
            >
              <FaQrcode className="text-green-500 text-xl" /> Código/QR
            </button>
          </li>
          <li>
            <button
              className="cursor-pointer flex items-center gap-3 px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm font-semibold transition hover:bg-black/90 w-full"
              onClick={() => router.push("/dashboard/professor")}
            >
              <FaSignOutAlt className="text-green-500 text-xl" /> Regresar al
              inicio
            </button>
          </li>
        </ul>

        <div className="mt-10 mb-2 px-3 text-xs text-black uppercase tracking-wider font-bold">
          {preguntaActiva ? "Pregunta en Curso" : "Preguntas recientes"}
        </div>

        {preguntaActiva ? (
          <div className="px-3 py-2 bg-blue-50 rounded-lg mx-2 border border-blue-200">
            <p className="text-xs text-blue-800 font-medium">
              {preguntaActiva.pregunta.substring(0, 40)}
              {preguntaActiva.pregunta.length > 40 ? "..." : ""}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {preguntaActiva.opciones.length} opciones • ID:{" "}
              {preguntaActiva.id}
            </p>
          </div>
        ) : (
          <ul className="space-y-1 max-h-32 overflow-y-auto pr-2">
            {preguntasEnviadas.slice(0, 3).map((p: string, i: number) => (
              <li
                key={i}
                className="bg-green-50 rounded px-2 py-1 text-green-800 text-sm"
              >
                {p}
              </li>
            ))}
            {preguntasEnviadas.length === 0 && (
              <li className="text-gray-400 text-sm text-center">
                Sin preguntas
              </li>
            )}
          </ul>
        )}
      </nav>
    </aside>
  );
}

export default function Page() {
  const [codigoClase, setCodigoClase] = useState<string>("");
  // ACTUALIZADO: Usar EstudianteReal en lugar del mock
  const [estudiantes, setEstudiantes] = useState<EstudianteReal[]>([]);
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(false);

  const [mostrarQR, setMostrarQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [preguntasEnviadas, setPreguntasEnviadas] = useState<string[]>([]);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [girando, setGirando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Modal para pregunta tipo quiz
  const [showModal, setShowModal] = useState(false);
  const [pregunta, setPregunta] = useState("");
  const [opciones, setOpciones] = useState(["", ""]);
  const [correctOption, setCorrectOption] = useState<number | null>(null);

  // Estados para la generación con IA
  const [generatingWithAI, setGeneratingWithAI] = useState(false);
  const [topicInput, setTopicInput] = useState("");

  const generarPreguntaConIA = async (): Promise<void> => {
    if (!pregunta.trim()) {
      alert("Por favor ingresa un tema para generar la pregunta");
      return;
    }

    setGeneratingWithAI(true);
    setTopicInput(pregunta);

    try {
      console.log("🤖 Iniciando generación con Gemini IA para:", pregunta);

      const generatedQuestion = await generateQuestionWithAI(pregunta);

      console.log("✅ Pregunta generada:", generatedQuestion);

      // Actualizar todos los campos con la respuesta de la IA
      setPregunta(generatedQuestion.question);
      setOpciones(generatedQuestion.options);
      setCorrectOption(generatedQuestion.correctIndex);

      alert("✨ ¡Pregunta generada exitosamente con Gemini AI!");
    } catch (error) {
      console.error("💥 Error al generar pregunta con IA:", error);
      alert("❌ Error al generar la pregunta. Intenta de nuevo.");
      setPregunta(topicInput);
    } finally {
      setGeneratingWithAI(false);
    }
  };
  // ACTUALIZADO: Estado para la pregunta activa con ID
  const [preguntaActiva, setPreguntaActiva] = useState<PreguntaActiva | null>(
    null
  );

  const params = useParams();
  const classId = params?.id as string;

  // ACTUALIZADO: Filtrado de estudiantes por nombre usando 'name' en lugar de 'nombre'
  const estudiantesFiltrados = useMemo(
    () =>
      estudiantes.filter((e) =>
        e.name.toLowerCase().includes(busqueda.toLowerCase())
      ),
    [estudiantes, busqueda]
  );

  // ACTUALIZADO: useEffect para cargar datos reales del backend
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

    // NUEVO: Cargar estudiantes reales del classroom
    setCargandoEstudiantes(true);
    getUsersInClassroom(classId)
      .then((res) => {
        const estudiantesData = res.data;
        console.log("✅ Estudiantes cargados:", estudiantesData);
        setEstudiantes(estudiantesData);
      })
      .catch((error) => {
        console.error("💥 Error al cargar estudiantes:", error);
        setEstudiantes([]);
      })
      .finally(() => {
        setCargandoEstudiantes(false);
      });

    // EXISTENTE: Cargar preguntas existentes con manejo silencioso de 404
    getQuestionsByClassroom(classId)
      .then((res) => {
        const preguntas = res.data;
        console.log("✅ Preguntas existentes:", preguntas);

        // Agregar preguntas existentes al historial
        if (preguntas.length > 0) {
          const preguntasHistorial = preguntas.map(
            (p: QuestionFromBackend) =>
              `${p.question.substring(0, 40)}${
                p.question.length > 40 ? "..." : ""
              }`
          );
          setPreguntasEnviadas(preguntasHistorial);

          // Si hay una pregunta activa, mostrarla
          const ultimaPregunta = preguntas[preguntas.length - 1];
          if (ultimaPregunta.is_active) {
            setPreguntaActiva({
              id: ultimaPregunta.id,
              pregunta: ultimaPregunta.question,
              opciones: [
                ultimaPregunta.option_1,
                ultimaPregunta.option_2,
                ultimaPregunta.option_3,
                ultimaPregunta.option_4,
              ].filter((op) => op !== null && op !== ""),
              correcta:
                parseInt(ultimaPregunta.correct_option.split("_")[1]) - 1,
              timestamp: new Date(ultimaPregunta.created_at).getTime(),
            });
          }
        }
      })
      .catch((err) => {
        // CORREGIDO: Manejo silencioso de error 404
        if (err.response?.status === 404) {
          console.log(
            "📭 No se encontraron preguntas activas (404) - esto es normal"
          );
        } else {
          console.error("💥 Error inesperado al cargar preguntas:", err);
        }
      });
  }, [classId]);

  // Ruleta animada segura
  const girarRuleta = () => {
    if (estudiantesFiltrados.length === 0 || girando) return;
    setGirando(true);
    let current = 0;
    let pasos = 0;
    const totalPasos =
      estudiantesFiltrados.length * 3 +
      Math.floor(Math.random() * estudiantesFiltrados.length);
    const interval = setInterval(() => {
      setSeleccionado(estudiantesFiltrados[current].id);
      current = (current + 1) % estudiantesFiltrados.length;
      pasos++;
      if (pasos > totalPasos) {
        clearInterval(interval);
        setGirando(false);
      }
    }, 110);
  };

  // ACTUALIZADO: Función de expulsar (preparada para API real)
  const expulsar = async (id: number) => {
    // Confirmar la acción
    const estudiante = estudiantes.find((e) => e.id === id);
    if (!estudiante) return;

    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas expulsar a ${estudiante.name} de la clase?`
    );

    if (!confirmacion) return;

    try {
      console.log(
        `🚫 Expulsando estudiante ID: ${id} del classroom: ${classId}`
      );

      // Llamar a la API para remover el usuario del classroom
      await removeUserFromClassroom(classId, { userId: id.toString() });

      console.log("✅ Estudiante expulsado exitosamente");

      // Actualizar la lista local de estudiantes
      setEstudiantes(estudiantes.filter((e) => e.id !== id));

      // Si el estudiante expulsado estaba seleccionado, limpiar la selección
      if (seleccionado === id) setSeleccionado(null);

      // Mostrar mensaje de éxito
      alert(`${estudiante.name} ha sido expulsado de la clase correctamente.`);
    } catch (error) {
      console.error("💥 Error al expulsar estudiante:", error);
      const typedError = error as ErrorResponse;

      // Manejar diferentes tipos de errores
      const errorMessage =
        typedError.response?.data?.message ||
        typedError.message ||
        "Error al expulsar al estudiante";

      alert(`Error: ${errorMessage}`);
    }
  };

  // EXISTENTE: Función para cerrar la pregunta activa
  const cerrarPreguntaActiva = async (): Promise<void> => {
    if (!preguntaActiva) return;

    try {
      await closeQuestion(preguntaActiva.id.toString());
      console.log("✅ Pregunta cerrada exitosamente");
      setPreguntaActiva(null);
    } catch (error) {
      console.error("💥 Error al cerrar pregunta:", error);
      alert("Error al cerrar la pregunta");
    }
  };

  // EXISTENTE: Enviar pregunta tipo quiz que extrae del backend
  const enviarPreguntaQuiz = async (): Promise<void> => {
    if (
      !pregunta.trim() ||
      opciones.length < 2 ||
      opciones.length > 4 ||
      opciones.some((o) => !o.trim()) ||
      correctOption === null
    ) {
      return;
    }

    const payload: CreateQuestionPayload = {
      question: pregunta,
      option_1: opciones[0],
      option_2: opciones[1],
      correct_option: `option_${correctOption + 1}`,
    };

    // Agregar opciones opcionales de forma type-safe
    if (opciones[2]?.trim()) {
      payload.option_3 = opciones[2];
    }
    if (opciones[3]?.trim()) {
      payload.option_4 = opciones[3];
    }

    try {
      // 1. Crear la pregunta en el backend
      console.log("📤 Creando pregunta en backend...");
      const response = await createQuestion(classId, payload);
      console.log("✅ Pregunta creada:", response);

      // 2. Obtener las preguntas actualizadas del backend
      console.log("📤 Obteniendo preguntas del backend...");
      const preguntasResponse = await getQuestionsByClassroom(classId);
      const preguntas = preguntasResponse.data;
      console.log("✅ Preguntas obtenidas:", preguntas);

      // 3. Obtener la pregunta más reciente (la que acabamos de crear)
      const preguntaMasReciente = preguntas[
        preguntas.length - 1
      ] as QuestionFromBackend;
      console.log("🎯 Pregunta más reciente:", preguntaMasReciente);

      // 4. Establecer como pregunta activa usando datos del backend
      setPreguntaActiva({
        id: preguntaMasReciente.id,
        pregunta: preguntaMasReciente.question,
        opciones: [
          preguntaMasReciente.option_1,
          preguntaMasReciente.option_2,
          preguntaMasReciente.option_3,
          preguntaMasReciente.option_4,
        ].filter((op): op is string => op !== null && op !== ""), // Type guard más específico
        correcta:
          parseInt(preguntaMasReciente.correct_option.split("_")[1]) - 1, // Convertir "option_1" a 0
        timestamp: Date.now(),
      });

      console.log("✅ Pregunta activa establecida desde backend");

      // Agregar a preguntas recientes
      setPreguntasEnviadas([
        `${pregunta.substring(0, 40)}${pregunta.length > 40 ? "..." : ""}`,
        ...preguntasEnviadas,
      ]);

      // Limpiar modal
      setPregunta("");
      setOpciones(["", ""]);
      setCorrectOption(null);
      setShowModal(false);
    } catch (err) {
      console.error("💥 Error al crear la pregunta:", err);
      alert("Error al crear la pregunta");
    }
  };

  const manejarRespuestaCorrecta = async (estudianteId: number) => {
    if (!estudianteId) return;

    try {
      console.log(
        `✅ Procesando respuesta correcta para estudiante ID: ${estudianteId}`
      );

      // Recompensar al estudiante (oro y experiencia)
      await rewardStudent(classId, estudianteId.toString(), {
        gold: 10, // +10 oro por respuesta correcta
        experience: 25, // +25 XP por respuesta correcta
      });

      console.log("🎉 Estudiante recompensado exitosamente");

      // Actualizar la lista local de estudiantes
      setEstudiantes((prevEstudiantes) =>
        prevEstudiantes.map((e) =>
          e.id === estudianteId
            ? {
                ...e,
                gold: e.gold + 10,
                experience: e.experience + 25,
                // Calcular nuevo nivel si es necesario (ejemplo: cada 100 XP = 1 nivel)
                level: Math.floor((e.experience + 25) / 100) + 1,
              }
            : e
        )
      );

      // Limpiar selección
      setSeleccionado(null);

      // Mostrar mensaje de éxito
      const estudiante = estudiantes.find((e) => e.id === estudianteId);
      if (estudiante) {
        alert(
          `🎉 ¡${estudiante.name} respondió correctamente!\n+10 oro, +25 XP`
        );
      }
    } catch (error) {
      console.error("💥 Error al recompensar estudiante:", error);
      const typedError = error as ErrorResponse;
      const errorMessage =
        typedError.response?.data?.message ||
        typedError.message ||
        "Error al procesar la recompensa";
      alert(`Error: ${errorMessage}`);
    }
  };

  // NUEVA: Función para manejar respuesta incorrecta
  const manejarRespuestaIncorrecta = async (estudianteId: number) => {
    if (!estudianteId) return;

    try {
      console.log(
        `❌ Procesando respuesta incorrecta para estudiante ID: ${estudianteId}`
      );

      // Penalizar al estudiante (restar HP)
      await penalizeStudent(classId, estudianteId.toString(), {
        hp: 10, // -10 HP por respuesta incorrecta
      });

      console.log("💔 Estudiante penalizado exitosamente");

      // Actualizar la lista local de estudiantes
      setEstudiantes((prevEstudiantes) =>
        prevEstudiantes.map((e) =>
          e.id === estudianteId
            ? {
                ...e,
                hp: Math.max(0, e.hp - 10), // No permitir HP negativo
              }
            : e
        )
      );

      // Limpiar selección
      setSeleccionado(null);

      // Mostrar mensaje
      const estudiante = estudiantes.find((e) => e.id === estudianteId);
      if (estudiante) {
        alert(`💔 ${estudiante.name} respondió incorrectamente.\n-10 HP`);
      }
    } catch (error) {
      console.error("💥 Error al expulsar estudiante:", error);
      const typedError = error as ErrorResponse;

      // Manejar diferentes tipos de errores
      const errorMessage =
        typedError.response?.data?.message ||
        typedError.message ||
        "Error al expulsar al estudiante";

      alert(`Error: ${errorMessage}`);
    }
  };

  // Eliminar estudiante seleccionado
  const limpiarSeleccionado = () => {
    setSeleccionado(null);
  };

  // Funciones para agregar/quitar opciones
  const agregarOpcion = () => {
    if (opciones.length < 4) setOpciones([...opciones, ""]);
  };

  const quitarOpcion = (idx: number) => {
    if (opciones.length <= 2) return;
    const nuevasOpciones = opciones.filter((_, i) => i !== idx);
    setOpciones(nuevasOpciones);
    if (correctOption === idx) setCorrectOption(null);
    else if (correctOption !== null && correctOption > idx)
      setCorrectOption(correctOption - 1);
  };

  // ACTUALIZADO: Encuentra el estudiante seleccionado usando datos reales
  const estudianteSeleccionado = estudiantes.find((e) => e.id === seleccionado);

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
        <Sidebar
          girarRuleta={girarRuleta}
          girando={girando}
          estudiantesFiltrados={estudiantesFiltrados}
          setShowModal={setShowModal}
          setMostrarQR={setMostrarQR}
          preguntasEnviadas={preguntasEnviadas}
          preguntaActiva={preguntaActiva}
        />

        {/* Contenido principal */}
        <main className="flex-1 ml-64 py-10 px-2 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Modal QR */}
            {mostrarQR && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-200 relative flex flex-col items-center animate-fade-in">
                  <h2 className="text-xl font-bold text-green-700 mb-4">
                    Código de la clase
                  </h2>
                  <span className="text-3xl font-mono text-green-900 mb-4 flex items-center gap-2">
                    {codigoClase}
                    <button
                      className="cursor-pointer ml-2 text-green-700 hover:text-green-900 transition"
                      title="Copiar código"
                      onClick={async () => {
                        await navigator.clipboard.writeText(codigoClase);
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
                        `http://localhost:3000/join?code=${codigoClase}`
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
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold shadow transition cursor-pointer"
                    onClick={() => setMostrarQR(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}

            {/* Modal para crear pregunta tipo quiz */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden border border-gray-200">
                  {/* Header compacto */}
                  <div className="bg-white border-b border-gray-200 px-6 py-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <FaQuestionCircle className="text-indigo-600 text-sm" />
                        </div>
                        Crear Pregunta Quiz
                      </h2>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setPregunta("");
                          setOpciones(["", ""]);
                          setCorrectOption(null);
                          setGeneratingWithAI(false);
                          setTopicInput("");
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-lg"
                        disabled={generatingWithAI}
                      >
                        <FaTimes size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Contenido principal */}
                  <div className="p-5 space-y-5">
                    {/* Sección de pregunta */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🤔 Pregunta o Tema
                      </label>
                      <div className="relative">
                        <textarea
                          className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm resize-none h-20 transition-colors disabled:bg-gray-50"
                          placeholder="Escribe tu pregunta o un tema como 'MongoDB', 'JavaScript' para generar con IA..."
                          value={pregunta}
                          onChange={(e) => setPregunta(e.target.value)}
                          disabled={generatingWithAI}
                        />

                        {/* Botón IA */}
                        <button
                          type="button"
                          onClick={generarPreguntaConIA}
                          disabled={generatingWithAI || !pregunta.trim()}
                          className="cursor-pointer absolute bottom-2.5 right-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 shadow-md"
                        >
                          {generatingWithAI ? (
                            <>
                              <FaSpinner className="animate-spin text-xs" />
                              Generando...
                            </>
                          ) : (
                            <>
                              <FaMagic className=" text-xs" />
                              Generar con IA
                            </>
                          )}
                        </button>
                      </div>

                      {/* Estado de carga IA */}
                      {generatingWithAI && (
                        <div className="mt-2 p-2.5 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FaSpinner className="animate-spin text-purple-600 text-sm" />
                            <span className="text-xs font-medium text-purple-800">
                              🤖 Generando con Gemini AI...
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sección de opciones */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-semibold text-gray-700">
                          📝 Opciones de Respuesta
                        </label>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {opciones.length}/4
                        </span>
                      </div>

                      {/* Grid de opciones - responsive */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {opciones.map((op, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-200 rounded-lg p-3 bg-gray-50/50"
                          >
                            {/* Header de opción */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="correct_option"
                                  checked={correctOption === idx}
                                  onChange={() => setCorrectOption(idx)}
                                  className="accent-indigo-600 w-4 h-4"
                                  disabled={generatingWithAI}
                                />
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                    correctOption === idx
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-300 text-gray-600"
                                  }`}
                                >
                                  {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="text-xs font-medium text-gray-700">
                                  Opción {String.fromCharCode(65 + idx)}
                                </span>
                                {correctOption === idx && (
                                  <span className="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded-full">
                                    ✓
                                  </span>
                                )}
                              </div>

                              {/* Botón eliminar */}
                              {opciones.length > 2 && (
                                <button
                                  onClick={() => quitarOpcion(idx)}
                                  disabled={generatingWithAI}
                                  className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full p-1 transition-colors"
                                >
                                  <FaTimes className="text-xs" />
                                </button>
                              )}
                            </div>

                            {/* Input de opción */}
                            <textarea
                              className="w-full px-2.5 py-2 border border-gray-200 rounded-lg focus:border-indigo-400 focus:outline-none text-xs resize-none h-12 transition-colors disabled:bg-gray-100"
                              placeholder={`Escribe la opción ${idx + 1}...`}
                              value={op}
                              onChange={(e) => {
                                const newOpciones = [...opciones];
                                newOpciones[idx] = e.target.value;
                                setOpciones(newOpciones);
                              }}
                              disabled={generatingWithAI}
                            />
                          </div>
                        ))}

                        {/* Botón agregar opción */}
                        {opciones.length < 4 && (
                          <div
                            className={
                              opciones.length === 3 ? "lg:col-span-2" : ""
                            }
                          >
                            <button
                              onClick={agregarOpcion}
                              disabled={generatingWithAI}
                              className="w-full h-full min-h-[80px] p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600 text-sm font-medium"
                            >
                              <FaPlus className="text-xs" />
                              Agregar opción{" "}
                              {String.fromCharCode(65 + opciones.length)}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tip */}
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700 leading-relaxed">
                        💡 <strong>Tip:</strong> Escribe solo un tema y presiona
                        ✨ para generar automáticamente una pregunta completa.
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      {/* Indicador de estado */}
                      <div className="text-xs">
                        {!pregunta.trim() ? (
                          <span className="text-red-500">
                            📝 Escribe una pregunta
                          </span>
                        ) : opciones.some((o) => !o.trim()) ? (
                          <span className="text-red-500">
                            📋 Completa todas las opciones
                          </span>
                        ) : correctOption === null ? (
                          <span className="text-red-500">
                            ✅ Selecciona la respuesta correcta
                          </span>
                        ) : (
                          <span className="text-green-600">
                            🎉 Todo listo para crear
                          </span>
                        )}
                      </div>

                      {/* Botones */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowModal(false);
                            setPregunta("");
                            setOpciones(["", ""]);
                            setCorrectOption(null);
                            setGeneratingWithAI(false);
                            setTopicInput("");
                          }}
                          disabled={generatingWithAI}
                          className="px-3 py-1.5 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 rounded-lg transition-colors text-xs font-medium"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={enviarPreguntaQuiz}
                          disabled={
                            generatingWithAI ||
                            !pregunta.trim() ||
                            opciones.length < 2 ||
                            opciones.some((o) => !o.trim()) ||
                            correctOption === null
                          }
                          className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg transition-all duration-200 flex items-center gap-1.5 text-xs font-medium"
                        >
                          {generatingWithAI ? (
                            <>
                              <FaSpinner className="animate-spin text-xs" />
                              Generando...
                            </>
                          ) : (
                            <>
                              <FaCheck className="text-xs" />
                              Crear Pregunta
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Panel principal */}
            <section className="flex flex-col items-center px-4 py-10 bg-transparent">
              {/* EXISTENTE: Pregunta activa con datos del backend */}
              {preguntaActiva && (
                <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border-2 border-blue-400 p-6 mb-8 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                      <FaQuestionCircle className="text-blue-600" />
                      Pregunta Activa{" "}
                      <span className="text-sm text-blue-600">
                        (ID: {preguntaActiva.id})
                      </span>
                    </h3>
                    <button
                      onClick={cerrarPreguntaActiva}
                      className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-bold shadow transition"
                    >
                      <FaTimes className="inline mr-1" />
                      Cerrar Pregunta
                    </button>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-inner border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      {preguntaActiva.pregunta}
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {preguntaActiva.opciones.map(
                        (opcion: string, idx: number) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition ${
                              idx === preguntaActiva.correcta
                                ? "border-green-500 bg-green-50"
                                : "border-gray-300 bg-gray-50"
                            }`}
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="font-medium text-gray-800">
                              {opcion}
                            </span>
                            {idx === preguntaActiva.correcta && (
                              <FaCheck className="text-green-600 ml-auto" />
                            )}
                          </div>
                        )
                      )}
                    </div>

                    <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Respuesta correcta:</strong> Opción{" "}
                        {String.fromCharCode(65 + preguntaActiva.correcta)} -{" "}
                        {preguntaActiva.opciones[preguntaActiva.correcta]}
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Datos extraídos del backend • Pregunta ID:{" "}
                        {preguntaActiva.id}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTUALIZADO: Estudiante seleccionado con skins correctas */}
              {estudianteSeleccionado && (
                <div className="w-full flex flex-col md:flex-row items-center justify-between bg-white rounded-xl shadow-lg border-2 border-green-400 px-8 py-4 mb-8 max-w-3xl mx-auto">
                  <div className="flex items-center gap-6">
                    <Image
                      src={getCharacterImageUrl(
                        estudianteSeleccionado.current_skin
                      )}
                      alt={`Avatar de ${estudianteSeleccionado.name}`}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full border-4 border-green-500 shadow-lg bg-white object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        console.warn(
                          `❌ Error cargando skin para ${estudianteSeleccionado.name}:`,
                          estudianteSeleccionado.current_skin
                        );
                        target.src = "/zhongli_avatar.png";
                      }}
                      onLoad={() => {
                        console.log(
                          `🖼️ Skin cargada exitosamente para ${estudianteSeleccionado.name}:`,
                          estudianteSeleccionado.current_skin
                        );
                      }}
                    />
                    <div>
                      <span className="block text-xl font-bold text-green-800 mb-1">
                        {estudianteSeleccionado.name}
                      </span>
                      <div className="flex gap-3 mt-1 text-base">
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded font-bold">
                          ❤️ {estudianteSeleccionado.hp}/
                          {estudianteSeleccionado.max_hp} HP
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded font-bold">
                          💧 {estudianteSeleccionado.mp}/
                          {estudianteSeleccionado.max_mp} MP
                        </span>
                      </div>
                      <div className="flex gap-3 mt-1 text-sm">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                          ⭐ Lvl {estudianteSeleccionado.level} (
                          {estudianteSeleccionado.experience} XP)
                        </span>
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">
                          🪙 {estudianteSeleccionado.gold} Oro
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 mt-6 md:mt-0">
                    <button
                      className="flex items-center gap-2 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold shadow transition"
                      onClick={() =>
                        manejarRespuestaCorrecta(estudianteSeleccionado.id)
                      }
                      title="Respondió correctamente (+10 oro, +25 XP)"
                    >
                      <FaCheck /> Correcto
                    </button>
                    <button
                      className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold shadow transition"
                      onClick={() =>
                        manejarRespuestaIncorrecta(estudianteSeleccionado.id)
                      }
                      title="Respondió incorrectamente (-10 HP)"
                    >
                      <FaTimes /> Incorrecto
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium shadow transition text-sm"
                      onClick={limpiarSeleccionado}
                      title="Quitar selección"
                    >
                      <FaTimes className="text-xs" />
                      Deseleccionar
                    </button>
                  </div>
                </div>
              )}

              {/* Buscador y título */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 max-w-4xl mx-auto gap-4 w-full">
                <span className="px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm flex flex-row items-center gap-2">
                  <FaUsers className="text-green-500 text-2xl" />
                  <span>Participantes de la clase ({estudiantes.length})</span>
                </span>
                <input
                  type="text"
                  className="px-5 py-2 rounded-full bg-black/70 text-white placeholder:text-white/70 shadow-lg backdrop-blur-sm w-full max-w-xs border-none focus:ring-2 focus:ring-green-400"
                  placeholder="Buscar estudiante..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              {/* ACTUALIZADO: Lista de estudiantes con skins correctas */}
              <div className="overflow-y-auto max-h-[60vh] pr-2 max-w-4xl mx-auto w-full pb-10">
                {cargandoEstudiantes ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-green-800 font-semibold">
                        Cargando estudiantes...
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {estudiantesFiltrados.length === 0 &&
                      !cargandoEstudiantes && (
                        <div className="col-span-full flex justify-center">
                          <span className="px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm flex flex-row items-center gap-2">
                            <span>
                              {busqueda
                                ? "No se encontraron estudiantes con ese nombre."
                                : "No hay estudiantes en esta clase."}
                            </span>
                          </span>
                        </div>
                      )}
                    {estudiantesFiltrados.map((e) => (
                      <div
                        key={e.id}
                        className={`group relative flex flex-col items-center gap-2 p-8 rounded-2xl shadow-xl border-2 transition-all duration-300 bg-white hover:scale-[1.03] w-full ${
                          seleccionado === e.id
                            ? "border-green-500 ring-4 ring-green-300 scale-105"
                            : "border-green-100"
                        }`}
                        style={{
                          minWidth: "220px",
                          maxWidth: "340px",
                          margin: "0 auto",
                        }}
                        onClick={() => setSeleccionado(e.id)}
                      >
                        {/* CORREGIDO: Usar getCharacterImageUrl para cargar skin correctamente */}
                        <Image
                          src={getCharacterImageUrl(e.current_skin)}
                          alt={`Avatar de ${e.name}`}
                          width={70}
                          height={70}
                          className="w-16 h-16 rounded-full border-4 border-green-300 shadow-md bg-white object-cover mb-2"
                          onError={(event) => {
                            const target = event.target as HTMLImageElement;
                            console.warn(
                              `❌ Error cargando skin para ${e.name}:`,
                              e.current_skin
                            );
                            target.src = "/zhongli_avatar.png";
                          }}
                          onLoad={() => {
                            console.log(
                              `🖼️ Skin cargada exitosamente para ${e.name}:`,
                              e.current_skin
                            );
                          }}
                        />

                        {/* ACTUALIZADO: Mostrar nombre real */}
                        <span className="block text-base font-semibold text-green-900 text-center">
                          {e.name}
                        </span>

                        {/* ACTUALIZADO: Mostrar estadísticas reales */}
                        <div className="flex flex-wrap gap-1 mt-1 text-xs justify-center">
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">
                            ❤️ {e.hp}/{e.max_hp} HP
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                            ⭐ Lv.{e.level}
                          </span>
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                            🎯 {e.experience} XP
                          </span>
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">
                            🪙 {e.gold} Oro
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">
                            💙 {e.mp}/{e.max_mp} MP
                          </span>
                        </div>

                        {/* NUEVO: Email y role del participante */}
                        <div className="text-xs text-gray-400 mt-1 truncate max-w-full">
                          {e.email}
                        </div>

                        <div
                          className={`text-xs px-2 py-1 rounded-full font-bold ${
                            e.role === "professor"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {e.role === "professor"
                            ? "👨‍🏫 Profesor"
                            : "👨‍🎓 Estudiante"}
                        </div>

                        <button
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-bold shadow transition"
                          onClick={() => expulsar(e.id)}
                          disabled={girando}
                          tabIndex={-1}
                        >
                          Expulsar
                        </button>
                        {seleccionado === e.id && (
                          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow animate-pulse">
                            Seleccionado
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Animación para el modal */}
          <style jsx>{`
            .animate-fade-in {
              animation: fadeIn 0.3s;
            }
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: scale(0.96);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>
        </main>
      </div>
    </div>
  );
}
