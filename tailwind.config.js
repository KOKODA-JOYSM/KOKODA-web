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
            }
        },
    },

    plugins: [forms],
};
