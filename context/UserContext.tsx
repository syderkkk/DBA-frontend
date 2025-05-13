'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { fetchUserData } from "../services/userService";
import { User, UserContextProps } from "../types/types";

const UserContext = createContext<UserContextProps | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    const getUserData = async () => {
      try {
        const userData = await fetchUserData(token);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}