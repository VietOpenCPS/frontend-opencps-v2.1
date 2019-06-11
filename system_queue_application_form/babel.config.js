const removeConsolePlugin = []
if(process.env.NODE_ENV === 'production') {
}
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