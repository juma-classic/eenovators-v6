document.addEventListener('DOMContentLoaded', ()=> {
  const nav = document.getElementById('mainNav');
  if(!nav) return;

  const menu = nav.querySelector('#mainMenu');
  const indicator = nav.querySelector('#navIndicator');
  const items = Array.from(nav.querySelectorAll('.nav-menu > .nav-item > a'));
  const toggle = document.getElementById('navToggle');

  // Move indicator under target link (on hover/focus)
  const moveIndicator = (el) => {
    if(!indicator || !el) return;
    const rect = el.getBoundingClientRect();
    const contRect = nav.querySelector('.nav-wrap').getBoundingClientRect();
    const width = Math.max(40, rect.width + 8);
    const offset = rect.left - contRect.left + (rect.width - width)/2;
    indicator.style.width = width + 'px';
    indicator.style.transform = `translateX(${offset}px)`;
    indicator.style.opacity = 1;
  };

  const resetIndicator = () =>{
    if(!indicator) return;
    indicator.style.opacity = 0;
  };

  // attach hover/focus handlers
  items.forEach(a=>{
    a.addEventListener('mouseenter', ()=> moveIndicator(a));
    a.addEventListener('focus', ()=> moveIndicator(a));
    a.addEventListener('mouseleave', resetIndicator);
    a.addEventListener('blur', resetIndicator);
  });

  // update on resize
  window.addEventListener('resize', ()=> {
    // hide indicator when resized
    resetIndicator();
  });

  // mobile menu toggle
  if(toggle){
    toggle.addEventListener('click', ()=>{
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('show');
    });
  }

  // submenu toggle for touch / mobile
  Array.from(nav.querySelectorAll('.submenu-toggle')).forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const li = btn.closest('.has-sub');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const link = li.querySelector('a[aria-haspopup="true"]');
      if(link) link.setAttribute('aria-expanded', String(!expanded));
      li.classList.toggle('open', !expanded);
      e.stopPropagation();
    });
  });

  // close menus on outside click
  document.addEventListener('click', (e)=>{
    if(!nav.contains(e.target)){
      nav.querySelectorAll('.has-sub.open').forEach(li=> li.classList.remove('open'));
      menu.classList.remove('show');
      if(toggle) toggle.setAttribute('aria-expanded','false');
    }
  });

  // basic keyboard navigation (left/right on top-level)
  nav.addEventListener('keydown', (e)=>{
    const active = document.activeElement;
    const topLinks = items;
    const idx = topLinks.indexOf(active);
    if(e.key === 'ArrowRight' && idx > -1){
      e.preventDefault();
      const next = topLinks[(idx+1)%topLinks.length];
      next.focus();
    } else if(e.key === 'ArrowLeft' && idx > -1){
      e.preventDefault();
      const prev = topLinks[(idx-1+topLinks.length)%topLinks.length];
      prev.focus();
    } else if(e.key === 'Escape'){
      // close all
      nav.querySelectorAll('.has-sub.open').forEach(li=> li.classList.remove('open'));
      menu.classList.remove('show');
      if(toggle) toggle.setAttribute('aria-expanded','false');
    }
  });

  // Respect reduced motion: disable indicator animation
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    indicator.style.transition = 'none';
  }
});
