define(['../js/main', './testsWrapper'], function(rb, TestsWrapper) {
    'use strict';

    function count(elem, length) {
        var res = $(elem).length === length;
        expect(res).toBe(true);
    }
    function checkScreen(screenName) {
        return function () {
            var curScreen = rb.Instances.rb1._screenManager.getCurScreen();
            var res = screenName === curScreen.toString();
            if (!res) {
                console.log(screenName + ' != ' + curScreen.toString());
            }
            return res;
        };
    }
    function nop() {
    }
    function nopDone(done) {
        done();
    }
    function checkMarkup(niceMarkup) {
        return function () {
            var initMarkup = $('.rb').html();
            var res = initMarkup === niceMarkup;
            if (!res) {
                console.log(initMarkup + ' != ' + niceMarkup);
            }
            return res;
        };
    }

    function checkElementsPool(mainScreen, screens, elementsBySide) {
        return function () {
            var res = true;
            var curRb = rb.Instances.rb1;
            var mainScreenName = mainScreen.toString();
            var elements = curRb._elementsPool._elements;
            var count = 1 + screens.length;

            res = res && Object.keys(elements).length === count;
            !res && console.log('fail: Object.keys(elements).length === count', Object.keys(elements), Object.keys(elements).length, count);
            res = res && elements[mainScreenName];
            !res && console.log('fail: elements[mainScreenName]', Object.keys(elements), mainScreenName);
            screens.forEach(function (screen) {
                res = res && elements[screen.toString()];
                !res && console.log('fail: elements[screen.toString()]', Object.keys(elements), screen && screen.toString());
            });

            var element = elements[mainScreenName];
            res = res && element.state === 'loaded';
            !res && console.log('fail: element.state === "loaded"', element && element.state);
            res = res && element.screen === mainScreen;
            !res && console.log('fail: element.screen === mainScreen', element && element.screen && element.screen.toString(), mainScreen && mainScreen.toString());
            res = res && element.element.is('.rb__center');
            !res && console.log('fail: element.element.is(".rb__center")', element && element.element);
            screens.forEach(function (screen) {
                var element = elements[screen.toString()];
                res = res && element.state === 'loaded';
                !res && console.log('fail: element.state === "loaded"', element && element.state);
                res = res && element.screen === screen;
                !res && console.log('fail: element.screen === screen', element && element.screen && element.screen.toString(), screen && screen.toString());
            });

            res = res && curRb._elementsPool._elementsBySide['center'] === elementsBySide['center'];
            !res && console.log('fail: curRb._elementsPool._elementsBySide["center"] === elementsBySide["center"]', curRb._elementsPool._elementsBySide["center"], elementsBySide["center"]);
            res = res && curRb._elementsPool._elementsBySide['left'] === elementsBySide['left'];
            !res && console.log('fail: curRb._elementsPool._elementsBySide["left"] === elementsBySide["left"]', curRb._elementsPool._elementsBySide["left"], elementsBySide["left"]);
            res = res && curRb._elementsPool._elementsBySide['top'] === elementsBySide['top'];
            !res && console.log('fail: curRb._elementsPool._elementsBySide["top"] === elementsBySide["top"]', curRb._elementsPool._elementsBySide["top"], elementsBySide["top"]);
            res = res && curRb._elementsPool._elementsBySide['right'] === elementsBySide['right'];
            !res && console.log('fail: curRb._elementsPool._elementsBySide["right"] === elementsBySide["right"]', curRb._elementsPool._elementsBySide["right"], elementsBySide["right"]);
            res = res && curRb._elementsPool._elementsBySide['bottom'] === elementsBySide['bottom'];
            !res && console.log('fail: curRb._elementsPool._elementsBySide["bottom"] === elementsBySide["bottom"]', curRb._elementsPool._elementsBySide["bottom"], elementsBySide["bottom"]);
            return res;
        };
    }
    function checkScreenManager(curScreen, sides) {
        return function() {
            var res = true;
            var curRb = rb.Instances.rb1;
            var screenManager = curRb._screenManager;
            var screen = screenManager.getCurScreen();

            res = res && screenManager.getCurScreen() && screenManager.getCurScreen() === curScreen;
            !res && console.log('fail: screenManager.getCurScreen() && screenManager.getCurScreen() === curScreen', screenManager.getCurScreen() && screenManager.getCurScreen().toString(), curScreen && curScreen.toString());
            res = res && screenManager._getLeft(screen) === sides.left;
            !res && console.log('fail: screenManager._getLeft(screen) === sides.left', screenManager._getLeft(screen) && screenManager._getLeft(screen).toString(), sides.left && sides.left.toString());
            res = res && screenManager._getTop(screen) === sides.top;
            !res && console.log('fail: screenManager._getTop(screen) === sides.top', screenManager._getTop(screen) && screenManager._getTop(screen).toString(), sides.top && sides.top.toString());
            res = res && screenManager._getTop(screen, true) === sides.topCycled;
            !res && console.log('fail: screenManager._getTop(screen, true) === sides.topCycled', screenManager._getTop(screen, true) && screenManager._getTop(screen, true).toString(), sides.topCycled && sides.topCycled.toString());
            res = res && screenManager._getRight(screen) === sides.right;
            !res && console.log('fail: screenManager._getRight(screen) === sides.right', screenManager._getRight(screen) && screenManager._getRight(screen).toString(), sides.right && sides.right.toString());
            res = res && screenManager._getBottom(screen) === sides.bottom;
            !res && console.log('fail: screenManager._getBottom(screen) === sides.bottom', screenManager._getBottom(screen) && screenManager._getBottom(screen).toString(), sides.bottom && sides.bottom.toString());
            res = res && screenManager._getBottom(screen, true) === sides.bottomCycled;
            !res && console.log('fail: screenManager._getBottom(screen, true) === sides.bottomCycled', screenManager._getBottom(screen, true) && screenManager._getBottom(screen, true).toString(), sides.bottomCycled && sides.bottomCycled.toString());

            return res;
        };
    }
    function checkRelativeScreens(relativeScreens) {
        return function() {
            var curRb = rb.Instances.rb1;
            var screenManager = curRb._screenManager;
            var curRelativeScreens = screenManager._relativeScreens;

            var res = true;
            res = res && relativeScreens.length === curRelativeScreens.length;
            !res && console.log('fail: relativeScreens.length === curRelativeScreens.length', relativeScreens.length, curRelativeScreens.length);
            for (var relativeScreenName in relativeScreens) {
                if (relativeScreens.hasOwnProperty(relativeScreenName)) {
                    var relativeScreen = relativeScreens[relativeScreenName];
                    res = res && curRelativeScreens[relativeScreenName];
                    !res && console.log('fail: curRelativeScreens[' + relativeScreenName + ']', relativeScreenName, curRelativeScreens[relativeScreenName] && curRelativeScreens[relativeScreenName].toString());
                    res = res && curRelativeScreens[relativeScreenName]['left'] === relativeScreen['left'];
                    !res && console.log('fail: curRelativeScreens[' + relativeScreenName + ']["left"] === relativeScreen["left"]', curRelativeScreens[relativeScreenName]['left'] && curRelativeScreens[relativeScreenName]['left'].toString(), relativeScreen['left'] && relativeScreen['left'].toString());
                    res = res && curRelativeScreens[relativeScreenName]['top'] === relativeScreen['top'];
                    !res && console.log('fail: curRelativeScreens[' + relativeScreenName + ']["top"] === relativeScreen["top"]', curRelativeScreens[relativeScreenName]['top'] && curRelativeScreens[relativeScreenName]['top'].toString(), relativeScreen['top'] && relativeScreen['top'].toString());
                    res = res && curRelativeScreens[relativeScreenName]['right'] === relativeScreen['right'];
                    !res && console.log('fail: curRelativeScreens[' + relativeScreenName + ']["right"] === relativeScreen["right"]', curRelativeScreens[relativeScreenName]['right'] && curRelativeScreens[relativeScreenName]['right'].toString(), relativeScreen['right'] && relativeScreen['right'].toString());
                    res = res && curRelativeScreens[relativeScreenName]['bottom'] === relativeScreen['bottom'];
                    !res && console.log('fail: curRelativeScreens[' + relativeScreenName + ']["bottom"] === relativeScreen["bottom"]', curRelativeScreens[relativeScreenName]['bottom'] && curRelativeScreens[relativeScreenName]['bottom'].toString(), relativeScreen['bottom'] && relativeScreen['bottom'].toString());
                }
            }
            return res;
        };
    }
    function checkHistory(history) {
        return function() {
            var res = true;
            var curRb = rb.Instances.rb1;
            var screenManager = curRb._screenManager;
            var curHistory = screenManager._history;

            res = res && curHistory.length === history.length;
            !res && console.log('fail: curHistory.length === history.length', curHistory.length, history.length);
            history.forEach(function (historyStep, index) {
                res = res && curHistory[index].lastScreen === historyStep.lastScreen;
                !res && console.log('fail: curHistory[' + index + '].lastScreen === historyStep.lastScreen', index, curHistory[index].lastScreen && curHistory[index].lastScreen.toString(), historyStep.lastScreen && historyStep.lastScreen.toString());
                res = res && curHistory[index].lastSide === historyStep.lastSide;
                !res && console.log('fail: curHistory[' + index + '].lastSide === historyStep.lastSide', index, curHistory[index].lastSide && curHistory[index].lastSide.toString(), historyStep.lastSide && historyStep.lastSide.toString());
                res = res && curHistory[index].side === historyStep.side;
                !res && console.log('fail: curHistory[' + index + '].side === historyStep.side', index, curHistory[index].side && curHistory[index].side.toString(), historyStep.side && historyStep.side.toString());
                res = res && curHistory[index].screen === historyStep.screen;
                !res && console.log('fail: curHistory[' + index + '].screen === historyStep.screen', index, curHistory[index].screen && curHistory[index].screen.toString(), historyStep.screen && historyStep.screen.toString());
            });
            return res;
        };
    }

    function move(side) {
        return function (done) {
            var rb1 = rb.Instances.rb1;
            rb1.move(side).then(done, done);
        }
    }
    function moveBack() {
        return function (done) {
            var rb1 = rb.Instances.rb1;
            var res = rb1.moveBack();
            if (res) {
                res.then(done, done);
            } else {
                done();
            }
        }
    }
    function configure(config) {
        return function (done) {
            var rb1 = rb.Instances.rb1;
            try {
                rb1.configure(config);
            } catch(e) {
                console.error(e);
                done(e);
            }
            done();
        }
    }
    function setScreen(screen, isSaveHistory) {
        return function (done) {
            var rb1 = rb.Instances.rb1;
            rb1.setScreen(screen, isSaveHistory).then(done, done);
        }
    }
    function reload(side) {
        return function (done) {
            var rb1 = rb.Instances.rb1;
            try {
                rb1.reload(side);
            } catch(e) {
                console.error(e);
                done(e);
            }
            done();
        }
    }
    function goToScreen(screen, correctErr) {
        return function (done) {
            var rb1 = rb.Instances.rb1;
            rb1.goToScreen(screen).then(done, function(err) {
                if (correctErr) {
                    console.error(err);
                    expect(err instanceof correctErr).toBe(true);
                }
                done();
            });
        }
    }

    function checkError(correctError) {
        return function (error) {
            if (!error) return true;
            var res = error instanceof correctError;
            if (!res) {
                console.error(error);
            }
            return res;
        };//todo надо done(error) делать
    }

    return {
        count: count,
        checkScreen: checkScreen,
        checkMarkup: checkMarkup,
        checkElementsPool: checkElementsPool,
        checkScreenManager: checkScreenManager,
        checkRelativeScreens: checkRelativeScreens,
        checkHistory: checkHistory,
        checkError: checkError,
        nop: nop,
        nopDone: nopDone,
        move: move,
        moveBack: moveBack,
        configure: configure,
        setScreen: setScreen,
        reload: reload,
        goToScreen: goToScreen,
        TestsWrapper: TestsWrapper
    };
});
