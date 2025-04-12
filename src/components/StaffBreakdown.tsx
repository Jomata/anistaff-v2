import { GroupedStaffEntry, StaffCategory } from "../types";

interface Props {
  groupedStaffByCategory: Record<StaffCategory, GroupedStaffEntry[]>;
  hoveredStaffId: number | null;
  focusedStaffIds: Set<number>;
  onHoverStaff: (id: number | null) => void;
  onToggleFocus: (id: number) => void;
}

const CATEGORY_LABELS: Record<StaffCategory, string> = {
  creative: "Creative",
  visual: "Visual",
  audio: "Audio",
  "theme-song": "Theme Song / Music",
  other: "Other",
};

const CATEGORY_ICONS: Record<StaffCategory, string> = {
  creative: "✍️",
  visual: "🎨",
  audio: "🎵",
  "theme-song": "🎤",
  other: "🔧",
};

export default function StaffBreakdown({
  groupedStaffByCategory,
  hoveredStaffId,
  focusedStaffIds,
  onHoverStaff,
  onToggleFocus,
}: Props) {
  /**
   * When I'm actively hovering over a staff member, I want to highlight the entire row using bg-blue-100 dark:bg-blue-900
   * When a staff member is focused or hovered in another way, I want to highlight the border using bg-yellow-100 dark:bg-yellow-800/20
   * When either of those is true, I want to highlight the border using border-yellow-500
   */
  const hoveredClass = "hover:bg-blue-100 dark:hover:bg-blue-900";
  const highlightedBorderClass = "border-yellow-500";
  const highlightedClass = `${highlightedBorderClass} bg-yellow-100 dark:bg-yellow-800/20`;
  const defaultBorderClass = "border-blue-500";
  const defaultClass = `${defaultBorderClass}`;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Staff Breakdown</h3>
      {Object.entries(groupedStaffByCategory).map(
        ([category, members]) =>
          members.length > 0 && (
            <div key={category} className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">
                {CATEGORY_ICONS[category as StaffCategory] ?? "→"}{" "}
                {CATEGORY_LABELS[category as StaffCategory] ?? category}
              </h4>
              <ul className="space-y-2">
                {members
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((member) => {
                    const isHovered = hoveredStaffId === member.id;
                    const isFocused = focusedStaffIds.has(member.id);
                    const isHighlighted = isHovered || isFocused;
                    return (
                      <li
                        key={member.id}
                        onMouseEnter={() => onHoverStaff(member.id)}
                        onMouseLeave={() => onHoverStaff(null)}
                        onClick={() => onToggleFocus(member.id)}
                        className={`p-1 rounded ${hoveredClass} ${
                          isHighlighted ? highlightedClass : defaultClass
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
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
                          </div>
                          <button className="text-lg" title="Toggle focus">
                            {focusedStaffIds.has(member.id) ? "★" : "☆"}
                          </button>
                        </div>

                        {member.notableWorks.length > 0 && (
                          <ul className="ml-4 mt-1 space-y-0.5 text-sm text-gray-600 dark:text-gray-300">
                            {member.notableWorks
                              .sort((a, b) => a.title.localeCompare(b.title))
                              .map((work) => (
                                <li
                                  key={work.title}
                                  className={`border-l-4 pl-2 ${
                                    isHighlighted
                                      ? highlightedBorderClass
                                      : defaultBorderClass
                                  }`}
                                >
                                  <a
                                    href={work.siteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    {work.title}
                                  </a>{" "}
                                  ({work.roles.sort().join(", ")})
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>
          )
      )}
    </div>
  );
}
