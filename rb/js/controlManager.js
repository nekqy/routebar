define([], function() {
    "use strict";

    function ControlManager() {
        this._controls = {};
    }

    ControlManager.prototype.add = function(id, control, doEnable) {
        if (this._controls.hasOwnProperty(id)) {
            console.log('ControlManager - add - control already exists: ' + id);
        } else {
            this._controls[id] = control;
            if (doEnable) {
                this.enable(id);
            }
        }

        return this;
    };
    ControlManager.prototype.remove = function(id) {
        if (this._controls.hasOwnProperty(id)) {
            delete this._controls[id];
        } else {
            console.log('ControlManager - remove - control not found: ' + id);
        }
        return this;
    };

    ControlManager.prototype.isEnable = function(id) {
        if (this._controls.hasOwnProperty(id)) {
            return this._controls[id].isEnable();
        } else {
            console.log('ControlManager - isEnable - control not found: ' + id);
        }
        return this;
    };
    ControlManager.prototype.enable = function(id) {
        if (this._controls.hasOwnProperty(id)) {
            this._controls[id].enable();
        } else {
            console.log('ControlManager - enable - control not found: ' + id);
        }
        return this;
    };
    ControlManager.prototype.disable = function(id) {
        if (this._controls.hasOwnProperty(id)) {
            this._controls[id].disable();
        } else {
            console.log('ControlManager - disable - control not found: ' + id);
        }
        return this;
    };

    ControlManager.prototype._doAll = function(isEnable) {
        var res = {};
        for (var id in this._controls) {
            if (this._controls.hasOwnProperty(id)) {
                res[id] = this.isEnable(id);
                if (isEnable) {
                    this.enable(id);
                } else {
                    this.disable(id);
                }
            }
        }
        return res;
    };
    ControlManager.prototype.disableAll = function() {
        return this._doAll(false);
    };
    ControlManager.prototype.enableAll = function() {
        return this._doAll(true);
    };
    ControlManager.prototype.enableByValues = function(values) {
        for (var id in values) {
            if (values.hasOwnProperty(id)) {
                if (values[id]) {
                    this.enable(id);
                } else {
                    this.disable(id);
                }
            }
        }
    };

    return ControlManager;
});