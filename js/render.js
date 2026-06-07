// js/render.js
// Swastha Sewa - HTML Rendering Functions

// Create a single disease card (grid or list)
function createDiseaseCard(disease, searchTerm = '') {
  const isBookmarked = window.SwasthaUtils ? window.SwasthaUtils.isBookmarked(disease.id) : false;
  
  const categoryClass = `left-accent-${disease.category}`;
  const severityColor = getSeverityColor(disease.severity);
  
  const highlightedName = searchTerm ? 
    highlightText(disease.name, searchTerm) : 
    disease.name;

  const cardHTML = `
    <div class="disease-card ${disease.category}" data-id="${disease.id}" data-category="${disease.category}">
      <div class="card-header">
        <div class="card-icon">${disease.icon}</div>
        <div class="card-badges">
          ${disease.trending ? `<span class="badge badge-trending">TRENDING</span>` : ''}
          <span class="badge badge-severity ${disease.severity}" style="color: ${severityColor}; border-color: ${severityColor}30;">
            ${getSeverityIcon(disease.severity)} ${disease.severity.toUpperCase()}
          </span>
          <span class="badge badge-type ${disease.type}">
            ${capitalizeFirst(disease.type)}
          </span>
        </div>
      </div>
      
      <h3 class="card-title">${highlightedName}<br><small style="font-size:0.85rem; color:#a0a0a0; font-weight:400;">${disease.nepaliName || ''}</small></h3>
      
      <p class="card-description">${disease.description}</p>
      
      <div class="card-footer">
        <span class="card-category">
          <span>${disease.category === 'human' ? '👤' : disease.category === 'animal' ? '🐾' : '🌿'}</span>
          ${formatCategory(disease.category)}
        </span>
        
        <div class="card-actions">
          <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                  data-id="${disease.id}" 
                  aria-label="${isBookmarked ? 'Remove bookmark' : 'Bookmark disease'}">
            ${isBookmarked ? '❤️' : '🤍'}
          </button>
          <button class="share-btn" data-name="${disease.name}" aria-label="Share ${disease.name}">
            🔗
          </button>
        </div>
      </div>
    </div>
  `;
  
  return cardHTML;
}

