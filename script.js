// Section scroll reveal + nav active state + sticky header (simonfan.xyz-style)
document.addEventListener("DOMContentLoaded", () => {
  // Mark that JS is loaded and remove no-js fallback
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js-loaded");
  
  const revealEls = document.querySelectorAll(".scroll-reveal");
  const navLinks = document.querySelectorAll(".nav-link");
  const siteHeader = document.querySelector(".site-header");
  const sectionIds = ["about", "experience", "work", "resume", "contact"];

  // Check if IntersectionObserver is supported
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            entry.target.setAttribute("data-in-view", "true");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "100px 0px 0px 0px", threshold: 0.01 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));

    // Immediately reveal elements already in viewport on load
    setTimeout(() => {
      revealEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("is-visible");
          el.setAttribute("data-in-view", "true");
          revealObserver.unobserve(el);
        }
      });
    }, 100);
  } else {
    // Fallback for browsers without IntersectionObserver
    revealEls.forEach((el) => {
      el.classList.add("is-visible");
      el.setAttribute("data-in-view", "true");
    });
  }

  const setActiveNav = () => {
    const scrollY = window.scrollY;
    let activeId = null;
    let minDistance = Infinity;

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const top = rect.top + scrollY;
      const mid = top + rect.height / 2;
      const distance = Math.abs(window.scrollY + window.innerHeight * 0.35 - mid);
      if (rect.top <= window.innerHeight * 0.5 && distance < minDistance) {
        minDistance = distance;
        activeId = id;
      }
    });

    if (!activeId && scrollY < 50) activeId = null;
    else if (!activeId && sectionIds.length) activeId = sectionIds[0];

    navLinks.forEach((a) => {
      const section = a.getAttribute("data-section");
      a.classList.toggle("is-active", section === activeId);
      a.setAttribute("aria-current", section === activeId ? "true" : "false");
    });
  };

  const onScroll = () => {
    requestAnimationFrame(() => {
      setActiveNav();
      if (siteHeader) siteHeader.classList.toggle("is-stuck", window.scrollY > 20);
    });
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

// Scroll progress bar + progress dots + hero scroll hint
document.addEventListener("DOMContentLoaded", () => {
  const progressEl = document.querySelector(".scroll-progress");
  const progressBar = document.querySelector(".scroll-progress-bar");
  const progressDots = document.querySelectorAll(".scroll-progress-dot");
  const heroHint = document.querySelector(".hero-scroll-hint");
  const sectionIds = ["hero", "about", "experience", "work", "resume", "contact"];

  const updateScrollUI = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollY / docHeight) * 100) : 0;
    if (progressEl && progressBar) {
      progressEl.style.setProperty("--scroll-progress-pct", pct + "%");
    }

    if (heroHint) {
      heroHint.classList.toggle("is-hidden", scrollY > 120);
    }

    let activeId = "hero";
    const threshold = window.innerHeight * 0.35;
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.getBoundingClientRect().top <= threshold) activeId = id;
    });

    progressDots.forEach((dot) => {
      dot.classList.toggle("is-active", dot.getAttribute("data-section") === activeId);
    });
  };

  updateScrollUI();
  window.addEventListener("scroll", () => requestAnimationFrame(updateScrollUI), { passive: true });
});

// Experience timeline: expand/collapse cards on click (simonfan.xyz style)
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".timeline-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      card.classList.toggle("is-expanded");
      card.setAttribute("aria-expanded", card.classList.contains("is-expanded"));
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("is-expanded");
        card.setAttribute("aria-expanded", card.classList.contains("is-expanded"));
      }
    });
  });
});

// Simple intro enhancer for Zhou Sining hero section
// Assumes HTML contains: <span id="hero-roles"></span> in the first section

document.addEventListener("DOMContentLoaded", () => {
  const roles = [
    "Investment Enthusiast",
    "Funds Management Analyst",
    "Equity research lead"
  ];

  const heroRolesEl = document.getElementById("hero-roles");
  if (!heroRolesEl) return; // safe exit if span not present

  let index = 0;
  let isFadingOut = false;

  // Initial state
  heroRolesEl.textContent = roles[0];

  function cycleRole() {
    if (isFadingOut) return;
    isFadingOut = true;

    // Fade out
    heroRolesEl.style.transition = "opacity 220ms ease, transform 220ms ease";
    heroRolesEl.style.opacity = "0";
    heroRolesEl.style.transform = "translateY(3px)";

    setTimeout(() => {
      // Update text
      index = (index + 1) % roles.length;
      heroRolesEl.textContent = roles[index];

      // Fade in
      heroRolesEl.style.opacity = "1";
      heroRolesEl.style.transform = "translateY(0)";
      isFadingOut = false;
    }, 220);
  }

  // Start rotation (similar calm pacing to simonfan.xyz)
  setInterval(cycleRole, 2600);
});

// Contact info expand/collapse function
function toggleContactInfo(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  // Close other expandable sections
  const allExpandables = document.querySelectorAll('.contact-expandable');
  allExpandables.forEach(el => {
    if (el.id !== elementId) {
      el.classList.remove('is-expanded');
    }
  });
  
  // Toggle current section
  element.classList.toggle('is-expanded');
}