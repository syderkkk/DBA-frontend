"use client";
import { use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/auth/login");
      } else if (user.role === "professor") {
        router.replace(`/class/${id}/professor`);
      } else if (user.role === "student") {
        router.replace(`/class/${id}/student`);
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, id, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium text-gray-700">
        Redirigiendo a tu clase...
      </p>
    </div>
  );
}