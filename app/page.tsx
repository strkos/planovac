import { EnvironmentBadge } from "@/components/environment-badge";

const nextSteps = [
  "Doplnit konfiguraci prostredi a .env.example v ramci F0-03.",
  "Pripravit Supabase baseline, migrace a seed data v ramci F0-04.",
  "Navazat GitHub CI a Vercel deployment v ramci F0-05 a F0-06.",
];

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">planovac / F0-02</p>
        <h1>Minimalni aplikacni kostra je pripravena.</h1>
        <p className="lead">
          Tato stranka overuje, ze repozitar obsahuje nasaditelny app shell v
          Next.js App Router a zakladni strukturu pro dalsi implementaci.
        </p>
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
            Aktualni rezim: <EnvironmentBadge />
          </p>
          <p>
            Jemnejsi rozliseni local / preview / production bude dopsano v
            navazujici konfiguraci prostredi.
          </p>
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
