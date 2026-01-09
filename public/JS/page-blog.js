// Related products arrows (scroll)
(function(){
  const rail = document.getElementById('prodRail');
  if(!rail) return;
  const wrap = rail.closest('.ed-related');
  wrap.querySelector('.arr.next').addEventListener('click',()=>rail.scrollBy({left:260,behavior:'smooth'}));
  wrap.querySelector('.arr.prev').addEventListener('click',()=>rail.scrollBy({left:-260,behavior:'smooth'}));
})();
