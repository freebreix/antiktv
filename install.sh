#!/usr/bin/env bash
set -euo pipefail

# AntikTV installer for Raspberry Pi OS Lite (Bookworm)
# - Detects arch (armhf/aarch64)
# - Installs packages
# - Creates kiosk user
# - Builds SPA (or copies prebuilt dist)
# - Installs systemd units
# - Optionally installs Widevine CDM if WIDEVINE_SRC is provided

ARCH=$(dpkg --print-architecture) # armhf or arm64
KIOSK_UID=1001
KIOSK_USER=kiosk
REPO_DIR=$(cd "$(dirname "$0")" && pwd)

info() { echo "[+] $*"; }
warn() { echo "[!] $*"; }

if [[ $EUID -ne 0 ]]; then
  echo "Please run as root: sudo bash ./install.sh"
  exit 1
fi

info "Detected architecture: ${ARCH}"

info "Updating apt and installing packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y \
  chromium \
  weston \
  cage \
  libcec6 cec-utils python3-cec \
  python3-uinput \
  fonts-liberation ca-certificates \
  jq curl \
  unclutter \
  rsync \
  nodejs npm \
  libva-drm2 libva2 vainfo \
  xdg-user-dirs

# Fallback if python3-cec is unavailable on this distro variant
if ! python3 -c "import cec" >/dev/null 2>&1; then
  apt-get install -y python3-libcec || true
fi

if ! id -u ${KIOSK_USER} >/dev/null 2>&1; then
  info "Creating user ${KIOSK_USER}"
  useradd -m -s /bin/bash ${KIOSK_USER}
  usermod -aG video,input,render ${KIOSK_USER}
else
  info "User ${KIOSK_USER} already exists"
  usermod -aG video,input,render ${KIOSK_USER}
fi

# Ensure /usr/bin/chromium exists (RPi sometimes uses chromium-browser)
if ! command -v chromium >/dev/null 2>&1 && command -v chromium-browser >/dev/null 2>&1; then
  ln -sf "$(command -v chromium-browser)" /usr/bin/chromium
fi

# Ensure UID 1001 is kiosk; if not, preserve XDG_RUNTIME_DIR handling via systemd unit
ACT_UID=$(id -u ${KIOSK_USER})
if [[ "${ACT_UID}" != "${KIOSK_UID}" ]]; then
  warn "${KIOSK_USER} uid is ${ACT_UID}, not ${KIOSK_UID}. Adjusting systemd env dynamically."
  # Patch unit file env later
fi

# Install CEC daemon
install -d -o ${KIOSK_USER} -g ${KIOSK_USER} /opt/cec-input
install -d -o root -g root /etc/cec-input
install -m 0755 ${REPO_DIR}/cec-input/cec-input.py /opt/cec-input/cec-input.py
install -m 0644 ${REPO_DIR}/cec-input/keymap.json /etc/cec-input/keymap.json

# Build or copy app
APP_SRC=${REPO_DIR}/app
APP_DST=/home/${KIOSK_USER}/app
install -d -o ${KIOSK_USER} -g ${KIOSK_USER} ${APP_DST}
if [[ -d "${APP_SRC}/dist" ]]; then
  info "Found prebuilt app/dist; copying"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete ${APP_SRC}/dist/ ${APP_DST}/
  else
    cp -a ${APP_SRC}/dist/. ${APP_DST}/
  fi
else
  info "Building SPA with npm"
  cd ${APP_SRC}
  npm ci || npm install
  npm run build
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete dist/ ${APP_DST}/
  else
    cp -a dist/. ${APP_DST}/
  fi
fi
chown -R ${KIOSK_USER}:${KIOSK_USER} ${APP_DST}

# Copy config.sample.json if no config.json
if [[ ! -f ${APP_DST}/config.json ]]; then
  info "Installing sample config.json"
  install -m 0644 ${REPO_DIR}/config.sample.json ${APP_DST}/config.json
  chown ${KIOSK_USER}:${KIOSK_USER} ${APP_DST}/config.json
fi

# Widevine install (optional): set WIDEVINE_SRC=/path/to/libwidevinecdm.so
if [[ -n "${WIDEVINE_SRC:-}" ]]; then
  info "Installing Widevine CDM from ${WIDEVINE_SRC}"
  if [[ "${ARCH}" == "armhf" ]]; then
    DEST_DIR=/usr/lib/chromium/WidevineCdm/_platform_specific/linux_arm
  else
    DEST_DIR=/usr/lib/chromium/WidevineCdm/_platform_specific/linux_arm64
  fi
  install -d ${DEST_DIR}
  install -m 0644 "${WIDEVINE_SRC}" "${DEST_DIR}/libwidevinecdm.so"
  info "Widevine installed to ${DEST_DIR}/libwidevinecdm.so"
else
  warn "WIDEVINE_SRC not set; skipping CDM install. You can use --widevine-path= flag or rerun with WIDEVINE_SRC."
fi

# Install systemd units
info "Installing systemd unit files"
install -m 0644 ${REPO_DIR}/systemd/cec-input.service /etc/systemd/system/cec-input.service
install -m 0644 ${REPO_DIR}/systemd/antik-kiosk.service /etc/systemd/system/antik-kiosk.service

# If kiosk UID != 1001, patch XDG_RUNTIME_DIR in antik-kiosk.service
if [[ "${ACT_UID}" != "${KIOSK_UID}" ]]; then
  sed -i "s#/run/user/1001#/run/user/${ACT_UID}#g" /etc/systemd/system/antik-kiosk.service
fi

# Ensure runtime dir perms for Wayland if using /tmp/runtime-kiosk
grep -q "runtime-kiosk" /etc/systemd/system/antik-kiosk.service && chmod 700 /tmp/runtime-kiosk || true

systemctl daemon-reload
systemctl enable cec-input.service antik-kiosk.service

info "Done. Next steps:"
info "1) Ensure autologin for user 'kiosk' on tty1 (see README)."
info "2) Optionally set WIDEVINE_SRC and rerun install.sh to install CDM into Chromium."
info "3) Reboot: sudo systemctl reboot"
