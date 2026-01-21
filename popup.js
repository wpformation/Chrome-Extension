/**
 * POPUP.JS - Logique de l'interface utilisateur
 * Gère l'interaction avec l'utilisateur et la communication avec content.js
 */

// Variables globales pour stocker les résultats
let currentResults = null;

// Éléments du DOM
const analyzeBtn = document.getElementById('analyzeBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const loader = document.getElementById('loader');
const globalScore = document.getElementById('globalScore');
const results = document.getElementById('results');
const analyzedUrl = document.getElementById('analyzedUrl');

/* ========================================
   ÉCOUTEURS D'ÉVÉNEMENTS
   ======================================== */

// Lancement de l'analyse au clic
analyzeBtn.addEventListener('click', startAnalysis);

// Export PDF au clic
exportPdfBtn.addEventListener('click', exportToPDF);

/* ========================================
   FONCTION PRINCIPALE D'ANALYSE
   ======================================== */

/**
 * Démarre l'analyse de la page active
 */
async function startAnalysis() {
  console.log('🔍 Démarrage de l\'analyse...');

  // Afficher le loader
  showLoader();

  try {
    // Récupérer l'onglet actif
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Injecter le content script si nécessaire et envoyer le message
    chrome.tabs.sendMessage(
      tab.id,
      { action: 'analyzePage' },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Erreur de communication:', chrome.runtime.lastError);
          showError('Impossible d\'analyser cette page. Rechargez-la et réessayez.');
          return;
        }

        if (response) {
          currentResults = response;
          displayResults(response);
        }
      }
    );

  } catch (error) {
    console.error('Erreur lors de l\'analyse:', error);
    showError('Une erreur est survenue lors de l\'analyse.');
  }
}

/**
 * Affiche le loader et masque les résultats
 */
function showLoader() {
  loader.style.display = 'flex';
  globalScore.style.display = 'none';
  results.style.display = 'none';
  analyzedUrl.style.display = 'none';
  exportPdfBtn.style.display = 'none';
  analyzeBtn.disabled = true;
}

/**
 * Masque le loader
 */
function hideLoader() {
  loader.style.display = 'none';
  analyzeBtn.disabled = false;
}

/**
 * Affiche un message d'erreur
 * @param {string} message - Message d'erreur
 */
function showError(message) {
  hideLoader();
  alert(message);
}

/* ========================================
   AFFICHAGE DES RÉSULTATS
   ======================================== */

/**
 * Affiche tous les résultats de l'analyse
 * @param {Object} data - Résultats de l'analyse
 */
function displayResults(data) {
  console.log('📊 Affichage des résultats:', data);

  hideLoader();

  // Afficher le score global
  displayGlobalScore(data.globalScore);

  // Afficher les résultats des 3 piliers
  displaySEOResults(data.seo);
  displayMarketingResults(data.marketing);
  displayUXResults(data.ux);

  // Afficher l'URL analysée
  document.getElementById('currentUrl').textContent = data.url;
  analyzedUrl.style.display = 'block';

  // Afficher les sections
  globalScore.style.display = 'flex';
  results.style.display = 'flex';
  exportPdfBtn.style.display = 'flex';
}

/**
 * Affiche le score global avec animation
 * @param {number} score - Score sur 100
 */
function displayGlobalScore(score) {
  const scoreValue = document.getElementById('scoreValue');
  const scoreCircle = document.getElementById('scoreCircle');
  const scoreStatus = document.getElementById('scoreStatus');

  // Animation du chiffre
  animateValue(scoreValue, 0, score, 1000);

  // Animation du cercle (circonférence = 2 * PI * r = 339.292)
  const circumference = 339.292;
  const offset = circumference - (score / 100) * circumference;

  setTimeout(() => {
    scoreCircle.style.strokeDashoffset = offset;
  }, 100);

  // Déterminer la classe de couleur et le texte
  let statusClass, statusText;

  if (score >= 80) {
    statusClass = 'excellent';
    statusText = 'Excellent';
    scoreCircle.classList.add('excellent');
  } else if (score >= 60) {
    statusClass = 'good';
    statusText = 'Bon';
    scoreCircle.classList.add('good');
  } else if (score >= 40) {
    statusClass = 'average';
    statusText = 'Moyen';
    scoreCircle.classList.add('average');
  } else {
    statusClass = 'poor';
    statusText = 'À améliorer';
    scoreCircle.classList.add('poor');
  }

  scoreStatus.textContent = statusText;
  scoreStatus.className = `score-status ${statusClass}`;
}

/**
 * Anime un nombre de start à end
 * @param {HTMLElement} element - Élément à animer
 * @param {number} start - Valeur de départ
 * @param {number} end - Valeur finale
 * @param {number} duration - Durée en ms
 */
