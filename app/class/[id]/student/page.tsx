"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  FaQrcode,
  FaSignOutAlt,
  FaCopy,
  FaCheck,
  FaUsers,
  FaQuestionCircle,
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

// Sidebar para estudiante
function Sidebar({ setMostrarQR }: { setMostrarQR: (b: boolean) => void }) {
  const router = useRouter();
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white text-black flex flex-col z-40 shadow-[0_0_32px_0_rgba(0,0,0,0.18)] border-r border-gray-200">
      <div className="flex items-center gap-2 px-6 py-7 border-b border-gray-200">
        <span
          className="text-2xl font-bold tracking-tight font-sans select-none text-black drop-shadow cursor-pointer hover:text-green-600 transition-colors duration-200"
          onClick={() => router.push("/dashboard/student")}
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
              className="cursor-pointer flex items-center gap-3 px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm font-semibold transition hover:bg-black/90 w-full"
              onClick={() => setMostrarQR(true)}
            >
              <FaQrcode className="text-green-500 text-xl" /> Código/QR
            </button>
          </li>
          <li>
            <button
              className="cursor-pointer flex items-center gap-3 px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm font-semibold transition hover:bg-black/90 w-full"
              onClick={() => router.push("/dashboard/student")}
            >
              <FaSignOutAlt className="text-green-500 text-xl" /> Regresar al
              inicio
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default function Page() {
  const [codigoClase, setCodigoClase] = useState<string>("");
  // ACTUALIZADO: Estado para participantes reales del backend
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [cargandoParticipantes, setCargandoParticipantes] = useState(true);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Estados para la pregunta activa del backend
  const [preguntaActiva, setPreguntaActiva] =
    useState<PreguntaActivaEstudiante | null>(null);
  const [respuesta, setRespuesta] = useState<number | null>(null);
  const [cargandoPregunta, setCargandoPregunta] = useState(false);
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const [mensajeRespuesta, setMensajeRespuesta] = useState<string | null>(null);

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
        <Sidebar setMostrarQR={setMostrarQR} />

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

            {/* Panel principal */}
            <section className="flex flex-col items-center px-4 py-10 bg-transparent">
              {/* Estado de carga de preguntas */}
              {cargandoPregunta && (
                <div className="w-full flex flex-col items-center justify-center bg-blue-50 rounded-xl shadow-lg border-2 border-blue-300 px-8 py-6 mb-8 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-800 font-semibold">
                      Cargando preguntas activas...
                    </span>
                  </div>
                </div>
              )}

              {/* Pregunta activa del backend */}
              {!cargandoPregunta && preguntaActiva && (
                <div className="w-full flex flex-col items-center justify-center bg-white rounded-xl shadow-lg border-2 border-green-400 px-8 py-6 mb-8 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between w-full mb-4">
                    <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
                      <FaQuestionCircle className="text-green-600" />
                      Pregunta Activa
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-semibold">
                        ID: {preguntaActiva.id}
                      </span>
                      {preguntaActiva.yaRespondida && (
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-semibold">
                          ✓ Respondida
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="block text-lg font-bold text-gray-800 mb-4 text-center">
                    {preguntaActiva.pregunta}
                  </span>

                  {/* Opciones de respuesta */}
                  <div className="flex flex-col gap-3 w-full">
                    {preguntaActiva.opciones.map((opcion, idx) => (
                      <label
                        key={idx}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition ${
                          respuesta === idx
                            ? "border-green-500 bg-green-50"
                            : "border-green-200 bg-white"
                        } ${
                          preguntaActiva.yaRespondida
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:border-green-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="respuesta"
                          checked={respuesta === idx}
                          onChange={() =>
                            !preguntaActiva.yaRespondida && setRespuesta(idx)
                          }
                          className="accent-green-600"
                          disabled={preguntaActiva.yaRespondida}
                        />
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {opcion}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Botón enviar respuesta */}
                  {!preguntaActiva.yaRespondida && (
                    <button
                      className="mt-5 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                      onClick={enviarRespuesta}
                      disabled={respuesta === null || enviandoRespuesta}
                    >
                      {enviandoRespuesta && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {enviandoRespuesta ? "Enviando..." : "Enviar respuesta"}
                    </button>
                  )}

                  {/* Mensaje de resultado */}
                  {mensajeRespuesta && (
                    <div
                      className={`mt-4 p-3 rounded-lg border ${
                        mensajeRespuesta.includes("correcta") ||
                        mensajeRespuesta.includes("¡")
                          ? "bg-green-100 border-green-300 text-green-800"
                          : "bg-red-100 border-red-300 text-red-800"
                      }`}
                    >
                      <p className="text-sm font-semibold text-center">
                        {mensajeRespuesta}
                      </p>
                    </div>
                  )}

                  {/* Estado de pregunta respondida */}
                  {preguntaActiva.yaRespondida && (
                    <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
                      <p className="text-sm text-blue-800 font-semibold text-center flex items-center justify-center gap-2">
                        <FaCheck className="text-blue-600" />
                        Ya has respondido esta pregunta
                      </p>
                      <p className="text-xs text-blue-600 text-center mt-1">
                        Refresca la página para ver nuevas preguntas
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Pregunta extraída del backend • Refresca la página para ver
                    actualizaciones
                  </p>
                </div>
              )}

              {/* Mensaje cuando no hay preguntas activas */}
              {!cargandoPregunta && !preguntaActiva && (
                <div className="w-full flex flex-col items-center justify-center bg-gray-50 rounded-xl shadow-lg border-2 border-gray-300 px-8 py-6 mb-8 max-w-2xl mx-auto">
                  <FaQuestionCircle className="text-gray-400 text-4xl mb-3" />
                  <h3 className="text-lg font-bold text-gray-600 mb-2">
                    No hay preguntas activas
                  </h3>
                  <p className="text-sm text-gray-500 text-center mb-2">
                    El profesor no ha publicado ninguna pregunta activa en este
                    momento.
                  </p>
                  <p className="text-xs text-gray-400 text-center">
                    Refresca la página para verificar nuevas preguntas
                  </p>
                </div>
              )}

              {/* ACTUALIZADO: Buscador y título con contador real */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 max-w-4xl mx-auto gap-4 w-full">
                <span className="px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm flex flex-row items-center gap-2">
                  <FaUsers className="text-green-500 text-2xl" />
                  <span>
                    Participantes de la clase ({participantes.length})
                  </span>
                </span>
                <input
                  type="text"
                  className="px-5 py-2 rounded-full bg-black/70 text-white placeholder:text-white/70 shadow-lg backdrop-blur-sm w-full max-w-xs border-none focus:ring-2 focus:ring-green-400"
                  placeholder="Buscar participante..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              {/* ACTUALIZADO: Lista de participantes reales */}
              <div className="overflow-y-auto max-h-[60vh] pr-2 max-w-4xl mx-auto w-full pb-10">
                {/* Loading state */}
                {cargandoParticipantes && (
                  <div className="flex justify-center items-center py-20">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-lg font-semibold text-gray-700">
                        Cargando participantes...
                      </span>
                    </div>
                  </div>
                )}

                {/* Grid de participantes */}
                {!cargandoParticipantes && (
                  <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {participantesFiltrados.length === 0 &&
                      !cargandoParticipantes && (
                        <div className="col-span-full flex justify-center">
                          <span className="px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm flex flex-row items-center gap-2">
                            <span>
                              {busqueda
                                ? "No se encontraron participantes con ese nombre."
                                : "No hay participantes en esta clase."}
                            </span>
                          </span>
                        </div>
                      )}

                    {participantesFiltrados.map((participante) => (
                      <div
                        key={participante.id}
                        className="group relative flex flex-col items-center gap-2 p-8 rounded-2xl shadow-xl border-2 transition-all duration-300 bg-white border-green-100 hover:border-green-300 hover:shadow-2xl"
                        style={{
                          minWidth: "220px",
                          maxWidth: "340px",
                          margin: "0 auto",
                        }}
                      >
                        {/* ACTUALIZADA: Imagen del personaje basada en current_skin */}
                        <Image
                          src={getCharacterImageUrl(participante.current_skin)}
                          alt={`Avatar de ${participante.name}`}
                          width={70}
                          height={70}
                          className="w-16 h-16 rounded-full border-4 border-green-300 shadow-md bg-white object-cover mb-2"
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

                        {/* ACTUALIZADO: Nombre real del participante */}
                        <span className="block text-base font-semibold text-green-900 text-center">
                          {participante.name}
                        </span>

                        {/* ACTUALIZADO: Stats del personaje del backend */}
                        <div className="flex flex-wrap gap-1 mt-1 text-xs justify-center">
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">
                            ❤️ {participante.hp}/{participante.max_hp} HP
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                            ⭐ Lv.{participante.level}
                          </span>
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                            🎯 {participante.experience} XP
                          </span>
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">
                            🪙 {participante.gold} Oro
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">
                            💙 {participante.mp}/{participante.max_mp} MP
                          </span>
                        </div>

                        {/* NUEVO: Email del participante */}
                        <div className="text-xs text-gray-400 mt-1 truncate max-w-full">
                          {participante.email}
                        </div>

                        {/* NUEVO: Role badge */}
                        <div
                          className={`text-xs px-2 py-1 rounded-full font-bold ${
                            participante.role === "professor"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {participante.role === "professor"
                            ? "👨‍🏫 Profesor"
                            : "👨‍🎓 Estudiante"}
                        </div>
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
