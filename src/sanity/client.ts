import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "./env";

/**
 * Server-only Sanity clients. SANITY_API_TOKEN (an Editor token) lets the site
 * read a private dataset and save enquiries. It is never sent to the browser.
 */
const token = process.env.SANITY_API_TOKEN || undefined;

// Test hook: point the client at a mock API host (never set in production).
const hostOverride = process.env.SANITY_API_HOST_OVERRIDE
  ? { apiHost: process.env.SANITY_API_HOST_OVERRIDE, useProjectHostname: false, useCdn: false }
  : {};

export const sanityClient = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published", token, ...hostOverride })
  : null;

/** Write client — only available when a token is configured. */
export const sanityWriteClient =
  sanityConfigured && token
    ? createClient({ projectId, dataset, apiVersion, useCdn: false, token, timeout: 10_000, ...hostOverride })
    : null;
