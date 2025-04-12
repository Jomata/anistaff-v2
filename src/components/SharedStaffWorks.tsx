import { SharedStaffWork } from "../types";

interface Props {
  shared: SharedStaffWork[];
  hoveredStaffId: number | null;
  focusedStaffIds: Set<number>;
  onHoverStaff: (id: number | null) => void;
  onToggleFocus: (id: number) => void;
}

export default function SharedStaffWorks({
  shared,
  hoveredStaffId,
  focusedStaffIds,
  onHoverStaff,
  onToggleFocus,
}: Props) {
  if (!shared.length) return null;

  //We sort by amount of shared staff, then by title
  const sortedSharedStaff = shared.sort((a, b) => {
    if (a.sharedStaff.length !== b.sharedStaff.length) {
      return b.sharedStaff.length - a.sharedStaff.length; // Descending order
    }
    return a.title.localeCompare(b.title); // Ascending order by title
  });

  /**
   * When I'm actively hovering over a staff member, I want to highlight the entire row using bg-blue-100 dark:bg-blue-900
   * When a staff member is focused or hovered in another way, I want to highlight the border using bg-yellow-100 dark:bg-yellow-800/20
   * When either of those is true, I want to highlight the border using border-yellow-500
   */
  const hoveredClass = "hover:bg-blue-100 dark:hover:bg-blue-900";
  const highlightedClass =
    "border-yellow-500 bg-yellow-100 dark:bg-yellow-800/20";
  const defaultClass = "border-blue-500";

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">🤝 Shared Staff Works</h3>
      <ul className="space-y-4">
        {sortedSharedStaff.map((work) => (
          <li key={work.id}>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              <a
                href={work.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                {work.title}
              </a>{" "}
              <span
                className="text-xs bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-full px-2 py-0.5"
                title={`${work.sharedStaff.length} shared staff`}
              >
                {work.sharedStaff.length}
              </span>
            </h4>
            <ul className="ml-2 mt-1 space-y-0.5 text-sm text-gray-600 dark:text-gray-300">
              {work.sharedStaff
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((person) => {
                  const isHovered = hoveredStaffId === person.id;
                  const isFocused = focusedStaffIds.has(person.id);
                  const isHighlighted = isHovered || isFocused;
                  return (
                    <li
                      key={person.id}
                      onMouseEnter={() => onHoverStaff(person.id)}
                      onMouseLeave={() => onHoverStaff(null)}
                      onClick={() => onToggleFocus(person.id)}
                      className={`border-l-4 pl-2 rounded-r ${hoveredClass} ${
                        isHighlighted ? highlightedClass : defaultClass
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="inline-flex items-center gap-1">
                            <a
                              href={person.siteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline text-blue-600 dark:text-blue-400"
                            >
                              {person.name}
                            </a>
                          </span>{" "}
                          — {person.roles.join(", ")}
                        </div>
                        <button className="text-lg pr-1" title="Toggle focus">
                          {focusedStaffIds.has(person.id) ? "★" : "☆"}
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
