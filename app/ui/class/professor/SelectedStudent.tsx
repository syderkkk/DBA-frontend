import Image from "next/image";
import { FaCheck, FaTimes, FaHeart, FaTint, FaStar, FaCoins } from "react-icons/fa";
import { EstudianteReal } from "@/types/types";

// Función para obtener la imagen del personaje basada en skin_code
const getCharacterImageUrl = (skinCode?: string | null): string => {
  if (!skinCode) {
    return "/zhongli_avatar.png";
  }

  const skinMap: Record<string, string> = {
    default_mage: "default_mage",
    default_warrior: "default_warrior",
    arcane_mage: "arcane_mage",
    elite_warrior: "elite_warrior",
  };

  const skinFileName = skinMap[skinCode];

  if (skinFileName) {
    return `/skins/${skinFileName}.png`;
  } else {
    return `/skins/${skinCode}.png`;
  }
};

interface SelectedStudentProps {
  estudiante: EstudianteReal;
  onCorrect: (id: number) => void;
  onIncorrect: (id: number) => void;
  onDeselect: () => void;
}

export default function SelectedStudent({
  estudiante,
  onCorrect,
  onIncorrect,
  onDeselect,
}: SelectedStudentProps) {
  return (
    <div className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <Image
            src={getCharacterImageUrl(estudiante.current_skin)}
            alt={`Avatar de ${estudiante.name}`}
            width={64}
            height={64}
            className="w-16 h-16 rounded-xl border-2 border-emerald-300 bg-white object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              console.warn(
                `❌ Error cargando skin para ${estudiante.name}:`,
                estudiante.current_skin
              );
              target.src = "/zhongli_avatar.png";
            }}
          />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            {estudiante.name}
          </h3>
          <p className="text-sm text-gray-600">Estudiante seleccionado</p>
        </div>
        <button
          onClick={onDeselect}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Deseleccionar estudiante"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 border border-red-100">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <FaHeart className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Vida</span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {estudiante.hp}<span className="text-sm text-gray-500">/{estudiante.max_hp}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <FaTint className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Maná</span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {estudiante.mp}<span className="text-sm text-gray-500">/{estudiante.max_mp}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-purple-100">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <FaStar className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Nivel</span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {estudiante.level}<span className="text-sm text-gray-500"> ({estudiante.experience} XP)</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-yellow-100">
          <div className="flex items-center gap-2 text-yellow-600 mb-1">
            <FaCoins className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Oro</span>
          </div>
          <div className="text-lg font-bold text-gray-900">{estudiante.gold}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onCorrect(estudiante.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors shadow-sm"
          title="Respuesta correcta (+10 oro, +25 XP)"
        >
          <FaCheck className="w-4 h-4" />
          <span>Correcto</span>
        </button>
        
        <button
          onClick={() => onIncorrect(estudiante.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors shadow-sm"
          title="Respuesta incorrecta (-10 HP)"
        >
          <FaTimes className="w-4 h-4" />
          <span>Incorrecto</span>
        </button>
      </div>
    </div>
  );
}