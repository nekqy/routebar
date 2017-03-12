define(['utils', 'errors'], function(Utils, Errors) {
    "use strict";

    /**
     * @class
     * Интерфейс для плагина. Плагины, расширяющие функционал панели должны наследоваться от этого интерфейса.
     * @constructor IPlugin
     * @interface
     */
    function IPlugin() {

    }

    /**
     * Применить конфигурацию.
     * @param {Moving~config} config - конфигурация
     * @memberOf IPlugin
     */
    IPlugin.prototype.configure = function(config) {
        throw new Errors.FatalError('Configure function not realized');
    };

    /**
     * Уничтожить экземпляр интерфейса.
     * @memberOf IPlugin
     */
    IPlugin.prototype.destroy = function() {
        throw new Errors.FatalError('Destroy function not realized');
    };

    /**
     * Унаследовать модуль от IPlugin.
     * @param {Object} module - наследуемый модуль
     * @memberOf IPlugin
     */
    IPlugin.inherite = function(module) {
        Utils.inherite(module, IPlugin);
    };

    return IPlugin;
});