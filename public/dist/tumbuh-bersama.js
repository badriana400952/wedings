
/**
 * Tumbuh Bersama â€” Botanical Interactive Script
 * Next.js Integrated Module
 */
(function() {
  window.initTumbuhBersama = function() {
    (function () {
      "use strict";
        /* CORE HELPERS */
        var doc = document;
        var win = window;
        var body = doc.body;
        var $ = function (id) {
          return doc.getElementById(id);
        };
        var $$ = function (sel, root) {
          return Array.prototype.slice.call(
            (root || doc).querySelectorAll(sel),
          );
        };
        var reduceMotion = !!(
          win.matchMedia &&
          win.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
        var safe = function (fn) {
          try {
            fn();
          } catch (err) {
            if (win.console && win.console.warn) {
              win.console.warn(err);
            }
          }
        };
        var later = function (fn, ms) {
          return win.setTimeout(function () {
            safe(fn);
          }, ms);
        };
        var TAU = Math.PI * 2;
        var clamp = function (v, a, b) {
          return v < a ? a : v > b ? b : v;
        };
        var lerp = function (a, b, t) {
          return a + (b - a) * t;
        };
        var smooth = function (t) {
          t = clamp(t, 0, 1);
          return t * t * (3 - 2 * t);
        };
        var easeOut = function (t) {
          t = clamp(t, 0, 1);
          return 1 - Math.pow(1 - t, 3);
        };
        var easeInOut = function (t) {
          t = clamp(t, 0, 1);
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };
        var pad = function (n) {
          return (n < 10 ? "0" : "") + n;
        };
        var txt = function (el) {
          return el ? (el.textContent || "").trim() : "";
        };
        /* a substituted value is "empty" when blank or still an unfilled placeholder */
        var blank = function (v) {
          v = (v == null ? "" : String(v)).trim();
          return (
            v === "" ||
            v.indexOf("{{") === 0 ||
            v === "undefined" ||
            v === "null"
          );
        };
        var shown = function (el) {
          return !!(el && el.getClientRects().length > 0);
        };
        var hide = function (el) {
          if (el) {
            el.style.display = "none";
          }
        };
        var setText = function (el, t) {
          if (el && el.textContent !== t) {
            el.textContent = t;
          }
        };
        var store = {
          get: function (k) {
            try {
              return win.localStorage.getItem(k);
            } catch (err) {
              return null;
            }
          },
          set: function (k, v) {
            try {
              win.localStorage.setItem(k, v);
            } catch (err) {
              /* storage unavailable â€” only a convenience */
            }
          },
        };
        var rng = function (seed) {
          var s = seed >>> 0 || 1;
          return function () {
            s = (s + 0x6d2b79f5) | 0;
            var t = Math.imul(s ^ (s >>> 15), 1 | s);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
          };
        };
        var hashStr = function (s) {
          var h = 2166136261;
          s = String(s || "");
          for (var i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h = Math.imul(h, 16777619);
          }
          return h >>> 0;
        };
        var hexRGB = function (hex) {
          var h = String(hex || "")
            .trim()
            .replace("#", "");
          if (h.length === 3) {
            h =
              h.charAt(0) +
              h.charAt(0) +
              h.charAt(1) +
              h.charAt(1) +
              h.charAt(2) +
              h.charAt(2);
          }
          if (!/^[0-9a-fA-F]{6}$/.test(h)) {
            return null;
          }
          return [
            parseInt(h.slice(0, 2), 16),
            parseInt(h.slice(2, 4), 16),
            parseInt(h.slice(4, 6), 16),
          ];
        };
        var mixRGB = function (a, b, t) {
          return [
            lerp(a[0], b[0], t),
            lerp(a[1], b[1], t),
            lerp(a[2], b[2], t),
          ];
        };
        var rgbStr = function (c, a) {
          return (
            "rgba(" +
            Math.round(c[0]) +
            "," +
            Math.round(c[1]) +
            "," +
            Math.round(c[2]) +
            "," +
            (a == null ? 1 : a) +
            ")"
          );
        };
        var uid = (function () {
          var n = 0;
          return function (p) {
            n += 1;
            return (p || "tb") + "-" + n;
          };
        })();
        var svgNS = "http://www.w3.org/2000/svg";
        var dprCap = function () {
          return Math.min(win.devicePixelRatio || 1, 2);
        };
        var now = function () {
          return win.performance && win.performance.now
            ? win.performance.now()
            : Date.now();
        };
        var raf =
          win.requestAnimationFrame ||
          function (fn) {
            return win.setTimeout(function () {
              fn(now());
            }, 16);
          };
        var caf =
          win.cancelAnimationFrame ||
          function (id) {
            win.clearTimeout(id);
          };

        /* TEXT SOURCES â€” names are read back from the DOM, never from JS strings */
        var names = {
          bride: txt($("src-bride")),
          groom: txt($("src-groom")),
          brideFull: txt($("src-bride-full")),
          groomFull: txt($("src-groom-full")),
          venue: txt($("src-venue")),
          address: txt($("src-address")),
          tz: txt($("src-tz")),
          ev1: txt($("src-ev1")),
          metPlace: txt($("src-met-place")),
        };
        Object.keys(names).forEach(function (k) {
          if (blank(names[k])) {
            names[k] = "";
          }
        });
        var initial = function (s) {
          s = (s || "").trim();
          return s ? s.charAt(0).toUpperCase() : "";
        };

        /* the guest greeting: both states are designed â€” the plain link has no name */
        var guestEl = $("guest-greeting-name");
        var guestName = txt(guestEl);
        if (blank(guestName)) {
          guestName = "";
        }
        body.classList.toggle("has-guest", guestName !== "");

        /* ONE SCROLL BUS â€” every scroll-driven piece hangs off a single rAF */
        var scrollFns = [];
        var onScroll = function (fn) {
          scrollFns.push(fn);
        };
        var ticking = false;
        var runScroll = function () {
          ticking = false;
          for (var i = 0; i < scrollFns.length; i++) {
            safe(scrollFns[i]);
          }
        };
        var requestScroll = function () {
          if (ticking) {
            return;
          }
          ticking = true;
          raf(runScroll);
        };
        win.addEventListener("scroll", requestScroll, { passive: true });
        win.addEventListener("resize", requestScroll);
        /* the sections the guest can actually see, in page order */
        var visibleSections = function () {
          return $$("[data-section]").filter(function (s) {
            return s.getAttribute("data-section") !== "cover" && shown(s);
          });
        };

        var weddingISO = (win.__WEDDING_ISO__) || ($("src-wedding-iso") ? $("src-wedding-iso").textContent.trim() : "") || "2026-10-30T08:00:00";
        var BULAN = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ];
        var BULAN_S = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ];
        var HARI = [
          "Minggu",
          "Senin",
          "Selasa",
          "Rabu",
          "Kamis",
          "Jumat",
          "Sabtu",
        ];
        var parseDate = function (s) {
          var m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec((s || "").trim());
          if (!m) {
            return null;
          }
          return { y: +m[1], m: +m[2], d: +m[3] };
        };
        var parseTime = function (s) {
          var m = /^(\d{1,2})[:.](\d{2})/.exec((s || "").trim());
          if (!m) {
            return null;
          }
          return { h: +m[1], mi: +m[2] };
        };
        var fmtDate = function (s, format) {
          var p = parseDate(s);
          if (!p) {
            return "";
          }
          if (format === "numeric") {
            return pad(p.d) + " Â· " + pad(p.m) + " Â· " + p.y;
          }
          if (format === "year") {
            return String(p.y);
          }
          var utc = new Date(Date.UTC(p.y, p.m - 1, p.d, 12, 0, 0));
          if (format === "short") {
            return p.d + " " + BULAN_S[p.m - 1] + " " + p.y;
          }
          if (format === "medium") {
            return p.d + " " + BULAN[p.m - 1] + " " + p.y;
          }
          try {
            return utc.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            });
          } catch (err) {
            return (
              HARI[utc.getUTCDay()] +
              ", " +
              p.d +
              " " +
              BULAN[p.m - 1] +
              " " +
              p.y
            );
          }
        };
        var fmtTime = function (s) {
          var t = parseTime(s);
          if (!t) {
            return "";
          }
          return pad(t.h) + "." + pad(t.mi);
        };
        var tzOffset = function (label) {
          var t = (label || "").trim().toUpperCase();
          if (!t) {
            return null;
          }
          var named = {
            WIB: 7,
            WITA: 8,
            WIT: 9,
            SGT: 8,
            MYT: 8,
            PHT: 8,
            HKT: 8,
            AWST: 8,
            JST: 9,
            KST: 9,
            AEST: 10,
            AEDT: 11,
            ICT: 7,
            IST: 5.5,
            GMT: 0,
            UTC: 0,
            BST: 1,
            CET: 1,
            CEST: 2,
            EST: -5,
            EDT: -4,
            CST: -6,
            CDT: -5,
            MST: -7,
            PST: -8,
            PDT: -7,
          };
          if (Object.prototype.hasOwnProperty.call(named, t)) {
            return named[t];
          }
          var m = /(?:GMT|UTC)\s*([+-])\s*(\d{1,2})(?::?(\d{2}))?/.exec(t);
          if (m) {
            var h = +m[2] + (m[3] ? +m[3] / 60 : 0);
            return m[1] === "-" ? -h : h;
          }
          return null;
        };
        var TZ = tzOffset(names.tz);
        /* the instant (ms) of a wall-clock date + time at the venue */
        var instant = function (dateStr, timeStr) {
          var p = parseDate(dateStr);
          if (!p) {
            return null;
          }
          var t = parseTime(timeStr) || { h: 0, mi: 0 };
          if (TZ === null) {
            return new Date(p.y, p.m - 1, p.d, t.h, t.mi, 0).getTime();
          }
          return Date.UTC(p.y, p.m - 1, p.d, t.h, t.mi, 0) - TZ * 3600000;
        };
        var weddingParts = weddingISO.split("T");
        var weddingDate = weddingParts[0];
        var weddingTime = (weddingParts[1] || "").slice(0, 5);
        var weddingAt = instant(weddingDate, weddingTime);
        var weddingP = parseDate(weddingDate);
        var daysSince = function (dateStr) {
          var p = parseDate(dateStr);
          if (!p) {
            return null;
          }
          var d = new Date();
          var today = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
          return Math.floor((today - Date.UTC(p.y, p.m - 1, p.d)) / 86400000);
        };
        var fmtNum = function (n) {
          try {
            return Number(n).toLocaleString("id-ID");
          } catch (err) {
            return String(n);
          }
        };

        /* fill every formatted date/time element */
        var applyFormats = function () {
          /* multi-line texts keep their own line breaks, never the markup's indentation */
          $$(".rich").forEach(function (el) {
            if (el.children.length) {
              return;
            }
            var t = el.textContent || "";
            var clean = t
              .replace(/\r\n?/g, "\n")
              .replace(/^\s+|\s+$/g, "")
              .replace(/[ \t]*\n[ \t]*/g, "\n");
            if (clean !== t) {
              el.textContent = clean;
            }
          });
          $$(".js-date").forEach(function (el) {
            var v = fmtDate(
              el.getAttribute("data-date"),
              el.getAttribute("data-format"),
            );
            el.textContent = v || "â€”";
            el.classList.toggle("is-blank", !v);
          });
          $$(".js-time").forEach(function (el) {
            el.textContent = fmtTime(el.getAttribute("data-time")) || "â€”";
          });
          $$(".js-range").forEach(function (el) {
            var a = fmtTime(el.getAttribute("data-start"));
            var b = fmtTime(el.getAttribute("data-end"));
            el.textContent = a && b ? a + " â€“ " + b : a || b || "â€”";
          });
          $$(".js-since").forEach(function (el) {
            var n = daysSince(el.getAttribute("data-date"));
            el.textContent = n === null || n < 0 ? "â€”" : fmtNum(n);
            el.classList.toggle("is-blank", n === null || n < 0);
          });
          if (blank(names.tz)) {
            $$(".tz").forEach(hide);
          }
        };

        /* SOUND â€” a small garden of synthesized sounds + the couple's music */
        var sound = (function () {
          var ctx = null;
          var master = null;
          var noiseBuf = null;
          var on = store.get("tb-sound") !== "off";
          var audio = $("bgm");
          var btn = $("nav-sound");
          var musicSrc = audio ? audio.getAttribute("src") : "";
          var hasMusic = !!audio && !blank(musicSrc);
          var started = false;
          var gestured = false;
          if (audio && !hasMusic) {
            audio.removeAttribute("src");
          }
          var ensure = function () {
            if (ctx) {
              return ctx;
            }
            var AC = win.AudioContext || win.webkitAudioContext;
            if (!AC) {
              return null;
            }
            try {
              ctx = new AC();
              master = ctx.createGain();
              master.gain.value = 0.55;
              master.connect(ctx.destination);
              var len = Math.floor(ctx.sampleRate * 1.2);
              noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
              var d = noiseBuf.getChannelData(0);
              for (var i = 0; i < len; i++) {
                d[i] = Math.random() * 2 - 1;
              }
            } catch (err) {
              ctx = null;
            }
            return ctx;
          };
          var ready = function () {
            if (!on || !gestured) {
              return null;
            }
            var c = ensure();
            if (!c || c.state === "closed") {
              return null;
            }
            if (c.state === "suspended") {
              try {
                c.resume();
              } catch (err) {
                return null;
              }
            }
            return c;
          };
          var unlock = function () {
            gestured = true;
            var c = ensure();
            if (c && c.state === "suspended") {
              try {
                c.resume();
              } catch (err) {
                /* ignore */
              }
            }
          };
          var noise = function (dur, type, f0, f1, q, peak, delay) {
            var c = ready();
            if (!c) {
              return;
            }
            var t = c.currentTime + (delay || 0);
            var src = c.createBufferSource();
            src.buffer = noiseBuf;
            var f = c.createBiquadFilter();
            f.type = type || "bandpass";
            f.frequency.setValueAtTime(f0, t);
            f.frequency.exponentialRampToValueAtTime(
              Math.max(40, f1 || f0),
              t + dur,
            );
            f.Q.value = q || 1;
            var g = c.createGain();
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(
              peak || 0.2,
              t + Math.min(0.03, dur * 0.3),
            );
            g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
            src.connect(f);
            f.connect(g);
            g.connect(master);
            src.start(t, Math.random() * 0.4);
            src.stop(t + dur + 0.05);
          };
          var tone = function (freq, dur, peak, delay, type, glideTo) {
            var c = ready();
            if (!c) {
              return;
            }
            var t = c.currentTime + (delay || 0);
            var o = c.createOscillator();
            o.type = type || "sine";
            o.frequency.setValueAtTime(freq, t);
            if (glideTo) {
              o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
            }
            var g = c.createGain();
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(
              peak || 0.15,
              t + Math.min(0.02, dur * 0.2),
            );
            g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
            o.connect(g);
            g.connect(master);
            o.start(t);
            o.stop(t + dur + 0.05);
          };
          var PENTA = [
            523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51,
          ];
          var api = {
            unlock: unlock,
            tear: function () {
              noise(0.46, "bandpass", 1500, 4800, 1.1, 0.42, 0);
              for (var i = 0; i < 7; i++) {
                noise(
                  0.035,
                  "highpass",
                  2400 + Math.random() * 2400,
                  3000,
                  0.7,
                  0.22 + Math.random() * 0.12,
                  0.03 + i * 0.05 + Math.random() * 0.02,
                );
              }
            },
            seed: function () {
              tone(540, 0.14, 0.2, 0, "sine", 230);
              noise(0.05, "lowpass", 900, 400, 0.8, 0.12, 0.01);
            },
            sprout: function () {
              [0, 2, 4, 5].forEach(function (k, i) {
                tone(PENTA[k], 0.55, 0.09, i * 0.09, "sine");
              });
            },
            rustle: function () {
              noise(0.55, "bandpass", 2800, 1700, 0.9, 0.16, 0);
              noise(0.35, "highpass", 4200, 3600, 0.6, 0.06, 0.12);
            },
            leaf: function () {
              noise(0.9, "bandpass", 1800, 900, 1.4, 0.08, 0);
              tone(
                PENTA[Math.floor(Math.random() * 4) + 3],
                0.7,
                0.05,
                0.05,
                "sine",
              );
            },
            knock: function () {
              tone(196, 0.13, 0.32, 0, "sine", 150);
              tone(392, 0.07, 0.08, 0, "triangle", 300);
              noise(0.03, "bandpass", 2200, 1800, 2, 0.12, 0);
            },
            water: function () {
              for (var i = 0; i < 10; i++) {
                var f = 800 + Math.random() * 900;
                tone(
                  f,
                  0.07,
                  0.06,
                  i * 0.075 + Math.random() * 0.03,
                  "sine",
                  f * 1.8,
                );
              }
              noise(0.9, "bandpass", 1200, 800, 0.8, 0.05, 0);
            },
            wind: function () {
              noise(1.6, "lowpass", 280, 1100, 0.7, 0.22, 0);
              noise(1.2, "bandpass", 900, 400, 0.6, 0.06, 0.3);
            },
            chime: function () {
              tone(1318.51, 1.4, 0.07, 0, "sine");
              tone(1760, 1.1, 0.05, 0.08, "sine");
              tone(2093, 0.9, 0.04, 0.16, "sine");
              tone(2637, 0.7, 0.025, 0.24, "sine");
            },
            bloom: function () {
              [2, 4, 5, 7].forEach(function (k, i) {
                tone(PENTA[k], 0.9, 0.07, i * 0.12, "triangle");
              });
            },
            pop: function () {
              tone(620, 0.1, 0.16, 0, "triangle", 900);
            },
            tick: function () {
              tone(1900, 0.035, 0.05, 0, "square", 1500);
            },
            hum: function (level) {
              tone(
                PENTA[Math.min(7, Math.max(0, Math.round(level * 7)))],
                0.35,
                0.05,
                0,
                "sine",
              );
            },
            startMusic: function () {
              if (!hasMusic || started || !on) {
                return;
              }
              started = true;
              try {
                audio.volume = 0.7;
                var p = audio.play();
                if (p && p.catch) {
                  p.catch(function () {
                    started = false;
                  });
                }
              } catch (err) {
                started = false;
              }
              paint();
            },
            isOn: function () {
              return on;
            },
          };
          var paint = function () {
            if (!btn) {
              return;
            }
            btn.classList.toggle("is-off", !on);
            btn.setAttribute("aria-pressed", on ? "true" : "false");
            btn.setAttribute(
              "aria-label",
              on ? "Matikan suara" : "Nyalakan suara",
            );
          };
          if (btn) {
            btn.addEventListener("click", function () {
              on = !on;
              store.set("tb-sound", on ? "on" : "off");
              if (hasMusic) {
                if (on) {
                  started = false;
                  api.startMusic();
                } else {
                  try {
                    audio.pause();
                  } catch (err) {
                    /* ignore */
                  }
                }
              }
              if (on) {
                unlock();
                later(api.chime, 60);
              }
              paint();
            });
          }
          var firstTap = function () {
            unlock();
            api.startMusic();
            ["pointerdown", "keydown"].forEach(function (ev) {
              doc.removeEventListener(ev, firstTap, true);
            });
          };
          ["pointerdown", "keydown"].forEach(function (ev) {
            doc.addEventListener(ev, firstTap, true);
          });
          if (audio && hasMusic) {
            audio.addEventListener("error", function () {
              hasMusic = false;
            });
          }
          paint();
          return api;
        })();

        /* SEASONS â€” palettes for the air, the trees and the particles
0 semi (spring) Â· 1 panas (summer) Â· 2 gugur (autumn) Â· 3 dingin
(winter) Â· 4 mekar (the wedding's spring, in full bloom) */
        var SEASON_NAMES = [
          "Musim Semi",
          "Musim Panas",
          "Musim Gugur",
          "Musim Dingin",
          "Musim Mekar",
        ];
        var SEASON_SHORT = ["Semi", "Panas", "Gugur", "Dingin", "Mekar"];
        var SEASON_RAW = [
          {
            sky: ["#f7edf0", "#eef4e7", "#f8f4ea"],
            sun: 0.8,
            shade: "#3e5432",
            dap: 0.13,
            leaf: ["#9cc47a", "#b7d69a", "#86b765", "#c9e2a8"],
            bloom: ["#f5c9d3", "#fbe4ea", "#eeafbf", "#ffffff"],
            bloomShare: 0.52,
            foliage: 0.62,
            leafScale: 0.84,
            canopy: "#b4d291",
            bark: "#6b5140",
            ground: ["#b9d39a", "#9dbf7c"],
          },
          {
            sky: ["#e5f0f1", "#f4f2de", "#fbf4e2"],
            sun: 1,
            shade: "#2e4a26",
            dap: 0.18,
            leaf: ["#4f8a3c", "#3f7433", "#6a9e4c", "#2f5d2a", "#5c9a45"],
            bloom: ["#f3dc8e", "#fff4d0"],
            bloomShare: 0.05,
            foliage: 1,
            leafScale: 1.05,
            canopy: "#4f8a3c",
            bark: "#5f4636",
            ground: ["#8fb96a", "#6f9e4f"],
          },
          {
            sky: ["#f7e5d4", "#f8ecde", "#fbf3e8"],
            sun: 0.78,
            shade: "#5e3a1a",
            dap: 0.12,
            leaf: [
              "#d58b2c",
              "#b1502a",
              "#e3a93c",
              "#9a3b22",
              "#c9a04e",
              "#e87a3a",
            ],
            bloom: [],
            bloomShare: 0,
            foliage: 0.66,
            leafScale: 0.98,
            canopy: "#c8792e",
            bark: "#5d4130",
            ground: ["#d4b27a", "#bf9660"],
          },
          {
            sky: ["#e2e9ee", "#edf1f3", "#f7f8f6"],
            sun: 0.55,
            shade: "#2e4250",
            dap: 0.085,
            leaf: ["#9fb9c6"],
            bloom: [],
            bloomShare: 0,
            foliage: 0,
            leafScale: 0.8,
            canopy: "#9fb9c6",
            bark: "#56473c",
            ground: ["#f4f7f8", "#e3ebef"],
          },
          {
            sky: ["#fbe8ea", "#faf0e3", "#fcf6ec"],
            sun: 1,
            shade: "#5a4034",
            dap: 0.11,
            leaf: ["#8db870", "#a9cf8a", "#7fae62"],
            bloom: ["#f1b8c4", "#f8d9e0", "#e79fb0", "#fff3f5"],
            bloomShare: 0.68,
            foliage: 0.92,
            leafScale: 0.95,
            canopy: "#f2bccb",
            bark: "#654a38",
            ground: ["#b6d596", "#98bd76"],
          },
        ];
        var SEASON = SEASON_RAW.map(function (s) {
          return {
            sky: s.sky.map(hexRGB),
            sun: s.sun,
            shade: hexRGB(s.shade),
            dap: s.dap,
            leaf: s.leaf.map(hexRGB),
            bloom: s.bloom.map(hexRGB),
            bloomShare: s.bloomShare,
            foliage: s.foliage,
            leafScale: s.leafScale,
            bark: hexRGB(s.bark),
            canopy: hexRGB(s.canopy),
            ground: s.ground.map(hexRGB),
          };
        });
        /* a blended palette between two seasons (a -> b by t) */
        var seasonMix = function (a, b, t) {
          var A = SEASON[clamp(a | 0, 0, 4)];
          var B = SEASON[clamp(b | 0, 0, 4)];
          var n = Math.max(A.leaf.length, B.leaf.length, 1);
          var leaves = [];
          var i;
          for (i = 0; i < n; i++) {
            var la = A.leaf.length
              ? A.leaf[i % A.leaf.length]
              : B.leaf[i % Math.max(1, B.leaf.length)];
            var lb = B.leaf.length ? B.leaf[i % B.leaf.length] : la;
            leaves.push(
              rgbStr(
                mixRGB(la || [150, 170, 120], lb || la || [150, 170, 120], t),
              ),
            );
          }
          var nb = Math.max(A.bloom.length, B.bloom.length, 1);
          var blooms = [];
          for (i = 0; i < nb; i++) {
            var ba = A.bloom.length
              ? A.bloom[i % A.bloom.length]
              : B.bloom.length
                ? B.bloom[i % B.bloom.length]
                : [255, 240, 244];
            var bb = B.bloom.length ? B.bloom[i % B.bloom.length] : ba;
            blooms.push(rgbStr(mixRGB(ba, bb, t)));
          }
          /* foliage passes through the season's own curve rather than a straight line */
          var dens = lerp(A.foliage, B.foliage, t);
          return {
            leaves: leaves,
            blooms: blooms,
            bloomShare: lerp(A.bloomShare, B.bloomShare, t),
            dens: dens,
            scale: lerp(A.leafScale, B.leafScale, t),
            cluster: mixRGB(
              A.foliage > 0 ? A.canopy : B.canopy,
              B.foliage > 0 ? B.canopy : A.canopy,
              t,
            ),
            bark: rgbStr(mixRGB(A.bark, B.bark, t)),
            barkRGB: mixRGB(A.bark, B.bark, t),
            snow: (a === 3 ? 1 - t : 0) + (b === 3 ? t : 0),
            ground: [
              mixRGB(A.ground[0], B.ground[0], t),
              mixRGB(A.ground[1], B.ground[1], t),
            ],
            sky: [
              mixRGB(A.sky[0], B.sky[0], t),
              mixRGB(A.sky[1], B.sky[1], t),
              mixRGB(A.sky[2], B.sky[2], t),
            ],
            shade: mixRGB(A.shade, B.shade, t),
            sun: lerp(A.sun, B.sun, t),
            dap: lerp(A.dap, B.dap, t),
          };
        };
        /* a continuous season value (0..4, may wrap) into (a, b, t) */
        var seasonSplit = function (s) {
          var a = Math.floor(s);
          var t = s - a;
          var b = a + 1;
          if (a >= 4) {
            a = 4;
            b = 4;
            t = 0;
          }
          return { a: clamp(a, 0, 4), b: clamp(b, 0, 4), t: t };
        };
        /* a cycling season (springâ†’summerâ†’autumnâ†’winterâ†’springâ€¦) from a float */
        var seasonCycle = function (s) {
          var w = ((s % 4) + 4) % 4;
          var a = Math.floor(w);
          var t = w - a;
          var b = (a + 1) % 4;
          return { a: a, b: b, t: t };
        };

        /* TREE â€” a small procedural tree engine for canvas 2D.
A crown is a seeded recursive branching; the "braided" tree adds two
strands (one for each of them) that twist around each other before
they become one trunk. Growth (g), season palette and wind are inputs. */
        var Tree = (function () {
          var UP = -Math.PI / 2;

          var build = function (o) {
            var r = rng(o.seed || 7);
            var maxD = o.depth || 6;
            var B = [];
            var L = [];
            var add = function (p, t, ra, len, w, d, birth) {
              var dur = (o.dur || 0.2) * (1 - d * 0.045);
              var b = {
                p: p,
                t: t,
                ra: ra,
                len: len,
                w: w,
                d: d,
                birth: birth,
                dur: dur,
                ph: r() * TAU,
                fq: 0.7 + r() * 0.7,
                f: 0,
                a: ra,
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 0,
                w0: 0,
                w1: 0,
              };
              var i = B.length;
              B.push(b);
              if (d < maxD) {
                /* symmetric forks keep the crown round; jitter stays small so the
tree never leans off to one side */
                var n =
                  d === 0
                    ? o.split0 || 3
                    : r() < (o.tri == null ? 0.32 : o.tri)
                      ? 3
                      : 2;
                var spread =
                  (o.spread || 0.6) * (d === 0 ? 1 : 0.86 + r() * 0.28);
                for (var k = 0; k < n; k++) {
                  var frac = n === 1 ? 0 : k / (n - 1) - 0.5;
                  var mid = n === 3 && k === 1;
                  var ang = ra + frac * 2 * spread + (r() - 0.5) * 0.22;
                  ang += (UP - ang) * (o.up == null ? 0.14 : o.up);
                  if (o.bias) {
                    ang += o.bias * (0.25 + d / maxD) * 0.38;
                  }
                  ang = clamp(ang, UP - 1.48, UP + 1.48);
                  var tt = d === 0 || n === 2 || mid ? 1 : 0.6 + r() * 0.36;
                  var ratio = d === 0 ? o.limb || 1.6 : 0.7 + r() * 0.13;
                  var nl = len * ratio * (mid ? 1 : 0.95);
                  add(
                    i,
                    tt,
                    ang,
                    nl,
                    w * (d === 0 ? 0.7 : mid ? 0.74 : 0.66),
                    d + 1,
                    birth + dur * tt,
                  );
                }
              }
              if (d >= maxD - 1) {
                var nlv = d === maxD ? o.leafTip || 5 : o.leafMid || 2;
                for (var j = 0; j < nlv; j++) {
                  L.push({
                    b: i,
                    t: 0.28 + r() * 0.72,
                    side: r() < 0.5 ? -1 : 1,
                    off: 0.15 + r() * 1.15,
                    ang: (r() - 0.5) * 2.4,
                    size: 0.62 + r() * 0.76,
                    k: r(),
                    k2: r(),
                    k3: r(),
                    lag: r(),
                  });
                }
              }
              return i;
            };
            add(
              -1,
              0,
              UP + (o.lean || 0),
              o.trunk || 0.3,
              o.trunkW || 0.05,
              0,
              o.birth0 || 0,
            );
            /* group leaves by a stable colour slot once, so drawing batches by fill */
            return { B: B, L: L, maxD: maxD, o: o };
          };

          /* place every branch for this frame */
          var pose = function (T, st) {
            var B = T.B;
            var g = st.g;
            var H = st.H;
            var t = st.time || 0;
            var sway = st.sway == null ? 1 : st.sway;
            var gust = st.gust || 0;
            var thick = 0.42 + 0.58 * smooth(g);
            for (var i = 0; i < B.length; i++) {
              var b = B[i];
              var f = clamp((g - b.birth) / b.dur, 0, 1);
              b.f = f;
              if (f <= 0) {
                continue;
              }
              var sw =
                (Math.sin(t * b.fq + b.ph) * 0.016 +
                  Math.sin(t * 0.33 + b.ph * 0.5) * 0.01) *
                  sway *
                  (b.d + 0.4) +
                gust * 0.018 * (b.d + 1) * (0.6 + 0.4 * Math.sin(t * 3 + b.ph));
              if (b.p < 0) {
                b.a = b.ra + sw * 0.25 + (st.tilt || 0);
                b.x0 = st.x;
                b.y0 = st.y;
              } else {
                var p = B[b.p];
                b.a = b.ra + (p.a - p.ra) + sw;
                var pl = p.len * H * b.t;
                b.x0 = p.x0 + Math.cos(p.a) * pl;
                b.y0 = p.y0 + Math.sin(p.a) * pl;
              }
              var len = b.len * H * easeOut(f);
              b.x1 = b.x0 + Math.cos(b.a) * len;
              b.y1 = b.y0 + Math.sin(b.a) * len;
              var w0 = b.w * H * thick;
              b.w0 = w0;
              b.w1 = lerp(w0, w0 * (b.d < T.maxD ? 0.74 : 0.34), f);
            }
          };

          var drawBranches = function (ctx, T, fill) {
            var B = T.B;
            var i;
            var b;
            ctx.fillStyle = fill;
            ctx.beginPath();
            for (i = 0; i < B.length; i++) {
              b = B[i];
              if (b.f <= 0) {
                continue;
              }
              var dx = b.x1 - b.x0;
              var dy = b.y1 - b.y0;
              var l = Math.sqrt(dx * dx + dy * dy) || 1;
              var nx = -dy / l;
              var ny = dx / l;
              var h0 = b.w0 * 0.5;
              var h1 = b.w1 * 0.5;
              ctx.moveTo(b.x0 + nx * h0, b.y0 + ny * h0);
              ctx.lineTo(b.x1 + nx * h1, b.y1 + ny * h1);
              ctx.lineTo(b.x1 - nx * h1, b.y1 - ny * h1);
              ctx.lineTo(b.x0 - nx * h0, b.y0 - ny * h0);
              ctx.closePath();
            }
            ctx.fill();
            ctx.beginPath();
            for (i = 0; i < B.length; i++) {
              b = B[i];
              if (b.f <= 0 || b.w1 < 1.2) {
                continue;
              }
              ctx.moveTo(b.x1 + b.w1 * 0.5, b.y1);
              ctx.arc(b.x1, b.y1, b.w1 * 0.5, 0, TAU);
            }
            ctx.fill();
          };

          /* a light edge along the thick limbs so the bark reads as round */
          var drawBarkLight = function (ctx, T, rgb) {
            var B = T.B;
            ctx.strokeStyle = rgbStr(mixRGB(rgb, [255, 240, 220], 0.28), 0.55);
            ctx.lineCap = "round";
            ctx.beginPath();
            for (var i = 0; i < B.length; i++) {
              var b = B[i];
              if (b.f <= 0 || b.d > 2 || b.w0 < 4) {
                continue;
              }
              var dx = b.x1 - b.x0;
              var dy = b.y1 - b.y0;
              var l = Math.sqrt(dx * dx + dy * dy) || 1;
              var nx = -dy / l;
              var ny = dx / l;
              if (nx < 0) {
                nx = -nx;
                ny = -ny;
              }
              ctx.moveTo(b.x0 + nx * b.w0 * 0.22, b.y0 + ny * b.w0 * 0.22);
              ctx.lineTo(b.x1 + nx * b.w1 * 0.22, b.y1 + ny * b.w1 * 0.22);
            }
            ctx.lineWidth = Math.max(1, (B[0].w0 || 4) * 0.12);
            ctx.stroke();
          };

          /* snow resting on top of the limbs */
          var drawSnow = function (ctx, T, amt) {
            if (amt <= 0.02) {
              return;
            }
            var B = T.B;
            ctx.strokeStyle =
              "rgba(255,255,255," + (0.92 * amt).toFixed(3) + ")";
            ctx.lineCap = "round";
            for (var i = 0; i < B.length; i++) {
              var b = B[i];
              if (b.f <= 0.5 || b.d > 4) {
                continue;
              }
              var dx = b.x1 - b.x0;
              var dy = b.y1 - b.y0;
              var l = Math.sqrt(dx * dx + dy * dy) || 1;
              var nx = -dy / l;
              var ny = dx / l;
              if (ny > 0) {
                nx = -nx;
                ny = -ny;
              }
              /* snow only settles on limbs that are not too steep */
              var flat = 1 - Math.abs(dy / l);
              if (flat < 0.15) {
                continue;
              }
              ctx.lineWidth = Math.max(1.2, b.w0 * 0.42 * amt * (0.5 + flat));
              ctx.beginPath();
              ctx.moveTo(b.x0 + nx * b.w0 * 0.45, b.y0 + ny * b.w0 * 0.45);
              ctx.lineTo(b.x1 + nx * b.w1 * 0.45, b.y1 + ny * b.w1 * 0.45);
              ctx.stroke();
            }
          };

          /* leaves & blossoms, batched by colour */
          var drawLeaves = function (ctx, T, st, pal) {
            var L = T.L;
            var B = T.B;
            var H = st.H;
            var g = st.g;
            var t = st.time || 0;
            var sway = st.sway == null ? 1 : st.sway;
            var base = H * (T.o.leafSize || 0.024) * (pal.scale || 1);
            var nL = pal.leaves.length;
            var nB = pal.blooms.length;
            var dens = pal.dens;
            if (dens <= 0.01) {
              return;
            }
            var buckets = [];
            var i;
            for (i = 0; i < nL + nB; i++) {
              buckets.push([]);
            }
            /* the canopy: overlapping soft masses (shadow, body, light) under the
individual leaves, so the crown reads as a full, rounded dome */
            /* the masses thin out with the foliage, so a crown that is letting go
(or just leafing) never shows one lonely blob */
            var massA = clamp((dens - 0.12) / 0.38, 0, 1);
            if (pal.cluster && massA > 0.02) {
              var cl = pal.cluster;
              var cols = [
                rgbStr(mixRGB(cl, [24, 30, 16], 0.26), 0.92 * massA),
                rgbStr(cl, 0.94 * massA),
                rgbStr(mixRGB(cl, [255, 250, 232], 0.22), 0.9 * massA),
              ];
              var massR = 0.55 + 0.45 * massA;
              var md = T.maxD;
              var masses = [];
              for (var pass = 0; pass < 3; pass++) {
                ctx.fillStyle = cols[pass];
                ctx.beginPath();
                for (i = 0; i < B.length; i++) {
                  var cb = B[i];
                  if (cb.d < md - 3 || cb.f < 0.55) {
                    continue;
                  }
                  if (pass === 2 && cb.d < md - 1) {
                    continue;
                  }
                  var ck = (cb.ph / TAU + cb.fq * 0.61) % 1;
                  if (ck > dens) {
                    continue;
                  }
                  var cgr = clamp((g - cb.birth - cb.dur * 0.8) / 0.14, 0, 1);
                  if (cgr <= 0) {
                    continue;
                  }
                  var lvl = md - cb.d;
                  var cr =
                    base *
                    [2.1, 2.9, 3.6, 4.2][lvl] *
                    (0.8 + ck * 0.45) *
                    easeOut(cgr) *
                    massR *
                    (pass === 2 ? 0.62 : 1);
                  var ox = pass === 0 ? -cr * 0.16 : pass === 2 ? cr * 0.3 : 0;
                  var oy =
                    pass === 0
                      ? cr * 0.22
                      : pass === 2
                        ? -cr * 0.34
                        : -cr * 0.04;
                  var cx = cb.x1 + ox;
                  var cy = cb.y1 + oy;
                  ctx.moveTo(cx + cr, cy);
                  ctx.arc(cx, cy, cr, 0, TAU);
                  if (pass === 1) {
                    masses.push(cx, cy, cr, ck);
                  }
                }
                ctx.fill();
              }
              /* speckles of the season's leaves or petals over the masses, so the
dome has texture all the way down, not only at the twig tips */
              var spk = nB && pal.bloomShare > 0.6 ? pal.blooms : pal.leaves;
              var ns = spk.length;
              ctx.globalAlpha = massA;
              for (var sc = 0; sc < ns; sc++) {
                ctx.fillStyle = spk[sc];
                ctx.beginPath();
                for (var mi = 0; mi < masses.length; mi += 4) {
                  var mr = masses[mi + 2];
                  for (var k2 = 0; k2 < 5; k2++) {
                    var hs =
                      (masses[mi + 3] * 9.73 + k2 * 0.618 + mi * 0.0131) % 1;
                    if (Math.floor(hs * ns) !== sc) {
                      continue;
                    }
                    var sa2 = hs * 40 + k2 * 2.4;
                    var sd = mr * (0.22 + ((hs * 7.1) % 1) * 0.62);
                    var spx = masses[mi] + Math.cos(sa2) * sd;
                    var spy = masses[mi + 1] + Math.sin(sa2) * sd * 0.8;
                    var spr = base * (0.2 + ((hs * 3.3) % 1) * 0.24);
                    ctx.moveTo(spx + spr, spy);
                    ctx.arc(spx, spy, spr, 0, TAU);
                  }
                }
                ctx.fill();
              }
              ctx.globalAlpha = 1;
            }
            for (i = 0; i < L.length; i++) {
              var lf = L[i];
              if (lf.k > dens) {
                continue;
              }
              var b = B[lf.b];
              if (b.f < lf.t) {
                continue;
              }
              var born = b.birth + b.dur * lf.t + lf.lag * 0.04;
              var grow = clamp((g - born) / 0.07, 0, 1);
              if (grow <= 0) {
                continue;
              }
              var isBloom = nB > 0 && lf.k2 < pal.bloomShare;
              var slot = isBloom
                ? nL + (Math.floor(lf.k3 * nB) % nB)
                : Math.floor(lf.k3 * nL) % nL;
              buckets[slot].push(i);
            }
            for (var s = 0; s < buckets.length; s++) {
              var list = buckets[s];
              if (!list.length) {
                continue;
              }
              var bloom = s >= nL;
              ctx.fillStyle = bloom ? pal.blooms[s - nL] : pal.leaves[s];
              ctx.beginPath();
              for (var j = 0; j < list.length; j++) {
                var q = L[list[j]];
                var br = B[q.b];
                var bl = br.len * H * q.t;
                var x = br.x0 + Math.cos(br.a) * bl;
                var y = br.y0 + Math.sin(br.a) * bl;
                var na = br.a + q.side * 1.5708;
                x += Math.cos(na) * q.off * base;
                y += Math.sin(na) * q.off * base;
                var gr = clamp(
                  (g - (br.birth + br.dur * q.t + q.lag * 0.04)) / 0.07,
                  0,
                  1,
                );
                var sz = base * q.size * easeOut(gr);
                if (sz < 0.4) {
                  continue;
                }
                var a =
                  br.a + q.ang + Math.sin(t * 1.4 + q.k * 17) * 0.14 * sway;
                if (bloom) {
                  var rr = sz * 0.5;
                  for (var k = 0; k < 5; k++) {
                    var pa = a + k * 1.2566;
                    var px = x + Math.cos(pa) * rr * 0.95;
                    var py = y + Math.sin(pa) * rr * 0.95;
                    ctx.moveTo(px + rr * 0.72, py);
                    ctx.arc(px, py, rr * 0.72, 0, TAU);
                  }
                } else {
                  var ca = Math.cos(a);
                  var sa = Math.sin(a);
                  ctx.moveTo(x + ca * sz * 2.1, y + sa * sz * 2.1);
                  ctx.ellipse(
                    x + ca * sz,
                    y + sa * sz,
                    sz * 1.1,
                    sz * 0.55,
                    a,
                    0,
                    TAU,
                  );
                }
              }
              ctx.fill();
            }
            /* golden hearts of the blossoms */
            if (nB > 0 && pal.bloomShare > 0.2) {
              ctx.fillStyle = "rgba(236,196,92,0.9)";
              ctx.beginPath();
              for (i = nL; i < buckets.length; i++) {
                var lst = buckets[i];
                for (var m = 0; m < lst.length; m += 2) {
                  var w = L[lst[m]];
                  var bb = B[w.b];
                  var bl2 = bb.len * H * w.t;
                  var x2 =
                    bb.x0 +
                    Math.cos(bb.a) * bl2 +
                    Math.cos(bb.a + w.side * 1.5708) * w.off * base;
                  var y2 =
                    bb.y0 +
                    Math.sin(bb.a) * bl2 +
                    Math.sin(bb.a + w.side * 1.5708) * w.off * base;
                  var r2 = base * w.size * 0.16;
                  ctx.moveTo(x2 + r2, y2);
                  ctx.arc(x2, y2, r2, 0, TAU);
                }
              }
              ctx.fill();
            }
          };

          /* a random visible leaf position (for leaves that fall off in autumn) */
          var leafAt = function (T, st, k) {
            var L = T.L;
            var B = T.B;
            if (!L.length) {
              return null;
            }
            var lf = L[Math.floor(k * L.length) % L.length];
            var b = B[lf.b];
            if (b.f < lf.t) {
              return null;
            }
            var bl = b.len * st.H * lf.t;
            return {
              x: b.x0 + Math.cos(b.a) * bl,
              y: b.y0 + Math.sin(b.a) * bl,
            };
          };

          /* bounds of the grown crown (for hit areas and framing) */
          var bounds = function (T) {
            var B = T.B;
            var x0 = Infinity;
            var y0 = Infinity;
            var x1 = -Infinity;
            var y1 = -Infinity;
            for (var i = 0; i < B.length; i++) {
              var b = B[i];
              if (b.f <= 0) {
                continue;
              }
              x0 = Math.min(x0, b.x1, b.x0);
              x1 = Math.max(x1, b.x1, b.x0);
              y0 = Math.min(y0, b.y1, b.y0);
              y1 = Math.max(y1, b.y1, b.y0);
            }
            return { x0: x0, y0: y0, x1: x1, y1: y1 };
          };

          return {
            build: build,
            pose: pose,
            drawBranches: drawBranches,
            drawBarkLight: drawBarkLight,
            drawSnow: drawSnow,
            drawLeaves: drawLeaves,
            leafAt: leafAt,
            bounds: bounds,
          };
        })();

        /* ---------------------------------------------------------------------
The braided tree: two strands twist upward and become one crown
--------------------------------------------------------------------- */
        var Braided = function (seed, o) {
          o = o || {};
          var crown = Tree.build({
            seed: seed,
            depth: o.depth || 6,
            trunk: o.trunk || 0.15,
            limb: o.limb || 1.6,
            trunkW: o.trunkW || 0.05,
            split0: o.split0 || 3,
            spread: o.spread || 0.6,
            up: o.up == null ? 0.17 : o.up,
            tri: o.tri,
            leafTip: o.leafTip || 5,
            leafMid: o.leafMid || 2,
            leafSize: o.leafSize || 0.026,
            dur: o.dur || 0.2,
          });
          var braidH = o.braidH || 0.36;
          var twists = o.twists || 2.3;
          var cA = o.colA || [104, 78, 58];
          var cB = o.colB || [138, 104, 76];
          var top = { x: 0, y: 0 };
          var segBack = [];
          var segFront = [];

          var drawBraid = function (ctx, st, gb) {
            var H = st.H;
            var h = braidH * H * gb;
            if (h < 1) {
              top.x = st.x;
              top.y = st.y;
              return;
            }
            var w = (o.strandW || 0.034) * H * (0.5 + 0.5 * smooth(st.g));
            var amp = w * 0.62;
            var n = 44;
            var t = st.time || 0;
            var sway = (st.sway == null ? 1 : st.sway) + (st.gust || 0) * 2;
            segBack.length = 0;
            segFront.length = 0;
            var prevA = null;
            var prevB = null;
            for (var s = 0; s <= n; s++) {
              var u = s / n;
              var yy = st.y - h * u;
              var uu = (h * u) / (braidH * H);
              var bend =
                Math.sin(t * 0.55) * sway * uu * uu * H * 0.006 +
                (st.tilt || 0) * uu * H * 0.3;
              /* the strands start side by side (two seedlings), then wind round each other */
              var phi = twists * TAU * uu + Math.PI / 2;
              var taper = 1 - uu * 0.55;
              var a = {
                x: st.x + bend + Math.sin(phi) * amp * taper,
                y: yy,
                z: Math.cos(phi),
                w: w * (1 - uu * 0.3),
              };
              var b = {
                x: st.x + bend + Math.sin(phi + Math.PI) * amp * taper,
                y: yy,
                z: Math.cos(phi + Math.PI),
                w: w * (1 - uu * 0.3),
              };
              if (prevA) {
                (prevA.z + a.z > 0 ? segFront : segBack).push([prevA, a, 0]);
                (prevB.z + b.z > 0 ? segFront : segBack).push([prevB, b, 1]);
              }
              prevA = a;
              prevB = b;
            }
            top.x = prevA ? (prevA.x + prevB.x) / 2 : st.x;
            top.y = st.y - h;
            ctx.lineCap = "round";
            var paint = function (list, shade) {
              for (var i = 0; i < list.length; i++) {
                var sg = list[i];
                var col = sg[2] === 0 ? cA : cB;
                ctx.strokeStyle = rgbStr(
                  mixRGB(
                    col,
                    shade < 0 ? [30, 20, 12] : [255, 236, 214],
                    Math.abs(shade),
                  ),
                );
                ctx.lineWidth = sg[0].w;
                ctx.beginPath();
                ctx.moveTo(sg[0].x, sg[0].y);
                ctx.lineTo(sg[1].x, sg[1].y);
                ctx.stroke();
              }
            };
            paint(segBack, -0.28);
            paint(segFront, 0.06);
          };

          return {
            crown: crown,
            top: top,
            braidH: braidH,
            /* st: {x, y, H, g, time, sway, gust, pal, tilt} */
            draw: function (ctx, st, pal) {
              var gb = clamp(st.g / 0.3, 0, 1);
              var gc = clamp((st.g - 0.28) / 0.72, 0, 1);
              drawBraid(ctx, st, gb);
              if (gc > 0) {
                var cs = {
                  x: top.x,
                  y: top.y + 2,
                  H: st.H,
                  g: gc,
                  time: st.time,
                  sway: st.sway,
                  gust: st.gust,
                  tilt: st.tilt,
                };
                Tree.pose(crown, cs);
                Tree.drawBranches(ctx, crown, pal.bark);
                Tree.drawBarkLight(ctx, crown, pal.barkRGB);
                Tree.drawSnow(ctx, crown, pal.snow);
                Tree.drawLeaves(ctx, crown, cs, pal);
                return cs;
              }
              return null;
            },
          };
        };

        /* ---------------------------------------------------------------------
Particles â€” petals, leaves, snow, motes, dandelion fluff
--------------------------------------------------------------------- */
        var Flurry = function (max) {
          var P = [];
          var kindFor = function (season, r) {
            if (season === 0) {
              return r < 0.72 ? "petal" : "mote";
            }
            if (season === 1) {
              return r < 0.55 ? "fluff" : "mote";
            }
            if (season === 2) {
              return "leaf";
            }
            if (season === 3) {
              return "snow";
            }
            return r < 0.78 ? "petal" : "spark";
          };
          var LEAFC = ["#d58b2c", "#b1502a", "#e3a93c", "#9a3b22", "#c9a04e"];
          var PETALC = ["#f5c9d3", "#fbe6ea", "#eeafbf", "#ffffff"];
          var api = {
            list: P,
            kindFor: kindFor,
            add: function (x, y, kind, vx, vy, big) {
              if (P.length >= max) {
                P.shift();
              }
              var r = Math.random();
              var p = {
                x: x,
                y: y,
                vx: vx == null ? (Math.random() - 0.5) * 20 : vx,
                vy: vy == null ? 10 + Math.random() * 20 : vy,
                k: kind,
                s:
                  (kind === "leaf"
                    ? 5 + r * 5
                    : kind === "snow"
                      ? 1.4 + r * 2.6
                      : kind === "petal"
                        ? 3 + r * 3
                        : kind === "fluff"
                          ? 3 + r * 3
                          : 1.2 + r * 2) * (big || 1),
                rot: Math.random() * TAU,
                vr: (Math.random() - 0.5) * 3,
                ph: Math.random() * TAU,
                life: 0,
                max:
                  kind === "mote" || kind === "spark"
                    ? 4 + Math.random() * 4
                    : 14 + Math.random() * 10,
                c:
                  kind === "leaf"
                    ? LEAFC[Math.floor(r * LEAFC.length)]
                    : kind === "petal"
                      ? PETALC[Math.floor(r * PETALC.length)]
                      : null,
              };
              P.push(p);
              return p;
            },
            /* wind in px/s; floor = y where things settle (optional) */
            step: function (dt, wind, W, H, floor) {
              for (var i = P.length - 1; i >= 0; i--) {
                var p = P[i];
                p.life += dt;
                var k = p.k;
                if (k === "mote" || k === "spark") {
                  p.vy += (-8 - p.vy) * dt;
                  p.x +=
                    (p.vx * 0.3 +
                      wind * 0.3 +
                      Math.sin(p.life * 1.3 + p.ph) * 8) *
                    dt;
                  p.y += p.vy * dt;
                } else if (k === "fluff") {
                  p.x += (wind * 0.8 + Math.sin(p.life * 0.9 + p.ph) * 14) * dt;
                  p.y += (Math.sin(p.life * 0.6 + p.ph) * 10 - 4) * dt;
                  p.rot += Math.sin(p.life + p.ph) * dt;
                } else {
                  var fall =
                    k === "snow" ? 26 + p.s * 6 : k === "leaf" ? 38 : 30;
                  p.vy += (fall - p.vy) * Math.min(1, dt * 1.6);
                  var flutter = k === "snow" ? 10 : 26;
                  p.vx +=
                    (wind + Math.sin(p.life * 1.7 + p.ph) * flutter - p.vx) *
                    Math.min(1, dt * 1.4);
                  p.x += p.vx * dt;
                  p.y += p.vy * dt;
                  p.rot += p.vr * dt;
                  if (floor && p.y > floor) {
                    p.y = floor;
                    p.vy = 0;
                    p.vx *= 0.9;
                    p.vr *= 0.8;
                    if (!p.landed) {
                      p.landed = p.life;
                    }
                  }
                }
                var dead =
                  p.life > p.max ||
                  p.y > H + 40 ||
                  p.x < -60 ||
                  p.x > W + 60 ||
                  p.y < -80;
                if (p.landed && p.life - p.landed > 3) {
                  dead = true;
                }
                if (dead) {
                  P.splice(i, 1);
                }
              }
            },
            draw: function (ctx) {
              for (var i = 0; i < P.length; i++) {
                var p = P[i];
                var fade =
                  Math.min(1, p.life * 2) * Math.min(1, (p.max - p.life) * 0.8);
                if (p.landed) {
                  fade *= clamp(1 - (p.life - p.landed) / 3, 0, 1);
                }
                if (fade <= 0.01) {
                  continue;
                }
                ctx.globalAlpha = fade;
                if (p.k === "petal") {
                  ctx.fillStyle = p.c;
                  ctx.save();
                  ctx.translate(p.x, p.y);
                  ctx.rotate(p.rot);
                  ctx.scale(
                    1,
                    0.35 + 0.65 * Math.abs(Math.sin(p.life * 2.2 + p.ph)),
                  );
                  ctx.beginPath();
                  ctx.ellipse(0, 0, p.s, p.s * 0.62, 0, 0, TAU);
                  ctx.fill();
                  ctx.restore();
                } else if (p.k === "leaf") {
                  ctx.fillStyle = p.c;
                  ctx.save();
                  ctx.translate(p.x, p.y);
                  ctx.rotate(p.rot);
                  ctx.scale(Math.cos(p.life * 2.6 + p.ph), 1);
                  ctx.beginPath();
                  ctx.moveTo(0, -p.s);
                  ctx.quadraticCurveTo(p.s * 0.9, 0, 0, p.s);
                  ctx.quadraticCurveTo(-p.s * 0.9, 0, 0, -p.s);
                  ctx.fill();
                  ctx.restore();
                } else if (p.k === "snow") {
                  ctx.fillStyle = "rgba(120,150,170,0.35)";
                  ctx.beginPath();
                  ctx.arc(p.x + 0.6, p.y + 0.8, p.s, 0, TAU);
                  ctx.fill();
                  ctx.fillStyle = "#ffffff";
                  ctx.beginPath();
                  ctx.arc(p.x, p.y, p.s, 0, TAU);
                  ctx.fill();
                } else if (p.k === "fluff") {
                  ctx.strokeStyle = "rgba(255,255,255,0.85)";
                  ctx.lineWidth = 0.8;
                  ctx.save();
                  ctx.translate(p.x, p.y);
                  ctx.rotate(p.rot);
                  ctx.beginPath();
                  for (var a = 0; a < 8; a++) {
                    var aa = (a / 8) * TAU;
                    ctx.moveTo(0, 0);
                    ctx.lineTo(
                      Math.cos(aa) * p.s,
                      Math.sin(aa) * p.s - p.s * 0.2,
                    );
                  }
                  ctx.moveTo(0, 0);
                  ctx.lineTo(0, p.s * 1.6);
                  ctx.stroke();
                  ctx.restore();
                } else {
                  var tw = 0.5 + 0.5 * Math.sin(p.life * 4 + p.ph);
                  ctx.fillStyle =
                    p.k === "spark"
                      ? "rgba(236,196,92," + (0.5 + tw * 0.5).toFixed(3) + ")"
                      : "rgba(255,236,170," +
                        (0.35 + tw * 0.5).toFixed(3) +
                        ")";
                  ctx.beginPath();
                  ctx.arc(p.x, p.y, p.s * (0.7 + tw * 0.5), 0, TAU);
                  ctx.fill();
                }
              }
              ctx.globalAlpha = 1;
            },
            clear: function () {
              P.length = 0;
            },
          };
          return api;
        };

        /* ---------------------------------------------------------------------
Stage â€” a canvas that sizes itself, caps DPR, and only runs its loop
while it is near the screen and the tab is visible
--------------------------------------------------------------------- */
        var stage = function (canvas, paint, opts) {
          opts = opts || {};
          if (!canvas || !canvas.getContext) {
            return null;
          }
          var ctx = canvas.getContext("2d");
          if (!ctx) {
            return null;
          }
          var W = 0;
          var H = 0;
          var ratio = 1;
          var running = false;
          var visible = false;
          var id = 0;
          var last = 0;
          var t0 = now();
          var size = function () {
            /* layout size, not the transformed box: reveal transforms must not shrink the buffer */
            var w = Math.max(1, canvas.offsetWidth || canvas.clientWidth || 1);
            var h = Math.max(
              1,
              canvas.offsetHeight || canvas.clientHeight || 1,
            );
            ratio = opts.dpr || dprCap();
            if (w === W && h === H && canvas.width === Math.round(w * ratio)) {
              return false;
            }
            W = w;
            H = h;
            canvas.width = Math.round(W * ratio);
            canvas.height = Math.round(H * ratio);
            return true;
          };
          var frame = function (ts) {
            if (!running) {
              return;
            }
            var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
            last = ts;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            safe(function () {
              paint(ctx, W, H, dt, (ts - t0) / 1000);
            });
            id = raf(frame);
          };
          var api = {
            ctx: ctx,
            canvas: canvas,
            size: function () {
              return { w: W, h: H };
            },
            start: function () {
              if (running || reduceMotion) {
                return;
              }
              running = true;
              last = 0;
              id = raf(frame);
            },
            stop: function () {
              running = false;
              caf(id);
            },
            still: function (dt) {
              size();
              ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
              safe(function () {
                paint(ctx, W, H, dt || 0, (now() - t0) / 1000);
              });
            },
            resize: function () {
              if (size()) {
                if (opts.onResize) {
                  safe(function () {
                    opts.onResize(W, H);
                  });
                }
                if (!running) {
                  api.still();
                }
              }
            },
            isVisible: function () {
              return visible;
            },
          };
          size();
          if (opts.onResize) {
            safe(function () {
              opts.onResize(W, H);
            });
          }
          var sync = function () {
            if (
              visible &&
              !doc.hidden &&
              !reduceMotion &&
              opts.enabled !== false
            ) {
              api.start();
            } else {
              api.stop();
            }
          };
          if ("IntersectionObserver" in win) {
            new IntersectionObserver(
              function (entries) {
                entries.forEach(function (e) {
                  visible = e.isIntersecting;
                });
                sync();
              },
              { rootMargin: "120px 0px 120px 0px" },
            ).observe(opts.watch || canvas);
          } else {
            visible = true;
          }
          doc.addEventListener("visibilitychange", sync);
          var rt = 0;
          win.addEventListener("resize", function () {
            win.clearTimeout(rt);
            rt = later(api.resize, 120);
          });
          api.sync = sync;
          if (reduceMotion) {
            later(api.still, 60);
          } else {
            sync();
          }
          return api;
        };
        /* AMBIENT â€” the air under the tree: a season-tinted sky, dappled leaf
shadows (komorebi) that change with the season, and drifting petals,
dandelion fluff, falling leaves or snow. It follows the season of
whichever section is being read. */
        var seasonNow = { a: 0, b: 0, t: 0 };
        var seasonOverride = null;
        var gustLevel = 0;
        var gustListeners = [];
        var onGust = function (fn) {
          gustListeners.push(fn);
        };
        var gust = function (power) {
          gustLevel = Math.max(gustLevel, power || 1);
          gustListeners.forEach(function (fn) {
            safe(function () {
              fn(power || 1);
            });
          });
        };

        var computeSeason = function () {
          if (seasonOverride) {
            seasonNow.a = seasonOverride.a;
            seasonNow.b = seasonOverride.b;
            seasonNow.t = seasonOverride.t;
            return;
          }
          var vis = visibleSections();
          if (!vis.length) {
            return;
          }
          var line = win.innerHeight * 0.5;
          var idx = 0;
          for (var i = 0; i < vis.length; i++) {
            if (vis[i].getBoundingClientRect().top <= line) {
              idx = i;
            } else {
              break;
            }
          }
          var cur = vis[idx];
          var nxt = vis[idx + 1] || cur;
          var r = cur.getBoundingClientRect();
          var p = clamp((line - r.top) / Math.max(1, r.height), 0, 1);
          seasonNow.a = +(cur.getAttribute("data-musim") || 0);
          seasonNow.b = +(nxt.getAttribute("data-musim") || 0);
          seasonNow.t = smooth((p - 0.7) / 0.3);
          if (seasonNow.a === seasonNow.b) {
            seasonNow.t = 0;
          }
        };

        var initAmbient = function () {
          var amb = $("amb");
          if (!amb) {
            return;
          }
          var sky = $("amb-sky");
          var sun = $("amb-sun");
          var dapInner = $("amb-dapple-inner");
          var daps = [0, 1, 2, 3, 4].map(function (i) {
            return $("amb-dap-" + i);
          });
          var air = $("amb-air");
          var grain = $("amb-grain");
          var nav = $("nav");
          var dialHand = $("nav-dial-hand");
          var dialT = $("nav-dial-t");

          /* paper grain, made once */
          safe(function () {
            var c = doc.createElement("canvas");
            c.width = 200;
            c.height = 200;
            var x = c.getContext("2d");
            var img = x.createImageData(200, 200);
            var r = rng(91);
            for (var i = 0; i < img.data.length; i += 4) {
              var v = r();
              var dark = v < 0.5;
              img.data[i] = dark ? 60 : 255;
              img.data[i + 1] = dark ? 50 : 250;
              img.data[i + 2] = dark ? 30 : 235;
              img.data[i + 3] = Math.floor(
                Math.abs(v - 0.5) * 2 * (dark ? 26 : 18),
              );
            }
            x.putImageData(img, 0, 0);
            if (grain) {
              grain.style.backgroundImage =
                "url(" + c.toDataURL("image/png") + ")";
            }
          });

          /* dappled shadows: one soft layer per season, drawn once at low resolution */
          var dapW = 0;
          var dapH = 0;
          var drawDapple = function (idx, cv) {
            if (!cv || !cv.getContext) {
              return;
            }
            var lw = Math.ceil(dapW);
            var lh = Math.ceil(dapH);
            cv.width = lw;
            cv.height = lh;
            var x = cv.getContext("2d");
            var S = SEASON[idx];
            var r = rng(300 + idx * 17);
            var off = lw * 3;
            x.clearRect(0, 0, lw, lh);
            x.shadowColor = rgbStr(S.shade, 1);
            x.shadowBlur = Math.max(4, lw / 70);
            x.shadowOffsetX = off;
            x.fillStyle = "#000";
            x.strokeStyle = "#000";
            x.lineCap = "round";
            /* the limbs that hold the leaves, reaching in from the top corners */
            var limbs = [];
            var limb = function (sx, sy, ang, len, w, depth) {
              var ex = sx + Math.cos(ang) * len;
              var ey = sy + Math.sin(ang) * len;
              x.lineWidth = w;
              x.beginPath();
              x.moveTo(sx - off, sy);
              x.quadraticCurveTo(
                sx - off + Math.cos(ang + 0.3) * len * 0.5,
                sy + Math.sin(ang + 0.3) * len * 0.5,
                ex - off,
                ey,
              );
              x.stroke();
              limbs.push([sx, sy, ex, ey, depth]);
              if (depth < (idx === 3 ? 4 : 3)) {
                var n = 2 + (r() < 0.35 ? 1 : 0);
                for (var k = 0; k < n; k++) {
                  limb(
                    ex,
                    ey,
                    ang + (r() - 0.5) * 1.3,
                    len * (0.55 + r() * 0.2),
                    Math.max(1, w * 0.62),
                    depth + 1,
                  );
                }
              }
            };
            var base = Math.max(lw, lh);
            limb(
              -lw * 0.05,
              lh * (0.05 + r() * 0.1),
              0.35 + r() * 0.3,
              base * 0.34,
              Math.max(2, lw / 90),
              0,
            );
            limb(
              lw * 1.05,
              lh * (0.08 + r() * 0.12),
              Math.PI - 0.35 - r() * 0.3,
              base * 0.32,
              Math.max(2, lw / 95),
              0,
            );
            limb(
              lw * (0.35 + r() * 0.3),
              -lh * 0.04,
              1.25 + r() * 0.6,
              base * 0.22,
              Math.max(1.5, lw / 120),
              1,
            );
            if (idx === 3) {
              return;
            }
            /* leaves / blossoms clustered around the limb ends */
            var count = [150, 260, 90, 0, 190][idx];
            var sizeK = [1, 1.25, 1.15, 1, 0.95][idx];
            for (var i = 0; i < count; i++) {
              var L = limbs[Math.floor(r() * limbs.length)];
              var u = 0.35 + r() * 0.65;
              var cx = lerp(L[0], L[2], u) + (r() - 0.5) * base * 0.09;
              var cy = lerp(L[1], L[3], u) + (r() - 0.5) * base * 0.07;
              var s = (base / 90) * (0.6 + r() * 0.9) * sizeK;
              x.beginPath();
              if (idx === 0 || idx === 4) {
                if (r() < 0.55) {
                  x.arc(cx - off, cy, s * 0.8, 0, TAU);
                } else {
                  x.ellipse(cx - off, cy, s * 1.3, s * 0.6, r() * TAU, 0, TAU);
                }
              } else {
                x.ellipse(cx - off, cy, s * 1.4, s * 0.62, r() * TAU, 0, TAU);
              }
              x.fill();
            }
          };
          var buildDapples = function () {
            var vw = win.innerWidth;
            var vh = win.innerHeight;
            var w = Math.ceil((vw * 1.14) / 3);
            var h = Math.ceil((vh * 1.14) / 3);
            if (
              dapW &&
              Math.abs(w - dapW) / dapW < 0.18 &&
              Math.abs(h - dapH) / dapH < 0.35
            ) {
              return;
            }
            dapW = w;
            dapH = h;
            daps.forEach(function (cv, i) {
              safe(function () {
                drawDapple(i, cv);
              });
            });
          };
          buildDapples();

          /* sky, sun and shadow weights follow the season of the section being read */
          var lastKey = "";
          var lastMain = -1;
          var paintAir = function () {
            var P = seasonMix(seasonNow.a, seasonNow.b, seasonNow.t);
            var key =
              seasonNow.a + ":" + seasonNow.b + ":" + seasonNow.t.toFixed(2);
            if (key !== lastKey) {
              lastKey = key;
              if (sky) {
                sky.style.background =
                  "linear-gradient(180deg," +
                  rgbStr(P.sky[0]) +
                  " 0%," +
                  rgbStr(P.sky[1]) +
                  " 56%," +
                  rgbStr(P.sky[2]) +
                  " 100%)";
              }
              daps.forEach(function (cv, i) {
                if (!cv) {
                  return;
                }
                var w =
                  (i === seasonNow.a ? 1 - seasonNow.t : 0) +
                  (i === seasonNow.b ? seasonNow.t : 0);
                if (seasonNow.a === seasonNow.b && i === seasonNow.a) {
                  w = 1;
                }
                var o = (w * SEASON[i].dap).toFixed(3);
                if (cv.style.opacity !== o) {
                  cv.style.opacity = o;
                }
              });
              if (sun) {
                sun.style.opacity = (0.35 + P.sun * 0.55).toFixed(3);
              }
              var main = seasonNow.t < 0.5 ? seasonNow.a : seasonNow.b;
              if (main !== lastMain) {
                lastMain = main;
                if (nav) {
                  var c = [
                    "#9e4760",
                    "#3a6531",
                    "#9a4219",
                    "#3a5866",
                    "#8a4058",
                  ][main];
                  nav.style.setProperty("--nav-season", c);
                }
                if (dialHand) {
                  dialHand.style.transform =
                    "rotate(" + [45, 135, 225, 315, 405][main] + "deg)";
                }
                setText(dialT, SEASON_SHORT[main]);
              }
            }
            if (sun) {
              var sp = clamp(
                win.pageYOffset /
                  Math.max(
                    1,
                    doc.documentElement.scrollHeight - win.innerHeight,
                  ),
                0,
                1,
              );
              sun.style.setProperty(
                "--sun-x",
                ((sp - 0.5) * 60).toFixed(1) + "vw",
              );
              sun.style.setProperty(
                "--sun-y",
                (Math.sin(sp * Math.PI) * -6).toFixed(1) + "vh",
              );
            }
          };
          onScroll(function () {
            computeSeason();
            paintAir();
          });
          win.addEventListener("resize", function () {
            later(buildDapples, 200);
          });
          computeSeason();
          paintAir();
          var refresh = function () {
            computeSeason();
            paintAir();
          };

          /* the drifting air */
          if (!air || !air.getContext) {
            return refresh;
          }
          var ctx = air.getContext("2d");
          var flurry = Flurry(80);
          var W = 0;
          var H = 0;
          var ratio = 1;
          var target = 30;
          var pointer = { x: -999, y: -999, t: 0 };
          var lastY = win.pageYOffset;
          var wind = 0;
          var windT = 0;
          var nextGust = 6 + Math.random() * 6;
          var resize = function () {
            ratio = Math.min(win.devicePixelRatio || 1, 1.5);
            W = win.innerWidth;
            H = win.innerHeight;
            air.width = Math.round(W * ratio);
            air.height = Math.round(H * ratio);
            target = Math.round(clamp((W * H) / 26000, 22, 58));
          };
          resize();
          win.addEventListener("resize", resize);
          var spawnOne = function (anywhere) {
            var s = Math.random() < seasonNow.t ? seasonNow.b : seasonNow.a;
            var k = flurry.kindFor(s, Math.random());
            var x = Math.random() * W;
            var y;
            if (anywhere) {
              y = Math.random() * H;
            } else if (k === "mote" || k === "spark" || k === "fluff") {
              y = H * (0.3 + Math.random() * 0.8);
            } else {
              y = -20 - Math.random() * 60;
            }
            flurry.add(
              x,
              y,
              k,
              (Math.random() - 0.5) * 14,
              k === "mote" ? -6 : 18 + Math.random() * 16,
              W < 600 ? 1 : 1.2,
            );
          };
          for (var i = 0; i < target; i++) {
            spawnOne(true);
          }
          win.addEventListener(
            "pointermove",
            function (e) {
              pointer.x = e.clientX;
              pointer.y = e.clientY;
              pointer.t = now();
            },
            { passive: true },
          );
          /* a tap on empty page gives the air a gust */
          doc.addEventListener(
            "pointerdown",
            function (e) {
              var t = e.target;
              if (!t || !t.closest) {
                return;
              }
              if (
                t.closest(
                  "button, a, input, textarea, select, label, canvas, .nav, .viewer, .cover, iframe, video, [data-wedivo]",
                )
              ) {
                return;
              }
              gust(1);
              sound.wind();
            },
            { passive: true },
          );
          onGust(function (p) {
            windT = Math.max(windT, 1.6);
            wind = 70 * p;
            if (dapInner && dapInner.animate && !reduceMotion) {
              dapInner.animate(
                [
                  { transform: "translate3d(0,0,0) rotate(0deg)" },
                  { transform: "translate3d(1.6%,-0.4%,0) rotate(0.8deg)" },
                  { transform: "translate3d(-0.6%,0.2%,0) rotate(-0.3deg)" },
                  { transform: "translate3d(0,0,0) rotate(0deg)" },
                ],
                { duration: 1800, easing: "ease-in-out" },
              );
            }
          });
          onScroll(function () {
            var y = win.pageYOffset;
            var d = y - lastY;
            lastY = y;
            if (Math.abs(d) > 200) {
              return;
            }
            var list = flurry.list;
            for (var j = 0; j < list.length; j++) {
              list[j].y -= d * 0.22;
            }
          });
          var running = false;
          var last = 0;
          var frameN = 0;
          var loop = function (ts) {
            if (!running) {
              return;
            }
            var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
            last = ts;
            frameN += 1;
            if (frameN % 6 === 0) {
              computeSeason();
              paintAir();
            }
            nextGust -= dt;
            if (nextGust <= 0) {
              nextGust = 8 + Math.random() * 8;
              windT = 1.4;
              wind = 34 + Math.random() * 30;
            }
            windT = Math.max(0, windT - dt);
            var w = windT > 0 ? wind * Math.min(1, windT) : 0;
            var baseWind = [6, 4, 12, 3, 8][
              seasonNow.t < 0.5 ? seasonNow.a : seasonNow.b
            ];
            if (flurry.list.length < target && Math.random() < 0.3) {
              spawnOne(false);
            }
            flurry.step(dt, baseWind + w, W, H);
            /* the pointer parts the air */
            if (now() - pointer.t < 1200) {
              var list = flurry.list;
              for (var k = 0; k < list.length; k++) {
                var p = list[k];
                var dx = p.x - pointer.x;
                var dy = p.y - pointer.y;
                var d2 = dx * dx + dy * dy;
                if (d2 < 9000 && d2 > 1) {
                  var dd = Math.sqrt(d2);
                  var f = (1 - dd / 95) * 140 * dt;
                  p.x += (dx / dd) * f;
                  p.y += (dy / dd) * f;
                }
              }
            }
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            ctx.clearRect(0, 0, W, H);
            flurry.draw(ctx);
            raf(loop);
          };
          var sync = function () {
            var want = !doc.hidden && !reduceMotion;
            if (want && !running) {
              running = true;
              last = 0;
              raf(loop);
            } else if (!want) {
              running = false;
            }
          };
          doc.addEventListener("visibilitychange", sync);
          if (reduceMotion) {
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            flurry.draw(ctx);
          } else {
            sync();
          }
          return refresh;
        };

        /* REVEAL â€” per element, fired once it has climbed a third of the screen */
        var cover = $("sec-cover");
        var hero = $("sec-hero");
        var regions = $$("header, section, footer");
        var hasIO = "IntersectionObserver" in win;
        var pending = [];
        var markIn = function (el) {
          if (el.classList.contains("in-view")) {
            return;
          }
          el.classList.add("in-view");
          var cbs = el.__onIn;
          if (cbs) {
            el.__onIn = null;
            cbs.forEach(function (f) {
              safe(f);
            });
          }
        };
        var io = hasIO
          ? new IntersectionObserver(
              function (entries) {
                entries.forEach(function (e) {
                  if (e.isIntersecting) {
                    markIn(e.target);
                    io.unobserve(e.target);
                  }
                });
              },
              { threshold: 0, rootMargin: "0px 0px -33% 0px" },
            )
          : null;
        var observe = function (el) {
          if (!el || el.classList.contains("in-view") || el.__watched) {
            return;
          }
          if ((hero && hero.contains(el)) || (cover && cover.contains(el))) {
            return;
          }
          el.__watched = true;
          if (!io) {
            markIn(el);
            return;
          }
          io.observe(el);
          pending.push(el);
        };
        /* run fn once el has been revealed */
        var whenIn = function (el, fn) {
          if (!el) {
            return;
          }
          if (el.classList.contains("in-view")) {
            safe(fn);
            return;
          }
          (el.__onIn = el.__onIn || []).push(fn);
          observe(el);
        };
        var bottomRelease = function () {
          if (
            win.innerHeight + win.pageYOffset >=
            doc.documentElement.scrollHeight - 4
          ) {
            pending.forEach(function (el) {
              if (!el.classList.contains("in-view") && shown(el)) {
                markIn(el);
              }
            });
          }
        };
        onScroll(bottomRelease);

        /* region classes: is-seen (entered) and is-near (idle motion may run) */
        var seenIO = hasIO
          ? new IntersectionObserver(
              function (entries) {
                entries.forEach(function (e) {
                  if (e.isIntersecting) {
                    e.target.classList.add("is-seen");
                    seenIO.unobserve(e.target);
                  }
                });
              },
              { threshold: 0, rootMargin: "0px 0px -25% 0px" },
            )
          : null;
        var nearIO = hasIO
          ? new IntersectionObserver(
              function (entries) {
                entries.forEach(function (e) {
                  e.target.classList.toggle("is-near", e.isIntersecting);
                });
              },
              { threshold: 0, rootMargin: "240px 0px 240px 0px" },
            )
          : null;
        /* every section header ends with the same sprouting rule; it is built here
rather than repeated in the markup (each piece still gets its own id) */
        var SVG_NS = "http://www.w3.org/2000/svg";
        var buildSprouts = function () {
          var make = function (tag, attrs, parent) {
            var n = doc.createElementNS(SVG_NS, tag);
            Object.keys(attrs).forEach(function (k) {
              n.setAttribute(k, attrs[k]);
            });
            if (parent) {
              parent.appendChild(n);
            }
            return n;
          };
          $$(".sh").forEach(function (h) {
            var s = String(h.id || "").replace(/-sh$/, "");
            if (!s || $(s + "-sh-sp")) {
              return;
            }
            var svg = make("svg", {
              class: "sh-sprout rv",
              id: s + "-sh-sp",
              viewBox: "0 0 160 40",
              "aria-hidden": "true",
              style: "--d:.24s",
            });
            make(
              "path",
              { class: "sh-sp-ground", id: s + "-sh-sp-g", d: "M14 34 H146" },
              svg,
            );
            var plant = make(
              "g",
              { class: "sh-sp-plant", id: s + "-sh-sp-pl" },
              svg,
            );
            make(
              "path",
              {
                class: "sh-sp-stem",
                id: s + "-sh-sp-st",
                d: "M80 34 C80 27 79 22 81 15",
              },
              plant,
            );
            make(
              "path",
              {
                class: "sh-sp-leaf sh-sp-leaf-l",
                id: s + "-sh-sp-l",
                d: "M80.6 19 C75 19 70.5 16 69 10.5 C74.8 10.2 79 13.2 80.6 19 Z",
              },
              plant,
            );
            make(
              "path",
              {
                class: "sh-sp-leaf sh-sp-leaf-r",
                id: s + "-sh-sp-r",
                d: "M81 16.5 C85 12 90.5 10.6 95 12.4 C92 16.6 86.6 18 81 16.5 Z",
              },
              plant,
            );
            [
              [56, 37, 1.1],
              [104, 37.4, 1.3],
              [120, 36.6, 0.9],
            ].forEach(function (d, i) {
              make(
                "circle",
                {
                  class: "sh-sp-dot",
                  id: s + "-sh-sp-d" + (i + 1),
                  cx: d[0],
                  cy: d[1],
                  r: d[2],
                },
                svg,
              );
            });
            h.appendChild(svg);
          });
        };

        var watchRegions = function () {
          regions.forEach(function (r) {
            if (r === cover) {
              return;
            }
            if (seenIO && r !== hero) {
              seenIO.observe(r);
            } else if (r !== hero) {
              r.classList.add("is-seen");
            }
            if (nearIO) {
              nearIO.observe(r);
            } else {
              r.classList.add("is-near");
            }
            if (!hasIO && r !== hero) {
              r.classList.add("in-view");
            }
          });
          $$(".rv").forEach(observe);
          bottomRelease();
        };

        /* the hero waits for the cover: nothing about it plays behind the packet */
        var heroRevealed = false;
        var heroHooks = [];
        function revealHero() {
          if (!hero) hero = $("sec-hero");
          if (heroRevealed) {
            if (hero) {
              hero.classList.add("in-view");
              hero.classList.add("is-seen");
              hero.classList.add("markers-on");
            }
            return;
          }
          heroRevealed = true;
          if (hero) {
            hero.classList.add("in-view");
            hero.classList.add("is-seen");
          }
          heroHooks.forEach(function (f) {
            safe(f);
          });
        }

        /* SMOOTH JUMP (never a fragment link: the preview is an opaque iframe) */
        var jumpTo = function (el, offset) {
          if (!el) {
            return;
          }
          var y =
            el.getBoundingClientRect().top + win.pageYOffset - (offset || 0);
          try {
            win.scrollTo({
              top: Math.max(0, y),
              behavior: reduceMotion ? "auto" : "smooth",
            });
          } catch (err) {
            win.scrollTo(0, Math.max(0, y));
          }
        };

        /* a burst of petals / leaves from a point on screen (the fx canvas) */
        var Fx = (function () {
          var cv = $("fx");
          var none = {
            burst: function () {},
          };
          if (!cv || !cv.getContext || reduceMotion) {
            return none;
          }
          var ctx = cv.getContext("2d");
          var fl = Flurry(160);
          var W = 0;
          var H = 0;
          var ratio = 1;
          var running = false;
          var last = 0;
          var resize = function () {
            ratio = Math.min(win.devicePixelRatio || 1, 1.5);
            W = win.innerWidth;
            H = win.innerHeight;
            cv.width = Math.round(W * ratio);
            cv.height = Math.round(H * ratio);
          };
          resize();
          win.addEventListener("resize", resize);
          var frame = function (ts) {
            var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
            last = ts;
            fl.step(dt, 10, W, H);
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            ctx.clearRect(0, 0, W, H);
            fl.draw(ctx);
            if (fl.list.length) {
              raf(frame);
            } else {
              running = false;
              ctx.clearRect(0, 0, W, H);
            }
          };
          return {
            burst: function (x, y, n, kind) {
              for (var i = 0; i < n; i++) {
                var a = Math.random() * TAU;
                var sp = 60 + Math.random() * 180;
                var k = kind || (Math.random() < 0.8 ? "petal" : "spark");
                var p = fl.add(
                  x,
                  y,
                  k,
                  Math.cos(a) * sp,
                  Math.sin(a) * sp - 60,
                  1.2,
                );
                p.max = 3 + Math.random() * 2.5;
              }
              if (!running) {
                running = true;
                last = 0;
                raf(frame);
              }
            },
          };
        })();
        var burstAt = function (el, n, kind) {
          if (!el) {
            return;
          }
          var r = el.getBoundingClientRect();
          Fx.burst(r.left + r.width / 2, r.top + r.height / 2, n || 30, kind);
        };

        /* COVER â€” tear the seed packet, tip it, pour the two seeds into the hero */
        var nav = $("nav");
        var navReady = [];
        var showNav = function () {
          if (!nav) nav = $("nav");
          if (nav) {
            nav.classList.add("is-on");
          }
          navReady.forEach(function (f) {
            safe(f);
          });
          navReady = [];
        };
        var coverOpen = false;
        var seedTargets =
          null; /* the hero tells the cover where its seeds will land */

        var pourSeeds = function () {
          var packet = $("packet");
          var seeds = [$("cover-seed-a"), $("cover-seed-b")];
          if (!packet || !seeds[0] || !seeds[0].animate) {
            return;
          }
          var r = packet.getBoundingClientRect();
          var ox = r.left + r.width * 0.3;
          var oy = r.top + r.height * 0.07;
          var targets = seedTargets ? seedTargets() : null;
          seeds.forEach(function (s, i) {
            if (!s) {
              return;
            }
            var tx =
              targets && targets[i]
                ? targets[i].x
                : win.innerWidth * (0.47 + i * 0.06);
            var ty =
              targets && targets[i] ? targets[i].y : win.innerHeight * 0.8;
            var sx = ox + i * 14;
            var sy = oy + i * 4;
            var peakX = lerp(sx, tx, 0.28) - 20 + i * 26;
            var peakY = sy - 46 - i * 16;
            s.style.opacity = "1";
            s.animate(
              [
                {
                  transform:
                    "translate(" + sx + "px," + sy + "px) rotate(0deg)",
                  opacity: 0,
                },
                {
                  transform:
                    "translate(" +
                    lerp(sx, peakX, 0.6) +
                    "px," +
                    lerp(sy, peakY, 0.8) +
                    "px) rotate(" +
                    (80 + i * 40) +
                    "deg)",
                  opacity: 1,
                  offset: 0.12,
                },
                {
                  transform:
                    "translate(" +
                    peakX +
                    "px," +
                    peakY +
                    "px) rotate(" +
                    (140 + i * 60) +
                    "deg)",
                  opacity: 1,
                  offset: 0.26,
                },
                {
                  transform:
                    "translate(" +
                    lerp(peakX, tx, 0.55) +
                    "px," +
                    lerp(peakY, ty, 0.42) +
                    "px) rotate(" +
                    (300 + i * 80) +
                    "deg)",
                  opacity: 1,
                  offset: 0.62,
                },
                {
                  transform:
                    "translate(" +
                    tx +
                    "px," +
                    ty +
                    "px) rotate(" +
                    (400 + i * 90) +
                    "deg)",
                  opacity: 1,
                  offset: 0.9,
                },
                {
                  transform:
                    "translate(" +
                    tx +
                    "px," +
                    (ty - 6) +
                    "px) rotate(" +
                    (410 + i * 90) +
                    "deg)",
                  opacity: 1,
                  offset: 0.95,
                },
                {
                  transform:
                    "translate(" +
                    tx +
                    "px," +
                    ty +
                    "px) rotate(" +
                    (412 + i * 90) +
                    "deg)",
                  opacity: 1,
                },
              ],
              {
                duration: 1150 + i * 90,
                delay: i * 70,
                easing: "cubic-bezier(.45,.05,.55,.95)",
                fill: "forwards",
              },
            );
            later(sound.seed, 1040 + i * 160);
          });
        };

        var openCover = function () {
          if (coverOpen || !cover) {
            return;
          }
          coverOpen = true;
          sound.unlock();
          sound.startMusic();
          try {
            win.scrollTo(0, 0);
          } catch (err) {
            /* ignore */
          }
          var finish = function (e) {
            if (e && (e.target !== cover || e.propertyName !== "opacity")) {
              return;
            }
            if (cover.classList.contains("is-gone")) {
              cover.style.display = "none";
            }
            cover.removeEventListener("transitionend", finish);
          };
          if (reduceMotion) {
            cover.classList.add("is-gone");
            body.classList.remove("is-covered");
            revealHero();
            later(showNav, 300);
            cover.addEventListener("transitionend", finish);
            later(finish, 900);
            return;
          }
          cover.classList.add("is-opening");
          sound.tear();
          later(function () {
            cover.classList.add("is-pouring");
            sound.rustle();
          }, 420);
          later(pourSeeds, 700);
          later(function () {
            cover.classList.add("is-leaving");
          }, 1500);
          later(function () {
            cover.classList.add("is-gone");
            body.classList.remove("is-covered");
            later(revealHero, 240);
          }, 1780);
          later(showNav, 3100);
          cover.addEventListener("transitionend", finish);
          later(finish, 3600);
        };
        var skipCover = function () {
          coverOpen = true;
          body.classList.remove("is-covered");
          body.classList.add("is-open");
          if (!cover) cover = $("sec-cover");
          if (cover) {
            cover.classList.add("is-open", "is-gone");
            cover.style.display = "none";
          }
          if (!hero) hero = $("sec-hero");
          if (hero) {
            hero.classList.add("in-view", "is-seen", "markers-on");
          }
          revealHero();
          showNav();
        };
        var initCover = function () {
          var btn = $("cover-open");
          var tear = $("packet-tear");
          var packet = $("packet");
          var art = $("packet-art");
          if (packet && art) {
            var src = art.getAttribute("src") || "";
            var noArt = function () {
              packet.classList.add("no-art");
            };
            if (
              blank(src) ||
              src.indexOf("{{") >= 0 ||
              src.indexOf("%7B%7B") >= 0
            ) {
              noArt();
            } else {
              art.addEventListener("error", noArt);
              if (art.complete && art.naturalWidth === 0) {
                noArt();
              }
            }
          }
          /* long names shrink a little so the variety line keeps to two lines */
          var pn = $("packet-names");
          if (pn) {
            var len = (names.bride + names.groom).length;
            if (len > 16) {
              pn.style.fontSize =
                "clamp(22px, " +
                Math.max(6.2, 10.6 - (len - 16) * 0.28).toFixed(2) +
                "cqw, 40px)";
            }
          }
          if (!cover || !btn) {
            return;
          }
          if (cover.classList.contains("is-gone")) {
            skipCover();
            return;
          }
          btn.addEventListener("click", openCover);
          if (tear) {
            tear.addEventListener("click", openCover);
          }
        };

        /* HERO â€” the seeds land, sink, crack, root, braid and bloom */
        var treeSeed =
          (hashStr((names.bride || "a") + "|" + (names.groom || "b")) % 9973) +
          11;

        var initHero = function () {
          var canvas = $("hero-canvas");
          var soil = $("hero-soil");
          var markerA = $("hero-marker-a");
          var markerB = $("hero-marker-b");
          var hit = $("hero-tree-hit");
          var copy = $("hero-copy");
          if (!hero || !canvas) {
            return;
          }
          var tree = Braided(treeSeed, {
            depth: 6,
            braidH: 0.3,
            trunk: 0.12,
            limb: 1.6,
            spread: 0.72,
            up: 0.2,
            leafTip: 6,
            leafMid: 3,
            leafSize: 0.03,
            strandW: 0.034,
            colA: [98, 72, 54],
            colB: [140, 106, 78],
          });
          var petals = Flurry(40);
          var L = { W: 0, H: 0, ground: 0, x: 0, treeH: 0, seeds: [] };
          var roots = [];
          var T0 = -1;
          var gustV = 0;
          var lastCs = null;
          var petalClock = 0;
          var startPending = false;

          var makeRoots = function () {
            var r = rng(treeSeed * 3 + 1);
            roots = [];
            var depth = Math.max(60, (L.H - L.ground) * 0.72);
            L.seeds.forEach(function (sd, i) {
              var dir = i === 0 ? 1 : -1;
              /* main root: wanders down and crosses the other one twice */
              var pts = [];
              var n = 26;
              for (var k = 0; k <= n; k++) {
                var u = k / n;
                var x =
                  sd.x +
                  dir * Math.sin(u * Math.PI * 1.6) * (L.W < 600 ? 22 : 30) +
                  dir * u * 10;
                var y = sd.sy + u * depth;
                pts.push([x, y]);
              }
              roots.push({ pts: pts, w: 3.2, delay: 0 });
              /* side roots */
              for (var s = 0; s < 4; s++) {
                var at = 3 + Math.floor(r() * (n - 8));
                var p0 = pts[at];
                var side = r() < 0.5 ? -1 : 1;
                var len = 24 + r() * (L.W < 600 ? 36 : 60);
                var sp = [];
                for (var q = 0; q <= 10; q++) {
                  var v = q / 10;
                  sp.push([
                    p0[0] + side * v * len,
                    p0[1] +
                      v * len * (0.35 + r() * 0.2) +
                      Math.sin(v * 3 + s) * 3,
                  ]);
                }
                roots.push({ pts: sp, w: 1.7, delay: 0.15 + (at / n) * 0.5 });
              }
            });
            roots.forEach(function (rt) {
              var acc = 0;
              rt.len = [0];
              for (var i = 1; i < rt.pts.length; i++) {
                var dx = rt.pts[i][0] - rt.pts[i - 1][0];
                var dy = rt.pts[i][1] - rt.pts[i - 1][1];
                acc += Math.sqrt(dx * dx + dy * dy);
                rt.len.push(acc);
              }
              rt.total = acc;
            });
          };

          var layout = function (W, H) {
            L.W = W;
            L.H = H;
            var soilTop = soil ? soil.offsetTop : H * 0.77;
            L.ground = soilTop + 4;
            var wide = W >= 1024;
            L.x = wide ? W * 0.7 : W * 0.5;
            var copyBottom =
              copy && !wide ? copy.offsetTop + copy.offsetHeight : 0;
            /* the crown must stay under the date line on phones */
            var room = wide
              ? L.ground * 0.8
              : (L.ground - copyBottom - 16) * 0.97;
            L.treeH = clamp(
              Math.min(room, W * (wide ? 0.55 : 0.98)),
              190,
              wide ? 620 : 470,
            );
            var gap = W < 600 ? 15 : 19;
            L.seeds = [
              { x: L.x - gap, y: L.ground - 4, sy: L.ground + 22 },
              { x: L.x + gap, y: L.ground - 4, sy: L.ground + 22 },
            ];
            makeRoots();
            var off = W < 600 ? 108 : 150;
            if (markerA) {
              markerA.style.left = ((L.x - off) / W) * 100 + "%";
            }
            if (markerB) {
              markerB.style.left = ((L.x + off) / W) * 100 + "%";
            }
          };

          /* the cover asks where to pour its seeds (viewport coordinates) */
          seedTargets = function () {
            var r = canvas.getBoundingClientRect();
            return L.seeds.map(function (s) {
              return { x: r.left + s.x - 6.5, y: r.top + s.y - 12 };
            });
          };

          var drawRoots = function (ctx, gr) {
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            roots.forEach(function (rt) {
              var g = clamp((gr - rt.delay) / (1 - rt.delay), 0, 1);
              if (g <= 0) {
                return;
              }
              var upto = rt.total * easeOut(g);
              for (var i = 1; i < rt.pts.length; i++) {
                if (rt.len[i - 1] > upto) {
                  break;
                }
                var a = rt.pts[i - 1];
                var b = rt.pts[i];
                var f = 1;
                if (rt.len[i] > upto) {
                  f =
                    (upto - rt.len[i - 1]) /
                    Math.max(0.001, rt.len[i] - rt.len[i - 1]);
                }
                var u = rt.len[i] / rt.total;
                ctx.strokeStyle =
                  "rgba(226,200,156," + (0.88 - u * 0.35).toFixed(3) + ")";
                ctx.lineWidth = Math.max(0.6, rt.w * (1 - u * 0.75));
                ctx.beginPath();
                ctx.moveTo(a[0], a[1]);
                ctx.lineTo(lerp(a[0], b[0], f), lerp(a[1], b[1], f));
                ctx.stroke();
              }
            });
          };

          var drawSeed = function (ctx, s, sink, crack, spin) {
            var y = lerp(s.y, s.sy, easeInOut(sink));
            ctx.save();
            ctx.translate(s.x, y);
            ctx.rotate(spin * (1 - sink));
            var open = crack * 0.5;
            ctx.fillStyle = "#6e4a2e";
            /* two shell halves that part as the seed cracks */
            ctx.save();
            ctx.rotate(-open);
            ctx.beginPath();
            ctx.ellipse(-1.2, 0, 4.2, 8, 0, Math.PI * 0.5, Math.PI * 1.5);
            ctx.fill();
            ctx.restore();
            ctx.save();
            ctx.rotate(open);
            ctx.beginPath();
            ctx.ellipse(1.2, 0, 4.2, 8, 0, -Math.PI * 0.5, Math.PI * 0.5);
            ctx.fill();
            ctx.restore();
            if (crack > 0) {
              ctx.fillStyle = "rgba(214,232,170," + crack.toFixed(3) + ")";
              ctx.beginPath();
              ctx.ellipse(0, 0, 2.2 * crack + 0.5, 5.5, 0, 0, TAU);
              ctx.fill();
            }
            ctx.restore();
          };

          var paint = function (ctx, W, H, dt, time) {
            if (startPending) {
              startPending = false;
              if (T0 === -99) {
                T0 = time - 10;
              } else {
                T0 = time;
              }
            }
            if (T0 < 0 && (heroRevealed || (hero && (hero.classList.contains("in-view") || hero.classList.contains("is-seen"))))) {
              T0 = time - 10;
              if (hero) hero.classList.add("markers-on");
            }
            if (W !== L.W || H !== L.H) {
              layout(W, H);
            }
            ctx.clearRect(0, 0, W, H);
            var t = T0 < 0 ? 0 : time - T0;
            if (reduceMotion && heroRevealed) {
              t = 99;
            }
            var sink = clamp((t - 0.45) / 0.7, 0, 1);
            var crack = clamp((t - 1.1) / 0.5, 0, 1);
            var gr = clamp((t - 1.3) / 2.8, 0, 1);
            var g = easeInOut(clamp((t - 1.5) / 5, 0, 1));
            if (T0 < 0 && !reduceMotion) {
              return;
            }
            gustV = Math.max(0, gustV - dt * 0.9);
            drawRoots(ctx, gr);
            if (g < 0.2) {
              L.seeds.forEach(function (s, i) {
                ctx.globalAlpha = 1 - clamp((g - 0.1) / 0.1, 0, 1);
                drawSeed(ctx, s, sink, crack, (i ? 1 : -1) * 0.9);
              });
              ctx.globalAlpha = 1;
            }
            var pal = seasonMix(0, 4, clamp((t - 6) / 4, 0, 0.35));
            var cs = tree.draw(
              ctx,
              {
                x: L.x,
                y: L.ground + 3,
                H: L.treeH,
                g: g,
                time: time,
                sway: 1,
                gust: gustV,
              },
              pal,
            );
            if (cs) {
              lastCs = cs;
            }
            /* petals let go of the crown now and then */
            if (g > 0.9 && !reduceMotion) {
              petalClock -= dt;
              if (petalClock <= 0) {
                petalClock = 0.5 + Math.random() * 0.9;
                var at = Tree.leafAt(tree.crown, { H: L.treeH }, Math.random());
                if (at) {
                  petals.add(at.x, at.y, "petal", 6, 12);
                }
              }
            }
            petals.step(dt, 8 + gustV * 60, W, H, L.ground + 6);
            petals.draw(ctx);
          };

          var st = stage(canvas, paint, {
            watch: hero,
            onResize: function (W, H) {
              layout(W, H);
            },
          });
          var placeHit = function () {
            if (!hit || !lastCs) {
              return;
            }
            var b = Tree.bounds(tree.crown);
            if (!isFinite(b.x0)) {
              return;
            }
            hit.style.left = b.x0 + "px";
            hit.style.top = b.y0 + "px";
            hit.style.width = Math.max(60, b.x1 - b.x0) + "px";
            hit.style.height = Math.max(60, L.ground - b.y0) + "px";
          };
          heroHooks.push(function () {
            startPending = true;
            later(function () {
              hero.classList.add("markers-on");
            }, 700);
            later(placeHit, 7000);
            if (reduceMotion && st) {
              st.still();
              later(placeHit, 100);
            }
          });
          win.startTumbuhTree = function (instant) {
            if (!hero) hero = $("sec-hero");
            if (hero) {
              hero.classList.add("in-view", "is-seen", "markers-on");
            }
            startPending = true;
            if (instant) {
              T0 = -99;
            }
            if (st) {
              st.resize();
              st.start();
              later(placeHit, instant ? 50 : 7000);
            }
          };
          if (hit) {
            hit.addEventListener("click", function (e) {
              gustV = 1.2;
              sound.chime();
              Fx.burst(
                e.clientX || win.innerWidth / 2,
                e.clientY || win.innerHeight / 2,
                26,
              );
            });
          }
          onGust(function (p) {
            gustV = Math.max(gustV, 0.8 * p);
          });
          win.addEventListener("resize", function () {
            later(placeHit, 300);
          });
        };

        /* SALAM â€” the greeting is split into lontar strips, one or two
sentences each; tapping a strip lifts it like a leaf being turned */
        var initSalam = function () {
          var src = $("salam-intro");
          var holder = $("lontar-leaves");
          var opening = $("salam-opening");
          var quote = $("salam-quote");
          var qText = $("salam-quote-text");
          var qSrc = $("salam-quote-src");
          if (opening && blank(txt(opening))) {
            hide(opening);
          }
          if (quote && blank(txt(qText))) {
            hide(quote);
          } else if (qSrc && blank(txt(qSrc))) {
            hide(qSrc);
          }
          if (src && holder) {
            var text = (src.textContent || "").replace(/\s+/g, " ").trim();
            if (blank(text)) {
              hide(src);
            } else {
              /* sentences (a full stop followed by a capital, so "Swt., kami" or
"No. 5" stay whole), then pair very short ones so the strips stay balanced */
              var parts = text
                .replace(
                  /([.!?]+[”’)]*)\s+(?=[“‘(]?[A-Za-z\u00C0-\u00DE])/g,
                  "$1\u0001",
                )
                .split("\u0001");
              var strips = [];
              parts.forEach(function (p) {
                p = p.trim();
                if (!p) {
                  return;
                }
                var lastStrip = strips[strips.length - 1];
                if (
                  lastStrip &&
                  (lastStrip.length < 60 || p.length < 40) &&
                  lastStrip.length + p.length < 170
                ) {
                  strips[strips.length - 1] = lastStrip + " " + p;
                } else {
                  strips.push(p);
                }
              });
              if (strips.length > 1) {
                strips.forEach(function (s, i) {
                  var el = doc.createElement("p");
                  el.id = uid("lontar-leaf");
                  el.className = "lontar-leaf rv";
                  el.style.setProperty("--d", (i * 0.08).toFixed(2) + "s");
                  el.textContent = s;
                  holder.insertBefore(el, src);
                });
                src.parentNode.removeChild(src);
              }
            }
          }
          var leaves = $$(".lontar-leaf");
          leaves.forEach(function (lf) {
            lf.setAttribute("tabindex", "0");
            lf.setAttribute("role", "button");
            lf.setAttribute("aria-label", "Balik lembar lontar");
            var lift = function () {
              lf.classList.add("is-lifted");
              sound.rustle();
              later(function () {
                lf.classList.remove("is-lifted");
              }, 900);
            };
            lf.addEventListener("click", lift);
            lf.addEventListener("keydown", function (e) {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                lift();
              }
            });
          });
          var sign = $("lontar-sign");
          if (sign && !names.bride && !names.groom) {
            hide($("lontar-cover-bottom"));
          }
        };

        /* COUPLE â€” photos (or initials), roots that carry the parents' names,
and a watering can that makes each seedling bloom */
        var photoState = function (holder, img, url) {
          if (!holder) {
            return;
          }
          var empty = blank(url);
          holder.classList.toggle("no-photo", empty);
          if (img && !empty) {
            img.addEventListener("error", function () {
              holder.classList.add("no-photo");
            });
            if (
              img.complete &&
              img.naturalWidth === 0 &&
              img.getAttribute("src")
            ) {
              holder.classList.add("no-photo");
            }
          }
        };

        var initCouple = function () {
          ["bride", "groom"].forEach(function (who) {
            var card = $("cp-" + who);
            if (!card) {
              return;
            }
            var photo = $("cp-" + who + "-photo");
            var img = $("cp-" + who + "-img");
            photoState(
              photo,
              img,
              photo ? photo.getAttribute("data-photo") : "",
            );
            setText(
              $("cp-" + who + "-fb-i"),
              initial(
                who === "bride"
                  ? names.bride || names.brideFull
                  : names.groom || names.groomFull,
              ),
            );

            /* full name missing â†’ fall back to the nickname */
            var nm = $("cp-" + who + "-name");
            if (nm && blank(txt(nm))) {
              setText(nm, who === "bride" ? names.bride : names.groom);
            }
            var nick = $("cp-" + who + "-nick");
            var nickV = txt($("cp-" + who + "-nick-v"));
            if (nick && (blank(nickV) || nickV === txt(nm))) {
              hide(nick);
            }
            var grow = $("cp-" + who + "-grow");
            if (grow && blank(txt($("cp-" + who + "-grow-v")))) {
              hide(grow);
            }
            var town = txt($("cp-" + who + "-no-b"));
            if (blank(town)) {
              hide($("cp-" + who + "-no-b"));
            }

            /* the parents' names: "Bapak â€¦ & Ibu â€¦" becomes two lines */
            var par = $("cp-" + who + "-parents");
            if (par) {
              var pv = (par.textContent || "").trim();
              if (blank(pv)) {
                hide(par);
              } else {
                var bits = pv.split(/\s+&\s+|\s+dan\s+/i);
                if (bits.length === 2) {
                  par.textContent = "";
                  var a = doc.createElement("span");
                  a.id = uid("cp-parent");
                  a.textContent = bits[0];
                  var amp = doc.createElement("span");
                  amp.id = uid("cp-parent-amp");
                  amp.className = "cp-parent-amp";
                  amp.textContent = "&";
                  var b = doc.createElement("span");
                  b.id = uid("cp-parent");
                  b.textContent = bits[1];
                  par.appendChild(a);
                  par.appendChild(amp);
                  par.appendChild(b);
                }
              }
            }
            var order = $("cp-" + who + "-order");
            if (order && blank(txt(order))) {
              hide(order);
            }
            var soiltype = $("cp-" + who + "-soiltype");
            var soilV = txt($("cp-" + who + "-soil-v"));
            if (soiltype) {
              if (blank(town) && blank(soilV)) {
                hide(soiltype);
              } else if (blank(soilV)) {
                hide($("cp-" + who + "-soil-v"));
                hide($("cp-" + who + "-soil-sep"));
              } else if (blank(town)) {
                hide($("cp-" + who + "-town"));
                hide($("cp-" + who + "-soil-sep"));
              }
            }

            /* instagram */
            var ig = $("cp-" + who + "-ig");
            if (ig) {
              var handle = (ig.getAttribute("data-handle") || "").trim();
              if (blank(handle)) {
                hide(ig);
              } else {
                var h = handle
                  .replace(/^@+/, "")
                  .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
                  .replace(/\/.*$/, "");
                ig.setAttribute(
                  "href",
                  "https://instagram.com/" + encodeURIComponent(h),
                );
                setText($("cp-" + who + "-ig-t"), "@" + h);
              }
            }

            /* water the seedling: the can tips, drops fall, the bud blooms */
            var water = $("cp-" + who + "-water");
            var waterT = $("cp-" + who + "-water-t");
            var busy = false;
            if (water) {
              water.addEventListener("click", function () {
                if (busy) {
                  return;
                }
                busy = true;
                card.classList.remove("is-watering");
                void card.offsetWidth;
                card.classList.add("is-watering");
                sound.water();
                later(
                  function () {
                    card.classList.add("is-bloomed");
                    sound.bloom();
                    var bloom = $("cp-" + who + "-bloom");
                    burstAt(bloom, 14);
                    setText(waterT, "Sudah mekar â€” siram lagi?");
                  },
                  reduceMotion ? 50 : 1500,
                );
                later(
                  function () {
                    card.classList.remove("is-watering");
                    busy = false;
                  },
                  reduceMotion ? 100 : 2300,
                );
              });
            }
          });
        };

        /* INOSKULASI â€” a time slider: two trees grow season by season until two
of their branches meet (the first touch) and fuse into one crown */
        var initInos = function () {
          var canvas = $("inos-canvas");
          var stg = $("inos-stage");
          var range = $("inos-range");
          var play = $("inos-play");
          var playUse = $("inos-play-use");
          var chips = $$(".inos-chip");
          var caps = $$(".inos-cap");
          var kiss = $("inos-kiss");
          var seasonT = $("inos-season-t");
          var seasonUse = $("inos-season-use");
          var countN = $("inos-count-n");
          var sec = $("sec-inos");
          if (!canvas || !range || !stg) {
            return;
          }
          /* the first-touch caption needs a date; without one it still reads well */
          var metDate = $("inos-met-date");
          if (metDate && metDate.classList.contains("is-blank")) {
            setText(metDate, "Hari pertama kami bersentuhan");
          }
          if (blank(txt($("inos-cap-1-place")))) {
            hide($("inos-cap-1-place"));
          }
          var since = $("inos-since-n");
          if (since && since.classList.contains("is-blank")) {
            hide($("inos-since"));
          }
          if (blank(txt($("inos-cap-3-p")))) {
            setText($("inos-cap-3-p"), "Dua batang, satu tajuk.");
          }

          var mk = function (seed, bias, lean) {
            return Tree.build({
              seed: seed,
              depth: 5,
              trunk: 0.34,
              limb: 0.72,
              trunkW: 0.05,
              split0: 3,
              spread: 0.62,
              up: 0.2,
              bias: bias,
              lean: lean,
              leafTip: 5,
              leafMid: 3,
              leafSize: 0.034,
              dur: 0.24,
              tri: 0.25,
            });
          };
          var tA = mk(treeSeed + 5, 0.62, 0.07);
          var tB = mk(treeSeed + 9, -0.62, -0.07);
          var fl = Flurry(40);
          var v = clamp(+range.value / 1000, 0, 1);
          var vTarget = v;
          var playing = false;
          var playStop = 1;
          var dragging = false;
          var intro = false;
          var tipA = -1;
          var tipB = -1;
          var lastStage = -1;
          var touched = false;
          var fused = false;
          var W = 0;
          var H = 0;
          var gustV = 0;

          var pickTips = function () {
            var probe = function (T, x, dir) {
              Tree.pose(T, {
                x: x,
                y: H * 0.88,
                H: H * 0.5,
                g: 1,
                time: 0,
                sway: 0,
              });
              var best = -1;
              var bestV = -Infinity;
              for (var i = 0; i < T.B.length; i++) {
                var b = T.B[i];
                if (b.d < 3 || b.y1 > H * 0.62) {
                  continue;
                }
                var score = dir * b.x1 - Math.abs(b.y1 - H * 0.42) * 0.35;
                if (score > bestV) {
                  bestV = score;
                  best = i;
                }
              }
              return best;
            };
            tipA = probe(tA, W * 0.27, 1);
            tipB = probe(tB, W * 0.73, -1);
          };

          var stageOf = function (x) {
            return x < 0.3 ? 0 : x < 0.46 ? 1 : x < 0.88 ? 2 : 3;
          };
          var setStage = function (s) {
            if (s === lastStage) {
              return;
            }
            lastStage = s;
            caps.forEach(function (c) {
              c.classList.toggle("is-on", +c.getAttribute("data-stage") === s);
            });
            chips.forEach(function (c, i) {
              c.classList.toggle("is-on", i === s);
            });
          };

          var drawGround = function (ctx, pal) {
            var gy = H * 0.86;
            ctx.fillStyle = rgbStr(pal.ground[0]);
            ctx.beginPath();
            ctx.moveTo(0, gy + 6);
            ctx.bezierCurveTo(W * 0.3, gy - 10, W * 0.7, gy - 12, W, gy + 4);
            ctx.lineTo(W, H);
            ctx.lineTo(0, H);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = rgbStr(pal.ground[1]);
            ctx.beginPath();
            ctx.moveTo(0, gy + 22);
            ctx.bezierCurveTo(W * 0.35, gy + 10, W * 0.65, gy + 12, W, gy + 24);
            ctx.lineTo(W, H);
            ctx.lineTo(0, H);
            ctx.closePath();
            ctx.fill();
          };

          var paint = function (ctx, w, h, dt, time) {
            if (w !== W || h !== H || tipA < 0) {
              W = w;
              H = h;
              pickTips();
            }
            /* motion toward the target (chips, intro, play) */
            if (playing) {
              vTarget = Math.min(playStop, vTarget + dt / 9);
              if (vTarget >= playStop) {
                playing = false;
                if (playUse) {
                  playUse.setAttribute(
                    "href",
                    playStop >= 1 ? "#ic-replay" : "#ic-play",
                  );
                }
              }
            }
            if (!dragging) {
              v += (vTarget - v) * Math.min(1, dt * (playing ? 12 : 3.2));
              if (Math.abs(vTarget - v) < 0.0005) {
                v = vTarget;
              }
              range.value = String(Math.round(v * 1000));
            }
            range.style.setProperty("--p", (v * 100).toFixed(1) + "%");
            gustV = Math.max(0, gustV - dt);

            var sRaw = v * 11;
            var cyc = seasonCycle(sRaw);
            var pal = seasonMix(cyc.a, cyc.b, cyc.t);
            if (v > 0.9) {
              var main = cyc.t < 0.5 ? cyc.a : cyc.b;
              pal = seasonMix(main, 4, smooth((v - 0.9) / 0.1));
            }
            var mainS = v > 0.95 ? 4 : cyc.t < 0.5 ? cyc.a : cyc.b;
            setText(seasonT, SEASON_NAMES[mainS]);
            if (
              seasonUse &&
              seasonUse.getAttribute("href") !== "#sym-musim-" + mainS
            ) {
              seasonUse.setAttribute("href", "#sym-musim-" + mainS);
            }
            setText(countN, String(Math.floor(sRaw) + 1));
            setStage(stageOf(v));

            /* sky */
            var sky = ctx.createLinearGradient(0, 0, 0, H);
            sky.addColorStop(0, rgbStr(pal.sky[0]));
            sky.addColorStop(1, rgbStr(pal.sky[2]));
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle =
              "rgba(255,244,214," + (0.35 * pal.sun).toFixed(3) + ")";
            ctx.beginPath();
            ctx.arc(
              W * (0.15 + v * 0.7),
              H * (0.2 - Math.sin(v * Math.PI) * 0.06),
              H * 0.1,
              0,
              TAU,
            );
            ctx.fill();
            drawGround(ctx, pal);

            /* young trees are small but already leafy; they fill out as the seasons pass */
            var gv = smooth(v / 0.8);
            var g = lerp(0.56, 1, gv);
            var th = H * lerp(0.4, 0.5, gv);
            var stA = {
              x: W * 0.27,
              y: H * 0.88,
              H: th,
              g: g,
              time: time,
              sway: 0.8,
              gust: gustV,
            };
            var stB = {
              x: W * 0.73,
              y: H * 0.88,
              H: th,
              g: g,
              time: time + 3,
              sway: 0.8,
              gust: gustV,
            };
            Tree.pose(tA, stA);
            Tree.pose(tB, stB);
            Tree.drawBranches(ctx, tA, pal.bark);
            Tree.drawBranches(ctx, tB, pal.bark);

            /* the reaching twigs, then the graft */
            var reach = smooth((v - 0.16) / 0.2);
            var fuse = smooth((v - 0.44) / 0.44);
            if (tipA >= 0 && tipB >= 0 && reach > 0) {
              var a = tA.B[tipA];
              var b = tB.B[tipB];
              if (a.f > 0.6 && b.f > 0.6) {
                var mx = (a.x1 + b.x1) / 2;
                var my = Math.min(a.y1, b.y1) - th * 0.05;
                var ax = lerp(a.x1, mx, reach);
                var ay = lerp(a.y1, my, reach);
                var bx = lerp(b.x1, mx, reach);
                var by = lerp(b.y1, my, reach);
                ctx.strokeStyle = pal.bark;
                ctx.lineCap = "round";
                ctx.lineWidth = lerp(2, th * 0.03, fuse);
                ctx.beginPath();
                ctx.moveTo(a.x1, a.y1);
                ctx.quadraticCurveTo(
                  lerp(a.x1, ax, 0.5),
                  Math.min(a.y1, ay) - th * 0.03,
                  ax,
                  ay,
                );
                ctx.moveTo(b.x1, b.y1);
                ctx.quadraticCurveTo(
                  lerp(b.x1, bx, 0.5),
                  Math.min(b.y1, by) - th * 0.03,
                  bx,
                  by,
                );
                ctx.stroke();
                if (fuse > 0.05) {
                  ctx.fillStyle = pal.bark;
                  ctx.beginPath();
                  ctx.ellipse(
                    mx,
                    my,
                    th * 0.03 * fuse + 2,
                    th * 0.022 * fuse + 1.5,
                    0,
                    0,
                    TAU,
                  );
                  ctx.fill();
                }
                if (kiss) {
                  kiss.style.left = ((mx / W) * 100).toFixed(2) + "%";
                  kiss.style.top = ((my / H) * 100).toFixed(2) + "%";
                }
                var isTouch = reach > 0.985;
                if (isTouch && !touched) {
                  touched = true;
                  stg.classList.add("is-touch");
                  sound.chime();
                  var rc = canvas.getBoundingClientRect();
                  if (!dragging || true) {
                    Fx.burst(
                      rc.left + (mx / W) * rc.width,
                      rc.top + (my / H) * rc.height,
                      16,
                    );
                  }
                } else if (!isTouch && touched) {
                  touched = false;
                  stg.classList.remove("is-touch");
                }
                var isFused = fuse > 0.96;
                if (isFused && !fused) {
                  fused = true;
                  stg.classList.add("is-fused");
                  sound.bloom();
                } else if (!isFused && fused) {
                  fused = false;
                  stg.classList.remove("is-fused");
                }
                /* leaves grow over the graft once it holds */
                if (fuse > 0.3 && pal.dens > 0.05) {
                  ctx.fillStyle = pal.leaves[0];
                  ctx.beginPath();
                  for (var k = 0; k < 9; k++) {
                    var ang = (k / 9) * TAU + 0.3;
                    var rr = th * 0.05 * fuse;
                    var lx = mx + Math.cos(ang) * rr;
                    var ly = my + Math.sin(ang) * rr * 0.7 - th * 0.012;
                    var sz = th * 0.018 * fuse;
                    ctx.moveTo(lx + sz, ly);
                    ctx.ellipse(lx, ly, sz, sz * 0.55, ang, 0, TAU);
                  }
                  ctx.fill();
                }
              }
            }
            Tree.drawSnow(ctx, tA, pal.snow);
            Tree.drawSnow(ctx, tB, pal.snow);
            Tree.drawLeaves(ctx, tA, stA, pal);
            Tree.drawLeaves(ctx, tB, stB, pal);

            /* the season's air inside the frame */
            if (!reduceMotion && Math.random() < dt * 3) {
              var ks = fl.kindFor(mainS, Math.random());
              fl.add(
                Math.random() * W,
                ks === "mote" || ks === "fluff" ? H * 0.8 : -10,
                ks,
                null,
                null,
                0.9,
              );
            }
            fl.step(dt, 10 + gustV * 50, W, H, H * 0.9);
            fl.draw(ctx);
          };

          var st = stage(canvas, paint, { watch: stg });

          var stopIntro = function () {
            if (intro && playing && playStop < 1) {
              playing = false;
            }
            intro = false;
          };
          range.addEventListener("input", function () {
            stopIntro();
            playing = false;
            if (playUse) {
              playUse.setAttribute("href", "#ic-play");
            }
            vTarget = clamp(+range.value / 1000, 0, 1);
            v = vTarget;
            if (reduceMotion && st) {
              st.still();
            }
          });
          range.addEventListener("pointerdown", function () {
            dragging = true;
            stopIntro();
          });
          ["pointerup", "pointercancel", "change"].forEach(function (ev) {
            range.addEventListener(ev, function () {
              dragging = false;
              sound.tick();
            });
          });
          chips.forEach(function (c) {
            c.addEventListener("click", function () {
              stopIntro();
              playing = false;
              vTarget = clamp(+c.getAttribute("data-v") / 1000, 0, 1);
              sound.pop();
              if (reduceMotion) {
                v = vTarget;
                if (st) {
                  st.still();
                }
              }
            });
          });
          if (play) {
            play.addEventListener("click", function () {
              stopIntro();
              if (playing) {
                playing = false;
                if (playUse) {
                  playUse.setAttribute("href", "#ic-play");
                }
                return;
              }
              if (v >= 0.995) {
                v = 0;
                vTarget = 0;
              }
              playStop = 1;
              vTarget = v;
              playing = true;
              sound.pop();
              if (playUse) {
                playUse.setAttribute("href", "#ic-pause");
              }
              if (reduceMotion) {
                playing = false;
                v = vTarget = 1;
                if (st) {
                  st.still();
                }
              }
            });
          }
          onGust(function (p) {
            gustV = Math.max(gustV, p);
          });
          /* the first time the frame is seen, time runs up to the first touch */
          whenIn(stg, function () {
            if (reduceMotion) {
              v = vTarget = 0.4;
              if (st) {
                st.still();
              }
              return;
            }
            intro = true;
            later(function () {
              if (intro && v < 0.3 && !playing) {
                playStop = 0.4;
                vTarget = v;
                playing = true;
              }
            }, 700);
          });
          if (sec && reduceMotion && st) {
            later(st.still, 200);
          }
        };
        /* STORY â€” "Musim-Musim Kita": the sticky tree turns through the seasons
as each story card passes the middle of the screen */
        var initStory = function () {
          var sec = $("sec-story");
          var canvas = $("story-canvas");
          var dialHand = $("story-dial-hand");
          var dialT = $("story-dial-t");
          if (!sec) {
            return;
          }
          var cards = $$(".st-card", sec);
          var kept = [];
          cards.forEach(function (c) {
            var title = c.querySelector(".st-title");
            var text = c.querySelector(".st-text");
            if (blank(txt(title)) && blank(txt(text))) {
              hide(c);
              return;
            }
            if (blank(txt(title))) {
              hide(title);
            }
            var ph = c.querySelector(".st-photo");
            var img = c.querySelector(".photo-img");
            photoState(ph, img, ph ? ph.getAttribute("data-photo") : "");
            var date = c.querySelector(".st-date");
            if (date && blank(txt(date))) {
              date.textContent = "";
            }
            kept.push(c);
          });
          if (!kept.length) {
            hide(sec);
            var item = doc.querySelector('[data-nav-target="story"]');
            hide(item);
            return;
          }
          var endLine = $("st-end");
          var tree = Braided(treeSeed + 1, {
            depth: 6,
            braidH: 0.3,
            trunk: 0.12,
            limb: 1.6,
            spread: 0.72,
            up: 0.2,
            leafTip: 6,
            leafMid: 3,
            leafSize: 0.03,
            strandW: 0.034,
          });
          var fl = Flurry(70);
          var s = +(kept[0].getAttribute("data-season") || 0);
          var target = s;
          var gustV = 0;
          var clock = 0;
          var lastMain = -1;
          var inView = false;

          var targetFromScroll = function () {
            var line = win.innerHeight * 0.55;
            var t = +(kept[0].getAttribute("data-season") || 0);
            kept.forEach(function (c) {
              if (c.getBoundingClientRect().top < line) {
                t = +(c.getAttribute("data-season") || 0);
              }
            });
            if (endLine && endLine.getBoundingClientRect().top < line) {
              t = 4;
            }
            return t;
          };
          var paintDial = function (main) {
            if (main === lastMain) {
              return;
            }
            lastMain = main;
            if (dialHand) {
              dialHand.style.transform =
                "rotate(" + [45, 135, 225, 315, 405][main] + "deg)";
            }
            setText(dialT, SEASON_NAMES[main]);
          };

          var paint = function (ctx, W, H, dt, time) {
            s += (target - s) * Math.min(1, dt * 1.6);
            if (Math.abs(target - s) < 0.002) {
              s = target;
            }
            var sp = seasonSplit(s);
            if (inView) {
              seasonOverride = sp;
            }
            var pal = seasonMix(sp.a, sp.b, sp.t);
            var main = Math.round(s);
            paintDial(main);
            gustV = Math.max(0, gustV - dt);
            ctx.clearRect(0, 0, W, H);
            /* a soft glow of the season's sky around the tree (no hard canvas edges) */
            var sky = ctx.createRadialGradient(
              W * 0.5,
              H * 0.46,
              10,
              W * 0.5,
              H * 0.5,
              Math.max(W * 0.62, H * 0.58),
            );
            sky.addColorStop(0, rgbStr(pal.sky[0], 0.55));
            sky.addColorStop(0.6, rgbStr(pal.sky[1], 0.3));
            sky.addColorStop(1, rgbStr(pal.sky[2], 0));
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, W, H);
            /* the hill */
            var gy = H * 0.8;
            var cx = W * 0.5;
            ctx.fillStyle = rgbStr(pal.ground[1]);
            ctx.beginPath();
            ctx.ellipse(cx, gy + H * 0.34, W * 0.95, H * 0.36, 0, Math.PI, TAU);
            ctx.fill();
            ctx.fillStyle = rgbStr(pal.ground[0]);
            ctx.beginPath();
            ctx.ellipse(cx, gy + H * 0.3, W * 0.72, H * 0.3, 0, Math.PI, TAU);
            ctx.fill();
            if (pal.snow > 0.05) {
              ctx.fillStyle =
                "rgba(255,255,255," + (0.85 * pal.snow).toFixed(3) + ")";
              ctx.beginPath();
              ctx.ellipse(cx, gy + H * 0.3, W * 0.72, H * 0.3, 0, Math.PI, TAU);
              ctx.fill();
            }
            var th = Math.min(H * 0.64, W * (W < 700 ? 1.05 : 0.8));
            var cs = tree.draw(
              ctx,
              {
                x: cx,
                y: gy + 4,
                H: th,
                g: 1,
                time: time,
                sway: 0.9,
                gust: gustV,
              },
              pal,
            );
            /* the season's air: from the crown (petals, leaves) or the sky (snow) */
            if (!reduceMotion) {
              clock -= dt;
              if (clock <= 0) {
                clock = main === 2 ? 0.16 : main === 3 ? 0.07 : 0.3;
                var kind = fl.kindFor(main, Math.random());
                if (kind === "snow") {
                  fl.add(Math.random() * W, -10, "snow", null, null, 1.1);
                } else if (
                  kind === "mote" ||
                  kind === "fluff" ||
                  kind === "spark"
                ) {
                  fl.add(
                    Math.random() * W,
                    H * (0.4 + Math.random() * 0.5),
                    kind,
                    null,
                    -4,
                    1.1,
                  );
                } else if (cs) {
                  var at = Tree.leafAt(tree.crown, { H: th }, Math.random());
                  if (at) {
                    fl.add(at.x, at.y, kind, null, 10, 1.25);
                  }
                }
              }
              fl.step(dt, 14 + gustV * 60, W, H, gy + 10);
              fl.draw(ctx);
            }
          };

          var st = canvas ? stage(canvas, paint, { watch: sec }) : null;
          onScroll(function () {
            var r = sec.getBoundingClientRect();
            var vh = win.innerHeight;
            inView = r.top < vh * 0.5 && r.bottom > vh * 0.5;
            if (!inView) {
              if (seasonOverride) {
                seasonOverride = null;
              }
              return;
            }
            var t = targetFromScroll();
            if (t !== target) {
              target = t;
              if (reduceMotion) {
                s = target;
                if (st) {
                  st.still();
                }
              }
            }
            if (reduceMotion) {
              seasonOverride = seasonSplit(s);
              paintDial(Math.round(s));
            }
          });
          onGust(function (p) {
            gustV = Math.max(gustV, p);
          });
        };

        /* GALLERY â€” herbarium sheets built from the uploaded photos only */
        var galleryUrls = [
          "https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/prewedding/1790836795_908c34a7.jpg",
          "https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/prewedding/1790836796_80b969de.jpg",
          "https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/prewedding/1790836796_8d267664.jpg",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ].filter(function (u) {
          return u && u.trim() && !blank(u);
        });
        var PRESSED = ["sym-leaf", "sym-blossom", "sym-maple", "sym-leaf"];
        var PRESSED_C = ["#7c985c", "#e7a3b1", "#d58b2c", "#8db870"];
        var viewer = null;

        var initGallery = function () {
          var sec = $("sec-gallery");
          var grid = $("hb-grid");
          if (!sec || !grid) {
            return;
          }
          if (!galleryUrls.length) {
            hide(sec);
            hide(doc.querySelector('[data-nav-target="gallery"]'));
            return;
          }
          if (galleryUrls.length === 1) {
            grid.classList.add("is-single");
          } else if (galleryUrls.length <= 3) {
            grid.classList.add("is-few");
          }
          var r = rng(treeSeed + 77);
          galleryUrls.forEach(function (url, i) {
            var sheet = doc.createElement("button");
            sheet.type = "button";
            sheet.id = "hb-sheet-" + (i + 1);
            sheet.className = "hb-sheet rv rv-fall";
            sheet.setAttribute("aria-label", "Buka foto kenangan " + (i + 1));
            sheet.style.setProperty(
              "--r",
              ((r() - 0.5) * 4.4).toFixed(2) + "deg",
            );
            sheet.style.setProperty("--d", ((i % 4) * 0.07).toFixed(2) + "s");
            var mount = doc.createElement("span");
            mount.id = "hb-mount-" + (i + 1);
            mount.className = "hb-mount";
            var img = doc.createElement("img");
            img.id = "hb-img-" + (i + 1);
            img.className = "hb-img";
            img.src = url;
            img.loading = "lazy";
            img.alt = "Foto kenangan " + (i + 1);
            mount.appendChild(img);
            sheet.appendChild(mount);
            ["a", "b"].forEach(function (k) {
              var s = doc.createElement("span");
              s.id = "hb-strap-" + k + "-" + (i + 1);
              s.className = "hb-strap hb-strap-" + k;
              sheet.appendChild(s);
            });
            var leaf = doc.createElementNS(svgNS, "svg");
            leaf.setAttribute("id", "hb-leaf-" + (i + 1));
            leaf.setAttribute("class", "hb-leaf");
            leaf.setAttribute(
              "viewBox",
              i % 4 === 2
                ? "0 0 100 110"
                : i % 4 === 1
                  ? "0 0 40 40"
                  : "0 0 40 64",
            );
            leaf.setAttribute("aria-hidden", "true");
            var use = doc.createElementNS(svgNS, "use");
            use.setAttribute("id", "hb-leaf-use-" + (i + 1));
            use.setAttribute("href", "#" + PRESSED[i % 4]);
            use.setAttribute("fill", PRESSED_C[i % 4]);
            use.setAttribute("color", PRESSED_C[i % 4]);
            leaf.appendChild(use);
            sheet.appendChild(leaf);
            var label = doc.createElement("span");
            label.id = "hb-label-" + (i + 1);
            label.className = "hb-label";
            var no = doc.createElement("span");
            no.id = "hb-label-no-" + (i + 1);
            no.className = "hb-label-no";
            no.textContent = "No. " + pad(i + 1);
            var tt = doc.createElement("span");
            tt.id = "hb-label-t-" + (i + 1);
            tt.className = "hb-label-t";
            tt.textContent = "musim " + SEASON_SHORT[i % 4].toLowerCase();
            label.appendChild(no);
            label.appendChild(tt);
            sheet.appendChild(label);
            sheet.addEventListener("click", function () {
              if (viewer) {
                viewer.open(i, sheet);
              }
            });
            img.addEventListener("error", function () {
              sheet.style.display = "none";
            });
            grid.appendChild(sheet);
          });
        };

        /* the viewer: bottom control bar, arrows, swipe, Escape; the page never moves */
        var initViewer = function () {
          var el = $("viewer");
          var img = $("viewer-img");
          var cap = $("viewer-cap");
          var count = $("viewer-count");
          var prev = $("viewer-prev");
          var next = $("viewer-next");
          var close = $("viewer-close");
          var bg = $("viewer-bg");
          if (!el || !img || !galleryUrls.length) {
            return;
          }
          var idx = 0;
          var isOpen = false;
          var lastFocus = null;
          var closeT = 0;
          var show = function (i, animate) {
            idx = (i + galleryUrls.length) % galleryUrls.length;
            var set = function () {
              img.src = galleryUrls[idx];
              img.alt = "Foto kenangan " + (idx + 1);
              setText(
                cap,
                "Spesimen No. " + pad(idx + 1) + " Â· " + SEASON_NAMES[idx % 4],
              );
              setText(count, idx + 1 + " / " + galleryUrls.length);
            };
            if (animate && !reduceMotion) {
              img.classList.add("is-swapping");
              later(function () {
                set();
                img.classList.remove("is-swapping");
              }, 180);
            } else {
              set();
            }
          };
          var open = function (i, from) {
            win.clearTimeout(closeT);
            lastFocus = from || doc.activeElement;
            show(i, false);
            el.classList.toggle("is-single", galleryUrls.length <= 1);
            el.setAttribute("aria-hidden", "false");
            body.classList.add("is-locked");
            el.classList.add("is-open");
            isOpen = true;
            sound.rustle();
            later(function () {
              if (close) {
                close.focus({ preventScroll: true });
              }
            }, 60);
          };
          var shut = function () {
            if (!isOpen) {
              return;
            }
            isOpen = false;
            el.classList.remove("is-open");
            el.setAttribute("aria-hidden", "true");
            closeT = later(
              function () {
                body.classList.remove("is-locked");
              },
              reduceMotion ? 10 : 420,
            );
            if (lastFocus && lastFocus.focus) {
              try {
                lastFocus.focus({ preventScroll: true });
              } catch (err) {
                /* ignore */
              }
            }
          };
          viewer = { open: open, close: shut };
          if (prev) {
            prev.addEventListener("click", function () {
              show(idx - 1, true);
              sound.tick();
            });
          }
          if (next) {
            next.addEventListener("click", function () {
              show(idx + 1, true);
              sound.tick();
            });
          }
          if (close) {
            close.addEventListener("click", shut);
          }
          if (bg) {
            bg.addEventListener("click", shut);
          }
          doc.addEventListener("keydown", function (e) {
            if (!isOpen) {
              return;
            }
            if (e.key === "Escape") {
              shut();
            } else if (e.key === "ArrowLeft") {
              show(idx - 1, true);
            } else if (e.key === "ArrowRight") {
              show(idx + 1, true);
            }
          });
          var sx = 0;
          var sy = 0;
          el.addEventListener(
            "touchstart",
            function (e) {
              var t = e.touches[0];
              sx = t.clientX;
              sy = t.clientY;
            },
            { passive: true },
          );
          el.addEventListener(
            "touchend",
            function (e) {
              var t = e.changedTouches[0];
              var dx = t.clientX - sx;
              var dy = t.clientY - sy;
              if (
                Math.abs(dx) > 50 &&
                Math.abs(dx) > Math.abs(dy) * 1.2 &&
                galleryUrls.length > 1
              ) {
                show(idx + (dx < 0 ? 1 : -1), true);
              }
            },
            { passive: true },
          );
        };

        /* GUGUR â€” let a leaf fall: it flutters to the ground, a bud appears at
its base, and the ledger strikes out what was let go and sprouts what
grew in its place */
        var makeMaple = function (idp, cls, color) {
          var wrap = doc.createElement("span");
          wrap.id = uid(idp);
          wrap.className = cls;
          wrap.style.color = color;
          var svg = doc.createElementNS(svgNS, "svg");
          svg.setAttribute("id", uid(idp + "-svg"));
          svg.setAttribute("viewBox", "0 0 100 110");
          svg.setAttribute("aria-hidden", "true");
          var use = doc.createElementNS(svgNS, "use");
          use.setAttribute("id", uid(idp + "-use"));
          use.setAttribute("href", "#sym-maple");
          svg.appendChild(use);
          wrap.appendChild(svg);
          return wrap;
        };

        var initGugur = function () {
          var sec = $("sec-gugur");
          var pile = $("gg-pile");
          var live = $("gg-live");
          var shake = $("gg-shake");
          var reset = $("gg-reset");
          var countN = $("gg-count-n");
          var countOf = $("gg-count-of");
          if (!sec) {
            return;
          }
          var ROMAN = ["", "I", "II", "III", "IV", "V", "VI"];
          var active = [];
          $$(".gg-row", sec).forEach(function (row) {
            var i = row.getAttribute("data-i");
            var lepasEl = $("gg-row-" + i + "-at");
            var tumbuhEl = $("gg-row-" + i + "-c");
            var leaf = $("gg-leaf-" + i);
            if (blank(txt(lepasEl))) {
              hide(row);
              hide(leaf);
              return;
            }
            if (blank(txt(tumbuhEl))) {
              setText(tumbuhEl, "ruang untuk sesuatu yang baru");
            }
            if (leaf) {
              leaf.setAttribute(
                "aria-label",
                "Gugurkan daun " + ROMAN[+i] + ": " + txt(lepasEl),
              );
            }
            active.push(i);
          });
          if (!active.length) {
            hide(sec);
            hide(doc.querySelector('[data-nav-target="gugur"]'));
            return;
          }
          setText(countOf, String(active.length));
          var fallen = {};
          var fallCount = 0;
          var liveT = 0;
          var queue = [];

          var addPileLeaf = function (color, x, y, rot) {
            if (!pile) {
              return;
            }
            var pl = makeMaple("gg-pile-leaf", "gg-pile-leaf", color);
            pl.style.left = x + "px";
            pl.style.top = y + "px";
            pl.style.transform = "rotate(" + rot.toFixed(1) + "deg)";
            pl.setAttribute("data-rot", rot.toFixed(1));
            pile.appendChild(pl);
          };
          var say = function (html) {
            if (!live) {
              return;
            }
            live.textContent = "";
            html.forEach(function (part) {
              if (part.strong) {
                var s = doc.createElement("strong");
                s.id = uid("gg-live-s");
                s.textContent = part.strong;
                live.appendChild(s);
              } else {
                live.appendChild(doc.createTextNode(part));
              }
            });
            live.classList.add("is-on");
            win.clearTimeout(liveT);
            liveT = later(function () {
              live.classList.remove("is-on");
            }, 3200);
          };
          var updateCount = function () {
            setText(countN, String(fallCount));
            if (fallCount >= active.length) {
              sec.classList.add("is-bare");
              if (reset) {
                reset.hidden = false;
              }
              if (shake) {
                shake.hidden = true;
              }
              later(function () {
                sound.chime();
              }, 900);
            }
          };

          var fall = function (i, quick) {
            if (fallen[i]) {
              return;
            }
            fallen[i] = true;
            fallCount += 1;
            var leaf = $("gg-leaf-" + i);
            var row = $("gg-row-" + i);
            var bud = $("gg-bud-" + i);
            var tumbuh = txt($("gg-row-" + i + "-c"));
            var color = leaf
              ? leaf.style.getPropertyValue("--c").trim() || "#d58b2c"
              : "#d58b2c";
            var rot0 = leaf
              ? parseFloat(leaf.style.getPropertyValue("--rot")) || 0
              : 0;
            if (leaf && pile) {
              var r = leaf.getBoundingClientRect();
              var pr = pile.getBoundingClientRect();
              var tx = pr.left + pr.width * (0.12 + Math.random() * 0.76);
              var ty = pr.top + pr.height * (0.25 + Math.random() * 0.5);
              var endRot = rot0 + 140 + Math.random() * 120;
              if (!reduceMotion && leaf.animate) {
                var fly = makeMaple("gg-fly", "gg-fly", color);
                fly.style.transformOrigin = "50% 50%";
                body.appendChild(fly);
                var frames = [];
                var steps = 10;
                var sx = r.left;
                var sy = r.top;
                var ex = tx - 28;
                var ey = ty - 31;
                for (var k = 0; k <= steps; k++) {
                  var u = k / steps;
                  var x =
                    lerp(sx, ex, u) + Math.sin(u * Math.PI * 3) * 34 * (1 - u);
                  var y = lerp(sy, ey, u * u * (0.6 + 0.4 * u));
                  var rot =
                    lerp(rot0, endRot, u) +
                    Math.sin(u * Math.PI * 4) * 30 * (1 - u);
                  frames.push({
                    transform:
                      "translate(" +
                      x.toFixed(1) +
                      "px," +
                      y.toFixed(1) +
                      "px) rotate(" +
                      rot.toFixed(1) +
                      "deg) scale(" +
                      lerp(1, 0.62, u * u).toFixed(3) +
                      ")",
                    offset: u,
                  });
                }
                var anim = fly.animate(frames, {
                  duration: quick ? 1100 : 1700,
                  easing: "linear",
                  fill: "forwards",
                });
                var done = false;
                var land = function () {
                  if (done) {
                    return;
                  }
                  done = true;
                  if (fly.parentNode) {
                    fly.parentNode.removeChild(fly);
                  }
                  var pr2 = pile.getBoundingClientRect();
                  addPileLeaf(color, tx - pr2.left, ty - pr2.top, endRot);
                };
                anim.onfinish = land;
                later(land, (quick ? 1100 : 1700) + 400);
              } else {
                addPileLeaf(color, tx - pr.left, ty - pr.top, endRot);
              }
              leaf.classList.add("is-fallen");
            }
            sound.leaf();
            later(
              function () {
                if (bud) {
                  bud.classList.add("is-on");
                }
              },
              quick ? 200 : 700,
            );
            later(
              function () {
                if (row) {
                  row.classList.add("is-fallen");
                }
                sound.sprout();
                updateCount();
              },
              quick ? 300 : 1000,
            );
            say([
              "Daun " + ROMAN[+i] + " gugur. Yang tumbuh: ",
              { strong: tumbuh },
            ]);
          };

          active.forEach(function (i) {
            var leaf = $("gg-leaf-" + i);
            if (leaf) {
              leaf.addEventListener("click", function () {
                fall(i, false);
              });
            }
          });
          if (shake) {
            shake.addEventListener("click", function () {
              sec.classList.remove("is-shaking");
              void sec.offsetWidth;
              sec.classList.add("is-shaking");
              sound.rustle();
              gust(1);
              queue = active.filter(function (i) {
                return !fallen[i];
              });
              queue.forEach(function (i, k) {
                later(
                  function () {
                    fall(i, true);
                  },
                  260 + k * 380,
                );
              });
              later(function () {
                sec.classList.remove("is-shaking");
              }, 1700);
            });
          }
          if (reset) {
            reset.addEventListener("click", function () {
              fallen = {};
              fallCount = 0;
              sec.classList.remove("is-bare");
              active.forEach(function (i) {
                var leaf = $("gg-leaf-" + i);
                if (leaf) {
                  leaf.classList.remove("is-fallen");
                  if (leaf.animate && !reduceMotion) {
                    leaf.animate(
                      [
                        {
                          transform:
                            "rotate(" +
                            leaf.style.getPropertyValue("--rot") +
                            ") scale(0)",
                        },
                        {
                          transform:
                            "rotate(" +
                            leaf.style.getPropertyValue("--rot") +
                            ") scale(1)",
                        },
                      ],
                      {
                        duration: 700,
                        easing: "cubic-bezier(.34,1.5,.64,1)",
                        delay: +i * 70,
                      },
                    );
                  }
                }
                var bud = $("gg-bud-" + i);
                if (bud) {
                  bud.classList.remove("is-on");
                }
                var row = $("gg-row-" + i);
                if (row) {
                  row.classList.remove("is-fallen");
                }
              });
              if (pile) {
                pile.textContent = "";
              }
              reset.hidden = true;
              if (shake) {
                shake.hidden = false;
              }
              updateCount();
              sound.sprout();
            });
          }
          /* kick the pile */
          if (pile) {
            pile.addEventListener("click", function () {
              var kids = $$(".gg-pile-leaf", pile);
              if (!kids.length) {
                return;
              }
              sound.rustle();
              kids.forEach(function (k) {
                var rot = parseFloat(k.getAttribute("data-rot")) || 0;
                var nr = rot + (Math.random() - 0.5) * 160;
                var dx = (Math.random() - 0.5) * 60;
                k.setAttribute("data-rot", nr.toFixed(1));
                if (k.animate && !reduceMotion) {
                  k.animate(
                    [
                      { transform: "rotate(" + rot + "deg)" },
                      {
                        transform:
                          "translate(" +
                          dx * 0.6 +
                          "px,-40px) rotate(" +
                          (rot + nr) / 2 +
                          "deg)",
                      },
                      {
                        transform:
                          "translate(" + dx + "px,0) rotate(" + nr + "deg)",
                      },
                    ],
                    { duration: 800, easing: "ease-out", fill: "forwards" },
                  );
                }
              });
            });
          }
        };

        /* LINGKARAN TAHUN â€” a procedural wood slice: one growth ring for every
year since the couple met; the outermost ring is the wedding year */
        var initLingkaran = function () {
          var sec = $("sec-lingkaran");
          var sliceCv = $("lk-slice");
          var hlCv = $("lk-hl");
          var stg = $("lk-stage");
          var card = $("lk-card");
          var cardNo = $("lk-card-no");
          var cardOf = $("lk-card-of");
          var cardYear = $("lk-card-year");
          var cardText = $("lk-card-text");
          var widthFill = $("lk-card-width-fill");
          var yearsEl = $("lk-years");
          if (!sec || !sliceCv || !hlCv || !stg) {
            return;
          }
          var metP = parseDate(
            ($("lk-met") || {}).getAttribute
              ? $("lk-met").getAttribute("data-date")
              : "",
          );
          var wedP =
            parseDate(
              ($("lk-wed") || {}).getAttribute
                ? $("lk-wed").getAttribute("data-date")
                : "",
            ) || weddingP;
          var thisYear = new Date().getFullYear();
          var y1 = wedP ? wedP.y : thisYear;
          var y0 = metP ? metP.y : y1 - 6;
          if (y0 > y1) {
            y0 = y1;
          }
          var N = clamp(y1 - y0 + 1, 2, 40);
          y0 = y1 - N + 1;
          var notes = {};
          $$("#lk-notes [data-year]").forEach(function (el) {
            var y = parseInt(el.getAttribute("data-year"), 10);
            var t = txt(el);
            if (y && !blank(t)) {
              notes[y] = t;
            }
          });
          var GENERIC = [
            "Satu tahun lagi, satu lingkaran lagi.",
            "Tahun yang tumbuh pelan â€” tapi tetap tumbuh.",
            "Lingkaran yang tenang. Kadang itu yang paling kami butuhkan.",
            "Hujan cukup, matahari cukup, dan kami merasa cukup.",
            "Tahun untuk memperdalam akar, bukan meninggikan dahan.",
          ];
          var r = rng(treeSeed + 31);
          var widths = [];
          var i;
          for (i = 0; i < N; i++) {
            var y = y0 + i;
            var w = 0.6 + r() * 0.8;
            var n = (notes[y] || "").toLowerCase();
            if (/tipis|sempit|kering|sulit|jauh/.test(n)) {
              w = 0.42 + r() * 0.12;
            } else if (/lebar|tebal|subur|hujan/.test(n)) {
              w = 1.4 + r() * 0.25;
            }
            widths.push(w);
          }
          widths[0] = Math.max(widths[0], 0.9);
          var total = widths.reduce(function (a, b) {
            return a + b;
          }, 0);
          var frac = [0];
          var acc = 0;
          for (i = 0; i < N; i++) {
            acc += widths[i];
            frac.push(acc / total);
          }
          var maxW = Math.max.apply(null, widths);
          /* each boundary wobbles a little, and grows around a center that
drifts from the off-center pith to the middle of the trunk */
          var harm = [];
          for (i = 0; i <= N; i++) {
            harm.push([
              [2, 0.012 + r() * 0.012, r() * TAU],
              [3, 0.008 + r() * 0.01, r() * TAU],
              [5, 0.004 + r() * 0.006, r() * TAU],
              [9, 0.002 + r() * 0.003, r() * TAU],
            ]);
          }
          var pithA = r() * TAU;
          var ecc = 0.07 + r() * 0.05;
          var eccA = r() * TAU;
          var G = { W: 0, cx: 0, cy: 0, R: 0, Ro: 0, px: 0, py: 0 };
          var ringCenter = function (j) {
            var f = frac[j];
            return [
              lerp(G.px, G.cx, Math.pow(f, 0.8)),
              lerp(G.py, G.cy, Math.pow(f, 0.8)),
            ];
          };
          var ringRad = function (j, th) {
            var f = frac[j];
            var h = harm[j];
            var wob = 1;
            for (var k = 0; k < h.length; k++) {
              wob +=
                h[k][1] * Math.sin(h[k][0] * th + h[k][2]) * Math.min(1, f * 3);
            }
            return (
              f * G.R * wob * (1 + ecc * Math.cos(th - eccA) * f * (1 - f) * 2)
            );
          };
          var tracePath = function (ctx, j, scale) {
            var c = ringCenter(j);
            var steps = 150;
            ctx.moveTo(c[0] + ringRad(j, 0) * (scale || 1), c[1]);
            for (var k = 1; k <= steps; k++) {
              var th = (k / steps) * TAU;
              var rr = ringRad(j, th) * (scale || 1);
              ctx.lineTo(c[0] + Math.cos(th) * rr, c[1] + Math.sin(th) * rr);
            }
            ctx.closePath();
          };
          var tracePart = function (ctx, j, blend) {
            /* a boundary shape between ring j-1 and j (blend 0..1) */
            var c0 = ringCenter(j - 1);
            var c1 = ringCenter(j);
            var cx = lerp(c0[0], c1[0], blend);
            var cy = lerp(c0[1], c1[1], blend);
            var steps = 150;
            for (var k = 0; k <= steps; k++) {
              var th = (k / steps) * TAU;
              var rr = lerp(ringRad(j - 1, th), ringRad(j, th), blend);
              var x = cx + Math.cos(th) * rr;
              var yy = cy + Math.sin(th) * rr;
              if (k === 0) {
                ctx.moveTo(x, yy);
              } else {
                ctx.lineTo(x, yy);
              }
            }
            ctx.closePath();
          };

          var ratio = 1;
          var drawSlice = function () {
            ratio = dprCap();
            var W = Math.max(10, stg.offsetWidth);
            G.W = W;
            G.cx = W / 2;
            G.cy = W / 2;
            G.Ro = W * 0.47;
            G.R = G.Ro - W * 0.042;
            G.px = G.cx + Math.cos(pithA) * G.R * 0.06;
            G.py = G.cy + Math.sin(pithA) * G.R * 0.05;
            [sliceCv, hlCv].forEach(function (cv) {
              cv.width = Math.round(W * ratio);
              cv.height = Math.round(W * ratio);
            });
            var ctx = sliceCv.getContext("2d");
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            ctx.clearRect(0, 0, W, W);
            var rr = rng(treeSeed + 5);
            /* bark */
            ctx.fillStyle = "#4e3726";
            ctx.beginPath();
            for (var k = 0; k <= 180; k++) {
              var th = (k / 180) * TAU;
              var ro =
                G.Ro *
                (1 +
                  Math.sin(th * 7 + 1) * 0.008 +
                  Math.sin(th * 23) * 0.006 +
                  (rr() - 0.5) * 0.012);
              var x = G.cx + Math.cos(th) * ro;
              var y = G.cy + Math.sin(th) * ro;
              if (k === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "rgba(20,12,6,0.45)";
            ctx.lineWidth = 1.2;
            for (k = 0; k < 90; k++) {
              var a = rr() * TAU;
              var r1 = G.R + (G.Ro - G.R) * 0.2;
              var r2 = G.Ro * (0.99 + rr() * 0.02);
              ctx.beginPath();
              ctx.moveTo(G.cx + Math.cos(a) * r1, G.cy + Math.sin(a) * r1);
              ctx.lineTo(
                G.cx + Math.cos(a + 0.02) * r2,
                G.cy + Math.sin(a + 0.02) * r2,
              );
              ctx.stroke();
            }
            /* the cambium: a thin pale band under the bark */
            ctx.fillStyle = "#c79a66";
            ctx.beginPath();
            tracePath(ctx, N, 1.035);
            ctx.fill();
            /* rings from the outside in: latewood disc, then the earlywood inside it */
            for (var j = N; j >= 1; j--) {
              var f = frac[j];
              var heart = 1 - f;
              var late = mixRGB([168, 116, 70], [128, 82, 46], heart * 0.8);
              var early = mixRGB([240, 212, 168], [220, 172, 122], heart * 0.9);
              if (j === N) {
                late = [176, 128, 60];
              }
              ctx.fillStyle = rgbStr(late);
              ctx.beginPath();
              tracePath(ctx, j, 1);
              ctx.fill();
              ctx.fillStyle = rgbStr(early);
              ctx.beginPath();
              tracePart(ctx, j, 0.8 - (widths[j - 1] < 0.6 ? 0.12 : 0));
              ctx.fill();
              /* earlywood fades into latewood */
              ctx.fillStyle = rgbStr(mixRGB(early, late, 0.45), 0.55);
              ctx.beginPath();
              tracePart(ctx, j, 0.9);
              tracePart(ctx, j, 0.8);
              ctx.fill("evenodd");
            }
            /* pith */
            ctx.fillStyle = "#6e4a2c";
            ctx.beginPath();
            ctx.arc(G.px, G.py, G.R * 0.02, 0, TAU);
            ctx.fill();
            /* medullary rays */
            ctx.strokeStyle = "rgba(120,80,40,0.08)";
            ctx.lineWidth = 0.8;
            for (k = 0; k < 64; k++) {
              var ra = rr() * TAU;
              var rs = G.R * (0.05 + rr() * 0.4);
              var re = G.R * (0.55 + rr() * 0.44);
              ctx.beginPath();
              ctx.moveTo(G.px + Math.cos(ra) * rs, G.py + Math.sin(ra) * rs);
              ctx.lineTo(G.cx + Math.cos(ra) * re, G.cy + Math.sin(ra) * re);
              ctx.stroke();
            }
            /* fine grain and saw marks */
            for (k = 0; k < 2200; k++) {
              var ga = rr() * TAU;
              var gr = Math.sqrt(rr()) * G.R;
              ctx.fillStyle =
                rr() < 0.5 ? "rgba(90,58,30,0.07)" : "rgba(255,240,210,0.08)";
              ctx.fillRect(
                G.cx + Math.cos(ga) * gr,
                G.cy + Math.sin(ga) * gr,
                1.2,
                1.2,
              );
            }
            ctx.save();
            ctx.beginPath();
            tracePath(ctx, N, 1);
            ctx.clip();
            ctx.strokeStyle = "rgba(255,245,225,0.06)";
            ctx.lineWidth = 2;
            for (k = -12; k < 12; k++) {
              ctx.beginPath();
              ctx.arc(G.cx - W * 1.6, G.cy + k * W * 0.05, W * 1.8, -0.5, 0.5);
              ctx.stroke();
            }
            ctx.restore();
            /* two checks (drying cracks) from the edge */
            ctx.fillStyle = "rgba(40,24,12,0.78)";
            [pithA + 2.2, pithA + 4.1].forEach(function (ca, ci) {
              var depth = G.R * (0.32 + ci * 0.14);
              ctx.beginPath();
              ctx.moveTo(
                G.cx + Math.cos(ca - 0.022) * G.R * 1.01,
                G.cy + Math.sin(ca - 0.022) * G.R * 1.01,
              );
              var steps = 8;
              for (var q = 1; q <= steps; q++) {
                var u = q / steps;
                var rad = G.R * 1.01 - depth * u;
                var jit = (rr() - 0.5) * 0.012;
                ctx.lineTo(
                  G.cx + Math.cos(ca - 0.022 * (1 - u) + jit) * rad,
                  G.cy + Math.sin(ca - 0.022 * (1 - u) + jit) * rad,
                );
              }
              for (q = steps; q >= 0; q--) {
                var u2 = q / steps;
                var rad2 = G.R * 1.01 - depth * u2;
                ctx.lineTo(
                  G.cx + Math.cos(ca + 0.018 * (1 - u2)) * rad2,
                  G.cy + Math.sin(ca + 0.018 * (1 - u2)) * rad2,
                );
              }
              ctx.closePath();
              ctx.fill();
            });
            /* a soft light across the face */
            var light = ctx.createRadialGradient(
              G.cx - W * 0.18,
              G.cy - W * 0.2,
              W * 0.05,
              G.cx,
              G.cy,
              G.Ro,
            );
            light.addColorStop(0, "rgba(255,248,230,0.22)");
            light.addColorStop(1, "rgba(40,20,5,0.12)");
            ctx.fillStyle = light;
            ctx.beginPath();
            ctx.arc(G.cx, G.cy, G.Ro, 0, TAU);
            ctx.fill();
          };

          var sel = -1;
          var drawHL = function (t) {
            var ctx = hlCv.getContext("2d");
            var W = G.W;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            ctx.clearRect(0, 0, W, W);
            /* the wedding ring always keeps a faint gold line */
            ctx.save();
            ctx.strokeStyle =
              "rgba(241,211,138," +
              (0.35 + 0.25 * Math.sin(t * 1.4)).toFixed(3) +
              ")";
            ctx.lineWidth = 2;
            ctx.beginPath();
            tracePath(ctx, N, 1);
            ctx.stroke();
            ctx.restore();
            if (sel < 1) {
              return;
            }
            ctx.fillStyle =
              sel === N ? "rgba(255,226,150,0.42)" : "rgba(255,244,214,0.4)";
            ctx.beginPath();
            tracePath(ctx, sel, 1);
            tracePath(ctx, sel - 1, 1);
            ctx.fill("evenodd");
            ctx.strokeStyle =
              sel === N ? "rgba(241,200,110,0.95)" : "rgba(255,250,236,0.9)";
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            tracePath(ctx, sel, 1);
            ctx.stroke();
            if (sel > 1) {
              ctx.beginPath();
              tracePath(ctx, sel - 1, 1);
              ctx.stroke();
            }
            /* a glint that travels round the chosen ring */
            var c = ringCenter(sel);
            var th = (t * 0.9) % TAU;
            var rr2 = lerp(ringRad(sel - 1, th), ringRad(sel, th), 0.5);
            var gx = c[0] + Math.cos(th) * rr2;
            var gy = c[1] + Math.sin(th) * rr2;
            var gl = ctx.createRadialGradient(gx, gy, 0, gx, gy, W * 0.05);
            gl.addColorStop(0, "rgba(255,250,230,0.9)");
            gl.addColorStop(1, "rgba(255,250,230,0)");
            ctx.fillStyle = gl;
            ctx.beginPath();
            ctx.arc(gx, gy, W * 0.05, 0, TAU);
            ctx.fill();
          };

          var textFor = function (j) {
            var y = y0 + j - 1;
            if (notes[y]) {
              return notes[y];
            }
            if (j === N) {
              return "Tahun kami menikah. Lingkaran yang ini tidak kami simpan di batang â€” kami memakainya di jari manis.";
            }
            if (j === 1) {
              return "Lingkaran pertama: tahun kami bertemu.";
            }
            return GENERIC[(j * 7) % GENERIC.length];
          };
          var chips = [];
          var select = function (j, quiet) {
            j = clamp(j, 1, N);
            if (j === sel) {
              return;
            }
            sel = j;
            setText(cardNo, String(j));
            setText(cardOf, "dari " + N);
            setText(cardYear, String(y0 + j - 1));
            setText(cardText, textFor(j));
            if (widthFill) {
              widthFill.style.width =
                Math.round((widths[j - 1] / maxW) * 100) + "%";
            }
            if (card) {
              card.classList.toggle("is-wed", j === N);
              card.classList.remove("is-flash");
              void card.offsetWidth;
              card.classList.add("is-flash");
            }
            chips.forEach(function (c, k) {
              c.classList.toggle("is-on", k + 1 === j);
              c.setAttribute("aria-pressed", k + 1 === j ? "true" : "false");
            });
            if (!quiet) {
              sound.knock();
            }
            if (reduceMotion) {
              drawHL(0);
            }
          };
          /* year chips */
          if (yearsEl) {
            for (i = 1; i <= N; i++) {
              (function (j) {
                var b = doc.createElement("button");
                b.type = "button";
                b.id = "lk-year-" + j;
                b.className =
                  "lk-year" +
                  (notes[y0 + j - 1] ? " has-note" : "") +
                  (j === N ? " is-wed" : "");
                b.textContent = String(y0 + j - 1);
                b.setAttribute("aria-pressed", "false");
                b.setAttribute(
                  "aria-label",
                  "Lingkaran ke-" + j + ", tahun " + (y0 + j - 1),
                );
                b.addEventListener("click", function () {
                  stopTour();
                  stg.classList.add("is-touched");
                  select(j);
                });
                yearsEl.appendChild(b);
                chips.push(b);
              })(i);
            }
          }
          var ringAt = function (x, y) {
            for (var j = 1; j <= N; j++) {
              var c = ringCenter(j);
              var dx = x - c[0];
              var dy = y - c[1];
              var d = Math.sqrt(dx * dx + dy * dy);
              var th = Math.atan2(dy, dx);
              if (th < 0) {
                th += TAU;
              }
              if (d <= ringRad(j, th)) {
                return j;
              }
            }
            return d <= G.Ro ? N : -1;
          };
          var fromEvent = function (e) {
            var rc = hlCv.getBoundingClientRect();
            var sx = G.W / Math.max(1, rc.width);
            return ringAt(
              (e.clientX - rc.left) * sx,
              (e.clientY - rc.top) * sx,
            );
          };
          var touring = false;
          var tourT = 0;
          var tourList = [];
          var stopTour = function () {
            touring = false;
            win.clearTimeout(tourT);
          };
          stg.addEventListener("pointermove", function (e) {
            if (e.pointerType !== "mouse") {
              return;
            }
            var j = fromEvent(e);
            if (j > 0) {
              stopTour();
              select(j);
            }
          });
          stg.addEventListener("click", function (e) {
            var j = fromEvent(e);
            if (j > 0) {
              stopTour();
              stg.classList.add("is-touched");
              select(j);
              sound.knock();
            }
          });
          /* a gentle tour through the years with notes, until the guest takes over */
          var tour = function () {
            if (!touring || !tourList.length) {
              return;
            }
            select(tourList.shift(), true);
            if (tourList.length) {
              tourT = later(tour, 3400);
            } else {
              touring = false;
            }
          };
          drawSlice();
          select(1, true);
          var t0 = now();
          var loopOn = false;
          var loop = function () {
            if (!loopOn) {
              return;
            }
            drawHL((now() - t0) / 1000);
            raf(loop);
          };
          var nearIOk = "IntersectionObserver" in win;
          if (reduceMotion) {
            drawHL(0);
          } else if (nearIOk) {
            new IntersectionObserver(
              function (entries) {
                entries.forEach(function (e) {
                  var want = e.isIntersecting;
                  if (want && !loopOn) {
                    loopOn = true;
                    raf(loop);
                  } else if (!want) {
                    loopOn = false;
                  }
                });
              },
              { rootMargin: "100px 0px" },
            ).observe(stg);
          } else {
            loopOn = true;
            raf(loop);
          }
          whenIn(stg, function () {
            tourList = [];
            for (var j = 1; j <= N; j++) {
              if (notes[y0 + j - 1]) {
                tourList.push(j);
              }
            }
            tourList.push(N);
            touring = true;
            tourT = later(tour, 1600);
          });
          var rt = 0;
          win.addEventListener("resize", function () {
            win.clearTimeout(rt);
            rt = later(function () {
              if (Math.abs(stg.offsetWidth - G.W) > 2) {
                drawSlice();
                drawHL(0);
              }
            }, 150);
          });
        };

        /* COUNTDOWN â€” the magnolia bud opens a little more each day; hold it to
warm it early. Wooden tags count days, hours, minutes and seconds. */
        var initCountdown = function () {
          var sec = $("sec-countdown");
          var stg = $("cd-stage");
          var hit = $("cd-bud-hit");
          var status = $("cd-status");
          var els = {
            d: $("cd-days"),
            h: $("cd-hours"),
            m: $("cd-mins"),
            s: $("cd-secs"),
          };
          if (!sec || !stg) {
            return;
          }
          var WINDOW = 120 * 86400000;
          var realOpen = 0.08;
          var shownOpen = 0.08;
          var holding = false;
          var warm = 0;
          var bloomed = false;
          var timer = 0;
          var prev = { d: "", h: "", m: "", s: "" };
          var set = function (k, v) {
            var el = els[k];
            if (!el || prev[k] === v) {
              return;
            }
            prev[k] = v;
            el.textContent = v;
            if (!reduceMotion) {
              el.classList.remove("is-tick");
              void el.offsetWidth;
              el.classList.add("is-tick");
            }
          };
          var statusText = "";
          var tick = function () {
            if (weddingAt === null) {
              set("d", "â€”");
              set("h", "â€”");
              set("m", "â€”");
              set("s", "â€”");
              return;
            }
            var left = weddingAt - Date.now();
            if (left <= 0) {
              set("d", "0");
              set("h", "00");
              set("m", "00");
              set("s", "00");
              realOpen = 1;
              if (!bloomed) {
                bloomed = true;
                sec.classList.add("is-bloom");
                statusText =
                  left > -86400000
                    ? "Hari ini kuncupnya mekar."
                    : "Kuncupnya sudah mekar. Terima kasih sudah menunggu bersama kami.";
                setText(status, statusText);
              }
              win.clearInterval(timer);
              return;
            }
            var d = Math.floor(left / 86400000);
            var h = Math.floor((left % 86400000) / 3600000);
            var m = Math.floor((left % 3600000) / 60000);
            var s = Math.floor((left % 60000) / 1000);
            set("d", String(d));
            set("h", pad(h));
            set("m", pad(m));
            set("s", pad(s));
            realOpen = clamp(1 - left / WINDOW, 0.06, 0.94);
            if (!holding) {
              statusText =
                d > 0
                  ? "Belum waktunya mekar â€” " + fmtNum(d) + " hari lagi."
                  : "Tinggal beberapa jam lagi. Kuncupnya sudah hampir terbuka.";
              setText(status, statusText);
            }
          };
          tick();
          timer = win.setInterval(function () {
            safe(tick);
          }, 1000);

          /* the bud's opening is a CSS variable eased toward its target */
          var paintBud = function () {
            stg.style.setProperty("--open", shownOpen.toFixed(3));
            stg.style.setProperty("--warm", warm.toFixed(3));
          };
          paintBud();
          var running = false;
          var last = 0;
          var humClock = 0;
          var frame = function (ts) {
            var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
            last = ts;
            var target = holding ? 1 : realOpen;
            shownOpen +=
              (target - shownOpen) * Math.min(1, dt * (holding ? 1.3 : 1.8));
            warm += ((holding ? 1 : 0) - warm) * Math.min(1, dt * 3);
            paintBud();
            if (holding) {
              humClock -= dt;
              if (humClock <= 0) {
                humClock = 0.28;
                sound.hum(shownOpen);
              }
            }
            if (
              Math.abs(target - shownOpen) > 0.002 ||
              warm > 0.01 ||
              holding
            ) {
              raf(frame);
            } else {
              running = false;
            }
          };
          var kick = function () {
            if (reduceMotion) {
              shownOpen = holding ? 1 : realOpen;
              warm = holding ? 1 : 0;
              paintBud();
              return;
            }
            if (!running) {
              running = true;
              last = 0;
              raf(frame);
            }
          };
          /* as the section arrives, the bud opens from closed to today's opening */
          whenIn(stg, function () {
            shownOpen = 0.02;
            paintBud();
            later(kick, 400);
          });
          if (hit) {
            var start = function (e) {
              if (e && e.preventDefault) {
                e.preventDefault();
              }
              if (holding) {
                return;
              }
              holding = true;
              stg.classList.add("is-holding");
              setText(status, "Hangatâ€¦ tapi sabar, belum musimnya.");
              kick();
            };
            var end = function () {
              if (!holding) {
                return;
              }
              holding = false;
              stg.classList.remove("is-holding");
              later(function () {
                if (!holding) {
                  setText(status, statusText);
                }
              }, 900);
              kick();
            };
            hit.addEventListener("pointerdown", start);
            ["pointerup", "pointerleave", "pointercancel"].forEach(
              function (ev) {
                hit.addEventListener(ev, end);
              },
            );
            hit.addEventListener("keydown", function (e) {
              if (e.key === " " || e.key === "Enter") {
                start(e);
              }
            });
            hit.addEventListener("keyup", function (e) {
              if (e.key === " " || e.key === "Enter") {
                end();
              }
            });
            hit.addEventListener("contextmenu", function (e) {
              e.preventDefault();
            });
          }
        };

        /* ADD TO CALENDAR â€” Google Calendar link and a downloadable .ics */
        var initCalendar = function () {
          var g = $("cal-google");
          var ics = $("cal-ics");
          if (weddingAt === null) {
            hide($("cd-cal"));
            return;
          }
          var evTime = $("ev-1-time");
          var endStr = evTime ? evTime.getAttribute("data-end") || "" : "";
          var endAt = parseTime(endStr) ? instant(weddingDate, endStr) : null;
          if (!endAt || endAt <= weddingAt) {
            endAt = weddingAt + 3 * 3600000;
          }
          var z = function (ms) {
            var d = new Date(ms);
            return (
              d.getUTCFullYear() +
              pad(d.getUTCMonth() + 1) +
              pad(d.getUTCDate()) +
              "T" +
              pad(d.getUTCHours()) +
              pad(d.getUTCMinutes()) +
              "00Z"
            );
          };
          var title =
            "Pernikahan " +
            (names.bride || "") +
            (names.bride && names.groom ? " & " : "") +
            (names.groom || "");
          var place = [names.venue, names.address]
            .filter(function (x) {
              return x;
            })
            .join(", ");
          var details =
            "Tumbuh bersama, musim demi musim. Sampai bertemu di hari kami menanam.";
          if (g) {
            g.href =
              "https://calendar.google.com/calendar/render?action=TEMPLATE" +
              "&text=" +
              encodeURIComponent(title) +
              "&dates=" +
              z(weddingAt) +
              "/" +
              z(endAt) +
              "&details=" +
              encodeURIComponent(details) +
              "&location=" +
              encodeURIComponent(place);
          }
          if (ics) {
            ics.addEventListener("click", function () {
              var esc = function (s) {
                return String(s)
                  .replace(/([,;\\])/g, "\\$1")
                  .replace(/\n/g, "\\n");
              };
              var lines = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "PRODID:-//Tumbuh Bersama//Undangan//ID",
                "CALSCALE:GREGORIAN",
                "BEGIN:VEVENT",
                "UID:" + weddingAt + "-" + hashStr(title) + "@undangan",
                "DTSTAMP:" + z(Date.now()),
                "DTSTART:" + z(weddingAt),
                "DTEND:" + z(endAt),
                "SUMMARY:" + esc(title),
                "DESCRIPTION:" + esc(details),
                "LOCATION:" + esc(place),
                "BEGIN:VALARM",
                "TRIGGER:-P1D",
                "ACTION:DISPLAY",
                "DESCRIPTION:" + esc(title),
                "END:VALARM",
                "END:VEVENT",
                "END:VCALENDAR",
              ];
              try {
                var blob = new Blob([lines.join("\r\n")], {
                  type: "text/calendar;charset=utf-8",
                });
                var url = URL.createObjectURL(blob);
                var a = doc.createElement("a");
                a.id = uid("cal-dl");
                a.href = url;
                a.download = "tumbuh-bersama.ics";
                body.appendChild(a);
                a.click();
                later(function () {
                  URL.revokeObjectURL(url);
                  if (a.parentNode) {
                    a.parentNode.removeChild(a);
                  }
                }, 1500);
                sound.pop();
              } catch (err) {
                /* ignore */
              }
            });
          }
        };
        /* EVENTS â€” the two plates; the second only when it has a name */
        var mapsDir = function (name, address, placeId) {
          var dest = [name, address]
            .filter(function (x) {
              return x && !blank(x);
            })
            .join(", ");
          var url =
            "https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=" +
            encodeURIComponent(dest || "Lokasi acara");
          if (!blank(placeId)) {
            url +=
              "&destination_place_id=" + encodeURIComponent(placeId.trim());
          }
          return url;
        };
        var placeIdOf = function (href) {
          var m = /destination_place_id=([^&]*)/.exec(href || "");
          return m ? decodeURIComponent(m[1]) : "";
        };

        var initEvents = function () {
          var sec = $("sec-events");
          if (!sec) {
            return;
          }
          var map1 = $("ev-1-map");
          var pid = placeIdOf(map1 ? map1.getAttribute("href") : "");
          if (map1) {
            map1.href = mapsDir(names.venue, names.address, pid);
          }
          if (blank(txt($("ev-1-name")))) {
            setText($("ev-1-name"), "Akad Nikah");
          }
          ["ev-1-addr", "ev-1-note", "ev-2-addr", "ev-2-note"].forEach(
            function (id) {
              if (blank(txt($(id)))) {
                hide($(id));
              }
            },
          );
          if (blank(txt($("ev-1-venue")))) {
            hide($("ev-1-row-p"));
          }
          var ev2 = $("ev-2");
          if (!ev2) {
            return;
          }
          if (blank(txt($("ev-2-name")))) {
            hide(ev2);
            var grid = $("ev-grid");
            if (grid) {
              grid.classList.add("is-one");
            }
            return;
          }
          /* a second event without its own date or place borrows the first one's */
          var d2 = $("ev-2-date");
          if (d2 && d2.classList.contains("is-blank")) {
            d2.setAttribute("data-date", weddingDate);
            setText(d2, fmtDate(weddingDate, "long") || "â€”");
          }
          var v2 = txt($("ev-2-venue"));
          var a2 = txt($("ev-2-addr"));
          if (blank(v2)) {
            setText($("ev-2-venue"), names.venue);
            v2 = names.venue;
          }
          if (blank(a2)) {
            a2 = names.address;
          }
          var map2 = $("ev-2-map");
          if (map2) {
            var same =
              (!blank(v2) && v2 === names.venue) ||
              (!blank(a2) && a2 === names.address);
            map2.href = same
              ? mapsDir(names.venue, names.address, pid)
              : mapsDir(v2, a2, "");
          }
        };

        /* RUNDOWN â€” built from the couple's own schedule; a vine grows along it */
        var ICON_HINTS = [
          "heart",
          "users",
          "utensils",
          "camera",
          "mic2",
          "cake",
          "music",
          "gift",
          "party-popper",
          "sparkles",
          "flower2",
          "home",
          "car",
          "shirt",
          "clock",
          "star",
        ];
        var initRundown = function () {
          var sec = $("sec-rundown");
          var list = $("rd-list");
          var svg = $("rd-vine");
          var track = $("rd-vine-track");
          var growP = $("rd-vine-grow");
          var bodyEl = $("rd-body");
          if (!sec || !list) {
            return;
          }
          var items = [];
          try {
            var raw = ($("wedivo-rundown-data") || {}).textContent || "[]";
            raw = raw.trim();
            items = raw && raw.charAt(0) === "[" ? JSON.parse(raw) : [];
          } catch (err) {
            items = [];
          }
          if (!Array.isArray(items)) {
            items = [];
          }
          items = items.filter(function (it) {
            return it && !blank(it.title);
          });
          if (!items.length) {
            hide(sec);
            hide(doc.querySelector('[data-nav-target="rundown"]'));
            return;
          }
          var dates = [];
          items.forEach(function (it) {
            if (it.date && dates.indexOf(it.date) < 0) {
              dates.push(it.date);
            }
          });
          var multi = dates.length > 1;
          var lastDate = null;
          items.forEach(function (it, i) {
            if (multi && it.date !== lastDate) {
              lastDate = it.date;
              var h = doc.createElement("p");
              h.id = "rd-day-" + i;
              h.className = "rd-day rv";
              h.textContent = fmtDate(it.date, "long") || it.date;
              list.appendChild(h);
            }
            var row = doc.createElement("div");
            row.id = "rd-item-" + i;
            row.className = "rd-item rv";
            row.style.setProperty("--d", "0.05s");
            var node = doc.createElement("span");
            node.id = "rd-node-" + i;
            node.className = "rd-node";
            var ic = doc.createElementNS(svgNS, "svg");
            ic.setAttribute("id", "rd-ic-" + i);
            ic.setAttribute("viewBox", "0 0 24 24");
            ic.setAttribute("aria-hidden", "true");
            var use = doc.createElementNS(svgNS, "use");
            use.setAttribute("id", "rd-ic-use-" + i);
            var hint = String(it.icon || "").toLowerCase();
            use.setAttribute(
              "href",
              ICON_HINTS.indexOf(hint) >= 0 ? "#ri-" + hint : "#ri-leaf",
            );
            ic.appendChild(use);
            node.appendChild(ic);
            var card = doc.createElement("div");
            card.id = "rd-card-" + i;
            card.className = "rd-card";
            var time = doc.createElement("p");
            time.id = "rd-time-" + i;
            time.className = "rd-time";
            if (it.isAllDay) {
              time.textContent = "Sepanjang hari";
            } else {
              var a = fmtTime(it.startTime);
              var b = fmtTime(it.endTime);
              var tz = blank(names.tz) ? "" : " " + names.tz;
              time.textContent =
                a && b ? a + " â€“ " + b + tz : a || b ? (a || b) + tz : "";
            }
            var title = doc.createElement("h3");
            title.id = "rd-title-" + i;
            title.className = "rd-title";
            title.textContent = it.title;
            card.appendChild(time);
            card.appendChild(title);
            if (!blank(it.location)) {
              var loc = doc.createElement("p");
              loc.id = "rd-loc-" + i;
              loc.className = "rd-loc";
              var lic = doc.createElementNS(svgNS, "svg");
              lic.setAttribute("id", "rd-loc-ic-" + i);
              lic.setAttribute("viewBox", "0 0 24 24");
              lic.setAttribute("aria-hidden", "true");
              var luse = doc.createElementNS(svgNS, "use");
              luse.setAttribute("id", "rd-loc-use-" + i);
              luse.setAttribute("href", "#ic-pin");
              lic.appendChild(luse);
              var lt = doc.createElement("span");
              lt.id = "rd-loc-t-" + i;
              lt.textContent = it.location;
              loc.appendChild(lic);
              loc.appendChild(lt);
              card.appendChild(loc);
            }
            if (!blank(it.description)) {
              var ds = doc.createElement("p");
              ds.id = "rd-desc-" + i;
              ds.className = "rd-desc";
              ds.textContent = it.description;
              card.appendChild(ds);
            }
            if (!time.textContent) {
              hide(time);
            }
            row.appendChild(node);
            row.appendChild(card);
            list.appendChild(row);
          });

          /* the vine: a wavy stem through every node, drawn as the guest scrolls */
          var total = 0;
          var layoutVine = function () {
            if (!svg || !track || !growP || !bodyEl) {
              return;
            }
            var h = list.offsetHeight;
            svg.setAttribute("width", "60");
            svg.setAttribute("height", String(h));
            svg.style.height = h + "px";
            var nodes = $$(".rd-node", list);
            if (!nodes.length) {
              return;
            }
            var br = bodyEl.getBoundingClientRect();
            var pts = nodes.map(function (n) {
              var r = n.getBoundingClientRect();
              return [
                r.left - br.left + r.width / 2,
                r.top - br.top + r.height / 2,
              ];
            });
            var d = "M" + pts[0][0] + " 0 L" + pts[0][0] + " " + pts[0][1];
            for (var i = 1; i < pts.length; i++) {
              var a = pts[i - 1];
              var b = pts[i];
              var my = (a[1] + b[1]) / 2;
              var sway = i % 2 ? 16 : -16;
              d +=
                " C" +
                (a[0] + sway) +
                " " +
                my +
                " " +
                (b[0] + sway) +
                " " +
                my +
                " " +
                b[0] +
                " " +
                b[1];
            }
            d += " L" + pts[pts.length - 1][0] + " " + h;
            track.setAttribute("d", d);
            growP.setAttribute("d", d);
            try {
              total = growP.getTotalLength();
            } catch (err) {
              total = h;
            }
            growP.style.strokeDasharray = total + " " + total;
            paintVine();
          };
          var paintVine = function () {
            if (!growP || !total) {
              return;
            }
            if (reduceMotion) {
              growP.style.strokeDashoffset = "0";
              return;
            }
            var r = list.getBoundingClientRect();
            var vh = win.innerHeight;
            var p = clamp((vh * 0.72 - r.top) / Math.max(1, r.height), 0, 1);
            growP.style.strokeDashoffset = String(total * (1 - p));
          };
          onScroll(paintVine);
          later(layoutVine, 60);
          var rt = 0;
          win.addEventListener("resize", function () {
            win.clearTimeout(rt);
            rt = later(layoutVine, 200);
          });
          win.addEventListener("load", function () {
            later(layoutVine, 100);
          });
        };

        /* VENUE â€” directions, copy the address, and the live map when possible */
        var initVenue = function () {
          var dir = $("vn-dir");
          var copyBtn = $("vn-copy");
          var copyT = $("vn-copy-t");
          var mapBox = $("vn-map");
          var iframe = $("vn-iframe");
          if (dir) {
            dir.href = mapsDir(
              names.venue,
              names.address,
              placeIdOf(dir.getAttribute("href")),
            );
          }
          ["vn-addr", "vn-note"].forEach(function (id) {
            if (blank(txt($(id)))) {
              hide($(id));
            }
          });
          if (blank(txt($("vn-name")))) {
            setText($("vn-name"), "Tempat acara");
          }
          if (copyBtn) {
            if (!names.address) {
              hide(copyBtn);
            } else {
              copyBtn.addEventListener("click", function () {
                var text = [names.venue, names.address]
                  .filter(function (x) {
                    return x;
                  })
                  .join(", ");
                var ok = function () {
                  setText(copyT, "Alamat tersalin");
                  sound.pop();
                  later(function () {
                    setText(copyT, "Salin alamat");
                  }, 2200);
                };
                try {
                  if (
                    win.navigator.clipboard &&
                    win.navigator.clipboard.writeText
                  ) {
                    win.navigator.clipboard
                      .writeText(text)
                      .then(ok, function () {
                        setText(copyT, text);
                      });
                  } else {
                    var ta = doc.createElement("textarea");
                    ta.id = uid("vn-copy-ta");
                    ta.value = text;
                    ta.setAttribute("readonly", "");
                    ta.style.position = "fixed";
                    ta.style.opacity = "0";
                    body.appendChild(ta);
                    ta.select();
                    doc.execCommand("copy");
                    body.removeChild(ta);
                    ok();
                  }
                } catch (err) {
                  setText(copyT, text);
                }
              });
            }
          }
          if (iframe && mapBox) {
            var src = iframe.getAttribute("data-src") || "";
            var key = (/key=([^&]*)/.exec(src) || [])[1] || "";
            var pid = (/place_id:([^&]*)/.exec(src) || [])[1] || "";
            if (
              !blank(decodeURIComponent(key)) &&
              !blank(decodeURIComponent(pid)) &&
              key.indexOf("%7B") < 0
            ) {
              mapBox.hidden = false;
              whenIn(mapBox, function () {
                iframe.src = src;
              });
            }
          }
        };

        /* DRESS CODE â€” the non-empty colours become leaves; tap to dress the two
garments in that colour */
        var initDresscode = function () {
          var sec = $("sec-dresscode");
          var stg = $("dc-stage");
          var dot = $("dc-picked-dot");
          var pickedT = $("dc-picked-t");
          if (!sec) {
            return;
          }
          var textEmpty = blank(txt($("dc-text")));
          if (textEmpty) {
            hide($("dc-text"));
          }
          var leaves = $$(".dc-leaf", sec).filter(function (l) {
            var c = hexRGB(l.getAttribute("data-color"));
            if (!c) {
              hide(l);
              return false;
            }
            return true;
          });
          if (!leaves.length) {
            hide(stg);
            if (textEmpty) {
              hide(sec);
              hide(doc.querySelector('[data-nav-target="dresscode"]'));
            }
            return;
          }
          var pickC = function (l, quiet) {
            var c = l.getAttribute("data-color");
            leaves.forEach(function (x) {
              x.classList.toggle("is-on", x === l);
              x.setAttribute("aria-pressed", x === l ? "true" : "false");
            });
            if (stg) {
              stg.style.setProperty("--wear", c);
              if (!quiet) {
                stg.classList.remove("is-swap");
                void stg.offsetWidth;
                stg.classList.add("is-swap");
              }
            }
            if (dot) {
              dot.style.background = c;
            }
            setText(
              pickedT,
              "Warna " +
                (leaves.indexOf(l) + 1) +
                " dari " +
                leaves.length +
                " â€” cocok untuk hari itu",
            );
            if (!quiet) {
              sound.pop();
            }
          };
          leaves.forEach(function (l) {
            l.addEventListener("click", function () {
              pickC(l, false);
            });
          });
          pickC(leaves[0], true);
          setText(pickedT, "Ketuk daunnya untuk mencoba warnanya");
        };

        /* PETUNJUK â€” empty instructions drop out; the barcode reads the date */
        var initPetunjuk = function () {
          var sec = $("sec-petunjuk");
          if (!sec) {
            return;
          }
          var any = false;
          for (var i = 1; i <= 6; i++) {
            var label = txt($("pj-label-" + i));
            var text = txt($("pj-text-" + i));
            if (blank(label) && blank(text)) {
              hide($("pj-item-" + i));
            } else {
              any = true;
              if (blank(label)) {
                hide($("pj-label-" + i));
              }
              if (blank(text)) {
                hide($("pj-text-" + i));
              }
            }
          }
          if (!any) {
            hide(sec);
            hide(doc.querySelector('[data-nav-target="petunjuk"]'));
          }
        };

        /* VIDEO â€” prewedding video, or a YouTube live stream embed */
        var youTubeId = function (url) {
          var m =
            /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/|shorts\/))([A-Za-z0-9_-]{6,})/.exec(
              url || "",
            );
          return m ? m[1] : "";
        };
        var initVideo = function () {
          var sec = $("sec-video");
          var house = $("vd-house");
          var video = $("vd-video");
          var embed = $("vd-embed");
          if (!sec) {
            return;
          }
          var vsrc = video ? video.getAttribute("src") || "" : "";
          var link = embed ? embed.getAttribute("data-link") || "" : "";
          var yt = youTubeId(link);
          if (yt && embed) {
            house.classList.add("is-embed");
            if (video) {
              video.removeAttribute("src");
              hide(video);
            }
            whenIn(house, function () {
              var f = doc.createElement("iframe");
              f.id = "vd-iframe";
              f.src =
                "https://www.youtube.com/embed/" +
                yt +
                "?rel=0&modestbranding=1";
              f.title = "Siaran langsung";
              f.setAttribute(
                "allow",
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
              );
              f.setAttribute("allowfullscreen", "");
              f.setAttribute("loading", "lazy");
              embed.appendChild(f);
            });
          } else if (video && !blank(vsrc) && vsrc.indexOf("{{") < 0) {
            video.addEventListener("play", function () {
              house.classList.add("is-playing");
            });
            video.addEventListener("pause", function () {
              house.classList.remove("is-playing");
            });
            video.addEventListener("error", function () {
              hide(sec);
              hide(doc.querySelector('[data-nav-target="video"]'));
            });
          } else {
            if (video) {
              video.removeAttribute("src");
            }
            hide(sec);
            hide(doc.querySelector('[data-nav-target="video"]'));
          }
          if (blank(txt($("vd-sh-s")))) {
            hide($("vd-sh-s"));
          }
        };

        /* FORMS â€” only decoration here: the shared runtime owns submission.
We watch its classes (is-selected, is-submitted) and let the scenes
answer: the watering can pours, the seedling grows and is planted,
every wish blooms as its own flower. */
        var watchClass = function (el, fn) {
          if (!el) {
            return;
          }
          if ("MutationObserver" in win) {
            new MutationObserver(function () {
              safe(fn);
            }).observe(el, { attributes: true, attributeFilter: ["class"] });
          }
        };

        var initForms = function () {
          /* ---------- gift ---------- */
          var gSec = $("sec-gifts");
          var gForm = $("gf-form");
          var gAmount = $("gf-amount");
          if (blank(txt($("gf-text")))) {
            hide($("gf-text"));
          }
          if (gSec && gForm) {
            if (gAmount) {
              gAmount.addEventListener("focus", function () {
                gSec.classList.add("is-ready");
              });
              gAmount.addEventListener("blur", function () {
                gSec.classList.remove("is-ready");
              });
            }
            var poured = false;
            watchClass(gForm, function () {
              if (gForm.classList.contains("is-submitted") && !poured) {
                poured = true;
                gSec.classList.remove("is-ready");
                gSec.classList.add("is-pouring");
                sound.water();
                later(
                  function () {
                    gSec.classList.remove("is-pouring");
                    gSec.classList.add("is-bloom");
                    sound.bloom();
                    burstAt($("gf-plant"), 22);
                  },
                  reduceMotion ? 20 : 1900,
                );
              }
            });
          }

          /* ---------- rsvp ---------- */
          var rSec = $("sec-rsvp");
          var rForm = $("rs-form");
          var scene = $("rs-scene");
          var tagName = $("rs-tag-name");
          var mood = $("rs-mood");
          var nameIn = $("rs-name");
          var paxIn = $("rs-pax-in");
          var deadline = $("rs-deadline-d");
          if (deadline && deadline.classList.contains("is-blank")) {
            hide($("rs-deadline"));
          }
          if (blank(txt($("rs-sh-s")))) {
            hide($("rs-sh-s"));
          }
          if (rSec && rForm && scene) {
            var status = "";
            var MOOD = {
              "": "Pilih jawabanmu, bibitnya akan ikut merespons.",
              attending: "Bibitmu bertunas! Kami tak sabar menanamnya bersama.",
              maybe: "Bibitnya masih malu-malu mengintip. Kabari kami, ya.",
              not_attending:
                "Bibitnya kami titipkan lewat doa. Terima kasih sudah memberi kabar.",
            };
            var paintName = function () {
              var v = nameIn ? nameIn.value.trim() : "";
              setText(tagName, v || (guestName ? guestName : "Nama Anda"));
            };
            var paintPax = function () {
              var n = paxIn ? clamp(parseInt(paxIn.value, 10) || 1, 1, 20) : 1;
              $$(".rs-pax-s", scene).forEach(function (s, k) {
                s.style.setProperty("--pd", (k * 0.08).toFixed(2) + "s");
                s.classList.toggle(
                  "is-on",
                  status === "attending" && n >= +s.getAttribute("data-n"),
                );
              });
            };
            var paintStatus = function () {
              var sel = rForm.querySelector("[data-wedivo-status].is-selected");
              var st = sel ? sel.getAttribute("data-wedivo-status") : "";
              if (st === status) {
                return;
              }
              status = st;
              scene.classList.toggle("st-attending", st === "attending");
              scene.classList.toggle("st-maybe", st === "maybe");
              scene.classList.toggle("st-not", st === "not_attending");
              setText(mood, MOOD[st] || MOOD[""]);
              if (st === "attending") {
                sound.sprout();
              } else if (st === "maybe") {
                sound.pop();
              } else if (st === "not_attending") {
                sound.rustle();
              }
              paintPax();
            };
            $$("[data-wedivo-status]", rForm).forEach(function (b) {
              watchClass(b, paintStatus);
              b.addEventListener("click", function () {
                later(paintStatus, 30);
              });
            });
            if (nameIn) {
              nameIn.addEventListener("input", paintName);
              later(paintName, 800);
            }
            paintName();
            if (paxIn) {
              paxIn.addEventListener("input", paintPax);
              var step = function (d) {
                var n = clamp((parseInt(paxIn.value, 10) || 1) + d, 1, 20);
                paxIn.value = String(n);
                try {
                  paxIn.dispatchEvent(new Event("input", { bubbles: true }));
                  paxIn.dispatchEvent(new Event("change", { bubbles: true }));
                } catch (err) {
                  paintPax();
                }
                sound.tick();
              };
              var minus = $("rs-pax-minus");
              var plus = $("rs-pax-plus");
              if (minus) {
                minus.addEventListener("click", function () {
                  step(-1);
                });
              }
              if (plus) {
                plus.addEventListener("click", function () {
                  step(1);
                });
              }
            }
            var planted = false;
            watchClass(rForm, function () {
              if (rForm.classList.contains("is-submitted") && !planted) {
                planted = true;
                if (status === "not_attending") {
                  setText(
                    mood,
                    "Doamu sudah sampai. Terima kasih sudah mengabari kami.",
                  );
                  sound.chime();
                  return;
                }
                scene.classList.add("is-planted");
                sound.seed();
                later(
                  function () {
                    sound.bloom();
                    burstAt($("rs-planted"), 18);
                    setText(
                      mood,
                      status === "maybe"
                        ? "Sudah kami tanam. Semoga bisa hadir, ya!"
                        : "Sudah tertanam. Sampai jumpa di hari kami menanam!",
                    );
                  },
                  reduceMotion ? 20 : 1500,
                );
                store.set("tb-planted", tagName ? tagName.textContent : "1");
              }
            });
          }

          /* ---------- wishes ---------- */
          var list = $("ws-list");
          var bed = $("ws-bed");
          if (blank(txt($("ws-sh-s")))) {
            hide($("ws-sh-s"));
          }
          if (list && bed) {
            var dress = function () {
              var cards = $$(".ws-card", list);
              cards.forEach(function (c, i) {
                if (!c.id) {
                  c.id = uid("ws-card");
                  $$("*", c).forEach(function (k) {
                    if (!k.id) {
                      k.id = uid("ws-card-el");
                    }
                  });
                }
                if (!c.__tone) {
                  var nm = c.querySelector(".ws-name");
                  var key = (nm ? nm.textContent : "") + "|" + i;
                  c.__tone = 1 + (hashStr(key) % 6);
                  c.classList.add("ws-c" + c.__tone);
                }
              });
              bed.classList.toggle("is-empty", cards.length === 0);
            };
            dress();
            if ("MutationObserver" in win) {
              new MutationObserver(function () {
                safe(dress);
              }).observe(list, {
                childList: true,
                subtree: true,
                characterData: true,
              });
            }
          }
        };

        /* NANTI â€” "Tumbuh Tua Bersama": drag the years; the seasons race past,
the tree keeps growing, the bench weathers, and small proofs of a life
together gather under it (a house, a swing, two cups, a cane, lights) */
        var initNanti = function () {
          var sec = $("sec-nanti");
          var canvas = $("nt-canvas");
          var range = $("nt-range");
          var badge = $("nt-badge-n");
          var seasonT = $("nt-season-t");
          var seasonUse = $("nt-season-use");
          var scaleMax = $("nt-scale-max");
          if (!sec || !canvas || !range) {
            return;
          }
          var hopes = [];
          $$(".nt-hope", sec).forEach(function (h, i) {
            var y = parseFloat(
              String(h.getAttribute("data-year") || "").replace(",", "."),
            );
            var t = txt(h.querySelector(".nt-hope-t"));
            if (blank(t)) {
              hide(h);
              return;
            }
            if (!isFinite(y) || y < 0) {
              y = [1, 5, 25, 50][i] || 10;
              setText(h.querySelector(".nt-hope-y"), "Suatu hari nanti");
            }
            hopes.push({ el: h, y: y, btn: h.querySelector(".nt-hope-b") });
          });
          var thresholds = hopes.length
            ? hopes.map(function (h) {
                return h.y;
              })
            : [1, 5, 25, 50];
          while (thresholds.length < 4) {
            thresholds.push(thresholds[thresholds.length - 1] + 10);
          }
          var maxY = Math.max(
            50,
            Math.ceil(Math.max.apply(null, thresholds) / 5) * 5,
          );
          range.max = String(maxY * 10);
          setText(scaleMax, String(maxY));

          var tree = Braided(treeSeed + 2, {
            depth: 6,
            braidH: 0.3,
            trunk: 0.12,
            limb: 1.6,
            spread: 0.72,
            up: 0.2,
            leafTip: 6,
            leafMid: 3,
            leafSize: 0.03,
            strandW: 0.034,
          });
          var fl = Flurry(50);
          var yv = 0;
          var yTarget = 0;
          var dragging = false;
          var auto = false;
          var gustV = 0;
          var swingBranch = -1;
          var lightsR = rng(treeSeed + 13);
          var lights = [];
          var i;
          for (i = 0; i < 26; i++) {
            lights.push({ k: lightsR(), t: lightsR(), ph: lightsR() * TAU });
          }
          var lastHope = -2;
          var paintHopes = function () {
            var cur = -1;
            hopes.forEach(function (h, k) {
              var reached = yv >= h.y - 0.05;
              h.el.classList.toggle("is-reached", reached);
              if (reached) {
                cur = k;
              }
            });
            if (cur !== lastHope) {
              lastHope = cur;
              hopes.forEach(function (h, k) {
                h.el.classList.toggle("is-current", k === cur);
              });
              if (cur >= 0 && !dragging) {
                sound.chime();
              }
            }
          };

          var drawBench = function (ctx, x, y, s, age) {
            var wood = mixRGB(
              [185, 138, 90],
              [150, 146, 136],
              clamp(age, 0, 1),
            );
            var dark = mixRGB(wood, [40, 30, 20], 0.35);
            ctx.fillStyle = rgbStr(dark);
            ctx.fillRect(x - s * 0.9, y - s * 0.34, s * 0.07, s * 0.34);
            ctx.fillRect(x + s * 0.83, y - s * 0.34, s * 0.07, s * 0.34);
            ctx.fillRect(x - s * 0.86, y - s * 0.9, s * 0.06, s * 0.6);
            ctx.fillRect(x + s * 0.8, y - s * 0.9, s * 0.06, s * 0.6);
            ctx.fillStyle = rgbStr(wood);
            ctx.fillRect(x - s, y - s * 0.4, s * 2, s * 0.1);
            ctx.fillRect(x - s * 0.95, y - s * 0.72, s * 1.9, s * 0.08);
            ctx.fillRect(x - s * 0.95, y - s * 0.9, s * 1.9, s * 0.08);
          };
          var drawHouse = function (ctx, x, y, s, a, t) {
            ctx.globalAlpha = a;
            ctx.fillStyle = "#e9dcc4";
            ctx.fillRect(x - s, y - s * 1.1, s * 2, s * 1.1);
            ctx.fillStyle = "#a9553a";
            ctx.beginPath();
            ctx.moveTo(x - s * 1.25, y - s * 1.05);
            ctx.lineTo(x, y - s * 2);
            ctx.lineTo(x + s * 1.25, y - s * 1.05);
            ctx.closePath();
            ctx.fill();
            var glow = 0.75 + 0.25 * Math.sin(t * 2);
            ctx.fillStyle = "rgba(255,214,120," + glow.toFixed(3) + ")";
            ctx.fillRect(x + s * 0.25, y - s * 0.8, s * 0.45, s * 0.4);
            ctx.fillStyle = "#6a4e39";
            ctx.fillRect(x - s * 0.6, y - s * 0.7, s * 0.4, s * 0.7);
            ctx.globalAlpha = 1;
          };

          var paint = function (ctx, W, H, dt, time) {
            if (auto && !dragging) {
              yTarget = Math.min(maxY, yTarget + dt * (maxY / 14));
              if (yTarget >= maxY) {
                auto = false;
              }
            }
            if (!dragging) {
              yv += (yTarget - yv) * Math.min(1, dt * (auto ? 10 : 3));
              if (Math.abs(yTarget - yv) < 0.01) {
                yv = yTarget;
              }
              range.value = String(Math.round(yv * 10));
            }
            range.style.setProperty(
              "--p",
              ((yv / maxY) * 100).toFixed(1) + "%",
            );
            setText(badge, String(Math.floor(yv + 0.001)));
            paintHopes();
            gustV = Math.max(0, gustV - dt);
            var frac = yv - Math.floor(yv);
            var cyc = seasonCycle(frac * 4);
            var pal = seasonMix(cyc.a, cyc.b, cyc.t);
            var mainS = cyc.t < 0.5 ? cyc.a : cyc.b;
            setText(seasonT, SEASON_NAMES[mainS]);
            if (
              seasonUse &&
              seasonUse.getAttribute("href") !== "#sym-musim-" + mainS
            ) {
              seasonUse.setAttribute("href", "#sym-musim-" + mainS);
            }
            var u = yv / maxY;
            /* sky & far hills */
            var sky = ctx.createLinearGradient(0, 0, 0, H);
            sky.addColorStop(0, rgbStr(pal.sky[0]));
            sky.addColorStop(1, rgbStr(pal.sky[2]));
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, W, H);
            var gy = H * 0.84;
            ctx.fillStyle = rgbStr(
              mixRGB(pal.ground[1], [200, 210, 215], 0.45),
            );
            ctx.beginPath();
            ctx.moveTo(0, gy - H * 0.1);
            ctx.bezierCurveTo(
              W * 0.2,
              gy - H * 0.2,
              W * 0.4,
              gy - H * 0.14,
              W * 0.62,
              gy - H * 0.08,
            );
            ctx.lineTo(W, gy - H * 0.06);
            ctx.lineTo(W, H);
            ctx.lineTo(0, H);
            ctx.closePath();
            ctx.fill();
            /* the little house appears with the first hope */
            var hA = clamp((yv - thresholds[0] + 0.4) / 0.4, 0, 1);
            if (hA > 0) {
              drawHouse(ctx, W * 0.14, gy - H * 0.135, H * 0.035, hA, time);
            }
            if (pal.snow > 0.05) {
              ctx.fillStyle =
                "rgba(255,255,255," + (0.7 * pal.snow).toFixed(3) + ")";
              ctx.beginPath();
              ctx.moveTo(0, gy - H * 0.1);
              ctx.bezierCurveTo(
                W * 0.2,
                gy - H * 0.2,
                W * 0.4,
                gy - H * 0.14,
                W * 0.62,
                gy - H * 0.08,
              );
              ctx.lineTo(W, gy - H * 0.06);
              ctx.lineTo(W, gy - H * 0.03);
              ctx.lineTo(0, gy - H * 0.06);
              ctx.closePath();
              ctx.fill();
            }
            /* ground */
            ctx.fillStyle = rgbStr(pal.ground[0]);
            ctx.beginPath();
            ctx.moveTo(0, gy);
            ctx.bezierCurveTo(W * 0.3, gy - 12, W * 0.7, gy - 8, W, gy + 2);
            ctx.lineTo(W, H);
            ctx.lineTo(0, H);
            ctx.closePath();
            ctx.fill();
            if (pal.snow > 0.05) {
              ctx.fillStyle =
                "rgba(255,255,255," + (0.85 * pal.snow).toFixed(3) + ")";
              ctx.fill();
            }
            /* the tree keeps growing */
            var tx = W * (W < 600 ? 0.62 : 0.64);
            var th = H * lerp(0.52, 0.78, Math.pow(u, 0.7));
            /* plant it on the curve of the ground, and heap a little earth over the flare */
            var gt = tx / W;
            var gAt =
              gy -
              36 * (1 - gt) * (1 - gt) * gt -
              24 * (1 - gt) * gt * gt +
              2 * gt * gt * gt;
            var cs = tree.draw(
              ctx,
              {
                x: tx,
                y: gAt + 4,
                H: th,
                g: 1,
                time: time,
                sway: 0.8,
                gust: gustV,
              },
              pal,
            );
            ctx.fillStyle = rgbStr(pal.ground[0]);
            ctx.beginPath();
            ctx.ellipse(tx, gAt + 6, th * 0.08, 6, 0, Math.PI, TAU);
            ctx.fill();
            if (pal.snow > 0.05) {
              ctx.fillStyle =
                "rgba(255,255,255," + (0.85 * pal.snow).toFixed(3) + ")";
              ctx.fill();
            }
            /* a heart carved in the braid */
            ctx.strokeStyle = "rgba(60,40,26,0.6)";
            ctx.lineWidth = 1.2;
            var hx = tx;
            var hy = gAt - th * 0.15;
            var hs = th * 0.018;
            ctx.beginPath();
            ctx.moveTo(hx, hy + hs);
            ctx.bezierCurveTo(
              hx - hs * 1.6,
              hy - hs * 0.2,
              hx - hs * 0.6,
              hy - hs * 1.4,
              hx,
              hy - hs * 0.4,
            );
            ctx.bezierCurveTo(
              hx + hs * 0.6,
              hy - hs * 1.4,
              hx + hs * 1.6,
              hy - hs * 0.2,
              hx,
              hy + hs,
            );
            ctx.stroke();
            /* the swing from a low limb (second hope) */
            if (cs && yv >= thresholds[1] - 0.3) {
              if (swingBranch < 0) {
                var best = -1;
                var bestS = -Infinity;
                tree.crown.B.forEach(function (b, k) {
                  if (b.d !== 2 || b.f < 0.9) {
                    return;
                  }
                  var horiz = Math.abs(Math.cos(b.a));
                  var score = horiz * 2 + b.y1 / H - Math.abs(b.x1 - tx) / W;
                  if (b.x1 < tx - th * 0.08 && score > bestS) {
                    bestS = score;
                    best = k;
                  }
                });
                swingBranch = best;
              }
              var sb = swingBranch >= 0 ? tree.crown.B[swingBranch] : null;
              if (sb && sb.f > 0.9) {
                var sA = clamp((yv - thresholds[1] + 0.3) / 0.3, 0, 1);
                var ax = lerp(sb.x0, sb.x1, 0.62);
                var ay = lerp(sb.y0, sb.y1, 0.62);
                var len = Math.max(20, gy - ay - th * 0.1);
                var ang = Math.sin(time * 1.4) * 0.12 + gustV * 0.2;
                var bx = ax + Math.sin(ang) * len;
                var by = ay + Math.cos(ang) * len;
                ctx.globalAlpha = sA;
                ctx.strokeStyle = "rgba(120,96,70,0.9)";
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(ax - 9, ay);
                ctx.lineTo(bx - 9, by);
                ctx.moveTo(ax + 9, ay);
                ctx.lineTo(bx + 9, by);
                ctx.stroke();
                ctx.fillStyle = "#8a6a4f";
                ctx.fillRect(bx - 13, by - 2, 26, 5);
                ctx.globalAlpha = 1;
              }
            }
            /* the bench, weathering */
            var bx0 = W * (W < 600 ? 0.32 : 0.34);
            var bs = H * 0.07;
            drawBench(ctx, bx0, gy + 2, bs, u * 1.2);
            /* a blanket and two cups (third hope) */
            var cA = clamp((yv - thresholds[2] + 0.4) / 0.4, 0, 1);
            if (cA > 0) {
              ctx.globalAlpha = cA;
              ctx.fillStyle = "#c46a4a";
              ctx.fillRect(
                bx0 - bs * 0.95,
                bs * -0.9 + gy + 2,
                bs * 0.7,
                bs * 0.5,
              );
              ctx.fillStyle = "rgba(255,240,220,0.55)";
              for (var q = 0; q < 3; q++) {
                ctx.fillRect(
                  bx0 - bs * 0.95 + q * bs * 0.24,
                  bs * -0.9 + gy + 2,
                  bs * 0.06,
                  bs * 0.5,
                );
              }
              ctx.fillStyle = "#f4efe6";
              ctx.fillRect(
                bx0 + bs * 0.2,
                gy + 2 - bs * 0.55,
                bs * 0.16,
                bs * 0.15,
              );
              ctx.fillRect(
                bx0 + bs * 0.45,
                gy + 2 - bs * 0.55,
                bs * 0.16,
                bs * 0.15,
              );
              ctx.strokeStyle = "rgba(255,255,255,0.7)";
              ctx.lineWidth = 1;
              ctx.beginPath();
              for (var st2 = 0; st2 < 2; st2++) {
                var sx2 = bx0 + bs * (0.28 + st2 * 0.25);
                var sy2 = gy + 2 - bs * 0.6;
                ctx.moveTo(sx2, sy2);
                ctx.bezierCurveTo(
                  sx2 - 4,
                  sy2 - 6,
                  sx2 + 4,
                  sy2 - 10,
                  sx2 + Math.sin(time * 2 + st2) * 3,
                  sy2 - 16,
                );
              }
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
            /* a cane leaning on the bench, and golden lights in the tree (fourth hope) */
            var gA = clamp((yv - thresholds[3] + 0.5) / 0.5, 0, 1);
            if (gA > 0) {
              ctx.globalAlpha = gA;
              ctx.strokeStyle = "#6a4e39";
              ctx.lineWidth = 2.4;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(bx0 + bs * 1.1, gy + 2);
              ctx.lineTo(bx0 + bs * 0.95, gy + 2 - bs * 0.95);
              ctx.arc(
                bx0 + bs * 0.87,
                gy + 2 - bs * 0.95,
                bs * 0.08,
                0,
                Math.PI,
                true,
              );
              ctx.stroke();
              if (cs) {
                lights.forEach(function (lt) {
                  var at = Tree.leafAt(tree.crown, { H: th }, lt.k);
                  if (!at) {
                    return;
                  }
                  var tw = 0.55 + 0.45 * Math.sin(time * 2.4 + lt.ph);
                  ctx.fillStyle =
                    "rgba(255,214,120," + (tw * gA).toFixed(3) + ")";
                  ctx.beginPath();
                  ctx.arc(at.x, at.y, 2.2 + tw, 0, TAU);
                  ctx.fill();
                });
              }
              ctx.globalAlpha = 1;
            }
            /* the season's air */
            if (!reduceMotion && Math.random() < dt * 4) {
              var kd = fl.kindFor(mainS, Math.random());
              fl.add(
                Math.random() * W,
                kd === "mote" || kd === "fluff" ? H * 0.7 : -10,
                kd,
                null,
                null,
                0.9,
              );
            }
            fl.step(dt, 10 + gustV * 50, W, H, gy + 6);
            fl.draw(ctx);
          };

          var stg = stage(canvas, paint, { watch: $("nt-stage") });
          range.addEventListener("input", function () {
            auto = false;
            yTarget = clamp(+range.value / 10, 0, maxY);
            yv = yTarget;
            if (reduceMotion && stg) {
              stg.still();
            }
          });
          range.addEventListener("pointerdown", function () {
            dragging = true;
            auto = false;
          });
          ["pointerup", "pointercancel", "change"].forEach(function (ev) {
            range.addEventListener(ev, function () {
              dragging = false;
            });
          });
          hopes.forEach(function (h) {
            if (h.btn) {
              h.btn.addEventListener("click", function () {
                auto = false;
                yTarget = h.y;
                sound.pop();
                if (reduceMotion) {
                  yv = yTarget;
                  if (stg) {
                    stg.still();
                  }
                }
              });
            }
          });
          onGust(function (p) {
            gustV = Math.max(gustV, p);
          });
          whenIn($("nt-stage"), function () {
            if (reduceMotion) {
              yv = yTarget = maxY;
              if (stg) {
                stg.still();
              }
              return;
            }
            later(function () {
              if (!dragging && yv < 0.5) {
                auto = true;
              }
            }, 900);
          });
        };

        /* CLOSING â€” the braided tree in full bloom; every guest's seedling */
        var initClosing = function () {
          var sec = $("sec-closing");
          var canvas = $("cl-canvas");
          var hit = $("cl-tree-hit");
          var top = $("cl-top");
          if (!sec) {
            return;
          }
          ["cl-text", "cl-salam", "cl-family", "cl-hashtag"].forEach(
            function (id) {
              if (blank(txt($(id)))) {
                hide($(id));
              }
            },
          );
          if (blank(txt($("cl-turut-v")))) {
            hide($("cl-turut"));
          }
          if (!names.bride && !names.groom) {
            hide($("cl-names"));
            hide($("cl-we"));
          }
          var clPhoto = $("cl-photo");
          photoState(
            clPhoto,
            $("cl-photo-img"),
            clPhoto ? clPhoto.getAttribute("data-photo") : "",
          );
          var tree = Braided(treeSeed, {
            depth: 6,
            braidH: 0.3,
            trunk: 0.12,
            limb: 1.6,
            spread: 0.72,
            up: 0.2,
            leafTip: 6,
            leafMid: 3,
            leafSize: 0.03,
            strandW: 0.034,
          });
          var fl = Flurry(60);
          var gustV = 0;
          var clock = 0;
          var planted = store.get("tb-planted");
          var sr = rng(treeSeed + 44);
          var seedlings = [];
          for (var i = 0; i < 22; i++) {
            seedlings.push({
              x: sr(),
              s: 0.6 + sr() * 0.7,
              ph: sr() * TAU,
              bloom: sr() < 0.5,
              c: ["#f1b8c4", "#f3dc8e", "#fbf7ee", "#e7a3b1"][
                Math.floor(sr() * 4)
              ],
            });
          }
          var pal = seasonMix(4, 4, 0);
          var paint = function (ctx, W, H, dt, time) {
            gustV = Math.max(0, gustV - dt);
            ctx.clearRect(0, 0, W, H);
            var gy = H * 0.9;
            var glow = ctx.createRadialGradient(
              W * 0.5,
              H * 0.38,
              10,
              W * 0.5,
              H * 0.4,
              Math.max(W, H) * 0.6,
            );
            glow.addColorStop(0, "rgba(255,246,222,0.75)");
            glow.addColorStop(1, "rgba(255,246,222,0)");
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = rgbStr(pal.ground[1]);
            ctx.beginPath();
            ctx.ellipse(
              W * 0.5,
              gy + H * 0.5,
              W * 0.9,
              H * 0.56,
              0,
              Math.PI,
              TAU,
            );
            ctx.fill();
            ctx.fillStyle = rgbStr(pal.ground[0]);
            ctx.beginPath();
            ctx.ellipse(
              W * 0.5,
              gy + H * 0.44,
              W * 0.66,
              H * 0.48,
              0,
              Math.PI,
              TAU,
            );
            ctx.fill();
            /* seedlings of everyone who came */
            seedlings.forEach(function (s, k) {
              var x = W * (0.08 + s.x * 0.84);
              if (Math.abs(x - W * 0.5) < W * 0.07) {
                return;
              }
              var edge = Math.abs(x - W * 0.5) / (W * 0.66);
              var y = gy - (1 - edge * edge) * H * 0.05 + 4;
              var h = 14 * s.s;
              var sw = Math.sin(time * 1.6 + s.ph) * 2 + gustV * 5;
              ctx.strokeStyle = "#5a7645";
              ctx.lineWidth = 1.6;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.quadraticCurveTo(x + sw * 0.4, y - h * 0.6, x + sw, y - h);
              ctx.stroke();
              ctx.fillStyle = "#7c985c";
              ctx.beginPath();
              ctx.ellipse(
                x + sw * 0.6 - 4,
                y - h * 0.6,
                4 * s.s,
                2 * s.s,
                -0.5,
                0,
                TAU,
              );
              ctx.ellipse(
                x + sw * 0.6 + 4,
                y - h * 0.7,
                4 * s.s,
                2 * s.s,
                0.5,
                0,
                TAU,
              );
              ctx.fill();
              if (s.bloom) {
                ctx.fillStyle = s.c;
                ctx.beginPath();
                ctx.arc(x + sw, y - h - 2, 3 * s.s, 0, TAU);
                ctx.fill();
              }
              if (k === 3 && planted) {
                ctx.fillStyle = "#e8b746";
                ctx.beginPath();
                ctx.arc(x + sw, y - h - 2, 4.5, 0, TAU);
                ctx.fill();
              }
            });
            var th = Math.min(H * 0.84, W * (W < 700 ? 1 : 0.62));
            var cs = tree.draw(
              ctx,
              {
                x: W * 0.5,
                y: gy - H * 0.05 + 6,
                H: th,
                g: 1,
                time: time,
                sway: 0.9,
                gust: gustV,
              },
              pal,
            );
            if (!reduceMotion) {
              clock -= dt;
              if (clock <= 0 && cs) {
                clock = 0.22 + Math.random() * 0.3;
                var at = Tree.leafAt(tree.crown, { H: th }, Math.random());
                if (at) {
                  fl.add(
                    at.x,
                    at.y,
                    Math.random() < 0.85 ? "petal" : "spark",
                    null,
                    8,
                    1.2,
                  );
                }
              }
              fl.step(dt, 10 + gustV * 70, W, H, gy);
              fl.draw(ctx);
            }
          };
          if (canvas) {
            stage(canvas, paint, { watch: sec });
          }
          if (hit) {
            hit.addEventListener("click", function (e) {
              gustV = 1.3;
              sound.chime();
              Fx.burst(
                e.clientX || win.innerWidth / 2,
                e.clientY || win.innerHeight / 3,
                34,
              );
            });
          }
          onGust(function (p) {
            gustV = Math.max(gustV, p);
          });
          if (top) {
            top.addEventListener("click", function () {
              sound.sprout();
              jumpTo(hero || body, 0);
            });
          }
        };

        /* NUMBERS â€” section heads and nav items count the sections that show */
        var numberSections = function () {
          var vis = visibleSections();
          var map = {};
          vis.forEach(function (s, i) {
            map[s.getAttribute("data-section")] = pad(i + 1);
            var no = s.querySelector(".sh-no");
            if (no) {
              setText(no, "No. " + pad(i + 1));
            }
          });
          $$(".nv[data-nav-target]").forEach(function (it) {
            var n = map[it.getAttribute("data-nav-target")];
            var el = it.querySelector(".nv-no");
            if (el && n) {
              setText(el, n);
            }
          });
          $$(".sh-sub").forEach(function (el) {
            if (blank(txt(el)) && !el.children.length) {
              hide(el);
            }
          });
        };

        /* NAVIGATION â€” the garden rail and the garden map */
        var initNav = function () {
          if (!nav) {
            return;
          }
          var rail = $("nav-rail");
          var dial = $("nav-dial");
          var closeBtn = $("nav-close");
          var activeId = null;
          var lockUntil = 0;
          var centerTimer = 0;
          var syncTimer = 0;
          var mapOpen = false;
          var items = function () {
            return $$(".nv[data-nav-target]", rail || nav);
          };
          var targetOf = function (it) {
            return doc.querySelector(
              '[data-section="' + it.getAttribute("data-nav-target") + '"]',
            );
          };
          /* items for sections that are hidden (by the couple or by this script) disappear */
          var prune = function () {
            var k = 0;
            items().forEach(function (it) {
              var s = targetOf(it);
              if (!s || !shown(s)) {
                it.style.display = "none";
                return;
              }
              if (it.style.display === "none") {
                it.style.display = "";
              }
              it.style.setProperty("--k", String(k));
              k++;
            });
          };
          var center = function (it, instant) {
            if (!rail || !it || it.style.display === "none" || mapOpen) {
              return;
            }
            if (rail.scrollWidth <= rail.clientWidth + 1) {
              return;
            }
            var rr = rail.getBoundingClientRect();
            var ir = it.getBoundingClientRect();
            var target =
              rail.scrollLeft +
              (ir.left - rr.left - rail.clientLeft) -
              (rail.clientWidth - ir.width) / 2;
            target = clamp(target, 0, rail.scrollWidth - rail.clientWidth);
            if (Math.abs(target - rail.scrollLeft) < 2) {
              return;
            }
            try {
              rail.scrollTo({
                left: target,
                behavior: instant || reduceMotion ? "auto" : "smooth",
              });
            } catch (err) {
              rail.scrollLeft = target;
            }
          };
          var setActive = function (id, mode) {
            if (!id || id === activeId) {
              return;
            }
            activeId = id;
            items().forEach(function (it) {
              var on = it.getAttribute("data-nav-target") === id;
              it.classList.toggle("is-active", on);
              if (on) {
                it.setAttribute("aria-current", "true");
                it.classList.add("is-seen");
              } else {
                it.removeAttribute("aria-current");
              }
            });
            var it = rail
              ? rail.querySelector('[data-nav-target="' + id + '"]')
              : null;
            win.clearTimeout(centerTimer);
            if (mode === "now") {
              center(it, false);
            } else if (mode === "instant") {
              center(it, true);
            } else {
              centerTimer = later(function () {
                center(it, false);
              }, 180);
            }
          };
          var computeActive = function () {
            var vis = visibleSections();
            if (!vis.length) {
              return null;
            }
            var line = win.innerHeight * 0.35;
            var act = vis[0];
            for (var i = 0; i < vis.length; i++) {
              if (vis[i].getBoundingClientRect().top <= line) {
                act = vis[i];
              } else {
                break;
              }
            }
            if (
              win.innerHeight + win.pageYOffset >=
              doc.documentElement.scrollHeight - 4
            ) {
              act = vis[vis.length - 1];
            }
            return act.getAttribute("data-section");
          };
          var sync = function () {
            if (!coverOpen) {
              return;
            }
            if (Date.now() < lockUntil) {
              return;
            }
            setActive(computeActive());
          };
          onScroll(sync);
          var go = function (id) {
            var s = doc.querySelector('[data-section="' + id + '"]');
            if (!s || !shown(s)) {
              return;
            }
            sound.tick();
            lockUntil = Date.now() + 1200;
            activeId = null;
            setActive(id, "now");
            jumpTo(s, 0);
            win.clearTimeout(syncTimer);
            syncTimer = later(function () {
              lockUntil = 0;
              sync();
            }, 1300);
          };
          var openMap = function () {
            if (mapOpen) {
              return;
            }
            mapOpen = true;
            nav.classList.remove("is-closing");
            nav.classList.add("is-map");
            body.classList.add("is-locked");
            if (dial) {
              dial.setAttribute("aria-expanded", "true");
              dial.setAttribute("aria-label", "Tutup peta kebun");
            }
            sound.rustle();
            later(function () {
              var act = rail ? rail.querySelector(".nv.is-active") : null;
              if (act && act.focus) {
                act.focus({ preventScroll: true });
              }
            }, 80);
          };
          var closeMap = function (then) {
            if (!mapOpen) {
              if (then) {
                then();
              }
              return;
            }
            mapOpen = false;
            if (dial) {
              dial.setAttribute("aria-expanded", "false");
              dial.setAttribute("aria-label", "Buka peta kebun");
            }
            var done = function () {
              nav.classList.remove("is-map");
              nav.classList.remove("is-closing");
              body.classList.remove("is-locked");
              var act = rail ? rail.querySelector(".nv.is-active") : null;
              center(act, true);
              if (then) {
                then();
              }
            };
            if (reduceMotion) {
              done();
              return;
            }
            nav.classList.add("is-closing");
            later(done, 420);
          };
          (rail || nav).addEventListener("click", function (e) {
            var it =
              e.target && e.target.closest
                ? e.target.closest("[data-nav-target]")
                : null;
            if (!it) {
              return;
            }
            e.preventDefault();
            var id = it.getAttribute("data-nav-target");
            if (mapOpen) {
              closeMap(function () {
                go(id);
              });
            } else {
              go(id);
            }
          });
          if (dial) {
            dial.addEventListener("click", function () {
              if (mapOpen) {
                closeMap();
              } else {
                openMap();
              }
            });
          }
          if (closeBtn) {
            closeBtn.addEventListener("click", function () {
              closeMap();
            });
          }
          doc.addEventListener("keydown", function (e) {
            if (mapOpen && e.key === "Escape") {
              closeMap();
            }
          });
          win.addEventListener("resize", function () {
            var it =
              activeId && rail
                ? rail.querySelector('[data-nav-target="' + activeId + '"]')
                : null;
            win.clearTimeout(centerTimer);
            centerTimer = later(function () {
              center(it, true);
            }, 200);
          });
          prune();
          /* the platform may hide or reorder sections after load: re-check */
          if ("MutationObserver" in win) {
            var mo = new MutationObserver(function () {
              numberSections();
              prune();
            });
            mo.observe(body, { childList: true });
            visibleSections().forEach(function (s) {
              mo.observe(s, {
                attributes: true,
                attributeFilter: ["style", "hidden"],
              });
            });
            if (rail) {
              mo.observe(rail, { childList: true });
            }
          }
          navReady.push(function () {
            numberSections();
            prune();
            activeId = null;
            setActive(computeActive() || "hero", "instant");
          });
        };

        /* START */
        var refreshAir = null;
        [
          buildSprouts,
          applyFormats,
          function () {
            refreshAir = initAmbient();
          },
          initSalam,
          initCouple,
          initHero,
          initInos,
          initStory,
          initGallery,
          initViewer,
          initGugur,
          initLingkaran,
          initCountdown,
          initCalendar,
          initEvents,
          initRundown,
          initVenue,
          initDresscode,
          initPetunjuk,
          initVideo,
          initForms,
          initNanti,
          initClosing,
          numberSections,
          initNav,
          watchRegions,
          initCover,
        ].forEach(function (fn) {
          safe(fn);
        });
        
        /* EXPOSE TO WINDOW FOR NEXT.JS INTEGRATION */
        try {
          win.openTumbuhCover = openCover;
          win.skipTumbuhCover = skipCover;
          win.revealTumbuhHero = revealHero;
          win.showTumbuhNav = showNav;
        } catch (e) {}

later(function () {
          numberSections();
          requestScroll();
          if (refreshAir) {
            refreshAir();
          }
        }, 60);
        win.addEventListener("load", function () {
          requestScroll();
          bottomRelease();
        });
      })();
    
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(window.initTumbuhBersama, 50);
  } else {
    window.addEventListener('DOMContentLoaded', window.initTumbuhBersama);
  }
})();
