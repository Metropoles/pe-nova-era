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

  // ================= modal pessoas ==================
  const buttons = document.querySelectorAll('.open-modal');
  const modalPessoa = document.getElementById('modal');

  const modalImg = document.getElementById('modal-img');
  const modalNome = document.getElementById('modal-nome');
  const modalCargo = document.getElementById('modal-cargo');
  const modalDesc = document.getElementById('modal-desc');

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const painel = e.target.closest('.painel');

      modalImg.src = painel.dataset.img;
      modalNome.textContent = painel.dataset.nome;
      modalCargo.textContent = painel.dataset.cargo;
      modalDesc.innerHTML = painel.dataset.desc;

      modalPessoa.classList.add('active');
    });
  });

  // fechar
  const closeBtnPessoa = document.querySelector('.close');

  if (closeBtnPessoa) {
    closeBtnPessoa.addEventListener('click', () => {
      modalPessoa.classList.remove('active');
    });
  }
  // ================= contador =================
  const contadores = document.querySelectorAll(".contador");

  function animarContador(contador, delay = 0) {
    setTimeout(() => {
      let valorFinal = parseInt(contador.dataset.target);
      let sufixo = contador.dataset.suffix || "";
      let valorAtual = 0;
      let duracao = 1500;

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
        animarContador(contador, index * 150); // delay em cascata
      });
    }
  }, {
    threshold: 0.5
  });

  observer.observe(document.querySelector(".stats"));
  // ================= notícias =================
  const container = document.getElementById("noticias");

  fetch("https://www.metropoles.com/wp-json/metropoles/v1/last_news?tag=comece-investindo&limit=30")
    .then(res => res.json())
    .then(data => {

      // pega só as 3 últimas
      const ultimas = data.slice(0, 3);

      ultimas.forEach(noticia => {

        const card = document.createElement("div");
        card.classList.add("noticia");

        card.innerHTML = `
        <a href="${noticia.url}" target="_blank">
          <img src="${noticia.image}" alt="${noticia.title}">
        </a>
        <a href="${noticia.url}" target="_blank">
          <h2>${noticia.title}</h2>
        </a>
      `;

        container.appendChild(card);
      });

    })
    .catch(err => console.error("Erro ao carregar notícias:", err));
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
});