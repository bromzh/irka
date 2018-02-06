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

const quizSprites = {
    bg: 'lvl/test_bgr.png',
    btn: 'lvl/test_button_disabled.png',
    btnSelected: 'lvl/test_button_enabled.png',
};

const textStyle = new TextStyle(defaultTextStyle);
