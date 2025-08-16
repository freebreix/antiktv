#!/usr/bin/env bash
set -euo pipefail
# Atomic update of app and services
REPO_DIR=$(cd "$(dirname "$0")" && pwd)
APP_DST=/home/kiosk/app
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

echo "[+] Building new app bundle"
cd ${REPO_DIR}/app
npm ci || npm install
npm run build

echo "[+] Staging to ${TMP}"
if command -v rsync >/dev/null 2>&1; then
	rsync -a ${REPO_DIR}/app/dist/ ${TMP}/
else
	cp -a ${REPO_DIR}/app/dist/. ${TMP}/
fi

echo "[+] Stopping services"
sudo systemctl stop antik-kiosk

echo "[+] Updating app atomically"
if command -v rsync >/dev/null 2>&1; then
	sudo rsync -a --delete ${TMP}/ ${APP_DST}/
else
	sudo rm -rf ${APP_DST}/*
	sudo cp -a ${TMP}/. ${APP_DST}/
fi
sudo chown -R kiosk:kiosk ${APP_DST}

echo "[+] Reloading units and restarting"
sudo systemctl daemon-reload
sudo systemctl start antik-kiosk

echo "[+] Update complete"
