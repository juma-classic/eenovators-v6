/* Mobile nav toggle: adds/removes .mobile-nav-open on <body>
   and toggles aria-expanded on the hamburger control.
   Lightweight and resilient for static mirrors (no external deps).
*/
(function(){
  'use strict';

  function qs(selector, root) { return (root||document).querySelector(selector); }

  function init() {
    var toggle = qs('.mobile_menu_bar.mobile_menu_bar_toggle');
    var menu   = qs('#et_mobile_nav_menu');
    if (!toggle || !menu) return;

    // Ensure ARIA defaults
    toggle.setAttribute('role', 'button');
    if (!toggle.hasAttribute('aria-controls')) toggle.setAttribute('aria-controls', 'et_mobile_nav_menu');
    toggle.setAttribute('aria-expanded', 'false');

    function setOpen(open) {
      document.body.classList.toggle('mobile-nav-open', !!open);
      toggle.setAttribute('aria-expanded', !!open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function(e){
      e.preventDefault();
      setOpen(!document.body.classList.contains('mobile-nav-open'));
    }, false);

    // Allow keyboard Enter/Space to toggle when toggle is a span/div
    toggle.addEventListener('keydown', function(e){
      var code = e.key || e.keyCode;
      if (code === 'Enter' || code === ' ' || code === 13 || code === 32) {
        e.preventDefault();
        setOpen(!document.body.classList.contains('mobile-nav-open'));
      }
    }, false);

    // Close the menu when clicking outside or on a menu link
    document.addEventListener('click', function(e){
      if (!document.body.classList.contains('mobile-nav-open')) return;
      if (toggle.contains(e.target)) return;
      if (menu.contains(e.target)) {
        // if clicked a link inside menu, close
        if (e.target.tagName === 'A') setOpen(false);
        return;
      }
      // clicked outside
      setOpen(false);
    }, false);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
