import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

type BookingNotification = {
  id: string;
  appointment_start: string;
  service: string;
  design_tier: number | null;
  contact: { firstName: string; lastName: string; email: string };
};

type EmailAttachment = { filename: string; content: Buffer };

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

export function notifyNewBooking(booking: BookingNotification) {
  const name = `${booking.contact.firstName} ${booking.contact.lastName}`;
  const tier = booking.design_tier ?? "not selected";

  return sendEmail({
    to: env.adminEmail,
    // Replying goes to the client rather than into the void, which also tells
    // Gmail this is a real thread.
    replyTo: booking.contact.email,
    subject: `New booking inquiry: ${name}`,
    html: [
      "<p>A new booking inquiry is waiting for review.</p>",
      `<p><strong>Client:</strong> ${name}<br />`,
      `<strong>Service:</strong> ${booking.service}<br />`,
      `<strong>Tier:</strong> ${tier}</p>`,
      `<p>Booking ID: ${booking.id}</p>`,
    ].join(""),
    text: [
      "A new booking inquiry is waiting for review.",
      "",
      `Client: ${name}`,
      `Service: ${booking.service}`,
      `Tier: ${tier}`,
      "",
      `Booking ID: ${booking.id}`,
    ].join("\n"),
  });
}

export function notifyBookingDecision(booking: BookingNotification, accepted: boolean) {
  const first = booking.contact.firstName;

  return sendEmail({
    to: booking.contact.email,
    replyTo: env.adminEmail,
    subject: accepted ? "Your VLDNAIL booking is confirmed" : "Update about your VLDNAIL booking request",
    html: accepted
      ? `<p>Hi ${first}, your VLDNAIL appointment request has been confirmed.</p><p>${booking.service}</p>`
      : `<p>Hi ${first}, your requested VLDNAIL appointment is not available.</p><p>Please reply to this email to choose another time.</p>`,
    text: accepted
      ? [`Hi ${first},`, "", "Your VLDNAIL appointment request has been confirmed.", "", booking.service].join("\n")
      : [
          `Hi ${first},`,
          "",
          "Your requested VLDNAIL appointment is not available.",
          "Please reply to this email to choose another time.",
        ].join("\n"),
  });
}

export function notifyPressOnInquiry(
  subject: string,
  html: string,
  text: string,
  replyTo: string,
  attachments: EmailAttachment[],
) {
  return sendEmail({ to: env.adminEmail, subject, html, text, replyTo, attachments });
}
