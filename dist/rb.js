var rb =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Модуль, содержащий всякие полезные переменные и функции
 * @module Errors
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {

    function CustomError(property) {
        this.name = this.name || "CustomError";

        this.property = property;
        this.message = this.name + ": " + property;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        } else {
            this.stack = (new Error()).stack;
        }
    }

    /**
     * @class
     * Класс ошибки, означающий неправильно переданный в функцию аргумент
     * @param {string} argName - название аргумента
     * @param {Object} arg - значение аргумента
     * @constructor module:Errors~ArgumentError
     */
    function ArgumentError(argName, arg) {
        if (typeof arg === 'function') {
            arg = 'function() {...}';
        } else {
            arg = JSON.stringify(arg);
        }
        arg = 'wrong function argument "' + argName + '": ' + arg;
        this.name = 'ArgumentError';
        CustomError.apply(this, [arg]);
    }
    ArgumentError.prototype = Object.create(CustomError.prototype);
    ArgumentError.prototype.constructor = ArgumentError;

    /**
     * @class
     * Класс ошибки, означающий, что путь от одной модели до другой модели не был найден
     * @param {ScreenModel} fromScreen - модель, из которой осуществлялся поиск
     * @param {ScreenModel} toScreen - модель, в которую осуществлялся поиск
     * @constructor module:Errors~PathNotFoundError
     */
    function PathNotFoundError(fromScreen, toScreen) {
        this.name = 'PathNotFoundError';
        var arg = 'path not found: from ' + fromScreen.toString() + ' to ' + toScreen.toString();
        CustomError.apply(this, [arg]);
    }
    PathNotFoundError.prototype = Object.create(CustomError.prototype);
    PathNotFoundError.prototype.constructor = PathNotFoundError;

    /**
     * @class
     * Класс ошибки, означающий критическую ошибку логики
     * @param {string} property - подробности ошибки
     * @constructor module:Errors~FatalError
     */
    function FatalError(property) {
        this.name = 'FatalError';
        CustomError.apply(this, arguments);
    }
    FatalError.prototype = Object.create(CustomError.prototype);
    FatalError.prototype.constructor = FatalError;

    /**
     * @class
     * Класс ошибки, означающий, что функция интерфейса еще не реализована
     * @param {string} module - название интерфейса
     * @param {string} functionName - название функции
     * @constructor module:Errors~NotRealizedError
     */
    function NotRealizedError(module, functionName) {
        this.name = 'NotRealizedError';
        var arg = 'Not realized ' + module + ':' + functionName;
        CustomError.apply(this, [arg]);
    }
    NotRealizedError.prototype = Object.create(CustomError.prototype);
    NotRealizedError.prototype.constructor = NotRealizedError;

    return /** @alias module:Errors */ {
        /**
         * Класс ошибки, означающий неправильно переданный в функцию аргумент
         * @type {module:Errors~ArgumentError}
         */
        ArgumentError: ArgumentError,
        /**
         * Класс ошибки, означающий, что путь от одной модели до другой модели не был найден
         * @type {module:Errors~PathNotFoundError}
         */
        PathNotFoundError: PathNotFoundError,
        /**
         * Класс ошибки, означающий, что функция интерфейса еще не реализована
         * @type {module:Errors~NotRealizedError}
         */
        NotRealizedError: NotRealizedError,
        /**
         * Класс ошибки, означающий критическую ошибку логики
         * @type {module:Errors~FatalError}
         */
        FatalError: FatalError
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Модуль, содержащий всякие полезные переменные и функции
 * @module Utils
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Errors) {
    "use strict";

    /**
     * Функция, возвращающая противоположную сторону к исходной
     * @param {string} side - исходная сторона
     * @returns {string} противоположная сторона
     * @memberOf module:Utils
     */
    function oppositeSide(side) {
        if (side === 'left') return 'right';
        if (side === 'right') return 'left';
        if (side === 'top') return 'bottom';
        if (side === 'bottom') return 'top';
        if (side === 'center') return 'center';
        throw new Errors.ArgumentError('side', side);
    }
    /**
     * Функция, возвращающая левую (верхнюю) сторону к исходной
     * @param {string} side - исходная сторона
     * @returns {string} левая (верхняя) сторона
     * @memberOf module:Utils
     */
    function getStartSide(side) {
        if (side === 'left') return 'left';
        if (side === 'right') return 'left';
        if (side === 'top') return 'top';
        if (side === 'bottom') return 'top';
        if (side === 'center') return 'center';
        throw new Errors.ArgumentError('side', side);
    }

    /**
     * Возвращает модуль числа index в конечной группе порядка length.
     * @param {number} index - исходное число
     * @param {number} length - порядок группы
     * @returns {number} модуль числа
     * @memberOf module:Utils
     */
    function cycledNumber(index, length) {
        return (index % length + length) % length;
    }
    /**
     * Делает первую букву строки заглавной
     * @param {string} string - исходная строка
     * @returns {string} строка с первой заглавной буквой
     * @memberOf module:Utils
     */
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    /**
     * Подмешать миксин к классу
     * @param {function} base - исходный класс
     * @param {Object} mixin - миксин
     * @memberOf module:Utils
     */
    function mixin(base, mixin) {
        for(var key in mixin) {
            if (mixin.hasOwnProperty(key)) {
                base.prototype[key] = mixin[key];
            }
        }
    }
    /**
     * Унаследовать класс от базового класса
     * @param {function} child - класс-наследник
     * @param {function} parent - базовый класс
     * @memberOf module:Utils
     */
    function inherite(child, parent) {
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
    }
    /**
     * Пустая функция
     * @memberOf module:Utils
     */
    function nop() {}

    // Mobile check
    /**
     * Возвращает флаг, является ли окружение мобильным устройством
     * @returns {boolean} флаг, является ли окружение мобильным устройством
     * @memberOf module:Utils
     */
    function mobileCheck() {
        var check = false;
        (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    if (!Array.prototype.find) {
        Array.prototype.find = function(predicate) {
            if (this == null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        };
    }

    (function(e){
        e.closest = e.closest || function(css){
                var node = this;

                while (node) {
                    if (node.matches(css)) return node;
                    else node = node.parentElement;
                }
                return null;
            }
    })(Element.prototype);

    return /** @alias module:Utils */ {
        /**
         * Массив из возможных сторон
         */
        sides:  ['left', 'top', 'right', 'bottom'],
        /**
         * Массив из возможных сторон включая центральную
         */
        sidesWithCenter:  ['center', 'left', 'top', 'right', 'bottom'],
        /**
         * Является ли окружение мобильным устройством
         */
        isMobile: mobileCheck(),
        nop: nop,
        cycledNumber: cycledNumber,
        oppositeSide: oppositeSide,
        getStartSide: getStartSide,
        capitalizeFirstLetter: capitalizeFirstLetter,
        mixin: mixin,
        inherite: inherite
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Utils, Errors) {
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
        throw new Errors.NotRealizedError('IPlugin', 'configure');
    };

    /**
     * Уничтожить экземпляр интерфейса.
     * @memberOf IPlugin
     */
    IPlugin.prototype.destroy = function() {
        throw new Errors.NotRealizedError('IPlugin', 'destroy');
    };

    return IPlugin;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Utils, IPlugin, Errors) {
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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Errors) {
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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Utils, IPlugin) {
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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(14)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Moving) {
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
    function init(startScreens, callback) {
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
        init: init,
        remove: remove,
        /**
         * @type module:Batch
         */
        Batch: Batch
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2), __webpack_require__(0), __webpack_require__(18)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Utils, IPlugin, Errors) {
    "use strict";

    /**
     * @class
     * Класс анимации переходов в панели
     * @param {JQuery} mainDiv - элемент, в котором располагается панель. Должен содержать класс rb-wrapper.
     * @param {ElementsPool} elementsPool - хранилище элементов ячеек панели
     * @constructor Animation
     * @extends IPlugin
     */
    function Animation(mainDiv, elementsPool) {
        this._elementsPool = elementsPool;

        if (mainDiv instanceof $) {
            this._mainDiv = mainDiv;
        } else {
            throw new Errors.ArgumentError('mainDiv', mainDiv);
        }
    }
    Utils.inherite(Animation, IPlugin);
    /**
     * Применить конфигурацию. Учитывает опции wrongTime1, wrongTime2, correctTime, wrongEasing1, wrongEasing2, correctEasing, showAdjacentScreens.
     * @param {Moving~config} config - конфигурация
     * @memberOf Animation
     */
    Animation.prototype.configure = function(config) {
        function fixTime(argName, time) {
            if (typeof time === 'number') {
                return time > 0 ? time : 1;
            } else {
                if (time === undefined) {
                    return 500;
                } else {
                    throw new Errors.ArgumentError(argName, time);
                }
            }
        }

        if (typeof config === 'object') {
            if (config.wrongTime1 !== undefined) {
                this._wrongTime1 = fixTime('wrongTime1', config.wrongTime1);
            }
            if (config.wrongTime2 !== undefined) {
                this._wrongTime2 = fixTime('wrongTime2', config.wrongTime2);
            }
            if (config.correctTime !== undefined) {
                this._correctTime = fixTime('correctTime', config.correctTime);
            }
            if (config.wrongEasing1 !== undefined) {
                this._wrongEasing1 = config.wrongEasing1;
            }
            if (config.wrongEasing2 !== undefined) {
                this._wrongEasing2 = config.wrongEasing2;
            }
            if (config.correctEasing !== undefined) {
                this._correctEasing = config.correctEasing;
            }
            if (config.showAdjacentScreens !== undefined) {
                this._showAdjacentScreens = config.showAdjacentScreens;
            }
        }
    };

    Animation.prototype._animate = function(elem, side, value, easing, time, beforeFn, afterFn) {

        beforeFn && beforeFn();

        var css = {}, opts;
        css[Utils.getStartSide(side)] = value + '%';
        opts = {
            duration: time,
            easing: easing,
            queue: false,
            done: afterFn
        };

        elem.animate(css, opts);
    };

    Animation.prototype._updateState = function(res, elements) {
        if (this._isAnimate) {
            this._isAnimate = false;
            this._new && this._new.stop();
            this._old && this._old.stop(false, true);
            this._cur && this._cur.stop();
            this._prev && this._prev.stop(false, true);
            this._next && this._next.stop(false, true);
            this._res(false);
        }
        this._isAnimate = true;
        this._old = elements.oldElem;
        this._new = elements.newElem;
        this._cur = elements.curElem;
        this._prev = elements.prevElem;
        this._next = elements.nextElem;
        this._res = res;
    };

    /**
     * Анимация неудачного перехода
     * @param {string} side - сторона перехода
     * @memberOf Animation
     */
    Animation.prototype.goToWrongSide = function(side) {
        var self = this,
            width = 100,
            height = 100,
            elem = this._elementsPool.getElementBySide('center'),
            nextElem = this._elementsPool.getElementBySide(side),
            prevElem = this._elementsPool.getElementBySide(Utils.oppositeSide(side));

        return new Promise(function(res, rej) {
            function wrongAnimate(elem, startLeft, startTop, beforeFn, afterFn) {
                self._animate(elem, side, '+=' + value, self._wrongEasing1, self._isAnimate ? self._wrongTime1 : 10, function() {
                    startLeft -= 100;
                    startTop -= 100;
                    elem.css({'left': startLeft + '%', 'top': startTop + '%'});
                    beforeFn && beforeFn();
                }, function() {
                    self._animate(elem, side, '-=' + value, self._wrongEasing2, self._isAnimate ? self._wrongTime2 : 10, undefined, function() {
                        afterFn && afterFn();
                    });
                });
            }

            self._updateState(res, {
                curElem: elem,
                prevElem: prevElem,
                nextElem: nextElem
            });

            var dw = width/10, dh = height/10, value = 0, relValWidth = 0, relValHeight = 0;

            if (side === 'left') {
                relValWidth = -width;
                value = - dw;
            }
            else if (side === 'right') {
                relValWidth = width;
                value = dw;
            }
            else if (side === 'top') {
                relValHeight = -height;
                value = - dh;
            }
            else if (side === 'bottom') {
                relValHeight = height;
                value = dh;
            }

            if (self._showAdjacentScreens) {
                wrongAnimate(nextElem, width + relValWidth, height + relValHeight, function() {
                    nextElem.toggleClass('rb__hiding-screen', true);
                }, function() {
                    nextElem.toggleClass('rb__hiding-screen', false);
                }, true);
                wrongAnimate(prevElem, width - relValWidth, height - relValHeight, function() {
                    prevElem.toggleClass('rb__hiding-screen', true);
                }, function() {
                    prevElem.toggleClass('rb__hiding-screen', false);
                }, true);
            }
            wrongAnimate(elem, width, height, undefined, function() {
                self._isAnimate = false;
                self._res(true);
            });
        });
    };

    /**
     * Анимация удачного перехода
     * @param {string} side - сторона перехода
     * @memberOf Animation
     */
    Animation.prototype.goToCorrectSide = function(side) {
        var self = this,
            newElem = this._elementsPool.getElementBySide('center'),
            oldElem = this._elementsPool.getElementBySide(Utils.oppositeSide(side)),
            width = 100,
            height = 100;

        return new Promise(function(res, rej) {
            function correctAnimate(elem, startLeft, startTop, beforeFn, afterFn) {
                self._animate(elem, side, '-=' + value, self._correctEasing, self._correctTime, function() {
                    startLeft -= 100;
                    startTop -= 100;
                    elem.css({'left': startLeft + '%', 'top': startTop + '%'});
                    beforeFn && beforeFn();
                }, function() {
                    afterFn && afterFn();
                });
            }

            self._updateState(res, {
                oldElem: oldElem,
                newElem: newElem
            });

            var value = 0, relValWidth = 0, relValHeight = 0;

            if (side === 'left') {
                relValWidth = -width;
                value = - width;
            }
            else if (side === 'right') {
                relValWidth = width;
                value = width;
            }
            else if (side === 'top') {
                relValHeight = -height;
                value = - height;
            }
            else if (side === 'bottom') {
                relValHeight = height;
                value = height;
            }

            if (self._showAdjacentScreens) {
                correctAnimate(oldElem, width, height, function () {
                    oldElem.toggleClass('rb__hiding-screen', true);
                }, function () {
                    oldElem.toggleClass('rb__hiding-screen', false);
                }, true);
            }
            correctAnimate(newElem, width + relValWidth, height + relValHeight, undefined, function() {
                self._isAnimate = false;
                self._res(true);
            });
        });
    };

    /**
     * Переход в центральную ячейку
     * @memberOf Animation
     */
    Animation.prototype.goToCenter = function() {
        var elem = this._elementsPool.getElementBySide('center');
        elem.css({'left': '0%', 'top': '0%'});
    };

    /**
     * Уничтожить экземпляр класса анимации
     * @memberOf Animation
     */
    Animation.prototype.destroy = function() {
        this._new && this._new.stop();
        this._old && this._old.stop();
        this._cur && this._cur.stop();
        this._prev && this._prev.stop();
        this._next && this._next.stop();
        this._res && this._res(false);
    };

    return Animation;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(3), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Utils, IControl, Errors) {
    "use strict";

    /**
     * @class
     * Класс управления панелью с помощью стрелок, отображаемых по сторонам панели.
     * @param {JQuery} mainDiv - элемент, в котором располагается панель. Должен содержать класс rb-wrapper.
     * @param {function} actionFn - функция, определяющая действие при переходе в одну из сторон (Moving.prototype._moveByActionValue)
     * @param {Moving#afterRenderDispatcher} afterRender - Диспетчер, выполняющий зарегистрированные функции после рендеринга контента моделей на странице после перехода
     * @constructor ArrowsControl
     * @extends IControl
     */
    function ArrowsControl(mainDiv, actionFn, afterRender) {
        if (!(mainDiv instanceof $)) {
            throw new Errors.ArgumentError('mainDiv', mainDiv);
        }

        if (typeof actionFn !== 'function') {
            throw new Errors.ArgumentError('actionFn', actionFn);
        }
        this._isEnable = false;
        this._mainDiv = mainDiv.parent();
        this._actionFn = actionFn;
        this._afterRender = afterRender;
    }
    Utils.inherite(ArrowsControl, IControl);

    /**
     * Применить конфигурацию. Учитывает опции hideArrowsTime, showArrowsOutside, showArrowsOnHover, hideArrowsAfterTime.
     * @param {Moving~config} config
     * @memberOf ArrowsControl
     */
    ArrowsControl.prototype.configure = function(config) {
        if (typeof config === 'object') {
            if (config.hideArrowsTime !== undefined) {
                this._hideArrowsTime = config.hideArrowsTime;
            }
            if (config.showArrowsOutside !== undefined) {
                this._showArrowsOutside = config.showArrowsOutside;
            }
            if (config.showArrowsOnHover !== undefined) {
                this._showArrowsOnHover = config.showArrowsOnHover;
            }
            if (config.hideArrowsAfterTime !== undefined) {
                this._hideArrowsAfterTime = config.hideArrowsAfterTime;
            }
        }
        this._containerClass = (this._showArrowsOnHover ? 'rb__arrow-container-hover' : 'rb__arrow-container');
    };
    /**
     *
     * @returns {boolean}
     * @memberOf ArrowsControl
     */
    ArrowsControl.prototype.isEnable = function() {
        return this._isEnable;
    };
    /**
     *
     * @memberOf ArrowsControl
     */
    ArrowsControl.prototype.enable = function() {
        if (this._isEnable) return;

        var self = this;
        var mouseEnterHandler = function(e) {
            if (!self._hideArrowsAfterTime) return;

            var arrow = $(e.currentTarget),
                $body = $('body'),
                arrowOffset = arrow.offset(),
                arrowX = arrowOffset.left,
                arrowY = arrowOffset.top,
                arrowXX = arrowX + arrow.width(),
                arrowYY = arrowY + arrow.height();

            //var timeoutId;
            function mouseMoveHandler(e) {
                var x = e.clientX, y = e.clientY;

                if (!(arrowX < x && x < arrowXX && arrowY < y && y < arrowYY)) {
                    arrow.toggleClass('rb__arrow-none', false);
                    arrow.toggleClass('rb__arrow-cursor', true);
                    $body.off('mousemove', mouseMoveHandler);
                    //clearTimeout(timeoutId);
                }
            }
            function hideArrow() {
                arrow.toggleClass('rb__arrow-none', true);
                arrow.toggleClass('rb__arrow-cursor', false);

                $body.on('mousemove', mouseMoveHandler);
                //timeoutId = setTimeout(function() {
                //    arrow.toggleClass('rb__arrow-none', false);
                //    arrow.toggleClass('rb__arrow-cursor', true);
                //    $body.off('mousemove', mouseMoveHandler);
                //}, 10000);
                // todo если из iframe не всплывает mousemove с нормальными координатами, для iframe не будет работать
            }

            if (arrow.length) {
                arrow[0].hideArrowId = setTimeout(hideArrow, self._hideArrowsTime);
            }
        };
        var mouseLeaveHandler = function(e) {
            if (!self._hideArrowsAfterTime) return;

            var arrow = $(e.currentTarget);
            clearTimeout(arrow[0].hideArrowId);
        };
        var clickHandler = function(e) {
            var arrow = $(e.currentTarget);

            mouseLeaveHandler(e);
            self._afterRender.add(mouseEnterHandler.bind(undefined, e), true);

            self._actionFn(arrow, Utils.sides, function(container, defValue) {
                return container.is('.rb__arrow-container_' + defValue);
            });
        };

        var markup = '';
        Utils.sides.forEach(function(side) {
            markup += '<div class="' +
                self._containerClass +
                ' rb__arrow-cursor rb__arrow-container_' + side + '' +
                (self._showArrowsOutside ? (' rb__arrow-outside_' + side) : '') +
                '">' +
                '<div class="rb__arrow rb__arrow_' + side + '"></div>' +
                '</div>';
        });
        this._mainDiv.append($(markup));

        var $rbArrowContainer = this._mainDiv.find('>.' + this._containerClass);

        $rbArrowContainer.on('click', clickHandler);
        $rbArrowContainer.on('mouseenter', mouseEnterHandler);
        $rbArrowContainer.on('mouseleave', mouseLeaveHandler);
        this._clickHandler = clickHandler;
        this._mouseEnterHandler = mouseEnterHandler;
        this._mouseLeaveHandler = mouseLeaveHandler;

        this._isEnable = true;
    };
    /**
     *
     * @memberOf ArrowsControl
     */
    ArrowsControl.prototype.disable = function() {
        if (!this._isEnable) return;

        var $rbArrowContainer = this._mainDiv.find('>.' + this._containerClass);
        for (var i = 0; i < $rbArrowContainer.length; i++) {
            clearTimeout($rbArrowContainer[i].hideArrowId);
        }
        $rbArrowContainer.off('click', this._clickHandler);
        $rbArrowContainer.off('mouseenter', this._mouseEnterHandler);
        $rbArrowContainer.off('mouseleave', this._mouseLeaveHandler);
        this._clickHandler = null;
        this._mouseEnterHandler = null;
        this._mouseLeaveHandler = null;

        this._mainDiv.find('>.' + this._containerClass).remove();

        this._isEnable = false;
    };
    /**
     *
     * @memberOf ArrowsControl
     */
    ArrowsControl.prototype.destroy = function() {
        this.disable();
    };

    return ArrowsControl;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
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
     * @memberOf ControlManager
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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Utils, IPlugin, BaseDispatcher) {
    "use strict";

    function ElementsPool(mainDiv, screenManager) {
        this._mainDiv = mainDiv;
        this._screenManager = screenManager;
        this._elements = {};
        this._elementsBySide = {};

        this.elementLoadedDispatcher = new BaseDispatcher(mainDiv);
        this.elementUnloadedDispatcher = new BaseDispatcher(mainDiv);
    }
    Utils.inherite(ElementsPool, IPlugin);
    ElementsPool.prototype.configure = function(config) {
        if (typeof config === 'object') {
            if (config.loadingHtml !== undefined) {
                this._loadingHtml = config.loadingHtml;
            }
            if (config.saveHistoryInPool !== undefined) {
                this._saveHistoryInPool = config.saveHistoryInPool;
            }
        }
    };

    // todo load зависит от prepare, поэтому из prepare надо возвращать функцию load
    ElementsPool.prototype.prepareSide = function() {
        function getScreen(side) {
            return self._screenManager._getRelativeScreenByScreen(newScreen, side);
        }
        function prepareRelativeSide(side, screen) {
            var id = screen.toString(),
                element;
            if (!self._elements.hasOwnProperty(id)) {
                element = $('<div class="rb__side rb__hidden rb__loading" data-id="' + id + '">' + self._loadingHtml + '</div>');
                self._mainDiv.prepend(element);
                self._elements[id] = {
                    element: element,
                    screen: screen,
                    state: 'loading'
                };
            } else {
                element = self._elements[id].element;
            }
            if (side === 'center') {
                element.toggleClass('rb__center', true);
                element.toggleClass('rb__hidden', false);
            }

            self._elementsBySide[side] = id;
        }

        var newScreen = this._screenManager.getCurScreen(),
            self = this,
            leftScreen = getScreen('left'),
            topScreen = getScreen('top'),
            rightScreen = getScreen('right'),
            bottomScreen = getScreen('bottom');

        this.getElementBySide('center').toggleClass('rb__center', false);
        this._mainDiv.find('>.rb__side').toggleClass('rb__hidden', true);

        self._elementsBySide = {};
        newScreen && prepareRelativeSide('center', newScreen);
        leftScreen && prepareRelativeSide('left', leftScreen);
        topScreen && prepareRelativeSide('top', topScreen);
        rightScreen && prepareRelativeSide('right', rightScreen);
        bottomScreen && prepareRelativeSide('bottom', bottomScreen);
    };
    ElementsPool.prototype.getElementBySide = function(side) {
        var id = this._elementsBySide[side];
        if (id) {
            return this._elements[id].element;
        } else {
            return $();
        }
    };
    ElementsPool.prototype.loadElements = function() {
        var self = this;

        Object.keys(this._elements).forEach(function(id) { // todo вынести forEach для объекта в utils
            var elem = self._elements[id];

            if (self._elementsBySide['center'] === id // todo стремная проверка, рефакторить
                || self._elementsBySide['left'] === id
                || self._elementsBySide['top'] === id
                || self._elementsBySide['right'] === id
                || self._elementsBySide['bottom'] === id) {
                if (elem.state === 'loading') {
                    elem.element.html(elem.screen.html());
                    elem.element.toggleClass('rb__loading', false);
                    elem.state = 'loaded';
                    self.elementLoadedDispatcher.runActions(undefined, [elem.screen, elem.element]);
                }
            } else {
                if (elem.screen.isTemporary()) {
                    var removingElem = self._elements[id];
                    if (!(self._saveHistoryInPool && self._screenManager._containsHistory(removingElem.screen))) {
                        removingElem.element.remove();
                        self.elementUnloadedDispatcher.runActions(undefined, [removingElem.screen, removingElem.element]);
                        delete self._elements[id];
                    }
                }
            }
        });
    };

    ElementsPool.prototype.destroy = function() {
        var self = this;
        Object.keys(this._elements).forEach(function(id) {
            var removingElem = self._elements[id];
            removingElem.element.remove();
            self.elementUnloadedDispatcher.runActions(undefined, [removingElem.screen, removingElem.element]);
        });
        this._elements = null;
        this._elementsBySide = null;
        this._screenManager = null;

        this.elementLoadedDispatcher.destroy();
        this.elementUnloadedDispatcher.destroy();
        this.elementLoadedDispatcher = null;
        this.elementUnloadedDispatcher = null;
    };

    return ElementsPool;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(3), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Utils, IControl, Errors) {
    "use strict";

    /**
     * @class
     * Класс управления панелью с помощью клавиш на клавиатуре.
     * @param {JQuery} mainDiv - элемент, в котором располагается панель. Должен содержать класс rb-wrapper.
     * @param {function} actionFn - функция, определяющая действие при переходе в одну из сторон (Moving.prototype._moveByActionValue)
     * @constructor KeydownControl
     * @extends IControl
     */
    function KeydownControl(mainDiv, actionFn) {
        if (!(mainDiv instanceof $)) {
            throw new Errors.ArgumentError('mainDiv', mainDiv);
        }

        if (typeof actionFn !== 'function') {
            throw new Errors.ArgumentError('actionFn', actionFn);
        }
        this._isEnable = false;
        this._mainDiv = mainDiv;
        this._actionFn = actionFn;
    }
    Utils.inherite(KeydownControl, IControl);
    /**
     * Применить конфигурацию. Учитывает опции leftKey, topKey, rightKey, bottomKey.
     * @param {Moving~config} config
     * @memberOf KeydownControl
     */
    KeydownControl.prototype.configure = function(config) {
        if (typeof config === 'object') {
            if (config.leftKey !== undefined) {
                this._leftKey = config.leftKey;
            }
            if (config.topKey !== undefined) {
                this._topKey = config.topKey;
            }
            if (config.rightKey !== undefined) {
                this._rightKey = config.rightKey;
            }
            if (config.bottomKey !== undefined) {
                this._bottomKey = config.bottomKey;
            }
        }
    };
    /**
     *
     * @returns {boolean}
     * @memberOf KeydownControl
     */
    KeydownControl.prototype.isEnable = function() {
        return this._isEnable;
    };
    /**
     *
     * @memberOf KeydownControl
     */
    KeydownControl.prototype.enable = function() {
        if (this._isEnable) return;

        var self = this;
        var baseHandler = function(e) {
            self._actionFn(e.which, [self._leftKey, self._topKey, self._rightKey, self._bottomKey], function(value, defValue) {
                return value === defValue;
            });
            self._actionFn(e.key, [self._leftKey, self._topKey, self._rightKey, self._bottomKey], function(value, defValue) {
                return value === defValue;
            });
            e.stopPropagation();
        };
        var mainDivHandler = function(e) {
            baseHandler(e);
        };

        this._mainDiv.on('keydown', mainDivHandler);
        this._mainDivHandler = mainDivHandler;

        this._isEnable = true;
    };
    /**
     *
     * @memberOf KeydownControl
     */
    KeydownControl.prototype.disable = function() {
        if (!this._isEnable) return;

        this._mainDiv.off('keydown', this._mainDivHandler);
        this._mainDivHandler = null;

        this._isEnable = false;
    };
    /**
     *
     * @memberOf KeydownControl
     */
    KeydownControl.prototype.destroy = function() {
        this.disable();
    };

    return KeydownControl;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Основной модуль, предоставляющий элементы для настройки и управления панелями<br>
 * Объявляется глобально и доступен через переменную <b>rb</b>
 * @module MainModule
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4), __webpack_require__(6), __webpack_require__(2), __webpack_require__(3), __webpack_require__(7)], __WEBPACK_AMD_DEFINE_RESULT__ = function(ScreenModel, RbManager, IPlugin, IControl) {
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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(2), __webpack_require__(4), __webpack_require__(8), __webpack_require__(15), __webpack_require__(5), __webpack_require__(10), __webpack_require__(16), __webpack_require__(9), __webpack_require__(12), __webpack_require__(11), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function(
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
         * Функциям в аргументы передается side, instance текущей панели и флаг isWrongStep - удачный переход или нет.
         * Если флаг равен null, то осуществляется moveBack.
         * Функция может вернуть флаг или Promise. Если флаг равен false или Promise возвращает false, то переход не будет осуществлен.
         * @name beforeMoveDispatcher
         * @memberOf Moving#
         */
        this.beforeMoveDispatcher = new BaseDispatcher(mainDiv);
        /**
         * Диспетчер, выполняющий зарегистрированные функции до рендеринга контента моделей на странице после перехода.
         * Функциям в аргументы передается side и instance текущей панели.
         * @name beforeRenderDispatcher
         * @memberOf Moving#
         */
        this.beforeRenderDispatcher = new BaseDispatcher(mainDiv);
        /**
         * Диспетчер, выполняющий зарегистрированные функции после рендеринга контента моделей на странице после перехода
         * Функциям в аргументы передается side и instance текущей панели.
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

        this.elementLoadedDispatcher = this._elementsPool.elementLoadedDispatcher;
        this.elementUnloadedDispatcher = this._elementsPool.elementUnloadedDispatcher;

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
                return screen.getChild(childIndex);
            },
            getLeft: function(screen) {
                var parentIndex = screen.defaultParentIndex();
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
     * Функция, задающая алгоритм поиска ячейки, в которую должен быть осуществлен переход влево, то есть в сторону предка.
     * По умолчанию берет опцию defaultParentIndex у экземпляра ScreenModel и ищет предка модели с этим индексом.
     * @param {ScreenModel} screen - текущая модель контента панели
     */
    /**
     * @typedef {function} Moving~getTop
     * Функция, задающая алгоритм поиска ячейки, в которую должен быть осуществлен переход вверх, то есть в сторону соседа сверху.
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
     * Функция, задающая алгоритм поиска ячейки, в которую должен быть осуществлен переход вправо, то есть в сторону потомка.
     * По умолчанию берет опцию defaultChildIndex у экземпляра ScreenModel и ищет потомка модели с этим индексом.
     * @param {ScreenModel} screen - текущая модель контента панели
     */
    /**
     * @typedef {function} Moving~getBottom
     * Функция, задающая алгоритм поиска ячейки, в которую должен быть осуществлен переход вниз, то есть в сторону соседа снизу.
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
        this.elementLoadedDispatcher.configure(config);
        this.elementUnloadedDispatcher.configure(config);

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
     * @param {Boolean} [isSaveHistory=true] - сохранять ли осуществляемый переход в историю переходов
     * @returns {Promise|undefined} promise о завершении действия, либо undefined, если переход не требуется
     * @memberOf Moving
     */
    Moving.prototype.move = function(side, isSaveHistory) {
        var self = this,
            screen = this._screenManager.getCurScreen();
        if (side) {
            var nextScreen = self._screenManager.getRelativeScreen(side),
                isWrongStep = !nextScreen;
            return Promise.race([ this.beforeMoveDispatcher.runActions(
                self._moveInner.bind(self, side, screen, isSaveHistory),
                [side, self, isWrongStep] // todo может расширить isWrongStep до енама со всеми вариантами которые могут быть
            ) ]);
        }
    };
    Moving.prototype._moveInner = function(side, screen, isSaveHistory) {
        var self = this;
        isSaveHistory = isSaveHistory !== false;

        if (this._lockControls && !this._locks) {
            this._locks = this._controlManager.disableAll();
        }

        this._screenManager._updateScreens('center', screen, isSaveHistory);

        return new Promise(function (moveResolve, moveReject) {

            var nextScreen = self._screenManager.getRelativeScreen(side),
                curScreen = self._screenManager.getCurScreen();

            if (!nextScreen) {
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
                self.getScreenManager()._setRelativeScreen(side, nextScreen, curScreen, true, true);

                self._screenManager._updateScreens(side, undefined, isSaveHistory);
                if (isSaveHistory) {
                    if (side === 'left' || side === 'right') {
                        self._screenManager._lastSide = side; // todo надо инкапсулировать
                        self._screenManager._lastScreen = curScreen;
                    }
                }

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
            if (side === 'left' && curScreen.getParent(nextScreen)) {
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
                this.getScreenManager()._setRelativeScreen(side, curScreen, nextScreen);
            }

            var self = this;
            if (side) {
                return Promise.race([ this.beforeMoveDispatcher.runActions(
                    self._moveInner.bind(self, lastStep.side, curScreen, false),
                    [side, self, null]
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
        // var self = this;
        return this._moveInner('center', screen, isSaveHistory);
        // return Promise.race([ this.beforeMoveDispatcher.runActions( // todo как то beforeMoveDispatcher тут не в тему совсем
        //     self._moveInner.bind(self, 'center', screen, isSaveHistory),
        //     ['center', self, false]
        // ) ]);
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
            args = [side, self];

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

            if (curScreen.getChild(nextScreen)) { // todo почему сначала смотрю на потомков а потом на предков? раньше было наоборот и падало, но от того что я их поменял логика лучше не стала
                side = 'right';
            } else if (curScreen.getParent(nextScreen)) {
                side = 'left';
            } else if (self._screenManager._getBottom(curScreen, self._screenManager._cyclicStep) === nextScreen) {
                side = 'bottom';
            } else if (self._screenManager._getTop(curScreen, self._screenManager._cyclicStep) === nextScreen) {
                side = 'top';
            } else {
                self._controlManager.enableByValues(locks);
                reject(new Errors.FatalError('goToScreen : side not found'));
            }

            self.getScreenManager()._setRelativeScreen(side, curScreen, nextScreen, true);

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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(4), __webpack_require__(2), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Utils, Screen, IPlugin, Errors) {
    "use strict";

    /**
     * @class
     * Класс-менеджер моделей контента
     * @constructor ScreenManager
     * @extends IPlugin
     */
    function ScreenManager() {
        this._history = [];
        this._curScreen = null;
        this._relativeUpdateFn = this._updateRelativeScreen.bind(this);
        Screen.registerUpdateFn(this._relativeUpdateFn);
    }
    Utils.inherite(ScreenManager, IPlugin);
    /**
     * Применить конфигурацию к панели. Учитывает опции maxHistoryLength, isDirectPath, cyclicStep, getLeft, getTop, getRight, getBottom.
     * @param {Moving~config} config - конфигурация
     * @memberOf ScreenManager
     */
    ScreenManager.prototype.configure = function(config) {
        if (typeof config === 'object') {
            if (config.maxHistoryLength !== undefined) {
                if (typeof config.maxHistoryLength === 'number' && config.maxHistoryLength >= 0) {
                    this._maxHistoryLength = config.maxHistoryLength;
                    if (this._history.length > this._maxHistoryLength) {
                        this._history = this._history.slice(this._history.length - this._maxHistoryLength);
                    }
                } else {
                    throw new Errors.ArgumentError('maxHistoryLength', config.maxHistoryLength);
                }
            }
            if (config.isDirectPath !== undefined) {
                this._isDirectPath = config.isDirectPath;
            }
            if (config.cyclicStep !== undefined) {
                this._cyclicStep = config.cyclicStep;
            }
            if (config.getLeft !== undefined) {
                this._getLeft = config.getLeft;
            }
            if (config.getRight !== undefined) {
                this._getRight = config.getRight;
            }
            if (config.getTop !== undefined) {
                this._getTop = config.getTop;
            }
            if (config.getBottom !== undefined) {
                this._getBottom = config.getBottom;
            }
            if (config.savePrevious !== undefined) {
                this._savePrevious = config.savePrevious;
            }

        }
    };

    ScreenManager.prototype._updateScreens = function(side, screen, isSaveHistory) {
        var updated = false;
        if (screen) {
            if (this._curScreen !== screen) {
                updated = true;
            }
            this._curScreen = screen;
        } else if (this.getRelativeScreen(side)) {
            var prevScreen = this._curScreen;
            this._curScreen = this.getRelativeScreen(side);

            if (side !== 'center') {
                updated = true;
            }
        }

        if (updated && isSaveHistory !== false) {
            this._history.push({
                screen: prevScreen,
                side: Utils.oppositeSide(side),
                lastSide: this._lastSide,
                lastScreen: this._lastScreen
            });
            if (this._history.length > this._maxHistoryLength) {
                this._history.shift();
            }
        }

        return this._curScreen;
    };

    ScreenManager.prototype._getRelativeScreenByScreen = function(screen, side) {
        if (!(screen instanceof Screen)) {
            throw new Errors.ArgumentError('screen', screen);
        }
        if (Utils.sidesWithCenter.indexOf(side) === -1) {
            throw new Errors.ArgumentError('side', side);
        }

        if (side === 'center') {
            return screen;
        } else if (side === 'left') {
            return this._getLeft(screen);
        } else if (side === 'top') {
            return this._getTop(screen, this._cyclicStep);
        } else if (side === 'right') {
            return this._getRight(screen);
        } else if (side === 'bottom') {
            return this._getBottom(screen, this._cyclicStep);
        }
        return null;
    };
    ScreenManager.prototype._setRelativeScreen = function(side, baseScreen, targetScreen, isCheckSave, reverse) {
        if (!(targetScreen instanceof Screen)) {
            throw new Errors.ArgumentError('targetScreen', targetScreen);
        }
        if (!(baseScreen instanceof Screen)) {
            throw new Errors.ArgumentError('baseScreen', baseScreen);
        }

        var savePrevious = isCheckSave ? this._savePrevious : true;

        if (side === (reverse ? 'left' : 'right') && savePrevious) {
            var childIndex = baseScreen.getChildIndex(targetScreen);
            if (childIndex !== -1) {
                baseScreen.defaultChildIndex(childIndex);
            } else {
                throw new Errors.FatalError('Base screen is ' + baseScreen.toString() + '. Child screen not found: ', targetScreen.toString());
            }
        }
        if (side === (reverse ? 'right' : 'left') && savePrevious) {
            var parentIndex = baseScreen.getParentIndex(targetScreen);
            if (parentIndex !== -1) {
                baseScreen.defaultParentIndex(parentIndex);
            } else {
                throw new Errors.FatalError('Base screen is ' + baseScreen.toString() + '. Parent screen not found: ', targetScreen.toString());
            }
        }
    };
    ScreenManager.prototype._updateRelativeScreen = function(screen) {
        if (!(screen instanceof Screen)) {
            throw new Errors.ArgumentError('screen', screen);
        }

        if (!this._getRight(screen)) {
            screen.defaultChildIndex(0);
        }
        if (!this._getLeft(screen)) {
            screen.defaultParentIndex(0);
        }
    };

    /**
     * Возвращает модель текущей ячейки панели.
     * @returns {ScreenModel|null} модель текущей ячейки панели
     * @memberOf ScreenManager
     */
    ScreenManager.prototype.getCurScreen = function() {
        return this._curScreen;
    };
    /**
     * Возвращает модель, располагающуюся рядом с текущей ячейкой панели.
     * @param {string} side - сторона относительно текущей ячейки
     * @returns {ScreenModel|null} модель текущей ячейки панели
     * @memberOf ScreenManager
     */
    ScreenManager.prototype.getRelativeScreen = function(side) {
        return this._getRelativeScreenByScreen(this._curScreen, side);
    };
    /**
     * Очистить историю перемещений в панели.
     * @memberOf ScreenManager
     */
    ScreenManager.prototype.clearHistory = function() {
        this._history = [];
    };
    /**
     * Удаляет из истории перемещений последнее удачное перемещение в панели и возвращает модель, которая располагается в последней посещенной ячейке из истории.
     * @returns {ScreenModel} Модель из последнего удачного перемещения в истории
     * @memberOf ScreenManager
     */
    ScreenManager.prototype.popHistory = function() {
        var res = this._history.pop();
        if (res) {
            this._lastSide = res.lastSide;
            this._lastScreen = res.lastScreen;
        } else {
            this._lastSide = null;
            this._lastScreen = null;
        }
        return res;
    };
    ScreenManager.prototype._containsHistory = function(screen) {
        return this._history.some(function(val) {
            return val.screen === screen;
        });
    };

    /**
     * Поиск кратчайшего пути от одной модели до другой. Если для разных ячеек панели используются одинаковые модели, результат непредсказуем.
     * @param {ScreenModel} start - Модель, от которой начинает поиск пути
     * @param {ScreenModel} end - Конечная модель, в которую ищется путь
     * @returns {null|ScreenModel[]} Путь от начальной модели до конечной модели в панели
     * @memberOf ScreenManager
     */
    ScreenManager.prototype.findShortestPath = function (start, end) {
        function findPaths(start, end) {
            var costs = {},
                open = {'0': [start]},
                predecessors = {},
                keys;

            var addToOpen = function (cost, vertex) {
                if (!open[cost]) open[cost] = [];
                open[cost].push(vertex);
            };

            costs[start] = 0;

            while (open) {
                if(!(keys = Object.keys(open)).length) break;

                keys.sort(function (a, b) {
                    return a - b;
                });

                var key = keys[0],
                    bucket = open[key],
                    node = bucket.shift(),
                    currentCost = +key,
                    adjacentNodes;

                if (self._isDirectPath) {
                    adjacentNodes = node && node._children
                            .concat(node._parents)// todo если оставить только children будет настоящий поиск в графе
                            .concat(self._getRelativeScreenByScreen(node, 'top'))
                            .concat(self._getRelativeScreenByScreen(node, 'bottom')) || [];
                } else {
                    adjacentNodes = node && [self._getRelativeScreenByScreen(node, 'left'),
                            self._getRelativeScreenByScreen(node, 'top'),
                            self._getRelativeScreenByScreen(node, 'right'),
                            self._getRelativeScreenByScreen(node, 'bottom')
                        ] || [];
                }

                if (!bucket.length) delete open[key];

                for (var i = 0; i < adjacentNodes.length; i++) {
                    var vertex = adjacentNodes[i],
                        totalCost = currentCost + 1,
                        vertexCost = costs[vertex];

                    if ((vertexCost === undefined) || (vertexCost > totalCost)) {
                        costs[vertex] = totalCost;
                        addToOpen(totalCost, vertex);
                        predecessors[vertex] = node;
                    }
                }
            }

            if (costs[end] === undefined) {
                return null;
            } else {
                return predecessors;
            }
        }
        function extractShortest(predecessors, end) {
            var nodes = [],
                u = end;

            while (u) {
                nodes.push(u);
                u = predecessors[u];
            }

            nodes.reverse();
            return nodes;
        }

        var self = this;
        var predecessors = findPaths(start, end);
        return !predecessors ? null : extractShortest(predecessors, end);
    };

    /**
     * Уничтожить ScreenManager
     * @memberOf ScreenManager
     */
    ScreenManager.prototype.destroy = function() {
        Screen.unregisterUpdateFn(this._relativeUpdateFn);
        this._history = null;
        this._curScreen = null;
    };

    return ScreenManager;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(3), __webpack_require__(0), __webpack_require__(17)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Utils, IControl, Errors, Hammer) {
    "use strict";

    /**
     * @class
     * Класс управления панелью на мобильных устройствах с помощью свайпов.
     * @param {JQuery} mainDiv - элемент, в котором располагается панель. Должен содержать класс rb-wrapper.
     * @param {function} actionFn - функция, определяющая действие при переходе в одну из сторон (Moving.prototype._moveByActionValue)
     * @constructor SwipesControl
     * @extends IControl
     */
    function SwipesControl(mainDiv, actionFn) {
        if (!(mainDiv instanceof $)) {
            throw new Errors.ArgumentError('mainDiv', mainDiv);
        }

        if (typeof actionFn !== 'function') {
            throw new Errors.ArgumentError('actionFn', actionFn);
        }
        this._isEnable = false;
        this._mainDiv = mainDiv;
        this._actionFn = actionFn;

        this._hammertime = new Hammer(mainDiv[0]);
        this._hammertime.get('swipe').set({direction: Hammer.DIRECTION_ALL});
    }
    Utils.inherite(SwipesControl, IControl);
    /**
     * Применить конфигурацию. Учитывает опцию pointersForSwipe.
     * @param {Moving~config} config
     * @memberOf SwipesControl
     */
    SwipesControl.prototype.configure = function(config) {
        if (typeof config === 'object') {
            if (config.pointersForSwipe !== undefined) {
                this._hammertime.get('swipe').set({pointers: config.pointersForSwipe});
            }
        }
    };
    /**
     *
     * @returns {boolean}
     * @memberOf SwipesControl
     */
    SwipesControl.prototype.isEnable = function() {
        return this._isEnable;
    };
    /**
     *
     * @memberOf SwipesControl
     */
    SwipesControl.prototype.enable = function() {
        if (this._isEnable) return;

        function swipeHandler(e) {
            if (self._mainDiv.is(e.target.closest('.rb'))) {
                self._actionFn(e.direction, [Hammer.DIRECTION_RIGHT, Hammer.DIRECTION_DOWN, Hammer.DIRECTION_LEFT, Hammer.DIRECTION_UP], function(val, defVal) {
                    return val === defVal;
                });
            }
            e.preventDefault();
            e.srcEvent.stopPropagation();
        }

        var self = this;
        this._hammertime.on('swipe', swipeHandler);
        this._swipeHandler = swipeHandler;

        this._isEnable = true;
    };
    /**
     *
     * @memberOf SwipesControl
     */
    SwipesControl.prototype.disable = function() {
        if (!this._isEnable) return;

        this._hammertime.off('swipe', this._swipeHandler);
        this._swipeHandler = null;

        this._isEnable = false;
    };
    /**
     *
     * @memberOf SwipesControl
     */
    SwipesControl.prototype.destroy = function() {
        this.disable();
    };

    return SwipesControl;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.8 - 2016-04-23
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.8';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined) {
            return;
        }
        if (handler === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
        return Hammer;
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');


/***/ }),
/* 18 */
/***/ (function(module, exports) {

if (typeof jQuery !== 'undefined') {
	init();
} else {
    function getXHR() {
        var xmlHttp;
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
            } catch (E) {
                xmlHttp = false;
            }
        }

        if (!xmlHttp && typeof XMLHttpRequest != 'undefined') {
            xmlHttp = new XMLHttpRequest();
        }

        return xmlHttp;
    }
    var xhr = getXHR();
    xhr.open('GET', 'https://code.jquery.com/jquery-3.1.1.min.js', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status != 200) {
                console.error( 'jQuery loading error: status ' + xhr.status + ': ' + xhr.statusText );
            } else {
                eval( xhr.responseText );
                eval( xhr.responseText ); // todo если выполнить только один раз, почему-то не работает
				init();
            }
        }
    };
    xhr.send(null);
}

function init() {
	/*
	 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
	 *
	 * Uses the built in easing capabilities added In jQuery 1.1
	 * to offer multiple easing options
	 *
	 * TERMS OF USE - jQuery Easing
	 *
	 * Open source under the BSD License.
	 *
	 * Copyright © 2008 George McGinley Smith
	 * All rights reserved.
	 *
	 * Redistribution and use in source and binary forms, with or without modification,
	 * are permitted provided that the following conditions are met:
	 *
	 * Redistributions of source code must retain the above copyright notice, this list of
	 * conditions and the following disclaimer.
	 * Redistributions in binary form must reproduce the above copyright notice, this list
	 * of conditions and the following disclaimer in the documentation and/or other materials
	 * provided with the distribution.
	 *
	 * Neither the name of the author nor the names of contributors may be used to endorse
	 * or promote products derived from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
	 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
	 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
	 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
	 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
	 * OF THE POSSIBILITY OF SUCH DAMAGE.
	 *
	 */
    // t: current time, b: begInnIng value, c: change In value, d: duration
    jQuery.easing['jswing'] = jQuery.easing['swing'];

	//http://easings.net/
	jQuery && jQuery.extend( jQuery.easing,
	{
		def: 'easeOutQuad',
		swing: function (x, t, b, c, d) {
			//alert(jQuery.easing.default);
			return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
		},
		easeInQuad: function (x, t, b, c, d) {
			return c*(t/=d)*t + b;
		},
		easeOutQuad: function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		},
		easeInOutQuad: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},
		easeInCubic: function (x, t, b, c, d) {
			return c*(t/=d)*t*t + b;
		},
		easeOutCubic: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t + 1) + b;
		},
		easeInOutCubic: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		},
		easeInQuart: function (x, t, b, c, d) {
			return c*(t/=d)*t*t*t + b;
		},
		easeOutQuart: function (x, t, b, c, d) {
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		easeInOutQuart: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		},
		easeInQuint: function (x, t, b, c, d) {
			return c*(t/=d)*t*t*t*t + b;
		},
		easeOutQuint: function (x, t, b, c, d) {
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		},
		easeInOutQuint: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		},
		easeInSine: function (x, t, b, c, d) {
			return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		},
		easeOutSine: function (x, t, b, c, d) {
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		},
		easeInOutSine: function (x, t, b, c, d) {
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		},
		easeInExpo: function (x, t, b, c, d) {
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
		},
		easeOutExpo: function (x, t, b, c, d) {
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		},
		easeInOutExpo: function (x, t, b, c, d) {
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},
		easeInCirc: function (x, t, b, c, d) {
			return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		},
		easeOutCirc: function (x, t, b, c, d) {
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		},
		easeInOutCirc: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		},
		easeInElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},
		easeOutElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		},
		easeInOutElastic: function (x, t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
		},
		easeInBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},
		easeOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		},
		easeInOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		},
		easeInBounce: function (x, t, b, c, d) {
			return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
		},
		easeOutBounce: function (x, t, b, c, d) {
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		},
		easeInOutBounce: function (x, t, b, c, d) {
			if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
			return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
		}
	});

	/*
	 *
	 * TERMS OF USE - EASING EQUATIONS
	 *
	 * Open source under the BSD License.
	 *
	 * Copyright © 2001 Robert Penner
	 * All rights reserved.
	 *
	 * Redistribution and use in source and binary forms, with or without modification,
	 * are permitted provided that the following conditions are met:
	 *
	 * Redistributions of source code must retain the above copyright notice, this list of
	 * conditions and the following disclaimer.
	 * Redistributions in binary form must reproduce the above copyright notice, this list
	 * of conditions and the following disclaimer in the documentation and/or other materials
	 * provided with the distribution.
	 *
	 * Neither the name of the author nor the names of contributors may be used to endorse
	 * or promote products derived from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
	 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
	 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
	 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
	 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
	 * OF THE POSSIBILITY OF SUCH DAMAGE.
	 *
	 */


}

/***/ })
/******/ ]);
//# sourceMappingURL=rb.js.map