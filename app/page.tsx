/* import Link from "next/link"; */

import CharacterCard from "./ui/CharacterdCard";
import Link from "next/link";
import FeatureCard from "./ui/FeatureCard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section  */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 z-0 opacity-80">
          {/* Fondo con patrón de fantasía */}
          <div className="h-full w-full bg-[url('/background.webp')] bg-repeat opacity-90"></div>
        </div>

        <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-red-500 drop-shadow-lg sm:text-7xl">
            <span className="block text-yellow-400">ClassCraft</span>
            <span className="mt-2 block text-3xl font-bold sm:text-5xl">
              Transforma tu aula en aventura
            </span>
          </h1>
          <p className="mb-10 max-w-2xl text-xl text-pink-900">
            La plataforma educativa de gamificación que convierte el aprendizaje
            en una épica aventura. Profesores y estudiantes unidos en un mundo
            de magia, poder y conocimiento.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <>
              <Link
                href="/auth/login"
                className="transform rounded-lg bg-yellow-500 px-8 py-3 font-bold text-blue-900 transition duration-300 hover:bg-yellow-400 hover:shadow-lg"
              >
                Iniciar Sesión
              </Link>

              <Link
                href="/auth/register"
                className="transform rounded-lg border-2 border-yellow-500 bg-transparent px-8 py-3 font-bold text-yellow-500 transition duration-300 hover:bg-yellow-500/10"
              >
                Registrarse
              </Link>
            </>
          </div>
        </div>
      </section>

      {/* Character Class Section */}
      <section className="bg-blue-900/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-white">
            Elige tu Clase de Personaje
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-white">
            Características Principales
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">



            {/* Característica 1 */}
            <FeatureCard
            title="Sistema de Puntos y Nivele"
            description="Los estudiantes ganan XP por buen comportamiento y logros académicos, subiendo de nivel y desbloqueando nuevos poderes."
            iconSrc="/feature/feature1.svg"
            >
            </FeatureCard>

            {/* Característica 2 */}
            <FeatureCard
            title="Equipos Colaborativos"
            description="Los estudiantes trabajan en equipos, donde cada miembro aporta sus habilidades únicas para enfrentar desafíos académicos juntos."
            iconSrc="/feature/feature2.svg"
            >
            </FeatureCard>
            
            {/* Característica 3 */}
            <FeatureCard
            title="Poderes y Habilidades
"
            description="Cada clase de personaje tiene poderes únicos que reflejan diferentes estilos de aprendizaje y fortalezas académicas."
            iconSrc="/feature/feature3.svg"
            >
            </FeatureCard>
            {/* Característica 4 */}
            <FeatureCard
            title="Eventos y Desafíos"
            description="Desafíos épicos, batallas contra jefes y eventos especiales transforman exámenes y proyectos en emocionantes aventuras."
            iconSrc="/feature/feature4.svg"
            >
            </FeatureCard>
            {/* Característica 5 */}
            <FeatureCard
            title="Dashboard para Profesores"
            description="Potentes herramientas para que los profesores monitoreen el progreso, asignen recompensas y gestionen el comportamiento de forma divertida."
            iconSrc="/feature/feature5.svg"
            >
            </FeatureCard>
            {/* Característica 6 */}
            <FeatureCard
            title="Tienda de Equipamiento"
            description="Los estudiantes pueden gastar oro ganado en personalizar sus personajes con armas, armaduras y accesorios que ofrecen bonificaciones."
            iconSrc="/feature/feature6.svg"
            >
            </FeatureCard>

          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-4xl font-bold">¿Listo para transformar tu aula?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-950">
            Únete a miles de educadores que están revolucionando la forma de
            enseñar con Classcraft.
          </p>
          <Link
          href="/auth/register"
          className="inline-block transform rounded-lg bg-yellow-500 px-8 py-4 text-xl font-bold text-blue-900 transition duration-300 hover:bg-yellow-400 hover:shadow-lg"
          >
            Comienza tu Aventura
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 py-8">
        <div className="container mx-auto px-4 text-center text-blue-400">
          <p>
            &copy; {new Date().getFullYear()} Classcraft. Todos los derechos
            reservados.
          </p>
          <p className="mt-2 text-sm">
            Este es un proyecto educativo y no está afiliado con el Classcraft
            original.
          </p>
        </div>
      </footer>
    </main>
  );
}
