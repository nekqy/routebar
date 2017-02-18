define(['./core-test', '../js/main'], function(core, rb) {
    'use strict';

    var screen_1, screen_2, screen_3, screen_4;
    var checkScreen = core.checkScreen;
    var move = core.move;

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
    function init() {
        screen_1.setChildren([screen_2, screen_3, screen_4]);
        screen_4.setChildren([screen_1]);

        var rb1 = rb.Instances.rb1;
        rb1.configure({
            wrongTime1: 5,
            wrongTime2: 5,
            correctTime: 10
        });
    }

    var t = new core.TestsWrapper('Routing1');

    t.addTestsSerial('test1', init, [
        [move('right'),  checkScreen('screen_2')],
        [move('right'),  checkScreen('screen_2')],
        [move('bottom'), checkScreen('screen_3')],
        [move('right'),  checkScreen('screen_3')],
        [move('bottom'), checkScreen('screen_4')],
        [move('right'),  checkScreen('screen_1')]
    ]);
    t.addTestsSerial('test2', init, [
        [move('right'),  checkScreen('screen_2')],
        [move('top'),    checkScreen('screen_4')],
        [move('right'),  checkScreen('screen_1')]
    ]);
    t.addTestsSerial('test3', init, [
        [move('left'),   checkScreen('screen_4')],
        [move('top'),    checkScreen('screen_3')],
        [move('right'),  checkScreen('screen_3')],
        [move('top'),    checkScreen('screen_2')],
        [move('right'),  checkScreen('screen_2')],
        [move('left'),   checkScreen('screen_1')]
    ]);
    t.addTestsSerial('test4', init, [
        [move('left'),   checkScreen('screen_4')],
        [move('bottom'), checkScreen('screen_2')],
        [move('right'),  checkScreen('screen_2')],
        [move('left'),   checkScreen('screen_1')]
    ]);
    t.addTestsSerial('test5', init, [
        [move('left'),   checkScreen('screen_4')],
        [move('left'),   checkScreen('screen_1')],
        [move('right'),  checkScreen('screen_4')],
        [move('right'),  checkScreen('screen_1')]
    ]);
    t.addTestsSerial('test6', init, [
        [move('left'),   checkScreen('screen_4')],
        [move('top'),    checkScreen('screen_3')],
        [move('top'),    checkScreen('screen_2')],
        [move('top'),    checkScreen('screen_4')],
        [move('left'),   checkScreen('screen_1')]
    ]);

    t.start(initEach);

    function init2() {
        screen_1.setChildren([screen_2, screen_3]);
        screen_1.setParents([screen_2, screen_4]);

        var rb1 = rb.Instances.rb1;
        rb1.configure({
            wrongTime1: 5,
            wrongTime2: 5,
            correctTime: 10
        });
    }

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
});
