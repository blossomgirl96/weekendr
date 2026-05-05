// Marketing site components — Weekendr
// Loaded via Babel; exposes components on window.

const { useState } = React;

// ---------- Header ----------
function MarketingHeader({ onSignup }) {
  return (
    <header className="mk-header">
      <a href="#" className="mk-lockup">
        <img src="../../assets/icon.svg" alt="" width="32" height="32" />
        <span>weekendr</span>
      </a>
      <nav className="mk-nav">
        <a href="#">How it works</a>
        <a href="#">Browse</a>
        <a href="#">For grandparents</a>
        <a href="#">Pricing</a>
      </nav>
      <div className="mk-header-actions">
        <a href="#" className="mk-link">Sign in</a>
        <button className="mk-btn mk-btn-primary mk-btn-sm" onClick={onSignup}>Get started</button>
      </div>
    </header>
  );
}

// ---------- Hero ----------
function MarketingHero({ onSignup }) {
  return (
    <section className="mk-hero">
      <div className="mk-hero-doodle mk-hero-doodle-1">
        <img src="../../assets/illustrations/sun.svg" alt="" width="68" height="68" />
      </div>
      <div className="mk-hero-doodle mk-hero-doodle-2">
        <img src="../../assets/illustrations/balloon.svg" alt="" width="56" height="70" />
      </div>
      <div className="mk-hero-doodle mk-hero-doodle-3">
        <img src="../../assets/illustrations/leaf.svg" alt="" width="60" height="60" />
      </div>

      <span className="mk-eyebrow">Built for tired parents</span>
      <h1 className="mk-hero-title">
        Skip the planning.<br/>
        <span className="mk-hero-title-accent">Keep the fun.</span>
      </h1>
      <p className="mk-hero-sub">
        Weekendr pulls a handful of weekend activities your kids will actually like —
        close to home, easy to book, and ready before Friday night.
      </p>
      <div className="mk-hero-cta">
        <button className="mk-btn mk-btn-primary mk-btn-lg" onClick={onSignup}>Plan a weekend</button>
        <button className="mk-btn mk-btn-ghost mk-btn-lg">Browse without signing up →</button>
      </div>
      <div className="mk-hero-meta">
        <span>Free to start</span>
        <span className="mk-dot"></span>
        <span>No credit card</span>
        <span className="mk-dot"></span>
        <span>Family-shareable</span>
      </div>
    </section>
  );
}

// ---------- Activity card ----------
function ActivityCard({ title, meta, price, day, badge, gradient, fav, onFav }) {
  return (
    <div className="mk-acard">
      <div className="mk-acard-photo" style={{ background: gradient }}>
        {day && <span className="mk-acard-badge">{day}</span>}
        {badge && <span className="mk-acard-badge mk-acard-badge-sun">{badge}</span>}
        <button className="mk-acard-heart" onClick={onFav} aria-label="Favorite">
          <i data-lucide="heart" width="18" height="18" strokeWidth="2"
             fill={fav ? "currentColor" : "none"}></i>
        </button>
      </div>
      <div className="mk-acard-body">
        <h3>{title}</h3>
        <div className="mk-acard-meta">
          {meta.map((m, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="mk-dot"></span>}
              <span>{m}</span>
            </React.Fragment>
          ))}
        </div>
        <div className="mk-acard-price">{price}</div>
      </div>
    </div>
  );
}

