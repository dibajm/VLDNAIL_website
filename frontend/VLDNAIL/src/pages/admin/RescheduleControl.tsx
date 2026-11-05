import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { rescheduleBooking, type PendingBooking } from "../../services/adminApi";
import { getSupabaseClient } from "../../services/supabase";

// 8:00 AM to 7:45 PM in 15-minute steps; the server also checks the
// appointment finishes by 8 PM.
const startTimes = Array.from({ length: 48 }, (_, index) => {
  const minutes = 8 * 60 + index * 15;
  const value = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  const label = new Date(`2000-01-01T${value}:00`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return { value, label };
});

// The booking's current date and time in studio time, as the inputs expect.
function studioDateTime(iso: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "America/Edmonton",
    }).formatToParts(new Date(iso)).map((part) => [part.type, part.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}

type Props = {
  booking: PendingBooking;
  // Pending requests pass the length picked in the dropdown so the new time
  // is checked against it; confirmed bookings keep their saved length.
  durationMinutes?: number;
  onSaved: (booking: PendingBooking) => void;
};

export default function RescheduleControl({ booking, durationMinutes, onSaved }: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => studioDateTime(booking.appointment_start));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openEditor() {
    setDraft(studioDateTime(booking.appointment_start));
    setError(null);
    setOpen(true);
  }

  async function save() {
    const { data } = await getSupabaseClient().auth.getSession();
    const token = data.session?.access_token;
    if (!token) return navigate("/studio/login");
    setBusy(true);
    setError(null);
    try {
      onSaved(await rescheduleBooking(booking.id, { ...draft, durationMinutes }, token));
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to move this booking.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return <button type="button" onClick={openEditor} className="self-start text-sm text-[#D37E90] hover:underline">Change date / time</button>;
  }

  const hasTime = startTimes.some((option) => option.value === draft.time);
  return (
    <div className="rounded-xl border border-[#F5DDE1] bg-[#FAEDEF]/60 p-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#7c6269]">
          Date
          <input type="date" value={draft.date} onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))} className="mt-1 block w-full rounded-md border border-[#F5DDE1] bg-white px-2 py-2 text-sm font-normal normal-case tracking-normal text-[#2f2024]" />
        </label>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#7c6269]">
          Start time
          <select value={draft.time} onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))} className="mt-1 block w-full rounded-md border border-[#F5DDE1] bg-white px-2 py-2 text-sm font-normal normal-case tracking-normal text-[#2f2024]">
            {!hasTime && <option value={draft.time}>{draft.time}</option>}
            {startTimes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </div>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
      <div className="mt-3 flex items-center gap-3">
        <button type="button" onClick={() => void save()} disabled={busy || !draft.date} className="rounded-md bg-[#D37E90] px-4 py-1.5 text-sm text-white hover:bg-[#c86f82] disabled:opacity-50">{busy ? "Saving…" : "Save new time"}</button>
        <button type="button" onClick={() => setOpen(false)} disabled={busy} className="text-sm text-[#7c6269] hover:underline">Cancel</button>
      </div>
    </div>
  );
}
