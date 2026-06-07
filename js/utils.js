// js/utils.js
// Swastha Sewa - Utility Functions

// Debounce function
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Escape special characters for regex
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Show toast notification
function showToast(message, duration = 3000, type = 'info') {
  const container = document.getElementById('toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Auto remove
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('exiting');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }
  }, duration);
  
  // Click to dismiss
  toast.addEventListener('click', () => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  });
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Scroll to top smoothly
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Copy text to clipboard
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Get current date formatted
function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// LocalStorage Bookmark Helpers
function getBookmarks() {
  try {
    const bookmarks = localStorage.getItem('swastha-sewa-bookmarks');
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (e) {
    return [];
  }
}

function saveBookmark(id) {
  const bookmarks = getBookmarks();
  if (!bookmarks.includes(id)) {
    bookmarks.push(id);
    localStorage.setItem('swastha-sewa-bookmarks', JSON.stringify(bookmarks));
  }
}

function removeBookmark(id) {
  let bookmarks = getBookmarks();
  bookmarks = bookmarks.filter(b => b !== id);
  localStorage.setItem('swastha-sewa-bookmarks', JSON.stringify(bookmarks));
}

function isBookmarked(id) {
  return getBookmarks().includes(id);
}

// Capitalize first letter
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Get severity icon
function getSeverityIcon(severity) {
  const icons = {
    mild: '🟢',
    moderate: '🟡',
    severe: '🟠',
    critical: '🔴'
  };
  return icons[severity] || '⚪';
}

// Get severity color
function getSeverityColor(severity) {
  const colors = {
    mild: '#17fe8c',
    moderate: '#fec017',
    severe: '#fe5017',
    critical: '#fe1754'
  };
  return colors[severity] || '#a0a0a0';
}

// Format category name
function formatCategory(cat) {
  const map = {
    human: 'Human',
    animal: 'Animal',
    plant: 'Plant'
  };
  return map[cat] || capitalizeFirst(cat);
}

// Generate unique ID (for future use)
function generateId(prefix = 'd') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Export for global access if needed
window.SwasthaUtils = {
  debounce,
  escapeRegex,
  showToast,
  scrollToTop,
  copyToClipboard,
  formatDate,
  getBookmarks,
  saveBookmark,
  removeBookmark,
  isBookmarked,
  capitalizeFirst,
  getSeverityIcon,
  getSeverityColor
};

console.log('Utils loaded');