// ---------- Browse rail ----------
function BrowseRail() {
  const [favs, setFavs] = useState({ 1: true });
  const tog = (i) => setFavs(f => ({ ...f, [i]: !f[i] }));

  const items = [
    { id: 1, title: "Pumpkin patch & hayride", meta: ["2 hr", "Outdoor"], price: "$12 a kid", day: "Saturday", gradient: "linear-gradient(135deg, #F5BFA1, #EDB821)" },
    { id: 2, title: "Forest sounds story walk", meta: ["45 min", "Outdoor"], price: "Free", day: "Sunday", badge: "Free", gradient: "linear-gradient(135deg, #6FA269, #2C5E2A)" },
    { id: 3, title: "Aquarium late entry", meta: ["1.5 hr", "Indoor"], price: "$18 a kid", day: "Both days", gradient: "linear-gradient(135deg, #62A9BC, #266D82)" },
    { id: 4, title: "Make-your-own pottery", meta: ["1 hr", "Indoor"], price: "$22 a kid", day: "Saturday", gradient: "linear-gradient(135deg, #FADFD0, #D85F2A)" },
    { id: 5, title: "Botanical garden picnic", meta: ["2 hr", "Outdoor"], price: "$8 entry", day: "Sunday", gradient: "linear-gradient(135deg, #A6C5A2, #437E3F)" },
  ];

  return (
    <section className="mk-rail-section">
      <div className="mk-rail-head">
        <div>
          <span className="mk-eyebrow">This weekend in Brooklyn</span>
          <h2>Five things, picked for parents who don't have time to pick.</h2>
        </div>
        <a href="#" className="mk-link-arrow">See all 27 →</a>
      </div>
      <div className="mk-rail">
        {items.map(it => (
          <ActivityCard key={it.id} {...it} fav={!!favs[it.id]} onFav={() => tog(it.id)} />
        ))}
      </div>
    </section>
  );
}

