import { EnvironmentBadge } from "@/components/environment-badge";
import { getEnvironmentConfig } from "@/lib/env";

const nextSteps = [
  "Dopsat smoke overeni migraci, seedu a aplikace v ramci F0-07.",
  "Po merge do main potvrdit, ze stejny commit a diagnostika dosly i do production v ramci F0-08.",
];

const currentOutputs = [
  ".github/workflows/ci.yml s joby install, lint, build a validate-supabase",
  "npm skripty pro validaci .env.example a Supabase artefaktu",
  "prvni verzovana SQL migrace v supabase/migrations/",
  "demo seed dataset v supabase/seed/seed.sql",
  "repo-side Vercel konfigurace ve vercel.json a runbook pro preview/production",
  "zkusebni F0-08 evidence panel pro PR preview a navazujici merge do main",
];

export default function HomePage() {
  const environment = getEnvironmentConfig();
  const shortCommitSha = environment.commitSha?.slice(0, 7) ?? null;
  const deliveryRunChecks = [
    {
      label: "Zmena je zamerne minimalni",
      status: "pass" as const,
      detail:
        "Domovska stranka a provozni dokumentace rozsiruji dohledatelnost delivery bez zasahu do domenoveho chovani aplikace.",
    },
    {
      label: "Pull request ma citelne preview dukazy",
      status:
        environment.environment === "preview" || environment.environment === "production"
          ? ("pass" as const)
          : ("warning" as const),
      detail:
        environment.environment === "preview"
          ? `Preview bezi pro vetev ${environment.gitCommitRef ?? "neznamou"} a ukazuje commit ${shortCommitSha ?? "neni k dispozici"}.`
          : environment.environment === "production"
            ? `Tento commit uz dosel i mimo preview; dohledatelnost zustava zachovana pres commit ${shortCommitSha ?? "neni k dispozici"}.`
            : "Po otevreni PR zkontrolujte status checks, preview URL, branch ref a commit SHA na teto strance.",
    },
    {
      label: "Merge do main musi potvrdit production deployment",
      status:
        environment.environment === "production" ? ("pass" as const) : ("warning" as const),
      detail:
        environment.environment === "production"
          ? `Production runtime potvrzuje release na commitu ${shortCommitSha ?? "neni k dispozici"} a ma mit stejnou dohledatelnost jako preview.`
          : "Po merge do main overte, ze se stejny commit objevil v production a badge se prepne na production.",
    },
  ];

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-header">
          <div>
            <p className="eyebrow">planovac / F0-08</p>
            <h1>Zkusebni delivery pruchod ma jasne dukazy pro PR preview i merge do main.</h1>
          </div>
          <EnvironmentBadge />
        </div>
        <p className="lead">
          Tato stranka navazuje na GitHub CI, Supabase baseline a Vercel integraci
          z predchozich kroku faze 0 a slouzi jako zamerne mala zmena pro
          zkusebni delivery pruchod. Reviewer i organizator diky ni mohou
          porovnat branch ref, URL a commit mezi preview a production verzi.
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
            Branch deployment URL:{" "}
            <code>{environment.branchUrl ?? "neni k dispozici"}</code>
          </p>
          <p>
            Produkcni URL projektu:{" "}
            <code>{environment.productionUrl ?? "neni k dispozici"}</code>
          </p>
          <p>
            Git ref: <code>{environment.gitCommitRef ?? "neni k dispozici"}</code>
          </p>
          <p>
            Commit: <code>{shortCommitSha ?? "neni k dispozici"}</code>
          </p>
        </div>
        <div className="status-pill-row" aria-label="Souhrn stavu integrace">
          <span
            className="status-pill"
            data-variant={environment.isConsistent ? "success" : "warning"}
          >
            {environment.isConsistent
              ? "Mapovani preview a production pusobi konzistentne."
              : "Diagnostika nasla riziko v mapovani preview nebo production."}
          </span>
          <span className="status-pill" data-variant="info">
            Zdroj base URL: <code>{environment.baseUrlSource}</code>
          </span>
        </div>
      </section>

      <section className="status-grid" aria-label="Stav repozitare">
        <article className="card">
          <h2>Aplikace</h2>
          <p>
            App Router bezi z adresare <code>app/</code> a repozitar ma
            pripraveny lint, build, CI workflow, Vercel konfiguraci a strukturu
            pro navazujici databazove iterace.
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
                <code>VERCEL_TARGET_ENV</code>, potom <code>VERCEL_ENV</code> a
                az nakonec <code>NODE_ENV</code>.
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
          <h2>Vercel integrace</h2>
          <p>
            Pull requesty maji vznikat jako preview deployment a merge do{" "}
            <code>main</code> ma vest na production deployment se samostatnou
            konfiguraci i URL.
          </p>
          <dl className="env-properties">
            <div className="env-property">
              <dt>Repo konfigurace</dt>
              <dd>
                <code>vercel.json</code> nastavuje Next.js preset a prikazuje
                instalaci pres <code>npm ci</code>.
              </dd>
            </div>
            <div className="env-property">
              <dt>Mapovani vetvi</dt>
              <dd>
                Produkcni branch zustava <code>main</code>; ostatni vetve a pull
                requesty maji smerovat do preview.
              </dd>
            </div>
            <div className="env-property">
              <dt>Promenne</dt>
              <dd>
                Preview a production pouzivaji odlisne hodnoty{" "}
                <code>NEXT_PUBLIC_APP_ENV</code> a{" "}
                <code>NEXT_PUBLIC_APP_BASE_URL</code>.
              </dd>
            </div>
            <div className="env-property">
              <dt>Diagnostika</dt>
              <dd>
                Nasazena aplikace zobrazuje ref, deployment URL, produkcni URL a
                commit SHA pro dohledatelnost release.
              </dd>
            </div>
          </dl>
        </article>

        <article className="card">
          <h2>GitHub CI a databaze</h2>
          <p>
            GitHub CI dal hlida build a repozitarove artefakty, zatimco
            Supabase baseline pripravuje migrace, preview metadata a demo data
            pro navazujici preview workflow.
          </p>
          <dl className="env-properties">
            <div className="env-property">
              <dt>CI workflow</dt>
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
              <dt>Preview schema workflow</dt>
              <dd>
                <code>docs/provoz/supabase-baseline-a-preview-schema.md</code>
              </dd>
            </div>
            <div className="env-property">
              <dt>Baseline migrace</dt>
              <dd>
                <code>supabase/migrations/20260331120000_f0_04_supabase_baseline.sql</code>
              </dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="status-grid" aria-label="Kontroly integrace">
        <article className="card">
          <h2>Kontrola Vercel mapovani</h2>
          <ul className="status-list">
            {environment.checks.map((check) => (
              <li key={check.label} className="status-item" data-status={check.status}>
                <span className="status-dot" aria-hidden="true" />
                <div>
                  <strong>{check.label}</strong>
                  <p>{check.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Mapovani promennych do Vercelu</h2>
          <dl className="env-properties">
            <div className="env-property">
              <dt>Preview</dt>
              <dd>
                <code>NEXT_PUBLIC_APP_ENV=preview</code> a{" "}
                <code>NEXT_PUBLIC_APP_BASE_URL</code> ma smerovat na preview
                host.
              </dd>
            </div>
            <div className="env-property">
              <dt>Production</dt>
              <dd>
                <code>NEXT_PUBLIC_APP_ENV=production</code> a{" "}
                <code>NEXT_PUBLIC_APP_BASE_URL</code> ma smerovat na produkcni
                domenu.
              </dd>
            </div>
            <div className="env-property">
              <dt>System env vars</dt>
              <dd>
                Ve Vercelu ma zustat zapnute automaticke vystaveni systemovych
                promennych pro diagnostiku v Next.js runtime.
              </dd>
            </div>
            <div className="env-property">
              <dt>Oddeleni dat</dt>
              <dd>
                Neverejne Supabase klice a preview schema prefix musi byt pro
                preview a production spravovane oddelene.
              </dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="status-grid" aria-label="Zkusebni delivery pruchod">
        <article className="card">
          <h2>F0-08: Zkusebni delivery pruchod</h2>
          <p>
            Tato iterace zamerne nepridava novou domenovou funkcionalitu. Misto
            toho vytvari citelny dukaz, ze mala zmena umi projit pres pull
            request, preview deployment a navazujici merge do <code>main</code>.
          </p>
          <ul className="status-list">
            {deliveryRunChecks.map((check) => (
              <li key={check.label} className="status-item" data-status={check.status}>
                <span className="status-dot" aria-hidden="true" />
                <div>
                  <strong>{check.label}</strong>
                  <p>{check.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Co ma reviewer overit</h2>
          <dl className="env-properties">
            <div className="env-property">
              <dt>V pull requestu</dt>
              <dd>
                Uspesne status checks <code>install</code>, <code>lint</code>,{" "}
                <code>build</code> a <code>validate-supabase</code>.
              </dd>
            </div>
            <div className="env-property">
              <dt>V preview verzi</dt>
              <dd>
                Preview URL, zdrojovou vetev, commit SHA a odliseni preview od
                production.
              </dd>
            </div>
            <div className="env-property">
              <dt>Po merge do main</dt>
              <dd>
                Stejny commit v production, badge <code>production</code> a
                dohledatelnou produkcni URL.
              </dd>
            </div>
            <div className="env-property">
              <dt>Runbook</dt>
              <dd>
                <code>docs/provoz/zkusebni-delivery-pruchod.md</code>
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
