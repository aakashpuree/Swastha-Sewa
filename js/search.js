// js/search.js
// Swastha Sewa - Search Engine

let searchTimeout = null;

// Main search function with scoring
function searchDiseases(query, diseases = window.allDiseases || []) {
  if (!query || query.trim().length === 0) {
    return diseases;
  }
  
  const q = query.toLowerCase().trim();
  const escaped = escapeRegex(q);
  
  const results = diseases.map(disease => {
    let score = 0;
    const nameLower = disease.name.toLowerCase();
    const descLower = disease.description.toLowerCase();
    
    // Exact name match = highest priority
    if (nameLower === q) score += 100;
    else if (nameLower.includes(q)) score += 60;
    
    // Partial word match in name
    if (nameLower.split(' ').some(word => word.startsWith(q))) score += 40;
    
    // Description match
    if (descLower.includes(q)) score += 25;

    // Nepali name match (important for local users)
    const nepaliLower = (disease.nepaliName || '').toLowerCase();
    if (nepaliLower.includes(q)) score += 55; // High priority for Nepali search
    
    // Symptoms match
    const symptomsText = disease.symptoms.join(' ').toLowerCase();
    if (symptomsText.includes(q)) score += 20;
    
    // Causes match
    const causesText = disease.causes.join(' ').toLowerCase();
    if (causesText.includes(q)) score += 15;
    
    // Type or category match
    if (disease.type.includes(q) || disease.category.includes(q)) score += 10;
    
    // Trending bonus
    if (disease.trending && score > 0) score += 5;
    
    return { disease, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(item => item.disease);
  
  return results;
}

// Show search suggestions dropdown
function showSuggestions(query, container) {
  if (!query || query.length < 2) {
    container.style.display = 'none';
    return;
  }
  
  const allDiseases = window.allDiseases || [];
  const results = searchDiseases(query, allDiseases).slice(0, 8);
  
  if (results.length === 0) {
    container.style.display = 'none';
    return;
  }
  
  let html = '';
  results.forEach(disease => {
    const highlighted = highlightText(disease.name, query);
    html += `
      <div class="suggestion-item" data-name="${disease.name}" data-id="${disease.id}">
        <span class="suggestion-icon">${disease.icon}</span>
        <span class="suggestion-name">${highlighted} <small style="color:#a0a0a0;">(${disease.nepaliName || ''})</small></span>
        <span class="suggestion-meta">${formatCategory(disease.category)} • ${disease.severity}</span>
      </div>
    `;
  });
  
  container.innerHTML = html;
  container.style.display = 'block';
  
  // Bind click handlers
  container.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      const diseaseId = item.dataset.id;
      const disease = allDiseases.find(d => d.id === diseaseId);
      if (disease) {
        container.style.display = 'none';
        // Trigger modal open via main.js
        if (window.openDiseaseModal) {
          window.openDiseaseModal(disease);
        } else {
          // Fallback: apply filter
          document.getElementById('search-input').value = disease.name;
          if (window.applyFilters) window.applyFilters();
        }
      }
    });
  });
}

// Quick search from suggestion
function quickSearch(name) {
  const searchInput = document.getElementById('search-input') || document.getElementById('hero-search');
  if (searchInput) {
    searchInput.value = name;
    // Trigger filter
    if (window.applyFilters) {
      window.applyFilters();
    }
  }
}

// Hero search handler
function handleHeroSearch() {
  const heroInput = document.getElementById('hero-search');
  const mainSearch = document.getElementById('search-input');
  
  if (heroInput && heroInput.value.trim()) {
    // Scroll to search section
    const searchSection = document.getElementById('search-filter-section') || document.querySelector('.main-content');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Set value in main search and filter
    setTimeout(() => {
      if (mainSearch) {
        mainSearch.value = heroInput.value;
        if (window.applyFilters) window.applyFilters();
      }
    }, 600);
  }
}

// Initialize all search functionality
function initSearch() {
  const heroInput = document.getElementById('hero-search');
  const heroBtn = document.getElementById('hero-search-btn');
  const mainInput = document.getElementById('search-input');
  const suggestionsContainer = document.getElementById('search-suggestions');
  
  // Hero search
  if (heroBtn) {
    heroBtn.addEventListener('click', handleHeroSearch);
  }
  
  if (heroInput) {
    heroInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleHeroSearch();
      }
    });
    
    // Live suggestions in hero (optional)
    heroInput.addEventListener('input', debounce(() => {
      // Could add hero suggestions here if desired
    }, 250));
  }
  
  // Main search input with debounced filtering
  if (mainInput) {
    const debouncedFilter = debounce(() => {
      if (window.applyFilters) window.applyFilters();
    }, 250);
    
    mainInput.addEventListener('input', debouncedFilter);
    
    // Keyboard navigation for suggestions
    mainInput.addEventListener('keydown', (e) => {
      if (!suggestionsContainer || suggestionsContainer.style.display === 'none') return;
      
      const items = suggestionsContainer.querySelectorAll('.suggestion-item');
      let currentIndex = Array.from(items).findIndex(el => el.classList.contains('active'));
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % items.length;
        items.forEach((el, i) => el.classList.toggle('active', i === currentIndex));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        items.forEach((el, i) => el.classList.toggle('active', i === currentIndex));
      } else if (e.key === 'Enter' && currentIndex >= 0) {
        e.preventDefault();
        items[currentIndex].click();
      } else if (e.key === 'Escape') {
        suggestionsContainer.style.display = 'none';
      }
    });
  }
  
  // Suggestions dropdown for main search
  if (mainInput && suggestionsContainer) {
    mainInput.addEventListener('input', debounce(() => {
      showSuggestions(mainInput.value, suggestionsContainer);
    }, 180));
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.style.display = 'none';
      }
    });
    
    // Hide on focus out
    mainInput.addEventListener('blur', () => {
      setTimeout(() => {
        if (suggestionsContainer) suggestionsContainer.style.display = 'none';
      }, 200);
    });
  }
  
  // Global Ctrl+K shortcut is handled in main.js
  console.log('Search initialized');
}

// Make functions globally available
window.searchDiseases = searchDiseases;
window.quickSearch = quickSearch;
window.showSuggestions = showSuggestions;

console.log('Search module loaded');