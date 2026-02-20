(() => {
  const doc = document.documentElement;
  doc.classList.add("js");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const nav = document.querySelector(".top-nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 12);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const targets = Array.from(
    document.querySelectorAll(".hero, .section, .project-card, .list-card, .callout")
  );

  targets.forEach((el, i) => {
    el.classList.add("reveal-target");
    el.style.setProperty("--reveal-delay", `${Math.min(i * 35, 360)}ms`);
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
        rootMargin: "0px 0px -8% 0px",
      }
    );

    targets.forEach((el) => observer.observe(el));
  }

  const hoverTargets = document.querySelectorAll(".section, .project-card, .list-card, .callout");
  hoverTargets.forEach((node) => {
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      node.style.setProperty("--mx", `${x}%`);
      node.style.setProperty("--my", `${y}%`);
    });
  });
})();
