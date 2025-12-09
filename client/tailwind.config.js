/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Corporate Dark Mode Palette
                'navy': {
                    900: '#0B0F19', // Deep Navy (Background)
                    800: '#151A25', // Lighter Navy (Cards)
                    700: '#2D3748', // Border
                },
                'brand': {
                    500: '#3B82F6', // Royal Blue
                    600: '#6366F1', // Indigo
                },
                'slate': {
                    50: '#F8FAFC', // Headers / White
                    400: '#94A3B8', // Secondary Text
                },
                'crisis': {
                    red: '#E53E3E',
                    dark: '#1A202C',
                    slate: '#2D3748',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Professional font
                mono: ['JetBrains Mono', 'monospace'], // Data font
            },
        },
    },
    plugins: [],
}
