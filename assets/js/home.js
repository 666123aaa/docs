(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const items = $$(".workItem");
  const imgEl = $("#homePreviewImg");
  const capEl = $("#homePreviewCap");
  const linkEl = $("#homePreviewLink");

  const bgWrap = $(".homeBgVideo");
  const bgYt = $("#homeBgYt");
  const bgLink = $("#homeBgLink");

  const ytEmbed = (id) =>
    `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${id}&controls=0&rel=0&modestbranding=1`;

  const setPreview = (it) => {
    const p = it.getAttribute("data-preview");
    const to = it.getAttribute("data-link");
    const title = it.querySelector(".workItem__title")?.textContent?.trim() || "Preview";
    if (imgEl && p) imgEl.src = p;
    if (capEl) capEl.textContent = title;
    if (linkEl && to) linkEl.href = to;
  };

  const setBackground = (it) => {
    const type = it.getAttribute("data-bg-type");
    const yt = it.getAttribute("data-yt");
    const ytUrl = it.getAttribute("data-yt-url") || "#";

    items.forEach((x) => x.classList.toggle("is-selected", x === it));

    if (bgLink) {
      bgLink.href = ytUrl;
      bgLink.classList.add("is-on");
    }

    if (type === "img" || !yt) {
      if (bgWrap) bgWrap.classList.remove("is-on");
      if (bgYt) bgYt.src = "";
      return;
    }

    if (bgYt) bgYt.src = ytEmbed(yt);
    if (bgWrap) bgWrap.classList.add("is-on");
  };

  if (items[0]) {
    setPreview(items[0]);
    setBackground(items[0]);
  }

  items.forEach((it) => {
    it.addEventListener("mouseenter", () => setPreview(it));

    it.addEventListener("click", () => {
      setPreview(it);
      setBackground(it);
    });

    it.addEventListener("dblclick", () => {
      const to = it.getAttribute("data-link");
      if (to && window.__smoothNav) window.__smoothNav(to);
      else if (to) window.location.href = to;
    });
  });
})();
