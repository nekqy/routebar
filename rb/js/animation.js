define(['utils', 'jquery.easing'], function(Utils) {
    "use strict";

    var _time, _mainDiv, curElem;

    function animate(elem, side, value, easing, time, beforeFn, afterFn, needAfter, res) {

        if (curElem) {
            curElem.stop();
        }
        curElem = elem;

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
    }

    function goToWrongSide($oldElement, side) {
        var startSide = Utils.getStartSide(side),
            width = _mainDiv.width(),
            height = _mainDiv.height();

        return new Promise(function(res, rej) {
            var dw = width/10, dh = height/10,
                value;
            if (side === 'left') value = width - dw;
            else if (side === 'right') value = width + dw;
            else if (side === 'top') value = height - dh;
            else if (side === 'bottom') value = height + dh;

            animate($oldElement, side, value, 'easeInExpo', _time/2, function() {
                $oldElement.css({'margin-left': width, 'margin-top': height});
            }, function() {
                animate($oldElement, side, startSide === 'left' ? width : height, 'easeOutElastic', _time/2, function() {
                }, function() {
                    res(true);
                    _renderFn && _renderFn();
                }, false, res)
            }, false, res)
        });
    }

    function goToCorrectSide($newElement, side) {
        var width = _mainDiv.width(),
            height = _mainDiv.height();

        return new Promise(function(res, rej) {

            var curScreen;
            animate($newElement, side, side === 'left' || side === 'right' ? width : height, 'easeOutExpo', _time, function() {
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
                _renderFn && _renderFn();
            }, false, res);
        });
    }

    function goToCenter($oldElement) {
        $oldElement.css({'margin-left': $oldElement.width(), 'margin-top': $oldElement.height()});
        _renderFn && _renderFn();
    }

    var _renderFn = undefined;
    function init(mainDiv, renderFn, time) {
        if (typeof time === 'number') {
            _time = time > 0 ? time : 1;
        } else {
            if (time === undefined) {
                _time = 500;
            } else {
                throw new Error('Animation module - init - wrong time arg: ' + time);
            }
        }

        if (mainDiv instanceof $) {
            _mainDiv = mainDiv;
        } else {
            throw new Error('Animation module - init - wrong mainDiv arg: ' + mainDiv);
        }

        if (typeof renderFn === 'function') {
            _renderFn = renderFn;
        } else {
            throw new Error('Animation module - init - wrong renderFn arg: ' + renderFn);
        }
    }

    return {
        init: init,
        goToWrongSide: goToWrongSide,
        goToCorrectSide: goToCorrectSide,
        goToCenter: goToCenter
    };
});