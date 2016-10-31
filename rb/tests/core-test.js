define(['../js/main', './testsWrapper'], function(rb, TestsWrapper) {
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



    return {
        count: count,
        checkScreen: checkScreen,
        checkMarkup: checkMarkup,
        nop: nop,
        nopDone: nopDone,
        TestsWrapper: TestsWrapper
    };
});
