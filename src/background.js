'use strict'

import {
  app,
  protocol,
  nativeTheme,
  contentTracing
} from 'electron'

import { createTray } from '@/service/TrayService.js'
import IpcMainEventService from '@/service/IpcMainEvent.js'
import Launch from '@/./window/Launch'
import Theme from '@/service/Theme.js'
import toggleDevTools from '@/utils/DevTools.js'
import { registerUpload } from '@/service/ShortkeyService.js'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true
    }
  }
])

/**
 * 默认先创建主要窗口,不进行展示
 * @type {UploadWindow}
 */
let uploadMainWindow

/**
 * 初始化主窗口
 * @returns {UploadWindow}
 */
function initMainWindow () {
  if (uploadMainWindow === undefined) {
    return new Launch()
  }
  return uploadMainWindow
}

/**
 * 当 Electron 完成初始化时，发出一次。
 */
app.on('ready', async () => {
  // 初始化主窗口
  uploadMainWindow = initMainWindow()
  // 注册主进程监听事件
  const ipcMainEventService = new IpcMainEventService()
  ipcMainEventService.regNotification()
  ipcMainEventService.regOpenSettingWindow()
  ipcMainEventService.regStore()
  ipcMainEventService.regAppConfig()
  // 注册主题
  // eslint-disable-next-line no-new
  new Theme()
  createTray()
  // 注册快捷键
  registerUpload()
  // 展示主窗口
  uploadMainWindow.show()
  // 模拟添加配置
  // new AppConfig(app).saveConfig()
  // appConfig.getAppDir():/Users/liuxin/Library/Application Support
  // appConfig.getTemp():/var/folders/dj/4ttlmrhx6qx9wb6srk3yp77h0000gn/T/
  // appConfig.getLodDir():/Users/liuxin/Library/Logs/ipic2
  // appConfig.getConfDir():/Users/liuxin/Library/Application Support/ipic2
  // console.log(`appConfig.getAppDir():${appConfig.getAppDir()}`)
  // console.log(`appConfig.getTemp():${appConfig.getTemp()}`)
  // console.log(`appConfig.getLodDir():${appConfig.getLodDir()}`)
  // console.log(`appConfig.getConfDir():${appConfig.getConfDir()}`)
})

/**
 * 当所有的窗口都被关闭时触发。
 */
app.on('window-all-closed', (e) => {
  if (process.platform !== 'darwin') {
    console.log('window-all-closed 点击关闭')
    // app.quit()
    e.preventDefault()
  }
})

/**
 * 当应用被激活时发出。 各种操作都可以触发此事件, 例如首次启动应用程序、尝试在应用程序已运行时或单击应用程序的坞站或任务栏图标时重新激活它。
 * BrowserWindow.getAllWindows().length获取窗口数量
 */
app.on('activate', () => {
  console.log('activate 窗口激活了')
  uploadMainWindow.show()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

app.whenReady().then(() => {
  nativeTheme.on('updated', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'dark'
    } else if (nativeTheme.shouldUseHighContrastColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'system'
    }
  })
  toggleDevTools()
  record()
})

function record () {
  return async () => {
    await contentTracing.startRecording({
      included_categories: ['*']
    })
    console.log('Tracing started')
    await new Promise(resolve => setTimeout(resolve, 5000))
    const path = await contentTracing.stopRecording()
    console.log('追踪数据记录到： ' + path)
  }
}

app.setAboutPanelOptions({
  applicationName: 'ipic2',
  applicationVersion: 'v2.0.0',
  website: 'https://java.springlearn.cn'
})
