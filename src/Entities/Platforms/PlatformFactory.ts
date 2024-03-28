import {Application} from 'pixi.js'
import {Platform} from './mod'

export class PlatformFactory {
  constructor(private app: Application) {}

  create_platform(coord: [number, number]) {
    const platform = new Platform()
    platform.x = coord.at(0) /* xy位置要在初始化后设置,否则无法检测出 x|y */
    platform.y = coord.at(1)
    this.app.stage.addChild(platform)
    return platform
  }
}
