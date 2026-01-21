/**
 * ADVANCED-MARKETING.JS
 * Fonctionnalités avancées Marketing & Performance
 */

/* ========================================
   SEO AVANCÉ - PERFORMANCE AVANCÉE
   ======================================== */

/**
 * Analyse performance avancée (au-delà de Core Web Vitals)
 * @returns {Object} Résultats performance
 */
function analyzeAdvancedPerformance() {
  const perf = {
    tti: null,
    tbt: null,
    speedIndex: null,
    lazyLoading: {
      images: 0,
      iframes: 0
    },
    resourceHints: {
      preload: 0,
      prefetch: 0,
      preconnect: 0,
      dnsPrefetch: 0
    },
    compression: {
      detected: false,
      type: ''
    },
    score: 0
  };

  try {
    // Resource Hints
    perf.resourceHints.preload = document.querySelectorAll('link[rel="preload"]').length;
    perf.resourceHints.prefetch = document.querySelectorAll('link[rel="prefetch"]').length;
    perf.resourceHints.preconnect = document.querySelectorAll('link[rel="preconnect"]').length;
    perf.resourceHints.dnsPrefetch = document.querySelectorAll('link[rel="dns-prefetch"]').length;

    // Lazy Loading
    perf.lazyLoading.images = document.querySelectorAll('img[loading="lazy"]').length;
    perf.lazyLoading.iframes = document.querySelectorAll('iframe[loading="lazy"]').length;

    // Compression (détection via headers - approximation via scripts)
    const scripts = document.querySelectorAll('script[src]');
    if (scripts.length > 0) {
      // Si le site utilise des CDN modernes, probablement compressé
      const hasModernCDN = Array.from(scripts).some(s =>
        s.src.includes('cloudflare') ||
        s.src.includes('jsdelivr') ||
        s.src.includes('unpkg')
      );
      if (hasModernCDN) {
        perf.compression.detected = true;
        perf.compression.type = 'Brotli/Gzip (inféré)';
      }
    }

    // Score simplifié basé sur optimisations détectées
    let score = 50; // Base
    if (perf.lazyLoading.images > 0) score += 10;
    if (perf.resourceHints.preload > 0) score += 10;
    if (perf.resourceHints.preconnect > 0) score += 10;
    if (perf.compression.detected) score += 20;
    perf.score = Math.min(score, 100);

  } catch (error) {
    console.error('Erreur analyse performance avancée:', error);
  }

  return perf;
}

/* ========================================
   SEO AVANCÉ - MOBILE-FIRST
   ======================================== */

/**
 * Analyse Mobile-First et responsive
 * @returns {Object} Résultats mobile
 */
