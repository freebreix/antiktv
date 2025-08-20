#!/usr/bin/env bash

# Development startup script for AntikTV Tauri app
# This script starts the SvelteKit dev server

echo "🚀 Starting AntikTV Tauri Development Environment"

# Check if MPV is installed
if ! command -v mpv &> /dev/null; then
    echo "❌ MPV not found! Please install MPV:"
    echo "  - Windows: Download from https://mpv.io/installation/ or 'choco install mpv'"
    echo "  - macOS: 'brew install mpv'"
    echo "  - Linux: 'sudo apt install mpv' (Ubuntu/Debian) or 'sudo dnf install mpv' (Fedora)"
    exit 1
fi

echo "✅ MPV found: $(which mpv)"

# Set development environment
export NODE_ENV=development

# Start SvelteKit dev server
echo "🌐 Starting SvelteKit dev server..."
npm run dev
