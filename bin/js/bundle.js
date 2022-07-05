(function () {
    'use strict';

    class ScorePanel extends Laya.Script {
        constructor() {
            super();
            /** @prop {name:score_mine, tips:"玩家得分", type:Node, default:null} */
            /** @prop {name:score_ai, tips:"AI得分", type:Node, default:null} */
            /** @prop {name:name_mine, tips:"玩家名字", type:Node, default:null} */
            /** @prop {name:name_ai, tips:"AI名字", type:Node, default:null} */
            /** @prop {name:down_time, tips:"倒计时", type:Node, default:null} */
            

            this.score_mine = null;
            this.score_ai = null;
            this.name_mine = null;
            this.name_ai = null;
            this.down_time = null;
        }

        onAwake() {
            
        }
        updateMyScore(score) {
            this.score_mine.text = score;
        }

        updateAIScore(score) {
            this.score_ai.text = score;
        }

        updateDownTime(time) {
            this.down_time.text = time;
        }
    }

    class GameManager extends Laya.Script {
        constructor() {
            super();
            /** @prop {name:scoreView, tips:"得分面板", type:Node, default:null} */
            /** @prop {name:startText, tips:"开始倒计时", type:Node, default:null} */

            this.startText = null;
            this.scoreView = null;
            this.scorePannelView = null;

            this.myScore = 0;
            this.AiScore = 0;

            this.timer = 0;
            this.timeNum = 3;
            this.startGameBol = false;
        }

        onAwake() {
            this.scorePannelView = this.scoreView.getComponent(ScorePanel);
        }

        onUpdate() {
            if (this.startGameBol == false) {
                this.timer += Laya.timer.delta/1000;
                if (this.timer >= 1) {
                    this.timer = 0;
                    this.timeNum--;
                    if (this.timeNum <= 0) {
                        this.startGameBol = true;
                        this.startText.visible = false;
                        this.startGame();
                        return;
                    }
                    this.startText.text = this.timeNum;
                }
            }
        }

        startGame() {
            Laya.SoundManager.playSound("sound/startWistle.mp3", 1, 
            new Laya.Handler(this, function() {
                Laya.stage.event("KStartGameNotification");
            }));
        }

        //
        addMyScore() {
            this.myScore++;
            this.scorePannelView.updateMyScore(this.myScore);
        }

        addAIScore() {
            this.AiScore++;
            this.scorePannelView.updateAIScore(this.AiScore);
        }
    }

    class AiplayerController extends Laya.Script {
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

    class MyplayerController extends Laya.Script {
        constructor() {
            super();
            
            /** @prop {name:shoe, tips:"鞋子", type:Node, default:null} */

            this.rig = null;
            this.canJump = true;
            this.shoe = null;
        }

        onAwake() {
            this.rig = this.owner.getComponent(Laya.RigidBody);
            Laya.stage.on("ResetMyPlayer", this, this.resetPoint);//监听事件
        }

        onDestroy() {
            Laya.stage.off("ResetMyPlayer", this, this.resetPoint);
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
                this.rig.setVelocity({x:x, y:-13});
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

        //重置
        resetPoint() {
            this.owner.x = 660;
            this.owner.y = 770;
            this.rig.setVelocity({x:0,y:0});

            this.owner.parent.getComponent(GameManager).addAIScore();
        }
    }

    class BallHandle extends Laya.Script {
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

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("scripts/AIPlayerController.js",AiplayerController);
    		reg("scripts/MyplayerController.js",MyplayerController);
    		reg("scripts/ScorePanel.js",ScorePanel);
    		reg("scripts/BallHandle.js",BallHandle);
    		reg("scripts/GameManager.js",GameManager);
        }
    }
    GameConfig.width = 1920;
    GameConfig.height = 1080;
    GameConfig.scaleMode ="showall";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Main.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;

    GameConfig.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError(true);

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
