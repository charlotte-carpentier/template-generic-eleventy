// postcss.config.cjs
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    cssnano: process.env.NODE_ENV === "production" ? { preset: "default" } : false
  }
};
