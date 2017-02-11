define([], function() {
    "use strict";

    function Screen(html, children, isPermanent) {
        if (!Screen._mainScreenSetted) {
            Screen._mainScreen = this;
        }

        this.html = html;
        this._parents = [];
        this._next = null;
        this._prev = null;
        this._id = 'screen_' + Screen._length++;
        this._temporary = !isPermanent;

        this.setChildren(children);
    }
    Screen.prototype.toString = function() {
        return this._id;
    };
    Screen.prototype.isTemporary = function() {
        return this._temporary;
    };
    Screen.prototype.setChildren = function(children) {
        if (children && Array.isArray(children)) {
            this._children = [];
            for (var i = 0; i < children.length; i++) {
                this.addChild(children[i]);
            }
        } else {
            this._children = [];
        }
        Screen._runRelativeUpdateFn(this);
        return this;
    };
    Screen.prototype.getChildren = function() {
        return this._children;
    };
    Screen.prototype.addChild = function(child) {
        var children = this._children;
        if (true) { // TODO сделать опцию направленный/ненаправленный граф
            child._parents.push(this);
        }
        if (children.length > Screen._doCyclic) {
            child._next = children.length ? children[0] : child;
            child._prev = children.length ? children[children.length-1] : child;
            child._next._prev = child;
            child._prev._next = child;
        }

        children.push(child);
        Screen._runRelativeUpdateFn(this);
        return this;
    };
    Screen.prototype.removeChild = function(child) {
        var children = this._children,
            index = children.indexOf(child),
            removed;
        if (index !== -1) {
            removed = children.splice(index, 1)[0];

            if (removed._prev === removed._next) {
                remove._prev = remove._next = null;
            } else {
                removed._prev._next = removed._next;
                removed._next._prev = removed._prev;
            }

        }
        Screen._runRelativeUpdateFn(this);
        return this;
    };
    Screen.prototype.doChildrenCyclic = function(val) {
        if (this._children.length > 0) {
            if (val) {
                if (this._children.length > 1) {
                    this._children[0]._prev = this._children[this._children.length-1];
                    this._children[this._children.length-1]._next = this._children[0];
                } else {
                    this._children[0]._prev = null;
                    this._children[this._children.length-1]._next = null;
                }
            } else {
                this._children[0]._prev = null;
                this._children[this._children.length-1]._next = null;
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
    Screen._doCyclic = 0;
    Screen.doCyclic = function(val) {
        Screen._doCyclic = val ? 0 : 1;
    };

    return Screen;
});
