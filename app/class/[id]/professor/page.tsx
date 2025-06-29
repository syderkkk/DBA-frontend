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
  FaMinus,
  FaUsers,
} from "react-icons/fa";

import {
  createQuestion,
  getQuestionsByClassroom,
  closeQuestion,
} from "@/services/questionService";
import { getClassroomById } from "@/services/classroomService";
import { useRouter, useParams } from "next/navigation";

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

// Interface para la pregunta activa (actualizada con ID)
interface PreguntaActiva {
  id: number;
  pregunta: string;
  opciones: string[];
  correcta: number;
  timestamp: number;
}

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
  estudiantesFiltrados: any[];
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
  const [estudiantes, setEstudiantes] = useState(estudiantesMock);
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

  // ACTUALIZADO: Estado para la pregunta activa con ID
  const [preguntaActiva, setPreguntaActiva] = useState<PreguntaActiva | null>(
    null
  );

  const params = useParams();
  const classId = params?.id as string;

  // Filtrado de estudiantes por nombre
  const estudiantesFiltrados = useMemo(
    () =>
      estudiantes.filter((e) =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase())
      ),
    [estudiantes, busqueda]
  );

  // ACTUALIZADO: useEffect para cargar datos de la clase y preguntas existentes
  useEffect(() => {
    if (!classId) return;

    // Cargar información de la clase
    getClassroomById(classId)
      .then((res) => {
        setCodigoClase(res.data.join_code);
      })
      .catch(() => {
        setCodigoClase("SIN-CODIGO");
      });

    // NUEVO: Cargar preguntas existentes
    getQuestionsByClassroom(classId)
      .then((res) => {
        const preguntas = res.data;
        console.log("Preguntas existentes:", preguntas);

        // Agregar preguntas existentes al historial
        if (preguntas.length > 0) {
          const preguntasHistorial = preguntas.map(
            (p: any) =>
              `${p.question.substring(0, 40)}${
                p.question.length > 40 ? "..." : ""
              }`
          );
          setPreguntasEnviadas(preguntasHistorial);

          // Opcional: Si hay una pregunta muy reciente (menos de 10 minutos), mostrarla como activa
          const ultimaPregunta = preguntas[preguntas.length - 1];
          const tiempoCreacion = new Date(ultimaPregunta.created_at).getTime();
          const tiempoActual = Date.now();
          const diferenciaTiempo = tiempoActual - tiempoCreacion;
          const diezMinutos = 10 * 60 * 1000;

          if (diferenciaTiempo < diezMinutos) {
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
              timestamp: tiempoCreacion,
            });
          }
        }
      })
      .catch((err) => {
        console.log("No hay preguntas o error:", err);
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

  const expulsar = (id: number) => {
    setEstudiantes(estudiantes.filter((e) => e.id !== id));
    if (seleccionado === id) setSeleccionado(null);
  };

  // NUEVO: Función para cerrar la pregunta activa
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

  // ACTUALIZADO: Enviar pregunta tipo quiz que extrae del backend
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

    const payload: any = {
      question: pregunta,
      option_1: opciones[0],
      option_2: opciones[1],
      correct_option: `option_${correctOption + 1}`,
    };
    if (opciones[2]) payload.option_3 = opciones[2];
    if (opciones[3]) payload.option_4 = opciones[3];

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
      const preguntaMasReciente = preguntas[preguntas.length - 1];
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
        ].filter((op) => op !== null && op !== ""), // Filtrar opciones vacías
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

  // Encuentra el estudiante seleccionado
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
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="relative bg-white rounded-3xl shadow-2xl border-4 border-green-400 flex flex-col items-center py-8 px-6 w-[95vw] max-w-lg animate-fade-in">
                  <span className="text-2xl font-extrabold text-green-700 mb-4 tracking-widest">
                    Crear pregunta tipo quiz
                  </span>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border-2 border-green-300 focus:outline-none focus:border-green-500 shadow mb-4"
                    placeholder="Escribe la pregunta aquí..."
                    value={pregunta}
                    onChange={(e) => setPregunta(e.target.value)}
                  />
                  <div className="w-full flex flex-col gap-2 mb-4">
                    {opciones.map((op, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct_option"
                          checked={correctOption === idx}
                          onChange={() => setCorrectOption(idx)}
                          className="accent-green-600"
                        />
                        <input
                          type="text"
                          className="flex-1 px-4 py-2 rounded-lg border border-green-200 shadow"
                          placeholder={`Opción ${idx + 1}`}
                          value={op}
                          onChange={(e) => {
                            const newOpciones = [...opciones];
                            newOpciones[idx] = e.target.value;
                            setOpciones(newOpciones);
                          }}
                        />
                        {opciones.length > 2 && (
                          <button
                            className="cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition"
                            onClick={() => quitarOpcion(idx)}
                            type="button"
                            title="Quitar opción"
                          >
                            <FaMinus />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      className="cursor-pointer flex items-center gap-2 mt-2 px-3 py-1 bg-green-200 hover:bg-green-300 text-green-900 rounded-lg font-bold shadow transition w-fit"
                      onClick={agregarOpcion}
                      type="button"
                      disabled={opciones.length >= 4}
                    >
                      <FaPlus /> Agregar opción
                    </button>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow transition"
                      onClick={enviarPreguntaQuiz}
                      disabled={
                        !pregunta.trim() ||
                        opciones.length < 2 ||
                        opciones.length > 4 ||
                        opciones.some((o) => !o.trim()) ||
                        correctOption === null
                      }
                    >
                      Enviar pregunta
                    </button>
                    <button
                      className="cursor-pointer bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-bold shadow transition"
                      onClick={() => setShowModal(false)}
                      type="button"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Panel principal */}
            <section className="flex flex-col items-center px-4 py-10 bg-transparent">
              {/* ACTUALIZADO: Pregunta activa con datos del backend */}
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

              {/* Estudiante seleccionado */}
              {estudianteSeleccionado && (
                <div className="w-full flex flex-col md:flex-row items-center justify-between bg-white rounded-xl shadow-lg border-2 border-green-400 px-8 py-4 mb-8 max-w-3xl mx-auto">
                  <div className="flex items-center gap-6">
                    <Image
                      src={estudianteSeleccionado.personaje}
                      alt={estudianteSeleccionado.nombre}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full border-4 border-green-500 shadow-lg bg-white"
                    />
                    <div>
                      <span className="block text-xl font-bold text-green-800 mb-1">
                        {estudianteSeleccionado.nombre}
                      </span>
                      <div className="flex gap-3 mt-1 text-base">
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded font-bold">
                          ❤️ {estudianteSeleccionado.hp} HP
                        </span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded font-bold">
                          ⭐ {estudianteSeleccionado.xp} XP
                        </span>
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded font-bold">
                          🪙 {estudianteSeleccionado.oro} Oro
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-3 mt-6 md:mt-0">
                    <button
                      className="flex items-center gap-2 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold shadow transition"
                      onClick={limpiarSeleccionado}
                      title="Respondió correctamente"
                    >
                      <FaCheck /> Correcto
                    </button>
                    <button
                      className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold shadow transition"
                      onClick={limpiarSeleccionado}
                      title="Respondió incorrectamente"
                    >
                      <FaTimes /> Incorrecto
                    </button>
                    <button
                      className="flex items-center gap-2 px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-bold shadow transition"
                      onClick={() => expulsar(estudianteSeleccionado.id)}
                      title="Expulsar estudiante"
                    >
                      <FaSignOutAlt /> Expulsar
                    </button>
                  </div>
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
