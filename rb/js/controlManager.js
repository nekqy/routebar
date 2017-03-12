define([], function() {
    "use strict";
    // todo может быть можно унаследовать от IPlugin?
    // todo а почему это класс, а не модуль?

    /**
     * @class
     * Менеджер управлений панелью.
     * @constructor ControlManager
     */
    function ControlManager() {
        this._controls = {};
    }

    /**
     * Добавляет экземпляр управления панелью к общему набору экземпляров, которыми можно управлять панелью.
     * @param {string} id - название экземпляра управления панелью
     * @param {IControl} control - добавляемый экземпляр управления панелью
     * @param {boolean} [doEnable] - включать управление панелью при добавлении
     * @returns {ControlManager} менеджер управления панелью
     * @memberOf ControlManager
     */
    ControlManager.prototype.add = function(id, control, doEnable) {
        if (this._controls.hasOwnProperty(id)) {
            console.log('ControlManager - add - control already exists: ' + id);
        } else {
            this._controls[id] = control;
            if (doEnable) {
                this.enable(id);
            }
        }

        return this;
    };
    /**
     * Удаляет экземпляр управления панелью из общего набора экземпляров
     * @param {string} id - название экземпляра управления панелью
     * @returns {ControlManager} менеджер управления панелью
     * @memberOf ControlManager
     */
    ControlManager.prototype.remove = function(id) {
        if (this._controls.hasOwnProperty(id)) {
            delete this._controls[id];
        } else {
            console.log('ControlManager - remove - control not found: ' + id);
        }
        return this;
    };
    /**
     * Возвращает флаг, является ли экземпляр управления включенным.
     * @param {string} id - название экземпляра
     * @returns {boolean|null} - true если включен, false если выключен, null если не найден
     * @memberOf ControlManager
     */
    ControlManager.prototype.isEnable = function(id) {
        if (this._controls.hasOwnProperty(id)) {
            return this._controls[id].isEnable();
        } else {
            //todo выводить как-то иначе
            console.log('ControlManager - isEnable - control not found: ' + id);
        }
        return null;
    };
    /**
     * Включить экземпляр управления панелью.
     * @param {string} id - название экземпляра
     * @returns {ControlManager} менеджер управления панелью
     * @memberOf ControlManager
     */
    ControlManager.prototype.enable = function(id) {
        if (this._controls.hasOwnProperty(id)) {
            this._controls[id].enable();
        } else {
            console.log('ControlManager - enable - control not found: ' + id);
        }
        return this;
    };
    /**
     * Выключить экземпляр управления панелью.
     * @param {string} id - название экземпляра
     * @returns {ControlManager} менеджер управления панелью
     * @memberOf ControlManager
     */
    ControlManager.prototype.disable = function(id) {
        if (this._controls.hasOwnProperty(id)) {
            this._controls[id].disable();
        } else {
            console.log('ControlManager - disable - control not found: ' + id);
        }
        return this;
    };

    ControlManager.prototype._doAll = function(isEnable) {
        var res = {};
        for (var id in this._controls) {
            if (this._controls.hasOwnProperty(id)) {
                res[id] = this.isEnable(id);
                if (isEnable) {
                    this.enable(id);
                } else {
                    this.disable(id);
                }
            }
        }
        return res;
    };
    /**
     * Выключить все экземпляры управления панелью.
     * @returns {Object.<string, boolean>} Объект, сопоставляющий название экземпляра управления со значением,
     * был ли этот экземпляр включен перед применением функции.
     * @see {@link ControlManager#enableByValues}
     */
    ControlManager.prototype.disableAll = function() {
        return this._doAll(false);
    };
    /**
     * Включить все экземпляры управления панелью.
     * @returns {Object.<string, boolean>} Объект, сопоставляющий название экземпляра управления со значением,
     * был ли этот экземпляр включен перед применением функции.
     * @see {@link ControlManager#enableByValues}
     * @memberOf ControlManager
     */
    ControlManager.prototype.enableAll = function() {
        return this._doAll(true);
    };
    /**
     * Функция включения экземпляров управления панелью по маске включения
     * @param {Object.<string, boolean>} values - Объект, сопоставляющий название экземпляра управления с флагом,
     * включать ли данный экземпляр управления или выключать.
     * @returns {ControlManager} менеджер управления панелью
     * @memberOf ControlManager
     */
    ControlManager.prototype.enableByValues = function(values) {
        for (var id in values) {
            if (values.hasOwnProperty(id)) {
                if (values[id]) {
                    this.enable(id);
                } else {
                    this.disable(id);
                }
            }
        }
        return this;
    };
    /**
     * Применить конфигурацию к панели. Применяет конфигурацию к списку экземпляров управления панелью.
     * @param {Moving~config} config - конфигурация
     * @memberOf ControlManager
     * @see {@link IControl#configure}
     */
    ControlManager.prototype.configure = function(config) {
        for (var name in this._controls) {
            if (this._controls.hasOwnProperty(name)) {
                this._controls[name].configure(config);
            }
        }
    };

    /**
     * Уничтожить экземпляр ControlManager
     * @memberOf ControlManager
     */
    ControlManager.prototype.destroy = function() {
        this.disableAll();
        this._controls = null;
    };

    return ControlManager;
});