define(['utils', 'jquery.easing'], function(Utils) {
    "use strict";

    function Animation(mainDiv, time) {
        this._time = undefined;
        this._mainDiv = undefined;
        this._isAnimate = undefined;
        this._old = undefined;
        this._new = undefined;
        this._res = undefined;


        if (typeof time === 'number') {
            this._time = time > 0 ? time : 1;
        } else {
            if (time === undefined) {
                this._time = 500;
            } else {
                throw new Error('Animation module - init - wrong time arg: ' + time);
            }
        }

        if (mainDiv instanceof $) {
            this._mainDiv = mainDiv;
        } else {
            throw new Error('Animation module - init - wrong mainDiv arg: ' + mainDiv);
        }
    }

    Animation.prototype._animate = function(elem, side, value, easing, time, beforeFn, afterFn, needAfter) {

        beforeFn && beforeFn();

        var css = {}, opts;
        css['margin' + Utils.capitalizeFirstLetter(Utils.getStartSide(side))] = value;
        opts = {
            duration: time,
            easing: easing,
            queue: false
        };

        if (needAfter) opts.always = afterFn;
        else opts.done = afterFn;

        elem.animate(css, opts);
    };

    Animation.prototype.goToWrongSide = function(elem, side) {
        var self = this,
            startSide = Utils.getStartSide(side),
            width = this._mainDiv.width(),
            height = this._mainDiv.height();

        return new Promise(function(res, rej) {
            var dw = width/10, dh = height/10,
                value;
            if (side === 'left') value = width - dw;
            else if (side === 'right') value = width + dw;
            else if (side === 'top') value = height - dh;
            else if (side === 'bottom') value = height + dh;

            if (self._isAnimate) {
                self._isAnimate = false;
                self._old.stop(false, true);
                self._new.stop(false, true);
                self._res(false);
            }
            self._isAnimate = true;
            self._old = elem;
            self._res = res;


            self._animate(elem, side, value, 'easeInExpo', self._time/2, function() {
                elem.css({'margin-left': width, 'margin-top': height});
            }, function() {
                self._animate(elem, side, startSide === 'left' ? width : height, 'easeOutElastic', self._time/2, function() {
                }, function() {
                    if (self._isAnimate) {
                        res(true);
                    }
                })
            })
        });
    };

    Animation.prototype.goToCorrectSide = function(oldElem, newElem, side) {
        var self = this,
            width = this._mainDiv.width(),
            height = this._mainDiv.height();

        return new Promise(function(res, rej) {

            var value,
                curScreen;
            if (side === 'left') value = 2*width;
            else if (side === 'top') value = 2*height;
            else if (side === 'right') value = 0;
            else if (side === 'bottom') value = 0;

            if (self._isAnimate) {
                self._isAnimate = false;
                self._old.stop(false, true);
                self._new.stop(false, true);
                self._res(false);
            }
            self._isAnimate = true;
            self._old = oldElem;
            self._new = newElem;
            self._res = res;

            self._animate(oldElem, side, value, 'easeOutExpo', self._time, function() {
                oldElem.toggleClass('rb__hiding-screen', true);
            }, function() {
                oldElem.toggleClass('rb__hiding-screen', false);
            }, true);
            self._animate(newElem, side, side === 'left' || side === 'right' ? width : height, 'easeOutExpo', self._time, function() {
                if (side === 'left') {
                    newElem.css({'margin-left': 0, 'margin-top': height});
                } else if (side === 'right') {
                    newElem.css({'margin-left': 2*width, 'margin-top': height});
                } else if (side === 'top') {
                    newElem.css({'margin-left': width, 'margin-top': 0});
                } else if (side === 'bottom') {
                    newElem.css({'margin-left': width, 'margin-top': 2*height});
                }

                curScreen = newElem[0].screen;
            }, function() {
                if (self._isAnimate) {
                    res(true);
                    self._isAnimate = false;
                }
            });
        });
    };

    Animation.prototype.goToCenter = function(elem) {
        elem.css({'margin-left': elem.width(), 'margin-top': elem.height()});
    };

    return Animation;
});