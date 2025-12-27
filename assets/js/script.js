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

    if (a.hasAttribute("download")) return;
    if (a.target === "_blank") return;

    const href = a.getAttribute("href");
    if (!href) return;
    if (
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("#")
    )
      return;

    if (href.startsWith("#")) return;

    e.preventDefault();
    smoothNav(href);
  });

  // year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Wanderer - 柔和漂浮效果，像在水中或梦境中飘动
  const wanderer = $(".wanderer");
  const roam = () => {
    if (!wanderer) return;

    wanderer.addEventListener("click", (e) => {
      e.preventDefault();
      smoothNav("./about.html");
    });

    const size = 144;
    
    // 使用多个正弦波叠加，创造自然的漂浮轨迹
    let time = Math.random() * 1000;
    
    // 基础位置（屏幕中心偏右上）
    const baseX = window.innerWidth * 0.65;
    const baseY = window.innerHeight * 0.4;
    
    // 漂浮范围
    const rangeX = window.innerWidth * 0.25;
    const rangeY = window.innerHeight * 0.2;

    const tick = () => {
      time += 0.008;
      
      // 多层正弦波叠加，创造有机的运动轨迹
      const x = baseX + 
        Math.sin(time * 0.7) * rangeX * 0.6 +
        Math.sin(time * 1.3 + 1.5) * rangeX * 0.3 +
        Math.sin(time * 2.1 + 3) * rangeX * 0.1;
      
      const y = baseY + 
        Math.cos(time * 0.5) * rangeY * 0.5 +
        Math.cos(time * 1.1 + 2) * rangeY * 0.35 +
        Math.sin(time * 1.7 + 1) * rangeY * 0.15;
      
      // 轻微旋转，跟随运动方向微微倾斜
      const rot = Math.sin(time * 0.4) * 8 + Math.cos(time * 0.7) * 5;
      
      // 呼吸感缩放
      const scale = 1 + Math.sin(time * 0.3) * 0.03;
      
      wanderer.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${scale})`;

      requestAnimationFrame(tick);
    };

    wanderer.style.left = '0';
    wanderer.style.top = '0';
    wanderer.style.transition = 'opacity 0.5s ease';

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
        w5: "05 · The Unbearable Weight of Being",
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

        if (timeline) timeline.classList.remove("is-open");
      });
    });

    const setActive = (sec) => {
      sections.forEach((s) => s.classList.toggle("is-active", s === sec));
      items.forEach((it) =>
        it.classList.toggle("is-active", it.dataset.target === sec.id)
      );
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
