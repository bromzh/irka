import { Application, Container, Sprite, Text, TextStyle, DisplayObject, utils } from 'pixi.js';
import MultiStyleText from '../multystyle-text';
import { darkFilter, makeTextBox, smallCenteredText } from '../utils';

function makeQuizButton(): Container {
    const quiz = new Container();
    const quizArea = new Sprite(utils.TextureCache['menu/mm_02.png']);
    const text = makeTextBox(new Text('Начать\nхимический\nтест', smallCenteredText));

    text.alpha = 0;
    quiz.addChild(quizArea);
    quiz.buttonMode = true;
    quiz.interactive = true;

    text.x = quizArea.width / 2 - text.width / 2 - 25;
    text.y = quizArea.height / 2 - text.height / 2;
    quiz.addChild(text);

    const onPointerOver = () => {
        quizArea.filters = [darkFilter];
        text.alpha = 1;

    };
    const onPointerOut = () => {
        quizArea.filters = [];
        text.alpha = 0;
    };
    const onPointerDown = () => {
        quiz.emit('startQuiz');
    };

    quiz.on('pointerover', onPointerOver);
    quiz.on('pointerout', onPointerOut);
    quiz.on('pointerdown', onPointerDown);

    return quiz;
}

export function makeMenu(app: Application): Container {
    const menuContainer = new Container();

    let bgTexture = utils.TextureCache['menu/mm_bgr.png'];
    let bg = new Sprite(bgTexture);

    bg.x = 0;
    bg.y = 0;

    let quiz = makeQuizButton();
    quiz.x = 256;
    quiz.y = 256;

    quiz.on('startQuiz', () => {
        app.stage.emit('startQuiz');
    });

    menuContainer.addChild(bg);
    menuContainer.addChild(quiz);

    return menuContainer;
}
