import ScorePanel from "./ScorePanel";

export default class GameManager extends Laya.Script {
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