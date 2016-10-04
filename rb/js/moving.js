define(['./animation', './screenManager', './baseDispatcher', './utils'], function(Animation, ScreenManager, BaseDispatcher, Utils) {
    "use strict";

    var
        loadingHtml = '<div class="rb__loading_wrapper">' +
            '<div class="cssload-loader"></div>' +
            '</div>',
        loadingDiv = '<div class="rb__loading">' + loadingHtml + '</div>',
        sides = ['center', 'left', 'top', 'right', 'bottom'],
        _mainDiv, _side, _moveResolve, _moveReject;

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
        var isLeft, isTop, isRight, isBottom, $rbLeft, $rbTop, $rbRight, $rbBottom, $rbCenter;

        ScreenManager.updateScreens(side, screen);

        $rbCenter = _mainDiv.find('.rb__center');
        $rbLeft = _mainDiv.find('.rb__left');
        $rbTop = _mainDiv.find('.rb__top');
        $rbRight = _mainDiv.find('.rb__right');
        $rbBottom = _mainDiv.find('.rb__bottom');

        if (ScreenManager.getCurScreen()) {
            isLeft = ScreenManager.getRelativeScreen('left');
            isTop = ScreenManager.getRelativeScreen('top');
            isRight = ScreenManager.getRelativeScreen('right');
            isBottom = ScreenManager.getRelativeScreen('bottom');
            $rbLeft.toggleClass('rb__empty', !isLeft);
            $rbTop.toggleClass('rb__empty', !isTop);
            $rbRight.toggleClass('rb__empty', !isRight);
            $rbBottom.toggleClass('rb__empty', !isBottom);
            // todo восстановить
            //$rb.find('.rb__arrow-container_left').toggleClass('rb__arrow-none', !isLeft);
            //$rb.find('.rb__arrow-container_top').toggleClass('rb__arrow-none', !isTop);
            //$rb.find('.rb__arrow-container_right').toggleClass('rb__arrow-none', !isRight);
            //$rb.find('.rb__arrow-container_bottom').toggleClass('rb__arrow-none', !isBottom);
        } else {
            var reject = _moveReject;
            _moveResolve = null;
            _moveReject = null;
            reject(new Error('Current screen not found'));
        }

        makeLoading($rbCenter, except);
        makeLoading($rbLeft, except);
        makeLoading($rbTop, except);
        makeLoading($rbRight, except);
        makeLoading($rbBottom, except);
    }
    function moveAsync(fn) {
        if (_moveResolve) {
            _moveResolve(false);
            _moveResolve = null;
            _moveReject = null;
        }
        return new Promise(function (resolve, reject) {
            _moveResolve = resolve;
            _moveReject = reject;

            fn();
        });
    }
    function move(side, screen) {
        var
            rbCenter = 'rb__center',
            rbSide = 'rb__' + side,
            $oldElement = _mainDiv.find('.' + rbCenter),
            $newElement = _mainDiv.find('.' + rbSide);

        _side = side;

        update(undefined, screen);

        return moveAsync(function() {
            if ($newElement.is('.rb__empty')) {
                Animation.goToWrongSide($oldElement, side);
            } else if (side === 'center') {
                Animation.goToCenter($oldElement);
            } else {
                var oppositeSide = Utils.oppositeSide(side),
                    rbOppositeSide = 'rb__' + oppositeSide,
                    oppositeScreen = _mainDiv.find('.' + rbOppositeSide);
                oppositeScreen.toggleClass(rbOppositeSide, false);
                oppositeScreen.toggleClass(rbSide, true);

                $oldElement.toggleClass(rbCenter, false);
                $oldElement.toggleClass(rbOppositeSide, true);

                $newElement.toggleClass(rbSide, false);
                $newElement.toggleClass(rbCenter, true);

                update(side, undefined, [$oldElement, $newElement]);

                Animation.goToCorrectSide($oldElement, $newElement, side);
            }
        });
    }
    function moveByActionValue(value, ltrbValues, mapFn) {
        var curScreen = ScreenManager.getCurScreen(),
            side;
        if (mapFn(value, ltrbValues[0])) side = 'left';
        else if (mapFn(value, ltrbValues[1])) side = 'top';
        else if (mapFn(value, ltrbValues[2])) side = 'right';
        else if (mapFn(value, ltrbValues[3])) side = 'bottom';

        if (side) {
            return beforeMoveDispatcher._runActions(move.bind(undefined, side), [side, curScreen]);
        }
    }

    function renderHtml() {
        sides.forEach(function(side) {
            var rbSide = _mainDiv.find('.rb__' + side),
                screenToApply = ScreenManager.getRelativeScreen(side);

            if (rbSide.is('.rb__loading')) {
                rbSide.toggleClass('rb__loading', false);
                if (screenToApply) {
                    rbSide.html(screenToApply.html);
                    rbSide[0].screen = screenToApply;
                }
            }
        });

        if (_moveResolve) {
            _moveResolve(true);
            _moveResolve = null;
            _moveReject = null;
        }
        // todo нужно найти во вставляемых верстках ифреймы и дождаться их событий окончания рендеринга, и только потом стрельнуть
        // но надо быть осторожным с ожиданием событий которые могут и не наступить. если тут отложится, а там сработает move и удалит ифреймы
        afterRenderDispatcher._runActions(Utils.nop, [_side, ScreenManager.getCurScreen()]);
    }

    var beforeMoveDispatcher = new BaseDispatcher(loadingDiv),
        afterRenderDispatcher = new BaseDispatcher(loadingDiv);

    function init(mainDiv) {
        Animation.init(mainDiv, renderHtml, 0.5);

        if (mainDiv instanceof $) {
            _mainDiv = mainDiv;
        } else {
            throw new Error('Moving module - init - wrong mainDiv arg: ' + mainDiv);
        }

        mainDiv.append($(
            '<div class="rb__center"></div>' +
            '<div class="rb__left"></div>' +
            '<div class="rb__top"></div>' +
            '<div class="rb__right"></div>' +
            '<div class="rb__bottom"></div>'
        ));
    }

    return {
        init: init,
        move: move,
        moveByActionValue: moveByActionValue,
        beforeMoveDispatcher: beforeMoveDispatcher,
        afterRenderDispatcher: afterRenderDispatcher
    }
});
