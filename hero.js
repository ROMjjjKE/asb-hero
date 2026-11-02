/* AS-Building scroll hero — самодостаточный блок.
   Вставляет свою сцену перед старым hero Elementor и скрывает старый слайдер.
   Остальная страница не затрагивается. */
(function () {
  'use strict';

  var CFG = Object.assign({
    framesBase: '',            // путь к папке с кадрами (см. install.md)
    spaceCount: 142,
    buildCount: 147,
    split: 0.42,               // доля скролла на космос
    blend: 0.022,              // ширина наплыва на стыке
    scrollVh: 900,             // длина скролла на десктопе
    scrollVhMobile: 760,
    fixed: true,               // сцена position:fixed (устойчиво к overflow:hidden Elementor)
    // ВАЖНО: bb65461 — контейнер, внутри него ВСЯ страница. Скрывать только сам слайдер.
    oldHeroSelectors: ['[data-id="b20bacc"]'],
    mountBefore: null,         // по умолчанию — перед первым старым hero
    accent: null
  }, window.ASB_HERO || {});

  if (document.querySelector('.asbh')) return;   // защита от двойного запуска

  /* ---------- 1. монтаж ---------- */
  var oldHero = null;
  for (var i = 0; i < CFG.oldHeroSelectors.length; i++) {
    var cand = document.querySelector(CFG.oldHeroSelectors[i]);
    if (cand) { oldHero = cand; break; }
  }
  // ВАЖНО: слайдер лежит глубоко внутри Elementor (внутри swiper-слайда с overflow:hidden
  // и transform). Sticky внутри такого предка не работает, поэтому поднимаемся
  // до самой внешней .elementor-top-section и вставляем hero перед ней.
  var outer = oldHero;
  if (outer) {
    var p = outer.parentElement;
    while (p) {
      if (p.classList && p.classList.contains('elementor-top-section')) outer = p;
      p = p.parentElement;
    }
  }
  var anchor = CFG.mountBefore ? document.querySelector(CFG.mountBefore) : outer;

  var HEADER_H = (function () {
    var h = document.querySelector('header, .pxl-header, #header');
    return h ? Math.max(0, Math.round(h.getBoundingClientRect().height)) : 0;
  })();

  var root = document.createElement('section');
  root.className = 'asbh';
  root.setAttribute('aria-label', 'От орбиты до готового дома');
  root.style.setProperty('--asbh-scroll', CFG.scrollVh + 'vh');
  root.style.setProperty('--asbh-scroll-m', CFG.scrollVhMobile + 'vh');
  root.style.setProperty('--asbh-stageh', 'calc(100vh - ' + HEADER_H + 'px)');

  root.innerHTML = [
    '<div class="asbh-scroller"><div class="asbh-stage" data-side="l">',
    '  <canvas class="asbh-canvas" aria-hidden="true"></canvas>',
    '  <div class="asbh-shade" aria-hidden="true"></div>',
    '  <div class="asbh-grid" aria-hidden="true"><i></i><i></i><i></i><i></i></div>',
    '  <aside class="asbh-hud" aria-hidden="true"><div class="asbh-hud-num"><span>01</span><em>/06</em></div>',
    '    <div class="asbh-hud-bar"><b></b></div><div class="asbh-hud-name">Орбита</div></aside>',
    '  <div class="asbh-scenes">',
    '   <article class="asbh-scene" data-from="0" data-to="0.13" data-side="l">',
    '     <p class="asbh-kicker"><span class="asbh-tick"></span>AS-Building · Беларусь</p>',
    '     <h1 class="asbh-h1"><span class="asbh-ln"><i>Подберем</i> <i>участок.</i></span><span class="asbh-ln"><i>Построим</i> <i>дом.</i></span></h1>',
    '     <p class="asbh-lead">Строительство домов под ключ. Бесплатная консультация и готовое предложение с ценами от профессионалов.</p>',
    '     <a class="asbh-btn" href="/kontakty/">Заказать консультацию</a>',
    '     <div class="asbh-hint" aria-hidden="true"><span></span>Листайте: камера сходит с орбиты</div>',
    '   </article>',
    '   <article class="asbh-scene" data-from="0.15" data-to="0.37" data-side="r">',
    '     <p class="asbh-tag"><b>01</b> Снижение</p>',
    '     <h2 class="asbh-h2">Дом начинается<br>с пустого поля</h2>',
    '     <p>Пятнадцать секунд скролла здесь — это сезон работы на площадке. Дальше на кадре появится всё, что обычно скрыто за забором стройки.</p>',
    '     <svg class="asbh-callout" viewBox="0 0 260 120" aria-hidden="true"><path d="M2 118 L120 118 L258 6"/><circle cx="258" cy="6" r="4"/></svg>',
    '   </article>',
    '   <article class="asbh-scene" data-from="0.44" data-to="0.57" data-side="l">',
    '     <p class="asbh-tag"><b>02</b> Участок</p>',
    '     <h2 class="asbh-h2">Выбрали дом,<br>а участка нет?</h2>',
    '     <p>Подберем идеальный вариант: проверим документы, рельеф, коммуникации и подъезд ещё до покупки.</p>',
    '     <a class="asbh-link" href="/podbor-zemelnyh-uchastkov/">Помощь с выбором участка</a>',
    '     <svg class="asbh-callout" viewBox="0 0 260 120" aria-hidden="true"><path d="M2 118 L120 118 L258 6"/><circle cx="258" cy="6" r="4"/></svg>',
    '   </article>',
    '   <article class="asbh-scene" data-from="0.56" data-to="0.70" data-side="r">',
    '     <p class="asbh-tag"><b>03</b> Фундамент и коробка</p>',
    '     <h2 class="asbh-h2">Берём проект<br>с нуля</h2>',
    '     <ul class="asbh-facts">',
    '       <li><b>Свайный, ленточный, плитный</b>фундамент под ваш грунт</li>',
    '       <li><b>Кирпич, газосиликат, керамзитобетон</b>стены коробки дома</li>',
    '       <li><b>Технадзор</b>на каждом этапе</li>',
    '     </ul>',
    '     <svg class="asbh-callout" viewBox="0 0 260 120" aria-hidden="true"><path d="M258 118 L140 118 L2 6"/><circle cx="2" cy="6" r="4"/></svg>',
    '   </article>',
    '   <article class="asbh-scene" data-from="0.69" data-to="0.84" data-side="l">',
    '     <p class="asbh-tag"><b>04</b> Кровля и отделка</p>',
    '     <h2 class="asbh-h2">Закрываем контур<br>и доводим до жилого</h2>',
    '     <p>Крыша, окна, фасад, инженерные системы. Без цепочки подрядчиков: за все работы отвечает одна команда.</p>',
    '     <a class="asbh-link" href="/projekti/">Смотреть построенные дома</a>',
    '     <svg class="asbh-callout" viewBox="0 0 260 120" aria-hidden="true"><path d="M2 118 L120 118 L258 6"/><circle cx="258" cy="6" r="4"/></svg>',
    '   </article>',
    '   <article class="asbh-scene" data-from="0.83" data-to="1.01" data-side="c">',
    '     <p class="asbh-tag"><b>05</b> Ключи в руках</p>',
    '     <h2 class="asbh-h2">Полный комплекс услуг</h2>',
    '     <p class="asbh-lead">Комплексный подход: берём проект с нуля и выполняем все работы под ключ.</p>',
    '     <div class="asbh-cta-row"><a class="asbh-btn" href="/kontakty/">Связаться с нами</a>',
    '       <a class="asbh-btn asbh-ghost" href="/gotoviye-resheniya/">Готовые проекты</a></div>',
    '     <div class="asbh-contacts"><a href="tel:+375293794000">+375 (29) 379-40-00</a><a href="mailto:info@as-building.by">info@as-building.by</a></div>',
    '   </article>',
    '  </div>',
    '  <div class="asbh-loader" role="status"><span>0</span>%</div>',
    '</div></div>'
  ].join('');

  if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(root, anchor);
  else document.body.insertBefore(root, document.body.firstChild);

  // прячем старый слайдер и его дубли
  CFG.oldHeroSelectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (n) {
      n.style.setProperty('display', 'none', 'important');
      n.setAttribute('aria-hidden', 'true');
    });
  });

  /* ---------- 2. движок ---------- */
  var pad = function (n) { return String(n).padStart(3, '0'); };
  var base = CFG.framesBase ? CFG.framesBase.replace(/\/?$/, '/') : '';
  var cv = root.querySelector('.asbh-canvas');
  var ctx = cv.getContext('2d', { alpha: false });
  var stage = root.querySelector('.asbh-stage');
  var loader = root.querySelector('.asbh-loader');
  var loaderTxt = loader.querySelector('span');
  var hudNum = root.querySelector('.asbh-hud-num span');
  var hudName = root.querySelector('.asbh-hud-name');
  var hudBar = root.querySelector('.asbh-hud-bar b');

  var SEGS = [
    { key: 'space', n: CFG.spaceCount, from: 0, to: CFG.split },
    { key: 'build', n: CFG.buildCount, from: CFG.split, to: 1 }
  ];
  var TOTAL = CFG.spaceCount + CFG.buildCount;
  var isMobile = function () { return window.matchMedia('(max-width:820px)').matches; };
  var DIRS = { space: { d: 'frames-space', m: 'frames-space-m' }, build: { d: 'frames', m: 'frames-m' } };
  var buf = {}, loaded = 0, curP = 0;

  function loadOne(key, i) {
    buf[key] = buf[key] || new Array(SEGS.find(function (s) { return s.key === key; }).n);
    var arr = buf[key];
    if (arr[i]) return Promise.resolve(arr[i]);
    return new Promise(function (res) {
      var im = new Image();
      im.decoding = 'async';
      im.onload = function () { arr[i] = im; loaded++; upd(); res(im); };
      im.onerror = function () { res(null); };
      im.src = base + (isMobile() ? DIRS[key].m : DIRS[key].d) + '/' + pad(i + 1) + '.webp';
    });
  }
  function upd() {
    loaderTxt.textContent = Math.round(loaded / TOTAL * 100);
    if (loaded >= TOTAL) loader.classList.add('asbh-done');
  }
  function nearest(key, i) {
    var arr = buf[key]; if (!arr) return null;
    if (arr[i]) return arr[i];
    for (var d = 1; d < arr.length; d++) {
      if (i - d >= 0 && arr[i - d]) return arr[i - d];
      if (i + d < arr.length && arr[i + d]) return arr[i + d];
    }
    return null;
  }

  var cw = 0, ch = 0, dpr = 1, lastStamp = '';
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = stage.clientWidth; ch = stage.clientHeight;
    cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
    render(curP, true);
  }
  function paint(im, alpha) {
    var iw = im.naturalWidth, ih = im.naturalHeight;
    var s = Math.max(cv.width / iw, cv.height / ih);
    var w = iw * s, h = ih * s;
    var fx = cv.width / cv.height < 1 ? 0.62 : 0.5;
    ctx.globalAlpha = alpha;
    ctx.drawImage(im, (cv.width - w) * fx, (cv.height - h) * 0.62, w, h);
    ctx.globalAlpha = 1;
  }
  function frameOf(seg, p) {
    var t = (p - seg.from) / (seg.to - seg.from);
    return Math.max(0, Math.min(seg.n - 1, Math.round(t * (seg.n - 1))));
  }
  function render(p, force) {
    var stamp = p.toFixed(4);
    if (!force && stamp === lastStamp) return;
    lastStamp = stamp;
    var mark = CFG.split;
    if (Math.abs(p - mark) < CFG.blend) {
      var a = nearest('space', CFG.spaceCount - 1), b = nearest('build', 0);
      var k = (p - (mark - CFG.blend)) / (2 * CFG.blend);
      if (a) paint(a, 1);
      if (b) paint(b, Math.min(1, Math.max(0, k)));
      return;
    }
    var seg = p < mark ? SEGS[0] : SEGS[1];
    var im = nearest(seg.key, frameOf(seg, p));
    if (im) paint(im, 1);
  }

  /* ---------- 3. тексты ---------- */
  var scenes = [].slice.call(root.querySelectorAll('.asbh-scene')).map(function (el) {
    return {
      el: el, from: +el.dataset.from, to: +el.dataset.to, side: el.dataset.side,
      kids: [].slice.call(el.children).filter(function (c) { return !c.classList.contains('asbh-callout'); }),
      callout: el.querySelector('.asbh-callout path'),
      words: [].slice.call(el.querySelectorAll('.asbh-h1 i'))
    };
  });
  var e3 = function (x) { return 1 - Math.pow(1 - x, 3); };

  function setScene(s, p) {
    var t = (p - s.from) / (s.to - s.from);
    var inT = Math.min(1, Math.max(0, t / 0.22));
    var outT = Math.min(1, Math.max(0, (t - 0.80) / 0.20));
    var vis = t > 0 && t < 1;
    s.el.classList.toggle('asbh-on', vis);
    if (!vis) { s.el.style.opacity = 0; return; }
    var ein = e3(inT), eout = outT * outT;
    var dirX = s.side === 'l' ? -1 : s.side === 'r' ? 1 : 0;
    var xOut = -dirX * eout * 90;
    var yIn = s.side === 'c' ? (1 - ein) * 60 : 0;
    s.el.style.opacity = (ein * (1 - eout)).toFixed(3);
    s.kids.forEach(function (k, i) {
      var local = Math.min(1, Math.max(0, inT * 1.5 - i * 0.16));
      var le = e3(local);
      var x = dirX * (1 - le) * (50 + i * 22) + xOut * (0.6 + i * 0.12);
      var y = (1 - le) * 22 + yIn * 0.3;
      k.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      k.style.opacity = (le * (1 - Math.min(1, eout * 1.25))).toFixed(3);
    });
    s.words.forEach(function (w, i) {
      var local = Math.min(1, Math.max(0, inT * 1.4 - i * 0.12));
      var lo = Math.min(1, outT * 1.2);
      w.style.transform = 'translate3d(0,' + ((1 - e3(local)) * 110 - e3(lo) * 110).toFixed(1) + '%,0)';
    });
    if (s.callout) {
      var dr = Math.min(1, Math.max(0, (t - 0.08) / 0.4));
      s.callout.style.strokeDashoffset = (420 * (1 - e3(dr))).toFixed(1);
    }
  }

  var NAMES = ['Орбита', 'Снижение', 'Участок', 'Фундамент', 'Кровля', 'Ключи'];
  var EDGES = [0, 0.12, 0.40, 0.56, 0.71, 0.85, 1.01];
  var hudIdx = -1;
  function updateHud(p) {
    var idx = 0;
    for (var i = 0; i < NAMES.length; i++) if (p >= EDGES[i]) idx = i;
    hudBar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, (p - EDGES[idx]) / (EDGES[idx + 1] - EDGES[idx]))).toFixed(3) + ')';
    if (idx !== hudIdx) { hudIdx = idx; hudNum.textContent = String(idx + 1).padStart(2, '0'); hudName.textContent = NAMES[idx]; }
    var sc = scenes.find(function (s) { return p >= s.from + 0.02 && p <= s.to - 0.02; });
    stage.dataset.side = sc ? sc.side : 'c';
  }

  /* ---------- 4. прогресс от нативного скролла ---------- */
  var scroller = root.querySelector('.asbh-scroller');
  var wasLive = null;

  function metrics() {
    var r = scroller.getBoundingClientRect();
    var sh = stage.clientHeight || window.innerHeight;
    var span = r.height - sh;
    var p = span > 0 ? Math.max(0, Math.min(1, -r.top / span)) : 0;
    // сцена живёт, только пока spacer перекрывает экран
    var live = r.top <= 1 && r.bottom >= sh - 1;
    return { p: p, live: live };
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var m = metrics();
      curP = m.p;

      if (CFG.fixed) {
        stage.classList.toggle('asbh-live', m.live);
        if (m.live && wasLive !== true) { lastStamp = ''; render(curP, true); }
        wasLive = m.live;
        if (!m.live) { ticking = false; return; }   // скрыты — не тратим кадры
      }
      render(curP);
      scenes.forEach(function (s) { setScene(s, curP); });
      updateHud(curP);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { resize(); onScroll(); });

  /* ---------- 5. загрузка ---------- */
  function boot() {
    loadOne('space', 0).then(function () {
      resize();
      var coarse = [];
      for (var i = 0; i < CFG.spaceCount; i += 12) coarse.push(['space', i]);
      for (var j = 0; j < CFG.buildCount; j += 12) coarse.push(['build', j]);
      coarse.push(['space', CFG.spaceCount - 1], ['build', CFG.buildCount - 1]);
      return Promise.all(coarse.map(function (x) { return loadOne(x[0], x[1]); }));
    }).then(function () {
      var rest = [];
      for (var i = 0; i < CFG.spaceCount; i++) if (!buf.space[i]) rest.push(['space', i]);
      for (var j = 0; j < CFG.buildCount; j++) if (!buf.build[j]) rest.push(['build', j]);
      var worker = function () {
        if (!rest.length) return Promise.resolve();
        var x = rest.shift();
        return loadOne(x[0], x[1]).then(worker);
      };
      return Promise.all([worker(), worker(), worker(), worker()]);
    }).then(function () {
      render(curP, true); window.__asbhReady = true;
    });
    scenes[0].el.style.opacity = 1; scenes[0].el.classList.add('asbh-on');
    scenes[0].words.forEach(function (w) { w.style.transform = 'translate3d(0,0,0)'; });
    scenes[0].kids.forEach(function (k) { k.style.opacity = 1; });
    onScroll();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.__asbh = function () { return { p: curP, loaded: loaded, total: TOTAL }; };
})();
