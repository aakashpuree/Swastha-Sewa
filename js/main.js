// js/main.js
// Swastha Sewa - Main Application Entry Point

// Global state
window.allDiseases = [];

// Initialize everything
function initApp() {
  console.log('%c[Swastha Sewa] Initializing application...', 'color:#606060');
  
  // 1. Combine all disease data
  combineDiseaseData();
  
  // 2. Remove loader after minimum display time
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 400);
    }
  }, 1500);
  
  // 3. Initialize all modules
  initCoreFeatures();
  
  // 4. Initial render
  setTimeout(() => {
    if (window.initFilters) {
      window.initFilters();
    }
    
    // Render trending
    renderTrendingDiseases();
    
    // Animate counters
    animateCounters();
  }, 1600);
  
  // 5. Keyboard shortcuts
  initKeyboardShortcuts();
  
  // 6. URL hash handling for deep linking
  handleURLHash();
  
  // 7. Scroll to top button
  initScrollToTop();
  
  // 8. Mobile hamburger menu
  initMobileMenu();
  
  // 9. Scroll reveal observer
  initScrollReveal();
  
  // 10. Bookmark & share global handlers
  initGlobalActions();
  
  // 11. Service worker (optional - progressive enhancement)
  if ('serviceWorker' in navigator) {
    // registerServiceWorker(); // Uncomment if you add a sw.js
  }
  
  // 12. Visibility change handler (pause heavy animations when tab hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.body.style.setProperty('--transition-normal', '0.01ms');
    } else {
      document.body.style.setProperty('--transition-normal', '0.3s ease');
    }
  });
  
  console.log('%c[Swastha Sewa] ✅ Application ready with 480+ diseases including Nepali names', 'color:#d1fe17');
}

// Combine data from all three sources
function combineDiseaseData() {
  const human = window.humanDiseases || [];
  const animal = window.animalDiseases || [];
  const plant = window.plantDiseases || [];
  
  window.allDiseases = [...human, ...animal, ...plant];
  
  // Update stats badge
  const statsBadge = document.querySelector('.stats-badge .count');
  if (statsBadge) {
    statsBadge.textContent = `${window.allDiseases.length}+ Diseases (नेपाली नाम सहित)`;
  }
  
  console.log(`Combined ${window.allDiseases.length} diseases with Nepali names (H:${human.length} A:${animal.length} P:${plant.length})`);
}

// Core feature initialization
function initCoreFeatures() {
  if (window.initSearch) window.initSearch();
  if (window.initFilters) window.initFilters(); // will also do initial render
  if (window.initAlphabetBar) window.initAlphabetBar();
  if (window.initTheme) window.initTheme();
  
  // Category card click handlers
  document.querySelectorAll('.category-card').forEach(card => {
    const category = card.dataset.category;
    if (category) {
      card.addEventListener('click', () => {
        if (window.selectCategory) {
          window.selectCategory(category);
        }
      });
      
      // Make keyboard accessible
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (window.selectCategory) window.selectCategory(category);
        }
      });
    }
  });
  
  // Category quick buttons in hero
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      if (category && window.selectCategory) {
        window.selectCategory(category);
      }
    });
  });
}

// Render trending diseases (from data where trending: true)
function renderTrendingDiseases() {
  const container = document.getElementById('trending-pills');
  if (!container || !window.allDiseases) return;
  
  const trending = window.allDiseases.filter(d => d.trending).slice(0, 8);
  
  if (trending.length === 0) {
    // Fallback: pick some popular ones
    const popular = ['Malaria', 'COVID-19', 'Diabetes', 'Rabies', 'Late Blight', 'Influenza'];
    const fallback = window.allDiseases.filter(d => popular.includes(d.name)).slice(0, 6);
    trending.push(...fallback);
  }
  
  container.innerHTML = trending.map(disease => `
    <div class="trending-pill" data-id="${disease.id}">
      <span class="icon">${disease.icon}</span>
      <span>${disease.name}</span>
    </div>
  `).join('');
  
  // Click handlers
  container.querySelectorAll('.trending-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const disease = window.allDiseases.find(d => d.id === pill.dataset.id);
      if (disease && window.openDiseaseModal) {
        window.openDiseaseModal(disease);
      }
    });
  });
}

// Animated counters in hero and stats
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number, .stat-large .number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.textContent.replace(/[^0-9]/g, '')) || 100;
    const suffix = counter.textContent.replace(/[0-9]/g, '');
    let current = 0;
    const increment = Math.ceil(target / 45);
    const duration = 1400;
    const stepTime = duration / (target / increment);
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = current + suffix;
    }, stepTime);
  });
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl + K or Cmd + K → focus search
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('search-input') || document.getElementById('hero-search');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
    
    // Escape → close modal
    if (e.key === 'Escape') {
      const modal = document.querySelector('.modal-overlay.active');
      if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
          if (modal.parentNode) modal.parentNode.removeChild(modal);
        }, 200);
      }
    }
    
    // / key → focus search (when not typing in input)
    if (e.key === '/' && document.activeElement.tagName === 'BODY') {
      e.preventDefault();
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.focus();
    }
  });
  
  // Add hint to console for power users
  console.log('%c[Swastha Sewa] Keyboard shortcuts: Ctrl+K (search), / (search), Esc (close modal)', 'color:#606060');
}

