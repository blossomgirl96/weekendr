// Planner app components — Weekendr
const { useState, useEffect } = React;

function AppSidebar({ active, onNav }) {
  const items = [
    { id: "browse", label: "Browse", icon: "compass" },
    { id: "weekend", label: "This weekend", icon: "calendar-heart", count: 3 },
    { id: "favorites", label: "Favorites", icon: "heart" },
    { id: "family", label: "Family", icon: "users" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];
  return (
    <aside className="ap-sidebar">
      <div className="ap-lockup">
        <img src="../../assets/icon.svg" width="28" height="28" alt="" />
        <span>weekendr</span>
      </div>
      <nav className="ap-nav">
        {items.map(it => (
          <button key={it.id} className={"ap-nav-item " + (active === it.id ? "active" : "")} onClick={() => onNav(it.id)}>
            <i data-lucide={it.icon} width="20" height="20" strokeWidth="1.75"></i>
            <span>{it.label}</span>
            {it.count != null && <span className="ap-nav-badge">{it.count}</span>}
          </button>
        ))}
      </nav>
      <div className="ap-sidebar-foot">
        <div className="ap-avatar">M</div>
        <div className="ap-account">
          <div className="ap-account-name">Mara K.</div>
          <div className="ap-account-meta">Brooklyn · 2 kids</div>
        </div>
      </div>
    </aside>
  );
}

function BrowseHeader() {
  return (
    <header className="ap-header">
      <div>
        <h1>What's on this weekend?</h1>
        <p className="ap-header-sub">Brooklyn · Sat May 9 — Sun May 10 · slight chance of rain Sat afternoon</p>
      </div>
      <div className="ap-header-actions">
        <div className="ap-search">
          <i data-lucide="search" width="18" height="18" strokeWidth="1.75"></i>
          <input placeholder="Search activities" />
        </div>
        <button className="ap-icon-btn" aria-label="Calendar"><i data-lucide="calendar" width="20" height="20" strokeWidth="1.75"></i></button>
      </div>
    </header>
  );
}

function FilterBar({ filter, setFilter }) {
  const filters = ["All", "Outdoor", "Indoor", "Free", "Under 1 hr", "Stroller-ok", "Ages 4–6"];
  return (
    <div className="ap-filterbar">
      {filters.map(f => (
        <button key={f} className={"ap-chip " + (filter === f ? "on" : "")} onClick={() => setFilter(f)}>
          {f}
        </button>
      ))}
    </div>
  );
}

function ActivityRow({ item, inPlan, onAdd, onFav, faved }) {
  return (
    <div className="ap-row">
      <div className="ap-row-photo" style={{ background: item.gradient }}>
        {item.tag && <span className="ap-row-tag">{item.tag}</span>}
      </div>
      <div className="ap-row-body">
        <div className="ap-row-head">
          <h3>{item.title}</h3>
          <button className={"ap-fav-btn " + (faved ? "on" : "")} onClick={onFav} aria-label="Favorite">
            <i data-lucide="heart" width="18" height="18" strokeWidth="2" fill={faved ? "currentColor" : "none"}></i>
          </button>
        </div>
        <p className="ap-row-desc">{item.desc}</p>
        <div className="ap-row-meta">
          <span><i data-lucide="clock" width="14" height="14" strokeWidth="2"></i>{item.time}</span>
          <span><i data-lucide="map-pin" width="14" height="14" strokeWidth="2"></i>{item.loc}</span>
          <span className="ap-row-price">{item.price}</span>
        </div>
      </div>
      <div className="ap-row-actions">
        {inPlan ? (
          <button className="ap-btn ap-btn-pine" disabled><i data-lucide="check" width="16" height="16" strokeWidth="2.5"></i>In plan</button>
        ) : (
          <>
            <button className="ap-btn ap-btn-pop" onClick={() => onAdd("Sat")}>Add Sat</button>
            <button className="ap-btn ap-btn-ghost" onClick={() => onAdd("Sun")}>Add Sun</button>
          </>
        )}
      </div>
    </div>
  );
}

function ActivityList({ items, plan, addToPlan, favs, toggleFav }) {
  if (!items.length) {
    return (
      <div className="ap-empty">
        <img src="../../assets/illustrations/sparkle.svg" width="64" height="64" alt="" />
        <h3>Nothing matches that filter.</h3>
        <p>Try widening the search — there are 27 things this weekend.</p>
      </div>
    );
  }
  return (
    <div className="ap-list">
      {items.map(it => (
        <ActivityRow key={it.id}
          item={it}
          inPlan={!!plan[it.id]}
          faved={!!favs[it.id]}
          onAdd={(day) => addToPlan(it, day)}
          onFav={() => toggleFav(it.id)}
        />
      ))}
    </div>
  );
}

function WeekendTray({ plan, onRemove }) {
  const [open, setOpen] = useState(true);
  const items = Object.values(plan);
  const sat = items.filter(i => i.day === "Sat");
  const sun = items.filter(i => i.day === "Sun");
  const total = items.reduce((s, i) => s + i.priceNum, 0);

  return (
    <div className={"ap-tray " + (open ? "open" : "closed")}>
      <button className="ap-tray-head" onClick={() => setOpen(o => !o)}>
        <div className="ap-tray-head-left">
          <img src="../../assets/illustrations/sun.svg" width="32" height="32" alt="" />
          <div>
            <div className="ap-tray-title">Your weekend</div>
            <div className="ap-tray-sub">{items.length} {items.length === 1 ? "thing" : "things"} · ${total} total</div>
          </div>
        </div>
        <i data-lucide={open ? "chevron-down" : "chevron-up"} width="22" height="22" strokeWidth="2"></i>
      </button>
      {open && (
        <div className="ap-tray-body">
          <div className="ap-tray-day">
            <div className="ap-tray-day-head">Saturday<span>{sat.length}</span></div>
            {sat.length === 0 && <div className="ap-tray-empty">Nothing yet.</div>}
            {sat.map(i => (
              <div key={i.id} className="ap-tray-item">
                <span>{i.title}</span>
                <button onClick={() => onRemove(i.id)} aria-label="Remove"><i data-lucide="x" width="14" height="14" strokeWidth="2"></i></button>
              </div>
            ))}
          </div>
          <div className="ap-tray-day">
            <div className="ap-tray-day-head">Sunday<span>{sun.length}</span></div>
            {sun.length === 0 && <div className="ap-tray-empty">Nothing yet.</div>}
            {sun.map(i => (
              <div key={i.id} className="ap-tray-item">
                <span>{i.title}</span>
                <button onClick={() => onRemove(i.id)} aria-label="Remove"><i data-lucide="x" width="14" height="14" strokeWidth="2"></i></button>
              </div>
            ))}
          </div>
          <button className="ap-btn ap-btn-pop ap-btn-full">Share with family</button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { AppSidebar, BrowseHeader, FilterBar, ActivityRow, ActivityList, WeekendTray });
