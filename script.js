document.addEventListener("DOMContentLoaded", () => {
  // Inicialización de textos y render general
  cargarDatosDinamicos();
  renderizarFotos();

  const overlay = document.getElementById('portada-overlay');
  const mainContent = document.getElementById('main-content');
  const audio = document.getElementById('audio-player');
  const btnMusica = document.getElementById('music-btn');
  const iconoMusica = btnMusica.querySelector('.music-icon');

  let estaReproduciendo = false;

  // Forzar interacción mediante el botón de la Portada
  document.getElementById("btn-ingresar").addEventListener("click", () => {
    overlay.classList.add("hidden");
    mainContent.classList.remove("hidden");

    // Intentar reproducir audio con la interacción confirmada
    audio.src = "cancion.mp3";
    audio.play().then(() => {
      estaReproduciendo = true;
      iconoMusica.textContent = "⏸";
    }).catch(() => {
      iconoMusica.textContent = "▶";
    });
  });

  // Control manual del reproductor
  btnMusica.addEventListener('click', () => {
    if (estaReproduciendo) {
      audio.pause();
      iconoMusica.textContent = '▶';
    } else {
      audio.play();
      iconoMusica.textContent = '⏸';
    }
    estaReproduciendo = !estaReproduciendo;
  });

  // Slider Responsivo de la Galería Polaroid
  const track = document.getElementById("galeria-track");
  const btnPrev = document.getElementById("slide-prev");
  const btnNext = document.getElementById("slide-next");
  
  let currentOffset = 0;
  const cardStep = 280; // Ancho polaroid (260px) + gap (20px)

  btnNext.addEventListener("click", () => {
    const maxMove = -(track.children.length * cardStep - track.parentElement.clientWidth);
    if (currentOffset > maxMove) {
      currentOffset -= cardStep;
      if (currentOffset < maxMove) currentOffset = maxMove;
      track.style.transform = `translateX(${currentOffset}px)`;
    }
  });

  btnPrev.addEventListener("click", () => {
    if (currentOffset < 0) {
      currentOffset += cardStep;
      if (currentOffset > 0) currentOffset = 0;
      track.style.transform = `translateX(${currentOffset}px)`;
    }
  });
});

function cargarDatosDinamicos() {
  // Hero e Identidad
  document.getElementById("hero-nombre").textContent = EVENT.nombre;
  document.getElementById("hero-subtitulo").textContent = EVENT.subtitulo;
  document.getElementById("hero-generacion").textContent = EVENT.generacion;

  // Mensajes
  document.getElementById("mensaje-personal").textContent = EVENT.mensajePersonal;
  document.getElementById("familia-texto").textContent = EVENT.familia.texto;
  document.getElementById("dresscode-texto").textContent = EVENT.dressCode;

  // Ceremonia Religiosa
  document.getElementById("ceremonia-nombre").textContent = EVENT.ceremonia.nombre;
  document.getElementById("ceremonia-fecha").textContent = EVENT.fechaTexto;
  document.getElementById("ceremonia-hora").textContent = EVENT.horaTexto;
  document.getElementById("ceremonia-direccion").textContent = EVENT.ceremonia.direccion;
  document.getElementById("ceremonia-mapa").innerHTML = EVENT.ceremonia.embedMapa;
  document.getElementById("btn-ceremonia").href = EVENT.ceremonia.mapsUrl;

  // Restaurante Kurai Citadel
  document.getElementById("restaurante-nombre").textContent = EVENT.restaurante.nombre;
  document.getElementById("restaurante-nota").textContent = EVENT.restaurante.notaHorario;
  document.getElementById("restaurante-direccion").textContent = EVENT.restaurante.direccion;
  document.getElementById("restaurante-img").src = EVENT.restaurante.imagen;
  document.getElementById("btn-restaurante").href = EVENT.restaurante.mapsUrl;
}

function renderizarFotos() {
  const track = document.getElementById("galeria-track");
  track.innerHTML = "";

  EVENT.galeria.forEach(foto => {
    const polaroidCard = document.createElement("div");
    polaroidCard.classList.add("polaroid");
    polaroidCard.innerHTML = `
      <img src="${foto.archivo}" alt="${foto.alt}" loading="lazy">
      <p class="polaroid-caption">${foto.alt}</p>
    `;
    track.appendChild(polaroidCard);
  });
}