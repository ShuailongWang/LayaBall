import GameManager from "./GameManager";

export default class AiplayerController extends Laya.Script {
    constructor() {
        super();
        
        /** @prop {name:ball, tips:"球", type:Node, default:null} */
        /** @prop {name:shoe, tips:"鞋子", type:Node, default:null} */

        this.rig = null;
        this.shoe = null;

        this.minX = 1031;
        this.maxX = 1655;
        this.ball = null;
        this.minJumpDistance = 200; //ai出发跳跃高度
        this.canJump = true;
        this.jumpSpeed = -10;
        this.lastX = 0;
        this.offsetX = 0;
    }

    onAwake() {
        this.rig = this.owner.getComponent(Laya.RigidBody);
        Laya.stage.on("ResetAIPlayer", this, this.resetPoint);//监听事件
    }

    onDestroy() {
        Laya.stage.off("ResetAIPlayer", this, this.resetPoint);
    }

    onDisable() {

    }

    onStart() {

    }

    onUpdate() {
        //是否在区间
        if (this.ball.x > this.minX && this.ball.x < this.maxX) {
            //this.owner.x = this.ball.x + 40;
            //移动速度
            var targetX = this.ball.x + this.offsetX;
            Laya.MathUtil.lerp(this.owner.x, targetX, Laya.timer.delta/1000*15);
            
            //鞋子旋转
            if (this.owner.x > this.lastX) {//右
                this.shoe.rotation = -23;
            } else {//左
                this.shoe.rotation = 23;
            }
            this.lastX = this.owner.x;

            //判断球距离头部100（斜边*斜边=x*x + y*y），跳跃
            var delx = this.owner.x - this.ball.x;
            var dely = this.owner.y - this.ball.y;
            var dis = Math.sqrt(delx *delx + dely * dely);
            if (dis < this.minJumpDistance && this.canJump) {
                this.canJump = false;

                var x = this.rig.linearVelocity.x;
                var y = this.jumpSpeed - this.getRandow(1, 5);
                this.rig.setVelocity({x:x, y:y});
            }

        } else {
            this.shoe.rotation = 0;
            this.offsetX = this.getRandow(20, 40);
        }
    }

    //碰撞检测
    onTriggerEnter(other) {
        console.log(other);

        //判断是否碰到地面
        if (other.owner.name == "bottomLine") {
            this.canJump = true;
        }
    }

    getRandow(min, max) {
        var value = max - min;
        value = Math.random() * value;
        return value + min;
    }

    //重置
    resetPoint() {
        this.owner.x = 1260;
        this.owner.y = 770;
        this.rig.setVelocity({x:0,y:0});

        this.owner.parent.getComponent(GameManager).addMyScore();
    }
}