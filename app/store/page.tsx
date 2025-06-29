"use client";

import { useState, useEffect } from "react";
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

// NUEVA: Función para obtener la URL de la imagen basada en el skin_code
const getSkinImageUrl = (skinCode: string): string => {
  return `/skins/${skinCode}.png`;
};

// NUEVA: Función para manejar errores de imagen
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.src = "/skins/default_warrior.png"; // Imagen por defecto si no existe
};

// Sidebar para la tienda
function Sidebar() {
  const router = useRouter();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white text-black flex flex-col z-40 shadow-[0_0_32px_0_rgba(0,0,0,0.18)] border-r border-gray-200">
      <div className="flex items-center gap-2 px-6 py-7 border-b border-gray-200">
        <span
          className="text-2xl font-bold tracking-tight font-sans select-none text-black drop-shadow cursor-pointer hover:text-green-600 transition-colors duration-200"
          onClick={() => router.push("/dashboard/student")}
          title="Ir al Dashboard"
        >
          CLASSCRAFT
        </span>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="mt-4 mb-2 px-3 text-xs text-black uppercase tracking-wider font-bold">
          Navegación
        </div>
        <ul className="space-y-2">
          <li>
            <button
              className="cursor-pointer flex items-center gap-3 px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm font-semibold transition hover:bg-black/90 w-full"
              onClick={() => router.push("/dashboard/student")}
            >
              <FaArrowLeft className="text-green-500 text-xl" />
              Volver al Dashboard
            </button>
          </li>
        </ul>

        <div className="mt-10 mb-2 px-3 text-xs text-black uppercase tracking-wider font-bold">
          Categorías
        </div>
        <ul className="space-y-1">
          <li>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-green-700 bg-green-50">
              <FaPalette className="text-green-600" />
              Skins de Personaje
            </div>
          </li>
        </ul>
      </nav>
    </aside>
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

  // Estados para modales y UI
  const [activeTab, setActiveTab] = useState<"shop" | "inventory">("shop");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

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

      console.log("✅ Datos de tienda cargados:", {
        skins: skinsResponse.data.length,
        userSkins: userSkinsResponse.data.length,
        gold: goldResponse.data.gold,
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
      await loadUserSkins(); // Recargar skins del usuario

      showMessage(`¡${skin.name} comprada exitosamente!`, "success");
      console.log("✅ Skin comprada:", skin.name);
    } catch (error) {
      console.error("💥 Error al comprar skin:", error);
    } finally {
      setPurchasing(null);
    }
  };

  // Cambiar skin activa
  const handleChangeSkin = async (skin: UserSkin) => {
    setChanging(skin.skin_code);

    try {
      await changeSkin({ skin_code: skin.skin_code });
      showMessage(`Skin cambiada a ${skin.name}`, "success");
      console.log("✅ Skin cambiada:", skin.name);
    } catch (error) {
      console.error("💥 Error al cambiar skin:", error);
    } finally {
      setChanging(null);
    }
  };

  // Recargar solo las skins del usuario
  const loadUserSkins = async () => {
    try {
      const response = await getUserSkins();
      setUserSkins(response.data);
    } catch (error) {
      console.error("Error al recargar skins del usuario:", error);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div
          className="fixed inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/professor-bg.jpg')",
          }}
          aria-hidden="true"
        />
        <div className="fixed inset-0 z-10 bg-gradient-to-b from-white/60 via-white/40 to-white/80 pointer-events-none" />

        <div className="relative z-20 flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 py-10 px-6">
            <div className="flex justify-center items-center h-full">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xl font-semibold text-gray-800">
                  Cargando tienda...
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Fondo con imagen y overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/professor-bg.jpg')",
        }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-10 bg-gradient-to-b from-white/60 via-white/40 to-white/80 pointer-events-none" />

      <div className="relative z-20 flex min-h-screen">
        <Sidebar />

        <main className="flex-1 ml-64 py-10 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <FaStore className="text-green-600" />
                  Tienda de Skins
                </h1>
                <p className="text-gray-600 mt-2">
                  Personaliza tu personaje con increíbles skins
                </p>
              </div>

              {/* Oro del usuario */}
              <div className="flex items-center gap-2 bg-yellow-100 border-2 border-yellow-400 rounded-full px-6 py-3 shadow-lg">
                <FaCoins className="text-yellow-600 text-xl" />
                <span className="font-bold text-yellow-800 text-lg">
                  {userGold} Oro
                </span>
              </div>
            </header>

            {/* Mensajes */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-6 p-4 rounded-lg border-2 ${
                    messageType === "success"
                      ? "bg-green-100 border-green-400 text-green-800"
                      : "bg-red-100 border-red-400 text-red-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {messageType === "success" ? (
                      <FaCheck className="text-green-600" />
                    ) : (
                      <FaTimes className="text-red-600" />
                    )}
                    <span className="font-semibold">{message}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => setActiveTab("shop")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === "shop"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaShoppingCart />
                Tienda ({shopSkins.length})
              </button>
              <button
                onClick={() => setActiveTab("inventory")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === "inventory"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaUser />
                Mi Inventario ({userSkins.length})
              </button>
            </div>

            {/* Contenido de las tabs */}
            <AnimatePresence mode="wait">
              {activeTab === "shop" && (
                <motion.div
                  key="shop"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {shopSkins.map((skin) => (
                      <motion.div
                        key={skin.id}
                        className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden hover:border-green-400 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        layout
                      >
                        {/* ACTUALIZADO: Imagen de la skin usando skin_code */}
                        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          <Image
                            src={getSkinImageUrl(skin.skin_code)}
                            alt={skin.name}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            onError={handleImageError}
                          />

                          {/* Badge de estado */}
                          {ownsSkin(skin.skin_code) && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              ✓ Comprada
                            </div>
                          )}
                        </div>

                        {/* Información de la skin */}
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-gray-800 mb-2">
                            {skin.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {skin.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <FaCoins className="text-yellow-500" />
                              <span className="font-bold text-yellow-700">
                                {skin.price}
                              </span>
                            </div>

                            <button
                              onClick={() => handlePurchaseSkin(skin)}
                              disabled={
                                ownsSkin(skin.skin_code) ||
                                purchasing === skin.skin_code ||
                                userGold < skin.price
                              }
                              className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
                                ownsSkin(skin.skin_code)
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : userGold < skin.price
                                  ? "bg-red-200 text-red-700 cursor-not-allowed"
                                  : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                            >
                              {purchasing === skin.skin_code ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Comprando...
                                </>
                              ) : ownsSkin(skin.skin_code) ? (
                                <>
                                  <FaCheck />
                                  Comprada
                                </>
                              ) : userGold < skin.price ? (
                                "Sin oro"
                              ) : (
                                <>
                                  <FaShoppingCart />
                                  Comprar
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {shopSkins.length === 0 && (
                    <div className="text-center py-20">
                      <FaStore className="text-6xl text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No hay skins disponibles
                      </h3>
                      <p className="text-gray-500">
                        La tienda está vacía por el momento
                      </p>
                    </div>
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
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {userSkins.map((skin) => (
                      <motion.div
                        key={skin.id}
                        className="bg-white rounded-xl shadow-lg border-2 border-green-200 overflow-hidden hover:border-green-400 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        layout
                      >
                        {/* ACTUALIZADO: Imagen de la skin usando skin_code */}
                        <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200 overflow-hidden">
                          <Image
                            src={getSkinImageUrl(skin.skin_code)}
                            alt={skin.name}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            onError={handleImageError}
                          />

                          {/* Badge de propiedad */}
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            ✓ Tuya
                          </div>
                        </div>

                        {/* Información de la skin */}
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-gray-800 mb-2">
                            {skin.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {skin.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <FaCoins className="text-yellow-500" />
                              <span className="font-bold text-yellow-700">
                                {skin.price}
                              </span>
                            </div>

                            <button
                              onClick={() => handleChangeSkin(skin)}
                              disabled={changing === skin.skin_code}
                              className="px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                              {changing === skin.skin_code ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Cambiando...
                                </>
                              ) : (
                                <>
                                  <FaPalette />
                                  Equipar
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {userSkins.length === 0 && (
                    <div className="text-center py-20">
                      <FaUser className="text-6xl text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No tienes skins
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Compra algunas skins en la tienda para personalizar tu
                        personaje
                      </p>
                      <button
                        onClick={() => setActiveTab("shop")}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        Ir a la Tienda
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
