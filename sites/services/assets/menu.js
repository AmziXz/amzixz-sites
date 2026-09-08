(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("primary-menu");
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) menu.setAttribute("data-open", "true");
    else menu.removeAttribute("data-open");
  }

  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  toggle.addEventListener("click", function (event) {
    event.stopPropagation();
    setOpen(!isOpen());
  });

  menu.addEventListener("click", function (event) {
    if (event.target && event.target.closest && event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", function (event) {
    if (!isOpen()) return;
    if (!menu.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  var wide = window.matchMedia("(min-width: 901px)");
  function onWidthChange() {
    if (wide.matches) setOpen(false);
  }
  if (wide.addEventListener) wide.addEventListener("change", onWidthChange);
  else if (wide.addListener) wide.addListener(onWidthChange);
})();
