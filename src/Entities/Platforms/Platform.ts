import {Container, Graphics} from 'pixi.js'

export class Platform extends Container {
  constructor() {
    super()

    const view = new Graphics()
    // 注意顺序 先rect再stroke
    view.rect(0, 0, 200, 30)
    view.stroke({width: 1, color: 0x00ff00})
    this.addChild(view)
  }
}
