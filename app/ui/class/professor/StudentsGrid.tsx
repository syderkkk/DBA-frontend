import { EstudianteReal } from "@/types/types";
import StudentCard from "./StudentCard";

interface StudentsGridProps {
  estudiantes: EstudianteReal[];
  estudiantesFiltrados: EstudianteReal[];
  cargandoEstudiantes: boolean;
  busqueda: string;
  seleccionado: number | null;
  girando: boolean;
  onSelect: (id: number) => void;
  onExpel: (id: number) => Promise<void>;
}

export default function StudentsGrid({
  estudiantesFiltrados,
  cargandoEstudiantes,
  busqueda,
  seleccionado,
  girando,
  onSelect,
  onExpel,
}: StudentsGridProps) {
  if (cargandoEstudiantes) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-green-800 font-semibold">
            Cargando estudiantes...
          </span>
        </div>
      </div>
    );
  }

  if (estudiantesFiltrados.length === 0) {
    return (
      <div className="flex justify-center">
        <span className="px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm flex flex-row items-center gap-2">
          <span>
            {busqueda
              ? "No se encontraron estudiantes con ese nombre."
              : "No hay estudiantes en esta clase."}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {estudiantesFiltrados.map((estudiante) => (
        <StudentCard
          key={estudiante.id}
          estudiante={estudiante}
          isSelected={seleccionado === estudiante.id}
          isSpinning={girando}
          onSelect={onSelect}
          onExpel={onExpel}
        />
      ))}
    </div>
  );
}