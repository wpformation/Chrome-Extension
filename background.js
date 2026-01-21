/**
 * BACKGROUND.JS - Service Worker pour les appels API
 * Gère les requêtes vers l'API Claude (Anthropic)
 */

// Écouter les messages des content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'callClaudeAPI') {
    console.log('🔵 Background: Réception requête API Claude');

    // Appeler l'API Claude
    callClaudeAPI(request.apiKey, request.prompt)
      .then(response => {
        console.log('✅ Background: Réponse API reçue');
        sendResponse({ success: true, data: response });
      })
      .catch(error => {
        console.error('❌ Background: Erreur API', error);
        sendResponse({ success: false, error: error.message });
      });

    // Retourner true pour indiquer qu'on va répondre de manière asynchrone
    return true;
  }
});

/**
 * Appelle l'API Claude
 */
async function callClaudeAPI(apiKey, prompt) {
  console.log('📤 Background: Envoi requête à api.anthropic.com');
  console.log('🔑 Clé API:', apiKey.substring(0, 15) + '...');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  console.log('📥 Background: Réponse reçue - Status:', response.status);

  if (!response.ok) {
    const error = await response.json();
    console.error('❌ Background: Erreur API:', error);
    throw new Error(`API Claude error (${response.status}): ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  console.log('✅ Background: Données parsées avec succès');

  return data.content[0].text;
}

console.log('✅ Background service worker chargé');
