import { app } from 'electron'

export function macMenuTemplate () {
  return [
    {
      label: app.getName(),
      submenu: [{
        label: 'ipic2',
        role: 'about'
      }, { type: 'separator' }, {
        label: '隐藏',
        role: 'hide'
      }, {
        label: '显示其他',
        role: 'hideothers'
      }, {
        label: '显示全部',
        role: 'unhide'
      }, { type: 'separator' }, {
        label: '退出',
        click: () => app.quit()
      }]
    },
    {
      label: '最小化',
      role: 'minimize'
    }
  ]
}
