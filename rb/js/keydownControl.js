define(['utils', 'IPlugin'], function(Utils, IPlugin) {
    "use strict";

    function KeydownControl(mainDiv, actionFn) {
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
    Utils.inherite(KeydownControl, IPlugin);
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

    KeydownControl.prototype.isEnable = function() {
        return this._isEnable;
    };

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
        };
        var mainDivHandler = function(e) {
            baseHandler(e);
        };

        this._mainDiv.on('keydown', mainDivHandler);
        this._mainDivHandler = mainDivHandler;

        this._isEnable = true;
    };

    KeydownControl.prototype.disable = function() {
        if (!this._isEnable) return;

        this._mainDiv.off('keydown', this._mainDivHandler);
        this._mainDivHandler = null;

        this._isEnable = false;
    };

    KeydownControl.prototype.destroy = function() {
        this.disable();
    };

    return KeydownControl;
});