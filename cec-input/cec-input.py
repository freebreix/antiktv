#!/usr/bin/env python3
import argparse
import json
import logging
import os
import signal
import sys
import time

try:
    import cec
except Exception as e:
    print("libcec not available: {}".format(e), file=sys.stderr)
    sys.exit(1)

try:
    import uinput
except Exception as e:
    print("python3-uinput not available: {}".format(e), file=sys.stderr)
    sys.exit(1)

LOG = logging.getLogger("cec-input")
logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(levelname)s %(message)s')

DEFAULT_KEYMAP = {
    "up": "KEY_UP",
    "down": "KEY_DOWN",
    "left": "KEY_LEFT",
    "right": "KEY_RIGHT",
    "enter": "KEY_ENTER",
    "back": "KEY_BACKSPACE",
    "play": "KEY_PLAYPAUSE",
    "pause": "KEY_PLAYPAUSE",
    "channel_up": "KEY_CHANNELUP",
    "channel_down": "KEY_CHANNELDOWN",
    "num0": "KEY_0",
    "num1": "KEY_1",
    "num2": "KEY_2",
    "num3": "KEY_3",
    "num4": "KEY_4",
    "num5": "KEY_5",
    "num6": "KEY_6",
    "num7": "KEY_7",
    "num8": "KEY_8",
    "num9": "KEY_9"
}

CEC_TO_SYMBOL = {}

def _add_cec_mapping(attr_name: str, symbol: str) -> None:
    """Add a mapping from a libcec constant name to a symbol if the
    attribute exists on the imported `cec` module. This avoids import-time
    AttributeErrors when running against different libcec versions.
    """
    val = getattr(cec, attr_name, None)
    if val is not None:
        CEC_TO_SYMBOL[val] = symbol

# Populate known user control mappings safely (some constants may be
# unavailable depending on the libcec version installed).
for name, sym in [
    ("CEC_USER_CONTROL_CODE_UP", "up"),
    ("CEC_USER_CONTROL_CODE_DOWN", "down"),
    ("CEC_USER_CONTROL_CODE_LEFT", "left"),
    ("CEC_USER_CONTROL_CODE_RIGHT", "right"),
    ("CEC_USER_CONTROL_CODE_SELECT", "enter"),
    ("CEC_USER_CONTROL_CODE_EXIT", "back"),
    ("CEC_USER_CONTROL_CODE_PLAY", "play"),
    ("CEC_USER_CONTROL_CODE_PAUSE", "pause"),
    ("CEC_USER_CONTROL_CODE_CHANNEL_UP", "channel_up"),
    ("CEC_USER_CONTROL_CODE_CHANNEL_DOWN", "channel_down"),
    ("CEC_USER_CONTROL_CODE_NUMBER0", "num0"),
    ("CEC_USER_CONTROL_CODE_NUMBER1", "num1"),
    ("CEC_USER_CONTROL_CODE_NUMBER2", "num2"),
    ("CEC_USER_CONTROL_CODE_NUMBER3", "num3"),
    ("CEC_USER_CONTROL_CODE_NUMBER4", "num4"),
    ("CEC_USER_CONTROL_CODE_NUMBER5", "num5"),
    ("CEC_USER_CONTROL_CODE_NUMBER6", "num6"),
    ("CEC_USER_CONTROL_CODE_NUMBER7", "num7"),
    ("CEC_USER_CONTROL_CODE_NUMBER8", "num8"),
    ("CEC_USER_CONTROL_CODE_NUMBER9", "num9")
]:
    _add_cec_mapping(name, sym)

KEY_NAME_TO_CODE = {name: getattr(uinput, name) for name in dir(uinput) if name.startswith("KEY_")}

class CecInput:
    def __init__(self, keymap_path: str | None):
        self.keymap = DEFAULT_KEYMAP.copy()
        if keymap_path and os.path.isfile(keymap_path):
            try:
                with open(keymap_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, dict):
                        self.keymap.update(data)
                        LOG.info("Loaded keymap from %s", keymap_path)
            except Exception as e:
                LOG.warning("Failed to load keymap %s: %s", keymap_path, e)

        # Setup uinput device with all keys we may emit
        events = list({KEY_NAME_TO_CODE.get(code) for code in self.keymap.values() if KEY_NAME_TO_CODE.get(code)})
        self.device = uinput.Device(events or [uinput.KEY_ENTER])

        # Setup CEC
        self.config = cec.libcec_configuration()
        self.config.strDeviceName = "antik-cec"
        self.config.clientVersion = cec.LIBCEC_VERSION_CURRENT
        self.config.deviceTypes.Add(cec.CEC_DEVICE_TYPE_RECORDING_DEVICE)
        self.config.SetLogCallback(self._on_cec_log)
        self.config.SetKeyPressCallback(self._on_cec_keypress)
        self.lib = cec.ICECAdapter.Create(self.config)
        if not self.lib:
            raise RuntimeError("Failed to create CEC adapter")
        if not self.lib.Open("RPI"):
            # Try auto-detect
            adapters = self.lib.DetectAdapters()
            if adapters and len(adapters) > 0:
                path = adapters[0].strComName
                LOG.info("Opening CEC adapter %s", path)
                if not self.lib.Open(path):
                    raise RuntimeError("Failed to open CEC adapter")
            else:
                raise RuntimeError("No CEC adapters detected")

    def _on_cec_keypress(self, key, duration):
        """Called by libcec when a key is pressed on the remote"""
        try:
            symbol = CEC_TO_SYMBOL.get(key)
            if symbol:
                mapped = self.keymap.get(symbol)
                if mapped:
                    self._emit_key(mapped)
                else:
                    LOG.debug("No mapping for %s", symbol)
        except Exception as e:
            LOG.warning("CEC keypress error: %s", e)
        return 0

    def _on_cec_log(self, level, time, message):
        # Keep it quiet unless errors
        if level <= cec.CEC_LOG_ERROR:
            LOG.error("CEC: %s", message)

    def _emit_key(self, key_name: str):
        code = KEY_NAME_TO_CODE.get(key_name)
        if not code:
            LOG.debug("Unknown key name %s", key_name)
            return
        self.device.emit_click(code)
        LOG.debug("Emitted %s", key_name)

    def loop(self):
        LOG.info("Started CEC input loop")
        try:
            while True:
                time.sleep(0.1)
        except KeyboardInterrupt:
            pass


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--keymap', help='Path to keymap.json', default='/etc/cec-input/keymap.json')
    args = parser.parse_args()

    instance = CecInput(args.keymap)

    def shutdown(signum, frame):
        LOG.info("Shutting down")
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    instance.loop()

if __name__ == '__main__':
    main()
