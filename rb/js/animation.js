define(['utils', 'jquery.easing'], function(Utils) {
    "use strict";

    function Animation(mainDiv, time) {
        this._time = undefined;
        this._mainDiv = undefined;
        this._curElem = undefined;

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

    Animation.prototype._animate = function(elem, side, value, easing, time, beforeFn, afterFn, needAfter, res) {

        if (this._curElem) {
            this._curElem.stop();
        }
        this._curElem = elem;

        beforeFn && beforeFn();

        var css = {}, opts;
        css['margin' + Utils.capitalizeFirstLetter(Utils.getStartSide(side))] = value;
        opts = {
            duration: time,
            easing: easing,
            queue: false,
            fail: function() {
                res(false);
            }
        };

        if (needAfter) opts.always = afterFn;
        else opts.done = afterFn;

        elem.animate(css, opts);
    };

    Animation.prototype.goToWrongSide = function($oldElement, side) {
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

            self._animate($oldElement, side, value, 'easeInExpo', self._time/2, function() {
                $oldElement.css({'margin-left': width, 'margin-top': height});
            }, function() {
                self._animate($oldElement, side, startSide === 'left' ? width : height, 'easeOutElastic', self._time/2, function() {
                }, function() {
                    res(true);
                }, false, res)
            }, false, res)
        });
    };

    Animation.prototype.goToCorrectSide = function($newElement, side) {
        var self = this,
            width = this._mainDiv.width(),
            height = this._mainDiv.height();

        return new Promise(function(res, rej) {

            var curScreen;
            self._animate($newElement, side, side === 'left' || side === 'right' ? width : height, 'easeOutExpo', self._time, function() {
                if (side === 'left') {
                    $newElement.css({'margin-left': 0, 'margin-top': height});
                } else if (side === 'right') {
                    $newElement.css({'margin-left': 2*width, 'margin-top': height});
                } else if (side === 'top') {
                    $newElement.css({'margin-left': width, 'margin-top': 0});
                } else if (side === 'bottom') {
                    $newElement.css({'margin-left': width, 'margin-top': 2*height});
                }

                curScreen = $newElement[0].screen;
            }, function() {
                res(true);
            }, false, res);
        });
    }

    Animation.prototype.goToCenter = function($oldElement) {
        $oldElement.css({'margin-left': $oldElement.width(), 'margin-top': $oldElement.height()});
    };

    return Animation;
});