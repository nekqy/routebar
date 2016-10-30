define(['./core-test', '../js/main'], function(core, rb) {
    'use strict';

    var count = core.count;
    var initMarkupNice = '<div class="rb__side rb__center" data-id="screen_1" style="margin-left: ; margin-top: ;"><div class="mainMarkup">mainMarkup</div></div><div tabindex="-1" class="rb__fake-element"></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_left"><div class="rb__arrow rb__arrow_left"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_top"><div class="rb__arrow rb__arrow_top"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_right"><div class="rb__arrow rb__arrow_right"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_bottom"><div class="rb__arrow rb__arrow_bottom"></div></div>';
    var initMarkupNice2 = '<div class="rb__side rb__hidden" data-id="screen_3"><div class="secondMarkup">secondMarkup</div></div><div class="rb__side rb__hidden" data-id="screen_4"><div class="thirdMarkup">thirdMarkup</div></div><div class="rb__side rb__center" data-id="screen_2" style="margin-left: ; margin-top: ;"><div class="firstMarkup">firstMarkup</div></div><div class="rb__side rb__hidden" data-id="screen_1" style="margin-left: ; margin-top: ;"><div class="mainMarkup">mainMarkup</div></div><div tabindex="-1" class="rb__fake-element"></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_left"><div class="rb__arrow rb__arrow_left"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_top"><div class="rb__arrow rb__arrow_top"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_right"><div class="rb__arrow rb__arrow_right"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_bottom"><div class="rb__arrow rb__arrow_bottom"></div></div>';
    var initMarkupNice3 = '<div class="rb__side rb__hidden" data-id="screen_2"><div class="firstMarkup">firstMarkup</div></div><div class="rb__side rb__hidden" data-id="screen_3"><div class="secondMarkup">secondMarkup</div></div><div class="rb__side rb__center" data-id="screen_4" style="margin-left: ; margin-top: ;"><div class="thirdMarkup">thirdMarkup</div></div><div class="rb__side rb__hidden" data-id="screen_1" style="margin-left: ; margin-top: ;"><div class="mainMarkup">mainMarkup</div></div><div tabindex="-1" class="rb__fake-element"></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_left"><div class="rb__arrow rb__arrow_left"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_top"><div class="rb__arrow rb__arrow_top"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_right"><div class="rb__arrow rb__arrow_right"></div></div><div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_bottom"><div class="rb__arrow rb__arrow_bottom"></div></div>';
    var singleMarkup = '<div class="main"><div id="rb1" class="rb-wrapper"></div></div>';

    var mainMarkup = '<div class="mainMarkup">mainMarkup</div>';
    var firstMarkup = '<div class="firstMarkup">firstMarkup</div>';
    var secondMarkup = '<div class="secondMarkup">secondMarkup</div>';
    var thirdMarkup = '<div class="thirdMarkup">thirdMarkup</div>';

    var mainScreen, firstScreen, secondScreen, thirdScreen;

    function init() {
        window.rb = rb;

        mainScreen = new rb.Screen(mainMarkup);
        firstScreen = new rb.Screen(firstMarkup);
        secondScreen = new rb.Screen(secondMarkup);
        thirdScreen = new rb.Screen(thirdMarkup);
        rb.Screen.setMainScreen(mainScreen);

        $('body').append(singleMarkup);
    }

    function clear(done) {
        rb.Batch.removeAll();
        $('.main').remove();
        rb.Screen._length = 1;
        done();
    }

    function nop(done) {
        done();
    }
    function move(side, done) {
        var rb1 = rb.Instances.rb1;
        rb1.configure({
            wrongTime1: 5,
            wrongTime2: 5,
            correctTime: 10
        });
        rb1.move(side).then(function() {
            done();
        });
    }
    function check() {
        var initMarkup = $('.rb').html();
        initMarkup = initMarkup.replace(/\d+px/g, '');
        return initMarkup === initMarkupNice;
    }

    function move2(side, done) {
        mainScreen.setChildren([firstScreen, secondScreen, thirdScreen]);
        move(side, done);
    }
    function check2() {
        var initMarkup = $('.rb').html();
        initMarkup = initMarkup.replace(/\d+px/g, '');
        return initMarkup === initMarkupNice2;
    }

    function move3(side, done) {
        mainScreen.setChildren([firstScreen, secondScreen, thirdScreen]);
        thirdScreen.setChildren([mainScreen]);
        move(side, done);
    }
    function check3() {
        var initMarkup = $('.rb').html();
        initMarkup = initMarkup.replace(/\d+px/g, '');
        console.log(initMarkup);
        return initMarkup === initMarkupNice3;
    }

    var tests = [
        [nop, check],

        [move.bind(undefined, 'left'), check],
        [move.bind(undefined, 'top'), check],
        [move.bind(undefined, 'right'), check],
        [move.bind(undefined, 'bottom'), check],

        [move2.bind(undefined, 'left'), check],
        [move2.bind(undefined, 'top'), check],
        [move2.bind(undefined, 'right'), check2],
        [move2.bind(undefined, 'bottom'), check],

        [move3.bind(undefined, 'left'), check3],
        [move3.bind(undefined, 'top'), check],
        [move3.bind(undefined, 'right'), check2],
        [move3.bind(undefined, 'bottom'), check]
    ];

    tests.forEach(function(testCheck, index) {
        var test = testCheck[0],
            check = testCheck[1];

        describe("test - " + index, function() {
            beforeEach(function(done) {
                $(function() {
                    init();
                    rb.start(function() {
                        test(done);
                    });
                });
            });
            it("test - " + index, function() {
                expect(check()).toBe(true);
            });
            afterEach(function(done) {
                clear(done);
            });
        });
    });

});
