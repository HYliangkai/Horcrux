export type KeyBoardCode =
  | 'KeyS'
  | 'KeyA'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'Space'

export enum MovePosition {
  Left = -1,
  Stop = 0,
  Right = 1,
}

export enum State {
  Jump /* 跳跃 */,
  Stay /* 停止 */,
  FlyDown /* 滑翔 */,
}
