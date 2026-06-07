// js/filter.js
// Swastha Sewa - Filter, Sort & Pagination System

let currentFiltered = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 12;
let currentView = 'grid'; // 'grid' or 'list'

// Apply all active filters
function applyFilters() {
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('filter-category');
  const typeFilter = document.getElementById('filter-type');
  const severityFilter = document.getElementById('filter-severity');
  const sortSelect = document.getElementById('sort-by');
  const alphaActive = document.querySelector('.alpha-btn.active');
  
  let diseases = [...(window.allDiseases || [])];
  
  // Text search
  if (searchInput && searchInput.value.trim()) {
    diseases = searchDiseases(searchInput.value.trim(), diseases);
  }
  
  // Category filter
  if (categoryFilter && categoryFilter.value) {
    diseases = diseases.filter(d => d.category === categoryFilter.value);
  }
  
  // Type filter
  if (typeFilter && typeFilter.value) {
    diseases = diseases.filter(d => d.type === typeFilter.value);
  }
  
  // Severity filter
  if (severityFilter && severityFilter.value) {
    diseases = diseases.filter(d => d.severity === severityFilter.value);
  }
  
  // Alphabet filter
  if (alphaActive && alphaActive.dataset.letter) {
    const letter = alphaActive.dataset.letter.toLowerCase();
    diseases = diseases.filter(d => 
      d.name.toLowerCase().startsWith(letter)
    );
  }
  
  // Sorting
  if (sortSelect) {
    diseases = sortDiseases(diseases, sortSelect.value);
  }
  
  currentFiltered = diseases;
  currentPage = 1;
  
  renderResults(diseases);
  updateResultsMeta(diseases.length);
}

// Sort diseases
function sortDiseases(diseases, sortBy) {
  const sorted = [...diseases];
  
  switch (sortBy) {
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'severity':
      const severityOrder = { mild: 1, moderate: 2, severe: 3, critical: 4 };
      sorted.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
      break;
    case 'category':
      sorted.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
      break;
    case 'trending':
      sorted.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || a.name.localeCompare(b.name));
      break;
    default:
      // Default: trending first, then name
      sorted.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || a.name.localeCompare(b.name));
  }
  
  return sorted;
}

// Render results with skeleton then content
function renderResults(diseases) {
  const grid = document.getElementById('disease-grid');
  if (!grid) return;
  
  grid.innerHTML = createSkeletonCards(8);
  
  // Simulate small delay for skeleton effect (feels more premium)
  setTimeout(() => {
    renderPage(diseases, true);
  }, 180);
}

// Render a page of diseases using DocumentFragment for performance
function renderPage(diseases, reset = false) {
  const grid = document.getElementById('disease-grid');
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (!grid) return;
  
  if (reset) {
    grid.innerHTML = '';
    currentPage = 1;
  }
  
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageDiseases = diseases.slice(start, end);
  
  if (pageDiseases.length === 0 && currentPage === 1) {
    showNoResults(grid);
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  }
  
  const fragment = document.createDocumentFragment();
  
  pageDiseases.forEach(disease => {
    const cardHTML = createDiseaseCard(disease);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHTML.trim();
    const cardElement = tempDiv.firstChild;
    
    // Attach event listeners
    attachCardListeners(cardElement, disease);
    
    fragment.appendChild(cardElement);
  });
  
  grid.appendChild(fragment);
  
  // Update view class
  grid.classList.toggle('list-view', currentView === 'list');
  
  // Load more button visibility
  if (loadMoreBtn) {
    if (end < diseases.length) {
      loadMoreBtn.style.display = 'inline-flex';
      loadMoreBtn.onclick = () => {
        currentPage++;
        renderPage(diseases, false);
      };
    } else {
      loadMoreBtn.style.display = 'none';
    }
  }
  
  // Scroll reveal for new cards
  setTimeout(() => {
    const newCards = grid.querySelectorAll('.disease-card:not(.revealed)');
    newCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('revealed');
      }, index * 30);
    });
  }, 50);
}

function showNoResults(container) {
  container.innerHTML = `
    <div class="no-results">
      <div class="no-results-icon">🔍</div>
      <h3>No diseases found</h3>
      <p>Try adjusting your filters or search terms.</p>
      <button class="btn btn-primary" onclick="resetFilters()">Reset All Filters</button>
    </div>
  `;
}

// Attach listeners to a rendered card
function attachCardListeners(cardElement, disease) {
  // Open modal on card click (except action buttons)
  cardElement.addEventListener('click', (e) => {
    if (!e.target.closest('.card-actions')) {
      if (window.openDiseaseModal) {
        window.openDiseaseModal(disease);
      }
    }
  });
  
  // Keyboard accessibility
  cardElement.setAttribute('tabindex', '0');
  cardElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (window.openDiseaseModal) window.openDiseaseModal(disease);
    }
  });
  
  // Bookmark button
  const bookmarkBtn = cardElement.querySelector('.bookmark-btn');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      toggleBookmark(e, disease.id, bookmarkBtn);
    });
  }
  
  // Share button
  const shareBtn = cardElement.querySelector('.share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      if (window.shareDisease) {
        window.shareDisease(disease.name);
      }
    });
  }
}

