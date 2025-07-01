import { FaQuestionCircle, FaTimes, FaCheck, FaClock } from "react-icons/fa";
import { PreguntaActiva } from "@/types/types";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ActiveQuestionProps {
  preguntaActiva: PreguntaActiva;
  onClose: () => void;
}

export default function ActiveQuestion({
  preguntaActiva,
  onClose,
}: ActiveQuestionProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - preguntaActiva.timestamp) / 1000);
      setTimeElapsed(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [preguntaActiva.timestamp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="w-full bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-blue-200/50 p-3 sm:p-4 mb-3 sm:mb-4 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <FaQuestionCircle className="text-white text-sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-blue-800">
                Pregunta Activa
              </h3>
              <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                ID: {preguntaActiva.id}
              </span>
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <FaClock className="text-blue-500" />
                <span>{formatTime(timeElapsed)}</span>
                <span className="hidden sm:inline">• En vivo</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
        >
          <FaTimes className="text-xs" />
          <span className="hidden sm:inline">Cerrar</span>
        </button>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-2 sm:p-3 shadow-inner border border-blue-100">
        <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 sm:mb-3 leading-tight">
          {preguntaActiva.pregunta}
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {preguntaActiva.opciones.map((opcion: string, idx: number) => {
            const isCorrect = idx === preguntaActiva.correcta;
            
            return (
              <div
                key={idx}
                className={`flex items-start gap-2 p-2 rounded-lg border-2 transition-all duration-300 ${
                  isCorrect
                    ? "border-green-400 bg-gradient-to-r from-green-50 to-emerald-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                    isCorrect
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>

                <span className="text-xs sm:text-sm text-gray-800 leading-tight flex-1 min-w-0">
                  {opcion}
                </span>


                {isCorrect && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <div className="bg-green-500 text-white px-1 py-0.5 rounded text-xs font-bold">
                      ✓
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <FaCheck className="text-green-600" />
              <span className="font-bold text-green-800">
                Correcta: {String.fromCharCode(65 + preguntaActiva.correcta)} - {preguntaActiva.opciones[preguntaActiva.correcta]}
              </span>
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <span>📊 ID: {preguntaActiva.id}</span>
              <span>⏱️ {formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}