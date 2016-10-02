define(['animation', 'screenManager', 'utils'], function(Animation, ScreenManager, Utils) {
    "use strict";

    var sides = ['center', 'left', 'top', 'right', 'bottom'],
        _mainDiv,
        _loadingHtml;

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
                $div.html(_loadingHtml);
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
            //$rb.find('.rb__arrow-container_left').toggleClass('rb__arrow-none', !isLeft);
            //$rb.find('.rb__arrow-container_top').toggleClass('rb__arrow-none', !isTop);
            //$rb.find('.rb__arrow-container_right').toggleClass('rb__arrow-none', !isRight);
            //$rb.find('.rb__arrow-container_bottom').toggleClass('rb__arrow-none', !isBottom);
        } else {
            throw new Error('Current screen not found');
        }

        makeLoading($rbCenter, except);
        makeLoading($rbLeft, except);
        makeLoading($rbTop, except);
        makeLoading($rbRight, except);
        makeLoading($rbBottom, except);
    }
    function move(side, screen) {
        var
            rbCenter = 'rb__center',
            rbSide = 'rb__' + side,
            $oldElement = _mainDiv.find('.' + rbCenter),
            $newElement = _mainDiv.find('.' + rbSide);

        update(undefined, screen);

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
    }

    function init(mainDiv, loadingHtml) {
        if (mainDiv instanceof $) {
            _mainDiv = mainDiv;
        } else {
            throw new Error('Moving module - init - wrong mainDiv arg: ' + mainDiv);
        }

        if (typeof loadingHtml === 'string') {
            _loadingHtml = loadingHtml;
        } else {
            throw new Error('Moving module - init - wrong loadingHtml arg: ' + loadingHtml);
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
        move: move
    }
});
