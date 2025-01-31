/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', './src/app.html'],
	safeList: [
		{
			pattern:
				/bg-(redTheme|greenTheme|blueTheme|pinkTheme|purpleTheme|neutralTheme)-(100|200|300|400|500|600|700|800|900)/
		},
		{
			pattern:
				/text-(redTheme|greenTheme|blueTheme|pinkTheme|purpleTheme|neutralTheme)-(100|200|300|400|500|600|700|800|900)/,
			variants: ['hover']
		},
		{
			pattern:
				/border-(redTheme|greenTheme|blueTheme|pinkTheme|purpleTheme|neutralTheme)-(100|200|300|400|500|600|700|800|900)/,
			variants: ['hover']
		},
		{
			pattern: /bg-(red|green|blue)-(100|200|300)/
		}
	],
	theme: {
		extend: {
			colors: {
				'color-5800-1': '#6184FA',
				primary: {
					base: 'var(--color-primary)',
					light: 'var(--color-primary-light)',
					heavy: 'var(--color-primary-heavy)'
				},
				secondary: 'var(--color-secondary)',
				buttons: 'var(--color-buttons)',
				gradient: {
					light: 'var(--color-gradient-light)',
					heavy: 'var(--color-gradient-heavy)'
				},
				blueTheme: {
					100: '#F1F4F4',
					200: '#C1D9DB',
					300: '#9AD3DB',
					400: '#68D4E3',
					500: '#35CEE8',
					600: '#0BA1BA',
					700: '#047A8E',
					800: '#014A57',
					900: '#01353D'
				},
				redTheme: {
					100: '#F2DBDA',
					200: '#F2A8A4',
					300: '#E97A74',
					400: '#F24B44',
					500: '#E8281E',
					600: '#B4251D',
					700: '#7C1611',
					800: '#57100C',
					900: '#3D0705'
				},
				purpleTheme: {
					100: '#EFE9F5',
					200: '#D7B9F2',
					300: '#BE89F0',
					400: '#994DE0',
					500: '#9235E8',
					600: '#6C1FB2',
					700: '#531C85',
					800: '#330C57',
					900: '#20003D'
				},
				greenTheme: {
					100: '#DAF2E8',
					200: '#B5F7DA',
					300: '#8FF8CA',
					400: '#62F2B3',
					500: '#35E89A',
					600: '#20A36A',
					700: '#148151',
					800: '#0C5636',
					900: '#033D24'
				},
				pinkTheme: {
					100: '#F2DFEB',
					200: '#F1ADD6',
					300: '#E27DBA',
					400: '#E051A8',
					500: '#D92793',
					600: '#A1166A',
					700: '#791250',
					800: '#4F0933',
					900: '#3D0326'
				},
				neutral: {
					100: '#FFFFFF',
					200: '#DEE2F0',
					300: '#BBC4E0',
					400: '#9CA6C2',
					500: '#637192',
					600: '#3F4761',
					700: '#23293F',
					800: '#0F152B',
					900: '#060024'
				},
				grey: {
					light: '#494462',
					heavy: '#2E2947'
				},
				redAlliance: '#ff5757',
				blueAlliance: '#1479ff'
			}
		},
		fontFamily: {
			defaultText: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif']
		}
	},

	plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
