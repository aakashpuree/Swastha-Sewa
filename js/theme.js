// js/theme.js
// Swastha Sewa - Theme & Visual Effects (Dark Mode Only)

function initTheme() {
  // Force dark mode - no toggle needed
  document.documentElement.setAttribute('data-theme', 'dark');
  document.body.classList.add('dark-mode');
  
  // Add neon glow effects to key elements
  addNeonEffects();
  
  // Header scroll effect
  initHeaderScroll();
  
  // Custom cursor glow on interactive elements (subtle)
  initInteractiveGlow();
  
  console.log('Theme & visual effects initialized');
}

function addNeonEffects() {
  // Add subtle neon pulse to primary accent elements periodically
  const accentElements = document.querySelectorAll('.btn-primary, .nav-brand');
  
  accentElements.forEach(el => {
    // Random subtle pulse every 8-15 seconds
    setInterval(() => {
      if (!el.matches(':hover')) {
        el.style.transition = 'box-shadow 0.8s ease';
        el.style.boxShadow = '0 0 12px rgba(209, 254, 23, 0.35)';
        
        setTimeout(() => {
          el.style.boxShadow = '';
        }, 1200);
      }
    }, 8000 + Math.random() * 7000);
  });
}

function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
}

function initInteractiveGlow() {
  // Add temporary glow on focus/hover for important buttons
  const interactive = document.querySelectorAll('.category-btn, .btn-primary, .alpha-btn');
  
  interactive.forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.boxShadow = '0 0 15px rgba(209, 254, 23, 0.25)';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.boxShadow = '';
    });
  });
}

// Optional: Add scanline effect on hero (very subtle tech feel)
function addScanlineEffect() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const scanline = document.createElement('div');
  scanline.style.cssText = `
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(transparent, rgba(209,254,23,0.08), transparent);
    pointer-events: none;
    z-index: 3;
    animation: scanline 4s linear infinite;
    display: none;
  `;
  
  // Only show on very large screens for performance
  if (window.innerWidth > 1400) {
    scanline.style.display = 'block';
    hero.appendChild(scanline);
  }
}

// Call on init if wanted (currently disabled for cleaner look)
// setTimeout(addScanlineEffect, 2000);

console.log('Theme module loaded');