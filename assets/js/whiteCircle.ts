import {_decorator, Component, Node, Graphics} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('whiteCircle')
export class whiteCircle extends Component {
  start() {
    const graphic = this.getComponent(Graphics)
    graphic.lineWidth = 10;
    graphic.strokeColor.fromHEX('#ffffff')
    graphic.circle(0, 0, 100)
    graphic.stroke()
  }

  update(deltaTime: number) {

  }
}

