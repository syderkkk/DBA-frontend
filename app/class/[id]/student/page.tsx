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
} from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { getClassroomById } from "@/services/classroomService";

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

// Sidebar para estudiante
function Sidebar({
  
  setMostrarQR,
}: {
  setMostrarQR: (b: boolean) => void;
}) {
  const router = useRouter();
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white text-black flex flex-col z-40 shadow-[0_0_32px_0_rgba(0,0,0,0.18)] border-r border-gray-200">
      <div className="flex items-center gap-2 px-6 py-7 border-b border-gray-200">
        <span className="text-2xl font-bold tracking-tight font-sans select-none text-black drop-shadow">
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
              <FaSignOutAlt className="text-green-500 text-xl" /> Regresar al inicio
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default function Page() {
  const [codigoClase, setCodigoClase] = useState<string>("");
  const [estudiantes, setEstudiantes] = useState(estudiantesMock);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [preguntaActiva, setPreguntaActiva] = useState<null | {
    pregunta: string;
    opciones: string[];
  }>(null);
  const [respuesta, setRespuesta] = useState<number | null>(null);

  

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

  useEffect(() => {
    if (!classId) return;
    getClassroomById(classId)
      .then((res) => {
        setCodigoClase(res.data.join_code);
      })
      .catch(() => {
        setCodigoClase("SIN-CODIGO");
      });

    // Simulación de pregunta activa (puedes reemplazar por fetch real)
    setTimeout(() => {
      setPreguntaActiva({
        pregunta: "¿Cuál es la capital de Francia?",
        opciones: ["Madrid", "París", "Roma", "Berlín"],
      });
    }, 1500);
  }, [classId]);

  // Enviar respuesta (simulado)
  const enviarRespuesta = () => {
    if (respuesta === null) return;
    alert("Respuesta enviada: " + preguntaActiva?.opciones[respuesta]);
    setRespuesta(null);
    setPreguntaActiva(null);
  };

  return (
    <div className="relative min-h-screen">
      {/* Fondo con imagen y overlay igual al dashboard */}
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
              {/* Pregunta activa */}
              {preguntaActiva && (
                <div className="w-full flex flex-col items-center justify-center bg-white rounded-xl shadow-lg border-2 border-green-400 px-8 py-6 mb-8 max-w-2xl mx-auto">
                  <span className="block text-lg font-bold text-green-800 mb-4">
                    <FaQuestionCircle className="inline mr-2" />
                    {preguntaActiva.pregunta}
                  </span>
                  <div className="flex flex-col gap-3 w-full">
                    {preguntaActiva.opciones.map((op, idx) => (
                      <label
                        key={idx}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg border-2 cursor-pointer transition ${respuesta === idx
                            ? "border-green-500 bg-green-50"
                            : "border-green-200 bg-white"
                          }`}
                      >
                        <input
                          type="radio"
                          name="respuesta"
                          checked={respuesta === idx}
                          onChange={() => setRespuesta(idx)}
                          className="accent-green-600"
                        />
                        <span className="font-semibold">{op}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    className="mt-5 bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-bold shadow transition"
                    onClick={enviarRespuesta}
                    disabled={respuesta === null}
                  >
                    Enviar respuesta
                  </button>
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