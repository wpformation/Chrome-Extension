/**
 * CONTENT.JS - Moteur d'Analyse Professionnel
 * Extension Chrome Audit Expert - Analyse SEO, Marketing & UX
 * Version Professionnelle avec recommandations détaillées
 */

// Écoute des messages provenant de la popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzePage') {
    performCompleteAudit(request.forceRefresh || false, request.useAI || false).then(results => {
      sendResponse(results);
    }).catch(error => {
      sendResponse({ error: error.message });
    });
    return true; // Important pour async
  }
});

/**
 * Récupère une analyse depuis le cache
 * @param {string} url - URL de la page
 * @returns {Promise<Object|null>} Résultats cachés ou null
 */
async function getCachedAnalysis(url) {
  return new Promise((resolve) => {
    chrome.storage.local.get([url], (result) => {
      const cached = result[url];
      if (cached && cached.timestamp) {
        const age = Date.now() - new Date(cached.timestamp).getTime();
        const MAX_AGE = 24 * 60 * 60 * 1000; // 24 heures
        if (age < MAX_AGE) {
          console.log(`📦 Analyse chargée depuis le cache (âge: ${Math.round(age / 1000 / 60)}min)`);
          resolve(cached);
        } else {
          console.log('⏰ Cache expiré (> 24h)');
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * Sauvegarde une analyse dans le cache
 * @param {string} url - URL de la page
 * @param {Object} results - Résultats de l'analyse
 * @returns {Promise<void>}
 */
async function saveAnalysisToCache(url, results) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [url]: results }, () => {
      console.log('💾 Analyse sauvegardée dans le cache');
      resolve();
    });
  });
}

/**
 * Fonction principale d'audit qui orchestre toutes les analyses
 * @param {boolean} forceRefresh - Force une nouvelle analyse même si cache disponible
 * @param {boolean} useAI - Utilise l'analyse IA via Claude (par défaut: true)
 * @returns {Promise<Object>} Résultats complets de l'audit avec recommandations
 */
async function performCompleteAudit(forceRefresh = false, useAI = true) {
  const url = window.location.href;

  // Vérifier le cache si pas de forceRefresh
  if (!forceRefresh) {
    const cached = await getCachedAnalysis(url);
    if (cached) {
      console.log('📦 Analyse chargée depuis le cache');
      return cached;
    }
  }

  // TENTATIVE ANALYSE IA (si useAI=true et fonction disponible)
  if (useAI && typeof analyzePageWithAI === 'function') {
    try {
      console.log('🤖 Démarrage de l\'analyse IA avec Claude Sonnet 3.5...');
      const aiResults = await analyzePageWithAI();

      // Ajouter les détections techniques (cache, CMS, Core Web Vitals)
      aiResults.cms = detectCMS();
      aiResults.cache = detectCache();
      aiResults.technologies = detectTechnologies();
      aiResults.coreWebVitals = measureCoreWebVitals();
      aiResults.analysisMethod = 'AI (Claude Sonnet 3.5)';

      // Sauvegarder dans le cache
      await saveAnalysisToCache(url, aiResults);

      console.log('✅ Analyse IA terminée avec succès:', aiResults);
      return aiResults;

    } catch (error) {
      console.warn('⚠️ Analyse IA échouée, fallback vers analyse code:', error.message);
      // Continue vers analyse code classique
    }
  }

  // FALLBACK: ANALYSE CODE CLASSIQUE
  console.log('🚀 Démarrage de l\'analyse code classique...');

  const results = {
    url: window.location.href,
    timestamp: new Date().toISOString(),
    analysisMethod: 'Code Analysis (Fallback)',
    seo: analyzeSEO(),
    marketing: analyzeMarketing(),
    ux: analyzeUX(),

    // ANALYSES TECHNIQUES
    cms: detectCMS(),
    cache: detectCache(),
    technologies: detectTechnologies(),
    coreWebVitals: measureCoreWebVitals(),

    recommendations: []
  };

  // Calcul des scores
  results.seo.score = calculateSEOScore(results.seo);
  results.marketing.score = calculateMarketingScore(results.marketing);
  results.ux.score = calculateUXScore(results.ux);

  // Score global (moyenne pondérée: SEO 40%, Marketing 30%, UX 30%)
  results.globalScore = Math.round(
    (results.seo.score * 0.4 + results.marketing.score * 0.3 + results.ux.score * 0.3)
  );

  // Génération des recommandations prioritaires
  results.recommendations = generateRecommendations(results);

  console.log('✅ Analyse code terminée:', results);

  // Sauvegarder dans le cache
  await saveAnalysisToCache(url, results);

  return results;
}

/* ========================================
   PILIER 1: ANALYSE SEO PROFESSIONNELLE
   ======================================== */

function analyzeSEO() {
  const seo = {};

  // 1. TITLE TAG - Analyse approfondie
  const titleTag = document.querySelector('title');
  seo.title = {
    exists: !!titleTag,
    content: titleTag ? titleTag.textContent.trim() : '',
    length: titleTag ? titleTag.textContent.trim().length : 0,
    isOptimal: false,
    status: '',
    recommendation: ''
  };

  if (!seo.title.exists) {
    seo.title.status = 'Critique';
    seo.title.recommendation = 'Ajoutez immédiatement une balise <title> unique et descriptive. C\'est le facteur SEO le plus important.';
  } else if (seo.title.length < 30) {
    seo.title.status = 'Trop court';
    seo.title.recommendation = `Votre titre fait ${seo.title.length} caractères. Allongez-le à 50-60 caractères pour mieux décrire votre contenu et améliorer le CTR.`;
  } else if (seo.title.length > 70) {
    seo.title.status = 'Trop long';
    seo.title.recommendation = `Votre titre fait ${seo.title.length} caractères. Réduisez-le à 50-60 caractères pour éviter la troncature dans les SERP Google.`;
  } else {
    seo.title.isOptimal = true;
    seo.title.status = 'Optimal';
    seo.title.recommendation = 'Parfait ! Votre titre respecte les bonnes pratiques SEO.';
  }

  // 2. META DESCRIPTION - Analyse approfondie
  const metaDesc = document.querySelector('meta[name="description"]');
  seo.metaDescription = {
    exists: !!metaDesc,
    content: metaDesc ? metaDesc.getAttribute('content') : '',
    length: metaDesc ? metaDesc.getAttribute('content').length : 0,
    isOptimal: false,
    status: '',
    recommendation: ''
  };

  if (!seo.metaDescription.exists) {
    seo.metaDescription.status = 'Absente';
    seo.metaDescription.recommendation = 'Ajoutez une meta description unique de 140-160 caractères. Elle impacte directement votre taux de clic (CTR) dans Google.';
  } else if (seo.metaDescription.length < 120) {
    seo.metaDescription.status = 'Trop courte';
    seo.metaDescription.recommendation = `Votre description fait ${seo.metaDescription.length} caractères. Allongez-la à 140-160 caractères pour maximiser l\'espace dans les résultats Google.`;
  } else if (seo.metaDescription.length > 170) {
    seo.metaDescription.status = 'Trop longue';
    seo.metaDescription.recommendation = `Votre description fait ${seo.metaDescription.length} caractères. Réduisez-la à 140-160 caractères pour éviter la troncature.`;
  } else {
    seo.metaDescription.isOptimal = true;
    seo.metaDescription.status = 'Optimale';
    seo.metaDescription.recommendation = 'Excellente longueur ! Assurez-vous qu\'elle contient vos mots-clés principaux et incite au clic.';
  }

  // 3. H1 - Analyse approfondie
  const h1Tags = document.querySelectorAll('h1');
  seo.h1 = {
    count: h1Tags.length,
    isUnique: h1Tags.length === 1,
    content: h1Tags.length > 0 ? Array.from(h1Tags).map(h => h.textContent.trim()) : [],
    status: '',
    recommendation: ''
  };

  if (seo.h1.count === 0) {
    seo.h1.status = 'Absent';
    seo.h1.recommendation = 'Ajoutez un H1 unique qui décrit clairement le sujet principal de la page. C\'est essentiel pour le SEO.';
  } else if (seo.h1.count > 1) {
    seo.h1.status = 'Multiple';
    seo.h1.recommendation = `Vous avez ${seo.h1.count} balises H1. Gardez-en une seule pour respecter la hiérarchie sémantique et renforcer votre SEO.`;
  } else {
    seo.h1.status = 'Parfait';
    seo.h1.recommendation = 'Excellent ! Un seul H1 unique et descriptif.';
  }

  // 4. HIÉRARCHIE DES TITRES - Analyse détaillée
  const headingHierarchy = analyzeHeadingHierarchy();
  seo.headings = {
    h1: document.querySelectorAll('h1').length,
    h2: document.querySelectorAll('h2').length,
    h3: document.querySelectorAll('h3').length,
    h4: document.querySelectorAll('h4').length,
    h5: document.querySelectorAll('h5').length,
    h6: document.querySelectorAll('h6').length,
    total: headingHierarchy.total,
    isHierarchical: headingHierarchy.isValid,
    errors: headingHierarchy.errors,
    status: '',
    recommendation: ''
  };

  if (!headingHierarchy.isValid) {
    seo.headings.status = 'Hiérarchie incorrecte';
    seo.headings.recommendation = `Structure des titres incohérente (${seo.headings.total} titres au total). ${headingHierarchy.errors.join(' ')} Respectez l'ordre H1→H2→H3→H4.`;
  } else if (seo.headings.total === 0) {
    seo.headings.status = 'Aucun titre';
    seo.headings.recommendation = 'Ajoutez des titres hiérarchisés (H1, H2, H3) pour structurer votre contenu et améliorer le SEO.';
  } else {
    seo.headings.status = 'Bien structurée';
    seo.headings.recommendation = `Excellente hiérarchie ! ${seo.headings.total} titres bien organisés.`;
  }

  // 5. IMAGES - Analyse complète des attributs ALT
  const imageAnalysis = analyzeImages();
  seo.images = {
    total: imageAnalysis.total,
    withoutAlt: imageAnalysis.withoutAlt,
    withEmptyAlt: imageAnalysis.withEmptyAlt,
    decorative: imageAnalysis.decorative,
    optimized: imageAnalysis.optimized,
    percentage: imageAnalysis.percentage,
    examples: imageAnalysis.examples,
    status: '',
    recommendation: ''
  };

  if (seo.images.total === 0) {
    seo.images.status = 'Aucune image';
    seo.images.recommendation = 'Aucune image détectée sur cette page.';
  } else if (seo.images.withoutAlt === 0) {
    seo.images.status = 'Parfait';
    seo.images.recommendation = `Excellent ! Toutes vos ${seo.images.total} images ont un attribut ALT.`;
  } else {
    seo.images.status = 'À corriger';
    seo.images.recommendation = `${seo.images.withoutAlt} image(s) sur ${seo.images.total} n'ont pas d'attribut ALT. Ajoutez des descriptions pour améliorer l'accessibilité et le SEO.`;
  }

  // 6. CANONICAL
  const canonicalTag = document.querySelector('link[rel="canonical"]');
  seo.canonical = {
    exists: !!canonicalTag,
    href: canonicalTag ? canonicalTag.getAttribute('href') : '',
    isValid: false,
    status: '',
    recommendation: ''
  };

  if (seo.canonical.exists) {
    seo.canonical.isValid = seo.canonical.href && seo.canonical.href.startsWith('http');
    seo.canonical.status = seo.canonical.isValid ? 'Présente' : 'Invalide';
    seo.canonical.recommendation = seo.canonical.isValid
      ? 'Balise canonical présente et valide.'
      : 'Balise canonical présente mais URL invalide.';
  } else {
    seo.canonical.status = 'Absente';
    seo.canonical.recommendation = 'Ajoutez une balise canonical pour éviter le duplicate content et consolider votre ranking.';
  }

  // 7. SCHEMA.ORG / Structured Data
  const schemaData = detectStructuredData();
  seo.schema = {
    hasSchema: schemaData.found,
    types: schemaData.types,
    count: schemaData.count,
    status: schemaData.found ? 'Détecté' : 'Absent',
    recommendation: schemaData.found
      ? `Excellent ! ${schemaData.count} schema(s) détecté(s): ${schemaData.types.join(', ')}.`
      : 'Ajoutez des données structurées (Schema.org) pour enrichir vos résultats dans Google (rich snippets).'
  };

  // 8. OPEN GRAPH (partage social)
  const ogAnalysis = analyzeOpenGraph();
  seo.openGraph = {
    hasOG: ogAnalysis.found,
    tags: ogAnalysis.tags,
    complete: ogAnalysis.complete,
    status: ogAnalysis.status,
    recommendation: ogAnalysis.recommendation
  };

  // 9. META ROBOTS
  const robotsMeta = document.querySelector('meta[name="robots"]');
  seo.robots = {
    exists: !!robotsMeta,
    content: robotsMeta ? robotsMeta.getAttribute('content') : '',
    isBlocking: robotsMeta && (robotsMeta.getAttribute('content').includes('noindex') || robotsMeta.getAttribute('content').includes('nofollow')),
    status: '',
    recommendation: ''
  };

  if (seo.robots.isBlocking) {
    seo.robots.status = 'Bloque l\'indexation';
    seo.robots.recommendation = `⚠️ ATTENTION: meta robots="${seo.robots.content}" bloque l'indexation ou le suivi. Retirez si non intentionnel.`;
  } else if (!seo.robots.exists) {
    seo.robots.status = 'Par défaut';
    seo.robots.recommendation = 'Pas de directive robots spécifique (comportement par défaut: index, follow).';
  } else {
    seo.robots.status = 'Défini';
    seo.robots.recommendation = `Directive robots: "${seo.robots.content}"`;
  }

  return seo;
}

/**
 * Analyse la hiérarchie des titres de manière détaillée
 */
function analyzeHeadingHierarchy() {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const errors = [];

  if (headings.length === 0) {
    return { total: 0, isValid: false, errors: ['Aucun titre détecté.'] };
  }

  let previousLevel = 0;
  let hasH1 = false;
  const levelCounts = {};

  for (const heading of headings) {
    const currentLevel = parseInt(heading.tagName.substring(1));
    levelCounts[currentLevel] = (levelCounts[currentLevel] || 0) + 1;

    if (currentLevel === 1) hasH1 = true;

    // Vérifier qu'on ne saute pas de niveau (max +1)
    if (currentLevel > previousLevel + 1 && previousLevel !== 0) {
      errors.push(`Saut de niveau détecté: H${previousLevel} → H${currentLevel}.`);
    }

    previousLevel = currentLevel;
  }

  if (!hasH1) {
    errors.push('Aucun H1 trouvé.');
  }

  return {
    total: headings.length,
    isValid: errors.length === 0,
    errors: errors,
    distribution: levelCounts
  };
}

/**
 * Analyse complète des images
 */
function analyzeImages() {
  const images = document.querySelectorAll('img');
  let withoutAlt = 0;
  let withEmptyAlt = 0;
  let decorative = 0;
  const examples = [];

  images.forEach(img => {
    const alt = img.getAttribute('alt');
    const hasAlt = img.hasAttribute('alt');

    if (!hasAlt) {
      withoutAlt++;
      if (examples.length < 3) {
        examples.push({ src: img.src.substring(0, 50), issue: 'Attribut ALT manquant' });
      }
    } else if (alt.trim() === '') {
      withEmptyAlt++;
      decorative++; // ALT vide = image décorative (bonne pratique)
    }
  });

  return {
    total: images.length,
    withoutAlt: withoutAlt,
    withEmptyAlt: withEmptyAlt,
    decorative: decorative,
    optimized: images.length - withoutAlt,
    percentage: images.length > 0 ? Math.round((withoutAlt / images.length) * 100) : 0,
    examples: examples
  };
}

/**
 * Détecte les données structurées (Schema.org, JSON-LD)
 */
function detectStructuredData() {
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  const types = new Set();

  jsonLdScripts.forEach(script => {
    try {
      const data = JSON.parse(script.textContent);
      if (data['@type']) {
        types.add(data['@type']);
      } else if (data['@graph']) {
        data['@graph'].forEach(item => {
          if (item['@type']) types.add(item['@type']);
        });
      }
    } catch (e) {
      // JSON invalide, on ignore
    }
  });

  return {
    found: types.size > 0,
    types: Array.from(types),
    count: types.size
  };
}

/**
 * Analyse les balises Open Graph pour le partage social
 */
function analyzeOpenGraph() {
  const ogTags = {
    'og:title': document.querySelector('meta[property="og:title"]'),
    'og:description': document.querySelector('meta[property="og:description"]'),
    'og:image': document.querySelector('meta[property="og:image"]'),
    'og:url': document.querySelector('meta[property="og:url"]'),
    'og:type': document.querySelector('meta[property="og:type"]')
  };

  const foundTags = Object.keys(ogTags).filter(key => ogTags[key]);
  const complete = foundTags.length >= 4; // Au moins 4 tags essentiels

  return {
    found: foundTags.length > 0,
    tags: foundTags,
    complete: complete,
    status: complete ? 'Complet' : (foundTags.length > 0 ? 'Partiel' : 'Absent'),
    recommendation: complete
      ? `Open Graph complet (${foundTags.length}/5 tags). Vos partages sur réseaux sociaux seront optimisés.`
      : (foundTags.length > 0
        ? `Open Graph incomplet (${foundTags.length}/5 tags). Ajoutez og:title, og:description, og:image et og:url.`
        : 'Ajoutez les balises Open Graph pour contrôler l\'apparence de vos partages sur Facebook, LinkedIn, etc.')
  };
}

/**
 * Calcule le score SEO sur 100
 */
function calculateSEOScore(seo) {
  let score = 0;

  // Title (20 points)
  if (seo.title.exists && seo.title.isOptimal) score += 20;
  else if (seo.title.exists) score += 10;

  // Meta Description (15 points)
  if (seo.metaDescription.exists && seo.metaDescription.isOptimal) score += 15;
  else if (seo.metaDescription.exists) score += 8;

  // H1 unique (15 points)
  if (seo.h1.isUnique) score += 15;
  else if (seo.h1.count > 0) score += 8;

  // Hiérarchie des titres (15 points)
  if (seo.headings.isHierarchical && seo.headings.h1 > 0) score += 15;
  else if (seo.headings.h1 > 0) score += 7;

  // Images avec ALT (10 points)
  if (seo.images.withoutAlt === 0 && seo.images.total > 0) score += 10;
  else if (seo.images.percentage <= 25) score += 7;
  else if (seo.images.percentage <= 50) score += 3;

  // Canonical (5 points)
  if (seo.canonical.exists && seo.canonical.isValid) score += 5;

  // Schema.org (10 points)
  if (seo.schema.hasSchema) score += 10;

  // Open Graph (5 points)
  if (seo.openGraph.complete) score += 5;
  else if (seo.openGraph.hasOG) score += 2;

  // Meta Robots (5 points) - pénalité si bloquant
  if (seo.robots.isBlocking) score -= 10;
  else score += 5;

  return Math.max(0, Math.min(score, 100));
}

/* ========================================
   PILIER 2: ANALYSE MARKETING AVANCÉE
   ======================================== */

function analyzeMarketing() {
  const marketing = {};

  // Détection avancée d'outils marketing
  marketing.ga4 = detectGA4();
  marketing.gtm = detectGTM();
  marketing.metaPixel = detectMetaPixel();
  marketing.hubspot = detectHubSpot();
  marketing.linkedinInsight = detectLinkedInInsight();
  marketing.tiktokPixel = detectTikTokPixel();
  marketing.hotjar = detectHotjar();
  marketing.clarity = detectClarity();
  marketing.intercom = detectIntercom();
  marketing.drift = detectDrift();

  // Analyse CTA améliorée
  marketing.cta = detectCTA();

  // Détection des liens sociaux
  marketing.social = detectSocialLinks();

  // Formulaires de conversion
  marketing.forms = analyzeForms();

  return marketing;
}

/**
 * Détecte Google Analytics 4
 */
function detectGA4() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const hasGA4Script = scripts.some(script =>
    script.src.includes('googletagmanager.com/gtag/js') ||
    script.textContent.includes('gtag(') ||
    script.textContent.includes('G-')
  );

  const hasDataLayer = typeof window.dataLayer !== 'undefined';

  // Extraction de l'ID GA4
  let ga4Id = '';
  if (hasGA4Script) {
    const ga4Script = scripts.find(s => s.textContent.includes('G-'));
    if (ga4Script) {
      const match = ga4Script.textContent.match(/G-[A-Z0-9]+/);
      if (match) ga4Id = match[0];
    }
  }

  return {
    detected: hasGA4Script || hasDataLayer,
    id: ga4Id,
    method: hasGA4Script ? 'Script gtag.js' : (hasDataLayer ? 'dataLayer' : 'Non détecté'),
    recommendation: hasGA4Script || hasDataLayer
      ? `GA4 détecté${ga4Id ? ' (ID: ' + ga4Id + ')' : ''}. Assurez-vous de configurer les événements de conversion.`
      : 'Installez Google Analytics 4 pour suivre votre trafic et comprendre le comportement de vos visiteurs.'
  };
}

/**
 * Détecte Google Tag Manager
 */
function detectGTM() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const hasGTM = scripts.some(script =>
    script.src.includes('googletagmanager.com/gtm.js') ||
    script.textContent.includes('GTM-')
  );

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
    id: gtmId,
    recommendation: hasGTM
      ? `GTM détecté${gtmId ? ' (' + gtmId + ')' : ''}. Centralisez vos tags marketing pour une gestion simplifiée.`
      : 'Installez Google Tag Manager pour gérer facilement tous vos pixels et tags marketing sans modifier le code.'
  };
}

