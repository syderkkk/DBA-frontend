"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { joinClassroomByCode } from "@/services/classroomService";
import { getUser } from "@/services/authService";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function JoinPage() {
  const params = useSearchParams();
  const code = params.get("code");
  const router = useRouter();
  const [status, setStatus] = useState<
    "pending" | "joining" | "success" | "error" | "no-code" | "unauthorized"
  >(code ? "pending" : "no-code");
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const tryJoin = async () => {
      if (!code) return;
      setStatus("joining");
      try {
        const user = await getUser();
        if (user?.data?.role !== "student") {
          setStatus("unauthorized");
          timeout = setTimeout(() => {
            if (user?.data?.role === "professor") {
              router.push("/dashboard/professor");
            } else {
              router.push("/");
            }
          }, 2500);
          return;
        }
        const res = await joinClassroomByCode(code);
        setStatus("success");
        timeout = setTimeout(() => {
          const classroomId = res.data?.classroom?.id || res.data?.id;
          if (classroomId) {
            router.push(`/class/${classroomId}`);
          } else {
            router.push("/dashboard/student");
          }
        }, 3000);
      } catch (err) {
        setStatus("error");
        const errorObj = err as ApiError;
        setError(
          errorObj?.response?.data?.message ||
            "No se pudo unir a la clase. Verifica el código o inicia sesión."
        );
      }
    };
    if (code) tryJoin();
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [code, router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Unirse a una clase</h1>
      {status === "no-code" && <p>No se detectó ningún código.</p>}
      {status === "pending" && code && (
        <div>
          <p className="mb-2">
            Código detectado: <span className="font-mono">{code}</span>
          </p>
          <p>Verificando sesión...</p>
        </div>
      )}
      {status === "joining" && (
        <div>
          <p className="mb-2">
            Código detectado: <span className="font-mono">{code}</span>
          </p>
          <p>Uniéndote a la clase...</p>
        </div>
      )}
      {status === "success" && (
        <div>
          <p className="mb-2">¡Te has unido a la clase! Redirigiendo...</p>
        </div>
      )}
      {status === "error" && (
        <div>
          <p className="mb-2 text-red-600">{error}</p>
          <button
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => router.push("/auth/login")}
          >
            Iniciar sesión
          </button>
        </div>
      )}
      {status === "unauthorized" && (
        <div>
          <p className="mb-2 text-red-600">
            Solo los estudiantes pueden unirse a una clase.<br />
            Redirigiendo...
          </p>
        </div>
      )}
    </main>
  );
}