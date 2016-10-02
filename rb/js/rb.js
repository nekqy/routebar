define(['jquery', 'utils', 'screenModel', 'baseDispatcher', 'screenManager', 'smartResizer', 'animation', 'arrows', 'moving'], function(
    $, Utils, Screen, BaseDispatcher, ScreenManager, SmartResizer, Animation, Arrows, Moving) {
    "use strict";

    var loadingHtml = '<div class="rb__loading_wrapper">' +
        '<div class="cssload-loader"></div>' +
        '</div>',
        loadingDiv = '<div class="rb__loading">' + loadingHtml + '</div>',
        sides = ['center', 'left', 'top', 'right', 'bottom'],
        $rb;

    function moveByActionValue(value, ltrbValues, mapFn) {
        var curScreen = ScreenManager.getCurScreen(),
            side;
        if (mapFn(value, ltrbValues[0])) side = 'left';
        else if (mapFn(value, ltrbValues[1])) side = 'top';
        else if (mapFn(value, ltrbValues[2])) side = 'right';
        else if (mapFn(value, ltrbValues[3])) side = 'bottom';

        if (side) {
            beforeMoveDispatcher._runActions(Moving.move.bind(undefined, side), [side, curScreen]);
        }
    }
    function renderHtml() {
        sides.forEach(function(side) {
            var rbSide = $rb.find('.rb__' + side),
                screenToApply = ScreenManager.getRelativeScreen(side);

            if (rbSide.is('.rb__loading')) {
                rbSide.toggleClass('rb__loading', false);
                if (screenToApply) {
                    rbSide.html(screenToApply.html);
                    rbSide[0].screen = screenToApply;
                }
            }
        });
    }
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

        Moving.init($rb, loadingHtml);
        SmartResizer($rb, $rb.width(), $rb.height());
        Animation.init($rb, renderHtml, 0.5);

        Moving.move('center', Screen.getMainScreen());
    }

    var beforeMoveDispatcher = new BaseDispatcher(loadingDiv);

    $(function() {
        initLayout('rb-wrapper');

        $('body').on('keydown', function(e) {
            moveByActionValue(e.which, [37, 38, 39, 40], function(value, defValue) {
                return value === defValue;
            });
        });

        Arrows($rb, function(container, compareFn) {
            moveByActionValue(container, ['left', 'top', 'right', 'bottom'], compareFn);
        });
    });

    window.rb = {
        Screen: Screen,
        beforeMoveDispatcher: beforeMoveDispatcher,
        start: function(screen) {
            Screen.setMainScreen(screen);
        },
        setScreen: function(screen) {
            Moving.move('center', screen);
        }
    };
    return window.rb;
});
