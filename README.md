AntikTV Pi 4 Appliance — headless, CEC remote, EPG, Widevine, Chromium-on-Wayland (Bookworm)

This repo turns a Raspberry Pi 4 (Raspberry Pi OS Lite — Bookworm) into a single-purpose AntikTV appliance that boots straight into a fullscreen TV app. It uses Wayland+cage, Chromium (for Widevine/EME), a tiny CEC→keyboard daemon, and a TypeScript SPA with Shaka Player.

Highlights

- No desktop/X11. Wayland DRM/KMS via cage.
- HDMI-CEC TV remote input via libcec → uinput (keyboard events).
- Widevine DRM playback (you supply libwidevinecdm.so).
- Live TV with OSD, channel list, mini/full EPG grid, fast zapping.
- Resilient: systemd services with auto-restart, offline banners, retries.

What you’ll do

1) Flash Raspberry Pi OS Lite (Bookworm). 2) Copy this repo to the Pi. 3) Put your libwidevinecdm.so and config.json on the Pi. 4) Run install.sh. 5) Reboot. TV should show AntikTV UI and accept TV remote keys over CEC.

Contents

- Scripts: install.sh, update.sh, reset.sh, collect-logs.sh
- Services: systemd/antik-kiosk.service, systemd/cec-input.service
- CEC daemon: cec-input/ (Python, libcec, uinput), keymap.json
- App: app/ (TypeScript + Vite + Shaka), index.html, styles.css, tests
- Config: config.sample.json (copy to /home/kiosk/app/config.json and edit)

Non‑negotiable constraints (satisfied)

- Target: Raspberry Pi 4 (4 GB/8 GB)
- OS: Raspberry Pi OS Lite (Bookworm)
- Graphics: Wayland + cage over DRM/KMS; no X11
- Runtime: Chromium kiosk for EME/Widevine; SPA with Shaka Player
- CEC: libcec + uinput → keyboard events consumed by the SPA
- Boot: Autologin → start app full-screen via systemd service
- EPG: Now/Next and multi-hour grid; cached; quick rendering
- Video: H.264/H.265 with hardware decode where available
- Resilience: systemd Restart=always; network-aware app

Architecture (Option A)

- cage (Wayland single-app compositor) starts Chromium in kiosk mode.
- Chromium loads file:///home/kiosk/app/index.html (built SPA) and uses Widevine.
- cec-input daemon listens to HDMI-CEC and injects Linux keyboard events via /dev/uinput.
- The SPA handles only keyboard, not CEC specifics.

Package list and exact apt commands (Bookworm)

Run on the Pi (armhf or aarch64):

```
sudo apt-get update
sudo apt-get install -y \
  chromium \
  cage \
  libcec6 cec-utils python3-cec \
  python3-uinput \
  fonts-liberation ca-certificates \
  jq curl \
  unclutter \
  nodejs npm \
  libva-drm2 libva2 vainfo \
  xdg-user-dirs
```

Notes

- python3-cec provides Python bindings to libcec; cec-utils provides cec-client.
- nodejs/npm are only used once to build the SPA on-device if you don’t pre-build.
- libva packages enable VAAPI plumbing; Chromium uses V4L2/VAAPI on Pi 4 with flags.

Create the kiosk user (verbatim)

```
sudo useradd -m -s /bin/bash kiosk
sudo usermod -aG video,input,render kiosk
```

Filesystem layout on the Pi

- /home/kiosk/app/ … built SPA (index.html, assets, config.json)
- /opt/cec-input/cec-input.py … CEC→uinput daemon
- /etc/cec-input/keymap.json … editable key mapping
- /etc/systemd/system/antik-kiosk.service … kiosk launcher
- /etc/systemd/system/cec-input.service … CEC daemon unit
- Widevine CDM (you place): see Widevine section below

Example tree after install:

```
/home/kiosk/app/
  index.html
  styles.css
  config.json
  assets/
/opt/cec-input/
  cec-input.py
/etc/cec-input/
  keymap.json
/etc/systemd/system/
  antik-kiosk.service
  cec-input.service
```

Widevine integration (armhf vs aarch64)

- armhf path:
  /usr/lib/chromium/WidevineCdm/_platform_specific/linux_arm/libwidevinecdm.so
- aarch64 path:
  /usr/lib/chromium/WidevineCdm/_platform_specific/linux_arm64/libwidevinecdm.so

Alternative: pass Chromium flag if you prefer to keep the CDM elsewhere:

- --widevine-path=/path/to/libwidevinecdm.so

Verify EME availability in the app:

```
const configs = [{
  initDataTypes: ['cenc'],
  audioCapabilities: [{ contentType: 'audio/mp4; codecs="mp4a.40.2"' }],
  videoCapabilities: [{ contentType: 'video/mp4; codecs="avc1.4d401f"' }],
}];
const ok = await navigator.requestMediaKeySystemAccess('com.widevine.alpha', configs)
  .then(() => true)
  .catch(() => false);
```

At runtime you can also check chrome://components in a desktop Chromium to see Widevine status; on kiosk builds, rely on the in-app check and license responses.

Chromium kiosk ExecStart (verbatim example)

```
ExecStart=cage -- chromium --kiosk --incognito \
  --noerrdialogs --autoplay-policy=no-user-gesture-required \
  --ozone-platform=wayland --use-gl=egl \
  --enable-features=VaapiVideoDecodeLinuxGL,UseOzonePlatform \
  --disable-pinch --overscroll-history-navigation=0 \
  file:///home/kiosk/app/index.html
```

