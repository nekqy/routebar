define(['errors'], function(Errors) {
    "use strict";

    /**
     * Конфигурация модели
     * @typedef {Object} ScreenModel~ScreenConfig
     * @property {ScreenModel[]} [children] - Потомки модели
     * @property {ScreenModel[]} [parents] - Предки модели
     * @property {boolean} [isPermanent] - Является ли модель постоянно хранимой, если да, то попав на страницу не будет оттуда удаляться.
     * @property {boolean} [isDirectedGraph] - Является ли строящийся граф моделей ориентированным.
     * @property {string} [html] - Контент модели
     * @property {number} [defaultChildIndex] - Индекс модели по умолчанию среди моделей-потомков
     * @property {number} [defaultParentIndex] - Индекс модели по умолчанию среди моделей-предков
     */
    /**
     * Конфигурация моделей по умолчанию
     * @typedef {Object} ScreenModel~DefaultScreenConfig
     * @property {boolean} [isPermanent] - Является ли модель постоянно хранимой, если да, то попав на страницу не будет оттуда удаляться.
     * @property {boolean} [isDirectedGraph] - Является ли строящийся граф моделей ориентированным.
     * @property {number} [defaultChildIndex] - Индекс модели по умолчанию среди моделей-потомков
     * @property {number} [defaultParentIndex] - Индекс модели по умолчанию среди моделей-предков
     */
    /**
     * @class
     * Модель контента, отображаемая в ячейке панели.
     * @param {String|ScreenModel~ScreenConfig} [html] - контент модели
     * @param {ScreenModel[]} [children] - потомки модели
     * @param {ScreenModel[]} [parents] - предки модели
     * @constructor ScreenModel
     */
    function ScreenModel(html, children, parents) {
        if (!ScreenModel._mainScreenSetted) {
            ScreenModel._mainScreen = this;
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
            isPermanent = ScreenModel.isPermanent;
        }
        if (isDirectedGraph === undefined) {
            isDirectedGraph = ScreenModel.isDirectedGraph;
        }
        if (defaultChildIndex === undefined) {
            defaultChildIndex = ScreenModel.defaultChildIndex;
        }
        if (defaultParentIndex === undefined) {
            defaultParentIndex = ScreenModel.defaultParentIndex;
        }

        this._id = 'screen_' + ScreenModel._length++;
        this._html = html;
        this._temporary = !isPermanent; // Todo на изменение тут менять и там где используется
        this._isDirectedGraph = !!isDirectedGraph; // Todo на изменение тут менять и там где используется
        this._defaultChildIndex = defaultChildIndex;
        this._defaultParentIndex = defaultParentIndex;

        this.resetChildren(children);
        this.resetParents(parents);
    }

    /**
     * Возвращает идентификатор модели
     * @returns {string} идентификатор модели
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.toString = function() {
        return this._id;
    };

    /**
     * Возвращает контент модели
     * @param {string} [html] - если аргумент задан, он будет установлен в качестве контента модели
     * @returns {string} контент модели
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.html = function (html) {
        if (typeof html === 'string') {
            this._html = html;
            // todo обновить все ячейки в которых лежит эта модель
        }
        return this._html;
    };

    /**
     * Возвращает опцию "временная модель". Если модель временная, она не будет храниться на странице, если не отображается.
     * @returns {boolean} опция "временная модель"
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.isTemporary = function() {
        return this._temporary;
    };
    /**
     * Возвращает опцию "ориентированный граф". Если true, модель является частью ориентированного графа.
     * @returns {boolean} опция "ориентированный граф"
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.isDirectedGraph = function() {
        return this._isDirectedGraph;
    };
    /**
     * Возвращает индекс модели по умолчанию среди моделей-потомков
     * @param {number} [index] - если задан индекс, он будет установлен как значение по умолчанию
     * @returns {number} индекс модели по умолчанию среди моделей-потомков
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.defaultChildIndex = function(index) {
        if (typeof index === 'number') {
            this._defaultChildIndex = index;
        }
        return this._defaultChildIndex;
    };
    /**
     * Возвращает индекс модели по умолчанию среди моделей-предков
     * @param {number} [index] - если задан индекс, он будет установлен как значение по умолчанию
     * @returns {number} индекс модели по умолчанию среди моделей-предков
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.defaultParentIndex = function(index) {
        if (typeof index === 'number') {
            this._defaultParentIndex = index;
        }
        return this._defaultParentIndex;
    };

    ScreenModel.prototype._addScreen = function(screen, isChild) {
        if (isChild) {
            if (this.getChildIndex(screen) !== -1) {
                console.log('screenModel: "' + screen.toString() + '" child screen exists!');
            } else {
                this._children.push(screen); //todo смотреть что оба скрина одного типа isDirectGraph
                screen._parents.push(this);
            }
        } else {
            if (this.getParentIndex(screen) !== -1) {
                console.log('screenModel: "' + screen.toString() + '" parent screen exists!');
            } else {
                this._parents.push(screen);
                screen._children.push(this);
            }
        }
        if (!this._isDirectedGraph) {
            if (!screen._isAddingState) {
                this._isAddingState = true;
                screen._addScreen(this, isChild);
                this._isAddingState = false;
            }
        }

        return this;
    };
    ScreenModel.prototype._getScreenIndex = function(screen, arr) {
        var index = -1;
        if (typeof screen === 'number') {
            if (isNaN(screen)) {
                throw new Errors.ArgumentError('screen', screen);
            }
            index = screen;
        } else if (typeof screen === 'string') {
            screen = arr.find(function(curScreen, curIndex) {
                if (curScreen.toString() === screen) {
                    index = curIndex;
                    return true;
                }
            });
        } else if (screen instanceof ScreenModel) {
            index = arr.indexOf(screen);
        } else {
            throw new Errors.ArgumentError('screen', screen);
        }
        return index;
    };
    ScreenModel.prototype._removeScreen = function(screen, isChild) {
        var arr = isChild ? this._children : this._parents,
            index = this._getScreenIndex(screen, arr);

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

        return this;
    };

    /**
     * Сортирует набор потомков. Сортировка происходит по правилам сортировки массива.
     * @param {function} [compareFn] - Если задана функция сравнения, она будет использована при сортировке.
     * @returns {ScreenModel} текущая модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.sortChildren = function(compareFn) {
        this._children = this._children.sort(compareFn);
        ScreenModel._runUpdateFn(this);
        return this;
    };

    /**
     * Возвращает количество потомков.
     * @returns {Number} количество потомков
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.childrenLength = function () {
        return this._children.length;
    };

    /**
     * Находит индекс модели среди набора потомков
     * @param {ScreenModel|string|number} child - искомая модель, ее идентификатор или порядковый номер в наборе
     * @returns {number} искомый индекс модели
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.getChildIndex = function(child) {
        return this._getScreenIndex(child, this._children);
    };
    /**
     * Находит модель среди набора потомков
     * @param {ScreenModel|string|number} child - искомая модель, ее идентификатор или порядковый номер в наборе
     * @returns {ScreenModel} искомая модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.getChild = function(child) {
        var index = this.getChildIndex(child);
        return this._children[index];
    };
    /**
     * Удаляет модель из набора потомков
     * @param {ScreenModel|string|number} child - удаляемая модель, ее идентификатор или порядковый номер в наборе
     * @returns {ScreenModel} текущая модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.removeChild = function(child) {
        this._removeScreen(child, true);
        ScreenModel._runUpdateFn(this);
        return this;
    };
    /**
     * Добавить набор моделей в конец к набору потомков
     * @param {ScreenModel[]|ScreenModel} children - набор добавляемый моделей
     * @returns {ScreenModel} текущая модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.pushChildren = function(children) {
        if (Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
                this._addScreen(children[i], true);
            }
        } else if (children instanceof ScreenModel) {
            this._addScreen(children, true);
        } else {
            ScreenModel._runUpdateFn(this);
            throw new Errors.ArgumentError('children', children);
        }
        ScreenModel._runUpdateFn(this);
        return this;
    };
    /**
     * Переопределить набор моделей потомков, то есть удалить старые и установить новые
     * @param {ScreenModel[]} [children] - набор добавляемый моделей
     * @returns {ScreenModel} текущая модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.resetChildren = function(children) {
        this._clearChildren().pushChildren(children || []);
        return this;
    };
    ScreenModel.prototype._clearChildren = function() {
        for (var i = this._children.length - 1; i >= 0; i--) {
            this._removeScreen(this._children[i], true);
        }
        return this;
    };

    /**
     * Сортирует набор предков. Сортировка происходит по правилам сортировки массива.
     * @param {function} [compareFn] - Если задана функция сравнения, она будет использована при сортировке.
     * @returns {ScreenModel} текущая модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.sortParents = function(compareFn) {
        this._parents = this._parents.sort(compareFn);
        ScreenModel._runUpdateFn(this);
        return this;
    };
    /**
     * Возвращает количество предков.
     * @returns {Number} количество предков
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.parentsLength = function () {
        return this._parents.length;
    };

    /**
     * Находит индекс модели среди набора предков
     * @param {ScreenModel|string|number} parent - искомая модель, ее идентификатор или порядковый номер в наборе
     * @returns {number} искомый индекс модели
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.getParentIndex = function(parent) {
        return this._getScreenIndex(parent, this._parents);
    };
    /**
     * Находит модель среди набора предков
     * @param {ScreenModel|string|number} parent - искомая модель, ее идентификатор или порядковый номер в наборе
     * @returns {ScreenModel} искомая модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.getParent = function(parent) {
        var index = this.getParentIndex(parent);
        return this._parents[index];
    };
    /**
     * Удаляет модель из набора предков
     * @param {ScreenModel|string|number} parent - удаляемая модель, ее идентификатор или порядковый номер в наборе
     * @returns {ScreenModel} текущая модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.removeParent = function(parent) {
        this._removeScreen(parent, false);
        ScreenModel._runUpdateFn(this);
        return this;
    };
    /**
     * Добавить набор моделей в конец к набору предков
     * @param {ScreenModel[]|ScreenModel} parents - набор добавляемый моделей
     * @returns {ScreenModel} текущая модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.pushParents = function(parents) {
        if (Array.isArray(parents)) {
            for (var i = 0; i < parents.length; i++) {
                this._addScreen(parents[i], false);
            }
        } else if (parents instanceof ScreenModel) {
            this._addScreen(parents, false);
        } else {
            ScreenModel._runUpdateFn(this);
            throw new Errors.ArgumentError('parents', parents);
        }

        ScreenModel._runUpdateFn(this);
        return this;
    };
    /**
     * Переопределить набор моделей предков, то есть удалить старые и установить новые
     * @param {ScreenModel[]} [parents] - набор добавляемый моделей
     * @returns {ScreenModel} текущая модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.resetParents = function(parents) {
        this._clearParents().pushParents(parents || []);
        return this;
    };
    ScreenModel.prototype._clearParents = function() {
        for (var i = this._parents.length - 1; i >= 0; i--) {
            this._removeScreen(this._parents[i], false);
        }
        return this;
    };

    /**
     * Устанавливает конфигурацию моделей по умолчанию. Изначальные значения по умоланию: <br>
     * isPermanent: false, <br>
     * isDirectedGraph: true, <br>
     * defaultChildIndex: 0, <br>
     * defaultParentIndex: 0
     * @param {ScreenModel~DefaultScreenConfig} config - конфигурация
     * @memberOf ScreenModel
     */
    ScreenModel.configure = function(config) {
        ScreenModel.isPermanent = config.isPermanent;
        ScreenModel.isDirectedGraph = config.isDirectedGraph;
        ScreenModel.defaultChildIndex = config.defaultChildIndex;
        ScreenModel.defaultParentIndex = config.defaultParentIndex;
    };
    ScreenModel.configure({
        isPermanent: false,
        isDirectedGraph: true,
        defaultChildIndex: 0,
        defaultParentIndex: 0
    });
    ScreenModel._length = 1;
    ScreenModel._relativeUpdateFn = [];

    /**
     * Установить модель по умолчанию, она будет использоваться в качестве стартовой для панелей, если при старте не заданы иные модели.
     * Если модель по умолчанию не установлена вручную, будет использован первый созданный экземпляр модели.
     * @param {ScreenModel} screen - модель по умолчанию
     * @memberOf ScreenModel
     * @see {@link module:RbManager.init}
     */
    ScreenModel.setMainScreen = function(screen) {
        ScreenModel._mainScreen = screen;
        ScreenModel._mainScreenSetted = true;
    };
    /**
     * Получить модель по умолчанию
     * @returns {ScreenModel} модель по умолчанию
     * @memberOf ScreenModel
     */
    ScreenModel.getMainScreen = function() {
        return ScreenModel._mainScreen;
    };
    /**
     * Зарегистрировать функцию для запуска, когда изменится структура графа
     * @param {function} fn - функция для запуска
     * @memberOf ScreenModel
     */
    ScreenModel.registerUpdateFn = function(fn) {
        ScreenModel._relativeUpdateFn.push(fn);
    };
    /**
     * Удалить функцию из списка функций для запуска, когда изменится структура графа
     * @param {function} fn - функция для запуска
     * @memberOf ScreenModel
     */
    ScreenModel.unregisterUpdateFn = function(fn) {
        ScreenModel._relativeUpdateFn = ScreenModel._relativeUpdateFn.filter(function(value) {
            return value !== fn;
        });
    };
    /**
     * Очистить набор функций для запуска, когда изменится структура графа
     * @memberOf ScreenModel
     */
    ScreenModel.clearUpdateFn = function() {
        ScreenModel._relativeUpdateFn = [];
    };
    ScreenModel._runUpdateFn = function(screen) {
        ScreenModel._relativeUpdateFn.forEach(function(fn) {
            fn.call(undefined, screen);
        });
    };

    return ScreenModel;
});
