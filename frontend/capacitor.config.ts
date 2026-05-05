import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.opennumismat.OpenNumismatWeb',
  appName: 'OpenNumismat',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    StatusBar: {
      overlaysWebView: true,
    },
  },
  android: {
    adjustMarginsForEdgeToEdge: 'auto'
  }
};

export default config;