function analyzeMobileFirst() {
  const mobile = {
    viewport: {
      exists: false,
      content: '',
      valid: false
    },
    responsive: {
      breakpoints: 0,
      mediaQueries: 0
    },
    touchTargets: {
      tooSmall: 0,
      adequate: 0
    },
    fontSizes: {
      tooSmall: 0,
      readable: 0
    },
    amp: false,
    pwa: false,
    score: 0
  };

  try {
    // Viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      mobile.viewport.exists = true;
      mobile.viewport.content = viewport.content;
      mobile.viewport.valid = viewport.content.includes('width=device-width');
    }

    // Media Queries (approximation via stylesheets)
    const styleSheets = document.styleSheets;
    let mediaQueryCount = 0;
    try {
      for (let sheet of styleSheets) {
        try {
          const rules = sheet.cssRules || sheet.rules;
          for (let rule of rules) {
            if (rule.type === CSSRule.MEDIA_RULE) {
              mediaQueryCount++;
            }
          }
        } catch (e) {
          // CORS peut bloquer l'accès aux rules externes
        }
      }
    } catch (e) {}
    mobile.responsive.mediaQueries = mediaQueryCount;

    // Touch targets (boutons et liens avec taille minimale 48x48px)
    const interactiveElements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
    interactiveElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const minSize = 44; // px recommandé par WCAG
      if (rect.width >= minSize && rect.height >= minSize) {
        mobile.touchTargets.adequate++;
      } else {
        mobile.touchTargets.tooSmall++;
      }
    });

    // Taille de police (minimum 16px recommandé pour mobile)
    const textElements = document.querySelectorAll('p, span, div, a, li');
    const sampleSize = Math.min(textElements.length, 50); // Échantillon
    for (let i = 0; i < sampleSize; i++) {
      const el = textElements[i];
      const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
      if (fontSize >= 16) {
        mobile.fontSizes.readable++;
      } else if (fontSize > 0) {
        mobile.fontSizes.tooSmall++;
      }
    }

    // AMP
    mobile.amp = !!document.querySelector('html[amp], html[⚡]');

    // PWA (détection basique)
    mobile.pwa = !!document.querySelector('link[rel="manifest"]');

    // Score
    let score = 0;
    if (mobile.viewport.valid) score += 30;
    if (mobile.responsive.mediaQueries > 5) score += 20;
    if (mobile.touchTargets.adequate > mobile.touchTargets.tooSmall) score += 20;
    if (mobile.fontSizes.readable > mobile.fontSizes.tooSmall) score += 20;
    if (mobile.pwa) score += 10;
    mobile.score = Math.min(score, 100);

  } catch (error) {
    console.error('Erreur analyse mobile:', error);
  }

  return mobile;
}

/* ========================================
   MARKETING - OUTILS ÉTENDUS
   ======================================== */

/**
 * Détecte outils marketing avancés
 * @returns {Object} Outils détectés
 */
function detectAdvancedMarketingTools() {
  const tools = {
    heatmaps: [],
    chat: [],
    emailMarketing: [],
    popups: [],
    reviews: [],
    payment: [],
    automation: [],
    total: 0
  };

  const htmlContent = document.documentElement.outerHTML;

  // Heatmaps & Session Recording
  const heatmapTools = {
    'Hotjar': /hotjar/i,
    'Crazy Egg': /crazyegg/i,
    'Mouseflow': /mouseflow/i,
    'FullStory': /fullstory/i
  };

  // Chat en direct
  const chatTools = {
    'Intercom': /intercom/i,
    'Drift': /drift/i,
    'Crisp': /crisp\.chat/i,
    'Tawk.to': /tawk\.to/i,
    'LiveChat': /livechatinc/i,
    'Zendesk Chat': /zopim|zendesk/i
  };

  // Email Marketing
  const emailTools = {
    'Mailchimp': /mailchimp/i,
    'Sendinblue': /sendinblue/i,
    'ActiveCampaign': /activecampaign/i,
    'ConvertKit': /convertkit/i
  };

  // Popups & Lead Gen
  const popupTools = {
    'OptinMonster': /optinmonster/i,
    'Sumo': /sumo\.com/i,
    'Privy': /privy/i,
    'Popupsmart': /popupsmart/i
  };

  // Avis clients
  const reviewTools = {
    'Trustpilot': /trustpilot/i,
    'Reviews.io': /reviews\.io/i,
    'Yotpo': /yotpo/i,
    'Bazaarvoice': /bazaarvoice/i
  };

  // Paiement
  const paymentTools = {
    'Stripe': /stripe/i,
    'PayPal': /paypal/i,
    'Square': /squareup/i,
    'Mollie': /mollie/i
  };

  // Marketing Automation
  const automationTools = {
    'Klaviyo': /klaviyo/i,
    'ActiveCampaign': /activecampaign/i,
    'Autopilot': /autopilothq/i,
    'Customer.io': /customer\.io/i
  };

  // Détection
  Object.entries(heatmapTools).forEach(([name, regex]) => {
    if (regex.test(htmlContent)) tools.heatmaps.push(name);
  });

  Object.entries(chatTools).forEach(([name, regex]) => {
    if (regex.test(htmlContent)) tools.chat.push(name);
  });

  Object.entries(emailTools).forEach(([name, regex]) => {
    if (regex.test(htmlContent)) tools.emailMarketing.push(name);
  });

  Object.entries(popupTools).forEach(([name, regex]) => {
    if (regex.test(htmlContent)) tools.popups.push(name);
  });

  Object.entries(reviewTools).forEach(([name, regex]) => {
    if (regex.test(htmlContent)) tools.reviews.push(name);
  });

  Object.entries(paymentTools).forEach(([name, regex]) => {
    if (regex.test(htmlContent)) tools.payment.push(name);
  });

  Object.entries(automationTools).forEach(([name, regex]) => {
    if (regex.test(htmlContent)) tools.automation.push(name);
  });

  // Total
  tools.total = tools.heatmaps.length + tools.chat.length + tools.emailMarketing.length +
                tools.popups.length + tools.reviews.length + tools.payment.length + tools.automation.length;

  return tools;
}

