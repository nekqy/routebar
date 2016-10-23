define(['IPlugin', 'screenModel', 'animation', 'screenManager', 'baseDispatcher', 'controlManager', 'swipesControl', 'arrowsControl', 'keydownControl', 'elementsPool', 'utils'], function(
    IPlugin, ScreenModel, Animation, ScreenManager, BaseDispatcher, ControlManager, SwipesControl, ArrowsControl, KeydownControl, ElementsPool, Utils) {
    "use strict";

    var sides = ['center', 'left', 'top', 'right', 'bottom'];

    function Moving(mainDiv, startScreen) {
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

        this._plugins = [];
        //SmartResizer(mainDiv, mainDiv.width(), mainDiv.height());

        this._loadingPromise = this.setScreen(startScreen || ScreenModel.getMainScreen(), false);
        this.resetConfig();
        //if (mainDiv.length) {
        //    mainDiv[0].moving = this;
        //}

        var self = this;

        this._clickHandler = function(e) {
            if ($(e.target).closest('.rb').length && !$(document.activeElement).closest('.rb').length) {
                self.activate();
            }
        };
        mainDiv.on('click', this._clickHandler);
    }
    Moving.prototype.resetConfig = function() {
        this.configure({
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
            pointersForSwipe: 1,
            isDirectPath: true
        });
    };

    Moving.prototype.configure = function(config) {
        if (!config) return;

        this._plugins.forEach(function(plugin) {
            plugin.configure(config);
        });

        this._animation.configure(config);
        this._elementsPool.configure(config);
        this._screenManager.configure(config);
        this._controlManager.configure(config);

        config.loadingDiv = config.loadingHtml ? '<div class="rb__loading">' + config.loadingHtml + '</div>' : null;

        this.beforeMoveDispatcher.configure(config);
        this.beforeRenderDispatcher.configure(config);
        this.afterRenderDispatcher.configure(config);

        if (typeof config === 'object') {
            if (config.lockControls !== undefined) {
                this._lockControls = config.lockControls;
            }
        }
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

        this._screenManager.updateScreens('center', screen, isSaveHistory);

        return new Promise(function (moveResolve, moveReject) {

            if (!self._screenManager.getRelativeScreen(side)) {
                self._animation.goToWrongSide(side).then(function(result) {
                    if (result) {
                        self._renderHtml(side, moveResolve.bind(undefined, {
                            how: 'wrongSide',
                            isOk: result
                        }));
                    }
                });
            } else if (side === 'center') {
                self._elementsPool.prepareSide(side);
                self._animation.goToCenter();
                self._renderHtml(side, moveResolve.bind(undefined, {
                    how: 'center',
                    isOk: true
                }));
            } else if (sides.indexOf(side) !== -1) {
                self._screenManager.updateScreens(side, undefined, isSaveHistory);
                self._elementsPool.prepareSide();

                self._animation.goToCorrectSide(side).then(function(result) {
                    if (result) {
                        self._renderHtml(side, moveResolve.bind(undefined, {
                            how: 'correctSide',
                            isOk: result
                        }));
                    }
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

    Moving.prototype._renderHtml = function(side, moveResolve) {
        var self = this,
            args = [side, self._screenManager.getCurScreen(), self];

        function afterRender() {
            self.activate();
            self.afterRenderDispatcher._runActions(Utils.nop, args);
            if (self._lockControls) {
                self._controlManager.enableByValues(self._locks);
                self._locks = null;
            }
            moveResolve();
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

    Moving.prototype.goToScreen = function(screen) {
        function nextStep(path, i) {
            if (i+1 >= path.length) {
                self._controlManager.enableByValues(locks);
                return;
            }

            var curScreen = path[i],
                nextScreen = path[i+1],
                side;

            if (curScreen._children.indexOf(nextScreen) !== -1) {
                side = 'right';
            } else if (curScreen._parents.indexOf(nextScreen) !== -1) {
                side = 'left';
            } else if (curScreen._next === nextScreen) {
                side = 'bottom';
            } else if (curScreen._prev === nextScreen) {
                side = 'top';
            } else {
                throw new Error('goToScreen : side not found');
            }

            self._screenManager._setRelativeScreen(self._screenManager.getCurScreen(), side, nextScreen);

            self.afterRenderDispatcher.add(function() {
                self.afterRenderDispatcher.add(function() {
                    nextStep(path, i+1);
                }, true);
                self.move(side);
            }, true);

            self.setScreen(curScreen, false);
        }
        var self = this,
            locks = this._controlManager.disableAll(),
            path = this._screenManager.findShortestPath(this._screenManager.getCurScreen(), screen);

        nextStep(path, 0);
    };

    Moving.prototype.addPlugin = function(plugin) {
        if (plugin instanceof IPlugin) {
            this._plugins.push(plugin);
        } else {
            console.error('Moving - addPlugin - argument must be IPlugin');
        }
    };
    Moving.prototype.removePlugin = function(plugin) {
        var index = this._plugins.indexOf(plugin);
        if (index != -1) {
            plugin.destroy();
            this._plugins.splice(index, 1);
        }
    };

    Moving.prototype.destroy = function() {
        this._plugins.forEach(function(plugin) {
            plugin.destroy();
        });

        this.beforeMoveDispatcher.destroy();
        this.beforeRenderDispatcher.destroy();
        this.afterRenderDispatcher.destroy();
        this._animation.destroy();
        this._controlManager.destroy();
        this._screenManager.destroy();
        this._elementsPool.destroy();
        this._animation = null;
        this._elementsPool = null;
        this._screenManager = null;
        this._controlManager = null;
        this.beforeMoveDispatcher = null;
        this.beforeRenderDispatcher = null;
        this.afterRenderDispatcher = null;

        this._mainDiv.off('click', this._clickHandler);
        this._mainDiv.remove();
    };

    return Moving;
});
