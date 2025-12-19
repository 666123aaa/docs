(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  // year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // modal
  const modal = $("#modal");
  const walker = $(".walker");
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  };
  const openModal = () => {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  };

  if (walker) {
    walker.addEventListener("click", openModal);
  }
  if (modal) {
    modal.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.dataset && t.dataset.close) closeModal();
      if (t && t.tagName === "A" && t.dataset && t.dataset.close) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  // YouTube lazy-load: only load src when section becomes active
  const activateYouTube = (section) => {
    const iframes = $$("iframe.yt", section);
    iframes.forEach((f) => {
      if (!f.src) {
        const src = f.getAttribute("data-src");
        if (src) f.src = src;
      }
    });
  };

  // Fullscreen for local videos
  const bindFullscreen = () => {
    $$("video.vid").forEach((v) => {
      v.addEventListener("click", async () => {
        try {
          if (document.fullscreenElement) {
            await document.exitFullscreen();
          } else {
            if (v.requestFullscreen) await v.requestFullscreen();
          }
        } catch (_) {}
      });
    });

    // For YouTube: click to open watch page (sound)
    $$("iframe.yt").forEach((f) => {
      const wrap = f.closest(".media__frame");
      if (!wrap) return;
      wrap.addEventListener("click", () => {
        const ds = f.getAttribute("data-src") || "";
        const m = ds.match(/embed\/([A-Za-z0-9_-]+)/);
        if (m && m[1]) {
          window.open(`https://youtu.be/${m[1]}`, "_blank", "noreferrer");
        }
      }, { passive: true });
    });
  };

  // Section activation + fade
  const sections = $$(".work");
  let activeIndex = 0;

  const moveWalker = (index) => {
    if (!walker) return;
    // slower, subtle drift across the screen; no sharp jumps
    const w = window.innerWidth;
    const h = window.innerHeight;

    // keep it in a safe band (not covering text)
    const x = Math.max(12, Math.min(w - 48, (w * 0.78) + (Math.sin(index * 1.7) * w * 0.12)));
    const y = Math.max(12, Math.min(h - 90, (h * 0.72) + (Math.cos(index * 1.3) * h * 0.12)));

    walker.style.transform = `translate3d(${Math.round(x - (w - 48))}px, ${Math.round(y - (h - 60))}px, 0)`;
  };

  const playActiveVideos = (section) => {
    // play/pause local muted videos only
    sections.forEach((s) => {
      $$("video.vid", s).forEach((v) => {
        if (s === section) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      // pick the most visible entry
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const sec = visible.target;
      sections.forEach((s) => s.classList.toggle("is-active", s === sec));
      activeIndex = sections.indexOf(sec);

      activateYouTube(sec);
      playActiveVideos(sec);
      moveWalker(activeIndex);
    },
    { threshold: [0.35, 0.5, 0.65] }
  );

  sections.forEach((s) => io.observe(s));

  // Installation photo slow rotate (no buttons)
  const startPhotoRotate = () => {
    $$(".photoDrift[data-rotate='1']").forEach((wrap) => {
      const imgs = $$(".photoDrift__img", wrap);
      if (imgs.length <= 1) return;

      let i = 0;
      setInterval(() => {
        imgs.forEach((img, idx) => img.classList.toggle("is-on", idx === i));
        i = (i + 1) % imgs.length;
      }, 4200);
    });
  };

  // init
  bindFullscreen();
  startPhotoRotate();

  // ensure first section loads its YouTube
  if (sections[0]) activateYouTube(sections[0]);
  moveWalker(0);
})();
