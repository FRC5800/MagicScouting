
export const prerender = true;

export async function load({ params }) {
  let selectedTeam = params.selectedTeam
  return {selectedTeam};
};