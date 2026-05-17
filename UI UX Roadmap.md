# UI UX Roadmap

**Status:** Strategic planning document
**Last updated:** April 2026

---

## Overview

This document outlines the UX direction, design principles, and interface improvements for Sandalwood & Sage. It is written for Gareth, Lawrence, and future developers as a practical guide to where the interface should evolve — and why.

The current interface is clean and functional. The goal of this roadmap is to push it from functional to distinctive: an experience that feels as considered as the content itself.

---

## UX Direction — Spotify × TED × Editorial

The target aesthetic for Sandalwood & Sage sits at the intersection of three reference points:

- **Spotify** — information-dense, dark-first, fluid audio controls, category pills, persistent player
- **TED** — intellectual confidence, strong typography, editorial credibility, content that respects the listener's intelligence
- **Editorial / Long-read** — clean prose layout, generous whitespace, serif headings, the feeling of a well-produced publication

This is not a news site or a general podcast aggregator. It is a branded opinion platform with two distinct characters. Every interface decision should reinforce that identity.

**Design principles:**

- Dark-first, but light mode should feel equally premium
- Typography does the heavy lifting — layout is generous, not cluttered
- Content is always the hero — UI chrome recedes
- Motion is purposeful, not decorative
- Mobile is the primary context for consumption; desktop is for discovery and browsing

---

## Navigation Model

### Current State

The current navigation is anchor-based, scrolling to sections on a single page: Latest, Episodes, How it Works. There is no persistent player, no page-level routing beyond `/admin`, and no episode-specific URLs (only query-param deep links).

The header is sticky with a theme toggle, RSS link, and Subscribe button. On mobile, it collapses to a hamburger menu.

### Target State

Navigation should evolve toward a hybrid model:

- **Primary nav** remains simple: Latest · Episodes · About · Subscribe
- **Episode routes** become real pages (`/episodes/:id`) for SEO, sharing, and richer layout
- **Persistent player** anchors the bottom of the screen, allowing navigation without losing audio
- **Clips feed** becomes a distinct destination, accessible from the nav or homepage
- Mobile nav should be a bottom sheet or bottom tab bar rather than a hamburger overlay, prioritising thumb reach

The single-page architecture can be maintained for the homepage scroll, but individual episode content should move to dedicated routes.

---

## Homepage Evolution

### Current State

The homepage is a vertical scroll: Hero → Featured Episode → Episode Archive → How It Works → Topic Submission → Subscribe → Footer.

The Featured Episode card is prominent and visually strong when a cover image is present. The episode archive is a clean list of cards. The How It Works section is static and text-heavy.

### Recommended Changes

**Hero refinement**

- The hero tagline ("What we're arguing about this week") is strong — keep it
- Reduce vertical padding on mobile; the hero currently takes too much screen real estate before reaching content
- Consider adding a subtle visual treatment — a soft gradient, a muted character illustration, or an abstract waveform graphic — to anchor the brand identity above the fold

**Featured Episode**

- The Featured card works well with a cover image. Without one, it feels bare.
- Add a fallback visual treatment (gradient or branded placeholder) for episodes without cover images
- Surface a short audio clip preview (15–30 seconds) directly on the card without requiring the modal to open
- Label the featured badge more clearly — "This week's debate" or similar

**Homepage sections**

- Move "How it Works" below the fold or into a dedicated About page; most returning visitors do not need it
- Add a "Recent Clips" row on the homepage once clips are available — short highlights are the most shareable unit of content
- Consider a "Suggested Topics" or "What should we debate?" CTA above the submission form

---

## Episode Experience — Modal to Full Page

### Current State

All episode content is surfaced inside a Dialog (modal) overlay. The modal is functional and responsive, but has several limitations:

- No shareable URL (only query-param deep links)
- No scroll persistence — the page scrolls behind the modal on some browsers
- Limited layout flexibility — content is constrained to a narrow column
- No ability to navigate to next/previous episodes from within the modal

### Recommended Direction

Introduce dedicated episode pages at `/episodes/:id` alongside (or replacing) the modal.

**Full episode page layout:**

- Large header with episode title in serif display font, category pill, and share actions
- Cover image as a full-bleed or contained hero image
- Sides Split panel (Side A vs Side B) displayed as a visually strong two-column layout on desktop
- Embedded video player (if present), full-width or constrained
- Audio player with waveform visualisation and chapter markers (if present)
- The debate question as a typographically prominent pull-quote
- Summary and key points in a clean editorial layout
- Transcript section (when available)
- Related episodes at the base of the page

