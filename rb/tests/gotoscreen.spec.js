define(['./core-test', '../js/main', '../js/errors'], function(core, rb, Errors) {
    'use strict';

    var screens = [];
    var checkScreen = core.checkScreen;
    var checkError = core.checkError;

    function initEach() {
        window.rb = rb;

        function create(index) {
            var name = 'markup' + index;
            var markup = '<div class="' + name + '">' + name + '</div>';
            return new rb.Screen(markup);
        }

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
    function init1() {
        for (var i = 0; i < 8; i++) {
            screens[i].setChildren([screens[i+1]]);
        }

        screens[3].setChildren([screens[4],screens[5]]);
        screens[7].setChildren([screens[1], screens[8]]);

        init();
    }

    var t = new core.TestsWrapper('GoToScreen');

    function goToScreen(i, correctErr) {
        return function (done) {
            var rb1 = rb.Instances.rb1;
            rb1.goToScreen(screens[i]).then(done, function(err) {
                if (correctErr) {
                    console.error(err);
                    expect(err instanceof correctErr).toBe(true);
                }
                done();
            });
        }
    }

    t.addTestsSerial('GoToScreen1', init1, [
        [goToScreen(1), checkScreen('screen_2')],
        [goToScreen(5), checkScreen('screen_6')],
        [goToScreen(9, Errors.PathNotFoundError), checkScreen('screen_6')],
        [goToScreen(0), checkScreen('screen_1')]
    ]);

    t.start(initEach);
});
