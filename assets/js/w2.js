(() => {
  const canvas = document.getElementById("w2Canvas");
  const stage = document.getElementById("w2Stage");
  const modal = document.getElementById("w2Modal");

  if (!canvas || !stage || !modal) return;

  const ctx = canvas.getContext("2d", { alpha: false });

  // --- UI buttons
  const btnReset = document.querySelector('[data-w2="reset"]');
  const btnMute = document.querySelector('[data-w2="mute"]');
  const btnFs = document.querySelector('[data-w2="fs"]');
  const btnYes = document.querySelector('[data-w2="yes"]');
  const btnNo = document.querySelector('[data-w2="no"]');

  // mobile dpad
  const btnUp = document.querySelector('[data-w2="up"]');
  const btnDown = document.querySelector('[data-w2="down"]');
  const btnLeft = document.querySelector('[data-w2="left"]');
  const btnRight = document.querySelector('[data-w2="right"]');

  // --- Assets
  const ASSET_DIR = "../w2-assets/";

  function loadImage(src) {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    img._ok = false;
    img.onload = () => (img._ok = true);
    img.onerror = () => (img._ok = false);
    return img;
  }

  const pets = [
    loadImage(`${ASSET_DIR}pet1.png`),
    loadImage(`${ASSET_DIR}pet2.png`),
    loadImage(`${ASSET_DIR}pet3.png`),
  ];

  const targets = [
    loadImage(`${ASSET_DIR}target1.png`),
    loadImage(`${ASSET_DIR}target2.png`),
    loadImage(`${ASSET_DIR}target3.png`),
  ];

  const wins = [
    loadImage(`${ASSET_DIR}win1.png`),
    loadImage(`${ASSET_DIR}win2.png`),
    loadImage(`${ASSET_DIR}win3.png`),
  ];

  const instructionImg = loadImage(`${ASSET_DIR}instruction.png`);

  // Audio (optional). Browser autoplay rules: we only start audio after a user gesture.
  let audioUnlocked = false;
  let muted = false;

  function makeAudio(src, loop = false) {
    const a = new Audio(src);
    a.loop = loop;
    a.preload = "auto";
    return a;
  }

  const audio = {
    menu: makeAudio(`${ASSET_DIR}background2.MP3`, true),
    game: makeAudio(`${ASSET_DIR}background.MP3`, true),
    move: [
      makeAudio(`${ASSET_DIR}move1.MP3`, false),
      makeAudio(`${ASSET_DIR}move2.MP3`, false),
      makeAudio(`${ASSET_DIR}move3.MP3`, false),
    ],
    win: makeAudio(`${ASSET_DIR}win.MP3`, false),
  };

  function applyMuteState() {
    const vol = muted ? 0 : 1;
    Object.values(audio).forEach((v) => {
      if (Array.isArray(v)) v.forEach((a) => (a.volume = vol));
      else v.volume = vol;
    });
    if (btnMute) btnMute.textContent = muted ? "UNMUTE" : "MUTE";
  }

  async function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    applyMuteState();

    // try play/pause silently to unlock on iOS-like environments
    try {
      await audio.menu.play();
      audio.menu.pause();
      audio.menu.currentTime = 0;
    } catch (_) {
      // If unlock fails, we still keep the game functional without sound.
    }
  }

  // --- Game state
  const State = Object.freeze({
    SELECT: "select",
    INSTRUCTION: "instruction",
    PLAY: "play",
    END_WIN: "end_win",
    END_LOSE: "end_lose",
  });

  let state = State.SELECT;

  let selectedPet = -1;

  let cols = 18;
  let rows = 18;

  let grid = [];
  let player = { x: 0, y: 0 };
  let started = false;
  let startMs = 0;

  let popupCount = 0;
  const maxPopups = 3;
  let popupOpen = false;

  // visual
  let bg = { r: 120, g: 120, b: 120 };
  let contrast = { r: 235, g: 235, b: 235 };
  let jump = { offset: 0, active: false };

  // interaction hot areas
  let petHit = [];     // [{x,y,w,h}]
  let startBtnHit = null;
  let homeBtnHit = null;

  // canvas sizing
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let stageSize = 900;

  function randBg() {
    bg.r = Math.floor(Math.random() * 256);
    bg.g = Math.floor(Math.random() * 256);
    bg.b = Math.floor(Math.random() * 256);
    contrast.r = 255 - bg.r;
    contrast.g = 255 - bg.g;
    contrast.b = 255 - bg.b;
  }

  // --- Maze
  function idx(i, j) {
    if (i < 0 || j < 0 || i >= cols || j >= rows) return -1;
    return i + j * cols;
  }

  function cell(i, j) {
    const k = idx(i, j);
    return k < 0 ? null : grid[k];
  }

  function makeGrid() {
    grid = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        grid.push({
          i, j,
          visited: false,
          // top, right, bottom, left
          walls: [true, true, true, true],
        });
      }
    }
  }

  function unvisitedNeighbors(c) {
    const out = [];
    const top = cell(c.i, c.j - 1);
    const right = cell(c.i + 1, c.j);
    const bottom = cell(c.i, c.j + 1);
    const left = cell(c.i - 1, c.j);

    if (top && !top.visited) out.push(top);
    if (right && !right.visited) out.push(right);
    if (bottom && !bottom.visited) out.push(bottom);
    if (left && !left.visited) out.push(left);

    return out;
  }

  function removeWalls(a, b) {
    const dx = a.i - b.i;
    const dy = a.j - b.j;

    if (dx === 1) { a.walls[3] = false; b.walls[1] = false; }
    else if (dx === -1) { a.walls[1] = false; b.walls[3] = false; }

    if (dy === 1) { a.walls[0] = false; b.walls[2] = false; }
    else if (dy === -1) { a.walls[2] = false; b.walls[0] = false; }
  }

  function generateMaze() {
    makeGrid();

    const stack = [];
    let current = grid[0];
    current.visited = true;

    while (true) {
      const nbs = unvisitedNeighbors(current);
      if (nbs.length) {
        const next = nbs[Math.floor(Math.random() * nbs.length)];
        next.visited = true;
        stack.push(current);
        removeWalls(current, next);
        current = next;
      } else if (stack.length) {
        current = stack.pop();
      } else {
        break;
      }
    }
  }

  function resetRun() {
    player = { x: 0, y: 0 };
    started = false;
    startMs = 0;
    popupCount = 0;
    closePopup();
    jump.offset = 0;
    jump.active = false;
    generateMaze();
  }

  function fullReset() {
    state = State.SELECT;
    selectedPet = -1;
    randBg();
    resetRun();
    stopGameAudio();
    playMenuAudio();
  }

  // --- Audio routing
  function stopAllAudio() {
    Object.values(audio).forEach((v) => {
      if (Array.isArray(v)) {
        v.forEach((a) => {
          try { a.pause(); a.currentTime = 0; } catch (_) {}
        });
      } else {
        try { v.pause(); v.currentTime = 0; } catch (_) {}
      }
    });
  }

  function playMenuAudio() {
    if (!audioUnlocked || muted) return;
    try {
      audio.game.pause();
      audio.menu.play().catch(() => {});
    } catch (_) {}
  }

  function stopMenuAudio() {
    try { audio.menu.pause(); } catch (_) {}
  }

  function playGameAudio() {
    if (!audioUnlocked || muted) return;
    try {
      audio.menu.pause();
      audio.game.play().catch(() => {});
    } catch (_) {}
  }

  function stopGameAudio() {
    try { audio.game.pause(); } catch (_) {}
  }

  function playMoveSound() {
    if (!audioUnlocked || muted) return;
    if (selectedPet < 0 || selectedPet > 2) return;
    try {
      const s = audio.move[selectedPet];
      s.currentTime = 0;
      s.play().catch(() => {});
    } catch (_) {}
  }

  function playWinSoundOnce() {
    if (!audioUnlocked || muted) return;
    try {
      audio.win.currentTime = 0;
      audio.win.play().catch(() => {});
    } catch (_) {}
  }

  // --- Popup
  function openPopup() {
    popupOpen = true;
    modal.classList.add("isOpen");
    modal.setAttribute("aria-hidden", "false");
  }

  function closePopup() {
    popupOpen = false;
    modal.classList.remove("isOpen");
    modal.setAttribute("aria-hidden", "true");
  }

  // --- Fullscreen
  async function toggleFullscreen() {
    const el = stage;
    const doc = document;

    try {
      if (!doc.fullscreenElement) await el.requestFullscreen();
      else await doc.exitFullscreen();
    } catch (_) {
      // ignore
    }
  }

  // --- Geometry helpers
  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    stageSize = Math.max(320, Math.floor(Math.min(r.width, r.height)));

    canvas.width = Math.floor(stageSize * dpr);
    canvas.height = Math.floor(stageSize * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
  }

  function pointerPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const x = (evt.clientX - rect.left) * (stageSize / rect.width);
    const y = (evt.clientY - rect.top) * (stageSize / rect.height);
    return { x, y };
  }

  function hitTest(p, box) {
    if (!box) return false;
    return p.x >= box.x && p.x <= box.x + box.w && p.y >= box.y && p.y <= box.y + box.h;
  }

  // --- Rendering
  function clear(bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, stageSize, stageSize);
  }

  function drawText(txt, x, y, size, color, align = "center") {
    ctx.fillStyle = color;
    ctx.font = `${size}px serif`;
    ctx.textAlign = align;
    ctx.textBaseline = "top";
    ctx.fillText(txt, x, y);
  }

  function drawMaze() {
    const pad = Math.floor(stageSize * 0.08);
    const avail = stageSize - pad * 2;
    const cellSize = avail / cols;

    // bg
    clear("#ffffff");

    // walls
    ctx.strokeStyle = "#000";
    ctx.lineWidth = Math.max(2, cellSize * 0.08);
    ctx.lineCap = "square";

    for (const c of grid) {
      const x = pad + c.i * cellSize;
      const y = pad + c.j * cellSize;

      const top = c.walls[0];
      const right = c.walls[1];
      const bottom = c.walls[2];
      const left = c.walls[3];

      ctx.beginPath();
      if (top) { ctx.moveTo(x, y); ctx.lineTo(x + cellSize, y); }
      if (right) { ctx.moveTo(x + cellSize, y); ctx.lineTo(x + cellSize, y + cellSize); }
      if (bottom) { ctx.moveTo(x + cellSize, y + cellSize); ctx.lineTo(x, y + cellSize); }
      if (left) { ctx.moveTo(x, y + cellSize); ctx.lineTo(x, y); }
      ctx.stroke();
    }

    // exit target
    const ex = pad + (cols - 1) * cellSize;
    const ey = pad + (rows - 1) * cellSize;
    const tImg = targets[selectedPet] || null;

    if (tImg && tImg._ok) {
      const m = cellSize * 0.9;
      ctx.drawImage(tImg, ex + (cellSize - m) / 2, ey + (cellSize - m) / 2, m, m);
    } else {
      ctx.fillStyle = "rgba(0,0,0,.08)";
      ctx.fillRect(ex + cellSize * 0.15, ey + cellSize * 0.15, cellSize * 0.7, cellSize * 0.7);
    }

    // timer
    if (started) {
      const sec = Math.floor((performance.now() - startMs) / 1000);
      ctx.fillStyle = "#000";
      ctx.font = `bold ${Math.max(16, stageSize * 0.03)}px serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(`Time: ${sec}s`, pad, Math.max(10, pad * 0.45));
    }

    // player
    const px = pad + player.x * cellSize + cellSize / 2;
    const py = pad + player.y * cellSize + cellSize / 2 + jump.offset;

    const pImg = pets[selectedPet] || null;
    const s = cellSize * 0.92;

    if (pImg && pImg._ok) {
      ctx.drawImage(pImg, px - s / 2, py - s / 2, s, s);
    } else {
      ctx.fillStyle = "rgba(0,0,0,.16)";
      ctx.beginPath();
      ctx.arc(px, py, s * 0.36, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawSelection() {
    clear(`rgb(${bg.r},${bg.g},${bg.b})`);

    drawText("Click to select an animal", stageSize / 2, Math.floor(stageSize * 0.06), Math.floor(stageSize * 0.05), `rgb(${contrast.r},${contrast.g},${contrast.b})`);

    // pets row
    petHit = [];

    const y = stageSize * 0.58;
    const size = stageSize * 0.16;
    const gap = stageSize * 0.09;
    const totalW = size * 3 + gap * 2;
    let x0 = (stageSize - totalW) / 2;

    for (let i = 0; i < 3; i++) {
      const x = x0 + i * (size + gap);

      // subtle plate
      ctx.fillStyle = "rgba(255,255,255,.08)";
      ctx.strokeStyle = "rgba(255,255,255,.16)";
      ctx.lineWidth = 1;
      roundRect(ctx, x - 10, y - 10, size + 20, size + 20, 18);
      ctx.fill();
      ctx.stroke();

      const img = pets[i];
      if (img && img._ok) {
        ctx.drawImage(img, x, y, size, size);
      } else {
        ctx.fillStyle = "rgba(255,255,255,.35)";
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }

      petHit.push({ x, y, w: size, h: size });
    }

    drawText("Let them become more beautiful!", stageSize / 2, Math.floor(stageSize * 0.90), Math.floor(stageSize * 0.04), `rgba(255,255,255,.85)`);
  }

  function drawInstruction() {
    clear("#d9d9d9");

    const title = "Instruction";
    drawText(title, stageSize / 2, Math.floor(stageSize * 0.06), Math.floor(stageSize * 0.05), "#111");

    // instruction image or fallback text
    if (instructionImg && instructionImg._ok) {
      const w = stageSize * 0.82;
      const h = stageSize * 0.58;
      const x = (stageSize - w) / 2;
      const y = stageSize * 0.16;
      ctx.drawImage(instructionImg, x, y, w, h);
    } else {
      const lines = [
        "Use arrow keys (or WASD) to move.",
        "Reach the exit target in the bottom-right corner.",
        "Timed pop-ups will interrupt your run (1/2/3 minutes).",
      ];
      ctx.fillStyle = "rgba(0,0,0,.75)";
      ctx.font = `${Math.floor(stageSize * 0.032)}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const y0 = stageSize * 0.30;
      lines.forEach((l, k) => ctx.fillText(l, stageSize / 2, y0 + k * stageSize * 0.05));
    }

    // start button
    const bw = stageSize * 0.28;
    const bh = stageSize * 0.08;
    const bx = (stageSize - bw) / 2;
    const by = stageSize * 0.80;

    startBtnHit = { x: bx, y: by, w: bw, h: bh };

    ctx.fillStyle = "rgb(40,160,80)";
    ctx.strokeStyle = "rgba(255,255,255,.9)";
    ctx.lineWidth = 2;
    roundRect(ctx, bx, by, bw, bh, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = `600 ${Math.floor(stageSize * 0.032)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Start Game", stageSize / 2, by + bh / 2);
  }

  function drawEnd(win) {
    clear("#2f2f2f");

    // title
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    if (win) {
      ctx.fillStyle = "rgb(255,215,0)";
      ctx.font = `700 ${Math.floor(stageSize * 0.07)}px serif`;
      const ending = selectedPet === 0 ? "Ending One" : selectedPet === 1 ? "Ending Two" : "Ending Three";
      ctx.fillText(ending, stageSize / 2, Math.floor(stageSize * 0.06));

      ctx.fillStyle = "rgba(255,255,255,.92)";
      ctx.font = `${Math.floor(stageSize * 0.034)}px serif`;
      const line1 = selectedPet === 0 ? "You became a female snake with" :
                    selectedPet === 1 ? "You became an eagle wearing" :
                    "You became a skinny tiger!";
      const line2 = selectedPet === 0 ? "double eyelids and false eyelashes!" :
                    selectedPet === 1 ? "slimming stockings!" : "";

      ctx.fillText(line1, stageSize / 2, Math.floor(stageSize * 0.16));
      if (line2) ctx.fillText(line2, stageSize / 2, Math.floor(stageSize * 0.21));

      // win image
      const img = wins[selectedPet];
      if (img && img._ok) {
        const s = stageSize * 0.62;
        ctx.drawImage(img, (stageSize - s) / 2, stageSize * 0.28, s, s);
      } else {
        ctx.fillStyle = "rgba(255,255,255,.12)";
        roundRect(ctx, stageSize * 0.2, stageSize * 0.32, stageSize * 0.6, stageSize * 0.56, 24);
        ctx.fill();
      }

      // reflection lines
      ctx.fillStyle = "rgba(255,255,255,.65)";
      ctx.font = `${Math.floor(stageSize * 0.022)}px serif`;
      ctx.fillText("This is your decision, congratulations!", stageSize / 2, Math.floor(stageSize * 0.92));
      ctx.fillText("But, is it really your own decision?", stageSize / 2, Math.floor(stageSize * 0.955));
    } else {
      ctx.fillStyle = "rgba(130,200,255,.95)";
      ctx.font = `700 ${Math.floor(stageSize * 0.06)}px serif`;
      const line = selectedPet === 0 ? "You are still a snake!" :
                   selectedPet === 1 ? "You are still an eagle!" :
                   "You are still a tiger!";
      ctx.fillText(line, stageSize / 2, Math.floor(stageSize * 0.08));

      const img = pets[selectedPet];
      if (img && img._ok) {
        const s = stageSize * 0.62;
        ctx.drawImage(img, (stageSize - s) / 2, stageSize * 0.22, s, s);
      } else {
        ctx.fillStyle = "rgba(255,255,255,.12)";
        roundRect(ctx, stageSize * 0.2, stageSize * 0.25, stageSize * 0.6, stageSize * 0.58, 24);
        ctx.fill();
      }
    }

    // home button
    const bw = stageSize * 0.32;
    const bh = stageSize * 0.085;
    const bx = (stageSize - bw) / 2;
    const by = stageSize * 0.84;

    homeBtnHit = { x: bx, y: by, w: bw, h: bh };

    ctx.fillStyle = "rgb(100,150,255)";
    ctx.strokeStyle = "rgba(255,255,255,.9)";
    ctx.lineWidth = 2;
    roundRect(ctx, bx, by, bw, bh, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = `600 ${Math.floor(stageSize * 0.03)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Back to Home", stageSize / 2, by + bh / 2);
  }

  function roundRect(c, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + rr, y);
    c.arcTo(x + w, y, x + w, y + h, rr);
    c.arcTo(x + w, y + h, x, y + h, rr);
    c.arcTo(x, y + h, x, y, rr);
    c.arcTo(x, y, x + w, y, rr);
    c.closePath();
  }

  // --- Game logic
  function elapsedSec() {
    if (!started) return 0;
    return Math.floor((performance.now() - startMs) / 1000);
  }

  function maybeTriggerPopup() {
    if (popupCount >= maxPopups) return;
    if (popupOpen) return;
    if (!started) return;

    const sec = elapsedSec();
    const target = (popupCount + 1) * 60;
    if (sec >= target) openPopup();
  }

  function currentCell() {
    return cell(player.x, player.y);
  }

  function canMove(dir) {
    const c = currentCell();
    if (!c) return false;

    // dir: 0 top, 1 right, 2 bottom, 3 left
    if (c.walls[dir]) return false;

    if (dir === 0) return player.y > 0;
    if (dir === 1) return player.x < cols - 1;
    if (dir === 2) return player.y < rows - 1;
    if (dir === 3) return player.x > 0;
    return false;
  }

  function doMove(dir) {
    if (state !== State.PLAY) return;
    if (popupOpen) return;

    if (!started) {
      started = true;
      startMs = performance.now();
      stopMenuAudio();
      playGameAudio();
    }

    if (!canMove(dir)) return;

    if (dir === 0) player.y -= 1;
    if (dir === 1) player.x += 1;
    if (dir === 2) player.y += 1;
    if (dir === 3) player.x -= 1;

    jump.active = true;
    jump.offset = -10;

    playMoveSound();

    // win?
    if (player.x === cols - 1 && player.y === rows - 1) {
      state = State.END_WIN;
      closePopup();
      stopGameAudio();
      playMenuAudio();
      playWinSoundOnce();
    }
  }

  function chooseYes() {
    closePopup();
    popupCount += 1;
  }

  function chooseNo() {
    closePopup();
    state = State.END_LOSE;
    stopGameAudio();
    playMenuAudio();
  }

  // --- Event handlers
  async function handleUserGesture() {
    await unlockAudio();
  }

  function onCanvasClick(evt) {
    canvas.focus();
    handleUserGesture();

    const p = pointerPos(evt);

    if (state === State.SELECT) {
      for (let i = 0; i < petHit.length; i++) {
        if (hitTest(p, petHit[i])) {
          selectedPet = i;
          state = State.INSTRUCTION;
          resetRun();
          playMenuAudio();
          return;
        }
      }
      return;
    }

    if (state === State.INSTRUCTION) {
      if (hitTest(p, startBtnHit)) {
        state = State.PLAY;
        resetRun();
        return;
      }
      return;
    }

    if (state === State.END_WIN || state === State.END_LOSE) {
      if (hitTest(p, homeBtnHit)) {
        fullReset();
        return;
      }
      return;
    }
  }

  function onKeyDown(evt) {
    if (!["ArrowUp","ArrowRight","ArrowDown","ArrowLeft","w","a","s","d","W","A","S","D","y","n","Y","N","r","R"].includes(evt.key)) return;

    // avoid page scroll
    evt.preventDefault();
    handleUserGesture();

    if (popupOpen) {
      if (evt.key === "y" || evt.key === "Y") chooseYes();
      if (evt.key === "n" || evt.key === "N") chooseNo();
      return;
    }

    if (state === State.END_WIN || state === State.END_LOSE) {
      if (evt.key === "r" || evt.key === "R") fullReset();
      return;
    }

    if (state !== State.PLAY) return;

    if (evt.key === "ArrowUp" || evt.key === "w" || evt.key === "W") doMove(0);
    if (evt.key === "ArrowRight" || evt.key === "d" || evt.key === "D") doMove(1);
    if (evt.key === "ArrowDown" || evt.key === "s" || evt.key === "S") doMove(2);
    if (evt.key === "ArrowLeft" || evt.key === "a" || evt.key === "A") doMove(3);
  }

  // Control buttons
  btnReset && btnReset.addEventListener("click", () => {
    handleUserGesture();
    fullReset();
  });

  btnMute && btnMute.addEventListener("click", () => {
    handleUserGesture();
    muted = !muted;
    applyMuteState();
  });

  btnFs && btnFs.addEventListener("click", () => {
    handleUserGesture();
    toggleFullscreen();
  });

  btnYes && btnYes.addEventListener("click", () => {
    handleUserGesture();
    chooseYes();
  });

  btnNo && btnNo.addEventListener("click", () => {
    handleUserGesture();
    chooseNo();
  });

  // mobile dpad
  function bindDpad(btn, dir) {
    if (!btn) return;
    btn.addEventListener("click", () => {
      handleUserGesture();
      doMove(dir);
    });
  }
  bindDpad(btnUp, 0);
  bindDpad(btnRight, 1);
  bindDpad(btnDown, 2);
  bindDpad(btnLeft, 3);

  canvas.addEventListener("click", onCanvasClick);
  window.addEventListener("keydown", onKeyDown);

  // --- main loop
  function tick() {
    // jump easing
    if (jump.active) {
      jump.offset += 2;
      if (jump.offset >= 0) {
        jump.offset = 0;
        jump.active = false;
      }
    }

    if (state === State.SELECT) {
      drawSelection();
    } else if (state === State.INSTRUCTION) {
      drawInstruction();
    } else if (state === State.PLAY) {
      drawMaze();
      maybeTriggerPopup();
    } else if (state === State.END_WIN) {
      drawEnd(true);
    } else if (state === State.END_LOSE) {
      drawEnd(false);
    }

    requestAnimationFrame(tick);
  }

  // init
  function init() {
    resizeCanvas();
    randBg();
    generateMaze();
    applyMuteState();
    stopAllAudio(); // do not autoplay
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
  });

  init();
})();
