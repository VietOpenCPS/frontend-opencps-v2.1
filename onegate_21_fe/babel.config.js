const removeConsolePlugin = []
if(process.env.NODE_ENV === 'production') {
<<<<<<< HEAD
  //removeConsolePlugin.push("transform-remove-console")
=======
  // removeConsolePlugin.push("transform-remove-console")
>>>>>>> company/bgt
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
};
