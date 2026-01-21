/**
 * AI-ANALYZER.JS - Analyseur IA via API Claude
 * Analyse INTELLIGENTE de la page web via Claude (Anthropic)
 */

/**
 * Analyse une page web via l'IA Claude
 * @returns {Promise<Object>} Résultats de l'analyse IA
 */
async function analyzePageWithAI() {
  console.log('🤖 ========================================');
  console.log('🤖 DÉMARRAGE DE L\'ANALYSE IA AVEC CLAUDE');
  console.log('🤖 ========================================');

  // Vérifier si une clé API est configurée
  const apiKey = await getApiKey();
  if (!apiKey) {
    console.error('❌ ERREUR: Aucune clé API trouvée dans le storage');
    throw new Error('Aucune clé API configurée. Veuillez configurer votre clé API Claude dans les paramètres.');
  }

  console.log('✅ Clé API trouvée:', apiKey.substring(0, 20) + '...');

  // Extraire le contenu de la page
  console.log('📄 Extraction du contenu de la page...');
  const pageContent = extractPageContent();
  console.log('✅ Contenu extrait:', {
    url: pageContent.url,
    wordCount: pageContent.wordCount,
    images: pageContent.images.length,
    links: pageContent.links.length
  });

  // Envoyer à l'API Claude pour analyse
  console.log('🚀 Envoi à l\'API Claude...');
  const aiAnalysis = await sendToClaudeAPI(apiKey, pageContent);
  console.log('✅ Réponse reçue de Claude');

  // Parser et structurer la réponse
  console.log('📊 Parsing de la réponse...');
  const structuredResults = parseAIResponse(aiAnalysis);

  console.log('✅ ========================================');
  console.log('✅ ANALYSE IA TERMINÉE AVEC SUCCÈS !');
  console.log('✅ ========================================');
  console.log('Résultats:', structuredResults);
  return structuredResults;
}

/**
 * Récupère la clé API depuis le storage
 */
async function getApiKey() {
  try {
    const result = await chrome.storage.local.get('claudeApiKey');
    return result.claudeApiKey || null;
  } catch (error) {
    console.error('Erreur récupération clé API:', error);
    return null;
  }
}

/**
 * Extrait le contenu pertinent de la page
 */
function extractPageContent() {
  // Méta-données
  const title = document.title || '';
  const metaDesc = document.querySelector('meta[name="description"]')?.content || '';
  const canonicalUrl = document.querySelector('link[rel="canonical"]')?.href || window.location.href;

  // Titres
  const h1 = Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()).slice(0, 5);
  const h2 = Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim()).slice(0, 10);

  // Texte visible (limité à 5000 caractères pour ne pas exploser l'API)
  const bodyText = document.body.innerText.substring(0, 5000);

  // Images
  const images = Array.from(document.querySelectorAll('img')).slice(0, 20).map(img => ({
    src: img.src,
    alt: img.alt || '',
    hasAlt: img.hasAttribute('alt')
  }));

  // Liens
  const links = Array.from(document.querySelectorAll('a[href]')).slice(0, 50).map(a => ({
    text: a.textContent.trim(),
    href: a.href
  }));

  // Technologies détectées
  const technologies = detectSimpleTechnologies();

  // Structure HTML simplifiée
  const htmlStructure = {
    hasViewport: !!document.querySelector('meta[name="viewport"]'),
    hasLang: !!document.documentElement.getAttribute('lang'),
    semantic: {
      header: document.querySelectorAll('header').length,
      nav: document.querySelectorAll('nav').length,
      main: document.querySelectorAll('main').length,
      article: document.querySelectorAll('article').length,
      footer: document.querySelectorAll('footer').length
    }
  };

  return {
    url: canonicalUrl,
    title,
    metaDesc,
    h1,
    h2,
    bodyText,
    images,
    links,
    technologies,
    htmlStructure,
    wordCount: bodyText.split(/\s+/).length
  };
}

/**
 * Détecte les technologies de base
 */
function detectSimpleTechnologies() {
  const tech = [];

  if (document.querySelector('meta[name="generator"][content*="WordPress"]')) {
    tech.push('WordPress');
  }
  if (typeof jQuery !== 'undefined') {
    tech.push('jQuery');
  }
  if (typeof React !== 'undefined') {
    tech.push('React');
  }
  if (typeof Vue !== 'undefined') {
    tech.push('Vue.js');
  }
  if (window.__NEXT_DATA__) {
    tech.push('Next.js');
  }
  if (document.querySelector('script[src*="google-analytics"]') || document.querySelector('script[src*="gtag"]')) {
    tech.push('Google Analytics');
  }

  return tech;
}

/**
 * Envoie le contenu à l'API Claude pour analyse
 */
async function sendToClaudeAPI(apiKey, pageContent) {
  const prompt = createAnalysisPrompt(pageContent);

  console.log('📤 Envoi requête via background service worker');
  console.log('🔑 Clé API utilisée:', apiKey.substring(0, 15) + '...');
  console.log('📊 Model: claude-3-opus-20240229');

  try {
    // Envoyer la requête au background service worker
    const response = await chrome.runtime.sendMessage({
      action: 'callClaudeAPI',
      apiKey: apiKey,
      prompt: prompt
    });

    console.log('📥 Réponse reçue du background worker');

    if (!response.success) {
      console.error('❌ ERREUR API CLAUDE:', response.error);
      throw new Error(response.error);
    }

    console.log('✅ Réponse parsée avec succès');
    console.log('📝 Taille de la réponse:', response.data.length, 'caractères');

    return response.data;

  } catch (error) {
    console.error('❌ ERREUR LORS DE L\'APPEL API:', error);
    throw error;
  }
}

