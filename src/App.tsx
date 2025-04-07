import { useState, useEffect } from "react";
import SeasonSelector from "./components/SeasonSelector";
import AnimeCard from "./components/AnimeCard";
import AnimeDetailPanel from "./components/AnimeDetailPanel";
import {
  fetchSeasonAnime,
  SeasonAnimeCardData,
} from "./service/anilist/fetchSeasonAnime";

function App() {
  const [season, setSeason] = useState<string>("");
  const [selectedAnimeId, setSelectedAnimeId] = useState<number | null>(null);
  const [animeList, setAnimeList] = useState<SeasonAnimeCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!season) return;

    setLoading(true);
    fetchSeasonAnime(season, currentYear)
      .then((data) => {
        setAnimeList(data);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to load seasonal anime.");
        setAnimeList([]);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [season]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">AniStaff v2</h1>

      <SeasonSelector year={currentYear} onSelect={(s) => setSeason(s)} />
      {/* <p className="mt-4 text-gray-600 mb-6">
        Selected season: <strong>{season}</strong> {currentYear}
      </p> */}

      {loading && <p className="text-gray-500 mt-6">Loading anime list...</p>}
      {error && <p className="text-red-500 mt-6">{error}</p>}

      <div className="grid gap-6 grid-cols-[repeat(auto-fit,_minmax(240px,_1fr))]">
        {animeList.map((anime) => (
          <AnimeCard
            key={anime.id}
            {...anime}
            onClick={() => setSelectedAnimeId(anime.id)}
          />
        ))}
      </div>

      {selectedAnimeId && (
        <AnimeDetailPanel
          animeId={selectedAnimeId}
          onClose={() => setSelectedAnimeId(null)}
        />
      )}
    </div>
  );
}

export default App;
