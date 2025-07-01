"use client";

import { useState } from "react";
import { CharacterCardProps } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";

export default function CharacterCard({
  title,
  description,
  imageUrl,
  features,
}: CharacterCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative group flex flex-col items-center rounded-3xl bg-white p-6 shadow-xl border-2 border-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-gray-800/30 w-full max-w-sm mx-auto"
      >
        <div className="absolute -inset-1 bg-green-500 opacity-0 group-hover:opacity-10 blur-xl rounded-3xl transition-opacity duration-500 pointer-events-none" />

        {/* Imagen */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative mb-5 h-48 w-48 rounded-full overflow-hidden border-4 border-green-500 shadow-md cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div
            className="w-full h-full bg-contain bg-center bg-no-repeat bg-white"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        </motion.div>

        <div className="mb-3 px-4 py-1 rounded-full bg-black/80 text-white text-lg font-semibold tracking-wide shadow-sm">
          {title}
        </div>

        <p className="mb-4 text-sm sm:text-base text-gray-700 text-center leading-relaxed">
          {description}
        </p>

        <ul className="text-sm text-gray-800 space-y-2 text-left w-full max-w-xs">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-2 before:content-['✔'] before:text-green-500 before:font-bold"
            >
              {feature}
            </li>
          ))}
        </ul>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.img
              src={imageUrl}
              alt={title}
              className="max-w-full max-h-full rounded-xl shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}