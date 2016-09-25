(function($) {
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    function debounce(func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    }
    // smartresize
    $.fn['smartresize'] = function(fn){
        return fn ? this.bind('resize', debounce(fn)) : this.trigger('smartresize');
    };

    var loadingHtml = '<div class="rb__loading_wrapper">' +
        '<div class="cssload-loader"></div>' +
        '</div>',
        loadingDiv = $('<div class="rb__loading">' + loadingHtml + '</div>');

    var mainScreenSetted = false;

    function Screen(html, children) {
        if (!mainScreenSetted) {
            mainScreen = this;
        }

        this.html = html;
        this.parents = [];
        this.next = this;
        this.prev = this;

        this.setChildren(children);
    }
    Screen.prototype.setChildren = function(children) {
        if (children && Array.isArray(children)) {
            this.children = [];
            for (var i = 0; i < children.length; i++) {
                this.addChild(children[i]);
            }
        } else {
            this.children = [];
        }
        return this;
    };
    Screen.prototype.getChildren = function() {
        return this.children;
    };
    Screen.prototype.addChild = function(child) {
        var children = this.children;
        child.parents.push(this);
        child.next = children.length ? children[0] : child;
        child.prev = children.length ? children[children.length-1] : child;
        child.next.prev = child;
        child.prev.next = child;

        children.push(child);
        return this;
    };

    function move(side, screen) {
        function opposite(side) {
            if (side === 'left') return 'right';
            if (side === 'right') return 'left';
            if (side === 'top') return 'bottom';
            if (side === 'bottom') return 'top';
            if (side === 'center') return 'center';
            throw new Error('move function', 'wrong side');
        }
        function getStartSide(side) {
            if (side === 'left') return 'left';
            if (side === 'right') return 'left';
            if (side === 'top') return 'top';
            if (side === 'bottom') return 'top';
            if (side === 'center') return 'center';
            throw new Error('move function', 'wrong side');
        }
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
            if ($div.is('.rb__empty')) {
                return;
            }
            if (!except || except && !$div.is(except) && !includes($div, except)) {
                if ($div.is('.rb__left') && ($div[0].screen !== (curScreen._leftScreen ? curScreen._leftScreen : curScreen.parents[0]))) {
                    $div.toggleClass('rb__loading', true);
                    $div.html(loadingHtml);
                }
                if ($div.is('.rb__top') && ($div[0].screen !== (curScreen._topScreen ? curScreen._topScreen : curScreen.prev))) {
                    $div.toggleClass('rb__loading', true);
                    $div.html(loadingHtml);
                }
                if ($div.is('.rb__right') && ($div[0].screen !== (curScreen._rightScreen ? curScreen._rightScreen : curScreen.children[0]))) {
                    $div.toggleClass('rb__loading', true);
                    $div.html(loadingHtml);
                }
                if ($div.is('.rb__bottom') && ($div[0].screen !== (curScreen._bottomScreen ? curScreen._bottomScreen : curScreen.next))) {
                    $div.toggleClass('rb__loading', true);
                    $div.html(loadingHtml);
                }
                if ($div.is('.rb__center') && $div[0].screen !== curScreen) {
                    $div.toggleClass('rb__loading', true);
                    $div.html(loadingHtml);
                }
            }
        }

        function doTransition(prevElem, elem, transitionClass, beforeFn, transitionFn, afterFn, needAfter) {
            function subscribeTransitionEnd(elem, handler) {
                if (elem && elem.length) {
                    elem.on('transitionend', handler);
                    elem[0]._transitionHandler = handler;
                    elem[0]._needAfter = needAfter;
                    elem.toggleClass(transitionClass, true);
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
                    elem.toggleClass(transitionClass, false);
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
                transitionFn && transitionFn();
            }, 0);
        }

        var
            rbCenter = 'rb__center',
            rbSide = 'rb__' + side,
            $oldElement = $('.' + rbCenter),
            $newElement = $('.' + rbSide),
            $rb = $('#rb'),
            startSide = getStartSide(side),
            width = $rb.width(),
            height = $rb.height();

        updateScreens();
        makeLoading($newElement);

        if ($newElement.is('.rb__empty')) {
            doTransition($oldElement, $oldElement, 'rb__animate2', function() {
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

                renderHtml(curScreen);
            }, function() {
                doTransition($oldElement, $oldElement, 'rb__animate3', undefined, function() {
                    $oldElement.css('margin-' + startSide, startSide === 'left' ? width : height);
                }, undefined, true);
            }, true);

            return;
        }

        var
            oppositeSide = opposite(side),
            rbOppositeSide = 'rb__' + oppositeSide,
            oppositeScreen = $('.' + rbOppositeSide),
            $rbLeft, $rbTop, $rbRight, $rbBottom;

        if (side === 'center') {
            $oldElement.css({'margin-left': $oldElement.width(), 'margin-top': $oldElement.height()});

            updateScreens(undefined, screen);
            $rbLeft = $('.rb__left');
            $rbTop = $('.rb__top');
            $rbRight = $('.rb__right');
            $rbBottom = $('.rb__bottom');

            makeLoading($oldElement);
            makeLoading($rbLeft);
            makeLoading($rbTop);
            makeLoading($rbRight);
            makeLoading($rbBottom);

            renderHtml(screen);
        } else {
            oppositeScreen.toggleClass(rbOppositeSide, false);
            oppositeScreen.toggleClass(rbSide, true);

            $oldElement.toggleClass(rbCenter, false);
            $oldElement.toggleClass(rbOppositeSide, true);

            $newElement.toggleClass(rbSide, false);
            $newElement.toggleClass(rbCenter, true);

            updateScreens(side);
            $rbLeft = $('.rb__left');
            $rbTop = $('.rb__top');
            $rbRight = $('.rb__right');
            $rbBottom = $('.rb__bottom');
            makeLoading($oldElement, [$oldElement, $newElement]);
            makeLoading($rbLeft, [$oldElement, $newElement]);
            makeLoading($rbTop, [$oldElement, $newElement]);
            makeLoading($rbRight, [$oldElement, $newElement]);
            makeLoading($rbBottom, [$oldElement, $newElement]);

            doTransition($oldElement, $newElement, 'rb__animate', function() {
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
                renderHtml(curScreen);
            }, undefined);
        }
    }

    var curScreen;

    function updateScreens(nextScreen, screen) {
        var prevScreen = curScreen;
        if (screen) {
            curScreen = screen;
        } else if (nextScreen === 'right' && curScreen.children.length) {
            curScreen = curScreen._rightScreen ? curScreen._rightScreen : curScreen.children[0];
            curScreen._leftScreen = prevScreen;
        } else if (nextScreen === 'left' && curScreen.parents.length) {
            curScreen = curScreen._leftScreen ? curScreen._leftScreen : curScreen.parents[0];
            curScreen._rightScreen = prevScreen;
        } else if (nextScreen === 'bottom' && curScreen.next) {
            curScreen = curScreen._bottomScreen ? curScreen._bottomScreen : curScreen.next;
            curScreen._topScreen = prevScreen;
        } else if (nextScreen === 'top' && curScreen.prev) {
            curScreen = curScreen._topScreen ? curScreen._topScreen : curScreen.prev;
            curScreen._bottomScreen = prevScreen;
        }

        if (curScreen) {
            var
                rbLeft = $('.rb__left'),
                rbTop = $('.rb__top'),
                rbRight = $('.rb__right'),
                rbBottom = $('.rb__bottom');

            rbRight.toggleClass('rb__empty', !curScreen.children.length);
            rbLeft.toggleClass('rb__empty', !curScreen.parents.length);
            rbBottom.toggleClass('rb__empty', !curScreen.next);
            rbTop.toggleClass('rb__empty', !curScreen.prev);
            $('.rb__arrow-container_right').toggleClass('rb__arrow-none', !curScreen.children.length);
            $('.rb__arrow-container_left').toggleClass('rb__arrow-none', !curScreen.parents.length);
            $('.rb__arrow-container_bottom').toggleClass('rb__arrow-none', !curScreen.next);
            $('.rb__arrow-container_top').toggleClass('rb__arrow-none', !curScreen.prev);

            if (!curScreen.children.length) {
                curScreen._rightScreen = null;
            }
            if (!curScreen.parents.length) {
                curScreen._leftScreen = null;
            }
            if (!curScreen.next) {
                curScreen._bottomScreen = null;
            }
            if (!curScreen.prev) {
                curScreen._topScreen = null;
            }
        }

    }
    var renderHtml = debounce(function (screen) {
        function renderSide(side, checkFn, getScreen) {
            var rbSide = $('.rb__' + side),
                screenToApply;
            if (rbSide.is('.rb__loading')) {
                rbSide.toggleClass('rb__loading', false);
                if (checkFn()) {
                    screenToApply = getScreen();
                    rbSide.html(screenToApply.html);
                    rbSide[0].screen = screenToApply;
                }
            }
        }
        renderSide('center', function() {
            return screen;
        }, function() {
            return curScreen;
        });
        renderSide('left', function() {
            return curScreen.parents.length;
        }, function() {
            return curScreen._leftScreen ? curScreen._leftScreen : curScreen.parents[0];
        });
        renderSide('top', function() {
            return curScreen.prev;
        }, function() {
            return curScreen._topScreen ? curScreen._topScreen : curScreen.prev;
        });
        renderSide('right', function() {
            return curScreen.children.length;
        }, function() {
            return curScreen._rightScreen ? curScreen._rightScreen : curScreen.children[0];
        });
        renderSide('bottom', function() {
            return curScreen.next;
        }, function() {
            return curScreen._bottomScreen ? curScreen._bottomScreen : curScreen.next;
        });
    }, 500);

    function BaseDispatcher() {
        this._actions = {};
        this._index = 0;
    }
    BaseDispatcher.prototype.add = function(action, once) {
        if (typeof action === 'function') {
            this._actions[this._index++] = {
                action: action,
                once: once
            };
            return this._index-1;
        }
        return null;
    };
    BaseDispatcher.prototype.remove = function(index) {
        if (this._actions.hasOwnProperty(index)) {
            delete this._actions[index];
        }
    };
    BaseDispatcher.prototype._runActions = function(fn, actionArgs) {
        var actions = [];
        if (Object.keys(this._actions).length) {
            $('#rb').append(loadingDiv);

            Object.keys(this._actions).map(function(index) {
                var value = this._actions[index],
                    result = value.action.apply(undefined, actionArgs);

                if (result instanceof Promise) {
                    if (value.once) {
                        delete this._actions[index];
                    }
                    actions.push(result);
                }
            }.bind(this));

            Promise.all(actions).then(function() {
                loadingDiv.remove();
                fn();
            }, function(error) {
                loadingDiv.remove();
                console.error(error);
                fn();
            });
        } else {
            fn();
        }
    };

    var beforeMoveDispatcher = new BaseDispatcher();

    $(function() {
        function smartResizeHandler() {
            var
                $window = $(window),
                bodyWidth = $window.width(),
                bodyHeight = $window.height();

            var
                rbCenter = $('.rb__center'),
                rbLeft = $('.rb__left'),
                rbTop = $('.rb__top'),
                rbRight = $('.rb__right'),
                rbBottom = $('.rb__bottom'),
                newWidth, newHeight, scale;

            scale = Math.min(1, bodyWidth/width, bodyHeight/height);
            newWidth = width * scale;
            newHeight = height * scale;

            $rb.css({'width': newWidth, 'height': newHeight});
            rbCenter.css({'margin-left': newWidth, 'margin-top': newHeight});
            rbLeft.css({'margin-left': newWidth, 'margin-top': newHeight});
            rbTop.css({'margin-left': newWidth, 'margin-top': newHeight});
            rbRight.css({'margin-left': newWidth, 'margin-top': newHeight});
            rbBottom.css({'margin-left': newWidth, 'margin-top': newHeight});
        }

        var
            $rbWrapper = $('#rb-wrapper'),
            $body = $('body');
        if (!$rbWrapper.length) {
            $body.append('<div id="rb-wrapper"></div>');
            $rbWrapper = $('#rb-wrapper');
        }
        $rbWrapper.html('<div id="rb"></div>');
        var $rb = $rbWrapper.find('#rb');

        var width = $rb.width(),
            height = $rb.height();

        var html = '<div style="margin-left: ' + width + 'px; margin-top: ' + height + 'px;" class="rb__center"></div>';
        html += '<div style="margin-left: ' + width + 'px; margin-top: ' + height + 'px;" class="rb__left"></div>';
        html += '<div style="margin-left: ' + width + 'px; margin-top: ' + height + 'px;" class="rb__top"></div>';
        html += '<div style="margin-left: ' + width + 'px; margin-top: ' + height + 'px;" class="rb__right"></div>';
        html += '<div style="margin-left: ' + width + 'px; margin-top: ' + height + 'px;" class="rb__bottom"></div>';
        html += '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_left"><div class="rb__arrow rb__arrow_left"></div></div>';
        html += '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_top"><div class="rb__arrow rb__arrow_top"></div></div>';
        html += '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_right"><div class="rb__arrow rb__arrow_right"></div></div>';
        html += '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_bottom"><div class="rb__arrow rb__arrow_bottom"></div></div>';
        $rb.html(html);

        smartResizeHandler();
        $(window).smartresize(smartResizeHandler);

        $body.on('keydown', function(e) {
            if (e.which === 37) { //left
                beforeMoveDispatcher._runActions(move.bind(undefined, 'left'), ['left', curScreen]);
            }
            if (e.which === 38) { // up
                beforeMoveDispatcher._runActions(move.bind(undefined, 'top'), ['top', curScreen]);
            }
            if (e.which === 39) { // right
                beforeMoveDispatcher._runActions(move.bind(undefined, 'right'), ['right', curScreen]);
            }
            if (e.which === 40) { // down
                beforeMoveDispatcher._runActions(move.bind(undefined, 'bottom'), ['bottom', curScreen]);
            }
        });

        function clearArrowTimeout(container) {
            container.toggleClass('rb__arrow-hide', false);
            container.toggleClass('rb__arrow-cursor', true);
            if (container.length) {
                clearTimeout(container[0].hideArrowId);
                container[0].hideArrowId = null;
            }
        }
        function hideArrowTimeout(container) {
            function hideArrow() {
                container.toggleClass('rb__arrow-hide', true);
                container.toggleClass('rb__arrow-cursor', false);
            }

            clearArrowTimeout(container);
            if (container.length) {
                container[0].hideArrowId = setTimeout(hideArrow, 3000);
            }
        }
        var $rbArrowContainer = $('.rb__arrow-container');
        $rbArrowContainer.on('click', function(e) {
            var container = $(this);
            if (!container.is('.rb__arrow-hide')) {

                hideArrowTimeout(container);
                if (container.is('.rb__arrow-container_left')) {
                    beforeMoveDispatcher._runActions(move.bind(undefined, 'left'), ['left', curScreen]);
                }
                if (container.is('.rb__arrow-container_top')) {
                    beforeMoveDispatcher._runActions(move.bind(undefined, 'top'), ['top', curScreen]);
                }
                if (container.is('.rb__arrow-container_right')) {
                    beforeMoveDispatcher._runActions(move.bind(undefined, 'right'), ['right', curScreen]);
                }
                if (container.is('.rb__arrow-container_bottom')) {
                    beforeMoveDispatcher._runActions(move.bind(undefined, 'bottom'), ['bottom', curScreen]);
                }
            } else {
                container.css('display', 'none');
                try {
                    var behindElem = document.elementFromPoint(e.clientX, e.clientY);
                    if (behindElem.tagName.toLowerCase() === 'iframe') {
                        var doc = behindElem.contentDocument || behindElem.contentWindow.document;
                        behindElem = doc.elementFromPoint(e.clientX, e.clientY);
                    }
                    $(behindElem).trigger(e);
                }
                finally {
                    container.css('display', '');
                }
            }
        });
        $rbArrowContainer.on('mouseenter', function() {
            hideArrowTimeout($(this));
        });
        $rbArrowContainer.on('mouseleave', function() {
            clearArrowTimeout($(this));
        });
        move('center', mainScreen);
    });

    var mainScreen;

    window.rb = {
        Screen: Screen,
        beforeMoveDispatcher: beforeMoveDispatcher,
        start: function(screen) {
            mainScreen = screen;
            mainScreenSetted = true;
        },
        setScreen: function(screen) {
            move('center', screen);
        }
    }
})(jQuery);