// Deep linking via URL hash (#disease-h001)
function handleURLHash() {
  const hash = window.location.hash;
  if (!hash || !hash.startsWith('#disease-')) return;
  
  const id = hash.replace('#disease-', '');
  const disease = (window.allDiseases || []).find(d => d.id === id);
  
  if (disease) {
    // Wait for app to be ready
    setTimeout(() => {
      if (window.openDiseaseModal) {
        window.openDiseaseModal(disease);
      }
    }, 1800);
  }
}

// Scroll to top floating button
function initScrollToTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
  
  btn.addEventListener('click', () => {
    if (window.SwasthaUtils && window.SwasthaUtils.scrollToTop) {
      window.SwasthaUtils.scrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// Mobile hamburger menu
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (!hamburger || !navLinks) return;
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  
  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// Intersection Observer for scroll reveal
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe sections
  document.querySelectorAll('.category-showcase, .trending-section, .how-it-works, .stats-section').forEach(section => {
    section.classList.add('reveal');
    observer.observe(section);
  });
}

// Global bookmark + share actions (for modal too)
function initGlobalActions() {
  // Global share function
  window.shareDisease = async function(name) {
    const text = `Check out ${name} on Swastha Sewa - Your Trusted Health Companion`;
    const url = window.location.href.split('#')[0] + '#disease-' + (window.allDiseases.find(d => d.name === name)?.id || '');
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Swastha Sewa', text, url });
        if (window.SwasthaUtils) window.SwasthaUtils.showToast('Shared successfully!');
      } catch (err) {
        // User cancelled or error
      }
    } else {
      const success = await (window.SwasthaUtils ? window.SwasthaUtils.copyToClipboard(url) : copyToClipboardFallback(url));
      if (success && window.SwasthaUtils) {
        window.SwasthaUtils.showToast('Link copied to clipboard!');
      }
    }
  };
  
  // Global modal opener
  window.openDiseaseModal = function(disease) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        ${window.SwasthaRender ? window.SwasthaRender.createModalContent(disease) : createFallbackModal(disease)}
      </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.classList.add('active');
    
    // Focus trap
    const modal = overlay.querySelector('.modal');
    modal.focus();
    
    // Close handlers
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(overlay));
    }
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
    
    // Bookmark in modal
    const bookmarkBtn = overlay.querySelector('.bookmark-modal-btn');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        const id = bookmarkBtn.dataset.id;
        const isBookmarked = window.SwasthaUtils && window.SwasthaUtils.isBookmarked(id);
        
        if (isBookmarked) {
          if (window.SwasthaUtils) window.SwasthaUtils.removeBookmark(id);
          bookmarkBtn.innerHTML = '🤍 Save to Bookmarks';
          if (window.SwasthaUtils) window.SwasthaUtils.showToast('Bookmark removed');
        } else {
          if (window.SwasthaUtils) window.SwasthaUtils.saveBookmark(id);
          bookmarkBtn.innerHTML = '❤️ Remove Bookmark';
          if (window.SwasthaUtils) window.SwasthaUtils.showToast('Disease bookmarked!');
        }
        
        // Update any visible cards
        document.querySelectorAll(`.disease-card[data-id="${id}"] .bookmark-btn`).forEach(btn => {
          btn.innerHTML = isBookmarked ? '🤍' : '❤️';
          btn.classList.toggle('bookmarked', !isBookmarked);
        });
      });
    }
    
    // Share in modal
    const shareBtn = overlay.querySelector('.share-modal-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (window.shareDisease) window.shareDisease(disease.name);
      });
    }
    
    // Update URL for deep linking
    history.replaceState(null, '', `#disease-${disease.id}`);
  };
  
  function closeModal(overlay) {
    overlay.classList.remove('active');
    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      // Clean URL hash
      if (window.location.hash.startsWith('#disease-')) {
        history.replaceState(null, '', window.location.pathname);
      }
    }, 220);
  }
  
  function createFallbackModal(disease) {
    return `<div class="modal-body"><h2>${disease.name}</h2><p>${disease.description}</p></div>`;
  }
  
  // Fallback copy
  function copyToClipboardFallback(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

// Optional service worker registration
async function registerServiceWorker() {
  try {
    await navigator.serviceWorker.register('/sw.js');
    console.log('Service worker registered');
  } catch (e) {
    console.log('SW registration skipped');
  }
}

// Boot the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

// Expose some useful globals for debugging / future use
window.SwasthaSewa = {
  getAllDiseases: () => window.allDiseases,
  search: (q) => window.searchDiseases ? window.searchDiseases(q) : [],
  resetFilters: () => window.resetFilters && window.resetFilters()
};