**Transition strategy:**

- The existing modal can remain for the archive list view (quick preview on hover/tap)
- Full episode pages become the canonical destination for share links and SEO
- The `share-episode` Edge Function redirects should point to `/episodes/:id` rather than the query-param URL once full pages are live

---

## Card Design Improvements

### Current State

Episode cards in the archive are clean, bordered, and functional. They show: category label, title, premise excerpt, and a video badge if a video URL is present. They respond well on mobile and desktop.

### Recommended Changes

- **Cover image thumbnail** — add a small square or 16:9 thumbnail on the right side of each card when a `cover_image_url` is present, consistent with Spotify/podcast app patterns
- **Duration** — the duration field exists in the data model but is consistently empty. Populate it (even approximately) and display it prominently. Duration is a key deciding factor for listeners.
- **Audio/video indicator** — the current video badge is small. Make media type clearer: a distinct audio or video icon with a pill label
- **Hover state** — the current hover adds a subtle border and shadow. Consider also shifting the title to the primary colour with a slight translate on the arrow/chevron to signal interactivity more clearly
- **Clip count** — once clips are available, show a "3 clips" indicator on cards that have clips attached
- **Trending or recent badges** — optionally surface a "New" or "This week" badge on recently published episodes

---

## Clips UX — Mobile-First Feed

When clips are introduced, they should have their own dedicated UX pattern distinct from full episodes.

### Recommended Clips UX

- **Vertical scroll feed** — a TikTok/Reels-style vertical scroll for clips on mobile, or a horizontal carousel on desktop
- **Clip cards** — compact, square or portrait-ratio cards showing: clip title, parent episode title, a short description, and share action
- **Autoplay on scroll** — clips should begin playing (muted by default) as they enter the viewport, in line with platform conventions
- **Single tap to unmute** — unmuting should be a single tap, not buried in a control bar
- **Clip-level share** — each clip gets its own share URL with episode-specific open graph metadata (clip title, parent episode, a still frame)
- **Link to full episode** — every clip card should surface a clear "Hear the full debate" link

Clips should be surfaced on the homepage as a row, accessible from the nav, and discoverable through episode pages.

---

## Filtering UX — Spotify-Style Pills

### Current State

The episode archive has a filter pill row (All, Current Affairs, Society, Politics, Sport) and a text search input. The pills work well and are the right interaction pattern. The search input is positioned above the pills.

### Recommended Changes

- **Pin the filter row** — consider making the filter pills sticky when scrolling through a long episode list, so they remain accessible without scrolling back to the top
- **Swap search and filter order** — move search above filters; search is the primary interaction for users who know what they want
- **Expand filter dimensions** — once more content is available, add additional pill rows or a secondary filter drawer for: Tone (Serious / Playful), Format (Audio only / Video), Duration (Under 10 min / 10–20 min)
- **Active state clarity** — the current active pill (primary background) is clear. Ensure the active state remains visible at all times, even when the row is scrolled horizontally on mobile
- **Filter count badge** — when a filter is active, show a count of matching episodes ("12 episodes") below or within the filter row

---

## Tone and Mood Layer

Sandalwood & Sage debates vary in emotional register — some are intellectually serious (politics, societal issues), some are lighter (sport, culture). The UI should eventually reflect this.

### Recommended Approach

- Add a `tone` field to episodes: `serious`, `balanced`, `light`
- Surface tone as a subtle visual cue on cards — a colour accent on the category pill, a background tint, or a typographic weight variation
- Use tone as a filter dimension (see Filtering UX above)
- On episode pages, the tone can influence the colour palette of the Sides Split panel — cooler tones for political debates, warmer tones for culture/sport

This should not be heavy-handed. The tone layer should be a background signal, not a dominant visual element.

---

## Audio Experience — Sticky Player and Continuity

### Current State

Audio playback is embedded within the episode modal. Closing the modal or scrolling away stops playback. There is no persistence across navigation.

### Recommended Direction

**Sticky player bar**

Introduce a persistent audio player bar docked to the bottom of the screen (above any mobile nav bar if one is introduced). This is the most impactful single UX improvement for an audio platform.

The player bar should include:

- Episode cover image thumbnail (small)
- Episode title (truncated)
- Play/pause button
- Scrubber bar with current time and total duration
- Volume control (desktop) / mute toggle (mobile)
- Close/dismiss button

**Continuity model:**

