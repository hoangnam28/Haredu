module.exports = {
  content: ['./src/**/*.html', './src/**/*.ts'],
  theme: {
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1600px',
    },
    extend: {
      spacing: {
        '9/16': '56.25%',
      },
      maxWidth: {
        '1/2': '50%',
      },
    },
    // fontSize: {
    //   xs: '11px',
    //   sm: '12px',
    //   base: '14px',
    //   lg: '16px',
    //   xl: '18px',
    //   '2xl': '20px',
    // },
  },
  variants: {},
  plugins: [],
  important: true,
};
