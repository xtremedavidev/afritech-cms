#!/bin/bash
set -e

APP_NAME="afritech54-cms"
APP_DIR="$HOME/apps/$APP_NAME"
WWW_DIR="/var/www/$APP_NAME"

echo "🚀 Starting deployment of $APP_NAME..."

# Go to app
cd $APP_DIR

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
bun install --frozen-lockfile

echo "🏗️ Building project..."
bun run build

echo "📂 Updating web root..."
sudo rm -rf $WWW_DIR/*
sudo cp -r dist/* $WWW_DIR/

echo "🔄 Reloading Caddy..."
sudo systemctl reload caddy

echo "✅ Deployment completed! Visit https://admin.afritech54.com"
