/**
 * CONTENT.JS - Moteur d'Analyse Principal
 * Ce script s'exécute dans le contexte de la page web analysée
 * et effectue toutes les vérifications SEO, Marketing et UX.
 */

// Écoute des messages provenant de la popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzePage') {
    // Lancement de l'analyse complète
    const results = performCompleteAudit();
    sendResponse(results);
  }
  return true; // Important pour garder le canal de communication ouvert
});

/**
 * Fonction principale d'audit qui orchestre toutes les analyses
 * @returns {Object} Résultats complets de l'audit
 */
function performCompleteAudit() {
  console.log('🚀 Démarrage de l\'analyse de la page...');

  const results = {
    url: window.location.href,
    timestamp: new Date().toISOString(),
    seo: analyzeSEO(),
    marketing: analyzeMarketing(),
    ux: analyzeUX()
  };

  // Calcul des scores pour chaque pilier
  results.seo.score = calculateSEOScore(results.seo);
  results.marketing.score = calculateMarketingScore(results.marketing);
  results.ux.score = calculateUXScore(results.ux);

  // Calcul du score global (moyenne pondérée)
  results.globalScore = Math.round(
    (results.seo.score * 0.4 + results.marketing.score * 0.3 + results.ux.score * 0.3)
  );

  console.log('✅ Analyse terminée:', results);
  return results;
}

/* ========================================
   PILIER 1: ANALYSE SEO
   ======================================== */

/**
 * Analyse tous les critères SEO de la page
 * @returns {Object} Données SEO
 */
function analyzeSEO() {
  const seo = {};

  // 1. Analyse de la balise TITLE
  const titleTag = document.querySelector('title');
  seo.title = {
    exists: !!titleTag,
    content: titleTag ? titleTag.textContent.trim() : '',
    length: titleTag ? titleTag.textContent.trim().length : 0,
    isOptimal: false
  };
  // Vérification de la longueur optimale (30-60 caractères)
  seo.title.isOptimal = seo.title.length >= 30 && seo.title.length <= 60;

  // 2. Analyse de la META DESCRIPTION
  const metaDesc = document.querySelector('meta[name="description"]');
  seo.metaDescription = {
    exists: !!metaDesc,
    content: metaDesc ? metaDesc.getAttribute('content') : '',
    length: metaDesc ? metaDesc.getAttribute('content').length : 0,
    isOptimal: false
  };
  // Vérification de la longueur optimale (120-160 caractères)
  seo.metaDescription.isOptimal = seo.metaDescription.length >= 120 && seo.metaDescription.length <= 160;

  // 3. Analyse des balises H1
  const h1Tags = document.querySelectorAll('h1');
  seo.h1 = {
    count: h1Tags.length,
    isUnique: h1Tags.length === 1,
    content: h1Tags.length > 0 ? Array.from(h1Tags).map(h => h.textContent.trim()) : []
  };

  // 4. Analyse de la hiérarchie des titres (H1-H6)
  seo.headings = {
    h1: document.querySelectorAll('h1').length,
    h2: document.querySelectorAll('h2').length,
    h3: document.querySelectorAll('h3').length,
    h4: document.querySelectorAll('h4').length,
    h5: document.querySelectorAll('h5').length,
    h6: document.querySelectorAll('h6').length,
    isHierarchical: checkHeadingHierarchy()
  };

  // 5. Audit des images sans attribut ALT
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = Array.from(images).filter(img => !img.hasAttribute('alt') || img.getAttribute('alt').trim() === '');
  seo.images = {
    total: images.length,
    withoutAlt: imagesWithoutAlt.length,
    percentage: images.length > 0 ? Math.round((imagesWithoutAlt.length / images.length) * 100) : 0
  };

  // 6. Vérification de la balise CANONICAL
  const canonicalTag = document.querySelector('link[rel="canonical"]');
  seo.canonical = {
    exists: !!canonicalTag,
    href: canonicalTag ? canonicalTag.getAttribute('href') : ''
  };

  return seo;
}

/**
 * Vérifie si la hiérarchie des titres est correcte
 * (pas de saut de niveau, ex: H1 -> H3 sans H2)
 * @returns {boolean}
 */
function checkHeadingHierarchy() {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  if (headings.length === 0) return false;

  let previousLevel = 0;
  for (const heading of headings) {
    const currentLevel = parseInt(heading.tagName.substring(1));

    // Vérifier qu'on ne saute pas de niveau (max +1)
    if (currentLevel > previousLevel + 1 && previousLevel !== 0) {
      return false;
    }
    previousLevel = currentLevel;
  }
  return true;
}

/**
 * Calcule le score SEO sur 100
 * @param {Object} seo - Données SEO
 * @returns {number} Score sur 100
 */