- Opening an episode modal or page auto-loads the audio into the persistent player
- Closing the modal does not stop playback
- Navigating between pages does not stop playback
- The player persists in the DOM and is not re-mounted on navigation

**Waveform visualisation:**

- Within the episode modal or full page, replace the basic `<audio>` element with a waveform rendered using WaveSurfer.js or a comparable lightweight library
- The waveform should reflect real audio data from the episode file
- Colour the waveform using the brand primary colour, with a lighter fill for the played portion

---

## Sandalwood and Sage Character Layer

The two characters — Sandalwood and Sage — are currently referenced in prose (the Hero section) but are not visually present in the interface.

### Recommended Direction

- Develop simple visual identities for Sandalwood and Sage: not photorealistic, but stylised — illustration, icon, or typographic mark
- Use these identities to anchor the Sides Split panel: Side A attributed to Sandalwood, Side B attributed to Sage (or vice versa depending on episode)
- Surface the characters on the hero and on episode cards as a subtle brand signal
- Consider short "host intro" text displayed at the top of each episode, attributed to whichever character leads that episode — this field (`host_intro`) already exists in the database

The character layer should make Sandalwood & Sage feel like a show with presenters, not just a content feed.

---

## Visual Design Direction

### Typography

The current stack (DM Sans for UI, DM Serif Display for display headings) is the right foundation. It is clean, legible, and has editorial character.

Recommendations:

- Increase the weight contrast between headings and body text more aggressively — the episode titles in modals could go heavier or larger
- Use DM Serif Display more consistently for episode titles across the archive, not just in the modal
- Introduce a third typographic level: a mono or small-caps label style for timestamps, categories, and section labels (this is partially present — extend it more consistently)

### Colour

- The dark-first theme is strong. Ensure the light theme uses a warm off-white (not pure white) as the background to maintain a print/editorial feel
- Primary colour (currently brand green/sage) is used for category labels and interactive elements. Keep this restrained — it should signal action, not decoration
- Introduce a secondary accent (a warm sand or amber) for Sandalwood-attributed elements, contrasted with the sage/green for Sage-attributed elements

### Spacing and Layout

- The current max-width of `max-w-4xl` (896px) is appropriate for content pages. On the homepage, consider a slightly wider container for the featured episode hero
- Increase section spacing on desktop — the current `py-7 sm:py-10` is comfortable but could breathe more at larger viewports
- The episode modal inner padding is good on desktop (`px-7 py-6`) — ensure it does not feel cramped on small mobile screens (`px-4 py-5`)

### Motion

- The current Framer Motion scroll animations (fade-up on enter) are well-calibrated. Keep them.
- Add a subtle transition when switching between filter categories — a fade or slight slide on the card grid
- The episode modal open/close animation could be enhanced with a shared element transition (card expanding into modal) once full episode pages are introduced

---

## Branding and Logo Recommendations

### Current State

The platform has separate light and dark SVG logos, displayed appropriately via CSS. The logo appears in the sticky header.

### Recommendations

- **Favicon and PWA icons** — ensure the favicon and app icons are high-quality at all sizes (16px, 32px, 180px for Apple Touch). A monogram or simplified mark works best at small sizes.
- **Open graph image** — create a default OG image for the homepage (and episode-specific OG images for episode share URLs). The current share flow uses episode metadata but a visually strong card image significantly improves social sharing click-through.
- **Character marks** — develop simple marks for Sandalwood and Sage (see Character Layer above). These do not need to be full illustrations; a geometric or typographic treatment is sufficient.
- **Brand consistency** — ensure all platform presence (RSS feed title, podcast directory listings, social profiles) uses consistent naming: "Sandalwood & Sage" (with ampersand, not "and").

---

## Implementation Priority

| Area | Priority | Complexity |
|------|----------|------------|
| Sticky persistent audio player | High | Medium |
| Full episode pages (`/episodes/:id`) | High | Medium |
| Cover image thumbnails on episode cards | Medium | Low |
| Waveform visualisation | Medium | Medium |
| Clips feed and clip UX | Medium | High |
| Character layer (Sides Split attribution) | Medium | Low |
| Homepage hero refinement | Low | Low |
| Tone / mood layer | Low | Medium |
| Expanded filtering (tone, format, duration) | Low | Low |
| Bottom tab bar (mobile nav) | Low | Medium |

The highest-leverage changes are the persistent player and full episode pages. Both are achievable without a visual redesign and will materially improve the listening and sharing experience. Character layer improvements in the Sides Split panel are low effort and high identity value.
