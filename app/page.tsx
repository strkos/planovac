import { EnvironmentBadge } from "@/components/environment-badge";
import { getEnvironmentConfig } from "@/lib/env";

const nextSteps = [
  "Pripravit Supabase baseline, migrace a seed data v ramci F0-04.",
  "Navazat GitHub CI a Vercel deployment v ramci F0-05 a F0-06.",
  "Dopsat smoke overeni a rollback postup v ramci F0-07.",
];

export default function HomePage() {
  const environment = getEnvironmentConfig();
  const shortCommitSha = environment.commitSha?.slice(0, 7) ?? null;

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-header">
          <div>
            <p className="eyebrow">planovac / F0-03</p>
            <h1>Konfigurace prostredi je pripravena pro dalsi fazi.</h1>
          </div>
          <EnvironmentBadge />
        </div>
        <p className="lead">
          Tato stranka overuje, ze repozitar obsahuje nasaditelny app shell v
          Next.js App Router, vzorovy soubor <code>.env.example</code> a
          zretelne rozliseni rezimu local, preview a production.
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
            pripraveny lint i build.
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
                Preview a production musi mit rozdilne URL i oddelene neveřejne
                konfigurace.
              </dd>
            </div>
          </dl>
        </article>

        <article className="card">
          <h2>Struktura repozitare</h2>
          <ul>
            <li>
              <code>lib/</code> pro sdilene utility
            </li>
            <li>
              <code>tests/smoke/</code> pro smoke overeni
            </li>
            <li>
              <code>supabase/</code> pro migrace a seed data
            </li>
            <li>
              <code>docs/provoz/</code> pro provozni dokumentaci
            </li>
          </ul>
        </article>
      </section>

      <section className="card next-steps">
        <h2>F0-03 vystupy</h2>
        <ul>
          <li>
            <code>.env.example</code> jako vychozi sablona pro lokalni setup
          </li>
          <li>
            <code>docs/provoz/konfigurace-prostredi.md</code> jako matice
            promennych a vlastnictvi secretu
          </li>
          <li>jednotna detekce prostredi v aplikaci i v UI</li>
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
