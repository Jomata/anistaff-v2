import React, { useEffect, useState, useRef } from "react";
import { getAnimeDetails } from "../service/getAnimeDetails";
import { CleanAnime } from "../types";
import StaffBreakdown from "./StaffBreakdown";
import SharedStaffWorks from "./SharedStaffWorks";
import { useAsync, useDebouncedCallback } from "@react-hookz/web";

interface AnimeDetailPanelProps {
  animeId: number;
  partialAnime?: Partial<CleanAnime>;
  onClose: () => void;
}

export default function AnimeDetailPanel({
  animeId,
  partialAnime,
  onClose,
}: AnimeDetailPanelProps) {
  const [state, { execute }] = useAsync(
    async (id: number): Promise<CleanAnime> => {
      return await getAnimeDetails(id);
    }
  );
  const debouncedFetch = useDebouncedCallback(
    (id: number) => {
      execute(id);
    },
    [execute],
    100
  );
  useEffect(() => {
    if (animeId) debouncedFetch(animeId);
  }, [animeId, debouncedFetch]);

  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300); // match transition duration
  };

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClose]);

  const loading = state.status === "loading";
  const error = state.error;
  const anime = state.result ?? partialAnime;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end ${
        visible ? "bg-black/50" : ""
      }`}
    >
      <div
        ref={panelRef}
        className={`w-full max-w-3xl h-full bg-white dark:bg-gray-900 text-black dark:text-white shadow-xl p-6 overflow-y-auto relative transform transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="cursor-pointer absolute top-4 right-4 text-xl text-gray-500 hover:text-black dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          onClick={handleClose}
        >
          ✖
        </button>

        {error && <p className="text-red-500 mt-10">{error.message}</p>}
        {loading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-blue-500"></div>
          </div>
        )}

        {anime && (
          <>
            {anime.bannerImageUrl && (
              <img
                src={anime.bannerImageUrl}
                alt={anime.title}
                className="w-full rounded-lg mb-4"
              />
            )}
            <h2 className="text-2xl font-bold mb-1">{anime.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase">
              {anime.season} {anime.seasonYear}
            </p>
            <p className="mb-4 prose prose-sm dark:prose-invert">
              {anime.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {(anime.genres ?? []).map((g) => (
                <span
                  key={g}
                  className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs px-2 py-1 rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>

            {anime.groupedStaffByCategory && (
              <StaffBreakdown
                groupedStaffByCategory={anime.groupedStaffByCategory}
              />
            )}

            {anime.sharedStaffWorks && (
              <SharedStaffWorks shared={anime.sharedStaffWorks} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
