(function($) {
    function Screen(html, children) {
        mainScreen = this;

        this.html = html;
        this.parents = [];

        this.setChildren(children);
    }
    Screen.prototype.setChildren = function(children) {
        if (children) {
            this.children = children;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                child.parents.push(this);

                if (children.length === 1) {
                    child.next = child;
                    child.prev = child;
                } else if (i === 0) {
                    child.next = children[1];
                    child.prev = children[children.length - 1];
                } else if (i === (children.length - 1)) {
                    child.next = children[0];
                    child.prev = children[children.length - 2];
                } else {
                    child.next = children[i+1];
                    child.prev = children[i-1];
                }
            }
        } else {
            this.children = [];
        }
    };
    Screen.prototype.getChildren = function() {
        return this.children;
    };

    function move(side, screen) {
        function handler(e) {
            $(this).off('transitionend', handler);
            renderHtml(curScreen);
        }
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
            if (!except || except && !$div.is(except) && !includes($div, except)) {
                $div.html('Загрузка...');
                $div.toggleClass('rb__loading', true);
            }
        }

        var
            rbSide = 'rb__' + side,
            $newElement = $('.' + rbSide);

        if ($newElement.is('.rb__empty')) {
            return;
        }

        var
            oppositeSide = opposite(side),
            rbCenter = 'rb__center',
            rbOppositeSide = 'rb__' + oppositeSide,
            $oldElement = $('.' + rbCenter),
            oppositeScreen = $('.' + rbOppositeSide),
            startSide,
            $rbLeft = $('.rb__left'),
            $rbTop = $('.rb__top'),
            $rbRight = $('.rb__right'),
            $rbBottom = $('.rb__bottom');

        if (side === 'center') {
            $oldElement.toggleClass('rb__animate', false);
            $oldElement.css({'margin-left': $oldElement.width(), 'margin-top': $oldElement.height()});
            setTimeout(function() {
                $oldElement.toggleClass('rb__animate', true);
            }, 0);

            makeLoading($oldElement);
            makeLoading($rbLeft);
            makeLoading($rbTop);
            makeLoading($rbRight);
            makeLoading($rbBottom);

            updateScreens(undefined, screen);
            renderHtml(screen);
        } else {
            startSide = getStartSide(side);

            var width = $oldElement.width(),
                height = $oldElement.height();

            oppositeScreen.toggleClass(rbOppositeSide, false);
            oppositeScreen.toggleClass(rbSide, true);

            $oldElement.toggleClass(rbCenter, false);
            $oldElement.toggleClass(rbOppositeSide, true);

            makeLoading($oldElement, [$oldElement, $newElement]);
            makeLoading($rbLeft, [$oldElement, $newElement]);
            makeLoading($rbTop, [$oldElement, $newElement]);
            makeLoading($rbRight, [$oldElement, $newElement]);
            makeLoading($rbBottom, [$oldElement, $newElement]);

            if (side === 'left') {
                $newElement.css({'margin-left': 0, 'margin-top': height});
            } else if (side === 'right') {
                $newElement.css({'margin-left': 2*width, 'margin-top': height});
            } else if (side === 'top') {
                $newElement.css({'margin-left': width, 'margin-top': 0});
            } else if (side === 'bottom') {
                $newElement.css({'margin-left': width, 'margin-top': 2*height});
            }

            $newElement.toggleClass(rbSide, false);
            $newElement.toggleClass(rbCenter, true);

            $newElement.off('transitionend', handler);
            setTimeout(function() {
                $newElement.on('transitionend', handler);
                $newElement.css('margin-' + startSide, startSide === 'left' ? width : height);
            }, 0);
            updateScreens(side);

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

        if (prevScreen !== curScreen) {
            var
                rbLeft = $('.rb__left'),
                rbTop = $('.rb__top'),
                rbRight = $('.rb__right'),
                rbBottom = $('.rb__bottom');

            rbRight.toggleClass('rb__empty', !curScreen.children.length);
            rbLeft.toggleClass('rb__empty', !curScreen.parents.length);
            rbBottom.toggleClass('rb__empty', !curScreen.next);
            rbTop.toggleClass('rb__empty', !curScreen.prev);
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
    function renderHtml(screen) {
        function renderSide(side, checkFn, htmlFn) {
            var rbSide = $('.rb__' + side);
            if (rbSide.is('.rb__loading')) {
                rbSide.toggleClass('rb__loading', false);
                if (checkFn()) {
                    rbSide.html(htmlFn());
                }
            }
        }
        renderSide('center', function() {
            return screen;
        }, function() {
            return curScreen.html;
        });
        renderSide('left', function() {
            return curScreen.parents.length;
        }, function() {
            return curScreen._leftScreen ? curScreen._leftScreen.html : curScreen.parents[0].html;
        });
        renderSide('top', function() {
            return curScreen.prev;
        }, function() {
            return curScreen._topScreen ? curScreen._topScreen.html : curScreen.prev.html;
        });
        renderSide('right', function() {
            return curScreen.children.length;
        }, function() {
            return curScreen._rightScreen ? curScreen._rightScreen.html : curScreen.children[0].html;
        });
        renderSide('bottom', function() {
            return curScreen.next;
        }, function() {
            return curScreen._bottomScreen ? curScreen._bottomScreen.html : curScreen.next.html;
        });
    }

    $(function() {
        var $rb = $('#rb'),
            $body = $('body');
        if (!$rb.length) {
            $body.append('<div id="rb"></div>');
        }

        var html = '<div class="rb__animate rb__center"></div>';
        html += '<div class="rb__animate rb__left"></div>';
        html += '<div class="rb__animate rb__top"></div>';
        html += '<div class="rb__animate rb__right"></div>';
        html += '<div class="rb__animate rb__bottom"></div>';
        html += '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_left"><div class="rb__arrow rb__arrow_left"></div></div>';
        html += '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_top"><div class="rb__arrow rb__arrow_top"></div></div>';
        html += '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_right"><div class="rb__arrow rb__arrow_right"></div></div>';
        html += '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_bottom"><div class="rb__arrow rb__arrow_bottom"></div></div>';
        $rb.html(html);

        $body.on('keydown', function(e) {
            if (e.which === 37) { //left
                move('left');
            }
            if (e.which === 38) { // up
                move('top');
            }
            if (e.which === 39) { // right
                move('right');
            }
            if (e.which === 40) { // down
                move('bottom');
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
                    move('left');
                }
                if (container.is('.rb__arrow-container_top')) {
                    move('top');
                }
                if (container.is('.rb__arrow-container_right')) {
                    move('right');
                }
                if (container.is('.rb__arrow-container_bottom')) {
                    move('bottom');
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
        start: function(screen) {
            mainScreen = screen;
        }
    }
})(jQuery);