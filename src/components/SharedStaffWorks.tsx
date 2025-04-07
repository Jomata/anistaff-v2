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
          <li key={work.id} className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-800">
              {work.title} ({work.sharedStaff.length} people)
            </h4>
            <ul className="ml-2 mt-1 space-y-0.5 text-sm text-gray-600">
              {Object.entries(
                work.sharedStaff.reduce<Record<string, string[]>>((acc, person) => {
                  if (!acc[person.name]) acc[person.name] = [];
                  acc[person.name].push(...person.roles);
                  return acc;
                }, {})
              ).map(([name, roles], i) => (
                <li key={i}>
                  • {name} — {Array.from(new Set(roles)).join(", ")}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
