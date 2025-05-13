interface CharacterCardProps {
  title: string;
  description: string;
  imageUrl: string;
  features: string[];
}

export default function CharacterCard({
  title,
  description,
  imageUrl,
  features,
}: CharacterCardProps) {
  return (
    <div
      className={`flex flex-col items-center rounded-lg bg-gradient-to-b from-red-900/50 to-red-950/50 p-6 text-center shadow-lg transition duration-300 hover:transform hover:shadow-xl hover:ring`}
    >
      <div className="relative mb-4 h-48 w-48 overflow-hidden rounded-full border-4 border-yellow-500 shadow-lg hover:scale-105 transition-transform duration-300">
        <div
          style={{ backgroundImage: `url(${imageUrl})` }}
          className="w-full h-full bg-cover bg-center"
        ></div>
      </div>

      <h3 className="mb-2 text-2xl font-bold text-red-400">{title}</h3>
      <p className="mb-4 text-blue-100">{description}</p>
      <ul>
        {features.map((feature, index) => (
          <li key={index}>• {feature} </li>
        ))}
      </ul>
    </div>
  );
}
