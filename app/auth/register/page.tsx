'use client';
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-8 sm:px-12 lg:px-16"
      style={{ backgroundImage: "url('/background.webp')" }}
    >
      <div className="bg-white bg-opacity-90 p-6 sm:p-8 rounded-lg shadow-lg max-w-md sm:max-w-lg w-full my-0.5">
        <div className="flex justify-center mb-3">
          <Image src="/feature/feature1.svg" alt="Logo" width={64} height={64} />
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-center mb-4">
          Inscripción de {role === "teacher" ? "maestro" : "alumno"}
        </h1>
        <button className="w-full bg-gray-100 text-gray-700 py-0.5 rounded-lg shadow-md flex items-center justify-center mb-3 hover:bg-gray-200">
          <Image src="/path-to-google-icon.png" alt="Google" width={20} height={20} className="mr-2" />
          Inscribirse con Google
        </button>
        <div className="flex items-center justify-center mb-3">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-gray-500">o</span>
          <hr className="w-full border-gray-300" />
        </div>
        <form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Nombre"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Apellido"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirmar su contraseña"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-3">
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Al presionar el botón, acepta nuestras condiciones{" "}
            <a href="/terms" className="text-blue-500 hover:underline">
              Acuerdo de Licencia
            </a>{" "}
            y{" "}
            <a href="/privacy" className="text-blue-500 hover:underline">
              Política de Privacidad
            </a>.
          </p>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            ¡COMENZAR!
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          ¿Ya tienes una cuenta?{" "}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Conéctese aquí
          </a>
        </p>
      </div>
    </div>
  );
}