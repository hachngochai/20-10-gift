// ======================================================
// APP
// ======================================================

// Xóa tiến trình cũ mỗi lần reload
localStorage.removeItem("20oct-v3-visited");
localStorage.removeItem("20oct-v4-visited");

const App = {
  current: "intro",
  busy: false,

  // Mỗi lần reload sẽ bắt đầu lại từ 0/4
  visited: [],

  init() {
    this.bindNavigation();
    this.initCursor();
    this.initParticles();
    this.initMusic();
    this.initHelp();
    this.initCompletionModal();
    this.syncConfig();
    this.updateProgress();

    window.addEventListener("pagechange", e => {
      this.onPageChange(e.detail.page);
    });
  },

  // ======================================================
  // NAVIGATION
  // ======================================================

  bindNavigation() {
    document.addEventListener("click", e => {
      const target = e.target.closest("[data-go]");
      if (!target) return;

      const page = target.dataset.go;

      if (page) {
        this.go(page);
      }
    });
  },

  go(target) {
    if (this.busy || target === this.current) return;

    const next = document.querySelector(
      `[data-page="${target}"]`
    );

    const old = document.querySelector(
      `[data-page="${this.current}"]`
    );

    if (!next || !old) return;

    // 4 không gian chính
    const core = [
      "letter",
      "women",
      "facts",
      "surprise"
    ];

    // Không cho mở Final khi chưa đi hết 4 cửa
    if (
      target === "final" &&
      !core.every(x => this.visited.includes(x))
    ) {
      this.showToast(
        "Khám phá đủ 4 không gian trước nhé ✦"
      );
      return;
    }

    // Trạng thái trước khi mở cửa hiện tại
    const wasComplete = core.every(x =>
      this.visited.includes(x)
    );

    this.busy = true;

    const transition =
      document.getElementById("transition");

    if (transition) {
      transition.classList.remove("play");

      void transition.offsetWidth;

      transition.classList.add("play");
    }

    // ------------------------------------------------------
    // CHUYỂN TRANG
    // ------------------------------------------------------

    setTimeout(() => {
      old.classList.remove("active");
      next.classList.add("active");

      this.current = target;

      // Nếu đây là 1 trong 4 cửa và chưa mở trước đó
      if (
        core.includes(target) &&
        !this.visited.includes(target)
      ) {
        this.visited.push(target);

        // KHÔNG lưu localStorage
        // => reload là reset về 0/4
        this.updateProgress();
      }

      // Kiểm tra đã đủ 4 chưa
      const isComplete = core.every(x =>
        this.visited.includes(x)
      );

      // Nếu đủ 4 thì mở trạng thái "all-found"
      if (isComplete) {
        document
          .querySelector("[data-page='hub']")
          ?.classList.add("all-found");
      }

      // ----------------------------------------------------
      // VỪA MỞ CỬA THỨ 4 -> HIỆN BOX
      // ----------------------------------------------------

      if (!wasComplete && isComplete) {
        setTimeout(() => {
          this.showCompletionModal();
        }, 500);
      }

      // Báo cho các page khác
      window.dispatchEvent(
        new CustomEvent("pagechange", {
          detail: {
            page: target
          }
        })
      );

    }, 360);

    // ------------------------------------------------------
    // KẾT THÚC TRANSITION
    // ------------------------------------------------------

    setTimeout(() => {
      this.busy = false;

      if (transition) {
        transition.classList.remove("play");
      }
    }, 760);
  },

  // ======================================================
  // PROGRESS 0/4
  // ======================================================

  updateProgress() {
    const core = [
      "letter",
      "women",
      "facts",
      "surprise"
    ];

    const count = core.filter(x =>
      this.visited.includes(x)
    ).length;

    const text =
      document.getElementById("progressText");

    const bar =
      document.getElementById("progressBar");

    const hint =
      document.getElementById("roomHint");

    if (text) {
      text.textContent = `${count} / 4`;
    }

    if (bar) {
      bar.style.width = `${count * 25}%`;
    }

    if (hint) {
      hint.textContent =
        count === 4
          ? "Bạn đã mở tất cả. Cánh cửa cuối cùng đang chờ."
          : `Có ${4 - count} điều còn lại đang đợi bạn chạm tới.`;
    }
  },

  // ======================================================
  // BOX HOÀN THÀNH 4/4
  // ======================================================

  initCompletionModal() {
    const modal =
      document.getElementById("completionModal");

    const close =
      document.getElementById("completionClose");

    if (!modal) return;

    // Nút đóng
    close?.addEventListener("click", () => {
      modal.classList.remove("show");
    });

    // Click ra ngoài box để đóng
    modal.addEventListener("click", e => {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });
  },

  showCompletionModal() {
    const modal =
      document.getElementById("completionModal");

    if (!modal) return;

    modal.classList.add("show");
  },

  // ======================================================
  // PAGE CHANGE
  // ======================================================

  onPageChange(page) {
    if (page === "hub") {
      this.updateProgress();
      Room.init();
    }

    if (page === "letter") {
      LetterPage.init();
    }
  },

  // ======================================================
  // CURSOR
  // ======================================================

  initCursor() {
    const glow =
      document.getElementById("cursorGlow");

    if (!glow) return;

    window.addEventListener("pointermove", e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    });
  },

  // ======================================================
  // PARTICLES
  // ======================================================

  initParticles() {
    const holder =
      document.getElementById("ambientParticles");

    if (!holder) return;

    const symbols = [
      "✦",
      "·",
      "♡",
      "✿",
      "°"
    ];

    setInterval(() => {
      const p = document.createElement("span");

      p.className = "ambient-p";

      p.textContent =
        symbols[
          Math.floor(
            Math.random() * symbols.length
          )
        ];

      p.style.left =
        `${Math.random() * 100}%`;

      p.style.animationDuration =
        `${9 + Math.random() * 10}s`;

      p.style.fontSize =
        `${7 + Math.random() * 9}px`;

      holder.appendChild(p);

      setTimeout(() => {
        p.remove();
      }, 20000);

    }, 850);
  },

  // ======================================================
  // MUSIC
  // ======================================================

  initMusic() {
    const audio =
      document.getElementById("bgMusic");

    const toggle =
      document.getElementById("musicToggle");

    const label =
      document.getElementById("musicLabel");

    if (!audio || !toggle || !label) return;

    let playing = false;

    const play = () => {
      audio.volume = 1;

      audio.play()
        .then(() => {
          playing = true;

          toggle.classList.add("playing");

          label.textContent =
            "TẮT NHẠC";
        })
        .catch(() => {});
    };

    toggle.addEventListener("click", () => {
      if (playing) {
        audio.pause();

        playing = false;

        toggle.classList.remove("playing");

        label.textContent =
          "NHẠC";
      } else {
        play();
      }
    });

    // Tránh play -> pause ngay khi click nút nhạc
    document.addEventListener("pointerdown", e => {
      const target =
        e.target instanceof Element
          ? e.target
          : null;

      if (
        target?.closest(
          "#musicToggle, #helpToggle"
        )
      ) {
        return;
      }

      if (!playing) {
        play();
      }
    });
  },

  // ======================================================
  // HELP
  // ======================================================

  initHelp() {
    const modal =
      document.getElementById("helpModal");

    const toggle =
      document.getElementById("helpToggle");

    if (!modal || !toggle) return;

    toggle.addEventListener("click", () => {
      modal.classList.add("show");
    });

    modal
      .querySelector(".modal-x")
      ?.addEventListener("click", () => {
        modal.classList.remove("show");
      });

    modal.addEventListener("click", e => {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });
  },

  // ======================================================
  // CONFIG
  // ======================================================

  syncConfig() {
    if (!window.SITE_CONFIG) return;

    const link =
      document.getElementById("connectLink");

    if (link) {
      link.href =
        SITE_CONFIG.connectUrl;
    }

    const addr =
      document.querySelector(".mail-address");

    if (addr) {
      addr.textContent =
        SITE_CONFIG.ownerEmail;
    }
  },

  // ======================================================
  // TOAST
  // ======================================================

  showToast(msg) {
    const toast =
      document.getElementById("toast");

    if (!toast) return;

    toast.textContent = msg;

    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }
};


