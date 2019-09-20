let transformRemoveConsolePlugin = []
if (process.env.NODE_ENV === 'production') {
  transformRemoveConsolePlugin = ['transform-remove-console']
}
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    ...transformRemoveConsolePlugin //配置插件，这里很重要
  ]
}
