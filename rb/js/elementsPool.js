define(['utils', 'IPlugin'], function(Utils, IPlugin) {
    "use strict";

    function ElementsPool(mainDiv, screenManager) {
        this._mainDiv = mainDiv;
        this._screenManager = screenManager;
        this._elements = {};
        this._elementsBySide = {};
    }
    Utils.inherite(ElementsPool, IPlugin);
    ElementsPool.prototype.configure = function(config) {
        if (typeof config === 'object') {
            if (config.loadingHtml !== undefined) {
                this._loadingHtml = config.loadingHtml;
            }
            if (config.saveHistoryInPool !== undefined) {
                this._saveHistoryInPool = config.saveHistoryInPool;
            }
        }
    };

    ElementsPool.prototype.prepareSide = function() {
        function getScreen(side) {
            return self._screenManager._getRelativeScreenByScreen(newScreen, side);
        }
        function prepareRelativeSide(side, screen) {
            var id = screen.toString(),
                element;
            if (!self._elements.hasOwnProperty(id)) {
                element = $('<div class="rb__side rb__hidden rb__loading" data-id="' + id + '">' + self._loadingHtml + '</div>');
                self._mainDiv.prepend(element);
                self._elements[id] = {
                    element: element,
                    screen: screen,
                    state: 'loading'
                };
            } else {
                element = self._elements[id].element;
            }
            if (side === 'center') {
                element.toggleClass('rb__center', true);
                element.toggleClass('rb__hidden', false);
            }

            self._elementsBySide[side] = id;
        }

        var newScreen = this._screenManager.getCurScreen(),
            self = this,
            leftScreen = getScreen('left'),
            topScreen = getScreen('top'),
            rightScreen = getScreen('right'),
            bottomScreen = getScreen('bottom');

        this.getElementBySide('center').toggleClass('rb__center', false);
        this._mainDiv.find('.rb__side').toggleClass('rb__hidden', true);

        self._elementsBySide = {};
        newScreen && prepareRelativeSide('center', newScreen);
        leftScreen && prepareRelativeSide('left', leftScreen);
        topScreen && prepareRelativeSide('top', topScreen);
        rightScreen && prepareRelativeSide('right', rightScreen);
        bottomScreen && prepareRelativeSide('bottom', bottomScreen);
    };
    ElementsPool.prototype.getElementBySide = function(side) {
        var id = this._elementsBySide[side];
        if (id) {
            return this._elements[id].element;
        } else {
            return $();
        }
    };
    ElementsPool.prototype.loadElements = function() {
        var self = this;

        Object.keys(this._elements).forEach(function(id) {
            var elem = self._elements[id];

            if (self._elementsBySide['center'] === id
                || self._elementsBySide['left'] === id
                || self._elementsBySide['top'] === id
                || self._elementsBySide['right'] === id
                || self._elementsBySide['bottom'] === id) {
                if (elem.state === 'loading') {
                    elem.element.html(elem.screen.html);
                    elem.element.toggleClass('rb__loading', false);
                    elem.state = 'loaded';
                }
            } else {
                if (elem.screen.isTemporary()) {
                    if (!(self._saveHistoryInPool && self._screenManager._containsHistory(self._elements[id].screen))) {
                        self._elements[id].element.remove();
                        delete self._elements[id];
                    }
                }
            }
        });
    };

    ElementsPool.prototype.destroy = function() {
        var self = this;
        Object.keys(this._elements).forEach(function(id) {
            self._elements[id].element.remove();
        });
        this._elements = null;
        this._elementsBySide = null;
        this._screenManager = null;
    };

    return ElementsPool;
});