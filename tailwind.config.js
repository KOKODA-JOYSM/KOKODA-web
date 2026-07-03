import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                roboto: ['Roboto', 'sans-serif'],
                quicksand: ['Quicksand', 'sans-serif'],
            },
            colors: {
                'base': '#FEFEFE',
                'background': '#FFF6EC',
                'highlight': '#FFE7A3',
                'primary': '#F4C799',
                'secondary': '#C0976C',
                'tertiary': '#311A05',
                'label-found': '#5D8CAD',
                'label-lost': '#D56666',
                'gray-text-field': '#777777',
                'online-color': '#008000',
            },
            animation: {
                marquee: 'marquee var(--duration) linear infinite',
                'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
                'beam-orbit': 'beam-orbit calc(var(--duration)*1s) infinite linear',
                'gradient-flow': 'gradient-flow 8s linear infinite',
                shimmer: 'shimmer 2.5s linear infinite',
            },
            keyframes: {
                marquee: {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(calc(-100% - var(--gap)))' },
                },
                'marquee-vertical': {
                    from: { transform: 'translateY(0)' },
                    to: { transform: 'translateY(calc(-100% - var(--gap)))' },
                },
                'beam-orbit': {
                    '0%': { top: '0%', left: '0%' },
                    '25%': { top: '0%', left: '100%' },
                    '50%': { top: '100%', left: '100%' },
                    '75%': { top: '100%', left: '0%' },
                    '100%': { top: '0%', left: '0%' },
                },
                'gradient-flow': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '0% 0%' },
                    '100%': { backgroundPosition: '-200% 0%' },
                },
            },
        },
    },

    plugins: [forms],
};
