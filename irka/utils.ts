import { DisplayObject, Container, Text, Graphics, filters } from 'pixi.js';

const colorMatrixDark =  [
    1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0, 0,
    -0.16404339962244616, 1.0835251566291304, -0.05498805115633132, -0.3, -0.1,
    -0.16786010706155763, -0.5603416277695248, 1.6014850761964943, -0.3, 0.1,
    0, 0, 0, 1, 0
];
export const darkFilter = new filters.ColorMatrixFilter();
darkFilter.matrix = colorMatrixDark;

export function makeTextBox(text: Text): Container {
    const container = new Container();

    let rectangle = new Graphics();
    // Draw shadow
    rectangle.lineStyle(0, 0x0AB4B4);
    rectangle.beginFill(0x0AB4B4);
    rectangle.drawRect(4, 4, text.width + 4, text.height + 4);
    rectangle.endFill();
    // Draw box
    rectangle.lineStyle(4, 0xffffff);
    rectangle.beginFill(0xffffff);
    rectangle.drawRect(0, 0, text.width, text.height);
    rectangle.endFill();

    container.addChild(rectangle);
    container.addChild(text);
    return container;
}

export const defaultTextStyle = {
    fontFamily: 'DPix',
    fontSize: '14px',
};

export const smallTextStyle = {
    fontSize: '10px',
};

export const centeredText = {
    align: 'center',
};

export const smallCenteredText = {...{}, ...defaultTextStyle, ...smallTextStyle, ...centeredText};

export const mstStyles = {
    'default': defaultTextStyle,
    'sup': {
        fontSize: '10px',
        textBaseline: 'bottom',
        valign: -4
    },
    'sm': {
        fontSize: '10px',
    },
    'center': {
        align: 'center',
    }
};
