/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./public/**/*.{html,js}"],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#D89584',
                secondary: '#7928ca',
                accent: '#F4A89F',
                dark: {
                    primary: '#E9A89B',
                    secondary: '#9d4edd',
                    accent: '#F4A89F',
                    text: '#fff',
                    'text-secondary': '#999',
                    background: '#0a0a0a',
                    'background-secondary': '#151515',
                    'background-tertiary': '#1f1f1f',
                    border: '#333',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'custom': '0 4px 14px rgba(0, 0, 0, 0.1)',
                'dark': '0 4px 14px rgba(0, 0, 0, 0.25)',
                'coral': '0 4px 20px rgba(216, 149, 132, 0.3)',
            },
            animation: {
                'morph': 'morph 8s ease-in-out infinite',
                'pulse-slow': 'pulse 10s infinite',
            },
            keyframes: {
                morph: {
                    '0%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
                    '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
                    '100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
                },
                pulse: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                }
            }
        },
    },
    plugins: [],
}
