/* Scroll reveals.
 *
 * Elements marked [data-reveal] start slightly offset and fade up as they
 * enter the viewport. Three rules keep it from feeling cheap:
 *
 * 1. Only transform and opacity are animated — both are compositor-only, so
 *    the page never re-lays-out mid-scroll.
 * 2. Each element is unobserved once revealed. Re-animating on the way back
 *    up is the single most common way scroll animation becomes annoying.
 * 3. rootMargin fires the reveal slightly BEFORE the element reaches the
 *    viewport edge, so content is already settled by the time you look at it
 *    rather than visibly animating under your eyes.
 *
 * The class is added by script, not present in the HTML: if this file fails
 * to load or JavaScript is off, nothing is hidden and the page reads normally.
 */
(function () {
  "use strict";

  var targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  var reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* No IntersectionObserver (or reduced motion): show everything immediately
     rather than leaving content stuck in its hidden start state. */
  if (!("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("reveal-ready");

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;

        /* Stagger children of a group so a row of cards arrives in sequence
           instead of all at once. Capped so a long list never crawls. */
        var delay = Math.min(parseInt(el.getAttribute("data-reveal-delay") || "0", 10), 300);
        el.style.transitionDelay = reduced ? "0ms" : delay + "ms";
        el.classList.add("is-revealed");
        observer.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
  );

  Array.prototype.forEach.call(targets, function (el, i) {
    /* Anything already on screen at load reveals immediately — a first
       viewport that fades in after the fact reads as a slow page. */
    var box = el.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.9) {
      el.style.transitionDelay = reduced ? "0ms" : Math.min(i * 60, 240) + "ms";
      el.classList.add("is-revealed");
      return;
    }
    observer.observe(el);
  });
})();