/**
 * Détecte Meta Pixel (Facebook)
 */
function detectMetaPixel() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const hasMetaPixel = scripts.some(script =>
    script.textContent.includes('fbq(') ||
    script.textContent.includes('facebook.com/tr') ||
    script.src.includes('connect.facebook.net')
  );

  let pixelId = '';
  if (hasMetaPixel) {
    const pixelScript = scripts.find(s => s.textContent.includes('fbq(\'init\''));
    if (pixelScript) {
      const match = pixelScript.textContent.match(/fbq\('init',\s*'(\d+)'/);
      if (match) pixelId = match[1];
    }
  }

  return {
    detected: hasMetaPixel,
    id: pixelId,
    recommendation: hasMetaPixel
      ? `Meta Pixel détecté${pixelId ? ' (ID: ' + pixelId + ')' : ''}. Configurez les événements de conversion pour vos campagnes Facebook/Instagram.`
      : 'Installez le Meta Pixel pour suivre les conversions de vos publicités Facebook et Instagram, et créer des audiences personnalisées.'
  };
}

/**
 * Détecte HubSpot
 */
function detectHubSpot() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const hasHubSpot = scripts.some(script =>
    script.src.includes('js.hs-scripts.com') ||
    script.src.includes('js.hubspot.com')
  );

  return {
    detected: hasHubSpot,
    recommendation: hasHubSpot
      ? 'HubSpot détecté. Exploitez le tracking comportemental pour scorer vos leads et personnaliser vos campagnes.'
      : 'HubSpot permet d\'automatiser votre marketing, gérer vos contacts et scorer vos leads automatiquement.'
  };
}

/**
 * Détecte LinkedIn Insight Tag
 */
