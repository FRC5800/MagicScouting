import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	plugins: {
		CapacitorHttp: {
			enabled: true
		},
		LiveUpdate: {
      		appId: "2eefb088-f3ea-4ac7-87fd-4be4e8d3490c",
      		autoUpdateStrategy: "background"
    	},
	},
	appId: 'com.magicscouting.app',
	appName: 'MagicScouting',
	webDir: 'build',
	server: {
		androidScheme: 'https'
	}
};

export default config;
