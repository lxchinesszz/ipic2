const MouseDragDirective = {

  mounted (el, binding) {
    const handler = binding.value

    let isDown = false
    let baseX = 0
    let baseY = 0
    // 鼠标点击,记录当前的元素的位置
    el.addEventListener('mousedown', (e) => {
      if (e.buttons === 2) {
        e.preventDefault()
      } else {
        isDown = true
        baseX = e.x
        baseY = e.y
      }
    })
    // 鼠标移动,记录当前移动的
    document.addEventListener('mousemove', (e) => {
      if (isDown) {
        const x = e.screenX - baseX
        const y = e.screenY - baseY
        handler({
          x,
          y
        })
      }
    })

    document.addEventListener('mouseup', (e) => {
      isDown = false
    })
  }
}

export default MouseDragDirective
