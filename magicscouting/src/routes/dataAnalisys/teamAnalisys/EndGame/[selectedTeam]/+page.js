export const prerender = "auto";

export async function load({ params }) {
  let selectedTeam = params.selectedTeam
  return {selectedTeam};
};