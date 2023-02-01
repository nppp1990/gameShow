import {_decorator, Node, Graphics} from 'cc';
import {CircleBall} from "db://assets/js/CircleBall";

const {ccclass, property} = _decorator;

@ccclass('blueCircle')
export class blueCircle extends CircleBall {

  start() {
    this._angleIndex = 0
    this._isRight = true
    const graphic = this.getComponent(Graphics)
    graphic.lineWidth = 10;
    graphic.strokeColor.fromHEX('#FFFFFF')
    graphic.fillColor.fromHEX('#299FF9')
    graphic.circle(0, 0, 55)
    graphic.stroke()
    graphic.fill()
  }

  update(deltaTime: number) {

  }
}

