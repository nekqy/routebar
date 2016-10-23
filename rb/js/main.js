define(['screenModel', 'rbManager', 'IPlugin'], function(ScreenModel, RbManager, IPlugin) {
    "use strict";

    return Object.create(null, {
        Screen: {
            value: ScreenModel
        },
        start: {
            value: RbManager.initLayout
        },
        remove: {
            value: RbManager.remove
        },
        Instances: {
            value: {}
        },
        Batch: {
            value: RbManager.Batch
        },
        IPlugin: {
            value: IPlugin
        }
    });
});
