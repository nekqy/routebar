define(['utils'], function(Utils) {
    "use strict";

    function ScreenManager(historyLength) {
        this._historyLength = typeof historyLength === 'number' && historyLength >=0 ? historyLength : 10;
        this._screens = [];
        this._curScreen = undefined;
    }

    ScreenManager.prototype.updateScreens = function(side, screen, isSaveHistory) {
        var updated = false;
        if (screen) {
            if (this._curScreen !== screen) {
                updated = true;
            }
            this._curScreen = screen;
        } else if (this._curScreen.getRelativeScreen(side)) {
            var prevScreen = this._curScreen;
            this._curScreen = this._curScreen.getRelativeScreen(side);

            if (prevScreen !== this._curScreen) {
                this._curScreen.setRelativeScreen(Utils.oppositeSide(side), prevScreen);
                updated = true;
            }
        }

        if (updated && isSaveHistory !== false) {
            this._screens.push({
                screen: this._curScreen,
                side: Utils.oppositeSide(side)
            });
            if (this._screens.length > this._historyLength) {
                this._screens.shift();
            }
        }
    };

    ScreenManager.prototype.getCurScreen = function() {
        return this._curScreen;
    };
    ScreenManager.prototype.getRelativeScreen = function(side) {
        return this._curScreen.getRelativeScreen(side);
    };
    ScreenManager.prototype.clearHistory = function() {
        this._screens = [];
    };
    ScreenManager.prototype.popHistory = function() {
        return this._screens.pop();
    };
    return ScreenManager;
});