/* ========================================
   MARKETING - PROPOSITION DE VALEUR
   ======================================== */

/**
 * Analyse proposition de valeur et message principal
 * @returns {Object} Résultats proposition de valeur
 */
function analyzeValueProposition() {
  const value = {
    headline: '',
    subheadline: '',
    aboveFold: true,
    actionWords: [],
    benefits: [],
    clarity: 0
  };

  try {
    // Headline (H1 principal ou premier élément visible)
    const h1 = document.querySelector('h1');
    if (h1) {
      value.headline = h1.innerText.trim().substring(0, 200);
    }

    // Subheadline (H2 proche ou premier paragraphe)
    const h2 = document.querySelector('h2');
    if (h2) {
      value.subheadline = h2.innerText.trim().substring(0, 200);
    }

    // Above the fold (700px de hauteur environ)
    if (h1) {
      const rect = h1.getBoundingClientRect();
      value.aboveFold = rect.top < 700;
    }

    // Mots d'action
    const actionKeywords = ['gratuit', 'rapide', 'simple', 'facile', 'immédiat', 'meilleur', 'premier', 'unique', 'garanti', 'économisez', 'gagnez', 'découvrez', 'obtenez'];
    const text = (value.headline + ' ' + value.subheadline).toLowerCase();
    actionKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        value.actionWords.push(keyword);
      }
    });

    // Bénéfices (liste à puces near top)
    const lists = document.querySelectorAll('ul, ol');
    if (lists.length > 0) {
      const firstList = lists[0];
      const items = firstList.querySelectorAll('li');
      items.forEach((item, index) => {
        if (index < 5) { // Top 5 items
          value.benefits.push(item.innerText.trim().substring(0, 100));
        }
      });
    }

    // Score de clarté (basé sur longueur headline)
    const headlineLength = value.headline.split(' ').length;
    if (headlineLength >= 5 && headlineLength <= 12) {
      value.clarity = 100;
    } else if (headlineLength >= 3 && headlineLength <= 15) {
      value.clarity = 70;
    } else {
      value.clarity = 40;
    }

  } catch (error) {
    console.error('Erreur analyse proposition de valeur:', error);
  }

  return value;
}

/* ========================================
   MARKETING - PSYCHOLOGIE CONVERSION
   ======================================== */

/**
 * Analyse éléments de psychologie de conversion
 * @returns {Object} Résultats psychologie
 */
