/*
  services/industrial-engineering/scripts.js
  This page now uses ../../scripts.shared.js directly. This compatibility loader
  keeps the old local script path from failing if it is referenced later.
*/
(function loadSharedScript() { // Wrap inside an IIFE to prevent polluting the browser's global scope with temporary variables
  if (document.querySelector('script[src="../../scripts.shared.js"]')) return; // Check if the shared script tag is already in the document, abort if true
  const script = document.createElement('script'); // Create a brand new logical script element in the DOM
  script.src = '../../scripts.shared.js'; // Inform the script where the literal unified JavaScript logic lives
  script.defer = true; // Use defer to ensure the shared script parses in order without blocking page rendering
  document.head.appendChild(script); // Physically inject the element into the `<head>`, causing it to download
})(); // Add parenthesis to immediately invoke the logic without calling it elsewhere
