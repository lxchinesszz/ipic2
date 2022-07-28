import {
  app,
  globalShortcut,
  clipboard,
  Notification, shell
} from 'electron'
import AppConfig from '@/conf/AppConfig.js'
import { upload } from '@/utils/Qiniu.js'
import { FileRuleConfig, toFileWrapper } from '@/utils/FileUtils'

const fs = require('fs')

export function registerUpload () {
  // 注册一个 'CommandOrControl+X' 的全局快捷键
  const ret = globalShortcut.register('CommandOrControl+D', () => {
    // 读取粘贴板图片
    const nativeImage = clipboard.readImage()
    const appConfig = new AppConfig(app)
    if (!nativeImage.isEmpty()) {
      const imgBuffer = nativeImage.toPNG()
      const fileName = Date.parse(new Date())
      console.log('fileName: ' + fileName)
      // let imgPath = __dirname + '/' + fileName + '.png'
      const imgPath = `${appConfig.getTemp()}${fileName}.png`
      console.log('imgPath: ' + imgPath)
      // 将文件放到文件中
      // eslint-disable-next-line node/handle-callback-err
      fs.writeFile(imgPath, imgBuffer, function (err) {
        const fileWrapper = toFileWrapper(imgPath)
        const ruleConfig = appConfig.readConfig()
        console.log(ruleConfig)
        console.log(fileWrapper)
        const fileRule = new FileRuleConfig(ruleConfig.authConfig, ruleConfig.namingRules, ruleConfig.otherConfig)
        upload(fileRule, imgPath, fileWrapper, (e, reply) => {
          console.log(e)
          console.log(reply)
        }, (img) => {
          if (Notification.isSupported()) {
            const notification = new Notification({
              title: '图片上传成功',
              body: `URL: ${img}`,
              href: img
            })
            notification.on('click', (e) => {
              shell.openExternal(img)
            })
            notification.show()
          }
          clipboard.writeText('![](' + img + ')')
        })
      })
    }
  })
  // 快捷键注册失败,打印
  if (!ret) {
    console.log('registration failed')
  }
  // 注册成功写入命令
  if (ret) {
    // 检查快捷键是否注册成功
    console.log('快捷键注册成功: ' + globalShortcut.isRegistered('CommandOrControl+D'))
  }
}
