define(['utils', 'IPlugin', 'errors', 'jquery.easing'], function(Utils, IPlugin, Errors) {
    "use strict";

    function Animation(mainDiv, elementsPool) {
        this._elementsPool = elementsPool;

        if (mainDiv instanceof $) {
            this._mainDiv = mainDiv;
        } else {
            throw new Errors.ArgumentError('mainDiv', mainDiv);
        }
    }
    Utils.inherite(Animation, IPlugin);
    Animation.prototype.configure = function(config) {
        function fixTime(argName, time) {
            if (typeof time === 'number') {
                return time > 0 ? time : 1;
            } else {
                if (time === undefined) {
                    return 500;
                } else {
                    throw new Errors.ArgumentError(argName, time);
                }
            }
        }

        if (typeof config === 'object') {
            if (config.wrongTime1 !== undefined) {
                this._wrongTime1 = fixTime('wrongTime1', config.wrongTime1);
            }
            if (config.wrongTime2 !== undefined) {
                this._wrongTime2 = fixTime('wrongTime2', config.wrongTime2);
            }
            if (config.correctTime !== undefined) {
                this._correctTime = fixTime('correctTime', config.correctTime);
            }
            if (config.wrongEasing1 !== undefined) {
                this._wrongEasing1 = config.wrongEasing1;
            }
            if (config.wrongEasing2 !== undefined) {
                this._wrongEasing2 = config.wrongEasing2;
            }
            if (config.correctEasing !== undefined) {
                this._correctEasing = config.correctEasing;
            }
            if (config.showAdjacentScreens !== undefined) {
                this._showAdjacentScreens = config.showAdjacentScreens;
            }
        }
    };

    Animation.prototype._animate = function(elem, side, value, easing, time, beforeFn, afterFn) {

        beforeFn && beforeFn();

        var css = {}, opts;
        css[Utils.getStartSide(side)] = value + '%';
        opts = {
            duration: time,
            easing: easing,
            queue: false,
            done: afterFn
        };

        elem.animate(css, opts);
    };

    Animation.prototype._updateState = function(res, elements) {
        if (this._isAnimate) {
            this._isAnimate = false;
            this._new && this._new.stop();
            this._old && this._old.stop(false, true);
            this._cur && this._cur.stop();
            this._prev && this._prev.stop(false, true);
            this._next && this._next.stop(false, true);
            this._res(false);
        }
        this._isAnimate = true;
        this._old = elements.oldElem;
        this._new = elements.newElem;
        this._cur = elements.curElem;
        this._prev = elements.prevElem;
        this._next = elements.nextElem;
        this._res = res;
    };

    Animation.prototype.goToWrongSide = function(side) {
        var self = this,
            width = 100,
            height = 100,
            elem = this._elementsPool.getElementBySide('center'),
            nextElem = this._elementsPool.getElementBySide(side),
            prevElem = this._elementsPool.getElementBySide(Utils.oppositeSide(side));

        return new Promise(function(res, rej) {
            function wrongAnimate(elem, startLeft, startTop, beforeFn, afterFn) {
                self._animate(elem, side, '+=' + value, self._wrongEasing1, self._isAnimate ? self._wrongTime1 : 10, function() {
                    startLeft -= 100;
                    startTop -= 100;
                    elem.css({'left': startLeft + '%', 'top': startTop + '%'});
                    beforeFn && beforeFn();
                }, function() {
                    self._animate(elem, side, '-=' + value, self._wrongEasing2, self._isAnimate ? self._wrongTime2 : 10, undefined, function() {
                        afterFn && afterFn();
                    });
                });
            }

            self._updateState(res, {
                curElem: elem,
                prevElem: prevElem,
                nextElem: nextElem
            });

            var dw = width/10, dh = height/10, value = 0, relValWidth = 0, relValHeight = 0;

            if (side === 'left') {
                relValWidth = -width;
                value = - dw;
            }
            else if (side === 'right') {
                relValWidth = width;
                value = dw;
            }
            else if (side === 'top') {
                relValHeight = -height;
                value = - dh;
            }
            else if (side === 'bottom') {
                relValHeight = height;
                value = dh;
            }

            if (self._showAdjacentScreens) {
                wrongAnimate(nextElem, width + relValWidth, height + relValHeight, function() {
                    nextElem.toggleClass('rb__hiding-screen', true);
                }, function() {
                    nextElem.toggleClass('rb__hiding-screen', false);
                }, true);
                wrongAnimate(prevElem, width - relValWidth, height - relValHeight, function() {
                    prevElem.toggleClass('rb__hiding-screen', true);
                }, function() {
                    prevElem.toggleClass('rb__hiding-screen', false);
                }, true);
            }
            wrongAnimate(elem, width, height, undefined, function() {
                self._isAnimate = false;
                self._res(true);
            });
        });
    };

    Animation.prototype.goToCorrectSide = function(side) {
        var self = this,
            newElem = this._elementsPool.getElementBySide('center'),
            oldElem = this._elementsPool.getElementBySide(Utils.oppositeSide(side)),
            width = 100,
            height = 100;

        return new Promise(function(res, rej) {
            function correctAnimate(elem, startLeft, startTop, beforeFn, afterFn) {
                self._animate(elem, side, '-=' + value, self._correctEasing, self._correctTime, function() {
                    startLeft -= 100;
                    startTop -= 100;
                    elem.css({'left': startLeft + '%', 'top': startTop + '%'});
                    beforeFn && beforeFn();
                }, function() {
                    afterFn && afterFn();
                });
            }

            self._updateState(res, {
                oldElem: oldElem,
                newElem: newElem
            });

            var value = 0, relValWidth = 0, relValHeight = 0;

            if (side === 'left') {
                relValWidth = -width;
                value = - width;
            }
            else if (side === 'right') {
                relValWidth = width;
                value = width;
            }
            else if (side === 'top') {
                relValHeight = -height;
                value = - height;
            }
            else if (side === 'bottom') {
                relValHeight = height;
                value = height;
            }

            if (self._showAdjacentScreens) {
                correctAnimate(oldElem, width, height, function () {
                    oldElem.toggleClass('rb__hiding-screen', true);
                }, function () {
                    oldElem.toggleClass('rb__hiding-screen', false);
                }, true);
            }
            correctAnimate(newElem, width + relValWidth, height + relValHeight, undefined, function() {
                self._isAnimate = false;
                self._res(true);
            });
        });
    };

    Animation.prototype.goToCenter = function() {
        var elem = this._elementsPool.getElementBySide('center');
        elem.css({'left': '0%', 'top': '0%'});
    };

    Animation.prototype.destroy = function() {
        this._new && this._new.stop();
        this._old && this._old.stop();
        this._cur && this._cur.stop();
        this._prev && this._prev.stop();
        this._next && this._next.stop();
        this._res && this._res(false);
    };

    return Animation;
});