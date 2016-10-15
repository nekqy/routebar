define(['animation', 'screenManager', 'baseDispatcher', 'smartResizer', 'arrows', 'utils'], function(Animation, ScreenManager, BaseDispatcher, SmartResizer, Arrows, Utils) {
    "use strict";

    var
        loadingHtml = '<div class="rb__loading_wrapper">' +
            '<div class="cssload-loader"></div>' +
            '</div>',
        loadingDiv = '<div class="rb__loading">' + loadingHtml + '</div>',
        sides = ['center', 'left', 'top', 'right', 'bottom'];

    function Moving(mainDiv, speed, historyLength) {
        function keydownHandler(e) {
            self._moveByActionValue(e.which, [37, 38, 39, 40], function(value, defValue) {
                return value === defValue;
            });
            e.stopPropagation();
        }

        this.beforeMoveDispatcher = new BaseDispatcher(loadingDiv);
        this.beforeRenderDispatcher = new BaseDispatcher(loadingDiv);
        this.afterRenderDispatcher = new BaseDispatcher(loadingDiv);

        this._mainDiv = undefined;
        this._side = undefined;

        this._animation = new Animation(mainDiv, speed);
        this._screenManager = new ScreenManager(historyLength);

        if (mainDiv instanceof $) {
            this._mainDiv = mainDiv;
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

        var self = this;
        Arrows(mainDiv, function(container, compareFn) {
            self._moveByActionValue(container, ['left', 'top', 'right', 'bottom'], compareFn);
        });
        $('body').on('keydown', keydownHandler);
        mainDiv.on('keydown', keydownHandler);

        SmartResizer(mainDiv, mainDiv.width(), mainDiv.height());

        if (mainDiv.length) {
            mainDiv[0].moving = this;
        }
    }

    Moving.prototype._makeLoading = function($div, except) {
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
            if ($div.is('.rb__' + side) && $div[0].screen !== self._screenManager.getRelativeScreen(side)) {
                $div.toggleClass('rb__loading', true);
                $div.html(loadingHtml);
                $div[0].screen = null;
            }
        }

        var self = this;
        if ($div.is('.rb__empty')) {
            $div.toggleClass('rb__loading', false);
            return;
        }

        if (!except || except && !$div.is(except) && !includes($div, except)) {
            sides.forEach(checkAndLoad); // todo оптимизировать. не надо искать так
        }
    };
    Moving.prototype._update = function(side, screen, except, isSaveHistory) {
        function checkExistance(checkSide, targetScreen, curElement) {
            var curScreen = curElement[0].screen,
                nextElement = self._mainDiv.find('.rb__' + checkSide),
                nextScreen = nextElement[0].screen;
            if (nextScreen === targetScreen && nextScreen !== curScreen) {
                curElement.toggleClass('rb__center', false);
                curElement.toggleClass('rb__' + checkSide, true);
                nextElement.toggleClass('rb__center', true);
                nextElement.toggleClass('rb__' + checkSide, false);

                if (Utils.oppositeSide(side) === checkSide) {
                    self._makeLoading(curElement);
                }
                return true;
            }
            return false;
        }

        var self = this,
            isLeft, isTop, isRight, isBottom, $rbLeft, $rbTop, $rbRight, $rbBottom, $rbCenter;

        var updatedScreen = this._screenManager.updateScreens(side, screen, isSaveHistory),
            curElement = self._mainDiv.find('.rb__center');

        // todo и если это oppositeSide надо залоадить то с чего уходим, оно уже не актуально
        !checkExistance('left', updatedScreen, curElement)
        && !checkExistance('right', updatedScreen, curElement)
        && !checkExistance('top', updatedScreen, curElement)
        && !checkExistance('bottom', updatedScreen, curElement);

        $rbCenter = this._mainDiv.find('.rb__center');
        $rbLeft = this._mainDiv.find('.rb__left');
        $rbTop = this._mainDiv.find('.rb__top');
        $rbRight = this._mainDiv.find('.rb__right');
        $rbBottom = this._mainDiv.find('.rb__bottom');

        if (this._screenManager.getCurScreen()) {
            isLeft = this._screenManager.getRelativeScreen('left');
            isTop = this._screenManager.getRelativeScreen('top');
            isRight = this._screenManager.getRelativeScreen('right');
            isBottom = this._screenManager.getRelativeScreen('bottom');
            $rbLeft.toggleClass('rb__empty', !isLeft);
            $rbTop.toggleClass('rb__empty', !isTop);
            $rbRight.toggleClass('rb__empty', !isRight);
            $rbBottom.toggleClass('rb__empty', !isBottom);
            // todo восстановить
            //$rb.find('.rb__arrow-container_left').toggleClass('rb__arrow-none', !isLeft);
            //$rb.find('.rb__arrow-container_top').toggleClass('rb__arrow-none', !isTop);
            //$rb.find('.rb__arrow-container_right').toggleClass('rb__arrow-none', !isRight);
            //$rb.find('.rb__arrow-container_bottom').toggleClass('rb__arrow-none', !isBottom);
        }

        this._makeLoading($rbCenter);
        //this._makeLoading($rbLeft, except);
        //this._makeLoading($rbTop, except);
        //this._makeLoading($rbRight, except);
        //this._makeLoading($rbBottom, except);
    };
    
    Moving.prototype.move = function(side, screen, isSaveHistory) {
        var self = this;
        if (side) {
            return Promise.race([ this.beforeMoveDispatcher._runActions(
                self._moveInner.bind(self, side, screen, isSaveHistory),
                [side, self._screenManager.getCurScreen(), self]
            ) ]);
        }
    };
    Moving.prototype._moveInner = function(side, screen, isSaveHistory) {
        var
            self = this,
            rbCenter = 'rb__center',
            rbSide = 'rb__' + side,
            $oldElement = this._mainDiv.find('.' + rbCenter),
            $newElement = this._mainDiv.find('.' + rbSide);

        this._side = side;

        this._update('center', screen, [], isSaveHistory);

        return new Promise(function (moveResolve, moveReject) {

            if ($newElement.is('.rb__empty')) {
                self._animation.goToWrongSide(side).then(function(result) {
                    if (result) {
                        self._renderHtml();
                    }
                    moveResolve({
                        how: 'wrongSide',
                        isOk: result
                    });
                });
            } else if (side === 'center') {
                self._animation.goToCenter();
                self._renderHtml();
                moveResolve({
                    how: 'center',
                    isOk: true
                });
            } else if (sides.indexOf(side) !== -1) {
                var oppositeSide = Utils.oppositeSide(side),
                    rbOppositeSide = 'rb__' + oppositeSide,
                    oppositeScreen = self._mainDiv.find('.' + rbOppositeSide);
                oppositeScreen.toggleClass(rbOppositeSide, false);
                oppositeScreen.toggleClass(rbSide, true);

                $oldElement.toggleClass(rbCenter, false);
                $oldElement.toggleClass(rbOppositeSide, true);

                $newElement.toggleClass(rbSide, false);
                $newElement.toggleClass(rbCenter, true);

                self._update(side, undefined, [$oldElement, $newElement], isSaveHistory);

                self._animation.goToCorrectSide(side).then(function(result) {
                    if (result) {
                        self._renderHtml();
                    }
                    moveResolve({
                        how: 'correctSide',
                        isOk: result
                    });
                });
            } else {
                moveReject(new Error('Moving module - move - wrong side arg: ' + side));
            }
        });
    };
    Moving.prototype._moveByActionValue = function(value, ltrbValues, mapFn) {
        var side;
        if (mapFn(value, ltrbValues[0])) side = 'left';
        else if (mapFn(value, ltrbValues[1])) side = 'top';
        else if (mapFn(value, ltrbValues[2])) side = 'right';
        else if (mapFn(value, ltrbValues[3])) side = 'bottom';
        return this.move(side);
    };
    Moving.prototype.moveBack = function() {
        var lastStep = this._screenManager.popHistory();
        if (lastStep) {
            this.move(lastStep.side, lastStep.screen, false);
            return true;
        }
        return false;
    };
    Moving.prototype.animateWrongSide = function(side) {
        return this._animation.goToWrongSide(side);
    };

    Moving.prototype.setScreen = function(screen, isSaveHistory) {
        return this.move('center', screen, isSaveHistory);
    };
    Moving.prototype.reload = function(side) {
        var rbSide = this._mainDiv.find(side ? ('.rb__' + side) : '.rb__center');
        if (rbSide.length) {
            rbSide[0].screen = null;
        }

        return this.setScreen(this._screenManager.getCurScreen());
    };

    Moving.prototype._renderHtml = function() {
        var movingSide = this._side,
            self = this;

        var $rbLeft = this._mainDiv.find('.rb__left');
        var $rbTop = this._mainDiv.find('.rb__top');
        var $rbRight = this._mainDiv.find('.rb__right');
        var $rbBottom = this._mainDiv.find('.rb__bottom');
        this._makeLoading($rbLeft);
        this._makeLoading($rbTop);
        this._makeLoading($rbRight);
        this._makeLoading($rbBottom);

        this.beforeRenderDispatcher._runActions(function() {
            var iframeCount = 0, loadedIframeCount = 0;
            sides.forEach(function(side) {
                var rbSide = self._mainDiv.find('.rb__' + side),
                    screenToApply = self._screenManager.getRelativeScreen(side),
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
                        self.afterRenderDispatcher._runActions(Utils.nop, [movingSide, self._screenManager.getCurScreen(), self]);
                    }
                })
            });

            setTimeout(function() {
                if (iframeCount === 0) {
                    self.afterRenderDispatcher._runActions(Utils.nop, [movingSide, self._screenManager.getCurScreen(), self]);
                }
            }, 0);
        }, [movingSide, this._screenManager.getCurScreen(), this]);
    };

    return Moving;
});
