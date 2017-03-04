define(['./core-test', '../js/main'], function(core, rb) {
    'use strict';

    var screens = [];
    var move = core.move;

    function initEach(n, screenOpts) {
        return function () {
            window.rb = rb;
            n = n || 5;

            for (var i = 0; i < n; i++) {
                var screenOptions = {
                    html: '<div class="markup' + i + '">markup' + i + '</div>'
                };
                if (typeof screenOpts === 'object') {
                    for (var screenProp in screenOpts) {
                        if (screenOpts.hasOwnProperty(screenProp)) {
                            screenOptions[screenProp] = screenOpts[screenProp];
                        }
                    }
                }

                screens.push(new rb.Screen(screenOptions));
            }
            rb.Screen.setMainScreen(screens[0]);
            $('body').append('<div id="rb1" class="rb-wrapper"></div>');
        }
    }
    function init(opts) {
        screens[0]._isDirectedGraph = true;
        screens[0].pushChild(screens[0]);

        var options = {
            wrongTime1: 5,
            wrongTime2: 5,
            correctTime: 10
        };
        if (typeof opts === 'object') {
            for (var prop in opts) {
                if (opts.hasOwnProperty(prop)) {
                    options[prop] = opts[prop];
                }
            }
        }

        var rb1 = rb.Instances.rb1;
        rb1.configure(options);
    }
    function checkComplex(getCfg) {
        return function() {
            var cfg = getCfg();
            var curScreen = cfg.curScreen;
            var screens = cfg.screens;
            var elementsBySide = cfg.elementsBySide;
            var sides = cfg.sides;
            var relativeScreens = cfg.relativeScreens;
            var history = cfg.history;

            var res = true;
            res = res && core.checkScreen(curScreen.toString())();
            res = res && core.checkElementsPool(curScreen, screens, elementsBySide)();
            res = res && core.checkScreenManager(curScreen, sides)();
            res = res && core.checkRelativeScreens(relativeScreens)();
            res = res && core.checkHistory(history)();
            return res;
        };
    }

    var t = new core.TestsWrapper('Complex1');
    t.addTestsSerial('test1', init, [
        [
            core.nopDone,
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [],
                elementsBySide: {
                    center: screens[0].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[0],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {}
                },
                history: []
            }})
        ],
        [
            move('left'),
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [],
                elementsBySide: {
                    center: screens[0].toString(),
                    left: screens[0].toString(),
                    top: screens[0].toString(),
                    right: screens[0].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[0],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {
                        right: screens[0]
                    }
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'left',
                    side: 'right',
                    screen: screens[0]
                }]
            }})
        ],
        [
            move('top'),
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [],
                elementsBySide: {
                    center: screens[0].toString(),
                    left: screens[0].toString(),
                    top: screens[0].toString(),
                    right: screens[0].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[0],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {
                        right: screens[0],
                        bottom: screens[0]
                    }
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'left',
                    side: 'right',
                    screen: screens[0]
                }, {
                    lastScreen: screens[0],
                    lastSide: 'left',
                    side: 'bottom',
                    screen: screens[0]
                }]
            }})
        ],
        [
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [],
                elementsBySide: {
                    center: screens[0].toString(),
                    left: screens[0].toString(),
                    top: screens[0].toString(),
                    right: screens[0].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[0],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {
                        right: screens[0],
                        bottom: screens[0],
                        left: screens[0]
                    }
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'left',
                    side: 'right',
                    screen: screens[0]
                }, {
                    lastScreen: screens[0],
                    lastSide: 'left',
                    side: 'bottom',
                    screen: screens[0]
                }, {
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                }]
            }})
        ],
        [
            move('bottom'),
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [],
                elementsBySide: {
                    center: screens[0].toString(),
                    left: screens[0].toString(),
                    top: screens[0].toString(),
                    right: screens[0].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[0],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {
                        right: screens[0],
                        bottom: screens[0],
                        left: screens[0],
                        top: screens[0]
                    }
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'left',
                    side: 'right',
                    screen: screens[0]
                }, {
                    lastScreen: screens[0],
                    lastSide: 'left',
                    side: 'bottom',
                    screen: screens[0]
                }, {
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                }, {
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[0]
                }]
            }})
        ]
    ]);
    t.start(initEach(1));
});
