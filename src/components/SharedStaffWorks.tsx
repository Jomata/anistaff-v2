import { SharedStaffWork } from "../types";

interface Props {
  shared: SharedStaffWork[];
}

export default function SharedStaffWorks({ shared }: Props) {
  if (!shared.length) return null;

  //We sort by amount of shared staff, then by title
  const sortedSharedStaff = shared.sort((a, b) => {
    if (a.sharedStaff.length !== b.sharedStaff.length) {
      return b.sharedStaff.length - a.sharedStaff.length; // Descending order
    }
    return a.title.localeCompare(b.title); // Ascending order by title
  });

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
                className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5"
                title={`${work.sharedStaff.length} shared staff`}
              >
                {work.sharedStaff.length}
              </span>
            </h4>
            <ul className="ml-2 mt-1 space-y-0.5 text-sm text-gray-600 dark:text-gray-300">
              {work.sharedStaff
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((person) => (
                  <li
                    key={person.id}
                    className="border-l-4 border-blue-500 pl-2"
                  >
                    <a
                      href={person.siteUrl}
                      target="_blank"
                      className="hover:underline"
                    >
                      {person.name}
                    </a>{" "}
                    — {person.roles.join(", ")}
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
