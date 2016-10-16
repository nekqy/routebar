define(['screenModel', 'moving'], function(ScreenModel, Moving) {
    "use strict";

    var $rb, instances = {};

    function initLayout(wrapperName, prepare) {

        var $rbWrapper = $('.' + wrapperName);
        $rbWrapper.html('<div class="rb"></div>');
        $rb = $rbWrapper.find('.rb');

        for(var i = 0; i < $rb.length; i++) {
            var elem = $rb.eq(i),
                id = elem.parent().attr('id');

            if (id === undefined) {
                id = 'instance_' + i;
                elem.attr('id', id);
            }

            var inst = new Moving(elem, 1000, 10);
            instances[id] = inst;

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