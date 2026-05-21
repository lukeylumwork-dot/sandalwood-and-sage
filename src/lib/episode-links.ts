export type EpisodeLinkTarget = {
  id: string;
  title: string;
};

export function toEpisodeSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getEpisodeShareUrl(
  episode: EpisodeLinkTarget,
  baseUrl = (typeof window !== "undefined" ? window.location.origin : "")
): string {
  return `${baseUrl}/episode/${toEpisodeSlug(episode.title)}`;
}

export function findEpisodeFromSearchParams<T extends EpisodeLinkTarget>(
  episodes: T[],
  search: string
): T | undefined {
  const params = new URLSearchParams(search);
  const episodeId = params.get("episode");
  const episodeSlug = params.get("episodeSlug");

  if (!episodeId && !episodeSlug) return undefined;

  return episodes.find((ep) =>
    episodeId ? ep.id === episodeId : toEpisodeSlug(ep.title) === episodeSlug
  );
}
