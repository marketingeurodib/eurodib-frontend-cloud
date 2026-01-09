// Vanilla slider + dropdown
(function(){
  const slides = [
    {title:'Smarter Napkin Solutions for a More Efficient Summer', date:'2 May 2025', read:'3 minutes read time', desc:'', badge:'Markets', image:'https://www.professional-kitchen.de/wp-content/uploads/go-x/u/cf0d2509-741b-46e6-93a1-8240059832d6/image-797x546.png', href:'#'},
    {title:'PROactively sustainable: Keeping your business ahead of the game', date:'1 May 2023', read:'5 minutes read time', desc:'Sustainability has been part of our DNA since day one, so we can help guide your decisions so customers get what they want in and out of the restroom.', badge:'Sustainability', image:'https://wp.pro.cascades.com/wp-content/uploads/2022/04/RB042022_1-e1669144458730.png', href:'#'},
    {title:'Prepare for Cold & Flu Season', date:'18 March 2025', read:'4 minutes read time', desc:'', badge:'Hygiene', image:'https://wp.pro.cascades.com/wp-content/uploads/2025/03/2024-12-18-4057-edit-768x512.jpg', href:'#'}
  ];

  // Slider refs
  const wrap = document.querySelector('.ed-hero__wrap');
  if(!wrap) return;
  const title = wrap.querySelector('[data-h-title]');
  const date = wrap.querySelector('[data-h-date]');
  const read = wrap.querySelector('[data-h-read]');
  const desc = wrap.querySelector('[data-h-desc]');
  const img = wrap.querySelector('[data-h-image]');
  const badge = wrap.querySelector('[data-h-badge]');
  const link = wrap.querySelector('[data-h-link]');
  const dotsWrap = document.getElementById('edHeroDots');
  const prev = wrap.querySelector('.ed-hero__arrow--prev');
  const next = wrap.querySelector('.ed-hero__arrow--next');

  let i=0, timer=null, AUTOPLAY=6000, hovering=false;

  function setSlide(idx){
    const s=slides[idx];
    title.textContent=s.title; date.textContent=s.date; read.textContent=s.read; desc.textContent=s.desc||''; img.src=s.image; badge.textContent=s.badge; link.href=s.href; i=idx;
    [...dotsWrap.children].forEach((d,k)=>d.setAttribute('aria-selected', String(k===idx)));
  }
  function buildDots(){
    dotsWrap.innerHTML='';
    slides.forEach((_,k)=>{ const b=document.createElement('button'); b.className='dot'; b.type='button'; b.setAttribute('aria-selected',k===0?'true':'false'); b.addEventListener('click',()=>{setSlide(k); restart();}); dotsWrap.appendChild(b); });
  }
  function nextSlide(){ setSlide((i+1)%slides.length); }
  function prevSlide(){ setSlide((i-1+slides.length)%slides.length); }
  function restart(){ clearInterval(timer); timer=setInterval(()=>{ if(!hovering) nextSlide(); }, AUTOPLAY); }

  next.addEventListener('click',()=>{ nextSlide(); restart(); });
  prev.addEventListener('click',()=>{ prevSlide(); restart(); });
  wrap.addEventListener('mouseenter',()=>{ hovering=true; });
  wrap.addEventListener('mouseleave',()=>{ hovering=false; });

  // swipe
  let sx=null; wrap.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;},{passive:true});
  wrap.addEventListener('touchend',e=>{ if(sx==null) return; const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>40){ dx<0?nextSlide():prevSlide(); restart(); } sx=null; });

  // init slider
  buildDots(); setSlide(0); restart();

  // Dropdown logic
  const filter = document.querySelector('[data-filter]');
  if(filter){
    const btn = filter.querySelector('.ed-filter__btn');
    const menu = filter.querySelector('.ed-filter__menu');
    function open(){ filter.setAttribute('aria-expanded','true'); btn.setAttribute('aria-expanded','true'); }
    function close(){ filter.setAttribute('aria-expanded','false'); btn.setAttribute('aria-expanded','false'); }
    btn.addEventListener('click', (e)=>{ e.stopPropagation(); const ex=filter.getAttribute('aria-expanded')==='true'; ex?close():open(); });
    document.addEventListener('click', (e)=>{ if(!filter.contains(e.target)) close(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
    // default collapsed
    close();
  }
})();




  // Back to top functionality
  document.querySelector('.ed-totop').addEventListener('click',()=>{
    window.scrollTo({top:0,behavior:'smooth'});
  });