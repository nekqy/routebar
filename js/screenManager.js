define(['utils', 'screenModel', 'IPlugin', 'errors'], function(Utils, Screen, IPlugin, Errors) {
    "use strict";

    /**
     * @class
     * Класс-менеджер моделей контента
     * @constructor ScreenManager
     * @extends IPlugin
     */
    function ScreenManager() {
        this._history = [];
        this._curScreen = null;
        this._relativeUpdateFn = this._updateRelativeScreen.bind(this);
        Screen.registerUpdateFn(this._relativeUpdateFn);
    }
    Utils.inherite(ScreenManager, IPlugin);
    /**
     * Применить конфигурацию к панели. Учитывает опции maxHistoryLength, isDirectPath, cyclicStep, getLeft, getTop, getRight, getBottom.
     * @param {Moving~config} config - конфигурация
     * @memberOf ScreenManager
     */
    ScreenManager.prototype.configure = function(config) {
        if (typeof config === 'object') {
            if (config.maxHistoryLength !== undefined) {
                if (typeof config.maxHistoryLength === 'number' && config.maxHistoryLength >= 0) {
                    this._maxHistoryLength = config.maxHistoryLength;
                    if (this._history.length > this._maxHistoryLength) {
                        this._history = this._history.slice(this._history.length - this._maxHistoryLength);
                    }
                } else {
                    throw new Errors.ArgumentError('maxHistoryLength', config.maxHistoryLength);
                }
            }
            if (config.isDirectPath !== undefined) {
                this._isDirectPath = config.isDirectPath;
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
            if (config.savePrevious !== undefined) {
                this._savePrevious = config.savePrevious;
            }

        }
    };

    ScreenManager.prototype._updateScreens = function(side, screen, isSaveHistory) {
        var updated = false;
        if (screen) {
            if (this._curScreen !== screen) {
                updated = true;
            }
            this._curScreen = screen;
        } else if (this.getRelativeScreen(side)) {
            var prevScreen = this._curScreen;
            this._curScreen = this.getRelativeScreen(side);

            if (side !== 'center') {
                updated = true;
            }
        }

        if (updated && isSaveHistory !== false) {
            this._history.push({
                screen: prevScreen,
                side: Utils.oppositeSide(side),
                lastSide: this._lastSide,
                lastScreen: this._lastScreen
            });
            if (this._history.length > this._maxHistoryLength) {
                this._history.shift();
            }
        }

        return this._curScreen;
    };

    ScreenManager.prototype._getRelativeScreenByScreen = function(screen, side) {
        if (!(screen instanceof Screen)) {
            throw new Errors.ArgumentError('screen', screen);
        }
        if (Utils.sidesWithCenter.indexOf(side) === -1) {
            throw new Errors.ArgumentError('side', side);
        }

        if (side === 'center') {
            return screen;
        } else if (side === 'left') {
            return this._getLeft(screen);
        } else if (side === 'top') {
            return this._getTop(screen, this._cyclicStep);
        } else if (side === 'right') {
            return this._getRight(screen);
        } else if (side === 'bottom') {
            return this._getBottom(screen, this._cyclicStep);
        }
        return null;
    };
    ScreenManager.prototype._setRelativeScreen = function(side, baseScreen, targetScreen, isCheckSave, reverse) {
        if (!(targetScreen instanceof Screen)) {
            throw new Errors.ArgumentError('targetScreen', targetScreen);
        }
        if (!(baseScreen instanceof Screen)) {
            throw new Errors.ArgumentError('baseScreen', baseScreen);
        }

        var savePrevious = isCheckSave ? this._savePrevious : true;

        if (side === (reverse ? 'left' : 'right') && savePrevious) {
            var childIndex = baseScreen.getChildIndex(targetScreen);
            if (childIndex !== -1) {
                baseScreen.defaultChildIndex(childIndex);
            } else {
                throw new Errors.FatalError('Base screen is ' + baseScreen.toString() + '. Child screen not found: ', targetScreen.toString());
            }
        }
        if (side === (reverse ? 'right' : 'left') && savePrevious) {
            var parentIndex = baseScreen.getParentIndex(targetScreen);
            if (parentIndex !== -1) {
                baseScreen.defaultParentIndex(parentIndex);
            } else {
                throw new Errors.FatalError('Base screen is ' + baseScreen.toString() + '. Parent screen not found: ', targetScreen.toString());
            }
        }
    };
    ScreenManager.prototype._updateRelativeScreen = function(screen) {
        if (!(screen instanceof Screen)) {
            throw new Errors.ArgumentError('screen', screen);
        }

        if (!this._getRight(screen)) {
            screen.defaultChildIndex(0);
        }
        if (!this._getLeft(screen)) {
            screen.defaultParentIndex(0);
        }
    };

    /**
     * Возвращает модель текущей ячейки панели.
     * @returns {ScreenModel|null} модель текущей ячейки панели
     * @memberOf ScreenManager
     */
    ScreenManager.prototype.getCurScreen = function() {
        return this._curScreen;
    };
    /**
     * Возвращает модель, располагающуюся рядом с текущей ячейкой панели.
     * @param {string} side - сторона относительно текущей ячейки
     * @returns {ScreenModel|null} модель текущей ячейки панели
     * @memberOf ScreenManager
     */
    ScreenManager.prototype.getRelativeScreen = function(side) {
        return this._getRelativeScreenByScreen(this._curScreen, side);
    };
    /**
     * Очистить историю перемещений в панели.
     * @memberOf ScreenManager
     */
    ScreenManager.prototype.clearHistory = function() {
        this._history = [];
    };
    /**
     * Удаляет из истории перемещений последнее удачное перемещение в панели и возвращает модель, которая располагается в последней посещенной ячейке из истории.
     * @returns {ScreenModel} Модель из последнего удачного перемещения в истории
     * @memberOf ScreenManager
     */
    ScreenManager.prototype.popHistory = function() {
        var res = this._history.pop();
        if (res) {
            this._lastSide = res.lastSide;
            this._lastScreen = res.lastScreen;
        } else {
            this._lastSide = null;
            this._lastScreen = null;
        }
        return res;
    };
    ScreenManager.prototype._containsHistory = function(screen) {
        return this._history.some(function(val) {
            return val.screen === screen;
        });
    };

    /**
     * Поиск кратчайшего пути от одной модели до другой. Если для разных ячеек панели используются одинаковые модели, результат непредсказуем.
     * @param {ScreenModel} start - Модель, от которой начинает поиск пути
     * @param {ScreenModel} end - Конечная модель, в которую ищется путь
     * @returns {null|ScreenModel[]} Путь от начальной модели до конечной модели в панели
     * @memberOf ScreenManager
     */
    ScreenManager.prototype.findShortestPath = function (start, end) {
        function findPaths(start, end) {
            var costs = {},
                open = {'0': [start]},
                predecessors = {},
                keys;

            var addToOpen = function (cost, vertex) {
                if (!open[cost]) open[cost] = [];
                open[cost].push(vertex);
            };

            costs[start] = 0;

            while (open) {
                if(!(keys = Object.keys(open)).length) break;

                keys.sort(function (a, b) {
                    return a - b;
                });

                var key = keys[0],
                    bucket = open[key],
                    node = bucket.shift(),
                    currentCost = +key,
                    adjacentNodes;

                if (self._isDirectPath) {
                    adjacentNodes = node && node._children
                            .concat(node._parents)// todo если оставить только children будет настоящий поиск в графе
                            .concat(self._getRelativeScreenByScreen(node, 'top'))
                            .concat(self._getRelativeScreenByScreen(node, 'bottom')) || [];
                } else {
                    adjacentNodes = node && [self._getRelativeScreenByScreen(node, 'left'),
                            self._getRelativeScreenByScreen(node, 'top'),
                            self._getRelativeScreenByScreen(node, 'right'),
                            self._getRelativeScreenByScreen(node, 'bottom')
                        ] || [];
                }

                if (!bucket.length) delete open[key];

                for (var i = 0; i < adjacentNodes.length; i++) {
                    var vertex = adjacentNodes[i],
                        totalCost = currentCost + 1,
                        vertexCost = costs[vertex];

                    if ((vertexCost === undefined) || (vertexCost > totalCost)) {
                        costs[vertex] = totalCost;
                        addToOpen(totalCost, vertex);
                        predecessors[vertex] = node;
                    }
                }
            }

            if (costs[end] === undefined) {
                return null;
            } else {
                return predecessors;
            }
        }
        function extractShortest(predecessors, end) {
            var nodes = [],
                u = end;

            while (u) {
                nodes.push(u);
                u = predecessors[u];
            }

            nodes.reverse();
            return nodes;
        }

        var self = this;
        var predecessors = findPaths(start, end);
        return !predecessors ? null : extractShortest(predecessors, end);
    };

    /**
     * Уничтожить ScreenManager
     * @memberOf ScreenManager
     */
    ScreenManager.prototype.destroy = function() {
        Screen.unregisterUpdateFn(this._relativeUpdateFn);
        this._history = null;
        this._curScreen = null;
    };

    return ScreenManager;
});