const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: 'selector',
    theme: {
        fontFamily: {
            sans: ['Epilogue', ...defaultTheme.fontFamily.sans],
        },
        extend: {
            backgroundImage: {
                gifts: "url('./assets/gifts.png')",
                wallpaper: "url('https://source.unsplash.com/random?wallpapers')"
            },
            boxShadow: {
                btn: '0 15px 30px -5px rgba(151, 65, 252, 0.2)'
            },
            colors: {
                primary: {
                    50: '#f5eaff',
                    100: '#ebd4ff',
                    200: '#d7aaff',
                    300: '#c280ff',
                    400: '#ad55ff',
                    500: '#992aff',
                    600: '#7d00f5',
                    700: '#5e00b7',
                    800: '#46008a',
                    900: '#2e005d',
                },
                secondary: {
                    50: '#e2e8f0',
                    100: '#cbd5e1',
                    200: '#94a3b8',
                    300: '#64748b',
                    400: '#475569',
                    500: '#334155',
                    600: '#1e293b',
                    700: '#0f172a',
                    800: '#0a0f15',
                    900: '#05080a',
                },
                background: '#f8fafc',
                backgroundDark: '#121212',
                surface: '#ffffff',
                surfaceDark: '#191919',
                error: '#b00020',
                onPrimary: '#ffffff',
                onSecondary: '#000000',
                onBackground: '#1a202c',
                onBackgroundDark: '#ffffff',
                onSurface: '#1a202c',
                onSurfaceDark: '#ffffff',
                onError: '#ffffff',
            },
        }
    },
    plugins: [],
}