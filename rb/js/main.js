define(['utils', 'screenModel', 'baseDispatcher', 'arrows', 'moving'], function(
    Utils, Screen, BaseDispatcher, Arrows, Moving) {
    "use strict";

    var $rb, instances = {}, prepare;

    function initLayout(wrapperName) {

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

            var mainScreen = Screen.getMainScreen();
            if (mainScreen) {
                inst.move('center', mainScreen, false);
            }
        }
    }

    $(function() {
        initLayout('rb-wrapper');
        prepare(instances);
    });

    function configure(config) {
        if (config && config.startScreen) {
            Screen.setMainScreen(config.startScreen);
        }
        if (config && typeof config.prepare === 'function') {
            prepare = config.prepare;
        } else {
            throw new Error('Main module - configure - prepare function not found');
        }
    }

    return {
        Screen: Screen,
        configure: configure
    };
});
