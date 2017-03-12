define(['utils', 'IPlugin', 'errors'], function(Utils, IPlugin, Errors) {
    "use strict";

    /**
     * @class
     * Интерфейс управления панелью.
     * @constructor IControl
     * @interface
     * @extends IPlugin
     */
    function IControl() {

    }
    Utils.inherite(IControl, IPlugin);

    /**
     * Возвращает флаг, включено ли управление панелью.
     * @memberOf IControl
     */
    IControl.prototype.isEnable = function() {
        throw new Errors.FatalError('isEnable function not realized');
    };
    /**
     * включить управление панелью.
     * @memberOf IControl
     */
    IControl.prototype.enable = function() {
        throw new Errors.FatalError('enable function not realized');
    };
    /**
     * выключить управление панелью.
     * @memberOf IControl
     */
    IControl.prototype.disable = function() {
        throw new Errors.FatalError('disable function not realized');
    };

    /**
     * Унаследовать модуль от IControl.
     * @param {Object} module - наследуемый модуль
     * @memberOf IControl
     */
    IControl.inherite = function(module) {
        Utils.inherite(module, IControl);
    };

    return IControl;
});