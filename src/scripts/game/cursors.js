import {
  colors,
} from '../canvas'

import {
  moveInterval,
} from '../input'

export const setupCursors = (globals, layer) => {
  const { 
    gameObject, 
    level, 
    testGridCollide, 
    translateTileSize: t,
    update,
  } = globals

  const registeredControllers = []

  const playerColors = Object.values(colors)

  const cursors = []

  const registerController = (controller) => {
    if (registeredControllers.includes(controller.index)) return
    
    registeredControllers.push(controller.index)

    const player = registeredControllers.length

    const { bindings, onButtonPress, onButtonRelease } = controller

    const playerColor = playerColors[player - 1]

    const cursor = gameObject((state, { destroy }) => {
      state.x = 0
      state.y = 0
      state.player = player
      
      const isColliding = (coordinates) => {
        for (const { state } of cursors) {
          if (state.player === player) continue
          if (state.x === coordinates.x && state.y === coordinates.y) return true
        }

        return false
      }

      while (isColliding(state)) {
        state.x++
      }

      const move = (x = 0, y = 0) => {
        if (state.x + x < 0 || state.x + x >= level.width || state.y + y < 0 || state.y + y >= level.height) return

        if (isColliding({
          x: state.x + x, 
          y: state.y + y,
        })) return

        state.x += x
        state.y += y

        // console.log(testGridCollide(state))
      }

      moveInterval(controller, bindings.up, () => move(0, -1))
      moveInterval(controller, bindings.down, () => move(0, +1))
      moveInterval(controller, bindings.left, () => move(-1, 0))
      moveInterval(controller, bindings.right, () => move(+1, 0))

      // TODO: release move listener whenever opposite direction pressed

      console.log(`Cursor activated for controller "${controller.index}"`)

      return () => {
        const { x, y } = state

        const bw = Math.ceil(t(0.1)) // border width

        requestAnimationFrame(() => {
          layer.drawRect(t(x) + globals.offsetX, t(y) + globals.offsetY, t(1), t(1), playerColor)
          layer.clearRect(t(x) + globals.offsetX + bw, t(y) + globals.offsetY + bw, t(1) - (bw * 2), t(1) - (bw * 2))
          layer.drawRect(t(x) + globals.offsetX, t(y) + globals.offsetY, t(0.4), t(0.4), playerColor)
        })
      }
    })

    cursors.push(cursor)
  }

  registerController(keyboard)

  keyboard.onAnyButtonPress(registerController)
  gamepads.on('gamepad-any', registerController)
}
