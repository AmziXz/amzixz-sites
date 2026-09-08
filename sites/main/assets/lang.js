/* Remembers the visitor's language across pages.
 *
 * Two mechanisms, deliberately layered:
 *
 * 1. Structural. Every link on an LV page points at another LV page, so once
 *    you are in Latvian you stay in Latvian. This works with JavaScript off
 *    and is what search engines follow.
 *
 * 2. This script. If you picked a language on one page and later land on the
 *    other language — an old bookmark, a shared link, a search result — it
 *    sends you to the version you chose.
 *
 * It never builds a URL by hand. It reads the counterpart from the page's own
 * <link rel="alternate" hreflang="..."> tag, so a page without a translation
 * simply stays put instead of redirecting somewhere that does not exist.
 */
(function () {
  "use strict";

  var KEY = "amzixz:lang";
  var current = document.documentElement.lang === "lv" ? "lv" : "en";

  function store(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {
      /* private mode, storage disabled — fall back to structural links */
    }
  }

  function read() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  /* Record the choice before the click navigates away. Delegated from
     document so it works no matter where the switch sits in the page. */
  document.addEventListener("click", function (event) {
    var el = event.target;
    if (!el || typeof el.closest !== "function") return;
    var link = el.closest("[data-lang]");
    if (link) store(link.getAttribute("data-lang"));
  });

  var saved = read();
  if (!saved || saved === current) return;

  var alt = document.querySelector('link[rel="alternate"][hreflang="' + saved + '"]');
  if (!alt) return;

  /* replace() rather than assign(): the back button should return to wherever
     they came from, not bounce through the page we just redirected away from. */
  if (alt.href && alt.href !== location.href) location.replace(alt.href);
})();