/**
 * Crée le prompt d'analyse pour Claude
 */
function createAnalysisPrompt(pageContent) {
  return `Tu es un expert en audit SEO, Marketing et UX. Analyse cette page web en profondeur et fournis un rapport ULTRA-DÉTAILLÉ au format JSON.

**CONTENU DE LA PAGE:**
URL: ${pageContent.url}
Titre: ${pageContent.title}
Meta Description: ${pageContent.metaDesc}
H1: ${pageContent.h1.join(', ')}
H2: ${pageContent.h2.slice(0, 5).join(', ')}
Nombre de mots: ${pageContent.wordCount}
Images: ${pageContent.images.length} (${pageContent.images.filter(i => !i.hasAlt).length} sans ALT)
Liens: ${pageContent.links.length}
Technologies: ${pageContent.technologies.join(', ') || 'Non détectées'}
Structure sémantique: ${JSON.stringify(pageContent.htmlStructure.semantic)}

**EXTRAIT DU CONTENU:**
${pageContent.bodyText.substring(0, 2000)}...

**TON ANALYSE DOIT CONTENIR:**

1. **Score Global** (0-100) avec justification détaillée
2. **Analyse SEO** (score 0-100):
   - Qualité du titre (longueur, mots-clés, accroche)
   - Qualité meta description
   - Structure H1/H2/H3 (hiérarchie, pertinence)
   - Optimisation images (ALT descriptifs, taille, lazy loading)
   - Richesse du contenu (profondeur, valeur ajoutée)
   - Détails techniques (canonical, schema.org, Open Graph)
3. **Analyse Marketing** (score 0-100):
   - Qualité des CTA (clarté, positionnement, urgence)
   - Proposition de valeur (USP visible, différenciation)
   - Preuve sociale (témoignages, chiffres, logos clients)
   - Outils de conversion (formulaires, chat, popup)
   - Analytics et tracking
4. **Analyse UX** (score 0-100):
   - Navigation (clarté, accessibilité)
   - Lisibilité (typographie, contraste, espacement)
   - Performance perçue
   - Accessibilité (WCAG, aria, semantique HTML)
   - Mobile-friendliness
5. **Recommandations Prioritaires** (10-15 recommandations):
   - Chaque recommandation avec: priorité (Critique/Important/Moyen), catégorie, titre, description détaillée (3-5 phrases), impact quantifié, action concrète, 5-7 conseils pratiques

**FORMAT DE RÉPONSE (JSON STRICT):**
{
  "globalScore": 75,
  "globalAnalysis": "Analyse générale en 2-3 paragraphes...",
  "seo": {
    "score": 80,
    "analysis": "Analyse SEO détaillée 3-4 paragraphes...",
    "strengths": ["Point fort 1", "Point fort 2", ...],
    "weaknesses": ["Point faible 1", "Point faible 2", ...],
    "opportunities": ["Opportunité 1", "Opportunité 2", ...]
  },
  "marketing": {
    "score": 65,
    "analysis": "Analyse Marketing détaillée 3-4 paragraphes...",
    "strengths": [...],
    "weaknesses": [...],
    "opportunities": [...]
  },
  "ux": {
    "score": 90,
    "analysis": "Analyse UX détaillée 3-4 paragraphes...",
    "strengths": [...],
    "weaknesses": [...],
    "opportunities": [...]
  },
  "recommendations": [
    {
      "priority": "Critique",
      "category": "SEO",
      "title": "Titre court",
      "description": "Description détaillée 3-5 phrases expliquant le problème et son contexte...",
      "impact": "Impact quantifié avec chiffres précis (CTR, conversion, etc.)...",
      "action": "Action concrète à entreprendre...",
      "tips": ["Conseil pratique 1", "Conseil 2", "Conseil 3", "Conseil 4", "Conseil 5"]
    }
  ]
}

**IMPORTANT:** Réponds UNIQUEMENT avec le JSON, sans texte avant ou après. Sois ULTRA-DÉTAILLÉ dans tes analyses (3-5 paragraphes par pilier). Fournis des recommandations ACTIONNABLES avec impact quantifié.`;
}

/**
 * Parse la réponse de l'IA et structure les résultats
 */
function parseAIResponse(aiResponse) {
  try {
    // Claude peut parfois ajouter du texte avant/après le JSON, on extrait juste le JSON
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Aucun JSON trouvé dans la réponse de l\'IA');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Ajouter les méta-données
    return {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      analyzedBy: 'Claude AI (Anthropic)',
      model: 'claude-3-opus-20240229',
      ...analysis
    };

  } catch (error) {
    console.error('Erreur parsing réponse IA:', error);
    console.log('Réponse brute:', aiResponse);

    // Fallback avec analyse basique
    return {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      analyzedBy: 'Claude AI (Anthropic)',
      model: 'claude-3-opus-20240229',
      error: 'Erreur de parsing: ' + error.message,
      rawResponse: aiResponse.substring(0, 500)
    };
  }
}

// Export pour utilisation dans content.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { analyzePageWithAI };
}