function analyzeConversionPsychology() {
  const psychology = {
    urgency: [],
    scarcity: [],
    socialProof: {
      testimonials: 0,
      logos: 0,
      numbers: []
    },
    guarantees: [],
    certifications: [],
    score: 0
  };

  try {
    const bodyText = document.body.innerText.toLowerCase();

    // Urgence
    const urgencyKeywords = ['offre limitée', 'dernière chance', 'expire', 'vite', 'maintenant', 'aujourd\'hui seulement', 'stock limité'];
    urgencyKeywords.forEach(keyword => {
      if (bodyText.includes(keyword)) {
        psychology.urgency.push(keyword);
      }
    });

    // Rareté
    const scarcityKeywords = ['plus que', 'seulement', 'derniers', 'rare', 'exclusif', 'limité'];
    scarcityKeywords.forEach(keyword => {
      if (bodyText.includes(keyword)) {
        psychology.scarcity.push(keyword);
      }
    });

    // Témoignages
    psychology.socialProof.testimonials = document.querySelectorAll('.testimonial, .review, .avis, blockquote').length;

    // Logos clients (approximation)
    psychology.socialProof.logos = document.querySelectorAll('img[alt*="logo"], img[alt*="client"], .client-logo').length;

    // Nombres impressionnants (regex pour détecter grands nombres)
    const numberRegex = /(\d{1,3}(?:[,.\s]\d{3})+|\d{4,})\+?\s*(?:clients?|utilisateurs?|ventes?|téléchargements?)/gi;
    const numbers = bodyText.match(numberRegex);
    if (numbers) {
      psychology.socialProof.numbers = numbers.slice(0, 5);
    }

    // Garanties
    const guaranteeKeywords = ['garantie', 'satisfait ou remboursé', 'sans risque', '30 jours', 'essai gratuit'];
    guaranteeKeywords.forEach(keyword => {
      if (bodyText.includes(keyword)) {
        psychology.guarantees.push(keyword);
      }
    });

    // Certifications / Badges
    psychology.certifications = document.querySelectorAll('img[alt*="ssl"], img[alt*="sécurisé"], img[alt*="certification"], img[alt*="badge"]').length;

    // Score (basé sur nombre d'éléments détectés)
    let score = 0;
    if (psychology.urgency.length > 0) score += 15;
    if (psychology.scarcity.length > 0) score += 15;
    if (psychology.socialProof.testimonials > 0) score += 20;
    if (psychology.socialProof.numbers.length > 0) score += 20;
    if (psychology.guarantees.length > 0) score += 20;
    if (psychology.certifications > 0) score += 10;
    psychology.score = Math.min(score, 100);

  } catch (error) {
    console.error('Erreur analyse psychologie:', error);
  }

  return psychology;
}

/* ========================================
   MARKETING - FORMULAIRES AVANCÉS
   ======================================== */

/**
 * Analyse avancée des formulaires
 * @returns {Object} Résultats formulaires
 */
function analyzeFormsAdvanced() {
  const forms = {
    count: 0,
    fields: [],
    validation: {
      realTime: false,
      errorMessages: false
    },
    ux: {
      progressIndicators: 0,
      autocomplete: 0
    },
    types: []
  };

  try {
    const formElements = document.querySelectorAll('form');
    forms.count = formElements.length;

    formElements.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      const fieldCount = inputs.length;

      forms.fields.push({
        fieldCount,
        hasSubmit: !!form.querySelector('button[type="submit"], input[type="submit"]')
      });

      // Types de champs
      inputs.forEach(input => {
        const type = input.type || input.tagName.toLowerCase();
        if (!forms.types.includes(type)) {
          forms.types.push(type);
        }

        // Autocomplete
        if (input.autocomplete === 'on' || input.hasAttribute('autocomplete')) {
          forms.ux.autocomplete++;
        }
      });

      // Validation temps réel (détection attributs HTML5)
      if (form.querySelector('[required], [pattern]')) {
        forms.validation.realTime = true;
      }

      // Messages d'erreur
      if (form.querySelector('.error, .invalid, [aria-invalid]')) {
        forms.validation.errorMessages = true;
      }

      // Progress indicators (multi-step forms)
      if (form.querySelector('.step, .progress, [role="progressbar"]')) {
        forms.ux.progressIndicators++;
      }
    });

  } catch (error) {
    console.error('Erreur analyse formulaires:', error);
  }

  return forms;
}

/* ========================================
   MARKETING - CTA OPTIMIZATION
   ======================================== */

/**
 * Analyse optimization des CTA
 * @returns {Object} Résultats CTA
 */
