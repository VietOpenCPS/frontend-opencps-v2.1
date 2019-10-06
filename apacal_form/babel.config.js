const removeConsolePlugin = []
module.exports = {
  "presets": [
    [
      "@vue/app",
      {
        "useBuiltIns": "entry"
      }
    ]
  ],
  plugins: removeConsolePlugin
}