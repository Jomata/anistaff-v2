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

const CATEGORY_ICONS: Record<StaffCategory, string> = {
  creative: "🎬",
  visual: "🎨",
  audio: "🎵",
  "theme-song": "🎤",
  other: "🔧",
};

export default function StaffBreakdown({ groupedStaffByCategory }: Props) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Staff Breakdown</h3>
      {Object.entries(groupedStaffByCategory).map(
        ([category, members]) =>
          members.length > 0 && (
            <div key={category} className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">
                {CATEGORY_ICONS[category] ?? "→"}{" "}
                {CATEGORY_LABELS[category] ?? category}
              </h4>
              <ul className="space-y-2">
                {members.map((member) => (
                  <li key={member.id}>
                    <a
                      href={member.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {member.name}
                    </a>{" "}
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      ({member.roles.join(", ")})
                    </span>
                    {member.notableWorks.length > 0 && (
                      <div className="border-l-4 border-blue-500 text-sm text-gray-500 dark:text-gray-300 mt-0.5 ml-2">
                        <ul className="ml-2 mt-1 space-y-0.5">
                          {member.notableWorks.map((work) => (
                            <li key={work.title}>
                              {work.title} ({work.roles.join(", ")})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )
      )}
    </div>
  );
}