function analyzeCTAOptimization() {
  const cta = {
    count: 0,
    aboveFold: 0,
    belowFold: 0,
    colors: [],
    sizes: {
      tooSmall: 0,
      adequate: 0
    },
    actionableText: 0,
    hierarchy: {
      primary: 0,
      secondary: 0
    }
  };

  try {
    // Sélecteurs CTA étendus
    const ctaSelectors = 'button, .btn, .button, .cta, a.button-link, input[type="submit"], [role="button"]';
    const ctaElements = document.querySelectorAll(ctaSelectors);

    ctaElements.forEach(el => {
      cta.count++;

      // Position (above/below fold - 700px)
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const elTop = rect.top + scrollY;

      if (elTop < 700) {
        cta.aboveFold++;
      } else {
        cta.belowFold++;
      }

      // Taille (minimum 44x44px recommandé)
      if (rect.width >= 44 && rect.height >= 44) {
        cta.sizes.adequate++;
      } else if (rect.width > 0 && rect.height > 0) {
        cta.sizes.tooSmall++;
      }

      // Texte actionnable
      const text = el.innerText.toLowerCase();
      const actionVerbs = ['obtenir', 'démarrer', 'essayer', 'télécharger', 'commander', 'acheter', 'réserver', 's\'inscrire', 'découvrir'];
      if (actionVerbs.some(verb => text.includes(verb))) {
        cta.actionableText++;
      }

      // Couleur (background)
      const bgColor = window.getComputedStyle(el).backgroundColor;
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        if (!cta.colors.includes(bgColor)) {
          cta.colors.push(bgColor);
        }
      }

      // Hiérarchie (basé sur classes)
      const classes = el.className.toLowerCase();
      if (classes.includes('primary') || classes.includes('main')) {
        cta.hierarchy.primary++;
      } else if (classes.includes('secondary') || classes.includes('outline')) {
        cta.hierarchy.secondary++;
      }
    });

  } catch (error) {
    console.error('Erreur analyse CTA:', error);
  }

  return cta;
}

/* ========================================
   MARKETING - EMAIL & A/B TESTING
   ======================================== */

/**
 * Détecte outils email marketing et A/B testing
 * @returns {Object} Résultats
 */
function detectEmailAndTesting() {
  const tools = {
    emailPopup: {
      detected: false,
      exitIntent: false,
      timing: 0
    },
    newsletter: {
      forms: 0,
      doubleOptin: false
    },
    abTesting: [],
    personalization: []
  };

  try {
    const htmlContent = document.documentElement.outerHTML;

    // Popup newsletter
    tools.emailPopup.detected = !!(
      document.querySelector('.popup, .modal, [role="dialog"]') &&
      document.querySelector('input[type="email"]')
    );

    // Exit intent (détection basique via scripts)
    tools.emailPopup.exitIntent = /exit.*intent|ouibounce/i.test(htmlContent);

    // Formulaires newsletter
    const emailInputs = document.querySelectorAll('input[type="email"], input[name*="email"], input[placeholder*="email"]');
    tools.newsletter.forms = emailInputs.length;

    // A/B Testing tools
    const abTools = {
      'Optimizely': /optimizely/i,
      'VWO': /visualwebsiteoptimizer|vwo/i,
      'Google Optimize': /optimize\.google/i,
      'AB Tasty': /abtasty/i
    };

    Object.entries(abTools).forEach(([name, regex]) => {
      if (regex.test(htmlContent)) {
        tools.abTesting.push(name);
      }
    });

    // Personnalisation
    const personalTools = {
      'Dynamic Yield': /dynamicyield/i,
      'Monetate': /monetate/i,
      'Nosto': /nosto/i
    };

    Object.entries(personalTools).forEach(([name, regex]) => {
      if (regex.test(htmlContent)) {
        tools.personalization.push(name);
      }
    });

  } catch (error) {
    console.error('Erreur détection email/testing:', error);
  }

  return tools;
}

console.log('✅ Advanced Marketing features chargé');
