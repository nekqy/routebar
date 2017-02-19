define(['utils', 'screenModel', 'IPlugin'], function(Utils, Screen, IPlugin) {
    "use strict";

    function ScreenManager() {
        this._history = [];
        this._curScreen = undefined;
        this._relativeScreens = {};
        this._relativeUpdateFn = this._updateRelativeScreen.bind(this);
        Screen.registerRelativeUpdateFn(this._relativeUpdateFn);
    }
    Utils.inherite(ScreenManager, IPlugin);
    ScreenManager.prototype.configure = function(config) {
        function fixLength(historyLength) {
            return (typeof historyLength === 'number' && historyLength >= 0) ? historyLength : 10;
        }

        if (typeof config === 'object') {
            if (config.maxHistoryLength !== undefined) {
                this._maxHistoryLength = fixLength(config.maxHistoryLength);
            }
            if (config.isDirectPath !== undefined) {
                this._isDirectPath = config.isDirectPath;
            }
1            if (config.cyclicStep !== undefined) {
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

    ScreenManager.prototype.updateScreens = function(side, screen, isSaveHistory) {
        var updated = false;
        if (screen) {
            if (this._curScreen !== screen) {
                updated = true;
            }
            this._curScreen = screen;
        } else if (this.getRelativeScreen(side)) {
            var prevScreen = this._curScreen;
            this._curScreen = this.getRelativeScreen(side);

            if (prevScreen !== this._curScreen) {
                this._setRelativeScreen(this._curScreen, Utils.oppositeSide(side), prevScreen);
                updated = true;
            }
        }

        if (updated && isSaveHistory !== false) {
            this._history.push({
                screen: this._curScreen,
                side: Utils.oppositeSide(side)
            });
            if (this._history.length > this._maxHistoryLength) {
                this._history.shift();
            }
        }

        return this._curScreen;
    };

    ScreenManager.prototype._getRelativeScreenByScreen = function(screen, side) {
        if (!(screen instanceof Screen)) {
            throw new Error('ScreenManager module - _getRelativeScreenByScreen - wrong baseScreen arg');
        }
        if (Utils.sidesWithCenter.indexOf(side) === -1) {
            throw new Error('ScreenManager module - _getRelativeScreenByScreen - wrong side arg: ' + side);
        }

        var id = screen.toString();
        if (!this._relativeScreens[id]) {
            this._relativeScreens[id] = {};
        }

        if (side === 'center') {
            return screen;
        }
        if (side === 'left') {
            //if (screen._parents.length) {
                return this._relativeScreens[id]['left'] || this._getLeft(screen);
            //} else {
            //    return null;
            //}
        }
        if (side === 'top') {
            //if (screen._prev) {
                return this._relativeScreens[id]['top'] || this._getTop(screen, this._cyclicStep);
            //} else {
            //    return null;
            //}
        }
        if (side === 'right') {
            //if (screen._children.length) {
                return this._relativeScreens[id]['right'] || this._getRight(screen);
            //} else {
            //    return null;
            //}
        }
        if (side === 'bottom') {
            //if (screen._next) {
                return this._relativeScreens[id]['bottom'] || this._getBottom(screen, this._cyclicStep);
            //} else {
            //    return null;
            //}
        }
        return null;
    };
    ScreenManager.prototype._setRelativeScreen = function(baseScreen, side, screen) {
        if (Utils.sides.indexOf(side) === -1) {
            throw new Error('ScreenManager module - _setRelativeScreen - wrong side arg: ' + side);
        }
        if (!(baseScreen instanceof Screen)) {
            throw new Error('ScreenManager module - _setRelativeScreen - wrong baseScreen arg');
        }
        if (!(screen instanceof Screen)) {
            throw new Error('ScreenManager module - _setRelativeScreen - wrong screen arg');
        }

        var id = baseScreen.toString();
        if (!this._relativeScreens[id]) {
            this._relativeScreens[id] = {};
        }

        this._relativeScreens[id][side] = screen;
    };
    ScreenManager.prototype._updateRelativeScreen = function(screen) {
        if (!(screen instanceof Screen)) {
            throw new Error('ScreenManager module - _updateRelativeScreen - wrong screen arg');
        }
        var id = screen.toString();

        if (!this._relativeScreens[id]) {
            this._relativeScreens[id] = {};
        }

        if (!this._getRight(screen)) {
            this._relativeScreens[id]['right'] = null;
        }
        if (!this._getLeft(screen)) {
            this._relativeScreens[id]['left'] = null;
        }
        if (!this._getBottom(screen, this._cyclicStep)) {
            this._relativeScreens[id]['bottom'] = null;
        }
        if (!this._getTop(screen, this._cyclicStep)) {
            this._relativeScreens[id]['top'] = null;
        }
    };

    ScreenManager.prototype.getCurScreen = function() {
        return this._curScreen;
    };
    ScreenManager.prototype.getRelativeScreen = function(side) {
        return this._getRelativeScreenByScreen(this._curScreen, side);
    };
    ScreenManager.prototype.clearHistory = function() {
        this._history = [];
    };
    ScreenManager.prototype.popHistory = function() {
        return this._history.pop();
    };
    ScreenManager.prototype._containsHistory = function(screen) {
        return this._history.some(function(val) {
            return val.screen === screen;
        });
    };

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
                            .concat(node._parents)
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

    ScreenManager.prototype.destroy = function() {
        Screen.unregisterRelativeUpdateFn(this._relativeUpdateFn);
        this._history = null;
        this._curScreen = null;
        this._relativeScreens = null;
    };

    return ScreenManager;
});