import Image from "next/image";
import FeatureCard from "./FeatureCard";

export default function FeatureSection() {
  return (
    <section id="features" className="py-10 sm:py-16">
      <div className="container mx-auto px-2 sm:px-4">
        <h2 className="mb-8 sm:mb-12 text-center text-2xl sm:text-4xl">
          <strong>Herramientas poderosas</strong> para{" "}
          <strong>impulsar el compromiso</strong>
          <div className="flex justify-center items-center my-6 sm:my-8">
            <Image
              src="/background.png"
              alt="Classcraft"
              width={220}
              height={220}
              className="rounded-lg shadow-lg max-w-full h-auto"
              style={{ maxWidth: 220, width: "100%" }}
            />
          </div>
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 justify-center items-center max-w-full sm:max-w-4xl mx-auto">
          {/* Característica 1 */}
          <FeatureCard
            title="Mejora el Ambiente en la Clase"
            description="Incita a los alumnos con riesgos reales y recompensas en clase y los observa volviéndose mejores alumnos conforme vayan progresando en el juego"
            iconSrc="/feature/feature1.svg"
          />
          {/* Característica 2 */}
          <FeatureCard
            title="Equipos Colaborativos"
            description="Los estudiantes trabajan en equipos, donde cada miembro aporta sus habilidades únicas para enfrentar desafíos académicos juntos."
            iconSrc="/feature/feature2.svg"
          />
          {/* Característica 3 */}
          <FeatureCard
            title="Poderes y Habilidades"
            description="Cada clase de personaje tiene poderes únicos que reflejan diferentes estilos de aprendizaje y fortalezas académicas."
            iconSrc="/feature/feature3.svg"
          />
          {/* Característica 4 */}
          <FeatureCard
            title="Eventos y Desafíos"
            description="Desafíos épicos, batallas contra jefes y eventos especiales transforman exámenes y proyectos en emocionantes aventuras."
            iconSrc="/feature/feature4.svg"
          />
          {/* Característica 5 */}
          <FeatureCard
            title="Dashboard para Profesores"
            description="Potentes herramientas para que los profesores monitoreen el progreso, asignen recompensas y gestionen el comportamiento de forma divertida."
            iconSrc="/feature/feature5.svg"
          />
          {/* Característica 6 */}
          <FeatureCard
            title="Tienda de Equipamiento"
            description="Los estudiantes pueden gastar oro ganado en personalizar sus personajes con armas, armaduras y accesorios que ofrecen bonificaciones."
            iconSrc="/feature/feature6.svg"
          />
        </div>
      </div>
    </section>
  );
}