function detectLinkedInInsight() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const hasLinkedIn = scripts.some(script =>
    script.textContent.includes('_linkedin_partner_id') ||
    script.src.includes('snap.licdn.com')
  );

  return {
    detected: hasLinkedIn,
    recommendation: hasLinkedIn
      ? 'LinkedIn Insight Tag détecté. Suivez les conversions de vos campagnes LinkedIn Ads et créez des audiences de retargeting.'
      : 'Installez le LinkedIn Insight Tag pour mesurer l\'efficacité de vos campagnes B2B LinkedIn et créer des audiences.'
  };
}

/**
 * Détecte TikTok Pixel
 */
function detectTikTokPixel() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const hasTikTok = scripts.some(script =>
    script.textContent.includes('ttq.') ||
    script.src.includes('analytics.tiktok.com')
  );

  return {
    detected: hasTikTok,
    recommendation: hasTikTok
      ? 'TikTok Pixel détecté. Optimisez vos campagnes TikTok Ads avec le suivi des conversions.'
      : 'Installez le TikTok Pixel si vous faites de la publicité sur TikTok pour suivre les conversions et créer des audiences.'
  };
}

/**
 * Détecte Hotjar
 */
function detectHotjar() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const hasHotjar = scripts.some(script =>
    script.textContent.includes('hotjar') ||
    script.src.includes('static.hotjar.com')
  );

  return {
    detected: hasHotjar,
    recommendation: hasHotjar
      ? 'Hotjar détecté. Utilisez les heatmaps et enregistrements de session pour optimiser votre UX.'
      : 'Hotjar permet de visualiser le comportement des utilisateurs via heatmaps, enregistrements et feedback.'
  };
}

/**
 * Détecte Microsoft Clarity
 */
function detectClarity() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const hasClarity = scripts.some(script =>
    script.textContent.includes('clarity') ||
    script.src.includes('clarity.ms')
  );

  return {
    detected: hasClarity,
    recommendation: hasClarity
      ? 'Microsoft Clarity détecté. Analysez les sessions et heatmaps pour comprendre le comportement utilisateur.'
      : 'Microsoft Clarity est gratuit et offre des heatmaps, enregistrements de sessions et insights sur l\'engagement.'
  };
}

/**
 * Détecte Intercom
 */
function detectIntercom() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const hasIntercom = scripts.some(script =>
    script.textContent.includes('Intercom') ||
    script.src.includes('widget.intercom.io')
  );

  return {
    detected: hasIntercom,
    recommendation: hasIntercom
      ? 'Intercom détecté. Personnalisez vos messages in-app et automatisez votre support client.'
      : 'Intercom permet d\'engager vos visiteurs via chat, messages automatisés et support client centralisé.'
  };
}

/**
 * Détecte Drift
 */
function detectDrift() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const hasDrift = scripts.some(script =>
    script.textContent.includes('drift') ||
    script.src.includes('js.driftt.com')
  );

  return {
    detected: hasDrift,
    recommendation: hasDrift
      ? 'Drift détecté. Qualifiez vos leads en temps réel avec le chatbot conversationnel.'
      : 'Drift permet de qualifier et convertir vos visiteurs B2B via chat conversationnel et automatisation.'
  };
}

/**
 * Détection ULTRA-INTELLIGENTE des CTA (Call-to-Action)
 * Détecte TOUS les boutons visuels, pas seulement les mots-clés
 */
function detectCTA() {
  const ctaSet = new Set();
  const examples = [];

  // 1. Tous les boutons HTML natifs
  const nativeButtons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');

  // 2. Tous les liens avec classes bouton (très large)
  const buttonClasses = document.querySelectorAll(`
    a[class*="button"], a[class*="btn"], a[class*="cta"],
    [class*="wp-block-button"], [class*="ast-button"],
    [class*="elementor-button"], [class*="uagb-button"],
    [role="button"]
  `);

  // 3. Détection visuelle: liens qui ressemblent à des boutons
  const allLinks = document.querySelectorAll('a');
  const visualButtons = [];

  allLinks.forEach(link => {
    try {
      const styles = window.getComputedStyle(link);
      const bgColor = styles.backgroundColor;
      const padding = styles.padding;
      const borderRadius = styles.borderRadius;
      const display = styles.display;

      // Si le lien a un background coloré + padding + border-radius = bouton visuel
      const hasBackground = bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent';
      const hasPadding = padding && padding !== '0px';
      const hasRoundedCorners = borderRadius && borderRadius !== '0px';
      const isInlineBlock = display === 'inline-block' || display === 'block' || display === 'flex';

      if (hasBackground && hasPadding && (hasRoundedCorners || isInlineBlock)) {
        visualButtons.push(link);
      }
    } catch (e) {
      // Ignore les erreurs de computed style
    }
  });

  // Combiner toutes les détections
  const allCTAs = [
    ...Array.from(nativeButtons),
    ...Array.from(buttonClasses),
    ...visualButtons
  ];

  // Dédupliquer et extraire les textes
  allCTAs.forEach(cta => {
    const text = (cta.textContent || cta.value || '').trim();

    // Ignorer les boutons vides ou très longs (> 100 car) ou les menus
    if (text.length === 0 || text.length > 100) return;

    // Ignorer les boutons de navigation pure (Précédent/Suivant/etc)
    const navWords = ['précédent', 'suivant', 'previous', 'next', 'fermer', 'close', 'menu'];
    if (navWords.some(word => text.toLowerCase() === word)) return;

    ctaSet.add(text);
    if (examples.length < 8) {
      examples.push(text.substring(0, 50));
    }
  });

  const count = ctaSet.size;
  let recommendation = '';

  if (count === 0) {
    recommendation = 'Aucun CTA détecté ! Ajoutez des boutons d\'action clairs (contact, devis, téléchargement, essai, etc.) pour convertir vos visiteurs.';
  } else if (count < 2) {
    recommendation = `Seulement ${count} CTA détecté. Ajoutez plus de points de conversion stratégiques sur votre page.`;
  } else if (count < 4) {
    recommendation = `${count} CTA détectés. Bien ! Testez différents emplacements et formulations pour optimiser votre taux de conversion.`;
  } else {
    recommendation = `${count} CTA détectés. Excellent ! Assurez-vous qu'ils sont bien visibles et cohérents avec votre parcours utilisateur.`;
  }

  return {
    count: count,
    examples: examples,
    recommendation: recommendation
  };
}

/**
 * Détection des liens sociaux
 */
function detectSocialLinks() {
  const socialPlatforms = {
    linkedin: { found: false, count: 0, urls: [] },
    twitter: { found: false, count: 0, urls: [] },
    facebook: { found: false, count: 0, urls: [] },
    instagram: { found: false, count: 0, urls: [] },
    youtube: { found: false, count: 0, urls: [] },
    tiktok: { found: false, count: 0, urls: [] }
  };

  const links = document.querySelectorAll('a[href]');

  links.forEach(link => {
    const href = link.href.toLowerCase();

    if (href.includes('linkedin.com')) {
      socialPlatforms.linkedin.found = true;
      socialPlatforms.linkedin.count++;
      if (socialPlatforms.linkedin.urls.length < 2) socialPlatforms.linkedin.urls.push(link.href);
    }
    if (href.includes('twitter.com') || href.includes('x.com')) {
      socialPlatforms.twitter.found = true;
      socialPlatforms.twitter.count++;
      if (socialPlatforms.twitter.urls.length < 2) socialPlatforms.twitter.urls.push(link.href);
    }
    if (href.includes('facebook.com') && !href.includes('facebook.com/tr')) {
      socialPlatforms.facebook.found = true;
      socialPlatforms.facebook.count++;
      if (socialPlatforms.facebook.urls.length < 2) socialPlatforms.facebook.urls.push(link.href);
    }
    if (href.includes('instagram.com')) {
      socialPlatforms.instagram.found = true;
      socialPlatforms.instagram.count++;
      if (socialPlatforms.instagram.urls.length < 2) socialPlatforms.instagram.urls.push(link.href);
    }
    if (href.includes('youtube.com') || href.includes('youtu.be')) {
      socialPlatforms.youtube.found = true;
      socialPlatforms.youtube.count++;
      if (socialPlatforms.youtube.urls.length < 2) socialPlatforms.youtube.urls.push(link.href);
    }
    if (href.includes('tiktok.com')) {
      socialPlatforms.tiktok.found = true;
      socialPlatforms.tiktok.count++;
      if (socialPlatforms.tiktok.urls.length < 2) socialPlatforms.tiktok.urls.push(link.href);
    }
  });

  const totalFound = Object.values(socialPlatforms).filter(p => p.found).length;
  const platformNames = Object.keys(socialPlatforms).filter(key => socialPlatforms[key].found);

  let recommendation = '';
  if (totalFound === 0) {
    recommendation = 'Aucun lien vers les réseaux sociaux. Ajoutez des liens vers vos profils pour développer votre communauté.';
  } else if (totalFound < 3) {
    recommendation = `${totalFound} réseau(x) social(aux) lié(s): ${platformNames.join(', ')}. Ajoutez plus de liens pour élargir votre présence sociale.`;
  } else {
    recommendation = `${totalFound} réseaux sociaux liés: ${platformNames.join(', ')}. Excellente présence sociale !`;
  }

  return {
    platforms: socialPlatforms,
    totalFound: totalFound,
    platformNames: platformNames,
    recommendation: recommendation
  };
}

/**
 * Analyse des formulaires de conversion
 */
function analyzeForms() {
  const forms = document.querySelectorAll('form');
  const formData = [];

  forms.forEach((form, index) => {
    const inputs = form.querySelectorAll('input, textarea, select');
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');

    formData.push({
      index: index,
      inputs: inputs.length,
      hasSubmit: !!submitBtn,
      action: form.action || 'Non défini'
    });
  });

  let recommendation = '';
  if (forms.length === 0) {
    recommendation = 'Aucun formulaire détecté. Ajoutez des formulaires de contact, devis ou inscription pour capturer des leads.';
  } else {
    recommendation = `${forms.length} formulaire(s) détecté(s). Optimisez-les pour maximiser les conversions (champs minimum, labels clairs, validation en temps réel).`;
  }

  return {
    count: forms.length,
    forms: formData,
    recommendation: recommendation
  };
}

/**
 * Calcule le score Marketing sur 100
 */
function calculateMarketingScore(marketing) {
  let score = 0;

  // Outils de tracking (60 points au total)
  if (marketing.ga4.detected) score += 15;
  if (marketing.gtm.detected) score += 15;
  if (marketing.metaPixel.detected) score += 10;
  if (marketing.hubspot.detected) score += 5;
  if (marketing.linkedinInsight.detected) score += 5;
  if (marketing.tiktokPixel.detected) score += 3;
  if (marketing.hotjar.detected) score += 4;
  if (marketing.clarity.detected) score += 3;

  // CTA (20 points)
  if (marketing.cta.count >= 5) score += 20;
  else if (marketing.cta.count >= 3) score += 15;
  else if (marketing.cta.count >= 1) score += 10;
  else score += 0;

  // Réseaux sociaux (10 points)
  if (marketing.social.totalFound >= 4) score += 10;
  else if (marketing.social.totalFound >= 3) score += 7;
  else if (marketing.social.totalFound >= 2) score += 5;
  else if (marketing.social.totalFound >= 1) score += 3;

  // Formulaires (10 points)
  if (marketing.forms.count >= 2) score += 10;
  else if (marketing.forms.count >= 1) score += 7;

  return Math.min(score, 100);
}

/* ========================================
   PILIER 3: ANALYSE UX & ACCESSIBILITÉ
   ======================================== */

