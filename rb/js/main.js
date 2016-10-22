define(['screenModel', 'rbManager'], function(ScreenModel, RbManager) {
    "use strict";

    return Object.create(null, {
        Screen: {
            value: ScreenModel
        },
        start: {
            value: RbManager.initLayout
        },
        Batch: {
            value: RbManager.Batch
        }
    });
});
