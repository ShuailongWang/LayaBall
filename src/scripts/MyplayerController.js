
export default class MyplayerController extends Laya.Script {
    constructor() {
        super();
        
        /** @prop {name:shoe, tips:"鞋子", type:Node, default:null} */

        this.rig = null;
        this.canJump = true;
        this.shoe = null;
    }

    onAwake() {
        this.rig = this.owner.getComponent(Laya.RigidBody);
    }

    onDisable() {

    }

    onStart() {

    }

    onUpdate() {
        this.rotationShote();

        if (Laya.KeyBoardManager.hasKeyDown(Laya.Keyboard.A)) {
            var y = this.rig.linearVelocity.y;//拿到原先的y
            this.rig.setVelocity({x:-10, y:y});
        }
        if (Laya.KeyBoardManager.hasKeyDown(Laya.Keyboard.D)) {
            var y = this.rig.linearVelocity.y;
            this.rig.setVelocity({x:10, y:y});
        }
    }

    onKeyDown(e) {
        //空格跳跃，
        if (e.nativeEvent.key == " " && this.canJump) {
            this.canJump = false;
            console.log('spane');
            var x = this.rig.linearVelocity.x;
            this.rig.setVelocity({x:x, y:-11});
        }
    }

    //鞋子旋转
    rotationShote() {
        if (this.rig.linearVelocity.x > 0.1) {//右
            console.log('rotationShote111:' + this.rig.linearVelocity.x);
            this.shoe.rotation = 23;
        } else if (this.rig.linearVelocity.x < -0.1) {//左
            this.shoe.rotation = -23;
            console.log('rotationShote222:' + this.rig.linearVelocity.x);
        } else {//停止
            this.shoe.rotation = 0;
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
}