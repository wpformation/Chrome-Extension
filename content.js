/**
 * CONTENT.JS - Moteur d'Analyse Professionnel
 * Extension Chrome Audit Expert - Analyse SEO, Marketing & UX
 * Version Professionnelle avec recommandations détaillées
 */

// Écoute des messages provenant de la popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzePage') {
    const results = performCompleteAudit();
    sendResponse(results);
  }
  return true;
});

/**
 * Fonction principale d'audit qui orchestre toutes les analyses
 * @returns {Object} Résultats complets de l'audit avec recommandations
 */
function performCompleteAudit() {
  console.log('🚀 Démarrage de l\'analyse professionnelle ultra-complète...');

  const results = {
    url: window.location.href,
    timestamp: new Date().toISOString(),
    seo: analyzeSEO(),
    marketing: analyzeMarketing(),
    ux: analyzeUX(),

    // NOUVELLES ANALYSES TECHNIQUES
    cms: detectCMS(),
    cache: detectCache(),
    technologies: detectTechnologies(),
    coreWebVitals: measureCoreWebVitals(),

    recommendations: [] // Recommandations prioritaires
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

  console.log('✅ Analyse ultra-complète terminée:', results);
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
    recommendation = `Seulement ${count} CTA détecté. Ajoutez plus de points de conversion stratégiques sur votre page.';
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
 * Génère les recommandations prioritaires basées sur l'analyse
 */
function generateRecommendations(results) {
  const recommendations = [];

  // Recommandations SEO critiques
  if (!results.seo.title.exists) {
    recommendations.push({
      priority: 'Critique',
      category: 'SEO',
      title: 'Balise Title manquante',
      description: 'Ajoutez immédiatement une balise <title> unique et descriptive (50-60 caractères).',
      impact: 'Le titre est le facteur SEO le plus important et apparaît dans les résultats Google.',
      action: 'Ajoutez <title>Votre Titre Optimisé | Nom du Site</title> dans le <head>.'
    });
  } else if (!results.seo.title.isOptimal) {
    recommendations.push({
      priority: 'Important',
      category: 'SEO',
      title: 'Titre non optimal',
      description: results.seo.title.recommendation,
      impact: 'Un titre optimisé améliore votre CTR dans les résultats de recherche.',
      action: 'Ajustez votre titre entre 50-60 caractères avec vos mots-clés principaux.'
    });
  }

  if (!results.seo.metaDescription.exists) {
    recommendations.push({
      priority: 'Important',
      category: 'SEO',
      title: 'Meta Description manquante',
      description: 'Ajoutez une meta description convaincante de 140-160 caractères.',
      impact: 'Influence directement votre taux de clic (CTR) dans les résultats Google.',
      action: 'Ajoutez <meta name="description" content="Votre description optimisée...">'
    });
  }

  if (!results.seo.h1.isUnique) {
    recommendations.push({
      priority: results.seo.h1.count === 0 ? 'Critique' : 'Important',
      category: 'SEO',
      title: results.seo.h1.count === 0 ? 'H1 manquant' : 'Plusieurs H1 détectés',
      description: results.seo.h1.recommendation,
      impact: 'Le H1 structure votre contenu et renforce votre mot-clé principal.',
      action: 'Gardez un seul H1 unique et descriptif par page.'
    });
  }

  if (results.seo.images.withoutAlt > 0) {
    recommendations.push({
      priority: 'Moyen',
      category: 'SEO & Accessibilité',
      title: `${results.seo.images.withoutAlt} image(s) sans attribut ALT`,
      description: results.seo.images.recommendation,
      impact: 'Améliore le référencement image et l\'accessibilité pour les malvoyants.',
      action: 'Ajoutez alt="description précise" sur chaque image.'
    });
  }

  if (!results.seo.openGraph.complete) {
    recommendations.push({
      priority: 'Moyen',
      category: 'Marketing',
      title: 'Open Graph incomplet',
      description: results.seo.openGraph.recommendation,
      impact: 'Contrôle l\'apparence de vos partages sur Facebook, LinkedIn, Twitter.',
      action: 'Ajoutez og:title, og:description, og:image et og:url dans le <head>.'
    });
  }

  // Recommandations Marketing
  if (!results.marketing.ga4.detected) {
    recommendations.push({
      priority: 'Important',
      category: 'Marketing',
      title: 'Google Analytics 4 non détecté',
      description: results.marketing.ga4.recommendation,
      impact: 'Impossible de mesurer votre trafic et comprendre vos visiteurs.',
      action: 'Installez GA4 via Google Tag Manager ou en direct avec gtag.js.'
    });
  }

  if (!results.marketing.gtm.detected) {
    recommendations.push({
      priority: 'Moyen',
      category: 'Marketing',
      title: 'Google Tag Manager non installé',
      description: results.marketing.gtm.recommendation,
      impact: 'Simplifiez la gestion de tous vos pixels marketing sans toucher au code.',
      action: 'Créez un compte GTM et installez le conteneur sur votre site.'
    });
  }

  if (results.marketing.cta.count < 2) {
    recommendations.push({
      priority: 'Important',
      category: 'Conversion',
      title: results.marketing.cta.count === 0 ? 'Aucun CTA détecté' : 'Pas assez de CTA',
      description: results.marketing.cta.recommendation,
      impact: 'Les CTA sont essentiels pour convertir vos visiteurs en leads ou clients.',
      action: 'Ajoutez au moins 2-3 CTA clairs et visibles (contact, devis, essai, téléchargement).'
    });
  }

  if (results.marketing.forms.count === 0) {
    recommendations.push({
      priority: 'Important',
      category: 'Conversion',
      title: 'Aucun formulaire de conversion',
      description: results.marketing.forms.recommendation,
      impact: 'Sans formulaire, impossible de capturer des leads.',
      action: 'Ajoutez un formulaire de contact, devis ou inscription newsletter.'
    });
  }

  // Recommandations UX
  if (!results.ux.viewport.exists) {
    recommendations.push({
      priority: 'Critique',
      category: 'UX & Mobile',
      title: 'Viewport mobile manquant',
      description: results.ux.viewport.recommendation,
      impact: 'Votre site ne sera pas responsive sur mobile (plus de 60% du trafic web).',
      action: 'Ajoutez <meta name="viewport" content="width=device-width, initial-scale=1.0">'
    });
  }

  if (results.ux.links.broken > 0) {
    recommendations.push({
      priority: 'Important',
      category: 'UX & SEO',
      title: `${results.ux.links.broken} lien(s) cassé(s)`,
      description: results.ux.links.recommendation,
      impact: 'Les liens cassés nuisent à l\'expérience utilisateur et au SEO.',
      action: 'Corrigez ou supprimez tous les liens vides ou pointant vers "#".'
    });
  }

  if (results.ux.wordCount < 300) {
    recommendations.push({
      priority: 'Moyen',
      category: 'SEO & Contenu',
      title: 'Contenu insuffisant',
      description: results.ux.wordRecommendation,
      impact: 'Google favorise les pages avec du contenu riche et utile (300+ mots minimum).',
      action: 'Enrichissez votre contenu avec des informations pertinentes pour vos visiteurs.'
    });
  }

  if (results.ux.accessibility.issues.length > 0) {
    recommendations.push({
      priority: 'Moyen',
      category: 'Accessibilité',
      title: `${results.ux.accessibility.issues.length} problème(s) d'accessibilité`,
      description: results.ux.accessibility.recommendation,
      impact: 'L\'accessibilité améliore l\'UX pour tous et est une obligation légale dans certains cas.',
      action: 'Corrigez les problèmes identifiés (labels, lang, aria).'
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
    details: {}
  };

  // Cloudflare
  const cfRay = document.querySelector('meta[name="cf-ray"]') || performance.getEntriesByType('navigation')[0]?.serverTiming?.find(t => t.name === 'cfRequestDuration');
  if (cfRay || (typeof window.cloudflare !== 'undefined')) {
    cache.cdn.push('Cloudflare');
    cache.details.cloudflare = 'CDN & WAF détecté';
  }

  // LiteSpeed Cache (WordPress)
  if (document.documentElement.getAttribute('data-lscache-rand')) {
    cache.detected.push('LiteSpeed Cache');
    cache.details.litespeed = 'Cache serveur haute performance';
  }

  // WP Rocket
  if (document.querySelector('script[src*="wp-rocket"]') || document.documentElement.getAttribute('data-wpr-lazyload')) {
    cache.detected.push('WP Rocket');
    cache.details.wprocket = 'Plugin de cache WordPress premium';
  }

  // W3 Total Cache
  if (document.querySelector('link[href*="w3tc"]') || document.querySelector('[id*="w3tc"]')) {
    cache.detected.push('W3 Total Cache');
    cache.details.w3tc = 'Plugin de cache WordPress';
  }

  // WP Super Cache
  if (document.querySelector('meta[name="generator"][content*="WP Super Cache"]')) {
    cache.detected.push('WP Super Cache');
    cache.details.wpsupercache = 'Plugin de cache WordPress';
  }

  // Fastly
  const fastlyScript = document.querySelector('script[src*="fastly.com"]');
  const fastlyHeader = performance.getEntriesByType('navigation')[0]?.serverTiming?.find(t => t.name.includes('fastly'));
  if (fastlyScript || fastlyHeader) {
    cache.cdn.push('Fastly');
    cache.details.fastly = 'CDN edge cloud';
  }

  // Akamai
  const akamaiScript = document.querySelector('script[src*="akamai"]');
  if (akamaiScript) {
    cache.cdn.push('Akamai');
    cache.details.akamai = 'CDN entreprise';
  }

  // KeyCDN
  if (document.querySelector('link[href*="keycdn.com"]') || document.querySelector('script[src*="keycdn.com"]')) {
    cache.cdn.push('KeyCDN');
  }

  // Varnish (détection via headers si disponible)
  const hasVarnish = document.querySelector('meta[http-equiv="x-varnish"]');
  if (hasVarnish) {
    cache.detected.push('Varnish');
    cache.details.varnish = 'Reverse proxy cache';
  }

  return cache;
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
