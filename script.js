(function () {
  'use strict';

  // ── PORTADA ────────────────────────────────────────────────
  function iniciarPortada() {
    const overlay = document.getElementById('portada-overlay');
    const main = document.getElementById('main-content');
    const audio = document.getElementById('audio-player');
    const btn = document.getElementById('music-btn');
    const icon = btn.querySelector('.music-icon');

    if (!EVENT.musica?.archivo) return;

    overlay.addEventListener('click', function entrar() {
      // Ocultar portada
      overlay.classList.add('ocultar');
      main.style.display = 'block';

      // Iniciar música
      audio.src = EVENT.musica.archivo;
      audio.play().then(() => {
        icon.textContent = '⏸';
      }).catch(() => {
        icon.textContent = '▶';
      });

      // Remover evento para que no se vuelva a ejecutar
      overlay.removeEventListener('click', entrar);
    });

    // Control manual de música
    btn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        icon.textContent = '⏸';
      } else {
        audio.pause();
        icon.textContent = '▶';
      }
    });
  }

  // ── ESTRELLAS DORADAS ─────────────────────────────────────
  function crearEstrellas() {
    const contenedor = document.createElement('div');
    contenedor.className = 'estrellas-container';
    document.body.insertBefore(contenedor, document.body.firstChild);

    const svgEstrella = (size, opacity) =>
      `<svg width="${size}" height="${size}" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" style="opacity:${opacity}">
        <polygon points="5,0 6,4 10,5 6,6 5,10 4,6 0,5 4,4" fill="#D4A520"/>
      </svg>`;

    const cantidad = Math.floor(Math.random() * 6) + 20;
    for (let i = 0; i < cantidad; i++) {
      const wrap = document.createElement('div');
      const size = (Math.random() * 6 + 4).toFixed(1);
      const left = (Math.random() * 100).toFixed(1);
      const dur = (Math.random() * 7 + 7).toFixed(1);
      const delay = -(Math.random() * 14).toFixed(1);
      const opacity = (Math.random() * 0.25 + 0.15).toFixed(2);
      const dx = ((Math.random() - 0.5) * 50).toFixed(0) + 'px';
      const rot = Math.random() > 0.5 ? '360deg' : '-360deg';

      wrap.innerHTML = svgEstrella(size, opacity);
      wrap.style.cssText = `
        position: absolute; left: ${left}vw; top: -12px;
        animation: caerEstrella ${dur}s ${delay}s linear infinite;
        --dx: ${dx}; --rot: ${rot};
      `;
      contenedor.appendChild(wrap);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes caerEstrella {
        0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
        8%   { opacity: 1; }
        92%  { opacity: 0.4; }
        100% { transform: translateY(105vh) translateX(var(--dx)) rotate(var(--rot)); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // ── HERO ─────────────────────────────────────────────────
  function construirHero() {
    document.getElementById('hero-foto-bg').style.backgroundImage =
      "url('assets/photos/hero.jpg')";
    document.getElementById('hero-fecha').textContent =
      `${EVENT.fechaTexto} · ${EVENT.horaTexto}`;
  }

  // ── COUNTDOWN ────────────────────────────────────────────
  function iniciarCountdown() {
    const meta = new Date(EVENT.fechaISO).getTime();
    const pad = n => String(n).padStart(2, '0');
    function tick() {
      const diff = Math.max(0, meta - Date.now());
      document.getElementById('cd-dias').textContent = pad(Math.floor(diff / 86400000));
      document.getElementById('cd-horas').textContent = pad(Math.floor((diff % 86400000) / 3600000));
      document.getElementById('cd-min').textContent = pad(Math.floor((diff % 3600000) / 60000));
      document.getElementById('cd-seg').textContent = pad(Math.floor((diff % 60000) / 1000));
    }
    tick();
    setInterval(tick, 1000);
  }

  // ── MENSAJE PERSONAL ─────────────────────────────────────
  function construirMensaje() {
    const el = document.getElementById('mensaje-personal');
    const texto = EVENT.mensajePersonal;
    // Dividir en 3 líneas
    const partes = texto.split('. ');
    if (partes.length >= 3) {
      el.innerHTML = `
        <span class="linea-1">${partes[0]}.</span>
        <span class="linea-2">${partes[1]}.</span>
        <span class="linea-3">${partes[2]}</span>
      `;
    } else {
      el.textContent = texto;
    }
  }

  // ── FAMILIA ──────────────────────────────────────────────
  function construirFamilia() {
    document.getElementById('familia-texto').textContent = EVENT.familia.texto;
  }

  // ── GALERÍA ──────────────────────────────────────────────
  function construirGaleria() {
    const fotos = EVENT.galeria;
    if (!fotos || fotos.length === 0) {
      document.getElementById('galeria-section').classList.add('hidden');
      return;
    }
    const stack = document.getElementById('galeria-stack');
    const contador = document.getElementById('galeria-contador');
    let actual = 0;

    fotos.forEach((foto, i) => {
      const card = document.createElement('div');
      card.className = 'galeria-card' + (i === 0 ? ' activa' : '');
      card.style.zIndex = fotos.length - i;
      const img = document.createElement('img');
      img.src = `assets/photos/${foto.archivo}`;
      img.alt = foto.alt || '';
      card.appendChild(img);
      stack.appendChild(card);
    });

    const actualizarContador = () => {
      contador.textContent = `${actual + 1} / ${fotos.length}`;
    };
    actualizarContador();

    function avanzar() {
      const activa = stack.querySelector('.galeria-card.activa');
      activa.classList.add('saliendo');
      activa.classList.remove('activa');
      setTimeout(() => {
        activa.classList.remove('saliendo');
        stack.appendChild(activa);
        const todas = stack.querySelectorAll('.galeria-card');
        todas.forEach((c, i) => {
          c.style.zIndex = todas.length - i;
          c.classList.remove('activa');
        });
        todas[0].classList.add('activa');
        actual = (actual + 1) % fotos.length;
        actualizarContador();
      }, 250);
    }

    stack.addEventListener('click', avanzar);
    let startX = 0;
    stack.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    stack.addEventListener('touchend', e => {
      if (Math.abs(e.changedTouches[0].clientX - startX) > 30) avanzar();
    });
  }

  // ── CEREMONIA ────────────────────────────────────────────
  function construirCeremonia() {
    const c = EVENT.ceremonia;
    document.getElementById('ceremonia-nombre').textContent = c.nombre;
    document.getElementById('ceremonia-fecha-hora').textContent = `${c.fecha} · ${c.hora}`;
    document.getElementById('ceremonia-mapa').innerHTML = c.embedMapa;
    document.getElementById('btn-ceremonia').href = c.mapsUrl;
  }

  // ── PROGRAMA ─────────────────────────────────────────────
  function construirPrograma() {
    if (!EVENT.programa || EVENT.programa.length === 0) return;
    const sec = document.getElementById('programa-section');
    const list = document.getElementById('programa-lista');
    sec.classList.remove('hidden');
    EVENT.programa.forEach(item => {
      const el = document.createElement('div');
      el.className = 'programa-item';
      el.innerHTML = `
        <span class="programa-hora">${item.hora}</span>
        <div>
          <p class="programa-titulo">${item.titulo}</p>
          ${item.descripcion ? `<p class="programa-desc">${item.descripcion}</p>` : ''}
        </div>`;
      list.appendChild(el);
    });
  }

  // ── RESTAURANTE ──────────────────────────────────────────
  function construirRestaurante() {
    const r = EVENT.restaurante;
    document.getElementById('restaurante-nombre').textContent = r.nombre;
    document.getElementById('restaurante-nota').textContent = r.notaHorario;
    document.getElementById('btn-restaurante').href = r.mapsUrl;
  }

  // ── DRESS CODE ───────────────────────────────────────────
  function construirDressCode() {
    document.getElementById('dresscode-texto').textContent = EVENT.dressCode;
  }

  // ── CONFIRMACIÓN ─────────────────────────────────────────
  function construirConfirmacion() {
    document.getElementById('confirmacion-copy').textContent =
      EVENT.confirmacion.textoAcompanamiento;
    document.getElementById('btn-confirmar').href = EVENT.confirmacion.enlace;
  }

  // ── CALENDARIO Y COMPARTIR ───────────────────────────────
  function construirCalendario() {
    const cal = EVENT.calendario;
    const f = new Date(EVENT.fechaISO);
    const fin = new Date(f.getTime() + 3 * 3600000);
    const fmt = d =>
      `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}` +
      `T${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}00`;
    const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nDTSTART:${fmt(f)}\r\nDTEND:${fmt(fin)}\r\nSUMMARY:${cal.titulo}\r\nDESCRIPTION:${cal.descripcion}\r\nLOCATION:${cal.lugar}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
    const btn = document.getElementById('btn-calendario');
    btn.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    btn.download = 'graduacion-isaac.ics';

    const url = encodeURIComponent(window.location.href);
    document.getElementById('compartir-fb').href =
      `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  }

  // ── INIT ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    crearEstrellas();
    iniciarPortada();
    construirHero();
    iniciarCountdown();
    construirMensaje();
    construirFamilia();
    construirGaleria();
    construirCeremonia();
    construirPrograma();
    construirRestaurante();
    construirDressCode();
    construirConfirmacion();
    construirCalendario();
  });

})();