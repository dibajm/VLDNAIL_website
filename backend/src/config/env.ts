export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

// ADMIN_EMAILS holds everyone who may sign in to the studio, comma separated.
// ADMIN_EMAIL stays readable as a single-address fallback.
function adminEmailList(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? requiredEnv("ADMIN_EMAIL");
  const emails = raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  if (!emails.length) throw new Error("No admin email is configured");
  return emails;
}

const adminEmails = adminEmailList();

export const env = {
  businessTimezone: process.env.BUSINESS_TIMEZONE ?? "America/Edmonton",
  adminEmails,
  // Who reads the inquiries, which is not necessarily who signs in. Defaults to
  // the first admin so the variable can be left unset.
  notificationToEmail: process.env.NOTIFICATION_TO_EMAIL?.trim() || adminEmails[0],
  supabaseUrl: requiredEnv("SUPABASE_URL"),
  supabaseServiceRoleKey: requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  resendApiKey: process.env.RESEND_API_KEY,
  notificationFromEmail: process.env.NOTIFICATION_FROM_EMAIL ?? "bookings@example.com",
};

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return env.adminEmails.includes(email.trim().toLowerCase());
}
