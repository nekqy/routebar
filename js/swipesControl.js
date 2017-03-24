define(['utils', 'IControl', 'errors', 'hammer'], function(Utils, IControl, Errors, Hammer) {
    "use strict";

    /**
     * @class
     * Класс управления панелью на мобильных устройствах с помощью свайпов.
     * @param {JQuery} mainDiv - элемент, в котором располагается панель. Должен содержать класс rb-wrapper.
     * @param {function} actionFn - функция, определяющая действие при переходе в одну из сторон (Moving.prototype._moveByActionValue)
     * @constructor SwipesControl
     * @extends IControl
     */
    function SwipesControl(mainDiv, actionFn) {
        if (!(mainDiv instanceof $)) {
            throw new Errors.ArgumentError('mainDiv', mainDiv);
        }

        if (typeof actionFn !== 'function') {
            throw new Errors.ArgumentError('actionFn', actionFn);
        }
        this._isEnable = false;
        this._mainDiv = mainDiv;
        this._actionFn = actionFn;

        this._hammertime = new Hammer(mainDiv[0]);
        this._hammertime.get('swipe').set({direction: Hammer.DIRECTION_ALL});
    }
    Utils.inherite(SwipesControl, IControl);
    /**
     * Применить конфигурацию. Учитывает опцию pointersForSwipe.
     * @param {Moving~config} config
     * @memberOf SwipesControl
     */
    SwipesControl.prototype.configure = function(config) {
        if (typeof config === 'object') {
            if (config.pointersForSwipe !== undefined) {
                this._hammertime.get('swipe').set({pointers: config.pointersForSwipe});
            }
        }
    };
    /**
     *
     * @returns {boolean}
     * @memberOf SwipesControl
     */
    SwipesControl.prototype.isEnable = function() {
        return this._isEnable;
    };
    /**
     *
     * @memberOf SwipesControl
     */
    SwipesControl.prototype.enable = function() {
        if (this._isEnable) return;

        function swipeHandler(e) {
            self._actionFn(e.direction, [Hammer.DIRECTION_RIGHT, Hammer.DIRECTION_DOWN, Hammer.DIRECTION_LEFT, Hammer.DIRECTION_UP], function(val, defVal) {
                return val === defVal;
            });
            e.preventDefault();
        }

        var self = this;
        this._hammertime.on('swipe', swipeHandler);
        this._swipeHandler = swipeHandler;

        this._isEnable = true;
    };
    /**
     *
     * @memberOf SwipesControl
     */
    SwipesControl.prototype.disable = function() {
        if (!this._isEnable) return;

        this._hammertime.off('swipe', this._swipeHandler);
        this._swipeHandler = null;

        this._isEnable = false;
    };
    /**
     *
     * @memberOf SwipesControl
     */
    SwipesControl.prototype.destroy = function() {
        this.disable();
    };

    return SwipesControl;
});