const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { paths }) => {
      // Keep existing entries and add a separate one for SW
      webpackConfig.entry = {
        ...webpackConfig.entry,
        sw: path.resolve(__dirname, 'src/firebase-messaging-sw.js'), // SW entry
      };

      // Output configuration
      webpackConfig.output = {
        ...webpackConfig.output,
        filename: (chunkData) =>
          chunkData.chunk.name === 'sw'
            ? 'firebase-messaging-sw.js' // put SW at root
            : 'static/js/[name].[contenthash:8].js',
      };

      // Optional: ensure ES module type for SW
      webpackConfig.experiments = {
        ...webpackConfig.experiments,
        outputModule: true,
      };

      return webpackConfig;
    },
  },
};