#!/usr/bin/env bash
set -euo pipefail
# Clear caches, logs, EPG

echo "[+] Stopping services"
sudo systemctl stop antik-kiosk || true

APP_DIR=/home/kiosk/app

echo "[+] Clearing Chromium cache for kiosk (if any)"
sudo rm -rf /home/kiosk/.cache/chromium /home/kiosk/.config/chromium || true
sudo rm -rf /home/kiosk/.cache /home/kiosk/.config || true


echo "[+] Clearing app caches (local EPG, storage)"
sudo rm -rf ${APP_DIR}/storage || true


echo "[+] Truncating journals"
sudo journalctl --rotate --vacuum-time=1s


echo "[+] Starting services"
sudo systemctl start antik-kiosk || true

echo "[+] Done"