function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16); // 60 FPS
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.round(current);
  }, 16);
}

/* ========================================
   AFFICHAGE RÉSULTATS SEO
   ======================================== */

/**
 * Affiche les résultats SEO
 * @param {Object} seo - Données SEO
 */
function displaySEOResults(seo) {
  // Score du pilier
  document.getElementById('seoScore').textContent = `${seo.score}/100`;

  // Title
  const titleStatus = document.getElementById('titleStatus');
  if (seo.title.exists && seo.title.isOptimal) {
    titleStatus.textContent = `✓ ${seo.title.length} chars`;
    titleStatus.className = 'metric-value success';
  } else if (seo.title.exists) {
    titleStatus.textContent = `⚠ ${seo.title.length} chars`;
    titleStatus.className = 'metric-value warning';
  } else {
    titleStatus.textContent = '✗ Absente';
    titleStatus.className = 'metric-value error';
  }

  // Meta Description
  const descStatus = document.getElementById('descStatus');
  if (seo.metaDescription.exists && seo.metaDescription.isOptimal) {
    descStatus.textContent = `✓ ${seo.metaDescription.length} chars`;
    descStatus.className = 'metric-value success';
  } else if (seo.metaDescription.exists) {
    descStatus.textContent = `⚠ ${seo.metaDescription.length} chars`;
    descStatus.className = 'metric-value warning';
  } else {
    descStatus.textContent = '✗ Absente';
    descStatus.className = 'metric-value error';
  }

  // H1
  const h1Status = document.getElementById('h1Status');
  if (seo.h1.isUnique) {
    h1Status.textContent = '✓ Unique';
    h1Status.className = 'metric-value success';
  } else if (seo.h1.count > 1) {
    h1Status.textContent = `⚠ ${seo.h1.count} H1`;
    h1Status.className = 'metric-value warning';
  } else {
    h1Status.textContent = '✗ Absente';
    h1Status.className = 'metric-value error';
  }

  // Headings Hierarchy
  const headingsStatus = document.getElementById('headingsStatus');
  const totalHeadings = seo.headings.h1 + seo.headings.h2 + seo.headings.h3 +
                        seo.headings.h4 + seo.headings.h5 + seo.headings.h6;
  if (seo.headings.isHierarchical) {
    headingsStatus.textContent = `✓ ${totalHeadings} titres`;
    headingsStatus.className = 'metric-value success';
  } else {
    headingsStatus.textContent = `⚠ ${totalHeadings} titres`;
    headingsStatus.className = 'metric-value warning';
  }

  // Images without ALT
  const imagesStatus = document.getElementById('imagesStatus');
  if (seo.images.withoutAlt === 0 && seo.images.total > 0) {
    imagesStatus.textContent = `✓ 0/${seo.images.total}`;
    imagesStatus.className = 'metric-value success';
  } else if (seo.images.total === 0) {
    imagesStatus.textContent = 'Aucune image';
    imagesStatus.className = 'metric-value';
  } else {
    imagesStatus.textContent = `⚠ ${seo.images.withoutAlt}/${seo.images.total}`;
    imagesStatus.className = 'metric-value warning';
  }

  // Canonical
  const canonicalStatus = document.getElementById('canonicalStatus');
  if (seo.canonical.exists) {
    canonicalStatus.textContent = '✓ Présente';
    canonicalStatus.className = 'metric-value success';
  } else {
    canonicalStatus.textContent = '⚠ Absente';
    canonicalStatus.className = 'metric-value warning';
  }
}

/* ========================================
   AFFICHAGE RÉSULTATS MARKETING
   ======================================== */

/**
 * Affiche les résultats Marketing
 * @param {Object} marketing - Données Marketing
 */
