import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import SeasonSelector from "./components/SeasonSelector";
import AnimeCard from "./components/AnimeCard";
import AnimeDetailPanel from "./components/AnimeDetailPanel";
import { fetchSeasonAnime } from "./service/anilist/fetchSeasonAnime";
import { BasicAnimeCardData } from "./types";

function App() {
  const [season, setSeason] = useState<string>("");
  const [animeList, setAnimeList] = useState<BasicAnimeCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<BasicAnimeCardData | null>(
    null
  );

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
      {/* Header: logo + search + season selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 relative z-40">
        {/* Left side: Logo + Search */}
        <div className="flex items-center gap-4 flex-1">
          <h1
            className="text-3xl font-bold whitespace-nowrap"
            title="AniStaff v2"
          >
            <img className="w-16 h-16" src="./AniStaffLogo.png" />
          </h1>
          <div className="flex-1">
            <SearchBar
              onSelect={(anime) => {
                setSelectedAnime(anime);
              }}
            />
          </div>
        </div>
        {/* Right side: Season Selector */}
        <div className="shrink-0">
          <SeasonSelector year={currentYear} onSelect={(s) => setSeason(s)} />
        </div>
      </div>

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
