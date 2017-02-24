define(['errors'], function(Errors) {
    "use strict";

    function Screen(html, children, parents) {
        if (!Screen._mainScreenSetted) {
            Screen._mainScreen = this;
        }

        this._children = [];
        this._parents = [];

        var isPermanent, isDirectedGraph, defaultChildIndex, defaultParentIndex;

        if (typeof html === 'object') {
            children = html.children;
            parents = html.parents;
            isPermanent = html.isPermanent;
            isDirectedGraph = html.isDirectedGraph;
            defaultChildIndex = html.defaultChildIndex;
            defaultParentIndex = html.defaultParentIndex;
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
        if (defaultChildIndex === undefined) {
            defaultChildIndex = Screen.defaultChildIndex;
        }
        if (defaultParentIndex === undefined) {
            defaultParentIndex = Screen.defaultParentIndex;
        }

        this._id = 'screen_' + Screen._length++;
        this.html = html; // TODO на изменение html изменять элементы
        this.setChildren(children);
        this.setParents(parents);
        this._temporary = !isPermanent; // Todo на изменение тут менять и там где используется
        this._isDirectedGraph = !!isDirectedGraph; // Todo на изменение тут менять и там где используется
        this._defaultChildIndex = defaultChildIndex;
        this._defaultParentIndex = defaultParentIndex;
    }

    Screen.prototype.toString = function() {
        return this._id;
    };
    Screen.prototype.isTemporary = function() {
        return this._temporary;
    };
    Screen.prototype.isDirectedGraph = function() {
        return this._isDirectedGraph;
    };
    Screen.prototype.defaultChildIndex = function() {
        return this._defaultChildIndex;
    };
    Screen.prototype.defaultParentIndex = function() {
        return this._defaultParentIndex;
    };

    Screen.prototype._addScreen = function(screen, isChild) {
        var arr = isChild ? this._children : this._parents,
            index = this._getScreenIndex(screen, arr);
        if (index !== -1) {
            return;
        }
        if (isChild) {
            this._children.push(screen);
            screen._parents.push(this);
        } else {
            this._parents.push(screen);
            screen._children.push(this);
        }
        if (!this._isDirectedGraph) {
            screen._addScreen(this, isChild);
        }

        Screen._runRelativeUpdateFn(this);
        return this;
    };
    //Screen.prototype._addScreenAfter = function(screen, after, arr, oppositeArr, cyclic) {
    //    var afterIndex = this._getScreenIndex(after, arr, cyclic);
    //
    //    if (!this._isDirectedGraph) {
    //        oppositeArr.push(this);
    //    }
    //
    //    arr.push(screen);
    //    Screen._runRelativeUpdateFn(this);
    //    return this;
    //};
    Screen.prototype._getScreenIndex = function(screen, arr, cyclic) {
        var index = -1;
        if (typeof screen === 'number') {
            if (cyclic) {
                screen = (screen + arr.length) % arr.length;
            }
            index = screen;
        } else if (typeof screen === 'string') {
            screen = arr.find(function(curScreen, curIndex) {
                if (curScreen.toString() === screen) {
                    index = curIndex;
                    return true;
                }
            });
        } else if (screen instanceof Screen) {
            index = arr.indexOf(screen);
        } else {
            new Errors.FatalError('screenModel : wrong getScreenIndex args');
        }
        return index;
    };
    Screen.prototype._removeScreen = function(screen, isChild, cyclic) {
        var arr = isChild ? this._children : this._parents,
            index = this._getScreenIndex(screen, arr, cyclic);

        if (index !== -1) {
            var removed = arr.splice(index, 1)[0];
        } else {
            return;
        }
        if (isChild) {
            removed.removeParent(this);
        } else {
            removed.removeChild(this);
        }
        if (!this._isDirectedGraph) {
            removed._removeScreen(this, isChild);
        }

        Screen._runRelativeUpdateFn(this);
        return this;
    };

    Screen.prototype.pushChild = function(child) {
        return this._addScreen(child, true);
    };
    Screen.prototype.getChildIndex = function(child, cyclic) {
        return this._getScreenIndex(child, this._children, cyclic);
    };
    Screen.prototype.getChild = function(child, cyclic) {
        var index = this.getChildIndex(child, cyclic);
        return this._children[index];
    };
    Screen.prototype.removeChild = function(child, cyclic) {
        return this._removeScreen(child, true, cyclic);
    };
    Screen.prototype.pushChildren = function(children) {
        if (children && Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
                this.pushChild(children[i]);
            }
        }
        Screen._runRelativeUpdateFn(this);
        return this;
    };
    Screen.prototype.setChildren = function(children) {
        return this.clearChildren().pushChildren(children);
    };
    Screen.prototype.clearChildren = function() {
        for (var i = this._children; i >= 0; i--) {
            this.removeChild(this._children[i]);
        }
        Screen._runRelativeUpdateFn(this);
        return this;
    };

    Screen.prototype.pushParent = function(parent) {
        return this._addScreen(parent, false);
    };
    Screen.prototype.getParentIndex = function(parent, cyclic) {
        return this._getScreenIndex(parent, this._parents, cyclic);
    };
    Screen.prototype.getParent = function(parent, cyclic) {
        var index = this.getParentIndex(parent, cyclic);
        return this._parents[index];
    };
    Screen.prototype.removeParent = function(parent, cyclic) {
        return this._removeScreen(parent, false, cyclic);
    };
    Screen.prototype.pushParents = function(parents) {
        if (parents && Array.isArray(parents)) {
            for (var i = 0; i < parents.length; i++) {
                this.pushParent(parents[i]);
            }
        }
        Screen._runRelativeUpdateFn(this);
        return this;
    };
    Screen.prototype.setParents = function(parents) {
        return this.clearParents().pushParents(parents);
    };
    Screen.prototype.clearParents = function() {
        for (var i = this._parents; i >= 0; i--) {
            this.removeParent(this._parents[i]);
        }
        Screen._runRelativeUpdateFn(this);
        return this;
    };

    Screen.configure = function(config) {
        Screen.isPermanent = config.isPermanent;
        Screen.isDirectedGraph = config.isDirectedGraph;
        Screen.defaultChildIndex = config.defaultChildIndex;
        Screen.defaultParentIndex = config.defaultParentIndex;
    };
    Screen.configure({
        isPermanent: false,
        isDirectedGraph: true,
        defaultChildIndex: 0,
        defaultParentIndex: 0
    });
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
