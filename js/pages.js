const LETTER_TEXT = [
  `Có những điều rất dễ nói vào một ngày đặc biệt, nhưng lại thường bị bỏ quên trong những ngày bình thường.`,
  `Có một người mẹ từng thức dậy sớm hơn mọi người để chuẩn bị một bữa sáng. Có một người chị từng nhường đi điều mình thích. Có một người cô, một người bạn, một người đồng nghiệp… từng âm thầm làm cho một ngày của ai đó trở nên nhẹ hơn.`,
  `Có thể họ không nhớ những điều mình đã làm. Nhưng người nhận được sự tử tế ấy thì có.`,
  `Vì vậy hôm nay, thay vì chỉ nói rằng phụ nữ xứng đáng được yêu thương, hãy nói thêm một điều: họ xứng đáng được lắng nghe. Được nghỉ ngơi. Được lựa chọn. Được sống theo nhịp của riêng mình.`,
  `Không phải lúc nào cũng cần phải mạnh mẽ. Không phải lúc nào cũng phải mỉm cười. Và cũng không cần phải trở thành một phiên bản hoàn hảo để được yêu thương.`,
  `Nếu hôm nay bạn đang mệt, hãy nghỉ một chút. Nếu bạn đang vui, hãy tận hưởng thật trọn vẹn. Nếu bạn đang bắt đầu lại, mong bạn đủ kiên nhẫn với chính mình.`,
  `Và nếu chẳng ai nói điều này với bạn hôm nay, thì hãy để căn phòng nhỏ này nói thay: cảm ơn bạn vì đã cố gắng. Cảm ơn vì đã đi đến tận hôm nay.`
];

const CHIBI_MESSAGES = [
  "Bạn đáng được nghỉ.",
  "Uống nước nhé ♡",
  "Đừng quên mình.",
  "Chậm một chút thôi.",
  "Bạn làm tốt rồi.",
  "Cho mình một cái ôm.",
  "Hôm nay cũng đủ rồi.",
  "Cứ là chính mình.",
  "Không cần hoàn hảo.",
  "Bạn xứng đáng bình yên."
];

const MEMORYS = [
  ["assets/photos/memory-01.jpg","Một khoảnh khắc","01"],
  ["assets/photos/memory-02.jpg","Một nụ cười","02"],
  ["assets/photos/memory-03.jpg","Một ngày bình thường","03"],
  ["assets/photos/memory-04.jpg","Một người đặc biệt","04"],
  ["assets/photos/memory-05.jpg","Một mùa thật đẹp","05"],
  ["assets/photos/memory-06.jpg","Một lần gặp nhau","06"],
  ["assets/photos/memory-07.jpg","Một góc quen thuộc","07"],
  ["assets/photos/memory-08.jpg","Một điều muốn giữ","08"]
];

