'use strict'

import {
  ipcMain, nativeTheme
} from 'electron'

export default class Theme {
  constructor () {
    // 注册一个事件允许是主体
    ipcMain.handle('dark-mode:toggle', () => {
      if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light'
      } else {
        nativeTheme.themeSource = 'dark'
      }
      console.log(nativeTheme.themeSource)
      return nativeTheme.shouldUseDarkColors
    })
    // 注册一个事件,跟随系统
    ipcMain.handle('dark-mode:system', () => {
      nativeTheme.themeSource = 'system'
      console.log('dark-mode:system')
    })
  }
}
