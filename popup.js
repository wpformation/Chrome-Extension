/**
 * POPUP.JS - Interface Utilisateur Professionnelle
 * Extension Chrome Audit Expert
 */

let currentResults = null;

// Éléments du DOM
const analyzeBtn = document.getElementById('analyzeBtn');
const reanalyzeBtn = document.getElementById('reanalyzeBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const settingsBtn = document.getElementById('settingsBtn');
const loader = document.getElementById('loader');
const globalScore = document.getElementById('globalScore');
const recommendations = document.getElementById('recommendations');
const results = document.getElementById('results');
const analyzedUrl = document.getElementById('analyzedUrl');

// Lancement de l'analyse
analyzeBtn.addEventListener('click', () => startAnalysis(false));
if (reanalyzeBtn) {
  reanalyzeBtn.addEventListener('click', () => startAnalysis(true));
}
exportPdfBtn.addEventListener('click', exportToPDF);

// Ouvrir la page de configuration
if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
  });
}

async function startAnalysis(forceRefresh = false) {
  console.log(`🔍 ${forceRefresh ? 'Nouvelle analyse forcée' : 'Démarrage de l\'analyse'}...`);
  showLoader();

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(
      tab.id,
      { action: 'analyzePage', forceRefresh: forceRefresh, useAI: true },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Erreur:', chrome.runtime.lastError);
          showError('Impossible d\'analyser cette page. Rechargez-la et réessayez.');
          return;
        }

        if (response) {
          // Vérifier s'il y a une erreur dans la réponse
          if (response.error) {
            console.error('Erreur d\'analyse:', response.error);
            showError(`Erreur: ${response.error}`);
            return;
          }

          currentResults = response;
          displayResults(response);

          // Afficher le bouton réanalyser
          if (reanalyzeBtn) {
            reanalyzeBtn.style.display = 'flex';
          }
        }
      }
    );
  } catch (error) {
    console.error('Erreur:', error);
    showError('Une erreur est survenue.');
  }
}

function showLoader() {
  loader.style.display = 'flex';
  globalScore.style.display = 'none';
  recommendations.style.display = 'none';
  results.style.display = 'none';
  analyzedUrl.style.display = 'none';
  exportPdfBtn.style.display = 'none';
  if (reanalyzeBtn) reanalyzeBtn.style.display = 'none';
  analyzeBtn.disabled = true;
}

function hideLoader() {
  loader.style.display = 'none';
  analyzeBtn.disabled = false;
}

function showError(message) {
  hideLoader();
  alert(message);
}

/* ========================================
   AFFICHAGE DES RÉSULTATS
   ======================================== */

function displayResults(data) {
  console.log('📊 Affichage des résultats:', data);
  hideLoader();

  // Score global
  displayGlobalScore(data.globalScore);

  // Analyse globale IA (si disponible)
  displayGlobalAnalysis(data);

  // Recommandations prioritaires
  displayRecommendations(data.recommendations);

  // Résultats détaillés
  displaySEOResults(data.seo);
  displayMarketingResults(data.marketing);
  displayUXResults(data.ux);

  // Informations techniques (NOUVEAU)
  displayTechnicalInfo(data);

  // URL analysée
  document.getElementById('currentUrl').textContent = data.url;
  analyzedUrl.style.display = 'block';

  // Afficher toutes les sections
  globalScore.style.display = 'flex';
  recommendations.style.display = 'block';
  results.style.display = 'flex';
  exportPdfBtn.style.display = 'flex';
}

