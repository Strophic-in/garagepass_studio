/**
 * Video registry.
 *
 * Every clip is AI-generated from the prompt set, written to match the real
 * shop in `public/images/` — black HALO lift posts with yellow arms, white
 * painted wainscot, galvanized roof deck on charcoal I-beams, bare grey
 * concrete. Originals live in `media-source/` (gitignored, never deployed);
 * these are the stripped and compressed web encodes.
 *
 * Audio is removed from all of them: every clip autoplays muted, so an AAC
 * track is pure download weight.
 */

export type Clip = {
  src: string;
  poster: string;
  /** Describes the clip for assistive tech and as a no-JS fallback. */
  alt: string;
};

const clip = (slug: string, alt: string): Clip => ({
  src: `/videos/${slug}.mp4`,
  poster: `/videos/posters/${slug}.webp`,
  alt,
});

export const clips = {
  /** Section 04 — lateral move along the tool wall. */
  tools: clip(
    "tool-wall",
    "Camera tracking past the GaragePass tool wall, engine hoist, socket sets and rolling tool chests",
  ),

  /** Section 08 — the shop busy with members. */
  community: clip(
    "community-shop-floor",
    "Members working on cars across several lift bays on the GaragePass shop floor",
  ),

  /** Section 12 — closing CTA. */
  outro: clip(
    "walking-into-shop",
    "A person walking into the lit GaragePass shop at night carrying a toolbox",
  ),
} as const;