function calculateSEOScore(seo) {
  let score = 0;

  // Title (20 points)
  if (seo.title.exists && seo.title.isOptimal) score += 20;
  else if (seo.title.exists) score += 10;

  // Meta Description (20 points)
  if (seo.metaDescription.exists && seo.metaDescription.isOptimal) score += 20;
  else if (seo.metaDescription.exists) score += 10;

  // H1 unique (20 points)
  if (seo.h1.isUnique) score += 20;
  else if (seo.h1.count > 0) score += 10;

  // Hiérarchie des titres (15 points)
  if (seo.headings.isHierarchical && seo.headings.h1 > 0) score += 15;
  else if (seo.headings.h1 > 0) score += 7;

  // Images avec ALT (15 points)
  if (seo.images.withoutAlt === 0 && seo.images.total > 0) score += 15;
  else if (seo.images.percentage <= 25) score += 10;
  else if (seo.images.percentage <= 50) score += 5;

  // Canonical (10 points)
  if (seo.canonical.exists) score += 10;

  return Math.min(score, 100);
}

/* ========================================
   PILIER 2: ANALYSE MARKETING
   ======================================== */

/**
 * Analyse tous les outils marketing et tracking
 * @returns {Object} Données Marketing
 */
function analyzeMarketing() {
  const marketing = {};

  // 1. Détection de Google Analytics 4 (GA4)
  marketing.ga4 = detectGA4();

  // 2. Détection de Google Tag Manager (GTM)
  marketing.gtm = detectGTM();

  // 3. Détection du Meta Pixel (Facebook Pixel)
  marketing.metaPixel = detectMetaPixel();

  // 4. Détection de HubSpot
  marketing.hubspot = detectHubSpot();

  // 5. Détection des CTA (Call-to-Action)
  marketing.cta = detectCTA();

  // 6. Détection des liens vers réseaux sociaux
  marketing.social = detectSocialLinks();

  return marketing;
}

/**
 * Détecte Google Analytics 4
 * @returns {Object}
 */
function detectGA4() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const hasGA4Script = scripts.some(script =>
    script.src.includes('googletagmanager.com/gtag/js') ||
    script.textContent.includes('gtag(') ||
    script.textContent.includes('G-')
  );

  // Vérifier aussi dans le dataLayer
  const hasDataLayer = typeof window.dataLayer !== 'undefined';

  return {
    detected: hasGA4Script || hasDataLayer,
    method: hasGA4Script ? 'Script gtag.js' : (hasDataLayer ? 'dataLayer' : 'Non détecté')
  };
}

/**
 * Détecte Google Tag Manager
 * @returns {Object}
 */
function detectGTM() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const hasGTM = scripts.some(script =>
    script.src.includes('googletagmanager.com/gtm.js') ||
    script.textContent.includes('GTM-')
  );

  // Extraction de l'ID GTM
  let gtmId = '';
  if (hasGTM) {
    const gtmScript = scripts.find(s => s.textContent.includes('GTM-'));
    if (gtmScript) {
      const match = gtmScript.textContent.match(/GTM-[A-Z0-9]+/);
      if (match) gtmId = match[0];
    }
  }

  return {
    detected: hasGTM,
    id: gtmId
  };
}

/**
 * Détecte le Meta Pixel (Facebook Pixel)
 * @returns {Object}
 */
function detectMetaPixel() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const hasMetaPixel = scripts.some(script =>
    script.textContent.includes('fbq(') ||
    script.textContent.includes('facebook.com/tr') ||
    script.src.includes('connect.facebook.net')
  );

  return {
    detected: hasMetaPixel
  };
}

/**
 * Détecte HubSpot
 * @returns {Object}
 */
function detectHubSpot() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const hasHubSpot = scripts.some(script =>
    script.src.includes('js.hs-scripts.com') ||
    script.src.includes('js.hubspot.com')
  );

  return {
    detected: hasHubSpot
  };
}

/**
 * Détecte les boutons CTA (Call-to-Action)
 * @returns {Object}
 */
function detectCTA() {
  // Mots-clés de conversion courants
  const ctaKeywords = [
    'acheter', 'buy', 'commander', 'order',
    'contact', 'contacter', 'devis', 'quote',
    'télécharger', 'download', 'essai', 'trial',
    'inscription', 'sign up', 'subscribe', 'abonner',
    'démarrer', 'start', 'commencer', 'begin',
    'réserver', 'book', 'prendre rendez-vous'
  ];

  const buttons = document.querySelectorAll('button, a.btn, a.button, [role="button"]');
  const links = document.querySelectorAll('a');

  let ctaCount = 0;
  const detectedCTAs = [];

  // Analyser les boutons
  buttons.forEach(btn => {
    const text = btn.textContent.toLowerCase().trim();
    if (ctaKeywords.some(keyword => text.includes(keyword))) {
      ctaCount++;
      detectedCTAs.push(text.substring(0, 50));
    }
  });

  // Analyser les liens qui ressemblent à des CTA
  links.forEach(link => {
    const text = link.textContent.toLowerCase().trim();
    if (ctaKeywords.some(keyword => text.includes(keyword)) && text.length < 50) {
      ctaCount++;
      if (detectedCTAs.length < 5) { // Limiter à 5 exemples
        detectedCTAs.push(text.substring(0, 50));
      }
    }
  });

  return {
    count: ctaCount,
    examples: [...new Set(detectedCTAs)].slice(0, 5) // Dédupliquer et limiter
  };
}

/**
 * Détecte les liens vers les réseaux sociaux
 * @returns {Object}
 */
