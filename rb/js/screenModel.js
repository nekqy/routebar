define([], function() {
    "use strict";

    function Screen(html, children, isTemporary) {
        if (!Screen._mainScreenSetted) {
            Screen._mainScreen = this;
        }

        this.html = html;
        this.parents = [];
        this.next = this;
        this.prev = this;
        this._id = 'screen_' + Screen._length++;
        this._temporary = isTemporary !== false;

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
            this.children = [];
            for (var i = 0; i < children.length; i++) {
                this.addChild(children[i]);
            }
        } else {
            this.children = [];
        }
        Screen._runRelativeUpdateFn(this);
        return this;
    };
    Screen.prototype.getChildren = function() {
        return this.children;
    };
    Screen.prototype.addChild = function(child) {
        var children = this.children;
        child.parents.push(this);
        child.next = children.length ? children[0] : child;
        child.prev = children.length ? children[children.length-1] : child;
        child.next.prev = child;
        child.prev.next = child;

        children.push(child);
        Screen._runRelativeUpdateFn(this);
        return this;
    };
    Screen.prototype.removeChild = function(child) {
        var children = this.children,
            index = children.indexOf(child),
            removed;
        if (index !== -1) {
            removed = children.splice(index, 1)[0];
            removed.prev.next = removed.next;
            removed.next.prev = removed.prev;
        }
        Screen._runRelativeUpdateFn(this);
        return this;
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
