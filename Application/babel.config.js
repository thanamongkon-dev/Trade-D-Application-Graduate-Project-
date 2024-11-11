module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ["nativewind/babel",
    [
      'module-resolver',
      {
        root:['.'],
        alias:{
          '@components': './src/components',
          '@screens': './src/screens',
          '@nav': './src/routers',
          '@assets': './assets',
          '@api' : './src/api.js'
        },
      },
    ],
  ],
  };
};
