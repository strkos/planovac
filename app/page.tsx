import { EnvironmentBadge } from "@/components/environment-badge";
import { getEnvironmentConfig } from "@/lib/env";

const nextSteps = [
  "Propojit Vercel preview a production konfiguraci v ramci F0-06.",
  "Dopsat smoke overeni migraci, seedu a aplikace v ramci F0-07.",
  "Overit prvni zkuseni delivery pruchod pres PR a merge v ramci F0-08.",
];

const currentOutputs = [
  ".github/workflows/ci.yml s joby install, lint, build a validate-supabase",
  "npm skripty pro validaci .env.example a Supabase artefaktu",
  "prvni verzovana SQL migrace v supabase/migrations/",
  "demo seed dataset v supabase/seed/seed.sql",
];

export default function HomePage() {
  const environment = getEnvironmentConfig();
  const shortCommitSha = environment.commitSha?.slice(0, 7) ?? null;

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-header">
          <div>
            <p className="eyebrow">planovac / F0-05</p>
            <h1>GitHub CI hlida aplikaci, konfiguraci i databazove artefakty.</h1>
          </div>
          <EnvironmentBadge />
        </div>
        <p className="lead">
          Tato stranka overuje, ze repozitar vedle minimalni Next.js aplikace a
          prvniho Supabase baseline obsahuje i GitHub CI workflow pro pull
          requesty, ktere kontroluje lint, build, zakladni konfiguraci a
          databazove artefakty.
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
            pripraveny lint, build, CI workflow a strukturu pro navazujici
            databazove iterace.
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
          <h2>GitHub CI</h2>
          <p>
            Pull requesty do <code>main</code> nove spousteji samostatne status
            checks pro instalaci zavislosti, lint, build a validaci
            databazovych artefaktu.
          </p>
          <dl className="env-properties">
            <div className="env-property">
              <dt>Workflow</dt>
              <dd>
                <code>.github/workflows/ci.yml</code>
              </dd>
            </div>
            <div className="env-property">
              <dt>Status checks</dt>
              <dd>
                <code>install</code>, <code>lint</code>, <code>build</code>,{" "}
                <code>validate-supabase</code>
              </dd>
            </div>
            <div className="env-property">
              <dt>Repo validace</dt>
              <dd>
                <code>npm run ci:validate</code> overuje{" "}
                <code>.env.example</code> i Supabase adresare.
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
        <h2>Aktualni vystupy faze 0</h2>
        <ul>
          {currentOutputs.map((item) => (
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
