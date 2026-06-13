export default {
  "*.{astro,js,ts}": ["eslint --fix"],
  "*.{astro,js,ts,json,css,md}": ["prettier --write"],
  // Reads theme.css itself, so ignore the staged filenames.
  "src/styles/theme.css": () => "npm run validate:contrast",
};
