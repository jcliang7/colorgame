const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

const fs = require('fs');

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync('./localhost.key'),
      cert: fs.readFileSync('./localhost.crt'),
    },
    port: 8080, // 可以改為其他埠號
  },
};

// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/colorgame/' : '/'
};
