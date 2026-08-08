// Mapa de páginas traducibles: slug -> ruta relativa al archivo fuente ES.
// 'index' es un caso especial que vive en la raíz del sitio.
module.exports = {
  index: { file: 'index.html', esPath: '/' },
  alfareria: { file: 'alfareria/index.html', esPath: '/alfareria/' },
  alojamientos: { file: 'alojamientos/index.html', esPath: '/alojamientos/' },
  alrededores: { file: 'alrededores/index.html', esPath: '/alrededores/' },
  anunciate: { file: 'anunciate/index.html', esPath: '/anunciate/' },
  apoyar: { file: 'apoyar/index.html', esPath: '/apoyar/' },
  comercio: { file: 'comercio/index.html', esPath: '/comercio/' },
  elchanchoalcanciamasgrandedelmundo: { file: 'elchanchoalcanciamasgrandedelmundo/index.html', esPath: '/elchanchoalcanciamasgrandedelmundo/' },
  estacionamientos: { file: 'estacionamientos/index.html', esPath: '/estacionamientos/' },
  gastronomia: { file: 'gastronomia/index.html', esPath: '/gastronomia/' },
  gruas: { file: 'gruas/index.html', esPath: '/gruas/' },
  juegos: { file: 'juegos/index.html', esPath: '/juegos/' },
  links: { file: 'links/index.html', esPath: '/links/' },
  locomocion: { file: 'locomocion/index.html', esPath: '/locomocion/' },
  plaza: { file: 'plaza/index.html', esPath: '/plaza/' },
  'que-ver': { file: 'que-ver/index.html', esPath: '/que-ver/' },
  'ruta-del-vino': { file: 'ruta-del-vino/index.html', esPath: '/ruta-del-vino/' },
  salud: { file: 'salud/index.html', esPath: '/salud/' },
  seguridad: { file: 'seguridad/index.html', esPath: '/seguridad/' },
  sugerencias: { file: 'sugerencias/index.html', esPath: '/sugerencias/' },
  'guia-turistica': { file: 'guia-turistica/index.html', esPath: '/guia-turistica/' }
};

// Idiomas con página estática real (SEO indexable).
module.exports.STATIC_LANGS = ['es', 'en', 'pt'];
// Idiomas que siguen funcionando solo vía el switcher JS existente (no indexados).
module.exports.JS_ONLY_LANGS = ['fr', 'ru', 'ja', 'zh'];

module.exports.langPath = function (slug, lang) {
  const entry = module.exports[slug];
  if (!entry) throw new Error('Unknown slug: ' + slug);
  if (lang === 'es') return entry.esPath;
  if (slug === 'index') return '/' + lang + '/';
  return '/' + lang + '/' + slug + '/';
};
