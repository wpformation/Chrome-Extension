/**
 * ADVANCED-FEATURES.JS
 * Fonctionnalités avancées SEO & Marketing
 */

/* ========================================
   SEO AVANCÉ - ANALYSE SÉMANTIQUE
   ======================================== */

/**
 * Analyse sémantique et contenu de la page
 * @returns {Object} Résultats d'analyse sémantique
 */
function analyzeSemanticContent() {
  const semanticAnalysis = {
    wordCount: 0,
    topKeywords: [],
    keywordDensity: {},
    mainKeyword: '',
    readabilityScore: 0,
    textToHTMLRatio: 0,
    freshness: null,
    avgWordsPerSentence: 0,
    avgSentenceLength: 0
  };

  try {
    // Extraire tout le texte visible
    const bodyText = document.body.innerText || '';
    const htmlLength = document.documentElement.outerHTML.length;

    // Compter les mots
    const words = bodyText
      .toLowerCase()
      .replace(/[^\wÀ-ÿ\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3); // Mots de plus de 3 lettres

    semanticAnalysis.wordCount = words.length;

    // Calculer densité de mots-clés
    const wordFrequency = {};
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    // Mots vides français
    const stopWords = ['avec', 'dans', 'pour', 'plus', 'tout', 'tous', 'cette', 'sans', 'sous', 'mais', 'vers', 'chez', 'dont', 'être', 'avoir', 'faire', 'aller', 'elle', 'leur', 'vous', 'nous', 'sont', 'comme', 'peut', 'cette', 'très'];

    // Filtrer et trier
    const filtered = Object.entries(wordFrequency)
      .filter(([word]) => !stopWords.includes(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    semanticAnalysis.topKeywords = filtered.map(([word, count]) => ({
      word,
      count,
      density: ((count / words.length) * 100).toFixed(2) + '%'
    }));

    // Mot-clé principal (inféré du titre + H1)
    const title = document.title.toLowerCase();
    const h1 = document.querySelector('h1')?.innerText.toLowerCase() || '';
    const combined = (title + ' ' + h1).split(/\s+/);
    const mainKeywordCandidates = combined.filter(w => w.length > 4);
    semanticAnalysis.mainKeyword = mainKeywordCandidates[0] || '';

    // Ratio texte/HTML
    semanticAnalysis.textToHTMLRatio = ((bodyText.length / htmlLength) * 100).toFixed(2) + '%';

    // Score de lisibilité simplifié (formule Flesch adaptée)
    const sentences = bodyText.split(/[.!?]+/).filter(s => s.trim());
    const avgWordsPerSentence = words.length / (sentences.length || 1);
    semanticAnalysis.avgWordsPerSentence = avgWordsPerSentence.toFixed(1);

    // Score simplifié (plus c'est bas, mieux c'est - idéal 10-20 mots/phrase)
    if (avgWordsPerSentence < 15) {
      semanticAnalysis.readabilityScore = 'Excellent';
    } else if (avgWordsPerSentence < 20) {
      semanticAnalysis.readabilityScore = 'Bon';
    } else if (avgWordsPerSentence < 25) {
      semanticAnalysis.readabilityScore = 'Moyen';
    } else {
      semanticAnalysis.readabilityScore = 'Difficile';
    }

    // Détection fraîcheur (date de publication/modification)
    const dateSelectors = [
      'meta[property="article:published_time"]',
      'meta[property="article:modified_time"]',
      'meta[name="date"]',
      'time[datetime]',
      '.published-date',
      '.post-date'
    ];

    for (const selector of dateSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        const dateValue = el.getAttribute('content') || el.getAttribute('datetime') || el.textContent;
        if (dateValue) {
          semanticAnalysis.freshness = dateValue;
          break;
        }
      }
    }

  } catch (error) {
    console.error('Erreur analyse sémantique:', error);
  }

  return semanticAnalysis;
}

/* ========================================
   SEO AVANCÉ - DONNÉES STRUCTURÉES
   ======================================== */

/**
 * Détecte et analyse les données structurées (Schema.org)
 * @returns {Object} Résultats données structurées
 */
function analyzeStructuredData() {
  const structured = {
    detected: false,
    formats: [],
    types: [],
    count: 0,
    jsonLD: [],
    microdata: false,
    rdfa: false,
    validation: {
      hasErrors: false,
      missingRequired: []
    }
  };

  try {
    // JSON-LD (le plus courant et recommandé)
    const jsonLDScripts = document.querySelectorAll('script[type="application/ld+json"]');
    if (jsonLDScripts.length > 0) {
      structured.detected = true;
      structured.formats.push('JSON-LD');
      structured.count += jsonLDScripts.length;

      jsonLDScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent);
          const type = data['@type'] || (Array.isArray(data) ? data.map(d => d['@type']).join(', ') : 'Unknown');
          structured.types.push(type);
          structured.jsonLD.push({
            type,
            context: data['@context'] || '',
            valid: !!data['@type']
          });
        } catch (e) {
          structured.validation.hasErrors = true;
        }
      });
    }

    // Microdata
    const microdataItems = document.querySelectorAll('[itemscope]');
    if (microdataItems.length > 0) {
      structured.detected = true;
      structured.formats.push('Microdata');
      structured.microdata = true;
      structured.count += microdataItems.length;

      microdataItems.forEach(item => {
        const type = item.getAttribute('itemtype');
        if (type) {
          const typeName = type.split('/').pop();
          structured.types.push(typeName);
        }
      });
    }

    // RDFa
    const rdfaItems = document.querySelectorAll('[typeof], [property]');
    if (rdfaItems.length > 0) {
      structured.detected = true;
      structured.formats.push('RDFa');
      structured.rdfa = true;
      structured.count += rdfaItems.length;
    }

    // Dédupliquer types
    structured.types = [...new Set(structured.types)];

  } catch (error) {
    console.error('Erreur analyse données structurées:', error);
  }

  return structured;
}

