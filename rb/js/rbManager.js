define(['screenModel', 'moving'], function(ScreenModel, Moving) {
    "use strict";

    var instances = {};

    function initLayout(startScreens, callback) {
        $(function() {
            var $rbWrapper = $('.rb-wrapper');
            $rbWrapper.html('<div class="rb"><div tabindex="-1" class="rb__fake-element"></div></div>');
            var $rb = $rbWrapper.find('.rb'),
                loadingPromises = [];

            rb.Instances = {};
            for (var i = 0; i < $rb.length; i++) {
                var elem = $rb.eq(i),
                    elemWrapper = elem.parent(),
                    id = elemWrapper.data('id') || elemWrapper.attr('id') || 'instance_' + i;

                var inst = new Moving(elem, startScreens[id]);
                instances[id] = inst;
                loadingPromises.push(inst._loadingPromise);

                if (rb.Instances[id] !== undefined) {
                    console.error('initLayout - instance id "' + id + '" forbidden or exists already');
                    //throw new Error('initLayout - instance id "' + id + '" forbidden or exists already');
                } else {
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