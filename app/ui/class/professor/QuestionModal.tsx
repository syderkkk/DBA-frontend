import { useState } from "react";
import {
  FaTimes,
  FaPlus,
  FaMinus,
  FaRobot,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { GeneratedQuestion } from "@/types/types";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    pregunta: string,
    opciones: string[],
    correctOption: number
  ) => void;
  onGenerateWithAI: (topic: string) => Promise<GeneratedQuestion | null>;
  generatingWithAI: boolean;
}

export default function QuestionModal({
  isOpen,
  onClose,
  onSubmit,
  onGenerateWithAI,
  generatingWithAI,
}: QuestionModalProps) {
  const [pregunta, setPregunta] = useState("");
  const [opciones, setOpciones] = useState(["", ""]);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [aiTopic, setAiTopic] = useState("");

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

  const handleClose = () => {
    setPregunta("");
    setOpciones(["", ""]);
    setCorrectOption(null);
    setAiTopic("");
    onClose();
  };

  const handleSubmit = () => {
    if (
      !pregunta.trim() ||
      opciones.some((op) => !op.trim()) ||
      correctOption === null
    ) {
      alert("Completa todos los campos y selecciona la respuesta correcta");
      return;
    }
    onSubmit(pregunta, opciones, correctOption);
    handleClose();
  };

  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim()) {
      alert("Ingresa un tema para generar la pregunta");
      return;
    }

    console.log("🚀 Iniciando generación con IA...");
    const result = await onGenerateWithAI(aiTopic);

    console.log("📥 Resultado de IA:", result);

    if (result) {
      console.log("✅ Aplicando datos de IA:");
      console.log("   - question:", result.question);
      console.log("   - options originales:", result.options);
      console.log("   - correctAnswer original:", result.correctAnswer);

      const opcionesOriginales = [...result.options];

      const opcionesConIndices = opcionesOriginales.map((opcion, index) => ({
        texto: opcion,
        esCorrecta: index === result.correctAnswer,
      }));

      const opcionesMezcladas = [...opcionesConIndices].sort(
        () => Math.random() - 0.5
      );

      const nuevasOpciones = opcionesMezcladas.map((item) => item.texto);

      const nuevoIndiceCorrecta = opcionesMezcladas.findIndex(
        (item) => item.esCorrecta
      );

      console.log("🎲 Opciones mezcladas:", nuevasOpciones);
      console.log("🎯 Nuevo índice correcto:", nuevoIndiceCorrecta);
      console.log(
        "✅ Respuesta correcta:",
        nuevasOpciones[nuevoIndiceCorrecta]
      );

      setPregunta(result.question);
      setOpciones(nuevasOpciones);
      setCorrectOption(nuevoIndiceCorrecta);
      setAiTopic("");

      console.log(
        "🎯 Respuesta correcta establecida en índice:",
        nuevoIndiceCorrecta
      );
    } else {
      console.log("❌ No se recibió resultado de IA");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-5 w-full max-w-sm sm:max-w-md lg:max-w-lg border border-white/20 relative max-h-[95vh] overflow-y-auto"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
              Crear Pregunta Quiz
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>

          <motion.div
            className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FaRobot className="text-blue-600 text-sm" />
              <label className="text-xs sm:text-sm font-semibold text-blue-800">
                Generador IA (Opcional)
              </label>
            </div>

            <motion.div
              className="mb-2 p-2 bg-blue-100/50 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-start gap-1.5">
                <FaInfoCircle className="text-blue-600 text-xs mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-700">
                    <strong>Escribe un tema</strong> y la IA generará una
                    pregunta automáticamente.
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Ej: &quot;matemáticas&quot;, &quot;historia&quot;,
                    &quot;ciencias&quot;
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="flex gap-2">
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Tema para generar..."
                className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent"
                disabled={generatingWithAI}
              />
              <motion.button
                onClick={handleGenerateWithAI}
                disabled={generatingWithAI}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-xs sm:text-sm font-medium transition-all duration-200"
                whileHover={!generatingWithAI ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
              >
                {generatingWithAI ? (
                  <>
                    <FaSpinner className="animate-spin text-xs" />
                    <span className="hidden sm:inline">Generando...</span>
                  </>
                ) : (
                  <>
                    <FaRobot className="text-xs" />
                    <span className="hidden sm:inline">Generar</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          <div className="space-y-3 sm:space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Pregunta *
              </label>
              <textarea
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-transparent resize-none transition-all duration-200"
                rows={2}
                placeholder="Escribe tu pregunta aquí..."
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-700">
                  Opciones *
                </label>
                <div className="flex items-center gap-1.5">
                  {opciones.length < 4 && (
                    <motion.button
                      onClick={agregarOpcion}
                      className="flex items-center gap-1 px-1.5 py-0.5 text-green-600 hover:bg-green-100 rounded text-xs font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaPlus className="text-xs" />
                      <span className="hidden sm:inline">Agregar</span>
                    </motion.button>
                  )}
                  <span className="text-xs text-gray-500">
                    {opciones.length}/4
                  </span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {opciones.map((opcion, idx) => (
                  <motion.div
                    key={idx}
                    className="flex gap-2 items-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >

                    <motion.button
                      type="button"
                      onClick={() => setCorrectOption(idx)}
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-200 flex-shrink-0 mt-0.5 ${
                        correctOption === idx
                          ? "bg-green-500 border-green-500 text-white shadow-lg"
                          : "border-gray-300 text-gray-500 hover:border-green-400 hover:text-green-600"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={`Marcar opción ${String.fromCharCode(
                        65 + idx
                      )} como correcta`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </motion.button>

                    <div className="flex-1 min-w-0">
                      <textarea
                        value={opcion}
                        onChange={(e) => {
                          const nuevasOpciones = [...opciones];
                          nuevasOpciones[idx] = e.target.value;
                          setOpciones(nuevasOpciones);
                        }}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-transparent resize-none transition-all duration-200"
                        rows={2}
                        placeholder={`Opción ${String.fromCharCode(65 + idx)}`}
                        required
                      />
                    </div>

                    {opciones.length > 2 && (
                      <motion.button
                        onClick={() => quitarOpcion(idx)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors flex-shrink-0 mt-0.5"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Eliminar opción"
                      >
                        <FaMinus className="text-xs" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>

              {correctOption !== null && (
                <motion.div
                  className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {String.fromCharCode(65 + correctOption)}
                      </span>
                    </div>
                    <span className="text-green-700 font-medium">
                      Respuesta correcta: Opción{" "}
                      {String.fromCharCode(65 + correctOption)}
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5 pt-3 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={handleClose}
              className="w-full sm:flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-xs sm:text-sm font-medium transition-all duration-200"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Cancelar
            </motion.button>
            <motion.button
              onClick={handleSubmit}
              className="w-full sm:flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 text-xs sm:text-sm font-medium transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Crear Pregunta
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
