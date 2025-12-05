import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ratelozn.services',
  appName: 'خدمات راتلوزن',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  assets: {
    icon: {
      sources: [
        { src: 'resources/icon.png', platform: 'android' },
        { src: 'resources/icon.png', platform: 'ios' },
      ],
    },
    splash: {
      sources: [
        { src: 'resources/splash.png', platform: 'android' },
        { src: 'resources/splash.png', platform: 'ios' },
      ],
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#13141f",
      showSpinner: false,
      androidSplashResourceName: "splash"
    }
  }
};

export default config;