// Create skeleton loading cards
function createSkeletonCards(count = 12) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card">
        <div class="skeleton skeleton-title" style="width: 60%;"></div>
        <div class="skeleton skeleton-text" style="width: 90%;"></div>
        <div class="skeleton skeleton-text" style="width: 75%;"></div>
        <div class="skeleton skeleton-text" style="width: 85%;"></div>
        <div style="margin-top: 16px; display: flex; gap: 8px;">
          <div class="skeleton skeleton-badge" style="width: 70px;"></div>
          <div class="skeleton skeleton-badge" style="width: 55px;"></div>
        </div>
      </div>
    `;
  }
  return html;
}

// Create full modal content
function createModalContent(disease) {
  const isBookmarked = window.SwasthaUtils ? window.SwasthaUtils.isBookmarked(disease.id) : false;
  
  const symptomsList = disease.symptoms.map(s => `<li>${s}</li>`).join('');
  const causesList = disease.causes.map(c => `<li>${c}</li>`).join('');
  const treatmentList = disease.treatment.map(t => `<li>${t}</li>`).join('');
  const preventionList = disease.prevention.map(p => `<li>${p}</li>`).join('');
  
  const affectedPartsTags = disease.affectedParts.map(part => 
    `<span class="pill pill-outline" style="margin-right:4px; margin-bottom:4px;">${part}</span>`
  ).join('');
  
  let extraInfo = '';
  
  if (disease.category === 'human' && disease.affectedGroups) {
    extraInfo += `
      <div class="info-item">
        <label>Affected Groups</label>
        <div class="value">${disease.affectedGroups}</div>
      </div>
    `;
  }
  
  if (disease.category === 'animal') {
    extraInfo += `
      <div class="info-item">
        <label>Affected Animals</label>
        <div class="value">${disease.affectedAnimals.join(', ')}</div>
      </div>
      <div class="info-item">
        <label>Zoonotic</label>
        <div class="value">${disease.zoonotic ? 'Yes (can spread to humans)' : 'No'}</div>
      </div>
    `;
  }
  
  if (disease.category === 'plant') {
    extraInfo += `
      <div class="info-item">
        <label>Affected Plants</label>
        <div class="value">${disease.affectedPlants.join(', ')}</div>
      </div>
      <div class="info-item">
        <label>Favorable Conditions</label>
        <div class="value">${disease.conditions}</div>
      </div>
    `;
  }
  
  return `
    <div class="modal-header">
      <div style="display: flex; align-items: flex-start;">
        <div class="modal-icon">${disease.icon}</div>
        <div>
          <h2 class="modal-title">${disease.name}<br><span style="font-size:1.1rem; color:#a0a0a0; font-weight:400;">(${disease.nepaliName || 'नेपाली नाम उपलब्ध छैन'})</span></h2>
          <div class="modal-badges">
            <span class="badge badge-severity ${disease.severity}" style="color: ${getSeverityColor(disease.severity)};">
              ${getSeverityIcon(disease.severity)} ${disease.severity.toUpperCase()}
            </span>
            <span class="badge badge-type ${disease.type}">
              ${capitalizeFirst(disease.type)}
            </span>
            <span class="pill pill-outline">${formatCategory(disease.category)}</span>
            ${disease.trending ? `<span class="pill pill-primary">🔥 TRENDING</span>` : ''}
          </div>
        </div>
      </div>
      <button class="modal-close" aria-label="Close modal">&times;</button>
    </div>
    
    <div class="modal-body">
      <p style="font-size: 1.05rem; color: var(--text-primary); margin-bottom: 20px;">
        ${disease.description}
      </p>
      
      <div class="info-grid">
        <div class="info-item">
          <label>Causative Agent</label>
          <div class="value">${disease.causativeAgent}</div>
        </div>
        <div class="info-item">
          <label>Contagious</label>
          <div class="value">${disease.contagious ? 'Yes' : 'No'}</div>
        </div>
        <div class="info-item">
          <label>Incubation Period</label>
          <div class="value">${disease.incubationPeriod}</div>
        </div>
        <div class="info-item">
          <label>Diagnosis Method</label>
          <div class="value">${disease.diagnosisMethod}</div>
        </div>
        <div class="info-item">
          <label>Vaccines / Prevention</label>
          <div class="value">${disease.vaccines}</div>
        </div>
        ${extraInfo}
      </div>
      
      <div class="modal-section">
        <h4>Symptoms</h4>
        <ul>${symptomsList}</ul>
      </div>
      
      <div class="modal-section">
        <h4>Causes & Risk Factors</h4>
        <ul>${causesList}</ul>
      </div>
      
      <div class="modal-section">
        <h4>Treatment Options</h4>
        <ul>${treatmentList}</ul>
      </div>
      
      <div class="modal-section">
        <h4>Prevention Tips</h4>
        <ul>${preventionList}</ul>
      </div>
      
      <div class="modal-section">
        <h4>Affected Body Parts / Organs</h4>
        <div style="margin-top: 8px;">
          ${affectedPartsTags}
        </div>
      </div>
      
      <div class="disclaimer-box">
        <strong>⚠️ Medical Disclaimer:</strong> This information is for educational purposes only and is not a substitute for professional medical, veterinary, or agricultural advice. Always consult qualified professionals for diagnosis and treatment.
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-primary bookmark-modal-btn" data-id="${disease.id}">
          ${isBookmarked ? '❤️ Remove Bookmark' : '🤍 Save to Bookmarks'}
        </button>
        <button class="btn btn-outline share-modal-btn" data-name="${disease.name}">
          🔗 Share
        </button>
        <button class="btn btn-outline print-btn" onclick="window.print()">
          🖨️ Print
        </button>
      </div>
    </div>
  `;
}

// Highlight search term in text
function highlightText(text, term) {
  if (!term || !text) return text;
  const escaped = escapeRegex(term);
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// Helper functions (also in utils but duplicated here for standalone use in render)
function getSeverityColor(severity) {
  const colors = {
    mild: '#17fe8c',
    moderate: '#fec017',
    severe: '#fe5017',
    critical: '#fe1754'
  };
  return colors[severity] || '#a0a0a0';
}

function getSeverityIcon(severity) {
  const icons = {
    mild: '🟢',
    moderate: '🟡',
    severe: '🟠',
    critical: '🔴'
  };
  return icons[severity] || '⚪';
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatCategory(cat) {
  const map = {
    human: 'Human',
    animal: 'Animal',
    plant: 'Plant'
  };
  return map[cat] || capitalizeFirst(cat);
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Export functions
window.SwasthaRender = {
  createDiseaseCard,
  createSkeletonCards,
  createModalContent,
  highlightText
};

console.log('Render functions loaded');