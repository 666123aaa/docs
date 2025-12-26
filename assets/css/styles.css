@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap");

:root {
  --bg: #ffffff;
  --ink: #111111;
  --muted: rgba(17, 17, 17, 0.62);
  --hairline: rgba(17, 17, 17, 0.12);
  --softline: rgba(17, 17, 17, 0.08);

  --gutter: 26px;
  --topbar-h: 62px;

  --maxw: 1480px;
}

/* ===== Base ===== */
* {
  box-sizing: border-box;
}
html,
body {
  height: 100%;
}
body {
  margin: 0;
  color: var(--ink);
  background: var(--bg);
  font-family: "Cormorant Garamond", ui-serif, Georgia, "Times New Roman", serif;
  font-weight: 600;
 
  font-size: 18px; 
  font-weight: bold;
  letter-spacing: 0.15px;

  opacity: 0;
  transition: opacity 0.24s ease;
}
body.is-ready {
  opacity: 1;
}
body.is-leaving {
  opacity: 0;
}

a {
  color: inherit;
  text-decoration: none;
}
img {
  max-width: 100%;
  height: auto;
  display: block;
}

.underline {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  text-decoration-color: rgba(17, 17, 17, 0.25);
}
.underline:hover {
  text-decoration-color: rgba(17, 17, 17, 0.55);
}

/* ===== Topbar ===== */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--topbar-h);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 var(--gutter);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--hairline);
  z-index: 50;
}

.brand {
  font-weight: 700;
  letter-spacing: 0.18em;
  font-size: 18px;
  font-weight: bold;
}

.topnav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 18px;
  align-items: center;
}

.navlink {
  font-size: 14px;
  font-weight: bold;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(17, 17, 17, 0.75);
}
.navlink:hover {
  color: rgba(17, 17, 17, 0.98);
}
.navlink.is-current {
  color: rgba(17, 17, 17, 0.98);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 5px;
  text-decoration-color: rgba(17, 17, 17, 0.25);
}

/* 右侧 icon 容器 */
.topRight {
  position: absolute;
  right: var(--gutter);
  display: flex;
  align-items: center;
  gap: 12px;
}

.topIcon {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
}
.topIcon:hover {
  opacity: 1;
}
.topIcon img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: block;
}

