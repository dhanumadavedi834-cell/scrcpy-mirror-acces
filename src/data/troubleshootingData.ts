import { TroubleshootingTopic } from '../types';

export const TROUBLESHOOTING_TOPICS: TroubleshootingTopic[] = [
  {
    id: 'unauthorized',
    symptom: 'ADB Error: "device unauthorized. This adb server\'s $ADB_VENDOR_KEYS is not set"',
    errorSnippet: 'adb.exe: error: device unauthorized. This adb server\'s $ADB_VENDOR_KEYS is not set',
    rootCause: 'The Android phone has not accepted the cryptographic RSA authorization key from your Windows computer, or you did not check "Always allow from this computer".',
    solutionSteps: [
      'Unlock your phone screen physically.',
      'Check if the "Allow USB debugging?" dialog is showing.',
      'CHECK the checkbox: "Always allow from this computer" and tap "Allow".',
      'If no popup appears, run: `adb kill-server && adb devices` or toggle USB Debugging OFF and ON in Developer Options.'
    ],
    diagnosticCommand: 'adb.exe devices'
  },
  {
    id: 'connection_refused',
    symptom: 'Connection Refused: "failed to connect to 100.x.y.z:5555: Connection refused"',
    errorSnippet: 'cannot connect to 100.86.14.92:5555: No connection could be made because the target machine actively refused it. (10061)',
    rootCause: 'The phone restarted or `adbd` is not listening on TCP port 5555. By default, Android resets the TCP port to -1 (disabled) after a reboot.',
    solutionSteps: [
      'Plug phone into Windows via USB cable.',
      'Run `scripts\\01_initial_usb_setup.bat` (or execute `adb tcpip 5555`).',
      'Verify that output displays: "restarting in TCP mode port: 5555".',
      'Unplug USB cable and retry `start-remote.bat`.'
    ],
    diagnosticCommand: 'adb.exe tcpip 5555'
  },
  {
    id: 'tailscale_timeout',
    symptom: 'Ping Timeout / Cannot reach 100.x.y.z',
    errorSnippet: 'Request timed out. Destination host unreachable.',
    rootCause: 'Tailscale VPN is disconnected on either the laptop or the phone, or Android Battery Saver put Tailscale to sleep.',
    solutionSteps: [
      'Check Tailscale on Windows: Right-click the Tailscale tray icon and ensure it is connected and logged in.',
      'Check Tailscale on Android: Open Tailscale app and verify the toggle switch is ON.',
      'Verify both devices are logged in with the SAME user account on the same Tailnet.',
      'On Android, go to Settings > Battery > Battery Optimization > Tailscale > Set to "Don\'t optimize" or "Unrestricted".'
    ],
    diagnosticCommand: 'ping 100.x.y.z'
  },
  {
    id: 'device_offline',
    symptom: 'Device Offline: "100.x.y.z:5555 offline"',
    errorSnippet: 'List of devices attached\n100.86.14.92:5555    offline',
    rootCause: 'The ADB daemon lost sync or network packet dropped during transition.',
    solutionSteps: [
      'Double-click `scripts\\02_reconnect.bat`.',
      'This terminates stale ADB daemons and executes: `adb disconnect && adb kill-server && adb connect 100.x.y.z:5555`.',
      'Within 3 seconds, `adb devices` will show "device" instead of "offline".'
    ],
    diagnosticCommand: 'adb.exe disconnect && adb.exe kill-server && adb.exe connect 100.x.y.z:5555'
  },
  {
    id: 'black_screen_flag_secure',
    symptom: 'Black Screen in Banking / Password Manager Apps',
    errorSnippet: '[WARN] SurfaceControl returned black buffer due to FLAG_SECURE',
    rootCause: 'Android OS security prohibits recording or mirroring screens that have `WindowManager.LayoutParams.FLAG_SECURE` enabled (banking apps, authenticator apps, Netflix/DRM).',
    solutionSteps: [
      'This is an intentional Android OS hardware security boundary.',
      'Return to home screen or switch to normal apps, and video will instantly resume.',
      'For apps that have an in-app toggle (some password managers allow "Allow screenshots"), toggle it ON inside the app settings.'
    ]
  },
  {
    id: 'xiaomi_click_fail',
    symptom: 'Can see the screen, but mouse clicks and keyboard do nothing (Xiaomi/Redmi/Poco)',
    errorSnippet: 'Injecting touch event rejected by system',
    rootCause: 'MIUI / HyperOS has a proprietary security protection that disables simulated touch input over ADB unless explicitly granted.',
    solutionSteps: [
      'Open Settings > Additional Settings > Developer Options on your Xiaomi device.',
      'Scroll down to "USB debugging (Security settings)" and toggle it ON.',
      'Follow the 3 countdown prompts (requires inserting a SIM card and Mi Account sign-in once).',
      'Once enabled, mouse clicks and keyboard typing will register immediately.'
    ]
  },
  {
    id: 'lag_and_stutter',
    symptom: 'Video stream stutters, has high latency, or freezes on mobile networks',
    errorSnippet: 'Device buffer overrun or frame drop',
    rootCause: 'Cellular network upload speed is insufficient for default high-bitrate video stream.',
    solutionSteps: [
      'Switch preset in the dashboard to "Low-Bandwidth Mobile Data".',
      'This sets: `--video-bit-rate=2M --max-fps=30 -m 1024 --no-audio`.',
      'Dropping audio forwarding and reducing resolution from 1080p to 1024p cuts data usage by ~70% and restores silky-smooth responsiveness.'
    ],
    diagnosticCommand: 'scrcpy.exe -s 100.x.y.z:5555 --video-bit-rate=2M --max-fps=30 -m 1024 --no-audio'
  },
  {
    id: 'adb_version_mismatch',
    symptom: 'ADB Server Version Mismatch: "adb server version (41) doesn\'t match this client (40)"',
    errorSnippet: 'adb server version (41) doesn\'t match this client (40); killing...',
    rootCause: 'Another software on your Windows PC (e.g. BlueStacks, Android Studio, Vysor, platform-tools in PATH) is running an older or newer adb.exe.',
    solutionSteps: [
      'Our scripts always use the dedicated `%~dp0scrcpy-win64-v3.3.4\\adb.exe` to avoid conflicts.',
      'Close any background Android emulators (BlueStacks, LDPlayer, Nox).',
      'Run `scripts\\03_disconnect.bat` to terminate all rogue adb.exe processes.'
    ],
    diagnosticCommand: 'taskkill /f /im adb.exe'
  }
];
