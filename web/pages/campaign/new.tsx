import { GetServerSideProps } from 'next';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { apiPost } from '../../lib/api';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = ctx.req.cookies?.token;
  if (!token) {
    return {
      redirect: {
        destination: `/login?next=${encodeURIComponent(ctx.resolvedUrl)}`,
        permanent: false,
      },
    };
  }
  return { props: {} };
};

type Objective = 'CTR' | 'LEAD' | 'VIEW';

export default function NewCampaign() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [objective, setObjective] = useState<Objective>('CTR');
  const [budget, setBudget] = useState<number>(500000); 
  const [cpc, setCpc] = useState<number | ''>('');
  const [cpm, setCpm] = useState<number | ''>('');
  const [targeting, setTargeting] = useState('{"interests":["tech","food"]}');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 
  const targetingState = useMemo(() => {
    try {
      const t = targeting.trim();
      if (!t) return { ok: true, value: undefined as any };
      return { ok: true, value: JSON.parse(t) };
    } catch {
      return { ok: false, value: undefined as any };
    }
  }, [targeting]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (!name.trim()) throw new Error('Name is required');
      if (!Number.isFinite(budget) || budget < 0) throw new Error('Budget must be >= 0');
      if (!targetingState.ok) throw new Error('Targeting must be valid JSON');

      const payload: any = { name, objective, budget };
      if (cpc !== '' && Number.isFinite(cpc)) payload.cpc = Number(cpc);
      if (cpm !== '' && Number.isFinite(cpm)) payload.cpm = Number(cpm);
      if (targetingState.value) payload.targeting = targetingState.value;

      setLoading(true);
      await apiPost('/campaigns', payload);
      router.push('/Advertiser/dashboardAdvertiser'); 
    } catch (err: any) {
      if (err?.message === 'Unauthorized') router.push('/login');
      else if (err?.message === 'Forbidden') setError('Accès refusé: rôle requis (ADVERTISER/ADMIN).');
      else setError(err?.message || 'API error');
    } finally {
      setLoading(false);
    }
  }

  const helperObjective =
    objective === 'CTR'
      ? 'Optimisez les clics : CPC conseillé.'
      : objective === 'LEAD'
      ? 'Optimisez les leads : CPC recommandé.'
      : 'Optimisez les vues : CPM recommandé.';

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100">
      {/* Dégradé décoratif derrière le contenu */}
      <div className="-z-10 pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-700/20 via-fuchsia-700/10 to-transparent" />

      {/* Header */}
      <header className="max-w-3xl mx-auto px-6 pt-10 pb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-neutral-300 hover:text-white transition"
          aria-label="Back"
        >
          ← Back
        </button>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
          Create a New Campaign
        </h1>
        <p className="mt-2 text-neutral-400">
          Configure targeting, bidding, and budget. You can edit later.
        </p>
      </header>

      {/* Card */}
      <main className="max-w-3xl mx-auto px-6 pb-16">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 shadow-2xl backdrop-blur-sm">
          <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-200">Name</label>
              <input
                type="text"
                className="w-full rounded-xl bg-neutral-800 px-3 py-2 outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-indigo-400 placeholder:text-neutral-400"
                placeholder="Ex: Summer Launch – Social US"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="mt-1 text-xs text-neutral-400">
                Nom interne visible dans votre dashboard.
              </p>
            </div>

            {/* Objective */}
            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-200">Objective</label>
              <select
                className="w-full rounded-xl bg-neutral-800 px-3 py-2 outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-indigo-400"
                value={objective}
                onChange={(e) => setObjective(e.target.value as Objective)}
              >
                <option value="CTR">CTR (Clicks)</option>
                <option value="LEAD">LEAD (Conversions)</option>
                <option value="VIEW">VIEW (Impressions)</option>
              </select>
              <p className="mt-1 text-xs text-neutral-400">{helperObjective}</p>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-200">Budget (cents)</label>
              <input
                type="number"
                min={0}
                className="w-full rounded-xl bg-neutral-800 px-3 py-2 outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-indigo-400"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
              <p className="mt-1 text-xs text-neutral-400">
                {Number.isFinite(budget)
                  ? `≈ ${(budget / 100).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`
                  : '—'}
              </p>
            </div>

            {/* Bids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-200">CPC (optional)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-xl bg-neutral-800 px-3 py-2 outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-indigo-400 placeholder:text-neutral-400"
                  placeholder="Ex: 120 (cents)"
                  value={cpc}
                  onChange={(e) => setCpc(e.target.value === '' ? '' : Number(e.target.value))}
                />
                <p className="mt-1 text-xs text-neutral-400">Recommandé pour CTR/LEAD.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-neutral-200">CPM (optional)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-xl bg-neutral-800 px-3 py-2 outline-none ring-1 ring-neutral-700 focus:ring-2 focus:ring-indigo-400 placeholder:text-neutral-400"
                  placeholder="Ex: 2500 (cents)"
                  value={cpm}
                  onChange={(e) => setCpm(e.target.value === '' ? '' : Number(e.target.value))}
                />
                <p className="mt-1 text-xs text-neutral-400">Recommandé pour VIEW.</p>
              </div>
            </div>

            {/* Targeting */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium mb-1 text-neutral-200">Targeting (JSON)</label>
                <span
                  className={
                    'text-[11px] px-2 py-0.5 rounded-full ring-1 ' +
                    (targetingState.ok
                      ? 'bg-emerald-900/30 text-emerald-300 ring-emerald-600/40'
                      : 'bg-rose-900/30 text-rose-300 ring-rose-600/40')
                  }
                >
                  {targetingState.ok ? 'Valid JSON' : 'Invalid JSON'}
                </span>
              </div>
              <textarea
                className={
                  'w-full rounded-xl px-3 py-2 outline-none min-h-[120px] ' +
                  (targetingState.ok
                    ? 'bg-neutral-800 ring-1 ring-neutral-700 focus:ring-2 focus:ring-emerald-400'
                    : 'bg-neutral-800 ring-1 ring-rose-600 focus:ring-2 focus:ring-rose-500')
                }
                value={targeting}
                onChange={(e) => setTargeting(e.target.value)}
                spellCheck={false}
              />
              <p className="mt-1 text-xs text-neutral-400">
                Exemple: {'{ "interests": ["tech","food"], "countries": ["US","FR"] }'}
              </p>
            </div>

            {/* Errors */}
            {error && (
              <div className="rounded-xl border border-rose-600/40 bg-rose-950/40 p-3 text-rose-200" role="alert">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 px-4 py-3 font-bold tracking-wide shadow-lg hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="relative z-10">{loading ? 'Creating…' : 'Create Campaign'}</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 opacity-0 transition group-hover:opacity-100 group-hover:translate-x-0" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
