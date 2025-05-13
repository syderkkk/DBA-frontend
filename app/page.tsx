/* import Link from "next/link"; */

import CharacterCard from "./ui/CharacterdCard";
import Link from "next/link";
import FeatureCard from "./ui/FeatureCard";
import NavBar from "./ui/NavBar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <NavBar></NavBar>
      {/* Hero Section  */}
      <section className="relative overflow-hidden min-h-[60vh] py-20 md:py-32">
        <div className="absolute inset-0 z-0">
          {/* Fondo con patrón de fantasía */}
          <div className="relative h-full w-full">
            <Image
              src={"/m-bg.png"}
              alt="/m-bg."
              fill
              className="object-cover"
              priority
            ></Image>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent"></div>
        </div>

        <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-yellow-400 drop-shadow-lg sm:text-7xl">
            <span className="block text-yellow-400">{/* ClassCraft */}</span>
            <span className="mt-2 block text-3xl font-bold text-blue-200 sm:text-5xl">
              {/* Transforma tu aula en aventura */}
            </span>
          </h1>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-3xl font-bold">
            Haz tus clases inolvidables
          </h2>
          <Link
            href="/auth/register"
            className="inline-block transform rounded-full bg-green-500 px-10 py-4 text-lg text-white transition duration-300 hover:bg-green-700 hover:shadow-lg"
          >
            Empieza ahora. ¡Es Gratis!
          </Link>
          <div className="flex justify-center items-center my-8">
            <Image
              src="/Claasscraft.jpg"
              alt="Classcraft"
              width={300}
              height={300}
              className="rounded-lg shadow-lg"
            ></Image>
          </div>
          <div className="mt-8">
            <p className="mt-4 text-2xl text-gray-700 text-center max-w-2xl mx-auto">
              Transforma cualquier clase en un juego de rol que fomenta una
              colaboración más estrecha entre los estudiantes y alienta un mejor
              comportamiento.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl">
            <strong>Herramientas poderosas</strong> para <strong>impulsar en compromiso</strong>
            <div className="flex justify-center items-center my-8">
            <Image
              src="/Claasscraft.jpg"
              alt="Classcraft"
              width={300}
              height={300}
              className="rounded-lg shadow-lg"
            ></Image>
          </div>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 justify-center items-center max-w-4xl mx-auto">
            {/* Característica 1 */}
            <FeatureCard
              title="Mejora el Ambiente en la Clase"
              description="Incita a los alumnos con riesgos reales y recompensas en clase y los observa volviéndose mejores alumnos conforme vayan progresando en el juego"
              iconSrc="/feature/feature1.svg"
            ></FeatureCard>

            {/* Característica 2 */}
            <FeatureCard
              title="Equipos Colaborativos"
              description="Los estudiantes trabajan en equipos, donde cada miembro aporta sus habilidades únicas para enfrentar desafíos académicos juntos."
              iconSrc="/feature/feature2.svg"
            ></FeatureCard>

            {/* Característica 3 */}
            <FeatureCard
              title="Poderes y Habilidades
"
              description="Cada clase de personaje tiene poderes únicos que reflejan diferentes estilos de aprendizaje y fortalezas académicas."
              iconSrc="/feature/feature3.svg"
            ></FeatureCard>
            {/* Característica 4 */}
            <FeatureCard
              title="Eventos y Desafíos"
              description="Desafíos épicos, batallas contra jefes y eventos especiales transforman exámenes y proyectos en emocionantes aventuras."
              iconSrc="/feature/feature4.svg"
            ></FeatureCard>
            {/* Característica 5 */}
            <FeatureCard
              title="Dashboard para Profesores"
              description="Potentes herramientas para que los profesores monitoreen el progreso, asignen recompensas y gestionen el comportamiento de forma divertida."
              iconSrc="/feature/feature5.svg"
            ></FeatureCard>
            {/* Característica 6 */}
            <FeatureCard
              title="Tienda de Equipamiento"
              description="Los estudiantes pueden gastar oro ganado en personalizar sus personajes con armas, armaduras y accesorios que ofrecen bonificaciones."
              iconSrc="/feature/feature6.svg"
            ></FeatureCard>
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
