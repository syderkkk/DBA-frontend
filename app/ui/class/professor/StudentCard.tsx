import Image from "next/image";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { EstudianteReal } from "@/types/types";

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

interface StudentCardProps {
  estudiante: EstudianteReal;
  isSelected: boolean;
  isSpinning: boolean;
  onSelect: (id: number) => void;
  onExpel: (id: number) => void;
}

export default function StudentCard({
  estudiante,
  isSelected,
  isSpinning,
  onSelect,
  onExpel,
}: StudentCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.warn(
      `❌ Error cargando skin para ${estudiante.name}:`,
      estudiante.current_skin
    );
    setImageError(true);
  };

  const handleExpel = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpel(estudiante.id);
  };

  return (
    <div
      className={`group relative flex flex-col items-center gap-2 p-3 rounded-lg shadow-md border-2 transition-all duration-300 bg-white cursor-pointer select-none w-full ${
        isSelected
          ? "border-green-400 ring-2 ring-green-300 scale-105 shadow-lg"
          : "border-gray-200 hover:border-green-300 hover:shadow-lg hover:scale-[1.02]"
      }`}
      onClick={() => onSelect(estudiante.id)}
      role="button"
      tabIndex={0}
      aria-label={`Seleccionar estudiante ${estudiante.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(estudiante.id);
        }
      }}
    >
      {!isSpinning && (
        <button
          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 z-10 focus:outline-none focus:ring-2 focus:ring-red-400"
          onClick={handleExpel}
          aria-label={`Expulsar a ${estudiante.name}`}
        >
          <FaTimes size={10} />
        </button>
      )}

      <div className="relative">
        <div className="relative w-16 h-16">
          <Image
            src={imageError ? "/zhongli_avatar.png" : getCharacterImageUrl(estudiante.current_skin)}
            alt={`Avatar de ${estudiante.name}`}
            fill
            className={`rounded-full border-3 shadow-md bg-white object-cover transition-all duration-300 ${
              isSelected 
                ? "border-green-400 shadow-green-200" 
                : "border-gray-300 group-hover:border-green-300"
            }`}
            onError={handleImageError}
            sizes="64px"
          />
        
          <div className="absolute -bottom-0.5 -right-0.5 bg-purple-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md flex items-center">
            <span>{estudiante.level}</span>
          </div>
        </div>
      </div>

      <div className="text-center w-full px-1">
        <h3 className="text-sm font-bold text-gray-800 truncate">
          {estudiante.name}
        </h3>
        <p className="text-xs text-gray-500 truncate">
          {estudiante.email}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-1.5 w-full text-xs">
        <div className="bg-red-50 border border-red-200 rounded p-1.5 text-center">
          <div className="text-red-600 font-bold text-xs">❤️</div>
          <div className="text-red-700 font-semibold text-xs">
            {estudiante.hp}/{estudiante.max_hp}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-1.5 text-center">
          <div className="text-blue-600 font-bold text-xs">💙</div>
          <div className="text-blue-700 font-semibold text-xs">
            {estudiante.mp}/{estudiante.max_mp}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded p-1.5 text-center">
          <div className="text-green-600 font-bold text-xs">🎯</div>
          <div className="text-green-700 font-semibold text-xs">
            {estudiante.experience}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-1.5 text-center">
          <div className="text-yellow-600 font-bold text-xs">🪙</div>
          <div className="text-yellow-700 font-semibold text-xs">
            {estudiante.gold}
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md font-bold">
          ✓
        </div>
      )}

      {isSpinning && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-medium text-gray-600">...</span>
          </div>
        </div>
      )}
    </div>
  );
}