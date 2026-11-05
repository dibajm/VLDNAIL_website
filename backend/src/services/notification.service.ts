import { DateTime } from "luxon";
import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

type BookingNotification = {
  id: string;
  appointment_start: string;
  duration_minutes: number;
  hold_expires_at: string;
  requested_start?: string | null;
  service: string;
  service_type: string;
  nail_length: string | null;
  nail_shape: string | null;
  design_tier: number | null;
  extras: string[] | null;
  contact: { firstName: string; lastName: string; email: string; phone?: string; instagram?: string };
};

type EmailAttachment = { filename: string; content: Buffer };

// Names and service labels are free-form visitor input, so they are escaped
// before they reach the HTML body.
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character] ?? character));
}

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
};

// Spam filters treat a bare fragment as malformed, so every message goes out as a
// complete document with a plain-text alternative alongside it.
function wrapHtml(body: string): string {
  return [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    "</head>",
    '<body style="margin:0;padding:24px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#2f2024;">',
    body,
    "</body>",
    "</html>",
  ].join("");
}

async function sendEmail({ to, subject, html, text, replyTo, attachments }: EmailOptions) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured; skipping email notification");
    return;
  }

  const { error } = await resend.emails.send({
    from: env.notificationFromEmail,
    to,
    subject,
    html: wrapHtml(html),
    text,
    replyTo,
    attachments,
  });

  if (error) {
    console.error("Email notification failed", error);
    throw new Error(`EMAIL_SEND_FAILED: ${error.message}`);
  }
}

// "Wednesday, Nov 5 at 2:00 PM", in studio time.
function formatWhen(iso: string, style: "long" | "short" = "long"): string {
  const when = DateTime.fromISO(iso, { zone: env.businessTimezone });
  return when.toFormat(style === "long" ? "cccc, LLL d 'at' h:mm a" : "ccc, LLL d 'at' h:mm a");
}

// "Wednesday, Nov 5 at 2:00 PM – 4:00 PM"
function formatRange(iso: string, durationMinutes: number): string {
  const end = DateTime.fromISO(iso, { zone: env.businessTimezone }).plus({ minutes: durationMinutes });
  return `${formatWhen(iso)} – ${end.toFormat("h:mm a")}`;
}

// "Short · New Set · Tier 2"
function serviceLine(booking: BookingNotification): string {
  const type = booking.service_type === "fill" ? "3-Week Fill" : "New Set";
  return [booking.service, type, booking.design_tier ? `Tier ${booking.design_tier}` : null].filter(Boolean).join(" · ");
}

const bookingUrl = `${env.siteUrl}/booking`;
const signOff = "♡ VLDNAIL";

// Client emails share one layout: greeting, paragraphs, sign-off. Each
// paragraph is plain text with **bold** marking the parts to emphasise.
function clientEmail(first: string, paragraphs: string[]) {
  const toHtml = (paragraph: string) =>
    `<p>${escapeHtml(paragraph).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br />")}</p>`;
  return {
    html: [`<p>Hi ${escapeHtml(first)},</p>`, ...paragraphs.map(toHtml), `<p style="color:#D37E90;">${signOff}</p>`].join(""),
    text: [`Hi ${first},`, "", ...paragraphs.flatMap((paragraph) => [paragraph.replace(/\*\*/g, ""), ""]), signOff].join("\n"),
  };
}

function sendToClient(booking: BookingNotification, subject: string, paragraphs: string[]) {
  return sendEmail({
    to: booking.contact.email,
    replyTo: env.notificationToEmail,
    subject,
    ...clientEmail(booking.contact.firstName, paragraphs),
  });
}