// ======================================================
// ROOM
// ======================================================

const Room = {
  initialized: false,

  init() {
    const scene =
      document.getElementById("roomScene");

    if (!scene) return;

    if (!this.initialized) {

      scene.addEventListener(
        "pointermove",
        e => {
          const rect =
            scene.getBoundingClientRect();

          const x =
            (e.clientX - rect.left) /
              rect.width -
            0.5;

          const y =
            (e.clientY - rect.top) /
              rect.height -
            0.5;

          scene.style.transform =
            `translate(-50%,-50%) ` +
            `rotateY(${x * 5}deg) ` +
            `rotateX(${-y * 3.5}deg)`;
        }
      );

      scene.addEventListener(
        "pointerleave",
        () => {
          scene.style.transform =
            "translate(-50%,-50%)";
        }
      );

      scene
        .querySelectorAll(".room-object")
        .forEach(obj => {

          obj.addEventListener(
            "mouseenter",
            () => {
              const label =
                document.getElementById(
                  "objectLabel"
                );

              if (label) {
                label.textContent =
                  obj.dataset.label;
              }
            }
          );

          obj.addEventListener(
            "mouseleave",
            () => {
              const label =
                document.getElementById(
                  "objectLabel"
                );

              if (label) {
                label.textContent =
                  "Rê chuột vào một vật thể";
              }
            }
          );
        });

      this.initialized = true;
    }
  }
};


// ======================================================
// START APP
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  () => App.init()
);


// ======================================================
// KHÓA CHỌN TEXT / KÉO ẢNH
// ======================================================

document.addEventListener(
  "selectstart",
  e => {
    const t =
      e.target instanceof Element
        ? e.target
        : null;

    if (
      t &&
      t.closest(
        ".chibi-box, .paper-inner, .hero-photo, .lightbox, .gift-tile"
      )
    ) {
      e.preventDefault();
    }
  }
);

document.addEventListener(
  "dragstart",
  e => {
    const t =
      e.target instanceof Element
        ? e.target
        : null;

    if (
      t &&
      t.closest(
        ".chibi-box, .paper-inner, .hero-photo, .lightbox, .gift-tile"
      )
    ) {
      e.preventDefault();
    }
  }
);

