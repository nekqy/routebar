define(['./core-test', '../js/main'], function(core, rb) {
    'use strict';

    var screen_1, screen_2, screen_3, screen_4;

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
    function action(done) {
        var rb1 = rb.Instances.rb1;
        rb1.move('right').then(function() {
            return rb1.move('bottom');
        }).then(function(){
            return rb1.move('bottom');
        }).then(function() {
            return rb1.move('right');
        }).then(function() {
            done();
        });
    }

    var t = new core.TestsWrapper('Routing');
    t.addTest('Cycle', init, action, core.checkScreen('screen_1'));
    t.start(initEach);
});
