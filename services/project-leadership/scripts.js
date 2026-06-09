/*
  services/project-leadership/scripts.js

  This page now uses ../../scripts.shared.js directly. This compatibility loader
  keeps the old local script path from failing if it is referenced later.
*/

(function loadSharedScript() {
  if (document.querySelector('script[src="../../scripts.shared.js"]')) return;

  const script = document.createElement('script');
  script.src = '../../scripts.shared.js';
  script.defer = true;
  document.head.appendChild(script);
})();