function analyzeUX() {
  const ux = {};

  // 1. Viewport Mobile
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  ux.viewport = {
    exists: !!viewportMeta,
    content: viewportMeta ? viewportMeta.getAttribute('content') : '',
    recommendation: viewportMeta
      ? 'Viewport mobile configuré. Votre site est responsive.'
      : 'CRITIQUE: Ajoutez <meta name="viewport" content="width=device-width, initial-scale=1.0"> pour rendre votre site mobile-friendly.'
  };

  // 2. Comptage des mots et temps de lecture
  ux.wordCount = countWords();
  ux.readingTime = Math.ceil(ux.wordCount / 200); // 200 mots/minute

  let wordRecommendation = '';
  if (ux.wordCount < 50) {
    wordRecommendation = `Très peu de contenu (${ux.wordCount} mots). Enrichissez votre page pour améliorer le SEO et l'engagement.`;
  } else if (ux.wordCount < 300) {
    wordRecommendation = `Contenu léger (${ux.wordCount} mots). Visez 300-500 mots minimum pour un meilleur référencement.`;
  } else if (ux.wordCount < 1000) {
    wordRecommendation = `Bon volume de contenu (${ux.wordCount} mots). Continuez à fournir de la valeur à vos visiteurs.`;
  } else {
    wordRecommendation = `Excellent volume de contenu (${ux.wordCount} mots, ~${ux.readingTime} min de lecture). Google favorise le contenu riche.`;
  }
  ux.wordRecommendation = wordRecommendation;

  // 3. Analyse des liens (améliorée)
  ux.links = analyzeLinksAdvanced();

  // 4. Accessibilité
  ux.accessibility = analyzeAccessibility();

  // 5. Performance (basique)
  ux.performance = analyzeBasicPerformance();

  // 6. Sémantique HTML5
  ux.semantics = analyzeSemantics();

  return ux;
}

/**
 * Compte les mots dans le contenu principal
 */
function countWords() {
  const bodyText = document.body.innerText || document.body.textContent;
  const words = bodyText.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Détermine si un lien # est un menu/dropdown légitime
 */
function isLegitimateMenuLink(link) {
  // 1. Vérifier si le lien est dans un élément nav ou menu
  const inNav = link.closest('nav, [role="navigation"], .menu, .nav, header');
  if (inNav) return true;

  // 2. Vérifier les classes du lien lui-même
  const className = link.className || '';
  const menuClasses = ['menu', 'nav', 'dropdown', 'submenu', 'toggle', 'expand'];
  if (menuClasses.some(cls => className.toLowerCase().includes(cls))) {
    return true;
  }

  // 3. Vérifier si le lien a des attributs ARIA pour les menus
  const ariaHaspopup = link.getAttribute('aria-haspopup');
  const ariaExpanded = link.getAttribute('aria-expanded');
  const ariaControls = link.getAttribute('aria-controls');
  if (ariaHaspopup || ariaExpanded !== null || ariaControls) {
    return true;
  }

  // 4. Vérifier si le lien a des événements onclick (probable comportement JS)
  const hasOnclick = link.hasAttribute('onclick') || link.onclick;
  if (hasOnclick) return true;

  // 5. Vérifier si le parent a une classe de menu
  const parent = link.parentElement;
  const parentClass = parent ? (parent.className || '') : '';
  if (menuClasses.some(cls => parentClass.toLowerCase().includes(cls))) {
    return true;
  }

  return false;
}

/**
 * Analyse avancée des liens INTELLIGENTE
 * Exclut les liens de menu/dropdown valides
 */
function analyzeLinksAdvanced() {
  const allLinks = document.querySelectorAll('a[href]');
  let broken = 0;
  let external = 0;
  let internal = 0;
  let nofollow = 0;
  const brokenExamples = [];
  const externalExamples = [];

  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    const rel = link.getAttribute('rel');

    // Vérifier si c'est un lien de menu/dropdown (usage légitime de #)
    const isMenuLink = isLegitimateMenuLink(link);

    // Liens cassés / vides (MAIS exclure les menus légitimes)
    if (!href || href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
      broken++;
      if (brokenExamples.length < 5) {
        brokenExamples.push({
          text: link.textContent.trim().substring(0, 40) || '[Sans texte]',
          href: href || '[Vide]'
        });
      }
    } else if (href === '#' && !isMenuLink) {
      // Seulement signaler # si ce n'est PAS un menu légitime
      broken++;
      if (brokenExamples.length < 5) {
        brokenExamples.push({
          text: link.textContent.trim().substring(0, 40) || '[Sans texte]',
          href: '#'
        });
      }
    }

    // Liens externes vs internes
    if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      const currentDomain = window.location.hostname;
      const linkDomain = new URL(href).hostname;

      if (linkDomain !== currentDomain) {
        external++;
        if (externalExamples.length < 3) {
          externalExamples.push({ domain: linkDomain, href: href });
        }
      } else {
        internal++;
      }
    } else if (href && (href.startsWith('/') || href.startsWith('./'))) {
      internal++;
    }

    // Liens nofollow
    if (rel && rel.includes('nofollow')) {
      nofollow++;
    }
  });

  let recommendation = '';
  if (allLinks.length === 0) {
    recommendation = 'Aucun lien détecté. Ajoutez des liens internes pour améliorer la navigation et le SEO.';
  } else if (broken > 0) {
    const percentage = Math.round((broken / allLinks.length) * 100);
    recommendation = `⚠️ ${broken} lien(s) cassé(s) ou vide(s) (${percentage}%) sur ${allLinks.length} au total. Corrigez-les immédiatement pour l'UX et le SEO.`;
  } else {
    recommendation = `${allLinks.length} liens au total (${internal} internes, ${external} externes). Aucun lien cassé détecté. Excellent !`;
  }

  return {
    total: allLinks.length,
    broken: broken,
    brokenExamples: brokenExamples,
    internal: internal,
    external: external,
    externalExamples: externalExamples,
    nofollow: nofollow,
    recommendation: recommendation
  };
}

/**
 * Analyse l'accessibilité de base
 */
function analyzeAccessibility() {
  const issues = [];
  let score = 0;

  // 1. Attribut lang sur <html>
  const htmlLang = document.documentElement.getAttribute('lang');
  if (!htmlLang) {
    issues.push('Attribut "lang" manquant sur <html> (important pour les lecteurs d\'écran).');
  } else {
    score += 20;
  }

  // 2. Labels pour les inputs
  const inputs = document.querySelectorAll('input, textarea, select');
  let inputsWithoutLabel = 0;
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    const hasLabel = id && document.querySelector(`label[for="${id}"]`);

    if (!hasLabel && !ariaLabel && !ariaLabelledby && input.type !== 'hidden') {
      inputsWithoutLabel++;
    }
  });

  if (inputsWithoutLabel > 0) {
    issues.push(`${inputsWithoutLabel} champ(s) de formulaire sans label (barrière d'accessibilité).`);
  } else if (inputs.length > 0) {
    score += 20;
  }

  // 3. Contraste (détection basique via styles inline)
  // Note: Une vraie analyse de contraste nécessiterait des calculs complexes
  score += 20; // On donne le bénéfice du doute

  // 4. Balises ARIA
  const ariaElements = document.querySelectorAll('[role], [aria-label], [aria-labelledby]');
  if (ariaElements.length > 5) {
    score += 20;
  } else if (ariaElements.length > 0) {
    score += 10;
  }

  // 5. Boutons accessibles
  const buttons = document.querySelectorAll('button, [role="button"]');
  let buttonsWithoutText = 0;
  buttons.forEach(btn => {
    const text = btn.textContent.trim();
    const ariaLabel = btn.getAttribute('aria-label');
    if (!text && !ariaLabel) {
      buttonsWithoutText++;
    }
  });

  if (buttonsWithoutText > 0) {
    issues.push(`${buttonsWithoutText} bouton(s) sans texte ni aria-label (inaccessible).`);
  } else if (buttons.length > 0) {
    score += 20;
  }

  let recommendation = '';
  if (issues.length === 0) {
    recommendation = 'Bonne accessibilité de base détectée. Continuez à respecter les standards WCAG.';
  } else {
    recommendation = `${issues.length} problème(s) d'accessibilité détecté(s): ${issues.join(' ')}`;
  }

  return {
    score: Math.min(score, 100),
    issues: issues,
    recommendation: recommendation
  };
}

/**
 * Analyse de performance basique
 */
function analyzeBasicPerformance() {
  const images = document.querySelectorAll('img');
  const scripts = document.querySelectorAll('script');
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');

  // Détection lazy loading
  const lazyImages = Array.from(images).filter(img => img.loading === 'lazy');
  const lazyPercentage = images.length > 0 ? Math.round((lazyImages.length / images.length) * 100) : 0;

  // Taille estimée (très basique)
  const totalResources = images.length + scripts.length + stylesheets.length;

  let recommendation = '';
  if (lazyPercentage === 0 && images.length > 5) {
    recommendation = `${images.length} images sans lazy loading. Ajoutez loading="lazy" pour améliorer les performances.`;
  } else if (lazyPercentage > 0) {
    recommendation = `${lazyPercentage}% des images utilisent le lazy loading. Excellent pour les performances !`;
  } else {
    recommendation = `${totalResources} ressources chargées (${images.length} images, ${scripts.length} scripts, ${stylesheets.length} CSS).`;
  }

  return {
    images: images.length,
    scripts: scripts.length,
    stylesheets: stylesheets.length,
    lazyImages: lazyImages.length,
    lazyPercentage: lazyPercentage,
    recommendation: recommendation
  };
}

/**
 * Analyse la sémantique HTML5
 */
function analyzeSemantics() {
  const semanticTags = {
    header: document.querySelectorAll('header').length,
    nav: document.querySelectorAll('nav').length,
    main: document.querySelectorAll('main').length,
    article: document.querySelectorAll('article').length,
    section: document.querySelectorAll('section').length,
    aside: document.querySelectorAll('aside').length,
    footer: document.querySelectorAll('footer').length
  };

  const totalSemantic = Object.values(semanticTags).reduce((sum, val) => sum + val, 0);
  const usedTags = Object.keys(semanticTags).filter(tag => semanticTags[tag] > 0);

  let recommendation = '';
  if (totalSemantic === 0) {
    recommendation = 'Aucune balise HTML5 sémantique détectée. Utilisez <header>, <nav>, <main>, <article>, <footer> pour améliorer l\'accessibilité et le SEO.';
  } else if (totalSemantic < 3) {
    recommendation = `Peu de balises sémantiques (${usedTags.join(', ')}). Enrichissez votre structure HTML5.`;
  } else {
    recommendation = `Bonne structure sémantique (${totalSemantic} balises: ${usedTags.join(', ')}). Excellent pour l'accessibilité et le SEO !`;
  }

  return {
    tags: semanticTags,
    total: totalSemantic,
    usedTags: usedTags,
    recommendation: recommendation
  };
}

/**
 * Calcule le score UX sur 100
 */
function calculateUXScore(ux) {
  let score = 0;

  // Viewport (20 points)
  if (ux.viewport.exists) score += 20;

  // Contenu (20 points)
  if (ux.wordCount >= 500) score += 20;
  else if (ux.wordCount >= 300) score += 15;
  else if (ux.wordCount >= 100) score += 10;
  else if (ux.wordCount >= 50) score += 5;

  // Liens (20 points)
  if (ux.links.total > 0) {
    score += 10;
    const brokenPercentage = (ux.links.broken / ux.links.total) * 100;
    if (brokenPercentage === 0) score += 10;
    else if (brokenPercentage <= 5) score += 7;
    else if (brokenPercentage <= 10) score += 5;
    else if (brokenPercentage <= 20) score += 2;
  }

  // Accessibilité (20 points)
  score += Math.round(ux.accessibility.score * 0.2);

  // Performance (10 points)
  if (ux.performance.lazyPercentage >= 50) score += 10;
  else if (ux.performance.lazyPercentage >= 25) score += 5;

  // Sémantique (10 points)
  if (ux.semantics.total >= 5) score += 10;
  else if (ux.semantics.total >= 3) score += 7;
  else if (ux.semantics.total >= 1) score += 3;

  return Math.min(score, 100);
}

/* ========================================
   GÉNÉRATION DES RECOMMANDATIONS
   ======================================== */

