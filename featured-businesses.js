/* ═══════════════════════════════════════════════════════════════════════════
   featured-businesses.js — Negocios Destacados + Categorías en Home
   Pomaire 360 · 2026
   
   Carga negocios premium/destacados para el carrusel y los top por
   categoría (restaurantes, alfarería, alojamiento) desde Supabase
   con fallback a directory-data.json.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ─── Config ─────────────────────────────────────────────────────────────────
  var SUPABASE_URL = 'https://uuskvqtbsvtfsovcjazf.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1c2t2cXRic3Z0ZnNvdmNqYXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2ODU4NDIsImV4cCI6MjEwMDI2MTg0Mn0.BbHI3ctSNg5msUnL9eENTNpOujQROAh6vUAZpFVcbBI';
  var TABLE = 'negocios_directorio360';

  // Categories to show in the grid section
  var CATEGORY_SECTIONS = [
    { key: 'restaurantes', icon: '🍽️', title: 'Dónde comer', filterUrl: '/comercio/#restaurantes' },
    { key: 'alfareria',    icon: '🏺', title: 'Dónde comprar', filterUrl: '/comercio/#alfareria' },
    { key: 'alojamiento',  icon: '🛏️', title: 'Dónde dormir', filterUrl: '/comercio/#alojamiento' }
  ];

  var CATEGORY_EMOJIS = {
    alfareria: '🏺', talleres: '🔨', restaurantes: '🍽️',
    alojamiento: '🏡', comercio: '🛍️', servicios: '🔧',
    estacionamientos: '🅿️', salud: '🏥', seguridad: '🛡️',
    banos: '🚻', transporte: '🚌', turismo: '📍'
  };

  var CATEGORY_LABELS = {
    alfareria: 'Alfarería', talleres: 'Talleres', restaurantes: 'Restaurante',
    alojamiento: 'Alojamiento', comercio: 'Comercio', servicios: 'Servicios',
    estacionamientos: 'Estacionamiento', salud: 'Salud', seguridad: 'Seguridad',
    banos: 'Baños', transporte: 'Transporte', turismo: 'Turismo'
  };

  var MAX_FEATURED = 8;   // max cards in carousel
  var MAX_PER_CATEGORY = 4; // max items per category column

  // ─── DOM References ─────────────────────────────────────────────────────────
  var carouselEl = document.getElementById('featuredCarousel');
  var dotsEl = document.getElementById('carouselDots');
  var catGridEl = document.getElementById('categoriesGrid');

  if (!carouselEl || !catGridEl) return;

  // ─── Helpers ────────────────────────────────────────────────────────────────
  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderStars(avg) {
    if (!avg || avg <= 0) return '';
    var full = Math.floor(avg);
    var half = (avg - full) >= 0.5 ? 1 : 0;
    var stars = '';
    for (var i = 0; i < full; i++) stars += '★';
    if (half) stars += '★';
    var empty = 5 - full - half;
    for (var j = 0; j < empty; j++) stars += '☆';
    return stars;
  }

  function truncate(str, max) {
    if (!str) return '';
    return str.length > max ? str.substring(0, max) + '…' : str;
  }

  function normalize(row) {
    // Works with both Supabase raw and directory-data.json mapped format
    return {
      nombre: row.nombre || row.n || '',
      slug: row.slug || '',
      categoria: row.categoria || row._categoria || '',
      plan: row.plan || '',
      descripcion: row.descripcion || row.desc || '',
      direccion: row.direccion || row.a || '',
      foto_portada: row.foto_portada || row.img || '',
      fotos: row.fotos || row.photos || [],
      rating_avg: parseFloat(row.rating_avg) || 0,
      rating_count: parseInt(row.rating_count) || 0,
      verificado: row.verificado || false,
      horario: row.horario || row.hours || row.tag || ''
    };
  }

  function getImage(item) {
    if (item.foto_portada) return item.foto_portada;
    if (item.fotos && item.fotos.length > 0) return item.fotos[0];
    return '';
  }

  function getProfileUrl(item) {
    return '/comercio/#' + (item.slug || '');
  }

  // ─── Render: Featured Carousel Card ─────────────────────────────────────────
  function renderFeaturedCard(item) {
    var img = getImage(item);
    var cat = item.categoria;
    var catLabel = CATEGORY_LABELS[cat] || cat;
    var emoji = CATEGORY_EMOJIS[cat] || '🏪';
    var url = getProfileUrl(item);

    var html = '<a class="featured-card" href="' + escapeHTML(url) + '">';

    // Image
    html += '<div class="featured-card__img-wrap">';
    if (img) {
      html += '<img class="featured-card__img" src="' + escapeHTML(img) + '" alt="' + escapeHTML(item.nombre) + '" loading="lazy">';
    } else {
      html += '<div class="featured-card__img-placeholder">' + emoji + '</div>';
    }

    // Badge
    if (item.plan === 'premium') {
      html += '<span class="featured-card__badge featured-card__badge--premium">💎 Premium</span>';
    } else if (item.plan === 'destacado') {
      html += '<span class="featured-card__badge featured-card__badge--destacado">⭐ Destacado</span>';
    }

    // Verified
    if (item.verificado) {
      html += '<span class="featured-card__verified">✓ Verificado</span>';
    }
    html += '</div>';

    // Body
    html += '<div class="featured-card__body">';
    html += '<span class="featured-card__cat">' + emoji + ' ' + escapeHTML(catLabel) + '</span>';
    html += '<h3 class="featured-card__name">' + escapeHTML(item.nombre) + '</h3>';

    // Rating
    if (item.rating_avg > 0) {
      html += '<div class="featured-card__rating">';
      html += '<span>' + renderStars(item.rating_avg) + '</span>';
      html += '<span class="featured-card__rating-num">' + item.rating_avg.toFixed(1) + '</span>';
      html += '</div>';
    }

    // Description
    if (item.descripcion) {
      html += '<p class="featured-card__desc">' + escapeHTML(truncate(item.descripcion, 90)) + '</p>';
    }

    html += '<span class="featured-card__cta">Ver más</span>';
    html += '</div></a>';

    return html;
  }

  // ─── Render: Category Mini Card ─────────────────────────────────────────────
  function renderMiniCard(item) {
    var img = getImage(item);
    var emoji = CATEGORY_EMOJIS[item.categoria] || '🏪';
    var url = getProfileUrl(item);

    var html = '<a class="cat-mini-card" href="' + escapeHTML(url) + '">';

    // Thumbnail
    if (img) {
      html += '<img class="cat-mini-card__thumb" src="' + escapeHTML(img) + '" alt="' + escapeHTML(item.nombre) + '" loading="lazy">';
    } else {
      html += '<div class="cat-mini-card__thumb-placeholder">' + emoji + '</div>';
    }

    // Info
    html += '<div class="cat-mini-card__info">';
    html += '<div class="cat-mini-card__name">' + escapeHTML(item.nombre) + '</div>';
    html += '<div class="cat-mini-card__meta">';
    if (item.rating_avg > 0) {
      html += '<span class="cat-mini-card__stars">' + renderStars(item.rating_avg) + ' ' + item.rating_avg.toFixed(1) + '</span>';
    } else if (item.direccion) {
      html += escapeHTML(truncate(item.direccion, 30));
    }
    html += '</div></div>';

    // Arrow
    html += '<span class="cat-mini-card__arrow">›</span>';
    html += '</a>';

    return html;
  }

  // ─── Render: Full Category Column ───────────────────────────────────────────
  function renderCategoryColumn(sectionConfig, items) {
    var html = '<div class="cat-column">';
    html += '<div class="cat-column__header">';
    html += '<span class="cat-column__icon">' + sectionConfig.icon + '</span>';
    html += '<h3 class="cat-column__title">' + escapeHTML(sectionConfig.title) + '</h3>';
    html += '</div>';

    if (items.length === 0) {
      html += '<p style="text-align:center;color:#999;font-size:.85rem;padding:1rem 0;">Próximamente</p>';
    } else {
      items.forEach(function (item) {
        html += renderMiniCard(item);
      });
    }

    html += '<a class="cat-column__more" href="' + escapeHTML(sectionConfig.filterUrl) + '">Ver todos →</a>';
    html += '</div>';

    return html;
  }

  // ─── Carousel Dots & Navigation ─────────────────────────────────────────────
  function setupCarouselNav(totalCards) {
    // Dots
    if (dotsEl && totalCards > 1) {
      var dotsHTML = '';
      var visibleCards = Math.min(totalCards, MAX_FEATURED);
      var dotCount = Math.ceil(visibleCards / 2); // 1 dot per ~2 cards
      for (var i = 0; i < dotCount; i++) {
        dotsHTML += '<button class="carousel-dot' + (i === 0 ? ' active' : '') + '" data-idx="' + i + '" aria-label="Grupo ' + (i + 1) + '"></button>';
      }
      dotsEl.innerHTML = dotsHTML;

      // Click dots to scroll
      dotsEl.addEventListener('click', function (e) {
        var dot = e.target.closest('.carousel-dot');
        if (!dot) return;
        var idx = parseInt(dot.dataset.idx);
        var cardWidth = carouselEl.querySelector('.featured-card').offsetWidth + 19; // gap ~1.2rem
        carouselEl.scrollTo({ left: idx * cardWidth * 2, behavior: 'smooth' });
      });
    }

    // Update active dot on scroll
    if (carouselEl && dotsEl) {
      carouselEl.addEventListener('scroll', function () {
        var scrollLeft = carouselEl.scrollLeft;
        var cardWidth = (carouselEl.querySelector('.featured-card') || {}).offsetWidth || 280;
        var idx = Math.round(scrollLeft / (cardWidth * 2));
        var dots = dotsEl.querySelectorAll('.carousel-dot');
        dots.forEach(function (d, i) {
          d.classList.toggle('active', i === idx);
        });
      });
    }

    // Arrow navigation
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', function () {
        var cardWidth = (carouselEl.querySelector('.featured-card') || {}).offsetWidth || 280;
        carouselEl.scrollBy({ left: -(cardWidth + 19), behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', function () {
        var cardWidth = (carouselEl.querySelector('.featured-card') || {}).offsetWidth || 280;
        carouselEl.scrollBy({ left: cardWidth + 19, behavior: 'smooth' });
      });
    }
  }

  // ─── Main Render ────────────────────────────────────────────────────────────
  function renderAll(allItems) {
    // 1) Featured carousel: premium first, then destacado, sorted by rating
    var featured = allItems
      .filter(function (it) { return it.plan === 'premium' || it.plan === 'destacado'; })
      .sort(function (a, b) {
        // Premium first
        if (a.plan === 'premium' && b.plan !== 'premium') return -1;
        if (b.plan === 'premium' && a.plan !== 'premium') return 1;
        // Then by rating
        return (b.rating_avg || 0) - (a.rating_avg || 0);
      })
      .slice(0, MAX_FEATURED);

    if (featured.length > 0) {
      carouselEl.innerHTML = featured.map(renderFeaturedCard).join('');
      setupCarouselNav(featured.length);
      // Show the section
      var section = document.getElementById('featuredSection');
      if (section) section.style.display = '';
    } else {
      // Hide carousel section if no featured businesses
      var section = document.getElementById('featuredSection');
      if (section) section.style.display = 'none';
    }

    // 2) Category columns: top items per category (sorted by rating, then verificado)
    var catHTML = '';
    CATEGORY_SECTIONS.forEach(function (sec) {
      var items = allItems
        .filter(function (it) {
          if (sec.key === 'alfareria') {
            return it.categoria === 'alfareria' || it.categoria === 'talleres' || it.categoria === 'comercio';
          }
          return it.categoria === sec.key;
        })
        .sort(function (a, b) {
          // Premium/destacado first
          var planOrder = { premium: 0, destacado: 1 };
          var pa = planOrder[a.plan] !== undefined ? planOrder[a.plan] : 2;
          var pb = planOrder[b.plan] !== undefined ? planOrder[b.plan] : 2;
          if (pa !== pb) return pa - pb;
          // Verified first
          if (a.verificado && !b.verificado) return -1;
          if (!a.verificado && b.verificado) return 1;
          // Higher rating first
          return (b.rating_avg || 0) - (a.rating_avg || 0);
        })
        .slice(0, MAX_PER_CATEGORY);

      catHTML += renderCategoryColumn(sec, items);
    });

    catGridEl.innerHTML = catHTML;

    // Show categories section
    var catSection = document.getElementById('categoriesSection');
    if (catSection) catSection.style.display = '';
  }

  // ─── Data Loading ───────────────────────────────────────────────────────────
  function processSupabaseRows(rows) {
    return rows.map(normalize);
  }

  function processDirectoryJSON(data) {
    // directory-data.json has categories as keys with arrays
    var items = [];
    var cats = ['alfareria', 'talleres', 'restaurantes', 'alojamiento', 'comercio',
                'servicios', 'estacionamientos', 'salud', 'seguridad', 'banos',
                'transporte', 'turismo'];
    cats.forEach(function (cat) {
      if (data[cat] && Array.isArray(data[cat])) {
        data[cat].forEach(function (row) {
          row._categoria = cat;
          items.push(normalize(row));
        });
      }
    });
    return items;
  }

  function loadFromSupabase() {
    var url = SUPABASE_URL + '/rest/v1/' + TABLE + '?select=nombre,slug,categoria,plan,descripcion,direccion,foto_portada,fotos,rating_avg,rating_count,verificado,horario&order=rating_avg.desc.nullslast';
    return fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Accept': 'application/json'
      }
    }).then(function (res) {
      if (!res.ok) throw new Error('Supabase ' + res.status);
      return res.json();
    }).then(processSupabaseRows);
  }

  function loadFromStaticJSON() {
    return fetch('/directory-data.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Static JSON ' + res.status);
        return res.json();
      })
      .then(processDirectoryJSON);
  }

  // ─── Init ───────────────────────────────────────────────────────────────────
  function init() {
    // Estrategia: Supabase es la fuente en vivo y siempre está disponible, así
    // que se usa primero. El JSON estático (/directory-data.json) es un caché
    // opcional que solo existe si el build lo generó; si no está desplegado,
    // pedirlo primero producía un 404 ruidoso en consola en cada carga del home.
    // Por eso solo se intenta como último recurso si Supabase falla.
    loadFromSupabase()
      .then(function (items) {
        if (items && items.length > 0) {
          renderAll(items);
          return;
        }
        // Supabase respondió vacío: intentar el JSON estático como respaldo.
        return loadFromStaticJSON().then(function (staticItems) {
          if (staticItems && staticItems.length > 0) renderAll(staticItems);
        });
      })
      .catch(function () {
        // Supabase falló (offline / error): intentar el JSON estático.
        loadFromStaticJSON()
          .then(function (items) {
            if (items && items.length > 0) renderAll(items);
            else hideSections();
          })
          .catch(hideSections);
      });
  }

  function hideSections() {
    var fs = document.getElementById('featuredSection');
    var cs = document.getElementById('categoriesSection');
    if (fs) fs.style.display = 'none';
    if (cs) cs.style.display = 'none';
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
