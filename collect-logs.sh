#!/usr/bin/env bash
set -euo pipefail
OUT=${1:-antik-logs-$(date +%Y%m%d-%H%M%S).tar.gz}
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

journalctl -u antik-kiosk -u cec-input > ${TMP}/services.log || true
uname -a > ${TMP}/uname.txt
cat /etc/os-release > ${TMP}/os-release.txt
cec-client -l > ${TMP}/cec-adapters.txt 2>&1 || true
vainfo > ${TMP}/vainfo.txt 2>&1 || true

sudo tar -C ${TMP} -czf ${OUT} .
echo "[+] Logs written to ${OUT}"