/* Home：导航文字白 + 图标转白 */
.is-home .topbar {
  background: transparent;
  border-bottom: 0;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
.is-home .brand,
.is-home .navlink {
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
}
.is-home .navlink.is-current {
  text-decoration-color: rgba(255, 255, 255, 0.35);
}
.is-home .topIcon img {
  filter: invert(1);
  opacity: 0.92;
}

/* ===== Wanderer（小人） ===== */
.wanderer {
  position: fixed;
  width: 144px;
  height: 144px;
  left: 0;
  top: 0;
  z-index: 40;

  pointer-events: auto;
  cursor: pointer;

  background-image: url("../images/home/about.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  filter: drop-shadow(0 12px 26px rgba(0, 0, 0, 0.18));
  opacity: 0.92;

  transform: translate3d(0, 0, 0) rotate(0deg);
  will-change: transform;
}

/* ===== Works 背景 ===== */
.worksBg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.worksBg img {
  position: absolute;
  width: min(520px, 52vw);
  height: auto;
  opacity: 0.085;
  filter: blur(18px) saturate(1.08) contrast(1.05);
  transform: scale(1.05);
  mix-blend-mode: multiply;
}

.worksBg .bgA {
  left: -6%;
  top: 8%;
  transform: rotate(-6deg) scale(1.1);
}
.worksBg .bgB {
  right: -10%;
  top: 12%;
  transform: rotate(8deg) scale(1.05);
}
.worksBg .bgC {
  left: 6%;
  bottom: -10%;
  transform: rotate(4deg) scale(1.08);
}
.worksBg .bgD {
  right: 10%;
  bottom: -16%;
  transform: rotate(-7deg) scale(1.1);
}
.worksBg .bgE {
  left: 38%;
  top: 42%;
  transform: rotate(2deg) scale(1.06);
}

/* ===== Works layout ===== */
.worksPage {
  padding-top: var(--topbar-h);
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 54px;
  max-width: min(var(--maxw), calc(100vw - 60px));
  margin: 0 auto;
  padding-left: 10px;
  padding-right: 10px;
  position: relative;
  z-index: 2;
}

.timeline {
  position: sticky;
  top: calc(var(--topbar-h) + 18px);
  align-self: start;
  padding-top: 22px;
  padding-left: 6px;
}

.timeline__title {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(17, 17, 17, 0.55);
  margin-bottom: 10px;
}

.timeline__rule {
  height: 1px;
  background: var(--softline);
  margin-bottom: 18px;
  width: 85%;
}

/* mobile toggle */
.timelineToggle {
  display: none;
  width: 100%;
  padding: 12px 10px;
  border: 1px solid var(--hairline);
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-align: left;
  cursor: pointer;
  border-radius: 2px;
}
.timelineToggle__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.timelineToggle__label {
  font-size: 14px;
  font-weight: bold;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(17, 17, 17, 0.68);
}
.timelineToggle__current {
  font-size: 17px;
  font-weight: bold;
  font-weight: 600;
  color: rgba(17, 17, 17, 0.86);
}
.timelineToggle__chev {
  opacity: 0.6;
  transform: translateY(-1px);
}

.tItem {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 10px;
  padding: 12px 0;
  opacity: 0.55;
}
.tItem:hover {
  opacity: 0.85;
}
.tItem.is-active {
  opacity: 1;
}

.tDot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: 1px solid rgba(17, 17, 17, 0.35);
  margin-top: 4px;
  display: inline-block;
}
.tItem.is-active .tDot {
  background: rgba(17, 17, 17, 0.9);
  border-color: rgba(17, 17, 17, 0.9);
}

.tK {
  font-size: 13px;
  font-weight: bold;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(17, 17, 17, 0.55);
}
.tT {
  margin-top: 3px;
  font-size: 15px;
  font-weight: bold;
  font-weight: 600;
  line-height: 1.35;
  color: rgba(17, 17, 17, 0.86);
}
.tTime {
  margin-top: 6px;
  font-size: 14px;
  font-weight: bold;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: rgba(0, 0, 0, 0.6);
}
.tNote {
  margin-top: 6px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.45;
  color: rgba(17, 17, 17, 0.62);
}

.worksStack {
  min-width: 0;
}

/* Work 单独背景 */
.work {
  min-height: 100svh;
  padding: 54px 0 64px;
  display: flex;
  align-items: center;
  position: relative;

  opacity: 0.1;
  transform: translateY(10px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.work::before {
  content: '';
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.08;
  z-index: -1;
}
#w1::before { background-image: url("../images/home/a.png"); }
#w2::before { background-image: url("../images/home/b.png"); }
#w3::before { background-image: url("../images/home/c.png"); }
#w4::before { background-image: url("../images/home/d.png"); }
#w5::before { background-image: url("../images/home/e.png"); }

.work.is-active {
  opacity: 1;
  transform: translateY(0);
}

.work__grid {
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 54px;
  align-items: start;
}

.work__grid--wide {
  grid-template-columns: 1fr 1fr;
}

/* Media */
.media {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
}

.media__frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
  border-radius: 2px;
}

.yt {
  width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
  max-height: 74vh;
  border: 0;
  display: block;
  background: #000;
  height: 100% !important;
}

.meta {
  padding-top: 8px;
}

.meta__kicker {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 10px;
}

.meta__title {
  margin: 0 0 14px;
  font-size: clamp(28px, 3vw, 42px);
  line-height: 1.04;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.meta__para {
  margin: 0 0 12px;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.65;
  color: rgba(17, 17, 17, 0.78);
}

.meta__links {
  margin-top: 14px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.meta__more {
  margin-top: 26px;
}

.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 12px;
  border: 1px solid var(--hairline);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.65);
}
.pill:hover {
  border-color: rgba(17, 17, 17, 0.28);
}
.pill--ghost {
  background: transparent;
}

/* SOUND */
.media__frame--sound {
  background: #fff;
  border: 1px solid rgba(17, 17, 17, 0.06);
  height: min(74vh, 640px);
  display: grid;
  grid-template-rows: 1fr auto;
}
.soundCollage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #f3f3f3;
}
.soundControls {
  padding: 12px 14px 14px;
  border-top: 1px solid var(--softline);
  background: rgba(255, 255, 255, 0.92);
}
.audio {
  width: 100%;
  accent-color: #111;
}

/* Installation photo drift */
.photoDrift {
  position: relative;
  width: 100%;
  height: min(40vh, 360px);
  margin-top: 18px;
  border-radius: 2px;
  overflow: hidden;
  background: #fff;
}
.photoDrift__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 1.2s ease, transform 1.2s ease;
  filter: contrast(1.02);
}
.photoDrift__img:nth-child(1) {
  transform: rotate(-1.2deg) scale(1.03);
}
.photoDrift__img:nth-child(2) {
  transform: rotate(1.1deg) scale(1.04);
}
.photoDrift__img:nth-child(3) {
  transform: rotate(-0.6deg) scale(1.03);
}
.photoDrift__img:nth-child(4) {
  transform: rotate(0.8deg) scale(1.04);
}
.photoDrift__img.is-on {
  opacity: 1;
}

/* Footer */
.footer {
  padding: 34px 0 48px;
  border-top: 1px solid var(--softline);
}
.footer__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  color: rgba(17, 17, 17, 0.62);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
.footer__sep {
  opacity: 0.35;
}

