import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cancelBooking, deleteBookingHistory, getBookingHistory, type PendingBooking } from "../../services/adminApi";
import { getSupabaseClient } from "../../services/supabase";

function formatAppointment(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Edmonton",
  }).format(new Date(value));
}

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function AdminHistory() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<(PendingBooking & { status?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadHistory() {
    const { data } = await getSupabaseClient().auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      navigate("/studio/login");
      return;
    }

    try {
      setError(null);
      setBookings(await getBookingHistory(token) as (PendingBooking & { status?: string })[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load booking history.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadHistory();
  }, []);

  async function handleCancel(booking: PendingBooking) {
    if (!window.confirm("Cancel this confirmed appointment? The time will become available again.")) return;
    const { data } = await getSupabaseClient().auth.getSession();
    const token = data.session?.access_token;
    if (!token) return navigate("/studio/login");

    try {
      setBusyId(booking.id);
      await cancelBooking(booking.id, token);
      setBookings((current) => current.map((entry) => entry.id === booking.id ? { ...entry, status: "cancelled" } : entry));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to cancel this appointment.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(booking: PendingBooking) {
    if (!window.confirm("Permanently delete this history record? This cannot be undone.")) return;
    const { data } = await getSupabaseClient().auth.getSession();
    const token = data.session?.access_token;
    if (!token) return navigate("/studio/login");

    try {
      setBusyId(booking.id);
      await deleteBookingHistory(booking.id, token);
      setBookings((current) => current.filter((entry) => entry.id !== booking.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete this history record.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAEDEF] text-[#2f2024]">
      <header className="border-b border-[#F5DDE1] bg-white/70 px-6 py-5 md:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="font-serif text-xs uppercase tracking-[0.35em] text-[#D37E90]">Private studio</p>
            <h1 className="mt-1 font-serif text-3xl">Booking history</h1>
          </div>
          <button type="button" onClick={() => navigate("/studio")} className="text-sm text-[#D37E90] hover:underline">Back to inquiries</button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-[#6e565d]">Accepted requests stay here as permanent records.</p>
            <h2 className="mt-1 font-serif text-2xl">Confirmed & past bookings</h2>
          </div>
          <button type="button" onClick={() => void loadHistory()} className="text-sm text-[#D37E90] hover:underline">Refresh</button>
        </div>

        {error && <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading && <p className="text-sm text-[#6e565d]">Loading history…</p>}
        {!loading && bookings.length === 0 && <p className="rounded-2xl border border-[#F5DDE1] bg-white/70 p-8 text-sm text-[#6e565d]">No booking history yet.</p>}

        <div className="space-y-4">
          {bookings.map((booking) => {
            const status = booking.status ?? "confirmed";
            return (
              <article key={booking.id} className="rounded-2xl border border-[#F5DDE1] bg-white/80 p-6">
                <div className="flex flex-col justify-between gap-5 lg:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-serif text-xl">{booking.contact.firstName} {booking.contact.lastName}</p>
                      <span className="rounded-full bg-[#F5DDE1] px-3 py-1 text-xs text-[#7c6269]">{statusLabel(status)}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#D37E90]">{formatAppointment(booking.appointment_start)}</p>
                    <p className="mt-3 text-sm text-[#5f4a50]">{booking.service} · Tier {booking.design_tier ?? "none"} · {booking.duration_minutes} minutes</p>
                    <p className="mt-1 text-sm text-[#6e565d]">{booking.contact.email} · {booking.contact.phone || "No phone provided"}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 self-start">
                    {status === "confirmed" && <button type="button" onClick={() => void handleCancel(booking)} disabled={busyId === booking.id} className="rounded-md border border-[#D37E90] px-4 py-2 text-sm text-[#D37E90] hover:bg-[#F5DDE1] disabled:opacity-50">{busyId === booking.id ? "Cancelling…" : "Cancel appointment"}</button>}
                    {status !== "confirmed" && <button type="button" onClick={() => void handleDelete(booking)} disabled={busyId === booking.id} className="rounded-md border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50">{busyId === booking.id ? "Deleting…" : "Delete record"}</button>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
