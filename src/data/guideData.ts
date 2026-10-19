export interface SetupPhase {
  id: number;
  title: string;
  tagline: string;
  timeEstimate: string;
  oneTimeOnly: boolean;
  steps: {
    title: string;
    description: string;
    code?: string;
    tip?: string;
    warning?: string;
    actionRequired?: string;
  }[];
}

export const SETUP_PHASES: SetupPhase[] = [
  {
    id: 1,
    title: 'Android Phone Preparation',
    tagline: 'Unlock Developer Options & enable USB debugging',
    timeEstimate: '2 minutes',
    oneTimeOnly: true,
    steps: [
      {
        title: 'Unlock Developer Options',
        description: 'On your Android phone, navigate to Settings > About Phone. Locate "Build Number" (on Samsung: Software Information > Build Number; on Xiaomi: MIUI/HyperOS Version). Tap it rapidly 7 times until you see the prompt "You are now a developer!".',
        tip: 'If prompted, enter your phone lockscreen PIN or pattern to confirm.'
      },
      {
        title: 'Enable USB Debugging',
        description: 'Go to Settings > System > Developer Options (or Settings > Additional Settings > Developer Options). Scroll down and toggle ON "USB Debugging".',
        warning: 'Ensure your phone is in your physical hands during this step.'
      },
      {
        title: 'Xiaomi / HyperOS Specific Setting (If applicable)',
        description: 'If you use a Xiaomi, Redmi, or Poco device, scroll down in Developer Options and enable "USB debugging (Security settings)". This requires a Mi account and permits remote touch/mouse injection.',
        tip: 'Without this toggle on MIUI/HyperOS, scrcpy can display the screen but cannot click or type.'
      },
      {
        title: 'Disable Battery Optimization for Persistent Services',
        description: 'Go to Settings > Battery > Battery Optimization (or Apps > Special App Access > Battery Optimization). Find Tailscale (which we install in Step 2) and select "Don\'t optimize" or "Unrestricted".',
        tip: 'This prevents Android from killing the background VPN tunnel when your phone is locked.'
      }
    ]
  },
  {
    id: 2,
    title: 'Tailscale Encrypted Mesh VPN',
    tagline: 'Private WireGuard tunnel connecting Windows and Android without open ports',
    timeEstimate: '3 minutes',
    oneTimeOnly: true,
    steps: [
      {
        title: 'Install Tailscale on Windows Laptop',
        description: 'Download and install the official Tailscale client from https://tailscale.com/download/windows. Sign in with your Google, Microsoft, or GitHub account.',
        code: 'tailscale status'
      },
      {
        title: 'Install Tailscale on Android Phone',
        description: 'Install Tailscale from the Google Play Store or F-Droid. Sign in using the EXACT same account you used on Windows.',
        tip: 'Once signed in, both your laptop and phone are placed inside your private encrypted Tailnet.'
      },
      {
        title: 'Connect & Note Your Phone\'s Tailscale IP',
        description: 'Toggle the switch in the Android Tailscale app to "Connected". Look at the IP address assigned at the top of the Tailscale app (starts with 100.x.y.z, for example 100.86.14.92).',
        code: 'Example IP: 100.86.14.92',
        tip: 'This 100.x.y.z IP is static for this device inside your private Tailnet. It will NOT change even if you travel, switch to cellular data, or connect to a public cafe Wi-Fi.'
      },
      {
        title: 'Verify PC-to-Phone Ping',
        description: 'Open Command Prompt on Windows and ping your phone\'s Tailscale IP to verify the encrypted tunnel is active.',
        code: 'ping 100.86.14.92'
      }
    ]
  },
  {
    id: 3,
    title: 'Initial USB Pairing & TCP/IP Binding',
    tagline: 'Authorize your laptop\'s RSA key and bind adbd to port 5555',
    timeEstimate: '1 minute',
    oneTimeOnly: true,
    steps: [
      {
        title: 'Plug Phone into Windows PC via USB',
        description: 'Connect the phone using a quality USB data cable. Ensure the phone screen is unlocked.'
      },
      {
        title: 'Accept "Always Allow" RSA Key Prompt',
        description: 'A dialog box will pop up on your phone: "Allow USB debugging?". CHECK THE BOX that says "Always allow from this computer" and tap "Allow".',
        warning: 'CRITICAL: If you forget to check "Always allow", the phone will reject wireless connections when you unplug the cable!'
      },
      {
        title: 'Run 01_initial_usb_setup.bat',
        description: 'Double-click scripts\\01_initial_usb_setup.bat (or run setup.ps1). This executes `adb tcpip 5555`. The Android OS daemon will restart and begin listening on port 5555 on all network adapters, including Tailscale.',
        code: 'adb.exe tcpip 5555\n:: Expected output: "restarting in TCP mode port: 5555"'
      },
      {
        title: 'Unplug the USB Cable Forever',
        description: 'Once `restarting in TCP mode port: 5555` appears, unplug the USB cable. The phone is now primed for wireless and remote mirroring.'
      }
    ]
  },
  {
    id: 4,
    title: 'Daily Remote Mirroring & Control',
    tagline: 'One-click launch across Wi-Fi, 4G/5G, or different locations',
    timeEstimate: '5 seconds',
    oneTimeOnly: false,
    steps: [
      {
        title: 'Double-Click start-remote.bat',
        description: 'Whenever you want to access your phone, ensure Tailscale is active on your laptop and double-click start-remote.bat.',
        code: 'start-remote.bat'
      },
      {
        title: 'Phone Screen Mirrored with scrcpy v3.3.4',
        description: 'The scrcpy window opens immediately. You have full mouse click, drag, scroll, and keyboard input.',
        tip: 'Press Alt+O to turn phone screen on/off. Press Alt+H for Home, Alt+B for Back, Alt+S for App Switcher.'
      },
      {
        title: 'Clean Disconnect',
        description: 'When finished, simply close the scrcpy window or double-click scripts\\03_disconnect.bat to terminate the ADB connection cleanly.',
        code: 'scripts\\03_disconnect.bat'
      }
    ]
  }
];