export function notifyNewBooking(booking: BookingNotification) {
  const name = `${booking.contact.firstName} ${booking.contact.lastName}`;
  const details: [string, string][] = [
    ["Client", name],
    ["Requested", formatWhen(booking.appointment_start)],
    ["Service", serviceLine(booking)],
    ["Length / shape", `${booking.nail_length ?? "Not specified"} · ${booking.nail_shape ?? "Not specified"}`],
    ["Extras", booking.extras?.length ? booking.extras.join(", ") : "None"],
    ["Email", booking.contact.email],
    ["Phone", booking.contact.phone || "Not provided"],
    ["Instagram", booking.contact.instagram || "Not provided"],
  ];
  const holdNote = `The time is held for 3 days, until ${formatWhen(booking.hold_expires_at)}. Accept, decline or move it in the studio: ${env.siteUrl}/studio`;

  return sendEmail({
    to: env.notificationToEmail,
    // Replying goes to the client rather than into the void, which also tells
    // Gmail this is a real thread.
    replyTo: booking.contact.email,
    subject: `New booking request: ${name}, ${formatWhen(booking.appointment_start, "short")}`,
    html: [
      "<p>A new booking request is waiting for you.</p>",
      `<p>${details.map(([label, value]) => `<strong>${label}:</strong> ${escapeHtml(value)}`).join("<br />")}</p>`,
      `<p>${escapeHtml(holdNote)}</p>`,
      "<p>Reply to this email to write to the client directly.</p>",
    ].join(""),
    text: [
      "A new booking request is waiting for you.",
      "",
      ...details.map(([label, value]) => `${label}: ${value}`),
      "",
      holdNote,
      "",
      "Reply to this email to write to the client directly.",
    ].join("\n"),
  });
}

export function notifyBookingReceived(booking: BookingNotification) {
  return sendToClient(booking, "We got your VLDNAIL booking request", [
    "Thank you for your booking request! Here's what you asked for:",
    `**${formatWhen(booking.appointment_start)}**\n${serviceLine(booking)}`,
    "This isn't confirmed yet. We'll review it and email you within 3 days to confirm, or to suggest another time if that one doesn't work.",
    "Questions? Just reply to this email.",
  ]);
}

export function notifyBookingConfirmed(booking: BookingNotification) {
  const moved = booking.requested_start
    && DateTime.fromISO(booking.requested_start).toMillis() !== DateTime.fromISO(booking.appointment_start).toMillis();
  return sendToClient(booking, `Your VLDNAIL appointment is confirmed ✦ ${formatWhen(booking.appointment_start, "short")}`, [
    "Your appointment is confirmed. We can't wait to see you!",
    [
      `**${formatRange(booking.appointment_start, booking.duration_minutes)}**`,
      ...(moved ? [`Note: this is a different time from the one you requested (${formatWhen(booking.requested_start as string, "short")}).`] : []),
      serviceLine(booking),
      "Calgary, AB",
    ].join("\n"),
    "If you need to cancel or reschedule, please let us know at least 24 hours before your appointment. Cancellations with less than 24 hours' notice lose the deposit.",
    "See you soon,",
  ]);
}

export function notifyBookingDeclined(booking: BookingNotification) {
  return sendToClient(booking, "About your VLDNAIL booking request", [
    `Thank you for your request for **${formatWhen(booking.appointment_start)}**. Unfortunately that time isn't available.`,
    `We'd still love to see you! Book another time at ${bookingUrl}, or reply to this email and we'll help you find one.`,
  ]);
}

export function notifyBookingCancelled(booking: BookingNotification) {
  return sendToClient(booking, "Your VLDNAIL appointment has been cancelled", [
    `Your appointment on **${formatWhen(booking.appointment_start)}** has been cancelled.`,
    `If this is unexpected or you'd like to rebook, reply to this email or book a new time at ${bookingUrl}.`,
  ]);
}

export function notifyBookingMoved(booking: BookingNotification, previousStart: string) {
  return sendToClient(booking, `Your VLDNAIL appointment has a new time: ${formatWhen(booking.appointment_start, "short")}`, [
    "Your appointment has been moved to a new time:",
    `**New time: ${formatRange(booking.appointment_start, booking.duration_minutes)}**\nPreviously: ${formatWhen(previousStart)}`,
    serviceLine(booking),
    "If the new time doesn't work for you, reply to this email and we'll sort it out.",
  ]);
}

export function notifyBookingExpired(booking: BookingNotification) {
  return sendToClient(booking, "About your VLDNAIL booking request", [
    `We weren't able to confirm your request for **${formatWhen(booking.appointment_start)}** in time, so it has been released. Sorry about that!`,
    `Please book another time at ${bookingUrl}, or reply to this email and we'll help.`,
  ]);
}

export function notifyPressOnInquiry(
  subject: string,
  html: string,
  text: string,
  replyTo: string,
  attachments: EmailAttachment[],
) {
  return sendEmail({ to: env.notificationToEmail, subject, html, text, replyTo, attachments });
}
