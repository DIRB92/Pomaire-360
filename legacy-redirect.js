(function () {
'use strict';
var map = {
'#estacionamientos': '/estacionamientos/',
'#salud': '/salud/',
'#seguridad': '/seguridad/',
'#comercio': '/comercio/',
'#alfareria': '/alfareria/',
'#ruta-vino': '/ruta-del-vino/',
'#interes': '/que-ver/',
'#plaza': '/plaza/',
'#alrededores': '/alrededores/',
'#gastronomia': '/gastronomia/',
'#alojamientos': '/alojamientos/',
'#anunciate': '/anunciate/',
'#banos': '/plaza/#banos',
'#gruas': '/gruas/'
};
function go() {
var d = map[location.hash];
if (d) location.replace(d);
}
go();
window.addEventListener('hashchange', go);
})();