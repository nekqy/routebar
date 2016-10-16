define([], function() {
    "use strict";

    function ArrowsControl(mainDiv, actionFn) {
        if (!(mainDiv instanceof $)) {
            throw new Error('KeydownControl module - init - wrong mainDiv arg: ' + mainDiv);
        }

        if (typeof actionFn !== 'function') {
            throw new Error('KeydownControl module - init - wrong actionFn arg: ' + actionFn);
        }
        this._isEnable = false;
        this._mainDiv = mainDiv;
        this._actionFn = actionFn;
    }

    ArrowsControl.prototype.enable = function() {
        if (this._isEnable) return;

        var self = this;
        var mouseEnterHandler = function(e) {
            var arrow = $(this),
                $body = $('body'),
                arrowOffset = arrow.offset(),
                arrowX = arrowOffset.left,
                arrowY = arrowOffset.top,
                arrowXX = arrowX + arrow.width(),
                arrowYY = arrowY + arrow.height();

            //var timeoutId;
            function mouseMoveHandler(e) {
                var x = e.clientX, y = e.clientY;

                if (!(arrowX < x && x < arrowXX && arrowY < y && y < arrowYY)) {
                    arrow.toggleClass('rb__arrow-none', false);
                    arrow.toggleClass('rb__arrow-cursor', true);
                    $body.off('mousemove', mouseMoveHandler);
                    //clearTimeout(timeoutId);
                }
            }
            function hideArrow() {
                arrow.toggleClass('rb__arrow-none', true);
                arrow.toggleClass('rb__arrow-cursor', false);

                $body.on('mousemove', mouseMoveHandler);
                //timeoutId = setTimeout(function() {
                //    arrow.toggleClass('rb__arrow-none', false);
                //    arrow.toggleClass('rb__arrow-cursor', true);
                //    $body.off('mousemove', mouseMoveHandler);
                //}, 10000);
                // todo если из iframe не всплывает mousemove с нормальными координатами, для iframe не будет работать
            }

            if (arrow.length) {
                arrow[0].hideArrowId = setTimeout(hideArrow, 2000);
            }
        };
        var mouseLeaveHandler = function(e) {
            var arrow = $(this);
            clearTimeout(arrow[0].hideArrowId);
        };
        var clickHandler = function(e) {
            var container = $(this);

            self._actionFn(container, ['left', 'top', 'right', 'bottom'], function(container, defValue) {
                return container.is('.rb__arrow-container_' + defValue);
            });
        };

        this._mainDiv.append($(
            '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_left">' +
            '<div class="rb__arrow rb__arrow_left"></div>' +
            '</div>' +
            '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_top">' +
            '<div class="rb__arrow rb__arrow_top"></div>' +
            '</div>' +
            '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_right">' +
            '<div class="rb__arrow rb__arrow_right"></div>' +
            '</div>' +
            '<div class="rb__arrow-container rb__arrow-cursor rb__arrow-container_bottom">' +
            '<div class="rb__arrow rb__arrow_bottom"></div>'
        ));

        var $rbArrowContainer = this._mainDiv.find('.rb__arrow-container');

        $rbArrowContainer.on('click', clickHandler);
        $rbArrowContainer.on('mouseenter', mouseEnterHandler);
        $rbArrowContainer.on('mouseleave', mouseLeaveHandler);
        this._clickHandler = clickHandler;
        this._mouseEnterHandler = mouseEnterHandler;
        this._mouseLeaveHandler = mouseLeaveHandler;

        this._isEnable = true;
    };

    ArrowsControl.prototype.disable = function() {
        if (!this._isEnable) return;

        var $rbArrowContainer = this._mainDiv.find('.rb__arrow-container');
        $rbArrowContainer.off('click', this._clickHandler);
        $rbArrowContainer.off('mouseenter', this._mouseEnterHandler);
        $rbArrowContainer.off('mouseleave', this._mouseLeaveHandler);
        this._clickHandler = null;
        this._mouseEnterHandler = null;
        this._mouseLeaveHandler = null;

        this._mainDiv.find('.rb__arrow-container').remove();

        this._isEnable = false;
    };

    return ArrowsControl;
});
