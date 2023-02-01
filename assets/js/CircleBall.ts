import {_decorator, Component, Vec3} from 'cc';

export class CircleBall extends Component {
  protected _angleIndex = 0
  protected _callback
  // 0-180度
  protected _isRight = true

  public getAngle() {
    return 18 * this._angleIndex
  }

  public circle() {
    if (this._callback) {
      this.unschedule(this._callback)
    }
    if (this._isRight) {
      this._angleIndex = 0
    } else {
      this._angleIndex = 10
    }
    this._isRight = !this._isRight
    let index = 0
    this._callback = () => {
      let x = 100 * Math.sin(this._angleIndex * 18 / 180 * Math.PI)
      let y = 100 * Math.cos(this._angleIndex * 18 / 180 * Math.PI)
      this.node.position = new Vec3(x, y, 0)
      if (index < 10) {
        this._angleIndex++
      }
      index++
      // console.log('-----index', this._angleIndex)
    }
    this.schedule(this._callback, 0.01, 10)
  }


}

