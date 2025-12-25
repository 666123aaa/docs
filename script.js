(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  // fade-in on load
  const ready = () => document.body.classList.add("is-ready");
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
return;
  // smooth navigation for internal links
  const smoothNav = (url) => {
    document.body.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.href = url;
    }, 180);
  };
  window.__smoothNav = smoothNav;

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    // do not hijack
    if (a.hasAttribute("download")) return;
    if (a.target === "_blank") return;

    const href = a.getAttribute("href");
    if (!href) return;
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) return;

    // allow same-page hash (works timeline) to scroll smoothly (handled below)
    if (href.startsWith("#")) return;

    e.preventDefault();
    smoothNav(href);
  });

  // year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Wanderer roaming (bigger range + clickable to about)
  const wanderer = $(".wanderer");
  const roam = () => {
    if (!wanderer) return;

    wanderer.addEventListener("click", (e) => {
      e.preventDefault();
      smoothNav("./about.html");
    });

    let x = window.innerWidth * 0.62;
    let y = window.innerHeight * 0.56;
    let vx = (Math.random() * 1.0 + 0.55) * (Math.random() < 0.5 ? -1 : 1);
    let vy = (Math.random() * 0.9 + 0.45) * (Math.random() < 0.5 ? -1 : 1);
    let rot = Math.random() * 360;
    let wob = Math.random() * Math.PI * 2;

    let last = performance.now();

    const tick = (t) => {
      const dt = Math.min(34, t - last);
      last = t;

      wob += dt * 0.0012;
      x += vx * (dt * 0.07);
      y += vy * (dt * 0.07) + Math.sin(wob) * 0.35;

      const size = 144;
      const pad = 8;
      const topPad = 72; // allow bigger roaming but keep away from very top

      if (x < pad) { x = pad; vx *= -1; }
      if (x > window.innerWidth - size - pad) { x = window.innerWidth - size - pad; vx *= -1; }
      if (y < topPad) { y = topPad; vy *= -1; }
      if (y > window.innerHeight - size - pad) { y = window.innerHeight - size - pad; vy *= -1; }

      rot = (rot + dt * 0.035) % 360;
      wanderer.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };
  roam();

  // Works timeline sync + mobile collapse
  const isWorks = document.body.classList.contains("is-works");
  if (isWorks) {
    const sections = $$(".work");
    const items = $$(".tItem");
    const timeline = $(".timeline");
    const toggle = $(".timelineToggle");
    const currentEl = $("#tlCurrent");

    const updateCurrentLabel = (sec) => {
      if (!currentEl) return;
      const map = {
        w1: "01 · To Be Seen As Her",
        w2: "02 · Interactive Extension",
        w3: "03 · Bloodline — Umbilical cord — Expectation",
        w4: "04 · Be quieter",
        w5: "05 · The Unbearable Weight of Being"
      };
      currentEl.textContent = map[sec.id] || "Timeline";
    };

    if (toggle && timeline) {
      toggle.addEventListener("click", () => {
        timeline.classList.toggle("is-open");
      });
    }

    items.forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        // mobile: close after jump
        if (timeline) timeline.classList.remove("is-open");
      });
    });

    const setActive = (sec) => {
      sections.forEach((s) => s.classList.toggle("is-active", s === sec));
      items.forEach((it) => it.classList.toggle("is-active", it.dataset.target === sec.id));
      updateCurrentLabel(sec);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        setActive(visible.target);
      },
      { threshold: [0.4, 0.55, 0.7] }
    );
    sections.forEach((s) => io.observe(s));

    if (sections[0]) updateCurrentLabel(sections[0]);
  }

  // Installation photo drift rotate
  $$(".photoDrift[data-rotate='1']").forEach((wrap) => {
    const imgs = $$(".photoDrift__img", wrap);
    if (imgs.length <= 1) return;
    let i = 0;
    setInterval(() => {
      imgs.forEach((img, idx) => img.classList.toggle("is-on", idx === i));
      i = (i + 1) % imgs.length;
    }, 4200);
  });
})();

