/* TossAway Junk Removal — site scripts (vanilla JS, no dependencies) */
(function () {
  "use strict";

  var FORM_ENDPOINT = "https://vision.leadrai.com/api/forms/d4b33eed2d9dee7e3b15d34e94879f57";

  /* ---------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        toggle.focus();
      }
    });
  }

  /* ---------------------------------------------------------------
     Sticky header shadow
     --------------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    items.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     Forms — LeadrVision submission
     --------------------------------------------------------------- */
  function showStatus(form, type, title, message) {
    var box = form.querySelector(".form-status");
    if (!box) return;
    box.className = "form-status form-status--" + type + " is-visible";
    box.innerHTML = "";

    var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("fill", "none");
    icon.setAttribute("stroke", "currentColor");
    icon.setAttribute("stroke-width", "2.2");
    icon.setAttribute("stroke-linecap", "round");
    icon.setAttribute("stroke-linejoin", "round");
    icon.setAttribute("width", "22");
    icon.setAttribute("height", "22");
    icon.style.flex = "none";
    icon.innerHTML =
      type === "ok"
        ? '<circle cx="12" cy="12" r="10"></circle><path d="M8 12.5l2.5 2.5L16 9.5"></path>'
        : '<circle cx="12" cy="12" r="10"></circle><path d="M12 7.5v5.5"></path><path d="M12 16.5h.01"></path>';
    box.appendChild(icon);

    var text = document.createElement("div");
    var strong = document.createElement("strong");
    strong.textContent = title;
    var span = document.createElement("span");
    span.textContent = message;
    text.appendChild(strong);
    text.appendChild(span);
    box.appendChild(text);

    box.setAttribute("role", "status");
    box.setAttribute("tabindex", "-1");
  }

  function initForms() {
    var forms = document.querySelectorAll("form[data-leadr]");
    var submitted =
      new URLSearchParams(window.location.search).get("submitted") === "1";

    forms.forEach(function (form) {
      /* Always stamp the current page so visitors return here after submit. */
      var pageField = form.querySelector('input[name="_page"]');
      if (pageField) pageField.value = window.location.href;

      /* Confirmation after a plain (non-JS) HTML submission. */
      if (submitted) {
        showStatus(
          form,
          "ok",
          "Thanks, your message was sent.",
          "We’ve received your request and will get back to you shortly. Need it handled today? Call (503) 428-4945."
        );
      }

      form.addEventListener("submit", function (e) {
        /* Honeypot — silently drop bot submissions. */
        var pot = form.querySelector('input[name="_gotcha"]');
        if (pot && pot.value) {
          e.preventDefault();
          return;
        }

        if (!window.fetch || !form.checkValidity()) return; /* let the browser handle it */

        e.preventDefault();

        var button = form.querySelector('button[type="submit"]');
        var original = button ? button.innerHTML : "";
        if (button) {
          button.disabled = true;
          button.textContent = "Sending…";
        }

        var payload = {};
        new FormData(form).forEach(function (value, key) {
          payload[key] = typeof value === "string" ? value : String(value);
        });
        payload._page = window.location.href;

        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            return res.json().catch(function () { return { ok: res.ok }; });
          })
          .then(function (data) {
            if (!data || data.ok !== true) throw new Error("Submission failed");
            form.reset();
            var pf = form.querySelector('input[name="_page"]');
            if (pf) pf.value = window.location.href;
            showStatus(
              form,
              "ok",
              "Thanks, your message was sent.",
              "We’ve received your request and will get back to you shortly. Need it handled today? Call (503) 428-4945."
            );
            var box = form.querySelector(".form-status");
            if (box) box.focus();
          })
          .catch(function () {
            showStatus(
              form,
              "error",
              "Sorry — that didn’t go through.",
              "Please try again, or call us directly at (503) 428-4945 and we’ll take care of you."
            );
          })
          .finally(function () {
            if (button) {
              button.disabled = false;
              button.innerHTML = original;
            }
          });
      });
    });
  }

  /* ---------------------------------------------------------------
     Current year in footers
     --------------------------------------------------------------- */
  function initYear() {
    var nodes = document.querySelectorAll("[data-year]");
    var year = String(new Date().getFullYear());
    nodes.forEach(function (n) { n.textContent = year; });
  }

  function init() {
    initNav();
    initHeader();
    initReveal();
    initForms();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
