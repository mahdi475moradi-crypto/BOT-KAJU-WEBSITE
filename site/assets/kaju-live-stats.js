(function () {
  var STATS_URL = "https://pastefy.app/GZKMoi3U/raw";

  function whenReady(selector, cb, tries) {
    tries = tries || 0;
    var el = document.querySelector(selector);
    if (el) return cb(el);
    if (tries > 150) return; // ~15s, give up quietly
    setTimeout(function () {
      whenReady(selector, cb, tries + 1);
    }, 100);
  }

  // --- Footer: add Privacy / Terms links next to Features / World / Commands ---
  whenReady(".footer-links", function (el) {
    if (el.querySelector('a[href="/privacy"]')) return;
    var terms = document.createElement("a");
    terms.href = "/terms";
    terms.textContent = "Terms";
    var privacy = document.createElement("a");
    privacy.href = "/privacy";
    privacy.textContent = "Privacy";
    el.appendChild(terms);
    el.appendChild(privacy);
  });

  // --- Header: live server/member count pill, fed by the bot's status paste ---
  whenReady(".site-header", function (header) {
    var pill = document.createElement("div");
    pill.className = "kaju-live-stats";
    pill.innerHTML =
      '<span class="kls-dot"></span><span class="kls-text">Connecting to Kaju…</span>';
    header.insertAdjacentElement("afterend", pill);

    var textEl = pill.querySelector(".kls-text");
    var dotEl = pill.querySelector(".kls-dot");

    function refresh() {
      fetch(STATS_URL, { cache: "no-store" })
        .then(function (r) {
          return r.json();
        })
        .then(function (d) {
          var servers = d.servers != null ? Number(d.servers).toLocaleString() : "—";
          var users = d.users != null ? Number(d.users).toLocaleString() : "—";
          var online = String(d.status || "").toUpperCase() === "ONLINE";
          dotEl.style.background = online ? "#6bffb0" : "#ff6b6b";
          textEl.textContent = servers + " servers \u00B7 " + users + " members";
        })
        .catch(function () {
          dotEl.style.background = "#ff6b6b";
          textEl.textContent = "Live stats unavailable";
        });
    }

    refresh();
    setInterval(refresh, 60000);
  });
})();
