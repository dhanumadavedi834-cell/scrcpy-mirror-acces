import { Preset } from '../types';

export const PRESETS: Preset[] = [
  {
    id: 'balanced_remote',
    name: 'Balanced Remote (Recommended)',
    description: 'Optimal balance between image clarity, low bandwidth, and responsive touch/mouse control across different locations.',
    targetNetwork: 'Broadband, Office Wi-Fi, 4G/5G LTE',
    config: {
      videoBitrate: '4M',
      maxFps: 30,
      maxSize: 1280,
      turnScreenOff: true,
      stayAwake: true,
      forwardAudio: true,
      videoCodec: 'h264',
      lowLatencyBuffer: true,
      customFlags: ''
    }
  },
  {
    id: 'mobile_4g',
    name: 'Low-Bandwidth Mobile Data',
    description: 'Downscales video and disables audio to ensure instantaneous responsiveness on metered or weaker cellular networks.',
    targetNetwork: '3G, 4G LTE, High Latency Links',
    config: {
      videoBitrate: '2M',
      maxFps: 30,
      maxSize: 1024,
      turnScreenOff: true,
      stayAwake: true,
      forwardAudio: false,
      videoCodec: 'h264',
      lowLatencyBuffer: true,
      customFlags: '--no-audio'
    }
  },
  {
    id: 'high_speed_wifi',
    name: 'High Quality (Fiber / Fast Wi-Fi)',
    description: 'Crisp 60fps streaming with higher resolution for productivity, reading fine text, and media playback.',
    targetNetwork: 'Fiber Wi-Fi, Fast Office LAN/WAN',
    config: {
      videoBitrate: '8M',
      maxFps: 60,
      maxSize: 1600,
      turnScreenOff: true,
      stayAwake: true,
      forwardAudio: true,
      videoCodec: 'h265',
      lowLatencyBuffer: false,
      customFlags: ''
    }
  },
  {
    id: 'view_only_presentation',
    name: 'Presentation / Mirror Physical Screen',
    description: 'Leaves the physical phone screen turned ON while mirroring so nearby viewers can watch along with your laptop.',
    targetNetwork: 'Any Network',
    config: {
      videoBitrate: '6M',
      maxFps: 30,
      maxSize: 1280,
      turnScreenOff: false,
      stayAwake: true,
      forwardAudio: true,
      videoCodec: 'h264',
      lowLatencyBuffer: false,
      customFlags: ''
    }
  }
];
