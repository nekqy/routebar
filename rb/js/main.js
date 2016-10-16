define(['screenModel', 'rbManager'], function(ScreenModel, RbManager) {
    "use strict";

    var prepare;

    $(function() {
        RbManager.initLayout('rb-wrapper', prepare);
    });

    function configure(config) {
        if (config && config.startScreen) {
            ScreenModel.setMainScreen(config.startScreen);
        }
        if (config && typeof config.prepare === 'function') {
            prepare = config.prepare;
        } else {
            throw new Error('Main module - configure - prepare function not found');
        }
    }

    return {
        Screen: ScreenModel,
        configure: configure,
        instanceManager: RbManager
    };
});
