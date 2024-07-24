
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
   devtool: 'source-map',
   entry: "./src/popup.js",
   mode: "development",
   target: 'web', 
   externals: [],
   output: {
      filename: "popup.pack.js",
      devtoolModuleFilenameTemplate: '[resource-path]',  // removes the webpack:/// prefix
      libraryTarget: 'window'
   },
   resolve: {
      extensions: ['.ts'] 
   },
   plugins: [
      /* // Include block below only for production build 
         new WebpackObfuscator ({
         rotateStringArray: true
     }, ['excluded_bundle_name.js'])     */
   ],   
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/
         },       
/* // Include block below only for production build               
         {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            enforce: 'post',
            use: { 
                loader: WebpackObfuscator.loader, 
                options: {
                    rotateStringArray: true
                }
            }
        }   
            */     
      ]
   }  
}