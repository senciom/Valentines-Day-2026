'use strict';

/* ── Mobile Audio Unlock ─────────────────────────── */
// Mobile browsers block audio until a user gesture on the current page.
// Instead of the play+pause trick (which can start/stop the wrong tracks),
// we queue any play() calls that fail due to autoplay policy and replay
// them on the first real user gesture.
(function setupAudioUnlock() {
  const pendingQueue = [];   // { audio, volume }
  let unlocked = false;

  function onGesture() {
    if (unlocked) return;
    unlocked = true;
    pendingQueue.forEach(({ audio, volume }) => {
      if (volume !== undefined) audio.volume = volume;
      audio.play().catch(() => {});
    });
    pendingQueue.length = 0;
    document.removeEventListener('touchstart', onGesture, true);
    document.removeEventListener('click', onGesture, true);
    document.removeEventListener('touchend', onGesture, true);
  }

  document.addEventListener('touchstart', onGesture, true);
  document.addEventListener('click', onGesture, true);
  document.addEventListener('touchend', onGesture, true);

  // Global helper — tries to play; if blocked, queues for first gesture.
  window.safePlay = function (audio, volume) {
    if (!audio) return;
    if (volume !== undefined) audio.volume = volume;
    const p = audio.play();
    if (p) {
      p.catch(() => {
        if (!unlocked) {
          if (!pendingQueue.some(q => q.audio === audio)) {
            pendingQueue.push({ audio, volume });
          }
        }
      });
    }
  };
})();

/* ── Global Music State ─────────────────────────── */
function initGlobalMusicState() {
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const audioElements = document.querySelectorAll('audio');

  let isMuted = sessionStorage.getItem('isMuted') === 'true';

  function applyMuteState() {
    audioElements.forEach(audio => {
      audio.muted = isMuted;
    });
    if (musicToggleBtn) {
      musicToggleBtn.textContent = isMuted ? '🔇' : '🔊';
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      sessionStorage.setItem('isMuted', isMuted);
      applyMuteState();
    });
  }

  applyMuteState();
}
document.addEventListener('DOMContentLoaded', initGlobalMusicState);

/* ── Clock ──────────────────────────────────────── */
function updateClocks() {
    const now = new Date();
    const h = now.getHours() % 12 || 12;
    const m = String(now.getMinutes()).padStart(2, '0');
    const t = `${h}:${m}`;
    ['login-time', 'intro-time', 'vn-time'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = t;
    });
}
updateClocks();
setInterval(updateClocks, 30000);

let playerName = sessionStorage.getItem('playerName') || 'You';

/* ── Title Screen Particles ─────────────────────── */
const floatContainer = document.getElementById('float-container');

