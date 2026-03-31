import { EnvironmentBadge } from "@/components/environment-badge";
import { getEnvironmentConfig } from "@/lib/env";

const nextSteps = [
  "Navazat GitHub CI s kontrolou databazovych artefaktu v ramci F0-05.",
  "Propojit Vercel preview a production konfiguraci v ramci F0-06.",
  "Dopsat smoke overeni migraci, seedu a aplikace v ramci F0-07.",
];

const f004Outputs = [
  ".env.example s doplnenym prefixem preview schema",
  "prvni verzovana SQL migrace v supabase/migrations/",
  "demo seed dataset v supabase/seed/seed.sql",
  "provozni dokument k preview schema workflow a anonymizaci",
];

export default function HomePage() {
  const environment = getEnvironmentConfig();
  const shortCommitSha = environment.commitSha?.slice(0, 7) ?? null;

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-header">
          <div>
            <p className="eyebrow">planovac / F0-04</p>
            <h1>Supabase baseline je pripraveny pro dalsi delivery faze.</h1>
          </div>
          <EnvironmentBadge />
        </div>
        <p className="lead">
          Tato stranka overuje, ze repozitar vedle minimalni Next.js aplikace
          obsahuje i prvni verzovany Supabase baseline, demo seed data a
          provozni pravidla pro preview schema workflow.
        </p>
        <div className="hero-meta" aria-label="Diagnostika prostredi">
          <p>
            Zdroj detekce: <code>{environment.source}</code> ={" "}
            <code>{environment.sourceValue}</code>
          </p>
          <p>
            Zakladni URL:{" "}
            <code>{environment.baseUrl ?? "neni nastavena"}</code>
          </p>
          <p>
            Deployment URL:{" "}
            <code>{environment.deploymentUrl ?? "neni k dispozici"}</code>
          </p>
          <p>
            Commit: <code>{shortCommitSha ?? "neni k dispozici"}</code>
          </p>
        </div>
      </section>

      <section className="status-grid" aria-label="Stav repozitare">
        <article className="card">
          <h2>Aplikace</h2>
          <p>
            App Router bezi z adresare <code>app/</code> a repozitar ma
            pripraveny lint, build i strukturu pro navazujici databazove
            iterace.
          </p>
        </article>

        <article className="card">
          <h2>Prostredi</h2>
          <p>
            {environment.description}
          </p>
          <dl className="env-properties">
            <div className="env-property">
              <dt>Explicitni rezim</dt>
              <dd>
                <code>NEXT_PUBLIC_APP_ENV</code> ma prednost pred fallbackem z
                platformy.
              </dd>
            </div>
            <div className="env-property">
              <dt>Fallback</dt>
              <dd>
                Pokud chybi explicitni hodnota, aplikace pouzije{" "}
                <code>VERCEL_ENV</code> a az potom <code>NODE_ENV</code>.
              </dd>
            </div>
            <div className="env-property">
              <dt>Pravidlo</dt>
              <dd>
                Preview a production musi mit rozdilne URL i oddelene neverejne
                konfigurace.
              </dd>
            </div>
          </dl>
        </article>

        <article className="card">
          <h2>Databazovy baseline</h2>
          <p>
            Supabase baseline pokryva prvni domenove entity, provozni metadata
            preview schemat a demo data pro lokalni vyvoj.
          </p>
          <dl className="env-properties">
            <div className="env-property">
              <dt>Migrace</dt>
              <dd>
                <code>supabase/migrations/20260331120000_f0_04_supabase_baseline.sql</code>
              </dd>
            </div>
            <div className="env-property">
              <dt>Seed</dt>
              <dd>
                <code>supabase/seed/seed.sql</code>
              </dd>
            </div>
            <div className="env-property">
              <dt>Preview workflow</dt>
              <dd>
                <code>docs/provoz/supabase-baseline-a-preview-schema.md</code>
              </dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="card next-steps">
        <h2>F0-04 vystupy</h2>
        <ul>
          {f004Outputs.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card next-steps">
        <h2>Dalsi kroky</h2>
        <ol>
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
