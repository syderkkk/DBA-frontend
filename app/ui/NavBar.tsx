import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-white shadow-md py-1.5">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-gray-800">CLASSCRAFT</h1>

        {/* Links */}
        <div className="flex space-x-6">
          <Link
            href="/testimonios"
            className="text-gray-600 hover:text-gray-900 transition duration-300"
          >
            Testimonios
          </Link>
          <Link
            href="/tarifa"
            className="text-gray-600 hover:text-gray-900 transition duration-300"
          >
            Tarifa
          </Link>
          <Link
            href="/vision-general"
            className="text-gray-600 hover:text-gray-900 transition duration-300"
          >
            Visión general
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <Link
            href="/auth/select-role"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          >
            Inscríbete
          </Link>
          <Link
            href="/auth/login"
            className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-100 transition duration-300"
          >
            Regístrate
          </Link>
        </div>
      </div>
    </nav>
  );
}
