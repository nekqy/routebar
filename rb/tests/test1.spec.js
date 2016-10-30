define(['./core-test', '../js/main'], function(core, rb) {
    'use strict';

    var count = core.count;

    describe("markup", function() {

        beforeEach(function(done) {
            $(function() {
                window.rb = rb;
                $('body').append('<div class="main"><div id="rb1" class="rb-wrapper"></div></div>');
                var mainScreen = new rb.Screen('<div class="mainScreen">mainScreen</div>');
                rb.start(function() {
                    done();
                });
            });
        });
        it("arrows", function() {
            count('.rb__arrow-container', 4);
        });
    });
});
