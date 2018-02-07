import { Application, Container, Sprite, Text, TextStyle, Texture, Graphics, utils } from 'pixi.js';
import MultiStyleText from '../multystyle-text';
import { makeTextBox, mstStyles } from '../utils';

const W = 352;
const H = 80;
const P = 5;
const RA = '→';
const DA = '↓';
const UA = '↑';

const TEXTS = [
    `CuSO<sub>4</sub> + (NH<sub>4</sub>)<sub>2</sub>S → CuS↓ + (NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub>`,
    `Ni(NO<sub>3</sub>)<sub>2</sub> → Ni(NO<sub>2</sub>)<sub>2</sub> + O<sub>2</sub>↑`,
    `CuCO<sub>3</sub> → CO<sub>2</sub>↑ + CuO`,
    `2Cu(NO<sub>3</sub>)<sub>2</sub> → 2CuO + 4NO<sub>2</sub> + O<sub>2</sub>↑`,
];

function makeButton(text: string): Container {
    const btn = new Container();
    btn.interactive = true;
    btn.buttonMode = true;
    btn.height = W;
    btn.width = H;

    const defaultButton = new Graphics();
    defaultButton.lineStyle(1, 0x0AB4B4);
    defaultButton.beginFill(0xffffff);
    defaultButton.drawRect(0, 0, W, H);
    defaultButton.endFill();

    const selectedButton = new Graphics();
    selectedButton.lineStyle(1, 0x0AB4B4);
    selectedButton.beginFill(0x54D1E4);
    selectedButton.drawRect(0, 0, W, H);
    selectedButton.endFill();
    selectedButton.visible = false;

    const msText = new MultiStyleText(text, mstStyles);
    msText.x = W / 2 - msText.width / 2;
    msText.y = H / 2 - msText.height / 2;

    btn.addChild(defaultButton);
    btn.addChild(selectedButton);
    btn.addChild(msText);

    btn.on('pointerover', () => {
        defaultButton.visible = false;
        selectedButton.visible = true;
    });
    btn.on('pointerout', () => {
        selectedButton.visible = false;
        defaultButton.visible = true;
    });

    return btn;
}

function makeButtons(texts: string[]): Container {
    const btns = new Container();

    const bg = new Graphics();
    bg.beginFill(0x98ECFF);
    bg.drawRect(0, 0, W + P * 2, P + texts.length * (H + P));
    bg.endFill();

    btns.addChild(bg);

    for (let i = 0; i < texts.length; ++i) {
        let btn = makeButton(texts[i]);
        btn.x = P;
        btn.y = P + i * (H + P);
        btns.addChild(btn);
    }
    return btns;
}

function makeQuizUi(): Container {
    const s = new Container();
    const buttons = makeButtons(TEXTS);
    buttons.y = 81;
    s.addChild(buttons);
    return s;
}

export function makeQuiz(app: Application): Container {
    const container = new Container();

    const bg = new Sprite(new Texture(utils.TextureCache['lvl/test_bgr.png']));
    container.addChild(bg);

    const quizUi = makeQuizUi();
    container.addChild(quizUi);

    return container;
}
