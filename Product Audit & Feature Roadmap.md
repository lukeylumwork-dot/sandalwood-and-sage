# Product Audit & Feature Roadmap

**Status:** Strategic planning document
**Last updated:** April 2026

---

## Overview

Sandalwood & Sage is a short-form debate podcast platform built on Vite, React, and Supabase. It publishes AI-assisted debate episodes — voiced and structured by the characters Sandalwood and Sage — and lets a single editor manage all content through a protected admin interface. The platform is currently live and functional, deployed via Vercel with Supabase as the backend.

This document audits what the platform does today, identifies known gaps and structural constraints, and proposes a phased roadmap for future development.

---

## Current Functionality

### Core User Experience

The public-facing app is a single-page React application. Visitors land on a scrolling homepage structured as follows:

- **Hero** — brand identity, tagline, brief description of Sandalwood & Sage
- **Featured Episode** — the most recently pinned (or most recent) episode, presented as a clickable card with cover image, summary, and a modal for full episode content
- **Episode Archive** — a filterable, searchable list of all published episodes
- **How It Works** — static explainer section describing the debate format
- **Topic Submission** — a form allowing visitors to suggest debate topics
- **Subscribe** — email sign-up form and links to podcast platforms (currently placeholder, except RSS)
- **Footer** — standard site footer

Episode content is surfaced through modal dialogs that overlay the page. Each episode modal includes:

- Episode title and category label
- Embedded video player (if a video URL is present)
- Sides Split panel showing Side A and Side B labels and summaries
- Embedded audio player (if an audio URL is present)
- The debate question
- Summary text
- Key points list
- Share actions (copy link, Twitter/X, native share API)

Navigation is anchor-based, scrolling to sections within the single page. The header is sticky and includes a theme toggle (light/dark), an RSS link, and a Subscribe button.

Deep links work via URL query params (`?episode=<id>#episodes`), allowing share URLs to open a specific episode directly.

### Admin System

The admin interface lives at `/admin` and is protected by a shared password verified through a Supabase Edge Function (`verify-admin`). There is no per-user authentication — a single password grants access.

Admin capabilities include:

- **Create episodes** — full form covering title, category, question, summary, host intro, for/against arguments, Side A and Side B labels and summaries, and direct URL inputs for video, audio, and cover image
- **Upload media** — file pickers for audio, video, and cover image, routed through a service-role Edge Function (`admin-upload`) that writes to Supabase Storage
- **Edit episodes** — load any episode into the form and update any field
- **Feature/unfeature episodes** — toggle the `is_featured` flag to pin an episode to the homepage Featured slot
- **Delete episodes** — permanently remove an episode; no soft-delete or draft state exists

Episode categories are a fixed list: Current Affairs, Society, Politics, Sport.

### Backend and Infrastructure

- **Database:** Supabase Postgres. Core table is `generated_debates`. Secondary tables: `submitted_topics`, `email_subscriptions`.
- **Storage:** Supabase Storage bucket (`episode-media`). Public read, write locked to the service-role Edge Function.
- **Edge Functions:** `verify-admin`, `admin-write`, `admin-upload`, `rss-feed`, `share-episode`. All deployed to Supabase.
- **RLS:** Row-Level Security is active. Public visitors can read episodes and insert topic submissions. All episode writes go through Edge Functions using the service role key, never exposed to the browser.
- **RSS Feed:** Public Edge Function emitting a valid podcast RSS feed. Enclosure file sizes are approximated via HEAD requests, with a fallback of 0.
- **Share URLs:** Stable per-episode share URLs (`/functions/v1/share-episode?id=<uuid>`) redirect into the React app with the episode pre-opened.
- **Deployment:** Frontend on Vercel, all routes rewritten to the Vite entry point to support React Router on refresh.

### Supporting Features

