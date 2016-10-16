define(['utils', 'jquery.easing'], function(Utils) {
    "use strict";

    function Animation(mainDiv, time, elementsPool) {
        if (typeof time === 'number') {
            this._time = time > 0 ? time : 1;
        } else {
            if (time === undefined) {
                this._time = 500;
            } else {
                throw new Error('Animation module - init - wrong time arg: ' + time);
            }
        }

        this._elementsPool = elementsPool;

        if (mainDiv instanceof $) {
            this._mainDiv = mainDiv;
        } else {
            throw new Error('Animation module - init - wrong mainDiv arg: ' + mainDiv);
        }
    }

    Animation.prototype._animate = function(elem, side, value, easing, time, beforeFn, afterFn) {

        beforeFn && beforeFn();

        var css = {}, opts;
        css['margin' + Utils.capitalizeFirstLetter(Utils.getStartSide(side))] = value;
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
            width = this._mainDiv.width(),
            height = this._mainDiv.height(),
            elem = this._elementsPool.getElementBySide('center'),
            nextElem = this._elementsPool.getElementBySide(side),
            prevElem = this._elementsPool.getElementBySide(Utils.oppositeSide(side));

        return new Promise(function(res, rej) {
            function wrongAnimate(elem, startLeft, startTop, beforeFn, afterFn) {
                self._animate(elem, side, '+=' + value, 'easeInExpo', self._isAnimate ? self._time/2 : 10, function() {
                    elem.css({'margin-left': startLeft, 'margin-top': startTop});
                    beforeFn && beforeFn();
                }, function() {
                    self._animate(elem, side, '-=' + value, 'easeOutElastic', self._isAnimate ? self._time/2 : 10, undefined, function() {
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

            wrongAnimate(nextElem, width + relValWidth, height + relValHeight, function() {
                nextElem.toggleClass('rb__hiding-screen', true);
            }, function() {
                nextElem.toggleClass('rb__hiding-screen', false);
            }, true);
            wrongAnimate(prevElem, width - relValWidth, height - relValHeight, function() {
                prevElem.toggleClass('rb__hiding-screen', true);
            }, function() {
                nextElem.toggleClass('rb__hiding-screen', false);
            }, true);
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
            width = this._mainDiv.width(),
            height = this._mainDiv.height();

        return new Promise(function(res, rej) {
            function correctAnimate(elem, startLeft, startTop, beforeFn, afterFn) {
                self._animate(elem, side, '-=' + value, 'easeOutExpo', self._time, function() {
                    elem.css({'margin-left': startLeft, 'margin-top': startTop});
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

            correctAnimate(oldElem, width, height, function() {
                oldElem.toggleClass('rb__hiding-screen', true);
            }, function() {
                oldElem.toggleClass('rb__hiding-screen', false);
            }, true);
            correctAnimate(newElem, width + relValWidth, height + relValHeight, undefined, function() {
                self._isAnimate = false;
                self._res(true);
            });
        });
    };

    Animation.prototype.goToCenter = function() {
        var elem = this._elementsPool.getElementBySide('center');
        elem.css({'margin-left': elem.width(), 'margin-top': elem.height()});
    };

    return Animation;
});