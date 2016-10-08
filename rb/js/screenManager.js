define(['utils'], function(Utils) {
    "use strict";
    var historyLength = 10,
        screens = [],
        curScreen;

    function updateScreens(side, screen, isSaveHistory) {
        var updated = false;
        if (screen) {
            if (curScreen !== screen) {
                updated = true;
            }
            curScreen = screen;
        } else if (curScreen.getRelativeScreen(side)) {
            var prevScreen = curScreen;
            curScreen = curScreen.getRelativeScreen(side);

            if (prevScreen !== curScreen) {
                curScreen.setRelativeScreen(Utils.oppositeSide(side), prevScreen);
                updated = true;
            }
        }

        if (updated && isSaveHistory !== false) {
            screens.push({
                screen: curScreen,
                side: Utils.oppositeSide(side)
            });
            if (screens.length > historyLength) {
                screens.shift();
            }
        }
    }

    function getCurScreen() {
        return curScreen;
    }
    function getRelativeScreen(side) {
        return curScreen.getRelativeScreen(side);
    }

    return {
        updateScreens: updateScreens,
        getCurScreen: getCurScreen,
        getRelativeScreen: getRelativeScreen,
        clearHistory: function() {
            screens = [];
        },
        popHistory: function() {
            return screens.pop();
        }
    };
});