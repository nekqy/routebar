define(['utils', 'screenModel', 'IPlugin'], function(Utils, Screen, IPlugin) {
    "use strict";

    function ScreenManager() {
        this._history = [];
        this._curScreen = undefined;
        this._relativeScreens = {};
        this._relativeUpdateFn = this._updateRelativeScreen.bind(this);
        Screen.registerRelativeUpdateFn(this._relativeUpdateFn);
    }
    Utils.inherite(ScreenManager, IPlugin);
    ScreenManager.prototype.configure = function(config) {
        function fixLength(historyLength) {
            return typeof historyLength === 'number' && historyLength >= 0 ? historyLength : 10;
        }
        if (config.maxHistoryLength !== undefined) {
            this._maxHistoryLength = fixLength(config.maxHistoryLength);
        }
    };

    ScreenManager.prototype.updateScreens = function(side, screen, isSaveHistory) {
        var updated = false;
        if (screen) {
            if (this._curScreen !== screen) {
                updated = true;
            }
            this._curScreen = screen;
        } else if (this.getRelativeScreen(side)) {
            var prevScreen = this._curScreen;
            this._curScreen = this.getRelativeScreen(side);

            if (prevScreen !== this._curScreen) {
                this._setRelativeScreen(this._curScreen, Utils.oppositeSide(side), prevScreen);
                updated = true;
            }
        }

        if (updated && isSaveHistory !== false) {
            this._history.push({
                screen: this._curScreen,
                side: Utils.oppositeSide(side)
            });
            if (this._history.length > this._maxHistoryLength) {
                this._history.shift();
            }
        }

        return this._curScreen;
    };

    ScreenManager.prototype._getRelativeScreenByScreen = function(screen, side) {
        if (!(screen instanceof Screen)) {
            throw new Error('ScreenManager module - _getRelativeScreenByScreen - wrong baseScreen arg');
        }
        if (side !== 'left' && side !== 'top' && side !== 'right' && side !== 'bottom' &&  side !== 'center') {
            throw new Error('ScreenManager module - _getRelativeScreenByScreen - wrong side arg: ' + side);
        }

        var id = screen.toString();
        if (!this._relativeScreens[id]) {
            this._relativeScreens[id] = {};
        }

        if (side === 'center') {
            return screen;
        }
        if (side === 'left') {
            if (screen.parents.length) {
                return this._relativeScreens[id]['left'] || screen.parents[0];
            } else {
                return null;
            }
        }
        if (side === 'top') {
            if (screen.prev) {
                return this._relativeScreens[id]['top'] || screen.prev;
            } else {
                return null;
            }
        }
        if (side === 'right') {
            if (screen.children.length) {
                return this._relativeScreens[id]['right'] || screen.children[0];
            } else {
                return null;
            }
        }
        if (side === 'bottom') {
            if (screen.next) {
                return this._relativeScreens[id]['bottom'] || screen.next;
            } else {
                return null;
            }
        }
        return null;
    };
    ScreenManager.prototype._setRelativeScreen = function(baseScreen, side, screen) {
        if (side !== 'left' && side !== 'top' && side !== 'right' && side !== 'bottom') {
            throw new Error('ScreenManager module - _setRelativeScreen - wrong side arg: ' + side);
        }
        if (!(baseScreen instanceof Screen)) {
            throw new Error('ScreenManager module - _setRelativeScreen - wrong baseScreen arg');
        }
        if (!(screen instanceof Screen)) {
            throw new Error('ScreenManager module - _setRelativeScreen - wrong screen arg');
        }

        var id = baseScreen.toString();
        if (!this._relativeScreens[id]) {
            this._relativeScreens[id] = {};
        }

        this._relativeScreens[id][side] = screen;
    };
    ScreenManager.prototype._updateRelativeScreen = function(screen) {
        if (!(screen instanceof Screen)) {
            throw new Error('ScreenManager module - _updateRelativeScreen - wrong screen arg');
        }
        var id = screen.toString();

        if (!this._relativeScreens[id]) {
            this._relativeScreens[id] = {};
        }

        if (!screen.children.length) {
            this._relativeScreens[id]['right'] = null;
        }
        if (!screen.parents.length) {
            this._relativeScreens[id]['left'] = null;
        }
        if (!screen.next) {
            this._relativeScreens[id]['bottom'] = null;
        }
        if (!screen.prev) {
            this._relativeScreens[id]['top'] = null;
        }
    };

    ScreenManager.prototype.getCurScreen = function() {
        return this._curScreen;
    };
    ScreenManager.prototype.getRelativeScreen = function(side) {
        return this._getRelativeScreenByScreen(this._curScreen, side);
    };
    ScreenManager.prototype.clearHistory = function() {
        this._history = [];
    };
    ScreenManager.prototype.popHistory = function() {
        return this._history.pop();
    };
    ScreenManager.prototype.destroy = function() {
        Screen.unregisterRelativeUpdateFn(this._relativeUpdateFn);
    };

    return ScreenManager;
});