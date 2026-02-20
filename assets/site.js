(() => {
  const doc = document.documentElement;
  doc.classList.add("js");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const nav = document.querySelector(".top-nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 12);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const targets = Array.from(document.querySelectorAll(".hero, .section"));

  targets.forEach((el, i) => {
    el.classList.add("reveal-target");
    el.style.setProperty("--reveal-delay", `${Math.min(i * 40, 260)}ms`);
  });

  if (prefersReducedMotion) {
    targets.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    targets.forEach((el) => observer.observe(el));
  }

  if (supportsFinePointer && !prefersReducedMotion) {
    const hoverTargets = document.querySelectorAll(".project-card, .list-card, .callout");

    hoverTargets.forEach((node) => {
      let raf = null;
      let nextX = 50;
      let nextY = 50;

      const paint = () => {
        node.style.setProperty("--mx", `${nextX}%`);
        node.style.setProperty("--my", `${nextY}%`);
        raf = null;
      };

      node.addEventListener("pointermove", (event) => {
        const rect = node.getBoundingClientRect();
        nextX = ((event.clientX - rect.left) / rect.width) * 100;
        nextY = ((event.clientY - rect.top) / rect.height) * 100;

        if (!raf) raf = requestAnimationFrame(paint);
      });
    });
  }
})();
