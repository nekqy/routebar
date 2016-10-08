define(['utils'], function(Utils) {
    "use strict";
    var curScreen;

    function updateScreens(nextScreen, screen) {
        if (screen) {
            curScreen = screen;
        } else if (curScreen.getRelativeScreen(nextScreen)) {
            var prevScreen = curScreen;
            curScreen = curScreen.getRelativeScreen(nextScreen);
            curScreen.setRelativeScreen(Utils.oppositeSide(nextScreen), prevScreen);
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
        getRelativeScreen: getRelativeScreen
    };
});