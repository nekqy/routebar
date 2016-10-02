define(['./utils'], function(Utils) {
    "use strict";

    var _time, transitionCss1, transitionCss2, transitionCss3, _mainDiv;

    function doTransition(prevElem, elem, transitionCss, beforeFn, transitionFn, afterFn, needAfter) {
        function subscribeTransitionEnd(elem, handler) {
            if (elem && elem.length) {
                elem.on('transitionend', handler);
                elem[0]._transitionHandler = handler;
                elem[0]._needAfter = needAfter;
                elem.css('transition', transitionCss);
            }
        }
        function unsubscribeTransitionEnd(elem) {
            if (elem && elem.length) {
                elem.off('transitionend', elem[0]._transitionHandler);
                if (elem[0]._needAfter) {
                    delete elem[0]._needAfter;
                    elem[0]._transitionHandler();
                }
                delete elem[0]._transitionHandler;
                elem.css('transition', '');
            }
        }

        beforeFn && beforeFn();

        unsubscribeTransitionEnd(prevElem);
        unsubscribeTransitionEnd(elem);

        setTimeout(function() {
            subscribeTransitionEnd(elem, function() {
                unsubscribeTransitionEnd(elem);
                afterFn && afterFn();
            });

            // todo могут быть проблемы, если transitionFn не делает transition, тогда transitionend не сработает
            // или если ничего не меняется в стилях а такое может быть
            // а еще может быть, что transition прерван новой анимацией, и для старой не будет afterFn и отписки
            // поэтому я передаю prevElem, чтобы отписаться. это бы все пофиксить
            transitionFn && transitionFn();
        }, 0);
    }

    function goToWrongSide($oldElement, side) {
        var startSide = Utils.getStartSide(side),
            width = _mainDiv.width(),
            height = _mainDiv.height();

        doTransition($oldElement, $oldElement, transitionCss2, function() {
            $oldElement.css({'margin-left': width, 'margin-top': height});
        }, function() {
            var dw = width/10, dh = height/10;

            // fix lags. transitionend must be dispatched.
            if (Math.abs($oldElement[0].offsetLeft) === dw) {
                dw++;
            } else if (Math.abs($oldElement[0].offsetTop) === dh) {
                dh++;
            }

            if (side === 'left') {
                $oldElement.css({'margin-left': width - dw, 'margin-top': height});
            } else if (side === 'right') {
                $oldElement.css({'margin-left': width + dw, 'margin-top': height});
            } else if (side === 'top') {
                $oldElement.css({'margin-left': width, 'margin-top': height - dh});
            } else if (side === 'bottom') {
                $oldElement.css({'margin-left': width, 'margin-top': height + dh});
            }

            _renderFn && _renderFn();
        }, function() {
            doTransition($oldElement, $oldElement, transitionCss3, undefined, function() {
                $oldElement.css('margin-' + startSide, startSide === 'left' ? width : height);
            }, undefined, true);
        }, true);
    }

    function goToCorrectSide($oldElement, $newElement, side) {
        var startSide = Utils.getStartSide(side),
            width = _mainDiv.width(),
            height = _mainDiv.height();

        doTransition($oldElement, $newElement, transitionCss1, function() {
            if (side === 'left') {
                $newElement.css({'margin-left': 0, 'margin-top': height});
            } else if (side === 'right') {
                $newElement.css({'margin-left': 2*width, 'margin-top': height});
            } else if (side === 'top') {
                $newElement.css({'margin-left': width, 'margin-top': 0});
            } else if (side === 'bottom') {
                $newElement.css({'margin-left': width, 'margin-top': 2*height});
            }

        }, function() {
            $newElement.css('margin-' + startSide, startSide === 'left' ? width : height);
            _renderFn && _renderFn();
        }, undefined);
    }

    function goToCenter($oldElement) {
        $oldElement.css({'margin-left': $oldElement.width(), 'margin-top': $oldElement.height()});
        _renderFn && _renderFn();
    }

    var _renderFn = undefined;
    function init(mainDiv, renderFn, time) {
        if (typeof time === 'number' && time >= 0) {
            _time = time + 0.001; // todo если 0, чтоб все равно работало. надо по другому, чтоб был реально 0.
        } else {
            if (time === undefined) {
                _time = 0.5;
            } else {
                throw new Error('Animation module - init - wrong time arg: ' + time);
            }
        }

        transitionCss1 = 'margin-left ' + _time + 's ease, ' +
            'margin-top ' + _time + 's ease, ' +
            'margin-right ' + _time + 's ease, ' +
            'margin-bottom ' + _time + 's ease';
        transitionCss2 = 'margin-left ' + _time/2 + 's ease-in, ' +
            'margin-top ' + _time/2 + 's ease-in, ' +
            'margin-right ' + _time/2 + 's ease-in, ' +
            'margin-bottom ' + _time/2 + 's ease-in';
        transitionCss3 = 'margin-left ' + _time/2 + 's ease, ' +
            'margin-top ' + _time/2 + 's ease, ' +
            'margin-right ' + _time/2 + 's ease, ' +
            'margin-bottom ' + _time/2 + 's ease';

        if (mainDiv instanceof $) {
            _mainDiv = mainDiv;
        } else {
            throw new Error('Animation module - init - wrong mainDiv arg: ' + mainDiv);
        }

        if (typeof renderFn === 'function') {
            _renderFn = Utils.debounce(renderFn, time*1000);
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