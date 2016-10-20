define(['screenModel', 'moving'], function(ScreenModel, Moving) {
    "use strict";

    var $rb, instances = {};

    function initLayout(wrapperName, prepare) {

        var $rbWrapper = $('.' + wrapperName);
        $rbWrapper.html('<div class="rb"><div tabindex="-1" class="rb__fake-element"></div></div>');
        $rb = $rbWrapper.find('.rb');

        for(var i = 0; i < $rb.length; i++) {
            var elem = $rb.eq(i),
                elemWrapper = elem.parent(),
                id = elemWrapper.data('id') || elemWrapper.attr('id') || 'instance_' + i;

            var inst = new Moving(elem, 1000, 10);
            instances[id] = inst;

            Object.defineProperty(rb, id, {
                value: inst
            });

            var mainScreen = ScreenModel.getMainScreen();
            if (mainScreen) {
                inst.move('center', mainScreen, false);
            }
        }

        prepare && prepare(instances);
    }

    return {
        initLayout: initLayout,
        getInstance: function(id) {
            return instances[id];
        }
    };
});