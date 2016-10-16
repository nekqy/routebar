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

    return ControlManager;
});