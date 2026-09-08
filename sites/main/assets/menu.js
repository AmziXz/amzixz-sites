/* Mobile navigation menu.
 *
 * The links live in the normal <ul> and are only collapsed behind the button
 * by CSS at narrow widths, so with JavaScript off — or before this file runs —
 * the markup is still a plain, working list of links.
 */
(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("primary-menu");
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      menu.setAttribute("data-open", "true");
    } else {
      menu.removeAttribute("data-open");
    }
  }

  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  toggle.addEventListener("click", function (event) {
    event.stopPropagation();
    setOpen(!isOpen());
  });

  /* Navigating away should not leave the menu open behind the new page in
     browsers that restore scroll/DOM state on back. */
  menu.addEventListener("click", function (event) {
    if (event.target && event.target.closest && event.target.closest("a")) {
      setOpen(false);
    }
  });

  document.addEventListener("click", function (event) {
    if (!isOpen()) return;
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  /* Rotating to landscape or widening past the breakpoint reveals the desktop
     nav; leaving aria-expanded="true" behind would misreport state. */
  var wide = window.matchMedia("(min-width: 761px)");
  function onWidthChange() {
    if (wide.matches) setOpen(false);
  }
  if (wide.addEventListener) {
    wide.addEventListener("change", onWidthChange);
  } else if (wide.addListener) {
    wide.addListener(onWidthChange);
  }
})();
