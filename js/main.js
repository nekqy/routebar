/**
 * Основной модуль, предоставляющий элементы для настройки и управления панелями<br>
 * Объявляется глобально и доступен через переменную <b>rb</b>
 * @module MainModule
 */
define(['screenModel', 'rbManager', 'IPlugin', 'IControl', '../css/rb.scss'], function(ScreenModel, RbManager, IPlugin, IControl) {
    "use strict";

    return /** @alias module:MainModule */ Object.create(null, {
        /**
         * Класс модели отображаемого внутри панели контента, модели связываются в граф зависимостей,
         * по которому осуществляется перемещение в панели.
         * @type {ScreenModel}
         */
        Screen: {
            value: ScreenModel
        },
        /**
         * Функция, инициализирующая расположенные в данный момент на странице панели.
         * @type {function}
         * @see {@link module:RbManager.init}
         */
        start: {
            value: RbManager.init
        },
        /**
         * Функция, удаляющая панель со страницы.
         * @type {function}
         * @see {@link module:RbManager.remove}
         */
        remove: {
            value: RbManager.remove
        },
        /**
         * Набор панелей, действующих в данный момент на странице.
         * @type {Moving[]}
         */
        Instances: {
            value: {}
        },
        /**
         * Модуль, позволяющий управлять панелями на странице пакетированно, то есть запускать действия для всех панеляй сразу.
         * @type {module:Batch}
         */
        Batch: {
            value: RbManager.Batch
        },
        /**
         * Интерфейс плагина панели, который можно добавить в панель для расширения ее фунционала.
         * Добавляемые плагины должны быть именно такого типа.
         * @type {IPlugin}
         * @see {@link Moving#addPlugin}
         * @see {@link Moving#removePlugin}
         */
        IPlugin: {
            value: IPlugin
        },
        /**
         * Интерфейс управления панелью. Позволяет переключаться в соседние ячейки панели.
         * Добавляемые плагины управления панелью должны быть именно такого типа.
         * @type {IControl}
         * @see {@link ControlManager#add}
         * @see {@link ControlManager#remove}
         */
        IControl: {
            value: IControl
        }
    });
});
