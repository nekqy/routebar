define(['screenModel', 'moving'], function(ScreenModel, Moving) {
    "use strict";

    var instances = {};

    function initLayout(startScreens, callback) {
        $(function() {
            var $rbWrapper = $('.rb-wrapper');
            var loadingPromises = [];

            for (var i = 0; i < $rbWrapper.length; i++) {
                var elemWrapper = $rbWrapper.eq(i),
                    id = elemWrapper.data('id') || elemWrapper.attr('id') || 'instance_' + i;

                if (rb.Instances[id] === undefined) {
                    elemWrapper.html('<div class="rb"><div tabindex="-1" class="rb__fake-element"></div></div>');

                    var $rb = elemWrapper.find('.rb'),
                        inst = new Moving($rb, startScreens[id]);
                    instances[id] = inst;
                    loadingPromises.push(inst._loadingPromise);

                    Object.defineProperty(rb.Instances, id, {
                        value: inst
                    });
                }
            }

            Promise.all(loadingPromises).then(function() {
                callback && callback(instances);
            });
        });
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