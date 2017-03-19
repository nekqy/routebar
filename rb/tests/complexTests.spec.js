define(['./core-test', '../js/main'], function(core, rb) {
    'use strict';

    var screens = [];
    var move = core.move;

    function initEach(fn, n, screenOpts) {
        return function () {
            window.rb = rb;
            n = n || 5;

            screens = [];
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
            fn && fn();
            rb.Screen.setMainScreen(screens[0]);
            $('body').append('<div id="rb1" class="rb-wrapper"></div>');
        }
    }
    function init(fn, opts) {
        return function() {
            fn && fn();

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
        };
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
    t.addTestsSerial('test1', init(function () {
        screens[0].pushChild(screens[0]);
    }), [
        [
            core.nopDone,
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
                        bottom: screens[0] //todo откуда это берется?
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
    t.start(initEach(core.nop, 5));

    var t2 = new core.TestsWrapper('Complex2');
    t2.addTestsSerial('test2', init(function () {
        screens[0].pushChild(screens[1]);
    }), [
        [
            core.nopDone,
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[1]],
                elementsBySide: {
                    center: screens[0].toString(),
                    right: screens[1].toString(),
                    top: screens[0].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: undefined,
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
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
                screens: [screens[1]],
                elementsBySide: {
                    center: screens[0].toString(),
                    right: screens[1].toString(),
                    top: screens[0].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: undefined,
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': { // todo почему пусто?
                    }
                },
                history: []
            }})
        ],
        [
            move('top'),
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[1]],
                elementsBySide: {
                    center: screens[0].toString(),
                    right: screens[1].toString(),
                    top: screens[0].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: undefined,
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {
                        'bottom': screens[0]
                    }
                },
                history: [{
                    lastScreen: undefined,
                    lastSide: undefined,
                    side: 'bottom',
                    screen: screens[0]
                }]
            }})
        ],
        [
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[1],
                screens: [screens[0]],
                elementsBySide: {
                    center: screens[1].toString(),
                    left: screens[0].toString(),
                    top: screens[1].toString(),
                    bottom: screens[1].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[1],
                    right: undefined,
                    bottom: undefined,
                    bottomCycled: screens[1]
                },
                relativeScreens: {
                    'screen_1': {
                        'bottom': screens[0]
                    }
                },
                history: [{
                    lastScreen: undefined,
                    lastSide: undefined,
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
                curScreen: screens[1],
                screens: [screens[0]],
                elementsBySide: {
                    center: screens[1].toString(),
                    left: screens[0].toString(),
                    top: screens[1].toString(),
                    bottom: screens[1].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[1],
                    right: undefined,
                    bottom: undefined,
                    bottomCycled: screens[1]
                },
                relativeScreens: {
                    'screen_1': {
                        'bottom': screens[0]
                    }
                },
                history: [{
                    lastScreen: undefined,
                    lastSide: undefined,
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
                    screen: screens[1]
                }]
            }})
        ]
    ]);
    t2.start(initEach(core.nop, 5));

    var t3 = new core.TestsWrapper('Complex3');
    t3.addTestsSerial('test3', init(), [
        [
            core.nopDone,
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
                        bottom: screens[0] //todo откуда это берется?
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
    t3.start(initEach(function () {
        screens[0].pushChild(screens[0]);
    }, 5));

    var t4 = new core.TestsWrapper('Complex4');
    t4.addTestsSerial('test4', init(), [
        [
            core.nopDone,
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[1]],
                elementsBySide: {
                    center: screens[0].toString(),
                    right: screens[1].toString(),
                    top: screens[0].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: undefined,
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
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
                screens: [screens[1]],
                elementsBySide: {
                    center: screens[0].toString(),
                    right: screens[1].toString(),
                    top: screens[0].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: undefined,
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': { // todo почему пусто?
                    }
                },
                history: []
            }})
        ],
        [
            move('top'),
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[1]],
                elementsBySide: {
                    center: screens[0].toString(),
                    right: screens[1].toString(),
                    top: screens[0].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: undefined,
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {
                        'bottom': screens[0]
                    }
                },
                history: [{
                    lastScreen: undefined,
                    lastSide: undefined,
                    side: 'bottom',
                    screen: screens[0]
                }]
            }})
        ],
        [
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[1],
                screens: [screens[0]],
                elementsBySide: {
                    center: screens[1].toString(),
                    left: screens[0].toString(),
                    top: screens[1].toString(),
                    bottom: screens[1].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[1],
                    right: undefined,
                    bottom: undefined,
                    bottomCycled: screens[1]
                },
                relativeScreens: {
                    'screen_1': {
                        'bottom': screens[0]
                    }
                },
                history: [{
                    lastScreen: undefined,
                    lastSide: undefined,
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
                curScreen: screens[1],
                screens: [screens[0]],
                elementsBySide: {
                    center: screens[1].toString(),
                    left: screens[0].toString(),
                    top: screens[1].toString(),
                    bottom: screens[1].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[1],
                    right: undefined,
                    bottom: undefined,
                    bottomCycled: screens[1]
                },
                relativeScreens: {
                    'screen_1': {
                        'bottom': screens[0]
                    }
                },
                history: [{
                    lastScreen: undefined,
                    lastSide: undefined,
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
                    screen: screens[1]
                }]
            }})
        ]
    ]);
    t4.start(initEach(function () {
        screens[0].pushChild(screens[1]);
    }, 5));

    var t5 = new core.TestsWrapper('Complex5');
    t5.addTestsSerial('test5', init(function () {
        screens[0].pushChild(screens[1]);
    }), [
        [
            core.nopDone,
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[1]],
                elementsBySide: {
                    center: screens[0].toString(),
                    left: screens[1].toString(),
                    top: screens[0].toString(),
                    right: screens[1].toString(),
                    bottom:screens[0].toString()
                },
                sides: {
                    left: screens[1],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
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
                curScreen: screens[1],
                screens: [screens[0]],
                elementsBySide: {
                    center: screens[1].toString(),
                    left: screens[0].toString(),
                    top: screens[1].toString(),
                    right: screens[0].toString(),
                    bottom:screens[1].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[1],
                    right: screens[0],
                    bottom: undefined,
                    bottomCycled: screens[1]
                },
                relativeScreens: {
                    'screen_1': { // todo почему пусто?
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
                curScreen: screens[1],
                screens: [screens[0]],
                elementsBySide: {
                    center: screens[1].toString(),
                    left: screens[0].toString(),
                    top: screens[1].toString(),
                    right: screens[0].toString(),
                    bottom:screens[1].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[1],
                    right: screens[0],
                    bottom: undefined,
                    bottomCycled: screens[1]
                },
                relativeScreens: {
                    'screen_1': {
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
                    screen: screens[1]
                }]
            }})
        ],
        [
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[1]],
                elementsBySide: {
                    center: screens[0].toString(),
                    left: screens[1].toString(),
                    top: screens[0].toString(),
                    right: screens[1].toString(),
                    bottom:screens[0].toString()
                },
                sides: {
                    left: screens[1],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {
                        left: screens[1]
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
                    screen: screens[1]
                }, {
                    lastScreen: screens[1],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[1]
                }]
            }})
        ],
        [
            move('bottom'),
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[1]],
                elementsBySide: {
                    center: screens[0].toString(),
                    left: screens[1].toString(),
                    top: screens[0].toString(),
                    right: screens[1].toString(),
                    bottom:screens[0].toString()
                },
                sides: {
                    left: screens[1],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {
                        left: screens[1],
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
                    screen: screens[1]
                }, {
                    lastScreen: screens[1],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[1]
                }, {
                    lastScreen: screens[1],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[0]
                }]
            }})
        ]
    ]);
    t5.start(initEach(core.nop, 5, {
        isDirectedGraph: false
    }));
    
    var t6 = new core.TestsWrapper('Complex6');
    t6.addTestsSerial('test6', init(function () {
        screens[0].pushChildren([screens[1], screens[2]]);
    }, {
        cyclicStep: false
    }), [
        [
            core.nopDone,
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[2]],
                elementsBySide: {
                    center: screens[0].toString(),
                    right: screens[2].toString()
                },
                sides: {
                    left: undefined,
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[2],
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
                screens: [screens[2]],
                elementsBySide: {
                    center: screens[0].toString(),
                    right: screens[2].toString()
                },
                sides: {
                    left: undefined,
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[2],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': { // todo почему пусто?
                    }
                },
                history: []
            }})
        ],
        [
            move('top'),
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[2]],
                elementsBySide: {
                    center: screens[0].toString(),
                    right: screens[2].toString()
                },
                sides: {
                    left: undefined,
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[2],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {
                    }
                },
                history: []
            }})
        ],
        [
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[2],
                screens: [screens[0], screens[1]],
                elementsBySide: {
                    center: screens[2].toString(),
                    left: screens[0].toString(),
                    top: screens[1].toString()
                },
                sides: {
                    left: screens[0],
                    top: screens[1],
                    topCycled: screens[1],
                    right: undefined,
                    bottom: undefined,
                    bottomCycled: screens[1]
                },
                relativeScreens: {
                    'screen_1': {// todo пусто?
                    }
                },
                history: [{
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
                curScreen: screens[2],
                screens: [screens[0], screens[1]],
                elementsBySide: {
                    center: screens[2].toString(),
                    left: screens[0].toString(),
                    top: screens[1].toString()
                },
                sides: {
                    left: screens[0],
                    top: screens[1],
                    topCycled: screens[1],
                    right: undefined,
                    bottom: undefined,
                    bottomCycled: screens[1]
                },
                relativeScreens: {
                    'screen_1': { // todo пусто?
                    }
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                }]
            }})
        ]
    ]);
    t6.start(initEach(core.nop, 5, {
        defaultChildIndex: 1
    }));

    var t7 = new core.TestsWrapper('Complex7');
    t7.addTestsSerial('test7', init(function () {
        screens[0].pushChild(screens[1]);
        screens[1].pushChild(screens[2]);
        screens[2].pushChild(screens[3]);
        screens[3].pushChild(screens[4]);
        screens[4].pushChild(screens[0]);
    }, {
        maxHistoryLength: 2,
        saveHistoryInPool: true
    }), [
        [
            core.nopDone,
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[4], screens[1]],
                elementsBySide: {
                    center: screens[0].toString(),
                    left: screens[4].toString(),
                    top: screens[0].toString(),
                    right: screens[1].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: screens[4],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
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
                curScreen: screens[4],
                screens: [screens[3], screens[0]],
                elementsBySide: {
                    center: screens[4].toString(),
                    left: screens[3].toString(),
                    top: screens[4].toString(),
                    right: screens[0].toString(),
                    bottom: screens[4].toString()
                },
                sides: {
                    left: screens[3],
                    top: undefined,
                    topCycled: screens[4],
                    right: screens[0],
                    bottom: undefined,
                    bottomCycled: screens[4]
                },
                relativeScreens: {
                    'screen_1': {
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
                curScreen: screens[4],
                screens: [screens[3], screens[0]],
                elementsBySide: {
                    center: screens[4].toString(),
                    left: screens[3].toString(),
                    top: screens[4].toString(),
                    right: screens[0].toString(),
                    bottom: screens[4].toString()
                },
                sides: {
                    left: screens[3],
                    top: undefined,
                    topCycled: screens[4],
                    right: screens[0],
                    bottom: undefined,
                    bottomCycled: screens[4]
                },
                relativeScreens: {
                    'screen_1': {
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
                    screen: screens[4]
                }]
            }})
        ],
        [
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[4], screens[1]],
                elementsBySide: {
                    center: screens[0].toString(),
                    left: screens[4].toString(),
                    top: screens[0].toString(),
                    right: screens[1].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: screens[4],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_5': {
                        right: screens[0],
                        bottom: screens[4] // todo да откуда это берется то??
                    }
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'left',
                    side: 'bottom',
                    screen: screens[4]
                }, {
                    lastScreen: screens[4],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[4]
                }]
            }})
        ],
        [
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[1],
                screens: [screens[4], screens[0], screens[2]],
                elementsBySide: {
                    center: screens[1].toString(),
                    left: screens[0].toString(),
                    top: screens[1].toString(),
                    right: screens[2].toString(),
                    bottom: screens[1].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[1],
                    right: screens[2],
                    bottom: undefined,
                    bottomCycled: screens[1]
                },
                relativeScreens: {
                    'screen_5': {
                        right: screens[0],
                        bottom: screens[4] // todo да откуда это берется то??
                    },
                    'screen_1': {
                        left: screens[4]
                    }
                },
                history: [{
                    lastScreen: screens[4],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[4]
                }, {
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                }]
            }})
        ],
        [
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[2],
                screens: [screens[0], screens[1], screens[3]],
                elementsBySide: {
                    center: screens[2].toString(),
                    left: screens[1].toString(),
                    top: screens[2].toString(),
                    right: screens[3].toString(),
                    bottom: screens[2].toString()
                },
                sides: {
                    left: screens[1],
                    top: undefined,
                    topCycled: screens[2],
                    right: screens[3],
                    bottom: undefined,
                    bottomCycled: screens[2]
                },
                relativeScreens: {
                    'screen_1': { // todo а куда делся то screen_5 ??
                        left: screens[4]
                    }
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                }, {
                    lastScreen: screens[1],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[1]
                }]
            }})
        ],
        [
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[3],
                screens: [screens[1], screens[2], screens[4]],
                elementsBySide: {
                    center: screens[3].toString(),
                    left: screens[2].toString(),
                    top: screens[3].toString(),
                    right: screens[4].toString(),
                    bottom: screens[3].toString()
                },
                sides: {
                    left: screens[2],
                    top: undefined,
                    topCycled: screens[3],
                    right: screens[4],
                    bottom: undefined,
                    bottomCycled: screens[3]
                },
                relativeScreens: {
                    'screen_1': {
                        left: screens[4]
                    }
                },
                history: [{
                    lastScreen: screens[1],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[1]
                }, {
                    lastScreen: screens[2],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[2]
                }]
            }})
        ],
        [
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[4],
                screens: [screens[2], screens[3], screens[0]],
                elementsBySide: {
                    center: screens[4].toString(),
                    left: screens[3].toString(),
                    top: screens[4].toString(),
                    right: screens[0].toString(),
                    bottom: screens[4].toString()
                },
                sides: {
                    left: screens[3],
                    top: undefined,
                    topCycled: screens[4],
                    right: screens[0],
                    bottom: undefined,
                    bottomCycled: screens[4]
                },
                relativeScreens: {
                    'screen_1': {
                        left: screens[4]
                    }
                },
                history: [{
                    lastScreen: screens[2],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[2]
                }, {
                    lastScreen: screens[3],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[3]
                }]
            }})
        ],
        [
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[3], screens[4], screens[1]],
                elementsBySide: {
                    center: screens[0].toString(),
                    left: screens[4].toString(),
                    top: screens[0].toString(),
                    right: screens[1].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: screens[4],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {
                        left: screens[4]
                    }
                },
                history: [{
                    lastScreen: screens[3],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[3]
                }, {
                    lastScreen: screens[4],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[4]
                }]
            }})
        ]
    ]);
    t7.start(initEach(core.nop, 5));

    var t8 = new core.TestsWrapper('Complex8');
    t8.addTestsSerial('test8', init(function () {
        screens[0].pushChildren([screens[1], screens[2], screens[3], screens[4]]);
        screens[4].pushChildren([screens[0]]);
    }), [
        [
            core.nopDone,
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[1], screens[4]],
                elementsBySide: {
                    center: screens[0].toString(),
                    left: screens[4].toString(),
                    top: screens[0].toString(),
                    right: screens[1].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: screens[4],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {}
                },
                history: []
            }})
        ],[
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[1],
                screens: [screens[0], screens[2], screens[4]],
                elementsBySide: {
                    center: screens[1].toString(),
                    left: screens[0].toString(),
                    top: screens[4].toString(),
                    bottom: screens[2].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[4],
                    right: undefined,
                    bottom: screens[2],
                    bottomCycled: screens[2]
                },
                relativeScreens: {
                    'screen_1': {}
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                }]
            }})
        ],[
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[1],
                screens: [screens[0], screens[2], screens[4]],
                elementsBySide: {
                    center: screens[1].toString(),
                    left: screens[0].toString(),
                    top: screens[4].toString(),
                    bottom: screens[2].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[4],
                    right: undefined,
                    bottom: screens[2],
                    bottomCycled: screens[2]
                },
                relativeScreens: {
                    'screen_1': {}
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                }]
            }})
        ],[
            move('bottom'),
            checkComplex(function() { return {
                curScreen: screens[2],
                screens: [screens[0], screens[1], screens[3]],
                elementsBySide: {
                    center: screens[2].toString(),
                    left: screens[0].toString(),
                    top: screens[1].toString(),
                    bottom: screens[3].toString()
                },
                sides: {
                    left: screens[0],
                    top: screens[1],
                    topCycled: screens[1],
                    right: undefined,
                    bottom: screens[3],
                    bottomCycled: screens[3]
                },
                relativeScreens: {
                    'screen_1': {}
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[1]
                }]
            }})
        ],[
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[2],
                screens: [screens[0], screens[1], screens[3]],
                elementsBySide: {
                    center: screens[2].toString(),
                    left: screens[0].toString(),
                    top: screens[1].toString(),
                    bottom: screens[3].toString()
                },
                sides: {
                    left: screens[0],
                    top: screens[1],
                    topCycled: screens[1],
                    right: undefined,
                    bottom: screens[3],
                    bottomCycled: screens[3]
                },
                relativeScreens: {
                    'screen_1': {}
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[1]
                }]
            }})
        ],[
            move('bottom'),
            checkComplex(function() { return {
                curScreen: screens[3],
                screens: [screens[0], screens[2], screens[4]],
                elementsBySide: {
                    center: screens[3].toString(),
                    left: screens[0].toString(),
                    top: screens[2].toString(),
                    bottom: screens[4].toString()
                },
                sides: {
                    left: screens[0],
                    top: screens[2],
                    topCycled: screens[2],
                    right: undefined,
                    bottom: screens[4],
                    bottomCycled: screens[4]
                },
                relativeScreens: {
                    'screen_1': {}
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[1]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[2]
                }]
            }})
        ],[
            move('bottom'),
            checkComplex(function() { return {
                curScreen: screens[4],
                screens: [screens[0], screens[3], screens[1]],
                elementsBySide: {
                    center: screens[4].toString(),
                    left: screens[0].toString(),
                    top: screens[3].toString(),
                    right: screens[0].toString(),
                    bottom: screens[1].toString()
                },
                sides: {
                    left: screens[0],
                    top: screens[3],
                    topCycled: screens[3],
                    right: screens[0],
                    bottom: undefined,
                    bottomCycled: screens[1]
                },
                relativeScreens: {
                    'screen_1': {}
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[1]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[2]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[3]
                }]
            }})
        ],[
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[4], screens[1]],
                elementsBySide: {
                    center: screens[0].toString(),
                    left: screens[4].toString(),
                    top: screens[0].toString(),
                    right: screens[1].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: screens[4],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {
                        left: screens[4]
                    }
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[1]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[2]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[3]
                },{
                    lastScreen: screens[4],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[4]
                }]
            }})
        ],[
            move('left'),
            checkComplex(function() { return {
                curScreen: screens[4],
                screens: [screens[0], screens[3]],
                elementsBySide: {
                    center: screens[4].toString(),
                    left: screens[0].toString(),
                    top: screens[3].toString(), //todo почему 3 а не 4 ? для 0 парент только один 4
                    right: screens[0].toString(),
                    bottom: screens[4].toString()
                },
                sides: {
                    left: screens[0],
                    top: undefined,
                    topCycled: screens[4],
                    right: screens[0],
                    bottom: undefined,
                    bottomCycled: screens[4]
                },
                relativeScreens: {
                    'screen_1': {
                        left: screens[4]
                    }
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[1]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[2]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[3]
                },{
                    lastScreen: screens[4],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[4]
                },{
                    lastScreen: screens[0],
                    lastSide: 'left',
                    side: 'right',
                    screen: screens[0]
                }]
            }})
        ],[
            move('left'),
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[4]],
                elementsBySide: {
                    center: screens[0].toString(),
                    left: screens[4].toString(),
                    top: screens[0].toString(), //todo почему 3 а не 4 ? для 0 парент только один 4
                    right: screens[4].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: screens[4],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {
                        left: screens[4],
                        right: screens[4]
                    }
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[1]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[2]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[3]
                },{
                    lastScreen: screens[4],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[4]
                },{
                    lastScreen: screens[0],
                    lastSide: 'left',
                    side: 'right',
                    screen: screens[0]
                },{
                    lastScreen: screens[4],
                    lastSide: 'left',
                    side: 'right',
                    screen: screens[4]
                }]
            }})
        ],[
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[4],
                screens: [screens[0], screens[4], screens[1]],
                elementsBySide: {
                    center: screens[4].toString(),
                    left: screens[0].toString(),
                    top: screens[3].toString(),
                    right: screens[0].toString(),
                    bottom: screens[1].toString()
                },
                sides: {
                    left: screens[0],
                    top: screens[3],
                    topCycled: screens[3],
                    right: screens[0],
                    bottom: undefined,
                    bottomCycled: screens[1]
                },
                relativeScreens: {
                    'screen_1': {
                        left: screens[4],
                        right: screens[4]
                    }
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[1]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[2]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[3]
                },{
                    lastScreen: screens[4],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[4]
                },{
                    lastScreen: screens[0],
                    lastSide: 'left',
                    side: 'right',
                    screen: screens[0]
                },{
                    lastScreen: screens[4],
                    lastSide: 'left',
                    side: 'right',
                    screen: screens[4]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                }]
            }})
        ],[
            move('right'),
            checkComplex(function() { return {
                curScreen: screens[0],
                screens: [screens[4]],
                elementsBySide: {
                    center: screens[0].toString(),
                    left: screens[4].toString(),
                    top: screens[0].toString(),
                    right: screens[4].toString(),
                    bottom: screens[0].toString()
                },
                sides: {
                    left: screens[4],
                    top: undefined,
                    topCycled: screens[0],
                    right: screens[1],
                    bottom: undefined,
                    bottomCycled: screens[0]
                },
                relativeScreens: {
                    'screen_1': {
                        left: screens[4],
                        right: screens[4]
                    }
                },
                history: [{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[1]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[2]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'top',
                    screen: screens[3]
                },{
                    lastScreen: screens[4],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[4]
                },{
                    lastScreen: screens[0],
                    lastSide: 'left',
                    side: 'right',
                    screen: screens[0]
                },{
                    lastScreen: screens[4],
                    lastSide: 'left',
                    side: 'right',
                    screen: screens[4]
                },{
                    lastScreen: screens[0],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[0]
                },{
                    lastScreen: screens[4],
                    lastSide: 'right',
                    side: 'left',
                    screen: screens[4]
                }]
            }})
        ] // todo 10 x moveBack()
    ]);
    t8.start(initEach(core.nop, 5));
});
