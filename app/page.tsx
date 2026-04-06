import { EnvironmentBadge } from "@/components/environment-badge";
import { getAuthConfig } from "@/lib/auth-config";
import { getEnvironmentConfig } from "@/lib/env";

const confirmedDecisions = [
  "Auth vrstva zustava v Supabase Auth bez externiho poskytovatele identity.",
  "Prvni prihlaseni pouziva email + magic link.",
  "Po uspesnem callbacku ma Uzivatel smerovat do chranene casti na /app.",
  "Prvni ucty se zakladaji rizene v Supabase Auth; samoobsluzna registrace se zatim nepovoluje.",
  "Role admin a clen se budou cist server-side z minimalni access tabulky v Supabase.",
];

const configurationOwners = [
  "Lokalni .env.local spravuje vyvojar nebo agent v danem prostredi.",
  "Preview a production verejne hodnoty spravuje Vercel environment konfigurace.",
  "Redirect allowlist, email login a magic link sablony spravuje spravce daneho Supabase projektu.",
  "Soukromy seznam testovacich identit a mailbox pristupu zustava mimo git.",
];

const identityBootstrapSteps = [
  "Pro kazde prostredi pripravit jednu ucelovou identitu admin a jednu identitu clen.",
  "V access tabulce vest normalizovany email, roli admin nebo clen a priznak aktivniho pristupu.",
  "Pristup k mailboxum nebo magic linkum neukladat do repozitare.",
  "Pro unauthorized scenar pouzit autentizovanou identitu bez aktivniho zaznamu v access tabulce.",
];

const nextSteps = [
  "F1-02 muze navazat verejnym login/logout tokem a callback routou.",
  "F1-03 muze pouzit odvozene callback URL a guardy pro /app.",
  "F1-04 muze implementovat server-side lookup role admin a clen bez zmeny auth smeru.",
];

const documentationArtifacts = [
  "docs/provoz/f1-01-auth-vstupy-a-rozhodnuti.md",
  "docs/provoz/konfigurace-prostredi.md",
  "docs/provoz/lokalni-start.md",
  "docs/faze-1-minimalni-aplikacni-kostra.md",
];

const redirectLabels = {
  local: "local",
  preview: "preview",
  production: "production",
} as const;

