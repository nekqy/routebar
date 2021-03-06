define(['utils', 'IControl', 'errors'], function(Utils, IControl, Errors) {
    "use strict";

    /**
     * @class
     * Класс управления панелью с помощью стрелок, отображаемых по сторонам панели.
     * @param {JQuery} mainDiv - элемент, в котором располагается панель. Должен содержать класс rb-wrapper.
     * @param {function} actionFn - функция, определяющая действие при переходе в одну из сторон (Moving.prototype._moveByActionValue)
     * @param {Moving#afterRenderDispatcher} afterRender - Диспетчер, выполняющий зарегистрированные функции после рендеринга контента моделей на странице после перехода
     * @constructor ArrowsControl
     * @extends IControl
     */
    function ArrowsControl(mainDiv, actionFn, afterRender) {
        if (!(mainDiv instanceof $)) {
            throw new Errors.ArgumentError('mainDiv', mainDiv);
        }

        if (typeof actionFn !== 'function') {
            throw new Errors.ArgumentError('actionFn', actionFn);
        }
        this._isEnable = false;
        this._mainDiv = mainDiv.parent();
        this._actionFn = actionFn;
        this._afterRender = afterRender;
    }
    Utils.inherite(ArrowsControl, IControl);

    /**
     * Применить конфигурацию. Учитывает опции hideArrowsTime, showArrowsOutside, showArrowsOnHover, hideArrowsAfterTime.
     * @param {Moving~config} config
     * @memberOf ArrowsControl
     */
    ArrowsControl.prototype.configure = function(config) {
        if (typeof config === 'object') {
            if (config.hideArrowsTime !== undefined) {
                this._hideArrowsTime = config.hideArrowsTime;
            }
            if (config.showArrowsOutside !== undefined) {
                this._showArrowsOutside = config.showArrowsOutside;
            }
            if (config.showArrowsOnHover !== undefined) {
                this._showArrowsOnHover = config.showArrowsOnHover;
            }
            if (config.hideArrowsAfterTime !== undefined) {
                this._hideArrowsAfterTime = config.hideArrowsAfterTime;
            }
        }
        this._containerClass = (this._showArrowsOnHover ? 'rb__arrow-container-hover' : 'rb__arrow-container');
    };
    /**
     *
     * @returns {boolean}
     * @memberOf ArrowsControl
     */
    ArrowsControl.prototype.isEnable = function() {
        return this._isEnable;
    };
    /**
     *
     * @memberOf ArrowsControl
     */
    ArrowsControl.prototype.enable = function() {
        if (this._isEnable) return;

        var self = this;
        var mouseEnterHandler = function(e) {
            if (!self._hideArrowsAfterTime) return;

            var arrow = $(e.currentTarget),
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
                arrow[0].hideArrowId = setTimeout(hideArrow, self._hideArrowsTime);
            }
        };
        var mouseLeaveHandler = function(e) {
            if (!self._hideArrowsAfterTime) return;

            var arrow = $(e.currentTarget);
            clearTimeout(arrow[0].hideArrowId);
        };
        var clickHandler = function(e) {
            var arrow = $(e.currentTarget);

            mouseLeaveHandler(e);
            self._afterRender.add(mouseEnterHandler.bind(undefined, e), true);

            self._actionFn(arrow, Utils.sides, function(container, defValue) {
                return container.is('.rb__arrow-container_' + defValue);
            });
        };

        var markup = '';
        Utils.sides.forEach(function(side) {
            markup += '<div class="' +
                self._containerClass +
                ' rb__arrow-cursor rb__arrow-container_' + side + '' +
                (self._showArrowsOutside ? (' rb__arrow-outside_' + side) : '') +
                '">' +
                '<div class="rb__arrow rb__arrow_' + side + '"></div>' +
                '</div>';
        });
        this._mainDiv.append($(markup));

        var $rbArrowContainer = this._mainDiv.find('>.' + this._containerClass);

        $rbArrowContainer.on('click', clickHandler);
        $rbArrowContainer.on('mouseenter', mouseEnterHandler);
        $rbArrowContainer.on('mouseleave', mouseLeaveHandler);
        this._clickHandler = clickHandler;
        this._mouseEnterHandler = mouseEnterHandler;
        this._mouseLeaveHandler = mouseLeaveHandler;

        this._isEnable = true;
    };
    /**
     *
     * @memberOf ArrowsControl
     */
    ArrowsControl.prototype.disable = function() {
        if (!this._isEnable) return;

        var $rbArrowContainer = this._mainDiv.find('>.' + this._containerClass);
        for (var i = 0; i < $rbArrowContainer.length; i++) {
            clearTimeout($rbArrowContainer[i].hideArrowId);
        }
        $rbArrowContainer.off('click', this._clickHandler);
        $rbArrowContainer.off('mouseenter', this._mouseEnterHandler);
        $rbArrowContainer.off('mouseleave', this._mouseLeaveHandler);
        this._clickHandler = null;
        this._mouseEnterHandler = null;
        this._mouseLeaveHandler = null;

        this._mainDiv.find('>.' + this._containerClass).remove();

        this._isEnable = false;
    };
    /**
     *
     * @memberOf ArrowsControl
     */
    ArrowsControl.prototype.destroy = function() {
        this.disable();
    };

    return ArrowsControl;
});