function buildStars() {
    if (!floatContainer) return;
    for (let i = 0; i < 55; i++) {
        const s = document.createElement('div');
        s.className = 'star-dot';
        const size = .8 + Math.random() * 2.2;
        s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*78}%;width:${size}px;height:${size}px;animation-duration:${1.4+Math.random()*3}s;animation-delay:${Math.random()*4}s;`;
        floatContainer.appendChild(s);
    }
}
buildStars();

const petalSet = ['🌸', '🌸', '🌸', '💮', '🌺', '💕', '✨'];

function spawnPetal() {
    if (!floatContainer) return;
    const el = document.createElement('div');
    el.className = 'particle';
    el.textContent = petalSet[Math.floor(Math.random() * petalSet.length)];
    el.style.left = (3 + Math.random() * 94) + '%';
    el.style.bottom = '-30px';
    const dur = 5 + Math.random() * 5;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = (Math.random() * 1.2) + 's';
    el.style.fontSize = (11 + Math.random() * 13) + 'px';
    el.style.opacity = '0';
    floatContainer.appendChild(el);
    setTimeout(() => el.remove(), (dur + 2) * 1000);
}

let petalTimer = null;
if (floatContainer) {
    petalTimer = setInterval(spawnPetal, 650);
    for (let i = 0; i < 6; i++) setTimeout(spawnPetal, i * 180);
}

/* ── Page Navigation with Animation ──────────────── */
function navigateTo(url) {
    document.body.classList.add('is-navigating');
    setTimeout(() => {
        window.location.href = url;
    }, 500); // Match animation duration in CSS
}

/* ── Typewriter effect ──────────────────────────── */
function typeWriter(el, text, speed, onDone) {
    el.textContent = '';
    let i = 0;
    const tick = () => {
        if (i < text.length) {
            el.textContent += text[i++];
            setTimeout(tick, speed);
        } else if (onDone) {
            onDone();
        }
    };
    tick();
}

/* ── HP hearts fill animation ───────────────────── */
function animateHP(total = 5) {
    const row = document.getElementById('hp-row');
    if (!row) return;
    row.querySelectorAll('.hp-heart').forEach(h => h.remove());
    for (let i = 0; i < total; i++) {
        const h = document.createElement('span');
        h.className = 'hp-heart';
        h.textContent = '♥';
        row.appendChild(h);
        setTimeout(() => h.classList.add('filled'), 250 + i * 160);
    }
}

/* ── Glitch on element ──────────────────────────── */
let _glitchTimer = null;
function startGlitch(id) {
    const el = document.getElementById(id);
    if (!el) return;
    _glitchTimer = setInterval(() => {
        if (Math.random() < 0.28) {
            el.classList.add('glitch-effect');
            setTimeout(() => el.classList.remove('glitch-effect'), 350);
        }
    }, 2800);
}
function stopGlitch() { clearInterval(_glitchTimer); _glitchTimer = null; }

/* ── Login background ──────────────────────────── */
let _loginParticleTimer = null;
function buildLoginBg() {
    const c = document.getElementById('login-particles');
    if (!c) return;
    for (let i = 0; i < 32; i++) {
        const s = document.createElement('div');
        s.className = 'star-dot';
        const sz = .5 + Math.random() * 1.8;
        s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;animation-duration:${1.5+Math.random()*3}s;animation-delay:${Math.random()*5}s;`;
        c.appendChild(s);
    }
    const syms = ['♥', '✦', '·', '♡', '·', '✧'];
    _loginParticleTimer = setInterval(() => {
        const el = document.createElement('div');
        el.className = 'particle';
        el.textContent = syms[Math.floor(Math.random() * syms.length)];
        el.style.cssText = `left:${5+Math.random()*90}%;bottom:-20px;font-size:${7+Math.random()*8}px;color:rgba(255,${100+Math.floor(Math.random()*80)},${150+Math.floor(Math.random()*70)},.${3+Math.floor(Math.random()*4)});`;
        const dur = 7 + Math.random() * 5;
        el.style.animationDuration = dur + 's';
        c.appendChild(el);
        setTimeout(() => el.remove(), (dur + 2) * 1000);
    }, 1400);
}

