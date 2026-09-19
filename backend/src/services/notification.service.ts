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

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured; skipping email notification");
    return;
  }

  const { error } = await resend.emails.send({
    from: env.notificationFromEmail,
    to,
    subject,
    html,
  });

  if (error) console.error("Email notification failed", error);
}

export function notifyNewBooking(booking: BookingNotification) {
  return sendEmail(
    env.adminEmail,
    `New booking inquiry: ${booking.contact.firstName} ${booking.contact.lastName}`,
    `<p>A new booking inquiry is waiting for review.</p><p>${booking.service} · Tier ${booking.design_tier ?? "not selected"}</p><p>Booking ID: ${booking.id}</p>`,
  );
}

export function notifyBookingDecision(booking: BookingNotification, accepted: boolean) {
  return sendEmail(
    booking.contact.email,
    accepted ? "Your VLDNAIL booking is confirmed" : "Update about your VLDNAIL booking request",
    accepted
      ? `<p>Hi ${booking.contact.firstName}, your VLDNAIL appointment request has been confirmed.</p><p>${booking.service}</p>`
      : `<p>Hi ${booking.contact.firstName}, your requested VLDNAIL appointment is not available.</p><p>Please contact us to choose another time.</p>`,
  );
}