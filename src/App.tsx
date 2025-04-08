import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import SeasonSelector from "./components/SeasonSelector";
import AnimeCard from "./components/AnimeCard";
import AnimeDetailPanel from "./components/AnimeDetailPanel";
import {
  fetchSeasonAnime,
  SeasonAnimeCardData,
} from "./service/anilist/fetchSeasonAnime";
import { CleanAnime } from "./types";

function App() {
  const [season, setSeason] = useState<string>("");
  const [animeList, setAnimeList] = useState<SeasonAnimeCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnime, setSelectedAnime] =
    useState<Partial<CleanAnime> | null>(null);

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
      <h1 className="text-3xl font-bold">AniStaff v2</h1>

      <SearchBar
        onSelect={(anime) => {
          setSelectedAnime(anime);
        }}
      />

      <SeasonSelector year={currentYear} onSelect={(s) => setSeason(s)} />

      {loading && <p className="text-gray-500 mt-6">Loading anime list...</p>}
      {error && <p className="text-red-500 mt-6">{error}</p>}

      <div className="grid gap-6 grid-cols-[repeat(auto-fit,_minmax(240px,_1fr))]">
        {animeList.map((anime) => (
          <AnimeCard
            key={anime.id}
            {...anime}
            onClick={() => setSelectedAnime(anime)}
          />
        ))}
      </div>

      {selectedAnime && (
        <AnimeDetailPanel
          animeId={selectedAnime.id!}
          partialAnime={{
            season,
            seasonYear: currentYear,
            ...selectedAnime,
          }}
          onClose={() => setSelectedAnime(null)}
        />
      )}
    </div>
  );
}

export default App;
