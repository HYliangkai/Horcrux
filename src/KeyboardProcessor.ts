import {Game} from './Game'
import {KeyBoardCode} from './types/mod'

/** 键盘处理类 */
export class KeyboardProcessor {
  // 直接映射KeyboardEvent.code
  private key_map: Record<
    string,
    {execute_down: Function; execute_up: Function; is_down: boolean}
  > = {}

  default_down_done = () => {}
  default_up_done = () => {}

  constructor(private game_CTX: Game) {}

  get_button(name: KeyBoardCode) {
    Object.hasOwn(this.key_map, name)
      ? null
      : (this.key_map[name] = {
          execute_down: () => {},
          execute_up: () => {},
          is_down: false,
        })
    return this.key_map[name]
  }

  /** 检测键盘事件 */
  on_key_down({code}: KeyboardEvent) {
    if (this.key_map[code]) {
      this.key_map[code]?.execute_down.call(this.game_CTX)
      this.key_map[code].is_down = true
    } else {
      this.default_down_done.call(this.game_CTX)
    }
  }
  /** 检测松开了哪个键位 */
  on_key_up({code}: KeyboardEvent) {
    if (this.key_map[code]) {
      this.key_map[code]?.execute_up.call(this.game_CTX)
      this.key_map[code].is_down = false
    } else {
      this.default_up_done.call(this.game_CTX)
    }
  }

  is_button_pressed(name: KeyBoardCode) {
    return this.key_map[name]?.is_down
  }
}