/* ========================================
   SEO AVANCÉ - SEO LOCAL (NAP)
   ======================================== */

/**
 * Analyse SEO Local et détection NAP
 * @returns {Object} Résultats SEO local
 */
function analyzeLocalSEO() {
  const local = {
    napDetected: false,
    name: '',
    address: '',
    phone: '',
    napConsistency: true,
    googleMapsEmbed: false,
    geoTags: false,
    localKeywords: [],
    schema: {
      localBusiness: false,
      organization: false
    }
  };

  try {
    const bodyText = document.body.innerText;

    // Détection téléphone (formats français)
    const phoneRegex = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/g;
    const phones = bodyText.match(phoneRegex);
    if (phones && phones.length > 0) {
      local.phone = phones[0].trim();
      local.napDetected = true;
    }

    // Détection adresse (pattern simplifié)
    const addressRegex = /\d{1,5}\s+[\wÀ-ÿ\s,'-]+(?:rue|avenue|boulevard|place|chemin|allée|impasse|route)[\wÀ-ÿ\s,'-]+\d{5}/gi;
    const addresses = bodyText.match(addressRegex);
    if (addresses && addresses.length > 0) {
      local.address = addresses[0].trim();
      local.napDetected = true;
    }

    // Détection nom entreprise (depuis Schema.org ou meta)
    const orgName = document.querySelector('meta[property="og:site_name"]')?.content ||
                    document.querySelector('[itemp="name"]')?.textContent ||
                    '';
    if (orgName) {
      local.name = orgName;
    }

    // Google Maps embed
    local.googleMapsEmbed = !!document.querySelector('iframe[src*="google.com/maps"]');

    // GeoTags
    const geoPosition = document.querySelector('meta[name="geo.position"]');
    const icbm = document.querySelector('meta[name="ICBM"]');
    local.geoTags = !!(geoPosition || icbm);

    // Mots-clés géolocalisés
    const cities = ['paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'strasbourg', 'montpellier', 'bordeaux', 'lille', 'rennes', 'reims', 'toulon', 'grenoble', 'dijon'];
    const localKeywordPatterns = [...cities, 'près de moi', 'à proximité', 'local', 'ville'];

    localKeywordPatterns.forEach(keyword => {
      if (bodyText.toLowerCase().includes(keyword)) {
        local.localKeywords.push(keyword);
      }
    });

    // Schema LocalBusiness
    const jsonLD = document.querySelectorAll('script[type="application/ld+json"]');
    jsonLD.forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        if (data['@type'] === 'LocalBusiness' || (Array.isArray(data) && data.some(d => d['@type'] === 'LocalBusiness'))) {
          local.schema.localBusiness = true;
        }
        if (data['@type'] === 'Organization') {
          local.schema.organization = true;
        }
      } catch (e) {}
    });

  } catch (error) {
    console.error('Erreur analyse SEO local:', error);
  }

  return local;
}

/* ========================================
   SEO AVANCÉ - OPEN GRAPH & TWITTER CARDS
   ======================================== */

/**
 * Analyse Open Graph et Twitter Cards
 * @returns {Object} Résultats métadonnées sociales
 */
