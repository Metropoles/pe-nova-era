document.addEventListener("DOMContentLoaded", () => {

  // ================= PRELOADER =================
  const preloaderAtivar = () => {
    const elem = document.querySelector(".preloader-box");
    if (!elem) return;

    document.addEventListener("readystatechange", (event) => {
      if (event.target.readyState === "complete") {
        setTimeout(() => {
          let opacity = 1;

          const fade = setInterval(() => {
            opacity -= 0.02;
            elem.style.opacity = opacity;

            if (opacity <= 0) {
              elem.style.display = "none";
              clearInterval(fade);
            }
          }, 10);

          const active = document.querySelector(".preloader-active");
          if (active) active.classList.remove("preloader-active");

        }, 1500);
      }
    });
  };

  preloaderAtivar();


  // ================= contador =================
  const contadores = document.querySelectorAll(".contador");

  function animarContador(contador, delay = 0) {
    setTimeout(() => {
      let valorFinal = parseInt(contador.dataset.target);
      let sufixo = contador.dataset.suffix || "";
      let valorAtual = 0;
      let duracao = 1200;

      let incremento = valorFinal / (duracao / 16);

      function animar() {
        valorAtual += incremento;

        if (valorAtual >= valorFinal) {
          contador.innerText = valorFinal + sufixo;
          return;
        }

        contador.innerText = Math.floor(valorAtual) + sufixo;
        requestAnimationFrame(animar);
      }

      animar();
    }, delay);
  }

  let iniciou = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !iniciou) {
      iniciou = true;

      contadores.forEach((contador, index) => {
        animarContador(contador, index * 200); // delay em cascata
      });
    }
  }, {
    threshold: 0.5
  });

  observer.observe(document.querySelector(".stats"));


  // ================= REDES SOCIAIS =================
  (function () {

    const SHARE_MESSAGE_PREFIX = "Confira:";

    function getShareMetadata() {
      const metaTitle = document.querySelector('meta[property="og:title"]')?.content?.trim();
      const headingTitle = document.querySelector("h1")?.textContent?.trim();
      const subheadingTitle = document.querySelector("h2")?.textContent?.trim();
      const documentTitle = document.title?.trim();
      const metaDescription = document.querySelector('meta[name="description"]')?.content?.trim();

      const title = metaTitle || headingTitle || subheadingTitle || documentTitle || "";
      const description = metaDescription || subheadingTitle || title;
      const pageUrl = window.location.href;

      const socialText = [SHARE_MESSAGE_PREFIX, title].filter(Boolean).join(" ");
      const message = [socialText, pageUrl].filter(Boolean).join(" ");
      const emailBody = [SHARE_MESSAGE_PREFIX, title, description, pageUrl].filter(Boolean).join("\n\n");

      return { title, description, pageUrl, socialText, message, emailBody };
    }

    function buildShareHref(link, metadata) {
      const href = link.getAttribute("href");
      if (!href) return;

      const { title, pageUrl, socialText, message, emailBody } = metadata;

      try {
        if (href.startsWith("mailto:")) {
          const [base] = href.split("?");
          const params = new URLSearchParams();

          params.set("subject", title || document.title);
          params.set("body", emailBody || pageUrl);

          return `${base}?${params.toString()}`;
        }

        const url = new URL(href, window.location.origin);
        const item = link.closest("li");

        if (item?.classList.contains("box-share__twitter")) {
          url.searchParams.set("text", socialText);
          url.searchParams.set("url", pageUrl);
        }

        if (item?.classList.contains("box-share__whatsapp")) {
          url.searchParams.set("text", message);
        }

        if (item?.classList.contains("box-share__facebook")) {
          url.searchParams.set("u", pageUrl);
        }

        if (item?.classList.contains("box-share__telegram")) {
          url.searchParams.set("url", pageUrl);
          url.searchParams.set("text", socialText);
        }

        return url.toString();

      } catch {
        return href;
      }
    }

    function initShareLinks() {
      const links = document.querySelectorAll(".box-share a[href]");
      if (!links.length) return;

      const metadata = getShareMetadata();

      links.forEach(link => {
        const newHref = buildShareHref(link, metadata);
        if (newHref) link.setAttribute("href", newHref);
      });
    }

    initShareLinks();

  })();


  // ================= VIDEO =================
  (function () {

    const abreSection = document.querySelector(".abre");
    const bgVideo = document.querySelector(".abre-video");

    if (abreSection && bgVideo) {
      setTimeout(() => {
        abreSection.classList.add("video-active");
        bgVideo.muted = true;
        bgVideo.play().catch(() => { });
      }, 7000);
    }

    const openBtn = document.querySelector(".butt-doc");
    const modal = document.getElementById("videoModal");
    const closeBtn = document.querySelector(".close-video");
    const iframe = document.getElementById("videoFrame");

    const YOUTUBE_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ";

    if (openBtn && modal && closeBtn && iframe) {

      openBtn.addEventListener("click", (e) => {
        e.preventDefault();

        if (typeof gtag === "function") {
          gtag("event", "open_video_modal", {
            element_name: "video",
            page_location: window.location.href,
          });
        }

        modal.classList.add("active");
        iframe.src = YOUTUBE_URL;
        document.body.style.overflow = "hidden";
      });

      const closeModal = () => {
        modal.classList.remove("active");
        iframe.src = "";
        document.body.style.overflow = "auto";
      };

      closeBtn.addEventListener("click", closeModal);

      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
      });
    }

  })();


  // ================= PARALLAX =================
  const fast = document.querySelectorAll(".parallax-item.fast");
  const mid = document.querySelectorAll(".parallax-item.mid");
  const slow = document.querySelectorAll(".parallax-item.slow");

  window.addEventListener("scroll", () => {
    const y = window.scrollY;

    fast.forEach(el => {
      const move = y * 1;
      el.style.transform = el.classList.contains("m2")
        ? `translate(-50%, -${move}px)`
        : `translateY(-${move}px)`;
    });

    mid.forEach(el => {
      el.style.transform = `translateY(-${y * 0.3}px)`;
    });

    slow.forEach(el => {
      el.style.transform = `translateY(-${y * 0.1}px)`;
    });
  });


  // ================= MODAL GALERIA =================
  const items = document.querySelectorAll(".gallery-item img");
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const close = document.querySelector(".close");
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (items.length && modal && modalImg) {

    items.forEach(img => {
      img.addEventListener("click", () => {
        const src = isMobile
          ? img.getAttribute("data-full-mobile")
          : img.getAttribute("data-full");

        modal.classList.add("active");
        modalImg.src = src;
      });
    });

    if (close) {
      close.addEventListener("click", () => {
        modal.classList.remove("active");
      });
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  }


  // ================= CARROSSEL =================
  let swiper = null;

  function initCarousel() {
    const isMobile = window.innerWidth <= 768;

    const slides = document.querySelectorAll(".swiper-slide");
    const btn = document.querySelector(".btn-more");

    if (isMobile) {
      // 🔴 DESTROI SWIPER
      if (swiper) {
        swiper.destroy(true, true);
        swiper = null;
      }

      // 🔥 LIMPA estilos do swiper
      slides.forEach(el => {
        el.style.removeProperty("display");
        el.style.removeProperty("width");
      });

      // 📱 MOSTRA SÓ 3
      slides.forEach((el, index) => {
        el.style.display = index < 3 ? "flex" : "none";
      });

      // 🔘 BOTÃO "VER MAIS"
      if (btn) {
        btn.style.display = "block";

        btn.onclick = () => {
          slides.forEach(el => {
            el.style.display = "flex";
          });

          btn.style.display = "none";
        };
      }

    } else {
      // 🟢 DESKTOP (CARROSSEL)

      // reset display
      slides.forEach(el => {
        el.style.display = "";
      });

      // esconde botão
      if (btn) btn.style.display = "none";

      // inicia swiper
      if (!swiper && typeof Swiper !== "undefined") {
        swiper = new Swiper(".mySwiper", {
          loop: true,
          centeredSlides: true,
          slidesPerView: 3,
          spaceBetween: 20,
        });
      }
    }
  }

  // 🚀 INIT
  window.addEventListener("load", initCarousel);
  window.addEventListener("resize", initCarousel);
});