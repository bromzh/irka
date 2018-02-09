import { Application, Sprite, Container, Texture, TextStyle, loader, utils } from 'pixi.js';
import { makeMenu } from './states/menu';
import { makeQuiz } from './states/quiz';

function setupRenderer(app: Application): void {
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    app.renderer.resize(640, 640);
}

function loaderHandler(loader: any, resource: any) {
    console.log("progress: " + loader.progress + "%");
}

function setup(app: Application) {
    const menu = makeMenu(app);
    const quiz = makeQuiz(app);

    quiz.visible = false;

    app.stage.on('startQuiz', () => {
        menu.visible = false;
        quiz.visible = true;
    });

    app.stage.on('quizExit', () => {
        quiz.visible = false;
        menu.visible = true;
    });

    app.stage.addChild(menu);
    app.stage.addChild(quiz);
}


export function init() {
    const app = new Application({
        antialias: true,
        transparent: false,
        resolution: 1,
    });

    setupRenderer(app);

    loader.add('res/irka.json')
        .on('progress', loaderHandler)
        .load(() => setup(app));

    return app;
}
