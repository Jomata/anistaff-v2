import React, { useEffect, useState, useRef } from "react";
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (cancelled) return;

      setLoading(true);
      getAnimeDetails(animeId)
        .then((result) => {
          if (!cancelled) {
            setData(result);
            setError(null);
          }
        })
        .catch((err) => {
          if (!cancelled) {
            console.error(err);
            setError("Failed to fetch anime details.");
            setData(null);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setLoading(false);
          }
        });
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [animeId]);

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end  ${
        visible ? "bg-black/50" : ""
      }`}
    >
      <div
        ref={panelRef}
        className={`w-full max-w-3xl h-full bg-white shadow-xl p-6 overflow-y-auto relative transform transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 text-xl text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-100 transition bg-white border border-black-300"
          onClick={handleClose}
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
              src={data.bannerImageUrl || data.coverImageUrlXL}
              alt={data.title}
              className="w-full rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-1">{data.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              {data.season} {data.seasonYear}
            </p>
            Display the description with HTML included
            <p
              className="text-gray-700 mb-4"
              dangerouslySetInnerHTML={{ __html: data.description }}
            ></p>
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
