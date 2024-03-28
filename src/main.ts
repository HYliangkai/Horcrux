import {Application} from 'pixi.js'
import {Game} from './Game'

const app = new Application()
;(async () => {
  {
    /* setup */
    await app.init({resizeTo: document.getElementById('main')})
    document.getElementById('main').appendChild(app.canvas)
  }

  const game = new Game(app) /* new-game */

  app.ticker.add(game.update, game) /* set ticker */

  {
    /* 绑定键盘监听 */
    document.addEventListener('keydown', evt => {
      game.keyboard_processor.on_key_down(evt)
    })
    document.addEventListener('keyup', evt => {
      game.keyboard_processor.on_key_up(evt)
    })
  }
})()
