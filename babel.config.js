module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-flow',
    '@react-native/babel-preset',
    '@babel/preset-typescript',
    'module:metro-react-native-babel-preset'

  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    'babel-plugin-transform-flow-enums'
  ]
};
