import CharacterCard from "./CharacterdCard";

export default function CharacterSection() {
  return (
    <section id="characters" className="py-10 sm:py-16">
      <div className="container mx-auto px-2 sm:px-4">
        <h2 className="mb-4 sm:mb-8 text-center text-2xl sm:text-4xl font-bold">
          Personajes disponibles
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {/* Guerrero */}
          <CharacterCard
            title="Guerrero"
            description="Protectores valientes con gran resistencia. Defienden a sus compañeros del fracaso y protegen al equipo."
            imageUrl="/zhongli_avatar.png"
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
            imageUrl="vendi_home.png"
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
            imageUrl="barbara.png"
            features={[
              "Alto HP para resistir desafíos",
              "Habilidades de protección de equipo",
              "Especialistas en perseverencia",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
