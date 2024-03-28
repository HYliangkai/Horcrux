import {Application, Container, Ticker} from 'pixi.js'
import {KeyboardProcessor} from './KeyboardProcessor'
import {Platform, PlatformFactory, Hero} from './Entities/mod'
import {RectInfo} from './interface/mod'

export class Game {
  app: Application
  stage: Container

  keyboard_processor: KeyboardProcessor
  private hero: Hero
  private platforms: Array<Platform> = []
  private platform_factory: PlatformFactory

  constructor(app: Application) {
    console.log('GAME init')
    this.app = app
    this.stage = this.app.stage
    this.platform_factory = new PlatformFactory(app)
    this.keyboard_processor = new KeyboardProcessor(this)
    /*
    一个游戏搭建思路:
    A. 先搭建元素的边框
    B. 再搭配动作和交互效果
    C. 各个元素进行贴图
    */
    {
      const hero = new Hero()
      hero.x = 100
      hero.y = 250
      this.hero = hero
      this.add_child(this.hero)
    }

    {
      const platforms = [
        [100, 400],
        [300, 400],
        [500, 400],
        [700, 400],
        [900, 400],
        [300, 550],
        [0, 738],
        [200, 738],
        [400, 708],
      ]

      platforms.forEach(coord => {
        const platform = this.platform_factory.create_platform(coord as [number, number])
        this.platforms.push(platform)
      })
    }

    this.regist_keyboard_handler()
  }

  /** 更新视图,每帧更新 */
  update(ticker: Ticker) {
    const {x, y} = this.hero
    this.hero.update()
    this.platforms.forEach(target => {
      if (this.hero.is_jump_state()) return /* 跳跃的升起阶段不进行碰撞检测 */
      const collision_result = this.get_platform_collision_result(this.hero, target, {x, y})
      if (collision_result.vertical) {
        /* Y方向发生碰撞Y方向停止运动 */
        this.hero.stay()
      }
    })
  }

  /** 获取细分方向上的碰撞结果 */
  get_platform_collision_result(
    character: Hero,
    platform: RectInfo,
    prev_point: {x: number; y: number}
  ) {
    /*
    Q: 如何检查哪个方向发生碰撞?
    A: 把 x/y 的数据恢复一下然后再进行一次碰撞检测,如果还是碰撞说明碰撞方在对方
    */
    const {horizontal, vertical} = this.get_orient_platform_collision_result(
      character.get_rect() /* 将位置进行复制,就不会有实际移动效果 */,
      platform,
      prev_point
    )
    /* reset */
    if (vertical) character.y = prev_point.y
    return {horizontal, vertical}
  }

  /** 获取细分方向上的碰撞结果(不包含碰撞阻止行为) */
  get_orient_platform_collision_result(
    rect_a: RectInfo,
    rect_b: RectInfo,
    prev_point: {x: number; y: number}
  ) {
    const collision_result = {
      horizontal: false,
      vertical: false,
    }
    if (!this.is_check_aabb(rect_a, rect_b)) return collision_result
    rect_a.y = prev_point.y
    if (!this.is_check_aabb(rect_a, rect_b)) {
      collision_result.vertical = true
      return collision_result
    }
    //恢复后还是碰撞,说明不是Y方向发生碰撞
    collision_result.horizontal = true
    return collision_result
  }

  /** 物体碰撞检测 : A和B是否产生碰撞 */
  is_check_aabb(entity: RectInfo, area: RectInfo) {
    //判断依据 : A.x+A.width 和 B.x+B.width 相交
    //碰撞分为水平和垂直两个方向
    return (
      entity.x < area.x + area.width &&
      entity.x + entity.width > area.x &&
      entity.y < area.y + area.height &&
      entity.y + entity.height > area.y
    )
  }

  add_child(view: Container) {
    this.stage.addChild(view)
  }

  /** 注册键盘处理事件 */
  regist_keyboard_handler() {
    this.keyboard_processor.get_button('ArrowLeft').execute_down = () => {
      this.hero.start_left_move()
    }

    this.keyboard_processor.get_button('ArrowRight').execute_down = () => {
      this.hero.start_right_move()
    }

    this.keyboard_processor.get_button('ArrowLeft').execute_up = () => {
      this.hero.stop_left_move()
    }
    this.keyboard_processor.get_button('ArrowRight').execute_up = () => {
      this.hero.stop_right_move()
    }
    this.keyboard_processor.get_button('Space').execute_down = () => {
      this.hero.jump()
    }
  }
}