const LetterPage = {
  initialized:false,
  rainTimer:null,
  messageIndex:0,
  init() {
    if (this.initialized) {
      this.resetScroll();
      this.startRain();
      return;
    }
    this.initialized = true;
    this.render();
    this.bindScroll();
    this.resetScroll();
    if (typeof App !== "undefined" && App.current === "letter") this.startRain();
  },
  render() {
    const container = document.getElementById("letterContent");
    container.innerHTML = LETTER_TEXT.map((text,i) => `<p class="${i===0 ? 'dropcap':''}">${text}</p>`).join("");
    setTimeout(() => this.reveal(), 160);
  },
  bindScroll() {
    const scroll = document.getElementById("letterScroll");
    scroll.addEventListener("scroll", () => this.reveal());
  },
  reveal() {
    const scroll = document.getElementById("letterScroll");
    const ps = [...document.querySelectorAll("#letterContent p")];
    ps.forEach(p => {
      const r = p.getBoundingClientRect();
      if (r.top < window.innerHeight * .9) p.classList.add("show");
    });
  },
  resetScroll() {
    const scroll = document.getElementById("letterScroll");
    if (scroll) scroll.scrollTop = 0;
    setTimeout(() => this.reveal(), 100);
  },
  clearRain() {
    if (this.rainTimer) {
      clearTimeout(this.rainTimer);
      this.rainTimer = null;
    }
    const holder = document.getElementById("chibiRain");
    if (holder) holder.innerHTML = "";
  },
  startRain() {
    const holder = document.getElementById("chibiRain");
    if (!holder) return;
    this.clearRain();
    this.messageIndex = Math.floor(Math.random() * CHIBI_MESSAGES.length);

    const tick = () => {
      if (typeof App !== "undefined" && App.current !== "letter") return;

      // Giữ số box đang bay vừa phải để màn hình không bị rối.
      const active = holder.querySelectorAll(".chibi-box").length;
      if (active < 5) this.createChibi(holder);

      const nextDelay = 700 + Math.random() * 1500;
      this.rainTimer = setTimeout(tick, nextDelay);
    };

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (typeof App === "undefined" || App.current === "letter") this.createChibi(holder);
      }, i * 650);
    }
    this.rainTimer = setTimeout(tick, 1800);
  },
  createChibi(holder) {
    const text = CHIBI_MESSAGES[this.messageIndex % CHIBI_MESSAGES.length];
    this.messageIndex = (this.messageIndex + 1) % CHIBI_MESSAGES.length;

    const box = document.createElement("button");
    box.className = "chibi-box";
    box.type = "button";

    const left = 4 + Math.random() * 87;
    const duration = 11.5 + Math.random() * 7.5;
    const drift = -55 + Math.random() * 110;
    const rot = -11 + Math.random() * 22;
    const scale = .86 + Math.random() * .16;
    const delay = Math.random() * .35;

    box.style.left = `${left}%`;
    box.style.setProperty("--delay", `${delay}s`);
    box.style.setProperty("--dur", `${duration}s`);
    box.style.setProperty("--drift", `${drift}px`);
    box.style.setProperty("--rot", `${rot}deg`);
    box.style.setProperty("--scale", scale.toFixed(2));
    box.setAttribute("aria-label", text);
    box.innerHTML = `<span class="chibi-hair"></span><span class="chibi-face"></span><span class="chibi-heart">♡</span><span class="chibi-copy">${text}</span>`;

    box.addEventListener("click", e => {
      e.stopPropagation();
      box.classList.add("clicked");
      UI.message(text);
      setTimeout(() => box.remove(), 280);
    });
    holder.appendChild(box);

    // Dọn box sau khi animation kết thúc để DOM không phình lên.
    setTimeout(() => box.remove(), (duration + delay + .8) * 1000);
  }
};

const MemoryPage = {
  index:0,
  initialized:false,
  init() {
    if (!this.initialized) {
      this.initialized = true;
      this.renderDots();
      document.getElementById("photoPrev").addEventListener("click", () => this.change(-1));
      document.getElementById("photoNext").addEventListener("click", () => this.change(1));
      const heroPhoto = document.getElementById("heroPhoto");
      heroPhoto.addEventListener("click", () => this.open());
      heroPhoto.addEventListener("dragstart", e => e.preventDefault());
      heroPhoto.addEventListener("selectstart", e => e.preventDefault());
      const lb = document.getElementById("lightbox");
      lb.querySelector(".lightbox-close").addEventListener("click", () => lb.classList.remove("show"));
      lb.addEventListener("dragstart", e => e.preventDefault());
      lb.addEventListener("selectstart", e => e.preventDefault());
      lb.addEventListener("click", e => { if (e.target === lb) lb.classList.remove("show"); });
    }
    this.render();
  },
  renderDots() {
    const holder = document.getElementById("photoDots");
    holder.innerHTML = MEMORYS.map((_,i)=>`<i class="photo-dot" data-i="${i}"></i>`).join("");
    holder.querySelectorAll(".photo-dot").forEach(dot => dot.addEventListener("click",()=>{this.index=+dot.dataset.i;this.render()}));
  },
  render() {
    const [src, caption, num] = MEMORYS[this.index];
    const img = document.querySelector("#heroPhoto img");
    img.src = src;
    img.alt = caption;
    document.getElementById("photoCaption").textContent = caption;
    document.getElementById("photoMeta").textContent = num;
    document.getElementById("memoryCounter").textContent = `${num} / 08`;
    document.querySelectorAll(".photo-dot").forEach((d,i)=>d.classList.toggle("active",i===this.index));
  },
  change(dir) {
    this.index = (this.index + dir + MEMORYS.length) % MEMORYS.length;
    this.render();
  },
  open() {
    const [src,caption] = MEMORYS[this.index];
    const lb = document.getElementById("lightbox");
    document.getElementById("lightboxImage").src = src;
    document.getElementById("lightboxText").textContent = caption;
    lb.classList.add("show");
  }
};

