import { useRef, useState } from 'react';
import { Check, Minus, X, ExternalLink, Loader2 } from 'lucide-react';
import styles from './FitCheck.module.css';

/** One corpus entry the server verified before sending it back. */
type Evidence = {
  id: string;
  label: string;
  detail: string;
  href: string | null;
};

type Tier = 'match' | 'partial' | 'gap';

type Requirement = {
  requirement: string;
  tier: Tier;
  claim: string;
  note: string;
  evidence: Evidence[];
};

type FitResult = {
  role: string;
  requirements: Requirement[];
  counts: Record<Tier, number>;
};

const TIER_META: Record<Tier, { icon: typeof Check; word: string }> = {
  match: { icon: Check, word: 'Evidence' },
  partial: { icon: Minus, word: 'Partial' },
  gap: { icon: X, word: 'No evidence' },
};

const MIN_CHARS = 40;

export function FitCheck() {
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<FitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const tooShort = jd.trim().length < MIN_CHARS;

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tooShort || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/fit-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Fit Check is temporarily unavailable.');
      setResult(data as FitResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.band} aria-labelledby="fitcheck-title">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Fit check</p>
        <h2 id="fitcheck-title" className={styles.title}>
          Paste your job description. I will show you the receipts, and the gaps.
        </h2>
        <p className={styles.lede}>
          Every strength below has to cite something I actually built. Anything I cannot back up
          gets marked as a gap instead of dressed up. That includes the parts where the answer is
          no.
        </p>

        <form className={styles.form} onSubmit={run}>
          <label className={styles.srOnly} htmlFor="fitcheck-jd">
            Job description
          </label>
          <textarea
            id="fitcheck-jd"
            className={styles.textarea}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the role requirements here..."
            rows={6}
            maxLength={6000}
          />
          <div className={styles.actions}>
            <span className={styles.hint}>
              {loading
                ? 'Reading the role, this takes about 30 seconds.'
                : tooShort
                  ? 'Paste at least a few lines.'
                  : `${jd.trim().length} characters`}
            </span>
            <button type="submit" className={styles.submit} disabled={tooShort || loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className={styles.spin} aria-hidden />
                  Checking
                </>
              ) : (
                'Run fit check'
              )}
            </button>
          </div>
        </form>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <div ref={resultRef} aria-live="polite">
          {result && <Results result={result} />}
        </div>
      </div>
    </section>
  );
}

function Results({ result }: { result: FitResult }) {
  const { counts } = result;
  return (
    <div className={styles.results}>
      <p className={styles.summary}>
        {result.role ? <strong>{result.role}: </strong> : null}
        <span className={styles.countMatch}>{counts.match} evidenced</span>
        {' / '}
        <span className={styles.countPartial}>{counts.partial} partial</span>
        {' / '}
        <span className={styles.countGap}>{counts.gap} gaps</span>
      </p>

      <ul className={styles.list}>
        {result.requirements.map((r) => {
          const meta = TIER_META[r.tier];
          const Icon = meta.icon;
          return (
            <li key={r.requirement} className={`${styles.row} ${styles[r.tier]}`}>
              <div className={styles.rowHead}>
                <span className={styles.badge} data-tier={r.tier}>
                  <Icon size={13} aria-hidden />
                  <span className={styles.srOnly}>{meta.word}</span>
                </span>
                <h3 className={styles.req}>{r.requirement}</h3>
              </div>

              {r.claim && <p className={styles.claim}>{r.claim}</p>}

              {r.evidence.length > 0 && (
                <ul className={styles.receipts}>
                  {r.evidence.map((ev) => (
                    <li key={ev.id} className={styles.receipt}>
                      <span className={styles.receiptLabel}>{ev.label}</span>
                      <span className={styles.receiptDetail}>{ev.detail}</span>
                      {ev.href && (
                        <a
                          className={styles.receiptLink}
                          href={ev.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Check it
                          <ExternalLink size={12} aria-hidden />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {r.note && <p className={styles.note}>{r.note}</p>}
            </li>
          );
        })}
      </ul>

      <p className={styles.footnote}>
        Generated from a fixed list of things I have shipped. The model cannot cite anything outside
        that list, and any claim it fails to cite is downgraded before it reaches this page.
      </p>
    </div>
  );
}
