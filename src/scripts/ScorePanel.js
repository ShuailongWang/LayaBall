
export default class ScorePanel extends Laya.Script {
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