import { _decorator, Component, Node, Graphics, Vec3 } from 'cc';
import {CircleBall} from "db://assets/js/CircleBall";
const { ccclass, property } = _decorator;

@ccclass('redCircle')
export class redCircle extends CircleBall {
    start() {
        this._angleIndex = 10
        this._isRight = false
        const graphic = this.getComponent(Graphics)
        graphic.lineWidth = 10;
        graphic.strokeColor.fromHEX('#FFFFFF')
        graphic.fillColor.fromHEX('#FA686B')
        graphic.circle(0, 0, 55)
        graphic.stroke()
        graphic.fill()
    }

    update(deltaTime: number) {
        
    }
}

