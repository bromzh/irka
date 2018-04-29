const {ccclass, property} = cc._decorator;

@ccclass
export default class Bottle extends cc.Component {
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
}
