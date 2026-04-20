export type EpisodeLinkTarget = {
  id: string;
  title: string;
};

export function toEpisodeSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getEpisodeShareUrl(
  episode: EpisodeLinkTarget,
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL
): string {
  return `${supabaseUrl}/functions/v1/share-episode?id=${encodeURIComponent(episode.id)}`;
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
