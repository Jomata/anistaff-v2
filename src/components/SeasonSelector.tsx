import { Season } from "@/types";
import React, { useState, useEffect } from "react";

const seasons = ["Winter", "Spring", "Summer", "Fall"] as const;

function getUpcomingSeason(): Season {
  const month = new Date().getMonth(); // 0-based
  if (month <= 1) return "Spring";
  if (month <= 4) return "Summer";
  if (month <= 7) return "Fall";
  if (month <= 10) return "Winter";
  return "Spring"; // fallback
}

export default function SeasonSelector({
  year,
  onSelect,
}: {
  year: number;
  onSelect: (season: Season) => void;
}) {
  const [selected, setSelected] = useState<Season>(getUpcomingSeason());

  useEffect(() => {
    onSelect(selected);
  }, [selected, onSelect]);

  return (
    <div className="flex gap-4 p-4">
      {seasons.map((season) => (
        <button
          key={season}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            selected === season
              ? "bg-blue-600 text-white border-blue-700"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          }`}
          onClick={() => setSelected(season)}
        >
          {season} {year}
        </button>
      ))}
    </div>
  );
}
