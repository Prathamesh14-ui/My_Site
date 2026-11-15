"use client";

import { useFormValue } from "sanity";
import { Button, Flex, Stack, Text } from "@sanity/ui";
import { siteConfig } from "@/config/site";

/** Normalises a phone number for wa.me links. 10-digit numbers are assumed to be Indian (+91). */
export function waNumber(raw?: string): string | null {
  const digits = (raw ?? "").replace(/\D/g, "").replace(/^00/, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

/**
 * Field component rendered at the top of an enquiry: buttons that open a
 * pre-filled reply in Gmail, the default email app, or WhatsApp.
 * It never writes a value to the document.
 */
export function ReplyButtons() {
  const name = (useFormValue(["name"]) as string | undefined) ?? "";
  const email = (useFormValue(["email"]) as string | undefined) ?? "";
  const whatsapp = useFormValue(["whatsapp"]) as string | undefined;
  const service = (useFormValue(["service"]) as string | undefined) ?? "your project";

  const firstName = name.trim().split(/\s+/)[0] || "there";
  const subject = `Re: Your enquiry about ${service} — ${siteConfig.name}`;
  const body = `Hi ${firstName},\n\nThank you for reaching out to ${siteConfig.name} about ${service}.\n\n\n\nBest regards,\n${siteConfig.name}\n${siteConfig.contact.whatsapp.display}`;
  const waText = `Hi ${firstName}, this is ${siteConfig.name}. Thank you for your enquiry about ${service}! `;

  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const wa = waNumber(whatsapp);

  return (
    <Stack gap={3}>
      <Flex gap={2} wrap="wrap">
        {email && <Button as="a" href={gmail} target="_blank" rel="noopener noreferrer" text="Reply in Gmail" tone="primary" />}
        {email && <Button as="a" href={mailto} text="Other email app" mode="ghost" />}
        {wa ? (
          <Button as="a" href={`https://wa.me/${wa}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer" text="Reply on WhatsApp" tone="positive" />
        ) : (
          <Text size={1} muted>No valid WhatsApp number provided.</Text>
        )}
      </Flex>
      {email && (
        <Text size={1} muted>
          {email}
          {whatsapp ? ` · ${whatsapp}` : ""}
        </Text>
      )}
    </Stack>
  );
}