/**
 * Base de connaissances complète pour les recommandations enrichies
 */
const RECOMMENDATIONS_KNOWLEDGE_BASE = {
  seo: {
    title: {
      missing: {
        explanation: "La balise <title> est le facteur SEO le plus important de votre page. Elle apparaît comme titre cliquable dans les résultats de recherche Google et influence directement le taux de clic (CTR). Sans titre, votre page est invisible pour les moteurs de recherche et les utilisateurs ne peuvent pas comprendre le contenu de votre page dans les SERPs.",
        tips: [
          "Placez vos mots-clés principaux au début du titre pour maximiser leur poids SEO",
          "Incluez votre nom de marque à la fin, séparé par un pipe (|) ou un tiret (-)",
          "Créez un titre unique pour chaque page de votre site - jamais de duplication",
          "Rendez le titre accrocheur et incitatif pour encourager le clic des internautes",
          "Testez différentes formulations avec des A/B tests pour optimiser votre CTR"
        ],
        bestPractices: "Longueur optimale: 50-60 caractères (environ 600 pixels). Format recommandé: 'Mot-clé Principal - Bénéfice | Marque'",
        impact: "Un titre optimisé peut améliorer votre CTR de 20-30% et augmenter votre positionnement dans les résultats de recherche. Les pages sans titre perdent en moyenne 90% de leur trafic potentiel.",
        resources: [
          "Google Search Central - Title Link Best Practices",
          "Moz - Title Tag SEO Best Practices",
          "Ahrefs - How to Craft the Perfect SEO Title Tag"
        ]
      },
      tooShort: {
        explanation: "Un titre trop court (moins de 30 caractères) n'exploite pas tout le potentiel de visibilité dans les résultats de recherche. Vous perdez l'opportunité d'inclure des mots-clés secondaires et des éléments différenciants qui peuvent améliorer votre CTR et votre pertinence SEO.",
        tips: [
          "Ajoutez des qualificatifs pertinents: 'Guide Complet', 'Tutoriel 2026', 'Gratuit', 'Professionnel'",
          "Incluez votre proposition de valeur unique (UVP) pour vous démarquer de la concurrence",
          "Ajoutez l'année en cours pour montrer que le contenu est à jour",
          "Intégrez des mots-clés de longue traîne naturellement dans le titre",
          "Pensez à inclure votre localisation si vous ciblez un marché local"
        ],
        bestPractices: "Visez une longueur de 50-60 caractères pour maximiser la visibilité sans être tronqué dans les SERPs",
        impact: "Les titres optimisés (50-60 caractères) obtiennent un CTR 36% supérieur aux titres trop courts. Vous perdez environ 40% de l'espace disponible dans les résultats Google.",
        resources: [
          "Backlinko - SEO Title Tags Study (11.8M Results)",
          "Search Engine Journal - Title Tag Length & CTR Impact"
        ]
      },
      tooLong: {
        explanation: "Un titre dépassant 60 caractères (environ 600 pixels) sera tronqué par Google avec des points de suspension (...). Les mots-clés placés après la troncature perdent leur visibilité et leur impact SEO. De plus, un titre tronqué peut paraître non professionnel et réduire significativement votre taux de clic.",
        tips: [
          "Placez les informations les plus importantes et vos mots-clés principaux au début du titre",
          "Supprimez les mots superflus: articles, conjonctions, prépositions non essentielles",
          "Utilisez des abréviations reconnues quand c'est pertinent (SEO, UX, ROI, B2B)",
          "Remplacez les phrases longues par des formulations concises et percutantes",
          "Testez votre titre avec un simulateur de SERP pour voir le rendu réel avant publication"
        ],
        bestPractices: "Limite stricte: 60 caractères ou 600 pixels. Utilisez un outil de prévisualisation SERP pour vérifier le rendu réel dans Google",
        impact: "Les titres tronqués subissent une baisse de CTR de 15-25%. Chaque caractère au-delà de 60 dilue la puissance SEO de vos mots-clés principaux et réduit la lisibilité.",
        resources: [
          "Moz - SERP Preview Tool",
          "Yoast - Why Title Length Matters for SEO"
        ]
      }
    },
    metaDescription: {
      missing: {
        explanation: "La meta description est votre argumentaire de vente dans les résultats Google. Sans elle, Google génère automatiquement un extrait aléatoire de votre contenu, souvent peu engageant et hors contexte. Vous perdez le contrôle sur le message qui incite les utilisateurs à cliquer sur votre lien plutôt que ceux de vos concurrents.",
        tips: [
          "Rédigez une description unique de 150-160 caractères qui résume la valeur de votre page",
          "Incluez un appel à l'action clair: 'Découvrez', 'Téléchargez', 'Commandez maintenant'",
          "Intégrez naturellement vos mots-clés principaux (ils seront mis en gras dans les SERPs)",
          "Mettez en avant votre avantage concurrentiel ou votre proposition de valeur unique",
          "Utilisez des chiffres, dates ou données pour renforcer la crédibilité et l'urgence"
        ],
        bestPractices: "Longueur optimale: 150-160 caractères. Format: Proposition de valeur + Bénéfice + Appel à l'action",
        impact: "Une meta description optimisée peut augmenter votre CTR de 5-15%. Sans description, vous laissez Google décider de votre message marketing dans 100% des cas, avec un CTR moyen inférieur de 40%.",
        resources: [
          "Google Search Central - Meta Description Guidelines",
          "Backlinko - Meta Description Best Practices",
          "SEMrush - How to Write Meta Descriptions That Drive Clicks"
        ]
      }
    },
    h1: {
      missing: {
        explanation: "La balise H1 est le titre principal de votre contenu et un signal SEO fondamental pour indiquer le sujet de votre page aux moteurs de recherche. L'absence de H1 crée une confusion pour Google sur le thème principal de votre page et nuit à votre capacité à vous positionner sur vos mots-clés cibles. C'est aussi un problème d'accessibilité majeur.",
        tips: [
          "Créez un H1 unique et descriptif qui reflète le contenu principal de la page",
          "Incluez votre mot-clé principal dans le H1 de manière naturelle et fluide",
          "Limitez-vous à UN SEUL H1 par page pour une hiérarchie claire et optimale",
          "Rendez votre H1 accrocheur pour captiver l'attention des visiteurs dès leur arrivée",
          "Assurez-vous que le H1 soit cohérent avec votre balise <title> mais pas identique",
          "Visez une longueur de 20-70 caractères pour un équilibre parfait entre SEO et UX"
        ],
        bestPractices: "Une seule balise H1 par page, contenant le mot-clé principal, entre 20-70 caractères, visible dès le chargement de la page",
        impact: "Les pages avec un H1 optimisé ont 53% plus de chances de se positionner dans le top 10 de Google. L'absence de H1 réduit votre score SEO de 15-20 points et augmente votre taux de rebond de 10-15%.",
        resources: [
          "W3C - HTML Heading Elements Specification",
          "Search Engine Land - H1 Tags & SEO Impact Study",
          "WebAIM - Heading Structure for Accessibility"
        ]
      }
    },
    images: {
      missingAlt: {
        explanation: "L'attribut alt sur les images est essentiel pour le SEO, l'accessibilité et l'expérience utilisateur. Il permet aux moteurs de recherche de comprendre le contenu visuel, aide les utilisateurs malvoyants avec les lecteurs d'écran, et affiche un texte de remplacement si l'image ne se charge pas. Sans attribut alt, vous perdez des opportunités de référencement dans Google Images et créez des barrières d'accessibilité.",
        tips: [
          "Décrivez précisément le contenu de l'image en 10-15 mots maximum",
          "Incluez vos mots-clés naturellement SEULEMENT si pertinent pour l'image",
          "Évitez les formules génériques comme 'image de' ou 'photo de'",
          "Pour les images décoratives, utilisez alt='' (vide) pour que les lecteurs d'écran les ignorent",
          "Soyez spécifique: 'Golden retriever jouant dans un parc' plutôt que 'chien'",
          "N'utilisez jamais de texte alt pour du keyword stuffing - Google pénalise cette pratique"
        ],
        bestPractices: "Texte alt descriptif de 10-15 mots, pertinent et naturel. Images décoratives: alt vide. Images informatives: description précise avec contexte.",
        impact: "Les images avec attribut alt optimisé ont 42% plus de chances d'apparaître dans Google Images. L'absence d'alt nuit à votre conformité WCAG 2.1 niveau A et peut entraîner des pénalités légales dans certains pays. Vous perdez 15-25% du trafic potentiel via Google Images.",
        resources: [
          "Google Image SEO Best Practices",
          "W3C - Alt Text Requirements (WCAG 2.1)",
          "Moz - Image Alt Text Guide"
        ]
      }
    },
    openGraph: {
      incomplete: {
        explanation: "Les balises Open Graph contrôlent l'apparence de vos liens partagés sur les réseaux sociaux (Facebook, LinkedIn, Twitter/X). Sans elles, les plateformes choisissent aléatoirement le titre, l'image et la description, créant souvent des aperçus peu attractifs qui réduisent drastiquement votre taux d'engagement social et votre portée virale.",
        tips: [
          "Ajoutez minimum og:title, og:description, og:image et og:url dans votre <head>",
          "Utilisez une image og:image de 1200x630 pixels (format recommandé par Facebook/LinkedIn)",
          "Créez un og:title accrocheur, différent de votre <title> SEO, optimisé pour le social",
          "Rédigez un og:description de 200 caractères maximum, émotionnel et engageant",
          "Ajoutez og:type pour spécifier le type de contenu (article, website, product...)",
          "Testez vos balises avec le Facebook Debugger et le Twitter Card Validator avant publication"
        ],
        bestPractices: "Minimum requis: og:title, og:description, og:image (1200x630px), og:url, og:type. Format image: JPG ou PNG, poids < 8MB",
        impact: "Les publications avec Open Graph optimisé obtiennent 40% plus d'engagement social et 200% plus de clics. Sans Open Graph, vous perdez 60-70% du trafic potentiel des réseaux sociaux et réduisez votre viralité organique.",
        resources: [
          "Open Graph Protocol - Official Documentation",
          "Facebook Sharing Debugger Tool",
          "Twitter Card Validator",
          "LinkedIn Post Inspector"
        ]
      }
    }
  },
  marketing: {
    ga4: {
      missing: {
        explanation: "Google Analytics 4 (GA4) est l'outil d'analyse web le plus puissant et gratuit du marché. Sans GA4, vous naviguez à l'aveugle: impossible de mesurer vos conversions, comprendre votre audience, optimiser vos campagnes marketing ou prendre des décisions data-driven. Vous perdez des données précieuses chaque jour sans pouvoir les récupérer.",
        tips: [
          "Créez un compte GA4 gratuit sur analytics.google.com et récupérez votre ID de mesure (G-XXXXXXXXXX)",
          "Installez le code de suivi GA4 dans le <head> de toutes vos pages avant les autres scripts",
          "Configurez les événements de conversion essentiels: achats, leads, inscriptions newsletter",
          "Activez les signaux Google pour l'attribution cross-device et le remarketing avancé",
          "Liez GA4 à Google Search Console pour croiser données SEO et comportement utilisateur",
          "Configurez Google Tag Manager (GTM) pour une gestion flexible et sans code de vos tags"
        ],
        bestPractices: "Installation via gtag.js ou Google Tag Manager. Configuration minimale: événements de conversion, exclusion IP interne, durée de session personnalisée",
        impact: "GA4 vous permet de mesurer ROI marketing, réduire coût d'acquisition client de 25-40%, augmenter taux de conversion de 15-30% grâce aux insights comportementaux. Sans analytics, vous perdez 100% de vos données et opportunités d'optimisation.",
        resources: [
          "Google Analytics 4 - Setup Guide Official",
          "GA4 Event Tracking Complete Tutorial",
          "Analytics Mania - GA4 Best Practices"
        ]
      }
    },
    gtm: {
      missing: {
        explanation: "Google Tag Manager (GTM) centralise la gestion de tous vos scripts marketing (GA4, Facebook Pixel, LinkedIn Insight, etc.) sans modifier le code de votre site. Sans GTM, chaque ajout ou modification de tag nécessite un développeur et un déploiement, ralentissant drastiquement votre agilité marketing et augmentant vos coûts techniques.",
        tips: [
          "Créez un compte GTM gratuit sur tagmanager.google.com et installez le conteneur dans votre <head>",
          "Migrez tous vos tags existants (GA4, pixels publicitaires) vers GTM pour une gestion centralisée",
          "Configurez un Data Layer pour transmettre des données structurées à vos tags",
          "Utilisez le mode Aperçu de GTM pour tester vos tags avant publication en production",
          "Créez des déclencheurs personnalisés pour tracker événements spécifiques: clics CTA, formulaires, scrolls",
          "Documentez vos tags et utilisez des conventions de nommage claires pour faciliter la maintenance"
        ],
        bestPractices: "Installation: code GTM dans <head> et <body>. Structure: dossiers par catégorie, naming convention strict, versioning des conteneurs, workspace par projet",
        impact: "GTM réduit le temps de déploiement des tags de 2 semaines à 10 minutes (99% plus rapide), diminue les coûts de développement de 60-80%, et améliore la performance du site en chargeant les scripts de manière asynchrone. ROI estimé: 500-1000% la première année.",
        resources: [
          "Google Tag Manager - Official Setup Guide",
          "Simo Ahava - GTM Best Practices Blog",
          "Analytics Mania - GTM Complete Course",
          "Google Tag Manager Fundamentals Course (Free)"
        ]
      }
    },
    cta: {
      missing: {
        explanation: "Les Call-to-Action (CTA) sont les éléments qui transforment vos visiteurs en clients. Sans CTA visibles et persuasifs, vos visiteurs ne savent pas quelle action effectuer et quittent votre site sans convertir. C'est comme avoir un vendeur muet dans votre boutique: vous générez du trafic mais zéro conversion.",
        tips: [
          "Utilisez des verbes d'action forts et spécifiques: 'Télécharger le Guide', 'Démarrer mon essai gratuit', 'Obtenir mon devis'",
          "Créez un contraste visuel fort: couleur vive (orange, vert, rouge) sur fond neutre",
          "Placez votre CTA principal au-dessus de la ligne de flottaison (visible sans scroll)",
          "Répétez vos CTA stratégiquement: après chaque section de bénéfices, en fin de page, dans la sidebar",
          "Ajoutez de l'urgence: 'Offre limitée', 'Plus que 3 places', 'Dernières 48h'",
          "Testez différentes formulations avec des A/B tests pour optimiser votre taux de conversion",
          "Utilisez des micro-copies rassurantes sous le CTA: 'Sans engagement', 'Annulation gratuite', 'Garantie 30 jours'"
        ],
        bestPractices: "Taille minimum: 44x44 pixels (tactile). Couleur: contraste minimum 4.5:1. Position: above the fold + fin de sections. Texte: 2-5 mots maximum, orienté bénéfice",
        impact: "Un CTA bien conçu peut augmenter votre taux de conversion de 80-200%. Les pages sans CTA clair ont un taux de conversion moyen inférieur de 90%. Chaque amélioration de 1% du taux de conversion peut générer 10-50k€ de revenus supplémentaires selon votre trafic.",
        resources: [
          "Unbounce - 50+ CTA Examples That Work",
          "VWO - CTA Best Practices Guide",
          "HubSpot - Ultimate Guide to Call-to-Action Buttons",
          "ConversionXL - CTA Button Color & Design Study"
        ]
      }
    },
    forms: {
      missing: {
        explanation: "Les formulaires sont le point de contact direct avec vos prospects et clients. Sans formulaire, vous ne pouvez pas capturer de leads, générer de ventes en ligne, ou construire votre liste email. C'est une barrière totale à la génération de revenus digitaux et à la croissance de votre base de données marketing.",
        tips: [
          "Limitez le nombre de champs au strict minimum: nom, email, message suffisent souvent",
          "Utilisez des placeholders et labels clairs pour guider l'utilisateur sans ambiguïté",
          "Ajoutez une validation en temps réel pour corriger les erreurs immédiatement",
          "Intégrez un système anti-spam (reCAPTCHA v3 invisible recommandé)",
          "Créez une page de remerciement ou popup de confirmation après soumission",
          "Connectez vos formulaires à votre CRM (HubSpot, Salesforce) ou email marketing (Mailchimp)",
          "Optimisez pour mobile: champs larges, bouton submit bien visible, pas de captcha complexe",
          "Ajoutez des éléments de réassurance: 'Vos données sont sécurisées', 'Aucun spam garanti'"
        ],
        bestPractices: "Nombre de champs optimal: 3-5 pour leads, 1-2 pour newsletter. Validation: temps réel + côté serveur. Mobile-first: champs full-width, auto-focus, clavier adapté au type de champ",
        impact: "Réduire un formulaire de 11 à 4 champs augmente le taux de conversion de 120%. Chaque champ supplémentaire réduit la conversion de 5-10%. Un formulaire optimisé peut générer 50-300 leads qualifiés par mois selon votre trafic.",
        resources: [
          "Formstack - Form Optimization Best Practices",
          "Typeform - Psychology of Form Design",
          "Unbounce - Form Design Best Practices Study",
          "Google - Web Form Best Practices (UX)"
        ]
      }
    }
  },
  ux: {
    viewport: {
      missing: {
        explanation: "La balise viewport est essentielle pour le responsive design et l'affichage correct sur mobile. Sans elle, votre site s'affiche comme sur desktop et force les utilisateurs à zoomer et scroller horizontalement, créant une expérience mobile désastreuse. Google pénalise les sites non-mobile-friendly dans son indexation mobile-first depuis 2019.",
        tips: [
          "Ajoutez immédiatement <meta name='viewport' content='width=device-width, initial-scale=1.0'> dans votre <head>",
          "Testez votre site sur plusieurs tailles d'écran avec Chrome DevTools (F12 > Toggle Device Toolbar)",
          "Assurez-vous que tous vos éléments sont responsive et s'adaptent à la largeur du viewport",
          "Évitez le contenu de largeur fixe qui dépasse la largeur de l'écran mobile",
          "N'utilisez jamais user-scalable=no car cela empêche l'accessibilité pour les malvoyants",
          "Validez avec Google Mobile-Friendly Test après ajout de la balise viewport"
        ],
        bestPractices: "Balise viewport obligatoire: <meta name='viewport' content='width=device-width, initial-scale=1.0'>. Ne jamais bloquer le zoom (user-scalable)",
        impact: "Sans viewport, vous perdez 60% de vos visiteurs mobiles (taux de rebond mobile 85%+). Google pénalise les sites non-mobile-friendly avec une perte de 50-70% de visibilité dans les recherches mobiles. 63% du trafic web mondial est mobile en 2026.",
        resources: [
          "MDN - Viewport Meta Tag Documentation",
          "Google - Mobile-Friendly Test Tool",
          "W3C - Responsive Web Design Basics"
        ]
      }
    },
    brokenLinks: {
      detected: {
        explanation: "Les liens brisés créent une expérience utilisateur frustrante, nuisent à votre crédibilité professionnelle, et sont pénalisés par Google dans son algorithme de ranking. Chaque lien 404 est une impasse pour vos visiteurs et les robots de Google, diluant votre autorité SEO et augmentant votre taux de rebond.",
        tips: [
          "Corrigez immédiatement tous les liens brisés détectés en les mettant à jour ou en les supprimant",
          "Utilisez un outil de crawl régulier (Screaming Frog, Ahrefs) pour détecter les liens cassés",
          "Créez des redirections 301 pour les pages supprimées vers des pages similaires pertinentes",
          "Vérifiez particulièrement les liens dans votre navigation principale et footer",
          "Testez les liens externes régulièrement car les sites tiers peuvent supprimer des pages",
          "Configurez Google Search Console pour être alerté des erreurs 404 critiques",
          "Créez une page 404 personnalisée avec liens utiles vers vos pages principales"
        ],
        bestPractices: "Audit trimestriel des liens. Redirections 301 pour pages supprimées. Page 404 personnalisée avec navigation claire. Monitoring Google Search Console actif",
        impact: "Chaque lien brisé augmente votre taux de rebond de 5-10% et réduit votre taux de conversion. Les sites avec plus de 10 liens cassés perdent 20-30% de leur autorité SEO. Google peut déclasser les sites avec trop d'erreurs 404.",
        resources: [
          "Google Search Console - Crawl Errors Report",
          "Screaming Frog - Broken Link Checker",
          "Ahrefs - Site Audit Tool"
        ]
      }
    },
    wordCount: {
      low: {
        explanation: "Le contenu est roi en SEO. Une page avec moins de 300 mots est considérée comme thin content (contenu pauvre) par Google et a très peu de chances de se positionner dans les résultats de recherche. Le manque de contenu signale un faible apport de valeur pour l'utilisateur et limite drastiquement votre capacité à intégrer naturellement vos mots-clés cibles.",
        tips: [
          "Visez minimum 600-800 mots pour les pages standards, 1500-2500 mots pour les articles de blog SEO",
          "Ajoutez des sections détaillant vos bénéfices, fonctionnalités, cas d'usage, témoignages clients",
          "Enrichissez avec des FAQ répondant aux questions fréquentes de votre audience",
          "Intégrez des études de cas, statistiques, exemples concrets pour apporter de la valeur",
          "Structurez votre contenu avec des H2/H3 clairs pour améliorer la lisibilité",
          "Privilégiez toujours la qualité à la quantité: contenu utile et engageant > bourrage de mots",
          "Analysez le contenu de vos concurrents bien positionnés pour identifier le niveau de détail requis"
        ],
        bestPractices: "Minimum: 300 mots (pages transactionnelles), 600-800 mots (pages catégories), 1500-2500 mots (articles SEO). Densité de mots-clés: 1-2%",
        impact: "Les pages de 1500-2000 mots obtiennent 68% plus de partages sociaux et se positionnent en moyenne 3 positions plus haut dans Google. Le passage de 300 à 1000 mots peut augmenter votre trafic organique de 50-150%.",
        resources: [
          "Backlinko - Ideal Blog Post Length Study",
          "SEMrush - Content Length vs Rankings Analysis",
          "HubSpot - How Long Should a Blog Post Be?"
        ]
      }
    },
    accessibility: {
      issues: {
        explanation: "L'accessibilité web garantit que votre site est utilisable par tous, incluant les 15% de la population mondiale en situation de handicap (visuel, auditif, moteur, cognitif). Au-delà de l'éthique et de la conformité légale (lois ADA, RGAA), l'accessibilité améliore l'expérience de TOUS vos utilisateurs et booste votre SEO car Google valorise les sites accessibles.",
        tips: [
          "Ajoutez des attributs alt descriptifs à toutes vos images pour les lecteurs d'écran",
          "Utilisez une hiérarchie de titres logique (H1 > H2 > H3) sans sauter de niveau",
          "Assurez un contraste minimum de 4.5:1 entre texte et arrière-plan (WCAG AA)",
          "Rendez votre site entièrement navigable au clavier (touches Tab, Entrée, Échap)",
          "Ajoutez des labels explicites à tous vos champs de formulaire (pas seulement placeholders)",
          "Utilisez des éléments HTML sémantiques (<nav>, <main>, <article>) plutôt que des <div>",
          "Testez avec WAVE, Lighthouse, ou axe DevTools pour identifier les problèmes d'accessibilité",
          "Évitez les CAPTCHAs complexes - utilisez reCAPTCHA v3 invisible"
        ],
        bestPractices: "Conformité WCAG 2.1 niveau AA minimum. Tests avec lecteur d'écran (NVDA gratuit). Navigation clavier complète. Contraste texte 4.5:1 minimum",
        impact: "Les sites accessibles ont un taux de conversion 20-40% supérieur. La conformité WCAG évite des poursuites légales (risque 500k-2M€). Google favorise les sites accessibles, potentiel gain SEO de 10-15 positions. Marché accessible = +15% d'audience potentielle.",
        resources: [
          "W3C - WCAG 2.1 Guidelines Official",
          "WebAIM - Accessibility Evaluation Tools",
          "Google Lighthouse - Accessibility Audit",
          "WAVE - Web Accessibility Evaluation Tool",
          "A11Y Project - Accessibility Checklist"
        ]
      }
    }
  }
};

