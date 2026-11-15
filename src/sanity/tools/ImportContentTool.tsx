"use client";

import { useState } from "react";
import { useClient } from "sanity";
import { Box, Button, Card, Flex, Heading, Stack, Text } from "@sanity/ui";
import { apiVersion } from "../env";
import { buildSeedDocuments } from "../seed";

type Status =
  | { kind: "idle" }
  | { kind: "working" }
  | { kind: "done"; message: string }
  | { kind: "error"; message: string };

/**
 * Studio tool: copies the website's starter content into Sanity using the
 * signed-in editor's own permissions (no API token needed).
 */
export function ImportContentTool() {
  const client = useClient({ apiVersion });
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const docs = buildSeedDocuments();
  const counts = docs.reduce<Record<string, number>>((acc, d) => ({ ...acc, [d._type]: (acc[d._type] ?? 0) + 1 }), {});

  async function run(overwrite: boolean) {
    if (overwrite && !window.confirm("This replaces the imported documents with the original starter text. Edits you made to them will be lost. Continue?")) return;
    setStatus({ kind: "working" });
    try {
      const existing = await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: docs.map((d) => d._id) });
      const tx = client.transaction();
      for (const d of docs) {
        if (overwrite) tx.createOrReplace(d);
        else tx.createIfNotExists(d);
      }
      await tx.commit({ visibility: "async" });
      const created = overwrite ? docs.length : docs.length - existing.length;
      setStatus({
        kind: "done",
        message: overwrite
          ? `Replaced ${docs.length} documents with the starter content.`
          : created > 0
            ? `Imported ${created} new document${created === 1 ? "" : "s"}. ${existing.length} already existed and were left unchanged.`
            : "Everything was already imported — nothing changed.",
      });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : String(err) });
    }
  }

  return (
    <Box padding={5} style={{ maxWidth: 720 }}>
      <Stack gap={5}>
        <Heading size={3}>Import starter content</Heading>
        <Text muted size={2}>
          Copies the website&apos;s current text into Sanity so you can edit it here instead of in code: {counts.serviceCategory ?? 0} service areas
          (with all their services), {counts.project ?? 0} case studies and {counts.faq ?? 0} FAQs.
        </Text>
        <Text muted size={2}>
          Safe to run more than once — documents that already exist are not touched. Images are not included; upload real screenshots on each case study afterwards.
        </Text>
        <Flex gap={3} wrap="wrap">
          <Button text="Import starter content" tone="primary" loading={status.kind === "working"} onClick={() => void run(false)} />
          <Button text="Reset to starter content" mode="ghost" tone="critical" disabled={status.kind === "working"} onClick={() => void run(true)} />
        </Flex>
        {status.kind === "done" && (
          <Card padding={4} radius={2} tone="positive" border>
            <Text size={2}>{status.message} Open “Content” in the top bar to start editing.</Text>
          </Card>
        )}
        {status.kind === "error" && (
          <Card padding={4} radius={2} tone="critical" border>
            <Stack gap={3}>
              <Text size={2} weight="semibold">Import failed</Text>
              <Text size={1}>{status.message}</Text>
            </Stack>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
