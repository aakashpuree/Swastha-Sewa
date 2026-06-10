# 🌿 Swastha Sewa - Complete Disease Encyclopedia

**"Your Trusted Health Companion"**

A production-ready, beautifully designed disease encyclopedia website covering **100+ diseases** across humans, animals, and plants.

## ✨ Features

- **480+ High-Quality Disease Entries** (significantly expanded)
  - 250 Human Diseases (with Nepali names + many common local ailments like खोकी, टाउको दुखाइ, पेट दुखाइ)
  - 140 Animal Diseases (with Nepali names)
  - 90 Plant Diseases (with Nepali names)

- **Advanced Search & Filtering**
  - Real-time search with smart ranking
  - Category, Type, Severity, and Alphabet filters
  - Sort options and grid/list view toggle

- **Premium Dark Cyber-Medical Design**
  - Neon accent (#d1fe17)
  - Glassmorphism cards
  - Smooth animations and micro-interactions
  - Fully responsive (mobile-first)

- **Rich Disease Detail Modals**
  - Symptoms, causes, treatment, prevention
  - Quick info grid
  - Bookmarking to localStorage
  - Web Share API + clipboard fallback
  - Print support

- **Accessibility & Performance**
  - Keyboard navigation (Ctrl+K search, arrows in suggestions)
  - Screen reader friendly
  - Pure vanilla JavaScript (no frameworks)
  - DocumentFragment rendering + pagination (12 per page)
  - IntersectionObserver scroll reveals

## 📁 Project Structure

```
swastha-sewa/
├── index.html
├── README.md
├── css/
│   ├── style.css
│   ├── animations.css
│   ├── responsive.css
│   └── components.css
├── js/
│   ├── main.js
│   ├── search.js
│   ├── filter.js
│   ├── render.js
│   ├── theme.js
│   ├── utils.js
│   └── data/
│       ├── human-diseases.js
│       ├── animal-diseases.js
│       └── plant-diseases.js
├── assets/
│   └── (images/icons - currently emoji + CSS based)
└── pages/
    ├── about.html
    ├── contact.html
    └── disclaimer.html
```

## 🚀 How to Run Locally

### Recommended: VS Code Live Server
1. Install the "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

### Other Methods
```bash
# Python
python -m http.server 8000

# Node
npx serve .

# PHP
php -S localhost:8080
```

> **Note**: Must be served over HTTP (not `file://`) for full functionality.

## 🎨 Design System

- **Primary Accent**: `#d1fe17` (Neon Yellow-Green)
- **Font**: Rajdhani (Google Fonts)
- **Theme**: Dark mode only with cyberpunk-medical aesthetic
- **Category Colors**:
  - Human: `#d1fe17`
  - Animal: `#fe8c17`
  - Plant: `#17fe8c`

## 🔧 Technical Highlights

- Zero external JavaScript libraries
- Debounced search (250ms)
- LocalStorage bookmarking
- Deep linking via URL hash (`#disease-h001`)
- Fully keyboard accessible
- Custom neon glow effects and glassmorphism

## 📋 Data Notes

All disease information is compiled for **educational purposes only**. It is not medical, veterinary, or agricultural advice. Always consult qualified professionals.

## 📄 License

Educational / Open for learning purposes. Please credit Swastha Sewa when sharing.

---

Built with precision and care for students, farmers, veterinarians, and the curious public.  