/**
 * Génère les recommandations prioritaires ENRICHIES basées sur l'analyse
 */
function generateRecommendations(results) {
  const recommendations = [];
  const KB = RECOMMENDATIONS_KNOWLEDGE_BASE;

  // SEO: Title
  if (!results.seo.title.exists) {
    const knowledge = KB.seo.title.missing;
    recommendations.push({
      priority: 'Critique',
      category: 'SEO',
      title: 'Balise Title manquante',
      description: knowledge.explanation,
      impact: knowledge.impact,
      action: results.seo.title.recommendation,
      tips: knowledge.tips,
      bestPractices: knowledge.bestPractices,
      resources: knowledge.resources
    });
  } else if (!results.seo.title.isOptimal) {
    const knowledge = results.seo.title.length < 30 ? KB.seo.title.tooShort : KB.seo.title.tooLong;
    recommendations.push({
      priority: 'Important',
      category: 'SEO',
      title: 'Titre non optimal',
      description: knowledge.explanation,
      impact: knowledge.impact,
      action: results.seo.title.recommendation,
      tips: knowledge.tips,
      bestPractices: knowledge.bestPractices
    });
  }

  // SEO: Meta Description
  if (!results.seo.metaDescription.exists) {
    const knowledge = KB.seo.metaDescription.missing;
    recommendations.push({
      priority: 'Important',
      category: 'SEO',
      title: 'Meta Description manquante',
      description: knowledge.explanation,
      impact: knowledge.impact,
      action: results.seo.metaDescription.recommendation,
      tips: knowledge.tips,
      bestPractices: knowledge.bestPractices,
      resources: knowledge.resources
    });
  }

  // SEO: H1
  if (!results.seo.h1.isUnique) {
    const knowledge = KB.seo.h1.missing;
    recommendations.push({
      priority: results.seo.h1.count === 0 ? 'Critique' : 'Important',
      category: 'SEO',
      title: results.seo.h1.count === 0 ? 'H1 manquant' : 'Plusieurs H1 détectés',
      description: knowledge.explanation,
      impact: knowledge.impact,
      action: results.seo.h1.recommendation,
      tips: knowledge.tips,
      bestPractices: knowledge.bestPractices
    });
  }

  // SEO: Images
  if (results.seo.images.withoutAlt > 0) {
    const knowledge = KB.seo.images.missingAlt;
    recommendations.push({
      priority: 'Moyen',
      category: 'SEO & Accessibilité',
      title: `${results.seo.images.withoutAlt} image(s) sans attribut ALT`,
      description: knowledge.explanation,
      impact: knowledge.impact,
      action: results.seo.images.recommendation,
      tips: knowledge.tips,
      bestPractices: knowledge.bestPractices
    });
  }

  // SEO: Open Graph
  if (!results.seo.openGraph.complete) {
    const knowledge = KB.seo.openGraph.incomplete;
    recommendations.push({
      priority: 'Moyen',
      category: 'Marketing',
      title: 'Open Graph incomplet',
      description: knowledge.explanation,
      impact: knowledge.impact,
      action: results.seo.openGraph.recommendation,
      tips: knowledge.tips,
      bestPractices: knowledge.bestPractices,
      resources: knowledge.resources
    });
  }

  // Marketing: GA4
  if (!results.marketing.ga4.detected) {
    const knowledge = KB.marketing.ga4.missing;
    recommendations.push({
      priority: 'Important',
      category: 'Marketing',
      title: 'Google Analytics 4 non détecté',
      description: knowledge.explanation,
      impact: knowledge.impact,
      action: results.marketing.ga4.recommendation,
      tips: knowledge.tips,
      bestPractices: knowledge.bestPractices,
      resources: knowledge.resources
    });
  }

  // Marketing: GTM
  if (!results.marketing.gtm.detected) {
    const knowledge = KB.marketing.gtm.missing;
    recommendations.push({
      priority: 'Moyen',
      category: 'Marketing',
      title: 'Google Tag Manager non installé',
      description: knowledge.explanation,
      impact: knowledge.impact,
      action: results.marketing.gtm.recommendation,
      tips: knowledge.tips,
      bestPractices: knowledge.bestPractices,
      resources: knowledge.resources
    });
  }

  // Marketing: CTA
  if (results.marketing.cta.count < 2) {
    const knowledge = KB.marketing.cta.missing;
    recommendations.push({
      priority: 'Important',
      category: 'Conversion',
      title: results.marketing.cta.count === 0 ? 'Aucun CTA détecté' : 'Pas assez de CTA',
      description: knowledge.explanation,
      impact: knowledge.impact,
      action: results.marketing.cta.recommendation,
      tips: knowledge.tips,
      bestPractices: knowledge.bestPractices
    });
  }

  // Marketing: Forms
  if (results.marketing.forms.count === 0) {
    const knowledge = KB.marketing.forms.missing;
    recommendations.push({
      priority: 'Important',
      category: 'Conversion',
      title: 'Aucun formulaire de conversion',
      description: knowledge.explanation,
      impact: knowledge.impact,
      action: results.marketing.forms.recommendation,
      tips: knowledge.tips,
      bestPractices: knowledge.bestPractices,
      ...(knowledge.tools && { tools: knowledge.tools })
    });
  }

  // UX: Viewport
  if (!results.ux.viewport.exists) {
    const knowledge = KB.ux.viewport.missing;
    recommendations.push({
      priority: 'Critique',
      category: 'UX & Mobile',
      title: 'Viewport mobile manquant',
      description: knowledge.explanation,
      impact: knowledge.impact,
      action: results.ux.viewport.recommendation,
      tips: knowledge.tips,
      bestPractices: knowledge.bestPractices
    });
  }

  // UX: Broken Links
  if (results.ux.links.broken > 0) {
    const knowledge = KB.ux.brokenLinks.detected;
    recommendations.push({
      priority: 'Important',
      category: 'UX & SEO',
      title: `${results.ux.links.broken} lien(s) cassé(s)`,
      description: knowledge.explanation,
      impact: knowledge.impact,
      action: results.ux.links.recommendation,
      tips: knowledge.tips,
      bestPractices: knowledge.bestPractices
    });
  }

  // UX: Word Count
  if (results.ux.wordCount < 300) {
    const knowledge = KB.ux.wordCount.low;
    recommendations.push({
      priority: 'Moyen',
      category: 'SEO & Contenu',
      title: 'Contenu insuffisant',
      description: knowledge.explanation,
      impact: knowledge.impact,
      action: results.ux.wordRecommendation,
      tips: knowledge.tips,
      bestPractices: knowledge.bestPractices
    });
  }

  // UX: Accessibility
  if (results.ux.accessibility.issues.length > 0) {
    const knowledge = KB.ux.accessibility.issues;
    recommendations.push({
      priority: 'Moyen',
      category: 'Accessibilité',
      title: `${results.ux.accessibility.issues.length} problème(s) d'accessibilité`,
      description: knowledge.explanation,
      impact: knowledge.impact,
      action: results.ux.accessibility.recommendation,
      tips: knowledge.tips,
      bestPractices: knowledge.bestPractices,
      ...(knowledge.tools && { tools: knowledge.tools }),
      ...(knowledge.legalNote && { legalNote: knowledge.legalNote })
    });
  }

  // Trier par priorité (Critique > Important > Moyen)
  const priorityOrder = { 'Critique': 0, 'Important': 1, 'Moyen': 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations.slice(0, 10); // Top 10 recommandations
}

/* ========================================
   DÉTECTIONS TECHNIQUES AVANCÉES
   ======================================== */

/**
 * Détecte le CMS utilisé
 */
function detectCMS() {
  const cms = {
    name: 'Aucun',
    detected: false,
    version: '',
    theme: '',
    confidence: 0
  };

  // WordPress
  const wpGenerator = document.querySelector('meta[name="generator"][content*="WordPress"]');
  const wpContent = document.querySelector('link[href*="wp-content"]');
  const wpIncludes = document.querySelector('script[src*="wp-includes"]');
  const wpJson = document.querySelector('link[rel="https://api.w.org/"]');

  if (wpGenerator || wpContent || wpIncludes || wpJson) {
    cms.name = 'WordPress';
    cms.detected = true;
    cms.confidence = 95;

    // Version
    if (wpGenerator) {
      const match = wpGenerator.getAttribute('content').match(/WordPress (\d+\.\d+\.?\d*)/);
      if (match) cms.version = match[1];
    }

    // Thème
    const themeLinks = document.querySelectorAll('link[href*="/themes/"]');
    if (themeLinks.length > 0) {
      const themeMatch = themeLinks[0].href.match(/\/themes\/([^\/]+)/);
      if (themeMatch) cms.theme = themeMatch[1];
    }
  }

  // Shopify
  const shopifyScript = document.querySelector('script[src*="cdn.shopify.com"]');
  const shopifyMeta = document.querySelector('meta[content*="Shopify"]');
  if (shopifyScript || shopifyMeta) {
    cms.name = 'Shopify';
    cms.detected = true;
    cms.confidence = 95;
  }

  // Wix
  const wixScript = document.querySelector('script[src*="static.parastorage.com"]');
  const wixMeta = document.querySelector('meta[name="generator"][content*="Wix"]');
  if (wixScript || wixMeta) {
    cms.name = 'Wix';
    cms.detected = true;
    cms.confidence = 95;
  }

  // Squarespace
  const squarespaceMeta = document.querySelector('meta[name="generator"][content*="Squarespace"]');
  if (squarespaceMeta) {
    cms.name = 'Squarespace';
    cms.detected = true;
    cms.confidence = 95;
  }

  // Drupal
  const drupalMeta = document.querySelector('meta[name="Generator"][content*="Drupal"]');
  const drupalScript = document.querySelector('script[src*="/sites/all/"]');
  if (drupalMeta || drupalScript) {
    cms.name = 'Drupal';
    cms.detected = true;
    cms.confidence = 90;
  }

  // Joomla
  const joomlaMeta = document.querySelector('meta[name="generator"][content*="Joomla"]');
  const joomlaScript = document.querySelector('script[src*="/media/jui/"]');
  if (joomlaMeta || joomlaScript) {
    cms.name = 'Joomla';
    cms.detected = true;
    cms.confidence = 90;
  }

  // Magento
  const magentoScript = document.querySelector('script[src*="static/_requirejs/"]');
  const magentoMeta = document.querySelector('meta[name="generator"][content*="Magento"]');
  if (magentoScript || magentoMeta) {
    cms.name = 'Magento';
    cms.detected = true;
    cms.confidence = 90;
  }

  // PrestaShop
  const prestaScript = document.querySelector('script[src*="/modules/"]');
  const prestaMeta = document.querySelector('meta[name="generator"][content*="PrestaShop"]');
  if (prestaMeta || (prestaScript && window.prestashop)) {
    cms.name = 'PrestaShop';
    cms.detected = true;
    cms.confidence = 85;
  }

  return cms;
}

/**
 * Détecte les systèmes de cache et CDN
 */
function detectCache() {
  const cache = {
    detected: [],
    cdn: [],
    details: {},
    confidence: {},
    score: 0
  };

  // Récupérer tout le HTML y compris commentaires HTML
  // Utiliser documentElement.outerHTML + head.innerHTML pour capturer TOUS les commentaires
  const htmlContent = document.documentElement.outerHTML;
  const headContent = document.head ? document.head.innerHTML : '';
  const bodyContent = document.body ? document.body.innerHTML : '';
  const fullContent = htmlContent + headContent + bodyContent;

  // Logs pour debug
  console.log('🔍 Détection cache - Recherche dans le HTML complet');

  // === CACHE WORDPRESS ===

  // LiteSpeed Cache - Détection ULTRA-ROBUSTE AMÉLIORÉE
  const lsCacheAttr = document.documentElement.getAttribute('data-lscache-rand');
  const lsCacheInHTML = fullContent.includes('LiteSpeed Cache') ||
                        fullContent.includes('lscache') ||
                        fullContent.includes('Page optimized by LiteSpeed') ||
                        fullContent.includes('Page cached by LiteSpeed') ||
                        fullContent.includes('QUIC.cloud');
  const lsCacheDOM = document.querySelector('link[href*="lscache"]') ||
                     document.querySelector('script[src*="lscache"]');

  const lsCache = lsCacheAttr || lsCacheInHTML || lsCacheDOM;

  if (lsCache) {
    console.log('✅ LiteSpeed Cache DÉTECTÉ!', {
      viaAttribute: !!lsCacheAttr,
      viaHTML: !!lsCacheInHTML,
      viaDOM: !!lsCacheDOM
    });
  } else {
    console.log('⚠️ LiteSpeed Cache NON détecté');
  }
  if (lsCache) {
    cache.detected.push('LiteSpeed Cache');
    cache.details.litespeed = 'Cache serveur haute performance + QUIC.cloud CDN';
    cache.confidence.litespeed = document.documentElement.getAttribute('data-lscache-rand') ? 100 : 95;
  }

  // WP Rocket
  const wpRocket = document.querySelector('script[src*="wp-rocket"]') ||
                   document.documentElement.getAttribute('data-wpr-lazyload') ||
                   document.querySelector('[id*="rocket"]') ||
                   htmlContent.includes('WP Rocket');
  if (wpRocket) {
    cache.detected.push('WP Rocket');
    cache.details.wprocket = 'Plugin de cache WordPress premium';
    cache.confidence.wprocket = document.querySelector('script[src*="wp-rocket"]') ? 100 : 95;
  }

  // W3 Total Cache
  const w3tc = document.querySelector('link[href*="w3tc"]') ||
               document.querySelector('[id*="w3tc"]') ||
               htmlContent.includes('W3 Total Cache') ||
               htmlContent.includes('w3tc');
  if (w3tc) {
    cache.detected.push('W3 Total Cache');
    cache.details.w3tc = 'Plugin de cache WordPress';
    cache.confidence.w3tc = document.querySelector('[id*="w3tc"]') ? 100 : 90;
  }

  // WP Super Cache
  const wpSuperCache = document.querySelector('meta[name="generator"][content*="WP Super Cache"]') ||
                       htmlContent.includes('WP Super Cache') ||
                       htmlContent.includes('wp-super-cache');
  if (wpSuperCache) {
    cache.detected.push('WP Super Cache');
    cache.details.wpsupercache = 'Plugin de cache WordPress';
    cache.confidence.wpsupercache = document.querySelector('meta[name="generator"][content*="WP Super Cache"]') ? 100 : 85;
  }

  // Autoptimize
  const autoptimize = document.querySelector('link[href*="autoptimize"]') ||
                      document.querySelector('script[src*="autoptimize"]') ||
                      htmlContent.includes('Autoptimize');
  if (autoptimize) {
    cache.detected.push('Autoptimize');
    cache.details.autoptimize = 'Optimisation et minification WordPress';
    cache.confidence.autoptimize = document.querySelector('script[src*="autoptimize"]') ? 100 : 90;
  }

  // Redis Cache
  const redis = htmlContent.includes('Redis Object Cache') ||
                htmlContent.includes('redis-cache') ||
                document.querySelector('script[src*="redis"]');
  if (redis) {
    cache.detected.push('Redis Cache');
    cache.details.redis = 'Système de cache en mémoire haute performance';
    cache.confidence.redis = htmlContent.includes('Redis Object Cache') ? 95 : 80;
  }

  // Nginx FastCGI Cache
  const nginxFastCGI = document.querySelector('meta[name="cache-control"][content*="nginx"]') ||
                       htmlContent.includes('nginx-cache') ||
                       htmlContent.includes('fastcgi_cache');
  if (nginxFastCGI) {
    cache.detected.push('Nginx FastCGI Cache');
    cache.details.nginxfastcgi = 'Cache serveur Nginx FastCGI';
    cache.confidence.nginxfastcgi = 85;
  }

  // === CDN ===

  // Cloudflare
  const cfRay = document.querySelector('meta[name="cf-ray"]') ||
                performance.getEntriesByType('navigation')[0]?.serverTiming?.find(t => t.name === 'cfRequestDuration') ||
                (typeof window.cloudflare !== 'undefined') ||
                document.querySelector('script[src*="cdnjs.cloudflare.com"]');
  if (cfRay) {
    cache.cdn.push('Cloudflare');
    cache.details.cloudflare = 'CDN, WAF & DDoS protection';
    cache.confidence.cloudflare = document.querySelector('meta[name="cf-ray"]') ? 100 : 95;
  }

  // Fastly
  const fastlyScript = document.querySelector('script[src*="fastly.com"]') ||
                       performance.getEntriesByType('navigation')[0]?.serverTiming?.find(t => t.name.includes('fastly'));
  if (fastlyScript) {
    cache.cdn.push('Fastly');
    cache.details.fastly = 'CDN edge cloud haute performance';
    cache.confidence.fastly = 95;
  }

  // Akamai
  const akamai = document.querySelector('script[src*="akamai"]') ||
                 document.querySelector('link[href*="akamai"]') ||
                 Array.from(document.querySelectorAll('script, link, img')).some(el =>
                   (el.src || el.href || '').includes('akamai'));
  if (akamai) {
    cache.cdn.push('Akamai');
    cache.details.akamai = 'CDN entreprise leader mondial';
    cache.confidence.akamai = 100;
  }

  // KeyCDN
  const keycdn = Array.from(document.querySelectorAll('link, script, img')).some(el =>
    (el.href || el.src || '').includes('keycdn.com'));
  if (keycdn) {
    cache.cdn.push('KeyCDN');
    cache.details.keycdn = 'CDN haute performance';
    cache.confidence.keycdn = 100;
  }

  // Amazon CloudFront
  const cloudfront = Array.from(document.querySelectorAll('link, script, img')).some(el =>
    (el.href || el.src || '').includes('cloudfront.net'));
  if (cloudfront) {
    cache.cdn.push('Amazon CloudFront');
    cache.details.cloudfront = 'CDN Amazon Web Services';
    cache.confidence.cloudfront = 100;
  }

  // Bunny CDN
  const bunnycdn = Array.from(document.querySelectorAll('link, script, img')).some(el =>
    (el.href || el.src || '').includes('bunnycdn.com'));
  if (bunnycdn) {
    cache.cdn.push('Bunny CDN');
    cache.details.bunnycdn = 'CDN économique et rapide';
    cache.confidence.bunnycdn = 100;
  }

  // Service Worker (PWA Cache)
  try {
    if ('serviceWorker' in navigator) {
      // Vérification synchrone de la présence d'un service worker
      navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length > 0) {
          cache.detected.push('Service Worker');
          cache.details.serviceworker = 'PWA cache côté client';
          cache.confidence.serviceworker = 100;
        }
      }).catch(() => {});
    }
  } catch (e) {
    // Silent fail
  }

  // === AUTRE ===

  // Varnish
  const varnish = document.querySelector('meta[http-equiv="x-varnish"]') ||
                  htmlContent.includes('X-Varnish') ||
                  htmlContent.includes('varnish-cache');
  if (varnish) {
    cache.detected.push('Varnish');
    cache.details.varnish = 'Reverse proxy cache haute performance';
    cache.confidence.varnish = document.querySelector('meta[http-equiv="x-varnish"]') ? 100 : 90;
  }

  // Calculer le score global
  cache.score = calculateCacheScore(cache);

  return cache;
}

