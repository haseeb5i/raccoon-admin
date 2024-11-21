import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {},
      boxShadow: {
        purpleShadow: '0 2px 6px 0 rgba(81, 86, 190, 0.5)',
      },
      transitionProperty: {
        width: 'width',
        height: 'height',
        spacing: 'margin, padding',
        border: 'border-color',
        color: 'color',
        bg: 'background-color',
        opacity: 'opacity',
        transform: 'transform',
      },

      colors: {
        white: 'var(--white)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        background: 'var(--background)',
        red: 'var(--red)',
        blackColor: 'var(--black)',
        lightBlack: 'var(--light-black)',
        grayColor: 'var(--gray)',
        grayColor2: 'var(--gray-2)',
        grayColor3: 'var(--gray-3)',
        grayColor4: 'var(--gray-4)',
        grayColor5: 'var(--gray-5)',
        lightGray: 'var(--light-gray)',
        lightGray2: 'var(--light-gray-2)',
        darkGray: 'var(--dark-gray)',
        lightPink: 'var(--light-pink)',
        lightBlue: 'var(--light-blue)',
        darkPink: 'var(--dark-pink)',
        colorGreen: 'var(--green)',
        colorOrange: 'var(--orange)',
        colorDarkOrange: 'var(--dark-orange)',
        colorYellow: 'var(--yellow)',
        colorPlaceholder: 'var(--placeholder)',
        gradientColorPrimary: 'var(--gradient-primary)',
        gradientColor2: 'var(--gradient-2)',
      },
      fontFamily: {
        fontLight: 'var(--font-light)',
        fontRegular: 'var(--font-regular)',
        fontMedium: 'var(--font-medium)',
        fontSemiBold: 'var(--font-semibold)',
        fontBold: 'var(--font-Bold)',
        fontExtraBold: 'var(--font-extrabold)',
        fontIBM: 'var(--font-IBM)',
      },

      screens: {
        xs: '400px',
        sm: '600px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        xxl: '1440px',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
