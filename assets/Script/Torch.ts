const {ccclass, property} = cc._decorator;

@ccclass
export default class Torch extends cc.Component {

    isActive: boolean;

    @property(cc.SpriteFrame)
    offSpriteFrame: cc.SpriteFrame = null;

    @property(cc.Node)
    torchSpriteNode: cc.Node = null;

    torchAnimation: cc.Animation;
    torchSprite: cc.Sprite;

    start() {
        this.torchSprite = this.torchSpriteNode.getComponent(cc.Sprite);
        this.torchAnimation = this.torchSpriteNode.getComponent(cc.Animation);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.toggle();
        });
    }

    toggle() {
        if (this.isActive) {
            this.off();
        } else {
            this.on();
        }
    }

    on() {
        this.isActive = true;
        this.torchAnimation.play();
    }

    off() {
        this.isActive = false;
        this.torchAnimation.stop();
        this.torchSprite.spriteFrame = this.offSpriteFrame;
    }
}
