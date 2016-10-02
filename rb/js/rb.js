define(['jquery', 'utils', 'screenModel', 'baseDispatcher', 'screenManager', 'smartResizer', 'animation', 'arrows'], function($, Utils, Screen, BaseDispatcher, ScreenManager, SmartResizer, Animation, Arrows) {
    "use strict";

    var loadingHtml = '<div class="rb__loading_wrapper">' +
        '<div class="cssload-loader"></div>' +
        '</div>',
        loadingDiv = '<div class="rb__loading">' + loadingHtml + '</div>',
        sides = ['center', 'left', 'top', 'right', 'bottom'],
        $rb;

    function move(side, screen) {
        function makeLoading($div, except) {
            function includes($elem, arr) {
                if (!Array.isArray(arr)) {
                    return false;
                }
                for (var i = 0; i < arr.length; i++) {
                    if ($elem.is(arr[i])) {
                        return true;
                    }
                }
                return false;
            }
            function checkAndLoad(side) {
                if ($div.is('.rb__' + side) && $div[0].screen !== ScreenManager.getRelativeScreen(side)) {
                    $div.toggleClass('rb__loading', true);
                    $div.html(loadingHtml);
                    $div[0].screen = null;
                }
            }
            if ($div.is('.rb__empty')) {
                $div.toggleClass('rb__loading', false);
                return;
            }

            if (!except || except && !$div.is(except) && !includes($div, except)) {
                sides.forEach(checkAndLoad);
            }
        }

        function update(side, screen, except) {
            var isLeft, isTop, isRight, isBottom, $rbLeft, $rbTop, $rbRight, $rbBottom;

            ScreenManager.updateScreens(side, screen);

            $rbLeft = $rb.find('.rb__left');
            $rbTop = $rb.find('.rb__top');
            $rbRight = $rb.find('.rb__right');
            $rbBottom = $rb.find('.rb__bottom');

            if (ScreenManager.getCurScreen()) {
                isLeft = ScreenManager.getRelativeScreen('left');
                isTop = ScreenManager.getRelativeScreen('top');
                isRight = ScreenManager.getRelativeScreen('right');
                isBottom = ScreenManager.getRelativeScreen('bottom');
                $rbLeft.toggleClass('rb__empty', !isLeft);
                $rbTop.toggleClass('rb__empty', !isTop);
                $rbRight.toggleClass('rb__empty', !isRight);
                $rbBottom.toggleClass('rb__empty', !isBottom);
                //$rb.find('.rb__arrow-container_left').toggleClass('rb__arrow-none', !isLeft);
                //$rb.find('.rb__arrow-container_top').toggleClass('rb__arrow-none', !isTop);
                //$rb.find('.rb__arrow-container_right').toggleClass('rb__arrow-none', !isRight);
                //$rb.find('.rb__arrow-container_bottom').toggleClass('rb__arrow-none', !isBottom);
            } else {
                throw new Error('Current screen not found');
            }

            makeLoading($oldElement, except);
            makeLoading($rbLeft, except);
            makeLoading($rbTop, except);
            makeLoading($rbRight, except);
            makeLoading($rbBottom, except);
        }

        var
            rbCenter = 'rb__center',
            rbSide = 'rb__' + side,
            $oldElement = $rb.find('.' + rbCenter),
            $newElement = $rb.find('.' + rbSide);

        update(undefined, screen);

        if ($newElement.is('.rb__empty')) {
            Animation.goToWrongSide($oldElement, side);
        } else if (side === 'center') {
            Animation.goToCenter($oldElement);
        } else {
            var oppositeSide = Utils.oppositeSide(side),
                rbOppositeSide = 'rb__' + oppositeSide,
                oppositeScreen = $rb.find('.' + rbOppositeSide);
            oppositeScreen.toggleClass(rbOppositeSide, false);
            oppositeScreen.toggleClass(rbSide, true);

            $oldElement.toggleClass(rbCenter, false);
            $oldElement.toggleClass(rbOppositeSide, true);

            $newElement.toggleClass(rbSide, false);
            $newElement.toggleClass(rbCenter, true);

            update(side, undefined, [$oldElement, $newElement]);

            Animation.goToCorrectSide($oldElement, $newElement, side);
        }
    }
    function moveByActionValue(value, ltrbValues, mapFn) {
        var curScreen = ScreenManager.getCurScreen(),
            side;
        if (mapFn(value, ltrbValues[0])) side = 'left';
        else if (mapFn(value, ltrbValues[1])) side = 'top';
        else if (mapFn(value, ltrbValues[2])) side = 'right';
        else if (mapFn(value, ltrbValues[3])) side = 'bottom';

        if (side) {
            beforeMoveDispatcher._runActions(move.bind(undefined, side), [side, curScreen]);
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

        var html = '<div class="rb__center"></div>' +
            '<div class="rb__left"></div>' +
            '<div class="rb__top"></div>' +
            '<div class="rb__right"></div>' +
            '<div class="rb__bottom"></div>' +
        '</div>';
        $rb.html(html);

        SmartResizer($rb, $rb.width(), $rb.height());
        Animation.init($rb, renderHtml, 0.5);
    }

    var beforeMoveDispatcher = new BaseDispatcher(loadingDiv);

    $(function() {
        initLayout('rb-wrapper');
        move('center', Screen.getMainScreen());

        $('body').on('keydown', function(e) {
            moveByActionValue(e.which, [37, 38, 39, 40], function(value, defValue) {
                return value === defValue;
            });
        });

        Arrows($rb, function(container) {
            moveByActionValue(container, ['left', 'top', 'right', 'bottom'], function(container, defValue) {
                return container.is('.rb__arrow-container_' + defValue);
            });

        });
    });

    window.rb = {
        Screen: Screen,
        beforeMoveDispatcher: beforeMoveDispatcher,
        start: function(screen) {
            Screen.setMainScreen(screen);
        },
        setScreen: function(screen) {
            move('center', screen);
        }
    };
    return window.rb;
});
