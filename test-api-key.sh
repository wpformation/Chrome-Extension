#!/bin/bash

# SCRIPT DE TEST API CLAUDE
# Ce script teste votre clé API directement

echo "🔍 TEST DE VOTRE CLÉ API CLAUDE"
echo "================================"
echo ""

# Remplacez par votre clé API complète
API_KEY="VOTRE_CLE_API_ICI"

echo "📤 Test 1: Claude 3 Opus"
echo "-------------------------"
curl -s https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-dangerous-direct-browser-access: true" \
  -d '{
    "model": "claude-3-opus-20240229",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Dis juste bonjour"}]
  }' | python3 -m json.tool
echo ""
echo ""

echo "📤 Test 2: Claude 3 Haiku (plus économique)"
echo "--------------------------------------------"
curl -s https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-dangerous-direct-browser-access: true" \
  -d '{
    "model": "claude-3-haiku-20240307",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Dis juste bonjour"}]
  }' | python3 -m json.tool
echo ""
echo ""

echo "✅ SI VOUS VOYEZ UN MESSAGE DE SUCCÈS:"
echo "   Le problème vient de l'extension"
echo ""
echo "❌ SI VOUS VOYEZ UNE ERREUR 404:"
echo "   → Allez sur console.anthropic.com"
echo "   → Settings → Billing"
echo "   → Ajoutez une méthode de paiement et des crédits"
echo ""
echo "❌ SI VOUS VOYEZ UNE ERREUR 401:"
echo "   → Votre clé API est invalide"
echo "   → Créez une nouvelle clé"
echo ""
