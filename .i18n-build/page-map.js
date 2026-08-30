// Mapa de páginas traducibles: slug -> ruta relativa al archivo fuente ES.
// 'index' es un caso especial que vive en la raíz del sitio.
module.exports = {
  index: { file: 'index.html', esPath: '/' },
  alfareria: { file: 'alfareria/index.html', esPath: '/alfareria/' },
  anunciate: { file: 'anunciate/index.html', esPath: '/anunciate/' },
  apoyar: { file: 'apoyar/index.html', esPath: '/apoyar/' },
  comercio: { file: 'comercio/index.html', esPath: '/comercio/' },
  elchanchoalcanciamasgrandedelmundo: { file: 'elchanchoalcanciamasgrandedelmundo/index.html', esPath: '/elchanchoalcanciamasgrandedelmundo/' },
  estacionamientos: { file: 'estacionamientos/index.html', esPath: '/estacionamientos/' },
  juegos: { file: 'juegos/index.html', esPath: '/juegos/' },
  links: { file: 'links/index.html', esPath: '/links/' },
  plaza: { file: 'plaza/index.html', esPath: '/plaza/' },
  'ruta-del-vino': { file: 'ruta-del-vino/index.html', esPath: '/ruta-del-vino/' },
  salud: { file: 'salud/index.html', esPath: '/salud/' },
  seguridad: { file: 'seguridad/index.html', esPath: '/seguridad/' },
  sugerencias: { file: 'sugerencias/index.html', esPath: '/sugerencias/' },
  'guia-turistica': { file: 'guia-turistica/index.html', esPath: '/guia-turistica/' }
};

// Idiomas con página estática real (SEO indexable).
module.exports.STATIC_LANGS = ['es', 'en', 'pt', 'ja'];
// Idiomas que siguen funcionando solo vía el switcher JS existente (no indexados).
module.exports.JS_ONLY_LANGS = ['fr', 'ru', 'zh'];

module.exports.langPath = function (slug, lang) {
  const entry = module.exports[slug];
  if (!entry) throw new Error('Unknown slug: ' + slug);
  if (lang === 'es') return entry.esPath;
  if (slug === 'index') return '/' + lang + '/';
  return '/' + lang + '/' + slug + '/';
};
