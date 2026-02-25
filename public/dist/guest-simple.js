// Simplified guest.js replacement for Next.js
(function() {
  'use strict';

  // Wait for all elements to be ready
  function waitForElements(callback) {
    let attempts = 0;
    const maxAttempts = 50;
    
    function check() {
      attempts++;
      const welcome = document.getElementById('welcome');
      const loading = document.getElementById('loading');
      const root = document.getElementById('root');
      
      if (welcome && loading && root) {
        callback();
      } else if (attempts < maxAttempts) {
        setTimeout(check, 100);
      }
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', check);
    } else {
      check();
    }
  }

  // Initialize the invitation
  function init() {
    const welcome = document.getElementById('welcome');
    const loading = document.getElementById('loading');
    const root = document.getElementById('root');
    
    if (!welcome || !loading || !root) {
      console.warn('Required elements not found');
      return;
    }

    // Create global undangan object
    window.undangan = window.undangan || {};
    window.undangan.guest = {
      open: function(button) {
        if (button) {
          button.disabled = true;
        }
        
        // Fade out welcome page
        welcome.style.transition = 'opacity 0.5s';
        welcome.style.opacity = '0';
        
        setTimeout(function() {
          welcome.style.display = 'none';
          
          // Show loading
          loading.style.opacity = '1';
          loading.style.display = 'block';
          
          // After 1 second, show main content
          setTimeout(function() {
            loading.style.transition = 'opacity 0.5s';
            loading.style.opacity = '0';
            
            setTimeout(function() {
              loading.style.display = 'none';
              
              // Show main content
              root.style.transition = 'opacity 0.5s';
              root.style.opacity = '1';
              
              // Dispatch event for music player
              document.dispatchEvent(new Event('undangan.open'));
            }, 500);
          }, 1000);
        }, 500);
      }
    };

    // Show welcome page
    welcome.style.opacity = '1';
  }

  // Wait for elements and initialize
  waitForElements(init);
})();
