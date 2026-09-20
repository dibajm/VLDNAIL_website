import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Components/ui/Button";
import Input from "../../Components/ui/Input";
import { getSupabaseClient } from "../../services/supabase";

const mockAdminEnabled = import.meta.env.VITE_MOCK_ADMIN === "true";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await getSupabaseClient().auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      navigate("/studio");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAEDEF] px-6 py-16 text-[#2f2024]">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-[#F5DDE1] bg-white/80 p-8 shadow-sm">
        <p className="font-serif text-xs uppercase tracking-[0.35em] text-[#D37E90]">Private studio</p>
        <h1 className="mt-2 font-serif text-4xl">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-[#6e565d]">Manage booking inquiries and appointment holds.</p>

        <div className="mt-8 space-y-4">
          <Input label="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input label="Password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <Button type="submit" fullWidth disabled={loading} className="mt-6">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        {mockAdminEnabled && (
          <button
            type="button"
            onClick={() => navigate("/studio?mock=true")}
            className="mt-4 w-full text-sm text-[#D37E90] hover:underline"
          >
            Preview with mock inquiry
          </button>
        )}
      </form>
    </main>
  );
}