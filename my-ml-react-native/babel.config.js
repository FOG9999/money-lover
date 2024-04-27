process.env.EXPO_ROUTER_APP_ROOT = "./app";
process.env.EXPO_ROUTER_ABS_APP_ROOT = "./app";
process.env.EXPO_ROUTER_IMPORT_MODE = "sync";

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv'],
      // 'nativewind/babel',
    ],
  };
};
