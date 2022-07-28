import fs from 'fs'

import {
  app
} from 'electron'

export default class AppConfig {
  getTemp () {
    return app.getPath('temp')
  }

  getLodDir () {
    return app.getPath('logs')
  }

  getConfDir () {
    return app.getPath('userData')
  }

  getAppDir () {
    return app.getPath('appData')
  }

  /**
   * 生成新的文件
   * @param newFilePath 文件路径
   * @param fileContext 文件内容
   */
  _create (fileContext, newFilePath) {
    fs.writeFile(newFilePath, fileContext, err => {
      if (err) {
        throw err
      }
    })
  }

  /**
   * 通过是true,
   * 失败是false
   */
  validation () {
    const readConfig = this.readConfig()
    const {
      authConfig,
      namingRules,
      otherConfig
    } = readConfig
    console.log(`readConfig:${readConfig}`)
    console.log(`authConfig:${authConfig}`)
    console.log(`namingRules:${namingRules}`)
    console.log(`otherConfig:${otherConfig}`)
    if (authConfig === null || namingRules === undefined || otherConfig === undefined) {
      return false
    } else {
      return true
    }
  }

  readConfig () {
    const configPath = `${this.getConfDir()}/config.json`
    if (!fs.existsSync(configPath)) {
      return {
        authConfig: {
          bucketName: '2',
          dirName: '',
          secretKey: '1',
          accessKey: '1'
        },
        namingRules: {
          prefix: '',
          suffix: '',
          generateNameType: 2
        },
        otherConfig: {
          domain: 'https://img.springlearn.cn',
          backup: true
          // backupPath: ''
        }
      }
    } else {
      const fileContent = fs.readFileSync(configPath, 'utf-8')
      return JSON.parse(fileContent)
    }
  }

  saveConfig (ruleConfig) {
    const configPath = `${this.getConfDir()}/config.json`
    // this._create(JSON.stringify(ruleConfig), configPath)
    this._create(ruleConfig, configPath)
  }
}
