import { Application, Container, Sprite, Text, TextStyle, Texture, utils } from 'pixi.js';
import MultiStyleText from '../multystyle-text';
import { makeTextBox } from '../utils';

interface Answer {
    text: Text;
    isTruth: boolean;
}

class Quiz {
    text: Text;
    answers: Answer[];
}

function makeQuizUi(): Container {
    const s = new Container();

    return s;
}

export function makeQuiz(app: Application): Container {
    const quizCoontainer = new Container();

    const bg = new Sprite(new Texture(utils.TextureCache['lvl/test_bgr.png']));
    quizCoontainer.addChild(bg);

    return quizCoontainer;
}
