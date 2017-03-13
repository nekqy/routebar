define(['utils', 'IPlugin', 'errors'], function(Utils, IPlugin, Errors) {
    "use strict";

    /**
     * @class
     * Интерфейс управления панелью. Позволяет переключаться в соседние ячейки панели.
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
        throw new Errors.NotRealizedError('IControl', 'isEnable');
    };
    /**
     * включить управление панелью.
     * @memberOf IControl
     */
    IControl.prototype.enable = function() {
        throw new Errors.NotRealizedError('IControl', 'enable');
    };
    /**
     * выключить управление панелью.
     * @memberOf IControl
     */
    IControl.prototype.disable = function() {
        throw new Errors.NotRealizedError('IControl', 'disable');
    };

    return IControl;
});