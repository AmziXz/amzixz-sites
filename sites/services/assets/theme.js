/* Loaded synchronously in <head>. Do not defer. */
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
    } catch (e) {}
  }

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
