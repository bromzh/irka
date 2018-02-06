import { init } from './irka/game';

const app = init();
console.log(app);
document.body.appendChild(app.view);