/* ── Pixel burst ────────────────────────────────── */
function pixelBurst(el) {
    const phone = document.getElementById('phone');
    const pr = phone.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const cx = er.left + er.width / 2 - pr.left;
    const cy = er.top + er.height / 2 - pr.top;
    const items = ['💕', '♥', '✦', '🌸', '💖', '✧'];
    for (let i = 0; i < 14; i++) {
        const p = document.createElement('div');
        p.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;font-size:${9+Math.random()*10}px;pointer-events:none;z-index:9999;transition:transform 1s cubic-bezier(.2,1,.3,1),opacity 1s ease;opacity:1;`;
        p.textContent = items[Math.floor(Math.random() * items.length)];
        phone.appendChild(p);
        requestAnimationFrame(() => requestAnimationFrame(() => {
            const angle = (i / 14) * Math.PI * 2;
            const dist = 45 + Math.random() * 65;
            p.style.transform = `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`;
            p.style.opacity = '0';
        }));
        setTimeout(() => p.remove(), 1100);
    }
}

/* ── Init login screen ──────────────────────────── */
function initLoginScreen() {
  buildLoginBg();
  setTimeout(animateHP, 350);
  const titleEl = document.getElementById('login-pixel-title');
  if (titleEl) {
    setTimeout(() => {
      typeWriter(titleEl, 'PLAYER LOGIN', 85, () => startGlitch('login-pixel-title'));
    }, 180);
  }
}

/* ── Press-start blink then transition ───────────── */
function goToLogin() {
  const clickSound = document.querySelector('audio[data-sound="click"]');
  if (clickSound) {
    clickSound.currentTime = 0;
    safePlay(clickSound);
  }
  clearInterval(petalTimer);
  const btn = document.querySelector('.press-start-btn');
  if (btn) {
    btn.style.animation = 'none';
    btn.disabled = true;
    let n = 0;
    const blink = setInterval(() => { // A few blinks for effect
      btn.style.opacity = n % 2 === 0 ? '0' : '1';
      if (++n > 4) {
        clearInterval(blink);
        navigateTo('login.html');
      }
    }, 70);
  } else {
    navigateTo('login.html');
  }
}

/* ── Love bar fill on intro load ─────────────────── */
function animateLoveBar() {
  const fill = document.getElementById('sf-bar-fill');
  if (fill) setTimeout(() => fill.classList.add('full'), 400);
}
animateLoveBar();

/* ── Login validation ────────────────────────────── */
let _hintShown = false;
function handleLoginClick() {
  const clickSound = document.querySelector('audio[data-sound="click"]');
  if (clickSound) {
    clickSound.currentTime = 0;
    safePlay(clickSound);
  }

  const name    = document.getElementById('user-name').value.trim();
  const pass    = document.getElementById('user-pass').value;
  const errorEl = document.getElementById('login-error');
  const btn     = document.getElementById('login-btn');

  if (!name) {
    errorEl.textContent = '! ENTER YOUR NAME FIRST !';
    errorEl.classList.remove('shake');
    void errorEl.offsetWidth;
    errorEl.classList.add('shake');
    document.getElementById('user-name').focus();
    return;
  }

  if (pass !== '0811') {
    document.getElementById('user-pass').value = '';
    errorEl.textContent = '! WRONG CODE !';
    errorEl.classList.remove('shake');
    void errorEl.offsetWidth;
    errorEl.classList.add('shake');
    if (!_hintShown) {
      _hintShown = true;
      setTimeout(() => {
        errorEl.textContent = 'HINT: ANNIVERSARY (in digits)';
        errorEl.classList.remove('shake');
        void errorEl.offsetWidth;
        errorEl.classList.add('shake');
      }, 1400);
    } else {
      setTimeout(() => { errorEl.textContent = 'HINT: ANNIVERSARY (in digits)'; }, 1400);
    }
    document.getElementById('user-pass').focus();
    return;
  }

  _hintShown = false;
  sessionStorage.setItem('playerName', name);
  playerName = name;
  errorEl.textContent = '';
  btn.textContent = '♥ LOADING... ♥';
  btn.disabled = true;
  pixelBurst(btn);
  setTimeout(() => goToVN(), 700);
}

/* ── Transition to VN ────────────────────────────── */
function goToVN() {
  navigateTo('visual.html');
}


/* ═══════════════════════════════════════════════════
   VISUAL NOVEL ENGINE
   ═══════════════════════════════════════════════════ */

const wait = ms => new Promise(r => setTimeout(r, ms));

/* ── Val expressions ─────────────────────────────── */
// 1. Redefined Base: FIXED Short Hair (No Mullet)
const HEAD_BASE = `
  <defs><style>.sp{shape-rendering:crispEdges;}</style></defs>

  <rect x="13" y="16" width="6" height="4" fill="#d09668" class="sp"/>

  <rect x="9" y="7" width="14" height="8" fill="#101010" class="sp"/>

  <rect x="10" y="5" width="12" height="11" fill="#d09668" class="sp"/>
  <rect x="9" y="8" width="1" height="5" fill="#d09668" class="sp"/> <rect x="22" y="8" width="1" height="5" fill="#d09668" class="sp"/> <rect x="9" y="2" width="14" height="4" fill="#101010" class="sp"/>

  <rect x="9" y="6" width="1" height="2" fill="#101010" class="sp"/>   <rect x="22" y="6" width="1" height="2" fill="#101010" class="sp"/>  <rect x="8" y="7" width="1" height="2" fill="#101010" class="sp"/>
  <rect x="23" y="7" width="1" height="2" fill="#101010" class="sp"/>

  <rect x="13" y="2" width="10" height="4" fill="#101010" class="sp"/> <rect x="18" y="6" width="4" height="1" fill="#101010" class="sp"/>  <rect x="21" y="5" width="1" height="2" fill="#101010" class="sp"/>  <rect x="14" y="2" width="6" height="1" fill="#333344" opacity="0.5" class="sp"/>
`;

const EYES_NORMAL = `
  <rect x="11" y="9" width="3" height="2" fill="#ffffff" class="sp"/>
  <rect x="18" y="9" width="3" height="2" fill="#ffffff" class="sp"/>
  <rect x="12" y="9" width="1" height="2" fill="#2b1a10" class="sp"/>
  <rect x="19" y="9" width="1" height="2" fill="#2b1a10" class="sp"/>
`;

const EYES_WITH_GLASSES = `
  <rect x="10" y="8" width="6" height="5" fill="#000" class="sp"/>
  <rect x="17" y="8" width="6" height="5" fill="#000" class="sp"/>
  <rect x="15" y="9" width="2" height="2" fill="#000" class="sp"/>
  <rect x="11" y="9" width="1" height="1" fill="#fff" opacity="0.7" class="sp"/>
  <rect x="18" y="9" width="1" height="1" fill="#fff" opacity="0.7" class="sp"/>
`;

const wrapSVG = (content) => `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">${HEAD_BASE}${content}</svg>`;

const VAL_FACES = {
  happy: wrapSVG(`
    <rect x="11" y="8" width="3" height="1" fill="#2b1a10" class="sp"/>
    <rect x="18" y="8" width="3" height="1" fill="#2b1a10" class="sp"/>
    ${EYES_NORMAL}
    <rect x="15" y="13" width="2" height="1" fill="#a06a45" class="sp"/> <rect x="14" y="14" width="1" height="1" fill="#b05e48" class="sp"/>
    <rect x="17" y="14" width="1" height="1" fill="#b05e48" class="sp"/>
    <rect x="15" y="15" width="2" height="1" fill="#b05e48" class="sp"/>
  `),

  bright: wrapSVG(`
    <rect x="11" y="7" width="3" height="1" fill="#2b1a10" class="sp"/>
    <rect x="18" y="7" width="3" height="1" fill="#2b1a10" class="sp"/>
    ${EYES_NORMAL}
    <rect x="15" y="13" width="2" height="1" fill="#a06a45" class="sp"/>
    <rect x="14" y="14" width="4" height="2" fill="#ffffff" class="sp"/>
    <rect x="14" y="14" width="1" height="2" fill="#b05e48" class="sp"/> <rect x="17" y="14" width="1" height="2" fill="#b05e48" class="sp"/>
    <rect x="15" y="16" width="2" height="1" fill="#b05e48" class="sp"/>
  `),

  blush: wrapSVG(`
    <rect x="11" y="8" width="3" height="1" fill="#2b1a10" class="sp"/>
    <rect x="18" y="8" width="3" height="1" fill="#2b1a10" class="sp"/>
    ${EYES_NORMAL}
    <rect x="15" y="13" width="2" height="1" fill="#a06a45" class="sp"/>
    <rect x="15" y="14" width="2" height="1" fill="#b05e48" class="sp"/>
    <rect x="10" y="11" width="2" height="1" fill="#ff8888" opacity="0.6" class="sp"/>
    <rect x="20" y="11" width="2" height="1" fill="#ff8888" opacity="0.6" class="sp"/>
  `),

  plead: wrapSVG(`
    <rect x="11" y="7" width="1" height="1" fill="#2b1a10" class="sp"/> <rect x="12" y="8" width="2" height="1" fill="#2b1a10" class="sp"/>
    <rect x="20" y="7" width="1" height="1" fill="#2b1a10" class="sp"/> <rect x="18" y="8" width="2" height="1" fill="#2b1a10" class="sp"/>
    ${EYES_NORMAL}
    <rect x="15" y="13" width="2" height="1" fill="#a06a45" class="sp"/>
    <rect x="15" y="14" width="2" height="1" fill="#b05e48" class="sp"/>
  `),

  annoyed: wrapSVG(`
    <rect x="11" y="8" width="3" height="1" fill="#2b1a10" class="sp"/>
    <rect x="18" y="8" width="3" height="1" fill="#2b1a10" class="sp"/>
    <rect x="11" y="9" width="3" height="2" fill="#ffffff" class="sp"/>
    <rect x="18" y="9" width="3" height="2" fill="#ffffff" class="sp"/>
    <rect x="13" y="9" width="1" height="2" fill="#2b1a10" class="sp"/>
    <rect x="20" y="9" width="1" height="2" fill="#2b1a10" class="sp"/>
    <rect x="15" y="13" width="2" height="1" fill="#a06a45" class="sp"/>
    <rect x="14" y="15" width="4" height="1" fill="#b05e48" class="sp"/>
  `),

  serious: wrapSVG(`
    <rect x="11" y="8" width="2" height="1" fill="#2b1a10" class="sp"/>
    <rect x="13" y="9" width="1" height="1" fill="#2b1a10" class="sp"/> <rect x="18" y="9" width="1" height="1" fill="#2b1a10" class="sp"/> <rect x="19" y="8" width="2" height="1" fill="#2b1a10" class="sp"/>
    ${EYES_NORMAL}
    <rect x="15" y="13" width="2" height="1" fill="#a06a45" class="sp"/>
    <rect x="14" y="15" width="4" height="1" fill="#b05e48" class="sp"/>
  `),

  smug: wrapSVG(`
    <rect x="11" y="8" width="3" height="1" fill="#2b1a10" class="sp"/> <rect x="18" y="7" width="3" height="1" fill="#2b1a10" class="sp"/> ${EYES_NORMAL}
    <rect x="15" y="13" width="2" height="1" fill="#a06a45" class="sp"/>
    <rect x="14" y="15" width="2" height="1" fill="#b05e48" class="sp"/>
    <rect x="16" y="14" width="2" height="1" fill="#b05e48" class="sp"/>
  `),

  smugWithGlasses: wrapSVG(`
    <rect x="11" y="8" width="3" height="1" fill="#2b1a10" class="sp"/> <rect x="18" y="7" width="3" height="1" fill="#2b1a10" class="sp"/> ${EYES_WITH_GLASSES}
    <rect x="15" y="13" width="2" height="1" fill="#a06a45" class="sp"/>
    <rect x="14" y="15" width="2" height="1" fill="#b05e48" class="sp"/>
    <rect x="16" y="14" width="2" height="1" fill="#b05e48" class="sp"/>
  `),

  whisper: wrapSVG(`
    <rect x="11" y="8" width="3" height="1" fill="#2b1a10" class="sp"/>
    <rect x="18" y="8" width="3" height="1" fill="#2b1a10" class="sp"/>
    ${EYES_NORMAL}
    <rect x="15" y="13" width="2" height="1" fill="#a06a45" class="sp"/>
    <rect x="16" y="15" width="2" height="1" fill="#b05e48" class="sp"/>
    <rect x="18" y="13" width="1" height="3" fill="#d09668" class="sp"/> `),

  blank: wrapSVG(`
    <rect x="11" y="8" width="3" height="1" fill="#2b1a10" class="sp"/>
    <rect x="18" y="8" width="3" height="1" fill="#2b1a10" class="sp"/>
    <rect x="12" y="10" width="1" height="1" fill="#2b1a10" class="sp"/>
    <rect x="19" y="10" width="1" height="1" fill="#2b1a10" class="sp"/>
    <rect x="15" y="13" width="2" height="1" fill="#a06a45" class="sp"/>
    <rect x="15" y="15" width="2" height="1" fill="#b05e48" class="sp"/>
  `),

  yandere: wrapSVG(`
    <rect x="10" y="5" width="12" height="6" fill="#000000" opacity="0.3" class="sp"/>

    <rect x="11" y="8" width="3" height="1" fill="#2b1a10" class="sp"/>
    <rect x="18" y="8" width="3" height="1" fill="#2b1a10" class="sp"/>

    <rect x="11" y="9" width="3" height="2" fill="#ffffff" class="sp"/>
    <rect x="18" y="9" width="3" height="2" fill="#ffffff" class="sp"/>
    <rect x="12" y="9" width="1" height="2" fill="#000000" class="sp"/> <rect x="19" y="9" width="1" height="2" fill="#000000" class="sp"/>

    <rect x="15" y="13" width="2" height="1" fill="#a06a45" class="sp"/>
    <rect x="14" y="15" width="1" height="1" fill="#b05e48" class="sp"/>
    <rect x="17" y="15" width="1" height="1" fill="#b05e48" class="sp"/>
    <rect x="15" y="16" width="2" height="1" fill="#b05e48" class="sp"/>
  `),
};

const VAL_MOODS = {
  happy:    { svg: VAL_FACES.happy, bg: 'mood-warm' },
  bright:   { svg: VAL_FACES.bright, bg: 'mood-warm' },
  blush:    { svg: VAL_FACES.blush, bg: 'mood-warm' },
  plead:    { svg: VAL_FACES.plead, bg: 'mood-warm' },
  annoyed:  { svg: VAL_FACES.annoyed, bg: 'mood-tense' },
  serious:  { svg: VAL_FACES.serious, bg: 'mood-tense' },
  smug:     { svg: VAL_FACES.smug, bg: 'mood-spicy' },
  smugWithGlasses: { svg: VAL_FACES.smugWithGlasses, bg: 'mood-spicy' },
  whisper:  { svg: VAL_FACES.whisper, bg: 'mood-spicy' },
  blank:    { svg: VAL_FACES.blank, bg: 'mood-dark' },
  yandere:  { svg: VAL_FACES.yandere, bg: 'mood-yandere' },
};

function setMood(mood) {
  const data = VAL_MOODS[mood] || VAL_MOODS.happy;
  document.getElementById('vn-portrait-emoji').innerHTML = data.svg;

  const bg = document.getElementById('vn-bg');
  bg.className = 'vn-bg ' + data.bg;

  // Portrait frame color shift
  const frame = document.getElementById('vn-portrait-frame');
  frame.className = 'vn-portrait-frame';
  if (mood === 'yandere') frame.classList.add('yandere-frame');
  if (mood === 'smug' || mood === 'whisper' || mood === 'smugWithGlasses') frame.classList.add('spicy-frame');
}

/* ── VN particles ────────────────────────────────── */
let _vnParticleTimer = null;
function initVN() {
  const c = document.getElementById('vn-particles');
  // Stars
  for (let i = 0; i < 20; i++) {
    const s = document.createElement('div');
    s.className = 'star-dot';
    const sz = .5 + Math.random() * 1.5;
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*60}%;width:${sz}px;height:${sz}px;animation-duration:${2+Math.random()*3}s;animation-delay:${Math.random()*4}s;`;
    c.appendChild(s);
  }
  // Drifting symbols
  _vnParticleTimer = setInterval(() => {
    const el = document.createElement('div');
    const c = document.getElementById('vn-particles');
    if (!c) { // If we navigated away, stop the timer
        clearInterval(_vnParticleTimer);
        return;
    }
    el.className = 'particle';
    el.textContent = ['♥','✧','♡','·'][Math.floor(Math.random()*4)];
    el.style.cssText = `left:${5+Math.random()*90}%;bottom:-20px;font-size:${6+Math.random()*7}px;color:rgba(255,${120+Math.floor(Math.random()*80)},${160+Math.floor(Math.random()*60)},.25);`;
    const dur = 8 + Math.random() * 5;
    el.style.animationDuration = dur + 's';
    c.appendChild(el);
    setTimeout(() => el.remove(), (dur + 2) * 1000);
  }, 1800);
}

/* ── Typewriter for VN text ──────────────────────── */
let _vnTypeTimer = null;
let _vnTypeResolve = null;
let _vnTextComplete = false;
let _vnFullText = '';

function vnTypeText(text) {
  return new Promise(resolve => {
    _vnTypeResolve = resolve;
    _vnTextComplete = false;
    _vnFullText = text;

    const el = document.getElementById('vn-text');
    const cont = document.getElementById('vn-continue');
    el.textContent = '';
    cont.classList.remove('visible');

    let i = 0;
    _vnTypeTimer = setInterval(() => {
      if (i < text.length) {
        el.textContent += text[i++];
      } else {
        clearInterval(_vnTypeTimer);
        _vnTypeTimer = null;
        _vnTextComplete = true;
        cont.classList.add('visible');
      }
    }, 30);
  });
}

function vnSkipOrAdvance() {
  if (_vnTypeTimer) {
    // Still typing — skip to end
    clearInterval(_vnTypeTimer);
    _vnTypeTimer = null;
    document.getElementById('vn-text').textContent = _vnFullText;
    _vnTextComplete = true;
    document.getElementById('vn-continue').classList.add('visible');
  } else if (_vnTextComplete && _vnTypeResolve) {
    // Text complete — advance
    _vnTextComplete = false;
    document.getElementById('vn-continue').classList.remove('visible');
    const r = _vnTypeResolve;
    _vnTypeResolve = null;
    r();
  }
}

/* ── Click handler on VN textbox ─────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const textbox = document.getElementById('vn-textbox');
  if (textbox) {
    textbox.addEventListener('click', vnSkipOrAdvance);
  }

  // Also allow clicking the portrait area
  const portrait = document.getElementById('vn-portrait-area');
  if (portrait) {
    portrait.addEventListener('click', vnSkipOrAdvance);
  }
});

/* ── Show a dialogue line ────────────────────────── */
async function vnLine(speaker, text, mood) {
  if (mood) setMood(mood);

  const nameplate = document.getElementById('vn-nameplate');
  nameplate.textContent = speaker === 'MC' ? playerName : speaker;

  // Style nameplate by speaker
  nameplate.className = 'vn-nameplate px';
  if (speaker === 'MC') nameplate.classList.add('nameplate-mc');
  else if (speaker === 'System') nameplate.classList.add('nameplate-system');

  // Show portrait only for Val
  const portraitArea = document.getElementById('vn-portrait-area');
  portraitArea.style.opacity = speaker === 'Dudu' ? '1' : '0.3';

  await vnTypeText(text);
}

/* ── Show choices and return selected id ─────────── */
function vnChoice(options) {
  return new Promise(resolve => {
    const container = document.getElementById('vn-choices');
    container.innerHTML = '';
    container.style.display = 'flex';

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'vn-choice-btn px';
      btn.textContent = opt.text;
      btn.onclick = () => {
        container.style.display = 'none';
        resolve(opt.id);
      };
      container.appendChild(btn);
    });
  });
}

/* ── Show ending screen ──────────────────────────── */
function showEnding(type, title, item, desc, face, affection) {
  const overlay = document.getElementById('vn-ending');
  overlay.className = 'vn-ending ' + type;

  // Stop all sounds before playing ending music
  ['bg', 'transition'].forEach(soundType => {
      const sound = document.querySelector(`audio[data-sound="${soundType}"]`);
      if (sound) {
          sound.pause();
          sound.currentTime = 0;
      }
  });

  // Play ending music
  let soundType;
  let volume = 0.4;
  if (type === 'ending-yandere') {
      soundType = 'yandere';
      volume = 0.6;
  } else if (type === 'ending-secret') {
      soundType = 'secret';
  } else {
      soundType = 'victory';
  }
  const sound = document.querySelector(`audio[data-sound="${soundType}"]`);
  if (sound) {
    sound.currentTime = 0;
    safePlay(sound, volume);
  }

  // Set texts
  document.getElementById('vn-ending-title').textContent = title;
  document.getElementById('vn-ending-desc').textContent = desc;
  document.getElementById('result-item').textContent = item;
  document.getElementById('result-affection').textContent = affection;

  // Set portrait
  document.getElementById('vn-portrait-final').innerHTML = VAL_FACES[face] || VAL_FACES.happy;

  // Show screen
  overlay.style.display = 'flex';

  // Yandere screen shake
  if (type === 'ending-yandere') {
    let count = 0;
    const glitch = setInterval(() => {
      overlay.classList.add('vn-glitch');
      setTimeout(() => overlay.classList.remove('vn-glitch'), 250);
      if (++count > 8) clearInterval(glitch);
    }, 400);
  }
}

/* ── Screen shake ────────────────────────────────── */
function vnShake() {
  const screen = document.getElementById('vn-screen');
  screen.classList.add('vn-shake');
  setTimeout(() => screen.classList.remove('vn-shake'), 500);
}

/* ── Restart VN ──────────────────────────────────── */
function restartVN() {
  document.getElementById('vn-ending').style.display = 'none';
  document.getElementById('vn-choices').style.display = 'none';
  document.getElementById('vn-text').textContent = '';
  document.getElementById('vn-continue').classList.remove('visible');

  // Stop all sounds before restarting
  document.querySelectorAll('audio').forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
  });

  startVN();
}


/* ═══════════════════════════════════════════════════
   DIALOGUE SCRIPT — "Be Mine... Or Else?"
   ═══════════════════════════════════════════════════ */

async function startVN() {
  // Reset
  setMood('happy');

  const music = document.querySelector('audio[data-sound="bg"]');
  if (music) {
    safePlay(music, 0.4);
  }

  await wait(900);
  await vnLine('Dudu', "Hey! So... Valentine's day is almost coming up.", 'happy');
  await vnLine('Dudu', 'I was thinking, maybe you and I have a discord call on the 14th...?', 'bright');
  await vnLine('Dudu', 'Come on, it will be fun!', 'happy');

  // ── CHOICE 1 ──
  const c1 = await vnChoice([
    { text: "A) I'd love to!", id: 'yes' },
    { text: "B) Sorry, I'm busy.", id: 'no' }
  ]);

  if (c1 === 'yes') return goodEnding("I'd love to! That sounds amazing.");

  // ── REJECTION #1 ──
  await vnLine('MC', "Sorry, I'm busy.");
  await vnLine('Dudu', "Busy? Come on, you can reschedule.", 'bright');
  await vnLine('Dudu', "It's just one day! Please?", 'plead');

  // ── CHOICE 2 ──
  const c2 = await vnChoice([
    { text: "A) Okay, fine.", id: 'yes' },
    { text: "B) I really can't.", id: 'no' }
  ]);

  if (c2 === 'yes') return goodEnding("Okay, fine. Let's do it.");

  // ── REJECTION #2 ──
  await vnLine('MC', "I really can't.");
  await vnLine('Dudu', "But I already bought flowers...", 'annoyed');
  await vnLine('Dudu', "The expensive ones. You wouldn't want them to go to waste, right?", 'plead');

  // ── CHOICE 3 ──
  const c3 = await vnChoice([
    { text: "A) Well, I can't say no to flowers...", id: 'yes' },
    { text: "B) No thanks.", id: 'no' }
  ]);

  if (c3 === 'yes') return secretEnding("Well... for flowers, I guess I can make time.");

  // ── REJECTION #3 ──
  await vnLine('MC', "No thanks.");
  await vnLine('Dudu', "You're playing hard to get.", 'annoyed');
  await vnLine('Dudu', "It's cute, but my patience isn't infinite.", 'serious');
  await vnLine('Dudu', "Just say yes.", 'serious');

  // ── CHOICE 4 (CRITICAL) ──
  const c4 = await vnChoice([
    { text: "A) Okay, okay! Yes!", id: 'yes' },
    { text: "B) I said no.", id: 'no' }
  ]);

  if (c4 === 'yes') return secretEnding("Okay, okay! Yes! You win.");

  // ── THE DESCENT ──
  const bgMusic = document.querySelector('audio[data-sound="bg"]');
  if (bgMusic) bgMusic.pause();
  const transitionMusic = document.querySelector('audio[data-sound="transition"]');
  if (transitionMusic) {
      transitionMusic.currentTime = 0;
      safePlay(transitionMusic, 0.5);
  }

  await vnLine('MC', "I said no.");
  vnShake();
  await wait(800);
  setMood('blank');
  await wait(2000); // 3 sec stare
  await vnLine('Dudu', "...", 'blank');
  await vnLine('Dudu', "You're testing me.", 'blank');
  await vnLine('Dudu', "I don't like being tested.", 'serious');

  // ── CHOICE 5 (FINAL) ──
  const c5 = await vnChoice([
    { text: "A) Fine, let's go.", id: 'yes' },
    { text: "B) Leave me alone.", id: 'no' }
  ]);

  if (c5 === 'yes') return goodEnding("Fine... let's just go.");

  // ── YANDERE ENDING ──
  return yandereEnding();
}


/* ── GOOD ENDING ─────────────────────────────────── */
async function goodEnding(mcLine) {
  await vnLine('MC', mcLine);
  await vnLine('Dudu', "Really? Awesome!", 'bright');
  await vnLine('Dudu', "I cant wait to celebrate Valentine's with you, bubu.", 'blush');
  await vnLine('Dudu', "I'm so excited!", 'happy');
  await wait(400);

  showEnding(
    'ending-good',
    'Date Secured!',
    'Boquet of Flowers',
    'You played it cool and secured a perfect Valentine\'s date. Well done!',
    'bright',
    'MAX'
  );
}


/* ── SECRET ENDING ───────────────────────────────── */
async function secretEnding(mcLine) {
  await vnLine('MC', mcLine);
  await vnLine('Dudu', "Finally.", 'smugWithGlasses');
  await vnLine('Dudu', "I knew you wanted it as much as I did.", 'smugWithGlasses');
  await wait(300);
  await vnLine('Dudu', "Check your phone right now...", 'smugWithGlasses');
  await vnLine('Dudu', "I just sent you a preview of what I have planned for dessert... ;)", 'smugWithGlasses');
  await wait(400);

  showEnding(
    'ending-secret',
    'Spicy Date!',
    'Dudu\'s "Video?"',
    'You held out just long enough to unlock a more... interesting evening.',
    'smugWithGlasses',
    '🍆'
  );
}


/* ── YANDERE / FUNNY ENDING ──────────────────────── */
async function yandereEnding() {
  await vnLine('MC', "Leave me alone.");
  await wait(600);
  vnShake();
  setMood('yandere');
  await wait(800);
  await vnLine('Dudu', "No.", 'yandere');
  await vnLine('MC', "Excuse me?");
  await vnLine('Dudu', "I said no.", 'yandere');
  await vnLine('Dudu', "I already told your mom we're going out.", 'yandere');
  await vnLine('Dudu', "You don't really have much of a choice here.", 'yandere');
  await vnLine('Dudu', "You promised we'll be together forever, right?", 'yandere');
  await vnLine('Dudu', "You literally have to go on a date with me.", 'yandere');
  await wait(300);
  vnShake();
  await vnLine('Dudu', "Don't worry, pookie.", 'yandere');
  await vnLine('Dudu', "You're going to have so much fun.", 'yandere');
  await vnLine('Dudu', "Forever...", 'yandere');
  await wait(500);

  showEnding(
    'ending-yandere',
    'Date Forced!',
    'Handcuffs (key missing)',
    'Task failed successfully? You have a date, whether you want one or not.',
    'yandere',
    'Till Death Do Us Part'
  );
}

/* ── Auto-Init based on Page ────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // If we are on the intro page, start bg music (queued on mobile until first tap)
  if (document.getElementById('float-container')) {
    const introBg = document.querySelector('audio[data-sound="bg"]');
    if (introBg) safePlay(introBg, 0.4);
  }
  // If we are on the login page
  if (document.getElementById('login-particles')) {
    initLoginScreen();
    const loginBg = document.querySelector('audio[data-sound="bg"]');
    if (loginBg) safePlay(loginBg, 0.4);
  }
  // If we are on the visual novel page
  if (document.getElementById('vn-textbox')) {
    initVN();
    startVN();
  }
});