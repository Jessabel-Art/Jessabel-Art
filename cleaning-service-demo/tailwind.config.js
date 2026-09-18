/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
					bg: 'hsl(var(--destructive-bg))',
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
					bg: 'hsl(var(--success-bg))',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))',
					bg: 'hsl(var(--warning-bg))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				// Literal scales for bespoke sections (hero overlays, sidebars,
				// gradients) where the shadcn semantic tokens above are too
				// generic to reach for directly.
				navy: {
					950: '#071620',
					900: '#0B1F30',
					800: '#123249',
					700: '#1A4362',
					600: '#245579',
				},
				blue: {
					600: '#1E6FA8',
					500: '#2680C2',
					400: '#3A9FDF',
					100: '#DCEEFB',
					50: '#EFF7FD',
				},
				slate: {
					900: '#152534',
					700: '#3E4C59',
					600: '#5B6B79',
					500: '#77899A',
					400: '#9AACBB',
					200: '#DCE4EB',
					100: '#EEF2F6',
					50: '#F7F9FB',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 3px)',
				sm: 'calc(var(--radius) - 5px)',
				xl: 'calc(var(--radius) + 6px)',
			},
			boxShadow: {
				soft: '0 1px 2px rgba(11,31,48,.04), 0 8px 24px -8px rgba(11,31,48,.10)',
				card: '0 1px 2px rgba(11,31,48,.05), 0 1px 1px rgba(11,31,48,.04)',
				pop: '0 20px 60px -12px rgba(11,31,48,.28)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
