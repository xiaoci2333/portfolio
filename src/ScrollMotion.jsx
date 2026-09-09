import React, { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollMotion.css';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

const EASE = 'expo.out';

export default function ScrollMotion() {
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      gsap.set('.opening-layer', { display: 'none' });
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const context = gsap.context(() => {
      const count = { value: 0 };
      const countNode = document.querySelector('.opening-count');
      const opening = gsap.timeline({
        defaults: { ease: EASE },
        onStart: () => {
          document.body.style.overflow = 'hidden';
        },
        onComplete: () => {
          document.body.style.overflow = previousOverflow;
          gsap.set('.opening-layer', { autoAlpha: 0, display: 'none' });
          ScrollTrigger.refresh();
        },
      });

      gsap.set('.opening-layer', { autoAlpha: 1 });
      gsap.set('.opening-panel', { scaleY: 1, transformOrigin: 'top' });
      gsap.set('.opening-mark > span', { yPercent: 120 });
      gsap.set('.nav', { yPercent: -120 });
      gsap.set('.hero-video', { clipPath: 'inset(0 0 0 58%)', scale: 1.14 });
      gsap.set('.hero-line > span', {
        yPercent: 125,
        scaleX: 0.74,
        rotate: 2.5,
        transformOrigin: 'left bottom',
      });
      gsap.set('.hero .eyebrow, .hero-bottom, .hero-foot', { y: 38, autoAlpha: 0 });

      opening
        .to('.opening-mark > span', { yPercent: 0, duration: 1.05, stagger: 0.12 })
        .to(count, {
          value: 100,
          duration: 1.05,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (countNode) countNode.textContent = String(Math.round(count.value)).padStart(3, '0');
          },
        }, '<')
        .to('.opening-mark > span', { yPercent: -120, duration: 0.75, stagger: 0.06 }, '+=0.08')
        .to('.opening-panel', {
          scaleY: 0,
          duration: 1.18,
          stagger: 0.1,
          ease: 'expo.inOut',
          transformOrigin: 'bottom',
        }, '-=0.45')
        .to('.hero-video', {
          clipPath: 'inset(0 0 0 0%)',
          scale: 1,
          duration: 1.8,
          ease: 'expo.inOut',
          clearProps: 'clipPath,scale',
        }, '-=0.9')
        .to('.nav', { yPercent: 0, duration: 1.15 }, '-=1.25')
        .to('.hero-line > span', {
          yPercent: 0,
          scaleX: 1,
          rotate: 0,
          duration: 1.45,
          stagger: 0.13,
        }, '-=1.18')
        .to('.hero .eyebrow, .hero-bottom, .hero-foot', {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.12,
        }, '-=0.88');

      gsap.utils.toArray('.motion-section').forEach((section) => {
        const display = section.querySelector('.motion-display > span');
        const label = section.querySelector('.section-label');
        const heading = section.querySelector(':scope > h2, :scope > .wrap > h2, .heading-row > h2, .bio > h2');
        const cards = section.querySelectorAll(
          '.magic-bento-card, .project, .timeline > div, .project-switch > button, .shot-list > button, .strength-grid > article'
        );
        const content = section.querySelectorAll('.bio > p, .bio-contact, .stats, .heading-row > p, .contact-intro, .contact-details');
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            once: true,
          },
          defaults: { ease: EASE },
        });

        if (display) {
          timeline.fromTo(display, {
            yPercent: 115,
            scaleX: 0.62,
            skewY: 4,
            transformOrigin: 'left bottom',
          }, {
            yPercent: 0,
            scaleX: 1,
            skewY: 0,
            duration: 1.45,
          });
        }
        if (label) {
          timeline.fromTo(label, { scaleX: 0, transformOrigin: 'left center' }, {
            scaleX: 1,
            duration: 1.05,
          }, '-=0.72');
        }
        if (heading) {
          timeline.fromTo(heading, {
            clipPath: 'inset(0 0 100% 0)',
            y: 70,
          }, {
            clipPath: 'inset(0 0 0% 0)',
            y: 0,
            duration: 1.25,
          }, '-=0.58');
        }
        if (content.length) {
          timeline.fromTo(content, { y: 52, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 1.05,
            stagger: 0.1,
          }, '-=0.62');
        }
        if (cards.length) {
          timeline.fromTo(cards, {
            y: 105,
            scale: 0.94,
            clipPath: 'inset(14% 0 0 0)',
            autoAlpha: 0,
          }, {
            y: 0,
            scale: 1,
            clipPath: 'inset(0% 0 0 0)',
            autoAlpha: 1,
            duration: 1.2,
            stagger: 0.13,
            clearProps: 'clipPath',
          }, '-=0.72');
        }
      });

      gsap.utils.toArray('.project-media, .identity').forEach((frame) => {
        gsap.fromTo(frame, {
          clipPath: 'inset(0 0 100% 0)',
        }, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.5,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: frame, start: 'top 88%', once: true },
        });
      });

      if (window.matchMedia('(min-width: 769px)').matches) {
        gsap.utils.toArray('.project-media img').forEach((image) => {
          gsap.fromTo(image, { yPercent: -4, scale: 1.1 }, {
            yPercent: 5,
            scale: 1.035,
            ease: 'none',
            scrollTrigger: {
              trigger: image.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
            },
          });
        });
      }

      gsap.fromTo('.big-contact', {
        clipPath: 'inset(0 0 100% 0)',
        y: 110,
        scaleX: 0.72,
        transformOrigin: 'left bottom',
      }, {
        clipPath: 'inset(0 0 0% 0)',
        y: 0,
        scaleX: 1,
        duration: 1.65,
        ease: EASE,
        scrollTrigger: { trigger: '.big-contact', start: 'top 88%', once: true },
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh, { once: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('load', refresh);
      context.revert();
    };
  }, []);

  return (
    <div className="opening-layer" aria-hidden="true">
      <div className="opening-panel opening-panel--ink" />
      <div className="opening-panel opening-panel--acid" />
      <div className="opening-panel opening-panel--ink" />
      <div className="opening-mark">
        <span>YAO</span>
        <span>ZHENYANG</span>
      </div>
      <span className="opening-count">000</span>
      <span className="opening-meta">VISUAL · AI · BRAND</span>
    </div>
  );
}
