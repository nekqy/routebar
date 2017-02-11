define(['./core-test', '../js/main'], function(core, rb) {
    'use strict';

    var initMarkupNice = '<div class="rb__side rb__center" data-id="screen_1" style="margin-left: ; margin-top: ;"><div class="mainMarkup">mainMarkup</div></div><div tabindex="-1" class="rb__fake-element"></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_left"><div class="rb__arrow rb__arrow_left"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_top"><div class="rb__arrow rb__arrow_top"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_right"><div class="rb__arrow rb__arrow_right"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_bottom"><div class="rb__arrow rb__arrow_bottom"></div></div>';
    var initMarkupNice2 = '<div class="rb__side rb__hidden" data-id="screen_3"><div class="secondMarkup">secondMarkup</div></div><div class="rb__side rb__hidden" data-id="screen_4"><div class="thirdMarkup">thirdMarkup</div></div><div class="rb__side rb__center" data-id="screen_2" style="margin-left: ; margin-top: ;"><div class="firstMarkup">firstMarkup</div></div><div class="rb__side rb__hidden" data-id="screen_1" style="margin-left: ; margin-top: ;"><div class="mainMarkup">mainMarkup</div></div><div tabindex="-1" class="rb__fake-element"></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_left"><div class="rb__arrow rb__arrow_left"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_top"><div class="rb__arrow rb__arrow_top"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_right"><div class="rb__arrow rb__arrow_right"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_bottom"><div class="rb__arrow rb__arrow_bottom"></div></div>';
    var initMarkupNice3 = '<div class="rb__side rb__hidden" data-id="screen_2"><div class="firstMarkup">firstMarkup</div></div><div class="rb__side rb__hidden" data-id="screen_3"><div class="secondMarkup">secondMarkup</div></div><div class="rb__side rb__center" data-id="screen_4" style="margin-left: ; margin-top: ;"><div class="thirdMarkup">thirdMarkup</div></div><div class="rb__side rb__hidden" data-id="screen_1" style="margin-left: ; margin-top: ;"><div class="mainMarkup">mainMarkup</div></div><div tabindex="-1" class="rb__fake-element"></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_left"><div class="rb__arrow rb__arrow_left"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_top"><div class="rb__arrow rb__arrow_top"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_right"><div class="rb__arrow rb__arrow_right"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_bottom"><div class="rb__arrow rb__arrow_bottom"></div></div>';

    var sides = ['left', 'top', 'right', 'bottom'];
    var screen_1, screen_2, screen_3, screen_4;

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
        var rb1 = rb.Instances.rb1;
        rb1.configure({
            wrongTime1: 5,
            wrongTime2: 5,
            correctTime: 10
        });
    }
    function init2() {
        screen_1.setChildren([screen_2, screen_3, screen_4]);
        init();
    }
    function init3() {
        screen_4.setChildren([screen_1]);
        init2();
    }

    var t = new core.TestsWrapper('Markup');

    t.addTest('Initial markup', undefined, core.nopDone, core.checkMarkup(initMarkupNice));
    t.addTests(
        _.map(sides, function(side) {
            return ['init1 - ' + side, init, move(side), core.checkMarkup(initMarkupNice)];
        })
    );
    t.addTests(
        _.map(sides, function(side) {
            var check;
            if (side === 'right') check = core.checkMarkup(initMarkupNice2);
            else check = core.checkMarkup(initMarkupNice);

            return ['init2 - ' + side, init2, move(side), check];
        })
    );
    t.addTests(
        _.map(sides, function(side) {
            var check;
            if (side === 'left') check = core.checkMarkup(initMarkupNice3);
            else if (side === 'right') check = core.checkMarkup(initMarkupNice2);
            else check = core.checkMarkup(initMarkupNice);

            return ['init3 - ' + side, init3, move(side), check];
        })
    );

    t.start(initEach);
});
