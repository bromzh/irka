import Bottle from './Bottle';
import Flask from './Flask';
import Torch from './Torch';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Quiz extends cc.Component {
    @property({ type: cc.ToggleContainer })
    toggleContainer: cc.ToggleContainer = null;

    @property({ type: cc.Node })
    irka: cc.Node = null;

    @property({ type: cc.Prefab })
    bottlePrefab: cc.Prefab = null;

    @property({ type: cc.Prefab })
    flaskPrefab: cc.Prefab = null;

    @property({ type: cc.Prefab })
    torchPrefab: cc.Prefab = null;

    // @property(cc.Label)
    // label: cc.Label = null;

    start() {
        this.toggleContainer.toggleItems.forEach(e => {
            e.node.on(cc.Node.EventType.MOUSE_DOWN, () => this.irka.getComponent(cc.Animation).play(e.node.name));
            e.node.on(cc.Node.EventType.TOUCH_START, () => this.irka.getComponent(cc.Animation).play(e.node.name));
        });

        const flask1 = this.addFlask(-150, -150, new cc.Color(128, 255, 0));
        const flaskCmp = flask1.getComponent(Flask);

        const torch = this.addTorch();
        const torchCmp = torch.getComponent(Torch);

        const changeLiquidColor = () => {
            if (!torchCmp.isActive) {
                const r = Math.round(Math.random() * 255);
                const g = Math.round(Math.random() * 255);
                const b = Math.round(Math.random() * 255);

                const newColor = new cc.Color(r, g, b);

                flaskCmp.changeColor(flaskCmp.staffColor, newColor, 1);
            }
        }

        torch.on(cc.Node.EventType.MOUSE_DOWN, () => changeLiquidColor());
        torch.on(cc.Node.EventType.TOUCH_START, () => changeLiquidColor());
    }

    addFlask(x: number, y: number, color?: cc.Color): cc.Node {
        if (!color) {
            color = new cc.Color(255, 255, 255);
        }
        const node = cc.instantiate(this.flaskPrefab);
        this.node.addChild(node);
        node.setPosition(x, y);

        node.getComponent(Flask).staffColor = color;

        return node;
    }

    addBottle(x: number, y: number, color?: cc.Color): cc.Node {
        if (!color) {
            color = new cc.Color(255, 255, 255);
        }
        const node = cc.instantiate(this.bottlePrefab);
        this.node.addChild(node);
        node.setPosition(x, y);

        node.getComponent(Bottle).staffColor = color;

        return node;
    }

    addTorch(x: number = -152, y: number = -211): cc.Node {
        const node = cc.instantiate(this.torchPrefab);
        this.node.addChild(node);
        node.setPosition(x, y);
        return node;
    }
}
