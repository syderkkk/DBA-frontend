'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { fetchUserData } from "../services/userService";
import { login as loginService } from "../services/authService";
import { AuthContextProps, User } from "../types/types";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Cargar el token y los datos del usuario al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/auth/login"); // Redirige al login si no hay token
      return;
    }

    fetchUserData(storedToken)
      .then((userData) => {
        setUser(userData);
        setToken(storedToken);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        router.push("/auth/login"); // Redirige al login si el token no es válido
      });
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      const data = await loginService({ email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);

      const userData = await fetchUserData(data.token);
      setUser(userData);

      router.push("/home");
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}