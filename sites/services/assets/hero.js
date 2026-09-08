(function () {
  "use strict";

  var canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  var ctx;
  try {
    ctx = canvas.getContext("2d");
  } catch (e) {
    return;
  }
  if (!ctx) return;

  var reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SPACING = 24;
  var MAX_R = 2.6;
  var POINTER_RADIUS = 190;

  var dpr = 1;
  var w = 0;
  var h = 0;
  var cols = 0;
  var rows = 0;
  var raf = null;
  var running = false;
  var start = Date.now();

  var px = -9999;
  var py = -9999;
  var tx = -9999;
  var ty = -9999;

  var rgb = [156, 186, 219];

  function readColour() {
    var styles = getComputedStyle(document.documentElement);
    var parsed = parseColour((styles.getPropertyValue("--accent") || "").trim());
    if (parsed) rgb = parsed;
  }

  function parseColour(value) {
    if (!value) return null;
    if (value.charAt(0) === "#") {
      var hex = value.slice(1);
      if (hex.length === 3) {
        hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
      }
      if (hex.length !== 6) return null;
      var n = parseInt(hex, 16);
      if (isNaN(n)) return null;
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    var m = value.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
    return m ? [+m[1], +m[2], +m[3]] : null;
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.ceil(w / SPACING) + 1;
    rows = Math.ceil(h / SPACING) + 1;
    return true;
  }

  function draw() {
    var t = (Date.now() - start) / 1000;
    ctx.clearRect(0, 0, w, h);

    px += (tx - px) * 0.08;
    py += (ty - py) * 0.08;

    var fill = rgb[0] + "," + rgb[1] + "," + rgb[2];

    for (var iy = 0; iy < rows; iy++) {
      for (var ix = 0; ix < cols; ix++) {
        var x = ix * SPACING;
        var y = iy * SPACING;

        var wave =
          Math.sin(x * 0.012 + t * 0.55) * 0.5 +
          Math.sin((x * 0.006 + y * 0.017) - t * 0.4) * 0.5;

        var edge = Math.min(1, Math.min(x, w - x) / (w * 0.1)) *
                   Math.min(1, Math.min(y, h - y) / (h * 0.16));

        var intensity = (wave * 0.5 + 0.5) * Math.max(0, edge);

        var dx = x - px;
        var dy = y - py;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < POINTER_RADIUS) {
          var push = 1 - dist / POINTER_RADIUS;
          intensity += push * push * 0.85;
        }

        if (intensity <= 0.02) continue;
        if (intensity > 1) intensity = 1;

        var r = intensity * MAX_R;
        if (r < 0.25) continue;

        ctx.globalAlpha = 0.1 + intensity * 0.5;
        ctx.fillStyle = "rgb(" + fill + ")";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function frame() {
    draw();
    raf = window.requestAnimationFrame(frame);
  }

  function play() {
    if (running || reduced) return;
    running = true;
    raf = window.requestAnimationFrame(frame);
  }

  function pause() {
    running = false;
    if (raf) window.cancelAnimationFrame(raf);
    raf = null;
  }

  function isOnScreen() {
    var rect = canvas.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  function init() {
    readColour();
    if (!resize()) return;
    draw();
    if (!reduced) play();
  }

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (resize()) draw();
    }, 150);
  });

  window.addEventListener(
    "pointermove",
    function (e) {
      var rect = canvas.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", function () {
    tx = -9999;
    ty = -9999;
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) pause();
    else if (isOnScreen()) play();
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !document.hidden) play();
        else pause();
      });
    }).observe(canvas);
  }

  new MutationObserver(function () {
    readColour();
    if (reduced) draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onScheme = function () {
      readColour();
      if (reduced) draw();
    };
    if (mq.addEventListener) mq.addEventListener("change", onScheme);
    else if (mq.addListener) mq.addListener(onScheme);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
