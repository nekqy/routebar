define(['screenModel', 'rbManager'], function(ScreenModel, RbManager) {
    "use strict";

    var _prepare;

    $(function() {
        if (typeof prepare === 'function') {
            RbManager.initLayout('rb-wrapper', _prepare);
        } else {
            throw new Error('Main module - prepare function not found. Use "rb.prepare(function)"');
        }
    });

    function prepare(prepare) {
        if (typeof prepare === 'function') {
            _prepare = prepare;
        } else {
            throw new Error('Main module - configure - prepare function not found');
        }
    }

    return Object.create(null, {
        Screen: {
            value: ScreenModel
        },
        prepare: {
            value: prepare
        },
        Batch: {
            value: RbManager.Batch
        }
    });
});
