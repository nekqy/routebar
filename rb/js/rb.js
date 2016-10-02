define(['jquery', 'utils', 'screenModel', 'baseDispatcher', 'screenManager', 'smartResizer'], function($, Utils, Screen, BaseDispatcher, ScreenManager, SmartResizer) {
    "use strict";

    var loadingHtml = '<div class="rb__loading_wrapper">' +
        '<div class="cssload-loader"></div>' +
        '</div>',
        loadingDiv = '<div class="rb__loading">' + loadingHtml + '</div>';

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
                }
            }
            if ($div.is('.rb__empty')) {
                return;
            }

            if (!except || except && !$div.is(except) && !includes($div, except)) {
                checkAndLoad('left');
                checkAndLoad('top');
                checkAndLoad('right');
                checkAndLoad('bottom');
                checkAndLoad('center');
            }
        }

        function doTransition(prevElem, elem, transitionClass, beforeFn, transitionFn, afterFn, needAfter) {
            function subscribeTransitionEnd(elem, handler) {
                if (elem && elem.length) {
                    elem.on('transitionend', handler);
                    elem[0]._transitionHandler = handler;
                    elem[0]._needAfter = needAfter;
                    elem.toggleClass(transitionClass, true);
                }
            }
            function unsubscribeTransitionEnd(elem) {
                if (elem && elem.length) {
                    elem.off('transitionend', elem[0]._transitionHandler);
                    if (elem[0]._needAfter) {
                        delete elem[0]._needAfter;
                        elem[0]._transitionHandler();
                    }
                    delete elem[0]._transitionHandler;
                    elem.toggleClass(transitionClass, false);
                }
            }

            beforeFn && beforeFn();

            unsubscribeTransitionEnd(prevElem);
            unsubscribeTransitionEnd(elem);

            setTimeout(function() {
                subscribeTransitionEnd(elem, function() {
                    unsubscribeTransitionEnd(elem);
                    afterFn && afterFn();
                });

                // todo могут быть проблемы, если transitionFn не делает transition, тогда transitionend не сработает
                transitionFn && transitionFn();
            }, 0);
        }
        function update(side, screen) {
            var isLeft, isTop, isRight, isBottom;

            ScreenManager.updateScreens(side, screen);

            $rbLeft = $('.rb__left');
            $rbTop = $('.rb__top');
            $rbRight = $('.rb__right');
            $rbBottom = $('.rb__bottom');

            if (ScreenManager.getCurScreen()) {
                isLeft = ScreenManager.getRelativeScreen('left');
                isTop = ScreenManager.getRelativeScreen('top');
                isRight = ScreenManager.getRelativeScreen('right');
                isBottom = ScreenManager.getRelativeScreen('bottom');
                $rbLeft.toggleClass('rb__empty', !isLeft);
                $rbTop.toggleClass('rb__empty', !isTop);
                $rbRight.toggleClass('rb__empty', !isRight);
                $rbBottom.toggleClass('rb__empty', !isBottom);
                $('.rb__arrow-container_left').toggleClass('rb__arrow-none', !isLeft);
                $('.rb__arrow-container_top').toggleClass('rb__arrow-none', !isTop);
                $('.rb__arrow-container_right').toggleClass('rb__arrow-none', !isRight);
                $('.rb__arrow-container_bottom').toggleClass('rb__arrow-none', !isBottom);
            } else {
                throw new Error('Current screen not found');
            }

            makeLoading($oldElement);
            makeLoading($rbLeft);
            makeLoading($rbTop);
            makeLoading($rbRight);
            makeLoading($rbBottom);
        }

        var
            rbCenter = 'rb__center',
            rbSide = 'rb__' + side,
            $oldElement = $('.' + rbCenter),
            $newElement = $('.' + rbSide),
            $rb = $('#rb'),
            startSide = Utils.getStartSide(side),
            width = $rb.width(),
            height = $rb.height();

        update(undefined, screen);

        if ($newElement.is('.rb__empty')) {
            doTransition($oldElement, $oldElement, 'rb__animate2', function() {
                $oldElement.css({'margin-left': width, 'margin-top': height});
            }, function() {
                var dw = width/10, dh = height/10;

                // fix lags. transitionend must be dispatched.
                if (Math.abs($oldElement[0].offsetLeft) === dw) {
                    dw++;
                } else if (Math.abs($oldElement[0].offsetTop) === dh) {
                    dh++;
                }

                if (side === 'left') {
                    $oldElement.css({'margin-left': width - dw, 'margin-top': height});
                } else if (side === 'right') {
                    $oldElement.css({'margin-left': width + dw, 'margin-top': height});
                } else if (side === 'top') {
                    $oldElement.css({'margin-left': width, 'margin-top': height - dh});
                } else if (side === 'bottom') {
                    $oldElement.css({'margin-left': width, 'margin-top': height + dh});
                }

                renderHtml();
            }, function() {
                doTransition($oldElement, $oldElement, 'rb__animate3', undefined, function() {
                    $oldElement.css('margin-' + startSide, startSide === 'left' ? width : height);
                }, undefined, true);
            }, true);

            return;
        }

        var
            oppositeSide = Utils.oppositeSide(side),
            rbOppositeSide = 'rb__' + oppositeSide,
            oppositeScreen = $('.' + rbOppositeSide),
            $rbLeft, $rbTop, $rbRight, $rbBottom;

        if (side === 'center') {
            $oldElement.css({'margin-left': $oldElement.width(), 'margin-top': $oldElement.height()});

            update(undefined, screen);
            renderHtml();
        } else {
            oppositeScreen.toggleClass(rbOppositeSide, false);
            oppositeScreen.toggleClass(rbSide, true);

            $oldElement.toggleClass(rbCenter, false);
            $oldElement.toggleClass(rbOppositeSide, true);

            $newElement.toggleClass(rbSide, false);
            $newElement.toggleClass(rbCenter, true);

            update(side);

            doTransition($oldElement, $newElement, 'rb__animate', function() {
                if (side === 'left') {
                    $newElement.css({'margin-left': 0, 'margin-top': height});
                } else if (side === 'right') {
                    $newElement.css({'margin-left': 2*width, 'margin-top': height});
                } else if (side === 'top') {
                    $newElement.css({'margin-left': width, 'margin-top': 0});
                } else if (side === 'bottom') {
                    $newElement.css({'margin-left': width, 'margin-top': 2*height});
                }

            }, function() {
                $newElement.css('margin-' + startSide, startSide === 'left' ? width : height);
                renderHtml();
            }, undefined);
        }
    }

    var renderHtml = Utils.debounce(function () {
        function renderSide(side) {
            var rbSide = $('.rb__' + side),
                loadingScreen = ScreenManager.getRelativeScreen(side);

            if (rbSide.is('.rb__loading')) {
                rbSide.toggleClass('rb__loading', false);
                if (loadingScreen) {
                    rbSide.html(loadingScreen.html);
                    rbSide[0].screen = loadingScreen;
                }
            }
        }

        renderSide('center');
        renderSide('left');
        renderSide('top');
        renderSide('right');
        renderSide('bottom');
    }, 500);

    var beforeMoveDispatcher = new BaseDispatcher(loadingDiv);

    $(function() {
        var
            $rbWrapper = $('#rb-wrapper'),
            $body = $('body');
        if (!$rbWrapper.length) {
            $body.append('<div id="rb-wrapper"></div>');
            $rbWrapper = $('#rb-wrapper');
        }
        $rbWrapper.html('<div id="rb"></div>');
        var $rb = $rbWrapper.find('#rb');

        var html = '<div class="rb__center"></div>' +
            '<div class="rb__left"></div>' +
            '<div class="rb__top"></div>' +
            '<div class="rb__right"></div>' +
            '<div class="rb__bottom"></div>' +
            '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_left">' +
                '<div class="rb__arrow rb__arrow_left"></div>' +
            '</div>' +
            '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_top">' +
                '<div class="rb__arrow rb__arrow_top"></div>' +
            '</div>' +
            '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_right">' +
                '<div class="rb__arrow rb__arrow_right"></div>' +
            '</div>' +
            '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_bottom">' +
                '<div class="rb__arrow rb__arrow_bottom"></div>' +
            '</div>';
        $rb.html(html);

        SmartResizer($rb.width(), $rb.height());

        $body.on('keydown', function(e) {
            var curScreen = ScreenManager.getCurScreen();
            if (e.which === 37) { //left
                beforeMoveDispatcher._runActions(move.bind(undefined, 'left'), ['left', curScreen]);
            }
            if (e.which === 38) { // up
                beforeMoveDispatcher._runActions(move.bind(undefined, 'top'), ['top', curScreen]);
            }
            if (e.which === 39) { // right
                beforeMoveDispatcher._runActions(move.bind(undefined, 'right'), ['right', curScreen]);
            }
            if (e.which === 40) { // down
                beforeMoveDispatcher._runActions(move.bind(undefined, 'bottom'), ['bottom', curScreen]);
            }
        });

        function clearArrowTimeout(container) {
            container.toggleClass('rb__arrow-hide', false);
            container.toggleClass('rb__arrow-cursor', true);
            if (container.length) {
                clearTimeout(container[0].hideArrowId);
                container[0].hideArrowId = null;
            }
        }
        function hideArrowTimeout(container) {
            function hideArrow() {
                container.toggleClass('rb__arrow-hide', true);
                container.toggleClass('rb__arrow-cursor', false);
            }

            clearArrowTimeout(container);
            if (container.length) {
                container[0].hideArrowId = setTimeout(hideArrow, 3000);
            }
        }
        var $rbArrowContainer = $('.rb__arrow-container');
        $rbArrowContainer.on('click', function(e) {
            var container = $(this),
                curScreen = ScreenManager.getCurScreen();

            if (!container.is('.rb__arrow-hide')) {

                hideArrowTimeout(container);
                if (container.is('.rb__arrow-container_left')) {
                    beforeMoveDispatcher._runActions(move.bind(undefined, 'left'), ['left', curScreen]);
                }
                if (container.is('.rb__arrow-container_top')) {
                    beforeMoveDispatcher._runActions(move.bind(undefined, 'top'), ['top', curScreen]);
                }
                if (container.is('.rb__arrow-container_right')) {
                    beforeMoveDispatcher._runActions(move.bind(undefined, 'right'), ['right', curScreen]);
                }
                if (container.is('.rb__arrow-container_bottom')) {
                    beforeMoveDispatcher._runActions(move.bind(undefined, 'bottom'), ['bottom', curScreen]);
                }
            } else {
                container.css('display', 'none');
                try {
                    var behindElem = document.elementFromPoint(e.clientX, e.clientY);
                    if (behindElem.tagName.toLowerCase() === 'iframe') {
                        var doc = behindElem.contentDocument || behindElem.contentWindow.document;
                        behindElem = doc.elementFromPoint(e.clientX, e.clientY);
                    }
                    $(behindElem).trigger(e);
                }
                finally {
                    container.css('display', '');
                }
            }
        });
        $rbArrowContainer.on('mouseenter', function() {
            hideArrowTimeout($(this));
        });
        $rbArrowContainer.on('mouseleave', function() {
            clearArrowTimeout($(this));
        });
        move('center', Screen.getMainScreen());
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
