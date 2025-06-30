"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCoins,
  FaShoppingCart,
  FaCheck,
  FaTimes,
  FaUser,
  FaStore,
  FaPalette,
  FaArrowLeft,
  FaBars,
  FaStar,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  getShopSkins,
  getUserSkins,
  purchaseSkin,
  changeSkin,
  getUserGold,
  CharacterSkin,
  UserSkin,
} from "@/services/shopService";

// Función para obtener la URL de la imagen basada en el skin_code
const getSkinImageUrl = (skinCode: string): string => {
  return `/skins/${skinCode}.png`;
};

// Función para manejar errores de imagen
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.src = "/skins/default_warrior.png";
};

// Sidebar responsive para la tienda
function Sidebar({
  sidebarOpen,
  closeSidebar,
}: {
  sidebarOpen: boolean;
  closeSidebar: () => void;
}) {
  const router = useRouter();

  return (
    <motion.aside
      className={`
        fixed top-0 left-0 h-screen w-64 bg-white/95 backdrop-blur-md text-black flex flex-col z-40 
        shadow-2xl border-r border-gray-200/50 pointer-events-auto transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      role="navigation"
      aria-label="Menú de la tienda"
    >
      {/* Header del sidebar */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200/50">
        <motion.span
          className="text-xl font-bold tracking-tight font-sans select-none text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text drop-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg"
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            router.push("/dashboard/student");
            closeSidebar();
          }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push("/dashboard/student");
              closeSidebar();
            }
          }}
          role="button"
          aria-label="Ir al dashboard"
        >
          CLASSCRAFT
        </motion.span>

        {/* Botón cerrar en móvil */}
        <motion.button
          className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          onClick={closeSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Cerrar menú"
          tabIndex={0}
        >
          <FaTimes size={18} />
        </motion.button>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto" role="navigation">
        {/* Navegación principal */}
        <div className="mb-4">
          <div className="mb-2 px-3 text-xs text-gray-600 uppercase tracking-wider font-bold">
            Navegación
          </div>
          <ul className="space-y-2" role="list">
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              role="listitem"
            >
              <motion.button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-green-50 hover:to-blue-50 hover:text-green-700 transition-all duration-300 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-green-400"
                onClick={() => {
                  router.push("/dashboard/student");
                  closeSidebar();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                tabIndex={0}
              >
                <FaArrowLeft className="text-green-500 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm">Volver al Dashboard</span>
              </motion.button>
            </motion.li>
          </ul>
        </div>

        {/* Categorías */}
        <div>
          <div className="mb-2 px-3 text-xs text-gray-600 uppercase tracking-wider font-bold">
            Categorías
          </div>
          <ul className="space-y-1" role="list">
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              role="listitem"
            >
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-green-700 bg-green-50">
                <FaPalette className="text-green-600" />
                <span className="text-sm">Skins de Personaje</span>
              </div>
            </motion.li>
          </ul>
        </div>
      </nav>
    </motion.aside>
  );
}

export default function Page() {
  // Estados principales
  const [shopSkins, setShopSkins] = useState<CharacterSkin[]>([]);
  const [userSkins, setUserSkins] = useState<UserSkin[]>([]);
  const [userGold, setUserGold] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [changing, setChanging] = useState<string | null>(null);
  const [currentSkin, setCurrentSkin] = useState<string | null>(null);

  // Estados para UI responsive
  const [activeTab, setActiveTab] = useState<"shop" | "inventory">("shop");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Referencias para gestión de foco
  const sidebarRef = useRef<HTMLElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  // Función para cerrar sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
    setTimeout(() => {
      hamburgerButtonRef.current?.focus();
    }, 100);
  };

  // Gestión de responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      setTimeout(() => {
        const firstFocusable = sidebarRef.current?.querySelector(
          'button:not([disabled]), a, input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          (firstFocusable as HTMLElement).focus();
        }
      }, 150);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Gestión de teclas escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen) {
        closeSidebar();
      }
    };

    if (sidebarOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  // Cargar datos iniciales
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [skinsResponse, userSkinsResponse, goldResponse] =
        await Promise.all([getShopSkins(), getUserSkins(), getUserGold()]);

      setShopSkins(skinsResponse.data);
      setUserSkins(userSkinsResponse.data);
      setUserGold(goldResponse.data.gold);

      // Encontrar la skin actualmente equipada
      const equippedSkin = userSkinsResponse.data.find((skin: UserSkin) => skin.is_equipped);
      setCurrentSkin(equippedSkin?.skin_code || null);

      console.log("✅ Datos de tienda cargados:", {
        skins: skinsResponse.data.length,
        userSkins: userSkinsResponse.data.length,
        gold: goldResponse.data.gold,
        currentSkin: equippedSkin?.skin_code || "ninguna",
      });
    } catch (error) {
      console.error("💥 Error al cargar datos de la tienda:", error);
      showMessage("Error al cargar la tienda", "error");
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar mensajes
  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 5000);
  };

  // Verificar si el usuario ya posee una skin
  const ownsSkin = (skinCode: string): boolean => {
    return userSkins.some((skin) => skin.skin_code === skinCode);
  };

  // Verificar si una skin está equipada actualmente
  const isSkinEquipped = (skinCode: string): boolean => {
    return currentSkin === skinCode;
  };

  // Comprar skin
  const handlePurchaseSkin = async (skin: CharacterSkin): Promise<void> => {
    if (userGold < skin.price) {
      showMessage("No tienes suficiente oro para comprar esta skin", "error");
      return;
    }

    if (ownsSkin(skin.skin_code)) {
      showMessage("Ya posees esta skin", "error");
      return;
    }

    setPurchasing(skin.skin_code);

    try {
      const response = await purchaseSkin({ skin_code: skin.skin_code });

      setUserGold(response.data.remaining_gold);
      await loadUserSkins();

      showMessage(`¡${skin.name} comprada exitosamente!`, "success");
      console.log("✅ Skin comprada:", skin.name);
    } catch (error) {
      console.error("💥 Error al comprar skin:", error);
      showMessage("Error al comprar la skin", "error");
    } finally {
      setPurchasing(null);
    }
  };

  // Cambiar skin activa
  const handleChangeSkin = async (skin: UserSkin) => {
    if (isSkinEquipped(skin.skin_code)) {
      showMessage("Esta skin ya está equipada", "error");
      return;
    }

    setChanging(skin.skin_code);

    try {
      await changeSkin({ skin_code: skin.skin_code });
      setCurrentSkin(skin.skin_code);
      showMessage(`Skin cambiada a ${skin.name}`, "success");
      console.log("✅ Skin cambiada:", skin.name);
    } catch (error) {
      console.error("💥 Error al cambiar skin:", error);
      showMessage("Error al cambiar la skin", "error");
    } finally {
      setChanging(null);
    }
  };

  // Recargar solo las skins del usuario
  const loadUserSkins = async () => {
    try {
      const response = await getUserSkins();
      setUserSkins(response.data);
      
      // Actualizar la skin actual
      const equippedSkin = response.data.find((skin: UserSkin) => skin.is_equipped);
      setCurrentSkin(equippedSkin?.skin_code || null);
    } catch (error) {
      console.error("Error al recargar skins del usuario:", error);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/professor-bg.jpg')",
          }}
          aria-hidden="true"
        />
        <div className="fixed inset-0 z-10 bg-gradient-to-b from-white/70 via-white/50 to-white/80 backdrop-blur-[1px] pointer-events-none" />

        <div className="relative z-20 flex min-h-screen">
          <Sidebar sidebarOpen={false} closeSidebar={() => {}} />
          
          <main className="flex-1 lg:ml-64 min-h-screen">
            <div className="h-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pt-20 lg:pt-6">
              <div className="flex justify-center items-center h-full">
                <motion.div
                  className="flex flex-col items-center gap-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg sm:text-xl font-semibold text-gray-800 text-center">
                    Cargando tienda...
                  </span>
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Fondo con imagen y overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/professor-bg.jpg')",
        }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-10 bg-gradient-to-b from-white/70 via-white/50 to-white/80 backdrop-blur-[1px] pointer-events-none" />

      {/* Botón hamburguesa para móvil */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            ref={hamburgerButtonRef}
            className="fixed top-4 left-4 z-50 lg:hidden bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-xl shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Abrir menú"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <FaBars size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative z-20 flex min-h-screen">
        {/* Overlay para sidebar móvil */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
            />
          )}
        </AnimatePresence>

        <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />

        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="h-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pt-20 lg:pt-6">
            <div className="max-w-7xl mx-auto">
              {/* Header responsive con fondo mejorado */}
              <motion.header
                className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 sm:mb-8 gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-full lg:w-auto">
                  <motion.div
                    className="relative bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.h1
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex items-center gap-3 mb-2"
                    >
                      <FaStore className="text-green-400 text-xl sm:text-2xl lg:text-3xl drop-shadow-lg" />
                      <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                        Tienda de Skins
                      </span>
                    </motion.h1>
                    <p className="text-gray-200 text-sm sm:text-base font-medium">
                      Personaliza tu personaje con increíbles skins
                    </p>
                    
                    {/* Decoración adicional */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-60 animate-pulse"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </motion.div>
                </div>

                {/* Oro del usuario - responsive */}
                <motion.div
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400 rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg w-full sm:w-auto justify-center sm:justify-start"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <FaCoins className="text-yellow-600 text-lg sm:text-xl" />
                  <span className="font-bold text-yellow-800 text-base sm:text-lg">
                    {userGold.toLocaleString()} Oro
                  </span>
                </motion.div>
              </motion.header>

              {/* Mensajes */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border-2 ${
                      messageType === "success"
                        ? "bg-green-100 border-green-400 text-green-800"
                        : "bg-red-100 border-red-400 text-red-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {messageType === "success" ? (
                        <FaCheck className="text-green-600 flex-shrink-0" />
                      ) : (
                        <FaTimes className="text-red-600 flex-shrink-0" />
                      )}
                      <span className="font-semibold text-sm sm:text-base">
                        {message}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tabs responsive */}
              <motion.div
                className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  onClick={() => setActiveTab("shop")}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeTab === "shop"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-white/90 text-gray-700 hover:bg-gray-100 shadow-md"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaShoppingCart className="text-sm sm:text-base" />
                  <span className="text-sm sm:text-base">
                    Tienda ({shopSkins.length})
                  </span>
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab("inventory")}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeTab === "inventory"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-white/90 text-gray-700 hover:bg-gray-100 shadow-md"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaUser className="text-sm sm:text-base" />
                  <span className="text-sm sm:text-base">
                    Mi Inventario ({userSkins.length})
                  </span>
                </motion.button>
              </motion.div>

              {/* Contenido de las tabs */}
              <AnimatePresence mode="wait">
                {activeTab === "shop" && (
                  <motion.div
                    key="shop"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                      {shopSkins.map((skin, index) => (
                        <motion.div
                          key={skin.id}
                          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden hover:border-green-400 transition-all duration-300 group"
                          whileHover={{ scale: 1.02, y: -4 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          layout
                        >
                          {/* Imagen de la skin */}
                          <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                            <Image
                              src={getSkinImageUrl(skin.skin_code)}
                              alt={skin.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              onError={handleImageError}
                            />

                            {/* Badge de estado */}
                            {ownsSkin(skin.skin_code) && (
                              <motion.div
                                className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                              >
                                ✓ Comprada
                              </motion.div>
                            )}

                            {/* Precio en overlay */}
                            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1">
                              <FaCoins className="text-yellow-400 text-xs" />
                              <span className="text-xs font-bold">
                                {skin.price}
                              </span>
                            </div>
                          </div>

                          {/* Información de la skin */}
                          <div className="p-3 sm:p-4">
                            <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-1 sm:mb-2 truncate">
                              {skin.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                              {skin.description}
                            </p>

                            <motion.button
                              onClick={() => handlePurchaseSkin(skin)}
                              disabled={
                                ownsSkin(skin.skin_code) ||
                                purchasing === skin.skin_code ||
                                userGold < skin.price
                              }
                              className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
                                ownsSkin(skin.skin_code)
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : userGold < skin.price
                                  ? "bg-red-200 text-red-700 cursor-not-allowed"
                                  : "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl"
                              }`}
                              whileHover={
                                !ownsSkin(skin.skin_code) && userGold >= skin.price
                                  ? { scale: 1.02 }
                                  : {}
                              }
                              whileTap={{ scale: 0.98 }}
                            >
                              {purchasing === skin.skin_code ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span className="hidden sm:inline">Comprando...</span>
                                  <span className="sm:hidden">...</span>
                                </>
                              ) : ownsSkin(skin.skin_code) ? (
                                <>
                                  <FaCheck />
                                  <span>Comprada</span>
                                </>
                              ) : userGold < skin.price ? (
                                <>
                                  <FaTimes />
                                  <span>Sin oro</span>
                                </>
                              ) : (
                                <>
                                  <FaShoppingCart />
                                  <span>Comprar</span>
                                </>
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {shopSkins.length === 0 && (
                      <motion.div
                        className="text-center py-16 sm:py-20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <FaStore className="text-4xl sm:text-6xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                          No hay skins disponibles
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500">
                          La tienda está vacía por el momento
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {activeTab === "inventory" && (
                  <motion.div
                    key="inventory"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                      {userSkins.map((skin, index) => (
                        <motion.div
                          key={skin.id}
                          className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 group ${
                            isSkinEquipped(skin.skin_code)
                              ? "border-yellow-400 ring-2 ring-yellow-200"
                              : "border-green-200 hover:border-green-400"
                          }`}
                          whileHover={{ scale: 1.02, y: -4 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          layout
                        >
                          {/* Imagen de la skin */}
                          <div className="relative h-40 sm:h-48 bg-gradient-to-br from-green-100 to-green-200 overflow-hidden">
                            <Image
                              src={getSkinImageUrl(skin.skin_code)}
                              alt={skin.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              onError={handleImageError}
                            />

                            {/* Badge de estado */}
                            {isSkinEquipped(skin.skin_code) ? (
                              <motion.div
                                className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                              >
                                <FaStar className="text-xs" />
                                Equipada
                              </motion.div>
                            ) : (
                              <motion.div
                                className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                              >
                                ✓ Tuya
                              </motion.div>
                            )}

                            {/* Valor en overlay */}
                            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1">
                              <FaCoins className="text-yellow-400 text-xs" />
                              <span className="text-xs font-bold">
                                {skin.price}
                              </span>
                            </div>
                          </div>

                          {/* Información de la skin */}
                          <div className="p-3 sm:p-4">
                            <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-1 sm:mb-2 truncate">
                              {skin.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                              {skin.description}
                            </p>

                            <motion.button
                              onClick={() => handleChangeSkin(skin)}
                              disabled={changing === skin.skin_code || isSkinEquipped(skin.skin_code)}
                              className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-xl ${
                                isSkinEquipped(skin.skin_code)
                                  ? "bg-yellow-500 text-white cursor-not-allowed opacity-80"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                              whileHover={!isSkinEquipped(skin.skin_code) ? { scale: 1.02 } : {}}
                              whileTap={{ scale: 0.98 }}
                            >
                              {changing === skin.skin_code ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span className="hidden sm:inline">Cambiando...</span>
                                  <span className="sm:hidden">...</span>
                                </>
                              ) : isSkinEquipped(skin.skin_code) ? (
                                <>
                                  <FaStar />
                                  <span>Equipada</span>
                                </>
                              ) : (
                                <>
                                  <FaPalette />
                                  <span>Equipar</span>
                                </>
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {userSkins.length === 0 && (
                      <motion.div
                        className="text-center py-16 sm:py-20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <FaUser className="text-4xl sm:text-6xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                          No tienes skins
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500 mb-4">
                          Compra algunas skins en la tienda para personalizar tu
                          personaje
                        </p>
                        <motion.button
                          onClick={() => setActiveTab("shop")}
                          className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Ir a la Tienda
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}