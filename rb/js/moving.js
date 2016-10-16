define(['animation', 'screenManager', 'baseDispatcher', 'smartResizer', 'controlManager', 'arrowsControl', 'keydownControl', 'elementsPool', 'utils'], function(
    Animation, ScreenManager, BaseDispatcher, SmartResizer, ControlManager, ArrowsControl, KeydownControl, ElementsPool, Utils) {
    "use strict";

    var sides = ['center', 'left', 'top', 'right', 'bottom'];

    function Moving(mainDiv, speed, historyLength, loadingHtml) {
        this._loadingHtml = loadingHtml || '<div class="rb__loading_wrapper"><div class="cssload-loader"></div></div>';
        var loadingDiv = '<div class="rb__loading">' + this._loadingHtml + '</div>';

        this.beforeMoveDispatcher = new BaseDispatcher(mainDiv, loadingDiv);
        this.beforeRenderDispatcher = new BaseDispatcher(mainDiv, loadingDiv);
        this.afterRenderDispatcher = new BaseDispatcher(mainDiv, loadingDiv);

        this._mainDiv = undefined;

        this._screenManager = new ScreenManager(historyLength);
        this._elementsPool = new ElementsPool(mainDiv, this._screenManager, this._loadingHtml);
        this._animation = new Animation(mainDiv, speed, this._elementsPool);

        if (mainDiv instanceof $) {
            this._mainDiv = mainDiv;
        } else {
            throw new Error('Moving module - init - wrong mainDiv arg: ' + mainDiv);
        }

        this._controlManager = new ControlManager();
        this._controlManager
            .add('arrows', new ArrowsControl(mainDiv, this._moveByActionValue.bind(this)), true)
            .add('keyboard', new KeydownControl(mainDiv, this._moveByActionValue.bind(this)), true);

        SmartResizer(mainDiv, mainDiv.width(), mainDiv.height());

        if (mainDiv.length) {
            mainDiv[0].moving = this;
        }
    }

    Moving.prototype.getControlManager = function() {
        return this._controlManager;
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
        var self = this;

        this._screenManager.updateScreens('center', screen, [], isSaveHistory);

        return new Promise(function (moveResolve, moveReject) {

            if (!self._screenManager.getRelativeScreen(side)) {
                self._animation.goToWrongSide(side).then(function(result) {
                    if (result) {
                        self._renderHtml(side);
                    }
                    moveResolve({
                        how: 'wrongSide',
                        isOk: result
                    });
                });
            } else if (side === 'center') {
                self._elementsPool.prepareSide(side);
                self._animation.goToCenter();
                self._renderHtml(side);
                moveResolve({
                    how: 'center',
                    isOk: true
                });
            } else if (sides.indexOf(side) !== -1) {
                self._screenManager.updateScreens(side, undefined, isSaveHistory);
                self._elementsPool.prepareSide();

                self._animation.goToCorrectSide(side).then(function(result) {
                    if (result) {
                        self._renderHtml(side);
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
        side = side || 'center';
        var rbSide = this._elementsPool.getElementBySide(side);
        var screen = this._screenManager.getRelativeScreen(side);
        rbSide.html(screen.html);
    };

    Moving.prototype._renderHtml = function(side) {
        var self = this,
            args = [side, self._screenManager.getCurScreen(), self];

        function afterRender() {
            self.afterRenderDispatcher._runActions(Utils.nop, args);
        }

        this.beforeRenderDispatcher._runActions(function() {
            var iframeCount, loadedIframeCount = 0, iframes;

            iframes = self._mainDiv.find('iframe');
            self._elementsPool.loadElements();
            iframes = self._mainDiv.find('iframe').not(iframes);

            iframeCount = iframes.length;
            iframes.one('load', function() {
                loadedIframeCount++;
                if (iframeCount === loadedIframeCount) {
                    afterRender();
                }
            });

            setTimeout(function() {
                if (iframeCount === 0) {
                    afterRender();
                }
            }, 0);
        }, args);
    };

    return Moving;
});
