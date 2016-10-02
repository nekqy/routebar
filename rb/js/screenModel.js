define([], function() {
    "use strict";

    function Screen(html, children) {
        if (!Screen._mainScreenSetted) {
            Screen.mainScreen = this;
        }

        this.html = html;
        this.parents = [];
        this.next = this;
        this.prev = this;

        this._relativeScreens = {};

        this.setChildren(children);
    }
    Screen.prototype.setChildren = function(children) {
        if (children && Array.isArray(children)) {
            this.children = [];
            for (var i = 0; i < children.length; i++) {
                this.addChild(children[i]);
            }
        } else {
            this.children = [];
        }
        this._updateRelativeScreen();
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
        this._updateRelativeScreen();
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
        this._updateRelativeScreen();
        return this;
    };

    Screen.prototype.isRelativeScreen = function(side) {
        return !!this.getRelativeScreen(side);
    };
    Screen.prototype.getRelativeScreen = function(side) {
        if (side === 'center') {
            return this;
        }
        if (side === 'left') {
            if (this.parents.length) {
                return this._relativeScreens['left'] || this.parents[0];
            } else {
                return null;
            }
        }
        if (side === 'top') {
            if (this.prev) {
                return this._relativeScreens['top'] || this.prev;
            } else {
                return null;
            }
        }
        if (side === 'right') {
            if (this.children.length) {
                return this._relativeScreens['right'] || this.children[0];
            } else {
                return null;
            }
        }
        if (side === 'bottom') {
            if (this.next) {
                return this._relativeScreens['bottom'] || this.next;
            } else {
                return null;
            }
        }
        return null;
    };
    Screen.prototype.setRelativeScreen = function(side, screen) {
        if (side !== 'left' && side !== 'top' && side !== 'right' && side !== 'bottom') {
            throw new Error('Screen module - setRelativeScreen - wrong side arg: ' + side);
        }
        if (!(screen instanceof Screen)) {
            throw new Error('Screen module - setRelativeScreen - wrong screen arg');
        }
        this._relativeScreens[side] = screen;
    };
    Screen.prototype._updateRelativeScreen = function() {
        if (!this.children.length) {
            this._relativeScreens['right'] = null;
        }
        if (!this.parents.length) {
            this._relativeScreens['left'] = null;
        }
        if (!this.next) {
            this._relativeScreens['bottom'] = null;
        }
        if (!this.prev) {
            this._relativeScreens['top'] = null;
        }

    };

    Screen.setMainScreen = function(screen) {
        Screen._mainScreen = screen;
        Screen._mainScreenSetted = true;
    };
    Screen.getMainScreen = function() {
        return Screen._mainScreen;
    };

    return Screen;
});
