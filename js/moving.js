define(['errors', 'IPlugin', 'screenModel', 'animation', 'screenManager', 'baseDispatcher', 'controlManager', 'swipesControl', 'arrowsControl', 'keydownControl', 'elementsPool', 'utils'], function(
    Errors, IPlugin, ScreenModel, Animation, ScreenManager, BaseDispatcher, ControlManager, SwipesControl, ArrowsControl, KeydownControl, ElementsPool, Utils) {
    "use strict";

    var sides = Utils.sidesWithCenter;

    /**
     * @class
     * Класс управления панелью
     * @param {JQuery} mainDiv - элемент, в котором располагается панель. Должен содержать класс rb-wrapper.
     * @param {ScreenModel} startScreen - стартовая модель контента
     * @constructor Moving
     */
    function Moving(mainDiv, startScreen) {
        if (mainDiv instanceof $) {
            this._mainDiv = mainDiv;
        } else {
            throw new Errors.ArgumentError('mainDiv', mainDiv);
        }

        /**
         * Диспетчер, выполняющий зарегистрированные функции до выполнения перехода к новой ячейке в панели
         * @name beforeMoveDispatcher
         * @memberOf Moving#
         */
        this.beforeMoveDispatcher = new BaseDispatcher(mainDiv);
        /**
         * Диспетчер, выполняющий зарегистрированные функции до рендеринга контента моделей на странице после перехода
         * @name beforeRenderDispatcher
         * @memberOf Moving#
         */
        this.beforeRenderDispatcher = new BaseDispatcher(mainDiv);
        /**
         * Диспетчер, выполняющий зарегистрированные функции после рендеринга контента моделей на странице после перехода
         * @name afterRenderDispatcher
         * @memberOf Moving#
         */
        this.afterRenderDispatcher = new BaseDispatcher(mainDiv);
        this._screenManager = new ScreenManager();
        this._elementsPool = new ElementsPool(mainDiv, this._screenManager);
        this._animation = new Animation(mainDiv, this._elementsPool);
        this._controlManager = new ControlManager();
        if (Utils.isMobile) {
            this._controlManager
                .add('swipes', new SwipesControl(mainDiv,this._moveByActionValue.bind(this)));
        } else {
            this._controlManager
                .add('arrows', new ArrowsControl(mainDiv, this._moveByActionValue.bind(this), this.afterRenderDispatcher))
                .add('keyboard', new KeydownControl(mainDiv, this._moveByActionValue.bind(this)));
        }

        this._plugins = [];

        this.resetConfig();
        this._loadingPromise = this.setScreen(startScreen || ScreenModel.getMainScreen(), false);
        this._controlManager.enableAll();
        //if (mainDiv.length) {
        //    mainDiv[0].moving = this;
        //}

        var self = this;

        this._clickHandler = function(e) {
            if ($(e.target).closest('.rb').length && !$(document.activeElement).closest('.rb').length) {
                self.activate();
            }
        };
        mainDiv.on('click', this._clickHandler);

        this._relativeUpdateFn = this._reloadScreen.bind(this);
        ScreenModel.registerUpdateFn(this._relativeUpdateFn);
    }

    /**
     * Сбросить конфигурацию панели к значению по умолчанию (какое именно - см. в коде).
     * @memberOf Moving
     */
    Moving.prototype.resetConfig = function() {
        this.configure({
            wrongTime1: 500,
            wrongTime2: 500,
            correctTime: 1000,
            wrongEasing1: 'easeInExpo',
            wrongEasing2: 'easeOutElastic',
            correctEasing: 'easeOutExpo',
            hideArrowsAfterTime: true,
            hideArrowsTime: 2000,
            showArrowsOutside: true,
            showArrowsOnHover: true,
            loadingHtml: '<div class="rb__loading_wrapper"><div class="rb__loader"></div></div>',
            //http://www.javascripter.net/faq/keycodes.htm
            //https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
            leftKey: [37, 'a'],
            topKey: [38, 'w'],
            rightKey: [39, 'd'],
            bottomKey: [40, 's'],
            maxHistoryLength: 10,
            lockControls: false,
            showAdjacentScreens: true,
            saveHistoryInPool: false,
            pointersForSwipe: 1,
            isDirectPath: true,
            savePrevious: true,

            cyclicStep: true,

            getRight: function(screen) {
                var childIndex = screen.defaultChildIndex();
                //this._lastScreen = screen; // todo эта логика нужна здесь а не так где она сейчас, чтобы все было инкапсулировано в эти функции
                //this._lastSide = 'right';
                return screen.getChild(childIndex);
            },
            getLeft: function(screen) {
                var parentIndex = screen.defaultParentIndex();
                //this._lastScreen = screen;
                //this._lastSide = 'left';
                return screen.getParent(parentIndex);
            },
            getTop: function(screen, cyclicStep) {
                function getNextIndex(index, length) {
                    return cyclicStep ? Utils.cycledNumber(index - 1, length) : (index - 1);
                }
                var index;
                if (this._lastSide === 'left') {
                    index = this._lastScreen.getParentIndex(screen);
                    return this._lastScreen.getParent(getNextIndex(index, this._lastScreen.parentsLength()));
                }
                if (this._lastSide === 'right') {
                    index = this._lastScreen.getChildIndex(screen);
                    return this._lastScreen.getChild(getNextIndex(index, this._lastScreen.childrenLength()));
                }
                var parent = this._getLeft(screen);
                if (parent) {
                    index = parent.getChildIndex(screen);
                    return parent.getChild(getNextIndex(index, parent.childrenLength()));
                }
                var child = this._getRight(screen);
                if (child) {
                    index = child.getParentIndex(screen);
                    return child.getParent(getNextIndex(index, child.parentsLength()));
                }
            },
            getBottom: function(screen, cyclicStep) {
                function getNextIndex(index, length) {
                    return cyclicStep ? Utils.cycledNumber(index + 1, length) : (index + 1);
                }
                var index;
                if (this._lastSide === 'left') {
                    index = this._lastScreen.getParentIndex(screen);
                    return this._lastScreen.getParent(getNextIndex(index, this._lastScreen.parentsLength()));
                }
                if (this._lastSide === 'right') {
                    index = this._lastScreen.getChildIndex(screen);
                    return this._lastScreen.getChild(getNextIndex(index, this._lastScreen.childrenLength()));
                }
                var parent = this._getLeft(screen);
                if (parent) {
                    index = parent.getChildIndex(screen);
                    return parent.getChild(getNextIndex(index, parent.childrenLength()));
                }
                var child = this._getRight(screen);
                if (child) {
                    index = child.getParentIndex(screen);
                    return child.getParent(getNextIndex(index, child.parentsLength()));
                }
            }
        });
    };
    /**
     * @typedef {function} Moving~getLeft
     * Функция, задающая алгоритм поиска ячейки, в которую должен быть осуществлен переход влево.
     * По умолчанию берет опцию defaultParentIndex у экземпляра ScreenModel и ищет предка модели с этим индексом.
     * @param {ScreenModel} screen - текущая модель контента панели
     */
    /**
     * @typedef {function} Moving~getTop
     * Функция, задающая алгоритм поиска ячейки, в которую должен быть осуществлен переход вверх.
     * По умолчанию смотрит, осуществлялись ли переходы влево-вправо,
     * если последним таким был переход вправо, то берется модель, из которой был сделан шаг вправо и в контексте ее потомков
     * от текущего потомка будет найден предыдущий потомок и возвращен в качестве результата.
     * Если при этом стоит опция cyclicStep = true, то в случае самого верхнего потомка следующим будет возвращен самый нижний потомок.
     * Если последним был переход влево, то берется модель, из которой был сделан шаг влево и в контексте ее предков
     * от текущего предка будет найден предыдущий предок и возвращен в качестве результата.
     * Если при этом стоит опция cyclicStep = true, то в случае самого верхнего предка следующим будет возвращен самый нижний предок.
     * А если переходов влево-вправо не было, будет считаться, будто бы был сделан переход вправо, а если и это не помогло,
     * будет считаться, будто был сделан переход влево.
     * Если у модели нет предков, следующая модель не будет найдена.
     * @param {ScreenModel} screen - текущая модель контента панели
     * @param {boolean} cyclicStep - делать ли цикличный переход в контексте массива моделей, в котором будет искаться новая модель.
     */
    /**
     * @typedef {function} Moving~getRight
     * Функция, задающая алгоритм поиска ячейки, в которую должен быть осуществлен переход вправо.
     * По умолчанию берет опцию defaultChildIndex у экземпляра ScreenModel и ищет потомка модели с этим индексом.
     * @param {ScreenModel} screen - текущая модель контента панели
     */
    /**
     * @typedef {function} Moving~getBottom
     * Функция, задающая алгоритм поиска ячейки, в которую должен быть осуществлен переход вниз.
     * По умолчанию смотрит, осуществлялись ли переходы влево-вправо,
     * если последним таким был переход вправо, то берется модель, из которой был сделан шаг вправо и в контексте ее потомков
     * от текущего потомка будет найден следующий потомок и возвращен в качестве результата.
     * Если при этом стоит опция cyclicStep = true, то в случае самого нижнего потомка следующим будет возвращен самый верхний потомок.
     * Если последним был переход влево, то берется модель, из которой был сделан шаг влево и в контексте ее предков
     * от текущего предка будет найден следующий предок и возвращен в качестве результата.
     * Если при этом стоит опция cyclicStep = true, то в случае самого нижнего предка следующим будет возвращен самый верхний предок.
     * А если переходов влево-вправо не было, будет считаться, будто бы был сделан переход вправо, а если и это не помогло,
     * будет считаться, будто был сделан переход влево.
     * Если у модели нет предков, следующая модель не будет найдена.
     * @param {ScreenModel} screen - текущая модель контента панели
     * @param {boolean} cyclicStep - делать ли цикличный переход в контексте массива моделей, в котором будет искаться новая модель.
     */
    /**
     * Конфигурация панели
     * @typedef {Object} Moving~config
     * @property {number} [wrongTime1] - Время, затрачиваемое на первую часть неудачного перехода
     * @property {number} [wrongTime2] - Время, затрачиваемое на вторую часть неудачного перехода
     * @property {number} [correctTime] - Время, затрачиваемое на удачный переход
     * @property {string} [wrongEasing1] - Анимация первой части неудачного перехода.<br> jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
     * @property {string} [wrongEasing2] - Анимация второй части неудачного перехода.<br> jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
     * @property {string} [correctEasing] - Анимация удачного перехода.<br> jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
     * @property {boolean} [hideArrowsAfterTime] - Скрывать ли стрелки перемещения после некоторого времени, чтобы можно было нажимать на элементы, которые находятся под этими стрелками.
     * @property {number} [hideArrowsTime] - Через какой промежуток времени скрывать стрелки перемещения
     * @property {boolean} [showArrowsOutside] - Показывать ли стрелки перемещения снаружи от панели (иначе показывать внутри панели)
     * @property {boolean} [showArrowsOnHover] - Показывать ли стрелки при наведении мыши (иначе показывать всегда)
     * @property {string|null} [loadingHtml] - Верстка ожидания, показываемая во время, пока контент еще не был вставлен в панель
     * @property {(string|number|Array.<string|number>)} [leftKey] - Клавиши, при нажатии на которые будет сделан переход влево.
     * Могут использоваться строковые или числовые нотации клавиш.<br>
     * http://www.javascripter.net/faq/keycodes.htm<br>
     * https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
     * @property {(string|number|Array.<string|number>)} [topKey] - Клавиши, при нажатии на которые будет сделан переход вверх.
     * @property {(string|number|Array.<string|number>)} [rightKey] - Клавиши, при нажатии на которые будет сделан переход вправо.
     * @property {(string|number|Array.<string|number>)} [bottomKey] - Клавиши, при нажатии на которые будет сделан переход вниз.
     * @property {number} [maxHistoryLength] - Максимальная длина хранимой истории удачных переходов.
     * @property {boolean} [lockControls] - Заблокированы ли элементы управления переходами, пока происходит анимация перехода (любые способы управления).
     * @property {boolean} [showAdjacentScreens] - Отображать ли старую ячейку при анимации перехода на новую ячейку панели.
     * @property {boolean} [saveHistoryInPool] - Хранить ли верстку ячеек панели, которые хранятся в истории переходов.
     * @property {number} [pointersForSwipe] - Количество пальцев, необходимых для свайпа при переходе на новую ячейку на мобильных устройствах.
     * @property {boolean} [isDirectPath] - Использовать ли при поиске кратчайшего пути до указанной модели только переходы
     * от потомков к предкам и от предков к потомкам (иначе переходы по массивам предков и по массивам потомков тоже будут считаться отдельными переходами)
     * @property {boolean} [savePrevious] - сохранять ли предков (если шаг в сторону потомка) и потомков (если шаг в сторону предка), с которых был сделан переход,
     * чтобы в дальнейшем вернутся в них при переходе обратно с ячейки, в которую был сделан переход.
     * @property {boolean} [cyclicStep] - делать ли цикличный переход в контексте массива моделей, в котором будет искаться новая модель.
     * @property {Moving~getRight} [getRight] - Функция, задающая алгоритм поиска ячейки, в которую должен быть осуществлен переход вправо
     * @property {Moving~getLeft} [getLeft] - Функция, задающая алгоритм поиска ячейки, в которую должен быть осуществлен переход влево
     * @property {Moving~getTop} [getTop] - Функция, задающая алгоритм поиска ячейки, в которую должен быть осуществлен переход вверх
     * @property {Moving~getBottom} [getBottom] - Функция, задающая алгоритм поиска ячейки, в которую должен быть осуществлен переход вниз
     */
    /**
     * Применить конфигурацию к панели
     * @param {Moving~config} config - конфигурация
     * @memberOf Moving
     */
    Moving.prototype.configure = function(config) {
        if (!config) return;

        this._plugins.forEach(function(plugin) {
            plugin.configure(config);
        });

        this._animation.configure(config);
        this._elementsPool.configure(config);
        this._screenManager.configure(config);
        this._controlManager.configure(config);

        if (config.loadingHtml) {
            config.loadingDiv = '<div class="rb__loading">' + config.loadingHtml + '</div>';
        } else if (config.loadingHtml === null) {
            config.loadingDiv = '';
        }

        this.beforeMoveDispatcher.configure(config);
        this.beforeRenderDispatcher.configure(config);
        this.afterRenderDispatcher.configure(config);

        if (typeof config === 'object') {
            if (config.lockControls !== undefined) {
                this._lockControls = config.lockControls;
            }
        }

        // updates internal state
        if (this._screenManager.getCurScreen()) { // todo то есть если только это не new Moving иначе еще рано да и не надо
            this._reloadScreen();
        }
    };

    // todo defineProperty, и вообще доступ к объектам в api сделать через defineProperty
    /**
     * Получить менеджер управления
     * @returns {ControlManager} ControlManager
     * @memberOf Moving
     */
    Moving.prototype.getControlManager = function() {
        return this._controlManager;
    };
    /**
     * Получить менеджер моделей контента
     * @returns {ScreenManager} ScreenManager
     * @memberOf Moving
     */
    Moving.prototype.getScreenManager = function() {
        return this._screenManager;
    };

    /**
     * Осуществить переход в указанную сторону.
     * @param {string} side - сторона, в которую осуществляется переход
     * @param {Boolean} [isSaveHistory] - сохранять ли осуществляемый переход в историю переходов
     * @returns {Promise|undefined} promise о завершении действия, либо undefined, если переход не требуется
     * @memberOf Moving
     */
    Moving.prototype.move = function(side, isSaveHistory) {
        var self = this,
            screen = this._screenManager.getCurScreen();
        if (side) {
            return Promise.race([ this.beforeMoveDispatcher.runActions(
                self._moveInner.bind(self, side, screen, isSaveHistory),
                [side, self._screenManager.getCurScreen(), self]
            ) ]);
        }
    };
    Moving.prototype._moveInner = function(side, screen, isSaveHistory) {
        var self = this;

        if (this._lockControls && !this._locks) {
            this._locks = this._controlManager.disableAll();
        }

        this._screenManager._updateScreens('center', screen, isSaveHistory);

        return new Promise(function (moveResolve, moveReject) {

            if (!self._screenManager.getRelativeScreen(side)) {
                self._animation.goToWrongSide(side).then(function(result) {
                    if (result) {
                        self._renderHtml(side, moveResolve.bind(undefined, {
                            how: 'wrongSide',
                            isOk: result
                        }));
                    }
                });
            } else if (side === 'center') {
                self._elementsPool.prepareSide();
                self._animation.goToCenter();
                self._renderHtml(side, moveResolve.bind(undefined, {
                    how: 'center',
                    isOk: true
                }));
            } else if (sides.indexOf(side) !== -1) {
                if (side === 'left' || side === 'right') {
                    self._screenManager._lastSide = side; // todo надо инкапсулировать
                    self._screenManager._lastScreen = self._screenManager.getCurScreen();
                }

                self._screenManager._updateScreens(side, undefined, isSaveHistory);
                self._elementsPool.prepareSide();

                self._animation.goToCorrectSide(side).then(function(result) {
                    if (result) {
                        self._renderHtml(side, moveResolve.bind(undefined, {
                            how: 'correctSide',
                            isOk: result
                        }));
                    }
                });
            } else {
                moveReject(new Errors.ArgumentError('side', side));
            }
        });
    };
    Moving.prototype._moveByActionValue = function(value, ltrbValues, mapFn) {
        function check(value, checkValues) {
            var res;
            if (Array.isArray(checkValues)) {
                res = checkValues.find(function(checkValue) {
                    return mapFn(value, checkValue);
                });
                res = res !== undefined;
            } else {
                res = mapFn(value, checkValues);
            }
            return res;
        }

        var side;
        if (check(value, ltrbValues[0])) side = 'left';
        else if (check(value, ltrbValues[1])) side = 'top';
        else if (check(value, ltrbValues[2])) side = 'right';
        else if (check(value, ltrbValues[3])) side = 'bottom';
        return this.move(side);
    };

    /**
     * Осуществить откат последнего удачного хода, воспользовавшись историей переходов.
     * @returns {Promise|undefined} promise о завершении действия, либо undefined, если переход не требуется
     * @memberOf Moving
     */
    Moving.prototype.moveBack = function() {
        var lastStep = this._screenManager.popHistory();
        if (lastStep) {

            var curScreen = this._screenManager.getCurScreen(),
                nextScreen = lastStep.screen,
                side = lastStep.side,
                mustUpdate = false;
            if (side === 'left' && curScreen.getParent(nextScreen)) { // todo неправильно! нельзя затачиваться на структуру
                mustUpdate = true;
            } else if (side === 'right' && curScreen.getChild(nextScreen)) {
                mustUpdate = true;
            } else if (side === 'bottom' && this._screenManager._getBottom(curScreen, this._screenManager._cyclicStep) === nextScreen) {
                mustUpdate = true;
            } else if (side === 'top' && this._screenManager._getTop(curScreen, this._screenManager._cyclicStep) === nextScreen) {
                mustUpdate = true;
            } else {
                return null;
            }
            if (mustUpdate) {
                this._screenManager._setRelativeScreen(this._screenManager.getCurScreen(), side, nextScreen);
            }

            var self = this;
            if (side) {
                return Promise.race([ this.beforeMoveDispatcher.runActions(
                    self._moveInner.bind(self, lastStep.side, curScreen, false),
                    [side, self._screenManager.getCurScreen(), self]
                ) ]);
            }
        }
        return null;
    };

    /**
     * Анимировать запрещенное перемещение в одну из сторон. В панели в эту сторону перемещение может быть запрещено,
     * но будет анимировано, будто запрещено.
     * @param {string} side - сторона, в которую осуществляется переход
     * @returns {Promise} promise о завершении действия
     * @memberOf Moving
     */
    Moving.prototype.animateWrongSide = function(side) {
        return this._animation.goToWrongSide(side);
    };

    /**
     * Установить модель контента в текущую ячейку панели.
     * @param {ScreenModel} screen - Устанавливаемая модель контента
     * @param {Boolean} [isSaveHistory] - Сохранять ли устанавливаемую модель в историю переходов
     * @returns {Promise} promise о завершении установки модели
     * @memberOf Moving
     */
    Moving.prototype.setScreen = function(screen, isSaveHistory) {
        var self = this;
        return Promise.race([ this.beforeMoveDispatcher.runActions(
            self._moveInner.bind(self, 'center', screen, isSaveHistory),
            ['center', self._screenManager.getCurScreen(), self]
        ) ]);
    };
    // todo это слишком много, нужно выделить тот функционал который реально релоадит, и вызывать его везде в том числе в ините где сейчас дергается move
    Moving.prototype._reloadScreen = function() {
        return this.setScreen(this._screenManager.getCurScreen(), false);
    };

    /**
     * Перезагрузить все панели на странице. Перезагрузка предполагает обновление верстки ячейки панели,
     * сброс состояния в верстке. Если в элементах верстки есть подписки, необходимо позаботиться об отписке и
     * последующей подписке к новым элементам верстки.
     * @prop {string} side - сторона, с которой будет перезагружаться ячейка панели относительно текущей ячейки.
     * @memberOf Moving
     */
    Moving.prototype.reload = function(side) {
        side = side || 'center';
        var rbSide = this._elementsPool.getElementBySide(side);
        var screen = this._screenManager.getRelativeScreen(side);
        rbSide.html(screen.html());
    };

    Moving.prototype._renderHtml = function(side, moveResolve) {
        var self = this,
            args = [side, self._screenManager.getCurScreen(), self];

        function afterRender() {
            self.activate();
            self.afterRenderDispatcher.runActions(Utils.nop, args);
            if (self._lockControls) {
                self._controlManager.enableByValues(self._locks);
                self._locks = null;
            }
            moveResolve();
        }

        this.beforeRenderDispatcher.runActions(function() {
            var iframeCount, loadedIframeCount = 0, iframes;

            iframes = self._mainDiv.find('iframe');
            self._elementsPool.loadElements();
            iframes = self._mainDiv.find('iframe').not(iframes);

            iframeCount = iframes.length;
            iframes.one('load', function() {
                loadedIframeCount++;
                if (iframeCount === loadedIframeCount) {
                    afterRender();
                }
            });

            setTimeout(function() {
                if (iframeCount === 0) {
                    afterRender();
                }
            }, 0);
        }, args);
    };

    /**
     * Активировать панель. Переводит фокус на панель, и, как следствие, панель ловит все события нажатия клавиш.
     * @memberOf Moving
     */
    Moving.prototype.activate = function() {
        this._mainDiv.find('>.rb__fake-element').focus();
    };

    /**
     * Находит кратчайший путь до указанной модели и пошагово переходит от текущей ячейки к той ячейке, в которой располагается найденная модель.
     * @param {ScreenModel} toScreen - Искомая модель контента
     * @returns {Promise} promise о завершении переходов к намеченной цели
     * @memberOf Moving
     */
    Moving.prototype.goToScreen = function(toScreen) {
        function firstStep(path) {
            return new Promise(function(resolve, reject) {
                nextStep(path, 0, resolve, reject);
            });
        }
        function nextStep(path, i, resolve, reject) {
            if (!path) {
                self._controlManager.enableByValues(locks);
                reject(new Errors.PathNotFoundError(fromScreen, toScreen));
                return;
            }
            if (i === path.length - 1) {
                self._controlManager.enableByValues(locks);
                resolve();
                return;
            }
            if ( i > path.length - 1) {
                self._controlManager.enableByValues(locks);
                reject(new Errors.FatalError('goToScreen : i > path.length - 1'));
                return;
            }

            var curScreen = path[i],
                nextScreen = path[i+1],
                side;

            if (curScreen.getParent(nextScreen)) { // todo неправильно! нельзя затачиваться на структуру
                side = 'left';
            } else if (curScreen.getChild(nextScreen)) {
                side = 'right';
            } else if (self._screenManager._getBottom(curScreen, self._screenManager._cyclicStep) === nextScreen) {
                side = 'bottom';
            } else if (self._screenManager._getTop(curScreen, self._screenManager._cyclicStep) === nextScreen) {
                side = 'top';
            } else {
                self._controlManager.enableByValues(locks);
                reject(new Errors.FatalError('goToScreen : side not found'));
            }

            self._screenManager._setRelativeScreen(self._screenManager.getCurScreen(), side, nextScreen);

            self.afterRenderDispatcher.add(function() {
                self.afterRenderDispatcher.add(function() {
                    nextStep(path, i+1, resolve, reject);
                }, true);
                self.move(side);
            }, true);

            self.setScreen(curScreen, false);
        }
        var self = this,
            locks = this._controlManager.disableAll(),
            fromScreen = this._screenManager.getCurScreen(),
            path = this._screenManager.findShortestPath(fromScreen, toScreen);

        return firstStep(path);
    };

    /**
     * Добавить плагин, расширяющий функционал панели, к общему списку плагинов.
     * @param {IPlugin} plugin - добавляемый плагин
     * @memberOf Moving
     */
    Moving.prototype.addPlugin = function(plugin) {
        if (plugin instanceof IPlugin) {
            this._plugins.push(plugin);
        } else {
            console.error('Moving - addPlugin - argument must be IPlugin');
        }
    };
    /**
     * Удалить плагин из общего списка плагинов
     * @param {IPlugin} plugin - удаляемый плагин
     * @memberOf Moving
     */
    Moving.prototype.removePlugin = function(plugin) {
        var index = this._plugins.indexOf(plugin);
        if (index != -1) {
            plugin.destroy();
            this._plugins.splice(index, 1);
        }
    };

    /**
     * Уничтожить панель
     * @memberOf Moving
     */
    Moving.prototype.destroy = function() {
        ScreenModel.unregisterUpdateFn(this._relativeUpdateFn);

        this._plugins.forEach(function(plugin) {
            plugin.destroy();
        });

        this.beforeMoveDispatcher.destroy();
        this.beforeRenderDispatcher.destroy();
        this.afterRenderDispatcher.destroy();
        this._animation.destroy();
        this._controlManager.destroy();
        this._screenManager.destroy();
        this._elementsPool.destroy();
        this._animation = null;
        this._elementsPool = null;
        this._screenManager = null;
        this._controlManager = null;
        this.beforeMoveDispatcher = null;
        this.beforeRenderDispatcher = null;
        this.afterRenderDispatcher = null;

        this._mainDiv.off('click', this._clickHandler);
        this._mainDiv.remove();
    };

    return Moving;
});
