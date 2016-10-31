define(['../js/main', 'lodash'], function(rb, _) {

    function TestsWrapper(name) {
        this.name = name;
        this.tests = {};
    }

    TestsWrapper.prototype.addTest = function (name, init, action, checker) {
        if (Array.isArray(name)) {
            checker = name[3];
            action = name[2];
            init = name[1];
            name = name[0];
        }
        this.tests[name] = [init, action, checker];
    };
    TestsWrapper.prototype.addTests = function (arr) {
        var self = this;
        _.forEach(arr, function (val) {
            self.addTest(val);
        });
    };
    TestsWrapper.prototype.start = function (initEach) {
        function clear(done) {
            rb.Batch.removeAll();
            $('.rb-wrapper').remove();
            rb.Screen._length = 1;
            done();
        }

        var self = this;

        _.forEach(this.tests, function (testCheck, key) {
            var init = testCheck[0],
                test = testCheck[1],
                check = testCheck[2];

            describe(self.name, function () {
                beforeEach(function (done) {
                    $(function () {
                        initEach && initEach();
                        rb.start(function () {
                            init && init();
                            test(done);
                        });
                    });
                });
                it(key, function () {
                    expect(check()).toBe(true);
                });
                afterEach(function (done) {
                    clear(done);
                });
            });
        });
    };

    return TestsWrapper;
});