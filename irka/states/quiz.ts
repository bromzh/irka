import { Application, Container, Sprite, Text, TextStyle, Texture, Graphics, utils } from 'pixi.js';
import MultiStyleText from '../multystyle-text';
import { makeTextBox, mstStyles } from '../utils';
import { Question, QUESTIONS } from 'irka/questions';

const W = 352;
const H = 80;
const P = 5;
const RA = '→';
const DA = '↓';
const UA = '↑';

class IrkaDialogBox {
    readonly container: Container = new Container();
    private currentText: MultiStyleText;
    private currentIdx: number;

    constructor(private texts: string[] = []) {
        const rect = new Graphics();
        rect.beginFill(0xffffff);
        rect.drawRect(0, 0, 250, 250);
        rect.endFill();

        this.container.addChild(rect);

        this.currentText = new MultiStyleText(texts[0], mstStyles);
        this.currentText.x = 5;
        this.currentText.y = 5;
        this.currentIdx = 0;
        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.addChild(this.currentText);
        this.container.on('pointerdown', () => this.showNextMessage());
    }

    loadTexts(texts: string[]) {
        this.texts = texts;
        this.currentText.text = texts[0];
        this.currentIdx = 0;
    }

    showText(text: string): void {
        this.currentText.text = text;
    }

    showNextMessage(): void {
        this.currentIdx++;
        if (this.currentIdx < this.texts.length) {
            this.showText(this.texts[this.currentIdx]);
        } else {
            this.retry();
        }
    }

    retry(): void {
        this.currentIdx = -1;
        this.showNextMessage();
    }
}

class AnswerButton {
    container: Container = new Container();

    private msText: MultiStyleText = new MultiStyleText('', mstStyles);

    constructor(text: string = '') {
        this.initUi();
        this.setText(text);
    }

    setText(text: string) {
        // console.log('set text')
        this.msText.text = text;
        this.msText.x = W / 2 - this.msText.width / 2;
        this.msText.y = H / 2 - this.msText.height / 2;
    }

    private initUi() {
        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.height = W;
        this.container.width = H;

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

        this.container.addChild(defaultButton);
        this.container.addChild(selectedButton);
        this.container.addChild(this.msText);

        this.container.on('pointerover', () => {
            defaultButton.visible = false;
            selectedButton.visible = true;
        });
        this.container.on('pointerout', () => {
            selectedButton.visible = false;
            defaultButton.visible = true;
        });
    }
}


