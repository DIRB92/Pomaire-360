(function(){
var lb = document.getElementById('galleryLightbox');
var lbImg = document.getElementById('glbImg');
var lbCap = document.getElementById('glbCaption');
var lbCount = document.getElementById('glbCounter');
var items = document.querySelectorAll('.bento-item');
var current = 0;
function openLightbox(idx){
current = idx;
showSlide();
lb.setAttribute('aria-hidden','false');
document.body.style.overflow = 'hidden';
}
function showSlide(){
var item = items[current];
var img = item.querySelector('img');
var cap = item.querySelector('.bento-caption');
var fullSrc = img.getAttribute('data-full') || img.getAttribute('data-full-jpg') || img.src;
lbImg.src = fullSrc;
lbImg.alt = img.alt;
lbCap.textContent = cap ? cap.textContent : '';
lbCount.textContent = (current+1) + ' / ' + items.length;
}
window.closeGalleryLightbox = function(e){
if(e.target === lb || e.target.classList.contains('glb-close')){
lb.setAttribute('aria-hidden','true');
document.body.style.overflow = '';
lbImg.src = '';
}
};
window.navGallery = function(dir){
current = (current + dir + items.length) % items.length;
showSlide();
};
items.forEach(function(item, i){
item.addEventListener('click', function(){ openLightbox(i); });
item.addEventListener('keydown', function(e){
if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openLightbox(i); }
});
});
document.addEventListener('keydown', function(e){
if(lb.getAttribute('aria-hidden') === 'false'){
if(e.key === 'Escape'){ lb.setAttribute('aria-hidden','true'); document.body.style.overflow=''; lbImg.src=''; }
if(e.key === 'ArrowRight') navGallery(1);
if(e.key === 'ArrowLeft') navGallery(-1);
}
});
items.forEach(function(item){
item.addEventListener('mouseenter', function(){
var img = item.querySelector('img');
var full = img.getAttribute('data-full');
if(full && !item._preloaded){
var pre = new Image();
pre.src = full;
item._preloaded = true;
}
}, {once:true});
});
})();