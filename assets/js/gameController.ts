import {
  _decorator,
  Component,
  Node,
  input,
  Input,
  Animation,
  Contact2DType,
  Collider2D,
  Tween,
  Vec3,
  Prefab,
  instantiate,
  Sprite,
  Label,
  sys,
  AudioClip,
  resources,
  AudioSource,
} from 'cc';
import {ShootBall} from './ShootBall';
import {blueCircle} from "./blueCircle";
import {redCircle} from "./redCircle";
import {ripple} from "./ripple";

const {ccclass, property} = _decorator;

const ACTION_BALL_SIZE = 15

enum AudioType {
  ROTATE,
  RIGHT,
  WRONG,
}

@ccclass('gameController')
export class gameController extends Component {

  @property({type: Prefab})
  public redBallPrefab: Prefab | null = null
  @property({type: Prefab})
  public blueBallPrefab: Prefab | null = null

  @property({type: Prefab})
  public redParticle: Prefab | null = null
  @property({type: Prefab})
  public blueParticle: Prefab | null = null

  @property({type: ShootBall})
  public blueBall: ShootBall | null = null
  @property({type: ShootBall})
  public redBall: ShootBall | null = null

  @property({type: redCircle})
  public redCircle: redCircle | null = null;
  @property({type: blueCircle})
  public blueCircle: blueCircle | null = null;

  @property({type: ripple})
  public whiteRipple: ripple | null = null


  @property({type: Node})
  public gameScene: Node | null = null
  @property({type: Node})
  public gameResult: Node | null = null
  @property({type: Label})
  public scoreLabel: Label | null = null
  private _dotList: Node[] = []
  private _rightDotList: Node[] = []
  @property({type: Animation})
  public levelUpAnimation: Animation | null = null

  @property({type: Sprite})
  public refreshBtn: Sprite | null = null
  @property({type: Label})
  public bestScoreLabel: Label | null = null
  @property({type: Label})
  public curScoreLabel: Label | null = null
  @property({type: Node})
  public musicCloseImage: Node | null = null
  @property({type: Sprite})
  public musicSprite: Sprite | null = null


  @property({type: AudioSource})
  public audioSource: AudioSource | null = null
  private _rightAudio: AudioClip
  private _wrongAudio: AudioClip
  private _rotateAudio: AudioClip

  private _shootBlue: boolean = false
  private _actionSpeed = 0.05
  private _shootCount = 0
  private _bestScore = 0

  start() {
    console.log('---start')
    this.initScore()
    this.initAudio()
    this.showResult(true)
    this.initListener()
    this.initDotList()
  }

  private initScore() {
    this.scoreLabel.string = '' + this._shootCount
    let bestScoreStr = sys.localStorage.getItem('score_best')
    if (bestScoreStr) {
      try {
        this._bestScore = parseInt(bestScoreStr)
      } catch (e) {
        console.log(e)
      }
    }
    this.bestScoreLabel.string = 'BEST : ' + this._bestScore
  }

  private showResult(show) {
    if (show) {
      input.off(Input.EventType.TOUCH_START, this.onMouseUp, this);
    } else {
      input.on(Input.EventType.TOUCH_START, this.onMouseUp, this);
      this.scheduleOnce(() => {
        this.shootBall()
      }, 0.5)
    }
    this.gameResult.active = show
    this.gameScene.active = !show
  }

  private onMouseUp(event) {
    this.blueCircle.circle()
    this.redCircle.circle()
    this.playAudio(AudioType.ROTATE)
  }

  private initDotList() {
    let titleNode = this.gameScene.getChildByName('title')
    for (let i = 1; i <= 5; i++) {
      this._dotList.push(titleNode.getChildByName('dot' + i))
      this._rightDotList.push(titleNode.getChildByName('dotRight' + i))
    }
  }

