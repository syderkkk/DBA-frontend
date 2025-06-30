"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FaGoogle, FaRegStar, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeInUp } from "@/types/types";
import { register } from "@/services/authService";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
}

interface ValidationErrors {
  name?: string[];
  email?: string[];
  password?: string[];
  role?: string[];
}

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";
  const router = useRouter();

  // Estados para el formulario
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: role,
  });

  // Estados para UI
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validación del formulario en el frontend
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = ["El nombre es obligatorio"];
    }

    if (!formData.email.trim()) {
      newErrors.email = ["El email es obligatorio"];
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = ["El email no tiene un formato válido"];
    }

    if (!formData.password) {
      newErrors.password = ["La contraseña es obligatoria"];
    } else if (formData.password.length < 4) {
      newErrors.password = ["La contraseña debe tener al menos 4 caracteres"];
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password = ["Las contraseñas no coinciden"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("📤 Enviando datos de registro:", {
        ...formData,
        password: "***hidden***",
        password_confirmation: "***hidden***"
      });

      const response = await register(formData);

      console.log("✅ Usuario registrado exitosamente:", response.data);

      // Guardar token
      const token = response.data.access_token;
      localStorage.setItem("token", token);

      // Mostrar mensaje de éxito
      setSuccessMessage("¡Usuario registrado exitosamente! Redirigiendo...");

      // Redirigir según el rol después de un breve delay
      setTimeout(() => {
        if (formData.role === "student") {
          router.push("/dashboard/student");
        } else if (formData.role === "professor") {
          router.push("/dashboard/professor");
        } else {
          router.push("/dashboard");
        }
      }, 2000);

    } catch (error) {
      console.error("❌ Error al registrar usuario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-2 sm:px-4"
      style={{ backgroundImage: "url('/bg-register.webp')" }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {},
        }}
        className="relative bg-black/60 backdrop-blur-md p-3 sm:p-6 rounded-2xl shadow-2xl max-w-md w-full border border-white/10 group transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,255,255,0.25)] hover:border-cyan-400/50 hover:ring-2 hover:ring-cyan-300/40"
      >
        {/* Resplandor de hover */}
        <div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-300/20 to-white/10 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500"
          aria-hidden="true"
        />
        
        <motion.div
          custom={0}
          variants={fadeInUp}
          className="flex justify-center mb-2 z-10 relative"
        >
          <FaRegStar className="text-cyan-300 w-12 h-12" />
        </motion.div>
        
        <motion.h1
          custom={1}
          variants={fadeInUp}
          className="text-xl sm:text-2xl font-extrabold text-white text-center mb-3 z-10 relative"
        >
          Registro de {role === "professor" ? "Profesor" : "Estudiante"}
        </motion.h1>

        {/* Botón de Google deshabilitado */}
        <motion.button
          custom={2}
          variants={fadeInUp}
          type="button"
          disabled={true}
          className="w-full bg-gray-600/30 text-gray-400 py-2 rounded-lg shadow-md flex items-center justify-center mb-2 cursor-not-allowed z-10 relative opacity-50"
        >
          <FaGoogle className="mr-2 w-5 h-5" />
          Registrarse con Google (Próximamente)
        </motion.button>

        <motion.div
          custom={3}
          variants={fadeInUp}
          className="flex items-center justify-center mb-2 z-10 relative"
        >
          <hr className="w-full border-cyan-300/30" />
          <span className="px-2 text-cyan-200/80">o</span>
          <hr className="w-full border-cyan-300/30" />
        </motion.div>

        {/* Mensajes de éxito o error */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 border border-green-400 text-green-200 px-3 py-2 rounded-lg mb-3 text-sm text-center"
          >
            {successMessage}
          </motion.div>
        )}

        {generalError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-400 text-red-200 px-3 py-2 rounded-lg mb-3 text-sm text-center"
          >
            {generalError}
          </motion.div>
        )}

        <motion.form 
          custom={4} 
          variants={fadeInUp} 
          className="z-10 relative"
          onSubmit={handleSubmit}
        >
          {/* Campo nombre completo */}
          <div className="mb-2">
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 bg-black/30 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-cyan-100/60 disabled:opacity-50 ${
                errors.name ? 'border-red-400' : 'border-cyan-300/20'
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name[0]}</p>
            )}
          </div>

          {/* Campo email */}
          <div className="mb-2">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-3 py-2 bg-black/30 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-cyan-100/60 disabled:opacity-50 ${
                errors.email ? 'border-red-400' : 'border-cyan-300/20'
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>
            )}
          </div>

          {/* Campos de contraseña */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <div>
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 bg-black/30 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-cyan-100/60 disabled:opacity-50 ${
                  errors.password ? 'border-red-400' : 'border-cyan-300/20'
                }`}
              />
            </div>
            <div>
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirmar contraseña"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 bg-black/30 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-cyan-100/60 disabled:opacity-50 ${
                  errors.password ? 'border-red-400' : 'border-cyan-300/20'
                }`}
              />
            </div>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mb-2">{errors.password[0]}</p>
          )}

          {/* Campo rol (hidden pero funcional) */}
          <input
            type="hidden"
            name="role"
            value={formData.role}
          />

          {/* Texto de términos - enlaces deshabilitados */}
          <p className="text-xs text-cyan-100/70 mb-3">
            Al presionar el botón, acepta nuestras condiciones{" "}
            <span className="text-gray-500 cursor-not-allowed">
              Acuerdo de Licencia
            </span>{" "}
            y{" "}
            <span className="text-gray-500 cursor-not-allowed">
              Política de Privacidad
            </span>.
          </p>

          {/* Botón de registro */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-2 rounded-lg transition flex items-center justify-center ${
              isLoading
                ? "bg-cyan-400/50 text-black/50 cursor-not-allowed"
                : "bg-cyan-400 text-black hover:bg-cyan-300"
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2 w-4 h-4" />
                Registrando...
              </>
            ) : (
              "¡COMENZAR!"
            )}
          </button>

          {/* Botón cancelar */}
          <motion.button
            custom={4.5}
            variants={fadeInUp}
            type="button"
            disabled={isLoading}
            onClick={() => (window.location.href = "/")}
            className={`w-full mt-2 bg-transparent border border-cyan-300/40 font-bold py-2 rounded-lg transition ${
              isLoading
                ? "text-cyan-200/50 border-cyan-300/20 cursor-not-allowed"
                : "text-cyan-200 hover:bg-cyan-300/10"
            }`}
          >
            Cancelar y volver al inicio
          </motion.button>
        </motion.form>

        <motion.p
          custom={5}
          variants={fadeInUp}
          className="mt-3 text-sm text-cyan-100/80 text-center z-10 relative"
        >
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/auth/login"
            className="text-cyan-300 hover:underline hover:text-cyan-200"
          >
            Conéctese aquí
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}