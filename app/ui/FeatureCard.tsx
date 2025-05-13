import Image from "next/image";

interface FeatureCardProps {
  title: string;
  description: string;
  iconSrc: string;
}

export default function FeatureCard({
  title,
  description,
  iconSrc,
}: FeatureCardProps) {
  return (
    <div className="rounded-lg bg-blue-800/30 p-6 shadow-lg">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-blue-900">
        <Image
          src={iconSrc}
          alt={`${title} Icon`}
          width={32}
          height={32}
        ></Image>
      </div>
      <h3 className="mb-2 text-xl font-bold text-yellow-400">{title}</h3>
      <p className="text-blue-950">{description}</p>
    </div>
  );
}
