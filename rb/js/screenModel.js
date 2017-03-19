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
        this.resetChildren(children);
        this.resetParents(parents);
        this._temporary = !isPermanent; // Todo на изменение тут менять и там где используется
        this._isDirectedGraph = !!isDirectedGraph; // Todo на изменение тут менять и там где используется
        this._defaultChildIndex = defaultChildIndex;
        this._defaultParentIndex = defaultParentIndex;
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
     * @returns {string} контент модели
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.getHtml = function () {
        return this._html;
    };

    /**
     * Задать контент модели
     * @param {string} html - контент модели
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.setHtml = function (html) {
        this._html = html;
        // todo обновить все ячейки в которых лежит эта модель
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
     * @returns {number} индекс модели по умолчанию среди моделей-потомков
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.defaultChildIndex = function() {
        return this._defaultChildIndex; // todo нужен сеттер
    };
    /**
     * Возвращает индекс модели по умолчанию среди моделей-предков
     * @returns {number} индекс модели по умолчанию среди моделей-предков
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.defaultParentIndex = function() {
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

        ScreenModel._runUpdateFn(this);
        return this;
    };

    ScreenModel.prototype._getScreenIndex = function(screen, arr, cyclic) {
        var index = -1;
        if (typeof screen === 'number') {
            if (cyclic) {
                screen = (screen % arr.length + arr.length) % arr.length;
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
    ScreenModel.prototype._removeScreen = function(screen, isChild, cyclic) {
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

        ScreenModel._runUpdateFn(this);
        return this;
    };

    /**
     * Добавляет модель-потомка в конец набора потомков
     * @param {ScreenModel} child - добавляемая модель
     * @returns {ScreenModel} данная модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.pushChild = function(child) {
        return this._addScreen(child, true);
    };
    /**
     * Находит индекс модели среди набора потомков
     * @param {ScreenModel|string|number} child - искомая модель, ее идентификатор или порядковый номер в наборе
     * @param {boolean} [cyclic] - воспринимать ли порядковый номер модели циклически, то есть по принципу (index % length + length) % length
     * @returns {number} искомый индекс модели
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.getChildIndex = function(child, cyclic) {
        //todo (screen + arr.length) % arr.length неправильный алгоритм. надо чтобы -11 % 5 было 4. а тут -1
        return this._getScreenIndex(child, this._children, cyclic);
    };
    /**
     * Находит модель среди набора потомков
     * @param {ScreenModel|string|number} child - искомая модель, ее идентификатор или порядковый номер в наборе
     * @param {boolean} [cyclic] - воспринимать ли порядковый номер модели циклически, то есть по принципу (index % length + length) % length
     * @returns {ScreenModel} искомая модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.getChild = function(child, cyclic) {
        var index = this.getChildIndex(child, cyclic);
        return this._children[index];
    };
    /**
     * Удаляет модель из набора потомков
     * @param {ScreenModel|string|number} child - удаляемая модель, ее идентификатор или порядковый номер в наборе
     * @param {boolean} [cyclic] - воспринимать ли порядковый номер модели циклически, то есть по принципу (index % length + length) % length
     * @returns {ScreenModel} данная модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.removeChild = function(child, cyclic) {
        return this._removeScreen(child, true, cyclic);
    };
    /**
     * Добавить набор моделей в конец к набору потомков
     * @param {ScreenModel[]} children - набор добавляемый моделей
     * @returns {ScreenModel} данная модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.pushChildren = function(children) {
        if (children && Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
                this.pushChild(children[i]);
            }
        }
        ScreenModel._runUpdateFn(this);
        return this;
    };
    /**
     * Переопределить набор моделей потомков, то есть удалить старые и установить новые
     * @param {ScreenModel[]} children - набор добавляемый моделей
     * @returns {ScreenModel} данная модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.resetChildren = function(children) {
        return this.clearChildren().pushChildren(children);
    };
    /**
     * Очищает набор потомков
     * @returns {ScreenModel} данная модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.clearChildren = function() {
        for (var i = this._children.length - 1; i >= 0; i--) {
            this.removeChild(this._children[i]);
        }
        ScreenModel._runUpdateFn(this);
        return this;
    };

    /**
     * Добавляет модель-предка в конец набора предков
     * @param {ScreenModel} parent - добавляемая модель
     * @returns {ScreenModel} данная модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.pushParent = function(parent) {
        return this._addScreen(parent, false);
    };
    /**
     * Находит индекс модели среди набора предков
     * @param {ScreenModel|string|number} parent - искомая модель, ее идентификатор или порядковый номер в наборе
     * @param {boolean} [cyclic] - воспринимать ли порядковый номер модели циклически, то есть по принципу (index % length + length) % length
     * @returns {number} искомый индекс модели
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.getParentIndex = function(parent, cyclic) {
        return this._getScreenIndex(parent, this._parents, cyclic);
    };
    /**
     * Находит модель среди набора предков
     * @param {ScreenModel|string|number} parent - искомая модель, ее идентификатор или порядковый номер в наборе
     * @param {boolean} [cyclic] - воспринимать ли порядковый номер модели циклически, то есть по принципу (index % length + length) % length
     * @returns {ScreenModel} искомая модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.getParent = function(parent, cyclic) {
        var index = this.getParentIndex(parent, cyclic);
        return this._parents[index];
    };
    /**
     * Удаляет модель из набора предков
     * @param {ScreenModel|string|number} parent - удаляемая модель, ее идентификатор или порядковый номер в наборе
     * @param {boolean} [cyclic] - воспринимать ли порядковый номер модели циклически, то есть по принципу (index % length + length) % length
     * @returns {ScreenModel} данная модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.removeParent = function(parent, cyclic) {
        return this._removeScreen(parent, false, cyclic);
    };
    /**
     * Добавить набор моделей в конец к набору предков
     * @param {ScreenModel[]} parents - набор добавляемый моделей
     * @returns {ScreenModel} данная модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.pushParents = function(parents) {
        if (parents && Array.isArray(parents)) {
            for (var i = 0; i < parents.length; i++) {
                this.pushParent(parents[i]);
            }
        }
        ScreenModel._runUpdateFn(this);
        return this;
    };
    /**
     * Переопределить набор моделей предков, то есть удалить старые и установить новые
     * @param {ScreenModel[]} parents - набор добавляемый моделей
     * @returns {ScreenModel} данная модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.resetParents = function(parents) {
        return this.clearParents().pushParents(parents);
    };
    /**
     * Очищает набор предков
     * @returns {ScreenModel} данная модель
     * @memberOf ScreenModel
     */
    ScreenModel.prototype.clearParents = function() {
        for (var i = this._parents.length - 1; i >= 0; i--) {
            this.removeParent(this._parents[i]);
        }
        ScreenModel._runUpdateFn(this);
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