  private initListener() {
    this.refreshBtn.node.on(Input.EventType.TOUCH_START, (event) => {
      this.showResult(false)
    })
    this.musicSprite.node.on(Input.EventType.TOUCH_START, ()=>{
      console.log('----ms', this.musicSprite.node.active, this.musicCloseImage.active)
      if (this.musicCloseImage.active) {
        this.audioSource.play()
      } else {
        this.audioSource.pause()
      }
      this.musicCloseImage.active = !this.musicCloseImage.active
    })
  }

  private initAudio() {
    resources.load('audio/right', AudioClip, (error, audio) => {
      if (!error) {
        this._rightAudio = audio
      }
    })
    resources.load('audio/wrong', AudioClip, (error, audio) => {
      if (!error) {
        this._wrongAudio = audio
      }
    })
    resources.load('audio/rotate', AudioClip, (error, audio) => {
      if (!error) {
        this._rotateAudio = audio
      }
    })
  }

  private playAudio = (type: AudioType) => {
    if (this.musicCloseImage.active) {
      // 关闭音乐时
      return
    }

    let audioClip
    switch (type) {
      case AudioType.ROTATE:
        audioClip = this._rotateAudio
        break
      case AudioType.RIGHT:
        audioClip = this._rightAudio
        break
      case AudioType.WRONG:
        audioClip = this._wrongAudio
        break
      default:
        audioClip = this._rotateAudio
    }
    if (audioClip) {
      this.audioSource.playOneShot(audioClip, 1.5)
    }
  }

  private shootBall() {
    this._shootBlue = gameController.isBlueBall()
    console.log('---shootBlue', this._shootBlue)
    if (this._shootBlue) {
      this.blueBall.shoot()
    } else {
      this.redBall.shoot()
    }
    this.initCollider(this._shootBlue)
  }

  private initCollider(isShootBlue: boolean) {
    console.log('---initCollider1')
    let shootBall = isShootBlue ? this.blueBall : this.redBall
    let collider = shootBall.getComponent(Collider2D);
    collider.once(Contact2DType.BEGIN_CONTACT, (self, other) => {
      // console.log('----碰撞1', shootBall._isFromUp ? '---from up' : '---from down')
      // 圆环是哪个颜色、球是哪个颜色？
      // console.log('----碰撞2--ball is blue', isShootBlue)
      // 0-90，270~360在上面  90~270在下面
      let isCircleBlue
      if (shootBall._isFromUp) {
        isCircleBlue = !(this.blueCircle.getAngle() > 90 && this.blueCircle.getAngle() < 270)
      } else {
        isCircleBlue = this.blueCircle.getAngle() > 90 && this.blueCircle.getAngle() < 270
      }
      let angle = isCircleBlue ? this.blueCircle.getAngle() : this.redCircle.getAngle()
      // console.log('----碰撞3--circleBlue', isCircleBlue)
      // console.log('----碰撞', other.node.name, this.blueCircle.getAngle(), this.redCircle.getAngle())
      shootBall.stopShoot()
      if (isCircleBlue === isShootBlue) {
        // 正确：继续发射球、并且正确的加上动画
        // 动画：弹射轨迹、放大的白环、粒子效果
        let targetPoi = gameController.calTargetPoi(angle, shootBall._isFromUp);
        this.shootAction(isShootBlue, self.node.position, new Vec3(targetPoi[0], targetPoi[1], 0))
        this.showRipple(self.node.position.x, self.node.position.y)
        this.showParticle(isShootBlue, self.node.position)
        this.playAudio(AudioType.RIGHT)
        this.onBallRight()
      } else {
        // 失败：停止发射球、更新得分、去得分界面、并且失败的加上动画
        this.showRipple(self.node.position.x, self.node.position.y)
        this.showParticle(isShootBlue, self.node.position)
        this.playAudio(AudioType.WRONG)
        this.onBallWrong()
      }
    }, shootBall);
  }

  private speedUp() {
    // 球射出时间
    this.blueBall.speedUp()
    this.redBall.speedUp()
    // 弹出动画时间、初始为0.05
    this._actionSpeed -= 0.005
  }

  private resetSpeed() {
    this.blueBall.resetSpeed()
    this.redBall.resetSpeed()
    this._actionSpeed = 0.05
  }