function analyzeSocialMetadata() {
  const social = {
    openGraph: {
      detected: false,
      title: '',
      description: '',
      image: '',
      url: '',
      type: '',
      siteName: '',
      complete: false
    },
    twitterCard: {
      detected: false,
      card: '',
      title: '',
      description: '',
      image: '',
      site: '',
      creator: '',
      complete: false
    },
    validation: {
      ogImageValid: false,
      twitterImageValid: false,
      recommendations: []
    }
  };

  try {
    // Open Graph
    social.openGraph.title = document.querySelector('meta[property="og:title"]')?.content || '';
    social.openGraph.description = document.querySelector('meta[property="og:description"]')?.content || '';
    social.openGraph.image = document.querySelector('meta[property="og:image"]')?.content || '';
    social.openGraph.url = document.querySelector('meta[property="og:url"]')?.content || '';
    social.openGraph.type = document.querySelector('meta[property="og:type"]')?.content || '';
    social.openGraph.siteName = document.querySelector('meta[property="og:site_name"]')?.content || '';

    social.openGraph.detected = !!(social.openGraph.title || social.openGraph.image);
    social.openGraph.complete = !!(social.openGraph.title && social.openGraph.description && social.openGraph.image && social.openGraph.url);

    // Twitter Card
    social.twitterCard.card = document.querySelector('meta[name="twitter:card"]')?.content || '';
    social.twitterCard.title = document.querySelector('meta[name="twitter:title"]')?.content || '';
    social.twitterCard.description = document.querySelector('meta[name="twitter:description"]')?.content || '';
    social.twitterCard.image = document.querySelector('meta[name="twitter:image"]')?.content || '';
    social.twitterCard.site = document.querySelector('meta[name="twitter:site"]')?.content || '';
    social.twitterCard.creator = document.querySelector('meta[name="twitter:creator"]')?.content || '';

    social.twitterCard.detected = !!(social.twitterCard.card || social.twitterCard.image);
    social.twitterCard.complete = !!(social.twitterCard.card && social.twitterCard.title && social.twitterCard.description && social.twitterCard.image);

    // Validation images (taille recommandée: 1200x630 pour OG, 1200x600 pour Twitter)
    if (social.openGraph.image) {
      social.validation.ogImageValid = true; // On suppose valide si présent
    }
    if (social.twitterCard.image) {
      social.validation.twitterImageValid = true;
    }

    // Recommandations
    if (!social.openGraph.complete) {
      social.validation.recommendations.push('Compléter les métadonnées Open Graph pour meilleur partage Facebook/LinkedIn');
    }
    if (!social.twitterCard.complete) {
      social.validation.recommendations.push('Ajouter Twitter Card pour meilleur affichage sur Twitter/X');
    }

  } catch (error) {
    console.error('Erreur analyse métadonnées sociales:', error);
  }

  return social;
}

/* ========================================
   SEO AVANCÉ - MAILLAGE INTERNE
   ======================================== */

/**
 * Analyse du maillage interne
 * @returns {Object} Résultats maillage
 */
function analyzeInternalLinking() {
  const linking = {
    internalLinks: 0,
    externalLinks: 0,
    ratio: 0,
    nofollowLinks: 0,
    dofollowLinks: 0,
    anchorTexts: [],
    deepLinks: 0,
    orphanRisk: false
  };

  try {
    const allLinks = document.querySelectorAll('a[href]');
    const currentDomain = window.location.hostname;

    allLinks.forEach(link => {
      const href = link.href;
      const rel = link.rel;
      const anchorText = link.innerText.trim();

      try {
        const linkURL = new URL(href);

        // Interne vs Externe
        if (linkURL.hostname === currentDomain) {
          linking.internalLinks++;

          // Deep link (plus de 2 niveaux de profondeur)
          const pathDepth = linkURL.pathname.split('/').filter(p => p).length;
          if (pathDepth > 2) {
            linking.deepLinks++;
          }
        } else {
          linking.externalLinks++;
        }

        // Nofollow vs Dofollow
        if (rel && rel.includes('nofollow')) {
          linking.nofollowLinks++;
        } else {
          linking.dofollowLinks++;
        }

        // Anchor texts (top 10)
        if (anchorText && anchorText.length > 2 && anchorText.length < 100) {
          linking.anchorTexts.push(anchorText);
        }

      } catch (e) {
        // URL invalide
      }
    });

    // Ratio interne/externe
    const total = linking.internalLinks + linking.externalLinks;
    if (total > 0) {
      linking.ratio = ((linking.internalLinks / total) * 100).toFixed(1) + '%';
    }

    // Risque page orpheline (peu de liens entrants internes)
    if (linking.internalLinks < 3) {
      linking.orphanRisk = true;
    }

    // Top anchor texts (par fréquence)
    const anchorFreq = {};
    linking.anchorTexts.forEach(text => {
      anchorFreq[text] = (anchorFreq[text] || 0) + 1;
    });
    linking.anchorTexts = Object.entries(anchorFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([text, count]) => ({ text, count }));

  } catch (error) {
    console.error('Erreur analyse maillage:', error);
  }

  return linking;
}

console.log('✅ Advanced Features SEO chargé');
