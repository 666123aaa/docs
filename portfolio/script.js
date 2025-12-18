/* ========= helpers ========= */
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const $ = (sel, root = document) => root.querySelector(sel);

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

/* ========= fade / active section ========= */
const projects = $$('.project');
let activeIndex = 0;

const observer = new IntersectionObserver((entries) => {
  // choose the entry closest to center / highest ratio
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => (b.intersectionRatio - a.intersectionRatio));

  if (!visible.length) return;

  const top = visible[0].target;
  const idx = projects.indexOf(top);
  if (idx !== -1) setActive(idx);
}, { threshold: [0.25, 0.5, 0.65] });

projects.forEach(p => observer.observe(p));

function setActive(idx){
  if (idx === activeIndex) return;
  projects[activeIndex]?.classList.remove('is-active');
  projects[idx]?.classList.add('is-active');
  activeIndex = idx;

  // gently re-place sprite (slow + not jumpy)
  placeSpriteFor(idx);

  // keep active video playing
  const v = $('.js-video', projects[idx]);
  if (v) safePlay(v);
}

/* ========= video behaviour ========= */
function safePlay(video){
  // iOS / browser policy: autoplay works reliably only when muted
  video.muted = true;
  const p = video.play();
  if (p && typeof p.catch === 'function') p.catch(() => {});
}

function replayIn(section){
  const v = $('.js-video', section);
  if (!v) return;
  try { v.currentTime = 0; } catch(e){}
  safePlay(v);
}

function toggleMuteIn(section, btn){
  const v = $('.js-video', section);
  if (!v) return;

  // user gesture → allowed to unmute
  v.muted = !v.muted;
  btn.textContent = v.muted ? 'Sound: Off' : 'Sound: On';
}

/* click video → fullscreen */
function enterFullscreen(video){
  // requestFullscreen (standard)
  if (video.requestFullscreen) return video.requestFullscreen();
  // Safari iOS (some versions)
  if (video.webkitEnterFullscreen) return video.webkitEnterFullscreen();
}

projects.forEach(section => {
  const video = $('.js-video', section);
  if (video){
    // force autoplay attempt
    safePlay(video);

    // click video → fullscreen
    video.addEventListener('click', () => enterFullscreen(video));
  }

  // buttons
  const muteBtn = $('.js-mute', section);
  if (muteBtn){
    muteBtn.addEventListener('click', () => toggleMuteIn(section, muteBtn));
  }
  const replayBtn = $('.js-replay', section);
  if (replayBtn){
    replayBtn.addEventListener('click', () => replayIn(section));
  }
  const fsBtn = $('.js-fullscreen', section);
  if (fsBtn && video){
    fsBtn.addEventListener('click', () => enterFullscreen(video));
  }
});

/* ========= language switch (per block) ========= */
function wireLangSwitch(root){
  const pills = $$('[data-lang]', root).filter(el => el.classList.contains('pill'));
  const panels = $$('[data-lang-panel]', root);

  if (!pills.length || !panels.length) return;

  const setLang = (lang) => {
    pills.forEach(p => p.classList.toggle('is-on', p.dataset.lang === lang));
    panels.forEach(p => p.classList.toggle('is-on', p.dataset.langPanel === lang));
  };

  pills.forEach(p => {
    p.addEventListener('click', () => setLang(p.dataset.lang));
  });
}

$$('.lang').forEach(block => wireLangSwitch(block));

/* ========= silhouette sprite (slow + gentle) ========= */
const sprite = $('#sprite');
const aboutModal = $('#aboutModal');
const openAboutBtn = $('#openAbout');

function placeSpriteFor(idx){
  // positions are intentionally subtle, not “jump scares”
  const presets = [
    { x: 6,  y: 70 },
    { x: 10, y: 58 },
    { x: 7,  y: 76 },
    { x: 12, y: 64 }
  ];
  const p = presets[idx % presets.length];

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const x = clamp((p.x/100) * vw, 10, vw - 70);
  const y = clamp((p.y/100) * vh, 80, vh - 90);

  sprite.classList.add('is-on');
  sprite.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

// show sprite after initial settle
setTimeout(() => placeSpriteFor(0), 450);

/* ========= modal ========= */
function openModal(){
  aboutModal.classList.add('is-on');
  aboutModal.setAttribute('aria-hidden', 'false');
}

function closeModal(){
  aboutModal.classList.remove('is-on');
  aboutModal.setAttribute('aria-hidden', 'true');
}

sprite.addEventListener('click', openModal);
openAboutBtn.addEventListener('click', openModal);
aboutModal.addEventListener('click', (e) => {
  const t = e.target;
  if (t?.dataset?.close === '1') closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ========= keep active video stable on resize ========= */
window.addEventListener('resize', () => placeSpriteFor(activeIndex));
