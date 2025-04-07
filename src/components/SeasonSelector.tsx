import React, { useState, useEffect } from "react";

const seasons = ["Winter", "Spring", "Summer", "Fall"] as const;
type Season = (typeof seasons)[number];

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
          className={`px-4 py-2 rounded-lg border ${
            selected === season
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => setSelected(season)}
        >
          {season} {year}
        </button>
      ))}
    </div>
  );
}