- **Email subscriptions** — visitors can sign up to a mailing list. Emails are stored in `email_subscriptions` with a unique constraint preventing duplicates.
- **Topic submissions** — visitors can suggest debate topics via the public form. Submissions are RLS-validated for basic shape but have no CAPTCHA or rate limiting.
- **Dark/light theme** — system-aware theme toggle using `ThemeProvider` and Tailwind.
- **Framer Motion animations** — sections animate in on scroll.
- **Social sharing** — Twitter/X intent links, native Web Share API, clipboard copy.
- **SEO/OG metadata** — share URLs serve episode-specific open graph metadata.

---

## Known Gaps

### Structural Limitations

- **No draft/published state.** Publishing an episode makes it immediately public. There is no staging, scheduling, or review workflow. Deleting is the only way to remove an episode, and it is permanent.
- **Single shared admin password.** There is no per-user authentication, no role separation, and no audit trail for who made which change.
- **No episode file size storage.** RSS enclosure lengths are fetched live via HEAD request at feed generation time. This is unreliable and adds latency. File sizes should be stored at upload time.
- **No clips or short-form content.** The platform only surfaces full episodes. There is no support for short highlight clips, excerpt cards, or clip-based social sharing.
- **No transcripts.** Episode content is structured text (summary, arguments, key points) but there is no searchable transcript or closed captioning.
- **No waveform visualisation.** The audio player plays back audio without any visual waveform, progress visualisation, or chapter markers.
- **No sticky/persistent audio player.** If a visitor navigates (scrolls) away from an open modal, the audio stops. There is no site-wide persistent player.

### Platform Gaps

- **No Spotify, Apple Podcasts, or YouTube distribution.** These platform links are present in the Subscribe section but are marked "coming soon" and are not yet live.
- **No listener analytics.** There is no tracking of play counts, listen duration, or listener geography.
- **No notification system.** Email subscribers are collected but no mechanism exists to send them episode notifications.
- **No comment or reaction layer.** Listeners have no way to respond to or engage with episode content beyond topic submission.

### Data and Feature Gaps

- **Category list is hardcoded.** Adding or removing categories requires a code change and redeployment.
- **No episode versioning.** Editing an episode overwrites it entirely. There is no change history.
- **No search beyond the archive.** Full-text search is available in the episode list but is client-side and searches only loaded episode data. There is no server-side search.
- **No related episodes.** There is no recommendation or "more like this" logic.
- **No series or season grouping.** Episodes exist as a flat list with no hierarchical structure.

### Technical Gaps

- **Minimal test coverage.** The test suite has lightweight coverage. Key flows (episode mapping, share links, RSS generation, admin writes) are not reliably tested.
- **Broad shadcn/ui surface area.** The component library includes many unused components, adding unnecessary bundle weight.
- **No error boundaries.** Client-side errors in episode rendering or data fetching are not caught gracefully.
- **No monitoring or alerting.** There is no visibility into Edge Function failures, database errors, or media upload issues.

---

## Strategic Opportunity

Sandalwood & Sage has a clear editorial identity, a working publishing workflow, and a solid technical foundation. The next phase of development should focus on three areas:

1. **Depth** — richer episode experience (sticky player, transcripts, clips, waveform)
2. **Distribution** — Spotify, Apple Podcasts, and YouTube integration; email dispatch
3. **Trust** — proper admin authentication, draft workflow, publishing controls

---

## Recommended Future Functionality

### Publishing and Admin

- **Draft/published toggle** — allow episodes to be saved without going live; add a scheduled publish date
- **Per-user admin authentication** — replace the shared password with Supabase Auth; support multiple editors with role-based access
- **Soft delete / archive** — move deleted episodes to an archived state rather than permanent deletion
- **Episode versioning** — store a change log or version snapshots for each episode
- **Editable category list** — allow categories to be managed from the admin UI without code changes
- **File size stored at upload** — capture and persist file sizes at upload time to fix RSS enclosure lengths

### Episode Experience