function displayGlobalScore(score) {
  const scoreValue = document.getElementById('scoreValue');
  const scoreCircle = document.getElementById('scoreCircle');
  const scoreStatus = document.getElementById('scoreStatus');

  // Animation du score
  animateValue(scoreValue, 0, score, 1000);

  // Animation du cercle
  const circumference = 339.292;
  const offset = circumference - (score / 100) * circumference;

  setTimeout(() => {
    scoreCircle.style.strokeDashoffset = offset;
  }, 100);

  // Statut et couleur
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

function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
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
   ANALYSE GLOBALE IA
   ======================================== */

function displayGlobalAnalysis(data) {
  const globalAnalysisSection = document.getElementById('globalAnalysis');
  const analysisMethodBadge = document.getElementById('analysisMethodBadge');
  const analysisMethodBadgeTop = document.getElementById('analysisMethodBadgeTop');
  const globalAnalysisContent = document.getElementById('globalAnalysisContent');

  // TOUJOURS afficher le badge de méthode d'analyse en haut
  if (data.analysisMethod) {
    const isAI = data.analysisMethod.includes('AI');
    const badgeText = `${isAI ? '🤖' : '💻'} ${data.analysisMethod}`;

    analysisMethodBadgeTop.textContent = badgeText;
    analysisMethodBadgeTop.className = `analysis-method-badge-top ${isAI ? 'ai-mode' : 'code-mode'}`;
    analysisMethodBadgeTop.style.display = 'inline-block';
  }

  // Si l'analyse IA détaillée est disponible
  if (data.globalAnalysis && data.analysisMethod) {
    // Afficher le badge de méthode d'analyse
    const isAI = data.analysisMethod.includes('AI');
    analysisMethodBadge.textContent = `${isAI ? '🤖' : '💻'} ${data.analysisMethod}`;

    // Afficher le contenu de l'analyse globale
    globalAnalysisContent.innerHTML = formatAnalysisText(data.globalAnalysis);

    // Afficher la section
    globalAnalysisSection.style.display = 'block';
  } else if (data.analysisMethod && !data.analysisMethod.includes('AI')) {
    // Mode code: afficher un message pour inviter à configurer l'IA
    analysisMethodBadge.textContent = '💻 Analyse Code';
    globalAnalysisContent.innerHTML = `
      <p style="text-align: center; padding: 20px; color: #64748b;">
        <strong>💡 Obtenez une analyse IA détaillée</strong><br><br>
        Configurez votre clé API Claude dans <strong>Settings ⚙️</strong> pour bénéficier d'une analyse approfondie par intelligence artificielle avec recommandations personnalisées.
      </p>
    `;
    globalAnalysisSection.style.display = 'block';
  } else {
    // Cacher la section si pas de données
    globalAnalysisSection.style.display = 'none';
  }
}

/**
 * Formate le texte d'analyse en paragraphes HTML
 * @param {string} text - Texte pouvant contenir plusieurs paragraphes
 * @returns {string} HTML formaté
 */
function formatAnalysisText(text) {
  if (!text) return '';

  // Si le texte contient déjà des balises <p>, le retourner tel quel
  if (text.includes('<p>')) return text;

  // Sinon, diviser par double saut de ligne et créer des paragraphes
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
}

/* ========================================
   RECOMMANDATIONS PRIORITAIRES
   ======================================== */

function displayRecommendations(recs) {
  const list = document.getElementById('recommendationsList');
  list.innerHTML = '';

  if (!recs || recs.length === 0) {
    list.innerHTML = '<p class="no-recommendations">✨ Aucune recommandation critique. Excellent travail !</p>';
    return;
  }

  recs.forEach((rec, index) => {
    const recCard = document.createElement('div');
    recCard.className = 'recommendation-card';
    recCard.classList.add(`priority-${rec.priority.toLowerCase()}`);

    recCard.innerHTML = `
      <div class="rec-header">
        <span class="rec-priority ${rec.priority.toLowerCase()}">${rec.priority}</span>
        <span class="rec-category">${rec.category}</span>
      </div>
      <h4 class="rec-title">${rec.title}</h4>
      <p class="rec-description">${rec.description}</p>
      <div class="rec-details">
        <div class="rec-impact">
          <strong>💡 Impact:</strong> ${rec.impact}
        </div>
        <div class="rec-action">
          <strong>🎯 Action:</strong> ${rec.action}
        </div>
      </div>
    `;

    list.appendChild(recCard);
  });
}

/* ========================================
   RÉSULTATS SEO
   ======================================== */

function displaySEOResults(seo) {
  document.getElementById('seoScore').textContent = `${seo.score}/100`;

  // Title
  const titleStatus = document.getElementById('titleStatus');
  if (seo.title.exists && seo.title.isOptimal) {
    titleStatus.textContent = `✓ ${seo.title.length} caractères`;
    titleStatus.className = 'metric-value success';
  } else if (seo.title.exists) {
    titleStatus.textContent = `⚠ ${seo.title.length} caractères (${seo.title.status})`;
    titleStatus.className = 'metric-value warning';
  } else {
    titleStatus.textContent = '✗ Absente';
    titleStatus.className = 'metric-value error';
  }

  // Meta Description
  const descStatus = document.getElementById('descStatus');
  if (seo.metaDescription.exists && seo.metaDescription.isOptimal) {
    descStatus.textContent = `✓ ${seo.metaDescription.length} caractères`;
    descStatus.className = 'metric-value success';
  } else if (seo.metaDescription.exists) {
    descStatus.textContent = `⚠ ${seo.metaDescription.length} caractères`;
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
    h1Status.textContent = `⚠ ${seo.h1.count} H1 détectés`;
    h1Status.className = 'metric-value warning';
  } else {
    h1Status.textContent = '✗ Absente';
    h1Status.className = 'metric-value error';
  }

  // Hiérarchie des titres
  const headingsStatus = document.getElementById('headingsStatus');
  if (seo.headings.isHierarchical) {
    headingsStatus.textContent = `✓ ${seo.headings.total} titres bien structurés`;
    headingsStatus.className = 'metric-value success';
  } else {
    headingsStatus.textContent = `⚠ ${seo.headings.total} titres - ${seo.headings.status}`;
    headingsStatus.className = 'metric-value warning';
  }

  // Images
  const imagesStatus = document.getElementById('imagesStatus');
  if (seo.images.total === 0) {
    imagesStatus.textContent = 'Aucune image';
    imagesStatus.className = 'metric-value';
  } else if (seo.images.withoutAlt === 0) {
    imagesStatus.textContent = `✓ ${seo.images.total} images avec ALT`;
    imagesStatus.className = 'metric-value success';
  } else {
    imagesStatus.textContent = `⚠ ${seo.images.withoutAlt}/${seo.images.total} sans ALT`;
    imagesStatus.className = 'metric-value warning';
  }

  // Canonical
  const canonicalStatus = document.getElementById('canonicalStatus');
  if (seo.canonical.exists && seo.canonical.isValid) {
    canonicalStatus.textContent = '✓ Présente et valide';
    canonicalStatus.className = 'metric-value success';
  } else if (seo.canonical.exists) {
    canonicalStatus.textContent = '⚠ Présente (URL invalide)';
    canonicalStatus.className = 'metric-value warning';
  } else {
    canonicalStatus.textContent = '⚠ Absente';
    canonicalStatus.className = 'metric-value warning';
  }

  // Analyse IA SEO (si disponible)
  const seoAnalysisSection = document.getElementById('seoAnalysis');
  const seoAnalysisContent = document.getElementById('seoAnalysisContent');
  if (seo.analysis) {
    seoAnalysisContent.innerHTML = formatAnalysisText(seo.analysis);
    seoAnalysisSection.style.display = 'block';
  } else {
    seoAnalysisSection.style.display = 'none';
  }
}

/* ========================================
   RÉSULTATS MARKETING
   ======================================== */

function displayMarketingResults(marketing) {
  document.getElementById('marketingScore').textContent = `${marketing.score}/100`;

  // GA4
  const ga4Status = document.getElementById('ga4Status');
  if (marketing.ga4.detected) {
    ga4Status.textContent = marketing.ga4.id ? `✓ ${marketing.ga4.id}` : '✓ Détecté';
    ga4Status.className = 'metric-value success';
  } else {
    ga4Status.textContent = '✗ Non détecté';
    ga4Status.className = 'metric-value error';
  }

  // GTM
  const gtmStatus = document.getElementById('gtmStatus');
  if (marketing.gtm.detected) {
    gtmStatus.textContent = marketing.gtm.id ? `✓ ${marketing.gtm.id}` : '✓ Détecté';
    gtmStatus.className = 'metric-value success';
  } else {
    gtmStatus.textContent = '✗ Non détecté';
    gtmStatus.className = 'metric-value error';
  }

  // Meta Pixel
  const metaPixelStatus = document.getElementById('metaPixelStatus');
  if (marketing.metaPixel.detected) {
    metaPixelStatus.textContent = marketing.metaPixel.id ? `✓ ${marketing.metaPixel.id}` : '✓ Détecté';
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
    ctaStatus.textContent = `✓ ${marketing.cta.count} CTA détectés`;
    ctaStatus.className = 'metric-value success';
  } else if (marketing.cta.count > 0) {
    ctaStatus.textContent = `⚠ ${marketing.cta.count} CTA détecté(s)`;
    ctaStatus.className = 'metric-value warning';
  } else {
    ctaStatus.textContent = '✗ Aucun CTA';
    ctaStatus.className = 'metric-value error';
  }

  // Réseaux sociaux
  const socialStatus = document.getElementById('socialStatus');
  const socialCount = marketing.social.totalFound;
  if (socialCount >= 3) {
    socialStatus.textContent = `✓ ${socialCount} réseaux liés`;
    socialStatus.className = 'metric-value success';
  } else if (socialCount > 0) {
    socialStatus.textContent = `⚠ ${socialCount} réseau(x)`;
    socialStatus.className = 'metric-value warning';
  } else {
    socialStatus.textContent = '✗ Aucun lien';
    socialStatus.className = 'metric-value error';
  }

  // Analyse IA Marketing (si disponible)
  const marketingAnalysisSection = document.getElementById('marketingAnalysis');
  const marketingAnalysisContent = document.getElementById('marketingAnalysisContent');
  if (marketing.analysis) {
    marketingAnalysisContent.innerHTML = formatAnalysisText(marketing.analysis);
    marketingAnalysisSection.style.display = 'block';
  } else {
    marketingAnalysisSection.style.display = 'none';
  }
}

/* ========================================
   RÉSULTATS UX
   ======================================== */

function displayUXResults(ux) {
  document.getElementById('uxScore').textContent = `${ux.score}/100`;

  // Viewport
  const viewportStatus = document.getElementById('viewportStatus');
  if (ux.viewport.exists) {
    viewportStatus.textContent = '✓ Configuré';
    viewportStatus.className = 'metric-value success';
  } else {
    viewportStatus.textContent = '✗ Absent';
    viewportStatus.className = 'metric-value error';
  }

  // Nombre de mots
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

  // Temps de lecture
  const readingTimeStatus = document.getElementById('readingTimeStatus');
  readingTimeStatus.textContent = `${ux.readingTime} min`;
  readingTimeStatus.className = 'metric-value';

  // Total de liens
  const linksStatus = document.getElementById('linksStatus');
  if (ux.links.total > 0) {
    linksStatus.textContent = `${ux.links.total} liens (${ux.links.internal} internes, ${ux.links.external} externes)`;
    linksStatus.className = 'metric-value success';
  } else {
    linksStatus.textContent = 'Aucun lien';
    linksStatus.className = 'metric-value warning';
  }

  // Liens cassés
  const brokenLinksStatus = document.getElementById('brokenLinksStatus');
  if (ux.links.broken === 0) {
    brokenLinksStatus.textContent = '✓ Aucun lien cassé';
    brokenLinksStatus.className = 'metric-value success';
  } else {
    const percentage = Math.round((ux.links.broken / ux.links.total) * 100);
    brokenLinksStatus.textContent = `⚠ ${ux.links.broken} lien(s) cassé(s) (${percentage}%)`;
    brokenLinksStatus.className = 'metric-value warning';
  }

  // Analyse IA UX (si disponible)
  const uxAnalysisSection = document.getElementById('uxAnalysis');
  const uxAnalysisContent = document.getElementById('uxAnalysisContent');
  if (ux.analysis) {
    uxAnalysisContent.innerHTML = formatAnalysisText(ux.analysis);
    uxAnalysisSection.style.display = 'block';
  } else {
    uxAnalysisSection.style.display = 'none';
  }
}

/* ========================================
   INFORMATIONS TECHNIQUES
   ======================================== */

function displayTechnicalInfo(data) {
  // CMS
  const cmsStatus = document.getElementById('cmsStatus');
  if (data.cms && data.cms.detected) {
    let cmsText = `✓ ${data.cms.name}`;
    if (data.cms.version) cmsText += ` ${data.cms.version}`;
    if (data.cms.theme) cmsText += ` (${data.cms.theme})`;
    cmsStatus.textContent = cmsText;
    cmsStatus.className = 'metric-value success';
  } else {
    cmsStatus.textContent = 'Aucun CMS détecté';
    cmsStatus.className = 'metric-value';
  }

  // Cache & CDN
  const cacheStatus = document.getElementById('cacheStatus');
  const cacheDetected = data.cache?.detected || [];
  const cdnDetected = data.cache?.cdn || [];
  const allCache = [...cacheDetected, ...cdnDetected];

  if (allCache.length > 0) {
    cacheStatus.textContent = `✓ ${allCache.join(', ')}`;
    cacheStatus.className = 'metric-value success';
  } else {
    cacheStatus.textContent = 'Aucun cache détecté';
    cacheStatus.className = 'metric-value';
  }

  // Technologies
  const techStatus = document.getElementById('techStatus');
  const allTech = [];
  if (data.technologies) {
    if (data.technologies.frameworks?.length > 0) {
      allTech.push(...data.technologies.frameworks);
    }
    if (data.technologies.libraries?.length > 0) {
      allTech.push(...data.technologies.libraries.slice(0, 2)); // Limiter à 2
    }
  }

  if (allTech.length > 0) {
    techStatus.textContent = allTech.join(', ');
    techStatus.className = 'metric-value success';
  } else {
    techStatus.textContent = 'HTML/CSS/JS standard';
    techStatus.className = 'metric-value';
  }

  // Core Web Vitals
  if (data.coreWebVitals && data.coreWebVitals.available) {
    const cvSection = document.getElementById('coreWebVitalsSection');
    cvSection.style.display = 'block';

    // LCP
    const lcpStatus = document.getElementById('lcpStatus');
    if (data.coreWebVitals.lcp) {
      const lcp = data.coreWebVitals.lcp;
      lcpStatus.textContent = `${lcp}ms`;
      if (lcp < 2500) {
        lcpStatus.className = 'metric-value success';
      } else if (lcp < 4000) {
        lcpStatus.className = 'metric-value warning';
      } else {
        lcpStatus.className = 'metric-value error';
      }
    }

    // CLS
    const clsStatus = document.getElementById('clsStatus');
    if (data.coreWebVitals.cls !== null) {
      const cls = data.coreWebVitals.cls;
      clsStatus.textContent = cls.toFixed(3);
      if (cls < 0.1) {
        clsStatus.className = 'metric-value success';
      } else if (cls < 0.25) {
        clsStatus.className = 'metric-value warning';
      } else {
        clsStatus.className = 'metric-value error';
      }
    }

    // FCP
    const fcpStatus = document.getElementById('fcpStatus');
    if (data.coreWebVitals.fcp) {
      const fcp = data.coreWebVitals.fcp;
      fcpStatus.textContent = `${fcp}ms`;
      if (fcp < 1800) {
        fcpStatus.className = 'metric-value success';
      } else if (fcp < 3000) {
        fcpStatus.className = 'metric-value warning';
      } else {
        fcpStatus.className = 'metric-value error';
      }
    }
  }
}

/* ========================================
   EXPORT PDF
   ======================================== */

function exportToPDF() {
  if (!currentResults) {
    alert('Aucune analyse disponible.');
    return;
  }

  console.log('📄 Export PDF...');

  if (typeof generatePDFReport === 'function') {
    generatePDFReport(currentResults);
  } else {
    console.error('Fonction generatePDFReport non disponible');
  }
}

console.log('✅ Popup script professionnel chargé');
