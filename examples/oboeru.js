"use strict";
var cardLength = 5,
    alphabet = 'hiragana',
    score = 0,
    time = 300,
    hintTime = 1000,
    isPrev = true,
    points,
    letterStorage,
    startScreen,
    finishScreen;

// utils
function kana(type) {
    // get random kana symbol. type can be 'hiragana' or 'katakana'
    var dict = {
            "hiragana": ["あいうえお", "かきくけこ", "さしすせそ", "たちつてと", "なにぬねの", "はひふへほ", "まみむめも", "やいゆえよ", "らりるれろ", "わいうえを", "ん"],
            "katakana": ["アイウエオ", "カキクケコ", "サシスセソ", "タチツテト", "ナニヌネノ", "ハヒフヘホ", "マミムメモ", "ヤイユエヨ", "ラリルレロ", "ワイウエヲ", "ン"]
        },
        translate = [
            ['a','i','u','e','o'], ['ka','ki','ku','ke','ko'], ['sa','shi','su','se','so'], ['ta','chi','tsu','te','to'], ['na','ni','nu','ne','no'], ['ha','hi','fu','he','ho'], ['ma','mi','mu','me','mo'], ['ya','i','yu','e','yo'], ['ra','ri','ru','re','ro'], ['wa','i','u','e','wo'], ['n']
        ];
    if (type !== 'hiragana' && type !== 'katakana') {
        throw new Error('kana - wrong type');
    }
    var length = dict[type].length,
        row = Math.trunc(Math.random() * length),
        col = row === length - 1 ? 0 : Math.trunc(Math.random() * 5);

    return {letter: dict[type][row][col], translate: translate[row][col]};
}
function isRightAnswer(cell) {
    for (var i = 0; i < letterStorage.length; i++) {
        var curTranslate = letterStorage[i].translate;
        if (curTranslate !== cell.find('.' + curTranslate).val().toLowerCase().trim()) {
            return false;
        }
    }
    return true;
}
function isNextAccesible(screen, side) {
    return screen.type && (screen.type === 'start' || screen.type === 'test') && side === 'right';
}
function renderScore(score) {
    $('.score').text(score);
}
function renderTime(time) {
    $('.time').text(time);
}

// creators
function createTestScreen() {
    var markup = '<ul class="test-ul">';
    for (var i = 0; i < letterStorage.length; i++) {
        markup += '<li class="test-li"><label>' + letterStorage[i].letter + '</label><input class="test-input ' + letterStorage[i].translate + '"></li>'
    }
    markup += '</ul>';

    var testScreen = new rb.Screen('' +
        '<div class="testCell">' + markup + '</div>' +
        '<button class="checkButton">check</button>');
    testScreen.type = 'test';
    return testScreen;
}
function createTrickScreen(letterObj) {
    var trickScreen = new rb.Screen({
        html: '' +
        '<div class="cardCell">' +
        '<span class="letter">' + letterObj.translate + '<span>' +
        '</div>'
    });
    trickScreen.type = 'trick';
    return trickScreen;
}
function createCardScreen(letterObj, dontPrev) {
    var cardScreen = new rb.Screen({
        html: '' +
        '<div class="cardCell">' +
        '<span class="letter">' + letterObj.letter + '</span>' +
        '<button class="hintButton"> ? </button>' +
        '</div>' +
        (isPrev && !dontPrev ? '<button class="prevButton">prev</button>' : '') +
        '<button class="nextButton">next</button>',
        children: [createTrickScreen(letterObj)]
    });
    cardScreen.type = 'card';
    return cardScreen;
}
function createCardScreens() {
    var cardScreens = [];
    letterStorage = [];
    for (var i = 0; i < cardLength; i++) {
        var letterObj = kana(alphabet);
        letterStorage.push(letterObj);
        cardScreens.push(createCardScreen(letterObj, !i));
    }
    return cardScreens;
}
function createStartScreen() {
    var screen = new rb.Screen('' +
        '<div class="startCell">' +
        '<span class="appName">おぼえる</span>' +
        '<button class="startButton"> > </button>' +
        '</div>');
    screen.type = 'start';
    return screen;
}
function createFinishScreen() {
    var screen = new rb.Screen('' +
        '<div class="startCell">' +
        '<span class="appName">result: </span>' +
        '<span class="score"></span>' +
        '</div>');
    screen.type = 'finish';
    return screen;
}

// init
function initLevel(screen) {
    screen.resetChildren(createCardScreens(5));
    screen.pushChildren(createTestScreen(screen));
    points = cardLength;
}
function startTimer(panel) {
    function timeCycle() {
        time--;
        renderTime(time);

        if (time > 0) {
            setTimeout(timeCycle, 1000);
        } else {
            panel.setScreen(finishScreen).then(function () {
                renderScore(score);
            });
        }
    }
    setTimeout(timeCycle, 1000);
}
function configurePanel(panel) {
    panel.configure({
        correctTime: 500
    });
    panel.getControlManager().disableAll();
    panel.beforeMoveDispatcher.add(function (side) {
        var curScreen = panel.getScreenManager().getCurScreen();
        if (isNextAccesible(curScreen, side)) {
            initLevel(curScreen);
        }
    });
    panel.afterRenderDispatcher.add(function () {
        if (panel.getScreenManager().getCurScreen().type === 'trick') {
            setTimeout(function () {
                panel.moveBack();
            }, hintTime);
        }
    });
}
function clickHandler(e) {
    var rb1 = rb.Instances.rb1;
    if (e.target.classList.contains('startButton')) {
        rb1.move('right').then(function () {
            startTimer(rb1);
        });
    } else if (e.target.classList.contains('checkButton')) {
        if (isRightAnswer($(e.target).closest('.rb__side'))) {
            score += points;
            rb1.move('right');
        } else {
            score--;
            rb1.move('bottom');
        }
    } else if (e.target.classList.contains('prevButton')) {
        rb1.move('top');
    } else if (e.target.classList.contains('nextButton')) {
        rb1.move('bottom');
    } else if (e.target.classList.contains('hintButton')) {
        score--;
        rb1.move('right');
    }
}
function initRb() {
    configurePanel(rb.Instances.rb1);
    $('.rb').on('click', clickHandler);
}
function initGame() {
    startScreen = createStartScreen();
    finishScreen = createFinishScreen();
    renderTime(time);
    initLevel(startScreen);
    rb.start({rb1: startScreen}, initRb);
}

$(initGame);