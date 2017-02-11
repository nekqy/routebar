define(['../js/main', './testsWrapper'], function(rb, TestsWrapper) {
    'use strict';

    function count(elem, length) {
        var res = $(elem).length === length;
        expect(res).toBe(true);
    }
    function checkScreen(screenName) {
        return function () {
            var curScreen = rb.Instances.rb1._screenManager.getCurScreen();
            return screenName === curScreen.toString();
        };
    }
    function nop() {
    }
    function nopDone(done) {
        done();
    }
    function checkMarkup(niceMarkup) {
        return function () {
            var initMarkup = $('.rb').html();
            initMarkup = initMarkup.replace(/\d+px/g, '');
            niceMarkup = niceMarkup.replace(/\d+px/g, '');
            return initMarkup === niceMarkup;
        };
    }
    function move(side) {
        return function (done) {
            var rb1 = rb.Instances.rb1;
            rb1.move(side).then(done);
        }
    }

    function checkError(correctError) {
        return function (error) {
            if (!error) return true;
            return error instanceof correctError;
        };
    }

    return {
        count: count,
        checkScreen: checkScreen,
        checkMarkup: checkMarkup,
        checkError: checkError,
        nop: nop,
        nopDone: nopDone,
        move: move,
        TestsWrapper: TestsWrapper
    };
});
