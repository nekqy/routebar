define(['screenModel', 'moving'], function(ScreenModel, Moving) {
    "use strict";

    var instances = {};

    function initLayout(wrapperName, prepare) {

        var $rbWrapper = $('.' + wrapperName);
        $rbWrapper.html('<div class="rb"><div tabindex="-1" class="rb__fake-element"></div></div>');
        var $rb = $rbWrapper.find('.rb');

        for(var i = 0; i < $rb.length; i++) {
            var elem = $rb.eq(i),
                elemWrapper = elem.parent(),
                id = elemWrapper.data('id') || elemWrapper.attr('id') || 'instance_' + i;

            var inst = new Moving(elem, 1000, 10);
            instances[id] = inst;

            if (rb[id] !== undefined) {
                throw new Error('initLayout - instance id "' + id + '" forbidden or exists already');
            }
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

    function batchAction(action, args) {
        var res = [];
        for (var id in instances) {
            if (instances.hasOwnProperty(id)) {
                var inst = instances[id];
                res.push(inst[action].apply(inst, args));
            }
        }
        return res;
    }

    function configure() {
        batchAction('configure', arguments);
    }
    function move() {
        return Promise.all(batchAction('move', arguments));
    }
    function moveBack() {
        return batchAction('moveBack', arguments);
    }
    function animateWrongSide() {
        return Promise.all(batchAction('animateWrongSide', arguments));
    }
    function setScreen() {
        return Promise.all(batchAction('setScreen', arguments));
    }
    function reload() {
        batchAction('reload', arguments);
    }

    return {
        initLayout: initLayout,
        Batch: {
            configure: configure,
            move: move,
            moveBack: moveBack,
            animateWrongSide: animateWrongSide,
            setScreen: setScreen,
            reload: reload
        }
    };
});