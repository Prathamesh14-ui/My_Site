import Image from "next/image";
import type { Project } from "@/content/types";
import { cn } from "@/lib/utils";

type Shot = Project["screenshots"][number];

/** Portrait images (phone screenshots, chats) vs landscape (desktop pages). */
export const isPortrait = (s: Shot) => (s.height ?? 1000) > (s.width ?? 1600) * 1.1;

export function BrowserFrame({ shot, url, className, sizes }: { shot: Shot; url?: string; className?: string; sizes: string }) {
  return (
    <figure className={cn("overflow-hidden rounded-2xl border border-ink/10 bg-raised shadow-[0_30px_80px_-30px_var(--shadow-strong)]", className)}>
      <div className="flex items-center gap-3 border-b border-ink/[0.07] px-4 py-2.5" aria-hidden="true">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-ink/15" />
          <span className="size-2.5 rounded-full bg-ink/15" />
          <span className="size-2.5 rounded-full bg-ink/15" />
        </span>
        {url && <span className="truncate rounded-md bg-bg/70 px-2.5 py-1 font-mono text-[10.5px] text-muted">{url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>}
      </div>
      <Image src={shot.src} alt={shot.alt} width={shot.width ?? 1600} height={shot.height ?? 1000} sizes={sizes} className="block h-auto w-full" />
    </figure>
  );
}

export function PhoneFrame({ shot, className, sizes }: { shot: Shot; className?: string; sizes: string }) {
  return (
    <figure className={cn("rounded-[2rem] border border-ink/10 bg-[#0c0d12] p-2 shadow-[0_30px_80px_-30px_var(--shadow-strong)]", className)}>
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.width ?? 1000}
        height={shot.height ?? 2000}
        sizes={sizes}
        className="block h-auto w-full rounded-[1.6rem]"
      />
    </figure>
  );
}

/** Case-study gallery: desktop shots in browser frames, phone shots side by side in phone frames. */
export function ScreenshotGallery({ shots, url }: { shots: Shot[]; url?: string }) {
  const desktop = shots.filter((s) => !isPortrait(s));
  const phone = shots.filter(isPortrait);
  return (
    <div className="relative space-y-10 sm:space-y-14">
      {desktop.length > 0 && (
        <div className={cn("grid gap-6", desktop.length > 1 && "lg:grid-cols-2")}>
          {desktop.map((s) => (
            <BrowserFrame key={s.src} shot={s} url={url} sizes={desktop.length > 1 ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 1100px, 100vw"} />
          ))}
        </div>
      )}
      {phone.length > 0 && (
        <div
          className={cn(
            "mx-auto grid max-w-4xl items-start justify-center gap-5 sm:gap-8",
            phone.length === 1
              ? "max-w-[300px]"
              : phone.length === 2
                ? "grid-cols-2 sm:max-w-xl"
                : phone.length === 4
                  ? "max-w-5xl grid-cols-2 lg:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3",
          )}
        >
          {phone.map((s) => (
            <PhoneFrame key={s.src} shot={s} sizes="(min-width: 640px) 280px, 45vw" />
          ))}
        </div>
      )}
    </div>
  );
}
