import { _decorator, Component, Node, Graphics, Color } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 白色波纹效果
 */
@ccclass('ripple')
export class ripple extends Component {
    private ctx
    private _lineWidth
    private _radius
    private _time
    private _isIncrease
    private _frameCount
    private _alpha

    private _duration = 1
    // 更新次数、
    private _updateCount = 60
    // 半径最大100、最小10
    private _radiusUnit = 1
    // 40到0.1
    private _widthUnit = 0.1
    private _alphaUnit = 1

    start() {
        this.ctx = this.node.getComponent(Graphics);
        // 默认为1s
        this.duration = 1
    }

    public rest() {
        this._time = 0
        this._lineWidth = 0
        this._radius = 0
        this._isIncrease = true
        this._frameCount = 0
        this._alpha = 0
    }

    public setPoi(x, y) {
        this.node.setPosition(x, y, 0)
    }

    set duration(dur: number) {
        this._duration = dur
        this.rest()
        this._updateCount = Math.floor(dur / 2 / 0.016)
        this._widthUnit = 30 / this._updateCount
        this._radiusUnit = 100 / this._updateCount
        this._alphaUnit = 200 / this._updateCount
        this.node.active = true
    }

    get duration() {
        return this._duration
    }

    update(deltaTime: number) {
        // 0.016
        // console.log('----update', this._frameCount)
        if (this._isIncrease) {
            this._radius += this._radiusUnit
            this._lineWidth += this._widthUnit
            this._alpha += this._radiusUnit
            this._frameCount++
        } else {
            this._radius -= this._radiusUnit
            this._lineWidth -= this._widthUnit
            this._alpha += this._radiusUnit
            this._frameCount--
        }

        if (this._frameCount === this._updateCount) {
            console.log('-----', this._radius, this._lineWidth, this._alpha)
            this._isIncrease = !this._isIncrease
        }

        if (this._frameCount === 0) {
            this.node.active = false
        }

        this.ctx.clear()
        this.ctx.lineWidth = this._lineWidth
        this.ctx._strokeColor = new Color(220, 220, 220, Math.floor(this._alpha))
        this.ctx.circle(0, 0, this._radius)
        this.ctx.stroke()
    }
}

