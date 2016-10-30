define(['screenModel', 'moving'], function(ScreenModel, Moving) {
    "use strict";

    function initLayout(startScreens, callback) {
        if (typeof startScreens === 'function') {
            callback = startScreens;
            startScreens = undefined;
        }

        $(function() {
            var $rbWrapper = $('.rb-wrapper');
            var loadingPromises = [];

            for (var i = 0; i < $rbWrapper.length; i++) {
                var elemWrapper = $rbWrapper.eq(i),
                    id = elemWrapper.data('id') || elemWrapper.attr('id') || 'instance_' + i;

                if (rb.Instances[id] === undefined) {
                    elemWrapper.html('<div class="rb"><div tabindex="-1" class="rb__fake-element"></div></div>');

                    var $rb = elemWrapper.find('.rb'),
                        inst = new Moving($rb, startScreens && startScreens[id]);
                    loadingPromises.push(inst._loadingPromise);

                    Object.defineProperty(rb.Instances, id, {
                        value: inst,
                        configurable: true,
                        enumerable: true
                    });
                }
            }

            Promise.all(loadingPromises).then(function() {
                callback && callback(rb.Instances);
            });
        });
    }

    function batchAction(action, args) {
        var res = [];
        for (var id in rb.Instances) {
            if (rb.Instances.hasOwnProperty(id)) {
                var inst = rb.Instances[id];
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

    function remove(id) {
        if (rb.Instances.hasOwnProperty(id)) {
            rb.Instances[id].destroy();
            delete rb.Instances[id];
        }
    }
    function removeAll() {
        for (var id in rb.Instances) {
            remove(id);
        }
    }

    return {
        initLayout: initLayout,
        remove: remove,
        Batch: {
            configure: configure,
            move: move,
            moveBack: moveBack,
            animateWrongSide: animateWrongSide,
            setScreen: setScreen,
            reload: reload,
            removeAll: removeAll
        }
    };
});