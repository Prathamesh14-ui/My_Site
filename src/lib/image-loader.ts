"use client";

/**
 * next/image loader: Sanity images are resized and converted (WebP/AVIF) by
 * Sanity's own image CDN instead of Vercel's image optimizer — one hop fewer,
 * globally cached, and no Vercel image-optimization quota.
 * Other images are served as-is (local assets here are SVG logos).
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("https://cdn.sanity.io/images/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    return url.toString();
  }
  return src;
}
