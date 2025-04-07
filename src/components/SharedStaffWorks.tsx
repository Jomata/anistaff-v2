import React from "react";
import { SharedStaffWork } from "../types";

interface Props {
  shared: SharedStaffWork[];
}

export default function SharedStaffWorks({ shared }: Props) {
  if (!shared.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">🤝 Shared Staff Works</h3>
      <ul className="space-y-4">
        {shared.map((work) => (
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
              ({work.sharedStaff.length} people)
            </h4>
            <ul className="ml-2 mt-1 space-y-0.5 text-sm text-gray-600 dark:text-gray-300 border-l-4 border-blue-500 pl-2">
              {work.sharedStaff.map((person) => (
                <li key={person.id}>
                  {person.name} — {person.roles.join(", ")}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