// ---------- Category grid ----------
function CategoryGrid() {
  const cats = [
    { name: "Outdoor", icon: "trees", count: 142, color: "#2C5E2A", bg: "var(--pine-50)" },
    { name: "Indoor", icon: "home", count: 88, color: "#B84A1F", bg: "var(--terracotta-50)" },
    { name: "Free", icon: "gift", count: 41, color: "#A87708", bg: "var(--sun-50)" },
    { name: "Splash", icon: "waves", count: 23, color: "#266D82", bg: "var(--sky-50)" },
    { name: "Crafts", icon: "palette", count: 36, color: "#B84A1F", bg: "var(--terracotta-50)" },
    { name: "Sports", icon: "trophy", count: 54, color: "#2C5E2A", bg: "var(--pine-50)" },
  ];
  return (
    <section className="mk-cats">
      <h2>Browse by what your kid's into.</h2>
      <div className="mk-cat-grid">
        {cats.map(c => (
          <a key={c.name} className="mk-cat" style={{ background: c.bg }}>
            <i data-lucide={c.icon} width="32" height="32" strokeWidth="1.75" style={{ color: c.color }}></i>
            <div className="mk-cat-text">
              <div className="mk-cat-name">{c.name}</div>
              <div className="mk-cat-count">{c.count} this weekend</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ---------- How it works ----------
function HowItWorks() {
  const steps = [
    { n: "1", h: "Tell us your kids' ages.", p: "Two-minute setup. We use this to match activities to attention spans." },
    { n: "2", h: "We pull a short list.", p: "Five things, by Friday morning. Outdoor, indoor, free, paid — your mix." },
    { n: "3", h: "Tap to add to Saturday or Sunday.", p: "Drag to swap. Share the plan with your partner, sitter, or grandma." },
  ];
  return (
    <section className="mk-how">
      <div className="mk-how-head">
        <span className="mk-eyebrow">How it works</span>
        <h2>It really is this simple.</h2>
      </div>
      <div className="mk-how-grid">
        {steps.map(s => (
          <div key={s.n} className="mk-how-step">
            <span className="mk-how-num">{s.n}</span>
            <h3>{s.h}</h3>
            <p>{s.p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Testimonial ----------
function Testimonial() {
  return (
    <section className="mk-quote-section">
      <img className="mk-quote-doodle" src="../../assets/illustrations/sparkle.svg" alt="" width="48" height="48" />
      <blockquote className="mk-quote">
        <p>"Friday night used to be me Googling 'things to do with kids in Brooklyn' for an hour. Now it's me opening Weekendr and picking three things. We actually <em>do</em> stuff now."</p>
        <footer>
          <strong>Mara K.</strong> · mom of Lila (4) and Theo (7)
        </footer>
      </blockquote>
    </section>
  );
}

// ---------- CTA band ----------
function CTABand({ onSignup }) {
  return (
    <section className="mk-cta-band">
      <img src="../../assets/illustrations/balloon.svg" alt="" className="mk-cta-doodle mk-cta-doodle-1" />
      <img src="../../assets/illustrations/kite.svg" alt="" className="mk-cta-doodle mk-cta-doodle-2" />
      <h2>Saturday's looking good.</h2>
      <p>Try Weekendr free. Cancel before Sunday brunch if it's not for you.</p>
      <button className="mk-btn mk-btn-primary mk-btn-lg" onClick={onSignup}>Plan this weekend</button>
    </section>
  );
}

// ---------- Footer ----------
function MarketingFooter() {
  return (
    <footer className="mk-footer">
      <div className="mk-footer-top">
        <div className="mk-footer-brand">
          <div className="mk-lockup mk-lockup-light">
            <img src="../../assets/icon.svg" alt="" width="28" height="28" />
            <span>weekendr</span>
          </div>
          <p>Weekend plans for busy parents. Made in Brooklyn, used everywhere.</p>
        </div>
        <div className="mk-footer-cols">
          <div>
            <h4>Product</h4>
            <a>How it works</a><a>Pricing</a><a>For grandparents</a><a>iOS app</a>
          </div>
          <div>
            <h4>Company</h4>
            <a>About</a><a>Press</a><a>Careers</a><a>Hosts</a>
          </div>
          <div>
            <h4>Help</h4>
            <a>Support</a><a>Privacy</a><a>Terms</a><a>Contact</a>
          </div>
        </div>
      </div>
      <div className="mk-footer-bottom">
        <span>© 2026 Weekendr, Inc.</span>
        <span className="mk-footer-tag">Have a good weekend.</span>
      </div>
    </footer>
  );
}

// ---------- Signup modal ----------
function SignupModal({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [ages, setAges] = useState({});

  if (!open) return null;
  const tog = (a) => setAges(s => ({ ...s, [a]: !s[a] }));

  return (
    <div className="mk-modal-backdrop" onClick={onClose}>
      <div className="mk-modal" onClick={e => e.stopPropagation()}>
        <button className="mk-modal-close" onClick={onClose} aria-label="Close">
          <i data-lucide="x" width="22" height="22" strokeWidth="2"></i>
        </button>
        {step === 1 && (
          <>
            <span className="mk-eyebrow">Step 1 of 3</span>
            <h2>Where are you?</h2>
            <p className="mk-modal-sub">We'll keep things within 30 minutes.</p>
            <input className="mk-input" placeholder="ZIP code" value={zip} onChange={e => setZip(e.target.value)} />
            <button className="mk-btn mk-btn-primary mk-btn-lg mk-btn-full" onClick={() => setStep(2)}>Continue</button>
          </>
        )}
        {step === 2 && (
          <>
            <span className="mk-eyebrow">Step 2 of 3</span>
            <h2>How old are your kids?</h2>
            <p className="mk-modal-sub">Pick all that apply.</p>
            <div className="mk-modal-checks">
              {["Under 2", "2–3", "4–6", "7–9", "10–12"].map(a => (
                <button key={a} className={"mk-check-pill " + (ages[a] ? "on" : "")} onClick={() => tog(a)}>
                  {ages[a] ? "✓ " : ""}{a}
                </button>
              ))}
            </div>
            <button className="mk-btn mk-btn-primary mk-btn-lg mk-btn-full" onClick={() => setStep(3)}>Continue</button>
          </>
        )}
        {step === 3 && (
          <>
            <span className="mk-eyebrow">Step 3 of 3</span>
            <h2>Where should we send your weekend?</h2>
            <p className="mk-modal-sub">Friday morning. One email. No spam.</p>
            <input className="mk-input" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            <button className="mk-btn mk-btn-primary mk-btn-lg mk-btn-full" onClick={onClose}>Send me Friday's picks</button>
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  MarketingHeader, MarketingHero, BrowseRail, ActivityCard,
  CategoryGrid, HowItWorks, Testimonial, CTABand, MarketingFooter, SignupModal
});