- **Sticky/persistent audio player** — a site-wide audio bar that persists across navigation, maintaining playback continuity
- **Waveform visualisation** — visual audio waveform using a library such as WaveSurfer.js
- **Full episode page** — dedicated `/episodes/:id` routes replacing or supplementing the modal, enabling better SEO, deep linking, and scrollable content
- **Transcripts** — structured transcript storage, display, and searchability
- **Chapter markers** — timestamped sections within an episode audio file
- **Related episodes** — surface 2–3 related episodes at the end of each episode view, based on category or keyword matching

### Clips and Short-Form

- **Clip support** — store and display short highlight clips (15–60 seconds) extracted from full episodes
- **Clips feed** — a dedicated clips view or section, optimised for mobile scrolling
- **Clip sharing** — individual share cards per clip with open graph metadata

### Discovery and Filtering

- **Expanded filtering** — filter by tone, format, season, or featured status, in addition to category
- **Server-side search** — full-text Postgres search across all episode fields
- **Series / season grouping** — organise episodes into named series or seasonal collections

### Distribution and Growth

- **Spotify and Apple Podcasts submission** — complete RSS feed validation and platform submission
- **YouTube integration** — publish or link video episodes to a YouTube channel
- **Email dispatch** — integrate an email service (e.g. Resend, Loops) to automatically notify subscribers on new episode publication
- **Analytics** — basic play count and engagement tracking, ideally privacy-preserving (e.g. Plausible, Umami)

### Technical Improvements

- **Expanded test suite** — cover episode mapping, admin write flows, share link generation, RSS output, and RLS rules
- **Error boundaries** — graceful client-side error handling for episode rendering and data fetching
- **Bundle optimisation** — audit and remove unused shadcn/ui components
- **Edge Function monitoring** — add logging and alerting for function failures
- **Accessibility audit** — review keyboard navigation, ARIA labels, and colour contrast against WCAG AA

---

## Phased Roadmap

### Phase 1 — Foundation (Near-term)

| Priority | Feature |
|----------|---------|
| High | Draft/published toggle |
| High | Stored file sizes at upload |
| High | Expanded test coverage (episode mapping, RSS, admin flows) |
| Medium | Soft delete / archive |
| Medium | Error boundaries and graceful error states |
| Medium | Bundle audit — remove unused shadcn/ui components |

### Phase 2 — Experience (Mid-term)

| Priority | Feature |
|----------|---------|
| High | Sticky persistent audio player |
| High | Full episode pages (`/episodes/:id`) |
| Medium | Waveform visualisation |
| Medium | Related episodes |
| Medium | Transcript display |
| Medium | Editable category list via admin |

### Phase 3 — Distribution (Mid-term)

| Priority | Feature |
|----------|---------|
| High | Email dispatch to subscribers on publish |
| High | Spotify and Apple Podcasts submission |
| Medium | YouTube video integration |
| Medium | Basic play analytics |
| Low | Server-side full-text search |

### Phase 4 — Growth (Longer-term)

| Priority | Feature |
|----------|---------|
| Medium | Clips system (short-form highlights) |
| Medium | Season / series grouping |
| Medium | Per-user admin authentication |
| Medium | Chapter markers |
| Low | Comment or reaction layer |
| Low | Episode versioning |

---

## Final Positioning

Sandalwood & Sage is well-placed to become a distinctive short-form audio and video debate platform. The combination of AI-generated content, a strong editorial voice through Sandalwood and Sage, and a clean, modern interface gives it a clear identity.

The immediate priority is stabilising the publishing workflow (drafts, auth, RSS reliability) and deepening the episode experience (persistent player, full pages). Distribution — getting onto Spotify and Apple Podcasts and activating the subscriber list — follows naturally once the foundation is solid.

The platform does not need to be large to be successful. It needs to be reliable, distinctive, and easy for Gareth and Lawrence to operate and grow.
