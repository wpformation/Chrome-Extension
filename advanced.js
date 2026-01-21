/**
 * ADVANCED.JS - Script pour la page d'analyses avancées
 */

// Charger les résultats depuis le storage ou demander une analyse
async function loadAdvancedData() {
  try {
    // Récupérer l'ID de l'onglet analysé depuis le storage
    chrome.storage.local.get(['analyzedTabId'], (result) => {
      const tabId = result.analyzedTabId;

      if (!tabId) {
        console.error('Aucun onglet analysé trouvé');
        showError('Aucune analyse en cours. Veuillez d\'abord analyser une page depuis la popup.');
        return;
      }

      // Envoyer message à l'onglet analysé (pas l'onglet actif!)
      chrome.tabs.sendMessage(
        tabId,
        { action: 'analyzePage', forceRefresh: false, useAI: false },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Erreur:', chrome.runtime.lastError);
            showError('Impossible de communiquer avec la page analysée. Elle a peut-être été fermée.');
            return;
          }

          if (response && !response.error) {
            displayAdvancedData(response);
          } else {
            showError('Aucune donnée d\'analyse disponible.');
          }
        }
      );
    });
  } catch (error) {
    console.error('Erreur chargement données:', error);
    showError('Une erreur est survenue lors du chargement.');
  }
}

function showError(message = 'Impossible de charger les données d\'analyse. Veuillez fermer cette fenêtre et relancer une analyse.') {
  document.body.innerHTML += `
    <div style="text-align: center; padding: 40px; color: #ef4444;">
      <h3>Erreur de chargement</h3>
      <p>${message}</p>
    </div>
  `;
}

