import React from "react";
import { GroupedStaffEntry, StaffCategory } from "../types";

interface Props {
  groupedStaffByCategory: Record<StaffCategory, GroupedStaffEntry[]>;
}

const CATEGORY_LABELS: Record<StaffCategory, string> = {
  creative: "Creative",
  visual: "Visual",
  audio: "Audio",
  "theme-song": "Theme Song / Music",
  other: "Other",
};

export default function StaffBreakdown({ groupedStaffByCategory }: Props) {
  const grouped = groupedStaffByCategory;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Staff Breakdown</h3>
      {Object.entries(grouped).map(([category, members]) => (
        <div key={category} className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            → {CATEGORY_LABELS[category] ?? category}
          </h4>
          <ul className="space-y-2">
            {members.map((member) => (
              <li key={member.id}>
                <a
                  href={member.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {member.name}
                </a>{" "}
                <span className="text-sm text-gray-600">
                  ({member.roles.join(", ")})
                </span>
                {member.notableWorks.length > 0 && (
                  <div className="text-sm text-gray-500 mt-0.5 ml-2">
                    🌟 Notable:{" "}
                    {member.notableWorks
                      .map((work) =>
                        work.roles?.length
                          ? `${work.title} (${work.roles.join(", ")})`
                          : work.title
                      )
                      .join(", ")}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
