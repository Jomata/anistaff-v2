import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import SeasonSelector from "./components/SeasonSelector";
import AnimeCard from "./components/AnimeCard";
import AnimeDetailPanel from "./components/AnimeDetailPanel";
import { fetchSeasonAnime } from "./service/anilist/fetchSeasonAnime";
import { BasicAnimeCardData } from "./types";
import { useHash } from "./components/hooks/useHash";
import { useAsync } from "@react-hookz/web";

function App() {
  const [season, setSeason] = useState<string>("");
  const [state, { execute }, meta] = useAsync(
    async (season: string, year: number) =>
      await fetchSeasonAnime(season, year),
    []
  );
  const [selectedAnime, setSelectedAnime] = useState<
    (Pick<BasicAnimeCardData, "id"> & Partial<BasicAnimeCardData>) | null
  >(null);

  const [animeIdFromHash, setHashAnimeId, clearHashAnimeId] = useHash("anime");
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (season) {
      execute(season, currentYear);
    }
  }, [season, execute]);
  const loading = state.status === "loading";
  const animeList = state.status === "success" ? state.result ?? [] : [];
  const error = state.error;

  // When animeId changes via URL hash, open the details panel
  useEffect(() => {
    if (animeIdFromHash && animeIdFromHash !== selectedAnime?.id.toString()) {
      setSelectedAnime({ id: parseInt(animeIdFromHash) });
    }
  }, [animeIdFromHash, selectedAnime]);

  const handleAnimeSelect = (anime: BasicAnimeCardData) => {
    setSelectedAnime(anime);
    setHashAnimeId(anime.id.toString());
  };

  const handleAnimeClose = () => {
    setSelectedAnime(null);
    clearHashAnimeId();
  };

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
                handleAnimeSelect(anime);
              }}
            />
          </div>
        </div>
        {/* Right side: Season Selector */}
        <div className="shrink-0">
          <SeasonSelector year={currentYear} onSelect={(s) => setSeason(s)} />
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-blue-500"></div>
        </div>
      )}

      {error && <p className="text-red-500 mt-6">{error}</p>}

      <div className="grid gap-6 grid-cols-[repeat(auto-fit,_minmax(240px,_1fr))]">
        {animeList.map((anime) => (
          <AnimeCard
            key={anime.id}
            {...anime}
            onClick={() => {
              handleAnimeSelect({
                ...anime,
                season,
                seasonYear: currentYear,
              });
            }}
          />
        ))}
      </div>

      {selectedAnime && (
        <AnimeDetailPanel
          animeId={selectedAnime.id}
          partialAnime={selectedAnime}
          onClose={() => handleAnimeClose()}
        />
      )}
    </div>
  );
}

export default App;
