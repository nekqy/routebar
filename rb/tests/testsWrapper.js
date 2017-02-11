define(['../js/main', 'lodash'], function(rb, _) {
    'use strict';

    function TestsWrapper(name) {
        this.name = name;
        this.tests = {};
    }

    TestsWrapper.prototype.addTest = function (name, init, action, checker, doClear) {
        if (Array.isArray(name)) {
            doClear = name[4];
            checker = name[3];
            action = name[2];
            init = name[1];
            name = name[0];
        }
        this.tests[name] = [init, action, checker, doClear !== false];
    };
    TestsWrapper.prototype.addTests = function (arr) {
        var self = this;
        _.forEach(arr, function (val) {
            self.addTest(val);
        });
    };
    TestsWrapper.prototype.addTestsSerial = function(name, init, tests) {
        tests = _.map(tests, function(test, index) {
            var initFn = index === 0 ? init : undefined;
            var isClear = index === (tests.length - 1);
            return [name + '_' + index, initFn, test[0], test[1], isClear];
        });
        this.addTests(tests);
    };
    TestsWrapper.prototype.start = function (initEach) {
        function clear() {
            rb.Batch.removeAll();
            $('.rb-wrapper').remove();
            rb.Screen._length = 1;
        }

        var self = this, prevClear = true;

        _.forEach(this.tests, function (testCheck, key) {
            var init = testCheck[0],
                action = testCheck[1],
                check = testCheck[2],
                doClear = testCheck[3];

            describe(self.name, function () {
                beforeEach(function (done) {
                    $(function () {
                        prevClear && initEach && initEach();
                        rb.start(function () {
                            prevClear && init && init();
                            action(done);
                        });
                    });
                });
                it(key, function () {
                    expect(check()).toBe(true);
                });
                afterEach(function (done) {
                    doClear && clear();
                    prevClear = doClear;
                    done();
                });
            });
        });
    };

    return TestsWrapper;
});