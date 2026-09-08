/* Light/dark persistence, mirroring lang.js.
 *
 * Loaded synchronously in <head>, NOT deferred: a deferred script runs after
 * first paint, so the wrong palette would flash before being corrected.
 *
 * First visit follows prefers-color-scheme — an explicit OS-level light
 * preference is never overridden. Once the toggle is clicked the choice is
 * stored and wins from then on, in both directions.
 *
 * With JavaScript off the button is inert but the system preference still
 * applies through CSS alone, so both palettes stay reachable.
 */
(function () {
  "use strict";

  var KEY = "amzixz:theme";
  var root = document.documentElement;

  function read() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function store(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {
      /* private mode, storage disabled — the choice simply does not persist */
    }
  }

  /* Applied before first paint. Everything below waits for the DOM. */
  var saved = read();
  if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);

  function effective() {
    var attr = root.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function sync(button) {
    var dark = effective() === "dark";
    button.setAttribute("aria-pressed", dark ? "true" : "false");
    button.setAttribute(
      "aria-label",
      button.getAttribute(dark ? "data-label-light" : "data-label-dark") ||
        (dark ? "Switch to light theme" : "Switch to dark theme")
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("theme-toggle");
    if (!button) return;

    sync(button);

    button.addEventListener("click", function () {
      var next = effective() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store(next);
      sync(button);
    });

    /* If the visitor has never chosen, follow the system as it changes. */
    if (!read() && window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var onChange = function () {
        if (!read()) sync(button);
      };
      if (mq.addEventListener) {
        mq.addEventListener("change", onChange);
      } else if (mq.addListener) {
        mq.addListener(onChange);
      }
    }
  });
})();
