'use client';
import { FeatureCardProps } from "@/types/types";
import Image from "next/image";
import { motion } from "framer-motion";

export default function FeatureCard({
  title,
  description,
  iconSrc,
}: FeatureCardProps) {
  return (
    <motion.div
      className="max-w-md mx-auto flex items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 hover:border-green-400 group"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(34,197,94,0.15)" }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Icon Section */}
      <div className="flex-shrink-0 mr-5">
        <motion.div
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-green-400 to-green-600 shadow-md group-hover:scale-110 transition-transform"
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Image
            src={iconSrc}
            alt={`${title} Icon`}
            width={28}
            height={28}
            className="drop-shadow-lg"
          />
        </motion.div>
      </div>

      {/* Text Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">{title}</h3>
        <p className="mt-2 text-base text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}