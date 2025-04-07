import React, { useEffect, useState } from "react";
import { getAnimeDetails } from "../getAnimeDetails";
import { CleanAnime } from "../types";
import StaffBreakdown from "./StaffBreakdown";
import SharedStaffWorks from "./SharedStaffWorks";

interface AnimeDetailPanelProps {
  animeId: number;
  onClose: () => void;
}

export default function AnimeDetailPanel({
  animeId,
  onClose,
}: AnimeDetailPanelProps) {
  const [data, setData] = useState<CleanAnime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAnimeDetails(animeId)
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to fetch anime details.");
        setData(null);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [animeId]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <div className="w-full max-w-lg h-full bg-white shadow-xl p-6 overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        {loading && (
          <p className="text-gray-600 mt-10">Loading anime data...</p>
        )}
        {error && <p className="text-red-500 mt-10">{error}</p>}

        {data && (
          <>
            <img
              src={data.coverImageUrl}
              alt={data.title}
              className="w-full rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-1">{data.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              {data.season} {data.seasonYear}
            </p>
            <p className="text-gray-700 mb-4">{data.description}</p>

            <div className="flex flex-wrap gap-2">
              {data.genres.map((g) => (
                <span
                  key={g}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>

            <StaffBreakdown
              groupedStaffByCategory={data.groupedStaffByCategory}
            />
            <SharedStaffWorks shared={data.sharedStaffWorks} />
          </>
        )}
      </div>
    </div>
  );
}
