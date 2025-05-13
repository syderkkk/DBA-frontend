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
    <div className="max-w-md mx-auto flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Icon Section */}
      <div className="flex-shrink-0 mr-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-400">
          <Image
            src={iconSrc}
            alt={`${title} Icon`}
            width={24}
            height={24}
          />
        </div>
      </div>

      {/* Text Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