function detectSocialLinks() {
  const socialPlatforms = {
    linkedin: { found: false, count: 0 },
    twitter: { found: false, count: 0 },
    facebook: { found: false, count: 0 },
    instagram: { found: false, count: 0 }
  };

  const links = document.querySelectorAll('a[href]');

  links.forEach(link => {
    const href = link.href.toLowerCase();

    if (href.includes('linkedin.com')) {
      socialPlatforms.linkedin.found = true;
      socialPlatforms.linkedin.count++;
    }
    if (href.includes('twitter.com') || href.includes('x.com')) {
      socialPlatforms.twitter.found = true;
      socialPlatforms.twitter.count++;
    }
    if (href.includes('facebook.com')) {
      socialPlatforms.facebook.found = true;
      socialPlatforms.facebook.count++;
    }
    if (href.includes('instagram.com')) {
      socialPlatforms.instagram.found = true;
      socialPlatforms.instagram.count++;
    }
  });

  const totalFound = Object.values(socialPlatforms).filter(p => p.found).length;

  return {
    platforms: socialPlatforms,
    totalFound: totalFound
  };
}

/**
 * Calcule le score Marketing sur 100
 * @param {Object} marketing - Données Marketing
 * @returns {number} Score sur 100
 */
function calculateMarketingScore(marketing) {
  let score = 0;

  // GA4 (20 points)
  if (marketing.ga4.detected) score += 20;

  // GTM (20 points)
  if (marketing.gtm.detected) score += 20;

  // Meta Pixel (15 points)
  if (marketing.metaPixel.detected) score += 15;

  // HubSpot (10 points)
  if (marketing.hubspot.detected) score += 10;

  // CTA (20 points)
  if (marketing.cta.count >= 5) score += 20;
  else if (marketing.cta.count >= 3) score += 15;
  else if (marketing.cta.count >= 1) score += 10;

  // Réseaux sociaux (15 points)
  if (marketing.social.totalFound >= 4) score += 15;
  else if (marketing.social.totalFound >= 3) score += 12;
  else if (marketing.social.totalFound >= 2) score += 8;
  else if (marketing.social.totalFound >= 1) score += 5;

  return Math.min(score, 100);
}

/* ========================================
   PILIER 3: ANALYSE UX & TECHNIQUE
   ======================================== */

/**
 * Analyse l'expérience utilisateur et les aspects techniques
 * @returns {Object} Données UX
 */
function analyzeUX() {
  const ux = {};

  // 1. Vérification du Viewport (responsive)
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  ux.viewport = {
    exists: !!viewportMeta,
    content: viewportMeta ? viewportMeta.getAttribute('content') : ''
  };

  // 2. Comptage des mots
  ux.wordCount = countWords();

  // 3. Temps de lecture estimé (basé sur 200 mots/minute)
  ux.readingTime = Math.ceil(ux.wordCount / 200);

  // 4. Analyse des liens
  ux.links = analyzeLinks();

  return ux;
}

/**
 * Compte le nombre de mots dans le contenu principal
 * @returns {number}
 */
function countWords() {
  // Récupérer le texte visible de la page
  const bodyText = document.body.innerText || document.body.textContent;

  // Nettoyer et compter les mots
  const words = bodyText
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);

  return words.length;
}

/**
 * Analyse tous les liens de la page
 * @returns {Object}
 */
function analyzeLinks() {
  const allLinks = document.querySelectorAll('a[href]');

  let brokenLinks = 0;
  const brokenExamples = [];

  allLinks.forEach(link => {
    const href = link.getAttribute('href');

    // Vérifier les liens vides ou cassés
    if (!href || href === '#' || href === '' || href === 'javascript:void(0)') {
      brokenLinks++;
      if (brokenExamples.length < 3) {
        brokenExamples.push(link.textContent.trim().substring(0, 30) || 'Sans texte');
      }
    }
  });

  return {
    total: allLinks.length,
    broken: brokenLinks,
    brokenExamples: brokenExamples
  };
}

/**
 * Calcule le score UX sur 100
 * @param {Object} ux - Données UX
 * @returns {number} Score sur 100
 */
function calculateUXScore(ux) {
  let score = 0;

  // Viewport mobile (25 points)
  if (ux.viewport.exists) score += 25;

  // Nombre de mots (25 points)
  if (ux.wordCount >= 300) score += 25;
  else if (ux.wordCount >= 150) score += 15;
  else if (ux.wordCount >= 50) score += 10;

  // Temps de lecture raisonnable (10 points bonus)
  if (ux.readingTime >= 2 && ux.readingTime <= 15) score += 10;

  // Liens (40 points)
  if (ux.links.total > 0) {
    score += 20; // Avoir des liens

    // Pénalité pour liens cassés
    const brokenPercentage = (ux.links.broken / ux.links.total) * 100;
    if (brokenPercentage === 0) score += 20;
    else if (brokenPercentage <= 5) score += 15;
    else if (brokenPercentage <= 10) score += 10;
    else if (brokenPercentage <= 20) score += 5;
  }

  return Math.min(score, 100);
}

console.log('✅ Content script chargé et prêt à analyser');
