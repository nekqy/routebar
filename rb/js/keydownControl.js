define([], function() {
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

    KeydownControl.prototype.enable = function() {
        if (this._isEnable) return;

        var self = this;
        var baseHandler = function(e) {
            self._actionFn(e.which, [37, 38, 39, 40], function(value, defValue) {
                return value === defValue;
            });
        };
        var mainDivHandler = function(e) {
            baseHandler(e);
        };
        var bodyHandler = function(e) {
            baseHandler(e);
            e.stopPropagation();
        };

        $('body').on('keydown', bodyHandler);
        this._mainDiv.on('keydown', mainDivHandler);
        this._bodyHandler = bodyHandler;
        this._mainDivHandler = mainDivHandler;

        this._isEnable = true;
    };

    KeydownControl.prototype.disable = function() {
        if (!this._isEnable) return;
        $('body').off('keydown', this._bodyHandler);
        this._mainDiv.off('keydown', this._mainDivHandler);
        this._bodyHandler = null;
        this._mainDivHandler = null;

        this._isEnable = false;
    };

    return KeydownControl;
});