import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      "4xl": { max: "2699px" },
      "3xl": { max: "1750px" },
      "2xl": { max: "1535px" },
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "767px" },
      sm: { max: "639px" },
    },
    colors: {
      chargePurple: "#240046",
      navy: "#071927",
      "light-gray": "#F3F3F3",
      "bg-dark-gray": "#F3F3F3",
      "modal-bg": "#F2F2F2",
      "transaction-bg": "#F7F7F7",
      lightBlue: "#063B64",
      purple: "#7A159A",
      gray: "#BABABA",
      "dark-gray": "#E7E7E7",
      "darker-gray": "#C2C2C2",
      "selected-gray": "#D0D7DE",
      "selected-light-gray": "#E5E7EB",
      "text-dark-gray": "#666666",
      "secondary-gray": "#797979",
      "tertiary-gray": "##525252",
      "text-gray": "#9F9F9F",
      "text-darker-gray": "#737373",
      "text-heading-gray": "#4D4D4D",
      "lighter-gray": "#5F6B79",
      "text-inactive": "#D1D1D1",
      "lighter-blue": "#EEF2F6",
      "fuse-green": "#20B92E",
      "fuse-green-bright": "#8EFF98",
      "pale-green": "#A3F5AA",
      "pale-green-light": "#A2F5AA",
      white: "#FFFFFF",
      "fuse-black": "#1A1A1A",
      black: "#000000",
      warning: "#FFF3DD",
      error: "#FFDDDD",
      success: "#B4F9BA",
      "success-light": "#E0FFDD",
      inactive: "#EBEBEB",
      "warning-dark": "#A86D00",
      "error-dark": "#750000",
      "success-dark": "#0A7500",
      "inactive-dark": "#E5E5E6",
      "button-inactive": "#808080",
      "stake-inactive": "#B3B3B3",
      "warning-yellow": "#FFD764",
      "warning-gray": "#3B4145",
      "border-gray": "#E6E6E6",
      "border-dark-gray": "#E8E8E8",
      "lightest-gray": "#D9D9D9",
      "gray-alpha-40": "#00000066",
      "warning-border": "#D4A72C",
      "warning-bg": "#FFF8C5",
      "night": "#0A0A0A",
      "ghost": "#CBCBCB",
      "iron": "#D7D7D7",
      "red-600": "#dc2626",
      "pink-swan": "#B8B8B8",
      "soft-peach": "#EDEDED",
      "lemon-chiffon": "#FFF9C3",
      "pastel-gray": "#CDCDCD",
      "star-dust-alpha-70": "#9f9f9fb3",
      "gray-goose": "#CFCFCF",
      "dune": "#333333",
      "dove-gray": "#6B6B6B",
      "bean-red": "#F65D51",
      "antique-white": "#FFECDA",
      "ash-gray": "#B9B9B9",
      "pale-slate": "#BFBFBF",
      "stoplight-go-green": "#66E070",
    },
    fontFamily: {
      mona: ["var(--font-mona-sans)"],
    },
    extend: {
      spacing: {
        0.5: "0.125rem",
        "1/9": "11.1%",
        "8/9": "88.9%",
        "3/10": "30%",
        "1/10": "10%",
        "9/10": "90%",
      },
      fontSize: {
        "xl": "1rem",
        "5xl": "2.5rem",
      },
      borderWidth: {
        0.5: "0.5px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        'blink-underline': 'blink 1s linear infinite',
      },
      transform: ["group-hover"],
      gridTemplateColumns: {
        'auto-fit-400': 'repeat(auto-fit, minmax(400px, 1fr))',
        'auto-fit-250': 'repeat(auto-fit, minmax(250px, 1fr))',
      },
      colors: {
        "light-blue": "#CDD9E5",
      },
      boxShadow: {
        'inner-black': 'inset 0px 0px 0px 3px rgba(0,0,0,0.3)',
      },
      backgroundImage: {
        'linear-gradient-orange': "linear-gradient(122deg, rgba(246, 93, 81, 0.20) 5.66%, rgba(246, 93, 81, 0.00) 24.99%)",
        'linear-gradient-dark-orange': 'linear-gradient(92deg, #F7A454 0%, #F66957 100%)',
        'linear-gradient-green': "linear-gradient(122deg, rgba(102, 224, 112, 0.20) 5.66%, rgba(102, 224, 112, 0.00) 24.99%)",
        'linear-gradient-black': 'linear-gradient(180deg, #585858 0%, #000 81.5%)',
      }
    },
  },
  plugins: [],
}
export default config
