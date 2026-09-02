/* ══════════════════════════════════════════════════════════════
   Pomaire 360 — Historia · Lector inmersivo
   1) Lectura en voz alta (Web Speech API / SpeechSynthesis)
   2) Música / sonido de ambiente con control de volumen
   Se auto-inicializa si existe una .reader-bar en la página.
   Sin dependencias externas.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  }

  ready(function () {
    var bar = document.querySelector('.reader-bar');
    if (!bar) return;

    var body = document.querySelector('.book-body');
    var btnRead = document.getElementById('btnRead');
    var btnMusic = document.getElementById('btnMusic');
    var status = document.getElementById('readerStatus');
    var volRange = document.getElementById('musicVol');

    /* ───────────────────────── 1. LECTURA EN VOZ ALTA ───────────────────── */
    var synth = window.speechSynthesis;
    var supportsTTS = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

    var chunks = [];       // {el, text}
    var idx = 0;
    var reading = false;
    var paused = false;

    function setStatus(msg) { if (status) status.textContent = msg || ''; }

    function collectChunks() {
      chunks = [];
      if (!body) return;
      // Lee párrafos y encabezados en orden de aparición.
      var nodes = body.querySelectorAll('p, h2, h3, blockquote, .verse');
      nodes.forEach(function (el) {
        // Evitar duplicar el texto de .verse contenido dentro de un <p>
        if (el.closest('.sources')) return;
        var txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (txt.length > 1) chunks.push({ el: el, text: txt });
      });
    }

    function pickVoice() {
      var voices = synth.getVoices() || [];
      // Preferir una voz en español (es-CL, es-ES, es-MX, es-*)
      var pref = voices.filter(function (v) { return /^es(-|_|$)/i.test(v.lang); });
      if (pref.length) {
        var cl = pref.find(function (v) { return /es-CL|es-419|es-MX|es-US/i.test(v.lang); });
        return cl || pref[0];
      }
      return null;
    }

    function clearHighlight() {
      var prev = body && body.querySelector('.tts-active');
      if (prev) prev.classList.remove('tts-active');
    }

    function speakFrom(i) {
      if (!supportsTTS || i >= chunks.length) { stopReading(); return; }
      idx = i;
      clearHighlight();
      var chunk = chunks[idx];
      chunk.el.classList.add('tts-active');
      // Desplazar para seguir la lectura (sin saltos bruscos)
      try {
        chunk.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (e) { chunk.el.scrollIntoView(); }

      var u = new SpeechSynthesisUtterance(chunk.text);
      u.lang = 'es-CL';
      var v = pickVoice();
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = 0.98;
      u.pitch = 1.0;
      u.onend = function () {
        if (!reading) return;
        speakFrom(idx + 1);
        var pct = Math.round(((idx) / chunks.length) * 100);
        setStatus('Leyendo… ' + Math.min(pct, 100) + '%');
      };
      u.onerror = function () { /* continúa con el siguiente */ if (reading) speakFrom(idx + 1); };
      synth.speak(u);
    }

    function startReading() {
      if (!supportsTTS) {
        setStatus('Tu navegador no permite leer en voz alta.');
        return;
      }
      collectChunks();
      if (!chunks.length) return;
      synth.cancel();
      reading = true;
      paused = false;
      btnRead.setAttribute('aria-pressed', 'true');
      btnRead.querySelector('.rb-label').textContent = 'Pausar';
      btnRead.querySelector('.rb-ico').textContent = '⏸️';
      setStatus('Leyendo…');
      speakFrom(0);
    }

    function pauseReading() {
      if (synth.speaking && !synth.paused) {
        synth.pause();
        paused = true;
        btnRead.querySelector('.rb-label').textContent = 'Reanudar';
        btnRead.querySelector('.rb-ico').textContent = '▶️';
        setStatus('En pausa');
      } else if (synth.paused) {
        synth.resume();
        paused = false;
        btnRead.querySelector('.rb-label').textContent = 'Pausar';
        btnRead.querySelector('.rb-ico').textContent = '⏸️';
        setStatus('Leyendo…');
      }
    }

    function stopReading() {
      reading = false;
      paused = false;
      try { synth.cancel(); } catch (e) {}
      clearHighlight();
      if (btnRead) {
        btnRead.setAttribute('aria-pressed', 'false');
        btnRead.querySelector('.rb-label').textContent = 'Escuchar';
        btnRead.querySelector('.rb-ico').textContent = '🔊';
      }
      setStatus('');
    }

    if (btnRead) {
      if (!supportsTTS) {
        btnRead.disabled = true;
        btnRead.title = 'No disponible en este navegador';
      }
      btnRead.addEventListener('click', function () {
        if (!reading) { startReading(); }
        else { pauseReading(); }
      });
    }

    // Botón "detener" opcional (doble función: clic largo / botón aparte)
    var btnStop = document.getElementById('btnStop');
    if (btnStop) btnStop.addEventListener('click', stopReading);

    // Algunas plataformas cargan las voces de forma asíncrona
    if (supportsTTS && typeof synth.onvoiceschanged !== 'undefined') {
      synth.onvoiceschanged = function () { /* voces disponibles */ };
    }

    // Detener la lectura al salir de la página
    window.addEventListener('beforeunload', stopReading);
    window.addEventListener('pagehide', stopReading);

    /* ───────────────────────── 2. MÚSICA DE AMBIENTE ────────────────────── */
    // El <audio> vive en el HTML (id="ambientAudio") para poder definir la
    // fuente (src) por artículo. Si no hay fuente, el botón queda deshabilitado.
    var audio = document.getElementById('ambientAudio');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var STORE_KEY = 'p360_hist_music_vol';

    function hasSource() {
      if (!audio) return false;
      if (audio.getAttribute('src')) return true;
      return !!audio.querySelector('source[src]');
    }

    if (btnMusic) {
      if (!hasSource()) {
        btnMusic.disabled = true;
        btnMusic.title = 'Sin pista de audio configurada aún';
      } else {
        // Volumen inicial (recordado)
        var savedVol = parseFloat(localStorage.getItem(STORE_KEY));
        if (isNaN(savedVol)) savedVol = 0.35;
        audio.volume = savedVol;
        if (volRange) volRange.value = String(Math.round(savedVol * 100));

        btnMusic.addEventListener('click', function () {
          if (audio.paused) {
            audio.play().then(function () {
              btnMusic.classList.add('is-active');
              btnMusic.setAttribute('aria-pressed', 'true');
              btnMusic.querySelector('.rb-label').textContent = 'Silenciar';
              btnMusic.querySelector('.rb-ico').textContent = '🎵';
            }).catch(function () {
              setStatus('Toca de nuevo para activar el audio.');
            });
          } else {
            audio.pause();
            btnMusic.classList.remove('is-active');
            btnMusic.setAttribute('aria-pressed', 'false');
            btnMusic.querySelector('.rb-label').textContent = 'Ambiente';
            btnMusic.querySelector('.rb-ico').textContent = '🎼';
          }
        });

        if (volRange) {
          volRange.addEventListener('input', function () {
            var v = Math.max(0, Math.min(1, parseInt(this.value, 10) / 100));
            audio.volume = v;
            try { localStorage.setItem(STORE_KEY, String(v)); } catch (e) {}
          });
        }
      }
    }
  });
})();
