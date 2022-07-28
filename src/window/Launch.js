import {
  app,
  BrowserWindow, ipcMain
} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import BallWindow from '@/window/BallWindow'
import UserPreferencesWindow from '@/window/UserPreferencesWindow'
const events = require('events')
// https://www.electronjs.org/zh/docs/latest/api/browser-window#%E9%A1%B5%E9%9D%A2%E5%8F%AF%E8%A7%81%E6%80%A7
const winConfig = {
  title: '文件上传',
  // id: 'uploadMainWindow',
  // 默认不展示
  show: false,
  // type: 'textured',
  // 是否有边框，true有边框，false无边框
  frame: true,
  // 背景透明
  transparent: false,
  // 窗口是否永远在别的窗口的上面。 默认值为 false.
  alwaysOnTop: false,
  // 窗口是否可以聚焦. 默认值为 true。
  focusable: true,
  // 窗口大小是否可调整。 默认值为 true。
  resizable: true,
  // devTools boolean (可选) - 是否开启 DevTools. 如果设置为 false
  // BrowserWindow.webContents.openDevTools () 打开 DevTools。
  height: 563,
  // useContentSize: true,
  width: 1000,
  webPreferences: {
    // 是否启用Node integration. 默认值为 false.
    nodeIntegration: true,
    contextIsolation: false,
    devTools: true
  }
  // shadow: true,
  // content 没有圆角
  // vibrancy: 'content',
  // 无边框
  // frame: false,
  // 自动隐藏红绿灯
  // titleBarStyle: 'customButtonsOnHover',
}

class UploadWindow extends events {
  constructor (confInfo) {
    super()
    this.confInfo = confInfo
    this.conf = Object.assign({}, winConfig, confInfo)
    this.windowInstance = new BrowserWindow(this.conf)
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      // this.windowInstance.webContents.openDevTools()
      console.log(`process.env.WEBPACK_DEV_SERVER_URL:${process.env.WEBPACK_DEV_SERVER_URL}`)
      this.windowInstance.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'index.html')
    } else {
      createProtocol('app')
      this.windowInstance.loadURL('app://./index.html')
    }
    this.init()
    // 每个窗口的监听器在，每个窗口创建时候调用一次即可。不然可能出现很多地方重复调用，导致不停的添加监听器
    this.listenIpc()
    // 初始化窗口是未定义,当第一次隐藏主窗口进行创建
    this.ballWindow = undefined
    this.userPreferencesWindow = undefined
    this.initUserPreferences()
  }

  init () {
    const _this = this
    // 监听读取可展示时间,展示
    this.windowInstance.on('ready-to-show', () => {
      console.log('ready-to-show')
      this.windowInstance.show()
    })
    // 当接受到show时间,发送一个事件，用于在Launch.on('show')做处理
    this.windowInstance.on('show', () => {
      // 主窗口展示,如果后台窗口已经创建了就进行隐藏,如果没有创建就忽略
      if (_this.ballWindow !== undefined) {
        _this.ballWindow.hide()
      }
    })
    this.windowInstance.on('minimize', (e) => {
      // console.log('窗口隐藏了')
      // 后台窗口未定义时候创建
      if (_this.ballWindow === undefined) {
        _this.ballWindow = _this.initBallWindow()
        _this.ballWindow.show()
        console.log('初始化后台窗口')
      } else {
        _this.ballWindow.show()
      }
    })
    this.windowInstance.on('closed', (e) => {
      // 主窗口关闭就进行关闭
      console.log('Launch 点击关闭')
      app.quit()
      // app.hide()
      // e.preventDefault()
      // this.windowInstance.hide()
    })
  }

  initBallWindow () {
    if (this.ballWindow === undefined) {
      return new BallWindow({})
    } else {
      return this.ballWindow
    }
  }

  listenIpc () {
    const _this = this
    // 后台窗口创建右键菜单
    ipcMain.handle('setRightClickMenu', () => {
      console.log(`this.ballWindow${_this.ballWindow}`)
      _this.ballWindow.setMenu()
    })
    // 后台窗口创建右键菜单
    ipcMain.handle('showMainWindow', () => {
      _this.show()
    })

    // 打开配置页面
    ipcMain.handle('openUserPreferencesWindow', () => {
      console.log('openUserPreferencesWindow')
      _this.openUserPreferences()
    })
    ipcMain.handle('closeUserPreferencesWindow', () => {
      console.log(`_this.userPreferencesWindow:${_this.userPreferencesWindow}`)
      if (_this.userPreferencesWindow !== undefined) {
        if (!_this.userPreferencesWindow.isDestroyed()) {
          console.log(`_this.userPreferencesWindow.isDestroyed:${_this.userPreferencesWindow.isDestroyed()}`)
          _this.userPreferencesWindow.hide()
        }
      }
    })
  }

  show () {
    // 先隐藏后台窗口
    if (this.ballWindow !== undefined) {
      this.ballWindow.hide()
    }
    // 在展示主窗口
    this.windowInstance.show()
    console.log(`主窗口id:${this.windowInstance.id}`)
  }

  hide () {
    this.windowInstance.hide()
  }

  initUserPreferences () {
    const _this = this
    if (_this.userPreferencesWindow === undefined) {
      _this.userPreferencesWindow = new UserPreferencesWindow({
        parent: _this.windowInstance,
        useContentSize: false,
        modal: true,
        width: 750,
        height: 500
      })
    }
  }

  openUserPreferences () {
    const _this = this
    if (_this.userPreferencesWindow === undefined) {
      _this.userPreferencesWindow = new UserPreferencesWindow({
        parent: _this.windowInstance,
        useContentSize: false,
        modal: true,
        width: 750,
        height: 500
      })
      _this.userPreferencesWindow.focus()
    } else {
      _this.userPreferencesWindow.show()
    }
  }

  webContents () {
    return this.windowInstance.webContents
  }
}

export default UploadWindow
