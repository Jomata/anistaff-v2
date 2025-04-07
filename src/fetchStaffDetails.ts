import { fetchGraphQL } from "./fetchGraphQL";
import { AniListStaff } from "./anilistTypes";
import { StaffWork } from "./types";

export async function fetchStaffDetails(id: number): Promise<StaffWork[]> {
  const query = `
    query ($id: Int!) {
      Staff(id: $id) {
        staffMedia(perPage: 30, sort: POPULARITY_DESC) {
          edges {
            staffRole
            node {
              id
              title { romaji }
              startDate { year month day }
            }
          }
        }
      }
    }
  `;

  const { Staff } = await fetchGraphQL<{ Staff: AniListStaff }>(query, { id });

  return Staff.staffMedia.edges.map((edge) => {
    const { year, month, day } = edge.node.startDate;
    const date =
      year && month && day
        ? new Date(year, month - 1, day).toISOString().split("T")[0]
        : undefined;

    return {
      id: edge.node.id,
      title: edge.node.title.romaji,
      role: edge.staffRole,
      date,
    };
  });
}
