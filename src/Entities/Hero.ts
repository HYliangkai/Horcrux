import {Container, Graphics} from 'pixi.js'
import {MovePosition, State} from '../types/mod'
import {RectInfo} from '../interface/mod'

// extends Container 来创建一个容器 (分组)
export class Hero extends Container {
  private GRAVITY_FORCE = 0.1 //重力加速度
  private JUMP_FORCE = 6 //弹跳力
  private SPEED = 2 //移动数据
  private velocity_X = 0
  private velocity_Y = 0 //实际速度

  /* 用户位置;用于控制实际位置 */
  private movement = {
    x: MovePosition.Stop,
    y: 0,
  }

  /* 存储方向数据
  用途:
  A. 用于判断运动方向
  B. 用于判断按键冲突
  */
  private directionContext = {
    left: MovePosition.Stop,
    right: MovePosition.Stop,
  }

  private state = State.Stay

  constructor() {
    super() // ~= new Container()

    const view = new Graphics()
    view.rect(0, 0, 20, 60) //这个矩形范围就是人物边框范围
    view.stroke({width: 1, color: 0xff0000})
    this.addChild(view) //将视图添加见Container
  }

  update() {
    this.velocity_X = this.SPEED * Number(this.movement.x)
    this.x += this.velocity_X

    /* 如果在跳跃期间到了下坠阶段就更改状态(目的是开启碰撞检测) */
    if (this.velocity_Y > 0 && this.is_jump_state()) {
      this.state = State.FlyDown
    }

    this.velocity_Y += this.GRAVITY_FORCE //模拟重力加速度--掉落并不是匀速掉落的
    this.y += this.velocity_Y //这样会有个缺陷就是距离碰撞检测会有一小段距离
  }

  /** JUMP! */
  jump() {
    if (this.state == State.Jump || this.state == State.FlyDown) return
    //jump其实就是Y方向上面的速度为负值
    this.velocity_Y -= this.JUMP_FORCE
    this.state = State.Jump
  }

  is_jump_state() {
    return this.state == State.Jump
  }

  /** 停止运动(当发生碰撞的时候) */
  stay() {
    this.state = State.Stay
    this.velocity_Y = 0
  }

  private rect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }
  /** 获取当前的图形信息 */
  get_rect() {
    this.rect.width = this.width
    this.rect.x = this.x
    this.rect.height = this.height
    this.rect.y = this.y
    return this.rect as RectInfo
  }

  start_left_move() {
    this.directionContext.left = MovePosition.Left

    /* 按键冲突判断 */
    if (this.directionContext.right > MovePosition.Stop) {
      //说明此时存在按键冲突,不应该进行移动
      this.movement.x = MovePosition.Stop
      return
    }

    this.movement.x = MovePosition.Left
  }
  start_right_move() {
    this.directionContext.right = MovePosition.Right

    if (this.directionContext.left < MovePosition.Stop) {
      this.movement.x = MovePosition.Stop
      return
    }

    this.movement.x = MovePosition.Right
  }
  stop_left_move() {
    this.directionContext.left = MovePosition.Stop
    this.movement.x = this.directionContext.left
  }
  stop_right_move() {
    this.directionContext.right = MovePosition.Stop
    this.movement.x = this.directionContext.right
  }

  stop_move() {
    this.movement.x = MovePosition.Stop
  }
}