  private onBallRight() {
    this._shootCount++
    this.scoreLabel.string = '' + this._shootCount
    let count = this._shootCount % 5 - 1
    if (count === -1) {
      count = 4
    }
    this._dotList[count].active = false
    this._rightDotList[count].active = true

    if (count === 4) {
      // 说明要升级：分数重新计算、显示level up的动画、改变速度
      // 改变速度要同步执行、因为要发射下一个球
      // level up的ui变化可以异步执行
      this.speedUp()
      this.scheduleOnce(() => {
        for (let i = 0; i < 5; i++) {
          this._dotList[i].active = true
          this._rightDotList[i].active = false
        }
        this.levelUpAnimation.node.active = true
        this.levelUpAnimation.play()
      }, 0.5)
    }
  }

  private shootAction = (isBlueBall: boolean, selfPoi, targetPoi: Vec3) => {
    let scale = 1
    let alpha = 255
    let nodeList = []
    for (let i = 0; i < ACTION_BALL_SIZE; i++) {
      let node
      if (isBlueBall) {
        node = instantiate(this.blueBallPrefab)
      } else {
        node = instantiate(this.redBallPrefab)
      }
      node.setScale(scale, scale)
      node.getComponent(Sprite).color._set_a_unsafe(alpha)
      node.setPosition(selfPoi)
      nodeList.push(node)
      scale *= 0.95
      alpha *= 0.9
    }
    let index = 0
    let callbackSize = 0
    this.schedule(() => {
      let actionNode = nodeList[index++]
      this.node.addChild(actionNode)
      new Tween(actionNode).to(this._actionSpeed * ACTION_BALL_SIZE,
        {position: targetPoi}
      ).call(() => {
        callbackSize++
        if (callbackSize === ACTION_BALL_SIZE) {
          for (const node of nodeList) {
            this.node.removeChild(node)
          }
          // 需要等弹射动画完了再发射
          this.scheduleOnce(() => {
            this.shootBall()
          }, 0.1)
        }
      }).start()
    }, this._actionSpeed, ACTION_BALL_SIZE - 1)
  }

  private showRipple = (x, y) => {
    // 显示碰撞后白圈的动画
    let randomX
    let randomY
    if (Math.random() > 0.5) {
      randomX = x + Math.random() * 20
    } else {
      randomX = x - Math.random() * 20
    }
    if (Math.random() > 0.5) {
      randomY = y + Math.random() * 10
    } else {
      randomY = y - Math.random() * 10
    }

    this.whiteRipple.setPoi(randomX, randomY)
    this.whiteRipple.duration = 1.5
  }

  private showParticle = (isBlueBall, position) => {
    // 添加碰撞后的粒子效果
    let node = instantiate(isBlueBall ? this.blueParticle : this.redParticle)
    node.setPosition(position)
    this.node.addChild(node)
  }

  private onBallWrong() {
    this.curScoreLabel.string = '' + this._shootCount
    if (this._bestScore < this._shootCount) {
      this._bestScore = this._shootCount
      this.bestScoreLabel.string = 'BEST : ' + this._bestScore
      sys.localStorage.setItem('score_best', this._bestScore.toString())
    }
    this._shootCount = 0
    this.scoreLabel.string = '' + this._shootCount

    for (let i = 0; i < 5; i++) {
      this._dotList[i].active = true
      this._rightDotList[i].active = false
    }
    this.resetSpeed()
    this.showResult(true)
  }


  private static isBlueBall(): boolean {
    return Math.random() > 0.5
  }

  private static calTargetPoi(angle: number, isFromUp: boolean) {
    let isLeft
    // y搞大点
    let y = isFromUp ? 750 : -750
    if (angle === 0 || angle === 180 || angle === 360) {
      return [0, y]
    }
    // console.log('----angle', angle)
    // 随机位置、碰撞我不会算
    return [Math.tan(Math.random() * 45 * Math.PI / 180) * y, y]
  }
}

