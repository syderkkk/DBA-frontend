import { useState } from "react";
import { FaCopy, FaCheck, FaTimes, FaQrcode } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  codigoClase: string;
}

export default function QRModal({ isOpen, onClose, codigoClase }: QRModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codigoClase);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm border border-white/20 relative flex flex-col items-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header compacto */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <FaQrcode className="text-white text-sm" />
            </div>
            <h2 className="text-lg font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
              Código QR
            </h2>
          </div>

          {/* Código compacto */}
          <div className="text-xl font-mono text-gray-800 mb-4 flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl">
            <span>{codigoClase}</span>
            <button
              className="text-green-600 hover:text-green-800 transition-colors p-1 rounded focus:outline-none focus:ring-1 focus:ring-green-400"
              onClick={handleCopy}
            >
              {copied ? <FaCheck className="text-sm" /> : <FaCopy className="text-sm" />}
            </button>
          </div>

          {/* QR Code más pequeño */}
          <div className="mb-4 p-2 bg-white rounded-xl shadow-md">
            <Image
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                `http://localhost:3000/join?code=${codigoClase}`
              )}&size=150x150`}
              alt="Código QR"
              width={150}
              height={150}
              className="w-32 h-32 rounded-lg"
            />
          </div>

          {/* Descripción compacta */}
          <p className="text-gray-600 text-xs text-center mb-4">
            Escanea para unirte
          </p>

          {/* Botón cerrar */}
          <button
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-red-400"
            onClick={onClose}
          >
            <FaTimes className="text-xs" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}