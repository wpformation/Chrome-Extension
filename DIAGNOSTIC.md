# 🔍 DIAGNOSTIC - Problème modèle 404

## ❌ Erreur actuelle
```
API Claude error (404): model: claude-3-5-sonnet-20241022
API Claude error (404): model: claude-3-5-sonnet-20240620
```

Les deux versions du modèle donnent une erreur 404. Cela peut indiquer :

1. **Problème de clé API** - La clé n'a pas accès à ces modèles
2. **Problème de crédits** - Le compte n'a plus de crédits
3. **Problème de permissions** - La clé est limitée à certains modèles
4. **Nom de modèle incorrect** - Besoin d'utiliser un alias ou nom différent

---

## 🧪 TEST 1: Vérifier la clé API manuellement

### Via curl (terminal):

```bash
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: VOTRE_CLE_API_ICI" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-dangerous-direct-browser-access: true" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 100,
    "messages": [{
      "role": "user",
      "content": "Test"
    }]
  }'
```

**Résultat attendu si OK:**
```json
{
  "id": "msg_...",
  "type": "message",
  "content": [{"type": "text", "text": "..."}]
}
```

**Si erreur 404:**
Essayer avec d'autres noms de modèles :
- `claude-3-opus-20240229`
- `claude-3-sonnet-20240229`
- `claude-3-haiku-20240307`

---

## 🧪 TEST 2: Tester via Console DevTools de l'extension

1. Ouvrir l'extension sur une page web
2. F12 → Console
3. Coller ce code:

```javascript
// Test avec claude-3-5-sonnet-20241022
chrome.storage.local.get(['claudeApiKey'], async (result) => {
  const apiKey = result.claudeApiKey;
  console.log('🔑 Clé API:', apiKey ? apiKey.substring(0, 20) + '...' : 'NON TROUVÉE');

  if (!apiKey) {
    console.error('❌ Aucune clé API configurée');
    return;
  }

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'callClaudeAPI',
      apiKey: apiKey,
      prompt: 'Test'
    });

    console.log('✅ SUCCÈS:', response);
  } catch (error) {
    console.error('❌ ERREUR:', error);
  }
});
```

---

## 🔧 SOLUTIONS POSSIBLES

### Solution 1: Essayer claude-3-opus-20240229

Si votre clé n'a pas accès à Claude 3.5 Sonnet, essayez Claude 3 Opus :

**Modifier `background.js` ligne 43:**
```javascript
model: 'claude-3-opus-20240229',  // Au lieu de claude-3-5-sonnet-20241022
```

### Solution 2: Essayer claude-3-sonnet-20240229

Pour une version moins coûteuse :

**Modifier `background.js` ligne 43:**
```javascript
model: 'claude-3-sonnet-20240229',  // Claude 3 Sonnet (pas 3.5)
```

### Solution 3: Essayer claude-3-haiku-20240307

Pour le modèle le plus rapide et économique :

**Modifier `background.js` ligne 43:**
```javascript
model: 'claude-3-haiku-20240307',  // Claude 3 Haiku
```

### Solution 4: Vérifier les crédits du compte

1. Aller sur https://console.anthropic.com/settings/limits
2. Vérifier que vous avez des crédits disponibles
3. Vérifier que votre clé API n'est pas expirée

### Solution 5: Créer une nouvelle clé API

1. Aller sur https://console.anthropic.com/settings/keys
2. Créer une nouvelle clé API
3. Vérifier les permissions accordées à la clé
4. Reconfigurer dans l'extension

---

## 📋 MODÈLES CLAUDE DISPONIBLES (Janvier 2025)

### Claude 3.5 (Dernière génération)
- ✅ `claude-3-5-sonnet-20241022` - Le plus récent et performant
- ✅ `claude-3-5-sonnet-20240620` - Version précédente

### Claude 3 (Génération précédente)
- ✅ `claude-3-opus-20240229` - Le plus puissant (mais plus cher)
- ✅ `claude-3-sonnet-20240229` - Équilibre performance/coût
- ✅ `claude-3-haiku-20240307` - Le plus rapide et économique

---

## 🔍 VÉRIFICATIONS À FAIRE

### 1. Type de clé API
```bash
# La clé doit commencer par:
sk-ant-api03-...  # Clé API standard
```

### 2. Format de la clé
- ✅ Commence par `sk-ant-api`
- ✅ Pas d'espaces avant/après
- ✅ Copiée entièrement

### 3. Permissions de la clé
Dans la console Anthropic:
- Vérifier que "Messages API" est activé
- Vérifier les modèles autorisés
- Vérifier les limites de taux

### 4. Crédits disponibles
- Vérifier le solde sur console.anthropic.com
- Vérifier qu'il n'y a pas de limite de taux atteinte

---

## 🚨 SI RIEN NE FONCTIONNE

### Option A: Utiliser un proxy/server backend

Au lieu d'appeler l'API depuis le navigateur, créer un petit serveur Node.js qui fait l'appel:

1. Créer un serveur Express simple
2. Le serveur appelle l'API Claude
3. L'extension appelle votre serveur

### Option B: Utiliser mode Code uniquement

L'extension fonctionne très bien en mode "Code Analysis" sans IA:
- Détection automatique CMS, cache, technologies
- 14 analyses avancées SEO & Marketing
- Core Web Vitals
- Recommandations basées sur les bonnes pratiques

Juste ne pas configurer de clé API et utiliser le mode Code.

---

## 📞 CONTACT SUPPORT ANTHROPIC

Si l'erreur persiste:
1. Support: https://support.anthropic.com
2. Email: support@anthropic.com
3. Discord: https://discord.gg/anthropic

Fournir:
- Votre clé API (première partie seulement: sk-ant-api03-...)
- Le message d'erreur exact
- Le modèle que vous essayez d'utiliser

---

## ✅ PROCHAINE ÉTAPE

**Pour l'instant, je recommande:**

1. **Tester avec curl** (commande ci-dessus)
2. **Si 404 persiste**, essayer `claude-3-opus-20240229`
3. **Vérifier les crédits** sur console.anthropic.com
4. **Si tout échoue**, utiliser le mode Code (sans IA)

Le mode Code de l'extension est déjà très complet et professionnel !