/* Site Footer - 全站统一底部 */
.siteFooter {
  width: 100%;
  padding: 28px 20px 32px;
  border-top: 1px solid var(--softline);
  background: var(--bg);
}
.siteFooter__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: center;
  justify-content: center;
  color: rgba(17, 17, 17, 0.62);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
.siteFooter__inner a {
  color: rgba(17, 17, 17, 0.62);
  transition: color 0.2s ease;
}
.siteFooter__inner a:hover {
  color: rgba(17, 17, 17, 0.95);
}
.siteFooter .sep {
  opacity: 0.35;
}

/* Home 页面底部特殊样式 */
.is-home .siteFooter {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: transparent;
  border-top: none;
  z-index: 10;
}
.is-home .siteFooter__inner,
.is-home .siteFooter__inner a {
  color: rgba(255, 255, 255, 0.78);
  text-shadow: 0 10px 34px rgba(0, 0, 0, 0.16);
}
.is-home .siteFooter__inner a:hover {
  color: rgba(255, 255, 255, 0.98);
}

/* ===== About ===== */
.page--about {
  position: relative; /* 为伪元素定位提供参考 */
  padding: calc(var(--topbar-h) + 26px) var(--gutter) 0;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.page--about::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("../images/home/bg.png");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  opacity: 0.5; /* 透明度值，0-1之间，0.5表示50%透明度 */
  z-index: -1; /* 确保背景在内容下方 */
}
.aboutGrid {
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr) 340px;
  gap: 28px;
  align-items: start;
  padding-bottom: 40px;
  height: calc(100vh - var(--topbar-h) - 26px - 100px);
}
.aboutTitle {
  font-size: 16px;
  font-weight: bold;
  font-weight: 700;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  margin: 0 0 18px;
  color: rgba(17, 17, 17, 0.86);
}
.aboutCol {
  color: rgba(17, 17, 17, 0.78);
  font-size: 18px;
  font-weight: bold;
  font-weight: 500;
  line-height: 1.65;
  max-height: calc(100vh - var(--topbar-h) - 120px);
  overflow-y: auto;
  padding-right: 12px;
  scrollbar-width: thin;
  scrollbar-color: rgba(17, 17, 17, 0.2) transparent;
}
.aboutCol::-webkit-scrollbar {
  width: 6px;
}
.aboutCol::-webkit-scrollbar-track {
  background: transparent;
}
.aboutCol::-webkit-scrollbar-thumb {
  background: rgba(17, 17, 17, 0.2);
  border-radius: 3px;
}
.aboutCol::-webkit-scrollbar-thumb:hover {
  background: rgba(17, 17, 17, 0.35);
}
.aboutBlock {
  margin-bottom: 18px;
}
.aboutLabel {
  font-size: 14px;
  font-weight: bold;
  font-weight: 600;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(17, 17, 17, 0.56);
  margin-bottom: 8px;
}
.dim {
  color: rgba(17, 17, 17, 0.55);
  font-size: 14px;
  font-weight: bold;
  font-weight: 500;
}
.aboutImg {
  width: 100%;
  height: min(72vh, 680px);
  object-fit: cover;
  background: #f3f3f3;
}
.aboutCaption {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(17, 17, 17, 0.55);
}

/* ===== Responsive ===== */
@media (max-width: 980px) {
  .topbar {
    height: auto;
    padding: 12px 14px;
  }
  .topnav {
    position: static;
    transform: none;
    margin-left: auto;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .topRight {
    position: static;
    margin-left: 10px;
  }

  .worksPage {
    grid-template-columns: 1fr;
    gap: 14px;
    max-width: calc(100vw - 28px);
  }

  .timeline {
    position: sticky;
    top: 0;
    z-index: 40;
    background: rgba(255, 255, 255, 0.92);
    border-bottom: 1px solid var(--hairline);
    padding: 10px 8px 10px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    max-height: 64px;
    overflow: hidden;
  }
  .timeline.is-open {
    max-height: 70vh;
    overflow: auto;
  }
  .timeline__title,
  .timeline__rule {
    display: none;
  }
  .timelineToggle {
    display: block;
    margin-bottom: 10px;
  }

  .work {
    min-height: auto;
    padding: 26px 0 40px;
  }
  .work__grid--wide {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .yt {
    max-height: none;
  }

  .aboutGrid {
    grid-template-columns: 1fr;
    height: auto;
  }
  .aboutCol {
    max-height: 50vh;
  }
  .aboutImg {
    height: auto;
    aspect-ratio: 4 / 3;
  }

  .worksBg img {
    opacity: 0.06;
  }
}

@media (prefers-reduced-motion: reduce) {
  body {
    transition: none !important;
  }
  .work,
  .photoDrift__img {
    transition: none !important;
  }
}

.topRight a img {
  width: 18px;
  height: 18px;
  display: block;
  object-fit: contain;
}
