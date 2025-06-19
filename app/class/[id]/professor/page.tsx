'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  FaQrcode, FaUserGraduate, FaRandom, FaSignOutAlt, FaCrown,
  FaQuestionCircle, FaCheck, FaTimes, FaPlus, FaMinus
} from 'react-icons/fa';

// Datos de ejemplo
const estudiantesMock = [
  { id: 1, nombre: 'Ana', personaje: '/zhongli_avatar.png', hp: 80, xp: 120, oro: 50 },
  { id: 2, nombre: 'Luis', personaje: '/zhongli_avatar.png', hp: 100, xp: 90, oro: 70 },
  { id: 3, nombre: 'María', personaje: '/zhongli_avatar.png', hp: 60, xp: 150, oro: 30 },
];

const codigoClase = 'ABC123';

export default function Page() {
  const [estudiantes, setEstudiantes] = useState(estudiantesMock);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [preguntasEnviadas, setPreguntasEnviadas] = useState<string[]>([]);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [girando, setGirando] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Modal para pregunta tipo quiz (mínimo 2, máximo 4 opciones)
  const [showModal, setShowModal] = useState(false);
  const [pregunta, setPregunta] = useState('');
  const [opciones, setOpciones] = useState(['', '']);
  const [correctOption, setCorrectOption] = useState<number | null>(null);

  // Filtrado de estudiantes por nombre
  const estudiantesFiltrados = useMemo(
    () =>
      estudiantes.filter(e =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase())
      ),
    [estudiantes, busqueda]
  );

  // Ruleta animada segura
  const girarRuleta = () => {
    if (estudiantesFiltrados.length === 0 || girando) return;
    setGirando(true);
    let current = 0;
    let pasos = 0;
    const totalPasos = estudiantesFiltrados.length * 3 + Math.floor(Math.random() * estudiantesFiltrados.length);
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
    setEstudiantes(estudiantes.filter(e => e.id !== id));
    if (seleccionado === id) setSeleccionado(null);
  };

  // Enviar pregunta tipo quiz (mínimo 2, máximo 4 opciones)
  const enviarPreguntaQuiz = () => {
    if (
      pregunta.trim() &&
      opciones.length >= 2 &&
      opciones.length <= 4 &&
      opciones.every(o => o.trim()) &&
      correctOption !== null
    ) {
      setPreguntasEnviadas([
        `Pregunta: ${pregunta} | Opciones: ${opciones.join(' / ')} | Correcta: ${correctOption + 1}`,
        ...preguntasEnviadas,
      ]);
      setPregunta('');
      setOpciones(['', '']);
      setCorrectOption(null);
      setShowModal(false);
    }
  };

  // Eliminar estudiante seleccionado (por responder bien o mal)
  const limpiarSeleccionado = () => {
    setSeleccionado(null);
  };

  // Funciones para agregar/quitar opciones
  const agregarOpcion = () => {
    if (opciones.length < 4) setOpciones([...opciones, '']);
  };
  const quitarOpcion = (idx: number) => {
    if (opciones.length <= 2) return;
    const nuevasOpciones = opciones.filter((_, i) => i !== idx);
    setOpciones(nuevasOpciones);
    if (correctOption === idx) setCorrectOption(null);
    else if (correctOption !== null && correctOption > idx) setCorrectOption(correctOption - 1);
  };

  // Encuentra el estudiante seleccionado
  const estudianteSeleccionado = estudiantes.find(e => e.id === seleccionado);

  return (
    <main className="min-h-screen flex bg-gradient-to-br from-green-50 to-blue-50">
      {/* Sidebar fijo */}
      <aside className="w-72 min-h-screen bg-white border-r border-green-100 shadow-lg flex flex-col py-8 px-6 gap-8">
        <div className="flex flex-col items-center gap-2 mb-8">
          <FaCrown className="text-green-600 text-3xl" />
          <span className="text-xl font-extrabold text-green-800 tracking-widest">Clase: DBA-1</span>
        </div>
        <button
          className="flex items-center gap-3 w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow transition"
          onClick={girarRuleta}
          disabled={girando || estudiantesFiltrados.length === 0}
        >
          <FaRandom className="text-xl" />
          {girando ? 'Girando...' : 'Ruleta Aleatoria'}
        </button>
        <button
          className="flex items-center gap-2 w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold shadow transition"
          onClick={() => setShowModal(true)}
        >
          <FaQuestionCircle /> Crear pregunta tipo quiz
        </button>
        <button
          className="flex items-center gap-2 w-full px-4 py-3 bg-green-400 hover:bg-green-500 text-white rounded-xl font-bold shadow transition"
          onClick={() => setMostrarQR(true)}
        >
          <FaQrcode /> Código/QR
        </button>
        <button
          className="flex items-center gap-2 w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow transition"
        >
          <FaSignOutAlt /> Salir
        </button>
        <div>
          <h3 className="text-green-700 font-bold mb-2 flex items-center gap-2">
            <FaQuestionCircle /> Preguntas recientes
          </h3>
          <ul className="space-y-1 max-h-32 overflow-y-auto pr-2">
            {preguntasEnviadas.slice(0, 3).map((p, i) => (
              <li key={i} className="bg-green-50 rounded px-2 py-1 text-green-800 text-sm">{p}</li>
            ))}
            {preguntasEnviadas.length === 0 && (
              <li className="text-gray-400 text-sm text-center">Sin preguntas</li>
            )}
          </ul>
        </div>
      </aside>

      {/* Modal QR */}
      {mostrarQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative bg-white rounded-3xl shadow-2xl border-4 border-green-400 flex flex-col items-center py-10 px-8 w-[95vw] max-w-lg animate-fade-in">
            <span className="text-2xl sm:text-3xl font-extrabold text-green-700 mb-2 tracking-widest">Código de la clase</span>
            <span className="text-5xl sm:text-7xl font-mono tracking-widest mb-6 text-green-900">{codigoClase}</span>
            <div className="bg-green-50 rounded-2xl p-4 mb-2 shadow-lg border-2 border-green-100">
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${codigoClase}&size=300x300`}
                alt="Código QR"
                width={256}
                height={256}
                className="w-64 h-64"
              />
            </div>
            <span className="text-lg text-gray-600 font-semibold mt-2">Escanea para unirte</span>
            <button
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg font-bold shadow transition"
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
            <span className="text-2xl font-extrabold text-green-700 mb-4 tracking-widest">Crear pregunta tipo quiz</span>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border-2 border-green-300 focus:outline-none focus:border-green-500 shadow mb-4"
              placeholder="Escribe la pregunta aquí..."
              value={pregunta}
              onChange={e => setPregunta(e.target.value)}
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
                    onChange={e => {
                      const newOpciones = [...opciones];
                      newOpciones[idx] = e.target.value;
                      setOpciones(newOpciones);
                    }}
                  />
                  {opciones.length > 2 && (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition"
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
                className="flex items-center gap-2 mt-2 px-3 py-1 bg-green-200 hover:bg-green-300 text-green-900 rounded-lg font-bold shadow transition w-fit"
                onClick={agregarOpcion}
                type="button"
                disabled={opciones.length >= 4}
              >
                <FaPlus /> Agregar opción
              </button>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow transition"
                onClick={enviarPreguntaQuiz}
                disabled={
                  !pregunta.trim() ||
                  opciones.length < 2 ||
                  opciones.length > 4 ||
                  opciones.some(o => !o.trim()) ||
                  correctOption === null
                }
              >
                Enviar pregunta
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-bold shadow transition"
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
      <section className="flex-1 flex flex-col items-center px-4 py-10 bg-gradient-to-br from-green-50 to-blue-50">
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
                <span className="block text-xl font-bold text-green-800 mb-1">{estudianteSeleccionado.nombre}</span>
                <div className="flex gap-3 mt-1 text-base">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded font-bold">❤️ {estudianteSeleccionado.hp} HP</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded font-bold">⭐ {estudianteSeleccionado.xp} XP</span>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded font-bold">🪙 {estudianteSeleccionado.oro} Oro</span>
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
          <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2">
            <FaUserGraduate /> Participantes de la clase
          </h2>
          <input
            type="text"
            className="px-3 py-2 rounded-lg border border-green-200 shadow-sm w-full max-w-xs"
            placeholder="Buscar estudiante..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        {/* Lista de estudiantes */}
        <div className="overflow-y-auto max-h-[60vh] pr-2 max-w-4xl mx-auto w-full pb-10">
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {estudiantesFiltrados.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-8">
                No se encontraron estudiantes.
              </div>
            )}
            {estudiantesFiltrados.map(e => (
              <div
                key={e.id}
                className={`group relative flex flex-col items-center gap-2 p-8 rounded-2xl shadow-xl border-2 transition-all duration-300 bg-white hover:scale-[1.03] w-full ${
                  seleccionado === e.id
                    ? 'border-green-500 ring-4 ring-green-300 scale-105'
                    : 'border-green-100'
                }`}
                style={{ minWidth: '220px', maxWidth: '340px', margin: '0 auto' }}
              >
                <Image
                  src={e.personaje}
                  alt={e.nombre}
                  width={70}
                  height={70}
                  className="w-16 h-16 rounded-full border-4 border-green-300 shadow-md bg-white object-cover mb-2"
                />
                <span className="block text-base font-semibold text-green-900">{e.nombre}</span>
                <div className="flex gap-2 mt-1 text-xs">
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">❤️ {e.hp} HP</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">⭐ {e.xp} XP</span>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">🪙 {e.oro} Oro</span>
                </div>
                {/* Botón de expulsar solo visible en hover */}
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
      {/* Animación para el modal */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96);}
          to { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </main>
  );
}