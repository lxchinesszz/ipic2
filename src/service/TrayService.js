// 在 MacOS 和 Ubuntu, 托盘将位于屏幕右上角上，靠近你的电池和 wifi 图标。 在 Windows 上，托盘通常位于右下角
import { app, Menu, nativeImage, nativeTheme, Tray, BrowserWindow } from 'electron'
// 判断是否mac
const isMac = process.platform === 'darwin'

export function createTray () {
  // 设置dock图标
  const icon = nativeImage.createFromPath('/Users/liuxin/WebstormProjects/ipic2/src/assets/ipic2.png')

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '主题设置',
      submenu: [
        {
          id: '',
          label: '浅色模式',
          type: 'radio',
          click: function (menuItem, browserWindow, event) {
            if (menuItem.checked) {
              console.log('浅色模式')
              nativeTheme.themeSource = 'light'
            }
          }
        },
        {
          label: '暗黑模式',
          type: 'radio',
          click: function (menuItem, browserWindow, event) {
            if (menuItem.checked) {
              console.log('暗黑模式')
              nativeTheme.themeSource = 'dark'
            }
          }
        },
        {
          label: '跟随系统',
          type: 'radio',
          checked: true,
          click: function (menuItem, browserWindow, event) {
            if (menuItem.checked) {
              console.log('跟随系统')
              nativeTheme.themeSource = 'system'
            }
          }
        }
      ]
    },
    {
      label: '打开主窗口',
      type: 'normal',
      click: () => {
        BrowserWindow.fromId(1).show()
      }
    },
    {
      label: '打开配置窗口',
      type: 'normal',
      click: () => {
        BrowserWindow.fromId(2).show()
      }
    },
    {
      label: '始终置顶',
      type: 'checkbox',
      checked: false,
      click: function (menuItem) {
        console.log(menuItem.checked)
        const browserWindow = BrowserWindow.fromId(1)
        if (menuItem.checked) {
          if (!browserWindow.isAlwaysOnTop()) {
            browserWindow.setAlwaysOnTop(true)
          }
        } else {
          browserWindow.setAlwaysOnTop(false)
        }
      }
    },
    {
      label: '开启快捷键',
      type: 'checkbox',
      checked: true
    }
  ])
  // 对图片有要求,否则不会展示
  const tray = new Tray('/Users/liuxin/WebstormProjects/ipic2/src/assets/icon.iconset/icon_32x32@2x.png')
  // 注意: 你的 contextMenu, Tooltip 和 Title 代码需要写在这里!
  // tray.setToolTip('七牛图床上传客户端')
  // tray.setTitle('ipic2')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    console.log('点击Tray事件')
  })
  if (isMac) {
    app.dock.setMenu(contextMenu)
    app.dock.setIcon(icon)
  }

  //   // 添加mac 软件关于信息
  if (isMac) {
    //   // 菜单设置
    const m = Menu.buildFromTemplate([
      {
        label: 'app.getName()',
        submenu: [{
          label: 'ipic2',
          role: 'about'
        }, { type: 'separator' }, {
          label: '隐藏',
          role: 'hide'
        }, { type: 'separator' },
        {
          label: '退出',
          click: () => app.quit()
        }]
      },
      {
        label: '视图',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      }
    ])
    Menu.setApplicationMenu(m)
  }
}
