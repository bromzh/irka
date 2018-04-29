const {ccclass, property} = cc._decorator;

@ccclass
export default class Flask extends cc.Component {
    @property({ type: cc.Color })
    get staffColor(): cc.Color {
        if (this.innerStaff && this.innerStaff.node) {
            return this.innerStaff.node.color;
        }
        return null;
    }

    set staffColor(value: cc.Color) {
        if (this.innerStaff && this.innerStaff && this.innerStaff.node) {
            this.innerStaff.node.color = value;
        }
    }

    @property(cc.Sprite)
    innerStaff: cc.Sprite = null;

    animation: cc.Animation = null;
    animationClip: cc.AnimationClip;

    changeColor(from: cc.Color, to: cc.Color, speed: number = 1) {
        // this.innerStaff.node.color = to;
        const animationClip = this.animation.getClips()[0];
        this.animation.removeClip(animationClip);

        animationClip.curveData = {
            props: {
                color: [
                    { frame: 0, value: this.innerStaff.node.color },
                    { frame: 0.5, value: to },
                ],
            },
        };

        animationClip.speed = speed;

        const state = this.animation.addClip(animationClip, `${from.getR()}-${from.getG()}-${from.getB()}`);

        this.animation.play(state.name);
        this.animationClip = animationClip;

        // cc.log(this.animation);
        // cc.log(state);
    }

    onAnimCompleted() {
        cc.log('COMPLETE!!');
    }

    start() {
        this.animation = this.innerStaff.getComponent(cc.Animation);
        this.animationClip = this.animation.getClips()[0];
    }
}