// Update results count
function updateResultsMeta(total) {
  const meta = document.getElementById('results-meta');
  if (!meta) return;
  
  const showing = Math.min(currentPage * ITEMS_PER_PAGE, total);
  meta.innerHTML = `Showing <strong>${showing}</strong> of <strong>${total}</strong> diseases`;
}

// Load more (pagination)
function loadMore() {
  if (window.applyFilters) {
    // Re-render will be handled by applyFilters logic
    currentPage++;
    const grid = document.getElementById('disease-grid');
    if (grid) {
      // This is handled inside renderPage now
    }
  }
}

// Reset all filters
function resetFilters() {
  // Clear inputs
  const searchInput = document.getElementById('search-input');
  const heroSearch = document.getElementById('hero-search');
  const categoryFilter = document.getElementById('filter-category');
  const typeFilter = document.getElementById('filter-type');
  const severityFilter = document.getElementById('filter-severity');
  const sortSelect = document.getElementById('sort-by');
  
  if (searchInput) searchInput.value = '';
  if (heroSearch) heroSearch.value = '';
  if (categoryFilter) categoryFilter.value = '';
  if (typeFilter) typeFilter.value = '';
  if (severityFilter) severityFilter.value = '';
  if (sortSelect) sortSelect.value = 'default';
  
  // Clear alphabet
  document.querySelectorAll('.alpha-btn').forEach(btn => btn.classList.remove('active'));
  
  // Reset state
  currentFiltered = [...(window.allDiseases || [])];
  currentPage = 1;
  
  // Re-render
  const grid = document.getElementById('disease-grid');
  if (grid) {
    grid.innerHTML = '';
  }
  
  if (window.renderResults) {
    window.renderResults(currentFiltered);
  } else {
    renderResults(currentFiltered);
  }
  
  updateResultsMeta(currentFiltered.length);
}

// Select category from showcase cards
function selectCategory(category) {
  const categoryFilter = document.getElementById('filter-category');
  if (categoryFilter) {
    categoryFilter.value = category;
  }
  
  // Scroll to filter section
  const filterSection = document.getElementById('search-filter-section') || document.querySelector('.main-content');
  if (filterSection) {
    filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // Apply filters
  setTimeout(() => {
    applyFilters();
  }, 300);
}

// Initialize alphabet bar
function initAlphabetBar() {
  const container = document.getElementById('alphabet-bar');
  if (!container) return;
  
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  container.innerHTML = letters.map(letter => 
    `<button class="alpha-btn" data-letter="${letter}" aria-label="Filter by ${letter}">${letter}</button>`
  ).join('');
  
  container.querySelectorAll('.alpha-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state
      const isActive = btn.classList.contains('active');
      container.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
      
      if (!isActive) {
        btn.classList.add('active');
      }
      
      applyFilters();
    });
  });
}

// Filter by specific letter (programmatic)
function filterByAlpha(letter) {
  const container = document.getElementById('alphabet-bar');
  if (!container) return;
  
  container.querySelectorAll('.alpha-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.letter === letter);
  });
  
  applyFilters();
}

// Set view mode (grid / list)
function setView(view) {
  currentView = view;
  
  const grid = document.getElementById('disease-grid');
  const gridBtn = document.getElementById('view-grid');
  const listBtn = document.getElementById('view-list');
  
  if (grid) {
    grid.classList.toggle('list-view', view === 'list');
  }
  
  if (gridBtn) gridBtn.classList.toggle('active', view === 'grid');
  if (listBtn) listBtn.classList.toggle('active', view === 'list');
  
  // Re-render current page if needed
  if (currentFiltered.length > 0) {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageDiseases = currentFiltered.slice(0, start + ITEMS_PER_PAGE);
    
    // Simple re-render of visible cards
    const existingCards = grid.querySelectorAll('.disease-card');
    existingCards.forEach(card => {
      card.classList.toggle('list-view-card', view === 'list');
    });
  }
}

// Initialize filters
function initFilters() {
  const categoryFilter = document.getElementById('filter-category');
  const typeFilter = document.getElementById('filter-type');
  const severityFilter = document.getElementById('filter-severity');
  const sortSelect = document.getElementById('sort-by');
  const resetBtn = document.getElementById('reset-filters');
  const gridBtn = document.getElementById('view-grid');
  const listBtn = document.getElementById('view-list');
  
  // Filter change listeners
  [categoryFilter, typeFilter, severityFilter, sortSelect].forEach(el => {
    if (el) {
      el.addEventListener('change', applyFilters);
    }
  });
  
  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', resetFilters);
  }
  
  // View toggles
  if (gridBtn) gridBtn.addEventListener('click', () => setView('grid'));
  if (listBtn) listBtn.addEventListener('click', () => setView('list'));
  
  // Initial render
  const allDiseases = window.allDiseases || [];
  currentFiltered = [...allDiseases];
  
  const grid = document.getElementById('disease-grid');
  if (grid) {
    renderResults(currentFiltered);
  }
  
  updateResultsMeta(currentFiltered.length);
  
  console.log('Filters initialized');
}

// Make functions global
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.selectCategory = selectCategory;
window.setView = setView;
window.filterByAlpha = filterByAlpha;
window.loadMore = loadMore;

console.log('Filter module loaded');