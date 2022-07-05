
export default class BallHandle extends Laya.Script {
    constructor() {
        super();
        
        this.rig = null;
    }

    onAwake() {
       this.rig = this.owner.getComponent(Laya.RigidBody);
       Laya.stage.on("KStartGameNotification", this, this.startGame);
    }

    onDestroy() {
        Laya.stage.off("KStartGameNotification", this, this.startGame);
    }

    startGame() {
        this.rig.type = "dynamic";
    }

    //碰撞检测
    onTriggerEnter(other) {
        console.log(other);

        //判断是否碰到地面
        if (other.owner.name == "bottomLine") {
            Laya.SoundManager.playSound("sound/Ball-Hit-Ground.wav", 1);
            if (this.owner.x < 960) {//left
                this.resetBallPoint(752);
                Laya.stage.event("ResetMyPlayer");
            } else {//right
                this.resetBallPoint(1170);
                Laya.stage.event("ResetAIPlayer");
            }
        }

        if (other.owner.name == "myPlayer") {
            Laya.SoundManager.playSound("sound/BallHit-01.mp3", 1);
        } else if (other.owner.name == "aiPlayer") {
            Laya.SoundManager.playSound("sound/BallHit-02.mp3", 1);
        } else if (other.owner.name == "pole") {
            Laya.SoundManager.playSound("sound/ballHitsMiddlePole.mp3", 1);
        }
    }

    resetBallPoint(x) {
        this.owner.x = x;
        this.owner.y = 260;
        this.rig.setVelocity({x:0,y:0});
        this.rig.angularVelocity = 0;
    }
}