@echo off
REM Script de test des modèles Claude sur Windows
REM Usage: Éditez ce fichier et remplacez VOTRE_CLE par votre vraie clé API

SET API_KEY=VOTRE_CLE_API_ICI

echo ========================================
echo TEST DES MODELES CLAUDE DISPONIBLES
echo ========================================
echo.

echo [1/5] Test: claude-3-5-sonnet-20241022 (Dernier Sonnet 3.5)
echo ----------------------------------------
curl -s -X POST https://api.anthropic.com/v1/messages ^
  -H "content-type: application/json" ^
  -H "x-api-key: %API_KEY%" ^
  -H "anthropic-version: 2023-06-01" ^
  -d "{\"model\":\"claude-3-5-sonnet-20241022\",\"max_tokens\":50,\"messages\":[{\"role\":\"user\",\"content\":\"Test\"}]}"
echo.
echo.

echo [2/5] Test: claude-3-5-sonnet-20240620 (Sonnet 3.5 ancien)
echo ----------------------------------------
curl -s -X POST https://api.anthropic.com/v1/messages ^
  -H "content-type: application/json" ^
  -H "x-api-key: %API_KEY%" ^
  -H "anthropic-version: 2023-06-01" ^
  -d "{\"model\":\"claude-3-5-sonnet-20240620\",\"max_tokens\":50,\"messages\":[{\"role\":\"user\",\"content\":\"Test\"}]}"
echo.
echo.

echo [3/5] Test: claude-3-opus-20240229 (Opus - Le plus puissant)
echo ----------------------------------------
curl -s -X POST https://api.anthropic.com/v1/messages ^
  -H "content-type: application/json" ^
  -H "x-api-key: %API_KEY%" ^
  -H "anthropic-version: 2023-06-01" ^
  -d "{\"model\":\"claude-3-opus-20240229\",\"max_tokens\":50,\"messages\":[{\"role\":\"user\",\"content\":\"Test\"}]}"
echo.
echo.

echo [4/5] Test: claude-3-sonnet-20240229 (Sonnet 3 - ancien)
echo ----------------------------------------
curl -s -X POST https://api.anthropic.com/v1/messages ^
  -H "content-type: application/json" ^
  -H "x-api-key: %API_KEY%" ^
  -H "anthropic-version: 2023-06-01" ^
  -d "{\"model\":\"claude-3-sonnet-20240229\",\"max_tokens\":50,\"messages\":[{\"role\":\"user\",\"content\":\"Test\"}]}"
echo.
echo.

echo [5/5] Test: claude-3-haiku-20240307 (Haiku - Le plus rapide)
echo ----------------------------------------
curl -s -X POST https://api.anthropic.com/v1/messages ^
  -H "content-type: application/json" ^
  -H "x-api-key: %API_KEY%" ^
  -H "anthropic-version: 2023-06-01" ^
  -d "{\"model\":\"claude-3-haiku-20240307\",\"max_tokens\":50,\"messages\":[{\"role\":\"user\",\"content\":\"Test\"}]}"
echo.
echo.

echo ========================================
echo FIN DES TESTS
echo ========================================
echo.
echo CHERCHEZ "content" dans les reponses ci-dessus.
echo Si vous voyez {"content":[{"text":"..."}]} = SUCCES
echo Si vous voyez "error" partout = Probleme de cle API
echo.
pause
