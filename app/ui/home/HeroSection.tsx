import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center w-full min-h-[60vh] sm:min-h-[80vh] lg:min-h-[100vh] overflow-hidden mb-2"
    >
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

      <div className="relative z-10 flex flex-col items-center text-center w-full px-2 pb-10 pt-8 sm:pt-16">
        <h1 className="mb-4 font-extrabold tracking-tight drop-shadow-lg text-sm sm:text-xl lg:text-2xl">
          <span className="inline-block px-5 py-2 rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm">
            Transforma tu aula en aventura
          </span>
        </h1>
        <Link
          href="/auth/select-role"
          className="mt-4 inline-block rounded-full bg-green-500 px-6 py-2 text-sm sm:px-10 sm:py-3 sm:text-base text-white transition duration-300 hover:bg-green-700 hover:shadow-lg"
        >
          ¡Comienza Gratis Ahora!
        </Link>
      </div>
    </section>
  );
}
