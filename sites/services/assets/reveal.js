(function () {
  "use strict";

  var targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  var reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("reveal-ready");

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Math.min(parseInt(el.getAttribute("data-reveal-delay") || "0", 10), 300);
        el.style.transitionDelay = reduced ? "0ms" : delay + "ms";
        el.classList.add("is-revealed");
        observer.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
  );

  Array.prototype.forEach.call(targets, function (el, i) {
    var box = el.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.9) {
      el.style.transitionDelay = reduced ? "0ms" : Math.min(i * 60, 240) + "ms";
      el.classList.add("is-revealed");
      return;
    }
    observer.observe(el);
  });
})();
