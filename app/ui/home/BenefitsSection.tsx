"use client";
import { motion } from "framer-motion";

export default function BenefitsSection() {
  return (
    <section id="beneficios" className="py-8 sm:py-12 text-center bg-white">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl sm:text-3xl font-bold">
          Beneficios para tu aula
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {[
            {
              title: "+ Participación",
              desc: "Los estudiantes se involucran más y participan activamente en clase.",
              color: "from-green-300 to-green-500",
            },
            {
              title: "Mejor Comportamiento",
              desc: "Fomenta el respeto y la colaboración a través de dinámicas de juego.",
              color: "from-blue-300 to-blue-500",
            },
            {
              title: "Aprendizaje Divertido",
              desc: "Convierte el aprendizaje en una experiencia entretenida y memorable.",
              color: "from-yellow-300 to-yellow-500",
            },
          ].map((b, i) => (
            <motion.div
              key={b.title}
              className={`relative bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 group overflow-hidden transition-all duration-200 hover:border-green-400`}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{
                scale: 1.04,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 18,
                delay: i * 0.08,
              }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* Gradiente decorativo */}
              <div
                className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30 bg-gradient-to-tr ${b.color} pointer-events-none`}
              />
              <h3 className="font-bold mb-2 text-lg text-gray-800 group-hover:text-green-600 transition-colors">
                {b.title}
              </h3>
              <p className="text-gray-700">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
