import {
  BrowserWindow
} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

const events = require('events')

// https://www.electronjs.org/zh/docs/latest/api/browser-window#%E9%A1%B5%E9%9D%A2%E5%8F%AF%E8%A7%81%E6%80%A7
const winConfig = {
  show: false,
  // 是否有边框，true有边框，false无边框
  frame: true,
  // 背景透明
  transparent: false,
  // 窗口是否永远在别的窗口的上面。 默认值为 false.
  alwaysOnTop: true,
  // 窗口是否可以聚焦. 默认值为 true。
  focusable: true,
  // 窗口大小是否可调整。 默认值为 true。
  resizable: false,
  // devTools boolean (可选) - 是否开启 DevTools. 如果设置为 false
  // BrowserWindow.webContents.openDevTools () 打开 DevTools。
  devTools: false,
  webPreferences: {
    // 是否启用Node integration. 默认值为 false.
    nodeIntegration: true,
    contextIsolation: false
  },
  useContentSize: false,
  maximizable: false,
  simpleFullScreen: false
  // content 没有圆角
  // vibrancy: 'content',
}

export default class UserPreferencesWindow extends events {
  constructor (confInfo) {
    super()
    this.confInfo = confInfo
    this.conf = Object.assign({}, winConfig, confInfo)
    this.windowInstance = new BrowserWindow(this.conf)
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // this.windowInstance.webContents.openDevTools()
      this.windowInstance.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}/index.html/#/userPreferences`)
    } else {
      console.log('BallWindow: App')
      createProtocol('app')
      // Load the index.html when not in development
      this.windowInstance.loadURL('app://./index.html/#/userPreferences')
    }
    this.listenIpc()
  }

  show () {
    this.windowInstance.show()
  }

  close () {
    this.windowInstance.close()
  }

  focus () {
    this.windowInstance.focus()
  }

  isDestroyed () {
    return this.windowInstance.isDestroyed()
  }

  hide () {
    this.windowInstance.hide()
  }

  listenIpc () {
    this.windowInstance.on('blur', () => {
      console.log('失去焦点')
    })
  }
}
