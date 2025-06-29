"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  FaQrcode,
  FaSignOutAlt,
  FaCopy,
  FaCheck,
  FaUsers,
  FaQuestionCircle,
  FaTimes,
} from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { getClassroomById } from "@/services/classroomService";
import {
  getQuestionsByClassroom,
  answerQuestion,
  checkIfAnswered,
} from "@/services/questionService";

// Datos de ejemplo
const estudiantesMock = [
  {
    id: 1,
    nombre: "Ana",
    personaje: "/zhongli_avatar.png",
    hp: 80,
    xp: 120,
    oro: 50,
  },
  {
    id: 2,
    nombre: "Luis",
    personaje: "/zhongli_avatar.png",
    hp: 100,
    xp: 90,
    oro: 70,
  },
  {
    id: 3,
    nombre: "María",
    personaje: "/zhongli_avatar.png",
    hp: 60,
    xp: 150,
    oro: 30,
  },
];

// Interface para la pregunta activa del estudiante
interface PreguntaActivaEstudiante {
  id: number;
  pregunta: string;
  opciones: string[];
  yaRespondida: boolean;
}

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
  const [estudiantes] = useState(estudiantesMock);
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

  // Filtrado de estudiantes por nombre
  const estudiantesFiltrados = useMemo(
    () =>
      estudiantes.filter((e) =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase())
      ),
    [estudiantes, busqueda]
  );

  const params = useParams();
  const classId = params?.id as string;

  // ACTUALIZADO: Función para cargar preguntas del backend (solo al cargar la página)
  const cargarPreguntaActiva = async () => {
    if (!classId) return;

    setCargandoPregunta(true);
    try {
      console.log("📤 Cargando preguntas del classroom:", classId);
      const response = await getQuestionsByClassroom(classId);
      const preguntas = response.data;

      console.log("✅ Preguntas obtenidas:", preguntas);

      if (preguntas.length > 0) {
        // Obtener la pregunta más reciente (activa)
        const ultimaPregunta = preguntas[preguntas.length - 1];

        console.log("🎯 Pregunta activa encontrada:", ultimaPregunta);

        // NUEVO: Verificar si el usuario ya respondió esta pregunta
        try {
          console.log(
            "🔍 Verificando si ya respondió la pregunta:",
            ultimaPregunta.id
          );
          const responseCheck = await checkIfAnswered(
            ultimaPregunta.id.toString()
          );
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
            ].filter((op) => op !== null && op !== ""),
            yaRespondida: yaRespondio, // USAR EL ESTADO DEL BACKEND
          });

          // Si ya respondió, limpiar la respuesta seleccionada
          if (yaRespondio) {
            setRespuesta(null);
            console.log("🔒 Pregunta ya respondida - bloqueando interfaz");
          }
        } catch (checkError) {
          console.warn(
            "⚠️ Error al verificar estado de respuesta:",
            checkError
          );
          // Si hay error verificando, asumir que no ha respondido
          setPreguntaActiva({
            id: ultimaPregunta.id,
            pregunta: ultimaPregunta.question,
            opciones: [
              ultimaPregunta.option_1,
              ultimaPregunta.option_2,
              ultimaPregunta.option_3,
              ultimaPregunta.option_4,
            ].filter((op) => op !== null && op !== ""),
            yaRespondida: false,
          });
        }

        console.log("✅ Pregunta establecida como activa");
      } else {
        console.log("📭 No hay preguntas activas en este classroom");
        setPreguntaActiva(null);
      }
    } catch (error) {
      console.error("💥 Error al cargar preguntas:", error);
      setPreguntaActiva(null);
    } finally {
      setCargandoPregunta(false);
    }
  };

  // ACTUALIZADO: useEffect solo para cargar datos iniciales (sin polling)
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

    // Cargar pregunta activa solo una vez al cargar la página
    cargarPreguntaActiva();

    // ELIMINADO: Ya no hay polling automático
    // La página solo se actualiza al refrescar manualmente
  }, [classId]);

  // ACTUALIZADO: Enviar respuesta al backend
  const enviarRespuesta = async () => {
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

      // Mostrar mensaje de resultado
      setMensajeRespuesta(response.data.message);

      // ACTUALIZADO: Marcar pregunta como respondida permanentemente
      setPreguntaActiva((prev) =>
        prev ? { ...prev, yaRespondida: true } : null
      );

      console.log("🔒 Pregunta marcada como respondida");
    } catch (error: any) {
      console.error("💥 Error al enviar respuesta:", error);
      const errorMessage =
        error.response?.data?.message || "Error al enviar la respuesta";
      setMensajeRespuesta(errorMessage);

      // ACTUALIZADO: Si ya respondió anteriormente, marcar como respondida
      if (
        errorMessage.includes("Ya respondiste") ||
        errorMessage.includes("ya respondiste") ||
        error.response?.status === 409
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

              {/* ACTUALIZADO: Pregunta activa del backend */}
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

                  {/* ACTUALIZADO: Botón enviar respuesta */}
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

                  {/* ACTUALIZADO: Estado de pregunta respondida */}
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

              {/* ACTUALIZADO: Mensaje cuando no hay preguntas activas */}
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

              {/* Buscador y título */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 max-w-4xl mx-auto gap-4 w-full">
                <span className="px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm flex flex-row items-center gap-2">
                  <FaUsers className="text-green-500 text-2xl" />
                  <span>Participantes de la clase</span>
                </span>
                <input
                  type="text"
                  className="px-5 py-2 rounded-full bg-black/70 text-white placeholder:text-white/70 shadow-lg backdrop-blur-sm w-full max-w-xs border-none focus:ring-2 focus:ring-green-400"
                  placeholder="Buscar estudiante..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              {/* Lista de estudiantes */}
              <div className="overflow-y-auto max-h-[60vh] pr-2 max-w-4xl mx-auto w-full pb-10">
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {estudiantesFiltrados.length === 0 && (
                    <div className="col-span-full flex justify-center">
                      <span className="px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm flex flex-row items-center gap-2">
                        <span>No se encontraron estudiantes.</span>
                      </span>
                    </div>
                  )}
                  {estudiantesFiltrados.map((e) => (
                    <div
                      key={e.id}
                      className="group relative flex flex-col items-center gap-2 p-8 rounded-2xl shadow-xl border-2 transition-all duration-300 bg-white border-green-100"
                      style={{
                        minWidth: "220px",
                        maxWidth: "340px",
                        margin: "0 auto",
                      }}
                    >
                      <Image
                        src={e.personaje}
                        alt={e.nombre}
                        width={70}
                        height={70}
                        className="w-16 h-16 rounded-full border-4 border-green-300 shadow-md bg-white object-cover mb-2"
                      />
                      <span className="block text-base font-semibold text-green-900">
                        {e.nombre}
                      </span>
                      <div className="flex gap-2 mt-1 text-xs">
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">
                          ❤️ {e.hp} HP
                        </span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                          ⭐ {e.xp} XP
                        </span>
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">
                          🪙 {e.oro} Oro
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
