
window.copyRekening = function (number) {
  if (!number) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(number).then(function () {
      var toast = document.getElementById("found-toast");
      var txt = document.getElementById("found-toast-text");
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

window.initMejaKoki = function() {
      (function () {
        "use strict";

        var d = document;
        var w = window;
        var body = d.getElementById("page-body") || d.body;
        var byId = function (id) {
          return d.getElementById(id);
        };
        var mq = w.matchMedia
          ? w.matchMedia("(prefers-reduced-motion: reduce)")
          : null;
        var reduce = !!(mq && mq.matches);

        var isBlank = function (t) {
          var s = (t || "").trim();
          return (
            !s ||
            (s.indexOf("{{") === 0 && s.lastIndexOf("}}") === s.length - 2)
          );
        };
        var isUrl = function (v) {
          var s = (v || "").trim();
          return !!s && /^(https?:\/\/|data:|blob:|\/)/.test(s);
        };
        var pad2 = function (n) {
          return String(n).padStart(2, "0");
        };

        /* ---------------------------------------------------------------
     TANGGAL & WAKTU
  ---------------------------------------------------------------- */
        var rawFromDom = byId("wedding-date-raw") ? byId("wedding-date-raw").textContent.trim() : "";
        var board = byId("cd-board");
        var rawFromBoard = board ? (board.getAttribute("data-wedding-date") || "") : "";
        var weddingISO = window.__MEJA_KOKI_MAIN_DATE__ || rawFromDom || rawFromBoard || "2026-10-30T11:00:00";
        var parseWeddingDate = function (val) {
          if (!val) return new Date("2026-10-30T11:00:00");
          var dt = new Date(val);
          if (!isNaN(dt.getTime())) return dt;
          var clean = String(val).replace(" ", "T");
          dt = new Date(clean);
          if (!isNaN(dt.getTime())) return dt;
          var part = clean.split("T")[0];
          dt = new Date(part);
          if (!isNaN(dt.getTime())) return dt;
          return new Date("2026-10-30T11:00:00");
        };
        var weddingAt = parseWeddingDate(weddingISO);
        var hasWedding = true;

        var fmtDate = function (dt) {
          return dt.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        };
        var fmtDateShort = function (dt) {
          return dt.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        };
        var fmtTime = function (dt) {
          return dt.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          });
        };
        var fmtHM = function (hm) {
          var parts = String(hm || "").split(":");
          if (parts.length < 2) {
            return "";
          }
          var probe = new Date(
            2026,
            0,
            1,
            parseInt(parts[0], 10) || 0,
            parseInt(parts[1], 10) || 0,
          );
          return fmtTime(probe);
        };

        if (hasWedding) {
          var heroDateEl = byId("hero-date");
          if (heroDateEl) {
            heroDateEl.textContent = fmtDate(weddingAt);
          }
          var coverDateEl = byId("cover-date-line");
          if (coverDateEl) {
            coverDateEl.textContent = fmtDateShort(weddingAt);
          }
          var chit1Date = byId("chit-1-date");
          if (chit1Date) {
            chit1Date.textContent = fmtDate(weddingAt);
          }
          var chit1Time = byId("chit-1-time");
          if (chit1Time) {
            chit1Time.textContent = fmtTime(weddingAt) + " WIB — selesai";
          }
        }

        /* ---------------------------------------------------------------
     NAMA TAMU (bisa kosong — dua keadaan, dua-duanya dirancang)
  ---------------------------------------------------------------- */
        var guestEl = byId("guest-greeting-name");
        var guestName = guestEl ? guestEl.textContent.trim() : "";
        if (guestName.indexOf("{{") === 0) {
          guestName = "";
        }
        body.classList.toggle("has-guest", guestName !== "");

        /* ---------------------------------------------------------------
     FOTO OPSIONAL — jangan pernah menyisakan gambar rusak
  ---------------------------------------------------------------- */
        var optionalImgs = d.querySelectorAll("img[data-optional]");
        Array.prototype.forEach.call(optionalImgs, function (img) {
          var src = img.getAttribute("src");
          var fallback = img.parentNode
            ? img.parentNode.querySelector(
                "[hidden], .ing-photo-fallback, .course-photo-fallback",
              )
            : null;
          var fail = function () {
            img.style.display = "none";
            if (fallback) {
              fallback.hidden = false;
              fallback.removeAttribute("hidden");
            }
          };
          if (!isUrl(src)) {
            img.removeAttribute("src");
            fail();
            return;
          }
          img.addEventListener("error", fail);
        });

        /* ---------------------------------------------------------------
     MESIN REVEAL
  ---------------------------------------------------------------- */
        var heroRegion = byId("sec-hero");
        var coverEl = byId("sec-cover");
        var pendingReveal = [];
        var io = null;

        var markIn = function (el) {
          if (!el || el.classList.contains("in-view")) {
            return;
          }
          el.classList.add("in-view");
        };

        function revealHero() {
          if (!heroRegion || heroRegion.classList.contains("in-view")) {
            return;
          }
          heroRegion.classList.add("in-view");
        }

        var registerReveal = function (el) {
          if (!el) {
            return;
          }
          if (io) {
            pendingReveal.push(el);
            io.observe(el);
          } else {
            markIn(el);
          }
        };

        if ("IntersectionObserver" in w) {
          io = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                  return;
                }
                markIn(entry.target);
                io.unobserve(entry.target);
                var at = pendingReveal.indexOf(entry.target);
                if (at > -1) {
                  pendingReveal.splice(at, 1);
                }
              });
            },
            { threshold: 0, rootMargin: "0px 0px -45% 0px" },
          );

          Array.prototype.forEach.call(
            d.querySelectorAll(".reveal"),
            function (el) {
              if (heroRegion && heroRegion.contains(el)) {
                return;
              }
              if (coverEl && coverEl.contains(el)) {
                return;
              }
              registerReveal(el);
            },
          );
        } else {
          Array.prototype.forEach.call(
            d.querySelectorAll("body > header, body > section, body > footer"),
            function (region) {
              if (region === coverEl) {
                return;
              }
              if (region === heroRegion) {
                return;
              }
              markIn(region);
            },
          );
        }

        var releaseTail = function () {
          if (
            w.innerHeight + w.pageYOffset <
            d.documentElement.scrollHeight - 4
          ) {
            return;
          }
          pendingReveal.slice().forEach(function (el) {
            markIn(el);
            if (io) {
              io.unobserve(el);
            }
          });
          pendingReveal.length = 0;
        };

        /* ---------------------------------------------------------------
     TUDUNG SAJI — animasi pembuka
  ---------------------------------------------------------------- */
        var coverBtn = byId("cover-open-btn");
        var coverOpened = false;

        var isCoverAlreadyOpened = function () {
          try {
            var k = w.__MEJA_KOKI_STORAGE_KEY__ || "invitation_opened_mejakoki";
            if (w.sessionStorage && w.sessionStorage.getItem(k) === "true") {
              return true;
            }
          } catch (e) {}
          if (!coverEl) {
            return true;
          }
          if (
            coverEl.style.display === "none" ||
            coverEl.classList.contains("is-open") ||
            coverEl.classList.contains("is-gone")
          ) {
            return true;
          }
          return false;
        };

        var finishCover = function (ev) {
          if (!coverEl) {
            return;
          }
          if (ev && (ev.target !== coverEl || ev.propertyName !== "opacity")) {
            return;
          }
          if (coverEl.classList.contains("is-gone")) {
            coverEl.style.display = "none";
          }
          coverEl.removeEventListener("transitionend", finishCover);
        };

        var openCover = function () {
          if (coverOpened || !coverEl) {
            return;
          }
          coverOpened = true;
          try {
            var k = w.__MEJA_KOKI_STORAGE_KEY__ || "invitation_opened_mejakoki";
            if (w.sessionStorage) {
              w.sessionStorage.setItem(k, "true");
            }
          } catch (e) {}
          coverEl.classList.add("is-open");
          coverEl.classList.add("is-gone");
          body.classList.remove("is-locked");
          body.classList.add("is-open");
          try {
            var ma = byId("music-audio");
            var mb = byId("music-btn");
            if (ma && ma.getAttribute("src") && ma.paused) {
              ma.play().then(function () {
                if (mb) mb.classList.add("is-playing");
              })["catch"](function () {});
            }
          } catch (e) {}
          if (reduce) {
            revealHero();
          } else {
            w.setTimeout(revealHero, 240);
          }
          coverEl.addEventListener("transitionend", finishCover);
          w.setTimeout(finishCover, 2200);
          w.setTimeout(function () {
            syncActiveNav(true);
          }, 900);
        };

        if (coverEl && coverBtn) {
          if (isCoverAlreadyOpened()) {
            coverOpened = true;
            coverEl.classList.add("is-open", "is-gone");
            coverEl.style.display = "none";
            body.classList.remove("is-locked");
            body.classList.add("is-open");
            revealHero();
          } else {
            body.classList.add("is-locked");
            body.classList.remove("is-open");
            coverBtn.addEventListener("click", openCover);
            coverEl.addEventListener("click", function (ev) {
              if (ev.target === coverBtn) {
                return;
              }
              openCover();
            });
          }
        } else {
          body.classList.remove("is-locked");
          body.classList.add("is-open");
          revealHero();
        }

        /* ---------------------------------------------------------------
     LAPISAN LATAR — bara rempah yang naik pelan
  ---------------------------------------------------------------- */
        var canvas = byId("bg-particles");
        var spot = byId("bg-spot");
        if (canvas && canvas.getContext) {
          var ctx = canvas.getContext("2d");
          var motes = [];
          var dpr = 1;
          var rafId = 0;
          var running = false;

          var sizeCanvas = function () {
            dpr = Math.min(w.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(w.innerWidth * dpr);
            canvas.height = Math.floor(w.innerHeight * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          };

          var spawn = function () {
            var count = w.innerWidth < 560 ? 34 : 58;
            motes = [];
            for (var i = 0; i < count; i += 1) {
              motes.push({
                x: Math.random() * w.innerWidth,
                y: Math.random() * w.innerHeight,
                r: 0.6 + Math.random() * 1.9,
                vy: 0.12 + Math.random() * 0.42,
                drift: 0.2 + Math.random() * 0.7,
                phase: Math.random() * 6.28,
                warm: Math.random() > 0.62,
                a: 0.16 + Math.random() * 0.4,
              });
            }
          };

          var paint = function () {
            ctx.clearRect(0, 0, w.innerWidth, w.innerHeight);
            for (var i = 0; i < motes.length; i += 1) {
              var p = motes[i];
              p.y -= p.vy;
              p.phase += 0.01;
              p.x += Math.sin(p.phase) * p.drift * 0.32;
              if (p.y < -12) {
                p.y = w.innerHeight + 10;
                p.x = Math.random() * w.innerWidth;
              }
              ctx.globalAlpha = p.a;
              ctx.fillStyle = p.warm ? "#ffb264" : "#f0e2c6";
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.r, 0, 6.2832);
              ctx.fill();
            }
            ctx.globalAlpha = 1;
          };

          var loop = function () {
            paint();
            rafId = w.requestAnimationFrame(loop);
          };

          var start = function () {
            if (running || reduce) {
              return;
            }
            running = true;
            rafId = w.requestAnimationFrame(loop);
          };
          var stop = function () {
            running = false;
            if (rafId) {
              w.cancelAnimationFrame(rafId);
              rafId = 0;
            }
          };

          sizeCanvas();
          spawn();
          paint();
          if (!reduce) {
            start();
          }

          w.addEventListener("resize", function () {
            sizeCanvas();
            spawn();
            if (!running) {
              paint();
            }
          });
          d.addEventListener("visibilitychange", function () {
            if (d.hidden) {
              stop();
            } else {
              start();
            }
          });
          if (mq && mq.addEventListener) {
            mq.addEventListener("change", function (ev) {
              reduce = ev.matches;
              if (reduce) {
                stop();
                paint();
              } else {
                start();
              }
            });
          }
        }

        if (spot && w.matchMedia && w.matchMedia("(hover:hover)").matches) {
          w.addEventListener(
            "pointermove",
            function (ev) {
              spot.style.transform =
                "translate3d(" + ev.clientX + "px," + ev.clientY + "px,0)";
            },
            { passive: true },
          );
        }
        /* ---------------------------------------------------------------
     PENGHITUNG WAKTU DAPUR
  ---------------------------------------------------------------- */
        var cdSection = byId("sec-countdown");
        var cdEls = {
          d: byId("cd-days"),
          h: byId("cd-hours"),
          m: byId("cd-mins"),
          s: byId("cd-secs"),
        };
        var cdTimer = 0;

        var setNum = function (el, val) {
          if (!el) {
            return;
          }
          var next = pad2(val);
          if (el.textContent === next) {
            return;
          }
          el.textContent = next;
          if (reduce) {
            return;
          }
          el.classList.remove("tick");
          void el.offsetWidth;
          el.classList.add("tick");
        };

        var tickCountdown = function () {
          var left = weddingAt.getTime() - Date.now();
          if (left <= 0) {
            setNum(cdEls.d, 0);
            setNum(cdEls.h, 0);
            setNum(cdEls.m, 0);
            setNum(cdEls.s, 0);
            if (cdSection) {
              cdSection.classList.add("is-served");
            }
            if (cdTimer) {
              w.clearInterval(cdTimer);
              cdTimer = 0;
            }
            return;
          }
          if (cdSection) {
            cdSection.classList.remove("is-served");
          }
          var totalSec = Math.floor(left / 1000);
          setNum(cdEls.d, Math.floor(totalSec / 86400));
          setNum(cdEls.h, Math.floor((totalSec % 86400) / 3600));
          setNum(cdEls.m, Math.floor((totalSec % 3600) / 60));
          setNum(cdEls.s, totalSec % 60);
        };

        tickCountdown();
        cdTimer = w.setInterval(tickCountdown, 1000);

        /* ---------------------------------------------------------------
     SIMPAN RESERVASI KE KALENDER
  ---------------------------------------------------------------- */
        var calBtn = byId("cd-cal");
        if (calBtn) {
          calBtn.addEventListener("click", function () {
            var customUrl = calBtn.getAttribute("data-cal-url");
            if (customUrl && customUrl.trim()) {
              w.open(customUrl.trim(), "_blank", "noopener,noreferrer");
              return;
            }
            var groomEl = byId("hero-name-groom");
            var brideEl = byId("hero-name-bride");
            var venueEl = byId("venue-name");
            var addrEl = byId("venue-address");
            var groom = groomEl ? groomEl.textContent.trim() : "";
            var bride = brideEl ? brideEl.textContent.trim() : "";
            var place = [
              venueEl ? venueEl.textContent.trim() : "",
              addrEl ? addrEl.textContent.trim() : "",
            ]
              .filter(function (v) {
                return !isBlank(v);
              })
              .join(", ");
            var stamp = function (dt) {
              return dt
                .toISOString()
                .replace(/[-:]/g, "")
                .replace(/\.\d{3}/, "");
            };
            var ends = new Date(weddingAt.getTime() + 3 * 3600 * 1000);
            var title =
              "Pernikahan " +
              (isBlank(groom) ? "" : groom) +
              " & " +
              (isBlank(bride) ? "" : bride);
            var url =
              "https://calendar.google.com/calendar/render?action=TEMPLATE" +
              "&text=" +
              encodeURIComponent(title.trim() || "Pernikahan Kami") +
              "&dates=" +
              stamp(weddingAt) +
              "/" +
              stamp(ends) +
              "&details=" +
              encodeURIComponent("Meja Sang Koki — satu malam, satu kisah.") +
              "&location=" +
              encodeURIComponent(place);
            w.open(url, "_blank", "noopener,noreferrer");
          });
        }

        /* ---------------------------------------------------------------
     KARTU BAHAN — flip 3D
  ---------------------------------------------------------------- */
        Array.prototype.forEach.call(
          d.querySelectorAll(".ing-card"),
          function (card) {
            var flip = function () {
              var on = card.classList.toggle("is-flipped");
              card.setAttribute("aria-pressed", on ? "true" : "false");
            };
            card.addEventListener("click", flip);
            card.addEventListener("keydown", function (ev) {
              if (
                ev.key === "Enter" ||
                ev.key === " " ||
                ev.key === "Spacebar"
              ) {
                ev.preventDefault();
                flip();
              }
            });
          },
        );

        /* ---------------------------------------------------------------
     MENU DEGUSTASI — sembunyikan sajian yang belum diisi
  ---------------------------------------------------------------- */
        var stepWords = [
          "Sajian Pertama",
          "Sajian Kedua",
          "Sajian Ketiga",
          "Sajian Keempat",
        ];
        var romans = ["I", "II", "III", "IV"];
        var liveCourses = [];
        [1, 2, 3, 4].forEach(function (i) {
          var art = byId("course-" + i);
          if (!art) {
            return;
          }
          var nameEl = byId("course-name-" + i);
          var storyEl = byId("course-story-" + i);
          var pairEl = byId("course-pairing-" + i);
          var blank =
            isBlank(nameEl ? nameEl.textContent : "") &&
            isBlank(storyEl ? storyEl.textContent : "");
          if (blank) {
            art.style.display = "none";
            return;
          }
          if (pairEl && isBlank(pairEl.textContent)) {
            pairEl.style.display = "none";
          }
          if (storyEl && isBlank(storyEl.textContent)) {
            storyEl.style.display = "none";
          }
          liveCourses.push(i);
        });
        liveCourses.forEach(function (i, idx) {
          var stepEl = byId("course-step-" + i);
          var noEl = byId("course-no-" + i);
          if (noEl) {
            noEl.textContent = romans[idx] || String(idx + 1);
          }
          if (!stepEl) {
            return;
          }
          if (liveCourses.length > 1 && idx === liveCourses.length - 1) {
            stepEl.textContent = "Sajian Penutup";
          } else {
            stepEl.textContent = stepWords[idx] || "Sajian Berikutnya";
          }
        });

        /* ---------------------------------------------------------------
     RESEP RUMAH TANGGA — daftar bahan interaktif
  ---------------------------------------------------------------- */
        var readLines = function (el, stripOrdinal) {
          if (!el) {
            return [];
          }
          var raw = el.textContent || "";
          if (isBlank(raw)) {
            return [];
          }
          return raw
            .split(/\r?\n|•|;/)
            .map(function (line) {
              var text = line.replace(/^\s*[-*•·]+\s*/, "").trim();
              if (stripOrdinal) {
                text = text.replace(/^\d{1,2}[.)]\s+/, "");
              }
              return text;
            })
            .filter(function (line) {
              return line.length > 0;
            });
        };

        var defaultIngLines = [
          "200 gram kesabaran, disaring halus",
          "3 sendok makan tawa sebelum tidur",
          "1 genggam maaf yang tidak ditunda",
          "1 batang kejujuran, memarkan",
          "Secukupnya doa dari kedua keluarga",
          "Sejumput rindu untuk hari-hari sibuk"
        ];
        var defaultStepLines = [
          "Panaskan niat di atas api kecil, jangan terburu-buru.",
          "Masukkan kesabaran, aduk searah sampai harum.",
          "Tuang tawa sedikit demi sedikit agar tidak pecah.",
          "Bumbui dengan maaf setiap kali terasa gosong.",
          "Sajikan hangat setiap hari, untuk berdua."
        ];

        var ingLines = readLines(byId("resep-src-ing"));
        if (!ingLines.length) {
          ingLines = defaultIngLines;
        }
        var stepLines = readLines(byId("resep-src-steps"), true);
        if (!stepLines.length) {
          stepLines = defaultStepLines;
        }

        var ingList = byId("resep-ing-list");
        var stepList = byId("resep-step-list");
        var potFill = byId("pot-fill");
        var resepCard = byId("resep-card");
        var countEl = byId("resep-count");
        var totalEl = byId("resep-total");
        var checkedCount = 0;

        var getEffectiveTotal = function () {
          var chips = ingList ? ingList.querySelectorAll(".ing-chip") : [];
          return chips.length || ingLines.length || 6;
        };

        var syncPot = function () {
          var total = getEffectiveTotal();
          var ratio = total ? checkedCount / total : 0;
          if (potFill) {
            potFill.style.setProperty("--fill", String(ratio));
          }
          if (countEl) {
            countEl.textContent = String(checkedCount);
          }
          if (totalEl) {
            totalEl.textContent = String(total);
          }
          if (resepCard) {
            resepCard.classList.toggle(
              "is-complete",
              total > 0 && checkedCount >= total,
            );
          }
        };

        if (ingList) {
          var existingChips = ingList.querySelectorAll(".ing-chip");
          if (existingChips && existingChips.length > 0) {
            Array.prototype.forEach.call(existingChips, function (btn) {
              if (!btn.getAttribute("data-bound")) {
                btn.setAttribute("data-bound", "true");
                btn.addEventListener("click", function () {
                  var on = btn.classList.toggle("is-checked");
                  btn.setAttribute("aria-pressed", on ? "true" : "false");
                  checkedCount += on ? 1 : -1;
                  if (checkedCount < 0) {
                    checkedCount = 0;
                  }
                  syncPot();
                });
              }
            });
            syncPot();
          } else if (ingLines.length) {
            ingList.innerHTML = "";
            ingLines.forEach(function (line, idx) {
              var li = d.createElement("li");
              li.id = "resep-ing-item-" + (idx + 1);
              var btn = d.createElement("button");
              btn.type = "button";
              btn.className = "ing-chip";
              btn.id = "resep-ing-chip-" + (idx + 1);
              btn.setAttribute("aria-pressed", "false");
              btn.setAttribute("data-bound", "true");
              var box = d.createElement("span");
              box.className = "ing-box";
              box.id = "resep-ing-box-" + (idx + 1);
              box.innerHTML =
                '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8.6l4 4L14 3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
              var txt = d.createElement("span");
              txt.className = "ing-txt";
              txt.id = "resep-ing-txt-" + (idx + 1);
              txt.textContent = line;
              btn.appendChild(box);
              btn.appendChild(txt);
              btn.addEventListener("click", function () {
                var on = btn.classList.toggle("is-checked");
                btn.setAttribute("aria-pressed", on ? "true" : "false");
                checkedCount += on ? 1 : -1;
                if (checkedCount < 0) {
                  checkedCount = 0;
                }
                syncPot();
              });
              li.appendChild(btn);
              ingList.appendChild(li);
            });
            syncPot();
          }
        }

        if (stepList) {
          var existingSteps = stepList.querySelectorAll(".resep-step, li");
          if (!existingSteps || existingSteps.length === 0) {
            stepList.innerHTML = "";
            stepLines.forEach(function (line, idx) {
              var li = d.createElement("li");
              li.className = "resep-step";
              li.id = "resep-step-item-" + (idx + 1);
              li.textContent = line;
              stepList.appendChild(li);
            });
          }
        }

        var resepSection = byId("sec-resep");
        if (resepSection) {
          resepSection.style.display = "";
        }

        /* ---------------------------------------------------------------
     UJI RASA TAMU
  ---------------------------------------------------------------- */
        var cicipResult = byId("cicip-result");
        var cicipDish = byId("cicip-dish");
        var cicipNote = byId("cicip-note");
        var cicipBtns = d.querySelectorAll(".cicip-btn");
        var cicipMap = {};
        Array.prototype.forEach.call(
          d.querySelectorAll("#cicip-data [data-flavor]"),
          function (node) {
            cicipMap[node.getAttribute("data-flavor")] = {
              name: node.getAttribute("data-name") || "",
              note: node.textContent || "",
            };
          },
        );

        Array.prototype.forEach.call(cicipBtns, function (btn) {
          var flavor = btn.getAttribute("data-flavor");
          var entry = cicipMap[flavor];
          if (!entry || (isBlank(entry.name) && isBlank(entry.note))) {
            btn.style.display = "none";
            return;
          }
          btn.addEventListener("click", function () {
            Array.prototype.forEach.call(cicipBtns, function (other) {
              other.classList.remove("is-picked");
              other.setAttribute("aria-pressed", "false");
            });
            btn.classList.add("is-picked");
            btn.setAttribute("aria-pressed", "true");
            if (cicipDish) {
              cicipDish.textContent = isBlank(entry.name)
                ? "Sajian Spesial"
                : entry.name;
            }
            if (cicipNote) {
              cicipNote.textContent = entry.note;
            }
            if (cicipResult) {
              cicipResult.classList.remove("is-on");
              void cicipResult.offsetWidth;
              cicipResult.classList.add("is-on");
            }
          });
        });

        /* ---------------------------------------------------------------
     ETIKET MEJA — hanya tampilkan swatch yang terisi
  ---------------------------------------------------------------- */
        var dcChipsWrap = byId("dc-chips");
        var liveChips = 0;
        Array.prototype.forEach.call(
          d.querySelectorAll(".dc-chip"),
          function (chip) {
            var val = (chip.getAttribute("data-color") || "").trim();
            if (
              !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(val) &&
              !/^(rgb|hsl)/i.test(val)
            ) {
              chip.style.display = "none";
              return;
            }
            liveChips += 1;
          },
        );
        if (dcChipsWrap && liveChips === 0) {
          dcChipsWrap.style.display = "none";
        }
        var dcTextEl = byId("dc-text");
        var dcSection = byId("sec-dresscode");
        if (
          dcSection &&
          dcTextEl &&
          isBlank(dcTextEl.textContent) &&
          liveChips === 0
        ) {
          dcSection.style.display = "none";
        }

        /* ---------------------------------------------------------------
     ACARA KEDUA — hanya muncul bila diisi
  ---------------------------------------------------------------- */
        var chit2 = byId("chit-2");
        if (chit2) {
          chit2.classList.add("is-on");
          chit2.style.display = "block";
          var chitLink = byId("chit-link");
          if (chitLink) {
            chitLink.style.display = "block";
          }
          var e2Date = (chit2.getAttribute("data-date") || "").trim();
          var e2Time = (chit2.getAttribute("data-time") || "").trim();
          var e2DateEl = byId("chit-2-date");
          var e2TimeEl = byId("chit-2-time");

          if (e2Date && e2DateEl && isBlank(e2DateEl.textContent)) {
            var parsed = new Date(
              e2Date + "T" + (isBlank(e2Time) ? "00:00" : e2Time) + ":00",
            );
            if (parsed && !isNaN(parsed.getTime())) {
              e2DateEl.textContent = fmtDate(parsed);
            }
          }

          if (e2Time && e2TimeEl && isBlank(e2TimeEl.textContent)) {
            var t2 = fmtHM(e2Time);
            if (t2) {
              e2TimeEl.textContent = t2 + " WIB — selesai";
            }
          }
        }
        /* ---------------------------------------------------------------
     PAPAN PESANAN DAPUR (rundown)
  ---------------------------------------------------------------- */
        var rundownSection = byId("sec-rundown");
        var rundownRail = byId("rundown-rail");
        var rundownItems = [];
        try {
          var rawRundown = d.getElementById("wedivo-rundown-data");
          rundownItems = JSON.parse(
            (rawRundown ? rawRundown.textContent : "") || "[]",
          );
          if (!Array.isArray(rundownItems)) {
            rundownItems = [];
          }
        } catch (err) {
          rundownItems = [];
        }

        var motifFor = function (hint) {
          var paths = {
            heart:
              "M12 20c5-3.6 8-7 8-11a4 4 0 00-8-1.6A4 4 0 004 9c0 4 3 7.4 8 11z",
            users:
              "M4 20c0-3.4 2.7-6 6-6s6 2.6 6 6M10 11a3.4 3.4 0 100-6.8 3.4 3.4 0 000 6.8M17 20c0-2.6-1-4.6-2.6-5.6",
            utensils: "M7 3v7m3-7v7m-3 3v8m0-11h3v11M17 3c2 3 2 7 0 9v8",
            camera:
              "M4 8h4l1.4-2h5.2L16 8h4v12H4zM12 17a3.6 3.6 0 100-7.2 3.6 3.6 0 000 7.2",
            cake: "M5 20h14v-7H5zM5 13c1.8 0 1.8 2 3.6 2s1.8-2 3.6-2 1.8 2 3.6 2 1.8-2 3.2-2M12 4v5",
            music:
              "M9 18V6l10-2v12M9 18a2.4 2.4 0 11-4.8 0A2.4 2.4 0 019 18m10-2a2.4 2.4 0 11-4.8 0 2.4 2.4 0 014.8 0",
            gift: "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-3 0-4-1-4-2.4S9.6 3 12 7c0-4 2.4-3.8 4-2.4S15 7 12 7z",
            sparkles:
              "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
            clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
            car: "M4 16v3h3v-3m10 0v3h3v-3M3 16h18l-1.6-5.4A2 2 0 0017.5 9h-11a2 2 0 00-1.9 1.6z",
            shirt: "M8 3l4 2 4-2 4 3-2.6 3V21H6.6V9L4 6z",
            star: "M12 3l2.6 6.2 6.4.5-4.9 4.2 1.5 6.3L12 16.8 6.4 20.2l1.5-6.3L3 9.7l6.4-.5z",
          };
          return paths[hint] || "M12 3l4 9-4 9-4-9z";
        };

        if (rundownRail && rundownItems.length) {
          var groups = [];
          rundownItems.forEach(function (item) {
            var key = item && item.date ? item.date : "";
            var last = groups[groups.length - 1];
            if (!last || last.date !== key) {
              groups.push({ date: key, items: [item] });
            } else {
              last.items.push(item);
            }
          });

          groups.forEach(function (group, gi) {
            var dayWrap = d.createElement("div");
            dayWrap.className = "rd-day";
            dayWrap.id = "rd-day-" + (gi + 1);

            var bar = d.createElement("span");
            bar.className = "rd-day-bar";
            bar.id = "rd-day-bar-" + (gi + 1);
            dayWrap.appendChild(bar);

            if (group.date) {
              var parsedDay = new Date(group.date + "T00:00:00");
              if (!isNaN(parsedDay.getTime())) {
                var dateTag = d.createElement("p");
                dateTag.className = "rd-date reveal drop";
                dateTag.id = "rd-date-" + (gi + 1);
                dateTag.textContent = fmtDate(parsedDay);
                dayWrap.appendChild(dateTag);
                registerReveal(dateTag);
              }
            }

            var list = d.createElement("div");
            list.className = "rd-items";
            list.id = "rd-items-" + (gi + 1);

            group.items.forEach(function (item, ii) {
              var card = d.createElement("article");
              card.className = "rd-item reveal lift";
              card.id = "rd-item-" + (gi + 1) + "-" + (ii + 1);

              var clip = d.createElement("span");
              clip.className = "rd-clip";
              clip.id = "rd-clip-" + (gi + 1) + "-" + (ii + 1);
              card.appendChild(clip);

              var motif = d.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg",
              );
              motif.setAttribute("viewBox", "0 0 24 24");
              motif.setAttribute("fill", "none");
              motif.setAttribute("aria-hidden", "true");
              motif.setAttribute("class", "rd-motif");
              motif.id = "rd-motif-" + (gi + 1) + "-" + (ii + 1);
              motif.innerHTML =
                '<path d="' +
                motifFor(item && item.icon ? String(item.icon) : "") +
                '" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>';
              card.appendChild(motif);

              var timeP = d.createElement("p");
              timeP.className = "rd-time";
              timeP.id = "rd-time-" + (gi + 1) + "-" + (ii + 1);
              timeP.innerHTML =
                '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
              var timeText = d.createElement("span");
              timeText.id = "rd-timetxt-" + (gi + 1) + "-" + (ii + 1);
              if (item && item.isAllDay) {
                timeText.textContent = "Sepanjang hari";
              } else {
                var startTxt = fmtHM(item ? item.startTime : "");
                var endTxt = fmtHM(item ? item.endTime : "");
                timeText.textContent = startTxt
                  ? (endTxt ? startTxt + " – " + endTxt : startTxt) + " WIB"
                  : "";
              }
              if (timeText.textContent) {
                timeP.appendChild(timeText);
                card.appendChild(timeP);
              }

              var titleEl = d.createElement("h3");
              titleEl.className = "rd-title";
              titleEl.id = "rd-title-" + (gi + 1) + "-" + (ii + 1);
              titleEl.textContent = item && item.title ? item.title : "Sajian";
              card.appendChild(titleEl);

              if (item && item.description) {
                var descEl = d.createElement("p");
                descEl.className = "rd-desc";
                descEl.id = "rd-desc-" + (gi + 1) + "-" + (ii + 1);
                descEl.textContent = item.description;
                card.appendChild(descEl);
              }

              if (item && item.location) {
                var locEl = d.createElement("p");
                locEl.className = "rd-loc";
                locEl.id = "rd-loc-" + (gi + 1) + "-" + (ii + 1);
                locEl.innerHTML =
                  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" stroke-width="1.4"/></svg>';
                var locTxt = d.createElement("span");
                locTxt.id = "rd-loctxt-" + (gi + 1) + "-" + (ii + 1);
                locTxt.textContent = item.location;
                locEl.appendChild(locTxt);
                card.appendChild(locEl);
              }

              list.appendChild(card);
              registerReveal(card);
            });

            dayWrap.appendChild(list);
            rundownRail.appendChild(dayWrap);
          });
        } else if (rundownSection) {
          rundownSection.style.display = "none";
        }

        /* ---------------------------------------------------------------
     GALERI + PENAMPIL FOTO
  ---------------------------------------------------------------- */
        var galleryUrls = (window.__MEJA_KOKI_GALLERY_URLS__ && Array.isArray(window.__MEJA_KOKI_GALLERY_URLS__) && window.__MEJA_KOKI_GALLERY_URLS__.length > 0)
          ? window.__MEJA_KOKI_GALLERY_URLS__.filter(isUrl)
          : [
              "https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/prewedding/1790836795_908c34a7.jpg",
              "https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/prewedding/1790836796_80b969de.jpg",
              "https://wedivo.id/uploads/PaqKKqe1mjcttlp7BhAqMiY7tsk2/prewedding/1790836796_8d267664.jpg",
            ].filter(isUrl);

        var gallerySection = byId("sec-gallery");
        var galleryGrid = byId("gallery-grid");
        var galleryEmpty = byId("gallery-empty");
        var viewer = byId("viewer");
        var viewerImg = byId("viewer-img");
        var viewerPrev = byId("viewer-prev");
        var viewerNext = byId("viewer-next");
        var viewerClose = byId("viewer-close");
        var viewerCount = byId("viewer-count");
        var currentIndex = 0;

        var showViewer = function (index) {
          if (!viewer || !viewerImg || !galleryUrls.length) {
            return;
          }
          currentIndex = (index + galleryUrls.length) % galleryUrls.length;
          viewerImg.src = galleryUrls[currentIndex];
          if (viewerCount) {
            viewerCount.textContent =
              currentIndex + 1 + " / " + galleryUrls.length;
          }
          viewer.classList.add("is-open");
          viewer.setAttribute("aria-hidden", "false");
          body.classList.add("is-locked");
        };
        var hideViewer = function () {
          if (!viewer) {
            return;
          }
          viewer.classList.remove("is-open");
          viewer.setAttribute("aria-hidden", "true");
          body.classList.remove("is-locked");
        };

        if (galleryGrid && galleryUrls.length) {
          if (viewer && galleryUrls.length <= 1) {
            viewer.classList.add("single");
          }
          galleryUrls.forEach(function (url, idx) {
            var cell = d.createElement("button");
            cell.type = "button";
            cell.className = "g-cell reveal pop";
            cell.id = "g-cell-" + (idx + 1);
            cell.style.setProperty("--rot", ((idx % 4) - 1.5) * 1.1 + "deg");
            cell.style.transitionDelay = Math.min(idx * 0.06, 0.48) + "s";
            cell.setAttribute("aria-label", "Buka foto nomor " + (idx + 1));

            var tape = d.createElement("span");
            tape.className = "g-tape";
            tape.id = "g-tape-" + (idx + 1);
            cell.appendChild(tape);

            var img = d.createElement("img");
            img.className = "g-cell-img";
            img.id = "g-img-" + (idx + 1);
            img.src = url;
            img.loading = "lazy";
            img.alt = "Foto galeri nomor " + (idx + 1);
            cell.appendChild(img);

            var cap = d.createElement("span");
            cap.className = "g-cell-cap";
            cap.id = "g-cap-" + (idx + 1);
            cap.textContent = "no. " + pad2(idx + 1);
            cell.appendChild(cap);

            cell.addEventListener("click", function () {
              showViewer(idx);
            });
            galleryGrid.appendChild(cell);
            registerReveal(cell);
          });
        } else {
          if (gallerySection) {
            gallerySection.style.display = "none";
          }
          if (galleryEmpty) {
            galleryEmpty.style.display = "block";
          }
        }

        if (viewerPrev) {
          viewerPrev.addEventListener("click", function () {
            showViewer(currentIndex - 1);
          });
        }
        if (viewerNext) {
          viewerNext.addEventListener("click", function () {
            showViewer(currentIndex + 1);
          });
        }
        if (viewerClose) {
          viewerClose.addEventListener("click", hideViewer);
        }
        if (viewer) {
          viewer.addEventListener("click", function (ev) {
            if (ev.target === viewer) {
              hideViewer();
            }
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
              if (Math.abs(dx) < 46 || galleryUrls.length <= 1) {
                return;
              }
              showViewer(currentIndex + (dx < 0 ? 1 : -1));
            },
            { passive: true },
          );
        }
        d.addEventListener("keydown", function (ev) {
          if (!viewer || !viewer.classList.contains("is-open")) {
            return;
          }
          if (ev.key === "Escape") {
            hideViewer();
          }
          if (galleryUrls.length <= 1) {
            return;
          }
          if (ev.key === "ArrowLeft") {
            showViewer(currentIndex - 1);
          }
          if (ev.key === "ArrowRight") {
            showViewer(currentIndex + 1);
          }
        });

        /* ---------------------------------------------------------------
     NAVIGASI "THE PASS"
  ---------------------------------------------------------------- */
        var navRoot = byId("nav-pass");
        var navRail = byId("nav-rail");
        var navItems = navRoot
          ? Array.prototype.slice.call(
              navRoot.querySelectorAll("[data-nav-target]"),
            )
          : [];
        var navPairs = [];
        var activeNavId = "";
        var navLockUntil = 0;
        var centerTimer = 0;

        navItems.forEach(function (item) {
          var id = item.getAttribute("data-nav-target");
          var target = d.querySelector('[data-section="' + id + '"]');
          if (!target || target.style.display === "none") {
            item.style.display = "none";
            return;
          }
          navPairs.push({ id: id, item: item, target: target });
        });

        var centerNavItem = function (item) {
          if (!navRail || !item || item.style.display === "none") {
            return;
          }
          if (navRail.scrollWidth <= navRail.clientWidth + 2) {
            return;
          }
          var railBox = navRail.getBoundingClientRect();
          var itemBox = item.getBoundingClientRect();
          var goal =
            navRail.scrollLeft +
            (itemBox.left - railBox.left - navRail.clientLeft) -
            (navRail.clientWidth - itemBox.width) / 2;
          goal = Math.max(
            0,
            Math.min(goal, navRail.scrollWidth - navRail.clientWidth),
          );
          if (Math.abs(goal - navRail.scrollLeft) < 2) {
            return;
          }
          if (navRail.scrollTo) {
            navRail.scrollTo({
              left: goal,
              behavior: reduce ? "auto" : "smooth",
            });
          } else {
            navRail.scrollLeft = goal;
          }
        };

        var scheduleCenter = function (item) {
          if (centerTimer) {
            w.clearTimeout(centerTimer);
          }
          centerTimer = w.setTimeout(function () {
            centerNavItem(item);
          }, 180);
        };

        function syncActiveNav(force) {
          if (!navPairs.length) {
            return;
          }
          if (!force && navLockUntil > Date.now()) {
            return;
          }
          var line = w.innerHeight * 0.35;
          var current = navPairs[0].id;
          navPairs.forEach(function (pair) {
            if (pair.target.getBoundingClientRect().top <= line) {
              current = pair.id;
            }
          });
          if (current === activeNavId && !force) {
            return;
          }
          activeNavId = current;
          var activeItem = null;
          navPairs.forEach(function (pair) {
            var on = pair.id === activeNavId;
            pair.item.classList.toggle("is-active", on);
            if (on) {
              activeItem = pair.item;
            }
          });
          if (activeItem) {
            scheduleCenter(activeItem);
          }
        }

        if (navRoot) {
          navRoot.addEventListener("click", function (ev) {
            var item =
              ev.target && ev.target.closest
                ? ev.target.closest("[data-nav-target]")
                : null;
            if (!item || !navRoot.contains(item)) {
              return;
            }
            ev.preventDefault();
            var id = item.getAttribute("data-nav-target");
            var target = d.querySelector('[data-section="' + id + '"]');
            if (!target || target.style.display === "none") {
              return;
            }
            activeNavId = id;
            navPairs.forEach(function (pair) {
              pair.item.classList.toggle("is-active", pair.id === id);
            });
            if (centerTimer) {
              w.clearTimeout(centerTimer);
              centerTimer = 0;
            }
            centerNavItem(item);
            navLockUntil = Date.now() + 950;
            var top = target.getBoundingClientRect().top + w.pageYOffset - 10;
            if (w.scrollTo) {
              w.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
            } else {
              w.scrollTo(0, top);
            }
            w.setTimeout(function () {
              syncActiveNav(true);
            }, 1000);
          });
          w.addEventListener("resize", function () {
            var active = navPairs.filter(function (pair) {
              return pair.id === activeNavId;
            })[0];
            if (active) {
              scheduleCenter(active.item);
            }
          });
        }

        /* ---------------------------------------------------------------
     MUSIK LATAR
  ---------------------------------------------------------------- */
        var musicDock = byId("music-dock");
        var musicAudio = byId("music-audio");
        var musicBtn = byId("music-btn");
        var musicSrc = musicAudio ? musicAudio.getAttribute("src") : "";
        if (!isUrl(musicSrc)) {
          if (musicAudio) {
            musicAudio.removeAttribute("src");
          }
          if (musicDock) {
            musicDock.style.display = "none";
          }
        } else if (musicBtn && musicAudio) {
          var setPlaying = function (on) {
            musicBtn.classList.toggle("is-playing", on);
            musicBtn.setAttribute("aria-pressed", on ? "true" : "false");
          };

          var toggleMusic = function (ev) {
            if (ev) {
              ev.preventDefault();
              ev.stopPropagation();
            }
            if (musicAudio.paused) {
              var p = musicAudio.play();
              if (p && p.then) {
                p.then(function () {
                  setPlaying(true);
                })["catch"](function () {
                  setPlaying(false);
                });
              } else {
                setPlaying(true);
              }
            } else {
              musicAudio.pause();
              setPlaying(false);
            }
          };

          musicBtn.onclick = toggleMusic;

          musicAudio.onpause = function () {
            setPlaying(false);
          };
          musicAudio.onplay = function () {
            setPlaying(true);
          };
        }

        /* ---------------------------------------------------------------
     SATU PENDENGAR SCROLL UNTUK SEMUANYA
  ---------------------------------------------------------------- */
        var ticking = false;
        var onScroll = function () {
          if (ticking) {
            return;
          }
          ticking = true;
          w.requestAnimationFrame(function () {
            syncActiveNav(false);
            releaseTail();
            ticking = false;
          });
        };
        w.addEventListener("scroll", onScroll, { passive: true });
        w.addEventListener("resize", onScroll, { passive: true });
        syncActiveNav(true);
        releaseTail();
      })();
};
