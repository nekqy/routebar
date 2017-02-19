define(['errors', 'IPlugin', 'screenModel', 'animation', 'screenManager', 'baseDispatcher', 'controlManager', 'swipesControl', 'arrowsControl', 'keydownControl', 'elementsPool', 'utils'], function(
    Errors, IPlugin, ScreenModel, Animation, ScreenManager, BaseDispatcher, ControlManager, SwipesControl, ArrowsControl, KeydownControl, ElementsPool, Utils) {
    "use strict";

    var sides = Utils.sidesWithCenter;

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
                .add('swipes', new SwipesControl(mainDiv,this._moveByActionValue.bind(this)));
        } else {
            this._controlManager
                .add('arrows', new ArrowsControl(mainDiv, this._moveByActionValue.bind(this), this.afterRenderDispatcher))
                .add('keyboard', new KeydownControl(mainDiv, this._moveByActionValue.bind(this)));
        }

        this._plugins = [];
        //SmartResizer(mainDiv, mainDiv.width(), mainDiv.height());

        this.resetConfig();
        this._loadingPromise = this.setScreen(startScreen || ScreenModel.getMainScreen(), false);
        this._controlManager.enableAll();
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
            hideArrowsAfterTime: true,
            hideArrowsTime: 2000,
            showArrowsOutside: true,
            showArrowsOnHover: true,
            loadingHtml: '<div class="rb__loading_wrapper"><div class="rb__loader"></div></div>',
            //http://www.javascripter.net/faq/keycodes.htm
            //https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
            leftKey: [37, 'a'],
            topKey: [38, 'w'],
            rightKey: [39, 'd'],
            bottomKey: [40, 's'],
            maxHistoryLength: 10,
            lockControls: false,
            showAdjacentScreens: true,
            saveHistoryInPool: false,
            pointersForSwipe: 1,
            isDirectPath: true,

            cyclicStep: true,

            getRight: function(screen) {
                var childIndex = screen.defaultChildIndex();
                return screen.getChild(childIndex);
            },
            getLeft: function(screen) {
                var parentIndex = screen.defaultParentIndex();
                return screen.getParent(parentIndex);
            },
            getTop: function(screen, cyclicStep) {
                var parent = screen.getParent(0);
                if (parent) {
                    var index = parent.getChildIndex(screen);
                    return parent.getChild(index - 1, cyclicStep);
                }
            },
            getBottom: function(screen, cyclicStep) {
                var parent = screen.getParent(0);
                if (parent) {
                    var index = parent.getChildIndex(screen);
                    return parent.getChild(index + 1, cyclicStep);
                }
            }
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

        if (config.loadingHtml) {
            config.loadingDiv = '<div class="rb__loading">' + config.loadingHtml + '</div>';
        } else if (typeof config.loadingHtml !== 'undefined') {
            config.loadingDiv = '';
        }

        this.beforeMoveDispatcher.configure(config);
        this.beforeRenderDispatcher.configure(config);
        this.afterRenderDispatcher.configure(config);

        if (typeof config === 'object') {
            if (config.lockControls !== undefined) {
                this._lockControls = config.lockControls;
            }
            if (config.cyclicStep !== undefined) {
                this._cyclicStep = config.cyclicStep;
            }
            if (config.getLeft !== undefined) {
                this._getLeft = config.getLeft;
            }
            if (config.getRight !== undefined) {
                this._getRight = config.getRight;
            }
            if (config.getTop !== undefined) {
                this._getTop = config.getTop;
            }
            if (config.getBottom !== undefined) {
                this._getBottom = config.getBottom;
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
        function check(value, checkValues) {
            var res;
            if (Array.isArray(checkValues)) {
                res = checkValues.find(function(checkValue) {
                    return mapFn(value, checkValue);
                });
                res = res !== undefined;
            } else {
                res = mapFn(value, checkValues);
            }
            return res;
        }

        var side;
        if (check(value, ltrbValues[0])) side = 'left';
        else if (check(value, ltrbValues[1])) side = 'top';
        else if (check(value, ltrbValues[2])) side = 'right';
        else if (check(value, ltrbValues[3])) side = 'bottom';
        return this.move(side);
    };
    Moving.prototype.moveBack = function() {
        var lastStep = this._screenManager.popHistory();
        if (lastStep) {
            return this.move(lastStep.side, lastStep.screen, false);
        }
        return null;
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
        function firstStep(path) {
            return new Promise(function(resolve, reject) {
                nextStep(path, 0, resolve, reject);
            });
        }
        function nextStep(path, i, resolve, reject) {
            if (!path) {
                self._controlManager.enableByValues(locks);
                reject(new Errors.PathNotFoundError('goToScreen : path not found'));
                return;
            }
            if (i === path.length - 1) {
                self._controlManager.enableByValues(locks);
                resolve();
                return;
            }
            if ( i > path.length - 1) {
                self._controlManager.enableByValues(locks);
                reject(new Errors.FatalError('goToScreen : i > path.length - 1'));
                return;
            }

            var curScreen = path[i],
                nextScreen = path[i+1],
                side;

            if (curScreen._children.indexOf(nextScreen) !== -1) {
                side = 'right';
            } else if (curScreen._parents.indexOf(nextScreen) !== -1) {
                side = 'left';
            } else if (self._getBottom(curScreen, self._cyclicStep) === nextScreen) {
                side = 'bottom';
            } else if (self._getTop(curScreen, self._cyclicStep) === nextScreen) {
                side = 'top';
            } else {
                self._controlManager.enableByValues(locks);
                reject(new Errors.FatalError('goToScreen : side not found'));
            }

            self._screenManager._setRelativeScreen(self._screenManager.getCurScreen(), side, nextScreen);

            self.afterRenderDispatcher.add(function() {
                self.afterRenderDispatcher.add(function() {
                    nextStep(path, i+1, resolve, reject);
                }, true);
                self.move(side);
            }, true);

            self.setScreen(curScreen, false);
        }
        var self = this,
            locks = this._controlManager.disableAll(),
            path = this._screenManager.findShortestPath(this._screenManager.getCurScreen(), screen);

        return firstStep(path);
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
