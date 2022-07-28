const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      title: 'ipic2',
      appId: 'com.lxchinesszz.ipic2',
      outputDir: 'build',
      nodeIntegration: true,
      externals: ['node-qiniu'],
      // If you are using Yarn Workspaces, you may have multiple node_modules folders
      // List them all here so that VCP Electron Builder can find them
      nodeModulesPath: ['../../node_modules', './node_modules'],
      builderOptions: {
        mac: {
          target: ['dmg', 'zip']
        },
        win: {
          target: ['nsis', 'zip']
        }
      }
      // options placed here will be merged with default configuration and passed to electron-builder
    }
  }
})
