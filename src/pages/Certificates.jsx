import { CertificateCard } from '../components/Cards.jsx';
import { SectionHead } from '../components/Layout.jsx';
import { CERTIFICATES } from '../data.js';
import { useSeo } from '../lib/seo.js';

export default function Certificates() {
  useSeo({
    title: 'Certificates',
    description:
      "Credentials and presentations, each with its issuer and, where one exists, the issuer's verification link.",
    path: '/certificates',
  });

  return (
    <main className="page wrap" id="main" tabIndex={-1}>
      <SectionHead title="Certificates" aside="newest first" />
      <p className="measure" style={{ fontSize: 18, marginTop: 0 }}>
        Credentials with their issuer&apos;s verification link where one exists. Entries without a link are shown as
        issued, never as verified; entries still being earned say so.
      </p>
      <div className="grid-3">
        {CERTIFICATES.map((c) => (
          <CertificateCard key={c.title} c={c} />
        ))}
      </div>
    </main>
  );
}