function displayAdvancedData(data) {
  // === AFFICHER METADATA (méthode d'analyse, timestamp, cache) ===
  const methodBadge = document.getElementById('analysisMethodBadge');
  const methodIcon = document.getElementById('methodIcon');
  const methodText = document.getElementById('methodText');
  const timestampText = document.getElementById('timestampText');
  const cacheBadge = document.getElementById('cacheBadge');

  // Méthode d'analyse
  if (data.analysisMethod) {
    const isAI = data.analysisMethod.includes('AI');
    methodIcon.textContent = isAI ? '🤖' : '💻';
    methodText.textContent = data.analysisMethod;
    methodBadge.className = `meta-badge ${isAI ? 'ai-mode' : 'code-mode'}`;
  }

  // Timestamp
  if (data.timestamp) {
    const date = new Date(data.timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    let timeText;
    if (diffMins < 1) {
      timeText = 'À l\'instant';
      cacheBadge.style.display = 'none';
    } else if (diffMins < 60) {
      timeText = `Il y a ${diffMins} min`;
      cacheBadge.style.display = 'inline-flex';
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      timeText = `Il y a ${hours}h${diffMins % 60 > 0 ? ' ' + (diffMins % 60) + 'min' : ''}`;
      cacheBadge.style.display = 'inline-flex';
    } else {
      const days = Math.floor(diffMins / 1440);
      timeText = `Il y a ${days} jour${days > 1 ? 's' : ''}`;
      cacheBadge.style.display = 'inline-flex';
    }

    timestampText.textContent = timeText;
  }

  // === ANALYSE SÉMANTIQUE ===
  if (data.semanticContent) {
    const sc = data.semanticContent;
    document.getElementById('wordCount').textContent = sc.wordCount || '0';
    document.getElementById('readability').innerHTML = getBadge(sc.readabilityScore, 'success');
    document.getElementById('textRatio').textContent = sc.textToHTMLRatio || 'N/A';
    document.getElementById('avgWords').textContent = sc.avgWordsPerSentence || 'N/A';

    // Top keywords
    const topKeywordsDiv = document.getElementById('topKeywords');
    if (sc.topKeywords && sc.topKeywords.length > 0) {
      topKeywordsDiv.innerHTML = sc.topKeywords
        .map(kw => `<span class="keyword-tag">${kw.word} (${kw.density})</span>`)
        .join('');
    } else {
      topKeywordsDiv.innerHTML = '<span class="empty-state">Aucun mot-clé détecté</span>';
    }
  }

  // === DONNÉES STRUCTURÉES ===
  if (data.structuredData) {
    const sd = data.structuredData;
    document.getElementById('schemaDetected').innerHTML = getBadge(sd.detected ? 'Oui' : 'Non', sd.detected ? 'success' : 'error');
    document.getElementById('schemaCount').textContent = sd.count || '0';
    document.getElementById('schemaFormats').textContent = sd.formats.join(', ') || 'Aucun';

    const typesDiv = document.getElementById('schemaTypes');
    if (sd.types && sd.types.length > 0) {
      typesDiv.innerHTML = sd.types.map(type => `<span class="keyword-tag">${type}</span>`).join('');
    } else {
      typesDiv.innerHTML = '<span class="empty-state">Aucun type détecté</span>';
    }
  }

  // === SEO LOCAL ===
  if (data.localSEO) {
    const ls = data.localSEO;
    document.getElementById('napDetected').innerHTML = getBadge(ls.napDetected ? 'Oui' : 'Non', ls.napDetected ? 'success' : 'warning');
    document.getElementById('phone').textContent = ls.phone || 'Non détecté';
    document.getElementById('googleMaps').innerHTML = getBadge(ls.googleMapsEmbed ? 'Oui' : 'Non', ls.googleMapsEmbed ? 'success' : 'error');
    document.getElementById('geoTags').innerHTML = getBadge(ls.geoTags ? 'Oui' : 'Non', ls.geoTags ? 'success' : 'error');

    const localKeywordsDiv = document.getElementById('localKeywords');
    if (ls.localKeywords && ls.localKeywords.length > 0) {
      localKeywordsDiv.innerHTML = ls.localKeywords.map(kw => `<span class="keyword-tag">${kw}</span>`).join('');
    } else {
      localKeywordsDiv.innerHTML = '<span class="empty-state">Aucun mot-clé local détecté</span>';
    }
  }

  // === MÉTADONNÉES SOCIALES ===
  if (data.socialMetadata) {
    const sm = data.socialMetadata;
    document.getElementById('ogStatus').innerHTML = getBadge(
      sm.openGraph.complete ? 'Complet' : sm.openGraph.detected ? 'Partiel' : 'Absent',
      sm.openGraph.complete ? 'success' : sm.openGraph.detected ? 'warning' : 'error'
    );
    document.getElementById('twitterStatus').innerHTML = getBadge(
      sm.twitterCard.complete ? 'Complet' : sm.twitterCard.detected ? 'Partiel' : 'Absent',
      sm.twitterCard.complete ? 'success' : sm.twitterCard.detected ? 'warning' : 'error'
    );
    document.getElementById('ogImage').innerHTML = getBadge(sm.openGraph.image ? 'Oui' : 'Non', sm.openGraph.image ? 'success' : 'error');
    document.getElementById('twitterImage').innerHTML = getBadge(sm.twitterCard.image ? 'Oui' : 'Non', sm.twitterCard.image ? 'success' : 'error');
  }

  // === MAILLAGE INTERNE ===
  if (data.internalLinking) {
    const il = data.internalLinking;
    document.getElementById('internalLinks').textContent = il.internalLinks || '0';
    document.getElementById('externalLinks').textContent = il.externalLinks || '0';
    document.getElementById('linkRatio').textContent = il.ratio || 'N/A';
    document.getElementById('deepLinks').textContent = il.deepLinks || '0';
    document.getElementById('followLinks').textContent = `${il.dofollowLinks}/${il.nofollowLinks}`;
  }

  // === PERFORMANCE AVANCÉE ===
  if (data.advancedPerformance) {
    const ap = data.advancedPerformance;
    document.getElementById('lazyImages').textContent = `${ap.lazyLoading.images} images`;
    const hints = ap.resourceHints.preload + ap.resourceHints.prefetch + ap.resourceHints.preconnect;
    document.getElementById('resourceHints').textContent = `${hints} hints`;
    document.getElementById('compression').innerHTML = getBadge(ap.compression.detected ? ap.compression.type : 'Non détecté', ap.compression.detected ? 'success' : 'warning');
    document.getElementById('perfScore').innerHTML = getScoreBadge(ap.score);
  }

  // === MOBILE-FIRST ===
  if (data.mobileFirst) {
    const mf = data.mobileFirst;
    document.getElementById('viewportMobile').innerHTML = getBadge(mf.viewport.valid ? 'Valide' : 'Invalide', mf.viewport.valid ? 'success' : 'error');
    document.getElementById('mediaQueries').textContent = mf.responsive.mediaQueries || '0';
    document.getElementById('touchTargets').textContent = `${mf.touchTargets.adequate} / ${mf.touchTargets.adequate + mf.touchTargets.tooSmall}`;
    document.getElementById('fontSizes').textContent = `${mf.fontSizes.readable} / ${mf.fontSizes.readable + mf.fontSizes.tooSmall}`;
    document.getElementById('pwa').innerHTML = getBadge(mf.pwa ? 'Oui' : 'Non', mf.pwa ? 'success' : 'error');
    document.getElementById('mobileScore').innerHTML = getScoreBadge(mf.score);
  }

  // === OUTILS MARKETING ===
  if (data.advancedMarketingTools) {
    const amt = data.advancedMarketingTools;
    document.getElementById('toolsTotal').textContent = amt.total || '0';
    document.getElementById('heatmaps').innerHTML = displayToolList(amt.heatmaps);
    document.getElementById('chat').innerHTML = displayToolList(amt.chat);
    document.getElementById('emailTools').innerHTML = displayToolList(amt.emailMarketing);
    document.getElementById('reviews').innerHTML = displayToolList(amt.reviews);
  }

  // === PROPOSITION DE VALEUR ===
  if (data.valueProposition) {
    const vp = data.valueProposition;
    document.getElementById('clarity').innerHTML = getScoreBadge(vp.clarity);
    document.getElementById('aboveFold').innerHTML = getBadge(vp.aboveFold ? 'Oui' : 'Non', vp.aboveFold ? 'success' : 'warning');
    document.getElementById('headline').textContent = vp.headline || 'Non détecté';

    const actionWordsDiv = document.getElementById('actionWords');
    if (vp.actionWords && vp.actionWords.length > 0) {
      actionWordsDiv.innerHTML = vp.actionWords.map(word => `<span class="keyword-tag">${word}</span>`).join('');
    } else {
      actionWordsDiv.innerHTML = '<span class="empty-state">Aucun mot d\'action détecté</span>';
    }
  }

  // === PSYCHOLOGIE CONVERSION ===
  if (data.conversionPsychology) {
    const cp = data.conversionPsychology;
    document.getElementById('psychScore').innerHTML = getScoreBadge(cp.score);
    document.getElementById('urgency').textContent = cp.urgency.length || '0';
    document.getElementById('scarcity').textContent = cp.scarcity.length || '0';
    document.getElementById('testimonials').textContent = cp.socialProof.testimonials || '0';
    document.getElementById('guarantees').textContent = cp.guarantees.length || '0';
  }

  // === FORMULAIRES ===
  if (data.formsAdvanced) {
    const fa = data.formsAdvanced;
    document.getElementById('formsCount').textContent = fa.count || '0';
    document.getElementById('validation').innerHTML = getBadge(fa.validation.realTime ? 'Oui' : 'Non', fa.validation.realTime ? 'success' : 'warning');
    document.getElementById('autocomplete').textContent = fa.ux.autocomplete || '0';
    document.getElementById('progress').textContent = fa.ux.progressIndicators || '0';
  }

  // === CTA OPTIMIZATION ===
  if (data.ctaOptimization) {
    const cta = data.ctaOptimization;
    document.getElementById('ctaCount').textContent = cta.count || '0';
    document.getElementById('ctaAbove').textContent = cta.aboveFold || '0';
    document.getElementById('ctaSize').textContent = `${cta.sizes.adequate} / ${cta.sizes.adequate + cta.sizes.tooSmall}`;
    document.getElementById('ctaActionable').textContent = cta.actionableText || '0';
    document.getElementById('ctaHierarchy').textContent = `${cta.hierarchy.primary} primaires, ${cta.hierarchy.secondary} secondaires`;
  }

  // === EMAIL & A/B TESTING ===
  if (data.emailAndTesting) {
    const eat = data.emailAndTesting;
    document.getElementById('emailPopup').innerHTML = getBadge(eat.emailPopup.detected ? 'Oui' : 'Non', eat.emailPopup.detected ? 'success' : 'error');
    document.getElementById('exitIntent').innerHTML = getBadge(eat.emailPopup.exitIntent ? 'Oui' : 'Non', eat.emailPopup.exitIntent ? 'success' : 'error');
    document.getElementById('newsletterForms').textContent = eat.newsletter.forms || '0';
    document.getElementById('abTools').innerHTML = displayToolList(eat.abTesting);
    document.getElementById('personalTools').innerHTML = displayToolList(eat.personalization);
  }
}

// Helpers
function getBadge(text, type = 'success') {
  return `<span class="badge ${type}">${text}</span>`;
}

function getScoreBadge(score) {
  let type = 'success';
  if (score < 50) type = 'error';
  else if (score < 70) type = 'warning';
  return `<span class="badge ${type}">${score}/100</span>`;
}

function displayToolList(tools) {
  if (!tools || tools.length === 0) {
    return '<span class="empty-state">Aucun outil détecté</span>';
  }
  return tools.map(tool => `<div class="list-item">${tool}</div>`).join('');
}

// Charger les données au chargement de la page
document.addEventListener('DOMContentLoaded', loadAdvancedData);
