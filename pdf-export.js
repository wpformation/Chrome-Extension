/**
 * PDF-EXPORT.JS - Générateur de rapports PDF
 * Utilise une approche légère pour créer un rapport téléchargeable
 * Alternative: Utilise jsPDF si disponible, sinon génère un HTML téléchargeable
 */

/**
 * Génère et télécharge un rapport PDF de l'audit
 * @param {Object} results - Résultats complets de l'analyse
 */
function generatePDFReport(results) {
  console.log('📊 Génération du rapport PDF...');

  // Créer le contenu HTML du rapport
  const reportHTML = createReportHTML(results);

  // Ouvrir dans une nouvelle fenêtre et déclencher l'impression PDF
  printToPDF(reportHTML, results);
}

/**
 * Crée le contenu HTML du rapport
 * @param {Object} results - Résultats de l'analyse
 * @returns {string} HTML du rapport
 */
function createReportHTML(results) {
  const date = new Date(results.timestamp).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport d'Audit - ${extractDomain(results.url)}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #334155;
            background: #f8fafc;
            padding: 40px 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 60px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 50px;
            padding-bottom: 30px;
            border-bottom: 3px solid #6366f1;
        }

        .header h1 {
            font-size: 32px;
            color: #1e293b;
            margin-bottom: 10px;
        }

        .header .subtitle {
            font-size: 18px;
            color: #64748b;
            margin-bottom: 20px;
        }

        .header .url {
            font-size: 14px;
            color: #6366f1;
            word-break: break-all;
            font-family: 'Courier New', monospace;
        }

        .header .date {
            font-size: 13px;
            color: #94a3b8;
            margin-top: 10px;
        }

        .global-score {
            text-align: center;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            padding: 40px;
            border-radius: 12px;
            margin-bottom: 40px;
        }

        .global-score .score {
            font-size: 72px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .global-score .label {
            font-size: 24px;
            opacity: 0.9;
        }

        .global-score .status {
            font-size: 18px;
            margin-top: 15px;
            padding: 10px 25px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            display: inline-block;
        }

        .pillar {
            margin-bottom: 40px;
            padding: 30px;
            background: #f8fafc;
            border-radius: 10px;
            border-left: 5px solid #6366f1;
        }

        .pillar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e2e8f0;
        }

        .pillar-header h2 {
            font-size: 24px;
            color: #1e293b;
        }

        .pillar-score {
            font-size: 28px;
            font-weight: 700;
            color: #6366f1;
        }

        .metrics {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .metric {
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .metric-label {
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
            display: block;
            margin-bottom: 8px;
        }

        .metric-value {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
        }

        .metric-value.success {
            color: #10b981;
        }

        .metric-value.warning {
            color: #f59e0b;
        }

        .metric-value.error {
            color: #ef4444;
        }

        .footer {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #94a3b8;
            font-size: 14px;
        }

        .footer strong {
            color: #6366f1;
        }

        .analysis-method {
            text-align: center;
            margin-bottom: 30px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
            border-radius: 8px;
            font-size: 14px;
            color: #4f46e5;
            font-weight: 600;
        }

        .global-analysis {
            margin-bottom: 40px;
            padding: 30px;
            background: #f8fafc;
            border-radius: 10px;
            border-left: 5px solid #6366f1;
        }

        .global-analysis h3 {
            font-size: 20px;
            color: #1e293b;
            margin-bottom: 15px;
        }

        .global-analysis p {
            color: #475569;
            line-height: 1.8;
            margin-bottom: 12px;
        }

        .pillar-analysis {
            margin-top: 20px;
            padding: 20px;
            background: white;
            border-radius: 8px;
            margin-bottom: 15px;
        }

        .pillar-analysis h4 {
            font-size: 16px;
            color: #1e293b;
            margin-bottom: 12px;
            font-weight: 600;
        }

        .pillar-analysis p {
            color: #475569;
            line-height: 1.7;
            margin-bottom: 10px;
        }

        .swot-section {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin-top: 20px;
        }

        .swot-box {
            background: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            border-left: 3px solid;
        }

        .swot-box.strengths {
            border-left-color: #10b981;
        }

        .swot-box.weaknesses {
            border-left-color: #ef4444;
        }

        .swot-box.opportunities {
            border-left-color: #3b82f6;
        }

        .swot-box h5 {
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .swot-box.strengths h5 {
            color: #10b981;
        }

        .swot-box.weaknesses h5 {
            color: #ef4444;
        }

        .swot-box.opportunities h5 {
            color: #3b82f6;
        }

        .swot-box ul {
            margin-left: 15px;
            font-size: 13px;
            color: #475569;
        }

        .swot-box li {
            margin-bottom: 5px;
            line-height: 1.5;
        }

        .recommendations-section {
            margin-top: 40px;
            page-break-before: auto;
        }

        .section-title {
            font-size: 28px;
            color: #1e293b;
            margin-bottom: 10px;
        }

        .section-intro {
            color: #64748b;
            margin-bottom: 30px;
        }

        .recommendation-card {
            margin-bottom: 30px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            page-break-inside: avoid;
        }

        .rec-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
        }

        .rec-priority {
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
        }

        .rec-category {
            color: #64748b;
            font-size: 13px;
            font-weight: 500;
        }

        .rec-title {
            font-size: 18px;
            color: #1e293b;
            margin-bottom: 12px;
        }

        .rec-description, .rec-impact p, .rec-action p, .rec-tips, .rec-best-practices p {
            color: #475569;
            line-height: 1.7;
            margin-bottom: 12px;
        }

        .rec-impact, .rec-action, .rec-tips, .rec-best-practices, .rec-resources {
            background: white;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 12px;
        }

        .rec-impact strong, .rec-action strong, .rec-tips strong, .rec-best-practices strong, .rec-resources strong {
            display: block;
            margin-bottom: 8px;
            color: #6366f1;
        }

        .rec-tips ul, .rec-resources ul {
            margin-left: 20px;
            margin-top: 8px;
        }

        .rec-tips li, .rec-resources li {
            margin-bottom: 6px;
            color: #334155;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }

            .container {
                box-shadow: none;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- En-tête -->
        <div class="header">
            <h1>📊 Rapport d'Audit Web</h1>
            <p class="subtitle">Analyse SEO, Marketing & UX</p>
            <p class="url">${results.url}</p>
            <p class="date">Généré le ${date}</p>
        </div>

        ${results.analysisMethod ? `
        <!-- Méthode d'analyse -->
        <div class="analysis-method">
            ${results.analysisMethod.includes('AI') ? '🤖' : '💻'} Méthode d'analyse: ${results.analysisMethod}
        </div>
        ` : ''}

        <!-- Score Global -->
        <div class="global-score">
            <div class="score">${results.globalScore}/100</div>
            <div class="label">Score Global</div>
            <div class="status">${getScoreLabel(results.globalScore)}</div>
        </div>

        ${results.globalAnalysis ? `
        <!-- Analyse Globale IA -->
        <div class="global-analysis">
            <h3>🎯 Analyse Globale par IA</h3>
            ${formatParagraphs(results.globalAnalysis)}
        </div>
        ` : ''}

        <!-- Pilier SEO -->
        <div class="pillar">
            <div class="pillar-header">
                <h2>🔍 Analyse SEO</h2>
                <div class="pillar-score">${results.seo.score}/100</div>
            </div>
            <div class="metrics">
                ${createMetricHTML('Titre de la page', formatTitleStatus(results.seo.title))}
                ${createMetricHTML('Meta Description', formatDescStatus(results.seo.metaDescription))}
                ${createMetricHTML('Balise H1', formatH1Status(results.seo.h1))}
                ${createMetricHTML('Hiérarchie des titres', formatHeadingsStatus(results.seo.headings))}
                ${createMetricHTML('Images sans ALT', formatImagesStatus(results.seo.images))}
                ${createMetricHTML('Balise Canonical', results.seo.canonical.exists ? '✓ Présente' : '⚠ Absente', results.seo.canonical.exists ? 'success' : 'warning')}
            </div>
            ${results.seo.analysis ? `
            <div class="pillar-analysis">
                <h4>📝 Analyse Détaillée</h4>
                ${formatParagraphs(results.seo.analysis)}
            </div>
            ${generateSWOT(results.seo)}
            ` : ''}
        </div>

        <!-- Pilier Marketing -->
        <div class="pillar">
            <div class="pillar-header">
                <h2>📈 Analyse Marketing</h2>
                <div class="pillar-score">${results.marketing.score}/100</div>
            </div>
            <div class="metrics">
                ${createMetricHTML('Google Analytics (GA4)', results.marketing.ga4.detected ? '✓ Détecté' : '✗ Non détecté', results.marketing.ga4.detected ? 'success' : 'error')}
                ${createMetricHTML('Google Tag Manager', results.marketing.gtm.detected ? `✓ ${results.marketing.gtm.id || 'Détecté'}` : '✗ Non détecté', results.marketing.gtm.detected ? 'success' : 'error')}
                ${createMetricHTML('Meta Pixel (Facebook)', results.marketing.metaPixel.detected ? '✓ Détecté' : '✗ Non détecté', results.marketing.metaPixel.detected ? 'success' : 'error')}
                ${createMetricHTML('HubSpot', results.marketing.hubspot.detected ? '✓ Détecté' : '✗ Non détecté', results.marketing.hubspot.detected ? 'success' : 'error')}
                ${createMetricHTML('CTA détectés', `${results.marketing.cta.count} CTA trouvés`, results.marketing.cta.count >= 3 ? 'success' : 'warning')}
                ${createMetricHTML('Réseaux sociaux', `${results.marketing.social.totalFound}/4 réseaux`, results.marketing.social.totalFound >= 3 ? 'success' : 'warning')}
            </div>
            ${results.marketing.analysis ? `
            <div class="pillar-analysis">
                <h4>📝 Analyse Détaillée</h4>
                ${formatParagraphs(results.marketing.analysis)}
            </div>
            ${generateSWOT(results.marketing)}
            ` : ''}
        </div>

        <!-- Pilier UX & Technique -->
        <div class="pillar">
            <div class="pillar-header">
                <h2>💻 Analyse UX & Technique</h2>
                <div class="pillar-score">${results.ux.score}/100</div>
            </div>
            <div class="metrics">
                ${createMetricHTML('Viewport Mobile', results.ux.viewport.exists ? '✓ Présent' : '✗ Absent', results.ux.viewport.exists ? 'success' : 'error')}
                ${createMetricHTML('Nombre de mots', `${results.ux.wordCount} mots`, results.ux.wordCount >= 300 ? 'success' : 'warning')}
                ${createMetricHTML('Temps de lecture estimé', `${results.ux.readingTime} minute(s)`)}
                ${createMetricHTML('Total de liens', `${results.ux.links.total} liens`, 'success')}
                ${createMetricHTML('Liens cassés/vides', results.ux.links.broken === 0 ? '✓ Aucun' : `⚠ ${results.ux.links.broken}`, results.ux.links.broken === 0 ? 'success' : 'warning')}
            </div>
            ${results.ux.analysis ? `
            <div class="pillar-analysis">
                <h4>📝 Analyse Détaillée</h4>
                ${formatParagraphs(results.ux.analysis)}
            </div>
            ${generateSWOT(results.ux)}
            ` : ''}
        </div>

        <!-- Recommandations Enrichies -->
        ${generateRecommendationsHTML(results.recommendations)}

        <!-- Pied de page -->
        <div class="footer">
            <p>Rapport généré par <strong>Audit Expert</strong> - Extension Chrome professionnelle</p>
            <p>© ${new Date().getFullYear()} - Tous droits réservés</p>
        </div>
    </div>
</body>
</html>
`;

  return html;
}

/**
 * Crée le HTML d'une métrique
 * @param {string} label - Label de la métrique
 * @param {string} value - Valeur de la métrique
 * @param {string} cssClass - Classe CSS (success/warning/error)
 * @returns {string} HTML
 */
function createMetricHTML(label, value, cssClass = '') {
  return `
    <div class="metric">
        <span class="metric-label">${label}</span>
        <span class="metric-value ${cssClass}">${value}</span>
    </div>
  `;
}

/**
 * Génère le HTML de la section des recommandations enrichies
 * @param {Array} recommendations - Liste des recommandations
 * @returns {string} HTML de la section
 */
function generateRecommendationsHTML(recommendations) {
  // Vérifier si des recommandations existent
  if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
    return `
      <div class="recommendations-section">
        <h2 class="section-title">💡 Recommandations Prioritaires</h2>
        <p class="section-intro">✨ Aucune recommandation critique. Excellent travail !</p>
      </div>
    `;
  }

  // Fonction helper pour obtenir la couleur selon la priorité
  const getPriorityColor = (priority) => {
    const colors = {
      'critique': '#ef4444',
      'important': '#f59e0b',
      'moyen': '#3b82f6'
    };
    return colors[priority?.toLowerCase()] || '#3b82f6';
  };

  // Générer les cartes de recommandations
  const recommendationCards = recommendations.map((rec, index) => {
    const color = getPriorityColor(rec.priority);
    const number = index + 1;

    // Générer le HTML pour les tips (si présents)
    let tipsHTML = '';
    if (rec.tips && Array.isArray(rec.tips) && rec.tips.length > 0) {
      tipsHTML = `
        <div class="rec-tips">
          <strong>💡 Conseils pratiques:</strong>
          <ul>
            ${rec.tips.map(tip => `<li>${tip}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Générer le HTML pour les ressources (si présentes)
    let resourcesHTML = '';
    if (rec.resources && Array.isArray(rec.resources) && rec.resources.length > 0) {
      resourcesHTML = `
        <div class="rec-resources">
          <strong>📚 Ressources:</strong>
          <ul>
            ${rec.resources.map(resource => `<li>${resource}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    return `
      <div class="recommendation-card" style="border-left: 4px solid ${color};">
        <div class="rec-header">
          <span class="rec-priority" style="background: ${color};">${rec.priority || 'Moyen'}</span>
          <span class="rec-category">${rec.category || 'Général'}</span>
        </div>
        <h3 class="rec-title">${number}. ${rec.title || 'Sans titre'}</h3>
        <div class="rec-description">${rec.description || ''}</div>

        ${rec.impact ? `
        <div class="rec-impact">
          <strong>📊 Impact:</strong>
          <p>${rec.impact}</p>
        </div>
        ` : ''}

        ${rec.action ? `
        <div class="rec-action">
          <strong>🎯 Action recommandée:</strong>
          <p>${rec.action}</p>
        </div>
        ` : ''}

        ${tipsHTML}

        ${rec.bestPractices ? `
        <div class="rec-best-practices">
          <strong>✅ Best practices:</strong>
          <p>${rec.bestPractices}</p>
        </div>
        ` : ''}

        ${resourcesHTML}
      </div>
    `;
  }).join('');

  return `
    <div class="recommendations-section">
      <h2 class="section-title">💡 Recommandations Prioritaires</h2>
      <p class="section-intro">Conseils d'experts pour améliorer votre référencement, conversions et expérience utilisateur.</p>
      ${recommendationCards}
    </div>
  `;
}

/* ========================================
   FONCTIONS DE FORMATAGE
   ======================================== */

function getScoreLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Bon';
  if (score >= 40) return 'Moyen';
  return 'À améliorer';
}

function formatTitleStatus(title) {
  if (title.exists && title.isOptimal) {
    return `✓ ${title.length} caractères`;
  } else if (title.exists) {
    return `⚠ ${title.length} caractères`;
  }
  return '✗ Absente';
}

function formatDescStatus(desc) {
  if (desc.exists && desc.isOptimal) {
    return `✓ ${desc.length} caractères`;
  } else if (desc.exists) {
    return `⚠ ${desc.length} caractères`;
  }
  return '✗ Absente';
}

function formatH1Status(h1) {
  if (h1.isUnique) return '✓ Unique';
  if (h1.count > 1) return `⚠ ${h1.count} H1`;
  return '✗ Absente';
}

function formatHeadingsStatus(headings) {
  const total = headings.h1 + headings.h2 + headings.h3 + headings.h4 + headings.h5 + headings.h6;
  if (headings.isHierarchical) {
    return `✓ ${total} titres (hiérarchie correcte)`;
  }
  return `⚠ ${total} titres (hiérarchie incorrecte)`;
}

function formatImagesStatus(images) {
  if (images.withoutAlt === 0 && images.total > 0) {
    return `✓ 0/${images.total} images sans ALT`;
  } else if (images.total === 0) {
    return 'Aucune image';
  }
  return `⚠ ${images.withoutAlt}/${images.total} images sans ALT`;
}

function extractDomain(url) {
  try {
    const domain = new URL(url).hostname;
    return domain;
  } catch (e) {
    return 'Page Web';
  }
}

/* ========================================
   MÉTHODES DE TÉLÉCHARGEMENT
   ======================================== */

/**
 * Ouvre le rapport dans une nouvelle fenêtre et déclenche l'impression PDF
 * @param {string} html - Contenu HTML
 * @param {Object} results - Résultats
 */
function printToPDF(html, results) {
  const domain = extractDomain(results.url);
  const date = new Date().toISOString().split('T')[0];
  const suggestedFilename = `audit-${domain}-${date}.pdf`;

  console.log('🖨️ Ouverture de la fenêtre d\'impression...');

  // Ouvrir une nouvelle fenêtre
  const printWindow = window.open('', '_blank', 'width=900,height=800');

  if (!printWindow) {
    console.error('❌ Impossible d\'ouvrir la fenêtre d\'impression (popup bloqué?)');
    showNotification('Erreur: Impossible d\'ouvrir la fenêtre d\'impression. Vérifiez que les popups ne sont pas bloqués.');
    return;
  }

  // Écrire le contenu HTML dans la nouvelle fenêtre
  printWindow.document.write(html);
  printWindow.document.close();

  // Attendre que le contenu soit complètement chargé avant d'imprimer
  printWindow.onload = function() {
    // Petit délai pour s'assurer que tout est rendu
    setTimeout(() => {
      console.log('✅ Fenêtre chargée, déclenchement de l\'impression...');

      // Déclencher la boîte de dialogue d'impression
      printWindow.print();

      // Message d'aide pour l'utilisateur
      showNotification(`📄 Fenêtre d'impression ouverte! Nom suggéré: ${suggestedFilename}`);

      // Note: On ne ferme PAS automatiquement la fenêtre pour permettre à l'utilisateur
      // de réimprimer si besoin, ou d'annuler l'impression
    }, 250);
  };
}

/**
 * Affiche une notification temporaire
 * @param {string} message - Message à afficher
 */
function showNotification(message) {
  // Créer un élément de notification
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  // Ajouter l'animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // Ajouter au DOM
  document.body.appendChild(notification);

  // Supprimer après 3 secondes
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => {
      document.body.removeChild(notification);
      document.head.removeChild(style);
    }, 300);
  }, 3000);
}

/**
 * Formate du texte en paragraphes HTML
 * @param {string} text - Texte à formater (peut contenir plusieurs paragraphes séparés par \n\n)
 * @returns {string} HTML des paragraphes
 */
function formatParagraphs(text) {
  if (!text) return '';

  // Si le texte contient déjà des balises <p>, le retourner tel quel
  if (text.includes('<p>')) return text;

  // Sinon, diviser par double saut de ligne et créer des paragraphes
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
}

/**
 * Génère le HTML de la section SWOT (Forces/Faiblesses/Opportunités)
 * @param {Object} pillarData - Données du pilier (seo, marketing, ou ux)
 * @returns {string} HTML de la section SWOT
 */
function generateSWOT(pillarData) {
  if (!pillarData) return '';

  const hasStrengths = pillarData.strengths && Array.isArray(pillarData.strengths) && pillarData.strengths.length > 0;
  const hasWeaknesses = pillarData.weaknesses && Array.isArray(pillarData.weaknesses) && pillarData.weaknesses.length > 0;
  const hasOpportunities = pillarData.opportunities && Array.isArray(pillarData.opportunities) && pillarData.opportunities.length > 0;

  // Si aucune donnée SWOT, ne rien afficher
  if (!hasStrengths && !hasWeaknesses && !hasOpportunities) {
    return '';
  }

  return `
    <div class="swot-section">
      ${hasStrengths ? `
      <div class="swot-box strengths">
        <h5>✅ Forces</h5>
        <ul>
          ${pillarData.strengths.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${hasWeaknesses ? `
      <div class="swot-box weaknesses">
        <h5>⚠️ Faiblesses</h5>
        <ul>
          ${pillarData.weaknesses.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${hasOpportunities ? `
      <div class="swot-box opportunities">
        <h5>💡 Opportunités</h5>
        <ul>
          ${pillarData.opportunities.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
    </div>
  `;
}

console.log('✅ PDF Export script chargé');
