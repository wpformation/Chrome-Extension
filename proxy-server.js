#!/usr/bin/env node

/**
 * PROXY SERVER SIMPLE POUR API CLAUDE
 *
 * Ce serveur résout le problème des appels browser-direct.
 * L'extension appelle ce serveur local, qui appelle ensuite l'API Claude.
 *
 * INSTALLATION:
 * npm install express cors node-fetch
 *
 * UTILISATION:
 * node proxy-server.js
 *
 * Le serveur démarre sur http://localhost:3000
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Permettre CORS pour l'extension Chrome
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Endpoint pour appeler l'API Claude
app.post('/api/claude', async (req, res) => {
  const { apiKey, prompt } = req.body;

  if (!apiKey || !prompt) {
    return res.status(400).json({
      error: 'Missing apiKey or prompt'
    });
  }

  console.log('📤 Requête reçue de l\'extension');
  console.log('🔑 Clé API:', apiKey.substring(0, 15) + '...');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
        // PAS besoin de 'anthropic-dangerous-direct-browser-access' depuis un serveur
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
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

    console.log('📥 Réponse API Claude - Status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Erreur API:', error);
      return res.status(response.status).json({
        error: error.error?.message || response.statusText
      });
    }

    const data = await response.json();
    console.log('✅ Succès - Réponse envoyée à l\'extension');

    res.json({
      success: true,
      data: data.content[0].text
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running' });
});

app.listen(PORT, () => {
  console.log('✅ Proxy server démarré sur http://localhost:' + PORT);
  console.log('📝 Endpoint: POST http://localhost:' + PORT + '/api/claude');
  console.log('');
  console.log('Configurez l\'extension pour utiliser ce proxy au lieu de l\'API directe.');
});
