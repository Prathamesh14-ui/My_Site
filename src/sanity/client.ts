import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "./env";

export const sanityClient = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
      // Test hook: point the client at a mock API host (never set in production).
      ...(process.env.SANITY_API_HOST_OVERRIDE ? { apiHost: process.env.SANITY_API_HOST_OVERRIDE, useProjectHostname: false, useCdn: false } : {}),
    })
  : null;
