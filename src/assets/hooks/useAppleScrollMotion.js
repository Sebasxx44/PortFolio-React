import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function useAppleScrollMotion() {
  useEffect(() => {
    const progress = document.querySelector('.scroll-progress__bar');
    const nav = document.querySelector('.nav-wrapper');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });

    const setNavState = () => {
      nav?.classList.toggle('is-scrolled', window.scrollY > 16);
    };

    if (reducedMotion) {
      const onScroll = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        if (progress) progress.style.transform = `scaleX(${ratio})`;
        setNavState();
      };

      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const lenis = new Lenis({
      duration: 1.12,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.86,
      touchMultiplier: 1.08,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.to(progress, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          scrub: 0.25,
        },
      });

      ScrollTrigger.create({
        start: 16,
        end: 999999,
        onUpdate: setNavState,
        onLeaveBack: setNavState,
      });

      gsap.utils.toArray('.scroll-scene').forEach((scene) => {
        const revealItems = scene.querySelectorAll(
          '.eyebrow, .section-title, .services-subtitle, .experience-subtitle, .technologies-subtitle, .projects-subtitle, .service-card, .work-experience-card, .technologie-card, .project-card'
        );

        if (revealItems.length) {
          gsap.from(revealItems, {
              autoAlpha: 0,
              y: 28,
              stagger: 0.035,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: scene,
                start: 'top 78%',
                once: true,
              },
          });
        }

        gsap.to(scene, {
          yPercent: -3,
          ease: 'none',
          scrollTrigger: {
            trigger: scene,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      });

      gsap.utils.toArray('.about-portrait, .project-media img').forEach((el) => {
        gsap.to(el, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      });
    });

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 250);

    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
}
