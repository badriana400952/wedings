// Wrapper for guest.js to prevent errors on non-home pages
(function() {
  // Only load on home page - check pathname first
  if (window.location.pathname !== '/' && window.location.pathname !== '/index') {
    console.log('Skipping guest.js - not on home page (path: ' + window.location.pathname + ')');
    return;
  }
  
  // Wait for all required elements to be available
  const waitForElements = function(callback, maxAttempts = 50) {
    let attempts = 0;
    
    const checkElements = function() {
      attempts++;
      
      const welcome = document.getElementById('welcome');
      const loading = document.getElementById('loading');
      const root = document.getElementById('root');
      
      // Check if all required elements exist
      if (welcome && loading && root) {
        console.log('All required elements found, loading guest.js');
        callback();
      } else if (attempts < maxAttempts) {
        // Try again after a short delay
        setTimeout(checkElements, 100);
      } else {
        console.warn('Timeout waiting for elements, skipping guest.js');
      }
    };
    
    checkElements();
  };
  
  // Load guest.js after elements are ready
  const loadGuestScript = function() {
    const script = document.createElement('script');
    script.src = '/dist/guest.js';
    script.async = true;
    script.onerror = function() {
      console.warn('Failed to load guest.js');
    };
    document.body.appendChild(script);
  };
  
  // Wait for DOM to be ready, then wait for elements
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      waitForElements(loadGuestScript);
    });
  } else {
    waitForElements(loadGuestScript);
  }
})();
