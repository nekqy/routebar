define(['./core-test', '../js/main', '../js/errors'], function(core, rb, Errors) {
    'use strict';

    var screens;
    var checkScreen = core.checkScreen;
    var _goToScreen = core.goToScreen;
    var configure = core.configure;

    function initEach(opts) {
        window.rb = rb;

        function create(index) {
            var name = 'markup' + index;
            opts.html = '<div class="' + name + '">' + name + '</div>';
            return new rb.Screen(opts);
        }

        screens = [];
        for (var i = 0; i < 10; i++) {
            screens.push(create(i));
        }
        rb.Screen.setMainScreen(screens[0]);

        $('body').append('<div id="rb1" class="rb-wrapper"></div>');
    }
    function init() {
        var rb1 = rb.Instances.rb1;
        rb1.configure({
            wrongTime1: 5,
            wrongTime2: 5,
            correctTime: 10
        });
    }
    function init1(loop) {
        for (var i = 0; i < 8; i++) {
            screens[i].pushChildren([screens[i+1]]);
        }

        screens[3].pushChildren([screens[5]]);
        screens[7].pushChildren([screens[1]]);
        if (loop) {
            screens[9].pushChildren([screens[0]]);
        }

        init();
    }

    function goToScreen(i, correctErr) {
        return function (done) {
            return _goToScreen(screens[i], correctErr)(done);
        };
    }

    var t = new core.TestsWrapper('GoToScreen1');
    t.addTestsSerial('GoToScreen1', init1.bind(undefined, false), [
        [goToScreen(1), checkScreen('screen_2')],
        [goToScreen(5), checkScreen('screen_6')],
        [goToScreen(9, Errors.PathNotFoundError), checkScreen('screen_6')],
        [goToScreen(0), checkScreen('screen_1')]
    ]);
    t.start(initEach.bind(undefined, {
        isDirectedGraph: false
    }));

    var t2 = new core.TestsWrapper('GoToScreen2');
    t2.addTestsSerial('GoToScreen2', init1.bind(undefined, false), [
        [goToScreen(1), checkScreen('screen_2')],
        [goToScreen(5), checkScreen('screen_6')],
        [goToScreen(9, Errors.PathNotFoundError), checkScreen('screen_6')],
        [goToScreen(0), checkScreen('screen_1')]
        //[goToScreen(0, Errors.PathNotFoundError), checkScreen('screen_6')] потому что ищем в парентах
    ]);
    t2.start(initEach.bind(undefined, {
        isDirectedGraph: true
    }));

    var t3 = new core.TestsWrapper('GoToScreen3');
    t3.addTestsSerial('GoToScreen3', init1.bind(undefined, true), [
        [goToScreen(1), checkScreen('screen_2')],
        [goToScreen(5), checkScreen('screen_6')],
        [goToScreen(9), checkScreen('screen_10')],
        [goToScreen(0), checkScreen('screen_1')]
    ]);
    t3.start(initEach.bind(undefined, {
        isDirectedGraph: false
    }));

    var t4 = new core.TestsWrapper('GoToScreen4');
    t4.addTestsSerial('GoToScreen4', init1.bind(undefined, true), [
        [goToScreen(1), checkScreen('screen_2')],
        [goToScreen(5), checkScreen('screen_6')],
        [goToScreen(9), checkScreen('screen_10')],
        [goToScreen(0), checkScreen('screen_1')]
        //[goToScreen(9, Errors.PathNotFoundError), checkScreen('screen_6')], потому что ищем в парентах
        //[goToScreen(0, Errors.PathNotFoundError), checkScreen('screen_6')] потому что ищем в парентах
    ]);
    t4.start(initEach.bind(undefined, {
        isDirectedGraph: true
    }));
});
