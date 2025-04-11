interface AnimeCardProps {
  id: number;
  title: string;
  imageUrl: string;
  studio: string;
  description: string;
  genres: string[];
  onClick?: () => void;
}

export default function AnimeCard({
  title,
  imageUrl,
  studio,
  description,
  genres,
  onClick,
}: AnimeCardProps) {
  return (
    <div
      className="relative h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer group"
      onClick={onClick}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-200 scale-100 group-hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex flex-col justify-end">
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <p className="text-sm text-gray-300 mb-1">{studio}</p>
        <p className="text-sm text-gray-200 line-clamp-3">{description}</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {genres.map((g) => (
            <span
              key={g}
              className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full"
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