Our unit uses additional media flags for Pi 4 acceleration; see systemd/antik-kiosk.service.

Systemd unit skeletons

Both services include Restart=always and RestartSec=3, with After=network-online.target, and run as User=kiosk.

Install steps (end‑to‑end)

1) Flash Raspberry Pi OS Lite (Bookworm) to an SD card. Boot the Pi 4.
2) Ensure network and correct time zone (defaults to Europe/Vienna; configurable later).
3) Copy this repo to the Pi (e.g., /home/pi/antiktv) and change into it.
4) Put your Widevine CDM at a safe path and note it. Copy and edit config:
   - cp config.sample.json app/config.json and edit URLs, headers, timezone.
   - Put libwidevinecdm.so where you want; install.sh can copy it to Chromium’s path.
5) Run installer (as sudo):
   - sudo bash ./install.sh
   - It detects arch (armhf/aarch64), installs packages, creates kiosk user/groups,
     builds the SPA (or uses prebuilt app/dist if present), installs units, and
     optionally copies Widevine into Chromium if you specify WIDEVINE_SRC.
6) Enable autologin for kiosk user on tty1 (headless):
   - sudo raspi-config → System Options → Boot / Auto Login → Console Autologin (kiosk)
   - Or follow the README section “Autologin alternative”.
7) Reboot: sudo systemctl reboot
8) After boot, TV should show AntikTV and accept TV remote keys via CEC.

Autologin alternative (manual)

Create /etc/systemd/system/getty@tty1.service.d/autologin.conf:

```
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin kiosk --noclear %I $TERM
```

Then reload: sudo systemctl daemon-reload; sudo systemctl restart getty@tty1.service

Service management

- View logs: sudo journalctl -u antik-kiosk -u cec-input -f
- Restart services: sudo systemctl restart antik-kiosk cec-input
- Enable on boot: sudo systemctl enable antik-kiosk cec-input

Chromium performance flags (Pi 4)

Our unit passes a conservative set:

- --kiosk --incognito --noerrdialogs --disable-pinch --overscroll-history-navigation=0
- --autoplay-policy=no-user-gesture-required
- --ozone-platform=wayland --use-gl=egl --enable-features=UseOzonePlatform
- --enable-features=VaapiVideoDecodeLinuxGL,VaapiVideoDecoder,CanvasOopRasterization,UseSkiaRenderer
- --ignore-gpu-blocklist --enable-gpu-rasterization --enable-zero-copy
- Optional: --widevine-path=/…/libwidevinecdm.so if not placed in Chromium tree

Credentials

Configure your AntikTV account in /home/kiosk/app/config.json:

```json
{
  "antik": {
    "email": "your-email@example.com",
    "password": "your-password",
    "deviceId": ""
  }
}
```

The deviceId can be left empty for automatic generation. For production deployments, you can also use environment variables:

```
ANTIK_USER=your-email@example.com
ANTIK_PASS=your-password
ANTIK_DEVICE_ID=your-device-id
```

Environment variables take precedence over config file settings.

Security notes

- Services run as unprivileged kiosk user; password login not required for boot.
- SSH is disabled by default on fresh Pi OS; enable only for debugging: sudo raspi-config.
- config.json may include license headers; the app never logs header values.

Logging & support

- Journald collects service logs. See collect-logs.sh for bundling logs.
- Log rotation is handled by journald; adjust in /etc/systemd/journald.conf if needed.

Functional features in the SPA

- Live playback with Shaka Player (DASH + Widevine; HLS optional).
- Fast zapping by reusing the same video element and Shaka instance.
- Mini EPG overlay (2 hours) and full EPG grid (2–6 hours view).
- Channel list with logos; numeric zapping; CH+/−; Back handling.
- Offline banner with automatic retry and exponential backoff for license/network.
- Local caching (localStorage) of channels and EPG for faster startup.

Build and dev

- On a laptop: npm ci; npm run dev; open http://localhost:5173
- On the Pi: install.sh will build; or pre-build on a laptop and copy app/dist to /home/kiosk/app.

Acceptance checklist

- install.sh completes without errors on Bookworm armhf/aarch64
- After reboot, AntikTV is fullscreen and responds to TV remote
- 10 sample channels present; replace with real manifests/license servers later
- EPG grid renders within ~2s using cached data; zapping ~≤1.5s under good network
- No crash loops in journal over 24h

Troubleshooting

- If video is choppy, verify Chromium flags and that GPU is recognized (chrome://gpu).
- If Widevine fails, verify CDM path (see section) and check app’s EME status banner.
- If CEC doesn’t work, confirm TV CEC setting is enabled and run: echo scan | cec-client -s -d 1

License

MIT for code in this repo. You must supply your own Widevine CDM per its license.

---

SvelteKit SPA (development)

- The interactive SPA lives under `app/` and can run locally with mock data.
- To try real Antik credentials during dev:
  1) `cd app`
  2) copy `.env.example` to `.env` and set `ANTIK_EMAIL` and `ANTIK_PASSWORD`
  3) `npm i` then `npm run dev`
  4) Open http://localhost:5173

Server endpoints will prefer real Antik data when env vars are present and fall back to sample data on errors.
