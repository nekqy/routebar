define(['./core-test', '../js/main'], function(core, rb) {
    'use strict';

    var screen_1, screen_2, screen_3, screen_4;
    var checkScreen = core.checkScreen;
    var move = core.move;
    var moveBack = core.moveBack;
    var configure = core.configure;

    function initEach() {
        window.rb = rb;

        var mainMarkup = '<div class="mainMarkup">mainMarkup</div>';
        var firstMarkup = '<div class="firstMarkup">firstMarkup</div>';
        var secondMarkup = '<div class="secondMarkup">secondMarkup</div>';
        var thirdMarkup = '<div class="thirdMarkup">thirdMarkup</div>';
        screen_1 = new rb.Screen(mainMarkup);
        screen_2 = new rb.Screen(firstMarkup);
        screen_3 = new rb.Screen(secondMarkup);
        screen_4 = new rb.Screen(thirdMarkup);
        rb.Screen.setMainScreen(screen_1);

        $('body').append('<div id="rb1" class="rb-wrapper"></div>');
    }
    function init(opts) {
        screen_1.pushChildren([screen_2, screen_3, screen_4]);
        screen_4.pushChildren([screen_1]);

        var options = {
            wrongTime1: 5,
            wrongTime2: 5,
            correctTime: 10
        };
        if (typeof opts === 'object') {
            for (var prop in opts) {
                if (opts.hasOwnProperty(prop)) {
                    options[prop] = opts[prop];
                }
            }
        }

        var rb1 = rb.Instances.rb1;
        rb1.configure(options);
    }
    function init2() {
        screen_1.pushChildren([screen_2, screen_3]);
        screen_1.pushParents([screen_2, screen_4]);

        var rb1 = rb.Instances.rb1;
        rb1.configure({
            wrongTime1: 5,
            wrongTime2: 5,
            correctTime: 10
        });
    }
    function initEach3() {
        window.rb = rb;

        var mainMarkup = '<div class="mainMarkup">mainMarkup</div>';
        var firstMarkup = '<div class="firstMarkup">firstMarkup</div>';
        var secondMarkup = '<div class="secondMarkup">secondMarkup</div>';
        var thirdMarkup = '<div class="thirdMarkup">thirdMarkup</div>';
        screen_1 = new rb.Screen({
            html: mainMarkup,
            isDirectedGraph: false
        });
        screen_2 = new rb.Screen({
            html: firstMarkup,
            isDirectedGraph: false
        });
        screen_3 = new rb.Screen({
            html: secondMarkup,
            isDirectedGraph: false
        });
        screen_4 = new rb.Screen({
            html: thirdMarkup,
            isDirectedGraph: false
        });
        rb.Screen.setMainScreen(screen_1);

        $('body').append('<div id="rb1" class="rb-wrapper"></div>');
    }
    function init3(opts) {
        screen_1.pushChildren([screen_2, screen_3, screen_4]);

        var options = {
            wrongTime1: 5,
            wrongTime2: 5,
            correctTime: 10
        };
        if (typeof opts === 'object') {
            for (var prop in opts) {
                if (opts.hasOwnProperty(prop)) {
                    options[prop] = opts[prop];
                }
            }
        }

        var rb1 = rb.Instances.rb1;
        rb1.configure(options);
    }

    var t = new core.TestsWrapper('Routing1');
    t.addTestsSerial('test1', init, [
        [move('right'),  checkScreen('screen_2')],
        [move('right'),  checkScreen('screen_2')],
        [move('bottom'), checkScreen('screen_3')],
        [move('right'),  checkScreen('screen_3')],
        [move('bottom'), checkScreen('screen_4')],
        [move('right'),  checkScreen('screen_1')],
        [moveBack(),     checkScreen('screen_4')],
        [moveBack(),     checkScreen('screen_3')], // todo сейчас откат идет на предыдущий скрин, а не предыдущего шага
        [moveBack(),     checkScreen('screen_2')], // todo прочекать то же но без опции cyclicStep
        [moveBack(),     checkScreen('screen_1')],
        [moveBack(),     checkScreen('screen_1')],
        [moveBack(),     checkScreen('screen_1')],
        [configure({maxHistoryLength: 2}), checkScreen('screen_1')],
        [move('right'),  checkScreen('screen_2')],
        [move('bottom'), checkScreen('screen_3')],
        [move('bottom'), checkScreen('screen_4')],
        [moveBack(),     checkScreen('screen_3')],
        [moveBack(),     checkScreen('screen_2')],
        [moveBack(),     checkScreen('screen_2')],
        [configure({maxHistoryLength: 0}), checkScreen('screen_2')],
        [move('bottom'), checkScreen('screen_3')],
        [move('bottom'), checkScreen('screen_4')],
        [moveBack(),     checkScreen('screen_4')],
        [moveBack(),     checkScreen('screen_4')]
    ]);
    t.addTestsSerial('test2', init, [
        [move('right'),  checkScreen('screen_2')],
        [move('top'),    checkScreen('screen_4')],
        [move('right'),  checkScreen('screen_1')]
    ]);
    t.addTestsSerial('test3', init, [
        [move('left'),   checkScreen('screen_4')],
        [move('top'),    checkScreen('screen_4')],// todo у 1 потомки 2,3,4. но мы идем в предка 4, и предок у  1 только один 4, гулять вверх вниз не можем
        [move('right'),  checkScreen('screen_1')],
        [move('top'),    checkScreen('screen_1')],
        [move('right'),  checkScreen('screen_2')],
        [move('left'),   checkScreen('screen_1')]
    ]);
    t.addTestsSerial('test4', init, [
        [move('left'),   checkScreen('screen_4')],
        [move('bottom'), checkScreen('screen_4')],
        [move('right'),  checkScreen('screen_1')],
        [move('left'),   checkScreen('screen_4')]
    ]);
    t.addTestsSerial('test5', init, [
        [move('left'),   checkScreen('screen_4')],
        [move('left'),   checkScreen('screen_1')],
        [move('right'),  checkScreen('screen_4')],
        [move('right'),  checkScreen('screen_1')]
    ]);
    t.addTestsSerial('test6', init, [
        [move('left'),   checkScreen('screen_4')],
        [move('top'),    checkScreen('screen_4')],
        [move('top'),    checkScreen('screen_4')],
        [move('top'),    checkScreen('screen_4')],
        [move('left'),   checkScreen('screen_1')]
    ]);
    t.start(initEach);

    var t2 = new core.TestsWrapper('Routing2');
    t2.addTestsSerial('test1', init2, [
        [move('right'),  checkScreen('screen_2')],
        [move('bottom'),  checkScreen('screen_3')]
    ]);
    t2.addTestsSerial('test2', init2, [
        [move('left'),  checkScreen('screen_2')],
        [move('bottom'),  checkScreen('screen_4')]
    ]);
    t2.addTestsSerial('test3', init2, [
        [move('right'),  checkScreen('screen_2')],
        [move('top'),  checkScreen('screen_3')]
    ]);
    t2.addTestsSerial('test4', init2, [
        [move('left'),  checkScreen('screen_2')],
        [move('top'),  checkScreen('screen_4')]
    ]);
    t2.start(initEach);

    var t3 = new core.TestsWrapper('Routing3');
    t3.addTestsSerial('test1', init3, [
        [move('right'),  checkScreen('screen_2')],
        [move('right'),  checkScreen('screen_1')],
        [move('bottom'), checkScreen('screen_1')],
        [move('right'),  checkScreen('screen_2')],
        [move('bottom'), checkScreen('screen_3')],
        [move('right'),  checkScreen('screen_1')],
        [moveBack(),     checkScreen('screen_3')],
        [moveBack(),     checkScreen('screen_2')], // todo сейчас откат идет на предыдущий скрин, а не предыдущего шага
        [moveBack(),     checkScreen('screen_1')], // todo прочекать то же но без опции cyclicStep
        [moveBack(),     checkScreen('screen_1')],
        [moveBack(),     checkScreen('screen_2')],
        [moveBack(),     checkScreen('screen_1')],
        [configure({maxHistoryLength: 2}), checkScreen('screen_1')],
        [move('right'),  checkScreen('screen_2')],
        [move('bottom'), checkScreen('screen_3')],
        [move('bottom'), checkScreen('screen_4')],
        [moveBack(),     checkScreen('screen_3')],
        [moveBack(),     checkScreen('screen_2')],
        [moveBack(),     checkScreen('screen_2')],
        [configure({maxHistoryLength: 0}), checkScreen('screen_2')],
        [move('bottom'), checkScreen('screen_3')],
        [move('bottom'), checkScreen('screen_4')],
        [moveBack(),     checkScreen('screen_4')],
        [moveBack(),     checkScreen('screen_4')]
    ]);
    t3.addTestsSerial('test2', init3, [
        [move('right'),  checkScreen('screen_2')],
        [move('top'),    checkScreen('screen_4')],
        [move('right'),  checkScreen('screen_1')]
    ]);
    t3.addTestsSerial('test3', init3, [
        [move('left'),   checkScreen('screen_2')], // потому что двусторонняя связь, и когде идем влево паренты 2,3,4 и по умолчанию тот что с индексом 0
        [move('top'),    checkScreen('screen_4')], // todo почему циклично и как сделать нециклично
        [move('right'),  checkScreen('screen_1')],
        [move('top'),    checkScreen('screen_1')],
        [move('right'),  checkScreen('screen_2')],
        [move('left'),   checkScreen('screen_1')]
    ]);
    t3.addTestsSerial('test4', init3, [
        [move('left'),   checkScreen('screen_2')],
        [move('bottom'), checkScreen('screen_3')],
        [move('right'),  checkScreen('screen_1')],
        [move('left'),   checkScreen('screen_3')]
    ]);
    t3.addTestsSerial('test5', init3, [
        [move('left'),   checkScreen('screen_2')],
        [move('left'),   checkScreen('screen_1')],
        [move('right'),  checkScreen('screen_2')],
        [move('right'),  checkScreen('screen_1')]
    ]);
    t3.addTestsSerial('test6', init3, [
        [move('left'),   checkScreen('screen_2')],
        [move('top'),    checkScreen('screen_4')],
        [move('top'),    checkScreen('screen_3')],
        [move('top'),    checkScreen('screen_2')],
        [move('left'),   checkScreen('screen_1')]
    ]);
    t3.addTestsSerial('test6', init3, [
        [move('right'),   checkScreen('screen_2')],
        [move('bottom'),  checkScreen('screen_3')],
        [move('left'),    checkScreen('screen_1')],
        [function (done) { screen_1.removeChild(screen_4); done(); }, checkScreen('screen_1')],
        [move('right'), checkScreen('screen_3')],
        [move('left'),    checkScreen('screen_1')],
        [function (done) { screen_1.removeChild(screen_3); done(); }, checkScreen('screen_1')],
        [move('right'), checkScreen('screen_2')],
        [move('left'),    checkScreen('screen_1')],
        [function (done) { screen_1.removeChild(screen_2); done(); }, checkScreen('screen_1')],
        [move('right'), checkScreen('screen_1')]
    ]);
    t3.start(initEach3);

    var t4 = new core.TestsWrapper('Routing4');
    t4.addTestsSerial('test1', init3.bind(undefined, {savePrevious: false}), [
        [move('right'),  checkScreen('screen_2')],
        [move('right'),  checkScreen('screen_1')],
        [move('bottom'), checkScreen('screen_1')],
        [move('right'),  checkScreen('screen_2')],
        [move('bottom'), checkScreen('screen_3')],
        [move('right'),  checkScreen('screen_1')],
        [moveBack(),     checkScreen('screen_3')],
        [moveBack(),     checkScreen('screen_2')],
        [moveBack(),     checkScreen('screen_1')],
        [moveBack(),     checkScreen('screen_1')],
        [moveBack(),     checkScreen('screen_2')],
        [moveBack(),     checkScreen('screen_1')],
        [configure({maxHistoryLength: 2}), checkScreen('screen_1')],
        [move('right'),  checkScreen('screen_2')],
        [move('bottom'), checkScreen('screen_3')],
        [move('bottom'), checkScreen('screen_4')],
        [moveBack(),     checkScreen('screen_3')],
        [moveBack(),     checkScreen('screen_2')],
        [moveBack(),     checkScreen('screen_2')],
        [configure({maxHistoryLength: 0}), checkScreen('screen_2')],
        [move('bottom'), checkScreen('screen_3')],
        [move('bottom'), checkScreen('screen_4')],
        [moveBack(),     checkScreen('screen_4')],
        [moveBack(),     checkScreen('screen_4')]
    ]);
    t4.addTestsSerial('test2', init3.bind(undefined, {savePrevious: false}), [
        [move('right'),  checkScreen('screen_2')],
        [move('top'),    checkScreen('screen_4')],
        [move('right'),  checkScreen('screen_1')]
    ]);
    t4.addTestsSerial('test3', init3.bind(undefined, {savePrevious: false}), [
        [move('left'),   checkScreen('screen_2')],
        [move('top'),    checkScreen('screen_4')],
        [move('right'),  checkScreen('screen_1')],
        [move('top'),    checkScreen('screen_1')],
        [move('right'),  checkScreen('screen_2')],
        [move('left'),   checkScreen('screen_1')]
    ]);
    t4.addTestsSerial('test4', init3.bind(undefined, {savePrevious: false}), [
        [move('left'),   checkScreen('screen_2')],
        [move('bottom'), checkScreen('screen_3')],
        [move('right'),  checkScreen('screen_1')],
        [move('left'),   checkScreen('screen_2')]
    ]);
    t4.addTestsSerial('test5', init3.bind(undefined, {savePrevious: false}), [
        [move('left'),   checkScreen('screen_2')],
        [move('left'),   checkScreen('screen_1')],
        [move('right'),  checkScreen('screen_2')],
        [move('right'),  checkScreen('screen_1')]
    ]);
    t4.addTestsSerial('test6', init3.bind(undefined, {savePrevious: false}), [
        [move('left'),   checkScreen('screen_2')],
        [move('top'),    checkScreen('screen_4')],
        [move('top'),    checkScreen('screen_3')],
        [move('top'),    checkScreen('screen_2')],
        [move('left'),   checkScreen('screen_1')]
    ]);
    t4.start(initEach3);
});
