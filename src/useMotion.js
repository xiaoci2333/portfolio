import { useEffect } from 'react';

export default function useMotion(dependency) {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let cleanup = () => {};
    function setup() {
      cleanup();
      if (preference.matches) return;
      const elements = [...document.querySelectorAll('.section-heading, .about-intro, .skill, .role-card, .project-card, .workflow-grid article, .contact-section > div')];
      const observer = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) { target.classList.add('revealed'); observer.unobserve(target); }
        });
      }, { threshold: .08 });
      elements.forEach((el, index) => {
        el.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 65}ms`);
        el.classList.add('reveal');
        observer.observe(el);
      });
      const hero = document.querySelector('.hero');
      const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
      let frame = 0;
      let x = 0, y = 0;
      function move(event) {
        const rect = hero.getBoundingClientRect();
        x = (event.clientX - rect.left) / rect.width - .5;
        y = (event.clientY - rect.top) / rect.height - .5;
        if (!frame) frame = requestAnimationFrame(() => {
          hero.style.setProperty('--pointer-x', `${x * 22}px`);
          hero.style.setProperty('--pointer-y', `${y * 16}px`);
          frame = 0;
        });
      }
      function reset() {
        cancelAnimationFrame(frame); frame = 0;
        hero.style.setProperty('--pointer-x', '0px');
        hero.style.setProperty('--pointer-y', '0px');
      }
      if (fine) { hero.addEventListener('pointermove', move, { passive: true }); hero.addEventListener('pointerleave', reset); }
      const visibility = new IntersectionObserver(([entry]) => hero.classList.toggle('motion-offscreen', !entry.isIntersecting));
      visibility.observe(hero);
      const hidden = () => hero.classList.toggle('motion-hidden', document.hidden);
      document.addEventListener('visibilitychange', hidden);
      cleanup = () => {
        observer.disconnect(); visibility.disconnect(); reset();
        hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', reset);
        document.removeEventListener('visibilitychange', hidden);
        elements.forEach(el => el.classList.remove('reveal', 'revealed'));
      };
    }
    setup(); preference.addEventListener('change', setup);
    return () => { cleanup(); preference.removeEventListener('change', setup); };
  }, [dependency]);
}
