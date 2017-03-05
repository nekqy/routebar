define(['./core-test', '../js/main'], function(core, rb) {
    'use strict';

    var initMarkupNice = '' +
        '<div class="rb__side rb__center" data-id="screen_1" style="margin-left: ; margin-top: ;"><div class="mainMarkup">mainMarkup</div></div>' +
        '<div tabindex="-1" class="rb__fake-element">' +
        '</div>';
    var initMarkupNice1_1 = '' +
        '<div class="rb__side rb__center" data-id="screen_1" style="margin-left: ; margin-top: ;"><div class="mainMarkup">mainMarkup</div></div>' +
        '<div tabindex="-1" class="rb__fake-element">' +
        '</div>';
    var initMarkupNice2_1 = '' +
        '<div class="rb__side rb__hidden" data-id="screen_2"><div class="firstMarkup">firstMarkup</div></div>' +
        '<div class="rb__side rb__center" data-id="screen_1" style="margin-left: ; margin-top: ;"><div class="mainMarkup">mainMarkup</div></div>' +
        '<div tabindex="-1" class="rb__fake-element"></div>';
    var initMarkupNice2_2 = '' +
        '<div class="rb__side rb__hidden" data-id="screen_3"><div class="secondMarkup">secondMarkup</div></div>' +
        '<div class="rb__side rb__hidden" data-id="screen_4"><div class="thirdMarkup">thirdMarkup</div></div>' +
        '<div class="rb__side rb__center" data-id="screen_2" style="margin-left: ; margin-top: ;"><div class="firstMarkup">firstMarkup</div></div>' +
        '<div class="rb__side rb__hidden" data-id="screen_1" style="margin-left: ; margin-top: ;"><div class="mainMarkup">mainMarkup</div></div>' +
        '<div tabindex="-1" class="rb__fake-element"></div>';
    //todo какого черта появилось style="margin-left: ; margin-top: ; а в initMarkupNice2_1 нету
    var initMarkupNice2_3 = '' +
        '<div class="rb__side rb__hidden" data-id="screen_2" style="margin-left: ; margin-top: ;"><div class="firstMarkup">firstMarkup</div></div>' +
        '<div class="rb__side rb__center" data-id="screen_1" style="margin-left: ; margin-top: ;"><div class="mainMarkup">mainMarkup</div></div>' +
        '<div tabindex="-1" class="rb__fake-element"></div>';
    var initMarkupNice3_1 = '' +
        '<div class="rb__side rb__hidden" data-id="screen_3"><div class="secondMarkup">secondMarkup</div></div>' +
        '<div class="rb__side rb__center" data-id="screen_2" style="margin-left: ; margin-top: ;"><div class="firstMarkup">firstMarkup</div></div>' +
        '<div class="rb__side rb__hidden" data-id="screen_4"><div class="thirdMarkup">thirdMarkup</div></div>' +
        '<div class="rb__side rb__hidden" data-id="screen_1" style="margin-left: ; margin-top: ;"><div class="mainMarkup">mainMarkup</div></div>' +
        '<div tabindex="-1" class="rb__fake-element"></div>';
    var initMarkupNice3_2 = '' +
        '<div class="rb__side rb__center" data-id="screen_4" style="margin-left: ; margin-top: ;"><div class="thirdMarkup">thirdMarkup</div></div>' +
        '<div class="rb__side rb__hidden" data-id="screen_1" style="margin-left: ; margin-top: ;"><div class="mainMarkup">mainMarkup</div></div>' +
        '<div tabindex="-1" class="rb__fake-element"></div>';
    var initMarkupNice3_3 = '' +
        '<div class="rb__side rb__hidden" data-id="screen_2"><div class="firstMarkup">firstMarkup</div></div>' +
        '<div class="rb__side rb__hidden" data-id="screen_4"><div class="thirdMarkup">thirdMarkup</div></div>' +
        '<div class="rb__side rb__center" data-id="screen_1" style="margin-left: ; margin-top: ;"><div class="mainMarkup">mainMarkup</div></div>' +
        '<div tabindex="-1" class="rb__fake-element"></div>';


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
        screen_1.pushChildren([screen_2, screen_3, screen_4]);
        init();
    }
    function init3() {
        screen_4.pushChildren([screen_1]);
        init2();
    }

    var t = new core.TestsWrapper('Markup');

    t.addTest('Initial markup', undefined, core.nopDone, core.checkMarkup(initMarkupNice));
    t.addTests(
        _.map(sides, function(side) {
            var check;
            if (side === 'left') check = core.checkMarkup(initMarkupNice1_1);
            if (side === 'top') check = core.checkMarkup(initMarkupNice1_1);
            if (side === 'right') check = core.checkMarkup(initMarkupNice1_1);
            if (side === 'bottom') check = core.checkMarkup(initMarkupNice1_1);
            return ['init1 - ' + side, init, move(side), check];
        })
    );
    t.addTests(
        _.map(sides, function(side) {
            var check;
            if (side === 'left') check = core.checkMarkup(initMarkupNice2_3);
            if (side === 'top') check = core.checkMarkup(initMarkupNice2_1);
            if (side === 'right') check = core.checkMarkup(initMarkupNice2_2);
            if (side === 'bottom') check = core.checkMarkup(initMarkupNice2_1);

            return ['init2 - ' + side, init2, move(side), check];
        })
    );
    t.addTests(
        _.map(sides, function(side) {
            var check;
            if (side === 'left') check = core.checkMarkup(initMarkupNice3_2);
            if (side === 'top') check = core.checkMarkup(initMarkupNice3_3);
            if (side === 'right') check = core.checkMarkup(initMarkupNice3_1);
            if (side === 'bottom') check = core.checkMarkup(initMarkupNice3_3);

            return ['init3 - ' + side, init3, move(side), check];
        })
    );

    t.start(initEach);
});
