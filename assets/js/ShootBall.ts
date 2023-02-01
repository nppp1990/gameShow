import {_decorator, Component, Node, Animation} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('ShootBall')
export class ShootBall extends Component {
  private _shootAnimation
  public _isFromUp
  private _speed = 0.8

  start() {
    this.checkInit()
    this._updateSpeed()
  }

  private checkInit() {
    if (!this._shootAnimation) {
      this._shootAnimation = this.node.getComponent(Animation)
    }
  }

  public shoot() {
    this.checkInit()
    this.node.active = true
    this._isFromUp = ShootBall.isFromUp()
    if (this._isFromUp) {
      this._shootAnimation.play('ballDown')
    } else {
      this._shootAnimation.play('ballUp')
    }
  }

  public stopShoot() {
    this.checkInit()
    this._shootAnimation.stop()
    this.node.active = false
  }

  private _updateSpeed() {
    if (!this._shootAnimation) {
      return
    }
    if (!this._shootAnimation.getState('ballUp')) {
      // 这里有可能没开始动画、即没触发start、所以getState为null
      return
    }
    this._shootAnimation.getState('ballUp').speed = this._speed
    this._shootAnimation.getState('ballDown').speed = this._speed
  }

  public resetSpeed(): void {
    this.checkInit()
    this._speed = 0.8
    this._updateSpeed()
  }

  public speedUp(): void {
    this.checkInit()
    this._speed += 0.1
    this._updateSpeed()
  }

  private static isFromUp(): boolean {
    return Math.random() > 0.5
  }

  update(deltaTime: number) {

  }
}

