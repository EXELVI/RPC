export default {
  target: "webworker",
  entry: require.resolve('.'),
  output: {
    filename: "background.js",
    path: path.resolve("dist"),
  },
  resolve: {
    fallback: {
      // Evita polyfill automatici di Node.js
      fs: false,
      path: false,
    },
  },
};
