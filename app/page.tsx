/* import Link from "next/link"; */

import CharacterCard from "./ui/CharacterdCard";
import Link from "next/link";
import FeatureCard from "./ui/FeatureCard";
import NavBar from "./ui/NavBar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col max-w-full overflow-x-hidden">
      <NavBar />
      {/* Hero Section */}
      <section className="relative flex items-center justify-center w-full min-h-[50vh] sm:min-h-[70vh] lg:min-h-[90vh] overflow-hidden">
        {/* Fondo solo en la sección */}
        <div className="absolute inset-0 z-0">
          <Image
            src={"/background.png"}
            alt="Fondo"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradiente blanco solo en la parte baja */}
          <div className="absolute bottom-0 left-0 w-full h-[10%] pointer-events-none bg-gradient-to-t from-white/95 via-white/60 to-transparent" />
        </div>

        {/* Contenido centrado y más arriba */}
        <div className="relative z-10 flex flex-col items-center text-center w-full px-2 pb-10 pt-8 sm:pt-16">
          <h1 className="mb-4 font-extrabold tracking-tight drop-shadow-lg text-sm sm:text-xl lg:text-2xl">
            <span className="inline-block px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm">
              Transforma tu aula en aventura
            </span>
          </h1>
          <Link
            href="/auth/register"
            className="mt-4 inline-block rounded-full bg-green-500 px-6 py-2 text-sm sm:px-10 sm:py-3 sm:text-base text-white transition duration-300 hover:bg-green-700 hover:shadow-lg"
          >
            Empieza ahora. ¡Es Gratis!
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 sm:py-12 text-center">
        <div className="container mx-auto px-2 sm:px-4">
          <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold">
            Haz tus clases inolvidables
          </h2>
          <div className="flex justify-center items-center my-6 sm:my-8">
            <Image
              src="/Claasscraft.jpg"
              alt="Classcraft"
              width={220}
              height={220}
              className="rounded-lg shadow-lg max-w-full h-auto"
              style={{ maxWidth: 220, width: "100%" }}
            />
          </div>
          <div className="mt-6 sm:mt-8">
            <p className="mt-4 text-lg sm:text-2xl text-gray-700 text-center max-w-md sm:max-w-2xl mx-auto">
              Transforma cualquier clase en un juego de rol que fomenta una
              colaboración más estrecha entre los estudiantes y alienta un mejor
              comportamiento.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-2 sm:px-4">
          <h2 className="mb-8 sm:mb-12 text-center text-2xl sm:text-4xl">
            <strong>Herramientas poderosas</strong> para{" "}
            <strong>impulsar el compromiso</strong>
            <div className="flex justify-center items-center my-6 sm:my-8">
              <Image
                src="/Claasscraft.jpg"
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

      {/* Character Class Section */}
      <section className="bg-blue-900/50 py-10 sm:py-16">
        <div className="container mx-auto px-2 sm:px-4">
          <h2 className="mb-8 sm:mb-12 text-center text-2xl sm:text-4xl font-bold text-white">
            Elige tu Clase de Personaje
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            {/* Guerrero */}
            <CharacterCard
              title="Guerrero"
              description="Protectores valientes con gran resistencia. Defienden a sus compañeros del fracaso y protegen al equipo."
              imageUrl="https://imgs.search.brave.com/7jO95c3IM9Ym3Tp7d6WqxcWn0rs4CTdlfDQTznaOCH8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYXJ0cy5jb20v/ZmlsZXMvNC9XYXJy/aW9yLVRyYW5zcGFy/ZW50LUltYWdlcy5w/bmc"
              features={[
                "Alto HP para resistir desafíos",
                "Habilidades de protección de equipo",
                "Especialistas en perseverencia",
              ]}
            />
            {/* Mago */}
            <CharacterCard
              title="Mago"
              description="Protectores valientes con gran resistencia. Defienden a sus compañeros del fracaso y protegen al equipo."
              imageUrl="https://w7.pngwing.com/pngs/299/774/png-transparent-wizard-student-classcraft-studio-classroom-learning-wizard-superhero-class-fictional-character.png"
              features={[
                "Alto HP para resistir desafíos",
                "Habilidades de protección de equipo",
                "Especialistas en perseverencia",
              ]}
            />
            {/* Sanador */}
            <CharacterCard
              title="Sanador"
              description="Protectores valientes con gran resistencia. Defienden a sus compañeros del fracaso y protegen al equipo."
              imageUrl="https://e7.pngegg.com/pngimages/329/133/png-clipart-healer-student-classcraft-studio-classmates-miscellaneous-game-thumbnail.png"
              features={[
                "Alto HP para resistir desafíos",
                "Habilidades de protección de equipo",
                "Especialistas en perseverencia",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 py-6 sm:py-8">
        <div className="container mx-auto px-2 sm:px-4 text-center text-blue-400">
          <p>
            &copy; {new Date().getFullYear()} Classcraft. Todos los derechos
            reservados.
          </p>
          <p className="mt-2 text-xs sm:text-sm">
            Este es un proyecto educativo y no está afiliado con el Classcraft
            original.
          </p>
        </div>
      </footer>
    </main>
  );
}
