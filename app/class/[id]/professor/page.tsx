"use client";

import { useState, useMemo, useEffect } from "react";
import { FaUsers } from "react-icons/fa";

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
import { useParams } from "next/navigation";

import {
  EstudianteReal,
  PreguntaActiva,
  QuestionFromBackend,
  CreateQuestionPayload,
  GeneratedQuestion,
} from "@/types/types";
import SelectedStudent from "@/app/ui/class/professor/SelectedStudent";
import ActiveQuestion from "@/app/ui/class/professor/ActiveQuestion";
import QRModal from "@/app/ui/class/professor/QRModal";
import Sidebar from "@/app/ui/class/professor/Sidebar";
import QuestionModal from "@/app/ui/class/professor/QuestionModal";
import StudentsGrid from "@/app/ui/class/professor/StudentsGrid";

export default function Page() {
  const [codigoClase, setCodigoClase] = useState<string>("");
  const [estudiantes, setEstudiantes] = useState<EstudianteReal[]>([]);
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(false);

  const [mostrarQR, setMostrarQR] = useState(false);
  const [preguntasEnviadas, setPreguntasEnviadas] = useState<string[]>([]);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [girando, setGirando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [generatingWithAI, setGeneratingWithAI] = useState(false);

  const generarPreguntaConIA = async (
    topic: string
  ): Promise<GeneratedQuestion | null> => {
    setGeneratingWithAI(true);

    try {
      const response = await generateQuestionWithAI(topic);
      console.log("✅ Respuesta de IA (aiService):", response);

      // Mapear la respuesta del aiService a lo que espera nuestra aplicación
      const generatedQuestion: GeneratedQuestion = {
        question: response.question,
        options: response.options,
        correctAnswer: response.correctIndex, // aiService devuelve correctIndex
      };

      console.log("✅ Pregunta mapeada:", generatedQuestion);
      console.log(
        "🎯 Índice de respuesta correcta:",
        generatedQuestion.correctAnswer
      );

      return generatedQuestion;
    } catch (error) {
      console.error("❌ Error al generar pregunta:", error);
      alert("❌ Error al generar la pregunta. Intenta de nuevo.");
      return null;
    } finally {
      setGeneratingWithAI(false);
    }
  };
  const [preguntaActiva, setPreguntaActiva] = useState<PreguntaActiva | null>(
    null
  );

  const params = useParams();
  const classId = params?.id as string;

  const estudiantesFiltrados = useMemo(
    () =>
      estudiantes.filter((e) =>
        e.name.toLowerCase().includes(busqueda.toLowerCase())
      ),
    [estudiantes, busqueda]
  );

  useEffect(() => {
    if (!classId) return;

    getClassroomById(classId)
      .then((res) => {
        setCodigoClase(res.data.join_code);
        console.log("✅ Classroom cargado:", res.data);
      })
      .catch(() => {
        setCodigoClase("SIN-CODIGO");
      });

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

    getQuestionsByClassroom(classId)
      .then((res) => {
        const preguntas = res.data;
        console.log("✅ Preguntas existentes:", preguntas);

        if (preguntas.length > 0) {
          const preguntasHistorial = preguntas.map(
            (p: QuestionFromBackend) =>
              `${p.question.substring(0, 40)}${
                p.question.length > 40 ? "..." : ""
              }`
          );
          setPreguntasEnviadas(preguntasHistorial);

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
        if (err.response?.status === 404) {
          console.log(
            "📭 No se encontraron preguntas activas (404) - esto es normal"
          );
        } else {
          console.error("💥 Error inesperado al cargar preguntas:", err);
        }
      });
  }, [classId]);

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
  const expulsar = async (id: number) => {
    const estudiante = estudiantes.find((e) => e.id === id);
    if (!estudiante) return;

    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas expulsar a ${estudiante.name} de la clase?`
    );

    if (!confirmacion) return;

    try {
      await removeUserFromClassroom(classId, { userId: id.toString() });
      setEstudiantes(estudiantes.filter((e) => e.id !== id));
      if (seleccionado === id) setSeleccionado(null);

      // Mostrar mensaje de éxito
      alert(`${estudiante.name} ha sido expulsado de la clase correctamente.`);
    } catch {
      alert("Error al expulsar al estudiante");
    }
  };
  // Función para cerrar la pregunta activa
  const cerrarPreguntaActiva = async (): Promise<void> => {
    if (!preguntaActiva) return;

    try {
      await closeQuestion(preguntaActiva.id.toString());
      setPreguntaActiva(null);
    } catch {
      alert("Error al cerrar la pregunta");
    }
  };

  const enviarPreguntaQuiz = async (
    pregunta: string,
    opciones: string[],
    correctOption: number
  ): Promise<void> => {
    const payload: CreateQuestionPayload = {
      question: pregunta,
      option_1: opciones[0],
      option_2: opciones[1],
      correct_option: `option_${correctOption + 1}`,
    };

    if (opciones[2]?.trim()) {
      payload.option_3 = opciones[2];
    }
    if (opciones[3]?.trim()) {
      payload.option_4 = opciones[3];
    }

    try {
      console.log("📤 Creando pregunta en backend...");
      const response = await createQuestion(classId, payload);
      console.log("✅ Pregunta creada:", response);

      // 2. Obtener las preguntas actualizadas del backend
      console.log("📤 Obteniendo preguntas del backend...");
      const preguntasResponse = await getQuestionsByClassroom(classId);
      const preguntas = preguntasResponse.data;
      console.log("✅ Preguntas obtenidas:", preguntas);

      const preguntaMasReciente = preguntas[
        preguntas.length - 1
      ] as QuestionFromBackend;
      console.log("🎯 Pregunta más reciente:", preguntaMasReciente);

      setPreguntaActiva({
        id: preguntaMasReciente.id,
        pregunta: preguntaMasReciente.question,
        opciones: [
          preguntaMasReciente.option_1,
          preguntaMasReciente.option_2,
          preguntaMasReciente.option_3,
          preguntaMasReciente.option_4,
        ].filter((op): op is string => op !== null && op !== ""),
        correcta:
          parseInt(preguntaMasReciente.correct_option.split("_")[1]) - 1,
        timestamp: Date.now(),
      });

      // Agregar a preguntas recientes
      setPreguntasEnviadas([
        `${pregunta.substring(0, 40)}${pregunta.length > 40 ? "..." : ""}`,
        ...preguntasEnviadas,
      ]);
      setShowModal(false);
    } catch {
      alert("Error al crear la pregunta");
    }
  };

  const manejarRespuestaCorrecta = async (estudianteId: number) => {
    if (!estudianteId) return;

    try {
      // Recompensar al estudiante (oro y experiencia)
      await rewardStudent(classId, estudianteId.toString(), {
        gold: 10, // +10 oro por respuesta correcta
        experience: 25, // +25 XP por respuesta correcta
      });

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
    } catch {
      alert(`Error al recompensar a ${estudianteId}`);
    }
  };

  // Función para manejar respuesta incorrecta
  const manejarRespuestaIncorrecta = async (estudianteId: number) => {
    if (!estudianteId) return;

    try {
      await penalizeStudent(classId, estudianteId.toString(), {
        hp: 10,
      });

      setEstudiantes((prevEstudiantes) =>
        prevEstudiantes.map((e) =>
          e.id === estudianteId
            ? {
                ...e,
                hp: Math.max(0, e.hp - 10),
              }
            : e
        )
      );

      setSeleccionado(null);

      // Mostrar mensaje
      const estudiante = estudiantes.find((e) => e.id === estudianteId);
      if (estudiante) {
        alert(`💔 ${estudiante.name} respondió incorrectamente.\n-10 HP`);
      }
    } catch {
      alert(`Error al penalizar a ${estudianteId}`);
    }
  };

  // Eliminar estudiante seleccionado
  const limpiarSeleccionado = () => {
    setSeleccionado(null);
  };

  // Funciones para agregar/quitar opciones
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
          classId={classId}
        />

        {/* Contenido principal */}
        <main className="flex-1 lg:ml-64 py-10 px-2 sm:px-6 pt-20 lg:pt-10">
          <div className="max-w-4xl mx-auto">
            <QRModal
              isOpen={mostrarQR}
              onClose={() => setMostrarQR(false)}
              codigoClase={codigoClase}
            />

            {/* Modal para crear pregunta tipo quiz */}
            <QuestionModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onSubmit={enviarPreguntaQuiz}
              onGenerateWithAI={generarPreguntaConIA}
              generatingWithAI={generatingWithAI}
            />

            {/* Panel principal */}
            <section className="flex flex-col items-center px-4 py-10 bg-transparent">
              {/* EXISTENTE: Pregunta activa con datos del backend */}
              {preguntaActiva && (
                <ActiveQuestion
                  preguntaActiva={preguntaActiva}
                  onClose={cerrarPreguntaActiva}
                />
              )}

              {/* ACTUALIZADO: Estudiante seleccionado con skins correctas */}
              {estudianteSeleccionado && (
                <SelectedStudent
                  estudiante={estudianteSeleccionado}
                  onCorrect={manejarRespuestaCorrecta}
                  onIncorrect={manejarRespuestaIncorrecta}
                  onDeselect={limpiarSeleccionado}
                />
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

              {/* Grid de estudiantes componentizado */}
              <div className="overflow-y-auto max-h-[60vh] pr-2 max-w-6xl mx-auto w-full pb-10">
                <StudentsGrid
                  estudiantes={estudiantes}
                  estudiantesFiltrados={estudiantesFiltrados}
                  cargandoEstudiantes={cargandoEstudiantes}
                  busqueda={busqueda}
                  seleccionado={seleccionado}
                  girando={girando}
                  onSelect={setSeleccionado}
                  onExpel={expulsar}
                />
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
