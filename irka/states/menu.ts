import { Application, Container, Sprite, Text, TextStyle, utils } from 'pixi.js';
import MultiStyleText from '../multystyle-text';
import { makeTextBox } from '../utils';

const defaultTextStyle = {
    fontFamily: 'DPix',
    fontSize: '14px',
};

const mstStyles = {
    'default': defaultTextStyle,
    'sup': {
        fontSize: '10px',
        textBaseline: 'bottom',
        valign: -4
    },
};

const textStyle = new TextStyle(defaultTextStyle);

function makeButtons(): Container {
    const buttonsContainer = new Container();

    let startText = new Text('старт', textStyle);
    // let exit

    buttonsContainer.addChild(startText);

    return buttonsContainer;
}

export function makeMenu(app: Application): Container {
    const menuContainer = new Container();

    let bgTexture = utils.TextureCache['menu/mm_bgr.png'];
    let bg = new Sprite(bgTexture);

    bg.x = 0;
    bg.y = 0;

    // let textBox = makeTextBox(text);

    // textBox.x = 10;
    // textBox.y = 10;

    menuContainer.addChild(bg);
    // menuContainer.addChild(textBox);

    return menuContainer;
}
