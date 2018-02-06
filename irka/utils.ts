import { Container, Text, Graphics } from 'pixi.js';

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
