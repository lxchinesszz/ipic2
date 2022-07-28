import MouseDragDirective from '@/directives/MouseDrag.js'

// 自定义函数=>移动事件
export default {
  install (app) {
    app.directive('mouse-drag', MouseDragDirective)
  }
}