export default function HomePage() {
  const environment = getEnvironmentConfig();
  const auth = getAuthConfig();
  const shortCommitSha = environment.commitSha?.slice(0, 7) ?? null;
  const healthUrl = `${environment.baseUrl ?? "http://localhost:3000"}/api/health`;
  const redirectTargets = Object.entries(auth.recommendedRedirects).map(([key, value]) => ({
    key,
    label: redirectLabels[key as keyof typeof redirectLabels],
    value,
  }));

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-header">
          <div>
            <p className="eyebrow">planovac / F1-01</p>
            <h1>Auth vstupy a rozhodnuti pro fazi 1 jsou zapsane, validovane a dohledatelne.</h1>
            <p className="eyebrow">planovac / F0-07</p>
          </div>
          <EnvironmentBadge />
        </div>
        <p className="lead">
          F1-01 uzavira auth smer pro dalsi implementaci: Supabase Auth, email +
          magic link, jasne redirect URL, rizeny bootstrap prvnich identit a
          server-side zdroj role.{" "}
          {"Smoke scenar a diagnostika maji byt dohledatelne z aplikace i runtime endpointu."}
        </p>
        <div className="hero-meta" aria-label="Diagnostika auth vstupu">
          <p>
            Zdroj detekce prostredi: <code>{environment.source}</code> ={" "}
            <code>{environment.sourceValue}</code>
          </p>
          <p>
            Zakladni URL aplikace: <code>{environment.baseUrl ?? "neni nastavena"}</code>
          </p>
          <p>
            Redirect path: <code>{auth.redirectPath ?? "neni nastavena"}</code>
          </p>
          <p>
            Aktualni callback URL: <code>{auth.callbackUrl ?? "nejde odvodit"}</code>
          </p>
          <p>
            Zdroj role: <code>{auth.roleSource}</code>
          </p>
          <p>
            Commit: <code>{shortCommitSha ?? "neni k dispozici"}</code>
          </p>
        </div>
        <div className="status-pill-row" aria-label="Souhrn auth pripravenosti">
          <span className="status-pill" data-variant={auth.status === "pass" ? "success" : "warning"}>
            {auth.isReady
              ? "Auth vstupy jsou pro dalsi implementaci runtime pripraveny."
              : "Auth smer je potvrzeny, ale runtime stale ceka na skutecne konfiguracni hodnoty."}
          </span>
          <span className="status-pill" data-variant="info">
            Provider: <code>{auth.provider}</code>
          </span>
          <span className="status-pill" data-variant="info">
            Prihlaseni: <code>{auth.signInMethod}</code>
          </span>
          <span className="status-pill" data-variant="info">
            Ucty: <code>{auth.accountProvisioning}</code>
          </span>
        </div>
      </section>

      <section className="status-grid" aria-label="Potvrzena rozhodnuti F1-01">
        <article className="card">
          <h2>Potvrzena auth rozhodnuti</h2>
          <ul>
            {confirmedDecisions.map((decision) => (
              <li key={decision}>{decision}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Redirect URL pro local, preview a production</h2>
          <dl className="env-properties">
            {redirectTargets.map((target) => (
              <div key={target.key} className="env-property">
                <dt>{target.label}</dt>
                <dd>
                  <code>{target.value}</code>
                </dd>
              </div>
            ))}
            <div className="env-property">
              <dt>Neuspesny navrat</dt>
              <dd>
                Po neplatnem nebo expirovanem magic linku se Uzivatel vraci do
                verejne zony na <code>{auth.failureReturnUrl}</code>.
              </dd>
            </div>
          </dl>
        </article>

        <article className="card">
          <h2>Vlastnictvi konfigurace</h2>
          <ul>
            {configurationOwners.map((owner) => (
              <li key={owner}>{owner}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Bootstrap testovacich identit</h2>
          <ol>
            {identityBootstrapSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="status-grid" aria-label="Runtime diagnostika F1-01">
        <article className="card">
          <h2>Runtime pripravenost auth vstupu</h2>
          <ul className="status-list">
            {auth.checks.map((check) => (
              <li key={check.id} className="status-item" data-status={check.status}>
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
          <h2>Zdravotni endpoint</h2>
          <p>
            Endpoint <code>/api/health</code> dale vraci runtime diagnostiku
            prostredi a nove i sekci <code>auth</code>, aby reviewer videl stejne
            auth vstupy v HTML i ve strojove citelnem JSON payloadu.
          </p>
          <dl className="env-properties">
            <div className="env-property">
              <dt>URL</dt>
              <dd>
                <code>{healthUrl}</code>
              </dd>
            </div>
            <div className="env-property">
              <dt>HTTP status</dt>
              <dd>
                <code>200</code> pri konzistentnim mapovani prostredi, jinak{" "}
                <code>503</code>.
              </dd>
            </div>
            <div className="env-property">
              <dt>Payload</dt>
              <dd>
                Obsahuje <code>environment</code>, <code>baseUrl</code>,{" "}
                <code>commitSha</code>, <code>checks</code> a nove i objekt{" "}
                <code>auth</code> s redirectem, callback URL a auth kontrolami.
              </dd>
            </div>
          </dl>
        </article>

        <article className="card">
          <h2>Diagnostika prostredi z faze 0</h2>
          <p>{environment.description}</p>
          <ul className="status-list">
            {environment.checks.map((check) => (
              <li key={check.id} className="status-item" data-status={check.status}>
                <span className="status-dot" aria-hidden="true" />
                <div>
                  <strong>{check.label}</strong>
                  <p>{check.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="card">
        <h2>Co F1-01 odblokovava</h2>
        <ol>
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="card">
        <h2>Dokumentacni artefakty</h2>
        <ul>
          {documentationArtifacts.map((artifact) => (
            <li key={artifact}>
              <code>{artifact}</code>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
