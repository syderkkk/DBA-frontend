"use client";

import { useAuth } from "@/context/AuthContext";

export default function AuthContent() {
  const { user, logout } = useAuth();

  return (
    <section>
      <div>
        <p>Nombre: {user?.name}</p>
        <p>Correo: {user?.email}</p>
      </div>
      <button
        onClick={logout}
        className="rounded-full bg-red-500 text-white px-4 py-2 hover:bg-red-600 transition-all"
      >
        Cerrar sesión
      </button>
    </section>
  );
}
