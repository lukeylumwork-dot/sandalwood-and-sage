import { describe, expect, it } from "vitest";
import {
  findEpisodeFromSearchParams,
  getEpisodeShareUrl,
  toEpisodeSlug,
} from "./episode-links";

const episodes = [
  { id: "11111111-1111-4111-8111-111111111111", title: "Should Cities Ban Cars?" },
  { id: "22222222-2222-4222-8222-222222222222", title: "AI, Work & Wages" },
];

describe("episode links", () => {
  it("builds canonical frontend share URLs from episode ids", () => {
    expect(getEpisodeShareUrl(episodes[0], "https://sandalwood-and-sage.com")).toBe(
      "https://sandalwood-and-sage.com/?episode=11111111-1111-4111-8111-111111111111"
    );
  });

  it("normalizes legacy title slugs", () => {
    expect(toEpisodeSlug("AI, Work & Wages")).toBe("ai-work-wages");
  });

  it("finds episodes by stable id first", () => {
    expect(
      findEpisodeFromSearchParams(
        episodes,
        "?episode=22222222-2222-4222-8222-222222222222"
      )
    ).toEqual(episodes[1]);
  });

  it("keeps legacy slug deep links working", () => {
    expect(findEpisodeFromSearchParams(episodes, "?episodeSlug=should-cities-ban-cars")).toEqual(
      episodes[0]
    );
  });
});
