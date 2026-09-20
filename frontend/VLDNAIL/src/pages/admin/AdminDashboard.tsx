import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Components/ui/Button";
import { acceptBooking, declineBooking, getCatalog, getPendingBookings, type CatalogItem, type PendingBooking, updateCatalogItem } from "../../services/adminApi";
import { getSupabaseClient } from "../../services/supabase";

const mockAdminEnabled = import.meta.env.VITE_MOCK_ADMIN === "true";

const mockBooking: PendingBooking = {
  id: "mock-booking-001",
  appointment_start: "2026-10-10T18:00:00.000Z",
  duration_minutes: 90,
  service: "Gel X",
  service_type: "newSet",
  nail_length: "Medium",
  nail_shape: "Almond",
  design_tier: 2,
  extras: ["Nail Fix (per nail)"],
  contact: {
    firstName: "Maya",
    lastName: "Chen",
    email: "maya@example.com",
    phone: "(403) 555-0147",
    instagram: "@mayachen",
  },
};

function defaultDuration(tier: number | null) {
  return tier ? 90 + (tier - 1) * 30 : 90;
}

function formatAppointment(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Edmonton",
  }).format(new Date(value));
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<PendingBooking[]>([]);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [catalogDrafts, setCatalogDrafts] = useState<Record<string, Partial<CatalogItem>>>({});
  const [catalogBusyId, setCatalogBusyId] = useState<string | null>(null);

  async function loadCatalog(token: string) {
    const items = await getCatalog(token);
    setCatalog(items);
    setCatalogDrafts(Object.fromEntries(items.map((item) => [item.id, item])));
  }

  async function loadBookings() {
    if (mockAdminEnabled && window.location.search.includes("mock=true")) {
      setBookings([mockBooking]);
      setDurations({ [mockBooking.id]: mockBooking.duration_minutes });
      setLoading(false);
      return;
    }

    const { data } = await getSupabaseClient().auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      navigate("/studio/login");
      return;
    }

    try {
      const nextBookings = await getPendingBookings(token);
      setBookings(nextBookings);
      setDurations(Object.fromEntries(nextBookings.map((booking) => [booking.id, booking.duration_minutes || defaultDuration(booking.design_tier)])));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load inquiries.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
      const { data } = await getSupabaseClient().auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        navigate("/studio/login");
        return;
      }

      try {
        const nextBookings = await getPendingBookings(token);
        if (cancelled) return;
        setBookings(nextBookings);
        setDurations(Object.fromEntries(nextBookings.map((booking) => [booking.id, booking.duration_minutes || defaultDuration(booking.design_tier)])));
        await loadCatalog(token);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load inquiries.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void initialLoad();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function handleDecision(booking: PendingBooking, accepted: boolean) {
    if (mockAdminEnabled && window.location.search.includes("mock=true")) {
      setBusyId(booking.id);
      window.setTimeout(() => {
        setBookings((current) => current.filter((item) => item.id !== booking.id));
        setBusyId(null);
      }, 400);
      return;
    }

    const { data } = await getSupabaseClient().auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      navigate("/studio/login");
      return;
    }

    setBusyId(booking.id);
    setError(null);
    try {
      if (accepted) await acceptBooking(booking.id, durations[booking.id] ?? defaultDuration(booking.design_tier), token);
      else await declineBooking(booking.id, token);
      setBookings((current) => current.filter((item) => item.id !== booking.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update this inquiry.");
    } finally {
      setBusyId(null);
    }
  }

  async function saveCatalogItem(item: CatalogItem) {
    const { data } = await getSupabaseClient().auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      navigate("/studio/login");
      return;
    }

    setCatalogBusyId(item.id);
    setError(null);
    try {
      const updated = await updateCatalogItem(item.id, catalogDrafts[item.id] ?? item, token);
      setCatalog((current) => current.map((entry) => entry.id === updated.id ? updated : entry));
      setCatalogDrafts((current) => ({ ...current, [updated.id]: updated }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save this service.");
    } finally {
      setCatalogBusyId(null);
    }
  }

  async function signOut() {
    if (mockAdminEnabled && window.location.search.includes("mock=true")) {
      navigate("/studio/login");
      return;
    }
    await getSupabaseClient().auth.signOut();
    navigate("/studio/login");
  }

  return (
    <main className="min-h-screen bg-[#FAEDEF] text-[#2f2024]">
      <header className="border-b border-[#F5DDE1] bg-white/70 px-6 py-5 md:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="font-serif text-xs uppercase tracking-[0.35em] text-[#D37E90]">Private studio</p>
            <h1 className="mt-1 font-serif text-3xl">Booking inquiries</h1>
          </div>
          <button type="button" onClick={signOut} className="text-sm text-[#D37E90] hover:underline">Sign out</button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-[#6e565d]">Review, adjust, and confirm appointment holds.</p>
            <h2 className="mt-1 font-serif text-2xl">Pending requests</h2>
          </div>
          <button type="button" onClick={() => void loadBookings()} className="text-sm text-[#D37E90] hover:underline">Refresh</button>
        </div>

        {error && <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading && <p className="text-sm text-[#6e565d]">Loading inquiries…</p>}
        {!loading && bookings.length === 0 && <p className="rounded-2xl border border-[#F5DDE1] bg-white/70 p-8 text-sm text-[#6e565d]">No pending booking inquiries.</p>}

        <div className="space-y-5">
          {bookings.map((booking) => (
            <article key={booking.id} className="rounded-2xl border border-[#F5DDE1] bg-white/80 p-6">
              <div className="flex flex-col justify-between gap-5 lg:flex-row">
                <div>
                  <p className="font-serif text-xl">{booking.contact.firstName} {booking.contact.lastName}</p>
                  <p className="mt-1 text-sm text-[#D37E90]">{formatAppointment(booking.appointment_start)}</p>
                  <p className="mt-3 text-sm text-[#5f4a50]">{booking.service} · Tier {booking.design_tier ?? "none"}</p>
                  <p className="mt-1 text-sm text-[#6e565d]">{booking.nail_length ?? "Length not specified"} · {booking.nail_shape ?? "Shape not specified"}</p>
                  <p className="mt-3 text-xs text-[#7c6269]">{booking.contact.email} · {booking.contact.phone || "No phone provided"}</p>
                </div>
                <div className="flex flex-col gap-3 sm:min-w-64">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#7c6269]">
                    Appointment length
                    <select
                      value={durations[booking.id] ?? defaultDuration(booking.design_tier)}
                      onChange={(event) => setDurations((current) => ({ ...current, [booking.id]: Number(event.target.value) }))}
                      className="mt-1 block w-full rounded-md border border-[#F5DDE1] bg-white px-3 py-2 text-sm font-normal text-[#2f2024]"
                    >
                      {[90, 120, 150, 180, 210, 240].map((minutes) => <option key={minutes} value={minutes}>{minutes / 60} hours</option>)}
                    </select>
                  </label>
                  <div className="flex gap-2">
                    <Button onClick={() => void handleDecision(booking, true)} disabled={busyId === booking.id}>
                      {busyId === booking.id ? "Saving…" : "Accept & Block"}
                    </Button>
                    <button type="button" onClick={() => void handleDecision(booking, false)} disabled={busyId === booking.id} className="px-3 text-sm text-[#D37E90] hover:underline">Decline</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-14">
          <div className="mb-5">
            <p className="text-sm text-[#6e565d]">These values appear in the customer booking flow.</p>
            <h2 className="mt-1 font-serif text-2xl">Services & prices</h2>
          </div>
          {catalog.length === 0 && <p className="rounded-2xl border border-[#F5DDE1] bg-white/70 p-8 text-sm text-[#6e565d]">No catalog items loaded. Run the catalog migration in Supabase first.</p>}
          <div className="grid gap-4 lg:grid-cols-2">
            {catalog.map((item) => {
              const draft = catalogDrafts[item.id] ?? item;
              return (
                <article key={item.id} className="rounded-2xl border border-[#F5DDE1] bg-white/80 p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#7c6269]">
                      Service name
                      <input value={String(draft.label ?? "")} onChange={(event) => setCatalogDrafts((current) => ({ ...current, [item.id]: { ...current[item.id], label: event.target.value } }))} className="mt-1 block w-full rounded-md border border-[#F5DDE1] bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#2f2024]" />
                    </label>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#7c6269]">
                      Description
                      <input value={String(draft.description ?? "")} onChange={(event) => setCatalogDrafts((current) => ({ ...current, [item.id]: { ...current[item.id], description: event.target.value } }))} className="mt-1 block w-full rounded-md border border-[#F5DDE1] bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#2f2024]" />
                    </label>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#7c6269]">
                      New set price
                      <input type="number" min="0" step="0.01" value={draft.new_set_price ?? ""} onChange={(event) => setCatalogDrafts((current) => ({ ...current, [item.id]: { ...current[item.id], new_set_price: event.target.value === "" ? null : Number(event.target.value) } }))} className="mt-1 block w-full rounded-md border border-[#F5DDE1] bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#2f2024]" />
                    </label>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#7c6269]">
                      Fill price
                      <input type="number" min="0" step="0.01" value={draft.fill_price ?? ""} onChange={(event) => setCatalogDrafts((current) => ({ ...current, [item.id]: { ...current[item.id], fill_price: event.target.value === "" ? null : Number(event.target.value) } }))} className="mt-1 block w-full rounded-md border border-[#F5DDE1] bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#2f2024]" />
                    </label>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-sm text-[#6e565d]">
                      <input type="checkbox" checked={Boolean(draft.active)} onChange={(event) => setCatalogDrafts((current) => ({ ...current, [item.id]: { ...current[item.id], active: event.target.checked } }))} />
                      Visible to customers
                    </label>
                    <Button onClick={() => void saveCatalogItem(item)} disabled={catalogBusyId === item.id}>
                      {catalogBusyId === item.id ? "Saving…" : "Save service"}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}