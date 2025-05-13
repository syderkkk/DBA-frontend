'use client';
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-6 sm:px-12 lg:px-20"
      style={{ backgroundImage: "url('/background.webp')" }}
    >
      <div className="bg-white bg-opacity-90 p-6 sm:p-8 rounded-lg shadow-lg max-w-sm sm:max-w-md w-full">
        <div className="flex justify-center mb-4">
          <Image src="/feature/feature1.svg" alt="Logo" width={64} height={64} />
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-center mb-6">
          Iniciar Sesión
        </h1>
        <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg shadow-md flex items-center justify-center mb-4 hover:bg-gray-200">
          <Image
            src="/path-to-google-icon.png"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          Iniciar sesión con Google
        </button>
        <div className="flex items-center justify-center mb-4">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-gray-500">o</span>
          <hr className="w-full border-gray-300" />
        </div>
        <form>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-2" />
              Recuérdame
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Iniciar Sesión
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600 text-center">
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/register" className="text-blue-500 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}