/**
 * Calcule un score de performance du cache (0-100)
 */
function calculateCacheScore(cache) {
  let score = 0;

  // CDN présent (+40 points)
  if (cache.cdn.length > 0) {
    score += 40;
  }

  // Système de cache présent (+40 points)
  if (cache.detected.length > 0) {
    score += 40;
  }

  // Redondance (plusieurs systèmes) (+10 points)
  if (cache.cdn.length + cache.detected.length >= 3) {
    score += 10;
  }

  // Cloudflare bonus (très performant) (+10 points)
  if (cache.cdn.includes('Cloudflare')) {
    score += 10;
  }

  return Math.min(score, 100);
}

/**
 * Détecte les technologies front-end
 */
function detectTechnologies() {
  const tech = {
    frameworks: [],
    libraries: [],
    analytics: [],
    fonts: [],
    optimization: []
  };

  // Frameworks JS
  if (typeof React !== 'undefined' || document.querySelector('[data-reactroot], [data-reactid]')) {
    tech.frameworks.push('React');
  }
  if (typeof Vue !== 'undefined' || document.querySelector('[data-v-]')) {
    tech.frameworks.push('Vue.js');
  }
  if (typeof angular !== 'undefined' || document.querySelector('[ng-app], [ng-controller]')) {
    tech.frameworks.push('Angular');
  }
  if (window.__NEXT_DATA__) {
    tech.frameworks.push('Next.js');
  }
  if (window.___gatsby) {
    tech.frameworks.push('Gatsby');
  }

  // Bibliothèques
  if (typeof jQuery !== 'undefined' || typeof $ !== 'undefined') {
    tech.libraries.push(`jQuery ${typeof jQuery !== 'undefined' ? jQuery.fn.jquery : ''}`);
  }
  if (typeof Swiper !== 'undefined') {
    tech.libraries.push('Swiper');
  }
  if (typeof AOS !== 'undefined') {
    tech.libraries.push('AOS (Animate On Scroll)');
  }

  // Google Fonts
  if (document.querySelector('link[href*="fonts.googleapis.com"]')) {
    tech.fonts.push('Google Fonts');
  }

  // Font Awesome
  if (document.querySelector('link[href*="font-awesome"]') || document.querySelector('i[class*="fa-"]')) {
    tech.fonts.push('Font Awesome');
  }

  // Optimisation d'images
  if (document.querySelector('img[src*="shortpixel"]') || document.querySelector('[data-spai]')) {
    tech.optimization.push('ShortPixel');
  }
  if (document.querySelector('img[loading="lazy"]').length > 0) {
    tech.optimization.push('Native Lazy Loading');
  }
  if (document.querySelector('picture source[type="image/webp"]')) {
    tech.optimization.push('WebP');
  }

  return tech;
}

/**
 * Mesure les Core Web Vitals via Performance API
 */
function measureCoreWebVitals() {
  const vitals = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    available: false
  };

  try {
    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      vitals.lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // FCP (First Contentful Paint) via PerformancePaintTiming
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      vitals.fcp = Math.round(fcpEntry.startTime);
    }

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      vitals.cls = Math.round(clsValue * 1000) / 1000;
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // TTFB (Time to First Byte)
    const navTiming = performance.getEntriesByType('navigation')[0];
    if (navTiming) {
      vitals.ttfb = Math.round(navTiming.responseStart - navTiming.requestStart);
    }

    vitals.available = true;

    // Arrêter les observers après 3 secondes
    setTimeout(() => {
      lcpObserver.disconnect();
      clsObserver.disconnect();
    }, 3000);

  } catch (e) {
    console.log('Core Web Vitals non disponibles:', e);
  }

  return vitals;
}

console.log('✅ Content script professionnel chargé et prêt à analyser');
