define(['utils', 'IControl', 'errors'], function(Utils, IControl, Errors) {
    "use strict";

    /**
     * @class
     * Класс управления панелью с помощью клавиш на клавиатуре.
     * @param {JQuery} mainDiv - элемент, в котором располагается панель. Должен содержать класс rb-wrapper.
     * @param {function} actionFn - функция, определяющая действие при переходе в одну из сторон (Moving.prototype._moveByActionValue)
     * @constructor KeydownControl
     * @extends IControl
     */
    function KeydownControl(mainDiv, actionFn) {
        if (!(mainDiv instanceof $)) {
            throw new Errors.ArgumentError('mainDiv', mainDiv);
        }

        if (typeof actionFn !== 'function') {
            throw new Errors.ArgumentError('actionFn', actionFn);
        }
        this._isEnable = false;
        this._mainDiv = mainDiv;
        this._actionFn = actionFn;
    }
    Utils.inherite(KeydownControl, IControl);
    /**
     * Применить конфигурацию. Учитывает опции leftKey, topKey, rightKey, bottomKey.
     * @param {Moving~config} config
     * @memberOf KeydownControl
     */
    KeydownControl.prototype.configure = function(config) {
        if (typeof config === 'object') {
            if (config.leftKey !== undefined) {
                this._leftKey = config.leftKey;
            }
            if (config.topKey !== undefined) {
                this._topKey = config.topKey;
            }
            if (config.rightKey !== undefined) {
                this._rightKey = config.rightKey;
            }
            if (config.bottomKey !== undefined) {
                this._bottomKey = config.bottomKey;
            }
        }
    };
    /**
     *
     * @returns {boolean}
     * @memberOf KeydownControl
     */
    KeydownControl.prototype.isEnable = function() {
        return this._isEnable;
    };
    /**
     *
     * @memberOf KeydownControl
     */
    KeydownControl.prototype.enable = function() {
        if (this._isEnable) return;

        var self = this;
        var baseHandler = function(e) {
            self._actionFn(e.which, [self._leftKey, self._topKey, self._rightKey, self._bottomKey], function(value, defValue) {
                return value === defValue;
            });
            self._actionFn(e.key, [self._leftKey, self._topKey, self._rightKey, self._bottomKey], function(value, defValue) {
                return value === defValue;
            });
            e.stopPropagation();
        };
        var mainDivHandler = function(e) {
            baseHandler(e);
        };

        this._mainDiv.on('keydown', mainDivHandler);
        this._mainDivHandler = mainDivHandler;

        this._isEnable = true;
    };
    /**
     *
     * @memberOf KeydownControl
     */
    KeydownControl.prototype.disable = function() {
        if (!this._isEnable) return;

        this._mainDiv.off('keydown', this._mainDivHandler);
        this._mainDivHandler = null;

        this._isEnable = false;
    };
    /**
     *
     * @memberOf KeydownControl
     */
    KeydownControl.prototype.destroy = function() {
        this.disable();
    };

    return KeydownControl;
});