/* A4 Esports — GSAP Scroll Animation Engine */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

(function () {
  'use strict';


  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    gsap.set('.hero__title-line .word, .tagline-word, .hero__eyebrow, .hero__sub, .hero__scroll-hint', {
      opacity: 1,
      y: 0,
      clearProps: 'transform',
    });
    document.querySelectorAll('.spine__word').forEach((el) => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
      el.style.position = 'relative';
    });
    return;
  }

  const ctx = gsap.context(() => {
    initNav();
    initScrollProgress();
    initHeroSequence();
    initSpineNarrative();
    initAboutReveal();
    initHorizontalFeatures();
    initStatsCounter();
    initCtaClimax();
    initHoverEnhancements();
    initEmberParticles();
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());


  /* ── Navigation scroll state ── */
  function initNav() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav__toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    ScrollTrigger.create({
      start: 80,
      onUpdate: (self) => {
        nav.classList.toggle('nav--scrolled', self.scroll() > 80);
      },
    });

    toggle?.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      gsap.fromTo(
        mobileMenu.querySelectorAll('a'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.3, ease: 'power3.out' }
      );
    });

    mobileMenu?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });

    document.querySelectorAll('.nav__link, .mobile-menu a').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href?.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            gsap.to(window, {
              duration: 1.2,
              scrollTo: { y: target, offsetY: 70 },
              ease: 'power3.inOut',
            });
          }
        }
      });
    });
  }

  /* ── Global scroll progress bar ── */
  function initScrollProgress() {
    gsap.to('.scroll-progress__bar', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });
  }

  /* ── HERO: Load intro + pinned scrub exit sequence ── */
  function initHeroSequence() {
    gsap.set('.hero__mascot', { scale: 0.6, rotation: -8, autoAlpha: 0 });
    gsap.set('.hero__title-line .word', { y: '110%' });
    gsap.set('.hero__eyebrow, .hero__sub, .hero__scroll-hint', { autoAlpha: 0, y: 20 });
    gsap.set('.tagline-word', { autoAlpha: 0, y: 30, scale: 0.9 });
    gsap.set('.hero__gradient--2, .hero__gradient--3', { opacity: 0 });
    gsap.set('.hero__flash', { scale: 0, opacity: 0 });
    gsap.set('.hero__crosshair', { opacity: 0, scale: 1 });

    const introTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    introTl
      .to('.hero__mascot', { scale: 1, rotation: 0, autoAlpha: 1, duration: 1, ease: 'back.out(1.4)' })
      .to('.hero__title-line .word', { y: '0%', stagger: 0.12, duration: 0.8 }, 0.2)
      .to('.hero__eyebrow', { autoAlpha: 1, y: 0, duration: 0.5 }, 0.5)
      .to('.hero__flash', { scale: 1.5, opacity: 0.9, duration: 0.12, ease: 'power4.out' }, 0.55)
      .to('.hero__flash', { scale: 2.2, opacity: 0, duration: 0.25 }, 0.67)
      .to('.tagline-word', { autoAlpha: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.6, ease: 'back.out(1.7)' }, 0.7)
      .to('.hero__sub', { autoAlpha: 1, y: 0, duration: 0.5 }, 1.0)
      .to('.hero__scroll-hint', { autoAlpha: 1, y: 0, duration: 0.4 }, 1.2)
      .to('.hero__gradient--2', { opacity: 1, duration: 0.8 }, 0.8)
      .to('.hero__gradient--3', { opacity: 1, duration: 0.8 }, 0.9)
      .to('.hero__crosshair', { opacity: 1, duration: 0.2 }, 0.6)
      .to('.hero__crosshair', { scale: 1.4, opacity: 0, duration: 0.5 }, 1.0);

    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    exitTl
      .to('.hero__mascot', { scale: 1.12, y: -30, duration: 0.4, ease: 'power2.inOut' })
      .to('.hero__content', { y: -100, autoAlpha: 0.2, duration: 0.5, ease: 'power2.in' }, 0)
      .to('.hero__gradient--2', { opacity: 0.3, duration: 0.3 }, 0.2)
      .to('.tagline-word', { y: -20, stagger: 0.05, duration: 0.3 }, 0.1)
      .to('.hero__scroll-hint', { autoAlpha: 0, duration: 0.2 }, 0);

    gsap.to('.hero__mascot', {
      y: '-=12',
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.5,
    });

    gsap.to('.tagline-word', {
      textShadow: '0 0 20px rgba(255,179,71,0.5)',
      stagger: { each: 0.5, yoyo: true, repeat: -1 },
      duration: 1.4,
      ease: 'power2.inOut',
      delay: 1.5,
    });
  }

  /* ── SPINE: Pinned tagline narrative with word transitions ── */
  function initSpineNarrative() {
    const words = gsap.utils.toArray('.spine__word');
    const progressFill = document.querySelector('.spine__progress-fill');
    const bgText = document.querySelector('.spine__bg-text');

    gsap.set(words[0], { autoAlpha: 1, visibility: 'visible' });

    const spineTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.spine',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: '.spine__sticky',
        anticipatePin: 1,
      },
    });

    const segment = 1 / words.length;

    words.forEach((word, i) => {
      const start = i * segment;

      if (i > 0) {
        spineTl.fromTo(
          words[i - 1],
          { autoAlpha: 1, scale: 1, filter: 'blur(0px)' },
          { autoAlpha: 0, scale: 0.92, filter: 'blur(6px)', duration: segment * 0.4, ease: 'power2.in' },
          start
        );
        spineTl.fromTo(
          word,
          { autoAlpha: 0, scale: 1.08, y: 40, filter: 'blur(8px)' },
          { autoAlpha: 1, scale: 1, y: 0, filter: 'blur(0px)', visibility: 'visible', duration: segment * 0.4, ease: 'power3.out' },
          start
        );
      }

      spineTl.to(
        progressFill,
        { width: `${((i + 1) / words.length) * 100}%`, duration: segment * 0.5, ease: 'none' },
        start
      );

      spineTl.to(
        bgText,
        {
          scale: 1 + i * 0.15,
          rotation: i * 3,
          opacity: 0.15 - i * 0.03,
          duration: segment,
          ease: 'none',
        },
        start
      );
    });

    spineTl.to('.spine__word--conquer h2', {
      textShadow: '0 0 40px rgba(255,107,53,0.8)',
      duration: segment * 0.3,
    }, 1 - segment * 0.3);
  }

  /* ── ABOUT: Reveal on scroll (cards always visible by default) ── */
  function initAboutReveal() {
    const aboutSection = document.querySelector('.about');
    if (!aboutSection) return;

    ScrollTrigger.create({
      trigger: '.about__frame',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo('.about__frame', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
      },
    });

    ScrollTrigger.create({
      trigger: '.about__copy',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo('.about__copy .section-label', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
        gsap.fromTo('.about__copy .section-title', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power4.out', delay: 0.05 });
        gsap.fromTo('.about__lead', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.1 });
      },
    });

    ScrollTrigger.create({
      trigger: '.about__list',
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          '.about__item',
          { y: 16, opacity: 0.4 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.45, ease: 'power2.out' }
        );
      },
    });

    gsap.to('.about__accent--1', {
      x: 30,
      y: -20,
      scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    gsap.to('.about__accent--2', {
      x: -20,
      y: 30,
      scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });
  }

  /* ── FEATURES: Pinned horizontal scroll ── */
  function initHorizontalFeatures() {
    const track = document.querySelector('.features__track');
    const cards = gsap.utils.toArray('.feature-card');
    if (!track || !cards.length) return;

    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth;
      const amount = trackWidth - window.innerWidth;
      return amount > 0 ? -amount : 0;
    };

    const scrollTween = gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: '.features',
        start: 'top top',
        end: () => `+=${Math.abs(getScrollAmount())}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { rotationY: 12, scale: 0.85, autoAlpha: 0.4 },
        {
          rotationY: 0,
          scale: 1,
          autoAlpha: 1,
          scrollTrigger: {
            containerAnimation: scrollTween,
            trigger: card,
            start: 'left 85%',
            end: 'left 35%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        card.querySelector('.feature-card__glow'),
        { opacity: 0, scale: 0.5 },
        {
          opacity: 0.6,
          scale: 1.2,
          scrollTrigger: {
            containerAnimation: scrollTween,
            trigger: card,
            start: 'left 60%',
            end: 'left 30%',
            scrub: true,
          },
        }
      );
    });

    gsap.from('.features__header', {
      y: 60,
      autoAlpha: 0,
      scrollTrigger: {
        trigger: '.features',
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
      },
    });
  }

  /* ── STATS: Scrub-linked counter animation ── */
  function initStatsCounter() {
    const statCards = gsap.utils.toArray('.stat-card');

    statCards.forEach((card) => {
      const valueEl = card.querySelector('.stat-card__value');
      const barFill = card.querySelector('.stat-card__bar-fill');
      const target = parseInt(valueEl.dataset.target, 10);

      const counter = { val: 0 };

      gsap.to(counter, {
        val: target,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1.5,
          onUpdate: () => {
            valueEl.textContent = Math.round(counter.val).toLocaleString();
          },
        },
      });

      gsap.to(barFill, {
        width: '100%',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'top 45%',
          scrub: 1,
        },
      });

      gsap.from(card, {
        y: 60,
        autoAlpha: 0,
        scale: 0.9,
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 1,
        },
      });
    });
  }

  /* ── CTA: Climax zoom + ring expansion ── */
  function initCtaClimax() {
    const ctaTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.cta',
        start: 'top 70%',
        end: 'center center',
        scrub: 1.2,
      },
    });

    ctaTl
      .from('.cta__mascot', {
        scale: 0.3,
        rotation: -20,
        autoAlpha: 0,
        duration: 0.4,
        ease: 'back.out(2)',
      })
      .from(
        '.cta__title',
        { y: 80, autoAlpha: 0, skewY: 5, duration: 0.35, ease: 'power4.out' },
        0.1
      )
      .from('.cta__sub', { y: 40, autoAlpha: 0, duration: 0.25 }, 0.2)
      .from(
        '.btn',
        { y: 50, autoAlpha: 0, stagger: 0.1, duration: 0.25, ease: 'power3.out' },
        0.3
      );

    gsap.to('.cta__ring--1', {
      scale: 1.4,
      rotation: 90,
      borderColor: 'rgba(255,107,53,0.3)',
      scrollTrigger: {
        trigger: '.cta',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });

    gsap.to('.cta__ring--2', {
      scale: 1.2,
      rotation: -60,
      scrollTrigger: {
        trigger: '.cta',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    gsap.to('.cta__ring--3', {
      scale: 1.6,
      rotation: 45,
      scrollTrigger: {
        trigger: '.cta',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 3,
      },
    });

    gsap.from('.cta', {
      background: 'radial-gradient(ellipse 30% 20% at 50% 50%, #ff6b35 0%, #0a0606 60%)',
      scrollTrigger: {
        trigger: '.cta',
        start: 'top 90%',
        end: 'top 30%',
        scrub: 1,
      },
    });
  }

  /* ── Hover micro-interactions (GSAP-enhanced) ── */
  function initHoverEnhancements() {
    document.querySelectorAll('.feature-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          boxShadow: '0 12px 40px rgba(255,107,53,0.25)',
          duration: 0.25,
          ease: 'power2.out',
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          boxShadow: '0 0 0 rgba(255,107,53,0)',
          duration: 0.3,
          ease: 'power2.in',
        });
      });
    });

    document.querySelectorAll('.stat-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.stat-card__bar-fill'), {
          boxShadow: '0 0 12px rgba(255,107,53,0.6)',
          duration: 0.2,
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.stat-card__bar-fill'), {
          boxShadow: '0 0 0 rgba(255,107,53,0)',
          duration: 0.2,
        });
      });
    });

    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.05, duration: 0.2, ease: 'back.out(2)' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.in' });
      });
    });

  }

  /* ── Floating ember particles ── */
  function initEmberParticles() {
    const field = document.querySelector('.ember-field');
    if (!field) return;

    for (let i = 0; i < 18; i++) {
      const ember = document.createElement('div');
      ember.className = 'ember-particle';
      ember.style.cssText = `
        position:absolute;
        width:${Math.random() * 4 + 2}px;
        height:${Math.random() * 4 + 2}px;
        background:${Math.random() > 0.5 ? '#ff6b35' : '#ffb347'};
        border-radius:50%;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        opacity:${Math.random() * 0.5 + 0.2};
        pointer-events:none;
        box-shadow:0 0 6px rgba(255,107,53,0.6);
      `;
      field.appendChild(ember);

      gsap.to(ember, {
        y: -120 - Math.random() * 80,
        x: (Math.random() - 0.5) * 60,
        opacity: 0,
        duration: 3 + Math.random() * 4,
        repeat: -1,
        delay: Math.random() * 5,
        ease: 'power1.out',
        onRepeat: () => {
          gsap.set(ember, {
            left: `${Math.random() * 100}%`,
            top: `${60 + Math.random() * 40}%`,
            opacity: Math.random() * 0.5 + 0.2,
          });
        },
      });
    }
  }
})();
