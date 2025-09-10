document.addEventListener('DOMContentLoaded', ()=> {
  const nav = document.getElementById('mainNav');
  if(!nav) return;

  const menu = nav.querySelector('#mainMenu');
  const indicator = nav.querySelector('#navIndicator');
  const items = Array.from(nav.querySelectorAll('.nav-menu > .nav-item > a'));
  const toggle = document.getElementById('navToggle');

  // Disable visual indicator movement to remove hover animation
  const moveIndicator = ()=>{/* no-op */};
  const resetIndicator = ()=>{/* no-op */};

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
  // recalc overflow handling
  handleOverflow();
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

  /* --- Overflow handling: move items into a More dropdown when they don't fit --- */
  const setupMore = ()=>{
    const navMenu = nav.querySelector('.nav-menu');
    if(!navMenu) return;
    // create More container if missing
    let moreLi = navMenu.querySelector('.nav-item.nav-more');
    if(!moreLi){
      moreLi = document.createElement('li');
      moreLi.className = 'nav-item nav-more';
      moreLi.setAttribute('role','none');
  moreLi.innerHTML = '<button class="more-toggle" aria-haspopup="true" aria-expanded="false" aria-label="Get Quotation">get quotation</button><ul class="more-menu" role="menu"></ul>';
      navMenu.appendChild(moreLi);
    }
    return moreLi;
  };

  const handleOverflow = ()=>{
    const navInner = nav.querySelector('.nav-inner');
    const navWrap = nav.querySelector('.nav-wrap');
    const navMenu = nav.querySelector('.nav-menu');
    if(!navMenu || !navInner) return;

    const moreLi = setupMore();
    const moreMenu = moreLi.querySelector('.more-menu');
    const moreToggle = moreLi.querySelector('.more-toggle');

    // move any previous overflowed items back into the main menu (place before moreLi)
    Array.from(moreMenu.children).forEach(ch=> navMenu.insertBefore(ch, moreLi));

    // hide more while measuring
    moreLi.style.display = 'none';

    // measure available width inside nav-wrap (client widths are stable)
    const available = navWrap.clientWidth - (nav.querySelector('.brand')?.offsetWidth || 0) - 20;

    // If navMenu.scrollWidth fits, nothing to do
    if(navMenu.scrollWidth <= available){
      moreLi.style.display = 'none';
      nav.classList.remove('compact','aggressive');
      return;
    }

    // Move last items into More until it fits
    moreLi.style.display = '';
    // collect items (exclude moreLi itself)
    let items = Array.from(navMenu.querySelectorAll('.nav-item')).filter(li=> !li.classList.contains('nav-more'));
    while(navMenu.scrollWidth > available && items.length){
      const li = items.pop();
      // move element into moreMenu as a simple li (preserve link)
      const a = li.querySelector('a');
      const newLi = document.createElement('li');
      if(a){
        const newA = a.cloneNode(true);
        newA.setAttribute('role','menuitem');
        newLi.appendChild(newA);
      } else {
        newLi.textContent = li.textContent.trim();
      }
      moreMenu.insertBefore(newLi, moreMenu.firstChild);
      li.parentNode.removeChild(li);
      items = Array.from(navMenu.querySelectorAll('.nav-item')).filter(li=> !li.classList.contains('nav-more'));
    }

    // Recompute usage ratio and apply compact/aggressive
    const used = navMenu.scrollWidth;
    const compactThreshold = available * 0.92;
    const aggressiveThreshold = available * 0.82;
    nav.classList.remove('compact','aggressive');
    if(used > aggressiveThreshold) nav.classList.add('compact','aggressive');
    else if(used > compactThreshold) nav.classList.add('compact');

    // add toggle listener once
    if(!moreLi._moreInit){
      moreToggle.addEventListener('click', (e)=>{
        const expanded = moreLi.getAttribute('aria-expanded') === 'true';
        moreLi.setAttribute('aria-expanded', String(!expanded));
        moreToggle.setAttribute('aria-expanded', String(!expanded));
        e.stopPropagation();
      });
      // close more on outside click (only once)
      document.addEventListener('click', (e)=>{
        if(!moreLi.contains(e.target)){
          moreLi.setAttribute('aria-expanded','false');
          if(moreToggle) moreToggle.setAttribute('aria-expanded','false');
        }
      });
      moreLi._moreInit = true;
    }
  };
  // run overflow handling after load and when layout stabilizes
  window.addEventListener('load', ()=> setTimeout(handleOverflow,200));
  // also run on a short debounce for resize
  let overflowTimer;
  window.addEventListener('resize', ()=>{ clearTimeout(overflowTimer); overflowTimer = setTimeout(handleOverflow,120); });

  // Some lazy assets or font swaps can change metrics later; observe the nav for subtree changes and re-run
  const mo = new MutationObserver(()=>{ clearTimeout(overflowTimer); overflowTimer = setTimeout(handleOverflow,160); });
  mo.observe(nav, {subtree:true, childList:true, attributes:true});

  // expose for manual calls
  nav.handleOverflow = handleOverflow;

  // Respect reduced motion: no-op since animations are disabled
});
