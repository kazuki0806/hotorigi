(function () {
  function startRipple(cv, reduce) {
    var ctx = cv.getContext('2d');
    if (!ctx) { return; }
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;
    var LINES = 14;
    function resize() {
      var r = cv.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw(sec) {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(45, 37, 25, 0.45)';
      for (var i = 0; i < LINES; i++) {
        var p = i / (LINES - 1);
        var y0 = H * (0.16 + 0.80 * p * p);
        var amp = 3 + 9 * p;
        var k1 = 0.0055 + 0.0035 * p;
        var k2 = 0.012 + 0.006 * p;
        var v = 34 + 40 * p;
        var shift = sec * v;
        ctx.beginPath();
        for (var x = 0; x <= W; x += 6) {
          var y = y0 + Math.sin((x - shift) * k1 + i * 1.7) * amp + Math.sin((x - shift * 0.55) * k2 + i * 0.9) * amp * 0.45;
          if (x === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
        }
        ctx.stroke();
      }
    }
    resize();
    window.addEventListener('resize', function () { resize(); draw(elapsed); });
    var elapsed = 0;
    if (reduce) { draw(0); return; }
    var last = null;
    function loop(now) {
      if (last === null) { last = now; }
      if (!document.hidden) {
        elapsed += Math.min(0.05, (now - last) / 1000);
        draw(elapsed);
      }
      last = now;
      window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
  }

  window.initSite = function () {
    if (window.__siteInited) { return; }
    var root = document.querySelector('[data-site]');
    if (!root || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { return; }
    window.__siteInited = true;
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);

    var mm = gsap.matchMedia();
    mm.add({ reduce: '(prefers-reduced-motion: reduce)', ok: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 767px)', desktop: '(min-width: 768px)' }, function (ctx) {
      var reduce = !!(ctx.conditions && ctx.conditions.reduce);
      var mobile = !!(ctx.conditions && ctx.conditions.mobile);
      var clipFrom = (getComputedStyle(document.documentElement).getPropertyValue('--hero-clip') || '22%').trim() || '22%';
      var ripple = document.querySelector('[data-ripple]');
      if (ripple) { startRipple(ripple, reduce); }

      var card = root.querySelector('.float-reserve');
      if (card && !mobile) {
        ScrollTrigger.create({ start: 160, end: 'max', onToggle: function (self) { card.classList.toggle('is-compact', self.isActive); } });
      }

      if (reduce) {
        gsap.set('.js-intro, .js-reveal', { clearProps: 'all' });
        gsap.set('[data-clip]', { clipPath: 'inset(0 0%)' });
        gsap.set('[data-line]', { scaleY: 1 });
        return;
      }

      gsap.set('.js-intro, .js-reveal', { opacity: 0, y: 24 });

      var intro = gsap.utils.toArray('[data-hero] .js-intro');
      if (intro.length) {
        gsap.to(intro, { opacity: 1, y: 0, duration: 1.2, ease: 'power1.out', stagger: 0.12, delay: 0.15 });
      }
      var line = document.querySelector('[data-line]');
      if (line) {
        gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: 'power1.out', delay: 0.9 });
      }

      gsap.utils.toArray('[data-reveal-group]').forEach(function (group) {
        var items = group.querySelectorAll('.js-reveal');
        if (!items.length) { return; }
        gsap.to(items, {
          opacity: 1, y: 0, duration: 1, ease: 'power1.out', stagger: 0.1,
          scrollTrigger: { trigger: group, start: 'top 80%', once: true }
        });
      });

      gsap.utils.toArray('[data-clip]').forEach(function (el) {
        var from = clipFrom;
        var trig = mobile ? el : (el.closest('[data-clip-trigger]') || el);
        var st = mobile ? 'top 95%' : (el.getAttribute('data-clip-start') || 'top 65%');
        var en = mobile ? 'top 35%' : (el.getAttribute('data-clip-end') || 'top 10%');
        gsap.fromTo(el, { clipPath: 'inset(0 ' + from + ')' }, {
          clipPath: 'inset(0 0%)', ease: 'none',
          scrollTrigger: { trigger: trig, start: st, end: en, scrub: 0.6 }
        });
      });

      if (!mobile) {
        gsap.utils.toArray('[data-fade-on-scroll]').forEach(function (el) {
          gsap.to(el, { opacity: 0, ease: 'none', scrollTrigger: { start: 80, end: 360, scrub: true } });
        });
      }

      gsap.utils.toArray('[data-dark]').forEach(function (el) {
        if (el.hasAttribute('data-dark-after-clip')) { return; }
        var cls = el.getAttribute('data-dark-class') || 'is-on-dark';
        ScrollTrigger.create({
          trigger: el, start: 'top 44px', end: el.getAttribute('data-dark-end') || 'bottom 44px',
          onToggle: function (self) { root.classList.toggle(cls, self.isActive); }
        });
      });
      var clipDark = document.querySelector('[data-dark-after-clip]');
      if (clipDark) {
        ScrollTrigger.create({
          trigger: mobile ? clipDark : (clipDark.closest('[data-clip-trigger]') || clipDark), start: mobile ? 'top 44px' : '+=420', end: 'bottom 44px',
          onToggle: function (self) { root.classList.toggle('is-on-dark', self.isActive); }
        });
      }

      var sd = document.querySelector('.scroll-down');
      if (sd) {
        gsap.to(sd, { opacity: 0, ease: 'none', scrollTrigger: { start: 120, end: 320, scrub: true } });
      }
    });

    var menuBtn = root.querySelector('.menu-btn');
    var menu = root.querySelector('#site-menu');
    if (menuBtn && menu) {
      var label = menuBtn.querySelector('.menu-btn__label');
      var isOpen = function () { return root.classList.contains('is-menu-open'); };
      var setMenu = function (open) {
        root.classList.toggle('is-menu-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-hidden', String(!open));
        if (label) { label.textContent = open ? 'Close' : 'Menu'; }
        document.documentElement.style.overflow = open ? 'hidden' : '';
        if (open) { var first = menu.querySelector('a'); if (first) { window.setTimeout(function () { first.focus(); }, 50); } }
        else { menuBtn.focus(); }
      };
      menuBtn.addEventListener('click', function () { setMenu(!isOpen()); });
      menu.querySelectorAll('a[href^="#"]').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
      document.addEventListener('keydown', function (e) {
        if (!isOpen()) { return; }
        if (e.key === 'Escape') { e.preventDefault(); setMenu(false); return; }
        if (e.key === 'Tab') {
          var f = Array.prototype.slice.call(menu.querySelectorAll('a, button'));
          f.push(menuBtn);
          var i = f.indexOf(document.activeElement);
          if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
          else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
        }
      });
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
    window.setTimeout(function () { ScrollTrigger.refresh(); }, 1500);
  };

  var siteTimer = window.setInterval(function () {
    if (window.__siteInited) { window.clearInterval(siteTimer); return; }
    window.initSite();
  }, 100);
  window.setTimeout(function () { window.clearInterval(siteTimer); }, 20000);
})();