// function makeAnswerButtons(texts: string[]): Container {
//     function makeButton(text: string): Container {
//         const btn = new Container();
//         btn.interactive = true;
//         btn.buttonMode = true;
//         btn.height = W;
//         btn.width = H;
//
//         const defaultButton = new Graphics();
//         defaultButton.lineStyle(1, 0x0AB4B4);
//         defaultButton.beginFill(0xffffff);
//         defaultButton.drawRect(0, 0, W, H);
//         defaultButton.endFill();
//
//         const selectedButton = new Graphics();
//         selectedButton.lineStyle(1, 0x0AB4B4);
//         selectedButton.beginFill(0x54D1E4);
//         selectedButton.drawRect(0, 0, W, H);
//         selectedButton.endFill();
//         selectedButton.visible = false;
//
//         const msText = new MultiStyleText(text, mstStyles);
//         msText.x = W / 2 - msText.width / 2;
//         msText.y = H / 2 - msText.height / 2;
//
//         btn.addChild(defaultButton);
//         btn.addChild(selectedButton);
//         btn.addChild(msText);
//
//         btn.on('pointerover', () => {
//             defaultButton.visible = false;
//             selectedButton.visible = true;
//         });
//         btn.on('pointerout', () => {
//             selectedButton.visible = false;
//             defaultButton.visible = true;
//         });
//
//         return btn;
//     }
//
//     const buttons = new Container();
//
//     const bg = new Graphics();
//     bg.beginFill(0x98ECFF);
//     bg.drawRect(0, 0, W + P * 2, P + texts.length * (H + P));
//     bg.endFill();
//
//     buttons.addChild(bg);
//
//     for (let i = 0; i < texts.length; ++i) {
//         let btn = makeButton(texts[i]);
//         btn.x = P;
//         btn.y = P + i * (H + P);
//         buttons.addChild(btn);
//     }
//     return buttons;
// }
//
// function makeInterfaceButtons(): Container {
//     const buttons = new Container();
//
//     function makeInterfaceButton(texture: string, x: number, y: number): Container {
//         const btn = new Sprite(utils.TextureCache[texture]);
//         btn.interactive = true;
//         btn.buttonMode = true;
//         btn.x = x;
//         btn.y = y;
//         buttons.addChild(btn);
//         return btn;
//     }
//
//     const exitButton = makeInterfaceButton('interface/interface_exit.png', 36, 36);
//     const retryButton = makeInterfaceButton('interface/interface_retry.png', 0, 0);
//     const explainButton = makeInterfaceButton('interface/interface_explain.png', 36, 0);
//     const howtoButton = makeInterfaceButton('interface/interface_howto.png', 0, 36);
//
//     exitButton.on('pointerdown', () => buttons.emit('quizExit'));
//     retryButton.on('pointerdown', () => buttons.emit('quizRetry'));
//     explainButton.on('pointerdown', () => buttons.emit('quizExplain'));
//     howtoButton.on('pointerdown', () => buttons.emit('quizHowto'));
//
//     return buttons;
// }
//
//
//
// function makeQuizUi(questions: Question[]): Container {
//     const ui = new Container();
//
//     function makeQuestionUi(question: Question): Container {
//         const questionUi = new Container();
//
//         const answers = makeAnswerButtons(question.answers);
//         answers.y = 81;
//         questionUi.addChild(answers);
//
//         const dialog = new IrkaDialogBox(question.texts);
//         dialog.container.x = 370;
//         dialog.container.y = 10;
//         questionUi.addChild(dialog.container);
//
//         questionUi.visible = false;
//         ui.addChild(questionUi);
//         return questionUi;
//     }
//
//     const interfaceButtons = makeInterfaceButtons();
//     interfaceButtons.x = 370;
//     interfaceButtons.y = 270;
//     ui.addChild(interfaceButtons);
//
//     interfaceButtons.on('quizExit', () => ui.emit('quizExit'));
//
//     const qs = questions.map(makeQuestionUi);
//     qs[0].visible = true;
//
//     return ui;
// }

class QuizUi {
    readonly container = new Container();

    private interfaceButtons: Container = new Container();
    private dialog: IrkaDialogBox = new IrkaDialogBox();
    private answerButtons: Container = new Container();
    private buttons: AnswerButton[] = [];

    private questions: Question[];
    private currentQuestion: Question;
    private currentQuestionIdx: number;
    private irka: Sprite;

    private irkaNarr: Texture;
    private irkaGlad: Texture;
    private irkaSad: Texture;

    constructor(private app: Application) {
        this.initUi();
    }

    loadQuestions(questions: Question[]) {
        this.questions = questions;
        this.currentQuestionIdx = 0;
        this.loadQuestion(questions[0]);
    }

