import React from 'react';
import { Link } from 'react-router-dom';
import { LBRHE } from './lbrhe-data';
import { HBar, Lollipop, Donut, PairBars, Stat, PumaMap } from './lbrhe-charts';
import { MONO } from '../data';

export default function LBRHEPage({ theme, fontStack }) {
  const { ink, accent, paper, panel } = theme;
  const L = LBRHE;
  const serif = fontStack.serif;
  const display = fontStack.display || serif;
  const mono = MONO;

  const SectionHead = ({ num, title, kicker }) => (
    <div className="section-head" style={{
      borderTop: `2px solid ${ink}`, paddingTop: 14, marginTop: 56, marginBottom: 24,
      display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24, alignItems: 'baseline',
    }}>
      <div style={{
        fontFamily: mono, fontSize: 10, letterSpacing: '0.2em',
        textTransform: 'uppercase', color: accent,
      }}>§ {num} · {kicker}</div>
      <h2 style={{
        margin: 0, fontFamily: display, fontWeight: 400, fontSize: 36,
        letterSpacing: '-0.012em', lineHeight: 1.05, fontStyle: 'italic',
        color: ink, textWrap: 'balance',
      }}>{title}</h2>
    </div>
  );

  const Caption = ({ children }) => (
    <figcaption style={{
      fontFamily: serif, fontStyle: 'italic', fontSize: 12.5,
      color: `${ink}99`, marginTop: 8, lineHeight: 1.5, maxWidth: '40em',
    }}>{children}</figcaption>
  );

  const Marginalium = ({ kicker, children }) => (
    <div style={{
      fontFamily: serif, fontSize: 13, lineHeight: 1.55,
      color: `${ink}c0`, paddingLeft: 14,
      borderLeft: `0.5px dashed ${ink}66`,
    }}>
      <div style={{
        fontFamily: mono, fontSize: 9.5, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: accent, marginBottom: 6,
      }}>{kicker}</div>
      <div style={{ fontStyle: 'italic' }}>{children}</div>
    </div>
  );

  return (
    <div style={{
      background: paper, color: ink, fontFamily: serif, minHeight: '100vh',
      padding: '0 0 120px', position: 'relative',
    }}>
      {/* Nav */}
      <nav className="lbrhe-nav" style={{
        padding: '20px 64px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: mono, fontSize: 10.5, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: `${ink}99`,
        borderBottom: `0.5px solid ${ink}33`,
      }}>
        <Link to="/" style={{ color: accent }}>← Andy · Portfolio Index</Link>
        <span>Working Paper № I · Civic Analytics · 2025</span>
        <span>Long Beach, CA</span>
      </nav>

      {/* Title spread */}
      <header className="lbrhe-header" style={{ padding: '64px 64px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          fontFamily: mono, fontSize: 10, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: accent, marginBottom: 22,
        }}>A research portfolio · Working paper № I</div>
        <h1 style={{
          fontFamily: display, fontWeight: 400, fontSize: 96,
          lineHeight: 0.96, letterSpacing: '-0.025em', margin: 0,
          textWrap: 'balance',
        }}>
          Racial &amp; Health Equity<br/>
          in the City of <em style={{ color: accent, fontStyle: 'italic' }}>Long Beach</em>.
        </h1>
        <p style={{
          marginTop: 30, fontSize: 22, lineHeight: 1.45,
          color: `${ink}cc`, maxWidth: '38em', fontStyle: 'italic',
        }}>{L.META.subtitle}</p>

        <div className="meta-grid" style={{
          marginTop: 40,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28,
          paddingTop: 20, borderTop: `0.5px solid ${ink}33`,
        }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}88`, marginBottom: 4 }}>Author of this page</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Andy Molina</div>
            <div style={{ fontSize: 12, color: `${ink}99`, fontStyle: 'italic' }}>Data Scientist · CSULB</div>
          </div>
          <div>
            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}88`, marginBottom: 4 }}>Community partner</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>{L.META.partner.split('·')[0]}</div>
            <div style={{ fontSize: 12, color: `${ink}99`, fontStyle: 'italic' }}>{L.META.partner.split('·')[1]}</div>
          </div>
          <div>
            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}88`, marginBottom: 4 }}>Faculty mentor</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Dr. Seungjoon Lee</div>
            <div style={{ fontSize: 12, color: `${ink}99`, fontStyle: 'italic' }}>Department of Mathematics &amp; Statistics · CSULB</div>
          </div>
          <div>
            <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}88`, marginBottom: 4 }}>Presented</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>CSULB Symposium</div>
            <div style={{ fontSize: 12, color: `${ink}99`, fontStyle: 'italic' }}>Poster № 28 · 19 Sept 2025</div>
          </div>
        </div>
      </header>

      {/* Abstract */}
      <section className="lbrhe-abstract" style={{
        background: panel, padding: '52px 64px',
        borderTop: `0.5px solid ${ink}22`, borderBottom: `0.5px solid ${ink}22`,
      }}>
        <div className="abstract-inner" style={{ maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: accent, marginBottom: 14 }}>Abstract</div>
            <p style={{ fontSize: 19, lineHeight: 1.55, margin: 0, color: ink, textWrap: 'pretty' }}>
              Equity in health, education, and economic opportunity remains
              a critical challenge for many urban communities. In Long Beach,
              racial and age disparities have been linked to gaps in educational
              attainment, poverty rates, and access to health care. This project,
              in collaboration with the City of Long Beach Department of Health
              &amp; Human Services, investigates racial and health equity
              challenges by exploring the Public Use Microdata Sample
              (<span style={{ fontStyle: 'italic' }}>PUMS</span>) data from the
              U.S. Census via the <span style={{ fontFamily: mono, fontSize: 16 }}>tidycensus</span> package.
              The study focuses on how race, age, and socioeconomic variables
              influence disparities in education, poverty, health coverage, and
              income across North, East, Central, and South regions. The final
              deliverables — interactive Tableau dashboards and infographics —
              aim to make hidden equity patterns more visible, interpretable,
              and actionable for community stakeholders.
            </p>
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 14, color: `${ink}99`, marginTop: 14 }}>
              — As recorded in the CSULB Student Research Symposium Book of Abstracts, № 28.
            </p>
          </div>
          <div style={{ border: `0.5px solid ${ink}55`, padding: 20, background: paper, position: 'relative' }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${ink}88`, marginBottom: 12 }}>Materia prima</div>
            <dl style={{ margin: 0, fontSize: 13, lineHeight: 1.7 }}>
              {[
                ['Source', L.META.data.source],
                ['Method', L.META.data.method],
                ['Volume', `${L.META.data.rows} rows · ${L.META.data.variables} variables`],
                ['Geographies', '4 PUMAs covering Long Beach (North, East, Central, South + Port)'],
                ['Years', '2021 + 2023 (cross-section + change)'],
                ['Output', '5 Tableau dashboards · 2 community infographics · 1 conference poster'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 10, paddingBottom: 8, marginBottom: 8, borderBottom: `0.5px dashed ${ink}33` }}>
                  <dt style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: `${ink}99` }}>{k}</dt>
                  <dd style={{ margin: 0, color: ink, fontStyle: 'italic' }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <main className="lbrhe-main" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 64px' }}>
        {/* § I The City */}
        <SectionHead num="I" kicker="The city, in five figures" title="A statistical portrait of Long Beach." />
        <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
          <Stat large value="494K" label="residents across the four PUMAs studied" sub="2023 ACS" {...theme} />
          <Stat large value="$96K" label="median household income, citywide" sub="ACS 1-year" {...theme} />
          <Stat large value="1 in 4" label="residents on Medicaid or other public assistance" sub="HINS4 + PAP" {...theme} />
          <Stat large value="6.5%" label="of residents have no health insurance" sub="HICOV" {...theme} />
          <Stat large value="14%" label="of residents live with a disability" sub="DIS" {...theme} />
        </div>

        <div className="three-col" style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40, alignItems: 'start' }}>
          <figure style={{ margin: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}99`, marginBottom: 8 }}>Fig. 1 · Race &amp; ethnicity</div>
            <Donut data={L.DEMOGRAPHICS.race} {...theme} size={200}
              palette={[accent, `${ink}cc`, `${ink}88`, `${ink}55`, `${ink}33`]} />
            <Caption>Long Beach is the most racially balanced major city in California — no group exceeds 41%.</Caption>
          </figure>
          <figure style={{ margin: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}99`, marginBottom: 8 }}>Fig. 2 · Household income class</div>
            <HBar data={L.DEMOGRAPHICS.income_class} {...theme}
              accentSet={[`${ink}33`, `${ink}55`, accent, `${ink}55`, `${ink}33`]} />
            <Caption>One third of households are middle-income; 35% sit below $70K and 31% above $140K.</Caption>
          </figure>
          <figure style={{ margin: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}99`, marginBottom: 8 }}>Fig. 3 · Educational attainment</div>
            <HBar data={L.DEMOGRAPHICS.education} {...theme}
              accentSet={[`${ink}55`, `${ink}55`, `${ink}55`, `${ink}55`, accent]} />
            <Caption>One in three adults holds a bachelor's degree or higher; one in seven did not finish high school.</Caption>
          </figure>
        </div>

        <div className="two-col" style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center' }}>
          <figure style={{ margin: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}99`, marginBottom: 8 }}>Fig. 4 · The four study geographies</div>
            <PumaMap {...theme} />
            <Caption>The study restricts itself to four U.S. Census PUMAs that together cover the City of Long Beach.</Caption>
          </figure>
          <div>
            <div style={{
              fontFamily: display, fontSize: 28, lineHeight: 1.3, fontStyle: 'italic',
              color: ink, textWrap: 'balance', marginBottom: 18,
            }}>
              "Equity is when everyone can reach their highest level of health and potential for a successful life, regardless of their background and identity."
            </div>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent }}>
              City of Long Beach · Office of Equity
            </div>
          </div>
        </div>

        {/* § II Method */}
        <SectionHead num="II" kicker="Method" title="From 5 million rows to 17 variables." />
        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: `${ink}d0`, marginTop: 0 }}>
              The American Community Survey publishes its Public Use Microdata
              Sample as person- and household-level records — 5,000,000+ rows
              for California, with more than 500 variables each. The first job was reduction: pull only the four PUMAs that cover
              Long Beach, then keep only the variables that actually map to
              lived equity — income, schooling, insurance, employment, housing,
              disability, internet access, food assistance.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: `${ink}d0` }}>
              The pipeline is written in R against the
              <span style={{ fontFamily: mono, fontSize: 15 }}> tidycensus </span>
              package, parameterized so any region can be re-run for any year
              with one call.
            </p>
          </div>
          <div style={{ background: panel, border: `0.5px solid ${ink}33`, padding: 24 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, marginBottom: 12 }}>Variable schema (17 of 500+)</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 13, color: `${ink}aa`, marginBottom: 6 }}>Global</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, fontFamily: mono, fontSize: 10 }}>
                {L.VARIABLES.global.map((v) => (
                  <span key={v.code} title={v.label}
                    style={{ padding: '3px 8px', border: `0.5px solid ${ink}55`, color: ink }}>{v.code}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 13, color: `${ink}aa`, marginBottom: 6 }}>Equity-related</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, fontFamily: mono, fontSize: 10 }}>
                {L.VARIABLES.equity.map((v) => (
                  <span key={v.code} title={v.label}
                    style={{ padding: '3px 8px', border: `0.5px solid ${ink}55`, color: ink }}>{v.code}</span>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 14, fontSize: 12, fontStyle: 'italic', color: `${ink}99`, lineHeight: 1.5 }}>
              Each chip is a single PUMS column. Hover for the human label.
            </div>
          </div>
        </div>

        {/* Timeline */}
        <ol className="timeline-grid" style={{
          marginTop: 40, padding: 0, listStyle: 'none',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
          borderTop: `2px solid ${ink}`, borderBottom: `0.5px solid ${ink}33`,
        }}>
          {L.TIMELINE.map((p, i) => (
            <li key={p.phase} style={{
              padding: '18px 18px 22px',
              borderRight: i < L.TIMELINE.length - 1 ? `0.5px solid ${ink}33` : 'none',
            }}>
              <div style={{ fontFamily: display, fontSize: 32, fontStyle: 'italic', color: accent, lineHeight: 1, marginBottom: 8 }}>{p.phase}</div>
              <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: `${ink}99`, marginBottom: 10 }}>{p.step}</div>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: `${ink}d0` }}>{p.detail}</p>
            </li>
          ))}
        </ol>

        {/* § III Poverty */}
        <SectionHead num="III" kicker="Finding I — Poverty" title="What aggregation hides." />
        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 48 }}>
          <div>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: `${ink}d0`, marginTop: 0 }}>
              At the level of the five standard race categories, Black residents
              face the highest poverty rate in the city — <strong style={{ color: accent }}>27%</strong>,
              more than double the White rate of <strong>12%</strong>.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: `${ink}d0` }}>
              Disaggregate the same population by Hispanic ancestry and
              the picture changes. <strong>43% of Honduran residents</strong> live
              below the federal poverty line — nearly three times the citywide
              Latino average. Disaggregate again by AAPI ancestry and a
              second hidden peak appears: <strong>34% of Korean residents</strong>,
              against just 10% for Cambodian.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <Marginalium kicker="Why disaggregate?">
              The 2023 ACS PUMS publishes Hispanic ancestry (HISP) and detailed
              Asian groups (RAC3P) as separate fields. Most public-facing
              dashboards never use them.
            </Marginalium>
            <Marginalium kicker="Federal poverty line">
              For a household of four in 2023, $30,000. The dashboards report
              this as the 100% line; respondents below it are counted as in
              poverty.
            </Marginalium>
          </div>
        </div>

        <div className="three-col" style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36 }}>
          <figure style={{ margin: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}99`, marginBottom: 10 }}>Fig. 5a · Poverty by race</div>
            <HBar data={L.POVERTY.race} {...theme} highlight={['Black']} max={50} />
            <Caption>The headline figure. Black residents at 27%; White at 12%.</Caption>
          </figure>
          <figure style={{ margin: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}99`, marginBottom: 10 }}>Fig. 5b · Poverty among Hispanic groups</div>
            <HBar data={L.POVERTY.hisp} {...theme} highlight={['Honduran']} max={50} />
            <Caption>Honduran 43%, against a Latino aggregate of 16%.</Caption>
          </figure>
          <figure style={{ margin: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}99`, marginBottom: 10 }}>Fig. 5c · Poverty among AAPI groups</div>
            <HBar data={L.POVERTY.aapi} {...theme} highlight={['Korean']} max={50} />
            <Caption>Korean residents at 34%; Cambodian at 10%.</Caption>
          </figure>
        </div>

        {/* § IV Education */}
        <SectionHead num="IV" kicker="Finding II — Education" title="The same shape, in a different field." />
        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 48, alignItems: 'start' }}>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: `${ink}d0`, marginTop: 0 }}>
            The pattern repeats with educational attainment. 44% of Latino
            residents lack a high school diploma — already the highest of any
            race category. But within that bucket, <strong>56% of Salvadoran and
            Guatemalan residents</strong> have not finished high school, and
            <strong> 51% of Vietnamese residents</strong> have not either.
          </p>
          <figure style={{ margin: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}99`, marginBottom: 10 }}>
              Fig. 6 · % without a high school diploma — disaggregated
            </div>
            <Lollipop data={L.EDUCATION_LT_HS.hisp.concat(L.EDUCATION_LT_HS.aapi)}
              {...theme} max={60} height={300} />
            <Caption>Hispanic ancestry (top) and AAPI ethnicity (bottom). Salvadoran and Guatemalan residents lead at 56% each.</Caption>
          </figure>
        </div>

        {/* § V Health & Income */}
        <SectionHead num="V" kicker="Finding III — Health &amp; income" title="What insurance the city carries." />
        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <figure style={{ margin: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}99`, marginBottom: 10 }}>Fig. 7 · Residents on Medicaid / Med-Cal</div>
            <HBar data={L.MEDICAID} {...theme} highlight={['Latinx', 'Black']} max={45} />
            <Caption>37% of Latinx and 38% of Black residents carry public coverage; 13% of White residents do.</Caption>
          </figure>
          <figure style={{ margin: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}99`, marginBottom: 10 }}>Fig. 8 · Residents with no insurance at all</div>
            <HBar data={L.UNINSURED} {...theme} highlight={['Latinx']} max={12} />
            <Caption>10% of Latinx residents carry no coverage of any kind.</Caption>
          </figure>
        </div>

        <div className="three-col" style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 36, alignItems: 'start' }}>
          <figure style={{ margin: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}99`, marginBottom: 10 }}>Fig. 9 · Median household income (thousands)</div>
            <HBar data={L.HH_INCOME} {...theme} value="k" max={130}
              fmt={(v) => '$' + v + 'K'} highlight={['Black']} />
            <Caption>$110K for White households · $56K for Black households · a $54,000 gap.</Caption>
          </figure>
          <figure style={{ margin: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}99`, marginBottom: 10 }}>Fig. 10 · Unemployment by race</div>
            <HBar data={L.UNEMPLOY} {...theme} max={9} fmt={(v) => v + '%'} highlight={['Black']} />
            <Caption>Black residents are the only group whose unemployment exceeds 7%.</Caption>
          </figure>
          <figure style={{ margin: 0 }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}99`, marginBottom: 10 }}>Fig. 11 · Tenure — own vs. rent (citywide)</div>
            <div style={{ marginBottom: 14 }}>
              <PairBars a={51} b={46} labelA="Own" labelB="Rent" {...theme} />
            </div>
            <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 13, color: `${ink}c0`, lineHeight: 1.55 }}>
              The citywide split is even — but only <strong>1 in 4 Black residents</strong>
              {' '}own their home, and only 37% of Latinx residents do.
            </div>
          </figure>
        </div>

        {/* § VI Deliverables */}
        <SectionHead num="VI" kicker="Deliverables" title="Five dashboards &amp; two infographics." />
        <p style={{ fontSize: 17, lineHeight: 1.6, color: `${ink}d0`, maxWidth: '46em' }}>
          The work shipped in two registers: interactive Tableau dashboards
          for analysts and policy staff, and printable infographics for
          community-facing distribution by the Department of Health &amp;
          Human Services.
        </p>
        <div className="deliverables-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 24 }}>
          {L.TABLEAU_LINKS.map((d) => (
            <a key={d.region} href={d.href} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'block', color: 'inherit',
                border: `0.5px solid ${ink}55`, padding: '18px 20px 16px',
                background: panel, transition: 'border-color .2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = accent}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = `${ink}55`}>
              <div style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, marginBottom: 6 }}>{d.region}</div>
              <div style={{ fontFamily: display, fontSize: 18, fontStyle: 'italic', lineHeight: 1.25, marginBottom: 8 }}>{d.title}</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: `${ink}99` }}>open on Tableau Public →</div>
            </a>
          ))}
        </div>

        {/* § VII Andy's role */}
        <SectionHead num="VII" kicker="Author's contribution" title="What Andy Molina did, specifically." />
        <div className="contribution-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {L.ANDY_CONTRIBUTION.map((c, i) => (
              <li key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 14, alignItems: 'baseline' }}>
                <div style={{ fontFamily: display, fontSize: 28, fontStyle: 'italic', color: accent, lineHeight: 1 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: `${ink}d0` }}>{c}</p>
              </li>
            ))}
          </ol>
          <div style={{ background: panel, border: `0.5px solid ${ink}33`, padding: '24px 26px' }}>
            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent, marginBottom: 14 }}>Project team</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {L.META.team.map((t) => (
                <li key={t.name} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: 8,
                  paddingBottom: 8, borderBottom: `0.5px dashed ${ink}33`, fontSize: 13.5,
                }}>
                  <div>
                    <span style={{
                      fontWeight: t.name === 'Andy Molina' ? 600 : 400,
                      color: t.name === 'Andy Molina' ? accent : ink,
                    }}>{t.name}</span>
                    <span style={{ color: `${ink}99`, fontStyle: 'italic', marginLeft: 6, fontSize: 12 }}>· {t.affil}</span>
                  </div>
                  <div style={{ fontFamily: mono, fontSize: 10, color: `${ink}99`, letterSpacing: '0.04em' }}>{t.role}</div>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 14, fontFamily: serif, fontStyle: 'italic', fontSize: 12.5, color: `${ink}99`, lineHeight: 1.5 }}>
              Funded in part by the Long Beach – Compton Data Science Learning Community.
            </div>
          </div>
        </div>

        {/* § VIII Takeaway */}
        <SectionHead num="VIII" kicker="Takeaway" title="A community-centered lens adds depth and meaning to data analysis." />
        <div style={{
          padding: '28px 36px', borderLeft: `3px solid ${accent}`, background: panel, marginBottom: 24,
        }}>
          <p style={{ margin: 0, fontFamily: display, fontSize: 26, fontStyle: 'italic', lineHeight: 1.35, color: ink, textWrap: 'balance' }}>
            "Equity challenges are complex and vary across neighborhoods.
            Visualizing public data makes equity more visible and shareable.
            A community-centered lens adds depth and meaning to data analysis."
          </p>
          <div style={{ marginTop: 12, fontFamily: mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${ink}99` }}>
            — closing slide, final presentation, Long Beach – Compton DSLC
          </div>
        </div>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: `${ink}d0`, maxWidth: '46em' }}>
          The dashboards are a starting point, not a verdict. They give the
          City of Long Beach Department of Health &amp; Human Services a tool
          for asking better questions of the next round of community
          intervention — which neighborhood, which population, which
          generation. The numbers will keep updating; the variable schema
          and the disaggregation logic are the parts that will travel.
        </p>

        {/* Colophon */}
        <footer className="lbrhe-colophon" style={{
          marginTop: 80, paddingTop: 18,
          borderTop: `2px solid ${ink}`,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24,
          fontFamily: mono, fontSize: 10, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: `${ink}99`,
        }}>
          <span>© mmxxv · Andy Molina</span>
          <span style={{ textAlign: 'center' }}>set in Spectral &amp; JetBrains Mono</span>
          <Link to="/" style={{ textAlign: 'right', color: accent }}>← back to portfolio</Link>
        </footer>
      </main>
    </div>
  );
}
