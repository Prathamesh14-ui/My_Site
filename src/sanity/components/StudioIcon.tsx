import { siteConfig } from "@/config/site";

/** Brand mark shown in the Studio's top-left workspace button. */
export function StudioIcon() {
  if (!siteConfig.logo.images) return null;
  // eslint-disable-next-line @next/next/no-img-element -- rendered inside Sanity Studio, not a Next page
  return <img src={siteConfig.logo.images.light} alt="" width="100%" height="100%" style={{ objectFit: "contain" }} />;
}