function displayMarketingResults(marketing) {
  // Score du pilier
  document.getElementById('marketingScore').textContent = `${marketing.score}/100`;

  // Google Analytics 4
  const ga4Status = document.getElementById('ga4Status');
  if (marketing.ga4.detected) {
    ga4Status.textContent = '✓ Détecté';
    ga4Status.className = 'metric-value success';
  } else {
    ga4Status.textContent = '✗ Non détecté';
    ga4Status.className = 'metric-value error';
  }

  // Google Tag Manager
  const gtmStatus = document.getElementById('gtmStatus');
  if (marketing.gtm.detected) {
    gtmStatus.textContent = `✓ ${marketing.gtm.id || 'Détecté'}`;
    gtmStatus.className = 'metric-value success';
  } else {
    gtmStatus.textContent = '✗ Non détecté';
    gtmStatus.className = 'metric-value error';
  }

  // Meta Pixel
  const metaPixelStatus = document.getElementById('metaPixelStatus');
  if (marketing.metaPixel.detected) {
    metaPixelStatus.textContent = '✓ Détecté';
    metaPixelStatus.className = 'metric-value success';
  } else {
    metaPixelStatus.textContent = '✗ Non détecté';
    metaPixelStatus.className = 'metric-value error';
  }

  // HubSpot
  const hubspotStatus = document.getElementById('hubspotStatus');
  if (marketing.hubspot.detected) {
    hubspotStatus.textContent = '✓ Détecté';
    hubspotStatus.className = 'metric-value success';
  } else {
    hubspotStatus.textContent = '✗ Non détecté';
    hubspotStatus.className = 'metric-value error';
  }

  // CTA
  const ctaStatus = document.getElementById('ctaStatus');
  if (marketing.cta.count >= 3) {
    ctaStatus.textContent = `✓ ${marketing.cta.count} CTA`;
    ctaStatus.className = 'metric-value success';
  } else if (marketing.cta.count > 0) {
    ctaStatus.textContent = `⚠ ${marketing.cta.count} CTA`;
    ctaStatus.className = 'metric-value warning';
  } else {
    ctaStatus.textContent = '✗ Aucun CTA';
    ctaStatus.className = 'metric-value error';
  }

  // Social Links
  const socialStatus = document.getElementById('socialStatus');
  const socialCount = marketing.social.totalFound;
  if (socialCount >= 3) {
    socialStatus.textContent = `✓ ${socialCount}/4 réseaux`;
    socialStatus.className = 'metric-value success';
  } else if (socialCount > 0) {
    socialStatus.textContent = `⚠ ${socialCount}/4 réseaux`;
    socialStatus.className = 'metric-value warning';
  } else {
    socialStatus.textContent = '✗ Aucun lien';
    socialStatus.className = 'metric-value error';
  }
}

/* ========================================
   AFFICHAGE RÉSULTATS UX
   ======================================== */

/**
 * Affiche les résultats UX & Technique
 * @param {Object} ux - Données UX
 */
function displayUXResults(ux) {
  // Score du pilier
  document.getElementById('uxScore').textContent = `${ux.score}/100`;

  // Viewport
  const viewportStatus = document.getElementById('viewportStatus');
  if (ux.viewport.exists) {
    viewportStatus.textContent = '✓ Présent';
    viewportStatus.className = 'metric-value success';
  } else {
    viewportStatus.textContent = '✗ Absent';
    viewportStatus.className = 'metric-value error';
  }

  // Word Count
  const wordCountStatus = document.getElementById('wordCountStatus');
  if (ux.wordCount >= 300) {
    wordCountStatus.textContent = `✓ ${ux.wordCount} mots`;
    wordCountStatus.className = 'metric-value success';
  } else if (ux.wordCount >= 50) {
    wordCountStatus.textContent = `⚠ ${ux.wordCount} mots`;
    wordCountStatus.className = 'metric-value warning';
  } else {
    wordCountStatus.textContent = `✗ ${ux.wordCount} mots`;
    wordCountStatus.className = 'metric-value error';
  }

  // Reading Time
  const readingTimeStatus = document.getElementById('readingTimeStatus');
  readingTimeStatus.textContent = `${ux.readingTime} min`;
  readingTimeStatus.className = 'metric-value';

  // Total Links
  const linksStatus = document.getElementById('linksStatus');
  if (ux.links.total > 0) {
    linksStatus.textContent = `${ux.links.total} liens`;
    linksStatus.className = 'metric-value success';
  } else {
    linksStatus.textContent = 'Aucun lien';
    linksStatus.className = 'metric-value warning';
  }

  // Broken Links
  const brokenLinksStatus = document.getElementById('brokenLinksStatus');
  if (ux.links.broken === 0) {
    brokenLinksStatus.textContent = '✓ Aucun';
    brokenLinksStatus.className = 'metric-value success';
  } else {
    const percentage = Math.round((ux.links.broken / ux.links.total) * 100);
    brokenLinksStatus.textContent = `⚠ ${ux.links.broken} (${percentage}%)`;
    brokenLinksStatus.className = 'metric-value warning';
  }
}

/* ========================================
   EXPORT PDF
   ======================================== */

/**
 * Exporte les résultats en PDF
 */
function exportToPDF() {
  if (!currentResults) {
    alert('Aucune analyse disponible pour l\'export.');
    return;
  }

  console.log('📄 Génération du PDF...');

  // Appeler la fonction d'export depuis pdf-export.js
  if (typeof generatePDFReport === 'function') {
    generatePDFReport(currentResults);
  } else {
    console.error('La fonction generatePDFReport n\'est pas disponible');
  }
}

console.log('✅ Popup script chargé');
