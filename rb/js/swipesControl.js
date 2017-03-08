define(['utils', 'IPlugin', 'hammer'], function(Utils, IPlugin, Hammer) {
    "use strict";

    function SwipesControl(mainDiv, actionFn) {
        if (!(mainDiv instanceof $)) {
            throw new Error('KeydownControl module - init - wrong mainDiv arg: ' + mainDiv);
        }

        if (typeof actionFn !== 'function') {
            throw new Error('KeydownControl module - init - wrong actionFn arg: ' + actionFn);
        }
        this._isEnable = false;
        this._mainDiv = mainDiv;
        this._actionFn = actionFn;

        this._hammertime = new Hammer(mainDiv[0]);
        this._hammertime.get('swipe').set({direction: Hammer.DIRECTION_ALL});
    }

    Utils.inherite(SwipesControl, IPlugin);
    SwipesControl.prototype.configure = function(config) {
        if (typeof config === 'object') {
            if (config.pointersForSwipe !== undefined) {
                this._hammertime.get('swipe').set({pointers: config.pointersForSwipe});
            }
        }
    };

    SwipesControl.prototype.isEnable = function() {
        return this._isEnable;
    };

    SwipesControl.prototype.enable = function() {
        if (this._isEnable) return;

        function swipeHandler(e) {
            self._actionFn(e.direction, [Hammer.DIRECTION_RIGHT, Hammer.DIRECTION_DOWN, Hammer.DIRECTION_LEFT, Hammer.DIRECTION_UP], function(val, defVal) {
                return val === defVal;
            });
            e.preventDefault();
            e.stopPropagation();
        }

        var self = this;
        this._hammertime.on('swipe', swipeHandler);
        this._swipeHandler = swipeHandler;

        this._isEnable = true;
    };

    SwipesControl.prototype.disable = function() {
        if (!this._isEnable) return;

        this._hammertime.off('swipe', this._swipeHandler);
        this._swipeHandler = null;

        this._isEnable = false;
    };

    SwipesControl.prototype.destroy = function() {
        this.disable();
    };

    return SwipesControl;
});