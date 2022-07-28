'use strict'

import {
  app,
  dialog,
  ipcMain, Notification, shell
} from 'electron'
import AppConfig from '@/conf/AppConfig.js'

export default class IpcMainEventService {
  /**
   * 给主进程注册打开配置窗口
   */
  regOpenSettingWindow () {
    // 配合    ipcRenderer.invoke('openSettingWindow') 使用
    ipcMain.handle('openSettingWindow', () => {
      const btnIndex = dialog.showMessageBoxSync({
        title: '缺少上传配置',
        type: 'question',
        message: '要想上传文件,请先添加上传配置',
        buttons: ['下次再说', '添加配置']
      })
      console.log('openSettingWindow:' + btnIndex)
    })
  }

  /**
   * 给主进程注册通知事件
   */
  regNotification () {
    // 接受渲染进程的通知
    ipcMain.on('Notification', (e, option) => {
      console.log('从渲染进程收到的数据：' + option)
      console.log(`Notification: ${Notification.isSupported()}`)
      if (Notification.isSupported()) {
        const notification = new Notification(option)
        if (option.href) {
          notification.on('click', (e) => {
            shell.openExternal(option.href)
          })
          // notification.onclick = function () {
          //   shell.openExternal(option.href)
          // }
        }
        notification.show()
      }
    })
  }

  regStore () {
    ipcMain.on('electron-store-get-data', () => {
      console.log('\'electron-store-get-data\' ')
    })
  }

  regAppConfig () {
    const appConfig = new AppConfig(app)
    ipcMain.handle('getAppConfig', () => {
      return appConfig.readConfig()
    })

    ipcMain.on('saveAppConfig', (args) => {
      console.log(`saveAppConfig:${args}`)
    })

    ipcMain.on('saveAppConfig', (e, option) => {
      console.log('从渲染进程收到saveAppConfig的数据：' + option)
      appConfig.saveConfig(option)
    })
  }
}
