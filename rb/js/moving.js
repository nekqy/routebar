define(['animation', 'screenManager', 'baseDispatcher', 'smartResizer', 'controlManager', 'swipesControl', 'arrowsControl', 'keydownControl', 'elementsPool', 'utils'], function(
    Animation, ScreenManager, BaseDispatcher, SmartResizer, ControlManager, SwipesControl, ArrowsControl, KeydownControl, ElementsPool, Utils) {
    "use strict";

    var sides = ['center', 'left', 'top', 'right', 'bottom'];

    function Moving(mainDiv) {
        if (mainDiv instanceof $) {
            this._mainDiv = mainDiv;
        } else {
            throw new Error('Moving module - init - wrong mainDiv arg: ' + mainDiv);
        }

        this.beforeMoveDispatcher = new BaseDispatcher(mainDiv);
        this.beforeRenderDispatcher = new BaseDispatcher(mainDiv);
        this.afterRenderDispatcher = new BaseDispatcher(mainDiv);
        this._screenManager = new ScreenManager();
        this._elementsPool = new ElementsPool(mainDiv, this._screenManager);
        this._animation = new Animation(mainDiv, this._elementsPool);
        this._controlManager = new ControlManager();
        if (Utils.isMobile) {
            this._controlManager
                .add('swipes', new SwipesControl(mainDiv,this._moveByActionValue.bind(this)), true);
        } else {
            this._controlManager
                .add('arrows', new ArrowsControl(mainDiv, this._moveByActionValue.bind(this), this.afterRenderDispatcher), true)
                .add('keyboard', new KeydownControl(mainDiv, this._moveByActionValue.bind(this)), true);
        }

        SmartResizer(mainDiv, mainDiv.width(), mainDiv.height());

        this.resetConfig();
        //if (mainDiv.length) {
        //    mainDiv[0].moving = this;
        //}

        var self = this;
        mainDiv.on('click', function(e) {
            if ($(e.target).closest('.rb').length && !$(document.activeElement).closest('.rb').length) {
                self.activate();
            }
        });
    }
    Moving.prototype.resetConfig = function() {
        this.configure({
            startScreen: rb.Screen.getMainScreen(),
            wrongTime1: 500,
            wrongTime2: 500,
            correctTime: 1000,
            wrongEasing1: 'easeInExpo',
            wrongEasing2: 'easeOutElastic',
            correctEasing: 'easeOutExpo',
            hideTime: 2000,
            loadingHtml: '<div class="rb__loading_wrapper"><div class="cssload-loader"></div></div>',
            leftKey: 37,
            topKey: 38,
            rightKey: 39,
            bottomKey: 40,
            maxHistoryLength: 10,
            lockControls: false,
            showAdjacentScreens: true,
            saveHistoryInPool: false,
            pointersForSwipe: 1
        });
    };

    Moving.prototype.configure = function(config) {
        if (!config) return;

        this._animation.configure(config);
        this._elementsPool.configure(config);
        this._screenManager.configure(config);

        for (var name in this._controlManager._controls) {
            if (this._controlManager._controls.hasOwnProperty(name)) {
                this._controlManager._controls[name].configure(config);
            }
        }

        config.loadingDiv = config.loadingHtml ? '<div class="rb__loading">' + config.loadingHtml + '</div>' : null;

        this.beforeMoveDispatcher.configure(config);
        this.beforeRenderDispatcher.configure(config);
        this.afterRenderDispatcher.configure(config);

        if (typeof config === 'object') {
            if (config.startScreen !== undefined) {
                this.setScreen(config.startScreen);
            }
            if (config.lockControls !== undefined) {
                this._lockControls = config.lockControls;
            }
        }

        // опции ресайзера

        // закидывать ли фокус внутрь при переходе

        // режим дебага или нет. в дебаге прикреплять к элементам их модули, выводить доп. инфу в консоль
    };

    // todo defineProperty, и вообще доступ к объектам в api сделать через defineProperty
    Moving.prototype.getControlManager = function() {
        return this._controlManager;
    };
    
    Moving.prototype.move = function(side, screen, isSaveHistory) {
        var self = this;
        if (side) {
            return Promise.race([ this.beforeMoveDispatcher._runActions(
                self._moveInner.bind(self, side, screen, isSaveHistory),
                [side, self._screenManager.getCurScreen(), self]
            ) ]);
        }
    };
    Moving.prototype._moveInner = function(side, screen, isSaveHistory) {
        var self = this;

        if (this._lockControls && !this._locks) {
            this._locks = this._controlManager.disableAll();
        }

        this._screenManager.updateScreens('center', screen, [], isSaveHistory);

        return new Promise(function (moveResolve, moveReject) {

            if (!self._screenManager.getRelativeScreen(side)) {
                self._animation.goToWrongSide(side).then(function(result) {
                    if (result) {
                        self._renderHtml(side);
                    }
                    moveResolve({
                        how: 'wrongSide',
                        isOk: result
                    });
                });
            } else if (side === 'center') {
                self._elementsPool.prepareSide(side);
                self._animation.goToCenter();
                self._renderHtml(side);
                moveResolve({
                    how: 'center',
                    isOk: true
                });
            } else if (sides.indexOf(side) !== -1) {
                self._screenManager.updateScreens(side, undefined, isSaveHistory);
                self._elementsPool.prepareSide();

                self._animation.goToCorrectSide(side).then(function(result) {
                    if (result) {
                        self._renderHtml(side);
                    }
                    moveResolve({
                        how: 'correctSide',
                        isOk: result
                    });
                });
            } else {
                moveReject(new Error('Moving module - move - wrong side arg: ' + side));
            }
        });
    };
    Moving.prototype._moveByActionValue = function(value, ltrbValues, mapFn) {
        var side;
        if (mapFn(value, ltrbValues[0])) side = 'left';
        else if (mapFn(value, ltrbValues[1])) side = 'top';
        else if (mapFn(value, ltrbValues[2])) side = 'right';
        else if (mapFn(value, ltrbValues[3])) side = 'bottom';
        return this.move(side);
    };
    Moving.prototype.moveBack = function() {
        var lastStep = this._screenManager.popHistory();
        if (lastStep) {
            this.move(lastStep.side, lastStep.screen, false);
            return true;
        }
        return false;
    };
    Moving.prototype.animateWrongSide = function(side) {
        return this._animation.goToWrongSide(side);
    };

    Moving.prototype.setScreen = function(screen, isSaveHistory) {
        return this.move('center', screen, isSaveHistory);
    };
    Moving.prototype.reload = function(side) {
        side = side || 'center';
        var rbSide = this._elementsPool.getElementBySide(side);
        var screen = this._screenManager.getRelativeScreen(side);
        rbSide.html(screen.html);
    };

    Moving.prototype._renderHtml = function(side) {
        var self = this,
            args = [side, self._screenManager.getCurScreen(), self];

        function afterRender() {
            self.activate();
            self.afterRenderDispatcher._runActions(Utils.nop, args);
            if (self._lockControls) {
                self._controlManager.enableByValues(self._locks);
                self._locks = null;
            }
        }

        this.beforeRenderDispatcher._runActions(function() {
            var iframeCount, loadedIframeCount = 0, iframes;

            iframes = self._mainDiv.find('iframe');
            self._elementsPool.loadElements();
            iframes = self._mainDiv.find('iframe').not(iframes);

            iframeCount = iframes.length;
            iframes.one('load', function() {
                loadedIframeCount++;
                if (iframeCount === loadedIframeCount) {
                    afterRender();
                }
            });

            setTimeout(function() {
                if (iframeCount === 0) {
                    afterRender();
                }
            }, 0);
        }, args);
    };

    Moving.prototype.activate = function() {
        this._mainDiv.find('.rb__fake-element').focus();
    };

    return Moving;
});
