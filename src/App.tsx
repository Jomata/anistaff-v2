import { useState } from "react";
import SeasonSelector from "./components/SeasonSelector";
import AnimeCard from "./components/AnimeCard";
import AnimeDetailPanel from "./components/AnimeDetailPanel";

const dummyAnimeList = [
  {
    id: 101922,
    title: "Kimetsu no Yaiba",
    imageUrl: "https://cdn.anilist.co/img/dir/anime/reg/101922.webp",
    studio: "ufotable",
    description: "Tanjiro Kamado joins the Demon Slayer Corps to avenge his family and cure his sister.",
    genres: ["action", "supernatural", "historical"],
  },
  {
    id: 113415,
    title: "Jujutsu Kaisen",
    imageUrl: "https://cdn.anilist.co/img/dir/anime/reg/113415.webp",
    studio: "MAPPA",
    description: "Yuji Itadori swallows a cursed object and becomes host to a powerful curse.",
    genres: ["action", "dark fantasy", "shounen"],
  },
  {
    id: 153518,
    title: "Frieren: Beyond Journey’s End",
    imageUrl: "https://cdn.anilist.co/img/dir/anime/reg/153518.webp",
    studio: "Madhouse",
    description: "An elf mage reflects on her past with her adventuring party after the hero’s death.",
    genres: ["fantasy", "drama", "slice of life"],
  },
];

function App() {
  const [season, setSeason] = useState<string>("");
  const [selectedAnimeId, setSelectedAnimeId] = useState<number | null>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">AniStaff v2</h1>
      <SeasonSelector onSelect={(s) => setSeason(s)} />
      <p className="mt-4 text-gray-600 mb-6">Selected season: <strong>{season}</strong></p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyAnimeList.map((anime) => (
          <AnimeCard
            key={anime.id}
            {...anime}
            onClick={() => setSelectedAnimeId(anime.id)}
          />
        ))}
      </div>

      {selectedAnimeId && (
        <AnimeDetailPanel animeId={selectedAnimeId} onClose={() => setSelectedAnimeId(null)} />
      )}
    </div>
  );
}

export default App;
