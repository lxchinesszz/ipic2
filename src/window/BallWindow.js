import {
  BrowserWindow,
  ipcMain,
  Menu,
  app
} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

const events = require('events')

// https://www.electronjs.org/zh/docs/latest/api/browser-window#%E9%A1%B5%E9%9D%A2%E5%8F%AF%E8%A7%81%E6%80%A7
const winConfig = {
  show: false,
  // 是否有边框，true有边框，false无边框
  frame: false,
  // 背景透明
  transparent: true,
  // 窗口是否永远在别的窗口的上面。 默认值为 false.
  alwaysOnTop: true,
  // 窗口是否可以聚焦. 默认值为 true。
  focusable: false,
  // 窗口大小是否可调整。 默认值为 true。
  resizable: false,
  // devTools boolean (可选) - 是否开启 DevTools. 如果设置为 false
  // BrowserWindow.webContents.openDevTools () 打开 DevTools。
  devTools: true,
  webPreferences: {
    // 是否启用Node integration. 默认值为 false.
    nodeIntegration: true,
    contextIsolation: false
  },
  height: 120,
  useContentSize: true,
  width: 120,
  maximizable: false,
  simpleFullScreen: false
  // content 没有圆角
  // vibrancy: 'content',
  // 无边框
  // frame: false,
  // 自动隐藏红绿灯
  // titleBarStyle: 'customButtonsOnHover',
}

class BallWindow extends events {
  constructor (confInfo) {
    super()
    this.confInfo = confInfo
    this.conf = Object.assign({}, winConfig, confInfo)
    this.windowInstance = new BrowserWindow(this.conf)
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // console.log(`BallWindow:${process.env.WEBPACK_DEV_SERVER_URL}`)
      // Load the url of the dev server if in development mode
      // this.windowInstance.webContents.openDevTools()
      this.windowInstance.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}/index.html/#/ballTimePage`)
    } else {
      console.log('BallWindow: App')
      createProtocol('app')
      // Load the index.html when not in development
      this.windowInstance.loadURL('app://./index.html/#/ballTimePage')
    }
    // 第一次进来是true,则直接定位到固定出现位置
    // 当页面已经显示之后,则修改为false,则不直接定位到固定位置
    this.resetPos = true
    this.listenIpc()
  }

  show () {
    this.windowInstance.show()
    if (this.resetPos) {
      this.windowInstance.setPosition(1000, 100, true)
    }
    this.resetPos = false
  }

  hide () {
    this.windowInstance.hide()
  }

  setPos (pos) {
    this.windowInstance.setPosition(pos.x, pos.y, true)
  }

  // 监听渲染进行
  listenIpc () {
    const _this = this
    ipcMain.on('ballMove', (e, pos) => {
      _this.windowInstance.setPosition(pos.x, pos.y)
    })
  }

  setMenu () {
    const rightTemplate = [
      {
        label: '打开窗口',
        click: () => {
          console.log('点击打开窗口')
          BrowserWindow.fromId(1).show()
        }
      },
      {
        label: '打开配置窗口',
        click: () => {
          BrowserWindow.fromId(2).show()
        }
      },
      {
        label: '上传粘贴板文件'
      },
      {
        label: '粘贴'
      },
      {
        label: '关闭应用',
        click: () => {
          app.quit()
        }
      }
    ]
    const m = Menu.buildFromTemplate(rightTemplate)
    m.popup({
      window: this.windowInstance
    })
  }
}

export default BallWindow
