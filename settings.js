/**
 * SETTINGS.JS - Configuration de la clé API Claude
 */

const apiKeyInput = document.getElementById('apiKey');
const settingsForm = document.getElementById('settingsForm');
const clearBtn = document.getElementById('clearBtn');
const keyStatus = document.getElementById('keyStatus');
const statusText = document.getElementById('statusText');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Charger la clé API au démarrage
loadApiKey();

// Sauvegarder la clé API
settingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    showError('Veuillez entrer une clé API valide');
    return;
  }

  // Validation basique du format
  if (!apiKey.startsWith('sk-ant-api')) {
    showError('Format de clé API invalide. La clé doit commencer par "sk-ant-api"');
    return;
  }

  try {
    // Stocker la clé de manière sécurisée
    await chrome.storage.local.set({ claudeApiKey: apiKey });

    // Marquer qu'une nouvelle clé a été configurée (pour forcer le refresh du cache)
    await chrome.storage.local.set({ apiKeyJustConfigured: true });

    showSuccess('Clé API sauvegardée avec succès! ✅');
    updateStatus(true);

    // Afficher les instructions
    document.getElementById('instructionsAfterSave').style.display = 'block';

    // Scroller vers les instructions
    document.getElementById('instructionsAfterSave').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Vider le champ après sauvegarde
    apiKeyInput.value = '';

  } catch (error) {
    showError('Erreur lors de la sauvegarde: ' + error.message);
  }
});

// Supprimer la clé API
clearBtn.addEventListener('click', async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer la clé API?')) {
    return;
  }

  try {
    await chrome.storage.local.remove('claudeApiKey');
    showSuccess('Clé API supprimée');
    updateStatus(false);
    apiKeyInput.value = '';
  } catch (error) {
    showError('Erreur lors de la suppression: ' + error.message);
  }
});

/**
 * Charge la clé API depuis le storage
 */
async function loadApiKey() {
  try {
    const result = await chrome.storage.local.get('claudeApiKey');
    const hasKey = !!result.claudeApiKey;
    updateStatus(hasKey);
  } catch (error) {
    console.error('Erreur chargement clé:', error);
  }
}

/**
 * Met à jour le statut de la clé
 */
function updateStatus(hasKey) {
  if (hasKey) {
    keyStatus.classList.add('configured');
    statusText.textContent = '✅ Clé API configurée - Analyse IA activée';
  } else {
    keyStatus.classList.remove('configured');
    statusText.textContent = '⚠️ Aucune clé API - Analyse IA désactivée';
  }
}

/**
 * Affiche un message de succès
 */
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = 'block';
  errorMessage.style.display = 'none';

  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 3000);
}

/**
 * Affiche un message d'erreur
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  successMessage.style.display = 'none';

  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 5000);
}

console.log('✅ Settings page loaded');
