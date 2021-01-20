import * as contextMenu from './context-menu'
import * as popupWindow from './popup-window'

function main(): void {
  const { quickLook } = popupWindow.init()
  contextMenu.init(quickLook)
}

main()
