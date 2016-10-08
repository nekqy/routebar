define(['utils', 'screenModel', 'baseDispatcher', 'screenManager', 'smartResizer', 'arrows', 'moving'], function(
    Utils, Screen, BaseDispatcher, ScreenManager, SmartResizer, Arrows, Moving) {
    "use strict";

    var $rb;

    function initLayout(wrapperName) {
        var
            $rbWrapper = $('#' + wrapperName),
            $body = $('body');
        if (!$rbWrapper.length) {
            $body.append('<div id="' + wrapperName + '"></div>');
            $rbWrapper = $('#' + wrapperName);
        }
        $rbWrapper.html('<div class="rb"></div>');
        $rb = $rbWrapper.find('.rb');

        Moving.init($rb);
        SmartResizer($rb, $rb.width(), $rb.height());

        Moving.move('center', Screen.getMainScreen(), false);
    }

    $(function() {
        initLayout('rb-wrapper');

        $('body').on('keydown', function(e) {
            Moving.moveByActionValue(e.which, [37, 38, 39, 40], function(value, defValue) {
                return value === defValue;
            });
        });

        Arrows($rb, function(container, compareFn) {
            Moving.moveByActionValue(container, ['left', 'top', 'right', 'bottom'], compareFn);
        });
    });

    function configure(config) {
        if (config && config.startScreen) {
            Screen.setMainScreen(config.startScreen);
        }
    }
    function setScreen(screen, isSaveHistory) {
        return Moving.move('center', screen, isSaveHistory);
    }
    function reload(side) {
        var rbSide = $(side ? ('.rb__' + side) : '.rb__center');
        if (rbSide.length) {
            rbSide[0].screen = null;
        }

        return setScreen(ScreenManager.getCurScreen());
    }

    return {
        Screen: Screen,

        beforeMoveDispatcher: Moving.beforeMoveDispatcher,
        beforeRenderDispatcher: Moving.beforeRenderDispatcher,
        afterRenderDispatcher: Moving.afterRenderDispatcher,

        configure: configure,
        setScreen: setScreen,
        reload: reload,

        move: Moving.move,
        moveBack: Moving.moveBack
    };
});
