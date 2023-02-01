import { _decorator, Component, Node, Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('whiteDot')
export class whiteDot extends Component {
    start() {
        const graphic = this.getComponent(Graphics)
        graphic.fillColor.fromHEX('#FFFFFF')
        graphic.circle(0, 0, 15)
        graphic.fill()
    }

    update(deltaTime: number) {
        
    }
}

