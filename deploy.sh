#!/bin/bash
# deploy.sh — Script de redespliegue rápido FarmaLuz
# Uso: bash deploy.sh

set -e

echo "🚀 Iniciando redespliegue de FarmaLuz..."

echo "📥 Actualizando código desde GitHub..."
git pull origin main

echo "📦 Activando entorno virtual..."
source backend/venv/bin/activate

echo "📦 Instalando dependencias..."
pip install -r backend/requirements.txt --quiet

echo "🔄 Reiniciando servicio..."
sudo systemctl restart farmaluz.service

echo "⏳ Esperando 5 segundos..."
sleep 5

echo "✅ Verificando estado del servicio..."
sudo systemctl status farmaluz.service --no-pager

echo "🎉 Redespliegue completado."