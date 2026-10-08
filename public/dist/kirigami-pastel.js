
window.copyRekening = function (number) {
  if (!number) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(number).then(function () {
      var toast = byId("found-toast");
      var txt = byId("found-toast-text");
      if (toast && txt) {
        txt.textContent = "Nomor rekening berhasil disalin!";
        toast.classList.add("is-visible");
        setTimeout(function () {
          toast.classList.remove("is-visible");
        }, 3000);
      }
    });
  }
};

window.initKirigamiPastel = function () {
        "use strict";

        var byId = function (id) {
          return document.getElementById(id);
        };
        var reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        var LOCALE = "id-ID";

        /* ---------- guest name ---------- */
        var guestEl = byId("cover-guest-value");
        var guestName = guestEl ? guestEl.textContent.trim() : "";
        document.body.classList.toggle("has-guest", guestName !== "");

        /* ---------- date helpers ---------- */
        var mainDT = (window.__KIRIGAMI_MAIN_DATE__ ? new Date(window.__KIRIGAMI_MAIN_DATE__) : (byId("wedding-date-raw") && byId("wedding-date-raw").textContent.trim()) ? new Date(byId("wedding-date-raw").textContent.trim()) : new Date());
        function fmtDate(d) {
          if (!d || isNaN(d.getTime())) return "";
          return d.toLocaleDateString(LOCALE, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        }
        function fmtShort(d) {
          if (!d || isNaN(d.getTime())) return "";
          return d.toLocaleDateString(LOCALE, {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        }
        function fmtTime(d) {
          if (!d || isNaN(d.getTime())) return "";
          return (
            d.toLocaleTimeString(LOCALE, {
              hour: "2-digit",
              minute: "2-digit",
            }) + " WIB"
          );
        }
        function fmtClock(hhmm) {
          if (!hhmm) return "";
          var p = String(hhmm).split(":");
          return p[0] + "." + (p[1] || "00");
        }

        var prettyDate = fmtDate(mainDT);
        var setText = function (id, txt) {
          var el = byId(id);
          if (el) el.textContent = txt;
        };
        setText("cover-date", fmtShort(mainDT));
        setText("hero-date", prettyDate);
        setText("event-1-date", prettyDate);
        setText("event-1-time", fmtTime(mainDT) + " – selesai");
        setText("closing-date", fmtShort(mainDT));

        /* ---------- second event ---------- */
        var e2nameEl = byId("event-2-name-raw");
        var e2name = e2nameEl ? e2nameEl.textContent.trim() : "";
        var e2dateEl = byId("event-2-date-raw");
        var e2date = e2dateEl ? e2dateEl.textContent.trim() : "";
        var e2timeEl = byId("event-2-time-raw");
        var e2time = e2timeEl ? e2timeEl.textContent.trim() : "";
        if (!e2name) {
          var e2c = byId("event-2-card"); if (e2c) e2c.classList.add("is-hidden");
        } else {
          var d2 = new Date(e2date + "T" + (e2time || "00:00") + ":00");
          setText("event-2-date-out", fmtDate(d2));
          setText("event-2-time-out", e2time ? fmtTime(d2) + " – selesai" : "");
        }

        /* ---------- reveal observer ---------- */
        var regions = document.querySelectorAll(
          "header, section, footer, [data-section], .sec",
        );
        var reveals = document.querySelectorAll(".reveal");

        function onRegionSeen(target) {
          if (!target) return;
          target.classList.add("in-view", "is-seen");
          if (target.querySelectorAll) {
            target.querySelectorAll(".reveal").forEach(function (el) {
              el.classList.add("in-view", "is-seen");
            });
          }
        }

        if ("IntersectionObserver" in window) {
          var io = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (en) {
                if (en.isIntersecting) {
                  onRegionSeen(en.target);
                  io.unobserve(en.target);
                }
              });
            },
            { threshold: 0.05, rootMargin: "0px 0px 80px 0px" },
          );
          regions.forEach(function (r) {
            io.observe(r);
          });
          reveals.forEach(function (r) {
            io.observe(r);
          });
        } else {
          regions.forEach(onRegionSeen);
          reveals.forEach(function (r) {
            r.classList.add("in-view", "is-seen");
          });
        }

        // Scroll listener fallback seperti di Template B
        window.addEventListener(
          "scroll",
          function () {
            var vh = window.innerHeight;
            document
              .querySelectorAll("header, section, footer, [data-section], .sec")
              .forEach(function (sec) {
                var rect = sec.getBoundingClientRect();
                if (rect.top < vh * 0.95 && rect.bottom > 0) {
                  if (!sec.classList.contains("in-view")) {
                    onRegionSeen(sec);
                  }
                }
              });
          },
          { passive: true }
        );

        function staggerChildren(root) {
          root.querySelectorAll(".reveal").forEach(function (el, i) {
            el.style.transitionDelay = Math.min(i * 90, 900) + "ms";
          });
        }
        regions.forEach(staggerChildren);
        var heroEl = byId("hero");
        if (heroEl) {
          heroEl.classList.add("in-view", "is-seen");
          heroEl.querySelectorAll(".reveal").forEach(function (el) {
            el.classList.add("in-view", "is-seen");
          });
        }
        var coverEl = byId("cover");
        if (coverEl) coverEl.classList.add("in-view", "is-seen");

        /* ---------- cover ---------- */
        var cover = byId("cover");
        var openBtn = byId("cover-open-btn");
        var audio = byId("music-audio");
        var musicBtn = byId("music-btn");
        var hasMusic = audio ? !!(audio.getAttribute("src") || "").trim() : false;
        if (!hasMusic && musicBtn) musicBtn.classList.add("is-hidden");

        function openInvitation() {
          if (!cover || cover.classList.contains("is-open")) return;
          cover.classList.add("is-open");
          document.body.classList.remove("is-locked");
          if (hasMusic && audio) {
            audio.volume = 0.55;
            var p = audio.play();
            if (p && p.catch) p.catch(function () {});
            if (musicBtn) musicBtn.classList.add("is-playing");
          }
          var heroEl = byId("hero");
          if (heroEl) {
            heroEl.classList.add("in-view");
            heroEl.scrollIntoView({ behavior: "smooth" });
          }
          window.setTimeout(function () {
            cover.style.display = "none";
          }, 1500);
        }
        window.openKirigamiInvitation = openInvitation;
        if (openBtn) openBtn.addEventListener("click", openInvitation);

        if (musicBtn) musicBtn.addEventListener("click", function () {
          if (audio.paused) {
            var p = audio.play();
            if (p && p.catch) p.catch(function () {});
            musicBtn.classList.add("is-playing");
          } else {
            audio.pause();
            musicBtn.classList.remove("is-playing");
          }
        });

        /* ---------- couple tabs + flip ---------- */
        var tabs = [
          { btn: byId("tab-groom"), card: byId("card-groom") },
          { btn: byId("tab-bride"), card: byId("card-bride") },
        ];
        tabs.filter(function(t) { return t.btn && t.card; }).forEach(function (t, idx) {
          t.btn.addEventListener("click", function () {
            tabs.forEach(function (o, j) {
              var on = j === idx;
              o.btn.classList.toggle("is-active", on);
              o.btn.setAttribute("aria-selected", on ? "true" : "false");
              o.card.classList.toggle("is-shown", on);
              if (!on) o.card.classList.remove("is-flipped");
            });
          });
        });
        [
          ["flip-groom", "card-groom", true],
          ["unflip-groom", "card-groom", false],
          ["flip-bride", "card-bride", true],
          ["unflip-bride", "card-bride", false],
        ].forEach(function (cfg) {
          var b = byId(cfg[0]);
          if (b)
            b.addEventListener("click", function () {
              byId(cfg[1]).classList.toggle("is-flipped", cfg[2]);
            });
        });

        /* ---------- love story ---------- */
        var storyTrack = byId("story-track");
        var stories = [1, 2, 3]
          .map(function (n) {
            return {
              title: (byId("story-" + n + "-title").textContent || "").trim(),
              text: (byId("story-" + n + "-text").textContent || "").trim(),
              photo: (
                byId("story-" + n + "-photo").getAttribute("src") || ""
              ).trim(),
            };
          })
          .filter(function (s) {
            return s.title || s.text;
          });

        if (!stories.length) {
          byId("story").hidden = true;
        } else {
          stories.forEach(function (s, i) {
            var item = document.createElement("div");
            item.className =
              "story-item reveal " + (i % 2 ? "reveal-r" : "reveal-l");
            item.id = "story-item-" + (i + 1);
            var dot =
              '<svg class="story-dot" id="story-dot-' +
              (i + 1) +
              '" viewBox="0 0 24 24" aria-hidden="true">' +
              '<circle cx="12" cy="12" r="11" fill="#fffcf8"/>' +
              '<circle cx="12" cy="12" r="7" fill="' +
              (i % 2 ? "#a8d8c6" : "#f3b8c6") +
              '"/></svg>';
            var img = s.photo
              ? '<img id="story-img-' +
                (i + 1) +
                '" src="' +
                s.photo +
                '" alt="" loading="lazy" />'
              : "";
            item.innerHTML =
              dot +
              '<div class="story-card" id="story-card-' +
              (i + 1) +
              '">' +
              img +
              '<p class="story-num" id="story-num-' +
              (i + 1) +
              '">Bab ' +
              (i + 1) +
              "</p>" +
              '<h3 class="story-title" id="story-head-' +
              (i + 1) +
              '"></h3>' +
              '<p class="story-text" id="story-body-' +
              (i + 1) +
              '"></p></div>';
            storyTrack.appendChild(item);
            byId("story-head-" + (i + 1)).textContent = s.title;
            byId("story-body-" + (i + 1)).textContent = s.text;
            item.style.transitionDelay = 300 + i * 140 + "ms";
          });
        }

        /* ---------- rundown ---------- */
        var rundownItems = [];
        try {
          rundownItems =
            JSON.parse(byId("wedivo-rundown-data").textContent || "[]") || [];
        } catch (e) {
          rundownItems = [];
        }
        var rdSection = byId("rundown");
        if (rundownItems.length) {
          rdSection.hidden = false;
          var rdList = byId("rundown-list");
          var lastDate = null;
          var group = null;
          var iconShape = function (hint) {
            switch (hint) {
              case "heart":
                return '<use href="#def-heartcut" width="40" height="36" fill="#e2809a"/>';
              case "cake":
              case "utensils":
                return '<circle cx="20" cy="20" r="15" fill="#f8cba4"/><path d="M12 20h16M20 12v16" stroke="#fffcf8" stroke-width="3" stroke-linecap="round"/>';
              case "music":
                return '<circle cx="15" cy="28" r="6" fill="#cfc0ea"/><path d="M21 28V10l10-2v16" fill="none" stroke="#cfc0ea" stroke-width="3" stroke-linecap="round"/>';
              case "camera":
                return '<rect x="5" y="12" width="30" height="20" rx="6" fill="#b9d7ee"/><circle cx="20" cy="22" r="6" fill="#fffcf8"/>';
              case "gift":
              case "party-popper":
                return '<rect x="6" y="14" width="28" height="20" rx="4" fill="#f3b8c6"/><path d="M20 14v20M6 22h28" stroke="#fffcf8" stroke-width="3"/>';
              case "users":
              case "home":
                return '<circle cx="14" cy="16" r="7" fill="#a8d8c6"/><circle cx="27" cy="18" r="6" fill="#6cb6a0"/><path d="M4 34c2-7 8-10 12-10s10 3 12 10" fill="#a8d8c6"/>';
              case "flower2":
                return '<use href="#def-flower" width="40" height="40" fill="#e2809a"/>';
              case "sparkles":
              case "star":
                return '<use href="#def-star4" width="40" height="40" fill="#c99a52"/>';
              default:
                return '<use href="#def-petal" width="40" height="40" fill="#a8d8c6"/>';
            }
          };
          rundownItems.forEach(function (it, i) {
            if (it.date !== lastDate) {
              lastDate = it.date;
              var dObj = new Date(it.date + "T00:00:00");
              var h = document.createElement("p");
              h.className = "rd-day reveal";
              h.id = "rd-day-" + i;
              h.textContent = fmtDate(dObj);
              rdList.appendChild(h);
              group = document.createElement("div");
              group.className = "rd-list-grid";
              group.id = "rd-group-" + i;
              rdList.appendChild(group);
            }
            var timeTxt = it.isAllDay
              ? "Sepanjang hari"
              : fmtClock(it.startTime) +
                (it.endTime ? " – " + fmtClock(it.endTime) : "") +
                " WIB";
            var row = document.createElement("article");
            row.className = "rd-item";
            row.id = "rd-item-" + i;
            row.style.transitionDelay = Math.min(i * 90, 700) + "ms";
            row.innerHTML =
              '<svg class="rd-icon" id="rd-icon-' +
              i +
              '" viewBox="0 0 40 40" aria-hidden="true">' +
              iconShape(it.icon) +
              "</svg>" +
              '<div class="rd-body" id="rd-body-' +
              i +
              '">' +
              '<p class="rd-time" id="rd-time-' +
              i +
              '"></p>' +
              '<h3 class="rd-title" id="rd-title-' +
              i +
              '"></h3>' +
              '<p class="rd-desc" id="rd-desc-' +
              i +
              '"></p>' +
              '<p class="rd-loc" id="rd-loc-' +
              i +
              '"></p></div>';
            (group || rdList).appendChild(row);
            byId("rd-time-" + i).textContent = timeTxt;
            byId("rd-title-" + i).textContent = it.title || "";
            var dEl = byId("rd-desc-" + i);
            if (it.description) {
              dEl.textContent = it.description;
            } else {
              dEl.remove();
            }
            var lEl = byId("rd-loc-" + i);
            if (it.location) {
              lEl.textContent = it.location;
            } else {
              lEl.remove();
            }
          });
          if (
            rdSection.classList.contains("in-view") === false &&
            !("IntersectionObserver" in window)
          ) {
            rdSection.classList.add("in-view");
          }
        }

        /* ---------- countdown ---------- */
        var cdGrid = byId("cd-grid");
        var cdDone = byId("cd-done");
        var pad = function (n) {
          return n < 10 ? "0" + n : String(n);
        };
        function tickCountdown() {
          var diff = mainDT.getTime() - Date.now();
          if (isNaN(diff)) return;
          if (diff <= 0) {
            if (cdGrid) cdGrid.classList.add("is-done");
            if (cdDone) cdDone.classList.add("is-done");
            window.clearInterval(cdTimer);
            return;
          }
          var s = Math.floor(diff / 1000);
          setText("cd-days", String(Math.floor(s / 86400)));
          setText("cd-hours", pad(Math.floor(s / 3600) % 24));
          setText("cd-min", pad(Math.floor(s / 60) % 60));
          setText("cd-sec", pad(s % 60));
        }
        var cdTimer = window.setInterval(tickCountdown, 1000);
        tickCountdown();

        /* ---------- add to calendar ---------- */
        var calBtn = byId("cal-btn"); if (calBtn) calBtn.addEventListener("click", function () {
          var start = new Date(mainDT.getTime());
          if (isNaN(start.getTime())) return;
          var end = new Date(start.getTime() + 3 * 3600 * 1000);
          var iso = function (d) {
            return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
          };
          var title =
            "Pernikahan " +
            byId("hero-names").textContent.replace(/\s+/g, " ").trim();
          var loc =
            byId("event-1-venue").textContent +
            " — " +
            byId("event-1-addr").textContent;
          var url =
            "https://calendar.google.com/calendar/render?action=TEMPLATE" +
            "&text=" +
            encodeURIComponent(title) +
            "&dates=" +
            iso(start) +
            "/" +
            iso(end) +
            "&location=" +
            encodeURIComponent(loc) +
            "&details=" +
            encodeURIComponent("Dengan penuh sukacita kami mengundang Anda.");
          window.open(url, "_blank", "noopener");
        });

        /* ---------- gallery ---------- */
        var galleryUrls = (window.__KIRIGAMI_GALLERY_URLS__ && Array.isArray(window.__KIRIGAMI_GALLERY_URLS__) && window.__KIRIGAMI_GALLERY_URLS__.length > 0)
    ? window.__KIRIGAMI_GALLERY_URLS__
    : [];

        var galleryGrid = byId("gallery-grid");
        var viewer = byId("viewer");
        var viewerImg = byId("viewer-img");
        var viewerBar = byId("viewer-bar");
        var viewerCount = byId("viewer-count");
        var currentIndex = 0;

        if (!galleryUrls.length) {
          var galEl = byId("gallery"); if (galEl) galEl.classList.add("is-empty");
        } else {
          galleryUrls.forEach(function (url, i) {
            var cell = document.createElement("figure");
            cell.className = "gal-cell";
            cell.id = "gal-cell-" + (i + 1);
            cell.style.transitionDelay = Math.min(i * 80, 700) + "ms";
            var im = document.createElement("img");
            im.src = url;
            im.loading = "lazy";
            im.alt = "Foto kenangan Nurizzati Islamiyah dan Badriana";
            im.id = "gal-img-" + (i + 1);
            cell.appendChild(im);
            cell.addEventListener("click", function () {
              showViewer(i);
            });
            galleryGrid.appendChild(cell);
          });
          if (galleryUrls.length <= 1 && viewerBar) viewerBar.classList.add("is-single");
        }

        function showViewer(index) {
          if (!galleryUrls.length) return;
          currentIndex = (index + galleryUrls.length) % galleryUrls.length;
          viewerImg.src = galleryUrls[currentIndex];
          viewerCount.textContent =
            currentIndex + 1 + " / " + galleryUrls.length;
          if (viewer) viewer.classList.add("is-open");
          viewer.setAttribute("aria-hidden", "false");
          document.body.classList.add("is-locked");
        }
        function closeViewer() {
          if (viewer) viewer.classList.remove("is-open");
          viewer.setAttribute("aria-hidden", "true");
          document.body.classList.remove("is-locked");
          window.setTimeout(function () {
            if (!viewer.classList.contains("is-open")) viewerImg.src = "";
          }, 500);
        }
        var vc = byId("viewer-close"); if (vc) vc.addEventListener("click", closeViewer);
        var vp = byId("viewer-prev"); if (vp) vp.addEventListener("click", function () {
          showViewer(currentIndex - 1);
        });
        var vn = byId("viewer-next"); if (vn) vn.addEventListener("click", function () {
          showViewer(currentIndex + 1);
        });
        if (viewer) viewer.addEventListener("click", function (ev) {
          if (ev.target === viewer) closeViewer();
        });
        document.addEventListener("keydown", function (ev) {
          if (!viewer.classList.contains("is-open")) return;
          if (ev.key === "Escape") closeViewer();
          if (ev.key === "ArrowLeft") showViewer(currentIndex - 1);
          if (ev.key === "ArrowRight") showViewer(currentIndex + 1);
        });
        var touchX = 0;
        viewer.addEventListener(
          "touchstart",
          function (ev) {
            touchX = ev.changedTouches[0].clientX;
          },
          { passive: true },
        );
        viewer.addEventListener(
          "touchend",
          function (ev) {
            var dx = ev.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 48) showViewer(currentIndex + (dx < 0 ? 1 : -1));
          },
          { passive: true },
        );

        /* ---------- folds ---------- */
        [1, 2, 3].forEach(function (n) {
          var q = byId("fold-" + n + "-q");
          var txt = q ? q.textContent.replace(/\s+/g, "") : "";
          var foldEl = byId("fold-" + n); if (!txt && foldEl) foldEl.classList.add("is-hidden");
        });
        if (
          document.querySelectorAll("#folds-list .fold:not(.is-hidden)")
            .length === 0
        ) {
          byId("folds").hidden = true;
        }

        /* ---------- dress code chips ---------- */
        var chipWrap = byId("dress-chips");
        [1, 2, 3, 4].forEach(function (n) {
          var c = (byId("dress-c" + n).textContent || "").trim();
          if (!c) return;
          var chip = document.createElement("span");
          chip.className = "chip";
          chip.id = "dress-chip-" + n;
          chip.style.background = c;
          chip.style.animationDelay = -n * 0.7 + "s";
          chipWrap.appendChild(chip);
        });

        /* ---------- hero parallax ---------- */
        var far = byId("hero-layer-far");
        var mid = byId("hero-layer-mid");
        var near = byId("hero-layer-near");
        var heroImg = byId("hero-bg-img");
        var ticking = false;
        function onScroll() {
          if (ticking || reduced) return;
          ticking = true;
          window.requestAnimationFrame(function () {
            var y = window.scrollY || 0;
            if (y < window.innerHeight * 1.3) {
              heroImg.style.transform =
                "scale(1.06) translate3d(0," + y * 0.14 + "px,0)";
              far.style.transform = "translate3d(0," + y * 0.05 + "px,0)";
              mid.style.transform = "translate3d(0," + y * -0.04 + "px,0)";
              near.style.transform = "translate3d(0," + y * -0.1 + "px,0)";
            }
            ticking = false;
          });
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        /* ---------- paper particle background ---------- */
        var canvas = byId("bg-particles");
        var ctx = canvas.getContext && canvas.getContext("2d");
        if (ctx) {
          var COLORS = [
            "#f3b8c6",
            "#a8d8c6",
            "#f8cba4",
            "#cfc0ea",
            "#b9d7ee",
            "#e2809a",
          ];
          var pieces = [];
          var dpr = Math.min(window.devicePixelRatio || 1, 2);
          var pointer = { x: -9999, y: -9999 };
          var running = true;

          function resize() {
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          }
          function spawn() {
            var n = window.innerWidth < 620 ? 34 : 56;
            pieces = [];
            for (var i = 0; i < n; i++) {
              pieces.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                s: 4 + Math.random() * 9,
                vy: 0.14 + Math.random() * 0.42,
                vx: (Math.random() - 0.5) * 0.24,
                rot: Math.random() * Math.PI * 2,
                vr: (Math.random() - 0.5) * 0.014,
                shape: Math.floor(Math.random() * 3),
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                alpha: 0.35 + Math.random() * 0.4,
              });
            }
          }
          function drawPiece(p) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            if (p.shape === 0) {
              ctx.moveTo(0, -p.s);
              ctx.bezierCurveTo(p.s, -p.s * 0.5, p.s * 0.7, p.s, 0, p.s);
              ctx.bezierCurveTo(-p.s * 0.7, p.s, -p.s, -p.s * 0.5, 0, -p.s);
            } else if (p.shape === 1) {
              ctx.moveTo(0, -p.s);
              ctx.lineTo(p.s * 0.9, p.s * 0.7);
              ctx.lineTo(-p.s * 0.9, p.s * 0.7);
              ctx.closePath();
            } else {
              ctx.arc(0, 0, p.s * 0.72, 0, Math.PI * 2);
            }
            ctx.fill();
            ctx.restore();
          }
          function tick() {
            if (!running) return;
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (var i = 0; i < pieces.length; i++) {
              var p = pieces[i];
              p.y += p.vy;
              p.x += p.vx + Math.sin(p.y * 0.008) * 0.34;
              p.rot += p.vr;
              var dx = p.x - pointer.x;
              var dy = p.y - pointer.y;
              var d2 = dx * dx + dy * dy;
              if (d2 < 14000 && d2 > 1) {
                var f = ((14000 - d2) / 14000) * 0.9;
                var d = Math.sqrt(d2);
                p.x += (dx / d) * f;
                p.y += (dy / d) * f;
              }
              if (p.y - p.s > window.innerHeight) {
                p.y = -p.s * 2;
                p.x = Math.random() * window.innerWidth;
              }
              if (p.x < -30) p.x = window.innerWidth + 20;
              if (p.x > window.innerWidth + 30) p.x = -20;
              drawPiece(p);
            }
            window.requestAnimationFrame(tick);
          }
          window.addEventListener("resize", function () {
            resize();
            spawn();
          });
          window.addEventListener(
            "pointermove",
            function (ev) {
              pointer.x = ev.clientX;
              pointer.y = ev.clientY;
            },
            { passive: true },
          );
          document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
              running = false;
            } else if (!reduced) {
              running = true;
              tick();
            }
          });
          resize();
          spawn();
          if (reduced) {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            pieces.forEach(drawPiece);
          } else {
            tick();
          }
        }
      };

      if (typeof window !== "undefined") {
        window.initKirigamiPastel();
      }