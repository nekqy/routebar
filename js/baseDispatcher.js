define(['utils', 'IPlugin'], function(Utils, IPlugin) {
    "use strict";

    //todo может например перейти на https://github.com/component/emitter
    /**
     * @class
     * Класс диспетчера, инкапсулирует событийную модель, каждый экземпляр представляет собой событие.
     * @param {JQuery} mainDiv - элемент, в котором располагается панель. Должен содержать класс rb-wrapper.
     * @constructor BaseDispatcher
     * @extends IPlugin
     */
    function BaseDispatcher(mainDiv) {
        this._actions = {};
        this._index = 0;
        this._mainDiv = mainDiv;
    }
    Utils.inherite(BaseDispatcher, IPlugin);
    BaseDispatcher.prototype.configure = function(config) {
        if (typeof config === 'object') {
            if (config.loadingDiv !== undefined) {
                this._loadingDiv = $(config.loadingDiv);
            }
        }
    };

    // todo сделать не once, а дать возможность указать число - количество срабатываний,
    // или функцию которая если вернет true - не отписываться, false - отписываться
    /**
     * Зарегистрировать действие, которое выполнится при запуске действий
     * @param {function} action - регистрируемое действие
     * @param {boolean} [once] - выполнить действие только в первый раз
     * @returns {number|null} индекс зарегистрированного действия (null, если действие не было зарегистрировано)
     * @memberOf BaseDispatcher
     */
    BaseDispatcher.prototype.add = function(action, once) {
        if (typeof action === 'function') {
            this._actions[this._index++] = {
                action: action,
                once: once
            };
            return this._index-1;
        }
        return null;
    };
    // todo отписка не по индексу, а по функции
    /**
     * Удалить действие из списка зарегистрированных действий
     * @param {number} index - индекс удаляемого действия
     * @memberOf BaseDispatcher
     */
    BaseDispatcher.prototype.remove = function(index) {
        if (this._actions.hasOwnProperty(index)) {
            delete this._actions[index];
        }
    };
    /**
     * Запустить зарегистрированные действия
     * @param {function|undefined} [fn] - функция, которая будет выполнена после того, как выполнятся все зарегистрированные действия.
     * Если зарегистрированные функции возвращают Promise, функция выполнится после завершения этих Promise.
     * Если хотя бы одна из зарегистрированных функций (или их Promise) вернет false, фунция fn не будет вызвана.
     * @param {Array} [actionArgs] - аргументы для зарегистрированных функций (для всех функций будут переданы одни и те же аргументы).
     * @returns {*} Результат выполнения функции fn, либо undefined если функция fn не была вызвана
     * @memberOf BaseDispatcher
     */
    BaseDispatcher.prototype.runActions = function(fn, actionArgs) {
        var
            actions = [],
            results = [],
            self = this;

        if (Object.keys(this._actions).length) {
            this._mainDiv.append(this._loadingDiv); // todo вынести это в moving, а здесь просто вызывать функцию

            Object.keys(this._actions).map(function(index) {
                var value = this._actions[index],
                    result = value.action.apply(undefined, actionArgs);

                if (value.once) {
                    this.remove(index);
                }
                if (result instanceof Promise) {
                    actions.push(result);
                } else {
                    results.push(result);
                }
            }.bind(this));

            return Promise.all(actions).then(function(promiseResult) {
                self._loadingDiv.remove();

                var isOk = results.concat(promiseResult).every(function(res) {
                    return res !== false;
                });
                if (isOk) {
                    return fn && fn();
                }
            }, function(error) {
                self._loadingDiv.remove();
                console.error(error);

                var isOk = results.every(function(res) {
                    return res !== false;
                });
                if (isOk) {
                    return fn && fn();
                }
            });
        } else {
            return fn && fn();
        }
    };

    /**
     * Уничтожить экземпляр класса
     * @memberOf BaseDispatcher
     */
    BaseDispatcher.prototype.destroy = function() {
        this._actions = null;
    };

    return BaseDispatcher;
});