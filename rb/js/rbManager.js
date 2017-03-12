define(['moving'], function(Moving) {
    "use strict";

    /**
     * callback-функция, которая будет выполнена после инициализации панелей
     *
     * @callback module:RbManager~initCallback
     * @param {Moving[]} Instances Набор панелей, действующих в данный момент на странице
     */
    /**
     * Функция, инициализирующая расположенные в данный момент на странице панели.
     * Если startScreens не задан, первым аргументом может быть callback.
     * Оживляются элементы с классом rb-wrapper, находящиеся на странице, в качестве идентификатора берется значение
     * атрибута data-id или id, иначе идентификатор будет назначен самостоятельно.
     * Инициализация запускается асинхронно, сразу как только страница будет отрендерена.
     * @param {Object.<string, ScreenModel>} [startScreens] набор моделей контента, которые будут для панелей моделями по умолчанию.
     * @param {module:RbManager~initCallback} [callback] функция, которая будет выполнена после инициализации панелей
     * @memberOf module:RbManager
     */
    function initLayout(startScreens, callback) {
        if (typeof startScreens === 'function') {
            callback = startScreens;
            startScreens = undefined;
        }

        function waitJQuery() {
            $(function() {
                var $rbWrapper = $('.rb-wrapper');
                var loadingPromises = [];

                for (var i = 0; i < $rbWrapper.length; i++) {
                    var elemWrapper = $rbWrapper.eq(i),
                        id = elemWrapper.data('id') || elemWrapper.attr('id') || 'instance_' + i;

                    if (rb.Instances[id] === undefined) {
                        elemWrapper.html('<div class="rb"><div tabindex="-1" class="rb__fake-element"></div></div>');

                        var $rb = elemWrapper.find('>.rb'),
                            inst = new Moving($rb, startScreens && startScreens[id]);
                        loadingPromises.push(inst._loadingPromise);

                        Object.defineProperty(rb.Instances, id, {
                            value: inst,
                            configurable: true,
                            enumerable: true
                        });
                    }
                }

                Promise.all(loadingPromises).then(function() {
                    callback && callback(rb.Instances);
                });
            });
        }

        function timeoutFunc() {
            if (typeof jQuery === 'undefined') {
                setTimeout(timeoutFunc, 0);
            } else {
                waitJQuery();
            }
        }

        timeoutFunc();
    }

    /**
     * Функция, удаляющая панель со страницы
     * @param {string} id Идентификатор модели контента
     * @memberOf module:RbManager
     * @see {@link ScreenModel#toString}
     */
    function remove(id) {
        if (rb.Instances.hasOwnProperty(id)) {
            rb.Instances[id].destroy();
            delete rb.Instances[id];
        }
    }

    function batchAction(action, args) {
        var res = [];
        for (var id in rb.Instances) {
            if (rb.Instances.hasOwnProperty(id)) {
                var inst = rb.Instances[id];
                res.push(inst[action].apply(inst, args));
            }
        }
        return res;
    }

    /**
     * Применить конфигурацию к панелям
     * @param {Moving~config} config - конфигурация
     * @memberOf module:Batch
     * @see {@link Moving#configure}
     */
    function configure(config) {
        batchAction('configure', arguments);
    }
    /**
     * Осуществить переход для всех панелей в указанную сторону.
     * @param {string} side - сторона, в которую осуществляется переход
     * @param {Boolean} [isSaveHistory] - сохранять ли осуществляемый переход в историю переходов
     * @returns {Promise} promise о завершении действия во всех панелях
     * @memberOf module:Batch
     * @see {@link Moving#move}
     */
    function move(side, isSaveHistory) {
        return Promise.all(batchAction('move', arguments));
    }
    /**
     * Осуществить откат последнего удачного хода, воспользовавшись историей переходов.
     * @returns {Promise} promise о завершении действия во всех панелях
     * @memberOf module:Batch
     * @see {@link Moving#moveBack}
     */
    function moveBack() {
        return batchAction('moveBack', arguments);
    }
    /**
     * Анимировать запрещенное перемещение в одну из сторон. В панели в эту сторону перемещение может быть запрещено,
     * но будет анимировано, будто запрещено. Это полезно, например, если необходимо, чтобы либо все панели были перемещены
     * в одну из сторон, либо все анимировали запрещенный переход.
     * @param {string} side - сторона, в которую осуществляется переход
     * @returns {Promise} promise о завершении действия во всех панелях
     * @memberOf module:Batch
     * @see {@link Moving#animateWrongSide}
     */
    function animateWrongSide(side) {
        return Promise.all(batchAction('animateWrongSide', arguments));
    }

    /**
     * Установить модель контента в текущую ячейку панелей.
     * @param {ScreenModel} screen - Устанавливаемая модель контента
     * @param {Boolean} [isSaveHistory] - Сохранять ли устанавливаемую модель в историю переходов
     * @returns {Promise} promise о завершении установки модели во все панели
     * @memberOf module:Batch
     * @see {@link Moving#setScreen}
     */
    function setScreen(screen, isSaveHistory) {
        return Promise.all(batchAction('setScreen', arguments));
    }
    /**
     * Перезагрузить все панели на странице. Перезагрузка предполагает обновление верстки ячейки панели,
     * сброс состояния в верстке. Если в элементах верстки есть подписки, необходимо позаботиться об отписке и
     * последующей подписке к новым элементам верстки.
     * @prop {string} side - сторона, с которой будет перезагружаться ячейка панели относительно текущей ячейки.
     * @memberOf module:Batch
     * @see {@link Moving#reload}
     */
    function reload(side) {
        batchAction('reload', arguments);
    }
    /**
     * Удалить все панели со страницы.
     * @memberOf module:Batch
     * @see {@link module:RbManager.remove}
     */
    function removeAll() {
        for (var id in rb.Instances) {
            remove(id);
        }
    }

    /**
     * Пакетированные действия на панелях, то есть выполняемые для всех панелей разом.
     * @typedef {Object} Batch
     * @module Batch
     */
    var Batch = {
        configure: configure,
        move: move,
        moveBack: moveBack,
        animateWrongSide: animateWrongSide,
        setScreen: setScreen,
        reload: reload,
        removeAll: removeAll
    };

    /**
     * Module rbManager.
     * @module RbManager
     */
    return {
        initLayout: initLayout,
        remove: remove,
        /**
         * @type module:Batch
         */
        Batch: Batch
    };
});