(function(){
  const slidesWrap = document.getElementById('slides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('dots');
  let index = 0;
  let timer;

  // Build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `Go to slide ${i+1}`);
    b.addEventListener('click', () => go(i, true));
    dotsWrap.appendChild(b);
  });

  function update(){
    slidesWrap.style.transform = `translateX(-${index*100}%)`;
    [...dotsWrap.children].forEach((d, i) => {
      d.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  }

  function go(i, manual=false){
    index = (i + slides.length) % slides.length;
    update();
    if (manual) restart();
  }

  function next(){ go(index+1); }
  function prev(){ go(index-1); }

  function start(){
    timer = setInterval(next, 5000);
  }
  function stop(){
    clearInterval(timer);
  }
  function restart(){ stop(); start(); }

  // Keyboard
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') { next(); restart(); }
    if(e.key === 'ArrowLeft')  { prev(); restart(); }
  });

  // Touch swipe
  let x0 = null;
  slidesWrap.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; stop(); }, {passive:true});
  slidesWrap.addEventListener('touchmove', e => {
    if(x0===null) return;
    const dx = e.touches[0].clientX - x0;
    if(Math.abs(dx) > 50){
      dx>0 ? prev() : next();
      x0=null; restart();
    }
  }, {passive:true});
  slidesWrap.addEventListener('touchend', ()=>{ x0=null; start(); });

  // Hover pause (desktop)
  slidesWrap.addEventListener('mouseenter', stop);
  slidesWrap.addEventListener('mouseleave', start);

  // Init
  update(); start();
})();
