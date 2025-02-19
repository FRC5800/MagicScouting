import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	plugins: {
		CapacitorHttp: {
			enabled: true
		}
	},
	appId: 'com.magicscouting.app',
	appName: 'MagicScouting',
	webDir: 'build',
	server: {
		androidScheme: 'https'
	}
};

export default config;
