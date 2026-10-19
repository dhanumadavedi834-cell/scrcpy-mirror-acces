import { SecurityMatrixItem } from '../types';

export const PERSISTENCE_MATRIX: SecurityMatrixItem[] = [
  {
    feature: 'RSA Key Authorization (PC Trust)',
    persistsAcrossReboot: true,
    requiresPhysicalAccess: false,
    behaviorDetails: 'Checking "Always allow from this computer" writes your PC\'s public key into /data/misc/adb/adb_keys. This survives all phone restarts, system updates, and app installs indefinitely until manually revoked in Developer Options.',
    recommendation: 'Permanent. Only needs to be done once during initial USB setup.'
  },
  {
    feature: 'Tailscale VPN Static IP (100.x.y.z)',
    persistsAcrossReboot: true,
    requiresPhysicalAccess: false,
    behaviorDetails: 'Tailscale assigns a fixed, static CGNAT IPv4 address to your Android device within your private Tailnet. Tailscale automatically starts on boot (if Android allows auto-start) and retains the exact same IP address whether you are on home Wi-Fi, mobile 5G, or abroad.',
    recommendation: 'Permanent. Enable "Run on device startup" in Tailscale settings and set battery usage to "Unrestricted".'
  },
  {
    feature: 'Network Roaming (Wi-Fi to 4G/5G)',
    persistsAcrossReboot: true,
    requiresPhysicalAccess: false,
    behaviorDetails: 'WireGuard protocol uses connectionless UDP with cryptographic endpoint roaming. When your phone drops Wi-Fi and connects to mobile 5G, WireGuard updates its endpoint seamlessly within seconds without renegotiating security keys.',
    recommendation: 'Persistent across network handoffs. Remote session can reconnect automatically.'
  },
  {
    feature: 'ADB TCP/IP Listening Port 5555 (adb tcpip 5555)',
    persistsAcrossReboot: false,
    requiresPhysicalAccess: true,
    behaviorDetails: 'Android OS kernel security policy explicitly resets `service.adb.tcp.port` to -1 (disabled) whenever the device powers off or restarts. Therefore, adbd stops listening on port 5555 on reboot.',
    recommendation: 'After a phone reboot, you must either: (A) Plug USB cable in and run `adb tcpip 5555`, or (B) Pair via Android 11+ Wireless Debugging. Unattended access across cold reboots is mathematically impossible on unrooted standard Android.'
  },
  {
    feature: 'Android Direct Boot / File-Based Encryption (FBE)',
    persistsAcrossReboot: false,
    requiresPhysicalAccess: true,
    behaviorDetails: 'On Android 7.0+ with File-Based Encryption, the user credential storage is locked until the user physically unlocks the phone once after booting ("Before First Unlock" state). Apps (including Tailscale) run in a restricted Direct Boot mode and ADB key storage is unavailable.',
    recommendation: 'If the phone restarts, the physical phone PIN/Pattern must be entered at least once to unlock user storage and initialize user-space networking.'
  },
  {
    feature: 'Lockscreen Unlocking via Remote Keyboard',
    persistsAcrossReboot: true,
    requiresPhysicalAccess: false,
    behaviorDetails: 'During normal operation (device has been unlocked at least once since boot), if the screen locks, scrcpy CAN mirror the lock screen. You can unlock it by typing your numeric PIN or password on your laptop keyboard, or clicking the keypad numbers.',
    recommendation: 'Fully controllable remotely! Biometric unlocking (fingerprint/face) cannot be triggered remotely, but PIN/Password fallback works seamlessly.'
  },
  {
    feature: 'Screen Capture Approval Prompts',
    persistsAcrossReboot: true,
    requiresPhysicalAccess: false,
    behaviorDetails: 'Unlike third-party Android screen recording apps that use Android\'s MediaProjection API and force a popup ("App will start capturing everything that\'s displayed on your screen"), scrcpy runs via `adb shell` (UID 2000), which directly calls internal SurfaceControl/DisplayManager APIs. No user-facing recording approval popup is triggered on stock Android!',
    recommendation: 'Zero recurring approval dialogs during regular scrcpy sessions.'
  },
  {
    feature: 'Protected Apps (FLAG_SECURE / Banking / DRM)',
    persistsAcrossReboot: true,
    requiresPhysicalAccess: true,
    behaviorDetails: 'When opening certain banking apps, password managers, or DRM video streams (Netflix, Disney+), Android enforces WindowManager.LayoutParams.FLAG_SECURE. The Android display server blacks out the video feed for that window.',
    recommendation: 'Security feature enforced by Android OS. Normal desktop/apps are visible; secure banking screens appear black to prevent recording.'
  },
  {
    feature: 'Android 11+ Wireless Debugging Pairing',
    persistsAcrossReboot: false,
    requiresPhysicalAccess: true,
    behaviorDetails: 'Wireless Debugging generates a randomized dynamic TCP port (e.g., 38941) every time it is enabled, and by default automatically shuts off when leaving the trusted Wi-Fi network.',
    recommendation: 'Use `adb tcpip 5555` over USB initially rather than native Wireless Debugging, because port 5555 binds to the Tailscale virtual interface and remains static across all networks.'
  }
];

export const OS_BEHAVIOR_SCENARIOS = [
  {
    title: 'Scenario 1: Phone Restarts (Cold Boot)',
    status: 'Requires Action',
    badgeColor: 'amber',
    whatHappens: 'Android restarts in Direct Boot mode. adbd resets its TCP/IP listener to USB-only. Tailscale may not initialize user profile keys until first unlock.',
    solution: 'Unlock the phone physically with your PIN once, and connect USB cable to run `01_initial_usb_setup.bat` (or use Android 11+ Wireless Debugging on local Wi-Fi).'
  },
  {
    title: 'Scenario 2: Phone Switches from Home Wi-Fi to 4G/5G Cellular Data',
    status: 'Seamless',
    badgeColor: 'emerald',
    whatHappens: 'Tailscale WireGuard mesh updates UDP roaming endpoints automatically. The phone keeps its static 100.x.y.z IP address. adbd continues listening on port 5555 on the Tailscale interface.',
    solution: 'No action required. Run `start-remote.bat` from your laptop as usual.'
  },
  {
    title: 'Scenario 3: Phone Screen Turns Off & Locks on Desk',
    status: 'Fully Controllable',
    badgeColor: 'emerald',
    whatHappens: 'Phone enters sleep mode. Tailscale remains active if battery optimization is disabled. scrcpy wakes the display on connection and mirrors the lock screen.',
    solution: 'Type your PIN on your Windows keyboard to unlock. Use `--turn-screen-off` flag so the physical phone stays dark while you use it remotely.'
  },
  {
    title: 'Scenario 4: Temporary Internet / Cellular Disconnection',
    status: 'Auto-Recoverable',
    badgeColor: 'blue',
    whatHappens: 'The active scrcpy window may freeze or close. When internet connectivity returns to either device, Tailscale re-establishes the tunnel.',
    solution: 'Double-click `scripts\\02_reconnect.bat` to re-sync the ADB daemon and resume mirroring.'
  }
];
