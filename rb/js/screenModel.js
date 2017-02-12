define([], function() {
    "use strict";

    function Screen(html, children, parents, isPermanent, isDirectedGraph, doChildrenCyclic, doParentsCyclic) {
        if (!Screen._mainScreenSetted) {
            Screen._mainScreen = this;
        }

        this._children = [];
        this._parents = [];

        if (Array.isArray(html)) {
            doParentsCyclic = html[6];
            doChildrenCyclic = html[5];
            isDirectedGraph = html[4];
            isPermanent = html[3];
            parents = html[2];
            children = html[1];
            html = html[0];
        } else if (typeof html === 'object') {
            doParentsCyclic = html.doParentsCyclic;
            doChildrenCyclic = html.doChildrenCyclic;
            isDirectedGraph = html.isDirectedGraph;
            isPermanent = html.isPermanent;
            parents = html.parents;
            children = html.children;
            html = html.html;
        } else if (typeof html !== 'string') {
            html = '';
        }

        if (isPermanent === undefined) {
            isPermanent = Screen.isPermanent;
        }
        if (isDirectedGraph === undefined) {
            isDirectedGraph = Screen.isDirectedGraph;
        }
        if (doChildrenCyclic === undefined) {
            doChildrenCyclic = Screen.doChildrenCyclic;
        }
        if (doParentsCyclic === undefined) {
            doParentsCyclic = Screen.doParentsCyclic;
        }

        this._id = 'screen_' + Screen._length++;
        this.html = html; // TODO на изменение html изменять элементы
        this.setChildren(children);
        this.setParents(parents);
        this._temporary = !isPermanent; // Todo на изменение тут менять и там где используется
        this._isDirectedGraph = !!isDirectedGraph; // Todo на изменение тут менять и там где используется
        this.doChildrenCyclic(doChildrenCyclic);
        this.doParentsCyclic(doParentsCyclic);
    }
    Screen.configure = function(config) {
        Screen.isPermanent = config.isPermanent;
        Screen.isDirectedGraph = config.isDirectedGraph;
        Screen.doChildrenCyclic = config.doChildrenCyclic;
        Screen.doParentsCyclic = config.doParentsCyclic;
    };
    Screen.configure({
        isPermanent: false,
        isDirectedGraph: false,
        doChildrenCyclic: true,
        doParentsCyclic: true
    });

    Screen.prototype.toString = function() {
        return this._id;
    };
    Screen.prototype.isTemporary = function() {
        return this._temporary;
    };
    Screen.prototype.isDirectedGraph = function() {
        return this._isDirectedGraph;
    };

    Screen.prototype._addScreen = function(screen, arr, oppositeArr, doCyclic) {
        if (!this._isDirectedGraph) {
            oppositeArr.push(this);
        }
        if (doCyclic) {
            if (arr.length === 0) {
                screen._next = null; // TODO может = screen?
                screen._prev = null;
            } else {
                screen._next = arr.length ? arr[0] : screen;
                screen._prev = arr.length ? arr[arr.length-1] : screen;
                screen._next._prev = screen;
                screen._prev._next = screen;
            }
        } else {
            if (arr.length === 0) {
                screen._next = null;
                screen._prev = null;
            } else {
                screen._next = null;
                screen._prev = arr[arr.length-1];
                screen._prev._next = screen;
            }
        }

        arr.push(screen);
        Screen._runRelativeUpdateFn(this);
        return this;
    };
    Screen.prototype.addChild = function(child) {
        return this._addScreen(child, this._children, child._parents, this._doChildrenCyclic);
    };
    Screen.prototype.addParent = function(parent) {
        return this._addScreen(parent, this._parents, parent._children, this._doParentsCyclic);
    };
    Screen.prototype.addChildren = function(children) {
        if (children && Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
                this.addChild(children[i]);
            }
        }
        Screen._runRelativeUpdateFn(this);
        return this;
    };
    Screen.prototype.addParents = function(parents) {
        if (parents && Array.isArray(parents)) {
            for (var i = 0; i < parents.length; i++) {
                this.addParent(parents[i]);
            }
        }
        Screen._runRelativeUpdateFn(this);
        return this;
    };
    Screen.prototype.getChildren = function() {
        return this._children;
    };
    Screen.prototype.getParents = function() {
        return this._parents;
    };
    Screen.prototype.getChild = function(id) {
        return this._children.find(function(child) { // TODO полифилл!
            return child.toString() === id;
        });
    };
    Screen.prototype.getParent = function(id) {
        return this._parents.find(function(parent) { // TODO полифилл!
            return parent.toString() === id;
        });
    };
    Screen.prototype.setChildren = function(children) {
        return this.clearChildren().addChildren(children);
    };
    Screen.prototype.setParents = function(parents) {
        return this.clearParents().addParents(parents);
    };
    Screen.prototype._removeScreen = function(screen, arr) {
        var index = arr.indexOf(screen),
            removed;
        if (index !== -1) {
            removed = arr.splice(index, 1)[0];

            if (removed._prev === removed._next) {
                removed._prev = removed._next = null;
            } else {
                removed._prev._next = removed._next;
                removed._next._prev = removed._prev;
            }

        }
        Screen._runRelativeUpdateFn(this);
        return this;
    };
    Screen.prototype.removeChild = function(child) {
        return this._removeScreen(child, this._children);
    };
    Screen.prototype.removeParent = function(parent) {
        return this._removeScreen(parent, this._parents);
    };
    Screen.prototype._clearScreens = function(arr) {
        var child;
        if (arr && Array.isArray(arr)) {
            for (var i = 0; i < arr.length; i++) {
                child = arr[i];
                child._prev = child._next = null;
            }
        }
    };
    Screen.prototype.clearChildren = function() {
        this._clearScreens(this._children);
        this._children = [];
        Screen._runRelativeUpdateFn(this);
        return this;
    };
    Screen.prototype.clearParents = function() {
        this._clearScreens(this._parents);
        this._parents = [];
        Screen._runRelativeUpdateFn(this);
        return this;
    };

    Screen.prototype.doChildrenCyclic = function(doCyclic) {
        this._doChildrenCyclic = !!doCyclic;
        this._doCyclic(doCyclic, this._children);
    };
    Screen.prototype.doParentsCyclic = function(doCyclic) {
        this._doParentsCyclic = !!doCyclic;
        this._doCyclic(doCyclic, this._parents);
    };
    Screen.prototype._doCyclic = function(val, arr) {
        if (arr.length > 0) {
            if (val) {
                if (arr.length > 1) {
                    arr[0]._prev = arr[arr.length-1];
                    arr[arr.length-1]._next = arr[0];
                } else {
                    arr[0]._prev = null;
                    arr[arr.length-1]._next = null;
                }
            } else {
                arr[0]._prev = null;
                arr[arr.length-1]._next = null;
            }
        }
    };

    Screen._length = 1;
    Screen._relativeUpdateFn = [];
    Screen.setMainScreen = function(screen) {
        Screen._mainScreen = screen;
        Screen._mainScreenSetted = true;
    };
    Screen.getMainScreen = function() {
        return Screen._mainScreen;
    };
    Screen.registerRelativeUpdateFn = function(fn) {
        Screen._relativeUpdateFn.push(fn);
    };
    Screen.unregisterRelativeUpdateFn = function(fn) {
        Screen._relativeUpdateFn = Screen._relativeUpdateFn.filter(function(value) {
            return value !== fn;
        });
    };
    Screen.clearRelativeUpdateFn = function() {
        Screen._relativeUpdateFn = [];
    };
    Screen._runRelativeUpdateFn = function(screen) {
        Screen._relativeUpdateFn.forEach(function(fn) {
            fn.call(undefined, screen);
        });
    };

    return Screen;
});