const Notes = {
  init() {
    document.querySelectorAll(".note-card").forEach(note => {
      note.addEventListener("click", () => UI.message(note.dataset.note));
    });
  }
};

const Gifts = {
  init() {
    document.querySelectorAll(".gift-tile").forEach(gift => {
      gift.addEventListener("click", () => UI.message(gift.dataset.gift));
    });
  }
};

const Thanks = {
  init() {
    const form = document.getElementById("thanksForm");
    const range = document.getElementById("ratingRange");
    range.addEventListener("input", () => {
      document.getElementById("ratingValue").textContent = range.value;
    });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (form._honey.value) return;
      const label = document.getElementById("sendLabel");
      const status = document.getElementById("thanksStatus");
      label.textContent = "ĐANG GỬI…";
      status.textContent = "";

      const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        _replyto: form.email.value.trim(),
        message: form.message.value.trim(),
        rating: `${form.rating.value}/5`,
        _subject: form._subject.value,
        _template: "table",
        _url: location.href
      };

      try {
        if (location.protocol === "file:") {
          throw new Error("local_file");
        }

        // FormSubmit's AJAX endpoint accepts normal form-style POST data.
        // URLSearchParams is more reliable than sending a raw JSON body here.
        const body = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => body.append(key, value));

        const response = await fetch(SITE_CONFIG.formSubmitEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Accept": "application/json"
          },
          body
        });
        const result = await response.json();
        if (!response.ok || result.success === false) throw new Error("send_failed");
        status.textContent = "Đã gửi rồi ♡ Cảm ơn bạn đã để lại một lời nhắn.";
        form.reset();
        document.getElementById("ratingValue").textContent = "5";
        App.showToast("Lời nhắn đã bay đến Kio ♡");
      } catch (err) {
        if (err.message === "local_file") {
          status.textContent = "Bạn đang mở file trực tiếp. Hãy mở bằng VS Code → Live Server rồi gửi lại nhé.";
        } else {
          status.textContent = "Chưa gửi được. Kiểm tra mạng, email hoặc thư mục Spam rồi thử lại.";
        }
      } finally {
        label.textContent = "GỬI LỜI NHẮN";
      }
    });
  }
};

const UI = {
  initialized:false,
  init() {
    if (this.initialized) return;
    this.initialized = true;
    const modal = document.getElementById("messageModal");
    modal.querySelector(".modal-x").addEventListener("click", () => modal.classList.remove("show"));
    modal.addEventListener("click", e => { if (e.target===modal) modal.classList.remove("show"); });
    Notes.init();
    Gifts.init();
    Thanks.init();
  },
  message(text) {
    const modal = document.getElementById("messageModal");
    document.getElementById("messageText").textContent = text;
    modal.classList.add("show");
  }
};

window.addEventListener("pagechange", e => {
  const page = e.detail.page;
  if (page === "women") MemoryPage.init();
  if (page === "hub") Room.init();
});

document.addEventListener("DOMContentLoaded", () => {
  UI.init();
  LetterPage.init();
  if (SITE_CONFIG?.connectUrl) {
    const connect = document.getElementById("connectLink");
    if (connect) connect.href = SITE_CONFIG.connectUrl;
  }
  if (document.querySelector("[data-page='hub']").classList.contains("active")) Room.init();
});