    initUi() {
        const bg = new Sprite(new Texture(utils.TextureCache['lvl/test_bgr.png']));

        this.container.addChild(bg);

        this.irkaNarr = utils.TextureCache['lvl/irka_narrative/1 - irka_narr.png'];
        this.irkaGlad = utils.TextureCache['lvl/glad_irka/4 - irka_glad.png'];
        this.irkaSad = utils.TextureCache['lvl/sad_irka/4 - irka_sad.png'];

        this.irka = new Sprite(this.irkaNarr);
        // this.irka.texture = this.irkaNarr;

        this.interfaceButtons.x = 370;
        this.interfaceButtons.y = 270;

        this.dialog.container.x = 370;
        this.dialog.container.y = 10;

        this.irka.x = 420;
        this.irka.y = 280;



        const makeInterfaceButton = (texture: string, x: number, y: number): Container => {
            const btn = new Sprite(utils.TextureCache[texture]);
            btn.interactive = true;
            btn.buttonMode = true;
            btn.x = x;
            btn.y = y;
            this.interfaceButtons.addChild(btn);
            return btn;
        };

        const exitButton = makeInterfaceButton('interface/interface_exit.png', 36, 36);
        const retryButton = makeInterfaceButton('interface/interface_retry.png', 0, 0);
        const explainButton = makeInterfaceButton('interface/interface_explain.png', 36, 0);
        const howtoButton = makeInterfaceButton('interface/interface_howto.png', 0, 36);

        exitButton.on('pointerdown', () => this.onExit());
        retryButton.on('pointerdown', () => this.retry());
        // explainButton.on('pointerdown', () => buttons.emit('quizExplain'));
        // howtoButton.on('pointerdown', () => buttons.emit('quizHowto'));

        this.container.addChild(this.irka);

        this.container.addChild(this.interfaceButtons);

        this.container.addChild(this.dialog.container);

        this.makeAnswersButtons();
        this.container.addChild(this.answerButtons);

    }

    onExit() {
        this.reset();
        this.app.stage.emit('quizExit');
    }

    retry() {
        this.dialog.retry();
    }

    answer(n: number) {
        if (this.currentQuestion.rightAnswer === n) {
            this.irka.texture = this.irkaGlad;
            this.dialog.showText('Правильно!\nКакой ты молодец');
            this.buttons.forEach(b => b.container.interactive = false);
            this.container.interactive = true;
            this.container.once('pointerdown', () => {
                this.irka.texture = this.irkaNarr;
                this.container.interactive = false;
                this.buttons.forEach(b => b.container.interactive = true);
                this.loadNextQuestion();
            });
        } else {
            this.irka.texture = this.irkaSad;
            this.dialog.showText('Ты уверен?\nМне кажется, тут\nкакая-то ошибка');
            this.buttons.forEach(b => b.container.interactive = false);
            this.container.interactive = true;
            this.container.once('pointerdown', () => {
                this.irka.texture = this.irkaNarr;
                this.buttons.forEach(b => b.container.interactive = true);
                this.dialog.retry();
                this.container.interactive = false;
            });
        }
    }

    loadNextQuestion() {
        this.currentQuestionIdx++;
        if (this.currentQuestionIdx < this.questions.length) {
            this.loadQuestion(this.questions[this.currentQuestionIdx]);
        } else {
            this.dialog.showText('Ты ответил на все\nвопросы');
            this.container.interactive = true;
            this.container.once('pointerdown', () => {
                this.reset();
                this.container.interactive = false;
            });
        }
    }

    loadQuestion(question: Question) {
        this.currentQuestion = question;
        this.dialog.loadTexts(question.texts);

        for (let i = 0; i < 4; ++i) {
            this.buttons[i].setText(question.answers[i]);
        }
    }

    reset() {
        this.irka.texture = this.irkaNarr;
        this.currentQuestionIdx = -1;
        this.loadQuestion(this.questions[0]);
    }

    private makeAnswersButtons() {
        // this.buttons = new Container();

        const bg = new Graphics();
        bg.beginFill(0x98ECFF);
        bg.drawRect(0, 0, W + P * 2, P + 4 * (H + P));
        bg.endFill();

        this.answerButtons.addChild(bg);
        this.answerButtons.y = 81;

        for (let i = 0; i < 4; ++i) {
            let btn = new AnswerButton('');
            btn.container.x = P;
            btn.container.y = P + i * (H + P);
            btn.container.on('pointerdown', () => this.answer(i));
            this.buttons.push(btn);
            this.answerButtons.addChild(btn.container);
        }
    }

}

export function makeQuiz(app: Application): Container {
    const quiz = new QuizUi(app);
    quiz.loadQuestions(QUESTIONS);
    return quiz.container;
}
