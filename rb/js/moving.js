define(['animation', 'screenManager', 'baseDispatcher', 'utils'], function(Animation, ScreenManager, BaseDispatcher, Utils) {
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
    
    function move(side, screen) {
        if (side) {
            return Promise.race([ beforeMoveDispatcher._runActions(
                moveInner.bind(undefined, side, screen),
                [side, ScreenManager.getCurScreen()]
            ) ]);
        }
    }
    function moveInner(side, screen) {
        var
            rbCenter = 'rb__center',
            rbSide = 'rb__' + side,
            $oldElement = _mainDiv.find('.' + rbCenter),
            $newElement = _mainDiv.find('.' + rbSide);

        _side = side;

        update(undefined, screen);

        return new Promise(function (moveResolve, moveReject) {

            if ($newElement.is('.rb__empty')) {
                Animation.goToWrongSide($oldElement, side).then(function(result) {
                    moveResolve({
                        how: 'wrongSide',
                        isOk: result
                    });
                });
            } else if (side === 'center') {
                Animation.goToCenter($oldElement);
                moveResolve({
                    how: 'center',
                    isOk: true
                });
            } else if (sides.indexOf(side) !== -1) {
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

                Animation.goToCorrectSide($newElement, side).then(function(result) {
                    moveResolve({
                        how: 'correctSide',
                        isOk: result
                    });
                });
            } else {
                moveReject(new Error('Moving module - move - wrong side arg: ' + side));
            }
        });
    }
    function moveByActionValue(value, ltrbValues, mapFn) {
        var side;
        if (mapFn(value, ltrbValues[0])) side = 'left';
        else if (mapFn(value, ltrbValues[1])) side = 'top';
        else if (mapFn(value, ltrbValues[2])) side = 'right';
        else if (mapFn(value, ltrbValues[3])) side = 'bottom';
        return move(side);
    }

    function renderHtml() {
        var movingSide = _side;
        beforeRenderDispatcher._runActions(function() {

            var iframeCount = 0, loadedIframeCount = 0;
            sides.forEach(function(side) {
                var rbSide = _mainDiv.find('.rb__' + side),
                    screenToApply = ScreenManager.getRelativeScreen(side),
                    loading, iframes;

                if (rbSide.is('.rb__loading')) {
                    rbSide.toggleClass('rb__loading', false);
                    loading = true;
                    if (screenToApply) {
                        rbSide.html(screenToApply.html);
                        rbSide[0].screen = screenToApply;
                    }
                }

                if (loading) {
                    iframes = rbSide.find('iframe');
                    iframeCount += iframes.length;
                }
                rbSide.find('iframe').one('load', function() {
                    loadedIframeCount++;
                    if (iframeCount === loadedIframeCount) {
                        afterRenderDispatcher._runActions(Utils.nop, [movingSide, ScreenManager.getCurScreen()]);
                    }
                })
            });

            setTimeout(function() {
                if (iframeCount === 0) {
                    afterRenderDispatcher._runActions(Utils.nop, [movingSide, ScreenManager.getCurScreen()]);
                }
            }, 0);
        }, [movingSide, ScreenManager.getCurScreen()]);
    }

    var beforeMoveDispatcher = new BaseDispatcher(loadingDiv),
        beforeRenderDispatcher = new BaseDispatcher(loadingDiv),
        afterRenderDispatcher = new BaseDispatcher(loadingDiv);

    function init(mainDiv) {
        Animation.init(mainDiv, renderHtml, 1000);

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
        beforeRenderDispatcher: beforeRenderDispatcher,
        afterRenderDispatcher: afterRenderDispatcher
    }
});
